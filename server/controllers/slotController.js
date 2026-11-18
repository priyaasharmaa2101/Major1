import { randomUUID } from 'crypto';
import InterviewSlot from '../models/InterviewSlot.js';
import Application from '../models/Application.js';

const TIMES = ['11:00 AM - 11:20 AM', '2:30 PM - 2:50 PM', '3:40 PM - 4:00 PM', '4:20 PM - 4:40 PM'];
const DAY = 24 * 60 * 60 * 1000;
const fmt = (ms, opts) => new Date(ms).toLocaleDateString('en-US', { timeZone: 'Asia/Kolkata', ...opts });
const slotLabel = (ms, time) => `${fmt(ms, { weekday: 'short' })}, ${fmt(ms, { month: 'short', day: 'numeric' })} • ${time}`;

// Anyone logged in: all slots with how many are taken.
export async function listSlots(_req, res) {
  try {
    const slots = await InterviewSlot.find().sort({ createdAt: 1, _id: 1 });
    const counts = await Application.aggregate([
      { $match: { slotId: { $ne: null }, status: { $ne: 'Rejected' } } },
      { $group: { _id: '$slotId', n: { $sum: 1 } } },
    ]);
    const taken = new Map(counts.map((c) => [c._id, c.n]));
    return res.json({
      slots: slots.map((s) => ({ id: s.id, label: s.label, capacity: s.capacity, taken: taken.get(s.id) || 0 })),
    });
  } catch (error) {
    console.error('List slots error:', error);
    return res.status(500).json({ message: 'Unable to fetch slots.' });
  }
}

export async function createSlot(req, res) {
  try {
    const label = String(req.body.label || '').trim();
    const capacity = Number(req.body.capacity) || 1;
    if (!label) return res.status(400).json({ message: 'Slot label is required.' });
    if (await InterviewSlot.exists({ label })) return res.status(409).json({ message: 'This slot already exists.' });
    const slot = await InterviewSlot.create({ id: randomUUID(), label, capacity });
    return res.status(201).json({ slot });
  } catch (error) {
    console.error('Create slot error:', error);
    return res.status(500).json({ message: 'Unable to create slot.' });
  }
}

export async function generateSlots(req, res) {
  try {
    const days = Math.min(Math.max(Number(req.body.days) || 3, 1), 14);
    const now = Date.now();
    let created = 0;
    for (let d = 0; d < days; d++) {
      for (const time of TIMES) {
        const label = slotLabel(now + d * DAY, time);
        if (await InterviewSlot.exists({ label })) continue;
        await InterviewSlot.create({ id: randomUUID(), label, capacity: 1 });
        created++;
      }
    }
    return res.json({ message: `Generated ${created} slots.`, created });
  } catch (error) {
    console.error('Generate slots error:', error);
    return res.status(500).json({ message: 'Unable to generate slots.' });
  }
}

export async function deleteSlot(req, res) {
  try {
    const slot = await InterviewSlot.findOneAndDelete({ id: req.params.id });
    if (!slot) return res.status(404).json({ message: 'Slot not found.' });
    await Application.updateMany(
      { slotId: slot.id, status: 'Slot Booked' },
      { $set: { slotId: null, status: 'Shortlisted' } }
    );
    await Application.updateMany({ slotId: slot.id }, { $set: { slotId: null } });
    return res.json({ message: 'Slot deleted.' });
  } catch (error) {
    console.error('Delete slot error:', error);
    return res.status(500).json({ message: 'Unable to delete slot.' });
  }
}