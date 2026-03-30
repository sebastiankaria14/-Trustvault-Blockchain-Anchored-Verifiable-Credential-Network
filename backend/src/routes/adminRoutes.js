import { Router } from 'express';
import {
  getAdminStats,
  getAdminUsers,
  updateUserStatus,
  approveUserKyc,
  getAdminInstitutions,
  approveInstitution,
  getAdminVerifiers,
  approveVerifier,
  getAdminApprovalLogs,
  getAdminApprovalChecklist,
  updateAdminApprovalChecklistItem,
  getAdminKycReviewCase,
  updateAdminReviewDocumentStatus,
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
router.put('/user/:id/approve', approveUserKyc);

router.get('/institutions', getAdminInstitutions);
router.put('/institution/:id/approve', approveInstitution);

router.get('/verifiers', getAdminVerifiers);
router.put('/verifier/:id/approve', approveVerifier);
router.get('/approval-logs', getAdminApprovalLogs);
router.get('/checklist/:entityType/:entityId', getAdminApprovalChecklist);
router.put('/checklist/:entityType/:entityId/:checklistKey', updateAdminApprovalChecklistItem);
router.get('/review/:entityType/:entityId', getAdminKycReviewCase);
router.patch('/review/:entityType/:entityId/documents/:documentId', updateAdminReviewDocumentStatus);

router.get('/blockchain', getAdminBlockchainLogs);

router.get('/settings', getAdminSettings);
router.put('/settings/:key', upsertAdminSetting);

export default router;