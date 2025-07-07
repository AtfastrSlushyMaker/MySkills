import { useState } from 'react'
import { useAuth } from '../contexts/AuthContext'
import GlassmorphismBackground from '../components/GlassmorphismBackground'

function SettingsPage() {
    const { user } = useAuth()
    const [settings, setSettings] = useState({
        emailNotifications: true,
        pushNotifications: false,
        darkMode: false,
        language: 'en',
        timezone: 'UTC'
    })

    const handleSettingChange = (setting, value) => {
        setSettings(prev => ({
            ...prev,
            [setting]: value
        }))
    }

    return (
        <div className="min-h-screen pt-20 pb-8">
            <GlassmorphismBackground />

            <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Header */}
                <div className="text-center mb-8">
                    <h1 className="text-4xl font-bold text-white mb-4">
                        <span className="bg-gradient-to-r from-white via-blue-100 to-purple-100 bg-clip-text text-transparent">
                            Settings
                        </span>
                    </h1>
                    <p className="text-white/80 text-lg">
                        Customize your experience and preferences
                    </p>
                </div>

                {/* Settings Card */}
                <div className="bg-white/10 backdrop-blur-3xl rounded-3xl shadow-2xl border border-white/20 overflow-hidden">
                    {/* Profile Settings */}
                    <div className="p-8 border-b border-white/20">
                        <h2 className="text-2xl font-bold text-white mb-6">Account Settings</h2>

                        <div className="space-y-6">
                            {/* Quick Profile Info */}
                            <div className="flex items-center space-x-4 p-4 bg-white/5 backdrop-blur-sm rounded-2xl border border-white/20">
                                <div className="h-16 w-16 bg-gradient-to-br from-purple-400 via-blue-400 to-indigo-400 rounded-2xl flex items-center justify-center text-white font-bold text-xl">
                                    {user?.first_name?.charAt(0).toUpperCase() || 'U'}
                                </div>
                                <div className="flex-1">
                                    <h3 className="text-white font-semibold text-lg">
                                        {user?.first_name} {user?.last_name}
                                    </h3>
                                    <p className="text-white/70">{user?.email}</p>
                                    <span className="inline-block mt-1 px-3 py-1 bg-blue-500/20 backdrop-blur-sm rounded-full border border-blue-400/30 text-xs text-blue-300 font-semibold uppercase tracking-wider">
                                        {user?.role}
                                    </span>
                                </div>
                                <a
                                    href="/profile"
                                    className="px-4 py-2 bg-gradient-to-r from-blue-500/20 to-purple-500/20 backdrop-blur-sm rounded-xl border border-blue-400/30 text-white font-semibold hover:from-blue-500/30 hover:to-purple-500/30 transition-all duration-300"
                                >
                                    Edit Profile
                                </a>
                            </div>
                        </div>
                    </div>

                    {/* Notification Settings */}
                    <div className="p-8 border-b border-white/20">
                        <h2 className="text-2xl font-bold text-white mb-6">Notifications</h2>

                        <div className="space-y-4">
                            <div className="flex items-center justify-between p-4 bg-white/5 backdrop-blur-sm rounded-2xl border border-white/20">
                                <div>
                                    <h3 className="text-white font-semibold">Email Notifications</h3>
                                    <p className="text-white/70 text-sm">Receive notifications via email</p>
                                </div>
                                <button
                                    onClick={() => handleSettingChange('emailNotifications', !settings.emailNotifications)}
                                    className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors duration-300 ${settings.emailNotifications ? 'bg-blue-500' : 'bg-white/20'
                                        }`}
                                >
                                    <span
                                        className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform duration-300 ${settings.emailNotifications ? 'translate-x-6' : 'translate-x-1'
                                            }`}
                                    />
                                </button>
                            </div>

                            <div className="flex items-center justify-between p-4 bg-white/5 backdrop-blur-sm rounded-2xl border border-white/20">
                                <div>
                                    <h3 className="text-white font-semibold">Push Notifications</h3>
                                    <p className="text-white/70 text-sm">Receive browser push notifications</p>
                                </div>
                                <button
                                    onClick={() => handleSettingChange('pushNotifications', !settings.pushNotifications)}
                                    className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors duration-300 ${settings.pushNotifications ? 'bg-blue-500' : 'bg-white/20'
                                        }`}
                                >
                                    <span
                                        className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform duration-300 ${settings.pushNotifications ? 'translate-x-6' : 'translate-x-1'
                                            }`}
                                    />
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* Appearance Settings */}
                    <div className="p-8 border-b border-white/20">
                        <h2 className="text-2xl font-bold text-white mb-6">Appearance</h2>

                        <div className="space-y-4">
                            <div className="flex items-center justify-between p-4 bg-white/5 backdrop-blur-sm rounded-2xl border border-white/20">
                                <div>
                                    <h3 className="text-white font-semibold">Dark Mode</h3>
                                    <p className="text-white/70 text-sm">Toggle dark/light theme</p>
                                </div>
                                <button
                                    onClick={() => handleSettingChange('darkMode', !settings.darkMode)}
                                    className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors duration-300 ${settings.darkMode ? 'bg-purple-500' : 'bg-white/20'
                                        }`}
                                >
                                    <span
                                        className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform duration-300 ${settings.darkMode ? 'translate-x-6' : 'translate-x-1'
                                            }`}
                                    />
                                </button>
                            </div>

                            <div className="p-4 bg-white/5 backdrop-blur-sm rounded-2xl border border-white/20">
                                <h3 className="text-white font-semibold mb-3">Language</h3>
                                <select
                                    value={settings.language}
                                    onChange={(e) => handleSettingChange('language', e.target.value)}
                                    className="w-full px-4 py-2 bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl text-white focus:outline-none focus:border-blue-400/50"
                                >
                                    <option value="en">English</option>
                                    <option value="fr">Français</option>
                                    <option value="es">Español</option>
                                    <option value="de">Deutsch</option>
                                </select>
                            </div>

                            <div className="p-4 bg-white/5 backdrop-blur-sm rounded-2xl border border-white/20">
                                <h3 className="text-white font-semibold mb-3">Timezone</h3>
                                <select
                                    value={settings.timezone}
                                    onChange={(e) => handleSettingChange('timezone', e.target.value)}
                                    className="w-full px-4 py-2 bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl text-white focus:outline-none focus:border-blue-400/50"
                                >
                                    <option value="UTC">UTC</option>
                                    <option value="America/New_York">Eastern Time</option>
                                    <option value="America/Chicago">Central Time</option>
                                    <option value="America/Denver">Mountain Time</option>
                                    <option value="America/Los_Angeles">Pacific Time</option>
                                    <option value="Europe/London">London</option>
                                    <option value="Europe/Paris">Paris</option>
                                    <option value="Asia/Tokyo">Tokyo</option>
                                </select>
                            </div>
                        </div>
                    </div>

                    {/* Privacy & Security */}
                    <div className="p-8">
                        <h2 className="text-2xl font-bold text-white mb-6">Privacy & Security</h2>

                        <div className="space-y-4">
                            <a
                                href="/profile"
                                className="flex items-center justify-between p-4 bg-white/5 backdrop-blur-sm rounded-2xl border border-white/20 hover:bg-white/10 transition-all duration-300 group"
                            >
                                <div className="flex items-center space-x-3">
                                    <div className="flex items-center justify-center w-10 h-10 bg-gradient-to-br from-blue-500/20 to-purple-500/20 rounded-xl border border-blue-400/30">
                                        <i className="fas fa-key text-blue-400"></i>
                                    </div>
                                    <div>
                                        <h3 className="text-white font-semibold">Change Password</h3>
                                        <p className="text-white/70 text-sm">Update your account password</p>
                                    </div>
                                </div>
                                <i className="fas fa-chevron-right text-white/60 group-hover:text-white transition-colors duration-300"></i>
                            </a>

                            <div className="flex items-center justify-between p-4 bg-white/5 backdrop-blur-sm rounded-2xl border border-white/20">
                                <div className="flex items-center space-x-3">
                                    <div className="flex items-center justify-center w-10 h-10 bg-gradient-to-br from-green-500/20 to-emerald-500/20 rounded-xl border border-green-400/30">
                                        <i className="fas fa-shield-alt text-green-400"></i>
                                    </div>
                                    <div>
                                        <h3 className="text-white font-semibold">Two-Factor Authentication</h3>
                                        <p className="text-white/70 text-sm">Add an extra layer of security</p>
                                    </div>
                                </div>
                                <span className="px-3 py-1 bg-orange-500/20 backdrop-blur-sm rounded-xl border border-orange-400/30 text-xs text-orange-300 font-semibold">
                                    Coming Soon
                                </span>
                            </div>

                            <div className="flex items-center justify-between p-4 bg-white/5 backdrop-blur-sm rounded-2xl border border-white/20">
                                <div className="flex items-center space-x-3">
                                    <div className="flex items-center justify-center w-10 h-10 bg-gradient-to-br from-purple-500/20 to-pink-500/20 rounded-xl border border-purple-400/30">
                                        <i className="fas fa-download text-purple-400"></i>
                                    </div>
                                    <div>
                                        <h3 className="text-white font-semibold">Download My Data</h3>
                                        <p className="text-white/70 text-sm">Export your account data</p>
                                    </div>
                                </div>
                                <span className="px-3 py-1 bg-orange-500/20 backdrop-blur-sm rounded-xl border border-orange-400/30 text-xs text-orange-300 font-semibold">
                                    Coming Soon
                                </span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Save Button */}
                <div className="mt-8 text-center">
                    <button
                        onClick={() => {
                            // Here you would typically save settings to backend
                            console.log('Saving settings:', settings)
                        }}
                        className="px-8 py-4 bg-gradient-to-r from-blue-500 to-purple-500 rounded-2xl text-white font-semibold hover:from-blue-600 hover:to-purple-600 transition-all duration-300 hover:scale-105"
                    >
                        <i className="fas fa-save mr-2"></i>
                        Save Settings
                    </button>
                </div>
            </div>
        </div>
    )
}

export default SettingsPage
