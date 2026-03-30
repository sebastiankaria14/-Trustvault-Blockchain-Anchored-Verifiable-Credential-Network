import React, { useEffect, useMemo, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import AdminLayout from './AdminLayout';
import {
  approveAdminInstitution,
  approveAdminUserKyc,
  approveAdminVerifier,
  getAdminReviewCase,
  updateAdminApprovalChecklistItem,
  updateAdminReviewDocumentStatus
} from '../../services/api';

const FILE_BASE_URL = (import.meta.env.VITE_API_URL || 'http://localhost:5000/api').replace(/\/api$/, '');

const normalizeEntityType = (value) => {
  if (value === 'user' || value === 'institution' || value === 'verifier') {
    return value;
  }
  return 'user';
};

const statusBadgeClass = (status) => {
  if (status === 'approved' || status === 'passed') return 'bg-emerald-100 text-emerald-800';
  if (status === 'rejected' || status === 'failed') return 'bg-red-100 text-red-800';
  if (status === 'suspended') return 'bg-rose-100 text-rose-800';
  return 'bg-amber-100 text-amber-800';
};

const AdminReviewWorkbenchPage = () => {
  const [searchParams, setSearchParams] = useSearchParams();

  const [entityType, setEntityType] = useState(normalizeEntityType(searchParams.get('entityType') || 'user'));
  const [entityId, setEntityId] = useState(searchParams.get('entityId') || '');

  const [loading, setLoading] = useState(false);
  const [savingChecklistKey, setSavingChecklistKey] = useState('');
  const [savingDocumentId, setSavingDocumentId] = useState('');
  const [decisionLoading, setDecisionLoading] = useState(false);

  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const [reviewCase, setReviewCase] = useState(null);
  const [checklistDrafts, setChecklistDrafts] = useState({});

  const actionButtons = useMemo(() => {
    if (entityType === 'user') {
      return [
        { action: 'approve', label: 'Approve KYC' },
        { action: 'reject', label: 'Reject KYC' },
        { action: 'request_more_info', label: 'Request More Info' },
        { action: 'reset', label: 'Reset To Pending' }
      ];
    }

    return [
      { action: 'approve', label: 'Approve Account' },
      { action: 'reject', label: 'Reject Account' },
      { action: 'suspend', label: 'Suspend Account' },
      { action: 'request_more_info', label: 'Request More Info' }
    ];
  }, [entityType]);

  const loadReviewCase = async (nextEntityType = entityType, nextEntityId = entityId) => {
    if (!nextEntityId.trim()) {
      setError('Entity ID is required.');
      return;
    }

    try {
      setLoading(true);
      setError('');
      setSuccess('');

      const response = await getAdminReviewCase(nextEntityType, nextEntityId.trim());
      const payload = response.data;
      setReviewCase(payload);

      const drafts = {};
      (payload?.checklist?.items || []).forEach((item) => {
        drafts[item.checklist_key] = {
          status: item.status || 'pending',
          notes: item.notes || ''
        };
      });
      setChecklistDrafts(drafts);
    } catch (err) {
      setReviewCase(null);
      setChecklistDrafts({});
      setError(err.message || 'Failed to load review case.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (entityId) {
      loadReviewCase(entityType, entityId);
    }
  }, []);

  const handleLoad = (e) => {
    e.preventDefault();

    const trimmedEntityId = entityId.trim();
    setSearchParams({
      entityType,
      entityId: trimmedEntityId
    });

    loadReviewCase(entityType, trimmedEntityId);
  };

  const updateChecklistDraft = (checklistKey, field, value) => {
    setChecklistDrafts((prev) => ({
      ...prev,
      [checklistKey]: {
        ...(prev[checklistKey] || { status: 'pending', notes: '' }),
        [field]: value
      }
    }));
  };

  const handleChecklistSave = async (checklistKey) => {
    const draft = checklistDrafts[checklistKey];
    if (!draft) {
      return;
    }

    try {
      setSavingChecklistKey(checklistKey);
      setError('');
      setSuccess('');

      await updateAdminApprovalChecklistItem(
        entityType,
        entityId.trim(),
        checklistKey,
        draft.status,
        draft.notes
      );

      await loadReviewCase(entityType, entityId.trim());
      setSuccess('Checklist item updated.');
    } catch (err) {
      setError(err.message || 'Failed to update checklist item.');
    } finally {
      setSavingChecklistKey('');
    }
  };

  const handleDocumentDecision = async (documentId, status) => {
    try {
      setSavingDocumentId(documentId);
      setError('');
      setSuccess('');

      let rejectionReason = '';
      if (status === 'rejected') {
        const input = window.prompt('Enter rejection reason for this document:');
        if (input === null) {
          return;
        }

        if (!String(input || '').trim()) {
          setError('Rejection reason is required when rejecting a document.');
          return;
        }

        rejectionReason = input;
      }

      await updateAdminReviewDocumentStatus(
        entityType,
        entityId.trim(),
        documentId,
        status,
        rejectionReason
      );

      await loadReviewCase(entityType, entityId.trim());
      setSuccess(`Document marked as ${status}.`);
    } catch (err) {
      setError(err.message || 'Failed to update document status.');
    } finally {
      setSavingDocumentId('');
    }
  };

  const handleFinalAction = async (action) => {
    try {
      setDecisionLoading(true);
      setError('');
      setSuccess('');

      const needsReason = ['reject', 'suspend', 'request_more_info'].includes(action);
      let reason = '';
      if (needsReason) {
        const input = window.prompt(`Enter reason for action: ${action}`);
        if (input === null) {
          return;
        }

        if (!String(input || '').trim()) {
          setError('Reason is required for this action.');
          return;
        }

        reason = input;
      }

      if (entityType === 'user') {
        await approveAdminUserKyc(entityId.trim(), action, reason);
      } else if (entityType === 'institution') {
        await approveAdminInstitution(entityId.trim(), action, reason);
      } else {
        await approveAdminVerifier(entityId.trim(), action, reason);
      }

      await loadReviewCase(entityType, entityId.trim());
      setSuccess(`Action ${action} completed successfully.`);
    } catch (err) {
      const extraChecklistDetails = err.message?.includes('Review is incomplete')
        ? ' Complete missing required documents and checklist items first.'
        : '';
      setError((err.message || 'Failed to apply final action.') + extraChecklistDetails);
    } finally {
      setDecisionLoading(false);
    }
  };

  return (
    <AdminLayout
      title="Review Workbench"
      subtitle="Handle documents, checklist, and final account decisions from one screen"
    >
      {error ? (
        <div className="mb-5 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">{error}</div>
      ) : null}
      {success ? (
        <div className="mb-5 rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-700">{success}</div>
      ) : null}

      <form
        onSubmit={handleLoad}
        className="mb-5 grid grid-cols-1 gap-3 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm md:grid-cols-4"
      >
        <select
          value={entityType}
          onChange={(e) => setEntityType(normalizeEntityType(e.target.value))}
          className="rounded-xl border border-slate-300 px-3 py-2 text-sm outline-none focus:border-blue-500"
        >
          <option value="user">User</option>
          <option value="institution">Institution</option>
          <option value="verifier">Verifier</option>
        </select>

        <input
          value={entityId}
          onChange={(e) => setEntityId(e.target.value)}
          placeholder="Paste entity UUID"
          className="rounded-xl border border-slate-300 px-3 py-2 text-sm outline-none focus:border-blue-500 md:col-span-2"
        />

        <button
          type="submit"
          className="rounded-xl bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-700"
        >
          Load Case
        </button>
      </form>

      {loading ? (
        <div className="rounded-2xl border border-slate-200 bg-white p-6 text-sm text-slate-600">Loading review case...</div>
      ) : !reviewCase ? (
        <div className="rounded-2xl border border-slate-200 bg-white p-6 text-sm text-slate-600">Load a case to start review.</div>
      ) : (
        <>
          <section className="mb-5 grid grid-cols-1 gap-3 md:grid-cols-4">
            <article className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
              <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">Account Status</p>
              <span className={`mt-2 inline-flex rounded-full px-3 py-1 text-sm font-semibold ${statusBadgeClass(reviewCase.accountStatus)}`}>
                {reviewCase.accountStatus}
              </span>
            </article>
            <article className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
              <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">Required Docs Approved</p>
              <p className="mt-2 text-2xl font-black text-slate-900">
                {reviewCase.documentSummary?.approvedRequired?.length || 0}/{reviewCase.documentSummary?.requiredTypes?.length || 0}
              </p>
            </article>
            <article className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
              <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">Checklist Passed</p>
              <p className="mt-2 text-2xl font-black text-slate-900">
                {reviewCase.checklist?.summary?.passedRequired || 0}/{reviewCase.checklist?.summary?.requiredTotal || 0}
              </p>
            </article>
            <article className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
              <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">Approval Ready</p>
              <p className={`mt-2 text-lg font-black ${(reviewCase.documentSummary?.isComplete && reviewCase.checklist?.summary?.isComplete) ? 'text-emerald-700' : 'text-amber-700'}`}>
                {(reviewCase.documentSummary?.isComplete && reviewCase.checklist?.summary?.isComplete) ? 'Yes' : 'No'}
              </p>
            </article>
          </section>

          <section className="mb-5 rounded-2xl border border-slate-200 bg-white shadow-sm">
            <div className="border-b border-slate-100 px-5 py-4">
              <h2 className="text-lg font-bold text-slate-900">Document Review</h2>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full min-w-[1080px]">
                <thead className="bg-slate-50 text-left text-xs uppercase tracking-wide text-slate-500">
                  <tr>
                    <th className="px-4 py-3">Type</th>
                    <th className="px-4 py-3">File</th>
                    <th className="px-4 py-3">Status</th>
                    <th className="px-4 py-3">Rejection Reason</th>
                    <th className="px-4 py-3">Updated</th>
                    <th className="px-4 py-3">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200 text-sm text-slate-700">
                  {(reviewCase.documents || []).map((doc) => (
                    <tr key={doc.id}>
                      <td className="px-4 py-3">{doc.document_type}</td>
                      <td className="px-4 py-3">
                        <a href={`${FILE_BASE_URL}${doc.file_path}`} target="_blank" rel="noreferrer" className="font-semibold text-blue-600 hover:text-blue-700">
                          {doc.original_file_name}
                        </a>
                      </td>
                      <td className="px-4 py-3">
                        <span className={`inline-flex rounded-full px-2.5 py-1 text-xs font-semibold ${statusBadgeClass(doc.status)}`}>
                          {doc.status}
                        </span>
                      </td>
                      <td className="max-w-[280px] px-4 py-3">{doc.rejection_reason || '-'}</td>
                      <td className="px-4 py-3">{new Date(doc.updated_at).toLocaleString()}</td>
                      <td className="px-4 py-3">
                        <div className="flex flex-wrap gap-2">
                          <button
                            onClick={() => handleDocumentDecision(doc.id, 'approved')}
                            disabled={savingDocumentId === doc.id}
                            className="rounded-lg bg-emerald-100 px-2.5 py-1 text-xs font-semibold text-emerald-700 hover:bg-emerald-200 disabled:opacity-50"
                          >
                            Approve
                          </button>
                          <button
                            onClick={() => handleDocumentDecision(doc.id, 'rejected')}
                            disabled={savingDocumentId === doc.id}
                            className="rounded-lg bg-red-100 px-2.5 py-1 text-xs font-semibold text-red-700 hover:bg-red-200 disabled:opacity-50"
                          >
                            Reject
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>

          <section className="mb-5 rounded-2xl border border-slate-200 bg-white shadow-sm">
            <div className="border-b border-slate-100 px-5 py-4">
              <h2 className="text-lg font-bold text-slate-900">Checklist Review</h2>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full min-w-[1080px]">
                <thead className="bg-slate-50 text-left text-xs uppercase tracking-wide text-slate-500">
                  <tr>
                    <th className="px-4 py-3">Item</th>
                    <th className="px-4 py-3">Required</th>
                    <th className="px-4 py-3">Status</th>
                    <th className="px-4 py-3">Notes</th>
                    <th className="px-4 py-3">Save</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200 text-sm text-slate-700">
                  {(reviewCase.checklist?.items || []).map((item) => {
                    const draft = checklistDrafts[item.checklist_key] || { status: 'pending', notes: '' };

                    return (
                      <tr key={item.checklist_key}>
                        <td className="px-4 py-3">
                          <p className="font-semibold text-slate-900">{item.title}</p>
                          <p className="mt-1 text-xs text-slate-500">{item.description || 'No description.'}</p>
                        </td>
                        <td className="px-4 py-3">{item.required ? 'Yes' : 'No'}</td>
                        <td className="px-4 py-3">
                          <select
                            value={draft.status}
                            onChange={(e) => updateChecklistDraft(item.checklist_key, 'status', e.target.value)}
                            className="rounded-lg border border-slate-300 px-2.5 py-1.5 text-sm"
                          >
                            <option value="pending">Pending</option>
                            <option value="passed">Passed</option>
                            <option value="failed">Failed</option>
                          </select>
                        </td>
                        <td className="px-4 py-3">
                          <textarea
                            rows={2}
                            value={draft.notes}
                            onChange={(e) => updateChecklistDraft(item.checklist_key, 'notes', e.target.value)}
                            className="w-full min-w-[280px] rounded-lg border border-slate-300 px-2.5 py-1.5 text-sm"
                            placeholder="Checklist notes"
                          />
                        </td>
                        <td className="px-4 py-3">
                          <button
                            onClick={() => handleChecklistSave(item.checklist_key)}
                            disabled={savingChecklistKey === item.checklist_key}
                            className="rounded-lg bg-blue-600 px-3 py-1.5 text-xs font-semibold text-white hover:bg-blue-700 disabled:opacity-50"
                          >
                            {savingChecklistKey === item.checklist_key ? 'Saving...' : 'Save'}
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </section>

          <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <h2 className="text-lg font-bold text-slate-900">Final Decision Actions</h2>
            <p className="mt-1 text-sm text-slate-600">
              Apply final account decision from this review workbench.
            </p>
            <div className="mt-4 flex flex-wrap gap-2">
              {actionButtons.map((item) => (
                <button
                  key={item.action}
                  onClick={() => handleFinalAction(item.action)}
                  disabled={decisionLoading}
                  className="rounded-lg bg-indigo-100 px-3 py-2 text-sm font-semibold text-indigo-700 hover:bg-indigo-200 disabled:opacity-50"
                >
                  {item.label}
                </button>
              ))}
            </div>
          </section>
        </>
      )}
    </AdminLayout>
  );
};

export default AdminReviewWorkbenchPage;
