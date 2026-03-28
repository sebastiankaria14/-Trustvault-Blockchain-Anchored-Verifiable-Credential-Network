import React, { useEffect, useState } from 'react';
import AdminLayout from './AdminLayout';
import { getAdminBlockchainLogs } from '../../services/api';

const AdminBlockchainPage = () => {
  const [payload, setPayload] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchBlockchainData = async () => {
      try {
        setLoading(true);
        const response = await getAdminBlockchainLogs();
        setPayload(response.data);
      } catch (err) {
        setError(err.message || 'Failed to load blockchain monitor');
      } finally {
        setLoading(false);
      }
    };

    fetchBlockchainData();
  }, []);

  const credentialSummary = payload?.credentialSummary || {};
  const verificationSummary = payload?.verificationSummary || {};
  const recentCredentials = payload?.recentCredentials || [];
  const network = payload?.network || {};

  return (
    <AdminLayout title="Blockchain Monitor" subtitle="Observe anchoring health, mismatch trends, and network configuration">
      {error ? (
        <div className="mb-5 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">{error}</div>
      ) : null}

      {loading ? (
        <div className="rounded-2xl border border-slate-200 bg-white p-6 text-sm text-slate-500 shadow-sm">Loading blockchain monitor...</div>
      ) : (
        <>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
            <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
              <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">Anchored Credentials</p>
              <p className="mt-2 text-3xl font-black text-slate-900">{credentialSummary.anchored_credentials || 0}</p>
            </div>
            <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
              <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">With Tx Hash</p>
              <p className="mt-2 text-3xl font-black text-slate-900">{credentialSummary.with_transactions || 0}</p>
            </div>
            <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
              <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">Matched Logs</p>
              <p className="mt-2 text-3xl font-black text-emerald-700">{verificationSummary.matched_logs || 0}</p>
            </div>
            <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
              <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">Mismatched Logs</p>
              <p className="mt-2 text-3xl font-black text-red-700">{verificationSummary.mismatched_logs || 0}</p>
            </div>
          </div>

          <div className="mt-5 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <h3 className="text-lg font-bold text-slate-900">Network Status</h3>
            <div className="mt-3 grid grid-cols-1 gap-3 text-sm text-slate-700 md:grid-cols-3">
              <p><span className="font-semibold">Network:</span> {network.name || 'polygon-mumbai'}</p>
              <p><span className="font-semibold">Strict Mode:</span> {network.strictMode ? 'Enabled' : 'Disabled'}</p>
              <p><span className="font-semibold">Config:</span> {network.configured ? 'Configured' : 'Incomplete'}</p>
            </div>
          </div>

          <div className="mt-5 overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
            <div className="border-b border-slate-200 px-5 py-4">
              <h3 className="text-lg font-bold text-slate-900">Recent Anchored Credentials</h3>
            </div>

            {recentCredentials.length === 0 ? (
              <p className="px-5 py-8 text-sm text-slate-500">No anchored credentials found.</p>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full min-w-[860px]">
                  <thead className="bg-slate-50 text-left text-xs uppercase tracking-wide text-slate-500">
                    <tr>
                      <th className="px-4 py-3">Credential</th>
                      <th className="px-4 py-3">DID</th>
                      <th className="px-4 py-3">Tx Hash</th>
                      <th className="px-4 py-3">Network</th>
                      <th className="px-4 py-3">Created</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-200 text-sm text-slate-700">
                    {recentCredentials.map((credential) => (
                      <tr key={credential.id}>
                        <td className="px-4 py-3 font-semibold">{credential.credential_name}</td>
                        <td className="px-4 py-3">{credential.did || 'N/A'}</td>
                        <td className="px-4 py-3">{credential.blockchain_tx_hash || 'Pending'}</td>
                        <td className="px-4 py-3">{credential.blockchain_network || 'polygon-mumbai'}</td>
                        <td className="px-4 py-3">{new Date(credential.created_at).toLocaleString()}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </>
      )}
    </AdminLayout>
  );
};

export default AdminBlockchainPage;
