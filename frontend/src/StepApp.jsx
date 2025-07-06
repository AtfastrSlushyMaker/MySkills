import { Routes, Route } from 'react-router-dom'
import Navigation from './components/Navigation'
import GlassmorphismBackground from './components/GlassmorphismBackground'
import HomePage from './pages/HomePage'
import LoginPage from './pages/LoginPage'
import SignUpPage from './pages/SignUpPage'
import DashboardPage from './pages/DashboardPage'
import CoursesPage from './pages/CoursesPage'
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

                {/* Main content area */}
                <main className="relative z-10 pt-20">
                    <Routes>
                        <Route path="/" element={<HomePage />} />
                        <Route path="/login" element={<LoginPage />} />
                        <Route path="/signup" element={<SignUpPage />} />
                        <Route path="/dashboard" element={<DashboardPage />} />
                        <Route path="/courses" element={<CoursesPage />} />
                        <Route path="*" element={
                            <div className="min-h-screen flex items-center justify-center pt-20">
                                <div className="text-center">
                                    <div className="text-8xl mb-8 animate-pulse">🔍</div>
                                    <h1 className="text-6xl font-bold text-white mb-4">404</h1>
                                    <p className="text-xl text-white/70">Page not found in the MySkills universe</p>
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
