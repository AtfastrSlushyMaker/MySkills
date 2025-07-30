import { Routes, Route, useNavigate, useLocation } from 'react-router-dom'
import { useEffect } from 'react'


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
import CourseContent from './components/CourseContent';
import ForgotPasswordPage from './pages/ForgotPasswordPage';
import ResetPasswordPage from './pages/ResetPasswordPage';


import Navigation from './components/Navigation'
import GlassmorphismBackground from './components/GlassmorphismBackground'


import { AuthProvider, useAuth } from './contexts/AuthContext'

import './styles/glassmorphism.css'
import AdminRoutes from './admin/AdminRoutes'

function ProtectedRoutes() {
  const { user, loading } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()

  useEffect(() => {
    const adminFrontOffice = localStorage.getItem('adminFrontOffice') === 'true';
    if (!loading && user?.role === 'admin' && !location.pathname.startsWith('/admin') && !adminFrontOffice) {
      navigate('/admin', { replace: true })
    }
    // Remove the flag if user navigates to admin
    if (location.pathname.startsWith('/admin') && adminFrontOffice) {
      localStorage.removeItem('adminFrontOffice');
    }
  }, [user, loading, location, navigate])

  return (
    <div className="min-h-screen relative">
      <GlassmorphismBackground />
      <Navigation />
      <main className="relative z-10">
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
          <Route path="/courses/:courseId" element={<CourseContent />} />
          <Route path="/categories" element={<CategoriesPage />} />
          <Route path="/categories/:categoryId" element={<CategorySessionsPage />} />
          <Route path="/forgot-password" element={<ForgotPasswordPage />} />
          <Route path="/reset-password" element={<ResetPasswordPage />} />

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
  )
}

function App() {
  return (
    <AuthProvider>
      <Routes>
        {/* Admin routes: no frontoffice navigation or background */}
        <Route path="/admin/*" element={<AdminRoutes />} />

        {/* Frontoffice: navigation and background */}
        <Route path="*" element={<ProtectedRoutes />} />
      </Routes>
    </AuthProvider>
  )
}

export default App