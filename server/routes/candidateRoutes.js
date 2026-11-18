import { Router } from 'express';
import { requireAuth, requireRole } from '../middleware/auth.js';
import { listCandidates, saveCandidate, deleteCandidate } from '../controllers/candidateController.js';

const router = Router();
router.get('/', requireAuth, listCandidates);
router.put('/:rollNo', requireAuth, requireRole('admin'), saveCandidate);
router.delete('/:rollNo', requireAuth, requireRole('admin'), deleteCandidate);
export default router;