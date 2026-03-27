import React from 'react';
import { motion } from 'framer-motion';
import { Search, ShieldAlert, Cpu, Zap, CreditCard, Home, Briefcase, GraduationCap, ArrowRight, CheckCircle2, Terminal } from 'lucide-react';
import { Link } from 'react-router-dom';
import Navbar from '../../components/Navbar';
import Footer from '../../components/Footer';

const ForVerifiers = () => {
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

  const useCases = [
    { icon: Briefcase, title: 'HR & Recruitment', desc: 'Instant background checks for degrees and past employment.' },
    { icon: CreditCard, title: 'Lending & Fintech', desc: 'Verify income and assets with high-fidelity digital records.' },
    { icon: Home, title: 'Real Estate', desc: 'Streamline tenant screening with verified identity and income.' },
    { icon: GraduationCap, title: 'Admissions', desc: 'Authenticate transfer credits and international transcripts.' }
  ];

  return (
    <div className="min-h-screen bg-[#FDFDFF]">
      <Navbar />

      {/* Hero Section */}
      <section className="bg-gradient-to-r from-primary-700 to-primary-900 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl font-bold mb-4">TrustVault for Verifiers</h1>
          <p className="text-xl text-slate-200">
            Verify credentials in seconds, not days. Reduce fraud and streamline your hiring process.
          </p>
        </div>
      </section>

      {/* Who Uses It */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-indigo-50 text-indigo-700 text-sm font-bold mb-6 border border-indigo-100">
                <Search size={16} /> Verifier Ecosystem
              </div>
              <h1 className="text-5xl md:text-6xl font-extrabold text-slate-900 mb-8 leading-tight">
                Trust as a <span className="text-blue-600">Service</span>
              </h1>
              <p className="text-xl text-slate-600 mb-10 leading-relaxed">
                Eliminate fraud and manual background checks. Our verification engine provides cryptographically guaranteed truth in milliseconds.
              </p>
              <div className="flex flex-wrap gap-4">
                <Link to="/register" className="px-8 py-4 bg-slate-900 text-white rounded-2xl font-bold hover:bg-slate-800 transition-all shadow-lg flex items-center gap-2">
                  Start Verifying <ArrowRight size={20} />
                </Link>
                <Link to="/api-docs" className="px-8 py-4 bg-white text-slate-900 border border-slate-200 rounded-2xl font-bold hover:bg-slate-50 transition-all flex items-center gap-2">
                  <Terminal size={20} /> API Documentation
                </Link>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Benefits */}
      <section className="bg-slate-50 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="bg-white p-6 rounded-lg shadow-md">
              <div className="text-3xl mb-3">⚡</div>
              <h3 className="text-xl font-semibold mb-3 text-primary-900">Instant Verification</h3>
              <p className="text-gray-600">
                Get verification results in under 2 seconds. No more waiting days or weeks for background checks.
              </p>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-md">
              <div className="text-3xl mb-3">💰</div>
              <h3 className="text-xl font-semibold mb-3 text-primary-900">Reduce Costs</h3>
              <p className="text-gray-600">
                Automated verification costs pennies compared to traditional background check services.
              </p>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-md">
              <div className="text-3xl mb-3">🛡️</div>
              <h3 className="text-xl font-semibold mb-3 text-primary-900">Eliminate Fraud</h3>
              <p className="text-gray-600">
                Blockchain verification ensures credentials are authentic. Fake documents become impossible.
              </p>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-md">
              <div className="text-3xl mb-3">📋</div>
              <h3 className="text-xl font-semibold mb-3 text-primary-900">Complete Audit Trail</h3>
              <p className="text-gray-600">
                Every verification is logged with timestamps, user consent, and blockchain proof.
              </p>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-md">
              <div className="text-3xl mb-3">🔌</div>
              <h3 className="text-xl font-semibold mb-3 text-primary-900">Simple Integration</h3>
              <p className="text-gray-600">
                RESTful API that integrates with your existing systems in minutes. SDKs and code examples provided.
              </p>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-md">
              <div className="text-3xl mb-3">✅</div>
              <h3 className="text-xl font-semibold mb-3 text-primary-900">GDPR Compliant</h3>
              <p className="text-gray-600">
                Built-in consent management. Users control who accesses their data and for how long.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works for Verifiers */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-center mb-12">How Verification Works</h2>

          <div className="max-w-4xl mx-auto space-y-6">
            <div className="flex items-start space-x-4 bg-white p-6 rounded-lg shadow-md">
              <div className="bg-primary-800 text-white w-10 h-10 rounded-full flex items-center justify-center font-bold flex-shrink-0">1</div>
              <div>
                <h3 className="text-lg font-semibold mb-1">Request Verification</h3>
                <p className="text-gray-600">Send a verification request via our portal or API. Specify which credentials you need.</p>
              </div>
            </div>

            <div className="flex items-start space-x-4 bg-white p-6 rounded-lg shadow-md">
              <div className="bg-primary-800 text-white w-10 h-10 rounded-full flex items-center justify-center font-bold flex-shrink-0">2</div>
              <div>
                <h3 className="text-lg font-semibold mb-1">User Grants Consent</h3>
                <p className="text-gray-600">User receives notification and approves or denies your request. They control their data.</p>
              </div>
            </div>

            <div className="flex items-start space-x-4 bg-white p-6 rounded-lg shadow-md">
              <div className="bg-primary-800 text-white w-10 h-10 rounded-full flex items-center justify-center font-bold flex-shrink-0">3</div>
              <div>
                <h3 className="text-lg font-semibold mb-1">Get Instant Results</h3>
                <p className="text-gray-600">Receive verified credential data in JSON format. Blockchain hash confirmed automatically.</p>
              </div>
            </div>

            <div className="flex items-start space-x-4 bg-white p-6 rounded-lg shadow-md">
              <div className="bg-primary-800 text-white w-10 h-10 rounded-full flex items-center justify-center font-bold flex-shrink-0">4</div>
              <div>
                <h3 className="text-lg font-semibold mb-1">Make Decisions</h3>
                <p className="text-gray-600">Use verified data for hiring, loan approvals, admissions, or any other purpose.</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Workflow Section */}
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-center mb-8">Simple API Integration</h2>
          <p className="text-center text-gray-600 mb-12">
            Just one API call to verify any credential
          </p>

          <div className="max-w-3xl mx-auto bg-gray-900 rounded-lg p-6 text-white font-mono text-sm overflow-x-auto">
            <pre>{`// Example: Verify a degree
const response = await fetch('https://api.trustvault.com/v1/verify/degree', {
  method: 'POST',
  headers: {
    'Authorization': 'Bearer YOUR_API_KEY',
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    userId: 'user-uuid',
    credentialId: 'credential-uuid'
  })
});

const result = await response.json();
// {
//   "verified": true,
//   "credential": {
//     "degree": "Bachelor of Science",
//     "major": "Computer Science",
//     "institution": "MIT",
//     "graduationYear": 2024,
//     "blockchainVerified": true
//   },
//   "responseTime": "1.2s"
// }`}</pre>
          </div>

          <div className="text-center mt-8">
            <Link to="/api-docs" className="text-primary-900 hover:text-primary-800 font-semibold">
              View Full API Documentation →
            </Link>
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="bg-gradient-to-r from-primary-700 to-primary-900 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold mb-4">Start Verifying Today</h2>
          <p className="text-xl mb-8 text-slate-200">
            Get your API key and start verifying credentials in minutes
          </p>
          <Link to="/register" className="px-8 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg font-semibold transition hover:-translate-y-0.5 hover:shadow-lg inline-block">
            Register as Verifier
          </Link>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default ForVerifiers;
