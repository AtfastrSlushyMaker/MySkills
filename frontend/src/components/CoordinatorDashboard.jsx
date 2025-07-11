import { useState, useEffect } from 'react'
import { registrationApi, trainingSessionApi, categoryApi, userApi } from '../services/api'
import { useAuth } from '../contexts/AuthContext'
import CreateSessionModal from './modals/CreateSessionModal'
import SessionManagement from './SessionManagement'

function CoordinatorDashboard() {

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
    const [categories, setCategories] = useState([])
    const [trainers, setTrainers] = useState([])
    const { user } = useAuth()

    useEffect(() => {
        if (user?.id) {
            fetchDashboardData();
        }
    }, [user?.id])

    useEffect(() => {
        fetchCategoriesAndTrainers()
    }, [])

    const fetchDashboardData = async () => {
        try {
            const [statsResponse, pendingResponse] = await Promise.all([
                registrationApi.getRegistrationStats(),
                registrationApi.getPendingRegistrations(user?.id)
            ])

            try {
                const recentActivityResponse = await trainingSessionApi.getRecentActivityByCoordinator(user?.id)

                if (recentActivityResponse.data.activities) {
                    setRecentActivity(recentActivityResponse.data.activities)
                } else {
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
                // Remove mock CRUD activities fallback
                setRecentActivity([])
            }

            setStats(statsResponse.data.stats)
            setPendingRegistrations(
                Array.isArray(pendingResponse.data?.registrations)
                    ? pendingResponse.data.registrations
                    : Array.isArray(pendingResponse.data)
                        ? pendingResponse.data
                        : []
            )
        } catch (error) {
            console.error('Error fetching dashboard data:', error)
        } finally {
            setLoading(false)
        }
    }

    const fetchCategoriesAndTrainers = async () => {
        try {
            const [catRes, trainerRes] = await Promise.all([
                categoryApi.getAllCategories(),
                userApi.getAllTrainers()
            ])
            setCategories(catRes.data)
            setTrainers(trainerRes.data)
        } catch (err) {
            setCategories([])
            setTrainers([])
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
                                            {pendingRegistrations.map((registration) => {
                                                const applicantName = registration.user?.first_name && registration.user?.last_name
                                                    ? `${registration.user.first_name} ${registration.user.last_name}`
                                                    : 'Applicant';
                                                const applicantEmail = registration.user?.email || '';
                                                const session = registration.training_session || {};
                                                const sessionName = session.skill_name || 'Training Session';
                                                const sessionCategory = session.category?.name || '';
                                                const trainerName = session.trainer?.first_name && session.trainer?.last_name ? `${session.trainer.first_name} ${session.trainer.last_name}` : session.trainer?.name || '';
                                                const maxParticipants = session.max_participants ? `Max ${session.max_participants}` : '';
                                                const sessionDate = session.date ? new Date(session.date).toLocaleDateString() : '-';
                                                const sessionTime = session.start_time && session.end_time ? `${session.start_time} - ${session.end_time}` : session.start_time ? session.start_time : '';
                                                const sessionLocation = session.location || 'No location specified';
                                                const appliedDate = registration.created_at ? new Date(registration.created_at).toLocaleDateString() : '-';
                                                const status = registration.status ? registration.status.charAt(0).toUpperCase() + registration.status.slice(1) : 'Pending';
                                                return (
                                                    <div key={registration.id} className="bg-white/10 backdrop-blur-xl rounded-2xl p-6 border border-white/20 hover:border-white/40 transition-all duration-300 shadow-lg">
                                                        <div className="flex items-start justify-between mb-4">
                                                            <div className="flex-1">
                                                                <h3 className="text-xl font-bold text-white mb-1">{applicantName}</h3>
                                                                <p className="text-white/70 mb-2">{applicantEmail}</p>
                                                                <div className="flex flex-wrap gap-x-6 gap-y-1 mb-2">
                                                                    <div className="flex items-center text-white/60 text-sm">
                                                                        <i className="fas fa-calendar mr-2"></i>
                                                                        <span>Applied: {appliedDate}</span>
                                                                    </div>
                                                                    <div className="flex items-center text-white/60 text-sm">
                                                                        <i className="fas fa-chalkboard-teacher mr-2"></i>
                                                                        <span>Session: {sessionName}</span>
                                                                    </div>
                                                                    {sessionCategory && (
                                                                        <div className="flex items-center text-white/60 text-sm">
                                                                            <i className="fas fa-layer-group mr-2"></i>
                                                                            <span>Category: {sessionCategory}</span>
                                                                        </div>
                                                                    )}
                                                                    {trainerName && (
                                                                        <div className="flex items-center text-white/60 text-sm">
                                                                            <i className="fas fa-user-tie mr-2"></i>
                                                                            <span>Trainer: {trainerName}</span>
                                                                        </div>
                                                                    )}
                                                                    {maxParticipants && (
                                                                        <div className="flex items-center text-white/60 text-sm">
                                                                            <i className="fas fa-users mr-2"></i>
                                                                            <span>{maxParticipants}</span>
                                                                        </div>
                                                                    )}
                                                                    <div className="flex items-center text-white/60 text-sm">
                                                                        <i className="fas fa-map-marker-alt mr-2"></i>
                                                                        <span>Location: {sessionLocation}</span>
                                                                    </div>
                                                                    <div className="flex items-center text-white/60 text-sm">
                                                                        <i className="fas fa-clock mr-2"></i>
                                                                        <span>Date: {sessionDate}</span>
                                                                        {sessionTime && (
                                                                            <span className="ml-2">Time: {sessionTime}</span>
                                                                        )}
                                                                    </div>
                                                                </div>
                                                                <div className="mt-2 text-white/80 text-sm font-semibold">
                                                                    Status: <span className="px-2 py-1 rounded bg-yellow-400/20 text-yellow-400">{status}</span>
                                                                </div>
                                                            </div>
                                                            <div className="flex items-center space-x-3">
                                                                <button
                                                                    onClick={() => handleApproval(registration.id)}
                                                                    className="px-4 py-2 border-2 border-green-400 text-green-400 bg-transparent hover:bg-green-400/10 hover:border-green-500 hover:text-green-500 rounded-xl font-semibold transition-all duration-200 flex items-center group"
                                                                    aria-label="Approve registration"
                                                                >
                                                                    <i className="fas fa-check mr-2 group-hover:scale-125 transition-transform duration-200"></i>
                                                                    Approve
                                                                </button>
                                                                <button
                                                                    onClick={() => handleRejection(registration.id)}
                                                                    className="px-4 py-2 border-2 border-red-400 text-red-400 bg-transparent hover:bg-red-400/10 hover:border-red-500 hover:text-red-500 rounded-xl font-semibold transition-all duration-200 flex items-center group"
                                                                    aria-label="Reject registration"
                                                                >
                                                                    <i className="fas fa-times mr-2 group-hover:scale-125 transition-transform duration-200"></i>
                                                                    Reject
                                                                </button>
                                                            </div>
                                                        </div>
                                                    </div>
                                                );
                                            })}
                                        </div>
                                    )}
                                </div>
                            </div>

                            {/* Recent Activity Feed - Hidden for now
                            <div className="bg-white/10 backdrop-blur-2xl rounded-3xl p-8 border border-white/20 shadow-xl">
                                <h2 className="text-3xl font-bold text-white mb-6 flex items-center">
                                    <i className="fas fa-bell text-blue-400 mr-3"></i>
                                    Recent Activity
                                </h2>

                                {recentActivity.length === 0 ? (
                                    <div className="text-center py-12">
                                        <div className="w-20 h-20 bg-gradient-to-br from-green-400/20 to-emerald-600/20 rounded-full flex items-center justify-center mx-auto mb-4">
                                            <i className="fas fa-check-double text-3xl text-green-400"></i>
                                        </div>
                                        <h3 className="text-xl font-semibold text-white mb-2">No Recent Activity</h3>
                                        <p className="text-white/70">You're all caught up! No recent activities to show.</p>
                                    </div>
                                ) : (
                                    <div className="space-y-4 max-h-96 overflow-y-auto">
                                        {recentActivity.map((activity, index) => (
                                            <div key={index} className="p-4 bg-white/10 rounded-xl border border-white/20 shadow-md transition-all duration-300 hover:scale-105">
                                                <div className="flex items-center mb-2">
                                                    <div className={`w-10 h-10 rounded-full flex items-center justify-center mr-3 ${activity.type === 'session_created' ? 'bg-green-500/20' : activity.type === 'session_confirmed' ? 'bg-blue-500/20' : 'bg-red-500/20'}`}>
                                                        <i className={`fas fa-${activity.type === 'session_created' ? 'plus' : activity.type === 'session_confirmed' ? 'check' : 'times'} text-xl ${activity.type === 'session_created' ? 'text-green-500' : activity.type === 'session_confirmed' ? 'text-blue-500' : 'text-red-500'}`}></i>
                                                    </div>
                                                    <div className="flex-1">
                                                        <p className="text-white font-semibold text-sm mb-1">{activity.description}</p>
                                                        <p className="text-white/70 text-xs">{activity.details}</p>
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                            */}
                        </div>
                    </>
                ) : (
                    <SessionManagement
                        onSessionCreated={handleSessionCreated}
                        onSessionUpdated={handleSessionUpdate}
                        categories={categories}
                        trainers={trainers}
                        userId={user.id}
                    />
                )}

                {/* Create Session Modal */}
                {showCreateModal && (
                    <CreateSessionModal
                        isOpen={showCreateModal}
                        onClose={() => setShowCreateModal(false)}
                        onSessionCreated={handleSessionCreated}
                        categories={categories}
                        trainers={trainers}
                        userId={user.id}
                    />
                )}
            </div>
        </div>
    )
}

export default CoordinatorDashboard
