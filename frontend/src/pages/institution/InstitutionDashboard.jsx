import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { Link, useNavigate } from 'react-router-dom';
import { getInstitutionStats } from '../../services/api';

const InstitutionDashboard = () => {
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
      const response = await getInstitutionStats();
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

  return (
    <div className="min-h-screen bg-gray-50">
      <aside className="fixed inset-y-0 left-0 w-64 bg-purple-900 text-white">
        <div className="p-6">
          <h1 className="text-2xl font-bold">TrustVault</h1>
          <p className="text-purple-300 text-sm">Institution Portal</p>
        </div>

        <nav className="mt-6">
          <Link to="/institution/dashboard" className="flex items-center px-6 py-3 bg-purple-800 border-r-4 border-white">
            <svg className="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
            </svg>
            Dashboard
          </Link>

          <Link to="/institution/issue" className="flex items-center px-6 py-3 text-gray-200 hover:bg-purple-800">
            <svg className="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            Issue Credential
          </Link>

          <Link to="/institution/manage" className="flex items-center px-6 py-3 text-gray-200 hover:bg-purple-800">
            <svg className="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4" />
            </svg>
            Manage Credentials
          </Link>

          <Link to="/institution/history" className="flex items-center px-6 py-3 text-gray-200 hover:bg-purple-800">
            <svg className="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            History
          </Link>
        </nav>

        <div className="absolute bottom-6 left-6 right-6">
          <button onClick={handleLogout} className="w-full flex items-center px-4 py-2 text-gray-200 hover:bg-red-600 rounded">
            <svg className="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
            </svg>
            Logout
          </button>
        </div>
      </aside>

      <main className="ml-64 p-8">
        <div className="max-w-7xl mx-auto">
          <div className="mb-8">
            <h1 className="text-4xl font-bold text-gray-900">Institution Dashboard</h1>
            <p className="text-gray-600">Welcome, {user?.name || 'Institution Admin'}</p>
          </div>

          {loading ? (
            <div className="text-center py-8">
              <p className="text-gray-600">Loading...</p>
            </div>
          ) : stats ? (
            <>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
                <div className="bg-white rounded-lg shadow p-6">
                  <p className="text-gray-600 text-sm">Total Issued</p>
                  <p className="text-3xl font-bold">{stats.totalIssued || 0}</p>
                </div>
                <div className="bg-white rounded-lg shadow p-6">
                  <p className="text-gray-600 text-sm">Total Users</p>
                  <p className="text-3xl font-bold">{stats.totalUsers || 0}</p>
                </div>
                <div className="bg-white rounded-lg shadow p-6">
                  <p className="text-gray-600 text-sm">This Month</p>
                  <p className="text-3xl font-bold">{stats.last30Days || 0}</p>
                </div>
                <div className="bg-white rounded-lg shadow p-6">
                  <p className="text-gray-600 text-sm">Expiring Soon</p>
                  <p className="text-3xl font-bold">{stats.expiringSoon || 0}</p>
                </div>
              </div>
            </>
          ) : null}
        </div>
      </main>
    </div>
  );
};

export default InstitutionDashboard;
