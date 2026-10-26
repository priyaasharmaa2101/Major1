import jwt from 'jsonwebtoken';
import User from '../models/User.js';
import Admin from '../models/Admin.js';
export async function requireAuth(req, res, next) {
  try {
    const header = req.headers.authorization || '';
    const token = header.startsWith('Bearer ') ? header.slice(7) : '';
    if (!token || !process.env.JWT_SECRET) return res.status(401).json({ message: 'Authentication required.' });
    const payload = jwt.verify(token, process.env.JWT_SECRET);
    const Model = payload.role === 'admin' ? Admin : User;
    const account = await Model.findById(payload.sub);
    if (!account) return res.status(401).json({ message: 'Account no longer exists.' });
    req.user = account; next();
  } catch { return res.status(401).json({ message: 'Session expired or invalid token.' }); }
}
export function requireRole(role) {
  return (req, res, next) => req.user?.role === role ? next() : res.status(403).json({ message: 'You do not have permission to access this resource.' });
}
