import { Router } from 'express';
import {
  getVerifierDashboardStats,
  getVerificationRequests,
  getCredentialForVerification,
  verifyCredential,
  getVerificationHistory,
  getVerifierProfile,
  updateVerifierProfile,
  downloadCredentialPDF
} from '../controllers/verifierController.js';
import { authenticate, authorizeUserType } from '../middleware/auth.js';

const router = Router();

// All routes require authentication and must be verifier
router.use(authenticate);
router.use(authorizeUserType('verifier'));

// Dashboard
router.get('/dashboard/stats', getVerifierDashboardStats);

// Verification Requests
router.get('/verification-requests', getVerificationRequests);
router.get('/credential/:id', getCredentialForVerification);
router.post('/credential/:id/verify', verifyCredential);

// Verification History
router.get('/history', getVerificationHistory);

// Download
router.get('/credential/:id/download', downloadCredentialPDF);

// Profile
router.get('/profile', getVerifierProfile);
router.put('/profile', updateVerifierProfile);

export default router;
