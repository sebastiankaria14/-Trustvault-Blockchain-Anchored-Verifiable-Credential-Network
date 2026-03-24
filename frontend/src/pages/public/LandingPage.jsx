import React from 'react'
import { Link } from 'react-router-dom'
import Navbar from '../../components/Navbar'
import Footer from '../../components/Footer'

function LandingPage() {
  return (
    <div className="min-h-screen">
      <Navbar />

      {/* Hero Section */}
      <section className="bg-gradient-to-r from-primary-600 to-primary-800 text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-5xl font-bold mb-6">
            Upload once. Verify everywhere. Instantly.
          </h1>
          <p className="text-xl mb-8 text-primary-100">
            The future of credential verification. Secure, instant, and blockchain-powered.
          </p>
          <div className="flex justify-center space-x-4">
            <Link to="/register" className="px-8 py-3 bg-white text-primary-600 rounded-lg font-semibold hover:bg-gray-100 transition">
              Get Your Wallet
            </Link>
            <Link to="/how-it-works" className="px-8 py-3 bg-primary-700 text-white rounded-lg font-semibold hover:bg-primary-800 transition border border-white">
              See How It Works
            </Link>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-center mb-12">Why TrustVault?</h2>

          <div className="grid md:grid-cols-3 gap-8">
            {/* Feature 1 */}
            <div className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition">
              <div className="text-4xl mb-4">🔒</div>
              <h3 className="text-xl font-semibold mb-3">Secure & Immutable</h3>
              <p className="text-gray-600">
                All credentials are hashed and stored on blockchain, making them tamper-proof and verifiable forever.
              </p>
            </div>

            {/* Feature 2 */}
            <div className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition">
              <div className="text-4xl mb-4">⚡</div>
              <h3 className="text-xl font-semibold mb-3">Instant Verification</h3>
              <p className="text-gray-600">
                Verify any credential in under 2 seconds through our API. No more waiting days for manual verification.
              </p>
            </div>

            {/* Feature 3 */}
            <div className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition">
              <div className="text-4xl mb-4">🌐</div>
              <h3 className="text-xl font-semibold mb-3">Universal Access</h3>
              <p className="text-gray-600">
                Upload once, share everywhere. Your credentials work across education, employment, and financial sectors.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="bg-gray-100 py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-center mb-12">How It Works</h2>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="bg-primary-600 text-white w-16 h-16 rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-4">1</div>
              <h3 className="text-xl font-semibold mb-3">Institutions Issue</h3>
              <p className="text-gray-600">
                Universities, employers, and banks issue verified credentials directly to your wallet.
              </p>
            </div>

            <div className="text-center">
              <div className="bg-primary-600 text-white w-16 h-16 rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-4">2</div>
              <h3 className="text-xl font-semibold mb-3">You Store Safely</h3>
              <p className="text-gray-600">
                All your credentials live in one secure digital wallet. Access them anytime, anywhere.
              </p>
            </div>

            <div className="text-center">
              <div className="bg-primary-600 text-white w-16 h-16 rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-4">3</div>
              <h3 className="text-xl font-semibold mb-3">Organizations Verify</h3>
              <p className="text-gray-600">
                With your consent, anyone can verify your credentials instantly through our API.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-primary-600 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold mb-4">Ready to get started?</h2>
          <p className="text-xl mb-8 text-primary-100">
            Join thousands of users who trust TrustVault for their credential verification needs.
          </p>
          <Link to="/register" className="px-8 py-3 bg-white text-primary-600 rounded-lg font-semibold hover:bg-gray-100 transition inline-block">
            Create Your Wallet Now
          </Link>
        </div>
      </section>

      <Footer />
    </div>
  )
}

export default LandingPage
