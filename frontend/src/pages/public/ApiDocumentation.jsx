import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Terminal, Code2, BookOpen, Key, Globe, Zap, Copy, Check, ChevronRight, CheckCircle2 } from 'lucide-react';
import Navbar from '../../components/Navbar';
import Footer from '../../components/Footer';

const ApiDocumentation = () => {
  const [selectedEndpoint, setSelectedEndpoint] = useState('verify-degree');
  const [copied, setCopied] = useState(false);

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const endpoints = {
    'verify-degree': {
      method: 'POST',
      url: '/v1/verify/educational',
      title: 'Verify Education',
      desc: 'Verify degrees, diplomas, and official academic certificates with blockchain proof.',
      request: `{
  "userId": "usr_928347",
  "credentialId": "cred_01HK9Z",
  "scope": ["major", "gpa", "institution"]
}`,
      response: `{
  "status": "success",
  "verified": true,
  "data": {
    "degree": "B.Sc. Computer Science",
    "institution": "Stanford University",
    "gpa": "3.92",
    "graduation": "2024-05-20"
  },
  "proof": "0x82f...a1d",
  "latency": "84ms"
}`
    },
    'verify-employment': {
      method: 'POST',
      url: '/v1/verify/employment',
      title: 'Verify Work History',
      desc: 'Authenticate past employment records and performance certificates instantly.',
      request: `{
  "userId": "usr_928347",
  "credentialId": "cred_02LM8X",
  "fields": ["position", "tenure"]
}`,
      response: `{
  "status": "success",
  "verified": true,
  "data": {
    "employer": "OpenAI",
    "position": "Research Scientist",
    "startDate": "2022-01-10",
    "endDate": "Present"
  },
  "proof": "0x3e1...b9c",
  "latency": "92ms"
}`
    }
  };

  return (
    <div className="min-h-screen bg-[#FDFDFF]">
      <Navbar />

      <section className="pt-32 pb-20 border-b border-slate-100 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex flex-col md:flex-row md:items-center justify-between gap-8"
          >
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-lg bg-blue-50 text-blue-600 text-sm font-bold mb-4">
                <Code2 size={16} /> API Reference v1.0
              </div>
              <h1 className="text-4xl font-extrabold text-slate-900 mb-4">Build with confidence</h1>
              <p className="text-lg text-slate-500 max-w-xl">
                Integrate TrustVault identity verification into your application with our high-performance REST API.
              </p>
            </div>
            <div className="flex gap-4">
               <button className="px-6 py-3 bg-slate-900 text-white rounded-xl font-bold flex items-center gap-2 hover:bg-slate-800 transition-all shadow-lg">
                 Get API Key <Key size={18} />
               </button>
               <button className="px-6 py-3 bg-white text-slate-900 border border-slate-200 rounded-xl font-bold flex items-center gap-2 hover:bg-slate-50 transition-all">
                 SDKs <ChevronRight size={18} />
               </button>
            </div>
          </motion.div>
        </div>
      </section>

      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col lg:flex-row gap-12">
            
            {/* Sidebar Navigation */}
            <aside className="lg:w-64 flex-shrink-0">
               <div className="sticky top-24 space-y-8">
                  <div>
                    <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-4 ml-2">Getting Started</h3>
                    <nav className="space-y-1">
                       <a href="#" className="flex items-center gap-3 px-4 py-2 bg-blue-50 text-blue-600 rounded-xl font-bold text-sm">
                         <BookOpen size={16} /> Authentication
                       </a>
                       <a href="#" className="flex items-center gap-3 px-4 py-2 text-slate-600 hover:bg-slate-100 rounded-xl font-medium text-sm transition-colors">
                         <Globe size={16} /> Base URL
                       </a>
                       <a href="#" className="flex items-center gap-3 px-4 py-2 text-slate-600 hover:bg-slate-100 rounded-xl font-medium text-sm transition-colors">
                         <Zap size={16} /> Rate Limits
                       </a>
                    </nav>
                  </div>

                  <div>
                    <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-4 ml-2">Endpoints</h3>
                    <nav className="space-y-1">
                       {Object.keys(endpoints).map(id => (
                         <button
                           key={id}
                           onClick={() => setSelectedEndpoint(id)}
                           className={`w-full text-left px-4 py-2 rounded-xl text-sm font-bold transition-all ${
                             selectedEndpoint === id ? 'bg-slate-900 text-white shadow-md' : 'text-slate-600 hover:bg-slate-100'
                           }`}
                         >
                           {endpoints[id].title}
                         </button>
                       ))}
                    </nav>
                  </div>
               </div>
            </aside>

            {/* Documentation Content */}
            <main className="flex-grow">
               <div className="bg-white rounded-[2.5rem] border border-slate-100 shadow-sm p-8 md:p-12">
                  <AnimatePresence mode="wait">
                    <motion.div
                      key={selectedEndpoint}
                      initial={{ opacity: 0, x: 10 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -10 }}
                      transition={{ duration: 0.2 }}
                    >
                      <div className="flex items-center gap-4 mb-6">
                        <span className="px-3 py-1 bg-green-500 text-white rounded-lg text-xs font-black uppercase">
                          {endpoints[selectedEndpoint].method}
                        </span>
                        <code className="text-lg font-mono text-slate-800 font-bold">
                          {endpoints[selectedEndpoint].url}
                        </code>
                      </div>

                      <h2 className="text-3xl font-bold text-slate-900 mb-4">{endpoints[selectedEndpoint].title}</h2>
                      <p className="text-slate-600 text-lg mb-10 leading-relaxed">
                        {endpoints[selectedEndpoint].desc}
                      </p>

                      <div className="grid lg:grid-cols-2 gap-8">
                        {/* Request Box */}
                        <div>
                          <div className="flex items-center justify-between mb-4 ml-1">
                            <span className="text-sm font-bold text-slate-900 flex items-center gap-2">
                              <Terminal size={14} /> Request Body
                            </span>
                          </div>
                          <div className="relative group">
                             <pre className="bg-slate-900 rounded-2xl p-6 text-blue-300 font-mono text-sm overflow-x-auto border border-white/5">
                               {endpoints[selectedEndpoint].request}
                             </pre>
                             <button 
                               onClick={() => copyToClipboard(endpoints[selectedEndpoint].request)}
                               className="absolute top-4 right-4 p-2 bg-white/10 hover:bg-white/20 text-white rounded-lg opacity-0 group-hover:opacity-100 transition-all"
                             >
                               {copied ? <Check size={16} className="text-green-400" /> : <Copy size={16} />}
                             </button>
                          </div>
                        </div>

                        {/* Response Box */}
                        <div>
                          <div className="flex items-center justify-between mb-4 ml-1">
                            <span className="text-sm font-bold text-slate-900 flex items-center gap-2">
                              <CheckCircle2 size={14} className="text-green-600" /> Response (200 OK)
                            </span>
                          </div>
                          <pre className="bg-slate-900 rounded-2xl p-6 text-emerald-400 font-mono text-sm overflow-x-auto border border-white/5">
                            {endpoints[selectedEndpoint].response}
                          </pre>
                        </div>
                      </div>
                    </motion.div>
                  </AnimatePresence>
               </div>
            </main>

          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default ApiDocumentation;
