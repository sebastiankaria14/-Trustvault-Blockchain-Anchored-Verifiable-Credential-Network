import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { getCredentialForVerification, verifyCredential, requestReVerification } from '../../services/api';

const VerificationDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [credential, setCredential] = useState(null);
  const [loading, setLoading] = useState(true);
  const [verifying, setVerifying] = useState(false);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState('details');
  const [verified, setVerified] = useState(false);
  const [verificationResult, setVerificationResult] = useState(null);
  const [requestingReVerification, setRequestingReVerification] = useState(false);
  const [reVerificationMessage, setReVerificationMessage] = useState(null);
  const [reVerificationReason, setReVerificationReason] = useState('');
  const [showRequestForm, setShowRequestForm] = useState(false);

  useEffect(() => {
    const fetchCredential = async () => {
      try {
        setLoading(true);
        const response = await getCredentialForVerification(id);
        if (response.data) {
          setCredential(response.data.credential);
        }
      } catch (err) {
        console.error('Error fetching credential:', err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchCredential();
  }, [id]);

  const handleVerify = async () => {
    try {
      setVerifying(true);
      setError(null);

      // Call API - NO manual input, backend does automatic verification
      const response = await verifyCredential(id);

      if (response.success) {
        setVerificationResult(response.data);
        setVerified(true);

        // Keep window open - user can manually close or navigate back
      }
    } catch (err) {
      console.error('Error verifying credential:', err);
      setError(err.message || 'Failed to verify credential');
    } finally {
      setVerifying(false);
    }
  };

  const handleRequestReVerification = async () => {
    try {
      setRequestingReVerification(true);
      setError(null);

      const response = await requestReVerification(id, reVerificationReason);

      if (response.success) {
        setReVerificationMessage('Re-verification request sent to user successfully!');
        setShowRequestForm(false);
        setReVerificationReason('');

        // Clear message after 3 seconds
        setTimeout(() => setReVerificationMessage(null), 3000);
      }
    } catch (err) {
      console.error('Error requesting re-verification:', err);
      setError(err.message || 'Failed to request re-verification');
    } finally {
      setRequestingReVerification(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-blue-50 to-neutral-50 ml-64 p-8">
        <div className="max-w-4xl mx-auto space-y-6">
          {[1, 2, 3].map(() => (
            <div key={Math.random()} className="h-20 bg-white rounded-lg animate-pulse" />
          ))}
        </div>
      </div>
    );
  }

  if (error || !credential) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-blue-50 to-neutral-50 ml-64 p-8">
        <div className="max-w-4xl mx-auto">
          <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-red-800">
            <h3 className="font-bold mb-2">Error</h3>
            <p>{error || 'Credential not found'}</p>
            <Link to="/verifier/verification-requests" className="text-red-600 hover:text-red-700 mt-4 inline-block font-medium">
              ← Back to Requests
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const credentialData = credential.credential_data || {};
  const isAlreadyVerified = credential.share_status === 'verified' || credential.share_status === 'rejected';

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
      <main className="ml-64 min-h-screen bg-gradient-to-br from-indigo-50 via-blue-50 to-neutral-50 p-8">
        <div className="max-w-4xl mx-auto">
          {/* Back Button */}
          <Link
            to="/verifier/verification-requests"
            className="text-indigo-600 hover:text-indigo-700 font-medium mb-6 inline-block"
          >
            ← Back to Requests
          </Link>

          {/* Header */}
          <div className="bg-white rounded-xl shadow-sm border border-neutral-200 p-6 mb-8">
            <div className="flex items-start justify-between gap-6 mb-6">
              <div>
                <h1 className="text-3xl font-bold text-neutral-900">{credential.credential_name}</h1>
                <p className="text-neutral-600 mt-2">Credential Type: {credential.credential_type}</p>
              </div>

              <span className={`px-4 py-2 rounded-full font-semibold ${
                credential.status === 'active'
                  ? 'bg-green-100 text-green-800'
                  : credential.status === 'pending'
                  ? 'bg-amber-100 text-amber-800'
                  : 'bg-red-100 text-red-800'
              }`}>
                {credential.status.toUpperCase()}
              </span>
            </div>

            {/* Tabs */}
            <div className="flex gap-4 border-b border-neutral-200">
              <button
                onClick={() => setActiveTab('details')}
                className={`px-4 py-2 font-medium transition-colors border-b-2 ${
                  activeTab === 'details'
                    ? 'border-indigo-600 text-indigo-600'
                    : 'border-transparent text-neutral-600 hover:text-neutral-900'
                }`}
              >
                Details
              </button>
              <button
                onClick={() => setActiveTab('issuer')}
                className={`px-4 py-2 font-medium transition-colors border-b-2 ${
                  activeTab === 'issuer'
                    ? 'border-indigo-600 text-indigo-600'
                    : 'border-transparent text-neutral-600 hover:text-neutral-900'
                }`}
              >
                Issuer Info
              </button>
              <button
                onClick={() => setActiveTab('verify')}
                className={`px-4 py-2 font-medium transition-colors border-b-2 ${
                  activeTab === 'verify'
                    ? 'border-indigo-600 text-indigo-600'
                    : 'border-transparent text-neutral-600 hover:text-neutral-900'
                }`}
              >
                Verify
              </button>
            </div>
          </div>

          {/* Error Message */}
          {error && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg text-red-800 text-sm">
              {error}
            </div>
          )}

          {/* Tabs Content */}
          {activeTab === 'details' && (
            <div className="space-y-6">
              {/* Document Image */}
              {credential.document_url && (
                <div className="bg-white rounded-xl shadow-sm border border-neutral-200 p-6">
                  <h3 className="font-bold text-neutral-900 mb-4">Document</h3>
                  <img
                    src={credential.document_url}
                    alt="Credential Document"
                    className="max-w-full h-auto rounded-lg border border-neutral-200"
                    style={{ maxHeight: '500px' }}
                  />
                </div>
              )}

              {/* Details Grid */}
              <div className="bg-white rounded-xl shadow-sm border border-neutral-200 p-6">
                <h3 className="font-bold text-neutral-900 mb-4">Credential Information</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-neutral-600">Issued Date</p>
                    <p className="font-medium text-neutral-900 mt-1">
                      {new Date(credential.issue_date).toLocaleDateString()}
                    </p>
                  </div>
                  {credential.expiry_date && (
                    <div>
                      <p className="text-sm text-neutral-600">Expiry Date</p>
                      <p className="font-medium text-neutral-900 mt-1">
                        {new Date(credential.expiry_date).toLocaleDateString()}
                      </p>
                    </div>
                  )}
                  {credential.blockchain_hash && (
                    <div className="col-span-2">
                      <p className="text-sm text-neutral-600">Blockchain Hash</p>
                      <p className="font-mono text-sm text-neutral-900 mt-1 break-all bg-neutral-50 p-2 rounded">
                        {credential.blockchain_hash}
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {activeTab === 'issuer' && (
            <div className="bg-white rounded-xl shadow-sm border border-neutral-200 p-6">
              <h3 className="font-bold text-neutral-900 mb-4">Issuer Information</h3>
              <div className="space-y-4">
                <div>
                  <p className="text-sm text-neutral-600">Organization</p>
                  <p className="font-medium text-neutral-900 mt-1">{credential.issuer_name || 'N/A'}</p>
                </div>
                {credential.issuer_email && (
                  <div>
                    <p className="text-sm text-neutral-600">Email</p>
                    <p className="font-medium text-neutral-900 mt-1">{credential.issuer_email}</p>
                  </div>
                )}
                {credential.issuer_website && (
                  <div>
                    <p className="text-sm text-neutral-600">Website</p>
                    <a
                      href={credential.issuer_website}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="font-medium text-indigo-600 hover:text-indigo-700 mt-1"
                    >
                      {credential.issuer_website}
                    </a>
                  </div>
                )}
              </div>
            </div>
          )}

          {activeTab === 'verify' && (
            <div className="bg-white rounded-xl shadow-sm border border-neutral-200 p-6">
              <h3 className="font-bold text-neutral-900 mb-6">Blockchain Verification</h3>

              {isAlreadyVerified ? (
                // Show that it's already been verified
                <div className={`rounded-lg p-8 text-center border-2 ${
                  credential.share_status === 'verified'
                    ? 'bg-green-50 border-green-200'
                    : 'bg-red-50 border-red-200'
                }`}>
                  <div className={`text-5xl mb-4 ${
                    credential.share_status === 'verified' ? 'text-green-600' : 'text-red-600'
                  }`}>
                    {credential.share_status === 'verified' ? '✓' : '✗'}
                  </div>

                  <h2 className={`text-xl font-bold mb-2 ${
                    credential.share_status === 'verified' ? 'text-green-800' : 'text-red-800'
                  }`}>
                    {credential.share_status === 'verified' ? 'ALREADY VERIFIED' : 'ALREADY MARKED AS FAKE'}
                  </h2>

                  <p className={`text-sm mb-6 ${
                    credential.share_status === 'verified' ? 'text-green-700' : 'text-red-700'
                  }`}>
                    {credential.share_status === 'verified'
                      ? 'You have already verified this credential. The blockchain verification was successful.'
                      : 'You have already verified this credential. It was marked as inauthentic.'}
                  </p>

                  {credential.share_verified_at && (
                    <div className="bg-white rounded-lg p-4 mb-6 text-left">
                      <p className="text-xs text-neutral-600 font-medium mb-2">VERIFICATION TIMESTAMP</p>
                      <p className="text-sm text-neutral-900">
                        Verified on: {new Date(credential.share_verified_at).toLocaleString()}
                      </p>
                    </div>
                  )}

                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
                    <p className="text-xs text-blue-800 font-medium">ℹ️ Status</p>
                    <p className="text-xs text-blue-700 mt-2">
                      Once a credential is verified, it cannot be verified again. This protects the integrity of the verification process.
                    </p>
                  </div>

                  {reVerificationMessage && (
                    <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-6">
                      <p className="text-sm text-green-800">✓ {reVerificationMessage}</p>
                    </div>
                  )}

                  {!showRequestForm ? (
                    <div className="flex gap-4">
                      <button
                        onClick={() => setShowRequestForm(true)}
                        className="flex-1 px-6 py-3 bg-amber-600 hover:bg-amber-700 text-white font-medium rounded-lg transition-colors"
                      >
                        Request Re-verification
                      </button>
                      <Link
                        to="/verifier/verification-requests"
                        className="flex-1 px-6 py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-medium rounded-lg transition-colors text-center"
                      >
                        Back to Requests
                      </Link>
                      <Link
                        to="/verifier/history"
                        className="flex-1 px-6 py-3 bg-neutral-200 hover:bg-neutral-300 text-neutral-900 font-medium rounded-lg transition-colors text-center"
                      >
                        View History
                      </Link>
                    </div>
                  ) : (
                    <div className="bg-amber-50 border border-amber-200 rounded-lg p-6 space-y-4">
                      <h4 className="font-semibold text-amber-900">Request Re-verification</h4>
                      <p className="text-sm text-amber-800">
                        This will send a request to the user to approve re-verification. Once approved, you can verify this credential again.
                      </p>

                      <div>
                        <label className="block text-sm font-medium text-neutral-700 mb-2">
                          Reason for Re-verification (Optional)
                        </label>
                        <textarea
                          value={reVerificationReason}
                          onChange={(e) => setReVerificationReason(e.target.value)}
                          placeholder="e.g., Document quality improved, Need updated verification, etc."
                          className="w-full px-4 py-2 border border-neutral-300 rounded-lg focus:outline-none focus:border-indigo-600 resize-none"
                          rows="3"
                        />
                      </div>

                      <div className="flex gap-4">
                        <button
                          onClick={handleRequestReVerification}
                          disabled={requestingReVerification}
                          className="flex-1 px-6 py-3 bg-amber-600 hover:bg-amber-700 disabled:bg-neutral-300 disabled:cursor-not-allowed text-white font-medium rounded-lg transition-colors flex items-center justify-center gap-2"
                        >
                          {requestingReVerification ? (
                            <>
                              <span className="animate-spin">⏳</span>
                              Sending Request...
                            </>
                          ) : (
                            <>
                              <span>📩</span>
                              Send Request to User
                            </>
                          )}
                        </button>
                        <button
                          onClick={() => {
                            setShowRequestForm(false);
                            setReVerificationReason('');
                          }}
                          className="flex-1 px-6 py-3 bg-neutral-200 hover:bg-neutral-300 text-neutral-900 font-medium rounded-lg transition-colors"
                        >
                          Cancel
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              ) : verified ? (
                // Display automatic result after verification
                <div className={`rounded-lg p-8 text-center ${
                  verificationResult?.isAuthentic
                    ? 'bg-green-50 border border-green-200'
                    : 'bg-red-50 border border-red-200'
                }`}>
                  <div className={`text-6xl mb-4 ${
                    verificationResult?.isAuthentic ? 'text-green-600' : 'text-red-600'
                  }`}>
                    {verificationResult?.isAuthentic ? '✓' : '✗'}
                  </div>

                  <h2 className={`text-2xl font-bold mb-2 ${
                    verificationResult?.isAuthentic ? 'text-green-800' : 'text-red-800'
                  }`}>
                    {verificationResult?.isAuthentic ? 'AUTHENTIC' : 'FAKE'}
                  </h2>

                  <p className={`text-sm mb-6 ${
                    verificationResult?.isAuthentic ? 'text-green-700' : 'text-red-700'
                  }`}>
                    {verificationResult?.isAuthentic
                      ? 'This credential matches the blockchain record'
                      : 'This credential does NOT match the blockchain record'}
                  </p>

                  {/* Hash comparison details */}
                  {verificationResult && (
                    <div className="bg-white rounded-lg p-4 mt-6 text-left space-y-3">
                      <div className="border-b border-neutral-200 pb-3 mb-3">
                        <p className="text-xs text-neutral-600 font-medium">VERIFICATION DETAILS</p>
                      </div>
                      <div>
                        <p className="text-xs text-neutral-600">Blockchain Hash:</p>
                        <p className="text-xs font-mono text-neutral-900 mt-1 break-all bg-neutral-50 p-2 rounded">
                          {verificationResult.blockchainHash}
                        </p>
                      </div>
                      <div>
                        <p className="text-xs text-neutral-600">Calculated Hash:</p>
                        <p className="text-xs font-mono text-neutral-900 mt-1 break-all bg-neutral-50 p-2 rounded">
                          {verificationResult.calculatedHash}
                        </p>
                      </div>
                      <div className="pt-3 border-t border-neutral-200">
                        <p className="text-xs text-neutral-600">Verified At:</p>
                        <p className="text-sm text-neutral-900 mt-1">
                          {new Date(verificationResult.verified_at).toLocaleString()}
                        </p>
                      </div>
                    </div>
                  )}

                  <div className="mt-6 flex gap-4">
                    <button
                      onClick={() => setVerified(false)}
                      className="flex-1 px-6 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-medium rounded-lg transition-colors"
                    >
                      Close
                    </button>
                    <Link
                      to="/verifier/verification-requests"
                      className="flex-1 px-6 py-2 bg-neutral-200 hover:bg-neutral-300 text-neutral-900 font-medium rounded-lg transition-colors text-center"
                    >
                      Back to Requests
                    </Link>
                  </div>
                </div>
              ) : (
                // Verification form - SIMPLIFIED, just a button
                <div className="space-y-4">
                  <p className="text-sm text-neutral-600">
                    Click the button below to run automatic blockchain verification. The system will compare this credential's hash against the blockchain record to determine if it's authentic.
                  </p>

                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                    <p className="text-xs text-blue-800 font-medium">ℹ️ How it works:</p>
                    <p className="text-xs text-blue-700 mt-2">
                      The backend will calculate a cryptographic hash of this credential and compare it with the hash stored on the blockchain by the issuing institution. If they match, the credential is AUTHENTIC. If they don't match, the credential is FAKE.
                    </p>
                  </div>

                  <div className="flex gap-4 pt-4">
                    <button
                      onClick={handleVerify}
                      disabled={verifying}
                      className="flex-1 px-6 py-3 bg-indigo-600 hover:bg-indigo-700 disabled:bg-neutral-300 disabled:cursor-not-allowed text-white font-medium rounded-lg transition-colors flex items-center justify-center gap-2"
                    >
                      {verifying ? (
                        <>
                          <span className="animate-spin">⏳</span>
                          Verifying...
                        </>
                      ) : (
                        <>
                          <span>🔍</span>
                          Run Blockchain Verification
                        </>
                      )}
                    </button>
                    <Link
                      to="/verifier/verification-requests"
                      className="flex-1 px-6 py-3 bg-neutral-200 hover:bg-neutral-300 text-neutral-900 font-medium rounded-lg transition-colors text-center"
                    >
                      Cancel
                    </Link>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default VerificationDetailPage;
