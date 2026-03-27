import React from 'react'
import { Link } from 'react-router-dom'
import Navbar from '../../components/Navbar'
import Footer from '../../components/Footer'

function ForInstitutions() {
  return (
    <div className="min-h-screen bg-gray-50">
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
          <h2 className="text-3xl font-bold text-center mb-12">Who Can Issue Credentials?</h2>

          <div className="grid md:grid-cols-4 gap-6">
            <div className="bg-white p-6 rounded-lg shadow-md text-center">
              <div className="text-5xl mb-3">🎓</div>
              <h3 className="font-semibold text-lg">Universities</h3>
              <p className="text-gray-600 text-sm mt-2">Degrees, diplomas, certificates, transcripts</p>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-md text-center">
              <div className="text-5xl mb-3">🏢</div>
              <h3 className="font-semibold text-lg">Employers</h3>
              <p className="text-gray-600 text-sm mt-2">Employment letters, salary slips, experience certificates</p>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-md text-center">
              <div className="text-5xl mb-3">🏦</div>
              <h3 className="font-semibold text-lg">Banks</h3>
              <p className="text-gray-600 text-sm mt-2">Bank statements, loan documents, credit history</p>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-md text-center">
              <div className="text-5xl mb-3">🏥</div>
              <h3 className="font-semibold text-lg">Healthcare</h3>
              <p className="text-gray-600 text-sm mt-2">Medical records, vaccination certificates, prescriptions</p>
            </div>
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="bg-white py-16">
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

      {/* How to Get Started */}
      <section className="py-16">
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
  )
}

export default ForInstitutions
