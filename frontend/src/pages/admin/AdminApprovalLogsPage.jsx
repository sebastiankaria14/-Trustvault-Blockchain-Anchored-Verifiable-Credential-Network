import React, { useEffect, useState } from 'react';
import AdminLayout from './AdminLayout';
import { getAdminApprovalLogs } from '../../services/api';

const AdminApprovalLogsPage = () => {
  const [logs, setLogs] = useState([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [search, setSearch] = useState('');
  const [entityType, setEntityType] = useState('all');
  const [action, setAction] = useState('all');
  const [page, setPage] = useState(1);
  const limit = 15;

  const fetchLogs = async () => {
    try {
      setLoading(true);
      const response = await getAdminApprovalLogs({
        entityType,
        action,
        search,
        page,
        limit
      });
      setLogs(response.data.logs || []);
      setTotal(response.data.total || 0);
    } catch (err) {
      setError(err.message || 'Failed to load approval logs');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLogs();
  }, [entityType, action, page]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    setPage(1);
    fetchLogs();
  };

  const totalPages = Math.max(Math.ceil(total / limit), 1);

  return (
    <AdminLayout title="Approval Audit Logs" subtitle="Track every approval decision, reason, and acting admin">
      {error ? (
        <div className="mb-5 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">{error}</div>
      ) : null}

      <form onSubmit={handleSearchSubmit} className="mb-5 grid grid-cols-1 gap-3 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm md:grid-cols-5">
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search by email or reason"
          className="rounded-xl border border-slate-200 px-3 py-2 text-sm outline-none focus:border-blue-500"
        />
        <select
          value={entityType}
          onChange={(e) => {
            setEntityType(e.target.value);
            setPage(1);
          }}
          className="rounded-xl border border-slate-200 px-3 py-2 text-sm outline-none focus:border-blue-500"
        >
          <option value="all">All Entity Types</option>
          <option value="user">Users</option>
          <option value="institution">Institutions</option>
          <option value="verifier">Verifiers</option>
        </select>
        <select
          value={action}
          onChange={(e) => {
            setAction(e.target.value);
            setPage(1);
          }}
          className="rounded-xl border border-slate-200 px-3 py-2 text-sm outline-none focus:border-blue-500"
        >
          <option value="all">All Actions</option>
          <option value="approve">Approve</option>
          <option value="reject">Reject</option>
          <option value="suspend">Suspend</option>
          <option value="block">Block</option>
          <option value="unblock">Unblock</option>
          <option value="reset">Reset</option>
          <option value="request_more_info">Request More Info</option>
        </select>
        <button type="submit" className="rounded-xl bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-700">
          Apply Filters
        </button>
        <div className="flex items-center justify-end text-sm text-slate-600">Total: {total}</div>
      </form>

      <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
        {loading ? (
          <div className="p-6 text-sm text-slate-500">Loading approval logs...</div>
        ) : logs.length === 0 ? (
          <div className="p-6 text-sm text-slate-500">No approval logs found.</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[1100px]">
              <thead className="bg-slate-50 text-left text-xs uppercase tracking-wide text-slate-500">
                <tr>
                  <th className="px-4 py-3">When</th>
                  <th className="px-4 py-3">Entity</th>
                  <th className="px-4 py-3">Email</th>
                  <th className="px-4 py-3">Action</th>
                  <th className="px-4 py-3">Status Change</th>
                  <th className="px-4 py-3">Reason</th>
                  <th className="px-4 py-3">Admin</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200 text-sm text-slate-700">
                {logs.map((log) => (
                  <tr key={log.id}>
                    <td className="px-4 py-3">{new Date(log.created_at).toLocaleString()}</td>
                    <td className="px-4 py-3 capitalize">{log.entity_type} #{log.entity_id}</td>
                    <td className="px-4 py-3">{log.entity_email || 'N/A'}</td>
                    <td className="px-4 py-3 capitalize">{String(log.action || '').replaceAll('_', ' ')}</td>
                    <td className="px-4 py-3">
                      <span className="capitalize">{log.previous_status || 'none'}</span>
                      {' -> '}
                      <span className="capitalize">{log.new_status || 'none'}</span>
                    </td>
                    <td className="max-w-[280px] px-4 py-3">{log.reason || '-'}</td>
                    <td className="px-4 py-3">{log.admin_name || `Admin #${log.admin_id || 'unknown'}`}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      <div className="mt-4 flex items-center justify-end gap-2">
        <button
          onClick={() => setPage((prev) => Math.max(prev - 1, 1))}
          disabled={page === 1}
          className="rounded-lg border border-slate-300 px-3 py-1.5 text-sm disabled:cursor-not-allowed disabled:opacity-50"
        >
          Prev
        </button>
        <span className="text-sm text-slate-600">Page {page} of {totalPages}</span>
        <button
          onClick={() => setPage((prev) => Math.min(prev + 1, totalPages))}
          disabled={page >= totalPages}
          className="rounded-lg border border-slate-300 px-3 py-1.5 text-sm disabled:cursor-not-allowed disabled:opacity-50"
        >
          Next
        </button>
      </div>
    </AdminLayout>
  );
};

export default AdminApprovalLogsPage;
