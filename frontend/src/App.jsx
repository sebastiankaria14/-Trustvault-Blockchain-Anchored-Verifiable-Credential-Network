import { useEffect } from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { AuthProvider } from './context/AuthContext'
import ProtectedRoute from './components/ProtectedRoute'
import { initializeAnimations } from './utils/animations'

// Public Pages
import LandingPage from './pages/public/LandingPage'
import HowItWorks from './pages/public/HowItWorks'
import ForInstitutions from './pages/public/ForInstitutions'
import ForVerifiers from './pages/public/ForVerifiers'
import ApiDocumentation from './pages/public/ApiDocumentation'
import Contact from './pages/public/Contact'

// Auth Pages
import LoginPage from './pages/auth/LoginPage'
import RegisterPage from './pages/auth/RegisterPage'

// User Portal
import UserDashboard from './pages/user/UserDashboard'
import WalletPage from './pages/user/WalletPage'
import CredentialDetailPage from './pages/user/CredentialDetailPage'
import ProfilePage from './pages/user/ProfilePage'
import AuditLogPage from './pages/user/AuditLogPage'
import UserReVerificationRequestsPage from './pages/user/UserReVerificationRequestsPage'

// Institution Portal
import InstitutionDashboard from './pages/institution/InstitutionDashboard'
import IssueCredentialPage from './pages/institution/IssueCredentialPage'
import ManageCredentialsPage from './pages/institution/ManageCredentialsPage'
import HistoryPage from './pages/institution/HistoryPage'

// Verifier Portal
import VerifierDashboard from './pages/verifier/VerifierDashboard'
import VerificationRequestsPage from './pages/verifier/VerificationRequestsPage'
import VerificationDetailPage from './pages/verifier/VerificationDetailPage'
import VerificationHistoryPage from './pages/verifier/VerificationHistoryPage'
import VerifierProfilePage from './pages/verifier/VerifierProfilePage'

// Admin Portal
import AdminDashboard from './pages/admin/AdminDashboard'
import AdminUsersPage from './pages/admin/AdminUsersPage'
import AdminInstitutionsPage from './pages/admin/AdminInstitutionsPage'
import AdminVerifiersPage from './pages/admin/AdminVerifiersPage'
import AdminBlockchainPage from './pages/admin/AdminBlockchainPage'
import AdminSettingsPage from './pages/admin/AdminSettingsPage'

function App() {
  useEffect(() => {
    // Initialize all animations on mount
    initializeAnimations()
  }, [])

  return (
    <Router future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
      <AuthProvider>
        <div className="min-h-screen bg-gray-50">
          <Routes>
            {/* Public Routes */}
            <Route path="/" element={<LandingPage />} />
            <Route path="/how-it-works" element={<HowItWorks />} />
            <Route path="/for-institutions" element={<ForInstitutions />} />
            <Route path="/for-verifiers" element={<ForVerifiers />} />
            <Route path="/api-docs" element={<ApiDocumentation />} />
            <Route path="/contact" element={<Contact />} />

            {/* Auth Routes */}
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />

            {/* User Portal Routes - Protected */}
            <Route
              path="/user/dashboard"
              element={
                <ProtectedRoute allowedUserTypes={['user']}>
                  <UserDashboard />
                </ProtectedRoute>
              }
            />
            <Route
              path="/user/wallet"
              element={
                <ProtectedRoute allowedUserTypes={['user']}>
                  <WalletPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/user/credentials/:id"
              element={
                <ProtectedRoute allowedUserTypes={['user']}>
                  <CredentialDetailPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/user/profile"
              element={
                <ProtectedRoute allowedUserTypes={['user']}>
                  <ProfilePage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/user/audit-log"
              element={
                <ProtectedRoute allowedUserTypes={['user']}>
                  <AuditLogPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/user/re-verification-requests"
              element={
                <ProtectedRoute allowedUserTypes={['user']}>
                  <UserReVerificationRequestsPage />
                </ProtectedRoute>
              }
            />

            {/* Institution Portal Routes - Protected */}
            <Route
              path="/institution/dashboard"
              element={
                <ProtectedRoute allowedUserTypes={['institution']}>
                  <InstitutionDashboard />
                </ProtectedRoute>
              }
            />
            <Route
              path="/institution/issue"
              element={
                <ProtectedRoute allowedUserTypes={['institution']}>
                  <IssueCredentialPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/institution/manage"
              element={
                <ProtectedRoute allowedUserTypes={['institution']}>
                  <ManageCredentialsPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/institution/history"
              element={
                <ProtectedRoute allowedUserTypes={['institution']}>
                  <HistoryPage />
                </ProtectedRoute>
              }
            />

            {/* Verifier Portal Routes - Protected */}
            <Route
              path="/verifier/dashboard"
              element={
                <ProtectedRoute allowedUserTypes={['verifier']}>
                  <VerifierDashboard />
                </ProtectedRoute>
              }
            />
            <Route
              path="/verifier/verification-requests"
              element={
                <ProtectedRoute allowedUserTypes={['verifier']}>
                  <VerificationRequestsPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/verifier/credential/:id"
              element={
                <ProtectedRoute allowedUserTypes={['verifier']}>
                  <VerificationDetailPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/verifier/history"
              element={
                <ProtectedRoute allowedUserTypes={['verifier']}>
                  <VerificationHistoryPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/verifier/profile"
              element={
                <ProtectedRoute allowedUserTypes={['verifier']}>
                  <VerifierProfilePage />
                </ProtectedRoute>
              }
            />

            {/* Admin Portal Routes - Protected */}
            <Route
              path="/admin/dashboard"
              element={
                <ProtectedRoute allowedUserTypes={['admin']}>
                  <AdminDashboard />
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin/users"
              element={
                <ProtectedRoute allowedUserTypes={['admin']}>
                  <AdminUsersPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin/institutions"
              element={
                <ProtectedRoute allowedUserTypes={['admin']}>
                  <AdminInstitutionsPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin/verifiers"
              element={
                <ProtectedRoute allowedUserTypes={['admin']}>
                  <AdminVerifiersPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin/blockchain"
              element={
                <ProtectedRoute allowedUserTypes={['admin']}>
                  <AdminBlockchainPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin/settings"
              element={
                <ProtectedRoute allowedUserTypes={['admin']}>
                  <AdminSettingsPage />
                </ProtectedRoute>
              }
            />
          </Routes>
        </div>
      </AuthProvider>
    </Router>
  )
}

export default App
