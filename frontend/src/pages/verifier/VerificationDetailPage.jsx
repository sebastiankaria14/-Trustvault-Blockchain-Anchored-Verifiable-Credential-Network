import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { getCredentialForVerification, verifyCredential } from '../../services/api';

const VerificationDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [credential, setCredential] = useState(null);
  const [loading, setLoading] = useState(true);
  const [verifying, setVerifying] = useState(false);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState('details');
  const [verificationResult, setVerificationResult] = useState('');
  const [comments, setComments] = useState('');
  const [verified, setVerified] = useState(false);

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
    if (!verificationResult) {
      alert('Please select verification result');
      return;
    }

    try {
      setVerifying(true);
      const response = await verifyCredential(id, {
        verificationResult,
        comments: comments || null
      });

      if (response.success) {
        setVerified(true);
        alert('Credential verified successfully!');
        setTimeout(() => navigate('/verifier/verification-requests'), 2000);
      }
    } catch (err) {
      console.error('Error verifying credential:', err);
      setError(err.message);
    } finally {
      setVerifying(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 via-violet-50 to-neutral-50 ml-64 p-8">
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
      <div className="min-h-screen bg-gradient-to-br from-purple-50 via-violet-50 to-neutral-50 ml-64 p-8">
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

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-violet-50 to-neutral-50">
      {/* Sidebar Navigation */}
      <aside className="fixed left-0 top-0 w-64 h-screen bg-white border-r border-neutral-200 shadow-sm sidebar">
        <div className="p-6">
          <h2 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
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
      <main className="ml-64 min-h-screen bg-gradient-to-br from-purple-50 via-violet-50 to-neutral-50 p-8">
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
              <h3 className="font-bold text-neutral-900 mb-4">Verification</h3>

              {verified ? (
                <div className="bg-green-50 border border-green-200 rounded-lg p-6 text-center">
                  <p className="text-4xl mb-2">✓</p>
                  <p className="text-lg font-bold text-green-800 mb-1">Credential Verified!</p>
                  <p className="text-sm text-green-700">Result: {verificationResult}</p>
                  <p className="text-xs text-green-600 mt-4">Redirecting...</p>
                </div>
              ) : (
                <div className="space-y-6">
                  <div>
                    <label className="block text-sm font-medium text-neutral-900 mb-3">Verification Result *</label>
                    <div className="space-y-2">
                      <label className="flex items-center gap-3 p-4 border border-neutral-200 rounded-lg hover:bg-neutral-50 cursor-pointer">
                        <input
                          type="radio"
                          value="authentic"
                          checked={verificationResult === 'authentic'}
                          onChange={(e) => setVerificationResult(e.target.value)}
                          className="w-4 h-4"
                        />
                        <div>
                          <p className="font-medium text-neutral-900">✓ Authentic</p>
                          <p className="text-xs text-neutral-600">Credential is genuine and valid</p>
                        </div>
                      </label>

                      <label className="flex items-center gap-3 p-4 border border-neutral-200 rounded-lg hover:bg-neutral-50 cursor-pointer">
                        <input
                          type="radio"
                          value="fake"
                          checked={verificationResult === 'fake'}
                          onChange={(e) => setVerificationResult(e.target.value)}
                          className="w-4 h-4"
                        />
                        <div>
                          <p className="font-medium text-neutral-900">✗ Fake</p>
                          <p className="text-xs text-neutral-600">Credential is fraudulent or invalid</p>
                        </div>
                      </label>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-neutral-900 mb-2">Comments (Optional)</label>
                    <textarea
                      value={comments}
                      onChange={(e) => setComments(e.target.value)}
                      placeholder="Add any notes about this verification..."
                      rows="4"
                      className="w-full px-4 py-2 border border-neutral-300 rounded-lg focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20"
                    />
                  </div>

                  <div className="flex gap-4">
                    <button
                      onClick={handleVerify}
                      disabled={verifying || !verificationResult}
                      className="flex-1 px-6 py-3 bg-indigo-600 hover:bg-indigo-700 disabled:bg-neutral-300 text-white font-medium rounded-lg transition-colors"
                    >
                      {verifying ? 'Verifying...' : 'Submit Verification'}
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
