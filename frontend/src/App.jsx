import { Routes, Route } from 'react-router-dom'

// Import page components
import HomePage from './pages/HomePage'
import LoginPage from './pages/LoginPage'
import SignUpPage from './pages/SignUpPage'
import DashboardPage from './pages/DashboardPage'
import SessionsPage from './pages/SessionsPage'
import ProfilePage from './pages/ProfilePage'
import SettingsPage from './pages/SettingsPage'
import NotificationsPage from './pages/NotificationsPage'
import SessionDetailsPage from './pages/SessionDetailsPage'
import CategoriesPage from './pages/CategoriesPage'
import CategorySessionsPage from './pages/CategorySessionsPage'

// Import navigation component
import Navigation from './components/Navigation'
import GlassmorphismBackground from './components/GlassmorphismBackground'

// Import AuthProvider
import { AuthProvider } from './contexts/AuthContext'

// Import glassmorphism styles
import './styles/glassmorphism.css'

function App() {
  return (
    <AuthProvider>
      <div className="min-h-screen relative">
        {/* Glassmorphism background */}
        <GlassmorphismBackground />

        {/* Navigation will be visible on all pages */}
        <Navigation />

        {/* Main content area with proper spacing */}
        <main className="relative z-10">
          {/* Routes define which component to show for each URL */}
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/signup" element={<SignUpPage />} />
            <Route path="/dashboard" element={<DashboardPage />} />
            <Route path="/sessions" element={<SessionsPage />} />
            <Route path="/profile" element={<ProfilePage />} />
            <Route path="/settings" element={<SettingsPage />} />
            <Route path="/notifications" element={<NotificationsPage />} />
            <Route path="/sessions/:sessionId" element={<SessionDetailsPage />} />
            <Route path="/categories" element={<CategoriesPage />} />
            <Route path="/categories/:categoryId" element={<CategorySessionsPage />} />
            {/* 404 page for unknown routes */}
            <Route path="*" element={
              <div className="min-h-screen flex items-center justify-center">
                <div className="text-center text-white">
                  <h1 className="text-4xl font-bold mb-4">404 - Page Not Found</h1>
                  <p className="text-xl text-white/80">The page you're looking for doesn't exist.</p>
                </div>
              </div>
            } />
          </Routes>
        </main>
      </div>
    </AuthProvider>
  )
}

export default App
