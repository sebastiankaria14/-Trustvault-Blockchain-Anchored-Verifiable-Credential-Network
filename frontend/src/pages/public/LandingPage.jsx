import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Shield, Zap, Globe, ArrowRight, CheckCircle, Lock, Layout } from 'lucide-react';
import Navbar from '../../components/Navbar';
import Footer from '../../components/Footer';

const LandingPage = () => {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1,
      transition: { staggerChildren: 0.1, delayChildren: 0.2 }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { y: 0, opacity: 1, transition: { duration: 0.5, ease: "easeOut" } }
  };

  const FeatureCard = ({ icon: Icon, title, description }) => (
    <motion.div 
      variants={itemVariants}
      whileHover={{ y: -5, transition: { duration: 0.2 } }}
      className="bg-white p-8 rounded-2xl shadow-sm border border-slate-100 hover:shadow-xl hover:border-blue-100 transition-all duration-300"
    >
      <div className="w-14 h-14 bg-blue-50 rounded-xl flex items-center justify-center text-blue-600 mb-6 group-hover:scale-110 transition-transform">
        <Icon size={28} />
      </div>
      <h3 className="text-xl font-bold text-slate-900 mb-4">{title}</h3>
      <p className="text-slate-600 leading-relaxed">{description}</p>
    </motion.div>
  );

  return (
    <div className="min-h-screen bg-[#FDFDFF]">
      <Navbar />

      {/* Hero Section */}
      <section className="relative pt-32 pb-24 overflow-hidden">
        <div className="absolute top-0 right-0 -translate-y-1/2 translate-x-1/4 w-[800px] h-[800px] bg-blue-50 rounded-full blur-3xl opacity-50 -z-10" />
        <div className="absolute bottom-0 left-0 translate-y-1/2 -translate-x-1/4 w-[600px] h-[600px] bg-indigo-50 rounded-full blur-3xl opacity-30 -z-10" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="text-center max-w-4xl mx-auto"
          >
            <span className="inline-flex items-center px-4 py-1.5 rounded-full text-sm font-medium bg-blue-50 text-blue-700 mb-8 border border-blue-100 shadow-sm">
              <span className="relative flex h-2 w-2 mr-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-blue-500"></span>
              </span>
              Next-Gen Credential Network 
            </span>
            <h1 className="text-6xl md:text-7xl font-extrabold tracking-tight text-slate-900 mb-8 leading-[1.1]">
              Upload once. Verify <span className="text-blue-600">everywhere.</span> Instantly.
            </h1>
            <p className="text-xl text-slate-600 mb-10 leading-relaxed max-w-2xl mx-auto">
              Secure, instant, and blockchain-anchored. The most trusted platform for managing and verifying digital credentials globally.
            </p>
            <div className="flex flex-col sm:flex-row justify-center items-center gap-4">
              <Link 
                to="/register" 
                className="group w-full sm:w-auto px-8 py-4 bg-blue-600 text-white rounded-xl font-bold hover:bg-blue-700 transition-all shadow-lg shadow-blue-200 flex items-center justify-center"
              >
                Get Started Free <ArrowRight className="ml-2 group-hover:translate-x-1 transition-transform" size={20} />
              </Link>
              <Link 
                to="/how-it-works" 
                className="w-full sm:w-auto px-8 py-4 bg-white text-slate-900 rounded-xl font-bold border border-slate-200 hover:border-blue-200 hover:bg-blue-50/30 transition-all flex items-center justify-center"
              >
                Explore Features
              </Link>
            </div>
            
            <div className="mt-16 pt-8 border-t border-slate-100 flex flex-wrap justify-center gap-x-12 gap-y-6 opacity-60">
              <span className="font-bold text-slate-500 text-lg uppercase tracking-wider">Trusted by</span>
              <div className="flex gap-8 items-center text-slate-400 font-bold">
                <span className="text-xl">EDUCORE</span>
                <span className="text-xl">FINTECH+</span>
                <span className="text-xl">GOVLINK</span>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-12 bg-white border-y border-slate-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {[
              { label: "Verified Claims", value: "2M+" },
              { label: "Trusted Partners", value: "500+" },
              { label: "Uptime", value: "99.9%" },
              { label: "Processing Speed", value: "<2s" }
            ].map((stat, idx) => (
              <div key={idx} className="text-center">
                <div className="text-3xl font-bold text-slate-900">{stat.value}</div>
                <div className="text-sm font-medium text-slate-500 uppercase tracking-wide">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-24 relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-20">
            <h2 className="text-4xl font-bold text-slate-900 mb-4">Powerful verification engine</h2>
            <p className="text-slate-600 max-w-2xl mx-auto text-lg">
              Everything you need to issue, manage, and verify digital credentials with mathematical certainty.
            </p>
          </div>

          <motion.div 
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            className="grid md:grid-cols-3 gap-8"
          >
            <FeatureCard 
              icon={Shield} 
              title="Immutable Security" 
              description="Each credential is crypographically hashed and anchored to the blockchain, ensuring it can never be altered or forged."
            />
            <FeatureCard 
              icon={Zap} 
              title="Real-time Engine" 
              description="Our optimized API delivers verification results in under 2 seconds, eliminating weeks of manual background checks."
            />
            <FeatureCard 
              icon={Globe} 
              title="Universal Standards" 
              description="Built on open standards to ensure your digital workforce credentials are recognized by employers and institutions globally."
            />
          </motion.div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-24 bg-slate-50 relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col lg:flex-row items-center gap-16">
            <div className="lg:w-1/2">
              <h2 className="text-4xl font-bold text-slate-900 mb-8">How it works</h2>
              <div className="space-y-8">
                {[
                  { title: "Institution Issues", desc: "Certified bodies issue credentials directly to the platform using our secure issuer portal.", icon: <Layout className="text-blue-600" /> },
                  { title: "Store Securely", desc: "Users receive credentials in their private digital wallet with full control over sharing.", icon: <Lock className="text-blue-600" /> },
                  { title: "Instant Verification", desc: "Verifiers access authenticated data instantly via QR codes or API requests.", icon: <CheckCircle className="text-blue-600" /> }
                ].map((step, idx) => (
                  <motion.div 
                    key={idx}
                    initial={{ x: -20, opacity: 0 }}
                    whileInView={{ x: 0, opacity: 1 }}
                    transition={{ delay: idx * 0.2 }}
                    className="flex gap-6"
                  >
                    <div className="flex-shrink-0 w-12 h-12 bg-white rounded-lg shadow-sm border border-slate-100 flex items-center justify-center font-bold text-lg">
                      {step.icon}
                    </div>
                    <div>
                      <h3 className="text-xl font-bold text-slate-900 mb-2">{step.title}</h3>
                      <p className="text-slate-600">{step.desc}</p>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
            <div className="lg:w-1/2 relative">
              <motion.div 
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                className="bg-white p-4 rounded-3xl shadow-2xl border border-slate-200 relative z-10"
              >
                <div className="bg-slate-900 rounded-2xl p-8 text-white">
                  <div className="flex justify-between items-center mb-12">
                     <div className="w-10 h-10 bg-blue-600 rounded-full" />
                     <div className="w-24 h-4 bg-slate-700 rounded-full" />
                  </div>
                  <div className="space-y-4 mb-8">
                     <div className="h-6 w-3/4 bg-slate-800 rounded-lg" />
                     <div className="h-6 w-1/2 bg-slate-800 rounded-lg" />
                  </div>
                  <div className="p-4 bg-blue-600/10 border border-blue-500/20 rounded-xl flex items-center gap-4">
                     <Shield className="text-blue-400" />
                     <div className="text-sm font-medium text-blue-100">Verification Hash Authenticated</div>
                  </div>
                </div>
              </motion.div>
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-blue-400 rounded-full blur-[100px] opacity-20" />
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div 
            whileInView={{ scale: [0.98, 1], opacity: [0, 1] }}
            className="bg-blue-600 rounded-[2.5rem] p-12 md:p-20 text-center text-white relative overflow-hidden"
          >
            <div className="absolute top-0 right-0 w-96 h-96 bg-white opacity-[0.05] rounded-full -translate-y-1/2 translate-x-1/2" />
            <h2 className="text-4xl md:text-5xl font-bold mb-6">Ready to secure the future?</h2>
            <p className="text-xl text-blue-100 mb-10 max-w-2xl mx-auto">
              Join the ecosystem of forward-thinking institutions and professionals using TrustVault.
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-4">
              <Link to="/register" className="px-10 py-4 bg-white text-blue-600 rounded-xl font-bold hover:bg-slate-50 transition-colors shadow-lg">
                Create Account
              </Link>
              <Link to="/contact" className="px-10 py-4 bg-blue-700 text-white rounded-xl font-bold hover:bg-blue-800 transition-colors border border-blue-500">
                Contact Sales
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default LandingPage;
