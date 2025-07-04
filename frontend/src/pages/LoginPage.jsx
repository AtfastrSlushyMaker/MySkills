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
        const result = await login(formData.email, formData.password)

        if (result.success) {
            // Redirect to dashboard on successful login
            navigate('/dashboard')
        } else {
            setApiError(result.message)
            setIsLoading(false)
        }
    }

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 pt-20">
            {/* Background Effects */}
            <div className="absolute inset-0 overflow-hidden">
                <div className="absolute -top-4 -left-4 w-72 h-72 bg-purple-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-float"></div>
                <div className="absolute -top-4 -right-4 w-72 h-72 bg-blue-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-float" style={{ animationDelay: '2s' }}></div>
                <div className="absolute -bottom-8 left-20 w-72 h-72 bg-cyan-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-float" style={{ animationDelay: '4s' }}></div>
            </div>

            <div className="relative max-w-md w-full mx-4">
                {/* Login Card */}
                <div className="p-8 rounded-2xl bg-white/5 backdrop-blur-lg border border-white/10 shadow-2xl">
                    {/* Header */}
                    <div className="text-center mb-8">
                        <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-gradient-to-br from-blue-600 to-purple-600 flex items-center justify-center">
                            <span className="text-2xl">🔐</span>
                        </div>
                        <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                            Welcome Back
                        </h1>
                        <p className="text-gray-400 mt-2">Sign in to your MySkills account</p>
                    </div>

                    {/* Login Form */}
                    <form onSubmit={handleSubmit} className="space-y-6">
                        {/* API Error Display */}
                        {apiError && (
                            <div className="p-4 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 text-sm">
                                <span className="mr-2">⚠️</span>
                                {apiError}
                            </div>
                        )}

                        {/* Email Field */}
                        <div>
                            <label htmlFor="email" className="block text-sm font-medium text-gray-300 mb-2">
                                Email Address
                            </label>
                            <div className="relative">
                                <input
                                    type="email"
                                    id="email"
                                    name="email"
                                    value={formData.email}
                                    onChange={handleChange}
                                    placeholder="Enter your email"
                                    className={`
                                        w-full px-4 py-3 rounded-lg bg-white/10 border text-white placeholder-gray-400 
                                        focus:outline-none focus:ring-2 transition-all duration-300
                                        ${errors.email
                                            ? 'border-red-500 focus:ring-red-500'
                                            : 'border-white/20 focus:ring-blue-500 focus:border-blue-500'
                                        }
                                    `}
                                />
                                <div className="absolute inset-y-0 right-0 pr-3 flex items-center">
                                    <span className="text-gray-400">📧</span>
                                </div>
                            </div>
                            {errors.email && (
                                <p className="mt-1 text-sm text-red-400 flex items-center">
                                    <span className="mr-1">⚠️</span>
                                    {errors.email}
                                </p>
                            )}
                        </div>

                        {/* Password Field */}
                        <div>
                            <label htmlFor="password" className="block text-sm font-medium text-gray-300 mb-2">
                                Password
                            </label>
                            <div className="relative">
                                <input
                                    type="password"
                                    id="password"
                                    name="password"
                                    value={formData.password}
                                    onChange={handleChange}
                                    placeholder="Enter your password"
                                    className={`
                                        w-full px-4 py-3 rounded-lg bg-white/10 border text-white placeholder-gray-400 
                                        focus:outline-none focus:ring-2 transition-all duration-300
                                        ${errors.password
                                            ? 'border-red-500 focus:ring-red-500'
                                            : 'border-white/20 focus:ring-blue-500 focus:border-blue-500'
                                        }
                                    `}
                                />
                                <div className="absolute inset-y-0 right-0 pr-3 flex items-center">
                                    <span className="text-gray-400">🔒</span>
                                </div>
                            </div>
                            {errors.password && (
                                <p className="mt-1 text-sm text-red-400 flex items-center">
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
                                    className="w-4 h-4 text-blue-600 bg-white/10 border-white/20 rounded focus:ring-blue-500 focus:ring-2"
                                />
                                <span className="ml-2 text-sm text-gray-300">Remember me</span>
                            </label>
                            <Link
                                to="/forgot-password"
                                className="text-sm text-blue-400 hover:text-blue-300 transition-colors duration-300"
                            >
                                Forgot password?
                            </Link>
                        </div>

                        {/* Submit Button */}
                        <button
                            type="submit"
                            disabled={isLoading}
                            className={`
                                w-full py-3 rounded-lg text-white font-semibold transition-all duration-300 
                                ${isLoading
                                    ? 'bg-gray-600 cursor-not-allowed'
                                    : 'bg-gradient-to-r from-blue-600 to-purple-600 hover:shadow-lg hover:scale-105'
                                }
                            `}
                        >
                            {isLoading ? (
                                <div className="flex items-center justify-center">
                                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin mr-2"></div>
                                    Signing in...
                                </div>
                            ) : (
                                'Sign In'
                            )}
                        </button>
                    </form>

                    {/* Footer */}
                    <div className="mt-8 text-center">
                        <p className="text-gray-400">
                            Don't have an account?{' '}
                            <Link
                                to="/signup"
                                className="text-blue-400 hover:text-blue-300 font-medium transition-colors duration-300"
                            >
                                Create one here
                            </Link>
                        </p>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default LoginPage
