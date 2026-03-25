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

      {/* Hero */}
      <section className="pt-32 pb-24 relative overflow-hidden bg-white border-b border-slate-100">
        <div className="absolute top-0 right-0 w-1/2 h-full bg-blue-50/50 -skew-x-12 translate-x-1/4 -z-10" />
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
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-slate-900 mb-4">Supporting diverse sectors</h2>
            <p className="text-slate-500 max-w-2xl mx-auto">We provide specialized infrastructure for organizations across the global economy.</p>
          </div>
          <div className="grid md:grid-cols-4 gap-8">
            {sectors.map((sector, idx) => (
              <motion.div
                key={idx}
                whileHover={{ y: -5 }}
                className="p-8 bg-slate-50 rounded-3xl border border-transparent hover:border-blue-100 hover:bg-white hover:shadow-xl transition-all"
              >
                <div className={`w-14 h-14 rounded-2xl flex items-center justify-center mb-6 bg-white shadow-sm text-blue-600`}>
                  <sector.icon size={28} />
                </div>
                <h3 className="text-xl font-bold text-slate-900 mb-3">{sector.name}</h3>
                <p className="text-slate-600 text-sm leading-relaxed">{sector.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Value Prop */}
      <section className="py-24 bg-slate-50 relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-slate-900 mb-4">Enterprise-ready features</h2>
            <p className="text-slate-500 max-w-2xl mx-auto">Everything you need to modernize your credential management lifecycle.</p>
          </div>
          <motion.div 
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="grid md:grid-cols-3 gap-x-12 gap-y-16"
          >
            {benefits.map((benefit, idx) => (
              <motion.div key={idx} variants={itemVariants} className="flex gap-6">
                <div className="w-12 h-12 rounded-xl bg-white shadow-sm flex-shrink-0 flex items-center justify-center text-blue-600 border border-slate-100">
                  <benefit.icon size={24} />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-slate-900 mb-3">{benefit.title}</h3>
                  <p className="text-slate-600 leading-relaxed">{benefit.desc}</p>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default ForInstitutions;
