import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { Link, useNavigate } from 'react-router-dom';
import { getUserAuditLog } from '../../services/api';

const AuditLogPage = () => {
  const { logout } = useAuth();
  const navigate = useNavigate();
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');

  useEffect(() => {
    fetchAuditLog();
  }, []);

  const fetchAuditLog = async () => {
    try {
      const response = await getUserAuditLog();
      if (response.success) {
        setLogs(response.data.logs || []);
      }
    } catch (error) {
      console.error('Error fetching audit log:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const getActionIcon = (action) => {
    switch (action?.toLowerCase()) {
      case 'verified':
        return (
          <div className="rounded-full bg-emerald-100 p-2">
            <svg className="h-5 w-5 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
        );
      case 'viewed':
        return (
          <div className="rounded-full bg-purple-100 p-2">
            <svg className="h-5 w-5 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
            </svg>
          </div>
        );
      case 'downloaded':
        return (
          <div className="rounded-full bg-purple-100 p-2">
            <svg className="h-5 w-5 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
            </svg>
          </div>
        );
      default:
        return (
          <div className="rounded-full bg-slate-100 p-2">
            <svg className="h-5 w-5 text-slate-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
        );
    }
  };

  const getResultBadge = (result) => {
    switch (result?.toLowerCase()) {
      case 'success':
        return <span className="rounded-full bg-emerald-100 px-2 py-1 text-xs text-emerald-800">Success</span>;
      case 'failed':
        return <span className="rounded-full bg-red-100 px-2 py-1 text-xs text-red-800">Failed</span>;
      case 'expired':
        return <span className="rounded-full bg-amber-100 px-2 py-1 text-xs text-amber-800">Expired</span>;
      default:
        return <span className="rounded-full bg-slate-100 px-2 py-1 text-xs text-slate-800">Unknown</span>;
    }
  };

  const filteredLogs = logs.filter((log) => {
    if (filter === 'all') return true;
    return log.action?.toLowerCase() === filter;
  });

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">
      {/* Sidebar */}
      <aside className="fixed inset-y-0 left-0 w-64 border-r border-slate-200 bg-white/90 text-slate-900 shadow-[0_20px_60px_rgba(15,23,42,0.08)] backdrop-blur-xl">
        <div className="p-6">
          <h1 className="text-2xl font-black tracking-tight text-slate-900">TrustVault</h1>
          <p className="text-sm text-slate-500">User Portal</p>
        </div>

        <nav className="mt-3 px-3">
          <Link to="/user/dashboard" className="flex items-center rounded-2xl px-4 py-3 text-slate-600 transition hover:bg-slate-50 hover:text-slate-900">
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

          <Link to="/user/audit-log" className="mt-2 flex items-center rounded-2xl border border-transparent bg-gradient-to-r from-blue-600 to-purple-600 px-4 py-3 text-white shadow-lg shadow-purple-200/50">
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
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-black tracking-tight text-slate-900">Audit Log</h1>
            <p className="text-slate-600">Track all access to your credentials</p>
          </div>
        </div>

        {/* Filters */}
        <div className="mb-6 rounded-[1.75rem] border border-slate-200 bg-white p-4 shadow-[0_16px_40px_rgba(15,23,42,0.06)]">
          <div className="flex space-x-2">
            {['all', 'verified', 'viewed', 'downloaded'].map((action) => (
              <button
                key={action}
                onClick={() => setFilter(action)}
                className={`rounded-2xl px-4 py-2 text-sm font-medium transition ${
                  filter === action
                    ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg shadow-purple-200/50'
                    : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                }`}
              >
                {action.charAt(0).toUpperCase() + action.slice(1)}
              </button>
            ))}
          </div>
        </div>

        {/* Audit Log List */}
        <div className="overflow-hidden rounded-[1.75rem] border border-slate-200 bg-white shadow-[0_16px_40px_rgba(15,23,42,0.06)]">
          {loading ? (
            <div className="p-6">
              <div className="animate-pulse space-y-4">
                {[1, 2, 3, 4, 5].map((i) => (
                    <div key={i} className="flex items-center space-x-4">
                    <div className="h-10 w-10 rounded-full bg-slate-200"></div>
                    <div className="flex-1">
                      <div className="mb-2 h-4 w-1/4 rounded bg-slate-200"></div>
                      <div className="h-3 w-1/2 rounded bg-slate-200"></div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ) : filteredLogs.length === 0 ? (
            <div className="p-12 text-center">
              <svg className="mx-auto h-16 w-16 text-slate-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
              </svg>
              <h3 className="mt-4 text-lg font-bold text-slate-900">No activity yet</h3>
              <p className="mt-2 text-slate-500">
                When organizations verify your credentials, the activity will appear here.
              </p>
            </div>
          ) : (
            <div className="divide-y divide-slate-100">
              {filteredLogs.map((log) => (
                <div key={log.id} className="p-6 transition hover:bg-slate-50/70">
                  <div className="flex items-start">
                    {getActionIcon(log.action)}
                    <div className="ml-4 flex-1">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="font-medium text-slate-900">
                            {log.verifier_name || 'Unknown Verifier'}
                          </p>
                          <p className="text-sm text-slate-500">{log.verifier_industry || 'N/A'}</p>
                        </div>
                        <div className="text-right">
                          <p className="text-sm text-slate-500">
                            {new Date(log.timestamp).toLocaleDateString()}
                          </p>
                          <p className="text-xs text-slate-400">
                            {new Date(log.timestamp).toLocaleTimeString()}
                          </p>
                        </div>
                      </div>

                      <div className="mt-3 flex items-center justify-between">
                        <div className="flex items-center">
                          <span className="text-sm text-slate-600">
                            <span className="font-medium capitalize">{log.action}</span> credential:{' '}
                            <Link
                              to={`/user/credentials/${log.credential_id}`}
                              className="text-blue-600 hover:text-blue-700 hover:underline"
                            >
                              {log.credential_name || 'Unknown Credential'}
                            </Link>
                          </span>
                        </div>
                        {getResultBadge(log.verification_result)}
                      </div>

                      {log.ip_address && (
                        <p className="mt-2 text-xs text-slate-400">
                          IP: {log.ip_address}
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Info Box */}
        <div className="mt-6 rounded-[1.75rem] border border-purple-100 bg-purple-50 p-6">
          <div className="flex">
            <svg className="mr-3 h-6 w-6 flex-shrink-0 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <div>
                <h3 className="font-medium text-purple-950">About Audit Logs</h3>
                <p className="mt-1 text-sm text-purple-800">
                Audit logs help you track who has accessed your credentials and when.
                All verification requests are automatically logged for your security and privacy.
              </p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default AuditLogPage;
