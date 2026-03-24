import React from 'react'
import { Link } from 'react-router-dom'

function Navbar() {
  return (
    <nav className="bg-white shadow-sm sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          {/* Logo */}
          <div className="flex items-center">
            <Link to="/" className="text-2xl font-bold text-primary-600 hover:text-primary-700">
              TrustVault
            </Link>
          </div>

          {/* Navigation Links */}
          <div className="hidden md:flex space-x-8">
            <Link to="/" className="text-gray-700 hover:text-primary-600 transition">
              Home
            </Link>
            <Link to="/how-it-works" className="text-gray-700 hover:text-primary-600 transition">
              How It Works
            </Link>
            <Link to="/for-institutions" className="text-gray-700 hover:text-primary-600 transition">
              For Institutions
            </Link>
            <Link to="/for-verifiers" className="text-gray-700 hover:text-primary-600 transition">
              For Verifiers
            </Link>
            <Link to="/api-docs" className="text-gray-700 hover:text-primary-600 transition">
              API Docs
            </Link>
            <Link to="/contact" className="text-gray-700 hover:text-primary-600 transition">
              Contact
            </Link>
          </div>

          {/* Action Buttons */}
          <div className="flex space-x-4">
            <Link to="/login" className="px-4 py-2 text-primary-600 hover:text-primary-700 transition">
              Login
            </Link>
            <Link to="/register" className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition">
              Get Started
            </Link>
          </div>
        </div>
      </div>
    </nav>
  )
}

export default Navbar
