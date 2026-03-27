import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { Link, useNavigate } from 'react-router-dom';
import { getDashboardStats } from '../../services/api';

const UserDashboard = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [stats, setStats] = useState(null);
  const [recentCredentials, setRecentCredentials] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const response = await getDashboardStats();
      if (response.success) {
        setStats(response.data.stats);
        setRecentCredentials(response.data.recentCredentials || []);
      }
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-800';
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'expired': return 'bg-red-100 text-red-800';
      case 'revoked': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">
      {/* Sidebar */}
      <aside className="fixed inset-y-0 left-0 w-64 border-r border-slate-200 bg-white/90 text-slate-900 shadow-[0_20px_60px_rgba(15,23,42,0.08)] backdrop-blur-xl">
        <div className="p-6">
          <h1 className="text-2xl font-black tracking-tight text-slate-900">TrustVault</h1>
          <p className="text-sm text-slate-500">User Portal</p>
        </div>

        <nav className="mt-3 px-3">
          <Link to="/user/dashboard" className="flex items-center rounded-2xl border border-transparent bg-gradient-to-r from-blue-600 to-purple-600 px-4 py-3 text-white shadow-lg shadow-purple-200/50">
            <svg className="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
            </svg>
            Dashboard
          </Link>

          <Link to="/user/wallet" className="mt-2 flex items-center rounded-2xl px-4 py-3 text-slate-600 transition hover:bg-slate-50 hover:text-slate-900">
            <svg className="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
            </svg>
            My Wallet
          </Link>

          <Link to="/user/audit-log" className="mt-2 flex items-center rounded-2xl px-4 py-3 text-slate-600 transition hover:bg-slate-50 hover:text-slate-900">
            <svg className="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
            </svg>
            Audit Log
          </Link>

          <Link to="/user/profile" className="mt-2 flex items-center rounded-2xl px-4 py-3 text-slate-600 transition hover:bg-slate-50 hover:text-slate-900">
            <svg className="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
            </svg>
            Profile
          </Link>
        </nav>

        <div className="absolute bottom-0 w-full p-6">
          <button
            onClick={handleLogout}
            className="w-full flex items-center rounded-2xl px-4 py-3 text-slate-600 transition hover:bg-slate-50 hover:text-slate-900"
          >
            <svg className="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
            </svg>
            Logout
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="ml-64 min-h-screen p-8">
        {/* Header */}
        <div className="mb-8 flex items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-black tracking-tight text-slate-900">Welcome back, {user?.firstName || user?.first_name}!</h1>
            <p className="mt-2 text-slate-600">Here's an overview of your credentials</p>
          </div>
          <div className="flex items-center space-x-4">
            <span className={`rounded-full px-3 py-1 text-sm font-medium ${
              user?.kycStatus === 'verified' || user?.kyc_status === 'verified'
                ? 'bg-emerald-100 text-emerald-800'
                : 'bg-amber-100 text-amber-800'
            }`}>
              KYC: {user?.kycStatus || user?.kyc_status || 'Pending'}
            </span>
          </div>
        </div>

        {/* Stats Cards */}
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="rounded-[1.5rem] border border-slate-200 bg-white p-6 animate-pulse shadow-[0_16px_40px_rgba(15,23,42,0.06)]">
                <div className="h-4 bg-gray-200 rounded w-1/2 mb-4"></div>
                <div className="h-8 bg-gray-200 rounded w-1/4"></div>
              </div>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <div className="rounded-[1.5rem] border border-slate-200 bg-white p-6 shadow-[0_16px_40px_rgba(15,23,42,0.06)]">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-500 text-sm">Total Credentials</p>
                  <p className="text-3xl font-bold text-gray-900">{stats?.total_count || 0}</p>
                </div>
                <div className="rounded-2xl bg-purple-100 p-3">
                  <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                </div>
              </div>
            </div>

            <div className="rounded-[1.5rem] border border-slate-200 bg-white p-6 shadow-[0_16px_40px_rgba(15,23,42,0.06)]">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-500 text-sm">Active</p>
                  <p className="text-3xl font-bold text-green-600">{stats?.active_count || 0}</p>
                </div>
                <div className="rounded-2xl bg-emerald-100 p-3">
                  <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
              </div>
            </div>

            <div className="rounded-[1.5rem] border border-slate-200 bg-white p-6 shadow-[0_16px_40px_rgba(15,23,42,0.06)]">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-500 text-sm">Pending</p>
                  <p className="text-3xl font-bold text-yellow-600">{stats?.pending_count || 0}</p>
                </div>
                <div className="rounded-2xl bg-amber-100 p-3">
                  <svg className="w-6 h-6 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
              </div>
            </div>

            <div className="rounded-[1.5rem] border border-slate-200 bg-white p-6 shadow-[0_16px_40px_rgba(15,23,42,0.06)]">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-500 text-sm">Recent Verifications</p>
                  <p className="text-3xl font-bold text-purple-600">{stats?.recent_verifications || 0}</p>
                </div>
                <div className="rounded-2xl bg-purple-100 p-3">
                  <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                  </svg>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Recent Credentials */}
        <div className="overflow-hidden rounded-[1.75rem] border border-slate-200 bg-white shadow-[0_16px_40px_rgba(15,23,42,0.06)]">
          <div className="flex items-center justify-between border-b border-slate-100 p-6">
            <h2 className="text-lg font-bold text-slate-900">Recent Credentials</h2>
            <Link to="/user/wallet" className="text-sm font-semibold text-purple-600 hover:text-purple-700">
              View All
            </Link>
          </div>

          {loading ? (
            <div className="p-6">
              <div className="animate-pulse space-y-4">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="h-16 rounded-2xl bg-slate-200"></div>
                ))}
              </div>
              <span className="badge badge-primary">Today</span>
            </div>
          ) : recentCredentials.length === 0 ? (
            <div className="p-12 text-center">
              <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              <h3 className="mt-2 text-sm font-medium text-gray-900">No credentials yet</h3>
              <p className="mt-1 text-sm text-gray-500">Credentials issued to you will appear here.</p>
            </div>
          ) : (
            <div className="divide-y divide-gray-200">
              {recentCredentials.map((credential) => (
                <Link
                  key={credential.id}
                  to={`/user/credentials/${credential.id}`}
                  className="flex items-center justify-between p-6 transition hover:bg-slate-50"
                >
                  <div className="flex items-center">
                    <div className="mr-4 rounded-2xl bg-purple-100 p-3">
                      <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                      </svg>
                    </div>
                    <div>
                      <h3 className="font-medium text-gray-900">{credential.credential_name}</h3>
                      <p className="text-sm text-gray-500">
                        {credential.issuer_name} • {credential.credential_type}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center">
                    <span className={`rounded-full px-3 py-1 text-xs font-medium ${getStatusColor(credential.status)}`}>
                      {credential.status}
                    </span>
                    <svg className="w-5 h-5 text-gray-400 ml-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>

        {/* Quick Actions */}
        <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="rounded-[1.75rem] bg-gradient-to-r from-blue-600 to-purple-600 p-6 text-white shadow-[0_20px_50px_rgba(91,33,182,0.18)]">
            <h3 className="text-lg font-semibold mb-2">Complete Your KYC</h3>
            <p className="text-indigo-100 mb-4">Verify your identity to receive credentials from institutions.</p>
            <button className="rounded-2xl bg-white px-4 py-2 font-medium text-purple-600 transition hover:bg-purple-50">
              Start Verification
            </button>
          </div>

          <div className="rounded-[1.75rem] bg-gradient-to-r from-emerald-500 to-teal-600 p-6 text-white shadow-[0_20px_50px_rgba(15,118,110,0.16)]">
            <h3 className="text-lg font-semibold mb-2">View Audit Log</h3>
            <p className="text-green-100 mb-4">See who has verified your credentials and when.</p>
            <Link
              to="/user/audit-log"
              className="inline-block rounded-2xl bg-white px-4 py-2 font-medium text-teal-600 transition hover:bg-teal-50"
            >
              View History
            </Link>
          </div>
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
