/**
 * CampusSync shared store + automation engine.
 *
 * Student app and Admin app are separate folders, but they talk to the SAME data
 * through this module. Data lives in localStorage (and syncs across browser tabs),
 * so what the admin does is instantly visible to the student.
 *
 * When you add a real backend (Node/Express + DB), replace `load()`, `persist()`
 * and the `actions` below with API calls. The UI will not need to change much.
 */
import { useSyncExternalStore } from 'react';
import { api } from './api';
const STORAGE_KEY = 'campussync:db:v1';
const HOUR = 3600 * 1000;
const DAY = 24 * HOUR;

export const CURRENT_STUDENT_ROLL = '23CS1089';
const SERVER_MANAGES_APPLICATIONS = true;
/* ------------------------------ helpers ------------------------------ */
const uid = (prefix) => `${prefix}-${Math.floor(100000 + Math.random() * 900000)}`;

export const fmtDate = (ms) =>
  new Date(ms).toLocaleDateString('en-US', { month: 'short', day: '2-digit', year: 'numeric' });

export const fmtDateTime = (ms) =>
  new Date(ms).toLocaleString('en-US', { month: 'short', day: '2-digit', hour: 'numeric', minute: '2-digit' });

const isoDay = (ms) => new Date(ms).toISOString().slice(0, 10);

const deadlinePassed = (iso, now) => Date.parse(`${iso}T23:59:59`) < now;

const slotLabel = (now, dayOffset, time) => {
  const d = new Date(now + dayOffset * DAY);
  const name =
    dayOffset === 0 ? 'Today' : dayOffset === 1 ? 'Tomorrow' : d.toLocaleDateString('en-US', { weekday: 'short' });
  return `${name}, ${d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })} • ${time}`;
};

const SLOT_TIMES = [
  '3:40 PM - 4:00 PM',
  '4:20 PM - 4:40 PM',
  '11:00 AM - 11:20 AM',
  '2:30 PM - 2:50 PM',
];


/* ------------------------------ empty initial data ------------------------------ */
function createEmptyState() {
  return {
    version: 1,

    settings: {
      autoScreening: true,
      autoSlot: true,
      autoSelect: true,
      autoPayment: true,
      autoEscalation: true,
      autoCloseHiring: true,
      slaHours: 48,
      selectionThreshold: 7,
      cohortSize: 50,
      weightAssessment: 60,
      weightInterview: 40,
    },

    students: [],
    committees: [],
    slots: [],
    applications: [],
    events: [],
    payments: [],
    passes: [],
    grievances: [],
    candidates: [],
    notifications: [],
    activity: [],
  };
}

/* ------------------------------ persistence ------------------------------ */

function load() {
  const MIGRATION_KEY = 'campussync:demo-data-migration:v1';
  const BACKUP_KEY = 'campussync:db:v1:backup-before-api';

  try {
    const raw = localStorage.getItem(STORAGE_KEY);

    // Run the demo-data cleanup only once.
    if (localStorage.getItem(MIGRATION_KEY) !== 'done') {
      if (raw && !localStorage.getItem(BACKUP_KEY)) {
        localStorage.setItem(BACKUP_KEY, raw);
      }

      const empty = createEmptyState();

      localStorage.setItem(STORAGE_KEY, JSON.stringify(empty));
      localStorage.setItem(MIGRATION_KEY, 'done');

      return empty;
    }

    if (raw) {
      const parsed = JSON.parse(raw);

      if (parsed && parsed.version === 1) {
        return {
          ...createEmptyState(),
          ...parsed,
          settings: {
            ...createEmptyState().settings,
            ...(parsed.settings || {}),
          },
        };
      }
    }
  } catch (error) {
    console.error('CampusSync local store initialization failed:', error);
  }

  return createEmptyState();
}


let db; // initialised at the bottom of this file (needs helpers defined first)
const listeners = new Set();

function persist() {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(db));
  } catch {
    /* ignore */
  }
}

function emit() {
  listeners.forEach((l) => l());
}

// Other browser tab (e.g. admin in one tab, student in another) changed the data
if (typeof window !== 'undefined') {
  window.addEventListener('storage', (e) => {
    if (e.key === STORAGE_KEY && e.newValue) {
      try {
        db = JSON.parse(e.newValue);
        emit();
      } catch {
        /* ignore */
      }
    }
  });
}

const subscribe = (cb) => {
  listeners.add(cb);
  return () => listeners.delete(cb);
};
const getSnapshot = () => db;

export const useDB = () => useSyncExternalStore(subscribe, getSnapshot);

/** Run a change on a copy of the data, run automation, save, notify the UI. */
function mutate(fn) {
  const next = structuredClone(db);
  const result = fn(next);
  runAutomation(next);
  next.activity = next.activity.slice(0, 150);
  next.notifications = next.notifications.slice(0, 150);
  db = next;
  persist();
  emit();
  return result;
}

/* ------------------------------ logging ------------------------------ */
const log = (d, by, type, text) => {
  d.activity.unshift({ id: uid('LOG'), ts: Date.now(), by, type, text });
};

const notify = () => {};

/* ------------------------------ automation engine ------------------------------ */
const findStudent = (d, roll) => d.students.find((s) => s.rollNo === roll);
const findCommittee = (d, id) => d.committees.find((c) => c.id === id);

const slotUsage = (d, slotId) =>
  d.applications.filter((a) => a.slotId === slotId && a.status !== 'Rejected').length;

const nextFreeSlot = (d, rollNo) =>
  d.slots.find(
    (s) =>
      slotUsage(d, s.id) < s.capacity &&
      !d.applications.some((a) => a.rollNo === rollNo && a.slotId === s.id && a.status !== 'Rejected'),
  );

function screenApplication(d, a, by) {
  const c = findCommittee(d, a.committeeId);
  const st = findStudent(d, a.rollNo);
  const reasons = [];
  if (!c || !st) {
    reasons.push('Record not found');
  } else {
    if (st.cgpa < c.minCgpa) reasons.push(`CGPA ${st.cgpa} is below the minimum ${c.minCgpa}`);
    const req = c.requiredBranch || 'All Branches';
    if (req === 'Hostel Residents Only') {
      if (!st.hostel) reasons.push('Committee is for hostel residents only');
    } else if (req !== 'All Branches' && !st.branch.toLowerCase().includes(req.toLowerCase())) {
      reasons.push(`Open to ${req} only`);
    }
  }
  if (reasons.length) {
    a.status = 'Rejected';
    a.remark = reasons.join('; ');
    a.decidedBy = by;
    notify(d, a.rollNo, `Auto-screening failed for ${c?.name}: ${a.remark}.`, 'bad');
    log(d, by, 'screening', `${st?.name} rejected for ${c?.name} (${a.remark})`);
  } else {
    a.status = 'Shortlisted';
    a.remark = '';
    a.decidedBy = by;
    notify(d, a.rollNo, `You are shortlisted for ${c.name}! Pick an interview slot.`, 'good');
    log(d, by, 'screening', `${st.name} shortlisted for ${c.name} (CGPA ${st.cgpa} ≥ ${c.minCgpa})`);
  }
}

function assignSlot(d, a, slot, by) {
  const c = findCommittee(d, a.committeeId);
  const st = findStudent(d, a.rollNo);
  a.slotId = slot.id;
  a.status = 'Slot Booked';
  notify(d, a.rollNo, `Interview for ${c?.name} booked: ${slot.label}.`, 'good');
  log(d, by, 'slot', `${st?.name} → ${slot.label} (${c?.name})`);
}

function decideSelection(d, a, selected, by, reason = '') {
  const c = findCommittee(d, a.committeeId);
  const st = findStudent(d, a.rollNo);
  if (selected && c && c.vacancies > 0) {
    a.status = 'Selected';
    a.decidedBy = by;
    c.vacancies -= 1;
    notify(d, a.rollNo, `Congratulations! You are selected for ${c.name} as ${c.role}.`, 'good');
    log(d, by, 'selection', `${st?.name} selected for ${c.name} (vacancies left: ${c.vacancies})`);
  } else {
    a.status = 'Rejected';
    a.decidedBy = by;
    a.remark = reason || (selected ? 'No vacancies left' : `Interview score below ${d.settings.selectionThreshold}`);
    notify(d, a.rollNo, `Update on ${c?.name}: not selected (${a.remark}).`, 'bad');
    log(d, by, 'selection', `${st?.name} not selected for ${c?.name} (${a.remark})`);
  }
}

function issuePass(d, p, by) {
  const ev = d.events.find((e) => e.id === p.eventId);
  p.status = 'Verified';
  p.by = by;
  d.passes.unshift({
    id: `PASS-${Math.floor(1000 + Math.random() * 9000)}`,
    eventId: p.eventId,
    eventTitle: ev?.title || 'Event',
    passId: `TKT-${Math.floor(100000 + Math.random() * 900000)}`,
    userName: p.name,
    rollNo: p.rollNo,
    price: `₹${p.amount}${ev?.priceUnit || ''}`,
  });
  notify(d, p.rollNo, `Payment of ₹${p.amount} verified. Your pass for ${ev?.title} is ready.`, 'good');
  log(d, by, 'payment', `₹${p.amount} verified for ${p.name} → pass issued (${ev?.title})`);
}

/**
 * Runs every enabled automation rule. Safe to call any number of times (idempotent).
 * Returns the number of automatic actions it performed.
 */
export function runAutomation(d, now = Date.now()) {
  const s = d.settings;
  let count = 0;

  // 1. Close hiring on deadline / when no vacancies are left
  if (s.autoCloseHiring) {
    d.committees.forEach((c) => {
      if (c.hiringOpen && (c.vacancies <= 0 || deadlinePassed(c.deadline, now))) {
        c.hiringOpen = false;
        log(d, 'AUTO', 'hiring', `Hiring closed for ${c.name} (${c.vacancies <= 0 ? 'no vacancies' : 'deadline passed'})`);
        count++;
      }
    });
  }

  // 2. Screening
   if (s.autoScreening && !SERVER_MANAGES_APPLICATIONS)  {
    d.applications.forEach((a) => {
      if (a.status === 'Applied') {
        screenApplication(d, a, 'AUTO');
        count++;
      }
    });
  }

  // 3. Interview slot allocation
  if (s.autoSlot && !SERVER_MANAGES_APPLICATIONS) {
    d.applications.forEach((a) => {
      if (a.status === 'Shortlisted' && !a.slotId) {
        const slot = nextFreeSlot(d, a.rollNo);
        if (slot) {
          assignSlot(d, a, slot, 'AUTO');
          count++;
        }
      }
    });
  }

  // 4. Final selection from interview score
  if (s.autoSelect && !SERVER_MANAGES_APPLICATIONS) {
    d.applications.forEach((a) => {
      if (a.status === 'Slot Booked' && a.interviewScore !== null && a.interviewScore !== undefined) {
        decideSelection(d, a, Number(a.interviewScore) >= s.selectionThreshold, 'AUTO');
        count++;
      }
    });
  }

  // 5. Payments → pass
  if (s.autoPayment && !SERVER_MANAGES_APPLICATIONS) {
    d.payments.forEach((p) => {
      if (p.status === 'Pending') {
        issuePass(d, p, 'AUTO');
        count++;
      }
    });
  }

    // 6. Grievance SLA escalation
  if (s.autoEscalation && !SERVER_MANAGES_APPLICATIONS) {
    d.grievances.forEach((g) => {
      if (g.status === 'In Progress' && now - g.createdAtMs >= g.slaHours * HOUR) {
        g.status = 'Escalated';
        notify(d, g.rollNo, `${g.id} crossed its ${g.slaHours}h SLA and was escalated to the Chief Warden.`, 'warn');
        notify(d, 'ADMIN', `${g.id} auto-escalated: ${g.title}`, 'warn');
        log(d, 'AUTO', 'grievance', `${g.id} auto-escalated after ${g.slaHours}h SLA`);
        count++;
      }
    });
  }

  return count;
}

/* ------------------------------ actions ------------------------------ */
export const actions = {
  /** Called on an interval by both apps. Only writes if something changed. */
  tick() {
    const next = structuredClone(db);
    const n = runAutomation(next);
    if (n > 0) {
      db = next;
      persist();
      emit();
    }
    return n;
  },

  /* ---- student ---- */
  applyToCommittee(committeeId, rollNo) {
    return mutate((d) => {
      const c = findCommittee(d, committeeId);
      const st = findStudent(d, rollNo);
      if (!c || !st) return { ok: false, error: 'Committee or student not found' };
      if (!c.hiringOpen || c.vacancies <= 0) return { ok: false, error: 'Hiring is closed for this committee' };
      d.applications = d.applications.filter((a) => !(a.committeeId === committeeId && a.rollNo === rollNo));
      const app = {
        id: uid('APP'), committeeId, rollNo, appliedOn: Date.now(), status: 'Applied',
        slotId: null, interviewScore: null, remark: '', decidedBy: null,
      };
      d.applications.unshift(app);
      notify(d, 'ADMIN', `${st.name} applied to ${c.name}`, 'info');
      log(d, 'STUDENT', 'application', `${st.name} applied to ${c.name}`);
      return { ok: true, id: app.id };
    });
  },

  bookSlot(appId, slotId) {
    return mutate((d) => {
      const a = d.applications.find((x) => x.id === appId);
      const slot = d.slots.find((x) => x.id === slotId);
      if (!a || !slot) return { ok: false, error: 'Not found' };
      const taken = d.applications.filter((x) => x.slotId === slotId && x.status !== 'Rejected' && x.id !== appId).length;
      if (taken >= slot.capacity) return { ok: false, error: 'Slot just got taken, pick another' };
      assignSlot(d, a, slot, 'STUDENT');
      return { ok: true };
    });
  },

  submitPayment(eventId, rollNo) {
    return mutate((d) => {
      const ev = d.events.find((e) => e.id === eventId);
      const st = findStudent(d, rollNo);
      if (!ev || !st) return { ok: false, error: 'Event not found' };
      if (ev.seatsLeft <= 0) return { ok: false, error: 'Sold out' };
      if (
        d.passes.some((p) => p.eventId === eventId && p.rollNo === rollNo) ||
        d.payments.some((p) => p.eventId === eventId && p.rollNo === rollNo && p.status === 'Pending')
      ) {
        return { ok: false, error: 'You already have a pass (or a pending payment) for this event' };
      }
      ev.seatsLeft -= 1;
      const pay = {
        id: uid('PAY'), eventId, rollNo, name: st.name, amount: ev.price,
        status: 'Pending', createdAt: Date.now(), by: null,
      };
      d.payments.unshift(pay);
      notify(d, 'ADMIN', `New payment ₹${ev.price} from ${st.name} for ${ev.title}`, 'info');
      log(d, 'STUDENT', 'payment', `${st.name} paid ₹${ev.price} for ${ev.title}`);
      return { ok: true, id: pay.id };
    });
  },

  raiseGrievance({ rollNo, committee, title, description }) {
    return mutate((d) => {
      const g = {
        id: `TKT-${Math.floor(1100 + Math.random() * 8900)}`, rollNo, committee, title, description,
        createdAtMs: Date.now(), slaHours: d.settings.slaHours, status: 'In Progress', response: '',
      };
      d.grievances.unshift(g);
      notify(d, 'ADMIN', `New grievance ${g.id}: ${title}`, 'warn');
      log(d, 'STUDENT', 'grievance', `${g.id} raised for ${committee}`);
      return { ok: true, id: g.id, slaHours: g.slaHours };
    });
  },

  markRead(audience) {
    mutate((d) => {
      d.notifications.forEach((n) => {
        if (n.to === audience) n.read = true;
      });
          
    });
        api('/notifications/read', { method: 'PATCH' }).catch(console.error);
  },

  /* ---- admin: committees ---- */
  saveCommittee(c) {
    mutate((d) => {
      const i = d.committees.findIndex((x) => x.id === c.id);
      const clean = {
        ...c,
        minCgpa: Number(c.minCgpa),
        vacancies: Number(c.vacancies),
        hiringOpen: c.hiringOpen !== false,
      };
      if (i >= 0) d.committees[i] = clean;
      else d.committees.push(clean);
      log(d, 'ADMIN', 'committee', `${i >= 0 ? 'Updated' : 'Created'} committee ${c.name}`);
    });
  },
    setCommittees(list) {
    mutate((d) => { d.committees = list; });
  },
    setApplicationsFromServer(applications, students) {
    mutate((d) => {
      d.applications = applications;
      d.students = students;
    });
  },
    setSlots(slots) {
    mutate((d) => { d.slots = slots; });
  },
    setSettings(settings) {
    mutate((d) => { d.settings = { ...d.settings, ...settings }; });
  },
  setEventData(events, payments, registrations) {
    mutate((d) => {
      d.events = events;
      d.payments = payments;
      d.passes = registrations.map((r) => {
        const ev = events.find((e) => e.id === r.eventId);
        return {
          id: r.id,
          eventId: r.eventId,
          eventTitle: ev?.title || 'Event',
          passId: r.registrationCode,
          userName: r.name,
          rollNo: r.rollNo,
          price: ev ? `₹${ev.price}${ev.priceUnit || ''}` : '',
        };
      });
    });
  },
    setGrievances(list) {
    mutate((d) => { d.grievances = list; });
  },
    setCandidates(list) {
    mutate((d) => { d.candidates = list; });
  },
    setNotifications(list) {
    mutate((d) => { d.notifications = list; });
  },
  deleteCommittee(id) {
    mutate((d) => {
      const c = findCommittee(d, id);
      d.committees = d.committees.filter((x) => x.id !== id);
      d.applications = d.applications.filter((a) => a.committeeId !== id);
      log(d, 'ADMIN', 'committee', `Deleted committee ${c?.name}`);
    });
  },
  toggleHiring(id) {
    mutate((d) => {
      const c = findCommittee(d, id);
      if (!c) return;
      c.hiringOpen = !c.hiringOpen;
      log(d, 'ADMIN', 'hiring', `Hiring ${c.hiringOpen ? 'opened' : 'closed'} for ${c.name}`);
    });
  },

  /* ---- admin: applications ---- */
  setApplicationStatus(appId, status, remark = '') {
    mutate((d) => {
      const a = d.applications.find((x) => x.id === appId);
      if (!a) return;
      const c = findCommittee(d, a.committeeId);
      const st = findStudent(d, a.rollNo);
      const prev = a.status;
      if (prev === 'Selected' && status !== 'Selected' && c) c.vacancies += 1;
      if (status === 'Selected') {
        if (prev !== 'Selected') decideSelection(d, a, true, 'ADMIN');
        return;
      }
      if (status === 'Rejected') {
        a.status = 'Rejected';
        a.remark = remark || 'Rejected by admin';
        a.decidedBy = 'ADMIN';
        notify(d, a.rollNo, `Update on ${c?.name}: application not accepted.`, 'bad');
      } else if (status === 'Shortlisted') {
        a.status = 'Shortlisted';
        a.remark = '';
        a.decidedBy = 'ADMIN';
        notify(d, a.rollNo, `You are shortlisted for ${c?.name}!`, 'good');
      } else {
        a.status = status;
      }
      log(d, 'ADMIN', 'application', `${st?.name}: ${prev} → ${a.status} (${c?.name})`);
    });
  },
  assignSlotToApp(appId, slotId) {
    return mutate((d) => {
      const a = d.applications.find((x) => x.id === appId);
      const slot = d.slots.find((x) => x.id === slotId);
      if (!a || !slot) return { ok: false };
      const taken = d.applications.filter((x) => x.slotId === slotId && x.status !== 'Rejected' && x.id !== appId).length;
      if (taken >= slot.capacity) return { ok: false, error: 'Slot is full' };
      assignSlot(d, a, slot, 'ADMIN');
      return { ok: true };
    });
  },
  setInterviewScore(appId, score) {
    mutate((d) => {
      const a = d.applications.find((x) => x.id === appId);
      if (!a) return;
      a.interviewScore = score === '' || score === null ? null : Number(score);
      const st = findStudent(d, a.rollNo);
      log(d, 'ADMIN', 'interview', `Interview score ${a.interviewScore} entered for ${st?.name}`);
    });
  },

  /* ---- admin: events & payments ---- */
  saveEvent(e) {
    mutate((d) => {
      const i = d.events.findIndex((x) => x.id === e.id);
      const clean = {
        ...e,
        price: Number(e.price),
        seatsTotal: Number(e.seatsTotal),
        seatsLeft: Number(e.seatsLeft),
      };
      if (i >= 0) d.events[i] = clean;
      else d.events.push(clean);
      log(d, 'ADMIN', 'event', `${i >= 0 ? 'Updated' : 'Created'} event ${e.title}`);
    });
  },
  deleteEvent(id) {
    mutate((d) => {
      const e = d.events.find((x) => x.id === id);
      d.events = d.events.filter((x) => x.id !== id);
      log(d, 'ADMIN', 'event', `Deleted event ${e?.title}`);
    });
  },
  verifyPayment(id) {
    mutate((d) => {
      const p = d.payments.find((x) => x.id === id);
      if (p && p.status === 'Pending') issuePass(d, p, 'ADMIN');
    });
  },
  rejectPayment(id) {
    mutate((d) => {
      const p = d.payments.find((x) => x.id === id);
      if (!p || p.status !== 'Pending') return;
      const ev = d.events.find((e) => e.id === p.eventId);
      p.status = 'Rejected';
      p.by = 'ADMIN';
      if (ev) ev.seatsLeft += 1;
      notify(d, p.rollNo, `Your payment of ₹${p.amount} could not be verified. Seat released.`, 'bad');
      log(d, 'ADMIN', 'payment', `Payment ${p.id} rejected`);
    });
  },

  /* ---- admin: grievances ---- */
  resolveGrievance(id, response) {
    mutate((d) => {
      const g = d.grievances.find((x) => x.id === id);
      if (!g) return;
      g.status = 'Resolved';
      g.response = response || 'Resolved';
      g.resolvedAt = Date.now();
      notify(d, g.rollNo, `${g.id} resolved: ${g.response}`, 'good');
      log(d, 'ADMIN', 'grievance', `${g.id} resolved`);
    });
  },
  escalateGrievance(id) {
    mutate((d) => {
      const g = d.grievances.find((x) => x.id === id);
      if (!g) return;
      g.status = 'Escalated';
      notify(d, g.rollNo, `${g.id} escalated to the Chief Warden.`, 'warn');
      log(d, 'ADMIN', 'grievance', `${g.id} escalated manually`);
    });
  },
  reopenGrievance(id) {
    mutate((d) => {
      const g = d.grievances.find((x) => x.id === id);
      if (!g) return;
      g.status = 'In Progress';
      g.createdAtMs = Date.now();
      log(d, 'ADMIN', 'grievance', `${g.id} reopened, SLA clock restarted`);
    });
  },

  /* ---- admin: Super 50 ---- */
  saveCandidate(c) {
    mutate((d) => {
      const i = d.candidates.findIndex((x) => x.rollNo === c.rollNo);
      const clean = { ...c, assessment: Number(c.assessment), interview: Number(c.interview) };
      if (i >= 0) d.candidates[i] = clean;
      else d.candidates.push(clean);
      log(d, 'ADMIN', 'super50', `Scores saved for ${c.name}`);
    });
  },
  deleteCandidate(rollNo) {
    mutate((d) => {
      d.candidates = d.candidates.filter((x) => x.rollNo !== rollNo);
    });
  },

  /* ---- admin: slots + settings ---- */
  addSlot(label, capacity = 1) {
    mutate((d) => {
      d.slots.push({ id: uid('slot'), label, capacity: Number(capacity) || 1 });
    });
  },
  deleteSlot(id) {
    mutate((d) => {
      d.slots = d.slots.filter((s) => s.id !== id);
      d.applications.forEach((a) => {
        if (a.slotId === id) {
          a.slotId = null;
          if (a.status === 'Slot Booked') a.status = 'Shortlisted';
        }
      });
    });
  },
  generateSlots(days = 3) {
    mutate((d) => {
      const now = Date.now();
      let n = 0;
      for (let day = 0; day < days; day++) {
        SLOT_TIMES.forEach((t) => {
          const label = slotLabel(now, day, t);
          if (!d.slots.some((s) => s.label === label)) {
            d.slots.push({ id: uid('slot'), label, capacity: 1 });
            n++;
          }
        });
      }
      log(d, 'ADMIN', 'slot', `Generated ${n} interview slots for next ${days} day(s)`);
    });
  },
   updateSettings(patch) {
    mutate((d) => {
      d.settings = { ...d.settings, ...patch };
      log(d, 'ADMIN', 'settings', `Automation settings changed: ${Object.keys(patch).join(', ')}`);
    });
    api('/settings', { method: 'PUT', body: patch }).catch(console.error);
  },
  /** Bulk helpers for when an auto-rule is switched off */
  screenPending() {
    return mutate((d) => {
      let n = 0;
      d.applications.forEach((a) => {
        if (a.status === 'Applied') { screenApplication(d, a, 'ADMIN'); n++; }
      });
      return n;
    });
  },
  allocateSlots() {
    return mutate((d) => {
      let n = 0;
      d.applications.forEach((a) => {
        if (a.status === 'Shortlisted' && !a.slotId) {
          const slot = nextFreeSlot(d, a.rollNo);
          if (slot) { assignSlot(d, a, slot, 'ADMIN'); n++; }
        }
      });
      return n;
    });
  },
  runAutomationNow() {
    return mutate((d) => {
      log(d, 'ADMIN', 'settings', 'Manual automation run');
    });
  },
  
resetDemoData() {
  db = createEmptyState();
  persist();
  emit();
},

};

/* ------------------------------ selectors ------------------------------ */
export const select = {
  
student: (d, roll) => {
  const students = d?.students || [];
  const s = students.find((student) => student.rollNo === roll);

  if (!s) return null;

  return {
    name: s.name || '',
    rollNo: s.rollNo || '',
    cgpa: s.cgpa ?? null,
    branch: s.branch || '',
    semester: s.semester || '',
  };
},


  /** committees a student can currently apply to (shape unchanged from original UI) */
  openCommittees: (d) =>
    d.committees
      .filter((c) => c.hiringOpen && c.vacancies > 0)
      .map((c) => ({ ...c, deadline: fmtDate(Date.parse(`${c.deadline}T00:00:00`)) })),

  committeeNames: (d) => d.committees.map((c) => c.name),

  studentApplications: (d, roll) =>
    d.applications
      .filter((a) => a.rollNo === roll && a.status !== 'Rejected')
      .map((a) => {
        const c = findCommittee(d, a.committeeId);
        const slot = d.slots.find((s) => s.id === a.slotId);
        const stepMap = { Applied: 1, Shortlisted: 2, 'Slot Booked': 3, Selected: 4 };
        let interviewSlot = slot ? slot.label : 'Slot Pending - Choose below';
        if (a.status === 'Selected') interviewSlot = `Selected! 🎉 ${slot ? `(Interviewed: ${slot.label})` : ''}`;
        if (a.status === 'Applied') interviewSlot = 'Awaiting screening';
        return {
          id: a.id, committeeId: a.committeeId, name: c?.name || 'Committee', role: c?.role || '',
          minCgpa: c?.minCgpa ?? 0, appliedOn: isoDay(a.appliedOn), status: a.status,
          interviewSlot, step: stepMap[a.status] || 1,
        };
      }),

   freeSlotsFor: (d, appId) => {
    const mine = d.applications.find((a) => a.id === appId);
    return d.slots.filter((s) => {
      const mineHere = mine && mine.slotId === s.id && mine.status !== 'Rejected' ? 1 : 0;
      return (s.taken ?? 0) - mineHere < s.capacity;
    });
  },

  super50: (d, roll) => {
    const { weightAssessment: wa, weightInterview: wi, cohortSize } = d.settings;
    const total = wa + wi || 1;
    const rows = d.candidates
      .map((c) => ({ ...c, composite: (c.assessment * wa + c.interview * 10 * wi) / total }))
      .sort((x, y) => y.composite - x.composite)
      .map((c, i) => ({
        rank: i + 1,
        name: c.rollNo === roll ? `${c.name} (You)` : c.name,
        rollNo: c.rollNo,
        branch: c.branch,
        assessmentScore: `${c.assessment}/100`,
        interviewScore: `${c.interview}/10`,
        compositeScore: `${c.composite.toFixed(1)}%`,
        status: i + 1 <= cohortSize ? 'Confirmed' : 'Waitlisted',
      }));
    const mine = rows.find((r) => r.rollNo === roll);
    return { rows, myRank: mine ? mine.rank : null, total: rows.length };
  },

  /** admin-side ranked candidates with numeric composite */
  rankedCandidates: (d) => {
    const { weightAssessment: wa, weightInterview: wi, cohortSize } = d.settings;
    const total = wa + wi || 1;
    return d.candidates
      .map((c) => ({ ...c, composite: (c.assessment * wa + c.interview * 10 * wi) / total }))
      .sort((x, y) => y.composite - x.composite)
      .map((c, i) => ({ ...c, rank: i + 1, confirmed: i + 1 <= cohortSize }));
  },

   events: (d) =>
    d.events.map((e) => ({
      ...e,
      numericPrice: e.price,
      price: e.price === 0 ? 'FREE' : `₹${e.price}${e.priceUnit || ''}`,
    })),

  passesFor: (d, roll) => d.passes.filter((p) => p.rollNo === roll),

  grievancesFor: (d, roll, now = Date.now()) =>
    d.grievances
      .filter((g) => g.rollNo === roll)
      .map((g) => {
        const remMs = g.createdAtMs + g.slaHours * HOUR - now;
        let slaRemaining;
        if (g.status === 'Resolved') slaRemaining = 'Resolved';
        else if (g.status === 'Escalated' || remMs <= 0) slaRemaining = '0 hrs (Overdue)';
        else slaRemaining = `${Math.ceil(remMs / HOUR)} hrs remaining`;
        return { ...g, slaRemaining, createdAt: now - g.createdAtMs < 60000 ? 'Just now' : fmtDate(g.createdAtMs) };
      }),

  notificationsFor: (d, audience) => d.notifications.filter((n) => n.to === audience),
};

export const slaRemainingMs = (g, now = Date.now()) => g.createdAtMs + g.slaHours * HOUR - now;

/* ------------------------------ boot ------------------------------ */
db = load();
export const getDB = () => db;
