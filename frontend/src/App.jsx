import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import LandingPage from './pages/public/LandingPage'

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-gray-50">
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<LandingPage />} />

          {/* More routes will be added here */}
        </Routes>
      </div>
    </Router>
  )
}

export default App
