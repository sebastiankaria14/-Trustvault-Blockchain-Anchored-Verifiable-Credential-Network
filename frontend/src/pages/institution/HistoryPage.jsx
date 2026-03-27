import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { Link, useNavigate } from 'react-router-dom';
import { getInstitutionHistory } from '../../services/api';

const HistoryPage = () => {
  const { logout } = useAuth();
  const navigate = useNavigate();
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchHistory();
  }, []);

  const fetchHistory = async () => {
    try {
      const response = await getInstitutionHistory();
      if (response.success) {
        setHistory(response.data);
      }
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">
      <aside className="fixed inset-y-0 left-0 w-64 border-r border-slate-200 bg-white/90 text-slate-900 shadow-[0_20px_60px_rgba(15,23,42,0.08)] backdrop-blur-xl">
        <div className="p-6">
          <h1 className="text-2xl font-black tracking-tight text-slate-900">TrustVault</h1>
          <p className="text-sm text-slate-500">Institution Portal</p>
        </div>
        <nav className="mt-3 px-3">
          <Link to="/institution/dashboard" className="flex items-center rounded-2xl px-4 py-3 text-slate-600 transition hover:bg-slate-50 hover:text-slate-900">
            <svg className="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
            </svg>
            Dashboard
          </Link>
          <Link to="/institution/issue" className="mt-2 flex items-center rounded-2xl px-4 py-3 text-slate-600 transition hover:bg-slate-50 hover:text-slate-900">
            <svg className="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            Issue Credential
          </Link>
          <Link to="/institution/manage" className="mt-2 flex items-center rounded-2xl px-4 py-3 text-slate-600 transition hover:bg-slate-50 hover:text-slate-900">
            <svg className="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4" />
            </svg>
            Manage Credentials
          </Link>
          <Link to="/institution/history" className="mt-2 flex items-center rounded-2xl border border-transparent bg-gradient-to-r from-blue-600 to-purple-600 px-4 py-3 text-white shadow-lg shadow-purple-200/50">
            <svg className="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            History
          </Link>
        </nav>
        <div className="absolute bottom-6 left-6 right-6">
          <button onClick={() => { logout(); navigate('/login'); }} className="flex w-full items-center rounded-2xl px-4 py-3 text-slate-600 transition hover:bg-red-50 hover:text-red-600">
            <svg className="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
            </svg>
            Logout
          </button>
        </div>
      </aside>

      <main className="ml-64 p-8">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-4xl font-bold mb-8">History</h1>

          <div className="bg-white rounded-lg shadow">
            {loading ? (
              <div className="text-center py-12">Loading...</div>
            ) : history.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-gray-600">No history yet</p>
              </div>
            ) : (
              <div className="p-6">
                {history.map((item, index) => (
                  <div key={index} className="border-l-4 border-purple-500 pl-4 pb-6 mb-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-semibold text-gray-900">{item.credential_name}</p>
                        <p className="text-sm text-gray-600">Issued to: {item.user_email}</p>
                        <p className="text-sm text-gray-500">{new Date(item.created_at).toLocaleString()}</p>
                      </div>
                      <span className={`px-3 py-1 rounded text-xs ${
                        item.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                      }`}>
                        {item.status}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
};

export default HistoryPage;
