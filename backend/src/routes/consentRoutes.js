import { Router } from 'express';
import {
  grantConsentGranular,
  revokeConsentGranular,
  grantConsentTier,
  revokeConsentTier,
  getActiveConsents,
  getRevokedConsents
} from '../controllers/consentController.js';
import { authenticate, requireApprovedAccount } from '../middleware/auth.js';

const router = Router();

// All routes require authentication
router.use(authenticate);
router.use(requireApprovedAccount());

// Granular Consent Routes
router.post('/grant-granular', grantConsentGranular);
router.delete('/revoke-granular/:id', revokeConsentGranular);

// Tier-Based Consent Routes
router.post('/grant-tier', grantConsentTier);
router.delete('/revoke-tier/:id', revokeConsentTier);

// Get consents
router.get('/active', getActiveConsents);
router.get('/revoked', getRevokedConsents);

export default router;
