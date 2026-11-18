import { randomUUID } from 'crypto';
import Event from '../models/Event.js';
import Payment from '../models/Payment.js';
import EventRegistration from '../models/EventRegistration.js';
import { isEventOwner, EVENT_OWNER_MESSAGE } from '../middleware/eventAccess.js';

export async function getEvents(req, res) {
  try {
    const events = await Event.find().sort({ createdAt: 1, _id: 1 });
    const isAdmin = req.user?.role === 'admin';
    return res.json({
      events: events.map((e) => ({ ...e.toObject(), canManage: isAdmin && isEventOwner(e, req.user) })),
    });
  } catch (error) {
    console.error('Get events error:', error);
    return res.status(500).json({ message: 'Unable to fetch events.' });
  }
}

export async function createEvent(req, res) {
  try {
    const { title, tag, date, venue, price, priceUnit, seatsTotal, description } = req.body;
    if (!title?.trim() || !date?.trim() || !venue?.trim() || !description?.trim()) {
      return res.status(400).json({ message: 'Title, date, venue and description are required.' });
    }
    const total = Number(seatsTotal);
    const cost = Number(price);
    if (!Number.isInteger(total) || total < 1) return res.status(400).json({ message: 'Total seats must be at least 1.' });
    if (Number.isNaN(cost) || cost < 0) return res.status(400).json({ message: 'Price must be 0 or more.' });

    const event = await Event.create({
      id: randomUUID(),
      title: title.trim(),
      tag: (tag || '').trim(),
      date: date.trim(),
      venue: venue.trim(),
      price: cost,
      priceUnit: priceUnit || '',
      seatsTotal: total,
      seatsLeft: total,
      description: description.trim(),
      createdBy: req.user._id,
    });
    return res.status(201).json({ message: 'Event created.', event });
  } catch (error) {
    console.error('Create event error:', error);
    return res.status(500).json({ message: 'Unable to create event.' });
  }
}

export async function updateEvent(req, res) {
  try {
    const event = await Event.findOne({ id: req.params.id });
    if (!event) return res.status(404).json({ message: 'Event not found.' });
        if (!isEventOwner(event, req.user)) return res.status(403).json({ message: EVENT_OWNER_MESSAGE });

    for (const f of ['title', 'tag', 'date', 'venue', 'description']) {
      if (req.body[f] !== undefined) event[f] = String(req.body[f]).trim();
    }
    if (req.body.priceUnit !== undefined) event.priceUnit = req.body.priceUnit;
    if (req.body.price !== undefined) {
      const n = Number(req.body.price);
      if (Number.isNaN(n) || n < 0) return res.status(400).json({ message: 'Price must be 0 or more.' });
      event.price = n;
    }
    if (req.body.seatsTotal !== undefined) {
      const n = Number(req.body.seatsTotal);
      if (!Number.isInteger(n) || n < 1) return res.status(400).json({ message: 'Total seats must be at least 1.' });
      const delta = n - event.seatsTotal;
      event.seatsTotal = n;
      event.seatsLeft = Math.max(0, event.seatsLeft + delta);
    }
    if (req.body.seatsLeft !== undefined) {
      const n = Number(req.body.seatsLeft);
      if (!Number.isInteger(n) || n < 0) return res.status(400).json({ message: 'Seats left must be 0 or more.' });
      event.seatsLeft = Math.min(n, event.seatsTotal);
    }

    await event.save();
    return res.json({ message: 'Event updated.', event });
  } catch (error) {
    console.error('Update event error:', error);
    return res.status(500).json({ message: 'Unable to update event.' });
  }
}

export async function deleteEvent(req, res) {
  try {
        const existing = await Event.findOne({ id: req.params.id });
    if (!existing) return res.status(404).json({ message: 'Event not found.' });
    if (!isEventOwner(existing, req.user)) return res.status(403).json({ message: EVENT_OWNER_MESSAGE });
    const event = await Event.findOneAndDelete({ id: req.params.id });
    if (!event) return res.status(404).json({ message: 'Event not found.' });
    await Promise.all([
      Payment.deleteMany({ eventId: event.id }),
      EventRegistration.deleteMany({ eventId: event.id }),
    ]);
    return res.json({ message: 'Event deleted.' });
  } catch (error) {
    console.error('Delete event error:', error);
    return res.status(500).json({ message: 'Unable to delete event.' });
  }
}