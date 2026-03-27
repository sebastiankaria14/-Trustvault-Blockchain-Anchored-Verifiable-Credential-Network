import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { Link, useNavigate } from 'react-router-dom';
import { issueCredential } from '../../services/api';

const IssueCredentialPage = () => {
  const { logout } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });
  const [formData, setFormData] = useState({
    recipientEmail: '',
    credentialType: 'degree',
    credentialName: '',
    description: '',
    issueDate: new Date().toISOString().split('T')[0],
    expiryDate: '',
    documentUrl: '',
    lifetime: false
  });

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // Check file size (max 2MB)
    if (file.size > 2 * 1024 * 1024) {
      setMessage({ type: 'error', text: 'File size must be less than 2MB' });
      return;
    }

    // Convert to base64
    const reader = new FileReader();
    reader.onload = (event) => {
      setFormData(prev => ({
        ...prev,
        documentUrl: event.target.result
      }));
    };
    reader.readAsDataURL(file);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage({ type: '', text: '' });
    try {
      const submitData = {
        ...formData,
        expiryDate: formData.lifetime ? null : formData.expiryDate
      };
      const response = await issueCredential(submitData);
      if (response.success) {
        setMessage({ type: 'success', text: 'Credential issued successfully' });
        setTimeout(() => navigate('/institution/manage'), 2000);
      } else {
        setMessage({ type: 'error', text: response.message || 'Failed' });
      }
    } catch (error) {
      setMessage({ type: 'error', text: error.message || 'Error' });
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">
      <aside className="fixed inset-y-0 left-0 w-64 border-r border-slate-200 bg-white/90 text-slate-900 shadow-[0_20px_60px_rgba(15,23,42,0.08)] backdrop-blur-xl">
        <div className="p-6">
          <h1 className="text-2xl font-black tracking-tight text-slate-900">TrustVault</h1>
          <p className="text-sm text-slate-500">Institution Portal</p>
        </div>
        <nav className="mt-3 px-3">
          <Link to="/institution/dashboard" className="flex items-center rounded-2xl px-4 py-3 text-slate-600 transition hover:bg-slate-50 hover:text-slate-900">
            <svg className="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
            </svg>
            Dashboard
          </Link>
          <Link to="/institution/issue" className="mt-2 flex items-center rounded-2xl border border-transparent bg-gradient-to-r from-blue-600 to-purple-600 px-4 py-3 text-white shadow-lg shadow-purple-200/50">
            <svg className="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            Issue Credential
          </Link>
          <Link to="/institution/manage" className="mt-2 flex items-center rounded-2xl px-4 py-3 text-slate-600 transition hover:bg-slate-50 hover:text-slate-900">
            <svg className="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4" />
            </svg>
            Manage Credentials
          </Link>
          <Link to="/institution/history" className="mt-2 flex items-center rounded-2xl px-4 py-3 text-slate-600 transition hover:bg-slate-50 hover:text-slate-900">
            <svg className="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            History
          </Link>
        </nav>
        <div className="absolute bottom-6 left-6 right-6">
          <button onClick={handleLogout} className="flex w-full items-center rounded-2xl px-4 py-3 text-slate-600 transition hover:bg-red-50 hover:text-red-600">
            <svg className="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
            </svg>
            Logout
          </button>
        </div>
      </aside>

      <main className="ml-64 p-8">
        <div className="max-w-2xl mx-auto">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Issue New Credential</h1>
          <p className="text-gray-600 mb-8">Fill in the form to issue a credential to a user</p>

          <div className="bg-white rounded-lg shadow p-8">
            {message.text && (
              <div className={`mb-6 p-4 rounded ${message.type === 'success' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                {message.text}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700">Recipient Email</label>
                <input type="email" name="recipientEmail" value={formData.recipientEmail} onChange={handleChange} required className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md" placeholder="user@example.com" />
              </div>

              <div className="grid grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700">Credential Type</label>
                  <select name="credentialType" value={formData.credentialType} onChange={handleChange} className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md">
                    <option value="degree">Degree</option>
                    <option value="certificate">Certificate</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Credential Name</label>
                  <input type="text" name="credentialName" value={formData.credentialName} onChange={handleChange} required className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md" placeholder="e.g. Bachelor of Science" />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">Description</label>
                <textarea name="description" value={formData.description} onChange={handleChange} rows="4" className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md" />
              </div>

              <div className="grid grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700">Issue Date</label>
                  <input type="date" name="issueDate" value={formData.issueDate} onChange={handleChange} required className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Expiry Date (Optional)</label>
                  <input type="date" name="expiryDate" value={formData.expiryDate} onChange={handleChange} disabled={formData.lifetime} className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md disabled:bg-gray-100 disabled:cursor-not-allowed" />
                </div>
              </div>

              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="lifetime"
                  name="lifetime"
                  checked={formData.lifetime}
                  onChange={handleChange}
                  className="w-4 h-4 text-purple-600 border-gray-300 rounded cursor-pointer"
                />
                <label htmlFor="lifetime" className="ml-2 text-sm font-medium text-gray-700 cursor-pointer">
                  ✓ This credential has lifetime validity (never expires)
                </label>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">Upload Document (Photo of Certificate/Degree)</label>
                <p className="text-xs text-gray-500 mb-2">Optional. Upload a photo of the credential (max 2MB). JPG, PNG supported.</p>
                <div className="mt-1 flex items-center justify-center px-6 py-4 border-2 border-dashed border-gray-300 rounded-md hover:border-purple-500 cursor-pointer">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleFileUpload}
                    className="w-full cursor-pointer"
                  />
                </div>
                {formData.documentUrl && (
                  <div className="mt-3">
                    <p className="text-sm text-green-600 mb-2">✓ Document uploaded</p>
                    <img src={formData.documentUrl} alt="Preview" className="max-h-40 rounded" />
                  </div>
                )}
              </div>

              <div className="flex gap-4">
                <button type="submit" disabled={loading} className="flex-1 px-4 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg hover:shadow-lg disabled:bg-gray-400">
                  {loading ? 'Issuing...' : 'Issue Credential'}
                </button>
                <Link to="/institution/dashboard" className="flex-1 px-4 py-3 bg-gray-300 text-gray-800 rounded-lg text-center">Cancel</Link>
              </div>
            </form>
          </div>
        </div>
      </main>
    </div>
  );
};

export default IssueCredentialPage;
