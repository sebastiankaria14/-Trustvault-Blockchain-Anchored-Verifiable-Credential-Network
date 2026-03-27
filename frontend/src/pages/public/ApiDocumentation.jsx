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

      {/* Hero Section */}
      <section className="bg-gradient-to-r from-primary-700 to-primary-900 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl font-bold mb-4">API Documentation</h1>
          <p className="text-xl text-slate-200">
            Simple, powerful APIs for instant credential verification
          </p>
        </div>
      </section>

      {/* Getting Started */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold mb-8">Getting Started</h2>

          <div className="bg-white rounded-lg shadow-md p-8 mb-8">
            <h3 className="text-xl font-semibold mb-4">Authentication</h3>
            <p className="text-gray-600 mb-4">
              All API requests require authentication using an API key. Include your API key in the Authorization header:
            </p>
            <div className="bg-gray-900 text-white p-4 rounded font-mono text-sm">
              Authorization: Bearer YOUR_API_KEY
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-md p-8">
            <h3 className="text-xl font-semibold mb-4">Base URL</h3>
            <div className="bg-gray-900 text-white p-4 rounded font-mono text-sm">
              https://api.trustvault.com/v1
            </div>
            <p className="text-gray-600 mt-4">
              <strong>Rate Limit:</strong> 1000 requests per hour (upgradeable)
            </p>
          </div>
        </div>
      </section>

      {/* API Endpoints */}
      <section className="bg-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold mb-8">API Endpoints</h2>

          {/* Endpoint Tabs */}
          <div className="flex flex-wrap gap-2 mb-8">
            {Object.keys(endpoints).map((key) => (
              <button
                key={key}
                onClick={() => setSelectedEndpoint(key)}
                className={`px-4 py-2 rounded-lg font-semibold transition ${
                  selectedEndpoint === key
                    ? 'bg-primary-800 text-white'
                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                }`}
              >
                {endpoints[key].path.split('/').pop()}
              </button>
            ))}
          </div>

          {/* Selected Endpoint Details */}
          <div className="bg-gray-50 rounded-lg p-8">
            <div className="flex items-center space-x-4 mb-6">
              <span className="bg-green-500 text-white px-3 py-1 rounded font-semibold text-sm">
                {endpoints[selectedEndpoint].method}
              </span>
              <code className="text-lg font-mono">{endpoints[selectedEndpoint].path}</code>
            </div>

            <p className="text-gray-700 mb-6">{endpoints[selectedEndpoint].description}</p>

            <div className="grid md:grid-cols-2 gap-6">
              {/* Request */}
              <div>
                <h4 className="font-semibold mb-3 text-gray-700">Request Body</h4>
                <div className="bg-gray-900 text-white p-4 rounded font-mono text-sm overflow-x-auto">
                  <pre>{endpoints[selectedEndpoint].request}</pre>
                </div>
              </div>

              {/* Response */}
              <div>
                <h4 className="font-semibold mb-3 text-gray-700">Response</h4>
                <div className="bg-gray-900 text-white p-4 rounded font-mono text-sm overflow-x-auto">
                  <pre>{endpoints[selectedEndpoint].response}</pre>
                </div>
              </div>
              <h1 className="text-4xl font-extrabold text-slate-900 mb-4">Build with confidence</h1>
              <p className="text-lg text-slate-500 max-w-xl">
                Integrate TrustVault identity verification into your application with our high-performance REST API.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* All Endpoints List */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold mb-8">All Available Endpoints</h2>

          <div className="grid md:grid-cols-2 gap-6">
            {/* Verification Endpoints */}
            <div className="bg-white p-6 rounded-lg shadow-md">
              <h3 className="text-xl font-semibold mb-4 text-primary-900">Verification APIs</h3>
              <ul className="space-y-3">
                <li className="flex items-center">
                  <span className="bg-green-500 text-white px-2 py-1 rounded text-xs mr-3">POST</span>
                  <code className="text-sm">/api/verify/degree</code>
                </li>
                <li className="flex items-center">
                  <span className="bg-green-500 text-white px-2 py-1 rounded text-xs mr-3">POST</span>
                  <code className="text-sm">/api/verify/income</code>
                </li>
                <li className="flex items-center">
                  <span className="bg-green-500 text-white px-2 py-1 rounded text-xs mr-3">POST</span>
                  <code className="text-sm">/api/verify/employment</code>
                </li>
                <li className="flex items-center">
                  <span className="bg-green-500 text-white px-2 py-1 rounded text-xs mr-3">POST</span>
                  <code className="text-sm">/api/verify/medical</code>
                </li>
              </ul>
            </div>

            {/* Management Endpoints */}
            <div className="bg-white p-6 rounded-lg shadow-md">
              <h3 className="text-xl font-semibold mb-4 text-primary-900">Management APIs</h3>
              <ul className="space-y-3">
                <li className="flex items-center">
                  <span className="bg-primary-800 text-white px-2 py-1 rounded text-xs mr-3">GET</span>
                  <code className="text-sm">/api/verifier/reports</code>
                </li>
                <li className="flex items-center">
                  <span className="bg-green-500 text-white px-2 py-1 rounded text-xs mr-3">POST</span>
                  <code className="text-sm">/api/verifier/api-key</code>
                </li>
                <li className="flex items-center">
                  <span className="bg-primary-800 text-white px-2 py-1 rounded text-xs mr-3">GET</span>
                  <code className="text-sm">/api/verifier/usage</code>
                </li>
                <li className="flex items-center">
                  <span className="bg-green-500 text-white px-2 py-1 rounded text-xs mr-3">POST</span>
                  <code className="text-sm">/api/consent/request</code>
                </li>
              </ul>
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

      {/* SDKs and Libraries */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-center mb-12">Client Libraries</h2>

          <div className="grid md:grid-cols-3 gap-6">
            <div className="bg-white p-6 rounded-lg shadow-md text-center">
              <div className="text-4xl mb-3">📦</div>
              <h3 className="text-lg font-semibold mb-2">JavaScript/Node.js</h3>
              <code className="text-sm text-gray-600">npm install trustvault-sdk</code>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-md text-center">
              <div className="text-4xl mb-3">🐍</div>
              <h3 className="text-lg font-semibold mb-2">Python</h3>
              <code className="text-sm text-gray-600">pip install trustvault</code>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-md text-center">
              <div className="text-4xl mb-3">☕</div>
              <h3 className="text-lg font-semibold mb-2">Java</h3>
              <code className="text-sm text-gray-600">Maven/Gradle available</code>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="bg-gradient-to-r from-primary-700 to-primary-900 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold mb-4">Ready to Integrate?</h2>
          <p className="text-xl mb-8 text-slate-200">
            Get your API key and start verifying in minutes
          </p>
          <Link to="/register" className="px-8 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg font-semibold transition hover:-translate-y-0.5 hover:shadow-lg inline-block">
            Get API Key
          </Link>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default ApiDocumentation;
