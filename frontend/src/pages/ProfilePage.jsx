import { useState, useEffect } from 'react'
import { useAuth } from '../contexts/AuthContext'
import { userApi } from '../services/api'
import LoadingSpinner from '../components/LoadingSpinner'
import GlassmorphismBackground from '../components/GlassmorphismBackground'

function ProfilePage() {
    const { user, updateUser } = useAuth()
    const [isEditing, setIsEditing] = useState(false)
    const [loading, setLoading] = useState(false)
    const [saving, setSaving] = useState(false)
    const [error, setError] = useState('')
    const [success, setSuccess] = useState('')
    const [showPasswordForm, setShowPasswordForm] = useState(false)

    const [formData, setFormData] = useState({
        first_name: '',
        last_name: '',
        email: '',
        phone: ''
    })

    const [passwordData, setPasswordData] = useState({
        current_password: '',
        new_password: '',
        confirm_password: ''
    })

    useEffect(() => {
        if (user) {
            setFormData({
                first_name: user.first_name || '',
                last_name: user.last_name || '',
                email: user.email || '',
                phone: user.phone || ''
            })
        }
    }, [user])

    const handleInputChange = (e) => {
        const { name, value } = e.target
        setFormData(prev => ({
            ...prev,
            [name]: value
        }))
        // Clear messages when user starts typing
        if (error) setError('')
        if (success) setSuccess('')
    }

    const handlePasswordChange = (e) => {
        const { name, value } = e.target
        setPasswordData(prev => ({
            ...prev,
            [name]: value
        }))
        if (error) setError('')
        if (success) setSuccess('')
    }

    const handleSaveProfile = async (e) => {
        e.preventDefault()
        setSaving(true)
        setError('')
        setSuccess('')

        try {
            const response = await userApi.updateProfile(formData)
            setSuccess('Profile updated successfully!')
            setIsEditing(false)

            // Update the user context with new data
            if (updateUser) {
                updateUser(response.data)
            }
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to update profile')
        } finally {
            setSaving(false)
        }
    }

    const handleChangePassword = async (e) => {
        e.preventDefault()

        if (passwordData.new_password !== passwordData.confirm_password) {
            setError('New passwords do not match')
            return
        }

        if (passwordData.new_password.length < 8) {
            setError('New password must be at least 8 characters long')
            return
        }

        setSaving(true)
        setError('')
        setSuccess('')

        try {
            await userApi.changePassword({
                current_password: passwordData.current_password,
                new_password: passwordData.new_password
            })
            setSuccess('Password changed successfully!')
            setShowPasswordForm(false)
            setPasswordData({
                current_password: '',
                new_password: '',
                confirm_password: ''
            })
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to change password')
        } finally {
            setSaving(false)
        }
    }

    const handleCancel = () => {
        setIsEditing(false)
        setShowPasswordForm(false)
        setError('')
        setSuccess('')

        // Reset form data to original user data
        if (user) {
            setFormData({
                first_name: user.first_name || '',
                last_name: user.last_name || '',
                email: user.email || '',
                phone: user.phone || ''
            })
        }

        setPasswordData({
            current_password: '',
            new_password: '',
            confirm_password: ''
        })
    }

    if (loading) {
        return (
            <div className="min-h-screen pt-20 flex items-center justify-center">
                <GlassmorphismBackground />
                <LoadingSpinner size="lg" />
            </div>
        )
    }

    return (
        <div className="min-h-screen pt-20 pb-8">
            <GlassmorphismBackground />

            <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Header */}
                <div className="text-center mb-8">
                    <h1 className="text-4xl font-bold text-white mb-4">
                        <span className="bg-gradient-to-r from-white via-blue-100 to-purple-100 bg-clip-text text-transparent">
                            My Profile
                        </span>
                    </h1>
                    <p className="text-white/80 text-lg">
                        Manage your account settings and personal information
                    </p>
                </div>

                {/* Profile Card */}
                <div className="bg-white/10 backdrop-blur-3xl rounded-3xl shadow-2xl border border-white/20 overflow-hidden">
                    {/* Profile Header */}
                    <div className="relative p-8 bg-gradient-to-br from-purple-500/25 via-blue-500/20 to-indigo-500/25 border-b border-white/20">
                        <div className="flex items-center space-x-6">
                            {/* Avatar */}
                            <div className="relative">
                                <div className="h-24 w-24 bg-gradient-to-br from-purple-400 via-blue-400 to-indigo-400 rounded-3xl flex items-center justify-center text-white font-bold text-3xl shadow-2xl border-2 border-white/40">
                                    {user?.first_name?.charAt(0).toUpperCase() || user?.name?.charAt(0).toUpperCase() || 'U'}
                                </div>
                                <div className="absolute inset-0 bg-gradient-to-br from-purple-400/30 to-blue-400/30 rounded-3xl blur-xl"></div>
                                {/* Status indicator */}
                                <div className="absolute -bottom-2 -right-2 h-8 w-8 bg-green-400 rounded-full border-2 border-white/60 shadow-lg flex items-center justify-center">
                                    <i className="fas fa-check text-white text-sm"></i>
                                </div>
                            </div>

                            {/* User Info */}
                            <div className="flex-1">
                                <h2 className="text-2xl font-bold text-white mb-2">
                                    {user?.first_name} {user?.last_name}
                                </h2>
                                <p className="text-white/80 mb-3">{user?.email}</p>
                                <div className="flex items-center space-x-3">
                                    <div className="inline-flex items-center px-4 py-2 bg-gradient-to-r from-white/25 to-white/15 backdrop-blur-sm rounded-2xl border border-white/40">
                                        <div className="h-2 w-2 bg-blue-400 rounded-full mr-2 animate-pulse"></div>
                                        <span className="text-xs text-white font-bold uppercase tracking-widest">
                                            {user?.role}
                                        </span>
                                    </div>
                                    <div className="px-3 py-1 bg-green-400/20 backdrop-blur-sm rounded-xl border border-green-400/30">
                                        <span className="text-xs text-green-300 font-semibold">Active</span>
                                    </div>
                                </div>
                            </div>

                            {/* Edit Button */}
                            {!isEditing && (
                                <button
                                    onClick={() => setIsEditing(true)}
                                    className="px-6 py-3 bg-gradient-to-r from-blue-500/20 to-purple-500/20 backdrop-blur-sm rounded-2xl border border-blue-400/30 text-white font-semibold hover:from-blue-500/30 hover:to-purple-500/30 transition-all duration-300 hover:scale-105"
                                >
                                    <i className="fas fa-edit mr-2"></i>
                                    Edit Profile
                                </button>
                            )}
                        </div>
                    </div>

                    {/* Messages */}
                    {error && (
                        <div className="mx-8 mt-6 p-4 bg-red-500/20 backdrop-blur-sm border border-red-500/30 rounded-2xl">
                            <div className="flex items-center">
                                <i className="fas fa-exclamation-triangle text-red-400 mr-3"></i>
                                <span className="text-red-200">{error}</span>
                            </div>
                        </div>
                    )}

                    {success && (
                        <div className="mx-8 mt-6 p-4 bg-green-500/20 backdrop-blur-sm border border-green-500/30 rounded-2xl">
                            <div className="flex items-center">
                                <i className="fas fa-check-circle text-green-400 mr-3"></i>
                                <span className="text-green-200">{success}</span>
                            </div>
                        </div>
                    )}

                    {/* Profile Form */}
                    <div className="p-8">
                        <form onSubmit={handleSaveProfile} className="space-y-6">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                {/* First Name */}
                                <div>
                                    <label className="block text-white/90 text-sm font-semibold mb-2">
                                        First Name
                                    </label>
                                    <input
                                        type="text"
                                        name="first_name"
                                        value={formData.first_name}
                                        onChange={handleInputChange}
                                        disabled={!isEditing}
                                        className={`w-full px-4 py-3 bg-white/10 backdrop-blur-sm border border-white/20 rounded-2xl text-white placeholder-white/60 focus:outline-none focus:border-blue-400/50 focus:bg-white/15 transition-all duration-300 ${!isEditing ? 'cursor-not-allowed opacity-70' : ''
                                            }`}
                                        placeholder="Enter your first name"
                                    />
                                </div>

                                {/* Last Name */}
                                <div>
                                    <label className="block text-white/90 text-sm font-semibold mb-2">
                                        Last Name
                                    </label>
                                    <input
                                        type="text"
                                        name="last_name"
                                        value={formData.last_name}
                                        onChange={handleInputChange}
                                        disabled={!isEditing}
                                        className={`w-full px-4 py-3 bg-white/10 backdrop-blur-sm border border-white/20 rounded-2xl text-white placeholder-white/60 focus:outline-none focus:border-blue-400/50 focus:bg-white/15 transition-all duration-300 ${!isEditing ? 'cursor-not-allowed opacity-70' : ''
                                            }`}
                                        placeholder="Enter your last name"
                                    />
                                </div>
                            </div>

                            {/* Email */}
                            <div>
                                <label className="block text-white/90 text-sm font-semibold mb-2">
                                    Email Address
                                </label>
                                <input
                                    type="email"
                                    name="email"
                                    value={formData.email}
                                    onChange={handleInputChange}
                                    disabled={!isEditing}
                                    className={`w-full px-4 py-3 bg-white/10 backdrop-blur-sm border border-white/20 rounded-2xl text-white placeholder-white/60 focus:outline-none focus:border-blue-400/50 focus:bg-white/15 transition-all duration-300 ${!isEditing ? 'cursor-not-allowed opacity-70' : ''
                                        }`}
                                    placeholder="Enter your email address"
                                />
                            </div>

                            {/* Phone */}
                            <div>
                                <label className="block text-white/90 text-sm font-semibold mb-2">
                                    Phone Number
                                </label>
                                <input
                                    type="tel"
                                    name="phone"
                                    value={formData.phone}
                                    onChange={handleInputChange}
                                    disabled={!isEditing}
                                    className={`w-full px-4 py-3 bg-white/10 backdrop-blur-sm border border-white/20 rounded-2xl text-white placeholder-white/60 focus:outline-none focus:border-blue-400/50 focus:bg-white/15 transition-all duration-300 ${!isEditing ? 'cursor-not-allowed opacity-70' : ''
                                        }`}
                                    placeholder="Enter your phone number"
                                />
                            </div>

                            {/* Action Buttons */}
                            {isEditing && (
                                <div className="flex items-center justify-end space-x-4 pt-4">
                                    <button
                                        type="button"
                                        onClick={handleCancel}
                                        className="px-6 py-3 bg-white/10 backdrop-blur-sm border border-white/20 rounded-2xl text-white/80 font-semibold hover:bg-white/15 transition-all duration-300"
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        type="submit"
                                        disabled={saving}
                                        className="px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-500 rounded-2xl text-white font-semibold hover:from-blue-600 hover:to-purple-600 transition-all duration-300 hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
                                    >
                                        {saving ? (
                                            <>
                                                <LoadingSpinner size="sm" />
                                                <span className="ml-2">Saving...</span>
                                            </>
                                        ) : (
                                            <>
                                                <i className="fas fa-save mr-2"></i>
                                                Save Changes
                                            </>
                                        )}
                                    </button>
                                </div>
                            )}
                        </form>
                    </div>

                    {/* Password Section */}
                    <div className="border-t border-white/20 p-8">
                        <div className="flex items-center justify-between mb-6">
                            <div>
                                <h3 className="text-xl font-bold text-white mb-2">Security Settings</h3>
                                <p className="text-white/70">Manage your password and security preferences</p>
                            </div>
                            {!showPasswordForm && (
                                <button
                                    onClick={() => setShowPasswordForm(true)}
                                    className="px-6 py-3 bg-gradient-to-r from-orange-500/20 to-red-500/20 backdrop-blur-sm rounded-2xl border border-orange-400/30 text-white font-semibold hover:from-orange-500/30 hover:to-red-500/30 transition-all duration-300"
                                >
                                    <i className="fas fa-key mr-2"></i>
                                    Change Password
                                </button>
                            )}
                        </div>

                        {/* Password Change Form */}
                        {showPasswordForm && (
                            <form onSubmit={handleChangePassword} className="space-y-6">
                                {/* Current Password */}
                                <div>
                                    <label className="block text-white/90 text-sm font-semibold mb-2">
                                        Current Password
                                    </label>
                                    <input
                                        type="password"
                                        name="current_password"
                                        value={passwordData.current_password}
                                        onChange={handlePasswordChange}
                                        className="w-full px-4 py-3 bg-white/10 backdrop-blur-sm border border-white/20 rounded-2xl text-white placeholder-white/60 focus:outline-none focus:border-blue-400/50 focus:bg-white/15 transition-all duration-300"
                                        placeholder="Enter your current password"
                                        required
                                    />
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    {/* New Password */}
                                    <div>
                                        <label className="block text-white/90 text-sm font-semibold mb-2">
                                            New Password
                                        </label>
                                        <input
                                            type="password"
                                            name="new_password"
                                            value={passwordData.new_password}
                                            onChange={handlePasswordChange}
                                            className="w-full px-4 py-3 bg-white/10 backdrop-blur-sm border border-white/20 rounded-2xl text-white placeholder-white/60 focus:outline-none focus:border-blue-400/50 focus:bg-white/15 transition-all duration-300"
                                            placeholder="Enter new password"
                                            required
                                        />
                                    </div>

                                    {/* Confirm Password */}
                                    <div>
                                        <label className="block text-white/90 text-sm font-semibold mb-2">
                                            Confirm New Password
                                        </label>
                                        <input
                                            type="password"
                                            name="confirm_password"
                                            value={passwordData.confirm_password}
                                            onChange={handlePasswordChange}
                                            className="w-full px-4 py-3 bg-white/10 backdrop-blur-sm border border-white/20 rounded-2xl text-white placeholder-white/60 focus:outline-none focus:border-blue-400/50 focus:bg-white/15 transition-all duration-300"
                                            placeholder="Confirm new password"
                                            required
                                        />
                                    </div>
                                </div>

                                {/* Password Requirements */}
                                <div className="bg-blue-500/10 backdrop-blur-sm border border-blue-400/20 rounded-2xl p-4">
                                    <h4 className="text-blue-200 font-semibold mb-2">Password Requirements:</h4>
                                    <ul className="text-blue-100/80 text-sm space-y-1">
                                        <li>• At least 8 characters long</li>
                                        <li>• Include uppercase and lowercase letters</li>
                                        <li>• Include at least one number</li>
                                        <li>• Include at least one special character</li>
                                    </ul>
                                </div>

                                {/* Password Action Buttons */}
                                <div className="flex items-center justify-end space-x-4">
                                    <button
                                        type="button"
                                        onClick={() => {
                                            setShowPasswordForm(false)
                                            setPasswordData({
                                                current_password: '',
                                                new_password: '',
                                                confirm_password: ''
                                            })
                                            setError('')
                                            setSuccess('')
                                        }}
                                        className="px-6 py-3 bg-white/10 backdrop-blur-sm border border-white/20 rounded-2xl text-white/80 font-semibold hover:bg-white/15 transition-all duration-300"
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        type="submit"
                                        disabled={saving}
                                        className="px-6 py-3 bg-gradient-to-r from-orange-500 to-red-500 rounded-2xl text-white font-semibold hover:from-orange-600 hover:to-red-600 transition-all duration-300 hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
                                    >
                                        {saving ? (
                                            <>
                                                <LoadingSpinner size="sm" />
                                                <span className="ml-2">Updating...</span>
                                            </>
                                        ) : (
                                            <>
                                                <i className="fas fa-shield-alt mr-2"></i>
                                                Update Password
                                            </>
                                        )}
                                    </button>
                                </div>
                            </form>
                        )}
                    </div>
                </div>
            </div>
        </div>
    )
}

export default ProfilePage
