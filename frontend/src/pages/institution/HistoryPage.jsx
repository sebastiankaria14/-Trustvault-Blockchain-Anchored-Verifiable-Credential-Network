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
    <div className="min-h-screen bg-gray-50">
      <aside className="fixed inset-y-0 left-0 w-64 bg-purple-900 text-white">
        <div className="p-6">
          <h1 className="text-2xl font-bold">TrustVault</h1>
          <p className="text-purple-300 text-sm">Institution Portal</p>
        </div>
        <nav className="mt-6">
          <Link to="/institution/dashboard" className="block px-6 py-3 hover:bg-purple-800">Dashboard</Link>
          <Link to="/institution/issue" className="block px-6 py-3 hover:bg-purple-800">Issue</Link>
          <Link to="/institution/manage" className="block px-6 py-3 hover:bg-purple-800">Manage</Link>
          <Link to="/institution/history" className="block px-6 py-3 bg-purple-800">History</Link>
        </nav>
        <div className="absolute bottom-6 left-6 right-6">
          <button onClick={() => { logout(); navigate('/login'); }} className="w-full px-4 py-2 hover:bg-red-600 rounded">Logout</button>
        </div>
      </aside>

      <main className="ml-64 p-8">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-4xl font-bold mb-8">Issuance History</h1>

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
