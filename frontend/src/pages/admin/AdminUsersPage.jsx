import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import AdminLayout from './AdminLayout';
import { getAdminUsers, updateAdminUserStatus } from '../../services/api';

const AdminUsersPage = () => {
  const [users, setUsers] = useState([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [search, setSearch] = useState('');
  const [accountStatus, setAccountStatus] = useState('all');
  const [kycStatus, setKycStatus] = useState('all');
  const [page, setPage] = useState(1);
  const limit = 10;

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const response = await getAdminUsers({ search, accountStatus, kycStatus, page, limit });
      setUsers(response.data.users || []);
      setTotal(response.data.total || 0);
    } catch (err) {
      setError(err.message || 'Failed to load users');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, [page, accountStatus, kycStatus]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    setPage(1);
    fetchUsers();
  };

  const handleToggleStatus = async (userId, isActive) => {
    const action = isActive ? 'block' : 'unblock';
    const reason =
      action === 'block'
        ? window.prompt('Enter reason for blocking this user:')
        : '';

    if (action === 'block' && reason === null) {
      return;
    }

    if (action === 'block' && !String(reason || '').trim()) {
      setError('A reason is required to block a user account.');
      return;
    }

    try {
      await updateAdminUserStatus(userId, !isActive, reason || '');
      await fetchUsers();
    } catch (err) {
      setError(err.message || 'Failed to update user status');
    }
  };

  const totalPages = Math.max(Math.ceil(total / limit), 1);

  return (
    <AdminLayout title="User Management" subtitle="Search users and move each KYC case into the dedicated review screen">
      {error ? (
        <div className="mb-5 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">{error}</div>
      ) : null}

      <form onSubmit={handleSearchSubmit} className="mb-5 grid grid-cols-1 gap-3 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm md:grid-cols-4">
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search by name or email"
          className="rounded-xl border border-slate-200 px-3 py-2 text-sm outline-none focus:border-blue-500"
        />
        <select
          value={accountStatus}
          onChange={(e) => {
            setAccountStatus(e.target.value);
            setPage(1);
          }}
          className="rounded-xl border border-slate-200 px-3 py-2 text-sm outline-none focus:border-blue-500"
        >
          <option value="all">All Account Status</option>
          <option value="active">Active</option>
          <option value="inactive">Blocked</option>
        </select>
        <select
          value={kycStatus}
          onChange={(e) => {
            setKycStatus(e.target.value);
            setPage(1);
          }}
          className="rounded-xl border border-slate-200 px-3 py-2 text-sm outline-none focus:border-blue-500"
        >
          <option value="all">All KYC Status</option>
          <option value="pending">Pending</option>
          <option value="approved">Approved</option>
          <option value="rejected">Rejected</option>
        </select>
        <button type="submit" className="rounded-xl bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-700">
          Apply Filters
        </button>
      </form>

      <div className="mb-4 flex items-center justify-end text-sm text-slate-600">Total: {total}</div>

      <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
        {loading ? (
          <div className="p-6 text-sm text-slate-500">Loading users...</div>
        ) : users.length === 0 ? (
          <div className="p-6 text-sm text-slate-500">No users found.</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[980px]">
              <thead className="bg-slate-50 text-left text-xs uppercase tracking-wide text-slate-500">
                <tr>
                  <th className="px-4 py-3">Name</th>
                  <th className="px-4 py-3">Email</th>
                  <th className="px-4 py-3">KYC</th>
                  <th className="px-4 py-3">Status</th>
                  <th className="px-4 py-3">Created</th>
                  <th className="px-4 py-3">KYC Actions</th>
                  <th className="px-4 py-3">Account Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200 text-sm text-slate-700">
                {users.map((user) => (
                  <tr key={user.id}>
                    <td className="px-4 py-3 font-semibold">{user.first_name} {user.last_name}</td>
                    <td className="px-4 py-3">{user.email}</td>
                    <td className="px-4 py-3 capitalize">{user.kyc_status}</td>
                    <td className="px-4 py-3">{user.is_active ? 'Active' : 'Blocked'}</td>
                    <td className="px-4 py-3">{new Date(user.created_at).toLocaleDateString()}</td>
                    <td className="px-4 py-3">
                      <div className="flex flex-wrap gap-2">
                        <Link
                          to={`/admin/review-workbench?entityType=user&entityId=${user.id}`}
                          className="rounded-lg bg-indigo-100 px-3 py-1.5 text-xs font-semibold text-indigo-700 hover:bg-indigo-200"
                        >
                          Go To Review
                        </Link>
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <button
                        onClick={() => handleToggleStatus(user.id, user.is_active)}
                        className={`rounded-lg px-3 py-1.5 text-xs font-semibold ${
                          user.is_active
                            ? 'bg-red-100 text-red-700 hover:bg-red-200'
                            : 'bg-emerald-100 text-emerald-700 hover:bg-emerald-200'
                        }`}
                      >
                        {user.is_active ? 'Block' : 'Unblock'}
                      </button>
                    </td>
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

export default AdminUsersPage;
