const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

/**
 * Helper function to make API requests
 */
const apiRequest = async (endpoint, options = {}) => {
  const token = localStorage.getItem('token');

  const headers = {
    'Content-Type': 'application/json',
    ...(token && { Authorization: `Bearer ${token}` }),
    ...options.headers
  };

  try {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      ...options,
      headers
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || 'Something went wrong');
    }

    return data;
  } catch (error) {
    throw error;
  }
};

/**
 * Register a new user
 */
export const registerUser = async (userData) => {
  return apiRequest('/auth/register/user', {
    method: 'POST',
    body: JSON.stringify(userData)
  });
};

/**
 * Register a new institution
 */
export const registerInstitution = async (institutionData) => {
  return apiRequest('/auth/register/institution', {
    method: 'POST',
    body: JSON.stringify(institutionData)
  });
};

/**
 * Register a new verifier
 */
export const registerVerifier = async (verifierData) => {
  return apiRequest('/auth/register/verifier', {
    method: 'POST',
    body: JSON.stringify(verifierData)
  });
};

/**
 * Login user
 */
export const login = async (email, password, userType = 'user') => {
  return apiRequest('/auth/login', {
    method: 'POST',
    body: JSON.stringify({ email, password, userType })
  });
};

/**
 * Get current user profile
 */
export const getCurrentUser = async () => {
  return apiRequest('/auth/me', {
    method: 'GET'
  });
};

/**
 * Logout user
 */
export const logout = () => {
  localStorage.removeItem('token');
  localStorage.removeItem('user');
  localStorage.removeItem('userType');
};

/**
 * Check if user is authenticated
 */
export const isAuthenticated = () => {
  return !!localStorage.getItem('token');
};

/**
 * Get stored token
 */
export const getToken = () => {
  return localStorage.getItem('token');
};

/**
 * Store authentication data
 */
export const storeAuthData = (token, user, userType) => {
  localStorage.setItem('token', token);
  localStorage.setItem('user', JSON.stringify(user));
  localStorage.setItem('userType', userType);
};

/**
 * Get stored user data
 */
export const getStoredUser = () => {
  const user = localStorage.getItem('user');
  const userType = localStorage.getItem('userType');
  return user ? { user: JSON.parse(user), userType } : null;
};

// ==========================================
// User Dashboard & Wallet API Functions
// ==========================================

/**
 * Get user dashboard statistics
 */
export const getDashboardStats = async () => {
  return apiRequest('/user/dashboard/stats', { method: 'GET' });
};

/**
 * Get all user credentials
 */
export const getUserCredentials = async () => {
  return apiRequest('/user/credentials', { method: 'GET' });
};

/**
 * Get single credential by ID
 */
export const getCredentialById = async (id) => {
  return apiRequest(`/user/credentials/${id}`, { method: 'GET' });
};

/**
 * Get verification logs for a credential
 */
export const getCredentialLogs = async (id) => {
  return apiRequest(`/user/credentials/${id}/logs`, { method: 'GET' });
};

/**
 * Get user audit log
 */
export const getUserAuditLog = async () => {
  return apiRequest('/user/audit-log', { method: 'GET' });
};

/**
 * Get user profile
 */
export const getUserProfile = async () => {
  return apiRequest('/user/profile', { method: 'GET' });
};

/**
 * Update user profile
 */
export const updateUserProfile = async (profileData) => {
  return apiRequest('/user/profile', {
    method: 'PUT',
    body: JSON.stringify(profileData)
  });
};

export default {
  registerUser,
  registerInstitution,
  registerVerifier,
  login,
  logout,
  getCurrentUser,
  isAuthenticated,
  getToken,
  storeAuthData,
  getStoredUser,
  getDashboardStats,
  getUserCredentials,
  getCredentialById,
  getCredentialLogs,
  getUserAuditLog,
  getUserProfile,
  updateUserProfile
};
