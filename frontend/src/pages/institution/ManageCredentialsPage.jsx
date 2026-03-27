import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { Link, useNavigate } from 'react-router-dom';
import { getInstitutionCredentials, revokeCredential } from '../../services/api';

const ManageCredentialsPage = () => {
  const { logout } = useAuth();
  const navigate = useNavigate();
  const [credentials, setCredentials] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetchCredentials();
  }, []);

  const fetchCredentials = async () => {
    try {
      const response = await getInstitutionCredentials();
      if (response.success) {
        setCredentials(response.data);
      }
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleRevoke = async (credentialId) => {
    if (!window.confirm('Revoke this credential?')) return;
    try {
      await revokeCredential(credentialId);
      alert('Revoked successfully');
      fetchCredentials();
    } catch (error) {
      alert('Error revoking');
    }
  };

  const filteredCredentials = credentials.filter(cred =>
    cred.credential_name?.toLowerCase().includes(searchTerm.toLowerCase())
  );

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

          <Link to="/institution/manage" className="mt-2 flex items-center rounded-2xl border border-transparent bg-gradient-to-r from-blue-600 to-purple-600 px-4 py-3 text-white shadow-lg shadow-purple-200/50">
            <svg className="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4" />
            </svg>
            Manage Credentials
          </Link>

          <Link to="/institution/history" className="mt-2 flex items-center rounded-2xl px-4 py-3 text-slate-600 transition hover:bg-slate-50 hover:text-slate-900">
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
        <h1 className="text-4xl font-bold mb-8">Manage Credentials</h1>

        <div className="bg-white p-4 rounded-lg shadow mb-6">
          <input
            type="text"
            placeholder="Search..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full px-4 py-2 border rounded"
          />
        </div>

        <div className="bg-white rounded-lg shadow">
          {loading ? (
            <div className="text-center py-12">Loading...</div>
          ) : filteredCredentials.length === 0 ? (
            <div className="text-center py-12">No credentials found</div>
          ) : (
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left">User</th>
                  <th className="px-6 py-3 text-left">Credential</th>
                  <th className="px-6 py-3 text-left">Type</th>
                  <th className="px-6 py-3 text-left">Status</th>
                  <th className="px-6 py-3 text-left">Date</th>
                  <th className="px-6 py-3 text-left">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredCredentials.map((cred) => (
                  <tr key={cred.id} className="border-t hover:bg-gray-50">
                    <td className="px-6 py-4">{cred.user_email}</td>
                    <td className="px-6 py-4">{cred.credential_name}</td>
                    <td className="px-6 py-4">
                      <span className="px-2 py-1 bg-purple-100 text-purple-800 rounded text-xs">{cred.credential_type}</span>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`px-2 py-1 rounded text-xs ${cred.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                        {cred.status}
                      </span>
                    </td>
                    <td className="px-6 py-4">{new Date(cred.issue_date).toLocaleDateString()}</td>
                    <td className="px-6 py-4">
                      {cred.status === 'active' && (
                        <button onClick={() => handleRevoke(cred.id)} className="text-red-600 hover:underline">
                          Revoke
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </main>
    </div>
  );
};

export default ManageCredentialsPage;
