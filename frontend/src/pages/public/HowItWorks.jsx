import React from 'react';
import { motion } from 'framer-motion';
import { GraduationCap, Wallet, ShieldCheck, ArrowRight, Server, Database, Globe } from 'lucide-react';
import Navbar from '../../components/Navbar';
import Footer from '../../components/Footer';

const StepCard = ({ number, title, description, items, icon: Icon, reverse }) => (
  <motion.div 
    initial={{ opacity: 0, y: 40 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true }}
    className={`flex flex-col ${reverse ? 'md:flex-row-reverse' : 'md:flex-row'} items-center gap-12 py-16`}
  >
    <div className="md:w-1/2">
      <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-blue-600 text-white font-bold text-lg mb-6 shadow-lg shadow-blue-200">
        {number}
      </div>
      <h2 className="text-3xl font-bold text-slate-900 mb-6">{title}</h2>
      <p className="text-lg text-slate-600 mb-8 leading-relaxed">
        {description}
      </p>
      <ul className="space-y-4">
        {items.map((item, idx) => (
          <li key={idx} className="flex items-start gap-3">
            <div className="mt-1 w-5 h-5 rounded-full bg-blue-50 flex items-center justify-center flex-shrink-0">
              <ShieldCheck size={14} className="text-blue-600" />
            </div>
            <span className="text-slate-700">{item}</span>
          </li>
        ))}
      </ul>
    </div>
    <div className="md:w-1/2 w-full">
      <div className="bg-white p-10 rounded-[2.5rem] shadow-xl border border-slate-100 relative group">
        <div className="absolute inset-0 bg-blue-600 opacity-0 group-hover:opacity-[0.02] transition-opacity rounded-[2.5rem]" />
        <div className="flex flex-col items-center text-center">
          <div className="w-20 h-20 bg-blue-50 rounded-2xl flex items-center justify-center text-blue-600 mb-6">
            <Icon size={40} />
          </div>
          <h3 className="text-xl font-bold text-slate-900 mb-4">Core Interaction</h3>
          <div className="w-full space-y-3">
            <div className="h-3 w-full bg-slate-100 rounded-full overflow-hidden">
               <motion.div 
                 initial={{ width: 0 }}
                 whileInView={{ width: '100%' }}
                 transition={{ duration: 1.5, delay: 0.5 }}
                 className="h-full bg-blue-500" 
               />
            </div>
            <div className="h-3 w-2/3 bg-slate-100 rounded-full mx-auto" />
          </div>
        </div>
      </div>
    </div>
  </motion.div>
);

const HowItWorks = () => {
  return (
    <div className="min-h-screen bg-[#FDFDFF]">
      <Navbar />

      {/* Hero */}
      <section className="pt-32 pb-20 bg-white border-b border-slate-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.h1 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-5xl font-extrabold text-slate-900 mb-6"
          >
            The Trust Protocol
          </motion.h1>
          <p className="text-xl text-slate-600 max-w-2xl mx-auto">
            Experience the new standard for credential issuance and verification powered by blockchain.
          </p>
        </div>
      </section>

      {/* Main Content */}
      <section className="py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <StepCard 
            number="1"
            icon={GraduationCap}
            title="Institutions Issue Credentials"
            description="Verified organizations like universities and employers sign and issue digital credentials directly to our network."
            items={[
              "Secure portal for verified issuers",
              "Blockchain-anchored hashing for immutability",
              "Instant delivery to user wallets",
              "Multi-layer authentication & signing"
            ]}
          />

          <StepCard 
            number="2"
            icon={Wallet}
            title="Users Control Their Identity"
            description="Your credentials belong to you. Store them in a secure digital wallet that only you can access and manage."
            reverse
            items={[
              "Private, encrypted storage",
              "Single-click sharing permissions",
              "Audit logs for all access attempts",
              "Zero-knowledge proof compatibility"
            ]}
          />

          <StepCard 
            number="3"
            icon={ShieldCheck}
            title="Marketplace Verification"
            description="Authorize third-party verifiers to check your credentials in milliseconds without manual paperwork."
            items={[
              "Instant confirmation via QR or Link",
              "Tamper-proof verification receipts",
              "Historical activity tracking",
              "API integration for enterprise"
            ]}
          />
        </div>
      </section>

      {/* Tech Breakdown */}
      <section className="py-24 bg-slate-900 text-white rounded-[4rem] mx-4 my-12 overflow-hidden relative">
        <div className="absolute top-0 right-0 w-1/3 h-full bg-blue-600/10 blur-[120px]" />
        <div className="max-w-7xl mx-auto px-8 lg:px-12 relative z-10">
          <div className="text-center mb-20">
            <h2 className="text-4xl font-bold mb-6">Built on Open Innovation</h2>
            <p className="text-slate-400 max-w-2xl mx-auto">
              We leverage modern infrastructure to ensure your data is always safe, accessible, and fast.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-12">
            {[
              { icon: Database, name: "Blockchain Ledger", desc: "Decentralized consensus for permanent records." },
              { icon: Server, name: "Edge API", desc: "Globally distributed verification nodes for <100ms latency." },
              { icon: Globe, name: "Public Keys", desc: "Cryptographic signatures for undeniable authenticity." }
            ].map((tech, idx) => (
              <div key={idx} className="text-center p-8 bg-white/5 border border-white/10 rounded-3xl backdrop-blur-sm">
                <div className="w-16 h-16 bg-blue-600/20 text-blue-400 rounded-full flex items-center justify-center mx-auto mb-6">
                  <tech.icon size={32} />
                </div>
                <h3 className="text-xl font-bold mb-3">{tech.name}</h3>
                <p className="text-slate-400">{tech.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default HowItWorks;
