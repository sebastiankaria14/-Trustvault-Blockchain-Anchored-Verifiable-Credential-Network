import { Router } from 'express';
import {
  getInstitutionStats,
  issueCredential,
  getInstitutionCredentials,
  revokeCredential,
  getInstitutionHistory
} from '../controllers/institutionController.js';
import { authenticate, authorizeUserType, requireApprovedAccount } from '../middleware/auth.js';

const router = Router();

// All routes require authentication
router.use(authenticate);
router.use(authorizeUserType('institution'));
router.use(requireApprovedAccount());

// Dashboard
router.get('/dashboard/stats', getInstitutionStats);

// Credentials
router.post('/credentials', issueCredential);
router.get('/credentials', getInstitutionCredentials);
router.delete('/credentials/:id', revokeCredential);

// History
router.get('/history', getInstitutionHistory);

export default router;
