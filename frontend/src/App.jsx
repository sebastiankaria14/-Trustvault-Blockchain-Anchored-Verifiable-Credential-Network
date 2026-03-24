import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import LandingPage from './pages/public/LandingPage'
import HowItWorks from './pages/public/HowItWorks'
import ForInstitutions from './pages/public/ForInstitutions'
import ForVerifiers from './pages/public/ForVerifiers'
import ApiDocumentation from './pages/public/ApiDocumentation'
import Contact from './pages/public/Contact'

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-gray-50">
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<LandingPage />} />
          <Route path="/how-it-works" element={<HowItWorks />} />
          <Route path="/for-institutions" element={<ForInstitutions />} />
          <Route path="/for-verifiers" element={<ForVerifiers />} />
          <Route path="/api-docs" element={<ApiDocumentation />} />
          <Route path="/contact" element={<Contact />} />

          {/* User Portal Routes - Coming in Phase 3 */}
          {/* <Route path="/user/dashboard" element={<UserDashboard />} /> */}

          {/* Institution Portal Routes - Coming in Phase 4 */}
          {/* <Route path="/institution/dashboard" element={<InstitutionDashboard />} /> */}

          {/* Verifier Portal Routes - Coming in Phase 5 */}
          {/* <Route path="/verifier/dashboard" element={<VerifierDashboard />} /> */}

          {/* Admin Portal Routes - Coming in Phase 6 */}
          {/* <Route path="/admin/dashboard" element={<AdminDashboard />} /> */}
        </Routes>
      </div>
    </Router>
  )
}

export default App
