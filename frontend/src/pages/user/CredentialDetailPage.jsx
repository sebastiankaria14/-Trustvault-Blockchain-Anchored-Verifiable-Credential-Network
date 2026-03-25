import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { getCredentialById, getCredentialLogs, getVerifiers, shareCredential } from '../../services/api';

const CredentialDetailPage = () => {
  const { id } = useParams();
  const { logout } = useAuth();
  const navigate = useNavigate();
  const [credential, setCredential] = useState(null);
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('details');
  const [showShareModal, setShowShareModal] = useState(false);
  const [verifiers, setVerifiers] = useState([]);
  const [loadingVerifiers, setLoadingVerifiers] = useState(false);
  const [selectedVerifier, setSelectedVerifier] = useState(null);
  const [sharing, setSharing] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchCredentialData();
  }, [id]);

  const fetchCredentialData = async () => {
    try {
      const [credResponse, logsResponse] = await Promise.all([
        getCredentialById(id),
        getCredentialLogs(id)
      ]);

      if (credResponse.success) {
        setCredential(credResponse.data.credential);
      }
      if (logsResponse.success) {
        setLogs(logsResponse.data.logs || []);
      }
    } catch (error) {
      console.error('Error fetching credential:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const handleOpenShareModal = async () => {
    setShowShareModal(true);
    if (verifiers.length === 0) {
      setLoadingVerifiers(true);
      try {
        const response = await getVerifiers();
        if (response.success) {
          setVerifiers(response.data.verifiers);
        }
      } catch (err) {
        setError('Failed to load companies');
        console.error('Error loading verifiers:', err);
      } finally {
        setLoadingVerifiers(false);
      }
    }
  };

  const handleShareCredential = async () => {
    if (!selectedVerifier) {
      setError('Please select a company to share with');
      return;
    }

    setSharing(true);
    setError(null);
    try {
      const response = await shareCredential(id, selectedVerifier);
      if (response.success) {
        alert('Credential shared successfully!');
        setShowShareModal(false);
        setSelectedVerifier(null);
      }
    } catch (err) {
      setError(err.message || 'Failed to share credential');
      console.error('Error sharing credential:', err);
    } finally {
      setSharing(false);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-800';
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'expired': return 'bg-red-100 text-red-800';
      case 'revoked': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  if (!credential) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-xl font-semibold text-gray-900">Credential not found</h2>
          <Link to="/user/wallet" className="text-indigo-600 hover:underline mt-2 block">
            Back to Wallet
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Sidebar */}
      <aside className="fixed inset-y-0 left-0 w-64 bg-indigo-900 text-white">
        <div className="p-6">
          <h1 className="text-2xl font-bold">TrustVault</h1>
          <p className="text-indigo-300 text-sm">User Portal</p>
        </div>

        <nav className="mt-6">
          <Link to="/user/dashboard" className="flex items-center px-6 py-3 text-indigo-300 hover:bg-indigo-800 hover:text-white transition">
            <svg className="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
            </svg>
            Dashboard
          </Link>

          <Link to="/user/wallet" className="flex items-center px-6 py-3 bg-indigo-800 border-r-4 border-white">
            <svg className="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
            </svg>
            My Wallet
          </Link>

          <Link to="/user/audit-log" className="flex items-center px-6 py-3 text-indigo-300 hover:bg-indigo-800 hover:text-white transition">
            <svg className="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
            </svg>
            Audit Log
          </Link>

          <Link to="/user/re-verification-requests" className="flex items-center px-6 py-3 text-indigo-300 hover:bg-indigo-800 hover:text-white transition">
            <svg className="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z M13 3v5a2 2 0 002 2h5" />
            </svg>
            Re-verification Requests
          </Link>

          <Link to="/user/profile" className="flex items-center px-6 py-3 text-indigo-300 hover:bg-indigo-800 hover:text-white transition">
            <svg className="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
            </svg>
            Profile
          </Link>
        </nav>

        <div className="absolute bottom-0 w-full p-6">
          <button
            onClick={handleLogout}
            className="w-full flex items-center px-4 py-2 text-indigo-300 hover:bg-indigo-800 hover:text-white rounded transition"
          >
            <svg className="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
            </svg>
            Logout
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="ml-64 p-8">
        {/* Back Button */}
        <Link to="/user/wallet" className="inline-flex items-center text-indigo-600 hover:text-indigo-800 mb-6">
          <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
          Back to Wallet
        </Link>

        {/* Credential Header */}
        <div className="bg-white rounded-lg shadow p-6 mb-6">
          <div className="flex items-start justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">{credential.credential_name}</h1>
              <p className="text-gray-600 mt-1">{credential.credential_type}</p>
            </div>
            <span className={`px-4 py-2 rounded-full text-sm font-medium ${getStatusColor(credential.status)}`}>
              {credential.status}
            </span>
          </div>

          <div className="mt-6 flex flex-wrap gap-4">
            <button className="inline-flex items-center px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition">
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
              </svg>
              Download PDF
            </button>
            <button
              onClick={handleOpenShareModal}
              className="inline-flex items-center px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition">
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
              </svg>
              Share with Company
            </button>
          </div>
        </div>

        {/* Tabs */}
        <div className="bg-white rounded-lg shadow">
          <div className="border-b border-gray-200">
            <nav className="flex -mb-px">
              <button
                onClick={() => setActiveTab('details')}
                className={`px-6 py-4 text-sm font-medium ${
                  activeTab === 'details'
                    ? 'border-b-2 border-indigo-500 text-indigo-600'
                    : 'text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                Details
              </button>
              <button
                onClick={() => setActiveTab('issuer')}
                className={`px-6 py-4 text-sm font-medium ${
                  activeTab === 'issuer'
                    ? 'border-b-2 border-indigo-500 text-indigo-600'
                    : 'text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                Issuer Info
              </button>
              <button
                onClick={() => setActiveTab('history')}
                className={`px-6 py-4 text-sm font-medium ${
                  activeTab === 'history'
                    ? 'border-b-2 border-indigo-500 text-indigo-600'
                    : 'text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                Verification History ({logs.length})
              </button>
            </nav>
          </div>

          <div className="p-6">
            {activeTab === 'details' && (
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="text-sm font-medium text-gray-500">Credential Number</label>
                    <p className="mt-1 text-gray-900">{credential.credential_number || 'N/A'}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-500">Issue Date</label>
                    <p className="mt-1 text-gray-900">{new Date(credential.issue_date).toLocaleDateString()}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-500">Expiry Date</label>
                    <p className="mt-1 text-gray-900">
                      {credential.expiry_date ? new Date(credential.expiry_date).toLocaleDateString() : 'No Expiry'}
                    </p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-500">Blockchain Hash</label>
                    <p className="mt-1 text-gray-900 font-mono text-sm break-all">
                      {credential.blockchain_hash || 'Not recorded on blockchain'}
                    </p>
                  </div>
                </div>

                {credential.description && (
                  <div>
                    <label className="text-sm font-medium text-gray-500">Description</label>
                    <p className="mt-1 text-gray-900">{credential.description}</p>
                  </div>
                )}

                {credential.credential_data && (
                  <div>
                    <label className="text-sm font-medium text-gray-500">Additional Data</label>
                    <div className="mt-2 bg-gray-50 rounded-lg p-4">
                      <pre className="text-sm text-gray-700 overflow-x-auto">
                        {JSON.stringify(credential.credential_data, null, 2)}
                      </pre>
                    </div>
                  </div>
                )}

                {/* Credential Document/Image */}
                {credential.document_url && (
                  <div>
                    <label className="text-sm font-medium text-gray-500">Credential Document</label>
                    <div className="mt-2 border border-gray-200 rounded-lg p-4 bg-gray-50">
                      <img
                        src={credential.document_url}
                        alt="Credential Document"
                        className="max-w-full h-auto rounded-lg shadow-sm"
                        style={{ maxHeight: '500px' }}
                      />
                    </div>
                  </div>
                )}
              </div>
            )}

            {activeTab === 'issuer' && (
              <div className="space-y-6">
                <div className="flex items-center">
                  <div className="bg-indigo-100 p-4 rounded-full">
                    <svg className="w-8 h-8 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                    </svg>
                  </div>
                  <div className="ml-4">
                    <h3 className="text-lg font-semibold text-gray-900">{credential.issuer_name || 'Unknown Issuer'}</h3>
                    <p className="text-gray-500">{credential.issuer_type || 'Institution'}</p>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="text-sm font-medium text-gray-500">Email</label>
                    <p className="mt-1 text-gray-900">{credential.issuer_email || 'Not available'}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-500">Phone</label>
                    <p className="mt-1 text-gray-900">{credential.issuer_phone || 'Not available'}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-500">Website</label>
                    <p className="mt-1">
                      {credential.issuer_website ? (
                        <a href={credential.issuer_website} target="_blank" rel="noopener noreferrer" className="text-indigo-600 hover:underline">
                          {credential.issuer_website}
                        </a>
                      ) : 'Not available'}
                    </p>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'history' && (
              <div>
                {logs.length === 0 ? (
                  <div className="text-center py-12">
                    <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                    </svg>
                    <h3 className="mt-2 text-sm font-medium text-gray-900">No verification history</h3>
                    <p className="mt-1 text-sm text-gray-500">This credential hasn't been verified yet.</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {logs.map((log) => (
                      <div key={log.id} className="p-4 bg-gray-50 rounded-lg border border-gray-200">
                        <div className="flex items-start justify-between">
                          <div className="flex items-start gap-4">
                            {/* Verification result icon */}
                            <div className={`p-2 rounded-full ${
                              log.verification_result === 'authentic' ? 'bg-green-100' :
                              log.verification_result === 'fake' ? 'bg-red-100' :
                              'bg-blue-100'
                            }`}>
                              {log.verification_result === 'authentic' ? (
                                <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                </svg>
                              ) : log.verification_result === 'fake' ? (
                                <svg className="w-5 h-5 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                </svg>
                              ) : (
                                <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                </svg>
                              )}
                            </div>

                            {/* Verification details */}
                            <div className="flex-1">
                              <div className="flex items-center gap-2 mb-1">
                                <p className="font-semibold text-gray-900">{log.verifier_name || 'Unknown Verifier'}</p>
                                {log.verification_result && (
                                  <span className={`px-2 py-1 rounded-full text-xs font-semibold ${
                                    log.verification_result === 'authentic' ? 'bg-green-100 text-green-800' :
                                    log.verification_result === 'fake' ? 'bg-red-100 text-red-800' :
                                    'bg-gray-100 text-gray-800'
                                  }`}>
                                    {log.verification_result === 'authentic' ? '✓ Authentic' :
                                     log.verification_result === 'fake' ? '✗ Fake' :
                                     log.verification_result}
                                  </span>
                                )}
                              </div>
                              <p className="text-sm text-gray-600">{log.verifier_industry || 'Industry not specified'}</p>
                              <p className="text-xs text-gray-500 mt-1">
                                Action: <span className="font-medium">{log.action || 'verified'}</span>
                              </p>

                              {/* Display comments if available */}
                              {log.comments && (
                                <div className="mt-3 p-3 bg-white rounded border border-gray-200">
                                  <p className="text-xs font-medium text-gray-700 mb-1">Verifier Notes:</p>
                                  <p className="text-sm text-gray-600">{log.comments}</p>
                                </div>
                              )}
                            </div>
                          </div>

                          {/* Timestamp */}
                          <span className="text-xs text-gray-500 whitespace-nowrap ml-4">
                            {new Date(log.created_at || log.timestamp || log.verified_at).toLocaleString()}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Share Modal */}
        {showShareModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg shadow-xl max-w-md w-full mx-4">
              <div className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-xl font-bold text-gray-900">Share Credential</h2>
                  <button
                    onClick={() => {
                      setShowShareModal(false);
                      setSelectedVerifier(null);
                      setError(null);
                    }}
                    className="text-gray-400 hover:text-gray-600"
                  >
                    ✕
                  </button>
                </div>

                <p className="text-sm text-gray-600 mb-4">
                  Select a company to share this credential with for verification.
                </p>

                {error && (
                  <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-red-800 text-sm">
                    {error}
                  </div>
                )}

                {loadingVerifiers ? (
                  <div className="text-center py-8">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600 mx-auto"></div>
                  </div>
                ) : verifiers.length === 0 ? (
                  <div className="text-center py-8 text-gray-500">
                    <p>No companies registered yet</p>
                  </div>
                ) : (
                  <div className="space-y-2 max-h-64 overflow-y-auto mb-4">
                    {verifiers.map((verifier) => (
                      <label
                        key={verifier.id}
                        className={`flex items-center p-3 border rounded-lg cursor-pointer transition ${
                          selectedVerifier === verifier.id
                            ? 'border-indigo-500 bg-indigo-50'
                            : 'border-gray-200 hover:bg-gray-50'
                        }`}
                      >
                        <input
                          type="radio"
                          name="verifier"
                          value={verifier.id}
                          checked={selectedVerifier === verifier.id}
                          onChange={(e) => setSelectedVerifier(e.target.value)}
                          className="w-4 h-4 text-indigo-600"
                        />
                        <div className="ml-3 flex-1">
                          <p className="font-medium text-gray-900">{verifier.company_name}</p>
                          <p className="text-xs text-gray-500">{verifier.industry || 'Company'}</p>
                        </div>
                      </label>
                    ))}
                  </div>
                )}

                <div className="flex gap-3">
                  <button
                    onClick={() => {
                      setShowShareModal(false);
                      setSelectedVerifier(null);
                      setError(null);
                    }}
                    className="flex-1 px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition font-medium"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleShareCredential}
                    disabled={!selectedVerifier || sharing}
                    className="flex-1 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 disabled:bg-gray-300 transition font-medium"
                  >
                    {sharing ? 'Sharing...' : 'Share'}
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default CredentialDetailPage;
