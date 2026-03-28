import { Router } from 'express';
import {
  getAdminStats,
  getAdminUsers,
  updateUserStatus,
  getAdminInstitutions,
  approveInstitution,
  getAdminVerifiers,
  approveVerifier,
  getAdminBlockchainLogs,
  getAdminSettings,
  upsertAdminSetting
} from '../controllers/adminController.js';
import { authenticate, authorizeUserType } from '../middleware/auth.js';

const router = Router();

// All admin routes require authentication and admin role.
router.use(authenticate);
router.use(authorizeUserType('admin'));

router.get('/stats', getAdminStats);

router.get('/users', getAdminUsers);
router.patch('/users/:id/status', updateUserStatus);

router.get('/institutions', getAdminInstitutions);
router.put('/institution/:id/approve', approveInstitution);

router.get('/verifiers', getAdminVerifiers);
router.put('/verifier/:id/approve', approveVerifier);

router.get('/blockchain', getAdminBlockchainLogs);

router.get('/settings', getAdminSettings);
router.put('/settings/:key', upsertAdminSetting);

export default router;