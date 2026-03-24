import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const ProtectedRoute = ({ children, allowedUserTypes = [] }) => {
  const { isAuthenticated, userType, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    // Redirect to login page with the return url
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // Check if user type is allowed
  if (allowedUserTypes.length > 0 && !allowedUserTypes.includes(userType)) {
    // Redirect to their appropriate dashboard
    if (userType === 'user') {
      return <Navigate to="/user/dashboard" replace />;
    } else if (userType === 'institution') {
      return <Navigate to="/institution/dashboard" replace />;
    } else if (userType === 'verifier') {
      return <Navigate to="/verifier/dashboard" replace />;
    }
  }

  return children;
};

export default ProtectedRoute;
