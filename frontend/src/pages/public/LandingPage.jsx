import React from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, CheckCircle2, Globe, Lock, Shield, Zap } from 'lucide-react';
import { Link } from 'react-router-dom';
import Navbar from '../../components/Navbar';
import Footer from '../../components/Footer';

const stats = [
  { value: '3', label: 'Secure roles', icon: Shield },
  { value: '2s', label: 'Verification target', icon: Zap },
  { value: '24/7', label: 'Platform access', icon: Globe },
];

const features = [
  {
    icon: Lock,
    title: 'Secure & immutable',
    description: 'Credential hashes stay verifiable and tamper-resistant through the same trust layer used across the platform.',
  },
  {
    icon: Zap,
    title: 'Instant verification',
    description: 'Fast flows for users, institutions, and verifiers without changing the visual language from page to page.',
  },
  {
    icon: CheckCircle2,
    title: 'Consent-driven sharing',
    description: 'Users stay in control while organizations request and receive only the data they are allowed to see.',
  },
];

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">
      <Navbar />

      <section className="relative overflow-hidden pt-32 pb-20">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,_rgba(30,64,175,0.18),_transparent_34%),radial-gradient(circle_at_bottom_right,_rgba(88,28,135,0.16),_transparent_28%)]" />
        <motion.div
          aria-hidden="true"
          className="absolute left-0 top-10 h-80 w-80 rounded-full bg-primary-900/15 blur-3xl"
          animate={{ x: [0, 20, 0], y: [0, -14, 0], scale: [1, 1.08, 1] }}
          transition={{ duration: 13, repeat: Infinity, ease: 'easeInOut' }}
        />
        <motion.div
          aria-hidden="true"
          className="absolute right-0 top-24 h-96 w-96 rounded-full bg-primary-800/12 blur-3xl"
          animate={{ x: [0, -18, 0], y: [0, 18, 0], scale: [1, 1.1, 1] }}
          transition={{ duration: 15, repeat: Infinity, ease: 'easeInOut' }}
        />

        <div className="relative z-10 mx-auto grid max-w-7xl items-center gap-12 px-4 sm:px-6 lg:grid-cols-[1.05fr_0.95fr] lg:px-8">
          <motion.div
            initial={{ opacity: 0, x: -28 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.55 }}
          >
            <div className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-slate-100 px-4 py-2 text-xs font-bold uppercase tracking-[0.22em] text-primary-900">
              <Shield size={14} /> TrustVault Platform
            </div>
            <h1 className="mt-6 max-w-3xl text-5xl font-black tracking-tight sm:text-6xl">
              Upload once. Verify everywhere. Instantly.
            </h1>
            <p className="mt-5 max-w-2xl text-lg leading-relaxed text-slate-600">
              A secure, modern credential platform for users, institutions, and verifiers. Same palette, same trust layer, cleaner motion.
            </p>

            <div className="mt-8 flex flex-col gap-4 sm:flex-row">
              <Link
                to="/register"
                className="inline-flex items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-blue-600 to-purple-600 px-8 py-4 text-white shadow-lg shadow-purple-200/60 transition-all hover:-translate-y-0.5 hover:shadow-2xl"
              >
                Create your account <ArrowRight size={18} />
              </Link>
              <Link
                to="/how-it-works"
                className="inline-flex items-center justify-center rounded-2xl border border-slate-200 bg-white px-8 py-4 font-semibold text-slate-700 transition-all hover:-translate-y-0.5 hover:border-purple-200 hover:bg-slate-50"
              >
                See how it works
              </Link>
            </div>

            <div className="mt-10 grid gap-4 sm:grid-cols-3">
              {stats.map((stat, index) => {
                const Icon = stat.icon;
                return (
                  <motion.div
                    key={stat.label}
                    initial={{ opacity: 0, y: 16 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.12 * index, duration: 0.4 }}
                    className="rounded-3xl border border-white/70 bg-white/90 p-5 shadow-[0_20px_50px_rgba(15,23,42,0.08)] backdrop-blur-xl"
                  >
                    <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-primary-900/10 text-primary-900">
                      <Icon size={20} />
                    </div>
                    <div className="mt-4 text-3xl font-black text-slate-900">{stat.value}</div>
                    <p className="mt-1 text-sm text-slate-500">{stat.label}</p>
                  </motion.div>
                );
              })}
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.96, x: 24 }}
            animate={{ opacity: 1, scale: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            className="rounded-[2.5rem] border border-white/70 bg-white/85 p-6 shadow-[0_30px_80px_rgba(15,23,42,0.12)] backdrop-blur-xl"
          >
            <div className="rounded-[2rem] bg-slate-900 p-6 text-white">
              <div className="flex items-center justify-between text-sm text-slate-400">
                <span className="font-mono uppercase tracking-[0.2em]">TrustVault console</span>
                <span className="rounded-full bg-white/10 px-3 py-1 text-[11px] font-semibold text-emerald-300">Live</span>
              </div>
              <div className="mt-6 space-y-4">
                <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
                  <div className="text-xs uppercase tracking-[0.2em] text-slate-400">Credential status</div>
                  <div className="mt-2 flex items-center justify-between gap-4">
                    <div>
                      <div className="text-lg font-bold">Verified</div>
                      <p className="text-sm text-slate-400">Issued by trusted institution</p>
                    </div>
                    <div className="rounded-full bg-emerald-400/15 px-3 py-1 text-xs font-bold text-emerald-300">Authentic</div>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
                    <div className="text-xs uppercase tracking-[0.2em] text-slate-400">Flow</div>
                    <div className="mt-2 text-xl font-black">Issue</div>
                  </div>
                  <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
                    <div className="text-xs uppercase tracking-[0.2em] text-slate-400">Flow</div>
                    <div className="mt-2 text-xl font-black">Verify</div>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      <section className="py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mx-auto mb-14 max-w-2xl text-center">
            <h2 className="text-3xl font-black tracking-tight sm:text-4xl">Why TrustVault?</h2>
            <p className="mt-4 text-slate-600">
              Modern credential infrastructure with a consistent visual system across the public pages and auth flows.
            </p>
          </div>

          <div className="grid gap-6 md:grid-cols-3">
            {features.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <motion.div
                  key={feature.title}
                  initial={{ opacity: 0, y: 18 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.08 * index, duration: 0.4 }}
                  className="rounded-[2rem] border border-slate-100 bg-white p-7 shadow-[0_20px_50px_rgba(15,23,42,0.08)] transition-transform hover:-translate-y-1"
                >
                  <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-primary-900/10 text-primary-900">
                    <Icon size={22} />
                  </div>
                  <h3 className="mt-5 text-xl font-bold">{feature.title}</h3>
                  <p className="mt-3 text-sm leading-relaxed text-slate-600">{feature.description}</p>
                </motion.div>
              );
            })}
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

      <section className="bg-white py-20">
        <div className="mx-auto grid max-w-7xl gap-8 px-4 sm:px-6 lg:grid-cols-3 lg:px-8">
          {[
            'Institutions issue trusted records',
            'Users keep full control of access',
            'Verifiers confirm authenticity fast',
          ].map((item, index) => (
            <motion.div
              key={item}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.08 * index, duration: 0.4 }}
              className="rounded-[2rem] border border-slate-100 bg-slate-50 p-6"
            >
              <div className="text-sm font-bold uppercase tracking-[0.22em] text-primary-900">Step {index + 1}</div>
              <h3 className="mt-3 text-xl font-bold text-slate-900">{item}</h3>
              <p className="mt-3 text-sm leading-relaxed text-slate-600">
                Built with the same palette and motion language used throughout the updated TrustVault experience.
              </p>
            </motion.div>
          ))}
        </div>
      </section>

      <section className="bg-slate-900 py-16 text-white">
        <div className="mx-auto max-w-7xl px-4 text-center sm:px-6 lg:px-8">
          <h2 className="text-3xl font-black tracking-tight sm:text-4xl">Ready to get started?</h2>
          <p className="mx-auto mt-4 max-w-2xl text-slate-300">
            Use the updated public experience, then sign in or register with the new motion-driven auth pages.
          </p>
          <div className="mt-8 flex flex-col justify-center gap-4 sm:flex-row">
              <Link to="/register" className="rounded-2xl bg-gradient-to-r from-blue-600 to-purple-600 px-8 py-4 font-semibold text-white transition-all hover:-translate-y-0.5 hover:shadow-lg">
              Create your wallet
            </Link>
            <Link to="/login" className="rounded-2xl border border-white/20 bg-white/5 px-8 py-4 font-semibold text-white transition-all hover:-translate-y-0.5 hover:bg-white/10">
              Sign in
            </Link>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}

export default LandingPage;
