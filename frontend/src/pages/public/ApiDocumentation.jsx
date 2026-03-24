import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import Navbar from '../../components/Navbar'
import Footer from '../../components/Footer'

function ApiDocumentation() {
  const [selectedEndpoint, setSelectedEndpoint] = useState('verify-degree')

  const endpoints = {
    'verify-degree': {
      method: 'POST',
      path: '/api/verify/degree',
      description: 'Verify educational credentials (degrees, diplomas, certificates)',
      request: `{
  "userId": "user-uuid-here",
  "credentialId": "credential-uuid-here",
  "consentToken": "optional-consent-token"
}`,
      response: `{
  "success": true,
  "verified": true,
  "credential": {
    "degree": "Bachelor of Science",
    "major": "Computer Science",
    "institution": "Massachusetts Institute of Technology",
    "graduationYear": 2024,
    "gpa": 3.85,
    "honors": "Magna Cum Laude",
    "issueDate": "2024-05-15",
    "blockchainHash": "0x7f8a9b2c3d4e5f6a7b8c9d0e1f2a3b4c",
    "blockchainVerified": true
  },
  "responseTime": "1.2s"
}`
    },
    'verify-income': {
      method: 'POST',
      path: '/api/verify/income',
      description: 'Verify income and employment credentials',
      request: `{
  "userId": "user-uuid-here",
  "credentialId": "credential-uuid-here"
}`,
      response: `{
  "success": true,
  "verified": true,
  "credential": {
    "employer": "Google Inc",
    "position": "Senior Software Engineer",
    "salary": 150000,
    "currency": "USD",
    "period": "annual",
    "employmentType": "full-time",
    "startDate": "2022-01-15",
    "issueDate": "2024-01-10",
    "blockchainVerified": true
  },
  "responseTime": "0.8s"
}`
    },
    'verify-medical': {
      method: 'POST',
      path: '/api/verify/medical',
      description: 'Verify medical records and vaccination certificates',
      request: `{
  "userId": "user-uuid-here",
  "credentialId": "credential-uuid-here",
  "recordType": "vaccination"
}`,
      response: `{
  "success": true,
  "verified": true,
  "credential": {
    "recordType": "vaccination",
    "vaccineName": "COVID-19 mRNA Vaccine",
    "doses": 2,
    "lastDoseDate": "2024-02-15",
    "issuingFacility": "City General Hospital",
    "physicianName": "Dr. Sarah Johnson",
    "blockchainVerified": true
  },
  "responseTime": "1.0s"
}`
    },
    'verify-employment': {
      method: 'POST',
      path: '/api/verify/employment',
      description: 'Verify employment history and experience',
      request: `{
  "userId": "user-uuid-here",
  "credentialId": "credential-uuid-here"
}`,
      response: `{
  "success": true,
  "verified": true,
  "credential": {
    "employer": "Microsoft Corporation",
    "position": "Software Developer",
    "department": "Azure Cloud Services",
    "employmentType": "full-time",
    "startDate": "2020-06-01",
    "endDate": "2022-01-10",
    "duration": "1 year 7 months",
    "blockchainVerified": true
  },
  "responseTime": "0.9s"
}`
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      {/* Hero Section */}
      <section className="bg-gradient-to-r from-primary-600 to-primary-800 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl font-bold mb-4">API Documentation</h1>
          <p className="text-xl text-primary-100">
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
                    ? 'bg-primary-600 text-white'
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
              <h3 className="text-xl font-semibold mb-4 text-primary-600">Verification APIs</h3>
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
              <h3 className="text-xl font-semibold mb-4 text-primary-600">Management APIs</h3>
              <ul className="space-y-3">
                <li className="flex items-center">
                  <span className="bg-blue-500 text-white px-2 py-1 rounded text-xs mr-3">GET</span>
                  <code className="text-sm">/api/verifier/reports</code>
                </li>
                <li className="flex items-center">
                  <span className="bg-green-500 text-white px-2 py-1 rounded text-xs mr-3">POST</span>
                  <code className="text-sm">/api/verifier/api-key</code>
                </li>
                <li className="flex items-center">
                  <span className="bg-blue-500 text-white px-2 py-1 rounded text-xs mr-3">GET</span>
                  <code className="text-sm">/api/verifier/usage</code>
                </li>
                <li className="flex items-center">
                  <span className="bg-green-500 text-white px-2 py-1 rounded text-xs mr-3">POST</span>
                  <code className="text-sm">/api/consent/request</code>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Error Codes */}
      <section className="bg-gray-100 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold mb-8">Response Codes</h2>

          <div className="bg-white rounded-lg shadow-md overflow-hidden">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Code</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Status</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Description</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                <tr>
                  <td className="px-6 py-4 text-sm font-mono">200</td>
                  <td className="px-6 py-4 text-sm font-semibold text-green-600">Success</td>
                  <td className="px-6 py-4 text-sm text-gray-600">Credential verified successfully</td>
                </tr>
                <tr>
                  <td className="px-6 py-4 text-sm font-mono">401</td>
                  <td className="px-6 py-4 text-sm font-semibold text-red-600">Unauthorized</td>
                  <td className="px-6 py-4 text-sm text-gray-600">Invalid or missing API key</td>
                </tr>
                <tr>
                  <td className="px-6 py-4 text-sm font-mono">403</td>
                  <td className="px-6 py-4 text-sm font-semibold text-red-600">Forbidden</td>
                  <td className="px-6 py-4 text-sm text-gray-600">User has not granted consent</td>
                </tr>
                <tr>
                  <td className="px-6 py-4 text-sm font-mono">404</td>
                  <td className="px-6 py-4 text-sm font-semibold text-orange-600">Not Found</td>
                  <td className="px-6 py-4 text-sm text-gray-600">Credential not found</td>
                </tr>
                <tr>
                  <td className="px-6 py-4 text-sm font-mono">429</td>
                  <td className="px-6 py-4 text-sm font-semibold text-orange-600">Rate Limit</td>
                  <td className="px-6 py-4 text-sm text-gray-600">Too many requests, try again later</td>
                </tr>
                <tr>
                  <td className="px-6 py-4 text-sm font-mono">500</td>
                  <td className="px-6 py-4 text-sm font-semibold text-red-600">Server Error</td>
                  <td className="px-6 py-4 text-sm text-gray-600">Internal server error</td>
                </tr>
              </tbody>
            </table>
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
      <section className="bg-primary-600 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold mb-4">Ready to Integrate?</h2>
          <p className="text-xl mb-8 text-primary-100">
            Get your API key and start verifying in minutes
          </p>
          <Link to="/register" className="px-8 py-3 bg-white text-primary-600 rounded-lg font-semibold hover:bg-gray-100 transition inline-block">
            Get API Key
          </Link>
        </div>
      </section>

      <Footer />
    </div>
  )
}

export default ApiDocumentation
