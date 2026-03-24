import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';

const UserDashboard = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const stats = [
    {
      title: 'My Credentials',
      value: 0,
      description: 'Total credentials in your wallet',
      icon: '📄',
      color: 'from-blue-500 to-cyan-500',
      bgColor: 'bg-blue-50',
    },
    {
      title: 'Verifications',
      value: 0,
      description: 'Total verification requests',
      icon: '✓',
      color: 'from-green-500 to-emerald-500',
      bgColor: 'bg-green-50',
    },
    {
      title: 'Active Consents',
      value: 0,
      description: 'Active sharing permissions',
      icon: '🔄',
      color: 'from-purple-500 to-pink-500',
      bgColor: 'bg-purple-50',
    },
  ];

  const kycStatus = user?.kyc_status || user?.kycStatus || 'pending';
  const isKycApproved = kycStatus === 'approved';

  return (
    <div className="min-h-screen bg-gradient-to-br from-neutral-50 via-blue-50 to-neutral-50">
      {/* Header */}
      <header className="bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 bg-white/20 backdrop-blur-lg rounded-full flex items-center justify-center text-2xl font-bold border border-white/30">
                {(user?.first_name || user?.firstName || 'U')[0].toUpperCase()}
              </div>
              <div>
                <h1 className="text-3xl font-bold">Welcome, {user?.first_name || user?.firstName || 'User'}!</h1>
                <p className="text-blue-100 text-sm mt-1">{user?.email}</p>
              </div>
            </div>

            <div className="relative">
              <button
                onClick={() => setShowLogoutConfirm(!showLogoutConfirm)}
                className="btn bg-white/20 hover:bg-white/30 text-white border border-white/30 backdrop-blur-lg transition-all duration-200"
              >
                Logout
              </button>
              {showLogoutConfirm && (
                <div className="absolute right-0 top-full mt-2 bg-white rounded-lg shadow-xl p-4 min-w-max z-50 slide-in-down">
                  <p className="text-neutral-900 font-medium mb-3">Are you sure you want to logout?</p>
                  <div className="flex gap-2">
                    <button
                      onClick={handleLogout}
                      className="btn btn-sm bg-error-600 text-white hover:bg-error-700"
                    >
                      Yes, Logout
                    </button>
                    <button
                      onClick={() => setShowLogoutConfirm(false)}
                      className="btn btn-sm btn-outline"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* KYC Status Card */}
        <div className={`slide-in-up mb-8 card ${isKycApproved ? 'border-2 border-success-300 bg-success-50' : 'border-2 border-warning-300 bg-warning-50'}`}>
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-bold text-neutral-900 mb-1">
                KYC Verification Status
              </h2>
              <p className={`text-sm ${isKycApproved ? 'text-success-700' : 'text-warning-700'}`}>
                {isKycApproved
                  ? '✓ Your account is fully verified'
                  : '⏳ Complete your KYC verification to unlock all features'}
              </p>
            </div>
            <div className={`px-6 py-3 rounded-full font-bold uppercase tracking-wide text-sm ${
              isKycApproved
                ? 'bg-success-500 text-white'
                : 'bg-warning-500 text-white'
            }`}>
              {isKycApproved ? 'Verified' : 'Pending'}
            </div>
          </div>
          {!isKycApproved && (
            <button
              onClick={() => {/* Navigate to KYC flow */}}
              className="mt-4 btn btn-primary"
              data-ripple
            >
              Start KYC Verification →
            </button>
          )}
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          {stats.map((stat, index) => (
            <div
              key={index}
              className={`slide-in-up card hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1`}
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <div className="flex items-start justify-between mb-4">
                <div>
                  <p className="text-neutral-600 text-sm font-medium mb-2">{stat.title}</p>
                  <div className={`text-4xl font-bold bg-gradient-to-r ${stat.color} bg-clip-text text-transparent`} data-count={stat.value} data-duration="1000">
                    {stat.value}
                  </div>
                </div>
                <div className={`${stat.bgColor} rounded-full w-16 h-16 flex items-center justify-center text-3xl font-bold`}>
                  {stat.icon}
                </div>
              </div>
              <p className="text-neutral-500 text-xs">{stat.description}</p>
              <div className="mt-4 h-1 bg-neutral-200 rounded-full overflow-hidden">
                <div className={`h-full bg-gradient-to-r ${stat.color} w-1/3`} />
              </div>
            </div>
          ))}
        </div>

        {/* Quick Actions */}
        <div className="slide-in-up card mb-8">
          <h3 className="text-lg font-bold text-neutral-900 mb-4">Quick Actions</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <button
              data-ripple
              onClick={() => {/* Request credential */}}
              className="p-4 border-2 border-neutral-200 rounded-xl hover:border-blue-500 hover:bg-blue-50 transition-all duration-200 text-left group"
            >
              <div className="text-2xl mb-2">📥</div>
              <h4 className="font-semibold text-neutral-900 group-hover:text-blue-600 transition-colors">Request Credentials</h4>
              <p className="text-sm text-neutral-600 mt-1">Request credentials from institutions</p>
            </button>

            <button
              data-ripple
              onClick={() => {/* View credentials */}}
              className="p-4 border-2 border-neutral-200 rounded-xl hover:border-purple-500 hover:bg-purple-50 transition-all duration-200 text-left group"
            >
              <div className="text-2xl mb-2">👁️</div>
              <h4 className="font-semibold text-neutral-900 group-hover:text-purple-600 transition-colors">View Wallet</h4>
              <p className="text-sm text-neutral-600 mt-1">See all your stored credentials</p>
            </button>

            <button
              data-ripple
              onClick={() => {/* Manage consents */}}
              className="p-4 border-2 border-neutral-200 rounded-xl hover:border-green-500 hover:bg-green-50 transition-all duration-200 text-left group"
            >
              <div className="text-2xl mb-2">🔐</div>
              <h4 className="font-semibold text-neutral-900 group-hover:text-green-600 transition-colors">Manage Consents</h4>
              <p className="text-sm text-neutral-600 mt-1">Control who can access your data</p>
            </button>

            <button
              data-ripple
              onClick={() => {/* Account settings */}}
              className="p-4 border-2 border-neutral-200 rounded-xl hover:border-orange-500 hover:bg-orange-50 transition-all duration-200 text-left group"
            >
              <div className="text-2xl mb-2">⚙️</div>
              <h4 className="font-semibold text-neutral-900 group-hover:text-orange-600 transition-colors">Account Settings</h4>
              <p className="text-sm text-neutral-600 mt-1">Manage your profile and preferences</p>
            </button>
          </div>
        </div>

        {/* Recent Activity */}
        <div className="slide-in-up card">
          <h3 className="text-lg font-bold text-neutral-900 mb-4">Recent Activity</h3>
          <div className="space-y-3">
            <div className="flex items-center justify-between p-3 bg-neutral-50 rounded-lg hover:bg-neutral-100 transition-colors">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center text-lg">📝</div>
                <div>
                  <p className="font-medium text-neutral-900 text-sm">Account Created</p>
                  <p className="text-xs text-neutral-600">Today</p>
                </div>
              </div>
              <span className="badge badge-primary">Today</span>
            </div>
          </div>
          <p className="text-center text-neutral-600 text-sm mt-4 py-4">
            No recent activity. Your actions will appear here.
          </p>
        </div>
      </main>

      <style>{`
        @keyframes slideInUp {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .slide-in-up {
          animation: slideInUp 0.6s ease-out forwards;
          opacity: 0;
        }

        [style*="animation-delay"] {
          animation: slideInUp 0.6s ease-out var(--animation-delay, 0s) forwards;
          opacity: 0;
        }
      `}</style>
    </div>
  );
};

export default UserDashboard;
