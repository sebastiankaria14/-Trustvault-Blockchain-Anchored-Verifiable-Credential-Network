import React from 'react'
import { Link } from 'react-router-dom'
import Navbar from '../../components/Navbar'
import Footer from '../../components/Footer'

function HowItWorks() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      {/* Hero Section */}
      <section className="bg-gradient-to-r from-primary-700 to-primary-900 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl font-bold mb-4">How TrustVault Works</h1>
          <p className="text-xl text-slate-200">
            Three simple steps to secure, verified credentials
          </p>
        </div>
      </section>

      {/* Main Flow Section */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="space-y-16">
            {/* Step 1 */}
            <div className="flex flex-col md:flex-row items-center gap-8">
              <div className="md:w-1/2">
                <div className="bg-primary-800 text-white w-16 h-16 rounded-full flex items-center justify-center text-2xl font-bold mb-4">
                  1
                </div>
                <h2 className="text-3xl font-bold mb-4">Institutions Issue Credentials</h2>
                <p className="text-gray-600 text-lg mb-4">
                  Universities, employers, banks, and healthcare providers issue verified credentials directly through TrustVault.
                </p>
                <ul className="space-y-2 text-gray-700">
                  <li className="flex items-start">
                    <span className="text-primary-900 mr-2">✓</span>
                    Institution logs into their portal
                  </li>
                  <li className="flex items-start">
                    <span className="text-primary-900 mr-2">✓</span>
                    Fills credential details (degree, salary, medical record, etc.)
                  </li>
                  <li className="flex items-start">
                    <span className="text-primary-900 mr-2">✓</span>
                    System generates a unique hash and stores it on blockchain
                  </li>
                  <li className="flex items-start">
                    <span className="text-primary-900 mr-2">✓</span>
                    Credential appears instantly in user's wallet
                  </li>
                </ul>
              </div>
              <div className="md:w-1/2 bg-white p-8 rounded-lg shadow-lg">
                <div className="text-6xl mb-4 text-center">🎓</div>
                <h3 className="text-xl font-semibold text-center mb-2">Example: University</h3>
                <p className="text-gray-600 text-center">
                  MIT issues a Bachelor's degree to John Doe. The degree is hashed, stored on blockchain, and added to John's digital wallet.
                </p>
              </div>
            </div>

            {/* Step 2 */}
            <div className="flex flex-col md:flex-row-reverse items-center gap-8">
              <div className="md:w-1/2">
                <div className="bg-primary-800 text-white w-16 h-16 rounded-full flex items-center justify-center text-2xl font-bold mb-4">
                  2
                </div>
                <h2 className="text-3xl font-bold mb-4">You Store in Your Wallet</h2>
                <p className="text-gray-600 text-lg mb-4">
                  All your verified credentials live in one secure digital wallet that only you control.
                </p>
                <ul className="space-y-2 text-gray-700">
                  <li className="flex items-start">
                    <span className="text-primary-900 mr-2">✓</span>
                    View all your credentials in one place
                  </li>
                  <li className="flex items-start">
                    <span className="text-primary-900 mr-2">✓</span>
                    Organize by type (education, employment, financial, medical)
                  </li>
                  <li className="flex items-start">
                    <span className="text-primary-900 mr-2">✓</span>
                    Download or share credentials
                  </li>
                  <li className="flex items-start">
                    <span className="text-primary-900 mr-2">✓</span>
                    Control who can access your data
                  </li>
                </ul>
              </div>
              <div className="md:w-1/2 bg-white p-8 rounded-lg shadow-lg">
                <div className="text-6xl mb-4 text-center">👤</div>
                <h3 className="text-xl font-semibold text-center mb-2">Your Digital Wallet</h3>
                <p className="text-gray-600 text-center">
                  Access your credentials 24/7 from any device. Everything is encrypted and secure.
                </p>
              </div>
            </div>

            {/* Step 3 */}
            <div className="flex flex-col md:flex-row items-center gap-8">
              <div className="md:w-1/2">
                <div className="bg-primary-800 text-white w-16 h-16 rounded-full flex items-center justify-center text-2xl font-bold mb-4">
                  3
                </div>
                <h2 className="text-3xl font-bold mb-4">Organizations Verify Instantly</h2>
                <p className="text-gray-600 text-lg mb-4">
                  With your consent, any organization can verify your credentials in under 2 seconds through our API.
                </p>
                <ul className="space-y-2 text-gray-700">
                  <li className="flex items-start">
                    <span className="text-primary-900 mr-2">✓</span>
                    Verifier requests access to your credential
                  </li>
                  <li className="flex items-start">
                    <span className="text-primary-900 mr-2">✓</span>
                    You approve or deny the request
                  </li>
                  <li className="flex items-start">
                    <span className="text-primary-900 mr-2">✓</span>
                    Verifier gets instant confirmation via API
                  </li>
                  <li className="flex items-start">
                    <span className="text-primary-900 mr-2">✓</span>
                    Blockchain verification ensures authenticity
                  </li>
                </ul>
              </div>
              <div className="md:w-1/2 bg-white p-8 rounded-lg shadow-lg">
                <div className="text-6xl mb-4 text-center">✅</div>
                <h3 className="text-xl font-semibold text-center mb-2">Example: Employer</h3>
                <p className="text-gray-600 text-center">
                  Google verifies John's MIT degree in 1.5 seconds during job application. No documents needed!
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="bg-slate-50 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-center mb-12">Why This Changes Everything</h2>

          <div className="grid md:grid-cols-2 gap-8">
            {/* For Users */}
            <div className="bg-white p-6 rounded-lg shadow-md">
              <h3 className="text-xl font-semibold mb-4 text-primary-900">For You (Users)</h3>
              <ul className="space-y-3 text-gray-700">
                <li className="flex items-start">
                  <span className="text-green-500 mr-2">✓</span>
                  <span><strong>Upload once</strong> - Never upload the same document twice</span>
                </li>
                <li className="flex items-start">
                  <span className="text-green-500 mr-2">✓</span>
                  <span><strong>Instant sharing</strong> - Share credentials in seconds</span>
                </li>
                <li className="flex items-start">
                  <span className="text-green-500 mr-2">✓</span>
                  <span><strong>You control access</strong> - Decide who can verify what</span>
                </li>
                <li className="flex items-start">
                  <span className="text-green-500 mr-2">✓</span>
                  <span><strong>Tamper-proof</strong> - Blockchain-backed verification</span>
                </li>
              </ul>
            </div>

            {/* For Organizations */}
            <div className="bg-white p-6 rounded-lg shadow-md">
              <h3 className="text-xl font-semibold mb-4 text-primary-900">For Organizations</h3>
              <ul className="space-y-3 text-gray-700">
                <li className="flex items-start">
                  <span className="text-green-500 mr-2">✓</span>
                  <span><strong>Instant verification</strong> - Results in under 2 seconds</span>
                </li>
                <li className="flex items-start">
                  <span className="text-green-500 mr-2">✓</span>
                  <span><strong>Reduce fraud</strong> - Blockchain verification prevents fake credentials</span>
                </li>
                <li className="flex items-start">
                  <span className="text-green-500 mr-2">✓</span>
                  <span><strong>Save time & money</strong> - No manual verification needed</span>
                </li>
                <li className="flex items-start">
                  <span className="text-green-500 mr-2">✓</span>
                  <span><strong>Simple API</strong> - Integrate in minutes</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Technology Section */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-center mb-12">Built on Cutting-Edge Technology</h2>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="text-5xl mb-4">⛓️</div>
              <h3 className="text-xl font-semibold mb-2">Blockchain Security</h3>
              <p className="text-gray-600">
                Every credential hash is stored on Polygon blockchain, making it immutable and verifiable forever.
              </p>
            </div>

            <div className="text-center">
              <div className="text-5xl mb-4">🔐</div>
              <h3 className="text-xl font-semibold mb-2">End-to-End Encryption</h3>
              <p className="text-gray-600">
                Your data is encrypted at rest and in transit. We follow industry-standard security practices.
              </p>
            </div>

            <div className="text-center">
              <div className="text-5xl mb-4">⚡</div>
              <h3 className="text-xl font-semibold mb-2">Lightning Fast API</h3>
              <p className="text-gray-600">
                Our API responds in under 2 seconds, ensuring smooth user experience for all verifications.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-gradient-to-r from-primary-700 to-primary-900 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold mb-4">Ready to Get Started?</h2>
          <p className="text-xl mb-8 text-slate-200">
            Join the future of credential verification today.
          </p>
          <div className="flex justify-center space-x-4">
            <Link to="/register" className="px-8 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg font-semibold transition hover:-translate-y-0.5 hover:shadow-lg">
              Create Your Wallet
            </Link>
            <Link to="/contact" className="px-8 py-3 bg-white/10 text-white rounded-lg font-semibold transition hover:-translate-y-0.5 hover:bg-white/15 border border-white/20">
              Contact Us
            </Link>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  )
}

export default HowItWorks
