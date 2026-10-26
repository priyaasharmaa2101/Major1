import { Router } from 'express';
import { login, signup } from '../controllers/authController.js';
import { requireAuth, requireRole } from '../middleware/auth.js';

const router = Router();
router.post('/signup', signup);
router.post('/login', login);
router.get('/me', requireAuth, (req, res) => res.json({ user: { id: req.user._id, name: req.user.name, email: req.user.email, rollNo: req.user.rollNo, role: req.user.role } }));
router.get('/admin-check', requireAuth, requireRole('admin'), (req, res) => res.json({ message: 'Admin access granted.' }));
export default router;
