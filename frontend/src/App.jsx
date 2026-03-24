import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { AuthProvider } from './context/AuthContext'
import ProtectedRoute from './components/ProtectedRoute'

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

// Institution Portal
import InstitutionDashboard from './pages/institution/InstitutionDashboard'

// Verifier Portal
import VerifierDashboard from './pages/verifier/VerifierDashboard'

function App() {
  return (
    <Router>
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

            {/* Institution Portal Routes - Protected */}
            <Route
              path="/institution/dashboard"
              element={
                <ProtectedRoute allowedUserTypes={['institution']}>
                  <InstitutionDashboard />
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

            {/* Admin Portal Routes - Coming in Phase 6 */}
            {/* <Route path="/admin/dashboard" element={<AdminDashboard />} /> */}
          </Routes>
        </div>
      </AuthProvider>
    </Router>
  )
}

export default App
