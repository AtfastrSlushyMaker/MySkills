import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'

function SignUpPage() {
    const { register } = useAuth()
    const navigate = useNavigate()

    // State management for signup form
    const [formData, setFormData] = useState({
        firstName: '',
        lastName: '',
        email: '',
        password: '',
        confirmPassword: '',
        role: 'trainee', // default role
        agreeToTerms: false
    })
    const [errors, setErrors] = useState({})
    const [isLoading, setIsLoading] = useState(false)
    const [apiError, setApiError] = useState('')

    // Handle input changes
    const handleChange = (e) => {
        const { name, value, type, checked } = e.target
        setFormData(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value
        }))
        // Clear error when user starts typing
        if (errors[name]) {
            setErrors(prev => ({
                ...prev,
                [name]: ''
            }))
        }
    }

    // Form validation
    const validateForm = () => {
        const newErrors = {}

        if (!formData.firstName.trim()) {
            newErrors.firstName = 'First name is required'
        }

        if (!formData.lastName.trim()) {
            newErrors.lastName = 'Last name is required'
        }

        if (!formData.email) {
            newErrors.email = 'Email is required'
        } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
            newErrors.email = 'Email is invalid'
        }

        if (!formData.password) {
            newErrors.password = 'Password is required'
        } else if (formData.password.length < 8) {
            newErrors.password = 'Password must be at least 8 characters'
        } else if (!/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(formData.password)) {
            newErrors.password = 'Password must contain uppercase, lowercase, and number'
        }

        if (!formData.confirmPassword) {
            newErrors.confirmPassword = 'Please confirm your password'
        } else if (formData.password !== formData.confirmPassword) {
            newErrors.confirmPassword = 'Passwords do not match'
        }

        if (!formData.agreeToTerms) {
            newErrors.agreeToTerms = 'You must agree to the terms and conditions'
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

        // Prepare data for backend (match Laravel expected fields)
        const registrationData = {
            first_name: formData.firstName,
            last_name: formData.lastName,
            email: formData.email,
            password: formData.password,
            password_confirmation: formData.confirmPassword,
            role: formData.role,
            terms_accepted: formData.agreeToTerms
        }

        const result = await register(registrationData)

        if (result.success) {
            // Redirect to dashboard on successful registration
            navigate('/dashboard')
        } else {
            if (result.errors) {
                // Handle validation errors from backend
                const backendErrors = {}
                Object.keys(result.errors).forEach(key => {
                    // Convert Laravel field names back to frontend field names
                    const frontendKey = key === 'first_name' ? 'firstName' :
                        key === 'last_name' ? 'lastName' : key
                    backendErrors[frontendKey] = result.errors[key][0] // Take first error message
                })
                setErrors(backendErrors)
            } else {
                setApiError(result.message)
            }
            setIsLoading(false)
        }
    }

    const roleOptions = [
        { value: 'trainee', label: '🎓 Trainee', description: 'Join courses and learn' },
        { value: 'trainer', label: '👨‍🏫 Trainer', description: 'Teach and create courses' },
        { value: 'coordinator', label: '📊 Coordinator', description: 'Manage training programs' }
    ]

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 pt-20 py-12">
            {/* Background Effects */}
            <div className="absolute inset-0 overflow-hidden">
                <div className="absolute -top-4 -left-4 w-72 h-72 bg-purple-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-float"></div>
                <div className="absolute -top-4 -right-4 w-72 h-72 bg-blue-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-float" style={{ animationDelay: '2s' }}></div>
                <div className="absolute -bottom-8 left-20 w-72 h-72 bg-cyan-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-float" style={{ animationDelay: '4s' }}></div>
            </div>

            <div className="relative max-w-md w-full mx-4">
                {/* Signup Card */}
                <div className="p-8 rounded-2xl bg-white/5 backdrop-blur-lg border border-white/10 shadow-2xl">
                    {/* Header */}
                    <div className="text-center mb-8">
                        <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-gradient-to-br from-cyan-500 via-purple-500 to-pink-500 flex items-center justify-center shadow-2xl border border-white/30">
                            <span className="text-2xl">🎓</span>
                        </div>
                        <h1 className="text-4xl font-bold mb-2 drop-shadow-lg">
                            <span className="bg-gradient-to-r from-cyan-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
                                Join MySkills
                            </span>
                        </h1>
                        <p className="text-white/80 drop-shadow-sm">Create your account and start your learning journey</p>
                    </div>

                    {/* Signup Form */}
                    <form onSubmit={handleSubmit} className="space-y-6">
                        {/* API Error Display */}
                        {apiError && (
                            <div className="p-4 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 text-sm">
                                <span className="mr-2">⚠️</span>
                                {apiError}
                            </div>
                        )}

                        {/* Name Fields */}
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label htmlFor="firstName" className="block text-sm font-medium text-gray-300 mb-2">
                                    First Name
                                </label>
                                <input
                                    type="text"
                                    id="firstName"
                                    name="firstName"
                                    value={formData.firstName}
                                    onChange={handleChange}
                                    placeholder="John"
                                    className={`
                                        w-full px-4 py-3 rounded-lg bg-white/10 border text-white placeholder-gray-400 
                                        focus:outline-none focus:ring-2 transition-all duration-300
                                        ${errors.firstName
                                            ? 'border-red-500 focus:ring-red-500'
                                            : 'border-white/20 focus:ring-blue-500 focus:border-blue-500'
                                        }
                                    `}
                                />
                                {errors.firstName && (
                                    <p className="mt-1 text-xs text-red-400">{errors.firstName}</p>
                                )}
                            </div>
                            <div>
                                <label htmlFor="lastName" className="block text-sm font-medium text-gray-300 mb-2">
                                    Last Name
                                </label>
                                <input
                                    type="text"
                                    id="lastName"
                                    name="lastName"
                                    value={formData.lastName}
                                    onChange={handleChange}
                                    placeholder="Doe"
                                    className={`
                                        w-full px-4 py-3 rounded-lg bg-white/10 border text-white placeholder-gray-400 
                                        focus:outline-none focus:ring-2 transition-all duration-300
                                        ${errors.lastName
                                            ? 'border-red-500 focus:ring-red-500'
                                            : 'border-white/20 focus:ring-blue-500 focus:border-blue-500'
                                        }
                                    `}
                                />
                                {errors.lastName && (
                                    <p className="mt-1 text-xs text-red-400">{errors.lastName}</p>
                                )}
                            </div>
                        </div>

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
                                    placeholder="john.doe@example.com"
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

                        {/* Role Selection */}
                        <div>
                            <label className="block text-sm font-medium text-gray-300 mb-3">
                                I want to join as:
                            </label>
                            <div className="space-y-2">
                                {roleOptions.map((role) => (
                                    <label key={role.value} className="flex items-center p-3 rounded-lg bg-white/5 border border-white/10 hover:bg-white/10 transition-all duration-300 cursor-pointer">
                                        <input
                                            type="radio"
                                            name="role"
                                            value={role.value}
                                            checked={formData.role === role.value}
                                            onChange={handleChange}
                                            className="w-4 h-4 text-blue-600 bg-white/10 border-white/20 focus:ring-blue-500 focus:ring-2"
                                        />
                                        <div className="ml-3">
                                            <div className="text-white font-medium">{role.label}</div>
                                            <div className="text-gray-400 text-sm">{role.description}</div>
                                        </div>
                                    </label>
                                ))}
                            </div>
                        </div>

                        {/* Password Fields */}
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
                                    placeholder="Create a strong password"
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

                        <div>
                            <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-300 mb-2">
                                Confirm Password
                            </label>
                            <div className="relative">
                                <input
                                    type="password"
                                    id="confirmPassword"
                                    name="confirmPassword"
                                    value={formData.confirmPassword}
                                    onChange={handleChange}
                                    placeholder="Confirm your password"
                                    className={`
                                        w-full px-4 py-3 rounded-lg bg-white/10 border text-white placeholder-gray-400 
                                        focus:outline-none focus:ring-2 transition-all duration-300
                                        ${errors.confirmPassword
                                            ? 'border-red-500 focus:ring-red-500'
                                            : 'border-white/20 focus:ring-blue-500 focus:border-blue-500'
                                        }
                                    `}
                                />
                                <div className="absolute inset-y-0 right-0 pr-3 flex items-center">
                                    <span className="text-gray-400">🔐</span>
                                </div>
                            </div>
                            {errors.confirmPassword && (
                                <p className="mt-1 text-sm text-red-400 flex items-center">
                                    <span className="mr-1">⚠️</span>
                                    {errors.confirmPassword}
                                </p>
                            )}
                        </div>

                        {/* Terms Agreement */}
                        <div>
                            <label className="flex items-start">
                                <input
                                    type="checkbox"
                                    name="agreeToTerms"
                                    checked={formData.agreeToTerms}
                                    onChange={handleChange}
                                    className="w-4 h-4 text-blue-600 bg-white/10 border-white/20 rounded focus:ring-blue-500 focus:ring-2 mt-1"
                                />
                                <span className="ml-3 text-sm text-gray-300">
                                    I agree to the{' '}
                                    <Link to="/terms" className="text-blue-400 hover:text-blue-300">
                                        Terms of Service
                                    </Link>{' '}
                                    and{' '}
                                    <Link to="/privacy" className="text-blue-400 hover:text-blue-300">
                                        Privacy Policy
                                    </Link>
                                </span>
                            </label>
                            {errors.agreeToTerms && (
                                <p className="mt-1 text-sm text-red-400 flex items-center">
                                    <span className="mr-1">⚠️</span>
                                    {errors.agreeToTerms}
                                </p>
                            )}
                        </div>

                        {/* Submit Button */}
                        <button
                            type="submit"
                            disabled={isLoading}
                            className={`
                                w-full py-3 rounded-lg text-white font-semibold transition-all duration-300 
                                ${isLoading
                                    ? 'bg-gray-600 cursor-not-allowed'
                                    : 'bg-gradient-to-r from-green-600 to-blue-600 hover:shadow-lg hover:scale-105'
                                }
                            `}
                        >
                            {isLoading ? (
                                <div className="flex items-center justify-center">
                                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin mr-2"></div>
                                    Creating account...
                                </div>
                            ) : (
                                'Create Account'
                            )}
                        </button>
                    </form>

                    {/* Footer */}
                    <div className="mt-8 text-center">
                        <p className="text-gray-400">
                            Already have an account?{' '}
                            <Link
                                to="/login"
                                className="text-blue-400 hover:text-blue-300 font-medium transition-colors duration-300"
                            >
                                Sign in here
                            </Link>
                        </p>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default SignUpPage
