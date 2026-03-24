import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { getVerifierProfile, updateVerifierProfile } from '../../services/api';

const VerifierProfilePage = () => {
  const navigate = useNavigate();
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);
  const [formData, setFormData] = useState({
    companyName: '',
    industry: '',
    contactEmail: '',
    phone: '',
    website: ''
  });

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        setLoading(true);
        const response = await getVerifierProfile();
        if (response.data) {
          const verifier = response.data.verifier;
          setProfile(verifier);
          setFormData({
            companyName: verifier.company_name || '',
            industry: verifier.industry || '',
            contactEmail: verifier.contact_email || '',
            phone: verifier.phone || '',
            website: verifier.website || ''
          });
        }
      } catch (err) {
        console.error('Error fetching profile:', err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setSaving(true);
      setError(null);
      setSuccess(false);

      const response = await updateVerifierProfile(formData);

      if (response.success) {
        setSuccess(true);
        alert('Profile updated successfully!');

        if (response.data?.verifier) {
          setProfile(response.data.verifier);
        }

        setTimeout(() => setSuccess(false), 3000);
      }
    } catch (err) {
      console.error('Error updating profile:', err);
      setError(err.message);
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-blue-50 to-neutral-50 ml-64 p-8">
        <div className="max-w-2xl mx-auto space-y-6">
          {[1, 2, 3].map(() => (
            <div key={Math.random()} className="h-20 bg-white rounded-lg animate-pulse" />
          ))}
        </div>
      </div>
    );
  }

  if (error && !loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-blue-50 to-neutral-50 ml-64 p-8">
        <div className="max-w-2xl mx-auto">
          <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-red-800">
            <h3 className="font-bold mb-2">Error</h3>
            <p>{error}</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-blue-50 to-neutral-50">
      {/* Sidebar Navigation */}
      <aside className="fixed left-0 top-0 w-64 h-screen bg-white border-r border-neutral-200 shadow-sm sidebar">
        <div className="p-6">
          <h2 className="text-2xl font-bold bg-gradient-to-r from-indigo-600 to-blue-600 bg-clip-text text-transparent">
            TrustVault
          </h2>
          <p className="text-xs text-neutral-600 mt-1">Verifier Portal</p>
        </div>

        <nav className="mt-8">
          <Link
            to="/verifier/dashboard"
            className="flex items-center gap-3 px-6 py-3 text-neutral-600 hover:bg-neutral-50 transition-colors"
          >
            <span className="text-xl">📊</span> Dashboard
          </Link>
          <Link
            to="/verifier/verification-requests"
            className="flex items-center gap-3 px-6 py-3 text-neutral-600 hover:bg-neutral-50 transition-colors"
          >
            <span className="text-xl">📥</span> Verification Requests
          </Link>
          <Link
            to="/verifier/history"
            className="flex items-center gap-3 px-6 py-3 text-neutral-600 hover:bg-neutral-50 transition-colors"
          >
            <span className="text-xl">📜</span> History
          </Link>
          <Link
            to="/verifier/profile"
            className="flex items-center gap-3 px-6 py-3 text-neutral-900 bg-indigo-50 border-l-4 border-indigo-600 font-medium"
          >
            <span className="text-xl">⚙️</span> Profile
          </Link>
        </nav>

        <div className="absolute bottom-6 left-6 right-6">
          <button
            onClick={() => {
              localStorage.removeItem('token');
              localStorage.removeItem('user');
              navigate('/login');
            }}
            className="w-full px-4 py-2 bg-red-50 hover:bg-red-100 text-red-600 rounded-lg font-medium transition-colors text-sm"
          >
            Logout
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="ml-64 min-h-screen bg-gradient-to-br from-indigo-50 via-blue-50 to-neutral-50 p-8">
        <div className="max-w-2xl mx-auto">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-4xl font-bold text-neutral-900">Organization Profile</h1>
            <p className="text-neutral-600 mt-2">Manage your verifier organization details</p>
          </div>

          {/* Success Message */}
          {success && (
            <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg text-green-800 text-sm">
              ✓ Profile updated successfully!
            </div>
          )}

          {/* Error Message */}
          {error && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg text-red-800 text-sm">
              {error}
            </div>
          )}

          {/* Profile Form */}
          <form onSubmit={handleSubmit} className="bg-white rounded-xl shadow-sm border border-neutral-200 p-8 space-y-6">
            {/* Company Name */}
            <div>
              <label className="block text-sm font-medium text-neutral-900 mb-2">Company Name</label>
              <input
                type="text"
                name="companyName"
                value={formData.companyName}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-neutral-300 rounded-lg focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20"
              />
            </div>

            {/* Industry */}
            <div>
              <label className="block text-sm font-medium text-neutral-900 mb-2">Industry</label>
              <select
                name="industry"
                value={formData.industry}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-neutral-300 rounded-lg focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20"
              >
                <option value="">Select an industry</option>
                <option value="education">Education</option>
                <option value="government">Government</option>
                <option value="healthcare">Healthcare</option>
                <option value="finance">Finance</option>
                <option value="technology">Technology</option>
                <option value="other">Other</option>
              </select>
            </div>

            {/* Contact Email */}
            <div>
              <label className="block text-sm font-medium text-neutral-900 mb-2">Contact Email</label>
              <input
                type="email"
                name="contactEmail"
                value={formData.contactEmail}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-neutral-300 rounded-lg focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20"
              />
            </div>

            {/* Phone */}
            <div>
              <label className="block text-sm font-medium text-neutral-900 mb-2">Phone Number</label>
              <input
                type="tel"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                placeholder="+1 (555) 123-4567"
                className="w-full px-4 py-2 border border-neutral-300 rounded-lg focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20"
              />
            </div>

            {/* Website */}
            <div>
              <label className="block text-sm font-medium text-neutral-900 mb-2">Website</label>
              <input
                type="url"
                name="website"
                value={formData.website}
                onChange={handleChange}
                placeholder="https://example.com"
                className="w-full px-4 py-2 border border-neutral-300 rounded-lg focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20"
              />
            </div>

            {/* Account Info (Read-only) */}
            <div className="pt-6 border-t border-neutral-200">
              <h3 className="text-lg font-bold text-neutral-900 mb-4">Account Information</h3>
              <div className="space-y-4">
                <div>
                  <p className="text-sm text-neutral-600">Member Since</p>
                  <p className="font-medium text-neutral-900 mt-1">
                    {profile?.created_at ? new Date(profile.created_at).toLocaleDateString() : 'N/A'}
                  </p>
                </div>
              </div>
            </div>

            {/* Submit Button */}
            <div className="flex gap-4 pt-4">
              <button
                type="submit"
                disabled={saving}
                className="flex-1 px-6 py-3 bg-indigo-600 hover:bg-indigo-700 disabled:bg-neutral-300 text-white font-medium rounded-lg transition-colors"
              >
                {saving ? 'Saving...' : 'Save Changes'}
              </button>
              <button
                type="button"
                onClick={() => navigate('/verifier/dashboard')}
                className="flex-1 px-6 py-3 bg-neutral-200 hover:bg-neutral-300 text-neutral-900 font-medium rounded-lg transition-colors"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      </main>
    </div>
  );
};

export default VerifierProfilePage;
