import { randomUUID, randomBytes } from 'crypto';
import Event from '../models/Event.js';
import Payment from '../models/Payment.js';
import EventRegistration from '../models/EventRegistration.js';
import { getSettingsValues } from './settingsController.js';
import { notify } from './notificationController.js';
import { isEventOwner, EVENT_OWNER_MESSAGE } from '../middleware/eventAccess.js';

async function issuePass(payment, by) {
  await EventRegistration.create({
    id: randomUUID(),
    eventId: payment.eventId,
    rollNo: payment.rollNo,
    name: payment.name,
    registrationCode: `TKT-${randomBytes(4).toString('hex').toUpperCase()}`,
  });
  payment.status = 'Verified';
  payment.by = by;
  await payment.save();
    const ev = await Event.findOne({ id: payment.eventId });
  await notify(payment.rollNo, `Payment of ₹${payment.amount} verified. Your pass for ${ev?.title || 'the event'} is ready.`, 'good');
}

// Admin: everything. Student: only their own payments and passes.
export async function listPayments(req, res) {
  try {
    const filter = req.user.role === 'admin' ? {} : { rollNo: req.user.rollNo };
    const [payments, passes] = await Promise.all([
      Payment.find(filter).sort({ _id: -1 }),
      EventRegistration.find(filter).sort({ _id: -1 }),
    ]);
    if (req.user.role !== 'admin') return res.json({ payments, passes });
    const mine = await Event.find({ createdBy: req.user._id }).select('id');
    const ownedIds = new Set(mine.map((e) => e.id));
    return res.json({
      payments: payments.map((p) => ({ ...p.toObject(), canManage: ownedIds.has(p.eventId) })),
      passes,
    });
  } catch (error) {
    console.error('List payments error:', error);
    return res.status(500).json({ message: 'Unable to fetch payments.' });
  }
}

// Student pays for an event. The seat is held right away.
export async function createPayment(req, res) {
  try {
    const student = req.user;
    if (!student.rollNo) return res.status(400).json({ message: 'Your roll number is missing from your account.' });

    const event = await Event.findOne({ id: req.body.eventId });
    if (!event) return res.status(404).json({ message: 'Event not found.' });

    const alreadyHasPass = await EventRegistration.exists({ eventId: event.id, rollNo: student.rollNo });
    const pending = await Payment.exists({ eventId: event.id, rollNo: student.rollNo, status: 'Pending' });
    if (alreadyHasPass || pending) {
      return res.status(409).json({ message: 'You already have a pass (or a pending payment) for this event.' });
    }

    const held = await Event.findOneAndUpdate(
      { id: event.id, seatsLeft: { $gt: 0 } },
      { $inc: { seatsLeft: -1 } }
    );
    if (!held) return res.status(400).json({ message: 'Sold out.' });

    const payment = await Payment.create({
      id: randomUUID(),
      eventId: event.id,
      rollNo: student.rollNo,
      name: student.name,
      amount: event.price,
      status: 'Pending',
    });

    const settings = await getSettingsValues();
    if (settings.autoPayment) {
      try {
        await issuePass(payment, 'AUTO');
      } catch (e) {
        console.error('Auto pass error:', e);
      }
    }
        await notify('ADMIN', `New payment ₹${event.price} from ${student.name} for ${event.title}`, 'info');

    return res.status(201).json({ message: 'Payment received.', payment });
  } catch (error) {
    console.error('Create payment error:', error);
    return res.status(500).json({ message: 'Unable to process payment.' });
  }
}

export async function verifyPayment(req, res) {
  try {
    const payment = await Payment.findOne({ id: req.params.id });
    if (!payment) return res.status(404).json({ message: 'Payment not found.' });
    if (payment.status !== 'Pending') return res.status(400).json({ message: 'Only pending payments can be verified.' });
        const ownedEvent = await Event.findOne({ id: payment.eventId });
    if (!isEventOwner(ownedEvent, req.user)) return res.status(403).json({ message: EVENT_OWNER_MESSAGE });
    await issuePass(payment, 'ADMIN');
    return res.json({ message: 'Payment verified. Pass issued.', payment });
  } catch (error) {
    console.error('Verify payment error:', error);
    return res.status(500).json({ message: 'Unable to verify payment.' });
  }
}

export async function rejectPayment(req, res) {
  try {
    const payment = await Payment.findOne({ id: req.params.id });
    if (!payment) return res.status(404).json({ message: 'Payment not found.' });
    if (payment.status !== 'Pending') return res.status(400).json({ message: 'Only pending payments can be rejected.' });
        const ownedEvent = await Event.findOne({ id: payment.eventId });
    if (!isEventOwner(ownedEvent, req.user)) return res.status(403).json({ message: EVENT_OWNER_MESSAGE });
    payment.status = 'Rejected';
    payment.by = 'ADMIN';
    await payment.save();
    await Event.updateOne({ id: payment.eventId }, { $inc: { seatsLeft: 1 } });

        await notify(payment.rollNo, `Your payment of ₹${payment.amount} could not be verified. Seat released.`, 'bad');

    return res.json({ message: 'Payment rejected. Seat released.', payment });
  } catch (error) {
    console.error('Reject payment error:', error);
    return res.status(500).json({ message: 'Unable to reject payment.' });
  }
}