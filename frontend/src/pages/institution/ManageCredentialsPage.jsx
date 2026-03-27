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
    <div className="min-h-screen bg-gray-50">
      <aside className="fixed inset-y-0 left-0 w-64 bg-purple-900 text-white">
        <div className="p-6">
          <h1 className="text-2xl font-bold">TrustVault</h1>
          <p className="text-purple-300 text-sm">Institution Portal</p>
        </div>
        <nav className="mt-6">
          <Link to="/institution/dashboard" className="block px-6 py-3 hover:bg-purple-800">Dashboard</Link>
          <Link to="/institution/issue" className="block px-6 py-3 hover:bg-purple-800">Issue</Link>
          <Link to="/institution/manage" className="block px-6 py-3 bg-purple-800">Manage</Link>
          <Link to="/institution/history" className="block px-6 py-3 hover:bg-purple-800">History</Link>
        </nav>
        <div className="absolute bottom-6 left-6 right-6">
          <button onClick={() => { logout(); navigate('/login'); }} className="w-full px-4 py-2 hover:bg-red-600 rounded">Logout</button>
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
