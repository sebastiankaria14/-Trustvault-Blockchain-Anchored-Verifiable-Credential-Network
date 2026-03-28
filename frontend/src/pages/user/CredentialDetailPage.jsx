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
  const [actionMessage, setActionMessage] = useState({ type: '', text: '' });
  const [downloading, setDownloading] = useState(false);
  const [shareModalOpen, setShareModalOpen] = useState(false);
  const [verifiers, setVerifiers] = useState([]);
  const [verifiersLoading, setVerifiersLoading] = useState(false);
  const [selectedVerifierId, setSelectedVerifierId] = useState('');
  const [sharing, setSharing] = useState(false);

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

  const showActionMessage = (type, text) => {
    setActionMessage({ type, text });
    window.setTimeout(() => {
      setActionMessage({ type: '', text: '' });
    }, 2500);
  };

  const sanitizeFileName = (name) => {
    return (name || 'credential')
      .replace(/[^a-z0-9\-_. ]/gi, '')
      .trim()
      .replace(/\s+/g, '_')
      .toLowerCase();
  };

  const copyToClipboard = async (text) => {
    if (navigator.clipboard?.writeText) {
      await navigator.clipboard.writeText(text);
      return;
    }

    const textarea = document.createElement('textarea');
    textarea.value = text;
    textarea.setAttribute('readonly', '');
    textarea.style.position = 'absolute';
    textarea.style.left = '-9999px';
    document.body.appendChild(textarea);
    textarea.select();
    document.execCommand('copy');
    document.body.removeChild(textarea);
  };

  const triggerBlobDownload = (blob, fileName) => {
    const blobUrl = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = blobUrl;
    link.download = fileName;
    document.body.appendChild(link);
    link.click();
    link.remove();
    window.URL.revokeObjectURL(blobUrl);
  };

  const handleDownload = async () => {
    if (!credential || downloading) return;
    setDownloading(true);

    try {
      const baseFileName = sanitizeFileName(credential.credential_name);

      if (credential.document_url) {
        const blob = await fetch(credential.document_url).then((res) => {
          if (!res.ok) throw new Error('Failed to fetch credential document');
          return res.blob();
        });

        const mime = blob.type || '';
        const extension = mime.includes('pdf') ? 'pdf' : mime.includes('png') ? 'png' : mime.includes('jpeg') || mime.includes('jpg') ? 'jpg' : 'bin';
        triggerBlobDownload(blob, `${baseFileName}.${extension}`);
        showActionMessage('success', 'Credential file downloaded');
        return;
      }

      const fallbackContent = {
        credentialName: credential.credential_name,
        credentialType: credential.credential_type,
        status: credential.status,
        issueDate: credential.issue_date,
        expiryDate: credential.expiry_date,
        issuerName: credential.issuer_name,
        blockchainHash: credential.blockchain_hash,
        credentialNumber: credential.credential_number,
        generatedAt: new Date().toISOString()
      };

      const fallbackBlob = new Blob([JSON.stringify(fallbackContent, null, 2)], {
        type: 'application/json'
      });
      triggerBlobDownload(fallbackBlob, `${baseFileName}.json`);
      showActionMessage('success', 'Credential data downloaded');
    } catch (error) {
      console.error('Download failed:', error);
      showActionMessage('error', 'Download failed. Please try again.');
    } finally {
      setDownloading(false);
    }
  };

  const handleShareWithVerifier = async () => {
    if (!credential || !selectedVerifierId || sharing) return;
    setSharing(true);

    try {
      const response = await shareCredential(credential.id, selectedVerifierId);
      if (response.success) {
        showActionMessage('success', 'Credential shared successfully!');
        setShareModalOpen(false);
        setSelectedVerifierId('');
      }
    } catch (error) {
      console.error('Share failed:', error);
      showActionMessage('error', error.message || 'Failed to share credential. Please try again.');
    } finally {
      setSharing(false);
    }
  };

  const openShareModal = async () => {
    setShareModalOpen(true);
    if (verifiers.length === 0) {
      await fetchVerifiers();
    }
  };

  const fetchVerifiers = async () => {
    setVerifiersLoading(true);
    try {
      const response = await getVerifiers();
      if (response.success) {
        setVerifiers(response.data.verifiers || []);
      }
    } catch (error) {
      console.error('Error fetching verifiers:', error);
      showActionMessage('error', 'Failed to load verifiers');
    } finally {
      setVerifiersLoading(false);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'active': return 'bg-emerald-100 text-emerald-800';
      case 'pending': return 'bg-amber-100 text-amber-800';
      case 'expired': return 'bg-red-100 text-red-800';
      case 'revoked': return 'bg-slate-100 text-slate-800';
      default: return 'bg-slate-100 text-slate-800';
    }
  };

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-50">
        <div className="h-12 w-12 animate-spin rounded-full border-b-2 border-purple-600"></div>
      </div>
    );
  }

  if (!credential) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-50">
        <div className="text-center">
          <h2 className="text-xl font-semibold text-slate-900">Credential not found</h2>
          <Link to="/user/wallet" className="mt-2 block text-blue-600 hover:underline">
            Back to Wallet
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">
      {/* Sidebar */}
      <aside className="fixed inset-y-0 left-0 w-64 border-r border-slate-200 bg-white/90 text-slate-900 shadow-[0_20px_60px_rgba(15,23,42,0.08)] backdrop-blur-xl">
        <div className="p-6">
          <h1 className="text-2xl font-black tracking-tight text-slate-900">TrustVault</h1>
          <p className="text-sm text-slate-500">User Portal</p>
        </div>

        <nav className="mt-3 px-3">
          <Link to="/user/dashboard" className="flex items-center rounded-2xl px-4 py-3 text-slate-600 transition hover:bg-slate-50 hover:text-slate-900">
            <svg className="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
            </svg>
            Dashboard
          </Link>

          <Link to="/user/wallet" className="mt-2 flex items-center rounded-2xl border border-transparent bg-gradient-to-r from-blue-600 to-purple-600 px-4 py-3 text-white shadow-lg shadow-purple-200/50">
            <svg className="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
            </svg>
            My Wallet
          </Link>

          <Link to="/user/audit-log" className="mt-2 flex items-center rounded-2xl px-4 py-3 text-slate-600 transition hover:bg-slate-50 hover:text-slate-900">
            <svg className="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
            </svg>
            Audit Log
          </Link>

          <Link to="/user/profile" className="mt-2 flex items-center rounded-2xl px-4 py-3 text-slate-600 transition hover:bg-slate-50 hover:text-slate-900">
            <svg className="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
            </svg>
            Profile
          </Link>
        </nav>

        <div className="absolute bottom-0 w-full p-6">
          <button
            onClick={handleLogout}
            className="w-full flex items-center rounded-2xl px-4 py-3 text-slate-600 transition hover:bg-slate-50 hover:text-slate-900"
          >
            <svg className="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
            </svg>
            Logout
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="ml-64 min-h-screen p-8">
        {/* Back Button */}
        <Link to="/user/wallet" className="mb-6 inline-flex items-center text-blue-600 hover:text-blue-800">
          <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
          Back to Wallet
        </Link>

        {/* Credential Header */}
        <div className="mb-6 rounded-[1.75rem] border border-slate-200 bg-white p-6 shadow-[0_16px_40px_rgba(15,23,42,0.06)]">
          <div className="flex items-start justify-between">
            <div>
              <h1 className="text-3xl font-black tracking-tight text-slate-900">{credential.credential_name}</h1>
              <p className="mt-1 text-slate-600">{credential.credential_type}</p>
            </div>
            <span className={`rounded-full px-4 py-2 text-sm font-medium ${getStatusColor(credential.status)}`}>
              {credential.status}
            </span>
          </div>

          <div className="mt-6 flex flex-wrap gap-4">
            <button
              onClick={handleDownload}
              disabled={downloading}
              className="inline-flex items-center rounded-2xl bg-gradient-to-r from-blue-600 to-purple-600 px-4 py-3 text-white shadow-lg shadow-purple-200/50 transition hover:shadow-xl disabled:cursor-not-allowed disabled:opacity-70"
            >
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
              </svg>
              {downloading ? 'Downloading...' : 'Download PDF'}
            </button>
            <button
              onClick={handleShare}
              disabled={sharing}
              className="inline-flex items-center rounded-2xl bg-slate-100 px-4 py-3 text-slate-700 transition hover:bg-slate-200 disabled:cursor-not-allowed disabled:opacity-70"
            >
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
              </svg>
              {sharing ? 'Sharing...' : 'Share'}
            </button>
            <button
              onClick={openShareModal}
              disabled={sharing}
              className="inline-flex items-center rounded-2xl bg-emerald-100 px-4 py-3 text-emerald-700 transition hover:bg-emerald-200 disabled:cursor-not-allowed disabled:opacity-70"
            >
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
              </svg>
              {sharing ? 'Sharing...' : 'Share with Verifier'}
            </button>
          </div>

          {actionMessage.text && (
            <div
              className={`mt-4 inline-flex rounded-xl px-3 py-2 text-sm ${
                actionMessage.type === 'success' ? 'bg-emerald-100 text-emerald-800' : 'bg-red-100 text-red-800'
              }`}
            >
              {actionMessage.text}
            </div>
          )}
        </div>

        {/* Tabs */}
        <div className="overflow-hidden rounded-[1.75rem] border border-slate-200 bg-white shadow-[0_16px_40px_rgba(15,23,42,0.06)]">
          <div className="border-b border-slate-100">
            <nav className="flex -mb-px">
              <button
                onClick={() => setActiveTab('details')}
                className={`px-6 py-4 text-sm font-medium transition ${
                  activeTab === 'details'
                    ? 'border-b-2 border-purple-500 text-purple-600'
                    : 'text-slate-500 hover:text-slate-700'
                }`}
              >
                Details
              </button>
              <button
                onClick={() => setActiveTab('issuer')}
                className={`px-6 py-4 text-sm font-medium transition ${
                  activeTab === 'issuer'
                    ? 'border-b-2 border-purple-500 text-purple-600'
                    : 'text-slate-500 hover:text-slate-700'
                }`}
              >
                Issuer Info
              </button>
              <button
                onClick={() => setActiveTab('history')}
                className={`px-6 py-4 text-sm font-medium transition ${
                  activeTab === 'history'
                    ? 'border-b-2 border-purple-500 text-purple-600'
                    : 'text-slate-500 hover:text-slate-700'
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
                    <label className="text-sm font-medium text-slate-500">Credential Number</label>
                    <p className="mt-1 text-slate-900">{credential.credential_number || 'N/A'}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-slate-500">Issue Date</label>
                    <p className="mt-1 text-slate-900">{new Date(credential.issue_date).toLocaleDateString()}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-slate-500">Expiry Date</label>
                    <p className="mt-1 text-slate-900">
                      {credential.expiry_date ? new Date(credential.expiry_date).toLocaleDateString() : 'No Expiry'}
                    </p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-slate-500">Blockchain Hash</label>
                    <p className="mt-1 break-all font-mono text-sm text-slate-900">
                      {credential.blockchain_hash || 'Not recorded on blockchain'}
                    </p>
                  </div>
                </div>

                {credential.description && (
                  <div>
                    <label className="text-sm font-medium text-slate-500">Description</label>
                    <p className="mt-1 text-slate-900">{credential.description}</p>
                  </div>
                )}

                {credential.credential_data && (
                  <div>
                    <label className="text-sm font-medium text-slate-500">Additional Data</label>
                    <div className="mt-2 rounded-2xl bg-slate-50 p-4">
                      <pre className="overflow-x-auto text-sm text-slate-700">
                        {JSON.stringify(credential.credential_data, null, 2)}
                      </pre>
                    </div>
                  </div>
                )}

                {/* Credential Document/Image */}
                {credential.document_url && (
                  <div>
                    <label className="text-sm font-medium text-slate-500">Credential Document</label>
                    <div className="mt-2 rounded-2xl border border-slate-200 bg-slate-50 p-4">
                      <img
                        src={credential.document_url}
                        alt="Credential Document"
                        className="h-auto max-w-full rounded-2xl shadow-sm"
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
                  <div className="rounded-full bg-purple-100 p-4">
                    <svg className="h-8 w-8 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                    </svg>
                  </div>
                  <div className="ml-4">
                    <h3 className="text-lg font-semibold text-slate-900">{credential.issuer_name || 'Unknown Issuer'}</h3>
                    <p className="text-slate-500">{credential.issuer_type || 'Institution'}</p>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="text-sm font-medium text-slate-500">Email</label>
                    <p className="mt-1 text-slate-900">{credential.issuer_email || 'Not available'}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-slate-500">Phone</label>
                    <p className="mt-1 text-slate-900">{credential.issuer_phone || 'Not available'}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-slate-500">Website</label>
                    <p className="mt-1">
                      {credential.issuer_website ? (
                        <a href={credential.issuer_website} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
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
                    <svg className="mx-auto h-12 w-12 text-slate-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                    </svg>
                    <h3 className="mt-2 text-sm font-medium text-slate-900">No verification history</h3>
                    <p className="mt-1 text-sm text-slate-500">This credential hasn't been verified yet.</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {logs.map((log) => (
                      <div key={log.id} className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                        <div className="flex items-start justify-between">
                          <div className="flex items-start gap-4">
                            {/* Verification result icon */}
                            <div className={`rounded-full p-2 ${
                              log.verification_result === 'authentic' ? 'bg-emerald-100' :
                              log.verification_result === 'fake' ? 'bg-red-100' :
                              'bg-purple-100'
                            }`}>
                              {log.verification_result === 'authentic' ? (
                                <svg className="h-5 w-5 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                </svg>
                              ) : log.verification_result === 'fake' ? (
                                <svg className="h-5 w-5 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                </svg>
                              ) : (
                                <svg className="h-5 w-5 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                </svg>
                              )}
                            </div>

                            {/* Verification details */}
                            <div className="flex-1">
                              <div className="mb-1 flex items-center gap-2">
                                <p className="font-semibold text-slate-900">{log.verifier_name || 'Unknown Verifier'}</p>
                                {log.verification_result && (
                                  <span className={`rounded-full px-2 py-1 text-xs font-semibold ${
                                    log.verification_result === 'authentic' ? 'bg-emerald-100 text-emerald-800' :
                                    log.verification_result === 'fake' ? 'bg-red-100 text-red-800' :
                                    'bg-slate-100 text-slate-800'
                                  }`}>
                                    {log.verification_result === 'authentic' ? '✓ Authentic' :
                                     log.verification_result === 'fake' ? '✗ Fake' :
                                     log.verification_result}
                                  </span>
                                )}
                              </div>
                              <p className="text-sm text-slate-600">{log.verifier_industry || 'Industry not specified'}</p>
                              <p className="mt-1 text-xs text-slate-500">
                                Action: <span className="font-medium">{log.action || 'verified'}</span>
                              </p>

                              {/* Display comments if available */}
                              {log.comments && (
                                <div className="mt-3 rounded-2xl border border-slate-200 bg-white p-3">
                                  <p className="mb-1 text-xs font-medium text-slate-700">Verifier Notes:</p>
                                  <p className="text-sm text-slate-600">{log.comments}</p>
                                </div>
                              )}
                            </div>
                          </div>

                          {/* Timestamp */}
                          <span className="ml-4 whitespace-nowrap text-xs text-slate-500">
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
      </main>

      {/* Share Modal */}
      {shareModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
          <div className="w-full max-w-md rounded-[1.75rem] border border-slate-200 bg-white shadow-xl">
            {/* Modal Header */}
            <div className="border-b border-slate-100 px-6 py-6">
              <div className="flex items-center justify-between">
                <h2 className="text-2xl font-bold text-slate-900">Share Credential</h2>
                <button
                  onClick={() => {
                    setShareModalOpen(false);
                    setSelectedVerifierId('');
                  }}
                  className="text-slate-500 hover:text-slate-700"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
              <p className="mt-2 text-sm text-slate-600">
                Select a company/organization to share this credential with for verification
              </p>
            </div>

            {/* Modal Body */}
            <div className="max-h-96 overflow-y-auto px-6 py-4">
              {verifiersLoading ? (
                <div className="flex items-center justify-center py-12">
                  <div className="h-8 w-8 animate-spin rounded-full border-b-2 border-purple-600"></div>
                </div>
              ) : verifiers.length === 0 ? (
                <div className="text-center py-12">
                  <svg className="mx-auto h-12 w-12 text-slate-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                  </svg>
                  <h3 className="mt-4 text-sm font-medium text-slate-900">No verifiers found</h3>
                  <p className="mt-1 text-sm text-slate-500">No verification companies are currently available.</p>
                </div>
              ) : (
                <div className="space-y-2">
                  {verifiers.map((verifier) => (
                    <button
                      key={verifier.id}
                      onClick={() => setSelectedVerifierId(verifier.id)}
                      className={`w-full text-left rounded-2xl p-4 transition border-2 ${
                        selectedVerifierId === verifier.id
                          ? 'border-purple-600 bg-purple-50'
                          : 'border-slate-100 bg-slate-50 hover:border-purple-300'
                      }`}
                    >
                      <div className="flex items-start gap-3">
                        <div className={`mt-1 rounded-full p-2 ${
                          selectedVerifierId === verifier.id
                            ? 'bg-purple-100'
                            : 'bg-slate-200'
                        }`}>
                          <svg className={`w-5 h-5 ${
                            selectedVerifierId === verifier.id
                              ? 'text-purple-600'
                              : 'text-slate-600'
                          }`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                          </svg>
                        </div>
                        <div className="flex-1">
                          <p className="font-semibold text-slate-900">{verifier.company_name}</p>
                          <p className="text-sm text-slate-600">{verifier.industry || 'Industry not specified'}</p>
                          {verifier.email && (
                            <p className="text-xs text-slate-500 mt-1">{verifier.email}</p>
                          )}
                        </div>
                        {selectedVerifierId === verifier.id && (
                          <div className="text-purple-600">
                            <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                              <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z" />
                            </svg>
                          </div>
                        )}
                      </div>
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Modal Footer */}
            <div className="border-t border-slate-100 bg-slate-50 px-6 py-4 rounded-b-[1.75rem] flex gap-3">
              <button
                onClick={() => {
                  setShareModalOpen(false);
                  setSelectedVerifierId('');
                }}
                className="flex-1 rounded-2xl border border-slate-200 px-4 py-3 font-medium text-slate-700 transition hover:bg-slate-100"
              >
                Cancel
              </button>
              <button
                onClick={handleShareWithVerifier}
                disabled={!selectedVerifierId || sharing || verifiersLoading}
                className="flex-1 rounded-2xl bg-gradient-to-r from-blue-600 to-purple-600 px-4 py-3 font-medium text-white shadow-lg shadow-purple-200/50 transition hover:shadow-xl disabled:cursor-not-allowed disabled:opacity-50"
              >
                {sharing ? 'Sharing...' : 'Share Credential'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CredentialDetailPage;  
