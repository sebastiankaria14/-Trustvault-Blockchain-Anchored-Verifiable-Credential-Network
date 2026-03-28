import React, { useEffect, useState } from 'react';
import AdminLayout from './AdminLayout';
import { getAdminSettings, updateAdminSetting } from '../../services/api';

const parseJsonText = (text) => {
  try {
    return { ok: true, value: JSON.parse(text) };
  } catch (error) {
    return { ok: false, error: error.message };
  }
};

const AdminSettingsPage = () => {
  const [settings, setSettings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [savingKey, setSavingKey] = useState('');

  const fetchSettings = async () => {
    try {
      setLoading(true);
      const response = await getAdminSettings();
      const formatted = (response.data.settings || []).map((setting) => ({
        ...setting,
        editorValue: JSON.stringify(setting.value_json, null, 2)
      }));
      setSettings(formatted);
    } catch (err) {
      setError(err.message || 'Failed to load settings');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSettings();
  }, []);

  const handleEditorChange = (key, value) => {
    setSettings((prev) =>
      prev.map((setting) => (setting.key === key ? { ...setting, editorValue: value } : setting))
    );
  };

  const handleSave = async (setting) => {
    const parsed = parseJsonText(setting.editorValue);
    if (!parsed.ok) {
      setError(`Invalid JSON for ${setting.key}: ${parsed.error}`);
      return;
    }

    try {
      setSavingKey(setting.key);
      setError('');
      await updateAdminSetting(setting.key, parsed.value, setting.description);
      await fetchSettings();
    } catch (err) {
      setError(err.message || `Failed to update setting ${setting.key}`);
    } finally {
      setSavingKey('');
    }
  };

  return (
    <AdminLayout title="System Settings" subtitle="Manage feature flags and operational platform controls">
      {error ? (
        <div className="mb-5 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">{error}</div>
      ) : null}

      {loading ? (
        <div className="rounded-2xl border border-slate-200 bg-white p-6 text-sm text-slate-500 shadow-sm">Loading settings...</div>
      ) : settings.length === 0 ? (
        <div className="rounded-2xl border border-slate-200 bg-white p-6 text-sm text-slate-500 shadow-sm">No settings found.</div>
      ) : (
        <div className="space-y-4">
          {settings.map((setting) => (
            <div key={setting.key} className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
              <div className="mb-3 flex items-center justify-between gap-3">
                <div>
                  <h3 className="text-base font-bold text-slate-900">{setting.key}</h3>
                  <p className="text-sm text-slate-600">{setting.description || 'No description'}</p>
                </div>
                <button
                  onClick={() => handleSave(setting)}
                  disabled={savingKey === setting.key}
                  className="rounded-lg bg-blue-600 px-3 py-1.5 text-xs font-semibold text-white hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  {savingKey === setting.key ? 'Saving...' : 'Save'}
                </button>
              </div>
              <textarea
                value={setting.editorValue}
                onChange={(e) => handleEditorChange(setting.key, e.target.value)}
                className="h-48 w-full rounded-xl border border-slate-200 p-3 font-mono text-xs text-slate-800 outline-none focus:border-blue-500"
              />
            </div>
          ))}
        </div>
      )}
    </AdminLayout>
  );
};

export default AdminSettingsPage;
