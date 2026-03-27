import React from 'react';
import { motion } from 'framer-motion';
import { Building2, GraduationCap, Landmark, HeartPulse, ShieldCheck, Zap, Globe, BarChart3, Puzzle, FileCheck, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import Navbar from '../../components/Navbar';
import Footer from '../../components/Footer';

const ForInstitutions = () => {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1, 
      transition: { staggerChildren: 0.1 } 
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { y: 0, opacity: 1 }
  };

  const sectors = [
    { icon: GraduationCap, name: 'Universities', desc: 'Degrees, diplomas, and official transcripts.', color: 'blue' },
    { icon: Building2, name: 'Employers', desc: 'Work history and performance certificates.', color: 'indigo' },
    { icon: Landmark, name: 'Financial', desc: 'Credit reports and statement verification.', color: 'cyan' },
    { icon: HeartPulse, name: 'Healthcare', desc: 'Medical records and health certifications.', color: 'rose' }
  ];

  const benefits = [
    { icon: Zap, title: 'Operational Efficiency', desc: 'Cut administrative costs by 80% with automated digital issuance.' },
    { icon: ShieldCheck, title: 'Fraud Prevention', desc: 'Eliminate forged documents with blockchain-anchored signatures.' },
    { icon: Globe, title: 'Global Portability', desc: 'Your credentials are recognized and verifiable across borders.' },
    { icon: BarChart3, title: 'Advanced Analytics', desc: 'Insightful dashboards tracking issuance and verification trends.' },
    { icon: Puzzle, title: 'Seamless Integration', desc: 'Connect with existing LMS/HRIS systems via our robust API.' },
    { icon: FileCheck, title: 'Compliance First', desc: 'Full GDPR/CCPA compliance with user-centric consent flows.' }
  ];

  return (
    <div className="min-h-screen bg-[#FDFDFF]">
      <Navbar />

      {/* Hero Section */}
      <section className="bg-gradient-to-r from-primary-700 to-primary-900 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl font-bold mb-4">TrustVault for Institutions</h1>
          <p className="text-xl text-slate-200">
            Issue verified credentials that your students, employees, and clients can use anywhere
          </p>
        </div>
      </section>

      {/* Who Can Use */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col lg:flex-row items-center gap-16">
            <div className="lg:w-1/2 text-left">
              <motion.div
                initial={{ opacity: 0, x: -30 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6 }}
              >
                <div className="inline-block px-4 py-1.5 bg-blue-50 text-blue-700 rounded-full text-sm font-bold mb-6 border border-blue-100">
                  Institutional Portal
                </div>
                <h1 className="text-5xl lg:text-6xl font-extrabold text-slate-900 mb-8 leading-tight">
                  The Gold Standard for <span className="text-blue-600">Credential Issuance</span>
                </h1>
                <p className="text-xl text-slate-600 mb-10 leading-relaxed max-w-xl">
                  Empower your alumni and employees with verifiable digital credentials that are secure, portable, and instant.
                </p>
                <div className="flex flex-wrap gap-4">
                  <Link to="/register" className="px-8 py-4 bg-blue-600 text-white rounded-2xl font-bold hover:bg-blue-700 transition-all shadow-lg shadow-blue-200 flex items-center gap-2">
                    Become an Issuer <ArrowRight size={20} />
                  </Link>
                  <Link to="/contact" className="px-8 py-4 bg-white text-slate-900 border border-slate-200 rounded-2xl font-bold hover:bg-slate-50 transition-all">
                    Request Demo
                  </Link>
                </div>
              </motion.div>
            </div>
            <div className="lg:w-1/2">
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="bg-slate-900 rounded-[3rem] p-10 shadow-2xl relative"
              >
                 <div className="flex items-center justify-between mb-12">
                   <div className="flex gap-2">
                     <div className="w-3 h-3 rounded-full bg-red-400" />
                     <div className="w-3 h-3 rounded-full bg-amber-400" />
                     <div className="w-3 h-3 rounded-full bg-green-400" />
                   </div>
                   <div className="px-4 py-1 bg-slate-800 rounded-full text-xs text-slate-400 font-mono">issuer_console_v2.0</div>
                 </div>
                 <div className="space-y-6">
                    <div className="h-4 w-3/4 bg-slate-800 rounded-full" />
                    <div className="h-4 w-1/2 bg-slate-800 rounded-full" />
                    <div className="grid grid-cols-2 gap-4 mt-12">
                       <div className="h-24 bg-blue-600/20 border border-blue-500/30 rounded-2xl flex items-center justify-center">
                          <BarChart3 className="text-blue-400" size={32} />
                       </div>
                       <div className="h-24 bg-slate-800 rounded-2xl" />
                    </div>
                 </div>
              </motion.div>
            </div>
          </div>
        </div>
      </section>

      {/* Sectors */}
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-center mb-12">Why Choose TrustVault?</h2>

          <div className="grid md:grid-cols-2 gap-8">
            <div className="flex items-start space-x-4">
              <div className="bg-primary-900/10 p-3 rounded-lg">
                <div className="text-2xl text-primary-900">⚡</div>
              </div>
              <div>
                <h3 className="text-xl font-semibold mb-2">Reduce Administrative Burden</h3>
                <p className="text-gray-600">
                  Issue credentials digitally instead of printing physical documents. Save time, money, and paper.
                </p>
              </div>
            </div>

            <div className="flex items-start space-x-4">
              <div className="bg-primary-900/10 p-3 rounded-lg">
                <div className="text-2xl text-primary-900">🔒</div>
              </div>
              <div>
                <h3 className="text-xl font-semibold mb-2">Prevent Fraud</h3>
                <p className="text-gray-600">
                  Blockchain-backed credentials are impossible to forge. Protect your institution's reputation.
                </p>
              </div>
            </div>

            <div className="flex items-start space-x-4">
              <div className="bg-primary-900/10 p-3 rounded-lg">
                <div className="text-2xl text-primary-900">🌐</div>
              </div>
              <div>
                <h3 className="text-xl font-semibold mb-2">Global Reach</h3>
                <p className="text-gray-600">
                  Your credentials are accessible worldwide. Help your students and employees anywhere they go.
                </p>
              </div>
            </div>

            <div className="flex items-start space-x-4">
              <div className="bg-primary-900/10 p-3 rounded-lg">
                <div className="text-2xl text-primary-900">📊</div>
              </div>
              <div>
                <h3 className="text-xl font-semibold mb-2">Track & Manage</h3>
                <p className="text-gray-600">
                  Dashboard shows all issued credentials, verification requests, and analytics in real-time.
                </p>
              </div>
            </div>

            <div className="flex items-start space-x-4">
              <div className="bg-primary-900/10 p-3 rounded-lg">
                <div className="text-2xl text-primary-900">🔌</div>
              </div>
              <div>
                <h3 className="text-xl font-semibold mb-2">Easy Integration</h3>
                <p className="text-gray-600">
                  Simple API integration with your existing systems. Technical support included.
                </p>
              </div>
            </div>

            <div className="flex items-start space-x-4">
              <div className="bg-primary-900/10 p-3 rounded-lg">
                <div className="text-2xl text-primary-900">✅</div>
              </div>
              <div>
                <h3 className="text-xl font-semibold mb-2">Compliance Ready</h3>
                <p className="text-gray-600">
                  GDPR compliant, audit trails, and full consent management built-in.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Value Prop */}
      <section className="py-24 bg-slate-50 relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-center mb-12">Getting Started is Easy</h2>

          <div className="grid md:grid-cols-4 gap-6">
            <div className="text-center">
              <div className="bg-primary-800 text-white w-12 h-12 rounded-full flex items-center justify-center text-xl font-bold mx-auto mb-4">1</div>
              <h3 className="font-semibold mb-2">Register</h3>
              <p className="text-gray-600 text-sm">Sign up and verify your institution</p>
            </div>

            <div className="text-center">
              <div className="bg-primary-800 text-white w-12 h-12 rounded-full flex items-center justify-center text-xl font-bold mx-auto mb-4">2</div>
              <h3 className="font-semibold mb-2">Get Approved</h3>
              <p className="text-gray-600 text-sm">Quick verification process (1-2 business days)</p>
            </div>

            <div className="text-center">
              <div className="bg-primary-800 text-white w-12 h-12 rounded-full flex items-center justify-center text-xl font-bold mx-auto mb-4">3</div>
              <h3 className="font-semibold mb-2">Integrate</h3>
              <p className="text-gray-600 text-sm">Use our portal or integrate via API</p>
            </div>

            <div className="text-center">
              <div className="bg-primary-800 text-white w-12 h-12 rounded-full flex items-center justify-center text-xl font-bold mx-auto mb-4">4</div>
              <h3 className="font-semibold mb-2">Issue</h3>
              <p className="text-gray-600 text-sm">Start issuing verified credentials instantly</p>
            </div>
          </div>
        </div>
      </section>

      {/* Pricing Section (Optional) */}
      <section className="bg-gray-100 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold mb-4">Transparent Pricing</h2>
          <p className="text-xl text-gray-600 mb-8">
            Pay per credential issued. No setup fees. No hidden costs.
          </p>
          <div className="bg-white p-8 rounded-lg shadow-md inline-block">
            <div className="text-4xl font-bold text-primary-900 mb-2">$0.50</div>
            <p className="text-gray-600">per credential issued</p>
            <p className="text-sm text-gray-500 mt-2">Volume discounts available</p>
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="bg-gradient-to-r from-primary-700 to-primary-900 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold mb-4">Transform How You Issue Credentials</h2>
          <p className="text-xl mb-8 text-slate-200">
            Join leading institutions already using TrustVault
          </p>
          <Link to="/register" className="px-8 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg font-semibold transition hover:-translate-y-0.5 hover:shadow-lg inline-block">
            Register Your Institution
          </Link>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default ForInstitutions;
