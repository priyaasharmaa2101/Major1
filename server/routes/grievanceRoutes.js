import { Router } from 'express';
import { requireAuth, requireRole } from '../middleware/auth.js';
import { listGrievances, createGrievance, updateGrievance } from '../controllers/grievanceController.js';

const router = Router();
router.get('/', requireAuth, listGrievances);
router.post('/', requireAuth, requireRole('student'), createGrievance);
router.patch('/:id', requireAuth, requireRole('admin'), updateGrievance);
export default router;