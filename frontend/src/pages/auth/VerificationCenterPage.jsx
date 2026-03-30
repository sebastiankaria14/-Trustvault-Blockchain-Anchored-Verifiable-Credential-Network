import React, { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import {
  getVerificationCenterStatus,
  uploadVerificationDocument
} from '../../services/api';

const FILE_BASE_URL = (import.meta.env.VITE_API_URL || 'http://localhost:5000/api').replace(/\/api$/, '');

const statusBadgeClass = (status) => {
  if (status === 'approved') return 'bg-emerald-100 text-emerald-800';
  if (status === 'rejected') return 'bg-red-100 text-red-800';
  if (status === 'suspended') return 'bg-rose-100 text-rose-800';
  return 'bg-amber-100 text-amber-800';
};

const VerificationCenterPage = () => {
  const navigate = useNavigate();
  const { userType, logout } = useAuth();

  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [data, setData] = useState(null);
  const [documentType, setDocumentType] = useState('');
  const [selectedFile, setSelectedFile] = useState(null);

  const accountStatus = useMemo(() => {
    if (!data) return 'pending';
    return data.kycStatus || data.verificationStatus || 'pending';
  }, [data]);

  const targetDashboard = useMemo(() => {
    if (userType === 'user') return '/user/dashboard';
    if (userType === 'institution') return '/institution/dashboard';
    if (userType === 'verifier') return '/verifier/dashboard';
    return '/';
  }, [userType]);

  const fetchStatus = async () => {
    try {
      setLoading(true);
      setError('');
      const response = await getVerificationCenterStatus();
      const payload = response.data || {};
      setData(payload);

      const allowed = payload.allowedDocumentTypes || [];
      if (!documentType && allowed.length > 0) {
        setDocumentType(allowed[0]);
      }
    } catch (err) {
      setError(err.message || 'Failed to load verification center data.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStatus();
  }, []);

  const handleUpload = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (!documentType) {
      setError('Please select a document type.');
      return;
    }

    if (!selectedFile) {
      setError('Please choose a file to upload.');
      return;
    }

    try {
      setSubmitting(true);
      await uploadVerificationDocument(documentType, selectedFile);
      setSuccess('Document uploaded successfully. Super Admin will review it soon.');
      setSelectedFile(null);
      await fetchStatus();
    } catch (err) {
      setError(err.message || 'Failed to upload document.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="min-h-screen bg-slate-50 p-4 sm:p-8">
      <div className="mx-auto max-w-6xl">
        <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
          <div>
            <h1 className="text-3xl font-black tracking-tight text-slate-900">Verification Center</h1>
            <p className="mt-1 text-sm text-slate-600">
              Upload required documents and track review status before full portal access is enabled.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={fetchStatus}
              className="rounded-xl border border-slate-300 bg-white px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-100"
            >
              Refresh
            </button>
            <button
              onClick={handleLogout}
              className="rounded-xl border border-red-200 bg-red-50 px-4 py-2 text-sm font-semibold text-red-700 hover:bg-red-100"
            >
              Logout
            </button>
          </div>
        </div>

        {error ? (
          <div className="mb-4 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">{error}</div>
        ) : null}

        {success ? (
          <div className="mb-4 rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-700">{success}</div>
        ) : null}

        {loading ? (
          <div className="rounded-2xl border border-slate-200 bg-white p-6 text-sm text-slate-600">Loading verification details...</div>
        ) : (
          <>
            <section className="mb-6 grid grid-cols-1 gap-4 md:grid-cols-4">
              <article className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
                <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">Account Status</p>
                <span className={`mt-2 inline-flex rounded-full px-3 py-1 text-sm font-semibold ${statusBadgeClass(accountStatus)}`}>
                  {accountStatus}
                </span>
              </article>

              <article className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
                <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">Required Docs</p>
                <p className="mt-2 text-2xl font-black text-slate-900">{data?.documentSummary?.requiredTypes?.length || 0}</p>
              </article>

              <article className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
                <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">Approved Required</p>
                <p className="mt-2 text-2xl font-black text-slate-900">{data?.documentSummary?.approvedRequired?.length || 0}</p>
              </article>

              <article className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
                <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">Ready For Final Approval</p>
                <p className={`mt-2 text-lg font-black ${data?.documentSummary?.isComplete ? 'text-emerald-700' : 'text-amber-700'}`}>
                  {data?.documentSummary?.isComplete ? 'Yes' : 'No'}
                </p>
              </article>
            </section>

            {accountStatus === 'approved' ? (
              <div className="mb-6 rounded-2xl border border-emerald-200 bg-emerald-50 px-5 py-4">
                <p className="text-sm font-semibold text-emerald-800">
                  Your account is approved. You now have full feature access.
                </p>
                <button
                  onClick={() => navigate(targetDashboard)}
                  className="mt-3 rounded-xl bg-emerald-600 px-4 py-2 text-sm font-semibold text-white hover:bg-emerald-700"
                >
                  Continue to Dashboard
                </button>
              </div>
            ) : null}

            <section className="mb-6 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
              <h2 className="text-lg font-bold text-slate-900">Upload Document</h2>
              <p className="mt-1 text-sm text-slate-600">
                Upload documents in PDF/JPG/PNG/WEBP format (max 10 MB). If a document is rejected, re-upload it with the same type.
              </p>

              <form onSubmit={handleUpload} className="mt-4 grid grid-cols-1 gap-3 md:grid-cols-4">
                <select
                  value={documentType}
                  onChange={(e) => setDocumentType(e.target.value)}
                  className="rounded-xl border border-slate-300 px-3 py-2 text-sm outline-none focus:border-blue-500"
                >
                  {(data?.allowedDocumentTypes || []).map((type) => (
                    <option key={type} value={type}>{type}</option>
                  ))}
                </select>

                <input
                  type="file"
                  accept=".pdf,.jpg,.jpeg,.png,.webp"
                  onChange={(e) => setSelectedFile(e.target.files?.[0] || null)}
                  className="rounded-xl border border-slate-300 px-3 py-2 text-sm md:col-span-2"
                />

                <button
                  type="submit"
                  disabled={submitting}
                  className="rounded-xl bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {submitting ? 'Uploading...' : 'Upload'}
                </button>
              </form>
            </section>

            <section className="rounded-2xl border border-slate-200 bg-white shadow-sm">
              <div className="border-b border-slate-100 px-5 py-4">
                <h2 className="text-lg font-bold text-slate-900">Uploaded Documents</h2>
              </div>

              {!data?.documents || data.documents.length === 0 ? (
                <div className="p-5 text-sm text-slate-600">No documents uploaded yet.</div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full min-w-[980px]">
                    <thead className="bg-slate-50 text-left text-xs uppercase tracking-wide text-slate-500">
                      <tr>
                        <th className="px-4 py-3">Type</th>
                        <th className="px-4 py-3">File</th>
                        <th className="px-4 py-3">Status</th>
                        <th className="px-4 py-3">Rejection Reason</th>
                        <th className="px-4 py-3">Updated</th>
                        <th className="px-4 py-3">Open</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-200 text-sm text-slate-700">
                      {data.documents.map((doc) => (
                        <tr key={doc.id}>
                          <td className="px-4 py-3">{doc.document_type}</td>
                          <td className="px-4 py-3">{doc.original_file_name}</td>
                          <td className="px-4 py-3">
                            <span className={`inline-flex rounded-full px-2.5 py-1 text-xs font-semibold ${statusBadgeClass(doc.status)}`}>
                              {doc.status}
                            </span>
                          </td>
                          <td className="max-w-[280px] px-4 py-3">{doc.rejection_reason || '-'}</td>
                          <td className="px-4 py-3">{new Date(doc.updated_at).toLocaleString()}</td>
                          <td className="px-4 py-3">
                            <a
                              href={`${FILE_BASE_URL}${doc.file_path}`}
                              target="_blank"
                              rel="noreferrer"
                              className="text-sm font-semibold text-blue-600 hover:text-blue-700"
                            >
                              View
                            </a>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </section>
          </>
        )}
      </div>
    </div>
  );
};

export default VerificationCenterPage;
