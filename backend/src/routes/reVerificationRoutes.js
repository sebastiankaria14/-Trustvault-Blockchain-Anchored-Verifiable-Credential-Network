import { Router } from 'express';
import {
  requestReVerification,
  getUserReVerificationRequests,
  approveReVerification,
  declineReVerification,
  getReVerificationStatus
} from '../controllers/reVerificationController.js';
import { authenticate } from '../middleware/auth.js';

const router = Router();

// All routes require authentication
router.use(authenticate);

// User endpoints - GET pending re-verification requests
router.get('/user/re-verification-requests', getUserReVerificationRequests);

// User endpoints - Get status of specific request
router.get('/user/re-verification-requests/:requestId', getReVerificationStatus);

// User endpoints - Approve re-verification request
router.post('/user/re-verification-requests/:requestId/approve', approveReVerification);

// User endpoints - Decline re-verification request
router.post('/user/re-verification-requests/:requestId/decline', declineReVerification);

// Verifier endpoints - Request re-verification
router.post('/verifier/credentials/:credentialId/request-re-verification', requestReVerification);

export default router;
