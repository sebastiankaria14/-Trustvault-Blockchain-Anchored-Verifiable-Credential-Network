import React, { createContext, useState, useContext, useEffect } from 'react';
import { getCurrentUser, logout as logoutAPI, storeAuthData, getStoredUser } from '../services/api';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [userType, setUserType] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // Check if user is logged in on mount
  useEffect(() => {
    checkAuthStatus();
  }, []);

  const checkAuthStatus = async () => {
    try {
      const storedData = getStoredUser();

      if (storedData) {
        // Verify token with backend
        const response = await getCurrentUser();
        if (response.success) {
          setUser(response.data.user);
          setUserType(response.data.userType);
          setIsAuthenticated(true);
        }
      }
    } catch (error) {
      console.error('Auth check failed:', error);
      // Clear invalid auth data
      logout();
    } finally {
      setLoading(false);
    }
  };

  const login = (token, userData, type) => {
    storeAuthData(token, userData, type);
    setUser(userData);
    setUserType(type);
    setIsAuthenticated(true);
  };

  const logout = () => {
    logoutAPI();
    setUser(null);
    setUserType(null);
    setIsAuthenticated(false);
  };

  const updateUser = (userData) => {
    setUser(userData);
    const storedData = getStoredUser();
    if (storedData) {
      storeAuthData(localStorage.getItem('token'), userData, storedData.userType);
    }
  };

  const value = {
    user,
    userType,
    loading,
    isAuthenticated,
    login,
    logout,
    updateUser,
    checkAuthStatus
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export default AuthContext;
