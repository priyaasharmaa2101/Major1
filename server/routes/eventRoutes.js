import { Router } from 'express';
import { requireAuth, requireRole } from '../middleware/auth.js';
import { getEvents, createEvent, updateEvent, deleteEvent } from '../controllers/eventController.js';

const router = Router();
router.get('/', requireAuth, getEvents);
router.post('/', requireAuth, requireRole('admin'), createEvent);
router.put('/:id', requireAuth, requireRole('admin'), updateEvent);
router.delete('/:id', requireAuth, requireRole('admin'), deleteEvent);
export default router;