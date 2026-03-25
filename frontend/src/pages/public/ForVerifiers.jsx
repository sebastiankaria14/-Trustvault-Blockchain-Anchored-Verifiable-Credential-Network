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
      <section className="pt-32 pb-20 relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_20%_30%,#eff6ff_0%,transparent_50%)] -z-10" />
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

      {/* Features Grid */}
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              { icon: Zap, title: 'Millisecond Latency', desc: 'Verify any claim in under 100ms through our globally distributed edge network.' },
              { icon: ShieldAlert, title: 'Zero Fraud', desc: 'Every verification result is backed by a blockchain-anchored proof of authenticity.' },
              { icon: Cpu, title: 'Scalable API', desc: 'Built for high-volume enterprise integrations with 99.99% infrastructure uptime.' }
            ].map((feature, idx) => (
              <motion.div
                key={idx}
                whileHover={{ y: -8 }}
                className="p-10 rounded-[2rem] bg-slate-50 border border-slate-100 hover:bg-white hover:border-blue-100 hover:shadow-2xl transition-all duration-300"
              >
                <div className="w-14 h-14 bg-white shadow-sm border border-slate-100 rounded-2xl flex items-center justify-center text-blue-600 mb-8">
                  <feature.icon size={28} />
                </div>
                <h3 className="text-xl font-bold text-slate-900 mb-4">{feature.title}</h3>
                <p className="text-slate-600 leading-relaxed">{feature.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Use Cases */}
      <section className="py-24 bg-slate-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold text-slate-900 mb-16">Enterprise Use Cases</h2>
          <div className="grid md:grid-cols-4 gap-6">
            {useCases.map((useCase, idx) => (
              <div key={idx} className="bg-white p-8 rounded-3xl shadow-sm border border-slate-100 text-left">
                <useCase.icon className="text-blue-600 mb-6" size={32} />
                <h3 className="text-lg font-bold text-slate-900 mb-3">{useCase.title}</h3>
                <p className="text-sm text-slate-500 leading-relaxed">{useCase.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Workflow Section */}
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col lg:flex-row items-center gap-16">
            <div className="lg:w-1/2">
              <h2 className="text-4xl font-bold text-slate-900 mb-12">Streamlined Workflow</h2>
              <div className="space-y-8">
                {[
                  'Submit verification request via API or Portal',
                  'User receives push notification to grant consent',
                  'Platform performs cryptographic ledger check',
                  'Instant delivery of authenticated JSON payload'
                ].map((step, i) => (
                  <div key={i} className="flex items-center gap-4">
                    <div className="w-8 h-8 rounded-full bg-blue-50 flex items-center justify-center text-blue-600 font-bold flex-shrink-0">
                      {i + 1}
                    </div>
                    <span className="text-lg text-slate-700 font-medium">{step}</span>
                  </div>
                ))}
              </div>
            </div>
            <div className="lg:w-1/2">
               <div className="bg-slate-900 rounded-[2.5rem] p-1 shadow-2xl overflow-hidden">
                  <div className="bg-slate-800/50 p-4 border-b border-slate-700 flex justify-between">
                     <div className="flex gap-1.5">
                        <div className="w-2.5 h-2.5 rounded-full bg-slate-600" />
                        <div className="w-2.5 h-2.5 rounded-full bg-slate-600" />
                        <div className="w-2.5 h-2.5 rounded-full bg-slate-600" />
                     </div>
                     <span className="text-[10px] text-slate-500 font-mono tracking-widest uppercase">Response Payload</span>
                  </div>
                  <pre className="p-8 text-blue-400 font-mono text-sm leading-relaxed overflow-x-auto">
{`{
  "status": "VERIFIED",
  "issuer": "Harvard University",
  "credential": "PhD Computer Science",
  "verifiedAt": "2026-03-25T10:00:00Z",
  "blockchainProof": "0x7a2...f3e",
  "valid": true
}`}
                  </pre>
               </div>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default ForVerifiers;
