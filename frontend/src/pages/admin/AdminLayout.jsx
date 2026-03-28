import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import {
  LayoutDashboard,
  Users,
  Building2,
  ShieldCheck,
  Blocks,
  Settings,
  LogOut,
  Crown
} from 'lucide-react';

const navigation = [
  { label: 'Dashboard', href: '/admin/dashboard', icon: LayoutDashboard },
  { label: 'Users', href: '/admin/users', icon: Users },
  { label: 'Institutions', href: '/admin/institutions', icon: Building2 },
  { label: 'Verifiers', href: '/admin/verifiers', icon: ShieldCheck },
  { label: 'Blockchain', href: '/admin/blockchain', icon: Blocks },
  { label: 'Settings', href: '/admin/settings', icon: Settings }
];

const AdminLayout = ({ title, subtitle, children }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="min-h-screen bg-slate-100 text-slate-900">
      <aside className="fixed inset-y-0 left-0 w-72 border-r border-slate-200 bg-white">
        <div className="border-b border-slate-200 p-6">
          <div className="flex items-center gap-3">
            <div className="rounded-2xl bg-gradient-to-r from-blue-600 to-indigo-600 p-2 text-white">
              <Crown size={18} />
            </div>
            <div>
              <h1 className="text-xl font-black tracking-tight">TrustVault</h1>
              <p className="text-xs uppercase tracking-wide text-slate-500">Super Admin</p>
            </div>
          </div>
        </div>

        <nav className="space-y-1 p-4">
          {navigation.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.href;

            return (
              <Link
                key={item.href}
                to={item.href}
                className={`flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-semibold transition ${
                  isActive
                    ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-lg shadow-blue-200/70'
                    : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
                }`}
              >
                <Icon size={18} />
                {item.label}
              </Link>
            );
          })}
        </nav>

        <div className="absolute bottom-0 w-full border-t border-slate-200 p-4">
          <div className="mb-3 rounded-xl bg-slate-100 px-3 py-2">
            <p className="text-xs font-semibold text-slate-500">Logged in as</p>
            <p className="truncate text-sm font-bold text-slate-800">{user?.full_name || user?.fullName || user?.email}</p>
          </div>
          <button
            onClick={handleLogout}
            className="flex w-full items-center justify-center gap-2 rounded-xl border border-slate-200 px-4 py-2 text-sm font-semibold text-slate-600 transition hover:border-red-200 hover:bg-red-50 hover:text-red-700"
          >
            <LogOut size={16} />
            Logout
          </button>
        </div>
      </aside>

      <main className="ml-72 p-8">
        <header className="mb-8 rounded-2xl border border-slate-200 bg-white px-6 py-5 shadow-sm">
          <h2 className="text-2xl font-black tracking-tight text-slate-900">{title}</h2>
          {subtitle ? <p className="mt-1 text-sm text-slate-600">{subtitle}</p> : null}
        </header>

        {children}
      </main>
    </div>
  );
};

export default AdminLayout;
