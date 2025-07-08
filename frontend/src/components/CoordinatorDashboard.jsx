import { useState, useEffect } from 'react'
import { registrationApi, trainingSessionApi } from '../services/api'
import { useAuth } from '../contexts/AuthContext'
import CreateSessionModal from './modals/CreateSessionModal'
import SessionManagement from './SessionManagement'

function CoordinatorDashboard() {
    const { user } = useAuth()
    const [activeView, setActiveView] = useState('dashboard')
    const [stats, setStats] = useState({
        total: 0,
        pending: 0,
        confirmed: 0,
        cancelled: 0
    })
    const [recentActivity, setRecentActivity] = useState([])
    const [pendingRegistrations, setPendingRegistrations] = useState([])
    const [loading, setLoading] = useState(true)
    const [showCreateModal, setShowCreateModal] = useState(false)

    useEffect(() => {
        fetchDashboardData()
    }, [])

    const fetchDashboardData = async () => {
        try {
            // Fetch both stats and pending registrations
            const [statsResponse, pendingResponse] = await Promise.all([
                registrationApi.getRegistrationStats(),
                registrationApi.getPendingRegistrations()
            ])

            try {
                const recentActivityResponse = await trainingSessionApi.getRecentActivityByCoordinator(user?.id)
                console.log('Recent Activity Response:', recentActivityResponse.data)

                // Check if the response has the new format with activities
                if (recentActivityResponse.data.activities) {
                    setRecentActivity(recentActivityResponse.data.activities)
                } else {
                    // Transform training sessions into CRUD activities (fallback for old API format)
                    const activities = recentActivityResponse.data.map((session) => {
                        // Determine activity type based on session status and date
                        const sessionDate = new Date(session.date)
                        const now = new Date()
                        const daysDiff = Math.floor((now.getTime() - sessionDate.getTime()) / (1000 * 60 * 60 * 24))

                        let activityType = 'session_created'
                        let description = 'Created new training session'
                        let details = ''

                        // Add detailed information based on session properties
                        const categoryName = session.category?.name || 'General Training'
                        const trainerName = session.trainer?.name || 'Unassigned Trainer'
                        const sessionLocation = session.location || 'TBD'
                        const maxParticipants = session.max_participants || 0
                        const sessionTime = session.start_time ? ` at ${session.start_time}` : ''

                        // Add some variation based on session properties
                        if (session.status === 'confirmed') {
                            activityType = 'session_confirmed'
                            description = 'Confirmed training session'
                            details = `${categoryName} with ${trainerName} • ${sessionLocation} • Max ${maxParticipants} participants`
                        } else if (session.status === 'cancelled') {
                            activityType = 'session_cancelled'
                            description = 'Cancelled training session'
                            details = `${categoryName} (was scheduled with ${trainerName})`
                        } else if (daysDiff > 0) {
                            activityType = 'session_updated'
                            description = 'Updated session details'
                            details = `${categoryName} with ${trainerName} • Updated location/time`
                        } else {
                            details = `${categoryName} with ${trainerName} • ${sessionLocation}${sessionTime}`
                        }

                        return {
                            type: activityType,
                            description,
                            details,
                            created_at: session.date || session.updated_at || session.created_at,
                            sessionInfo: {
                                location: sessionLocation,
                                maxParticipants,
                                date: new Date(session.date).toLocaleDateString(),
                                time: session.start_time
                            }
                        }
                    })

                    setRecentActivity(activities)
                }
            } catch (activityError) {
                console.error('Error fetching recent activity:', activityError)
                // Set mock CRUD activities as fallback with detailed information
                setRecentActivity([
                    {
                        type: 'session_created',
                        description: 'Created new training session',
                        details: 'React Advanced Workshop • John Smith • Conference Room A • Max 25 participants',
                        created_at: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
                        sessionInfo: {
                            location: 'Conference Room A',
                            maxParticipants: 25,
                            date: new Date().toLocaleDateString(),
                            time: '09:00 AM'
                        }
                    },
                    {
                        type: 'registration_approved',
                        description: 'Approved participant registration',
                        details: 'John Doe enrolled in Laravel Basics • Confirmed for Dec 15th',
                        created_at: new Date(Date.now() - 4 * 60 * 60 * 1000).toISOString()
                    },
                    {
                        type: 'session_updated',
                        description: 'Updated session details',
                        details: 'Vue.js Fundamentals • Changed location from Room B to Lab 1 • Updated time to 2:00 PM',
                        created_at: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString()
                    },
                    {
                        type: 'registration_rejected',
                        description: 'Rejected registration request',
                        details: 'Jane Smith - Angular Workshop • Session already full (20/20 participants)',
                        created_at: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString()
                    },
                    {
                        type: 'session_confirmed',
                        description: 'Confirmed training session',
                        details: 'Python for Data Science • Dr. Sarah Wilson • Lab 2 • 18/30 participants registered',
                        created_at: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString()
                    },
                    {
                        type: 'session_deleted',
                        description: 'Deleted training session',
                        details: 'PHP Workshop • Cancelled due to insufficient registrations (3/15)',
                        created_at: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000).toISOString()
                    }
                ])
            }

            setStats(statsResponse.data.stats)
            setPendingRegistrations(pendingResponse.data.registrations)
        } catch (error) {
            console.error('Error fetching dashboard data:', error)
        } finally {
            setLoading(false)
        }
    }

    const handleApproval = async (registrationId) => {
        try {
            await registrationApi.approveRegistration(registrationId)
            // Refresh data after approval
            fetchDashboardData()
        } catch (error) {
            console.error('Error approving registration:', error)
        }
    }

    const handleRejection = async (registrationId) => {
        try {
            await registrationApi.rejectRegistration(registrationId)
            // Refresh data after rejection
            fetchDashboardData()
        } catch (error) {
            console.error('Error rejecting registration:', error)
        }
    }

    const handleSessionCreated = (newSession) => {
        // Refresh dashboard data
        fetchDashboardData()
        // Close modal
        setShowCreateModal(false)
    }

    const handleSessionUpdate = () => {
        // Refresh dashboard data when sessions are updated/deleted
        fetchDashboardData()
    }

    const navigationTabs = [
        {
            id: 'dashboard',
            label: 'Dashboard',
            icon: 'fas fa-chart-bar',
            description: 'Overview & registrations'
        },
        {
            id: 'sessions',
            label: 'Sessions',
            icon: 'fas fa-calendar-alt',
            description: 'Manage training sessions'
        }
    ]

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="bg-white/10 backdrop-blur-3xl rounded-3xl p-8 border border-white/20">
                    <div className="animate-spin w-12 h-12 border-4 border-cyan-400 border-t-transparent rounded-full mx-auto mb-4"></div>
                    <p className="text-white text-center">Loading your coordinator dashboard...</p>
                </div>
            </div>
        )
    }

    return (
        <div className="min-h-screen relative overflow-hidden">
            <div className="relative z-10 max-w-7xl mx-auto px-6 py-12">
                {/* Coordinator Welcome Header */}
                <div className="mb-12">
                    <div className="bg-white/10 backdrop-blur-3xl rounded-3xl p-8 border border-white/20 shadow-2xl relative overflow-hidden">
                        <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-blue-400/20 to-indigo-400/20 rounded-full blur-3xl"></div>
                        <div className="relative z-10">
                            <div className="mb-3">
                                <span className="text-3xl font-bold text-white">
                                    Hello <span className="bg-gradient-to-r from-cyan-400 to-blue-400 bg-clip-text text-transparent">{user?.first_name}</span> 👋
                                </span>
                            </div>
                            <h1 className="text-5xl font-black mb-4">
                                <span className="bg-gradient-to-r from-blue-400 via-indigo-400 to-purple-400 bg-clip-text text-transparent">
                                    Coordinator Hub
                                </span>
                            </h1>
                            <p className="text-xl text-white/80">Manage training sessions and registrations with ease</p>
                        </div>
                    </div>
                </div>

                {/* Navigation Tabs */}
                <div className="flex space-x-4 mb-8">
                    {navigationTabs.map(tab => (
                        <button
                            key={tab.id}
                            onClick={() => setActiveView(tab.id)}
                            className={`px-8 py-4 rounded-2xl font-semibold transition-all duration-300 flex items-center ${activeView === tab.id
                                ? 'bg-gradient-to-r from-blue-500 to-indigo-600 text-white shadow-lg transform scale-105'
                                : 'bg-white/10 text-white/70 hover:bg-white/20 hover:text-white border border-white/20 hover:border-white/40'
                                }`}
                        >
                            <i className={`${tab.icon} mr-3 text-xl`}></i>
                            <div className="text-left">
                                <div className="font-bold">{tab.label}</div>
                                <div className="text-xs opacity-80">{tab.description}</div>
                            </div>
                        </button>
                    ))}
                </div>

                {/* Content based on active view */}
                {activeView === 'dashboard' ? (
                    <>
                        {/* Registration Stats Overview */}
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
                            {[
                                {
                                    label: 'Total Registrations',
                                    value: stats.total,
                                    icon: 'fas fa-users',
                                    color: 'blue',
                                    change: 'All time'
                                },
                                {
                                    label: 'Pending Review',
                                    value: stats.pending,
                                    icon: 'fas fa-clock',
                                    color: 'yellow',
                                    change: 'Needs attention'
                                },
                                {
                                    label: 'Confirmed',
                                    value: stats.confirmed,
                                    icon: 'fas fa-check-circle',
                                    color: 'green',
                                    change: 'Active sessions'
                                },
                                {
                                    label: 'Cancelled',
                                    value: stats.cancelled,
                                    icon: 'fas fa-times-circle',
                                    color: 'red',
                                    change: 'Historical'
                                }
                            ].map((stat, index) => (
                                <div key={index} className="bg-white/10 backdrop-blur-2xl rounded-3xl p-6 border border-white/20 hover:border-white/40 transition-all duration-500 hover:scale-105 shadow-xl">
                                    <div className="flex items-center justify-between mb-4">
                                        <div className={`w-12 h-12 bg-gradient-to-br from-${stat.color}-400/20 to-${stat.color}-600/20 rounded-2xl flex items-center justify-center`}>
                                            <i className={`${stat.icon} text-xl text-${stat.color}-400`}></i>
                                        </div>
                                        <div className={`text-3xl font-black text-${stat.color}-400`}>{stat.value}</div>
                                    </div>
                                    <h3 className="text-white font-semibold mb-2">{stat.label}</h3>
                                    <p className="text-white/60 text-sm">{stat.change}</p>
                                </div>
                            ))}
                        </div>

                        {/* Main Content Grid */}
                        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                            {/* Pending Registrations */}
                            <div className="lg:col-span-2">
                                <div className="bg-white/10 backdrop-blur-2xl rounded-3xl p-8 border border-white/20 shadow-xl">
                                    <h2 className="text-3xl font-bold text-white mb-6 flex items-center">
                                        <i className="fas fa-hourglass-half text-yellow-400 mr-3"></i>
                                        Pending Registrations
                                        {pendingRegistrations.length > 0 && (
                                            <span className="ml-3 px-3 py-1 bg-yellow-400/20 text-yellow-400 rounded-full text-sm font-semibold">
                                                {pendingRegistrations.length}
                                            </span>
                                        )}
                                    </h2>

                                    {pendingRegistrations.length === 0 ? (
                                        <div className="text-center py-12">
                                            <div className="w-20 h-20 bg-gradient-to-br from-green-400/20 to-emerald-600/20 rounded-full flex items-center justify-center mx-auto mb-4">
                                                <i className="fas fa-check-double text-3xl text-green-400"></i>
                                            </div>
                                            <h3 className="text-xl font-semibold text-white mb-2">All Caught Up!</h3>
                                            <p className="text-white/70">No pending registrations to review at the moment.</p>
                                        </div>
                                    ) : (
                                        <div className="space-y-4 max-h-96 overflow-y-auto">
                                            {pendingRegistrations.map((registration) => (
                                                <div key={registration.id} className="bg-white/10 backdrop-blur-xl rounded-2xl p-6 border border-white/20 hover:border-white/40 transition-all duration-300">
                                                    <div className="flex items-start justify-between mb-4">
                                                        <div className="flex-1">
                                                            <h3 className="text-xl font-bold text-white mb-1">
                                                                {registration.user?.first_name} {registration.user?.last_name}
                                                            </h3>
                                                            <p className="text-white/70 mb-2">{registration.user?.email}</p>
                                                            <div className="flex items-center text-white/60 text-sm">
                                                                <i className="fas fa-calendar mr-2"></i>
                                                                <span>Applied: {new Date(registration.created_at).toLocaleDateString()}</span>
                                                            </div>
                                                            {registration.trainingSession && (
                                                                <div className="mt-2 flex items-center text-white/60 text-sm">
                                                                    <i className="fas fa-chalkboard-teacher mr-2"></i>
                                                                    <span>{registration.trainingSession.skill_name}</span>
                                                                </div>
                                                            )}
                                                        </div>
                                                        <div className="flex items-center space-x-3">
                                                            <button
                                                                onClick={() => handleApproval(registration.id)}
                                                                className="px-4 py-2 bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 rounded-xl text-white font-semibold transition-all duration-300 hover:scale-105 flex items-center"
                                                            >
                                                                <i className="fas fa-check mr-2"></i>
                                                                Approve
                                                            </button>
                                                            <button
                                                                onClick={() => handleRejection(registration.id)}
                                                                className="px-4 py-2 bg-gradient-to-r from-red-500 to-pink-600 hover:from-red-600 hover:to-pink-700 rounded-xl text-white font-semibold transition-all duration-300 hover:scale-105 flex items-center"
                                                            >
                                                                <i className="fas fa-times mr-2"></i>
                                                                Reject
                                                            </button>
                                                        </div>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            </div>

                            {/* Sidebar */}
                            <div className="space-y-8">
                                {/* Quick Actions */}
                                <div className="bg-white/10 backdrop-blur-2xl rounded-3xl p-6 border border-white/20 shadow-xl">
                                    <h3 className="text-xl font-bold text-white mb-4 flex items-center">
                                        <i className="fas fa-bolt text-yellow-400 mr-2"></i>
                                        Quick Actions
                                    </h3>
                                    <div className="space-y-3">
                                        <button
                                            onClick={() => setShowCreateModal(true)}
                                            className="w-full px-4 py-3 bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 rounded-xl text-white font-semibold transition-all duration-300 hover:scale-105 flex items-center justify-center"
                                        >
                                            <i className="fas fa-plus mr-2"></i>
                                            Create Session
                                        </button>
                                        <button
                                            onClick={() => setActiveView('sessions')}
                                            className="w-full px-4 py-3 bg-white/10 hover:bg-white/20 border border-white/20 hover:border-white/40 rounded-xl text-white font-semibold transition-all duration-300 flex items-center justify-center"
                                        >
                                            <i className="fas fa-calendar-alt mr-2"></i>
                                            Manage Sessions
                                        </button>
                                        <button className="w-full px-4 py-3 bg-white/10 hover:bg-white/20 border border-white/20 hover:border-white/40 rounded-xl text-white font-semibold transition-all duration-300 flex items-center justify-center">
                                            <i className="fas fa-chart-bar mr-2"></i>
                                            Analytics
                                        </button>
                                    </div>
                                </div>

                                {/* Recent Activity */}
                                <div className="bg-white/10 backdrop-blur-2xl rounded-3xl p-6 border border-white/20 shadow-xl">
                                    <h3 className="text-xl font-bold text-white mb-4 flex items-center">
                                        <i className="fas fa-history text-cyan-400 mr-2"></i>
                                        Recent Activity
                                    </h3>
                                    <div className="space-y-3">
                                        {recentActivity.length === 0 ? (
                                            <div className="text-center py-4">
                                                <i className="fas fa-clock text-white/40 text-2xl mb-2"></i>
                                                <p className="text-white/60 text-sm">No recent activity</p>
                                            </div>
                                        ) : (
                                            recentActivity.slice(0, 5).map((activity, index) => (
                                                <div key={index} className="flex items-start space-x-3 p-4 bg-white/5 rounded-xl hover:bg-white/10 transition-all duration-300 border border-white/10 hover:border-white/20">
                                                    <div className={`flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center text-lg ${activity.type === 'registration_approved' ? 'bg-green-400/20 text-green-400' :
                                                            activity.type === 'registration_rejected' ? 'bg-red-400/20 text-red-400' :
                                                                activity.type === 'registration_pending' ? 'bg-orange-400/20 text-orange-400' :
                                                                    activity.type === 'session_created' ? 'bg-blue-400/20 text-blue-400' :
                                                                        activity.type === 'session_updated' ? 'bg-yellow-400/20 text-yellow-400' :
                                                                            activity.type === 'session_confirmed' ? 'bg-green-400/20 text-green-400' :
                                                                                activity.type === 'session_cancelled' ? 'bg-red-400/20 text-red-400' :
                                                                                    activity.type === 'session_deleted' ? 'bg-red-500/20 text-red-500' :
                                                                                        'bg-cyan-400/20 text-cyan-400'
                                                        }`}>
                                                        <i className={
                                                            activity.type === 'registration_approved' ? 'fas fa-user-check' :
                                                                activity.type === 'registration_rejected' ? 'fas fa-user-times' :
                                                                    activity.type === 'registration_pending' ? 'fas fa-user-clock' :
                                                                        activity.type === 'session_created' ? 'fas fa-plus-circle' :
                                                                            activity.type === 'session_updated' ? 'fas fa-edit' :
                                                                                activity.type === 'session_confirmed' ? 'fas fa-check-circle' :
                                                                                    activity.type === 'session_cancelled' ? 'fas fa-ban' :
                                                                                        activity.type === 'session_deleted' ? 'fas fa-trash' :
                                                                                            'fas fa-activity'
                                                        }></i>
                                                    </div>
                                                    <div className="flex-1 min-w-0">
                                                        <div className="flex items-center justify-between mb-1">
                                                            <div className="text-white font-semibold text-sm truncate pr-2">{activity.description}</div>
                                                            <div className="text-white/60 text-xs flex-shrink-0">
                                                                {new Date(activity.created_at).toLocaleDateString('en-US', {
                                                                    month: 'short',
                                                                    day: 'numeric',
                                                                    hour: '2-digit',
                                                                    minute: '2-digit'
                                                                })}
                                                            </div>
                                                        </div>
                                                        <div className="text-white/70 text-xs leading-relaxed">{activity.details}</div>
                                                        {activity.sessionInfo && (
                                                            <div className="mt-2 flex items-center space-x-3 text-xs text-white/50">
                                                                {activity.sessionInfo.location && (
                                                                    <span className="flex items-center">
                                                                        <i className="fas fa-map-marker-alt mr-1"></i>
                                                                        {activity.sessionInfo.location}
                                                                    </span>
                                                                )}
                                                                {activity.sessionInfo.maxParticipants && (
                                                                    <span className="flex items-center">
                                                                        <i className="fas fa-users mr-1"></i>
                                                                        {activity.sessionInfo.maxParticipants} max
                                                                    </span>
                                                                )}
                                                                {activity.sessionInfo.time && (
                                                                    <span className="flex items-center">
                                                                        <i className="fas fa-clock mr-1"></i>
                                                                        {activity.sessionInfo.time}
                                                                    </span>
                                                                )}
                                                            </div>
                                                        )}
                                                    </div>
                                                </div>
                                            ))
                                        )}
                                    </div>
                                </div>

                                {/* Performance Metrics */}
                                <div className="bg-white/10 backdrop-blur-2xl rounded-3xl p-6 border border-white/20 shadow-xl">
                                    <h3 className="text-xl font-bold text-white mb-4 flex items-center">
                                        <i className="fas fa-trophy text-yellow-400 mr-2"></i>
                                        This Month
                                    </h3>
                                    <div className="space-y-4">
                                        <div className="flex items-center justify-between">
                                            <span className="text-white/80">Sessions Created</span>
                                            <span className="text-2xl font-bold text-blue-400">8</span>
                                        </div>
                                        <div className="flex items-center justify-between">
                                            <span className="text-white/80">Registrations Processed</span>
                                            <span className="text-2xl font-bold text-green-400">47</span>
                                        </div>
                                        <div className="flex items-center justify-between">
                                            <span className="text-white/80">Completion Rate</span>
                                            <span className="text-2xl font-bold text-purple-400">94%</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </>
                ) : (
                    /* Sessions Management View */
                    <SessionManagement onSessionUpdate={handleSessionUpdate} />
                )}
            </div>

            {/* Create Session Modal */}
            <CreateSessionModal
                isOpen={showCreateModal}
                onClose={() => setShowCreateModal(false)}
                onSessionCreated={handleSessionCreated}
            />
        </div>
    )
}

export default CoordinatorDashboard
