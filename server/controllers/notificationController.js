// import Notification from '../models/Notification.js';

// /**
//  * Create a notification. Never throws: a failed notification must never break
//  * the real action (applying, paying, resolving a grievance, ...).
//  * `to` is 'ADMIN' or a student's roll number.
//  */
// export async function notify(to, text, tone = 'info') {
//   try {
//     if (!to) return;
//     await Notification.create({ to, text, tone });
//   } catch (error) {
//     console.error('Notify error:', error.message);
//   }
// }

// const audienceOf = (user) => (user.role === 'admin' ? 'ADMIN' : user.rollNo);

// const toClient = (n) => ({
//   id: String(n._id),
//   to: n.to,
//   text: n.text,
//   tone: n.tone,
//   read: n.read,
//   ts: n.ts,
// });

// export async function listNotifications(req, res) {
//   try {
//     const to = audienceOf(req.user);
//     if (!to) return res.json({ notifications: [] });
//     const rows = await Notification.find({ to }).sort({ ts: -1 }).limit(100);
//     return res.json({ notifications: rows.map(toClient) });
//   } catch (error) {
//     console.error('List notifications error:', error);
//     return res.status(500).json({ message: 'Unable to fetch notifications.' });
//   }
// }

// export async function markAllRead(req, res) {
//   try {
//     const to = audienceOf(req.user);
//     if (to) await Notification.updateMany({ to, read: false }, { $set: { read: true } });
//     return res.json({ message: 'Marked as read.' });
//   } catch (error) {
//     console.error('Mark read error:', error);
//     return res.status(500).json({ message: 'Unable to update notifications.' });
//   }
// }

import Notification from '../models/Notification.js';

/**
 * Create a notification. Never throws: a failed notification must never break
 * the real action (applying, paying, resolving a grievance, ...).
 * `to` is 'ADMIN' or a student's roll number.
 */
export async function notify(to, text, tone = 'info') {
  try {
    if (!to) return;
    await Notification.create({ to, text, tone });
  } catch (error) {
    console.error('Notify error:', error.message);
  }
}

/**
 * Admin-specific audience key. Notifications sent to 'ADMIN' are broadcast to
 * every admin; 'ADMIN:<email>' reaches only that one admin (e.g. committee invites).
 */
export const adminAudience = (email) => `ADMIN:${String(email || '').trim().toLowerCase()}`;

// All audience keys a logged-in user can read
const audiencesOf = (user) => {
  if (user.role === 'admin') return ['ADMIN', adminAudience(user.email)];
  return user.rollNo ? [user.rollNo] : [];
};

const toClient = (n) => ({
  id: String(n._id),
  // Personal admin notifications are shown to the client as plain 'ADMIN' ones
  to: String(n.to).startsWith('ADMIN:') ? 'ADMIN' : n.to,
  text: n.text,
  tone: n.tone,
  read: n.read,
  ts: n.ts,
});

export async function listNotifications(req, res) {
  try {
    const audiences = audiencesOf(req.user);
    if (!audiences.length) return res.json({ notifications: [] });
    const rows = await Notification.find({ to: { $in: audiences } }).sort({ ts: -1 }).limit(100);
    return res.json({ notifications: rows.map(toClient) });
  } catch (error) {
    console.error('List notifications error:', error);
    return res.status(500).json({ message: 'Unable to fetch notifications.' });
  }
}

export async function markAllRead(req, res) {
  try {
    const audiences = audiencesOf(req.user);
    if (audiences.length) {
      await Notification.updateMany({ to: { $in: audiences }, read: false }, { $set: { read: true } });
    }
    return res.json({ message: 'Marked as read.' });
  } catch (error) {
    console.error('Mark read error:', error);
    return res.status(500).json({ message: 'Unable to update notifications.' });
  }
}