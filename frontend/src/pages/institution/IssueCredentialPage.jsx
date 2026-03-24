import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { Link, useNavigate } from 'react-router-dom';
import { issueCredential } from '../../services/api';

const IssueCredentialPage = () => {
  const { user, logout } = useAuth();
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
    <div className="min-h-screen bg-gray-50">
      <aside className="fixed inset-y-0 left-0 w-64 bg-blue-900 text-white">
        <div className="p-6">
          <h1 className="text-2xl font-bold">TrustVault</h1>
          <p className="text-blue-300 text-sm">Institution Portal</p>
        </div>
        <nav className="mt-6">
          <Link to="/institution/dashboard" className="flex items-center px-6 py-3 text-gray-200 hover:bg-blue-800">Dashboard</Link>
          <Link to="/institution/issue" className="flex items-center px-6 py-3 bg-blue-800 border-r-4 border-white">Issue Credential</Link>
          <Link to="/institution/manage" className="flex items-center px-6 py-3 text-gray-200 hover:bg-blue-800">Manage Credentials</Link>
          <Link to="/institution/history" className="flex items-center px-6 py-3 text-gray-200 hover:bg-blue-800">History</Link>
        </nav>
        <div className="absolute bottom-6 left-6 right-6">
          <button onClick={handleLogout} className="w-full flex items-center px-4 py-2 text-gray-200 hover:bg-red-600 rounded">Logout</button>
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
                  className="w-4 h-4 text-blue-600 border-gray-300 rounded cursor-pointer"
                />
                <label htmlFor="lifetime" className="ml-2 text-sm font-medium text-gray-700 cursor-pointer">
                  ✓ This credential has lifetime validity (never expires)
                </label>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">Upload Document (Photo of Certificate/Degree)</label>
                <p className="text-xs text-gray-500 mb-2">Optional. Upload a photo of the credential (max 2MB). JPG, PNG supported.</p>
                <div className="mt-1 flex items-center justify-center px-6 py-4 border-2 border-dashed border-gray-300 rounded-md hover:border-blue-500 cursor-pointer">
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
                <button type="submit" disabled={loading} className="flex-1 px-4 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-400">
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
