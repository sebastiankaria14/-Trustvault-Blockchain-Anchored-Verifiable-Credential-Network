import { verifyToken } from '../utils/jwt.js';
import { query } from '../utils/database.js';

/**
 * Middleware to authenticate JWT token
 */
export const authenticate = async (req, res, next) => {
  try {
    // Get token from header
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({
        success: false,
        message: 'Access denied. No token provided.'
      });
    }

    // Extract token
    const token = authHeader.substring(7); // Remove 'Bearer ' prefix

    // Verify token
    const decoded = verifyToken(token);

    // Attach user info to request
    req.user = decoded;

    next();
  } catch (error) {
    return res.status(401).json({
      success: false,
      message: 'Invalid or expired token',
      error: error.message
    });
  }
};

/**
 * Middleware to check if user is of specific type
 * @param {...string} allowedTypes - User types allowed (user, institution, verifier, admin)
 */
export const authorizeUserType = (...allowedTypes) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: 'Authentication required'
      });
    }

    if (!allowedTypes.includes(req.user.userType)) {
      return res.status(403).json({
        success: false,
        message: `Access denied. Required user type: ${allowedTypes.join(' or ')}`
      });
    }

    next();
  };
};

/**
 * Middleware to check if user owns the resource
 */
export const authorizeOwnership = (req, res, next) => {
  const resourceUserId = req.params.userId || req.body.userId;

  if (!req.user) {
    return res.status(401).json({
      success: false,
      message: 'Authentication required'
    });
  }

  if (req.user.id !== resourceUserId && req.user.userType !== 'admin') {
    return res.status(403).json({
      success: false,
      message: 'Access denied. You can only access your own resources.'
    });
  }

  next();
};

/**
 * Middleware to enforce approval/active status for protected routes.
 * This protects APIs even if a token was issued before suspension/rejection.
 */
export const requireApprovedAccount = () => {
  return async (req, res, next) => {
    try {
      if (!req.user) {
        return res.status(401).json({
          success: false,
          message: 'Authentication required'
        });
      }

      const { id, userType } = req.user;

      if (userType === 'admin') {
        const result = await query('SELECT is_active FROM admins WHERE id = $1', [id]);
        const account = result.rows[0];

        if (!account || !account.is_active) {
          return res.status(403).json({
            success: false,
            message: 'Admin account is inactive.',
            code: 'ACCOUNT_NOT_ACTIVE'
          });
        }

        return next();
      }

      if (userType === 'user') {
        const result = await query('SELECT is_active, kyc_status FROM users WHERE id = $1', [id]);
        const account = result.rows[0];

        if (!account) {
          return res.status(401).json({
            success: false,
            message: 'User account not found'
          });
        }

        if (!account.is_active) {
          return res.status(403).json({
            success: false,
            message: 'Your account has been deactivated. Please contact support.',
            code: 'ACCOUNT_NOT_ACTIVE'
          });
        }

        if (account.kyc_status !== 'approved') {
          return res.status(403).json({
            success: false,
            message: 'Your account is pending Super Admin KYC approval.',
            code: 'ACCOUNT_PENDING_APPROVAL',
            data: {
              userType,
              approvalStatus: account.kyc_status
            }
          });
        }

        return next();
      }

      if (userType === 'institution') {
        const result = await query('SELECT is_active, verification_status FROM institutions WHERE id = $1', [id]);
        const account = result.rows[0];

        if (!account) {
          return res.status(401).json({
            success: false,
            message: 'Institution account not found'
          });
        }

        if (!account.is_active) {
          return res.status(403).json({
            success: false,
            message: 'Your institution account has been deactivated.',
            code: 'ACCOUNT_NOT_ACTIVE'
          });
        }

        if (account.verification_status !== 'approved') {
          return res.status(403).json({
            success: false,
            message: 'Your institution account is pending Super Admin approval.',
            code: 'ACCOUNT_PENDING_APPROVAL',
            data: {
              userType,
              approvalStatus: account.verification_status
            }
          });
        }

        return next();
      }

      if (userType === 'verifier') {
        const result = await query('SELECT is_active, verification_status FROM verifiers WHERE id = $1', [id]);
        const account = result.rows[0];

        if (!account) {
          return res.status(401).json({
            success: false,
            message: 'Verifier account not found'
          });
        }

        if (!account.is_active) {
          return res.status(403).json({
            success: false,
            message: 'Your verifier account has been deactivated.',
            code: 'ACCOUNT_NOT_ACTIVE'
          });
        }

        if (account.verification_status !== 'approved') {
          return res.status(403).json({
            success: false,
            message: 'Your verifier account is pending Super Admin approval.',
            code: 'ACCOUNT_PENDING_APPROVAL',
            data: {
              userType,
              approvalStatus: account.verification_status
            }
          });
        }

        return next();
      }

      return next();
    } catch (error) {
      return res.status(500).json({
        success: false,
        message: 'Error validating account approval status',
        error: error.message
      });
    }
  };
};

/**
 * Middleware to enforce only active status (approval not required).
 * Used for verification-center flows where pending/rejected users must still access upload/status pages.
 */
export const requireActiveAccount = () => {
  return async (req, res, next) => {
    try {
      if (!req.user) {
        return res.status(401).json({
          success: false,
          message: 'Authentication required'
        });
      }

      const { id, userType } = req.user;

      if (userType === 'user') {
        const result = await query('SELECT is_active FROM users WHERE id = $1', [id]);
        const account = result.rows[0];

        if (!account || !account.is_active) {
          return res.status(403).json({
            success: false,
            message: 'Your account has been deactivated. Please contact support.',
            code: 'ACCOUNT_NOT_ACTIVE'
          });
        }
      } else if (userType === 'institution') {
        const result = await query('SELECT is_active FROM institutions WHERE id = $1', [id]);
        const account = result.rows[0];

        if (!account || !account.is_active) {
          return res.status(403).json({
            success: false,
            message: 'Your institution account has been deactivated.',
            code: 'ACCOUNT_NOT_ACTIVE'
          });
        }
      } else if (userType === 'verifier') {
        const result = await query('SELECT is_active FROM verifiers WHERE id = $1', [id]);
        const account = result.rows[0];

        if (!account || !account.is_active) {
          return res.status(403).json({
            success: false,
            message: 'Your verifier account has been deactivated.',
            code: 'ACCOUNT_NOT_ACTIVE'
          });
        }
      }

      return next();
    } catch (error) {
      return res.status(500).json({
        success: false,
        message: 'Error validating account active status',
        error: error.message
      });
    }
  };
};

export default {
  authenticate,
  authorizeUserType,
  authorizeOwnership,
  requireApprovedAccount,
  requireActiveAccount
};
