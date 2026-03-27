import React, { useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { Link, useNavigate } from 'react-router-dom';
import { ArrowRight, Building2, Globe, Shield } from 'lucide-react';
import { login as loginAPI } from '../../services/api';
import { useAuth } from '../../context/AuthContext';

const roleOptions = [
  { key: 'user', label: 'User', icon: Shield },
  { key: 'institution', label: 'Institution', icon: Building2 },
  { key: 'verifier', label: 'Verifier', icon: Globe },
];

const LoginPage = () => {
  const navigate = useNavigate();
  const { login } = useAuth();

  const [userType, setUserType] = useState('user');
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const response = await loginAPI(formData.email, formData.password, userType);
      if (response.success) {
        login(response.data.token, response.data.user, userType);
        if (userType === 'user') navigate('/user/dashboard');
        if (userType === 'institution') navigate('/institution/dashboard');
        if (userType === 'verifier') navigate('/verifier/dashboard');
      }
    } catch (err) {
      setError(err.message || 'Login failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const activeRole = roleOptions.find((role) => role.key === userType);

  return (
    <div className="relative min-h-screen overflow-hidden bg-slate-50">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,_rgba(99,102,241,0.08),_transparent_30%),radial-gradient(circle_at_bottom_right,_rgba(168,85,247,0.08),_transparent_28%)]" />

      <main className="relative z-10 mx-auto flex min-h-screen max-w-2xl items-center px-4 py-6 sm:px-6 lg:px-8">
        <motion.section initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.35, ease: 'easeOut' }} className="w-full rounded-[1.75rem] border border-slate-200 bg-white p-6 shadow-[0_20px_60px_rgba(15,23,42,0.08)] sm:p-8">
          <div className="flex flex-col items-center gap-4 border-b border-slate-100 pb-5 text-center">
            <div className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-blue-600 to-purple-600 px-5 py-2.5 text-sm font-bold uppercase tracking-[0.28em] text-white shadow-sm">
              Sign in
            </div>
          </div>

          <div className="mt-5 grid grid-cols-3 gap-2.5">
            {roleOptions.map((role) => {
              const Icon = role.icon;
              const active = userType === role.key;

              return (
                <motion.button
                  key={role.key}
                  type="button"
                  data-ripple
                  whileHover={{ y: -1 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => setUserType(role.key)}
                  className={`flex items-center justify-center gap-2 rounded-[1.25rem] border px-3 py-3 text-sm font-semibold transition-all duration-200 ${active ? 'border-transparent bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg shadow-purple-200/60' : 'border-slate-200 bg-slate-50 text-slate-700 hover:border-purple-200 hover:bg-white'}`}
                >
                  <Icon size={16} />
                  <span>{role.label}</span>
                </motion.button>
              );
            })}
          </div>

          <AnimatePresence mode="wait">
            {error ? (
              <motion.div key="login-error" initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }} className="mt-4 rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800">
                {error}
              </motion.div>
            ) : null}
          </AnimatePresence>

          <motion.form key={userType} initial={{ opacity: 0, x: 12 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -12 }} transition={{ duration: 0.22, ease: 'easeOut' }} onSubmit={handleSubmit} className="mt-5 space-y-4">
            <div className="space-y-2">
              <label htmlFor="email" className="block text-sm font-semibold text-slate-700">Email</label>
              <input id="email" name="email" type="email" required value={formData.email} onChange={handleChange} placeholder="your@email.com" className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-slate-900 outline-none transition focus:border-purple-500 focus:bg-white focus:ring-4 focus:ring-purple-100" />
            </div>
            <div className="space-y-2">
              <label htmlFor="password" className="block text-sm font-semibold text-slate-700">Password</label>
              <input id="password" name="password" type="password" required value={formData.password} onChange={handleChange} placeholder="Enter your password" className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-slate-900 outline-none transition focus:border-purple-500 focus:bg-white focus:ring-4 focus:ring-purple-100" />
            </div>
            <button type="submit" disabled={loading} data-ripple className="btn btn-lg w-full rounded-2xl bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg shadow-purple-200/60 transition-all duration-200 hover:shadow-2xl disabled:cursor-not-allowed disabled:opacity-50">
              {loading ? 'Signing in...' : <><span>Sign in</span><ArrowRight size={18} /></>}
            </button>

            <div className="grid gap-3 pt-1 sm:grid-cols-2">
              <Link to="/" className="rounded-2xl border border-slate-200 bg-white px-4 py-3 text-center text-sm font-semibold text-slate-700 transition-all hover:-translate-y-0.5 hover:border-purple-200 hover:bg-slate-50">
                Go to homepage
              </Link>
              <Link to="/register" state={{ from: 'login' }} className="rounded-2xl border border-slate-200 bg-white px-4 py-3 text-center text-sm font-semibold text-slate-700 transition-all hover:-translate-y-0.5 hover:border-purple-200 hover:bg-slate-50">
                Create account
              </Link>
            </div>
          </motion.form>
        </motion.section>
      </main>
    </div>
  );
};

export default LoginPage;
