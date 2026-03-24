import { Router } from 'express';
import {
  getUserCredentials,
  getCredentialById,
  getCredentialLogs,
  getUserAuditLog,
  getDashboardStats,
  updateProfile,
  getProfile
} from '../controllers/credentialController.js';
import { authenticate } from '../middleware/auth.js';

const router = Router();

// All routes require authentication
router.use(authenticate);

// Dashboard
router.get('/dashboard/stats', getDashboardStats);

// Credentials
router.get('/credentials', getUserCredentials);
router.get('/credentials/:id', getCredentialById);
router.get('/credentials/:id/logs', getCredentialLogs);

// Audit Log
router.get('/audit-log', getUserAuditLog);

// Profile
router.get('/profile', getProfile);
router.put('/profile', updateProfile);

export default router;
