import { useState, useEffect } from 'react'
import { useAuth } from '../contexts/AuthContext'
import GlassmorphismBackground from '../components/GlassmorphismBackground'
import LoadingSpinner from '../components/LoadingSpinner'

function NotificationsPage() {
    const { user } = useAuth()
    const [notifications, setNotifications] = useState([])
    const [loading, setLoading] = useState(false)
    const [filter, setFilter] = useState('all') // all, unread, read

    // Mock notifications data - replace with real API call later
    useEffect(() => {
        const mockNotifications = [
            {
                id: 1,
                type: 'info',
                title: 'Welcome to MySkills!',
                message: 'Your account has been successfully created. Start exploring our training courses.',
                read: false,
                created_at: new Date(Date.now() - 1 * 60 * 60 * 1000), // 1 hour ago
                icon: 'fas fa-info-circle',
                color: 'blue'
            },
            {
                id: 2,
                type: 'success',
                title: 'Profile Updated',
                message: 'Your profile information has been successfully updated.',
                read: true,
                created_at: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000), // 2 days ago
                icon: 'fas fa-check-circle',
                color: 'green'
            },
            {
                id: 3,
                type: 'warning',
                title: 'Training Session Reminder',
                message: 'You have a training session scheduled for tomorrow at 2:00 PM.',
                read: false,
                created_at: new Date(Date.now() - 3 * 60 * 60 * 1000), // 3 hours ago
                icon: 'fas fa-clock',
                color: 'yellow'
            }
        ]

        setNotifications(mockNotifications)
    }, [])

    const filteredNotifications = notifications.filter(notification => {
        if (filter === 'unread') return !notification.read
        if (filter === 'read') return notification.read
        return true
    })

    const markAsRead = (id) => {
        setNotifications(prev =>
            prev.map(notification =>
                notification.id === id
                    ? { ...notification, read: true }
                    : notification
            )
        )
    }

    const markAllAsRead = () => {
        setNotifications(prev =>
            prev.map(notification => ({ ...notification, read: true }))
        )
    }

    const deleteNotification = (id) => {
        setNotifications(prev => prev.filter(notification => notification.id !== id))
    }

    const formatTime = (date) => {
        const now = new Date()
        const diff = now - date
        const minutes = Math.floor(diff / (1000 * 60))
        const hours = Math.floor(diff / (1000 * 60 * 60))
        const days = Math.floor(diff / (1000 * 60 * 60 * 24))

        if (minutes < 60) return `${minutes}m ago`
        if (hours < 24) return `${hours}h ago`
        return `${days}d ago`
    }

    const getColorClasses = (color) => {
        switch (color) {
            case 'blue':
                return {
                    bg: 'from-blue-500/20 to-cyan-500/20',
                    border: 'border-blue-400/30',
                    icon: 'text-blue-400'
                }
            case 'green':
                return {
                    bg: 'from-green-500/20 to-emerald-500/20',
                    border: 'border-green-400/30',
                    icon: 'text-green-400'
                }
            case 'yellow':
                return {
                    bg: 'from-yellow-500/20 to-orange-500/20',
                    border: 'border-yellow-400/30',
                    icon: 'text-yellow-400'
                }
            case 'red':
                return {
                    bg: 'from-red-500/20 to-pink-500/20',
                    border: 'border-red-400/30',
                    icon: 'text-red-400'
                }
            default:
                return {
                    bg: 'from-gray-500/20 to-slate-500/20',
                    border: 'border-gray-400/30',
                    icon: 'text-gray-400'
                }
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
                            Notifications
                        </span>
                    </h1>
                    <p className="text-white/80 text-lg">
                        Stay updated with your latest activities and messages
                    </p>
                </div>

                {/* Filter and Actions */}
                <div className="bg-white/10 backdrop-blur-3xl rounded-3xl shadow-2xl border border-white/20 p-6 mb-6">
                    <div className="flex flex-col sm:flex-row items-center justify-between space-y-4 sm:space-y-0">
                        {/* Filter Buttons */}
                        <div className="flex items-center space-x-2">
                            <button
                                onClick={() => setFilter('all')}
                                className={`px-4 py-2 rounded-xl text-sm font-semibold transition-all duration-300 ${filter === 'all'
                                        ? 'bg-blue-500/30 text-white border border-blue-400/50'
                                        : 'bg-white/10 text-white/80 border border-white/20 hover:bg-white/15'
                                    }`}
                            >
                                All ({notifications.length})
                            </button>
                            <button
                                onClick={() => setFilter('unread')}
                                className={`px-4 py-2 rounded-xl text-sm font-semibold transition-all duration-300 ${filter === 'unread'
                                        ? 'bg-orange-500/30 text-white border border-orange-400/50'
                                        : 'bg-white/10 text-white/80 border border-white/20 hover:bg-white/15'
                                    }`}
                            >
                                Unread ({notifications.filter(n => !n.read).length})
                            </button>
                            <button
                                onClick={() => setFilter('read')}
                                className={`px-4 py-2 rounded-xl text-sm font-semibold transition-all duration-300 ${filter === 'read'
                                        ? 'bg-green-500/30 text-white border border-green-400/50'
                                        : 'bg-white/10 text-white/80 border border-white/20 hover:bg-white/15'
                                    }`}
                            >
                                Read ({notifications.filter(n => n.read).length})
                            </button>
                        </div>

                        {/* Action Buttons */}
                        <div className="flex items-center space-x-2">
                            <button
                                onClick={markAllAsRead}
                                className="px-4 py-2 bg-gradient-to-r from-blue-500/20 to-purple-500/20 backdrop-blur-sm rounded-xl border border-blue-400/30 text-white font-semibold hover:from-blue-500/30 hover:to-purple-500/30 transition-all duration-300"
                            >
                                <i className="fas fa-check-double mr-2"></i>
                                Mark All Read
                            </button>
                        </div>
                    </div>
                </div>

                {/* Notifications List */}
                <div className="space-y-4">
                    {loading ? (
                        <div className="flex items-center justify-center py-12">
                            <LoadingSpinner size="lg" />
                        </div>
                    ) : filteredNotifications.length === 0 ? (
                        <div className="bg-white/10 backdrop-blur-3xl rounded-3xl shadow-2xl border border-white/20 p-12 text-center">
                            <div className="text-6xl text-white/40 mb-4">
                                <i className="fas fa-bell-slash"></i>
                            </div>
                            <h3 className="text-xl font-semibold text-white mb-2">No notifications found</h3>
                            <p className="text-white/70">
                                {filter === 'all'
                                    ? "You're all caught up! No notifications to show."
                                    : `No ${filter} notifications to display.`
                                }
                            </p>
                        </div>
                    ) : (
                        filteredNotifications.map((notification) => {
                            const colors = getColorClasses(notification.color)
                            return (
                                <div
                                    key={notification.id}
                                    className={`bg-white/10 backdrop-blur-3xl rounded-2xl shadow-xl border border-white/20 p-6 transition-all duration-300 hover:bg-white/15 ${!notification.read ? 'border-l-4 border-l-blue-400' : ''
                                        }`}
                                >
                                    <div className="flex items-start space-x-4">
                                        {/* Icon */}
                                        <div className={`flex items-center justify-center w-12 h-12 bg-gradient-to-br ${colors.bg} rounded-xl border ${colors.border} flex-shrink-0`}>
                                            <i className={`${notification.icon} ${colors.icon} text-lg`}></i>
                                        </div>

                                        {/* Content */}
                                        <div className="flex-1 min-w-0">
                                            <div className="flex items-start justify-between">
                                                <div className="flex-1">
                                                    <h3 className="text-white font-semibold text-lg mb-1">
                                                        {notification.title}
                                                        {!notification.read && (
                                                            <span className="ml-2 inline-block w-2 h-2 bg-blue-400 rounded-full"></span>
                                                        )}
                                                    </h3>
                                                    <p className="text-white/80 leading-relaxed mb-3">
                                                        {notification.message}
                                                    </p>
                                                    <div className="flex items-center space-x-4 text-sm text-white/60">
                                                        <span>
                                                            <i className="fas fa-clock mr-1"></i>
                                                            {formatTime(notification.created_at)}
                                                        </span>
                                                        {notification.read && (
                                                            <span className="text-green-400">
                                                                <i className="fas fa-check mr-1"></i>
                                                                Read
                                                            </span>
                                                        )}
                                                    </div>
                                                </div>

                                                {/* Actions */}
                                                <div className="flex items-center space-x-2 ml-4">
                                                    {!notification.read && (
                                                        <button
                                                            onClick={() => markAsRead(notification.id)}
                                                            className="p-2 bg-white/10 backdrop-blur-sm rounded-lg border border-white/20 text-white/80 hover:bg-white/20 hover:text-white transition-all duration-300"
                                                            title="Mark as read"
                                                        >
                                                            <i className="fas fa-check text-sm"></i>
                                                        </button>
                                                    )}
                                                    <button
                                                        onClick={() => deleteNotification(notification.id)}
                                                        className="p-2 bg-red-500/20 backdrop-blur-sm rounded-lg border border-red-400/30 text-red-400 hover:bg-red-500/30 hover:text-red-300 transition-all duration-300"
                                                        title="Delete notification"
                                                    >
                                                        <i className="fas fa-trash text-sm"></i>
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            )
                        })
                    )}
                </div>
            </div>
        </div>
    )
}

export default NotificationsPage
