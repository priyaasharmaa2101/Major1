import { Router } from 'express';
import { requireAuth, requireRole } from '../middleware/auth.js';
import { listSlots, createSlot, generateSlots, deleteSlot } from '../controllers/slotController.js';

const router = Router();

router.get('/', requireAuth, listSlots);
router.post('/', requireAuth, requireRole('admin'), createSlot);
router.post('/generate', requireAuth, requireRole('admin'), generateSlots);
router.delete('/:id', requireAuth, requireRole('admin'), deleteSlot);

export default router;