import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import AdminLayout from './AdminLayout';
import { getAdminInstitutions } from '../../services/api';

const AdminInstitutionsPage = () => {
  const [institutions, setInstitutions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [search, setSearch] = useState('');
  const [status, setStatus] = useState('pending');

  const fetchInstitutions = async () => {
    try {
      setLoading(true);
      const response = await getAdminInstitutions({ search, status, page: 1, limit: 50 });
      setInstitutions(response.data.institutions || []);
    } catch (err) {
      setError(err.message || 'Failed to load institutions');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchInstitutions();
  }, [status]);

  const handleSearch = (e) => {
    e.preventDefault();
    fetchInstitutions();
  };

  return (
    <AdminLayout title="Institution Management" subtitle="Move each institution into the dedicated review screen for all approval decisions">
      {error ? (
        <div className="mb-5 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">{error}</div>
      ) : null}

      <form onSubmit={handleSearch} className="mb-5 grid grid-cols-1 gap-3 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm md:grid-cols-4">
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search institution"
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
        <div className="flex items-center justify-end text-sm text-slate-600">Count: {institutions.length}</div>
      </form>

      <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
        {loading ? (
          <div className="p-6 text-sm text-slate-500">Loading institutions...</div>
        ) : institutions.length === 0 ? (
          <div className="p-6 text-sm text-slate-500">No institutions found.</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[860px]">
              <thead className="bg-slate-50 text-left text-xs uppercase tracking-wide text-slate-500">
                <tr>
                  <th className="px-4 py-3">Institution</th>
                  <th className="px-4 py-3">Email</th>
                  <th className="px-4 py-3">Type</th>
                  <th className="px-4 py-3">Status</th>
                  <th className="px-4 py-3">API</th>
                  <th className="px-4 py-3">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200 text-sm text-slate-700">
                {institutions.map((institution) => (
                  <tr key={institution.id}>
                    <td className="px-4 py-3 font-semibold">{institution.name}</td>
                    <td className="px-4 py-3">{institution.email}</td>
                    <td className="px-4 py-3">{institution.type}</td>
                    <td className="px-4 py-3 capitalize">{institution.verification_status}</td>
                    <td className="px-4 py-3">{institution.api_enabled ? 'Enabled' : 'Disabled'}</td>
                    <td className="px-4 py-3">
                      <div className="flex flex-wrap gap-2">
                        <Link
                          to={`/admin/review-workbench?entityType=institution&entityId=${institution.id}`}
                          className="rounded-lg bg-indigo-100 px-3 py-1.5 text-xs font-semibold text-indigo-700 hover:bg-indigo-200"
                        >
                          Go To Review
                        </Link>
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

export default AdminInstitutionsPage;
