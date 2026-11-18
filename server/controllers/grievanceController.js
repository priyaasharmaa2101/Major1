import { randomInt } from 'crypto';
import Grievance from '../models/Grievance.js';
import User from '../models/User.js';
import { getSettingsValues } from './settingsController.js';
import { notify } from './notificationController.js';

// Tickets past their SLA are escalated automatically (if the rule is ON).
async function escalateOverdue() {
  const settings = await getSettingsValues();
  if (!settings.autoEscalation) return;
  const overdue = await Grievance.find({
    status: 'In Progress',
    $expr: {
      $gte: [
        { $subtract: [Date.now(), '$createdAtMs'] },
        { $multiply: ['$slaHours', 3600000] },
      ],
    },
  });
  for (const g of overdue) {
    // Only the request that actually flips the status sends the notifications.
    const result = await Grievance.updateOne({ _id: g._id, status: 'In Progress' }, { $set: { status: 'Escalated' } });
    if (result.modifiedCount === 1) {
      await notify(g.rollNo, `${g.id} crossed its ${g.slaHours}h SLA and was escalated to the Chief Warden.`, 'warn');
      await notify('ADMIN', `${g.id} auto-escalated: ${g.title}`, 'warn');
    }
  }
}

// Admin: all tickets. Student: only their own.
export async function listGrievances(req, res) {
  try {
    await escalateOverdue();
    const isAdmin = req.user.role === 'admin';
    const filter = isAdmin ? {} : { rollNo: req.user.rollNo };
    const rows = await Grievance.find(filter).sort({ createdAtMs: -1 });
    const rolls = [...new Set(rows.map((g) => g.rollNo))];
    const users = isAdmin ? await User.find({ rollNo: { $in: rolls } }) : [req.user];
    const names = new Map(users.map((u) => [u.rollNo, u.name]));
    return res.json({
      grievances: rows.map((g) => ({ ...g.toObject(), studentName: names.get(g.rollNo) || '' })),
    });
  } catch (error) {
    console.error('List grievances error:', error);
    return res.status(500).json({ message: 'Unable to fetch grievances.' });
  }
}

export async function createGrievance(req, res) {
  try {
    if (!req.user.rollNo) return res.status(400).json({ message: 'Your roll number is missing from your account.' });
    const { committee, title, description } = req.body;
    if (!committee?.trim() || !title?.trim() || !description?.trim()) {
      return res.status(400).json({ message: 'Committee, subject and description are required.' });
    }

    let id = null;
    for (let i = 0; i < 5 && !id; i++) {
      const candidate = `TKT-${randomInt(1000, 9999)}`;
      if (!(await Grievance.exists({ id: candidate }))) id = candidate;
    }
    if (!id) id = `TKT-${Date.now()}`;

    const settings = await getSettingsValues();
    const grievance = await Grievance.create({
      id,
      rollNo: req.user.rollNo,
      committee: committee.trim(),
      title: title.trim(),
      description: description.trim(),
      slaHours: settings.slaHours,
      status: 'In Progress',
    });
        await notify('ADMIN', `New grievance ${grievance.id}: ${grievance.title}`, 'warn');
    return res.status(201).json({ message: 'Complaint filed.', grievance });
  } catch (error) {
    console.error('Create grievance error:', error);
    return res.status(500).json({ message: 'Unable to file complaint.' });
  }
}

// Admin: { action: 'resolve' | 'escalate' | 'reopen', response? }
export async function updateGrievance(req, res) {
  try {
    const g = await Grievance.findOne({ id: req.params.id });
    if (!g) return res.status(404).json({ message: 'Grievance not found.' });

    const { action, response } = req.body;
    if (action === 'resolve') {
      if (!response?.trim()) return res.status(400).json({ message: 'A response is required to resolve a ticket.' });
      g.status = 'Resolved';
      g.response = response.trim();
    } else if (action === 'escalate') {
      if (g.status === 'Resolved') return res.status(400).json({ message: 'A resolved ticket cannot be escalated.' });
      g.status = 'Escalated';
    } else if (action === 'reopen') {
      if (g.status !== 'Resolved') return res.status(400).json({ message: 'Only resolved tickets can be reopened.' });
      g.status = 'In Progress';
      g.createdAtMs = Date.now(); // restart the SLA clock
    } else {
      return res.status(400).json({ message: 'Invalid action.' });
    }

    g.reviewedBy = req.user._id;
    await g.save();
    if (action === 'resolve') await notify(g.rollNo, `${g.id} resolved: ${g.response}`, 'good');
    else if (action === 'escalate') await notify(g.rollNo, `${g.id} escalated to the Chief Warden.`, 'warn');
    return res.json({ message: 'Grievance updated.', grievance: g });
  } catch (error) {
    console.error('Update grievance error:', error);
    return res.status(500).json({ message: 'Unable to update grievance.' });
  }
}