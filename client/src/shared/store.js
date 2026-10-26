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

const STORAGE_KEY = 'campussync:db:v1';
const HOUR = 3600 * 1000;
const DAY = 24 * HOUR;

export const CURRENT_STUDENT_ROLL = '23CS1089';

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

/* ------------------------------ seed data ------------------------------ */
function seed() {
  const now = Date.now();
  return {
    version: 1,
    settings: {
      autoScreening: true, // CGPA / branch / hostel check on every application
      autoSlot: true, // give shortlisted students the next free interview slot
      autoSelect: true, // decide automatically once interview score is entered
      autoPayment: true, // verify payments + issue QR pass instantly
      autoEscalation: true, // push overdue grievances to Chief Warden
      autoCloseHiring: true, // close committee on deadline or when vacancies = 0
      slaHours: 48,
      selectionThreshold: 7, // min interview score (out of 10) to be selected
      cohortSize: 50,
      weightAssessment: 60,
      weightInterview: 40,
    },
    students: [
      { rollNo: '23CS1089', name: 'Kabir Verma', branch: 'Computer Science & Engineering', short: 'CSE', semester: '5th Sem', cgpa: 8.42, hostel: true },
      { rollNo: '23CS1012', name: 'Ananya Deshmukh', branch: 'Computer Science & Engineering', short: 'CSE', semester: '5th Sem', cgpa: 9.1, hostel: false },
      { rollNo: '23EC1044', name: 'Riddhiman Ghosh', branch: 'Electronics & Communication', short: 'ECE', semester: '5th Sem', cgpa: 8.8, hostel: true },
      { rollNo: '23IT1023', name: 'Tanmay Saxena', branch: 'Information Technology', short: 'IT', semester: '5th Sem', cgpa: 8.5, hostel: true },
      { rollNo: '23ME1008', name: 'Ishita Rawat', branch: 'Mechanical Engineering', short: 'ME', semester: '5th Sem', cgpa: 8.0, hostel: true },
      { rollNo: '23CS1101', name: 'Meera Nair', branch: 'Computer Science & Engineering', short: 'CSE', semester: '5th Sem', cgpa: 6.9, hostel: true },
      { rollNo: '23EC1120', name: 'Dev Malhotra', branch: 'Electronics & Communication', short: 'ECE', semester: '5th Sem', cgpa: 7.2, hostel: false },
      { rollNo: '23ME1055', name: 'Sanya Kapoor', branch: 'Mechanical Engineering', short: 'ME', semester: '5th Sem', cgpa: 6.2, hostel: true },
    ],
    committees: [
      {
        id: 'sac-tech', name: 'SAC Technical Committee', tag: 'Flagship Body',
        lead: 'Aarav Sharma (B.Tech CS 4th Yr)', role: 'Web & Infrastructure Lead',
        deadline: isoDay(now + 3 * DAY), minCgpa: 7.5, requiredBranch: 'All Branches', vacancies: 4, hiringOpen: true,
        description: 'Oversees college technical symposiums, hackathons, and web infrastructure.',
      },
      {
        id: 'hostel-mess', name: 'Hostel & Mess Committee', tag: 'Governance',
        lead: 'Neha Patel (B.Tech ME 3rd Yr)', role: 'Quality & Inventory Auditor',
        deadline: isoDay(now + 1 * DAY), minCgpa: 7.0, requiredBranch: 'Hostel Residents Only', vacancies: 6, hiringOpen: true,
        description: 'Liaison with food vendors, cafeteria management, and hostel maintenance oversight.',
      },
      {
        id: 'cultural-sac', name: 'Cultural & Fiesta Council', tag: 'Events & Arts',
        lead: 'Rohan Gupta (B.Tech EC 4th Yr)', role: 'Stage & Operations Coordinator',
        deadline: isoDay(now + 10 * DAY), minCgpa: 6.5, requiredBranch: 'All Branches', vacancies: 8, hiringOpen: true,
        description: 'Coordinates annual cultural fest Fiesta, Garba nights, and literary events.',
      },
    ],
    slots: [
      { id: 'slot-1', label: slotLabel(now, 0, SLOT_TIMES[0]), capacity: 1 },
      { id: 'slot-2', label: slotLabel(now, 0, SLOT_TIMES[1]), capacity: 1 },
      { id: 'slot-3', label: slotLabel(now, 1, SLOT_TIMES[2]), capacity: 1 },
      { id: 'slot-4', label: slotLabel(now, 1, SLOT_TIMES[3]), capacity: 1 },
      { id: 'slot-5', label: slotLabel(now, 2, SLOT_TIMES[0]), capacity: 1 },
      { id: 'slot-6', label: slotLabel(now, 2, SLOT_TIMES[1]), capacity: 1 },
    ],
    applications: [
      { id: 'APP-100001', committeeId: 'hostel-mess', rollNo: '23CS1089', appliedOn: now - 5 * DAY, status: 'Slot Booked', slotId: 'slot-2', interviewScore: null, remark: '', decidedBy: 'AUTO' },
      { id: 'APP-100002', committeeId: 'sac-tech', rollNo: '23CS1012', appliedOn: now - 3 * DAY, status: 'Slot Booked', slotId: 'slot-1', interviewScore: null, remark: '', decidedBy: 'AUTO' },
      { id: 'APP-100003', committeeId: 'hostel-mess', rollNo: '23ME1008', appliedOn: now - 2 * DAY, status: 'Slot Booked', slotId: 'slot-3', interviewScore: null, remark: '', decidedBy: 'AUTO' },
      { id: 'APP-100004', committeeId: 'sac-tech', rollNo: '23IT1023', appliedOn: now - 2 * HOUR, status: 'Applied', slotId: null, interviewScore: null, remark: '', decidedBy: null },
      { id: 'APP-100005', committeeId: 'hostel-mess', rollNo: '23CS1101', appliedOn: now - 1 * HOUR, status: 'Applied', slotId: null, interviewScore: null, remark: '', decidedBy: null },
      { id: 'APP-100006', committeeId: 'cultural-sac', rollNo: '23EC1044', appliedOn: now - 30 * 60 * 1000, status: 'Applied', slotId: null, interviewScore: null, remark: '', decidedBy: null },
    ],
    events: [
      {
        id: 'garba-2026', title: 'Grand Campus Dandiya & Garba Night 2026', tag: 'Garba Special',
        date: 'Oct 26, 2026 • 6:30 PM Onwards', venue: 'Main College Amphitheatre',
        price: 150, priceUnit: '', seatsTotal: 200, seatsLeft: 42,
        description: 'Traditional Garba celebration with live band DJ, traditional attire contest, and food stalls.',
      },
      {
        id: 'fiesta-hack', title: 'Fiesta 2026: 24-Hour Inter-College Hackathon', tag: 'Fiesta Flagship',
        date: 'Nov 12-13, 2026 • 10:00 AM', venue: 'SAC Tech Lab & Innovation Block',
        price: 300, priceUnit: ' / Team', seatsTotal: 40, seatsLeft: 14,
        description: 'Open to internal college students and external teams. Cash prize pool of ₹50,000.',
      },
    ],
    payments: [
      { id: 'PAY-100001', eventId: 'garba-2026', rollNo: '23CS1089', name: 'Kabir Verma', amount: 150, status: 'Verified', createdAt: now - 4 * DAY, by: 'AUTO' },
    ],
    passes: [
      { id: 'PASS-7890', eventId: 'garba-2026', eventTitle: 'Grand Campus Dandiya & Garba Night 2026', passId: 'GNB-2026-CS89', userName: 'Kabir Verma', rollNo: '23CS1089', price: '₹150' },
    ],
    grievances: [
      {
        id: 'TKT-1082', rollNo: '23CS1089', committee: 'Hostel & Mess Committee',
        title: 'Hot water geyser failure in Block-C 3rd Floor',
        description: 'Geyser tripping main MCB switch repeatedly since Wednesday morning.',
        createdAtMs: now - 60 * HOUR, slaHours: 48, status: 'Escalated', response: '',
      },
      {
        id: 'TKT-1094', rollNo: '23CS1089', committee: 'Hostel & Mess Committee',
        title: 'Mess quality feedback: uneven breakfast distribution',
        description: 'Morning breakfast running out 30 minutes before official closing time.',
        createdAtMs: now - 22 * HOUR, slaHours: 48, status: 'In Progress', response: '',
      },
      {
        id: 'TKT-1101', rollNo: '23ME1055', committee: 'SAC Technical Committee',
        title: 'Wi-Fi down in Innovation Block lab 2',
        description: 'No network since morning, projects are blocked.',
        createdAtMs: now - 5 * HOUR, slaHours: 48, status: 'In Progress', response: '',
      },
    ],
    candidates: [
      { rollNo: '23CS1012', name: 'Ananya Deshmukh', branch: 'CSE', assessment: 98, interview: 9.8 },
      { rollNo: '23EC1044', name: 'Riddhiman Ghosh', branch: 'ECE', assessment: 96, interview: 9.5 },
      { rollNo: '23IT1023', name: 'Tanmay Saxena', branch: 'IT', assessment: 95, interview: 9.4 },
      { rollNo: '23CS1089', name: 'Kabir Verma', branch: 'CSE', assessment: 94, interview: 9.4 },
      { rollNo: '23ME1008', name: 'Ishita Rawat', branch: 'ME', assessment: 92, interview: 9.2 },
      { rollNo: '23EC1120', name: 'Dev Malhotra', branch: 'ECE', assessment: 81, interview: 7.9 },
    ],
    notifications: [],
    activity: [],
  };
}

/* ------------------------------ persistence ------------------------------ */
function load() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (parsed && parsed.version === 1) return parsed;
    }
  } catch {
    /* ignore corrupt storage */
  }
  const fresh = seed();
  runAutomation(fresh); // first boot: let automation process the seeded queue
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(fresh));
  } catch {
    /* storage may be unavailable */
  }
  return fresh;
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
const notify = (d, to, text, tone = 'info') => {
  d.notifications.unshift({ id: uid('NTF'), ts: Date.now(), to, text, tone, read: false });
};

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
  if (s.autoScreening) {
    d.applications.forEach((a) => {
      if (a.status === 'Applied') {
        screenApplication(d, a, 'AUTO');
        count++;
      }
    });
  }

  // 3. Interview slot allocation
  if (s.autoSlot) {
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
  if (s.autoSelect) {
    d.applications.forEach((a) => {
      if (a.status === 'Slot Booked' && a.interviewScore !== null && a.interviewScore !== undefined) {
        decideSelection(d, a, Number(a.interviewScore) >= s.selectionThreshold, 'AUTO');
        count++;
      }
    });
  }

  // 5. Payments → pass
  if (s.autoPayment) {
    d.payments.forEach((p) => {
      if (p.status === 'Pending') {
        issuePass(d, p, 'AUTO');
        count++;
      }
    });
  }

  // 6. Grievance SLA escalation
  if (s.autoEscalation) {
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
    db = seed();
    runAutomation(db);
    persist();
    emit();
  },
};

/* ------------------------------ selectors ------------------------------ */
export const select = {
  student: (d, roll) => {
    const s = findStudent(d, roll) || d.students[0];
    return { name: s.name, rollNo: s.rollNo, cgpa: s.cgpa, branch: s.branch, semester: s.semester };
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

  freeSlotsFor: (d, appId) =>
    d.slots.filter((s) => {
      const taken = d.applications.filter((a) => a.slotId === s.id && a.status !== 'Rejected' && a.id !== appId).length;
      return taken < s.capacity;
    }),

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
    d.events.map((e) => ({ ...e, numericPrice: e.price, price: `₹${e.price}${e.priceUnit || ''}` })),

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
