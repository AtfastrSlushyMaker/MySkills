import { useState, useEffect } from 'react'
import { registrationApi, trainingSessionApi, categoryApi, userApi } from '../services/api'
import { useAuth } from '../contexts/AuthContext'
import CreateSessionModal from './modals/CreateSessionModal'
import SessionManagement from './SessionManagement'
import SessionDetails from './SessionDetails'

function CoordinatorDashboard() {
    // Add session navigation state
    const [selectedSessionId, setSelectedSessionId] = useState(null);
    const handleSessionCardClick = (sessionId) => {
        setSelectedSessionId(sessionId);
    };

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

                {/* Content based on active view and session navigation */}
                {selectedSessionId ? (
                    <SessionDetails sessionId={selectedSessionId} onBack={() => setSelectedSessionId(null)} />
                ) : activeView === 'dashboard' ? (
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
                                                <div key={registration.id} className="bg-white/5 rounded-2xl p-6 flex flex-col md:flex-row md:items-center justify-between gap-4 border border-white/10 hover:border-cyan-400/40 transition-all duration-300 shadow">
                                                    <div className="flex items-center gap-4">
                                                        <div className="w-12 h-12 bg-gradient-to-br from-yellow-400/30 to-yellow-600/20 rounded-full flex items-center justify-center">
                                                            <i className="fas fa-user-clock text-2xl text-yellow-400"></i>
                                                        </div>
                                                        <div>
                                                            <div className="text-lg font-bold text-white">{registration.user?.first_name} {registration.user.last_name}</div>
                                                            <div className="text-white/70 text-sm">{registration.training_session?.skill_name}</div>
                                                            <div className="text-white/50 text-xs mt-1">Requested on {registration.created_at ? new Date(registration.created_at).toLocaleDateString() : 'N/A'}</div>
                                                        </div>
                                                    </div>
                                                    <div className="flex gap-2 mt-4 md:mt-0">
                                                        <button
                                                            className="px-4 py-2 bg-green-500/90 hover:bg-green-600 text-white rounded-lg font-semibold shadow transition-all duration-200"
                                                            onClick={() => handleApproval(registration.id)}
                                                        >
                                                            Approve
                                                        </button>
                                                        <button
                                                            className="px-4 py-2 bg-red-500/90 hover:bg-red-600 text-white rounded-lg font-semibold shadow transition-all duration-200"
                                                            onClick={() => handleRejection(registration.id)}
                                                        >
                                                            Reject
                                                        </button>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            </div>
                            {/* Quick Actions to the right, glassmorphism style */}
                            <div className="flex flex-col gap-6 min-w-[260px] justify-start items-stretch">
                                <div className="bg-white/10 backdrop-blur-2xl rounded-3xl p-8 border border-white/20 shadow-xl flex flex-col items-center gap-6">
                                    <div className="flex flex-col items-center w-full">
                                        <span className="flex items-center text-white text-lg font-bold mb-4 tracking-wide">
                                            <i className="fas fa-bolt mr-2 text-cyan-400 text-xl"></i>
                                            Quick Actions
                                        </span>
                                        <button
                                            className="w-full px-8 py-4 bg-gradient-to-r from-cyan-500 to-blue-500 text-white font-bold rounded-2xl shadow-lg hover:scale-105 transition-all duration-300 flex items-center gap-3 justify-center"
                                            onClick={() => setShowCreateModal(true)}
                                        >
                                            <i className="fas fa-calendar-plus text-xl"></i>
                                            <span className="font-semibold">Create Session</span>
                                        </button>
                                    </div>
                                    {/* Add more quick actions here in the future */}
                                </div>
                            </div>
                        </div>
                    </>
                ) : (
                    <SessionManagement
                        onSessionCreated={handleSessionCreated}
                        onSessionUpdated={handleSessionUpdate}
                        categories={categories}
                        trainers={trainers}
                        userId={user.id}
                        onSessionClick={handleSessionCardClick}
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
