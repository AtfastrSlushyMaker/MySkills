import { useState, useEffect } from 'react'
import { useAuth } from '../contexts/AuthContext'
import { userApi } from '../services/api'
import LoadingSpinner from '../components/LoadingSpinner'
import GlassmorphismBackground from '../components/GlassmorphismBackground'

function ProfilePage() {
    const [previewImage, setPreviewImage] = useState('');
    const { user, updateUser } = useAuth()
    const [isEditing, setIsEditing] = useState(false)
    const [loading, setLoading] = useState(false)
    const [saving, setSaving] = useState(false)
    const [error, setError] = useState('')
    const [success, setSuccess] = useState('')
    const [showPasswordForm, setShowPasswordForm] = useState(false)
    const [dragActive, setDragActive] = useState(false)

    const [formData, setFormData] = useState({
        first_name: '',
        last_name: '',
        email: '',
        phone: '',
        profile_picture: ''
    })

    const [passwordData, setPasswordData] = useState({
        current_password: '',
        new_password: '',
        confirm_password: ''
    })

    // Simple fade-in animation
    const [isVisible, setIsVisible] = useState(false)

    useEffect(() => {
        // Simple fade-in on mount
        setTimeout(() => setIsVisible(true), 100)
    }, [])

    useEffect(() => {
        if (user) {
            setFormData({
                first_name: user.first_name || '',
                last_name: user.last_name || '',
                email: user.email || '',
                phone: user.phone || '',
                profile_picture: user.profile_picture || ''
            })
        }
    }, [user])

    // Auto-hide messages after 5 seconds
    useEffect(() => {
        if (error || success) {
            const timer = setTimeout(() => {
                setError('')
                setSuccess('')
            }, 5000)
            return () => clearTimeout(timer)
        }
    }, [error, success])

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        if (name === 'profile_picture' && e.target.files) {
            const file = e.target.files[0];
            if (file) {
                // Validate file size (max 5MB)
                if (file.size > 5 * 1024 * 1024) {
                    setError('File size must be less than 5MB')
                    return
                }

                // Validate file type
                if (!file.type.startsWith('image/')) {
                    setError('Please select a valid image file')
                    return
                }

                setFormData(prev => ({
                    ...prev,
                    profile_picture: file
                }));

                // Show preview with animation
                const reader = new FileReader();
                reader.onloadend = () => {
                    setPreviewImage(reader.result);
                };
                reader.readAsDataURL(file);
            } else {
                setPreviewImage('');
                setFormData(prev => ({
                    ...prev,
                    profile_picture: null
                }));
            }
        } else {
            setFormData(prev => ({
                ...prev,
                [name]: value
            }));
        }
        // Clear messages when user starts typing
        if (error) setError('');
        if (success) setSuccess('');
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

    // Drag and drop handlers
    const handleDrag = (e) => {
        e.preventDefault()
        e.stopPropagation()
        if (e.type === 'dragenter' || e.type === 'dragover') {
            setDragActive(true)
        } else if (e.type === 'dragleave') {
            setDragActive(false)
        }
    }

    const handleDrop = (e) => {
        e.preventDefault()
        e.stopPropagation()
        setDragActive(false)

        if (e.dataTransfer.files && e.dataTransfer.files[0]) {
            const file = e.dataTransfer.files[0]

            // Validate file
            if (file.size > 5 * 1024 * 1024) {
                setError('File size must be less than 5MB')
                return
            }

            if (!file.type.startsWith('image/')) {
                setError('Please select a valid image file')
                return
            }

            setFormData(prev => ({
                ...prev,
                profile_picture: file
            }));

            const reader = new FileReader();
            reader.onloadend = () => {
                setPreviewImage(reader.result);
            };
            reader.readAsDataURL(file);
        }
    }

    const handleSaveProfile = async (e) => {
        e.preventDefault();
        setSaving(true);
        setError('');
        setSuccess('');

        try {
            let payload;

            // If profile_picture is a File, use FormData for upload
            if (formData.profile_picture instanceof File) {
                const fd = new FormData();
                Object.entries(formData).forEach(([key, value]) => {
                    if (key === 'profile_picture' && value instanceof File) {
                        fd.append('profile_picture', value);
                    } else if (value !== undefined && value !== null && value !== '') {
                        fd.append(key, value);
                    }
                });
                payload = fd;
            } else {
                // Use regular JSON for text-only updates
                const cleanData = { ...formData };
                if (!cleanData.profile_picture ||
                    Array.isArray(cleanData.profile_picture) ||
                    (typeof cleanData.profile_picture !== 'string' && cleanData.profile_picture !== null)) {
                    cleanData.profile_picture = null;
                }
                payload = cleanData;
            }

            const response = await userApi.updateProfile(payload);
            setSuccess('Profile updated successfully!');
            setIsEditing(false);
            setPreviewImage('');

            // Update the user context with new data
            if (updateUser) {
                updateUser(response.data);
            }
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to update profile');
        } finally {
            setSaving(false);
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

        // Password strength validation
        const hasUpperCase = /[A-Z]/.test(passwordData.new_password)
        const hasLowerCase = /[a-z]/.test(passwordData.new_password)
        const hasNumbers = /\d/.test(passwordData.new_password)
        const hasSpecial = /[!@#$%^&*(),.?":{}|<>]/.test(passwordData.new_password)

        if (!hasUpperCase || !hasLowerCase || !hasNumbers || !hasSpecial) {
            setError('Password must contain uppercase, lowercase, number, and special character')
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
        setPreviewImage('')

        // Reset form data to original user data
        if (user) {
            setFormData({
                first_name: user.first_name || '',
                last_name: user.last_name || '',
                email: user.email || '',
                phone: user.phone || '',
                profile_picture: user.profile_picture || ''
            })
        }

        setPasswordData({
            current_password: '',
            new_password: '',
            confirm_password: ''
        })
    }

    const getRoleColor = (role) => {
        const colors = {
            admin: 'from-red-400 to-pink-400',
            trainer: 'from-blue-400 to-indigo-400',
            trainee: 'from-green-400 to-emerald-400',
            coordinator: 'from-purple-400 to-violet-400'
        }
        return colors[role] || 'from-gray-400 to-slate-400'
    }

    const getStatusColor = (status) => {
        return status === 'active' ? 'text-green-300 bg-green-400/20 border-green-400/30' : 'text-red-300 bg-red-400/20 border-red-400/30'
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
        <div className="min-h-screen pt-20 pb-8 relative">
            <GlassmorphismBackground />

            <div className={`relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 transition-opacity duration-500 ${isVisible ? 'opacity-100' : 'opacity-0'}`}>
                {/* Header */}
                <div className="text-center mb-8">
                    <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
                        <span className="bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
                            My Profile
                        </span>
                    </h1>
                    <p className="text-white/80 text-lg max-w-2xl mx-auto leading-relaxed">
                        Manage your account settings and personal information with style
                    </p>
                </div>

                {/* Profile Card */}
                <div className="bg-white/10 backdrop-blur-3xl rounded-3xl shadow-2xl border border-white/20 overflow-hidden">
                    {/* Profile Header */}
                    <div className="relative p-8 bg-gradient-to-br from-purple-500/25 via-blue-500/20 to-indigo-500/25 border-b border-white/20">

                        <div className="flex flex-col md:flex-row items-center space-y-6 md:space-y-0 md:space-x-8">
                            {/* Avatar/Profile Picture */}
                            <div className="relative flex flex-col items-center">
                                <div className="relative">
                                    {(previewImage || user?.profile_picture) ? (
                                        <img
                                            src={previewImage || user?.profile_picture}
                                            alt="Profile"
                                            className="h-32 w-32 object-cover rounded-3xl shadow-2xl border-4 border-white/40 transition-transform duration-300 hover:scale-105"
                                        />
                                    ) : (
                                        <div className={`h-32 w-32 bg-gradient-to-br ${getRoleColor(user?.role)} rounded-3xl flex items-center justify-center text-white font-bold text-4xl shadow-2xl border-4 border-white/40 transition-transform duration-300 hover:scale-105`}>
                                            {user?.first_name?.charAt(0).toUpperCase() || 'U'}
                                        </div>
                                    )}

                                    {/* Status indicator */}
                                    <div className={`absolute -bottom-2 -right-2 h-10 w-10 ${getStatusColor(user?.status)} rounded-full border-4 border-white/60 shadow-lg flex items-center justify-center`}>
                                        <i className="fas fa-check text-sm"></i>
                                    </div>
                                </div>

                                {/* Enhanced Upload Area */}
                                {isEditing && (
                                    <div className="mt-6 w-64">
                                        <div
                                            onDragEnter={handleDrag}
                                            onDragLeave={handleDrag}
                                            onDragOver={handleDrag}
                                            onDrop={handleDrop}
                                            className={`relative border-2 border-dashed rounded-2xl p-6 text-center transition-all duration-300 cursor-pointer ${dragActive
                                                ? 'border-blue-400 bg-blue-400/10 scale-105'
                                                : 'border-white/30 hover:border-white/50 hover:bg-white/5'
                                                }`}
                                        >
                                            <input
                                                id="profile_picture_upload"
                                                type="file"
                                                name="profile_picture"
                                                accept="image/*"
                                                onChange={handleInputChange}
                                                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                                            />

                                            <div className="flex flex-col items-center space-y-3">
                                                <div className="w-16 h-16 bg-gradient-to-br from-blue-500/30 to-purple-500/30 rounded-2xl flex items-center justify-center backdrop-blur-sm border border-white/20 transition-all duration-300 hover:scale-110">
                                                    <i className="fas fa-cloud-upload-alt text-2xl text-white"></i>
                                                </div>
                                                <div>
                                                    <p className="text-white font-semibold mb-1">
                                                        {dragActive ? 'Drop image here' : 'Upload Profile Picture'}
                                                    </p>
                                                    <p className="text-white/60 text-sm">
                                                        Drag & drop or click to browse
                                                    </p>
                                                    <p className="text-white/40 text-xs mt-1">
                                                        Max 5MB • JPG, PNG, GIF
                                                    </p>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </div>

                            {/* User Info */}
                            <div className="flex-1 text-center md:text-left">
                                <h2 className="text-3xl font-bold text-white mb-3">
                                    {user?.first_name} {user?.last_name}
                                </h2>
                                <p className="text-white/80 mb-4 text-lg">{user?.email}</p>

                                <div className="flex flex-wrap justify-center md:justify-start gap-3 mb-4">
                                    <div className={`inline-flex items-center px-6 py-3 bg-gradient-to-r ${getRoleColor(user?.role)} backdrop-blur-sm rounded-2xl border border-white/40 shadow-lg transition-transform duration-300 hover:scale-105`}>
                                        <div className="h-3 w-3 bg-white rounded-full mr-3"></div>
                                        <span className="text-white font-bold uppercase tracking-widest text-sm">
                                            {user?.role}
                                        </span>
                                    </div>

                                    <div className={`px-4 py-2 ${getStatusColor(user?.status)} backdrop-blur-sm rounded-xl border shadow-lg transition-transform duration-300 hover:scale-105`}>
                                        <span className="text-sm font-semibold capitalize">{user?.status}</span>
                                    </div>
                                </div>

                                {/* Additional info */}
                                <div className="grid grid-cols-2 gap-4 text-sm">
                                    <div className="bg-white/10 rounded-xl p-3 backdrop-blur-sm">
                                        <p className="text-white/60 mb-1">Member Since</p>
                                        <p className="text-white font-semibold">
                                            {new Date(user?.created_at).toLocaleDateString()}
                                        </p>
                                    </div>
                                    <div className="bg-white/10 rounded-xl p-3 backdrop-blur-sm">
                                        <p className="text-white/60 mb-1">Last Updated</p>
                                        <p className="text-white font-semibold">
                                            {new Date(user?.updated_at).toLocaleDateString()}
                                        </p>
                                    </div>
                                </div>
                            </div>

                            {/* Edit Button */}
                            {!isEditing && (
                                <button
                                    onClick={() => setIsEditing(true)}
                                    className="px-8 py-4 bg-gradient-to-r from-blue-500/20 to-purple-500/20 backdrop-blur-sm rounded-2xl border border-blue-400/30 text-white font-semibold hover:from-blue-500/30 hover:to-purple-500/30 transition-all duration-300 hover:scale-105 hover:-translate-y-1 shadow-lg hover:shadow-xl"
                                >
                                    <i className="fas fa-edit mr-3"></i>
                                    Edit Profile
                                </button>
                            )}
                        </div>
                    </div>

                    {/* Animated Messages */}
                    {(error || success) && (
                        <div className={`mx-8 mt-6 p-4 rounded-2xl backdrop-blur-sm border transition-all duration-300 ${error
                            ? 'bg-red-500/20 border-red-500/30'
                            : 'bg-green-500/20 border-green-500/30'
                            }`}>
                            <div className="flex items-center">
                                <i className={`${error ? 'fas fa-exclamation-triangle text-red-400' : 'fas fa-check-circle text-green-400'} mr-3 text-lg`}></i>
                                <span className={error ? 'text-red-200' : 'text-green-200'}>{error || success}</span>
                                <button
                                    onClick={() => { setError(''); setSuccess('') }}
                                    className="ml-auto text-white/60 hover:text-white transition-colors duration-200"
                                >
                                    <i className="fas fa-times"></i>
                                </button>
                            </div>
                        </div>
                    )}

                    {/* Profile Form */}
                    <div className="p-8">
                        <form onSubmit={handleSaveProfile} className="space-y-6">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                {/* First Name */}
                                <div className="group">
                                    <label className="block text-white/90 text-sm font-semibold mb-3 transition-colors duration-200 group-focus-within:text-blue-300">
                                        <i className="fas fa-user mr-2"></i>First Name
                                    </label>
                                    <input
                                        type="text"
                                        name="first_name"
                                        value={formData.first_name}
                                        onChange={handleInputChange}
                                        disabled={!isEditing}
                                        className={`w-full px-6 py-4 bg-white/10 backdrop-blur-sm border border-white/20 rounded-2xl text-white placeholder-white/60 focus:outline-none focus:border-blue-400/50 focus:bg-white/15 focus:ring-2 focus:ring-blue-400/20 transition-all duration-300 ${!isEditing ? 'cursor-not-allowed opacity-70' : 'hover:bg-white/15'
                                            }`}
                                        placeholder="Enter your first name"
                                    />
                                </div>

                                {/* Last Name */}
                                <div className="group">
                                    <label className="block text-white/90 text-sm font-semibold mb-3 transition-colors duration-200 group-focus-within:text-blue-300">
                                        <i className="fas fa-user mr-2"></i>Last Name
                                    </label>
                                    <input
                                        type="text"
                                        name="last_name"
                                        value={formData.last_name}
                                        onChange={handleInputChange}
                                        disabled={!isEditing}
                                        className={`w-full px-6 py-4 bg-white/10 backdrop-blur-sm border border-white/20 rounded-2xl text-white placeholder-white/60 focus:outline-none focus:border-blue-400/50 focus:bg-white/15 focus:ring-2 focus:ring-blue-400/20 transition-all duration-300 ${!isEditing ? 'cursor-not-allowed opacity-70' : 'hover:bg-white/15'
                                            }`}
                                        placeholder="Enter your last name"
                                    />
                                </div>
                            </div>

                            {/* Email */}
                            <div className="group">
                                <label className="block text-white/90 text-sm font-semibold mb-3 transition-colors duration-200 group-focus-within:text-blue-300">
                                    <i className="fas fa-envelope mr-2"></i>Email Address
                                </label>
                                <input
                                    type="email"
                                    name="email"
                                    value={formData.email}
                                    onChange={handleInputChange}
                                    disabled={!isEditing}
                                    className={`w-full px-6 py-4 bg-white/10 backdrop-blur-sm border border-white/20 rounded-2xl text-white placeholder-white/60 focus:outline-none focus:border-blue-400/50 focus:bg-white/15 focus:ring-2 focus:ring-blue-400/20 transition-all duration-300 ${!isEditing ? 'cursor-not-allowed opacity-70' : 'hover:bg-white/15'
                                        }`}
                                    placeholder="Enter your email address"
                                />
                            </div>

                            {/* Phone */}
                            <div className="group">
                                <label className="block text-white/90 text-sm font-semibold mb-3 transition-colors duration-200 group-focus-within:text-blue-300">
                                    <i className="fas fa-phone mr-2"></i>Phone Number
                                </label>
                                <input
                                    type="tel"
                                    name="phone"
                                    value={formData.phone}
                                    onChange={handleInputChange}
                                    disabled={!isEditing}
                                    className={`w-full px-6 py-4 bg-white/10 backdrop-blur-sm border border-white/20 rounded-2xl text-white placeholder-white/60 focus:outline-none focus:border-blue-400/50 focus:bg-white/15 focus:ring-2 focus:ring-blue-400/20 transition-all duration-300 ${!isEditing ? 'cursor-not-allowed opacity-70' : 'hover:bg-white/15'
                                        }`}
                                    placeholder="Enter your phone number"
                                />
                            </div>

                            {/* Action Buttons */}
                            {isEditing && (
                                <div className="flex items-center justify-end space-x-4 pt-6">
                                    <button
                                        type="button"
                                        onClick={handleCancel}
                                        className="px-8 py-4 bg-white/10 backdrop-blur-sm border border-white/20 rounded-2xl text-white/80 font-semibold hover:bg-white/15 transition-all duration-300 hover:scale-105"
                                    >
                                        <i className="fas fa-times mr-2"></i>Cancel
                                    </button>
                                    <button
                                        type="submit"
                                        disabled={saving}
                                        className="px-8 py-4 bg-gradient-to-r from-blue-500 to-purple-500 rounded-2xl text-white font-semibold hover:from-blue-600 hover:to-purple-600 transition-all duration-300 hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed flex items-center shadow-lg hover:shadow-xl"
                                    >
                                        {saving ? (
                                            <>
                                                <LoadingSpinner size="sm" />
                                                <span className="ml-3">Saving...</span>
                                            </>
                                        ) : (
                                            <>
                                                <i className="fas fa-save mr-3"></i>
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
                        <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 space-y-4 md:space-y-0">
                            <div>
                                <h3 className="text-2xl font-bold text-white mb-3 flex items-center">
                                    <i className="fas fa-shield-alt mr-3 text-orange-400"></i>
                                    Security Settings
                                </h3>
                                <p className="text-white/70 leading-relaxed">Manage your password and enhance your account security</p>
                            </div>
                            {!showPasswordForm && (
                                <button
                                    onClick={() => setShowPasswordForm(true)}
                                    className="px-8 py-4 bg-gradient-to-r from-orange-500/20 to-red-500/20 backdrop-blur-sm rounded-2xl border border-orange-400/30 text-white font-semibold hover:from-orange-500/30 hover:to-red-500/30 transition-all duration-300 hover:scale-105 shadow-lg hover:shadow-xl"
                                >
                                    <i className="fas fa-key mr-3"></i>
                                    Change Password
                                </button>
                            )}
                        </div>

                        {/* Password Change Form */}
                        {showPasswordForm && (
                            <div className="transition-all duration-300">
                                <form onSubmit={handleChangePassword} className="space-y-6">
                                    {/* Current Password */}
                                    <div className="group">
                                        <label className="block text-white/90 text-sm font-semibold mb-3 transition-colors duration-200 group-focus-within:text-orange-300">
                                            <i className="fas fa-lock mr-2"></i>Current Password
                                        </label>
                                        <input
                                            type="password"
                                            name="current_password"
                                            value={passwordData.current_password}
                                            onChange={handlePasswordChange}
                                            className="w-full px-6 py-4 bg-white/10 backdrop-blur-sm border border-white/20 rounded-2xl text-white placeholder-white/60 focus:outline-none focus:border-orange-400/50 focus:bg-white/15 focus:ring-2 focus:ring-orange-400/20 transition-all duration-300 hover:bg-white/15"
                                            placeholder="Enter your current password"
                                            required
                                        />
                                    </div>

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        {/* New Password */}
                                        <div className="group">
                                            <label className="block text-white/90 text-sm font-semibold mb-3 transition-colors duration-200 group-focus-within:text-orange-300">
                                                <i className="fas fa-key mr-2"></i>New Password
                                            </label>
                                            <input
                                                type="password"
                                                name="new_password"
                                                value={passwordData.new_password}
                                                onChange={handlePasswordChange}
                                                className="w-full px-6 py-4 bg-white/10 backdrop-blur-sm border border-white/20 rounded-2xl text-white placeholder-white/60 focus:outline-none focus:border-orange-400/50 focus:bg-white/15 focus:ring-2 focus:ring-orange-400/20 transition-all duration-300 hover:bg-white/15"
                                                placeholder="Enter new password"
                                                required
                                            />
                                        </div>

                                        {/* Confirm Password */}
                                        <div className="group">
                                            <label className="block text-white/90 text-sm font-semibold mb-3 transition-colors duration-200 group-focus-within:text-orange-300">
                                                <i className="fas fa-check mr-2"></i>Confirm New Password
                                            </label>
                                            <input
                                                type="password"
                                                name="confirm_password"
                                                value={passwordData.confirm_password}
                                                onChange={handlePasswordChange}
                                                className="w-full px-6 py-4 bg-white/10 backdrop-blur-sm border border-white/20 rounded-2xl text-white placeholder-white/60 focus:outline-none focus:border-orange-400/50 focus:bg-white/15 focus:ring-2 focus:ring-orange-400/20 transition-all duration-300 hover:bg-white/15"
                                                placeholder="Confirm new password"
                                                required
                                            />
                                        </div>
                                    </div>

                                    {/* Password Strength Indicator */}
                                    {passwordData.new_password && (
                                        <div className="bg-gradient-to-r from-orange-500/10 to-red-500/10 backdrop-blur-sm border border-orange-400/20 rounded-2xl p-6 transition-opacity duration-300">
                                            <h4 className="text-orange-200 font-semibold mb-4 flex items-center">
                                                <i className="fas fa-shield-check mr-2"></i>
                                                Password Strength
                                            </h4>
                                            <div className="space-y-3">
                                                {[
                                                    { test: passwordData.new_password.length >= 8, text: 'At least 8 characters' },
                                                    { test: /[A-Z]/.test(passwordData.new_password), text: 'Contains uppercase letter' },
                                                    { test: /[a-z]/.test(passwordData.new_password), text: 'Contains lowercase letter' },
                                                    { test: /\d/.test(passwordData.new_password), text: 'Contains number' },
                                                    { test: /[!@#$%^&*(),.?":{}|<>]/.test(passwordData.new_password), text: 'Contains special character' }
                                                ].map((requirement, index) => (
                                                    <div key={index} className="flex items-center space-x-3">
                                                        <div className={`w-5 h-5 rounded-full flex items-center justify-center transition-all duration-200 ${requirement.test
                                                            ? 'bg-green-400 text-white'
                                                            : 'bg-gray-400/30 text-gray-400'
                                                            }`}>
                                                            <i className={`fas ${requirement.test ? 'fa-check' : 'fa-times'} text-xs`}></i>
                                                        </div>
                                                        <span className={`text-sm transition-colors duration-200 ${requirement.test ? 'text-green-300' : 'text-orange-100/80'
                                                            }`}>
                                                            {requirement.text}
                                                        </span>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    )}

                                    {/* Password Match Indicator */}
                                    {passwordData.confirm_password && (
                                        <div className={`p-4 rounded-2xl backdrop-blur-sm border transition-all duration-300 ${passwordData.new_password === passwordData.confirm_password
                                            ? 'bg-green-500/10 border-green-400/20'
                                            : 'bg-red-500/10 border-red-400/20'
                                            }`}>
                                            <div className="flex items-center">
                                                <i className={`fas ${passwordData.new_password === passwordData.confirm_password
                                                    ? 'fa-check-circle text-green-400'
                                                    : 'fa-exclamation-triangle text-red-400'
                                                    } mr-3`}></i>
                                                <span className={
                                                    passwordData.new_password === passwordData.confirm_password
                                                        ? 'text-green-200'
                                                        : 'text-red-200'
                                                }>
                                                    {passwordData.new_password === passwordData.confirm_password
                                                        ? 'Passwords match!'
                                                        : 'Passwords do not match'
                                                    }
                                                </span>
                                            </div>
                                        </div>
                                    )}

                                    {/* Password Action Buttons */}
                                    <div className="flex items-center justify-end space-x-4 pt-6">
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
                                            className="px-8 py-4 bg-white/10 backdrop-blur-sm border border-white/20 rounded-2xl text-white/80 font-semibold hover:bg-white/15 transition-all duration-300 hover:scale-105"
                                        >
                                            <i className="fas fa-times mr-2"></i>Cancel
                                        </button>
                                        <button
                                            type="submit"
                                            disabled={saving}
                                            className="px-8 py-4 bg-gradient-to-r from-orange-500 to-red-500 rounded-2xl text-white font-semibold hover:from-orange-600 hover:to-red-600 transition-all duration-300 hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed flex items-center shadow-lg hover:shadow-xl"
                                        >
                                            {saving ? (
                                                <>
                                                    <LoadingSpinner size="sm" />
                                                    <span className="ml-3">Updating...</span>
                                                </>
                                            ) : (
                                                <>
                                                    <i className="fas fa-shield-alt mr-3"></i>
                                                    Update Password
                                                </>
                                            )}
                                        </button>
                                    </div>
                                </form>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Simplified CSS for subtle animations */}
            <style>{`
                /* Custom scrollbar */
                ::-webkit-scrollbar {
                    width: 8px;
                }
                
                ::-webkit-scrollbar-track {
                    background: rgba(255, 255, 255, 0.1);
                    border-radius: 10px;
                }
                
                ::-webkit-scrollbar-thumb {
                    background: rgba(255, 255, 255, 0.3);
                    border-radius: 10px;
                }
                
                ::-webkit-scrollbar-thumb:hover {
                    background: rgba(255, 255, 255, 0.5);
                }
            `}</style>
        </div>
    )
}

export default ProfilePage