import { Router } from 'express';
import { requireAuth, requireRole } from '../middleware/auth.js';
import { listApplications, applyToCommittee, updateApplication, bookSlot } from '../controllers/applicationController.js';

const router = Router();

router.get('/', requireAuth, listApplications);
router.post('/', requireAuth, requireRole('student'), applyToCommittee);
router.patch('/:id', requireAuth, requireRole('admin'), updateApplication);
router.post('/:id/slot', requireAuth, bookSlot);
export default router;