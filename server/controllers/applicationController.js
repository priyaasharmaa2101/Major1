import { randomUUID } from 'crypto';
import Application from '../models/Application.js';
import Committee from '../models/Committee.js';
import User from '../models/User.js';
import InterviewSlot from '../models/InterviewSlot.js';
import { notify } from './notificationController.js';
import { isCommitteeOwner, OWNER_MESSAGE } from '../middleware/committeeAccess.js';

const STATUSES = ['Applied', 'Shortlisted', 'Slot Booked', 'Selected', 'Rejected'];

const publicStudent = (u) => ({
  rollNo: u.rollNo, name: u.name, email: u.email,
  cgpa: u.cgpa, branch: u.branch, hostel: u.hostel, semester: u.semester,
});

function screen(committee, student) {
  const reasons = [];
  if (student.cgpa < committee.minCgpa) {
    reasons.push(`CGPA ${student.cgpa} is below the minimum ${committee.minCgpa}`);
  }
  const req = committee.requiredBranch || 'All Branches';
  if (req === 'Hostel Residents Only') {
    if (!student.hostel) reasons.push('Committee is for hostel residents only');
  } else if (req !== 'All Branches' && !(student.branch || '').toLowerCase().includes(req.toLowerCase())) {
    reasons.push(`Open to ${req} only`);
  }
  return reasons;
}

// Admin: all applications. Student: only their own.
export async function listApplications(req, res) {
  try {
    const isAdmin = req.user.role === 'admin';
    const filter = isAdmin ? {} : { rollNo: req.user.rollNo };
    const applications = await Application.find(filter).sort({ appliedOn: -1 });
    const rolls = [...new Set(applications.map((a) => a.rollNo))];
    const students = isAdmin ? await User.find({ rollNo: { $in: rolls } }) : [req.user];
    return res.json({ applications, students: students.map(publicStudent) });
  } catch (error) {
    console.error('List applications error:', error);
    return res.status(500).json({ message: 'Unable to fetch applications.' });
  }
}

// Student applies. Auto-screening runs here on the server.
export async function applyToCommittee(req, res) {
  try {
    const { committeeId } = req.body;
    const student = req.user;

    if (!student.rollNo) return res.status(400).json({ message: 'Your roll number is missing from your account.' });
    if (student.cgpa == null || !student.branch) {
      return res.status(400).json({ message: 'Complete your profile (CGPA and branch) before applying.' });
    }

    const committee = await Committee.findOne({ id: committeeId });
    if (!committee) return res.status(404).json({ message: 'Committee not found.' });

    const deadlinePassed = Date.parse(`${committee.deadline}T23:59:59`) < Date.now();
    if (!committee.hiringOpen || committee.vacancies <= 0 || deadlinePassed) {
      return res.status(400).json({ message: 'Hiring is closed for this committee.' });
    }

    const existing = await Application.findOne({ committeeId, rollNo: student.rollNo });
    if (existing && existing.status !== 'Rejected') {
      return res.status(409).json({ message: 'You have already applied to this committee.' });
    }
    if (existing) await existing.deleteOne();

    const reasons = screen(committee, student);
    const application = await Application.create({
      id: randomUUID(),
      committeeId,
      rollNo: student.rollNo,
      status: reasons.length ? 'Rejected' : 'Shortlisted',
      remark: reasons.join('; '),
      decidedBy: 'AUTO',
    });
    if (reasons.length) {
      await notify(student.rollNo, `Update on ${committee.name}: application not accepted (${reasons.join('; ')}).`, 'bad');
    } else {
      await notify(student.rollNo, `You are shortlisted for ${committee.name}! Pick an interview slot.`, 'good');
    }
    await notify('ADMIN', `${student.name} applied to ${committee.name}`, 'info');
    return res.status(201).json({ message: 'Application submitted.', application });
  } catch (error) {
    console.error('Apply error:', error);
    return res.status(500).json({ message: 'Unable to submit application.' });
  }
}

// Admin: change status, remark and/or interview score.
export async function updateApplication(req, res) {
  try {
    const app = await Application.findOne({ id: req.params.id });
    if (!app) return res.status(404).json({ message: 'Application not found.' });
    const owned = await Committee.findOne({ id: app.committeeId });
    if (!isCommitteeOwner(owned, req.user)) {
      return res.status(403).json({ message: OWNER_MESSAGE });
    }
    const { status, remark, interviewScore } = req.body;
      const statusBefore = app.status;
    if (status !== undefined) {
      if (!STATUSES.includes(status)) return res.status(400).json({ message: 'Invalid status.' });
      const prev = app.status;

      if (status === 'Selected' && prev !== 'Selected') {
        const updated = await Committee.findOneAndUpdate(
          { id: app.committeeId, vacancies: { $gt: 0 } },
          { $inc: { vacancies: -1 } }
        );
        if (!updated) return res.status(400).json({ message: 'No vacancies left for this committee.' });
      }
      if (prev === 'Selected' && status !== 'Selected') {
        await Committee.updateOne({ id: app.committeeId }, { $inc: { vacancies: 1 } });
      }

      app.status = status;
      app.decidedBy = 'ADMIN';
      if (status === 'Rejected') app.remark = remark || 'Rejected by admin';
      else if (remark !== undefined) app.remark = remark;
      else if (status === 'Shortlisted') app.remark = '';
    }

    if (interviewScore !== undefined) {
      if (interviewScore === null || interviewScore === '') {
        app.interviewScore = null;
      } else {
        const n = Number(interviewScore);
        if (Number.isNaN(n) || n < 0 || n > 10) {
          return res.status(400).json({ message: 'Interview score must be between 0 and 10.' });
        }
        app.interviewScore = n;
      }
    }

    await app.save();
        if (status !== undefined && app.status !== statusBefore) {
      const c = await Committee.findOne({ id: app.committeeId });
      const cname = c?.name || 'the committee';
      if (app.status === 'Selected') {
        await notify(app.rollNo, `Congratulations! You are selected for ${cname} as ${c?.role || 'a member'}.`, 'good');
      } else if (app.status === 'Rejected') {
        await notify(app.rollNo, `Update on ${cname}: not selected (${app.remark || 'no reason given'}).`, 'bad');
      } else if (app.status === 'Shortlisted') {
        await notify(app.rollNo, `You are shortlisted for ${cname}!`, 'good');
      }
    }
    return res.json({ message: 'Application updated.', application: app });
  } catch (error) {
    console.error('Update application error:', error);
    return res.status(500).json({ message: 'Unable to update application.' });
  }
}
// Student books their own slot; an admin can assign any application's slot.
export async function bookSlot(req, res) {
  try {
    const app = await Application.findOne({ id: req.params.id });
    if (!app) return res.status(404).json({ message: 'Application not found.' });

    const isAdmin = req.user.role === 'admin';
        if (isAdmin) {
      const owned = await Committee.findOne({ id: app.committeeId });
      if (!isCommitteeOwner(owned, req.user)) {
        return res.status(403).json({ message: OWNER_MESSAGE });
      }
    }
    if (!isAdmin && app.rollNo !== req.user.rollNo) {
      return res.status(403).json({ message: 'This is not your application.' });
    }
    if (!['Shortlisted', 'Slot Booked'].includes(app.status)) {
      return res.status(400).json({ message: 'Only shortlisted applications can book an interview slot.' });
    }

    const slot = await InterviewSlot.findOne({ id: req.body.slotId });
    if (!slot) return res.status(404).json({ message: 'Slot not found.' });

    const taken = await Application.countDocuments({
      slotId: slot.id, status: { $ne: 'Rejected' }, id: { $ne: app.id },
    });
    if (taken >= slot.capacity) return res.status(409).json({ message: 'Slot is full. Please pick another.' });

    const clash = await Application.exists({
      rollNo: app.rollNo, slotId: slot.id, status: { $ne: 'Rejected' }, id: { $ne: app.id },
    });
    if (clash) return res.status(409).json({ message: 'The student already has another interview in this slot.' });

    app.slotId = slot.id;
    app.status = 'Slot Booked';
    app.decidedBy = isAdmin ? 'ADMIN' : 'STUDENT';
    await app.save();
        if (isAdmin) await notify(app.rollNo, `Interview slot set: ${slot.label}.`, 'good');
    else await notify('ADMIN', `${req.user.name} booked interview slot ${slot.label}.`, 'info');
    return res.json({ message: 'Slot booked.', application: app });
  } catch (error) {
    console.error('Book slot error:', error);
    return res.status(500).json({ message: 'Unable to book slot.' });
  }
}