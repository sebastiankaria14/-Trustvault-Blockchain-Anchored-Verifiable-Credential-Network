import { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';
import { getVerifierDashboardStats } from '../../services/api';

const VerifierDashboard = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        setLoading(true);
        const response = await getVerifierDashboardStats();
        if (response.data) {
          setStats(response.data);
        }
      } catch (err) {
        console.error('Error fetching stats:', err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const companyName = user?.company_name || user?.companyName || 'Verifier';

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-blue-50 to-neutral-50">
      {/* Sidebar Navigation */}
      <aside className="fixed left-0 top-0 w-64 h-screen bg-white border-r border-neutral-200 shadow-sm sidebar">
        <div className="p-6">
          <h2 className="text-2xl font-bold bg-gradient-to-r from-indigo-600 to-blue-600 bg-clip-text text-transparent">
            TrustVault
          </h2>
          <p className="text-xs text-neutral-600 mt-1">Verifier Portal</p>
        </div>

        <nav className="mt-8">
          <Link
            to="/verifier/dashboard"
            className="flex items-center gap-3 px-6 py-3 text-neutral-900 bg-indigo-50 border-l-4 border-indigo-600 font-medium"
          >
            <span className="text-xl">📊</span> Dashboard
          </Link>
          <Link
            to="/verifier/verification-requests"
            className="flex items-center gap-3 px-6 py-3 text-neutral-600 hover:bg-neutral-50 transition-colors"
          >
            <span className="text-xl">📥</span> Verification Requests
          </Link>
          <Link
            to="/verifier/history"
            className="flex items-center gap-3 px-6 py-3 text-neutral-600 hover:bg-neutral-50 transition-colors"
          >
            <span className="text-xl">📜</span> History
          </Link>
          <Link
            to="/verifier/profile"
            className="flex items-center gap-3 px-6 py-3 text-neutral-600 hover:bg-neutral-50 transition-colors"
          >
            <span className="text-xl">⚙️</span> Profile
          </Link>
        </nav>

        <div className="absolute bottom-6 left-6 right-6">
          <button
            onClick={() => setShowLogoutConfirm(true)}
            className="w-full px-4 py-2 bg-red-50 hover:bg-red-100 text-red-600 rounded-lg font-medium transition-colors text-sm"
          >
            Logout
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="ml-64 min-h-screen bg-gradient-to-br from-indigo-50 via-blue-50 to-neutral-50">
        {/* Logout Confirmation */}
        {showLogoutConfirm && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
            <div className="bg-white rounded-xl shadow-2xl p-6 max-w-sm mx-4">
              <h3 className="text-lg font-bold text-neutral-900 mb-2">Logout Confirmation</h3>
              <p className="text-neutral-600 text-sm mb-6">Are you sure you want to logout?</p>
              <div className="flex gap-3">
                <button
                  onClick={handleLogout}
                  className="flex-1 px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg font-medium transition-colors"
                >
                  Logout
                </button>
                <button
                  onClick={() => setShowLogoutConfirm(false)}
                  className="flex-1 px-4 py-2 bg-neutral-200 hover:bg-neutral-300 text-neutral-900 rounded-lg font-medium transition-colors"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        )}

        <div className="p-8">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-4xl font-bold text-neutral-900">Welcome, {companyName}!</h1>
            <p className="text-neutral-600 mt-2">Manage and verify digital credentials</p>
          </div>

          {/* Error Message */}
          {error && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg text-red-800 text-sm">
              {error}
            </div>
          )}

          {/* Loading State */}
          {loading ? (
            <div className="space-y-6">
              {[1, 2, 3, 4].map(() => (
                <div key={Math.random()} className="h-32 bg-white rounded-lg animate-pulse" />
              ))}
            </div>
          ) : stats ? (
            <>
              {/* Stats Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                <div className="bg-white rounded-xl p-6 shadow-sm border border-neutral-200 hover:shadow-md transition-shadow">
                  <p className="text-neutral-600 text-sm font-medium">Total Verifications</p>
                  <p className="text-4xl font-bold text-indigo-600 mt-2">{stats.stats?.total_verified || 0}</p>
                  <p className="text-xs text-neutral-500 mt-2">All time</p>
                </div>

                <div className="bg-white rounded-xl p-6 shadow-sm border border-neutral-200 hover:shadow-md transition-shadow">
                  <p className="text-neutral-600 text-sm font-medium">Today's Verifications</p>
                  <p className="text-4xl font-bold text-blue-600 mt-2">{stats.stats?.today_verified || 0}</p>
                  <p className="text-xs text-neutral-500 mt-2">Current date</p>
                </div>

                <div className="bg-white rounded-xl p-6 shadow-sm border border-neutral-200 hover:shadow-md transition-shadow">
                  <p className="text-neutral-600 text-sm font-medium">Authentic Credentials</p>
                  <p className="text-4xl font-bold text-green-600 mt-2">{stats.stats?.authentic_count || 0}</p>
                  <p className="text-xs text-neutral-500 mt-2">Verified</p>
                </div>

                <div className="bg-white rounded-xl p-6 shadow-sm border border-neutral-200 hover:shadow-md transition-shadow">
                  <p className="text-neutral-600 text-sm font-medium">Pending Requests</p>
                  <p className="text-4xl font-bold text-amber-600 mt-2">{stats.stats?.pending_requests || 0}</p>
                  <p className="text-xs text-neutral-500 mt-2">Awaiting action</p>
                </div>
              </div>

              {/* Quick Actions */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
                <Link
                  to="/verifier/verification-requests"
                  className="bg-gradient-to-br from-indigo-500 to-blue-500 text-white rounded-xl p-8 hover:shadow-xl transition-all transform hover:-translate-y-1"
                >
                  <div className="text-4xl mb-4">📥</div>
                  <h3 className="text-xl font-bold mb-2">View Verification Requests</h3>
                  <p className="text-indigo-100 text-sm">Access credentials shared with you</p>
                </Link>

                <Link
                  to="/verifier/history"
                  className="bg-gradient-to-br from-blue-500 to-cyan-500 text-white rounded-xl p-8 hover:shadow-xl transition-all transform hover:-translate-y-1"
                >
                  <div className="text-4xl mb-4">📜</div>
                  <h3 className="text-xl font-bold mb-2">Verification History</h3>
                  <p className="text-blue-100 text-sm">See all your verifications</p>
                </Link>
              </div>

              {/* Recent Verifications */}
              <div className="bg-white rounded-xl shadow-sm border border-neutral-200 overflow-hidden">
                <div className="p-6 border-b border-neutral-200">
                  <h3 className="text-lg font-bold text-neutral-900">Recent Verifications</h3>
                </div>

                {stats.recentVerifications && stats.recentVerifications.length > 0 ? (
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead className="bg-neutral-50 border-b border-neutral-200">
                        <tr>
                          <th className="px-6 py-3 text-left text-sm font-semibold text-neutral-900">Credential</th>
                          <th className="px-6 py-3 text-left text-sm font-semibold text-neutral-900">User</th>
                          <th className="px-6 py-3 text-left text-sm font-semibold text-neutral-900">Status</th>
                          <th className="px-6 py-3 text-left text-sm font-semibold text-neutral-900">Date</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-neutral-200">
                        {stats.recentVerifications.map((verification) => (
                          <tr key={verification.id} className="hover:bg-neutral-50 transition-colors">
                            <td className="px-6 py-4 text-sm font-medium text-neutral-900">
                              {verification.credential_name}
                            </td>
                            <td className="px-6 py-4 text-sm text-neutral-600">
                              {verification.first_name} {verification.last_name}
                            </td>
                            <td className="px-6 py-4 text-sm">
                              <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                                verification.verification_result === 'authentic'
                                  ? 'bg-green-100 text-green-800'
                                  : 'bg-red-100 text-red-800'
                              }`}>
                                {verification.verification_result === 'authentic' ? '✓ Authentic' : '✗ Fake'}
                              </span>
                            </td>
                            <td className="px-6 py-4 text-sm text-neutral-600">
                              {new Date(verification.created_at).toLocaleDateString()}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                ) : (
                  <div className="p-8 text-center">
                    <p className="text-neutral-600">No verifications yet</p>
                  </div>
                )}
              </div>
            </>
          ) : null}
        </div>
      </main>
    </div>
  );
};

export default VerifierDashboard;
