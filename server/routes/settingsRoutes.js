import { Router } from 'express';
import { requireAuth, requireRole } from '../middleware/auth.js';
import { getSettings, updateSettings } from '../controllers/settingsController.js';

const router = Router();
router.get('/', requireAuth, getSettings);
router.put('/', requireAuth, requireRole('admin'), updateSettings);
export default router;