import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const getApprovalStatus = (currentUserType, currentUser) => {
  if (!currentUserType || !currentUser) {
    return null;
  }

  if (currentUserType === 'user') {
    return currentUser.kyc_status || currentUser.kycStatus || null;
  }

  if (currentUserType === 'institution' || currentUserType === 'verifier') {
    return currentUser.verification_status || currentUser.verificationStatus || null;
  }

  return null;
};

const ProtectedRoute = ({ children, allowedUserTypes = [], allowPending = false }) => {
  const { isAuthenticated, userType, user, loading } = useAuth();
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
    } else if (userType === 'admin') {
      return <Navigate to="/admin/dashboard" replace />;
    }
  }

  const approvalStatus = getApprovalStatus(userType, user);
  const isNonAdmin = userType === 'user' || userType === 'institution' || userType === 'verifier';

  if (isNonAdmin && approvalStatus && approvalStatus !== 'approved' && !allowPending) {
    return <Navigate to="/verification-center" replace />;
  }

  return children;
};

export default ProtectedRoute;
