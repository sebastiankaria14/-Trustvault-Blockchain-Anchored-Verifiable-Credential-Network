import React, { useEffect, useState } from 'react';
import AdminLayout from './AdminLayout';
import { getAdminVerifiers, approveAdminVerifier } from '../../services/api';

const AdminVerifiersPage = () => {
  const [verifiers, setVerifiers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [search, setSearch] = useState('');
  const [status, setStatus] = useState('pending');

  const fetchVerifiers = async () => {
    try {
      setLoading(true);
      const response = await getAdminVerifiers({ search, status, page: 1, limit: 50 });
      setVerifiers(response.data.verifiers || []);
    } catch (err) {
      setError(err.message || 'Failed to load verifiers');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchVerifiers();
  }, [status]);

  const handleSearch = (e) => {
    e.preventDefault();
    fetchVerifiers();
  };

  const handleAction = async (verifierId, action) => {
    try {
      await approveAdminVerifier(verifierId, action);
      await fetchVerifiers();
    } catch (err) {
      setError(err.message || `Failed to ${action} verifier`);
    }
  };

  return (
    <AdminLayout title="Verifier Management" subtitle="Approve and control organizations that perform verifications">
      {error ? (
        <div className="mb-5 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">{error}</div>
      ) : null}

      <form onSubmit={handleSearch} className="mb-5 grid grid-cols-1 gap-3 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm md:grid-cols-4">
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search verifier"
          className="rounded-xl border border-slate-200 px-3 py-2 text-sm outline-none focus:border-blue-500"
        />
        <select
          value={status}
          onChange={(e) => setStatus(e.target.value)}
          className="rounded-xl border border-slate-200 px-3 py-2 text-sm outline-none focus:border-blue-500"
        >
          <option value="all">All Status</option>
          <option value="pending">Pending</option>
          <option value="approved">Approved</option>
          <option value="rejected">Rejected</option>
          <option value="suspended">Suspended</option>
        </select>
        <button type="submit" className="rounded-xl bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-700">
          Apply Filters
        </button>
        <div className="flex items-center justify-end text-sm text-slate-600">Count: {verifiers.length}</div>
      </form>

      <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
        {loading ? (
          <div className="p-6 text-sm text-slate-500">Loading verifiers...</div>
        ) : verifiers.length === 0 ? (
          <div className="p-6 text-sm text-slate-500">No verifiers found.</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[860px]">
              <thead className="bg-slate-50 text-left text-xs uppercase tracking-wide text-slate-500">
                <tr>
                  <th className="px-4 py-3">Company</th>
                  <th className="px-4 py-3">Email</th>
                  <th className="px-4 py-3">Industry</th>
                  <th className="px-4 py-3">Status</th>
                  <th className="px-4 py-3">Created</th>
                  <th className="px-4 py-3">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200 text-sm text-slate-700">
                {verifiers.map((verifier) => (
                  <tr key={verifier.id}>
                    <td className="px-4 py-3 font-semibold">{verifier.company_name}</td>
                    <td className="px-4 py-3">{verifier.email}</td>
                    <td className="px-4 py-3">{verifier.industry || 'N/A'}</td>
                    <td className="px-4 py-3 capitalize">{verifier.verification_status}</td>
                    <td className="px-4 py-3">{new Date(verifier.created_at).toLocaleDateString()}</td>
                    <td className="px-4 py-3">
                      <div className="flex flex-wrap gap-2">
                        <button
                          onClick={() => handleAction(verifier.id, 'approve')}
                          className="rounded-lg bg-emerald-100 px-2.5 py-1 text-xs font-semibold text-emerald-700 hover:bg-emerald-200"
                        >
                          Approve
                        </button>
                        <button
                          onClick={() => handleAction(verifier.id, 'reject')}
                          className="rounded-lg bg-amber-100 px-2.5 py-1 text-xs font-semibold text-amber-700 hover:bg-amber-200"
                        >
                          Reject
                        </button>
                        <button
                          onClick={() => handleAction(verifier.id, 'suspend')}
                          className="rounded-lg bg-red-100 px-2.5 py-1 text-xs font-semibold text-red-700 hover:bg-red-200"
                        >
                          Suspend
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </AdminLayout>
  );
};

export default AdminVerifiersPage;
