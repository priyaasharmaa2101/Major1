
// import { Router } from 'express';

// import {
//   getCommittees,
//   getCommittee,
//   createCommittee,
//   updateCommittee,
//   deleteCommittee,
//   inviteCollaborator,
//   removeCollaborator,
//   respondToInvite
  
// } from '../controllers/committeeController.js';

// import { requireAuth, requireRole } from '../middleware/auth.js';

// const router = Router();

// // Logged-in users can view committees
// router.get('/', requireAuth, getCommittees);
// router.get('/:id', requireAuth, getCommittee);

// // Only admins can manage committees
// router.post('/', requireAuth, requireRole('admin'), createCommittee);
// router.put('/:id', requireAuth, requireRole('admin'), updateCommittee);
// router.delete('/:id', requireAuth, requireRole('admin'), deleteCommittee);

// router.post('/:id/invite', requireAuth, requireRole('admin'), inviteCollaborator);
// router.delete('/:id/collaborators/:email', requireAuth, requireRole('admin'), removeCollaborator);
// router.post('/:id/respond', requireAuth, requireRole('admin'), respondToInvite);
// export default router;


import { Router } from 'express';

import {
  getCommittees,
  getCommittee,
  createCommittee,
  updateCommittee,
  deleteCommittee,
  inviteCollaborator,
  removeCollaborator,
  respondToInvite,
  lookupCollaborator
  
} from '../controllers/committeeController.js';

import { requireAuth, requireRole } from '../middleware/auth.js';

const router = Router();

// Logged-in users can view committees
router.get('/', requireAuth, getCommittees);
router.get('/collaborator-lookup', requireAuth, requireRole('admin'), lookupCollaborator);
router.get('/:id', requireAuth, getCommittee);

// Only admins can manage committees
router.post('/', requireAuth, requireRole('admin'), createCommittee);
router.put('/:id', requireAuth, requireRole('admin'), updateCommittee);
router.delete('/:id', requireAuth, requireRole('admin'), deleteCommittee);

router.post('/:id/invite', requireAuth, requireRole('admin'), inviteCollaborator);
router.delete('/:id/collaborators/:email', requireAuth, requireRole('admin'), removeCollaborator);
router.post('/:id/respond', requireAuth, requireRole('admin'), respondToInvite);
export default router;