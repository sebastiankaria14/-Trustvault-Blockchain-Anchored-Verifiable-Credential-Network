import React from 'react';
import { useAuth } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';

const InstitutionDashboard = () => {
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
          <h1 className="text-2xl font-bold text-gray-900">Institution Dashboard</h1>
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
          <h2 className="text-xl font-semibold mb-4">Welcome, {user?.name}!</h2>
          <p className="text-gray-600 mb-2">
            <strong>Email:</strong> {user?.email}
          </p>
          <p className="text-gray-600 mb-2">
            <strong>Type:</strong> {user?.type}
          </p>
          <p className="text-gray-600 mb-2">
            <strong>Verification Status:</strong>{' '}
            <span
              className={`px-2 py-1 rounded text-sm ${
                user?.verification_status === 'approved' || user?.verificationStatus === 'approved'
                  ? 'bg-green-100 text-green-800'
                  : 'bg-yellow-100 text-yellow-800'
              }`}
            >
              {user?.verification_status || user?.verificationStatus || 'Pending'}
            </span>
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold">Credentials Issued</h3>
              <div className="bg-indigo-100 text-indigo-600 rounded-full w-12 h-12 flex items-center justify-center text-xl font-bold">
                0
              </div>
            </div>
            <p className="text-gray-600 text-sm">Total credentials issued</p>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold">Active Credentials</h3>
              <div className="bg-green-100 text-green-600 rounded-full w-12 h-12 flex items-center justify-center text-xl font-bold">
                0
              </div>
            </div>
            <p className="text-gray-600 text-sm">Currently active credentials</p>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold">Revoked</h3>
              <div className="bg-red-100 text-red-600 rounded-full w-12 h-12 flex items-center justify-center text-xl font-bold">
                0
              </div>
            </div>
            <p className="text-gray-600 text-sm">Revoked credentials</p>
          </div>
        </div>

        {(user?.verification_status === 'pending' || user?.verificationStatus === 'pending') && (
          <div className="mt-8 bg-yellow-50 border border-yellow-200 rounded-lg p-6">
            <h3 className="text-lg font-semibold text-yellow-900 mb-2">Pending Approval</h3>
            <p className="text-yellow-800 mb-4">
              Your institution account is pending admin approval. You'll be able to issue credentials once approved.
            </p>
          </div>
        )}

        {(user?.verification_status === 'approved' || user?.verificationStatus === 'approved') && (
          <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-6">
            <button className="bg-indigo-600 text-white p-6 rounded-lg hover:bg-indigo-700 text-left">
              <h3 className="text-lg font-semibold mb-2">Issue New Credential</h3>
              <p className="text-indigo-100 text-sm">Create and issue a new credential to a user</p>
            </button>

            <button className="bg-green-600 text-white p-6 rounded-lg hover:bg-green-700 text-left">
              <h3 className="text-lg font-semibold mb-2">View All Credentials</h3>
              <p className="text-green-100 text-sm">Manage all issued credentials</p>
            </button>
          </div>
        )}
      </main>
    </div>
  );
};

export default InstitutionDashboard;
