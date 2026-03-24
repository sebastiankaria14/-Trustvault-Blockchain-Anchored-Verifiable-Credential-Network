import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { getVerificationHistory } from '../../services/api';

const VerificationHistoryPage = () => {
  const navigate = useNavigate();
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [resultFilter, setResultFilter] = useState('all');
  const [page, setPage] = useState(1);

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        setLoading(true);
        const response = await getVerificationHistory({
          result: resultFilter,
          page,
          limit: 20
        });
        setHistory(response.data?.history || []);
      } catch (err) {
        console.error('Error fetching history:', err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchHistory();
  }, [resultFilter, page]);

  const getResultBadge = (result) => {
    switch (result) {
      case 'authentic':
        return <span className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-xs font-semibold">✓ Authentic</span>;
      case 'fake':
        return <span className="px-3 py-1 bg-red-100 text-red-800 rounded-full text-xs font-semibold">✗ Fake</span>;
      default:
        return <span className="px-3 py-1 bg-neutral-100 text-neutral-800 rounded-full text-xs font-semibold">{result}</span>;
    }
  };

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
            className="flex items-center gap-3 px-6 py-3 text-neutral-600 hover:bg-neutral-50 transition-colors"
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
            className="flex items-center gap-3 px-6 py-3 text-neutral-900 bg-indigo-50 border-l-4 border-indigo-600 font-medium"
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
            onClick={() => {
              localStorage.removeItem('token');
              localStorage.removeItem('user');
              navigate('/login');
            }}
            className="w-full px-4 py-2 bg-red-50 hover:bg-red-100 text-red-600 rounded-lg font-medium transition-colors text-sm"
          >
            Logout
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="ml-64 min-h-screen bg-gradient-to-br from-indigo-50 via-blue-50 to-neutral-50 p-8">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-4xl font-bold text-neutral-900">Verification History</h1>
            <p className="text-neutral-600 mt-2">All credentials you have verified</p>
          </div>

          {/* Filter */}
          <div className="bg-white rounded-xl shadow-sm border border-neutral-200 p-6 mb-8">
            <label className="block text-sm font-medium text-neutral-900 mb-3">Filter by Result</label>
            <select
              value={resultFilter}
              onChange={(e) => {
                setResultFilter(e.target.value);
                setPage(1);
              }}
              className="w-full md:w-48 px-4 py-2 border border-neutral-300 rounded-lg focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20"
            >
              <option value="all">All Results</option>
              <option value="authentic">✓ Authentic</option>
              <option value="fake">✗ Fake</option>
            </select>
          </div>

          {/* Error Message */}
          {error && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg text-red-800 text-sm">
              {error}
            </div>
          )}

          {/* Timeline */}
          {loading ? (
            <div className="space-y-4">
              {[1, 2, 3, 4, 5].map(() => (
                <div key={Math.random()} className="h-20 bg-white rounded-lg animate-pulse" />
              ))}
            </div>
          ) : history.length > 0 ? (
            <div className="space-y-4">
              {history.map((item, index) => (
                <div key={item.id} className="bg-white rounded-xl shadow-sm border border-neutral-200 p-6 hover:shadow-md transition-shadow">
                  <div className="flex items-start gap-6">
                    {/* Timeline marker */}
                    <div className="relative">
                      <div className={`w-12 h-12 rounded-full flex items-center justify-center font-bold text-white ${
                        item.verification_result === 'authentic'
                          ? 'bg-green-500'
                          : item.verification_result === 'fake'
                          ? 'bg-red-500'
                          : 'bg-blue-500'
                      }`}>
                        {item.verification_result === 'authentic' ? '✓' : item.verification_result === 'fake' ? '✗' : '🔍'}
                      </div>
                      {index < history.length - 1 && (
                        <div className="absolute left-[23px] top-12 w-0.5 h-20 bg-neutral-200" />
                      )}
                    </div>

                    {/* Content */}
                    <div className="flex-1">
                      <div className="flex items-start justify-between gap-4 mb-2">
                        <div>
                          <h3 className="text-lg font-bold text-neutral-900">{item.credential_name}</h3>
                          <p className="text-sm text-neutral-600 mt-1">
                            User: <strong>{item.first_name} {item.last_name}</strong>
                          </p>
                          <p className="text-xs text-neutral-500 mt-1">{item.email}</p>
                        </div>

                        {getResultBadge(item.verification_result)}
                      </div>

                      {item.comments && (
                        <div className="mt-3 p-3 bg-neutral-50 rounded-lg">
                          <p className="text-xs text-neutral-600 font-medium mb-1">Notes:</p>
                          <p className="text-sm text-neutral-700">{item.comments}</p>
                        </div>
                      )}

                      <p className="text-xs text-neutral-500 mt-4">
                        {new Date(item.created_at).toLocaleString()}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="bg-white rounded-xl shadow-sm border border-neutral-200 p-12 text-center">
              <p className="text-4xl mb-4">📭</p>
              <h3 className="text-xl font-bold text-neutral-900 mb-2">No Verification History</h3>
              <p className="text-neutral-600">Your verifications will appear here</p>
            </div>
          )}

          {/* Pagination */}
          {history.length > 0 && (
            <div className="mt-8 flex justify-center gap-2">
              <button
                onClick={() => setPage(Math.max(1, page - 1))}
                disabled={page === 1}
                className="px-4 py-2 rounded-lg border border-neutral-300 text-neutral-900 disabled:opacity-50 hover:bg-neutral-50"
              >
                Previous
              </button>
              <span className="px-4 py-2 text-neutral-600">Page {page}</span>
              <button
                onClick={() => setPage(page + 1)}
                disabled={history.length < 20}
                className="px-4 py-2 rounded-lg border border-neutral-300 text-neutral-900 disabled:opacity-50 hover:bg-neutral-50"
              >
                Next
              </button>
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default VerificationHistoryPage;
