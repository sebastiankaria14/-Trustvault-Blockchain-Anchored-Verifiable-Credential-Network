import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { getVerificationRequests } from '../../services/api';

const VerificationRequestsPage = () => {
  const navigate = useNavigate();
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [page, setPage] = useState(1);

  useEffect(() => {
    const fetchRequests = async () => {
      try {
        setLoading(true);
        const response = await getVerificationRequests({
          status: statusFilter,
          search: searchTerm,
          page,
          limit: 10
        });
        setRequests(response.data?.requests || []);
      } catch (err) {
        console.error('Error fetching requests:', err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchRequests();
  }, [searchTerm, statusFilter, page]);

  const getStatusBadge = (status) => {
    switch (status) {
      case 'pending':
        return <span className="px-3 py-1 bg-amber-100 text-amber-800 rounded-full text-xs font-semibold">⏳ Pending</span>;
      case 'verified':
        return <span className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-xs font-semibold">✓ Verified</span>;
      case 'rejected':
        return <span className="px-3 py-1 bg-red-100 text-red-800 rounded-full text-xs font-semibold">✗ Rejected</span>;
      default:
        return <span className="px-3 py-1 bg-neutral-100 text-neutral-800 rounded-full text-xs font-semibold">{status}</span>;
    }
  };

  const getCredentialTypeIcon = (type) => {
    switch (type) {
      case 'degree':
        return '🎓';
      case 'certificate':
        return '📜';
      case 'license':
        return '🆔';
      case 'employment':
        return '💼';
      default:
        return '📑';
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
            className="flex items-center gap-3 px-6 py-3 text-neutral-900 bg-indigo-50 border-l-4 border-indigo-600 font-medium"
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
      <main className="ml-64 min-h-screen bg-gradient-to-br from-indigo-50 via-blue-50 to-neutral-50">
        <div className="p-8">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-4xl font-bold text-neutral-900">Verification Requests</h1>
            <p className="text-neutral-600 mt-2">Credentials shared with you for verification</p>
          </div>

          {/* Filters */}
          <div className="bg-white rounded-xl shadow-sm border border-neutral-200 p-6 mb-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-neutral-900 mb-2">Search by Name or Email</label>
                <input
                  type="text"
                  placeholder="Search..."
                  value={searchTerm}
                  onChange={(e) => {
                    setSearchTerm(e.target.value);
                    setPage(1);
                  }}
                  className="w-full px-4 py-2 border border-neutral-300 rounded-lg focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-neutral-900 mb-2">Filter by Status</label>
                <select
                  value={statusFilter}
                  onChange={(e) => {
                    setStatusFilter(e.target.value);
                    setPage(1);
                  }}
                  className="w-full px-4 py-2 border border-neutral-300 rounded-lg focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20"
                >
                  <option value="all">All Requests</option>
                  <option value="pending">⏳ Pending</option>
                  <option value="verified">✓ Verified</option>
                  <option value="rejected">✗ Rejected</option>
                </select>
              </div>
            </div>
          </div>

          {/* Error Message */}
          {error && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg text-red-800 text-sm">
              {error}
            </div>
          )}

          {/* Requests List */}
          {loading ? (
            <div className="space-y-4">
              {[1, 2, 3].map(() => (
                <div key={Math.random()} className="h-20 bg-white rounded-lg animate-pulse" />
              ))}
            </div>
          ) : requests.length > 0 ? (
            <div className="space-y-4">
              {requests.map((request) => (
                <Link
                  key={request.id}
                  to={`/verifier/credential/${request.credential_id}`}
                  className="bg-white rounded-xl shadow-sm border border-neutral-200 p-6 hover:shadow-md hover:border-indigo-300 transition-all transform hover:-translate-y-0.5"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-6 flex-1">
                      <div className="text-4xl">{getCredentialTypeIcon(request.credential_type)}</div>
                      <div className="flex-1">
                        <h3 className="text-lg font-bold text-neutral-900">{request.credential_name}</h3>
                        <p className="text-sm text-neutral-600 mt-1">
                          From: <strong>{request.first_name} {request.last_name}</strong> ({request.email})
                        </p>
                        <p className="text-xs text-neutral-500 mt-1">
                          Issued by: {request.issuer_name || 'Unknown'}
                        </p>
                      </div>
                    </div>

                    <div className="flex flex-col gap-3 items-end">
                      {getStatusBadge(request.status)}
                      <p className="text-xs text-neutral-500">
                        {new Date(request.shared_at).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          ) : (
            <div className="bg-white rounded-xl shadow-sm border border-neutral-200 p-12 text-center">
              <p className="text-4xl mb-4">📭</p>
              <h3 className="text-xl font-bold text-neutral-900 mb-2">No Verification Requests</h3>
              <p className="text-neutral-600">Credentials shared with you will appear here</p>
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default VerificationRequestsPage;
