import React from 'react';
import { Link } from 'react-router-dom';
import { Shield, X, Globe, Mail, MessageCircle } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="bg-slate-900 text-slate-300 pt-20 pb-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-12 mb-16">
          
          <div className="col-span-2 lg:col-span-2">
            <Link to="/" className="flex items-center gap-2 mb-6 group">
              <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center text-white shadow-lg shadow-blue-900/20 group-hover:scale-105 transition-transform">
                <Shield size={24} fill="currentColor" fillOpacity={0.2} />
              </div>
              <span className="text-xl font-black text-white tracking-tight">
                Trust<span className="text-blue-500">Vault</span>
              </span>
            </Link>
            <p className="text-slate-400 text-lg leading-relaxed mb-8 max-w-sm">
              The global infrastructure for cryptographically verifiable identity and credentials.
            </p>
            <div className="flex gap-4">
              {[X, Globe, MessageCircle, Mail].map((Icon, i) => (
                <a key={i} href="#" className="w-10 h-10 rounded-xl bg-slate-800 flex items-center justify-center text-slate-400 hover:bg-blue-600 hover:text-white transition-all transform hover:-translate-y-1">
                  <Icon size={20} />
                </a>
              ))}
            </div>
          </div>

          <div>
            <h4 className="text-white font-bold mb-6 uppercase tracking-widest text-xs">Protocol</h4>
            <ul className="space-y-4">
              <li><Link to="/how-it-works" className="hover:text-blue-400 transition-colors">Mechanism</Link></li>
              <li><Link to="/api-docs" className="hover:text-blue-400 transition-colors">Documentation</Link></li>
              <li><Link to="/for-institutions" className="hover:text-blue-400 transition-colors">For Issuers</Link></li>
              <li><Link to="/for-verifiers" className="hover:text-blue-400 transition-colors">For Verifiers</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="text-white font-bold mb-6 uppercase tracking-widest text-xs">Resources</h4>
            <ul className="space-y-4">
              <li><Link to="/contact" className="hover:text-blue-400 transition-colors">Support Center</Link></li>
              <li><Link to="#" className="hover:text-blue-400 transition-colors">Network Status</Link></li>
              <li><Link to="#" className="hover:text-blue-400 transition-colors">Security Audit</Link></li>
              <li><Link to="#" className="hover:text-blue-400 transition-colors">Whitepaper</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="text-white font-bold mb-6 uppercase tracking-widest text-xs">Compliance</h4>
            <ul className="space-y-4">
              <li><Link to="#" className="hover:text-blue-400 transition-colors">Privacy Policy</Link></li>
              <li><Link to="#" className="hover:text-blue-400 transition-colors">Terms of Use</Link></li>
              <li><Link to="#" className="hover:text-blue-400 transition-colors">Data Processing</Link></li>
              <li><Link to="#" className="hover:text-blue-400 transition-colors">Cookie Policy</Link></li>
            </ul>
          </div>

        </div>

        <div className="pt-8 border-t border-slate-800 flex flex-col md:flex-row justify-between items-center gap-4 text-sm text-slate-500 font-medium">
          <p>&copy; 2026 TrustVault Protocol. All rights reserved.</p>
          <div className="flex gap-6">
            <span className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)]" />
              Mainnet Operational
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
