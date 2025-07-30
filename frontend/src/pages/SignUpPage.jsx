import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import GlassmorphismBackground from '../components/GlassmorphismBackground'

function SignUpPage() {
    const { register } = useAuth()
    const navigate = useNavigate()

    // State management for signup form
    const [formData, setFormData] = useState({
        firstName: '',
        lastName: '',
        email: '',
        phone: '',
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

        if (formData.phone && !/^[\+]?[1-9][\d]{0,15}$/.test(formData.phone.replace(/[\s\-\(\)]/g, ''))) {
            newErrors.phone = 'Phone number is invalid'
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
            phone: formData.phone || null,
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
                        key === 'last_name' ? 'lastName' :
                            key === 'phone' ? 'phone' : key
                    backendErrors[frontendKey] = result.errors[key][0] // Take first error message
                })
                setErrors(backendErrors)
            } else {
                setApiError(result.message)
            }
            setIsLoading(false)
        }
    }



    return (
        <div className="min-h-screen pt-20 pb-8">
            <GlassmorphismBackground />

            <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Header */}
                <div className="text-center mb-8">
                    <h1 className="text-4xl font-bold text-white mb-4">
                        <span className="bg-gradient-to-r from-white via-blue-100 to-purple-100 bg-clip-text text-transparent">
                            Join MySkills
                        </span>
                    </h1>
                    <p className="text-white/80 text-lg">
                        Create your account and start your learning journey
                    </p>
                </div>

                {/* Registration Card */}
                <div className="bg-white/10 backdrop-blur-3xl rounded-3xl shadow-2xl border border-white/20 overflow-hidden">
                    {/* Header Section */}
                    <div className="relative p-8 bg-gradient-to-br from-purple-500/25 via-blue-500/20 to-indigo-500/25 border-b border-white/20">
                        <div className="text-center">
                            <div className="h-20 w-20 mx-auto mb-4 bg-gradient-to-br from-purple-400 via-blue-400 to-indigo-400 rounded-3xl flex items-center justify-center text-white font-bold text-3xl shadow-2xl border-2 border-white/40">
                                <i className="fas fa-rocket"></i>
                            </div>
                            <h2 className="text-2xl font-bold text-white mb-2">
                                Create Your Account
                            </h2>
                            <p className="text-white/80">Start your learning journey with us today</p>
                        </div>
                    </div>

                    {/* Messages */}
                    {apiError && (
                        <div className="mx-8 mt-6 p-4 bg-red-500/20 backdrop-blur-sm border border-red-500/30 rounded-2xl">
                            <div className="flex items-center">
                                <i className="fas fa-exclamation-triangle text-red-400 mr-3"></i>
                                <span className="text-red-200">{apiError}</span>
                            </div>
                        </div>
                    )}

                    {/* Form Section */}
                    <div className="p-8">
                        <form onSubmit={handleSubmit} className="space-y-6">
                            {/* Personal Information */}
                            <div className="space-y-6">
                                <div className="flex items-center space-x-3 mb-4">
                                    <div className="h-10 w-10 bg-gradient-to-br from-blue-400/30 to-purple-400/30 backdrop-blur-sm rounded-2xl border border-blue-400/30 flex items-center justify-center">
                                        <i className="fas fa-user text-blue-400"></i>
                                    </div>
                                    <h3 className="text-lg font-semibold text-white">Personal Information</h3>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    {/* First Name */}
                                    <div>
                                        <label className="block text-white/90 text-sm font-semibold mb-2">
                                            First Name *
                                        </label>
                                        <input
                                            type="text"
                                            name="firstName"
                                            value={formData.firstName}
                                            onChange={handleChange}
                                            placeholder="Enter your first name"
                                            className={`w-full px-4 py-3 bg-white/10 backdrop-blur-sm border border-white/20 rounded-2xl text-white placeholder-white/60 focus:outline-none focus:border-blue-400/50 focus:bg-white/15 transition-all duration-300 ${errors.firstName ? 'border-red-500/50 bg-red-500/10' : ''
                                                }`}
                                        />
                                        {errors.firstName && (
                                            <p className="mt-2 text-sm text-red-400 flex items-center">
                                                <i className="fas fa-exclamation-circle mr-2"></i>
                                                {errors.firstName}
                                            </p>
                                        )}
                                    </div>

                                    {/* Last Name */}
                                    <div>
                                        <label className="block text-white/90 text-sm font-semibold mb-2">
                                            Last Name *
                                        </label>
                                        <input
                                            type="text"
                                            name="lastName"
                                            value={formData.lastName}
                                            onChange={handleChange}
                                            placeholder="Enter your last name"
                                            className={`w-full px-4 py-3 bg-white/10 backdrop-blur-sm border border-white/20 rounded-2xl text-white placeholder-white/60 focus:outline-none focus:border-blue-400/50 focus:bg-white/15 transition-all duration-300 ${errors.lastName ? 'border-red-500/50 bg-red-500/10' : ''
                                                }`}
                                        />
                                        {errors.lastName && (
                                            <p className="mt-2 text-sm text-red-400 flex items-center">
                                                <i className="fas fa-exclamation-circle mr-2"></i>
                                                {errors.lastName}
                                            </p>
                                        )}
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    {/* Email */}
                                    <div>
                                        <label className="block text-white/90 text-sm font-semibold mb-2">
                                            Email Address *
                                        </label>
                                        <div className="relative">
                                            <input
                                                type="email"
                                                name="email"
                                                value={formData.email}
                                                onChange={handleChange}
                                                placeholder="your.email@example.com"
                                                className={`w-full px-4 py-3 pl-12 bg-white/10 backdrop-blur-sm border border-white/20 rounded-2xl text-white placeholder-white/60 focus:outline-none focus:border-blue-400/50 focus:bg-white/15 transition-all duration-300 ${errors.email ? 'border-red-500/50 bg-red-500/10' : ''
                                                    }`}
                                            />
                                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center">
                                                <i className="fas fa-envelope text-white/60"></i>
                                            </div>
                                        </div>
                                        {errors.email && (
                                            <p className="mt-2 text-sm text-red-400 flex items-center">
                                                <i className="fas fa-exclamation-circle mr-2"></i>
                                                {errors.email}
                                            </p>
                                        )}
                                    </div>

                                    {/* Phone */}
                                    <div>
                                        <label className="block text-white/90 text-sm font-semibold mb-2">
                                            Phone Number <span className="text-white/60 text-xs">(Optional)</span>
                                        </label>
                                        <div className="relative">
                                            <input
                                                type="tel"
                                                name="phone"
                                                value={formData.phone}
                                                onChange={handleChange}
                                                placeholder="+1 (555) 123-4567"
                                                className={`w-full px-4 py-3 pl-12 bg-white/10 backdrop-blur-sm border border-white/20 rounded-2xl text-white placeholder-white/60 focus:outline-none focus:border-blue-400/50 focus:bg-white/15 transition-all duration-300 ${errors.phone ? 'border-red-500/50 bg-red-500/10' : ''
                                                    }`}
                                            />
                                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center">
                                                <i className="fas fa-phone text-white/60"></i>
                                            </div>
                                        </div>
                                        {errors.phone && (
                                            <p className="mt-2 text-sm text-red-400 flex items-center">
                                                <i className="fas fa-exclamation-circle mr-2"></i>
                                                {errors.phone}
                                            </p>
                                        )}
                                    </div>
                                </div>
                            </div>


                            {/* Role is always 'trainee' by default and hidden from user */}

                            {/* Security */}
                            <div className="space-y-6">
                                <div className="flex items-center space-x-3 mb-4">
                                    <div className="h-10 w-10 bg-gradient-to-br from-green-400/30 to-teal-400/30 backdrop-blur-sm rounded-2xl border border-green-400/30 flex items-center justify-center">
                                        <i className="fas fa-shield-alt text-green-400"></i>
                                    </div>
                                    <h3 className="text-lg font-semibold text-white">Account Security</h3>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    {/* Password */}
                                    <div>
                                        <label className="block text-white/90 text-sm font-semibold mb-2">
                                            Password *
                                        </label>
                                        <div className="relative">
                                            <input
                                                type="password"
                                                name="password"
                                                value={formData.password}
                                                onChange={handleChange}
                                                placeholder="Create a strong password"
                                                className={`w-full px-4 py-3 pl-12 bg-white/10 backdrop-blur-sm border border-white/20 rounded-2xl text-white placeholder-white/60 focus:outline-none focus:border-blue-400/50 focus:bg-white/15 transition-all duration-300 ${errors.password ? 'border-red-500/50 bg-red-500/10' : ''
                                                    }`}
                                            />
                                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center">
                                                <i className="fas fa-lock text-white/60"></i>
                                            </div>
                                        </div>
                                        {errors.password && (
                                            <p className="mt-2 text-sm text-red-400 flex items-center">
                                                <i className="fas fa-exclamation-circle mr-2"></i>
                                                {errors.password}
                                            </p>
                                        )}
                                    </div>

                                    {/* Confirm Password */}
                                    <div>
                                        <label className="block text-white/90 text-sm font-semibold mb-2">
                                            Confirm Password *
                                        </label>
                                        <div className="relative">
                                            <input
                                                type="password"
                                                name="confirmPassword"
                                                value={formData.confirmPassword}
                                                onChange={handleChange}
                                                placeholder="Confirm your password"
                                                className={`w-full px-4 py-3 pl-12 bg-white/10 backdrop-blur-sm border border-white/20 rounded-2xl text-white placeholder-white/60 focus:outline-none focus:border-blue-400/50 focus:bg-white/15 transition-all duration-300 ${errors.confirmPassword ? 'border-red-500/50 bg-red-500/10' : ''
                                                    }`}
                                            />
                                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center">
                                                <i className="fas fa-lock text-white/60"></i>
                                            </div>
                                        </div>
                                        {errors.confirmPassword && (
                                            <p className="mt-2 text-sm text-red-400 flex items-center">
                                                <i className="fas fa-exclamation-circle mr-2"></i>
                                                {errors.confirmPassword}
                                            </p>
                                        )}
                                    </div>
                                </div>
                            </div>

                            {/* Terms Agreement */}
                            <div className="space-y-4">
                                <div className="flex items-start space-x-3 p-4 bg-white/10 backdrop-blur-sm rounded-2xl border border-white/20">
                                    <input
                                        type="checkbox"
                                        id="agreeToTerms"
                                        name="agreeToTerms"
                                        checked={formData.agreeToTerms}
                                        onChange={handleChange}
                                        className="mt-1 w-4 h-4 text-blue-600 bg-white/10 border-white/30 rounded focus:ring-blue-500 focus:ring-2"
                                    />
                                    <label htmlFor="agreeToTerms" className="text-sm text-white/90">
                                        I agree to the{' '}
                                        <Link to="/terms" className="text-blue-400 hover:text-blue-300 font-medium">
                                            Terms of Service
                                        </Link>{' '}
                                        and{' '}
                                        <Link to="/privacy" className="text-blue-400 hover:text-blue-300 font-medium">
                                            Privacy Policy
                                        </Link>
                                    </label>
                                </div>
                                {errors.agreeToTerms && (
                                    <p className="text-sm text-red-400 flex items-center">
                                        <i className="fas fa-exclamation-circle mr-2"></i>
                                        {errors.agreeToTerms}
                                    </p>
                                )}
                            </div>

                            {/* Submit Button */}
                            <button
                                type="submit"
                                disabled={isLoading}
                                className={`
                                    w-full py-4 px-6 rounded-2xl text-white font-semibold text-lg
                                    transition-all duration-300 transform backdrop-blur-sm border
                                    ${isLoading
                                        ? 'bg-gray-600/50 border-gray-500/30 cursor-not-allowed'
                                        : 'bg-gradient-to-r from-blue-500/20 to-purple-500/20 border-blue-400/30 hover:from-blue-500/30 hover:to-purple-500/30 hover:scale-105 active:scale-95'
                                    }
                                `}
                            >
                                {isLoading ? (
                                    <div className="flex items-center justify-center space-x-2">
                                        <i className="fas fa-spinner animate-spin"></i>
                                        <span>Creating your account...</span>
                                    </div>
                                ) : (
                                    <div className="flex items-center justify-center space-x-2">
                                        <i className="fas fa-rocket"></i>
                                        <span>Create My Account</span>
                                    </div>
                                )}
                            </button>
                        </form>
                    </div>

                    {/* Footer */}
                    <div className="bg-white/5 backdrop-blur-sm px-8 py-6 text-center border-t border-white/20">
                        <p className="text-white/80">
                            Already have an account?{' '}
                            <Link
                                to="/login"
                                className="text-blue-400 hover:text-blue-300 font-semibold transition-colors duration-300"
                            >
                                Sign in here <i className="fas fa-arrow-right ml-1"></i>
                            </Link>
                        </p>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default SignUpPage
