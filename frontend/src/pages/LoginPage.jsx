import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'

function LoginPage() {
    const { login } = useAuth()
    const navigate = useNavigate()

    // State management - this is where React stores the form data
    const [formData, setFormData] = useState({
        email: '',
        password: ''
    })
    const [errors, setErrors] = useState({})
    const [isLoading, setIsLoading] = useState(false)
    const [apiError, setApiError] = useState('')
    const [rememberMe, setRememberMe] = useState(false)

    // Handle input changes - this updates state when user types
    const handleChange = (e) => {
        const { name, value } = e.target
        setFormData(prev => ({
            ...prev,
            [name]: value
        }))
        // Clear error when user starts typing
        if (errors[name]) {
            setErrors(prev => ({
                ...prev,
                [name]: ''
            }))
        }
    }

    const handleCheckboxChange = (e) => {
        setRememberMe(e.target.checked)
    }

    // Form validation - check if inputs are valid
    const validateForm = () => {
        const newErrors = {}

        if (!formData.email) {
            newErrors.email = 'Email is required'
        } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
            newErrors.email = 'Email is invalid'
        }

        if (!formData.password) {
            newErrors.password = 'Password is required'
        } else if (formData.password.length < 6) {
            newErrors.password = 'Password must be at least 6 characters'
        }

        setErrors(newErrors)
        return Object.keys(newErrors).length === 0
    }

    // Handle form submission
    const handleSubmit = async (e) => {
        e.preventDefault()

        if (!validateForm()) return

        setIsLoading(true)
        setApiError('')

        // Use the auth context to login
        const result = await login(formData.email, formData.password, rememberMe)

        if (result.success) {
            // Redirect to dashboard on successful login
            navigate('/dashboard')
        } else {
            setApiError(result.message)
            setIsLoading(false)
        }
    }

    return (
        <div className="min-h-screen relative flex items-center justify-center">
            <div className="relative z-10 max-w-md w-full mx-4">
                {/* Login Card - Enhanced Glassmorphism */}
                <div className="bg-white/10 backdrop-blur-2xl rounded-3xl p-8 border border-white/20 shadow-2xl relative overflow-hidden">
                    {/* Animated background elements */}
                    <div className="absolute top-0 left-0 w-24 h-24 bg-purple-400/20 rounded-full blur-3xl animate-pulse"></div>
                    <div className="absolute bottom-0 right-0 w-32 h-32 bg-blue-400/20 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '2s' }}></div>

                    <div className="relative z-10">
                        {/* Header */}
                        <div className="text-center mb-8">
                            <div className="w-16 h-16 bg-gradient-to-br from-purple-400 to-blue-500 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-2xl border border-white/30">
                                <span className="text-2xl">🎓</span>
                            </div>
                            <h1 className="text-4xl font-bold text-white mb-2 drop-shadow-lg bg-gradient-to-r from-white to-blue-100 bg-clip-text text-transparent">
                                Welcome Back
                            </h1>
                            <p className="text-white/80 drop-shadow-sm">Continue your learning journey</p>
                        </div>

                        {/* Login Form */}
                        <form onSubmit={handleSubmit} className="space-y-6">
                            {/* API Error Display */}
                            {apiError && (
                                <div className="p-4 rounded-2xl bg-red-500/20 backdrop-blur-md border border-red-300/30 text-red-200 text-sm">
                                    <span className="mr-2">⚠️</span>
                                    {apiError}
                                </div>
                            )}

                            {/* Email Field */}
                            <div>
                                <label htmlFor="email" className="block text-white/90 text-sm font-medium mb-2 drop-shadow-sm">
                                    Email Address
                                </label>
                                <div className="relative">
                                    <input
                                        type="email"
                                        id="email"
                                        name="email"
                                        value={formData.email}
                                        onChange={handleChange}
                                        placeholder="Enter your educational email"
                                        className={`w-full bg-white/10 backdrop-blur-md rounded-2xl px-4 py-3 text-white placeholder-white/60 border transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-white/20 ${errors.email
                                            ? 'border-red-300/50 focus:border-red-300/70'
                                            : 'border-white/20 focus:border-white/40'
                                            }`}
                                        required
                                    />
                                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent opacity-0 hover:opacity-100 transition-opacity duration-300 rounded-2xl pointer-events-none"></div>
                                    <div className="absolute inset-y-0 right-0 pr-3 flex items-center">
                                        <span className="text-white/60">📧</span>
                                    </div>
                                </div>
                                {errors.email && (
                                    <p className="mt-2 text-sm text-red-300 flex items-center drop-shadow-sm">
                                        <span className="mr-1">⚠️</span>
                                        {errors.email}
                                    </p>
                                )}
                            </div>

                            {/* Password Field */}
                            <div>
                                <label htmlFor="password" className="block text-white/90 text-sm font-medium mb-2 drop-shadow-sm">
                                    Password
                                </label>
                                <div className="relative">
                                    <input
                                        type="password"
                                        id="password"
                                        name="password"
                                        value={formData.password}
                                        onChange={handleChange}
                                        placeholder="Enter your secure password"
                                        className={`w-full bg-white/10 backdrop-blur-md rounded-2xl px-4 py-3 text-white placeholder-white/60 border transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-white/20 ${errors.password
                                            ? 'border-red-300/50 focus:border-red-300/70'
                                            : 'border-white/20 focus:border-white/40'
                                            }`}
                                        required
                                    />
                                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent opacity-0 hover:opacity-100 transition-opacity duration-300 rounded-2xl pointer-events-none"></div>
                                    <div className="absolute inset-y-0 right-0 pr-3 flex items-center">
                                        <span className="text-white/60">🔒</span>
                                    </div>
                                </div>
                                {errors.password && (
                                    <p className="mt-2 text-sm text-red-300 flex items-center drop-shadow-sm">
                                        <span className="mr-1">⚠️</span>
                                        {errors.password}
                                    </p>
                                )}
                            </div>

                            {/* Remember Me & Forgot Password */}
                            <div className="flex items-center justify-between">
                                <label className="flex items-center">
                                    <input
                                        type="checkbox"
                                        className="w-4 h-4 bg-white/10 border border-white/30 rounded text-purple-400 focus:ring-purple-400 focus:ring-2"
                                        checked={rememberMe}
                                        onChange={handleCheckboxChange}
                                    />
                                    <span className="ml-2 text-white/80 text-sm">Remember me</span>
                                </label>
                                <Link to="/forgot-password" className="text-purple-300 hover:text-purple-200 text-sm transition-colors duration-300 drop-shadow-sm">
                                    Forgot password?
                                </Link>
                            </div>

                            {/* Login Button */}
                            <button
                                type="submit"
                                disabled={isLoading}
                                className="w-full bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600 disabled:from-gray-500 disabled:to-gray-600 backdrop-blur-xl px-6 py-4 rounded-2xl text-white font-bold border border-white/30 hover:border-white/50 transition-all duration-500 shadow-xl hover:shadow-2xl hover:scale-105 disabled:hover:scale-100 disabled:cursor-not-allowed"
                            >
                                {isLoading ? (
                                    <span className="flex items-center justify-center space-x-2">
                                        <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                                        <span>Signing in...</span>
                                    </span>
                                ) : (
                                    <span className="flex items-center justify-center space-x-2">
                                        <span>Continue Learning</span>
                                        <span className="text-lg">🎓</span>
                                    </span>
                                )}
                            </button>
                        </form>

                        {/* Sign Up Link */}
                        <div className="mt-6 text-center">
                            <p className="text-white/80 text-sm">
                                New to MySkills?{' '}
                                <Link to="/signup" className="text-purple-300 hover:text-purple-200 font-medium transition-colors duration-300 drop-shadow-sm">
                                    Start your learning journey
                                </Link>
                            </p>
                        </div>

                        {/* Educational Platform Features */}
                        <div className="mt-8">
                            <div className="relative">
                                <div className="absolute inset-0 flex items-center">
                                    <div className="w-full border-t border-white/20"></div>
                                </div>
                                <div className="relative flex justify-center text-sm">
                                    <span className="px-4 bg-transparent text-white/60">What you'll access</span>
                                </div>
                            </div>

                            <div className="mt-6 grid grid-cols-3 gap-3">
                                <div className="bg-white/10 hover:bg-white/20 backdrop-blur-md px-3 py-2 rounded-2xl border border-white/20 hover:border-white/40 transition-all duration-300 text-center">
                                    <div className="text-lg mb-1">📚</div>
                                    <span className="text-xs text-white/80">Courses</span>
                                </div>
                                <div className="bg-white/10 hover:bg-white/20 backdrop-blur-md px-3 py-2 rounded-2xl border border-white/20 hover:border-white/40 transition-all duration-300 text-center">
                                    <div className="text-lg mb-1">🏆</div>
                                    <span className="text-xs text-white/80">Certificates</span>
                                </div>
                                <div className="bg-white/10 hover:bg-white/20 backdrop-blur-md px-3 py-2 rounded-2xl border border-white/20 hover:border-white/40 transition-all duration-300 text-center">
                                    <div className="text-lg mb-1">📊</div>
                                    <span className="text-xs text-white/80">Progress</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default LoginPage
