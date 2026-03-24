import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';

dotenv.config();

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-change-in-production';
const JWT_EXPIRE = process.env.JWT_EXPIRE || '7d';

/**
 * Generate JWT token
 * @param {object} payload - Data to encode in token
 * @returns {string} JWT token
 */
export const generateToken = (payload) => {
  return jwt.sign(payload, JWT_SECRET, {
    expiresIn: JWT_EXPIRE
  });
};

/**
 * Verify JWT token
 * @param {string} token - JWT token to verify
 * @returns {object} Decoded token payload
 */
export const verifyToken = (token) => {
  try {
    return jwt.verify(token, JWT_SECRET);
  } catch (error) {
    throw new Error('Invalid or expired token');
  }
};

/**
 * Generate token for specific user types
 * @param {object} user - User object
 * @param {string} userType - Type of user (user, institution, verifier, admin)
 * @returns {string} JWT token
 */
export const generateAuthToken = (user, userType = 'user') => {
  const payload = {
    id: user.id,
    email: user.email,
    userType: userType,
    ...(userType === 'institution' && { institutionName: user.name }),
    ...(userType === 'verifier' && { companyName: user.company_name })
  };

  return generateToken(payload);
};

export default {
  generateToken,
  verifyToken,
  generateAuthToken
};
