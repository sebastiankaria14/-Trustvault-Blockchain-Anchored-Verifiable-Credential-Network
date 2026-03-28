import React, { useEffect, useState } from 'react';
import AdminLayout from './AdminLayout';
import { getAdminStats } from '../../services/api';

const DashboardCard = ({ label, value }) => (
  <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
    <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">{label}</p>
    <p className="mt-3 text-3xl font-black text-slate-900">{value}</p>
  </div>
);

const AdminDashboard = () => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [payload, setPayload] = useState(null);

  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        setLoading(true);
        const response = await getAdminStats();
        setPayload(response.data);
      } catch (err) {
        setError(err.message || 'Unable to load admin dashboard');
      } finally {
        setLoading(false);
      }
    };

    fetchDashboard();
  }, []);

  const stats = payload?.stats || {};
  const approvals = payload?.approvals || {};
  const blockchain = payload?.blockchain || {};
  const recentActivity = payload?.recentActivity || [];

  return (
    <AdminLayout
      title="Super Admin Dashboard"
      subtitle="Platform overview, operational approvals, and health monitoring"
    >
      {error ? (
        <div className="mb-6 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800">{error}</div>
      ) : null}

      {loading ? (
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
          {[1, 2, 3, 4].map((item) => (
            <div key={item} className="h-28 animate-pulse rounded-2xl border border-slate-200 bg-white" />
          ))}
        </div>
      ) : (
        <>
          <section className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-5">
            <DashboardCard label="Total Users" value={stats.totalUsers || 0} />
            <DashboardCard label="Institutions" value={stats.totalInstitutions || 0} />
            <DashboardCard label="Verifiers" value={stats.totalVerifiers || 0} />
            <DashboardCard label="Credentials" value={stats.totalCredentials || 0} />
            <DashboardCard label="Today Verifications" value={stats.todayVerifications || 0} />
          </section>

          <section className="mt-6 grid grid-cols-1 gap-6 lg:grid-cols-2">
            <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
              <h3 className="text-lg font-bold text-slate-900">Pending Approvals</h3>
              <div className="mt-4 grid grid-cols-2 gap-3">
                <div className="rounded-xl bg-amber-50 p-4">
                  <p className="text-xs font-semibold uppercase tracking-wide text-amber-700">Institutions</p>
                  <p className="mt-2 text-2xl font-black text-amber-900">{approvals.pendingInstitutions || 0}</p>
                </div>
                <div className="rounded-xl bg-orange-50 p-4">
                  <p className="text-xs font-semibold uppercase tracking-wide text-orange-700">Verifiers</p>
                  <p className="mt-2 text-2xl font-black text-orange-900">{approvals.pendingVerifiers || 0}</p>
                </div>
              </div>
            </div>

            <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
              <h3 className="text-lg font-bold text-slate-900">Blockchain Health</h3>
              <div className="mt-4 space-y-2 text-sm text-slate-700">
                <p><span className="font-semibold">Anchored Credentials:</span> {blockchain.anchored_credentials || 0}</p>
                <p><span className="font-semibold">Total Credentials:</span> {blockchain.total_credentials || 0}</p>
                <p><span className="font-semibold">Tx Recorded:</span> {blockchain.tx_recorded || 0}</p>
                <p><span className="font-semibold">Mode:</span> {blockchain.strictMode ? 'Strict' : 'Fallback Allowed'}</p>
                <p><span className="font-semibold">Network Config:</span> {blockchain.networkConfigured ? 'Configured' : 'Missing'}</p>
              </div>
            </div>
          </section>

          <section className="mt-6 rounded-2xl border border-slate-200 bg-white shadow-sm">
            <div className="border-b border-slate-200 px-5 py-4">
              <h3 className="text-lg font-bold text-slate-900">Recent Activity</h3>
            </div>

            {recentActivity.length === 0 ? (
              <p className="px-5 py-8 text-sm text-slate-500">No activity yet.</p>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full min-w-[680px]">
                  <thead className="bg-slate-50 text-left text-xs uppercase tracking-wide text-slate-500">
                    <tr>
                      <th className="px-5 py-3">Type</th>
                      <th className="px-5 py-3">Result</th>
                      <th className="px-5 py-3">Verified At</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-200 text-sm text-slate-700">
                    {recentActivity.map((row) => (
                      <tr key={row.id}>
                        <td className="px-5 py-3">{row.verification_type}</td>
                        <td className="px-5 py-3">{row.result}</td>
                        <td className="px-5 py-3">{new Date(row.verified_at).toLocaleString()}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </section>
        </>
      )}
    </AdminLayout>
  );
};

export default AdminDashboard;
