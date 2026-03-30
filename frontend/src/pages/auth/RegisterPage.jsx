import React, { useMemo, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { ArrowRight, Building2, Globe, Shield } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { registerUser, registerInstitution, registerVerifier } from '../../services/api';

const registrationTabs = [
  { key: 'user', label: 'User', icon: Shield },
  { key: 'institution', label: 'Institution', icon: Building2 },
  { key: 'verifier', label: 'Verifier', icon: Globe },
];

const strengthLevels = [
  { label: 'Weak', bar: 'bg-red-500', badge: 'bg-red-50 text-red-700 ring-red-100' },
  { label: 'Fair', bar: 'bg-amber-500', badge: 'bg-amber-50 text-amber-700 ring-amber-100' },
  { label: 'Good', bar: 'bg-purple-500', badge: 'bg-purple-50 text-purple-700 ring-purple-100' },
  { label: 'Strong', bar: 'bg-emerald-500', badge: 'bg-emerald-50 text-emerald-700 ring-emerald-100' },
  { label: 'Very strong', bar: 'bg-emerald-600', badge: 'bg-emerald-50 text-emerald-700 ring-emerald-100' },
];

const getPasswordStrength = (password) => {
  let strength = 0;
  if (password.length >= 8) strength++;
  if (/[a-z]/.test(password)) strength++;
  if (/[A-Z]/.test(password)) strength++;
  if (/[0-9]/.test(password)) strength++;
  if (/[^a-zA-Z0-9]/.test(password)) strength++;
  return strength;
};

const getPasswordStrengthLabel = (strength) => strengthLevels[Math.max(0, Math.min(strength - 1, strengthLevels.length - 1))]?.label || '';

const getPasswordStrengthStyles = (strength) => strengthLevels[Math.max(0, Math.min(strength - 1, strengthLevels.length - 1))] || strengthLevels[0];

const Field = ({ label, children, hint }) => (
  <div className="space-y-2">
    <label className="ml-1 block text-sm font-semibold text-slate-700">{label}</label>
    {children}
    {hint ? <p className="ml-1 text-xs leading-relaxed text-slate-500">{hint}</p> : null}
  </div>
);

const StrengthMeter = ({ strength }) => {
  if (!strength) return null;
  const styles = getPasswordStrengthStyles(strength);
  const width = `${Math.max(20, Math.min(strength * 20, 100))}%`;

  return (
    <div className="mt-3 space-y-2">
      <div className="flex items-center justify-between gap-4">
        <span className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">Strength</span>
        <span className={`rounded-full px-3 py-1 text-xs font-bold ring-1 ${styles.badge}`}>{getPasswordStrengthLabel(strength)}</span>
      </div>
      <div className="h-2 overflow-hidden rounded-full bg-slate-200">
        <div className={`h-full rounded-full transition-all duration-300 ${styles.bar}`} style={{ width }} />
      </div>
    </div>
  );
};

const inputClass = 'w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-slate-900 outline-none transition focus:border-purple-500 focus:bg-white focus:ring-4 focus:ring-purple-100';

const RegisterPage = () => {
  const navigate = useNavigate();

  const [activeTab, setActiveTab] = useState('user');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const [userForm, setUserForm] = useState({ email: '', password: '', confirmPassword: '', firstName: '', lastName: '', phone: '', dateOfBirth: '' });
  const [institutionForm, setInstitutionForm] = useState({ name: '', type: 'education', email: '', password: '', confirmPassword: '', registrationNumber: '', phone: '', website: '' });
  const [verifierForm, setVerifierForm] = useState({ companyName: '', email: '', password: '', confirmPassword: '', industry: '', phone: '', website: '' });

  const userPasswordStrength = useMemo(() => getPasswordStrength(userForm.password), [userForm.password]);
  const institutionPasswordStrength = useMemo(() => getPasswordStrength(institutionForm.password), [institutionForm.password]);
  const verifierPasswordStrength = useMemo(() => getPasswordStrength(verifierForm.password), [verifierForm.password]);

  const handleUserChange = (e) => { setUserForm({ ...userForm, [e.target.name]: e.target.value }); setError(''); };
  const handleInstitutionChange = (e) => { setInstitutionForm({ ...institutionForm, [e.target.name]: e.target.value }); setError(''); };
  const handleVerifierChange = (e) => { setVerifierForm({ ...verifierForm, [e.target.name]: e.target.value }); setError(''); };

  const handleUserSubmit = async (e) => {
    e.preventDefault();
    setError('');
    if (userForm.password !== userForm.confirmPassword) return setError('Passwords do not match');
    setLoading(true);
    try {
      const { confirmPassword, ...userData } = userForm;
      const response = await registerUser(userData);
      if (response.success) {
        navigate('/login', {
          state: {
            registrationMessage: response.message || 'Registration submitted. Your account is pending Super Admin approval.'
          }
        });
      }
    } catch (err) { setError(err.message || 'Registration failed. Please try again.'); } finally { setLoading(false); }
  };

  const handleInstitutionSubmit = async (e) => {
    e.preventDefault();
    setError('');
    if (institutionForm.password !== institutionForm.confirmPassword) return setError('Passwords do not match');
    setLoading(true);
    try {
      const { confirmPassword, ...institutionData } = institutionForm;
      const response = await registerInstitution(institutionData);
      if (response.success) {
        navigate('/login', {
          state: {
            registrationMessage: response.message || 'Registration submitted. Your account is pending Super Admin approval.'
          }
        });
      }
    } catch (err) { setError(err.message || 'Registration failed. Please try again.'); } finally { setLoading(false); }
  };

  const handleVerifierSubmit = async (e) => {
    e.preventDefault();
    setError('');
    if (verifierForm.password !== verifierForm.confirmPassword) return setError('Passwords do not match');
    setLoading(true);
    try {
      const { confirmPassword, ...verifierData } = verifierForm;
      const response = await registerVerifier(verifierData);
      if (response.success) {
        navigate('/login', {
          state: {
            registrationMessage: response.message || 'Registration submitted. Your account is pending Super Admin approval.'
          }
        });
      }
    } catch (err) { setError(err.message || 'Registration failed. Please try again.'); } finally { setLoading(false); }
  };

  const renderPasswordField = (name, value, onChange, strength) => (
    <Field label="Password" hint="Use at least 8 characters with mixed case and a number.">
      <input name={name} type="password" required value={value} onChange={onChange} className={inputClass} />
      <StrengthMeter strength={strength} />
    </Field>
  );

  const selectedTab = registrationTabs.find((tab) => tab.key === activeTab);

  return (
    <div className="relative min-h-screen overflow-hidden bg-slate-50">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,_rgba(99,102,241,0.08),_transparent_30%),radial-gradient(circle_at_bottom_left,_rgba(168,85,247,0.08),_transparent_28%)]" />

      <main className="relative z-10 mx-auto flex min-h-screen max-w-5xl items-center px-4 py-6 sm:px-6 lg:px-8">
        <motion.section initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.35, ease: 'easeOut' }} className="w-full rounded-[1.75rem] border border-slate-200 bg-white p-6 shadow-[0_20px_60px_rgba(15,23,42,0.08)] sm:p-8">
          <div className="flex flex-col items-center gap-4 border-b border-slate-100 pb-5 text-center">
            <div className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-blue-600 to-purple-600 px-5 py-2.5 text-sm font-bold uppercase tracking-[0.28em] text-white shadow-sm">
              Register
            </div>
          </div>

          <div className="mt-5 grid grid-cols-3 gap-2.5">
            {registrationTabs.map((tab) => {
              const Icon = tab.icon;
              const active = activeTab === tab.key;

              return (
                <motion.button
                  key={tab.key}
                  type="button"
                  data-ripple
                  whileHover={{ y: -1 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => setActiveTab(tab.key)}
                  className={`flex items-center justify-center gap-2 rounded-[1.25rem] border px-3 py-3 text-sm font-semibold transition-all duration-200 ${active ? 'border-transparent bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg shadow-purple-200/60' : 'border-slate-200 bg-slate-50 text-slate-700 hover:border-purple-200 hover:bg-white'}`}
                >
                  <Icon size={16} />
                  <span>{tab.label}</span>
                </motion.button>
              );
            })}
          </div>

          <AnimatePresence mode="wait">
            {error ? (
              <motion.div key="registration-error" initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }} className="mt-4 rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800">
                {error}
              </motion.div>
            ) : null}
          </AnimatePresence>

          <AnimatePresence mode="wait">
            {activeTab === 'user' && (
              <motion.form key="user" initial={{ opacity: 0, x: 12 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -12 }} transition={{ duration: 0.22, ease: 'easeOut' }} onSubmit={handleUserSubmit} className="mt-5 space-y-3">
                <div className="grid gap-3 md:grid-cols-2">
                  <Field label="First name"><input name="firstName" type="text" required value={userForm.firstName} onChange={handleUserChange} className={inputClass} /></Field>
                  <Field label="Last name"><input name="lastName" type="text" required value={userForm.lastName} onChange={handleUserChange} className={inputClass} /></Field>
                </div>
                <Field label="Email"><input name="email" type="email" required value={userForm.email} onChange={handleUserChange} className={inputClass} /></Field>
                <div className="grid gap-3 md:grid-cols-2">
                  <Field label="Phone"><input name="phone" type="tel" value={userForm.phone} onChange={handleUserChange} className={inputClass} /></Field>
                  <Field label="Date of birth"><input name="dateOfBirth" type="date" value={userForm.dateOfBirth} onChange={handleUserChange} className={inputClass} /></Field>
                </div>
                <div className="grid gap-3 md:grid-cols-2">
                  {renderPasswordField('password', userForm.password, handleUserChange, userPasswordStrength)}
                  <Field label="Confirm password"><input name="confirmPassword" type="password" required value={userForm.confirmPassword} onChange={handleUserChange} className={inputClass} /></Field>
                </div>
                <button type="submit" disabled={loading} data-ripple className="btn btn-lg w-full rounded-2xl bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg shadow-purple-200/60 transition-all duration-200 hover:shadow-2xl disabled:cursor-not-allowed disabled:opacity-50">{loading ? 'Creating account...' : <><span>Create User Account</span><ArrowRight size={18} /></>}</button>
                <div className="grid gap-3 pt-1 sm:grid-cols-2">
                  <Link to="/" className="rounded-2xl border border-slate-200 bg-white px-4 py-3 text-center text-sm font-semibold text-slate-700 transition-all hover:-translate-y-0.5 hover:border-purple-200 hover:bg-slate-50">
                    Go to homepage
                  </Link>
                  <Link to="/login" className="rounded-2xl border border-slate-200 bg-white px-4 py-3 text-center text-sm font-semibold text-slate-700 transition-all hover:-translate-y-0.5 hover:border-purple-200 hover:bg-slate-50">
                    Log in
                  </Link>
                </div>
              </motion.form>
            )}

            {activeTab === 'institution' && (
              <motion.form key="institution" initial={{ opacity: 0, x: 12 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -12 }} transition={{ duration: 0.22, ease: 'easeOut' }} onSubmit={handleInstitutionSubmit} className="mt-5 space-y-3">
                <Field label="Institution name"><input name="name" type="text" required value={institutionForm.name} onChange={handleInstitutionChange} className={inputClass} /></Field>
                <Field label="Institution type"><select name="type" required value={institutionForm.type} onChange={handleInstitutionChange} className={inputClass}><option value="education">Education</option><option value="financial">Financial</option><option value="healthcare">Healthcare</option><option value="government">Government</option><option value="employer">Employer</option><option value="other">Other</option></select></Field>
                <Field label="Email"><input name="email" type="email" required value={institutionForm.email} onChange={handleInstitutionChange} className={inputClass} /></Field>
                <div className="grid gap-3 md:grid-cols-2">
                  <Field label="Registration number"><input name="registrationNumber" type="text" value={institutionForm.registrationNumber} onChange={handleInstitutionChange} className={inputClass} /></Field>
                  <Field label="Phone"><input name="phone" type="tel" value={institutionForm.phone} onChange={handleInstitutionChange} className={inputClass} /></Field>
                </div>
                <Field label="Website"><input name="website" type="url" value={institutionForm.website} onChange={handleInstitutionChange} className={inputClass} /></Field>
                <div className="grid gap-3 md:grid-cols-2">
                  {renderPasswordField('password', institutionForm.password, handleInstitutionChange, institutionPasswordStrength)}
                  <Field label="Confirm password"><input name="confirmPassword" type="password" required value={institutionForm.confirmPassword} onChange={handleInstitutionChange} className={inputClass} /></Field>
                </div>
                <button type="submit" disabled={loading} data-ripple className="btn btn-lg w-full rounded-2xl bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg shadow-purple-200/60 transition-all duration-200 hover:shadow-2xl disabled:cursor-not-allowed disabled:opacity-50">{loading ? 'Creating account...' : <><span>Create Institution Account</span><ArrowRight size={18} /></>}</button>
                <div className="grid gap-3 pt-1 sm:grid-cols-2">
                  <Link to="/" className="rounded-2xl border border-slate-200 bg-white px-4 py-3 text-center text-sm font-semibold text-slate-700 transition-all hover:-translate-y-0.5 hover:border-purple-200 hover:bg-slate-50">
                    Go to homepage
                  </Link>
                  <Link to="/login" className="rounded-2xl border border-slate-200 bg-white px-4 py-3 text-center text-sm font-semibold text-slate-700 transition-all hover:-translate-y-0.5 hover:border-purple-200 hover:bg-slate-50">
                    Log in
                  </Link>
                </div>
              </motion.form>
            )}

            {activeTab === 'verifier' && (
              <motion.form key="verifier" initial={{ opacity: 0, x: 12 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -12 }} transition={{ duration: 0.22, ease: 'easeOut' }} onSubmit={handleVerifierSubmit} className="mt-5 space-y-3">
                <Field label="Company name"><input name="companyName" type="text" required value={verifierForm.companyName} onChange={handleVerifierChange} className={inputClass} /></Field>
                <Field label="Email"><input name="email" type="email" required value={verifierForm.email} onChange={handleVerifierChange} className={inputClass} /></Field>
                <div className="grid gap-3 md:grid-cols-2">
                  <Field label="Industry"><input name="industry" type="text" value={verifierForm.industry} onChange={handleVerifierChange} className={inputClass} /></Field>
                  <Field label="Phone"><input name="phone" type="tel" value={verifierForm.phone} onChange={handleVerifierChange} className={inputClass} /></Field>
                </div>
                <Field label="Website"><input name="website" type="url" value={verifierForm.website} onChange={handleVerifierChange} className={inputClass} /></Field>
                <div className="grid gap-3 md:grid-cols-2">
                  {renderPasswordField('password', verifierForm.password, handleVerifierChange, verifierPasswordStrength)}
                  <Field label="Confirm password"><input name="confirmPassword" type="password" required value={verifierForm.confirmPassword} onChange={handleVerifierChange} className={inputClass} /></Field>
                </div>
                <button type="submit" disabled={loading} data-ripple className="btn btn-lg w-full rounded-2xl bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg shadow-purple-200/60 transition-all duration-200 hover:shadow-2xl disabled:cursor-not-allowed disabled:opacity-50">{loading ? 'Creating account...' : <><span>Create Verifier Account</span><ArrowRight size={18} /></>}</button>
                <div className="grid gap-3 pt-1 sm:grid-cols-2">
                  <Link to="/" className="rounded-2xl border border-slate-200 bg-white px-4 py-3 text-center text-sm font-semibold text-slate-700 transition-all hover:-translate-y-0.5 hover:border-purple-200 hover:bg-slate-50">
                    Go to homepage
                  </Link>
                  <Link to="/login" className="rounded-2xl border border-slate-200 bg-white px-4 py-3 text-center text-sm font-semibold text-slate-700 transition-all hover:-translate-y-0.5 hover:border-purple-200 hover:bg-slate-50">
                    Log in
                  </Link>
                </div>
              </motion.form>
            )}
          </AnimatePresence>
        </motion.section>
      </main>
    </div>
  );
};

export default RegisterPage;
