import { Routes, Route } from 'react-router-dom'
import ProfessionalNavigation from './components/ProfessionalNavigation'
import StunningHomePage from './pages/StunningHomePage'
import LoginPage from './pages/LoginPage'
import SignUpPage from './pages/SignUpPage'
import { AuthProvider } from './contexts/AuthContext'

function App() {
    return (
        <AuthProvider>
            <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
                {/* Navigation will be visible on all pages */}
                <ProfessionalNavigation />

                {/* Main content area */}
                <main className="pt-20">
                    <Routes>
                        <Route path="/" element={<StunningHomePage />} />
                        <Route path="/login" element={<LoginPage />} />
                        <Route path="/signup" element={<SignUpPage />} />
                        <Route path="/dashboard" element={
                            <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 py-12 pt-32">
                                <div className="max-w-7xl mx-auto px-6">
                                    <h1 className="text-4xl font-bold text-center mb-12 bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                                        📊 Dashboard
                                    </h1>
                                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                                        {['Total Courses', 'Active Students', 'Completion Rate'].map((title, index) => (
                                            <div key={index} className="p-8 rounded-2xl bg-white/5 backdrop-blur-lg border border-white/10 hover:bg-white/10 transition-all duration-300 hover:scale-105">
                                                <h3 className="text-xl font-semibold text-white mb-4">{title}</h3>
                                                <p className="text-3xl font-bold text-blue-400">
                                                    {index === 0 ? '24' : index === 1 ? '1,247' : '94%'}
                                                </p>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        } />
                        <Route path="/courses" element={
                            <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 py-12 pt-32">
                                <div className="max-w-7xl mx-auto px-6">
                                    <h1 className="text-4xl font-bold text-center mb-12 bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                                        📚 Courses
                                    </h1>
                                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                                        {['React Fundamentals', 'Advanced JavaScript', 'UI/UX Design', 'Node.js Backend', 'Database Design', 'DevOps Essentials'].map((course, index) => (
                                            <div key={index} className="p-6 rounded-2xl bg-white/5 backdrop-blur-lg border border-white/10 hover:bg-white/10 transition-all duration-300 hover:scale-105 group cursor-pointer">
                                                <div className="text-4xl mb-4 group-hover:animate-float">
                                                    {index % 3 === 0 ? '⚛️' : index % 3 === 1 ? '🚀' : '🎨'}
                                                </div>
                                                <h3 className="text-xl font-semibold text-white mb-2">{course}</h3>
                                                <p className="text-gray-400 mb-4">Professional training course</p>
                                                <div className="flex justify-between items-center">
                                                    <span className="text-blue-400 font-semibold">3 weeks</span>
                                                    <button className="px-4 py-2 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg text-white text-sm hover:shadow-lg transition-all duration-300">
                                                        Enroll
                                                    </button>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        } />
                        <Route path="*" element={
                            <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 pt-20">
                                <div className="text-center">
                                    <div className="text-8xl mb-8 animate-float">🔍</div>
                                    <h1 className="text-6xl font-bold text-white mb-4">404</h1>
                                    <p className="text-xl text-gray-400">Page not found in the MySkills universe</p>
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
