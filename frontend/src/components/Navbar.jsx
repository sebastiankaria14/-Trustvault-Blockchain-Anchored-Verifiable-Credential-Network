import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Shield, Menu, X, ArrowRight } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { name: 'How It Works', path: '/how-it-works' },
    { name: 'Institutions', path: '/for-institutions' },
    { name: 'Verifiers', path: '/for-verifiers' },
    { name: 'API Reference', path: '/api-docs' },
    { name: 'Support', path: '/contact' },
  ];

  return (
    <nav 
      className={`fixed top-0 left-0 right-0 z-[100] transition-all duration-300 ${
        isScrolled 
          ? 'bg-white/80 backdrop-blur-lg border-b border-slate-100 py-3 shadow-sm' 
          : 'bg-transparent py-5'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center">
          {/* Logo */}
          <div className="flex items-center">
            <Link to="/" className="text-2xl font-bold text-primary-800 hover:text-primary-900">
              TrustVault
            </Link>
          </div>

          {/* Navigation Links */}
          <div className="hidden md:flex space-x-8">
            <Link to="/" className="text-gray-700 hover:text-primary-800 transition">
              Home
            </Link>
            <Link to="/how-it-works" className="text-gray-700 hover:text-primary-800 transition">
              How It Works
            </Link>
            <Link to="/for-institutions" className="text-gray-700 hover:text-primary-800 transition">
              For Institutions
            </Link>
            <Link to="/for-verifiers" className="text-gray-700 hover:text-primary-800 transition">
              For Verifiers
            </Link>
            <Link to="/api-docs" className="text-gray-700 hover:text-primary-800 transition">
              API Docs
            </Link>
            <Link to="/contact" className="text-gray-700 hover:text-primary-800 transition">
              Contact
            </Link>
          </div>

          {/* Action Buttons */}
          <div className="flex space-x-4">
            <Link to="/login" className="px-4 py-2 text-primary-800 hover:text-primary-900 transition">
              Login
            </Link>
            <Link to="/register" className="px-4 py-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg hover:shadow-lg transition">
              Get Started
            </Link>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="lg:hidden bg-white border-b border-slate-100 overflow-hidden"
          >
            <div className="px-4 py-6 space-y-4">
              {navLinks.map((link) => (
                <Link
                  key={link.path}
                  to={link.path}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="block px-4 py-3 text-lg font-bold text-slate-700 hover:text-blue-600 hover:bg-blue-50 rounded-2xl transition-all"
                >
                  {link.name}
                </Link>
              ))}
              <div className="pt-4 flex flex-col gap-3">
                <Link 
                  to="/login" 
                  className="w-full py-4 text-center font-bold text-slate-700 bg-slate-50 rounded-2xl"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  Sign In
                </Link>
                <Link 
                  to="/register" 
                  className="w-full py-4 text-center font-bold text-white bg-blue-600 rounded-2xl shadow-lg shadow-blue-100"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  Get Started Free
                </Link>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};

export default Navbar;
