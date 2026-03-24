import React, { useState, useMemo } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { registerUser, registerInstitution, registerVerifier } from '../../services/api';
import { useAuth } from '../../context/AuthContext';

// Password strength checker
const getPasswordStrength = (password) => {
  let strength = 0;
  if (password.length >= 8) strength++;
  if (/[a-z]/.test(password)) strength++;
  if (/[A-Z]/.test(password)) strength++;
  if (/[0-9]/.test(password)) strength++;
  if (/[^a-zA-Z0-9]/.test(password)) strength++;
  return strength;
};

const getPasswordStrengthLabel = (strength) => {
  const labels = ['', 'Weak', 'Fair', 'Good', 'Strong', 'Very Strong'];
  return labels[strength];
};

const getPasswordStrengthColor = (strength) => {
  const colors = ['', 'error', 'warning', 'warning', 'success', 'success'];
  return colors[strength];
};

const RegisterPage = () => {
  const navigate = useNavigate();
  const { login } = useAuth();

  const [activeTab, setActiveTab] = useState('user');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  // User form data
  const [userForm, setUserForm] = useState({
    email: '',
    password: '',
    confirmPassword: '',
    firstName: '',
    lastName: '',
    phone: '',
    dateOfBirth: ''
  });

  // Institution form data
  const [institutionForm, setInstitutionForm] = useState({
    name: '',
    type: 'education',
    email: '',
    password: '',
    confirmPassword: '',
    registrationNumber: '',
    phone: '',
    website: ''
  });

  // Verifier form data
  const [verifierForm, setVerifierForm] = useState({
    companyName: '',
    email: '',
    password: '',
    confirmPassword: '',
    industry: '',
    phone: '',
    website: ''
  });

  // Calculate password strength
  const userPasswordStrength = useMemo(() => getPasswordStrength(userForm.password), [userForm.password]);
  const institutionPasswordStrength = useMemo(() => getPasswordStrength(institutionForm.password), [institutionForm.password]);
  const verifierPasswordStrength = useMemo(() => getPasswordStrength(verifierForm.password), [verifierForm.password]);

  const handleUserChange = (e) => {
    setUserForm({ ...userForm, [e.target.name]: e.target.value });
    setError('');
  };

  const handleInstitutionChange = (e) => {
    setInstitutionForm({ ...institutionForm, [e.target.name]: e.target.value });
    setError('');
  };

  const handleVerifierChange = (e) => {
    setVerifierForm({ ...verifierForm, [e.target.name]: e.target.value });
    setError('');
  };

  const handleUserSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (userForm.password !== userForm.confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    setLoading(true);

    try {
      const { confirmPassword, ...userData } = userForm;
      const response = await registerUser(userData);

      if (response.success) {
        login(response.data.token, response.data.user, 'user');
        navigate('/user/dashboard');
      }
    } catch (err) {
      setError(err.message || 'Registration failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleInstitutionSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (institutionForm.password !== institutionForm.confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    setLoading(true);

    try {
      const { confirmPassword, ...institutionData } = institutionForm;
      const response = await registerInstitution(institutionData);

      if (response.success) {
        login(response.data.token, response.data.institution, 'institution');
        navigate('/institution/dashboard');
      }
    } catch (err) {
      setError(err.message || 'Registration failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleVerifierSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (verifierForm.password !== verifierForm.confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    setLoading(true);

    try {
      const { confirmPassword, ...verifierData } = verifierForm;
      const response = await registerVerifier(verifierData);

      if (response.success) {
        login(response.data.token, response.data.verifier, 'verifier');
        navigate('/verifier/dashboard');
      }
    } catch (err) {
      setError(err.message || 'Registration failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen relative overflow-hidden py-12 px-4 sm:px-6 lg:px-8">
      {/* Aurora Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-purple-600 via-blue-600 to-cyan-600 opacity-90 animate-aurora" />

      {/* Animated background shapes */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-purple-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob" />
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-blue-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-2000" />
      <div className="absolute top-1/2 left-1/2 w-96 h-96 bg-cyan-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-4000" />

      {/* Content */}
      <div className="relative z-10 max-w-4xl mx-auto">
        {/* Card Container */}
        <div className="scale-in bg-white/95 backdrop-blur-lg rounded-3xl shadow-2xl p-8 md:p-12 border border-white/20">
          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent mb-2">
              Create Account
            </h1>
            <p className="text-neutral-600 text-sm">Join TrustVault and start managing credentials</p>
          </div>

          {/* Tabs */}
          <div className="flex justify-center mb-8 border-b border-neutral-200">
            {['user', 'institution', 'verifier'].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                data-ripple
                className={`relative py-4 px-6 font-semibold text-sm transition-all duration-200 uppercase tracking-wide ${
                  activeTab === tab
                    ? 'text-transparent bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text'
                    : 'text-neutral-600 hover:text-neutral-900'
                }`}
              >
                {tab.charAt(0).toUpperCase() + tab.slice(1)}
                {activeTab === tab && (
                  <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-purple-600 to-blue-600 rounded-full" />
                )}
              </button>
            ))}
          </div>

          {/* Error Message */}
          {error && (
            <div className="mb-6 bg-error-50 border-l-4 border-error-600 text-error-700 px-4 py-3 rounded-lg slide-in-down">
              <p className="font-semibold text-sm">Error</p>
              <p className="text-sm mt-1">{error}</p>
            </div>
          )}

          {/* User Registration Form */}
          {activeTab === 'user' && (
            <form onSubmit={handleUserSubmit} className="space-y-4 slide-in-down">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="form-group">
                  <label className="block text-sm font-semibold text-neutral-700 mb-2">First Name</label>
                  <input
                    name="firstName"
                    type="text"
                    required
                    value={userForm.firstName}
                    onChange={handleUserChange}
                    className="w-full px-4 py-3 border-2 border-neutral-200 rounded-xl focus:border-purple-500 focus:ring-4 focus:ring-purple-100 transition-all duration-200 bg-white/50 placeholder-neutral-400"
                  />
                </div>
                <div className="form-group">
                  <label className="block text-sm font-semibold text-neutral-700 mb-2">Last Name</label>
                  <input
                    name="lastName"
                    type="text"
                    required
                    value={userForm.lastName}
                    onChange={handleUserChange}
                    className="w-full px-4 py-3 border-2 border-neutral-200 rounded-xl focus:border-purple-500 focus:ring-4 focus:ring-purple-100 transition-all duration-200 bg-white/50 placeholder-neutral-400"
                  />
                </div>
              </div>

              <div className="form-group">
                <label className="block text-sm font-semibold text-neutral-700 mb-2">Email Address</label>
                <input
                  name="email"
                  type="email"
                  required
                  value={userForm.email}
                  onChange={handleUserChange}
                  className="w-full px-4 py-3 border-2 border-neutral-200 rounded-xl focus:border-purple-500 focus:ring-4 focus:ring-purple-100 transition-all duration-200 bg-white/50 placeholder-neutral-400"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="form-group">
                  <label className="block text-sm font-semibold text-neutral-700 mb-2">Phone (Optional)</label>
                  <input
                    name="phone"
                    type="tel"
                    value={userForm.phone}
                    onChange={handleUserChange}
                    className="w-full px-4 py-3 border-2 border-neutral-200 rounded-xl focus:border-purple-500 focus:ring-4 focus:ring-purple-100 transition-all duration-200 bg-white/50 placeholder-neutral-400"
                  />
                </div>
                <div className="form-group">
                  <label className="block text-sm font-semibold text-neutral-700 mb-2">Date of Birth (Optional)</label>
                  <input
                    name="dateOfBirth"
                    type="date"
                    value={userForm.dateOfBirth}
                    onChange={handleUserChange}
                    className="w-full px-4 py-3 border-2 border-neutral-200 rounded-xl focus:border-purple-500 focus:ring-4 focus:ring-purple-100 transition-all duration-200 bg-white/50 placeholder-neutral-400"
                  />
                </div>
              </div>

              <div className="form-group">
                <label className="block text-sm font-semibold text-neutral-700 mb-2">Password</label>
                <input
                  name="password"
                  type="password"
                  required
                  value={userForm.password}
                  onChange={handleUserChange}
                  className="w-full px-4 py-3 border-2 border-neutral-200 rounded-xl focus:border-purple-500 focus:ring-4 focus:ring-purple-100 transition-all duration-200 bg-white/50 placeholder-neutral-400"
                />
                {userForm.password && (
                  <div className="mt-3">
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-xs font-semibold text-neutral-600">Strength:</span>
                      <span className={`text-xs font-bold badge badge-${getPasswordStrengthColor(userPasswordStrength)}`}>
                        {getPasswordStrengthLabel(userPasswordStrength)}
                      </span>
                    </div>
                    <div className="h-2 bg-neutral-200 rounded-full overflow-hidden">
                      <div
                        className={`h-full rounded-full transition-all duration-300 ${
                          userPasswordStrength === 1 ? 'w-1/5 bg-error-500' :
                          userPasswordStrength === 2 ? 'w-2/5 bg-warning-500' :
                          userPasswordStrength === 3 ? 'w-3/5 bg-warning-500' :
                          userPasswordStrength === 4 ? 'w-4/5 bg-success-500' :
                          'w-full bg-success-500'
                        }`}
                      />
                    </div>
                  </div>
                )}
                <p className="mt-2 text-xs text-neutral-600">
                  Must be at least 8 characters with uppercase, lowercase, and number
                </p>
              </div>

              <div className="form-group">
                <label className="block text-sm font-semibold text-neutral-700 mb-2">Confirm Password</label>
                <input
                  name="confirmPassword"
                  type="password"
                  required
                  value={userForm.confirmPassword}
                  onChange={handleUserChange}
                  className="w-full px-4 py-3 border-2 border-neutral-200 rounded-xl focus:border-purple-500 focus:ring-4 focus:ring-purple-100 transition-all duration-200 bg-white/50 placeholder-neutral-400"
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                data-ripple
                className="w-full mt-6 btn btn-lg bg-gradient-to-r from-purple-600 to-blue-600 text-white font-semibold hover:from-purple-700 hover:to-blue-700 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:shadow-2xl transition-all duration-200 relative overflow-hidden"
              >
                {loading ? '⏳ Creating Account...' : 'Create User Account'}
              </button>
            </form>
          )}

          {/* Institution Registration Form */}
          {activeTab === 'institution' && (
            <form onSubmit={handleInstitutionSubmit} className="space-y-4 slide-in-down">
              <div className="form-group">
                <label className="block text-sm font-semibold text-neutral-700 mb-2">Institution Name</label>
                <input
                  name="name"
                  type="text"
                  required
                  value={institutionForm.name}
                  onChange={handleInstitutionChange}
                  className="w-full px-4 py-3 border-2 border-neutral-200 rounded-xl focus:border-purple-500 focus:ring-4 focus:ring-purple-100 transition-all duration-200 bg-white/50 placeholder-neutral-400"
                />
              </div>

              <div className="form-group">
                <label className="block text-sm font-semibold text-neutral-700 mb-2">Institution Type</label>
                <select
                  name="type"
                  required
                  value={institutionForm.type}
                  onChange={handleInstitutionChange}
                  className="w-full px-4 py-3 border-2 border-neutral-200 rounded-xl focus:border-purple-500 focus:ring-4 focus:ring-purple-100 transition-all duration-200 bg-white/50"
                >
                  <option value="education">Education</option>
                  <option value="financial">Financial</option>
                  <option value="healthcare">Healthcare</option>
                  <option value="government">Government</option>
                  <option value="employer">Employer</option>
                  <option value="other">Other</option>
                </select>
              </div>

              <div className="form-group">
                <label className="block text-sm font-semibold text-neutral-700 mb-2">Email Address</label>
                <input
                  name="email"
                  type="email"
                  required
                  value={institutionForm.email}
                  onChange={handleInstitutionChange}
                  className="w-full px-4 py-3 border-2 border-neutral-200 rounded-xl focus:border-purple-500 focus:ring-4 focus:ring-purple-100 transition-all duration-200 bg-white/50 placeholder-neutral-400"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="form-group">
                  <label className="block text-sm font-semibold text-neutral-700 mb-2">Registration Number</label>
                  <input
                    name="registrationNumber"
                    type="text"
                    value={institutionForm.registrationNumber}
                    onChange={handleInstitutionChange}
                    className="w-full px-4 py-3 border-2 border-neutral-200 rounded-xl focus:border-purple-500 focus:ring-4 focus:ring-purple-100 transition-all duration-200 bg-white/50 placeholder-neutral-400"
                  />
                </div>
                <div className="form-group">
                  <label className="block text-sm font-semibold text-neutral-700 mb-2">Phone</label>
                  <input
                    name="phone"
                    type="tel"
                    value={institutionForm.phone}
                    onChange={handleInstitutionChange}
                    className="w-full px-4 py-3 border-2 border-neutral-200 rounded-xl focus:border-purple-500 focus:ring-4 focus:ring-purple-100 transition-all duration-200 bg-white/50 placeholder-neutral-400"
                  />
                </div>
              </div>

              <div className="form-group">
                <label className="block text-sm font-semibold text-neutral-700 mb-2">Website</label>
                <input
                  name="website"
                  type="url"
                  value={institutionForm.website}
                  onChange={handleInstitutionChange}
                  className="w-full px-4 py-3 border-2 border-neutral-200 rounded-xl focus:border-purple-500 focus:ring-4 focus:ring-purple-100 transition-all duration-200 bg-white/50 placeholder-neutral-400"
                />
              </div>

              <div className="form-group">
                <label className="block text-sm font-semibold text-neutral-700 mb-2">Password</label>
                <input
                  name="password"
                  type="password"
                  required
                  value={institutionForm.password}
                  onChange={handleInstitutionChange}
                  className="w-full px-4 py-3 border-2 border-neutral-200 rounded-xl focus:border-purple-500 focus:ring-4 focus:ring-purple-100 transition-all duration-200 bg-white/50 placeholder-neutral-400"
                />
                {institutionForm.password && (
                  <div className="mt-3">
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-xs font-semibold text-neutral-600">Strength:</span>
                      <span className={`text-xs font-bold badge badge-${getPasswordStrengthColor(institutionPasswordStrength)}`}>
                        {getPasswordStrengthLabel(institutionPasswordStrength)}
                      </span>
                    </div>
                    <div className="h-2 bg-neutral-200 rounded-full overflow-hidden">
                      <div
                        className={`h-full rounded-full transition-all duration-300 ${
                          institutionPasswordStrength === 1 ? 'w-1/5 bg-error-500' :
                          institutionPasswordStrength === 2 ? 'w-2/5 bg-warning-500' :
                          institutionPasswordStrength === 3 ? 'w-3/5 bg-warning-500' :
                          institutionPasswordStrength === 4 ? 'w-4/5 bg-success-500' :
                          'w-full bg-success-500'
                        }`}
                      />
                    </div>
                  </div>
                )}
              </div>

              <div className="form-group">
                <label className="block text-sm font-semibold text-neutral-700 mb-2">Confirm Password</label>
                <input
                  name="confirmPassword"
                  type="password"
                  required
                  value={institutionForm.confirmPassword}
                  onChange={handleInstitutionChange}
                  className="w-full px-4 py-3 border-2 border-neutral-200 rounded-xl focus:border-purple-500 focus:ring-4 focus:ring-purple-100 transition-all duration-200 bg-white/50 placeholder-neutral-400"
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                data-ripple
                className="w-full mt-6 btn btn-lg bg-gradient-to-r from-purple-600 to-blue-600 text-white font-semibold hover:from-purple-700 hover:to-blue-700 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:shadow-2xl transition-all duration-200 relative overflow-hidden"
              >
                {loading ? '⏳ Creating Account...' : 'Create Institution Account'}
              </button>
            </form>
          )}

          {/* Verifier Registration Form */}
          {activeTab === 'verifier' && (
            <form onSubmit={handleVerifierSubmit} className="space-y-4 slide-in-down">
              <div className="form-group">
                <label className="block text-sm font-semibold text-neutral-700 mb-2">Company Name</label>
                <input
                  name="companyName"
                  type="text"
                  required
                  value={verifierForm.companyName}
                  onChange={handleVerifierChange}
                  className="w-full px-4 py-3 border-2 border-neutral-200 rounded-xl focus:border-purple-500 focus:ring-4 focus:ring-purple-100 transition-all duration-200 bg-white/50 placeholder-neutral-400"
                />
              </div>

              <div className="form-group">
                <label className="block text-sm font-semibold text-neutral-700 mb-2">Email Address</label>
                <input
                  name="email"
                  type="email"
                  required
                  value={verifierForm.email}
                  onChange={handleVerifierChange}
                  className="w-full px-4 py-3 border-2 border-neutral-200 rounded-xl focus:border-purple-500 focus:ring-4 focus:ring-purple-100 transition-all duration-200 bg-white/50 placeholder-neutral-400"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="form-group">
                  <label className="block text-sm font-semibold text-neutral-700 mb-2">Industry</label>
                  <input
                    name="industry"
                    type="text"
                    value={verifierForm.industry}
                    onChange={handleVerifierChange}
                    className="w-full px-4 py-3 border-2 border-neutral-200 rounded-xl focus:border-purple-500 focus:ring-4 focus:ring-purple-100 transition-all duration-200 bg-white/50 placeholder-neutral-400"
                  />
                </div>
                <div className="form-group">
                  <label className="block text-sm font-semibold text-neutral-700 mb-2">Phone</label>
                  <input
                    name="phone"
                    type="tel"
                    value={verifierForm.phone}
                    onChange={handleVerifierChange}
                    className="w-full px-4 py-3 border-2 border-neutral-200 rounded-xl focus:border-purple-500 focus:ring-4 focus:ring-purple-100 transition-all duration-200 bg-white/50 placeholder-neutral-400"
                  />
                </div>
              </div>

              <div className="form-group">
                <label className="block text-sm font-semibold text-neutral-700 mb-2">Website</label>
                <input
                  name="website"
                  type="url"
                  value={verifierForm.website}
                  onChange={handleVerifierChange}
                  className="w-full px-4 py-3 border-2 border-neutral-200 rounded-xl focus:border-purple-500 focus:ring-4 focus:ring-purple-100 transition-all duration-200 bg-white/50 placeholder-neutral-400"
                />
              </div>

              <div className="form-group">
                <label className="block text-sm font-semibold text-neutral-700 mb-2">Password</label>
                <input
                  name="password"
                  type="password"
                  required
                  value={verifierForm.password}
                  onChange={handleVerifierChange}
                  className="w-full px-4 py-3 border-2 border-neutral-200 rounded-xl focus:border-purple-500 focus:ring-4 focus:ring-purple-100 transition-all duration-200 bg-white/50 placeholder-neutral-400"
                />
                {verifierForm.password && (
                  <div className="mt-3">
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-xs font-semibold text-neutral-600">Strength:</span>
                      <span className={`text-xs font-bold badge badge-${getPasswordStrengthColor(verifierPasswordStrength)}`}>
                        {getPasswordStrengthLabel(verifierPasswordStrength)}
                      </span>
                    </div>
                    <div className="h-2 bg-neutral-200 rounded-full overflow-hidden">
                      <div
                        className={`h-full rounded-full transition-all duration-300 ${
                          verifierPasswordStrength === 1 ? 'w-1/5 bg-error-500' :
                          verifierPasswordStrength === 2 ? 'w-2/5 bg-warning-500' :
                          verifierPasswordStrength === 3 ? 'w-3/5 bg-warning-500' :
                          verifierPasswordStrength === 4 ? 'w-4/5 bg-success-500' :
                          'w-full bg-success-500'
                        }`}
                      />
                    </div>
                  </div>
                )}
              </div>

              <div className="form-group">
                <label className="block text-sm font-semibold text-neutral-700 mb-2">Confirm Password</label>
                <input
                  name="confirmPassword"
                  type="password"
                  required
                  value={verifierForm.confirmPassword}
                  onChange={handleVerifierChange}
                  className="w-full px-4 py-3 border-2 border-neutral-200 rounded-xl focus:border-purple-500 focus:ring-4 focus:ring-purple-100 transition-all duration-200 bg-white/50 placeholder-neutral-400"
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                data-ripple
                className="w-full mt-6 btn btn-lg bg-gradient-to-r from-purple-600 to-blue-600 text-white font-semibold hover:from-purple-700 hover:to-blue-700 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:shadow-2xl transition-all duration-200 relative overflow-hidden"
              >
                {loading ? '⏳ Creating Account...' : 'Create Verifier Account'}
              </button>
            </form>
          )}

          {/* Divider */}
          <div className="relative flex items-center my-6">
            <div className="flex-grow border-t border-neutral-200" />
            <span className="flex-shrink mx-4 text-xs text-neutral-500 font-medium">OR</span>
            <div className="flex-grow border-t border-neutral-200" />
          </div>

          {/* Login Link */}
          <div className="text-center">
            <p className="text-sm text-neutral-600">
              Already have an account?{' '}
              <Link to="/login" className="font-semibold text-purple-600 hover:text-purple-700 transition-colors">
                Sign in
              </Link>
            </p>
          </div>

          {/* Back to Home */}
          <div className="mt-4 text-center">
            <Link to="/" className="text-sm text-neutral-500 hover:text-neutral-700 transition-colors font-medium">
              ← Back to home
            </Link>
          </div>
        </div>
      </div>

      <style>{`
        @keyframes blob {
          0%, 100% {
            transform: translate(0, 0) scale(1);
          }
          33% {
            transform: translate(30px, -50px) scale(1.1);
          }
          66% {
            transform: translate(-20px, 20px) scale(0.9);
          }
        }

        .animate-blob {
          animation: blob 7s infinite;
        }

        .animation-delay-2000 {
          animation-delay: 2s;
        }

        .animation-delay-4000 {
          animation-delay: 4s;
        }
      `}</style>
    </div>
  );
};

export default RegisterPage;
