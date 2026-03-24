import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';

const VerifierDashboard = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const stats = [
    {
      title: 'Total Verifications',
      value: 0,
      description: 'Verifications performed',
      icon: '✓',
      color: 'from-blue-500 to-cyan-500',
      bgColor: 'bg-blue-50',
    },
    {
      title: 'Success Rate',
      value: '0%',
      description: 'Successful verifications',
      icon: '📈',
      color: 'from-green-500 to-emerald-500',
      bgColor: 'bg-green-50',
    },
    {
      title: 'API Calls',
      value: 0,
      description: 'API calls this month',
      icon: '🔌',
      color: 'from-purple-500 to-pink-500',
      bgColor: 'bg-purple-50',
    },
  ];

  const verificationStatus = user?.verification_status || user?.verificationStatus || 'pending';
  const isApproved = verificationStatus === 'approved';

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-blue-50 to-neutral-50">
      {/* Header */}
      <header className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-lg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 bg-white/20 backdrop-blur-lg rounded-full flex items-center justify-center text-2xl font-bold border border-white/30">
                {(user?.company_name || user?.companyName || 'V')[0].toUpperCase()}
              </div>
              <div>
                <h1 className="text-3xl font-bold">Welcome, {user?.company_name || user?.companyName || 'Verifier'}!</h1>
                <p className="text-indigo-100 text-sm mt-1">{user?.email}</p>
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
        {/* Verification Status Card */}
        <div className={`slide-in-up mb-8 card ${isApproved ? 'border-2 border-success-300 bg-success-50' : 'border-2 border-warning-300 bg-warning-50'}`}>
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-bold text-neutral-900 mb-1">
                Verifier Verification Status
              </h2>
              <p className={`text-sm ${isApproved ? 'text-success-700' : 'text-warning-700'}`}>
                <span className="text-lg">•</span> Industry: <strong>{user?.industry || 'N/A'}</strong>
              </p>
              <p className={`text-sm mt-1 ${isApproved ? 'text-success-700' : 'text-warning-700'}`}>
                {isApproved
                  ? '✓ Your organization is verified and can verify credentials'
                  : '⏳ Your organization is pending admin verification'}
              </p>
            </div>
            <div className={`px-6 py-3 rounded-full font-bold uppercase tracking-wide text-sm ${
              isApproved
                ? 'bg-success-500 text-white'
                : 'bg-warning-500 text-white'
            }`}>
              {isApproved ? 'Approved' : 'Pending'}
            </div>
          </div>
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
                  <div className={`text-4xl font-bold bg-gradient-to-r ${stat.color} bg-clip-text text-transparent`}>
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

        {/* Action Cards */}
        {isApproved ? (
          <div className="slide-in-up card mb-8">
            <h3 className="text-lg font-bold text-neutral-900 mb-4">Verification Actions</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <button
                data-ripple
                onClick={() => {/* Run verification */}}
                className="p-6 bg-gradient-to-br from-indigo-500 to-blue-500 text-white rounded-xl hover:shadow-xl transition-all duration-200 text-left group hover:-translate-y-1 transform"
              >
                <div className="text-3xl mb-3">⚡</div>
                <h4 className="text-lg font-bold group-hover:text-indigo-100 transition-colors">Run Verification</h4>
                <p className="text-indigo-100 text-sm mt-2">Verify a credential instantly</p>
              </button>

              <button
                data-ripple
                onClick={() => {/* View reports */}}
                className="p-6 bg-gradient-to-br from-blue-500 to-cyan-500 text-white rounded-xl hover:shadow-xl transition-all duration-200 text-left group hover:-translate-y-1 transform"
              >
                <div className="text-3xl mb-3">📊</div>
                <h4 className="text-lg font-bold group-hover:text-blue-100 transition-colors">View Reports</h4>
                <p className="text-blue-100 text-sm mt-2">Access verification history and detailed reports</p>
              </button>

              <button
                data-ripple
                onClick={() => {/* API keys */}}
                className="p-6 bg-gradient-to-br from-purple-500 to-indigo-500 text-white rounded-xl hover:shadow-xl transition-all duration-200 text-left group hover:-translate-y-1 transform"
              >
                <div className="text-3xl mb-3">🔑</div>
                <h4 className="text-lg font-bold group-hover:text-purple-100 transition-colors">API Keys</h4>
                <p className="text-purple-100 text-sm mt-2">Manage your API keys and integrations</p>
              </button>

              <button
                data-ripple
                onClick={() => {/* API docs */}}
                className="p-6 bg-gradient-to-br from-pink-500 to-purple-500 text-white rounded-xl hover:shadow-xl transition-all duration-200 text-left group hover:-translate-y-1 transform"
              >
                <div className="text-3xl mb-3">📖</div>
                <h4 className="text-lg font-bold group-hover:text-pink-100 transition-colors">API Documentation</h4>
                <p className="text-pink-100 text-sm mt-2">View API docs, examples, and code samples</p>
              </button>
            </div>
          </div>
        ) : (
          <div className="slide-in-up card border-2 border-warning-300 bg-warning-50 mb-8">
            <div className="text-center py-8">
              <div className="text-5xl mb-4">⏳</div>
              <h3 className="text-2xl font-bold text-warning-900 mb-2">Verification Pending</h3>
              <p className="text-warning-800 mb-6 max-w-md mx-auto">
                Your verifier account is currently under review by our administrators. You'll be able to verify credentials once your account is approved.
              </p>
              <p className="text-sm text-warning-700">
                📧 You'll receive an email notification once the review is complete.
              </p>
            </div>
          </div>
        )}

        {/* Quick Stats */}
        <div className="slide-in-up card mb-8">
          <h3 className="text-lg font-bold text-neutral-900 mb-4">API Usage This Month</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-gradient-to-br from-blue-50 to-blue-100 p-4 rounded-xl">
              <p className="text-neutral-600 text-sm font-medium mb-1">API Calls</p>
              <p className="text-3xl font-bold text-blue-600">0 / 10,000</p>
              <p className="text-xs text-neutral-600 mt-2">0% of quota used</p>
            </div>

            <div className="bg-gradient-to-br from-green-50 to-green-100 p-4 rounded-xl">
              <p className="text-neutral-600 text-sm font-medium mb-1">Success Rate</p>
              <p className="text-3xl font-bold text-green-600">—</p>
              <p className="text-xs text-neutral-600 mt-2">No verifications yet</p>
            </div>

            <div className="bg-gradient-to-br from-purple-50 to-purple-100 p-4 rounded-xl">
              <p className="text-neutral-600 text-sm font-medium mb-1">Avg. Response Time</p>
              <p className="text-3xl font-bold text-purple-600">—</p>
              <p className="text-xs text-neutral-600 mt-2">Real-time verification</p>
            </div>
          </div>
        </div>

        {/* Recent Activity */}
        <div className="slide-in-up card">
          <h3 className="text-lg font-bold text-neutral-900 mb-4">Recent Activity</h3>
          <div className="space-y-3">
            <div className="flex items-center justify-between p-3 bg-neutral-50 rounded-lg hover:bg-neutral-100 transition-colors">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-indigo-100 rounded-full flex items-center justify-center text-lg">✓</div>
                <div>
                  <p className="font-medium text-neutral-900 text-sm">Account Created</p>
                  <p className="text-xs text-neutral-600">Today</p>
                </div>
              </div>
              <span className="badge badge-primary">Today</span>
            </div>
          </div>
          <p className="text-center text-neutral-600 text-sm mt-4 py-4">
            No recent activity. Your verification requests will appear here.
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

export default VerifierDashboard;
