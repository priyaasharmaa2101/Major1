import { Router } from 'express';
import { requireAuth, requireRole } from '../middleware/auth.js';
import { listPayments, createPayment, verifyPayment, rejectPayment } from '../controllers/paymentController.js';

const router = Router();
router.get('/', requireAuth, listPayments);
router.post('/', requireAuth, requireRole('student'), createPayment);
router.patch('/:id/verify', requireAuth, requireRole('admin'), verifyPayment);
router.patch('/:id/reject', requireAuth, requireRole('admin'), rejectPayment);
export default router;