import React from 'react'
import { Link } from 'react-router-dom'
import Navbar from '../../components/Navbar'
import Footer from '../../components/Footer'

function ForVerifiers() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      {/* Hero Section */}
      <section className="bg-gradient-to-r from-primary-600 to-primary-800 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl font-bold mb-4">TrustVault for Verifiers</h1>
          <p className="text-xl text-primary-100">
            Verify credentials in seconds, not days. Reduce fraud and streamline your hiring process.
          </p>
        </div>
      </section>

      {/* Who Uses It */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-center mb-12">Who Needs TrustVault?</h2>

          <div className="grid md:grid-cols-4 gap-6">
            <div className="bg-white p-6 rounded-lg shadow-md text-center hover:shadow-lg transition">
              <div className="text-5xl mb-3">💼</div>
              <h3 className="font-semibold text-lg mb-2">HR Departments</h3>
              <p className="text-gray-600 text-sm">Verify education and employment history during hiring</p>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-md text-center hover:shadow-lg transition">
              <div className="text-5xl mb-3">🏦</div>
              <h3 className="font-semibold text-lg mb-2">Financial Institutions</h3>
              <p className="text-gray-600 text-sm">Verify income and employment for loans and credit</p>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-md text-center hover:shadow-lg transition">
              <div className="text-5xl mb-3">🏠</div>
              <h3 className="font-semibold text-lg mb-2">Landlords</h3>
              <p className="text-gray-600 text-sm">Verify tenant income and employment instantly</p>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-md text-center hover:shadow-lg transition">
              <div className="text-5xl mb-3">🎓</div>
              <h3 className="font-semibold text-lg mb-2">Universities</h3>
              <p className="text-gray-600 text-sm">Verify prior education for admissions</p>
            </div>
          </div>
        </div>
      </section>

      {/* Benefits */}
      <section className="bg-primary-50 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-center mb-12">Benefits for Your Organization</h2>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="bg-white p-6 rounded-lg shadow-md">
              <div className="text-3xl mb-3">⚡</div>
              <h3 className="text-xl font-semibold mb-3">Instant Verification</h3>
              <p className="text-gray-600">
                Get verification results in under 2 seconds. No more waiting days or weeks for background checks.
              </p>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-md">
              <div className="text-3xl mb-3">💰</div>
              <h3 className="text-xl font-semibold mb-3">Reduce Costs</h3>
              <p className="text-gray-600">
                Automated verification costs pennies compared to traditional background check services.
              </p>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-md">
              <div className="text-3xl mb-3">🛡️</div>
              <h3 className="text-xl font-semibold mb-3">Eliminate Fraud</h3>
              <p className="text-gray-600">
                Blockchain verification ensures credentials are authentic. Fake documents become impossible.
              </p>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-md">
              <div className="text-3xl mb-3">📋</div>
              <h3 className="text-xl font-semibold mb-3">Complete Audit Trail</h3>
              <p className="text-gray-600">
                Every verification is logged with timestamps, user consent, and blockchain proof.
              </p>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-md">
              <div className="text-3xl mb-3">🔌</div>
              <h3 className="text-xl font-semibold mb-3">Simple Integration</h3>
              <p className="text-gray-600">
                RESTful API that integrates with your existing systems in minutes. SDKs and code examples provided.
              </p>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-md">
              <div className="text-3xl mb-3">✅</div>
              <h3 className="text-xl font-semibold mb-3">GDPR Compliant</h3>
              <p className="text-gray-600">
                Built-in consent management. Users control who accesses their data and for how long.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works for Verifiers */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-center mb-12">How Verification Works</h2>

          <div className="max-w-4xl mx-auto space-y-6">
            <div className="flex items-start space-x-4 bg-white p-6 rounded-lg shadow-md">
              <div className="bg-primary-600 text-white w-10 h-10 rounded-full flex items-center justify-center font-bold flex-shrink-0">1</div>
              <div>
                <h3 className="text-lg font-semibold mb-1">Request Verification</h3>
                <p className="text-gray-600">Send a verification request via our portal or API. Specify which credentials you need.</p>
              </div>
            </div>

            <div className="flex items-start space-x-4 bg-white p-6 rounded-lg shadow-md">
              <div className="bg-primary-600 text-white w-10 h-10 rounded-full flex items-center justify-center font-bold flex-shrink-0">2</div>
              <div>
                <h3 className="text-lg font-semibold mb-1">User Grants Consent</h3>
                <p className="text-gray-600">User receives notification and approves or denies your request. They control their data.</p>
              </div>
            </div>

            <div className="flex items-start space-x-4 bg-white p-6 rounded-lg shadow-md">
              <div className="bg-primary-600 text-white w-10 h-10 rounded-full flex items-center justify-center font-bold flex-shrink-0">3</div>
              <div>
                <h3 className="text-lg font-semibold mb-1">Get Instant Results</h3>
                <p className="text-gray-600">Receive verified credential data in JSON format. Blockchain hash confirmed automatically.</p>
              </div>
            </div>

            <div className="flex items-start space-x-4 bg-white p-6 rounded-lg shadow-md">
              <div className="bg-primary-600 text-white w-10 h-10 rounded-full flex items-center justify-center font-bold flex-shrink-0">4</div>
              <div>
                <h3 className="text-lg font-semibold mb-1">Make Decisions</h3>
                <p className="text-gray-600">Use verified data for hiring, loan approvals, admissions, or any other purpose.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* API Preview */}
      <section className="bg-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-center mb-8">Simple API Integration</h2>
          <p className="text-center text-gray-600 mb-12">
            Just one API call to verify any credential
          </p>

          <div className="max-w-3xl mx-auto bg-gray-900 rounded-lg p-6 text-white font-mono text-sm overflow-x-auto">
            <pre>{`// Example: Verify a degree
const response = await fetch('https://api.trustvault.com/v1/verify/degree', {
  method: 'POST',
  headers: {
    'Authorization': 'Bearer YOUR_API_KEY',
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    userId: 'user-uuid',
    credentialId: 'credential-uuid'
  })
});

const result = await response.json();
// {
//   "verified": true,
//   "credential": {
//     "degree": "Bachelor of Science",
//     "major": "Computer Science",
//     "institution": "MIT",
//     "graduationYear": 2024,
//     "blockchainVerified": true
//   },
//   "responseTime": "1.2s"
// }`}</pre>
          </div>

          <div className="text-center mt-8">
            <Link to="/api-docs" className="text-primary-600 hover:text-primary-700 font-semibold">
              View Full API Documentation →
            </Link>
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="bg-primary-600 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold mb-4">Start Verifying Today</h2>
          <p className="text-xl mb-8 text-primary-100">
            Get your API key and start verifying credentials in minutes
          </p>
          <Link to="/register" className="px-8 py-3 bg-white text-primary-600 rounded-lg font-semibold hover:bg-gray-100 transition inline-block">
            Register as Verifier
          </Link>
        </div>
      </section>

      <Footer />
    </div>
  )
}

export default ForVerifiers
