import React from 'react';
import { useAuth } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';

const UserDashboard = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold text-gray-900">User Dashboard</h1>
          <button
            onClick={handleLogout}
            className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
          >
            Logout
          </button>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white rounded-lg shadow p-6 mb-6">
          <h2 className="text-xl font-semibold mb-4">Welcome, {user?.first_name || user?.firstName}!</h2>
          <p className="text-gray-600 mb-2">
            <strong>Email:</strong> {user?.email}
          </p>
          <p className="text-gray-600 mb-2">
            <strong>KYC Status:</strong>{' '}
            <span
              className={`px-2 py-1 rounded text-sm ${
                user?.kyc_status === 'approved' || user?.kycStatus === 'approved'
                  ? 'bg-green-100 text-green-800'
                  : 'bg-yellow-100 text-yellow-800'
              }`}
            >
              {user?.kyc_status || user?.kycStatus || 'Pending'}
            </span>
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold">My Credentials</h3>
              <div className="bg-indigo-100 text-indigo-600 rounded-full w-12 h-12 flex items-center justify-center text-xl font-bold">
                0
              </div>
            </div>
            <p className="text-gray-600 text-sm">Total credentials in your wallet</p>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold">Verifications</h3>
              <div className="bg-green-100 text-green-600 rounded-full w-12 h-12 flex items-center justify-center text-xl font-bold">
                0
              </div>
            </div>
            <p className="text-gray-600 text-sm">Total verification requests</p>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold">Active Consents</h3>
              <div className="bg-blue-100 text-blue-600 rounded-full w-12 h-12 flex items-center justify-center text-xl font-bold">
                0
              </div>
            </div>
            <p className="text-gray-600 text-sm">Active sharing permissions</p>
          </div>
        </div>

        <div className="mt-8 bg-blue-50 border border-blue-200 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-blue-900 mb-2">Complete Your Profile</h3>
          <p className="text-blue-800 mb-4">
            Complete KYC verification to start receiving and managing credentials.
          </p>
          <button className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
            Start KYC Verification
          </button>
        </div>
      </main>
    </div>
  );
};

export default UserDashboard;
