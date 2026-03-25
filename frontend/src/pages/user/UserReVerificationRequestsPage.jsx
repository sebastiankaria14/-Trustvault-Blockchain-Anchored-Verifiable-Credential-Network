import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  getUserReVerificationRequests,
  approveReVerification,
  declineReVerification
} from '../../services/api';

const UserReVerificationRequestsPage = () => {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeStatus, setActiveStatus] = useState('pending');
  const [respondingTo, setRespondingTo] = useState(null);
  const [responseReason, setResponseReason] = useState('');
  const [responding, setResponding] = useState(false);

  useEffect(() => {
    fetchRequests();
  }, [activeStatus]);

  const fetchRequests = async () => {
    try {
      setLoading(true);
      const response = await getUserReVerificationRequests(activeStatus);
      setRequests(response.data || []);
    } catch (err) {
      console.error('Error fetching re-verification requests:', err);
      setError(err.message || 'Failed to fetch requests');
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async (requestId) => {
    try {
      setResponding(true);
      await approveReVerification(requestId, responseReason);

      // Remove from pending list
      setRequests(requests.filter(r => r.id !== requestId));
      setRespondingTo(null);
      setResponseReason('');

      // Refresh to update counts
      setTimeout(() => fetchRequests(), 500);
    } catch (err) {
      console.error('Error approving request:', err);
      setError(err.message || 'Failed to approve request');
    } finally {
      setResponding(false);
    }
  };

  const handleDecline = async (requestId) => {
    try {
      setResponding(true);
      await declineReVerification(requestId, responseReason);

      // Remove from pending list
      setRequests(requests.filter(r => r.id !== requestId));
      setRespondingTo(null);
      setResponseReason('');

      // Refresh to update counts
      setTimeout(() => fetchRequests(), 500);
    } catch (err) {
      console.error('Error declining request:', err);
      setError(err.message || 'Failed to decline request');
    } finally {
      setResponding(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-blue-50 to-neutral-50">
      {/* Sidebar */}
      <aside className="fixed left-0 top-0 w-64 h-screen bg-white border-r border-neutral-200 shadow-sm">
        <div className="p-6">
          <h2 className="text-2xl font-bold bg-gradient-to-r from-indigo-600 to-blue-600 bg-clip-text text-transparent">
            TrustVault
          </h2>
          <p className="text-xs text-neutral-600 mt-1">User Portal</p>
        </div>

        <nav className="mt-8">
          <Link
            to="/user/dashboard"
            className="flex items-center gap-3 px-6 py-3 text-neutral-600 hover:bg-neutral-50 transition-colors"
          >
            <span className="text-xl">📊</span> Dashboard
          </Link>
          <Link
            to="/user/credentials"
            className="flex items-center gap-3 px-6 py-3 text-neutral-600 hover:bg-neutral-50 transition-colors"
          >
            <span className="text-xl">💼</span> My Credentials
          </Link>
          <Link
            to="/user/audit-log"
            className="flex items-center gap-3 px-6 py-3 text-neutral-600 hover:bg-neutral-50 transition-colors"
          >
            <span className="text-xl">📜</span> Audit Log
          </Link>
          <Link
            to="/user/re-verification-requests"
            className="flex items-center gap-3 px-6 py-3 text-neutral-900 bg-indigo-50 border-l-4 border-indigo-600 font-medium"
          >
            <span className="text-xl">📋</span> Re-verification Requests
          </Link>
          <Link
            to="/user/profile"
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
              window.location.href = '/login';
            }}
            className="w-full px-4 py-2 bg-red-50 hover:bg-red-100 text-red-600 rounded-lg font-medium transition-colors text-sm"
          >
            Logout
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="ml-64 min-h-screen p-8">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-4xl font-bold text-neutral-900 mb-2">Re-verification Requests</h1>
            <p className="text-neutral-600">
              Companies have requested to re-verify some of your credentials. Review and approve or decline each request.
            </p>
          </div>

          {error && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg text-red-800 text-sm">
              {error}
            </div>
          )}

          {/* Status Tabs */}
          <div className="flex gap-4 mb-8">
            <button
              onClick={() => setActiveStatus('pending')}
              className={`px-6 py-3 rounded-lg font-medium transition-colors ${
                activeStatus === 'pending'
                  ? 'bg-indigo-600 text-white'
                  : 'bg-white text-neutral-700 border border-neutral-200 hover:border-indigo-300'
              }`}
            >
              Pending
            </button>
            <button
              onClick={() => setActiveStatus('approved')}
              className={`px-6 py-3 rounded-lg font-medium transition-colors ${
                activeStatus === 'approved'
                  ? 'bg-green-600 text-white'
                  : 'bg-white text-neutral-700 border border-neutral-200 hover:border-green-300'
              }`}
            >
              Approved
            </button>
            <button
              onClick={() => setActiveStatus('declined')}
              className={`px-6 py-3 rounded-lg font-medium transition-colors ${
                activeStatus === 'declined'
                  ? 'bg-red-600 text-white'
                  : 'bg-white text-neutral-700 border border-neutral-200 hover:border-red-300'
              }`}
            >
              Declined
            </button>
          </div>

          {/* Requests List */}
          {loading ? (
            <div className="space-y-4">
              {[1, 2, 3].map((i) => (
                <div key={i} className="h-32 bg-white rounded-lg animate-pulse" />
              ))}
            </div>
          ) : requests.length === 0 ? (
            <div className="bg-white rounded-lg p-12 text-center">
              <div className="text-5xl mb-4">📭</div>
              <h3 className="text-xl font-semibold text-neutral-900 mb-2">
                {activeStatus === 'pending'
                  ? 'No pending requests'
                  : activeStatus === 'approved'
                  ? 'No approved requests'
                  : 'No declined requests'}
              </h3>
              <p className="text-neutral-600">
                {activeStatus === 'pending'
                  ? 'You have no pending re-verification requests'
                  : `You have no ${activeStatus} requests`}
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {requests.map((request) => (
                <div
                  key={request.id}
                  className="bg-white rounded-lg border border-neutral-200 p-6 hover:shadow-md transition-shadow"
                >
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <h3 className="text-lg font-bold text-neutral-900">
                        {request.credential_name}
                      </h3>
                      <p className="text-sm text-neutral-600 mt-1">
                        Type: <span className="font-medium">{request.credential_type}</span>
                      </p>
                    </div>

                    <span
                      className={`px-4 py-2 rounded-full text-sm font-semibold ${
                        activeStatus === 'pending'
                          ? 'bg-amber-100 text-amber-800'
                          : activeStatus === 'approved'
                          ? 'bg-green-100 text-green-800'
                          : 'bg-red-100 text-red-800'
                      }`}
                    >
                      {activeStatus.toUpperCase()}
                    </span>
                  </div>

                  <div className="bg-neutral-50 rounded-lg p-4 mb-4">
                    <p className="text-sm text-neutral-600 mb-2">
                      <span className="font-semibold">Company: </span>
                      {request.company_name}
                    </p>
                    <p className="text-sm text-neutral-600 mb-2">
                      <span className="font-semibold">Industry: </span>
                      {request.industry || 'N/A'}
                    </p>
                    {request.reason && (
                      <div className="mt-3 pt-3 border-t border-neutral-200">
                        <p className="text-sm text-neutral-600 font-semibold mb-1">
                          Their reason:
                        </p>
                        <p className="text-sm text-neutral-700 italic">"{request.reason}"</p>
                      </div>
                    )}
                  </div>

                  <div className="flex items-center justify-between text-xs text-neutral-500">
                    <span>
                      Requested: {new Date(request.requested_at).toLocaleDateString()}
                    </span>
                    {request.expires_at && (
                      <span>
                        Expires: {new Date(request.expires_at).toLocaleDateString()}
                      </span>
                    )}
                  </div>

                  {/* Action Buttons for Pending */}
                  {activeStatus === 'pending' && respondingTo === request.id ? (
                    <div className="mt-4 space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-neutral-700 mb-2">
                          Your reason (Optional)
                        </label>
                        <textarea
                          value={responseReason}
                          onChange={(e) => setResponseReason(e.target.value)}
                          placeholder="e.g., Please update with latest document"
                          className="w-full px-4 py-2 border border-neutral-300 rounded-lg focus:outline-none focus:border-indigo-600 resize-none"
                          rows="2"
                        />
                      </div>

                      <div className="flex gap-3">
                        <button
                          onClick={() => handleApprove(request.id)}
                          disabled={responding}
                          className="flex-1 px-6 py-2 bg-green-600 hover:bg-green-700 disabled:bg-neutral-300 disabled:cursor-not-allowed text-white font-medium rounded-lg transition-colors"
                        >
                          {responding ? 'Processing...' : '✓ Approve'}
                        </button>
                        <button
                          onClick={() => handleDecline(request.id)}
                          disabled={responding}
                          className="flex-1 px-6 py-2 bg-red-600 hover:bg-red-700 disabled:bg-neutral-300 disabled:cursor-not-allowed text-white font-medium rounded-lg transition-colors"
                        >
                          {responding ? 'Processing...' : '✗ Decline'}
                        </button>
                        <button
                          onClick={() => {
                            setRespondingTo(null);
                            setResponseReason('');
                          }}
                          disabled={responding}
                          className="flex-1 px-6 py-2 bg-neutral-200 hover:bg-neutral-300 disabled:bg-neutral-300 disabled:cursor-not-allowed text-neutral-900 font-medium rounded-lg transition-colors"
                        >
                          Cancel
                        </button>
                      </div>
                    </div>
                  ) : activeStatus === 'pending' ? (
                    <div className="mt-4 flex gap-3">
                      <button
                        onClick={() => setRespondingTo(request.id)}
                        className="flex-1 px-6 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-medium rounded-lg transition-colors"
                      >
                        Review & Respond
                      </button>
                    </div>
                  ) : null}
                </div>
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default UserReVerificationRequestsPage;
