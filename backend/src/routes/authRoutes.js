import express from 'express';
import {
  registerUser,
  registerInstitution,
  registerVerifier,
  login,
  getCurrentUser
} from '../controllers/authController.js';
import {
  userRegistrationRules,
  institutionRegistrationRules,
  verifierRegistrationRules,
  loginRules,
  validate
} from '../middleware/validation.js';
import { authenticate } from '../middleware/auth.js';

const router = express.Router();

/**
 * @route   POST /api/auth/register/user
 * @desc    Register a new user
 * @access  Public
 */
router.post(
  '/register/user',
  userRegistrationRules,
  validate,
  registerUser
);

/**
 * @route   POST /api/auth/register/institution
 * @desc    Register a new institution
 * @access  Public
 */
router.post(
  '/register/institution',
  institutionRegistrationRules,
  validate,
  registerInstitution
);

/**
 * @route   POST /api/auth/register/verifier
 * @desc    Register a new verifier
 * @access  Public
 */
router.post(
  '/register/verifier',
  verifierRegistrationRules,
  validate,
  registerVerifier
);

/**
 * @route   POST /api/auth/login
 * @desc    Login for all user types
 * @access  Public
 * @body    { email, password, userType } - userType: 'user', 'institution', or 'verifier'
 */
router.post(
  '/login',
  loginRules,
  validate,
  login
);

/**
 * @route   GET /api/auth/me
 * @desc    Get current authenticated user
 * @access  Private
 */
router.get(
  '/me',
  authenticate,
  getCurrentUser
);

/**
 * @route   POST /api/auth/logout
 * @desc    Logout user (client-side token removal)
 * @access  Public
 */
router.post('/logout', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'Logged out successfully. Please remove the token from client storage.'
  });
});

export default router;
