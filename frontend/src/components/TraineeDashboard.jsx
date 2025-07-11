import { useState, useEffect } from 'react'
import { trainingSessionApi, registrationApi } from '../services/api'
import { useAuth } from '../contexts/AuthContext'

function TraineeDashboard() {
    const { user } = useAuth()
    const [activeView, setActiveView] = useState('dashboard')
    const [stats, setStats] = useState({
        total: 0,
        upcoming: 0,
        completed: 0,
        cancelled: 0
    })
    const [upcomingSessions, setUpcomingSessions] = useState([])
    const [recentActivity, setRecentActivity] = useState([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        fetchDashboardData()
    }, [])

    const fetchDashboardData = async () => {
        try {
            // Fetch trainee's registrations and sessions
            const [registrationsRes, sessionsRes] = await Promise.all([
                registrationApi.getRegistrationDetails(user?.id), // Get all registrations for this user
                trainingSessionApi.getAllSessions() // Get all sessions (filter below)
            ])

            // Filter sessions for those the trainee is registered for
            const myRegistrations = Array.isArray(registrationsRes.data) ? registrationsRes.data : [];
            const mySessionIds = myRegistrations.map(r => r.training_session_id);
            const allSessions = Array.isArray(sessionsRes.data) ? sessionsRes.data : [];
            const mySessions = allSessions.filter(s => mySessionIds.includes(s.id));

            // Stats
            const now = new Date();
            const upcoming = mySessions.filter(s => new Date(s.date) >= now && (!s.status || s.status === 'active'));
            const completed = mySessions.filter(s => s.status === 'completed');
            const cancelled = mySessions.filter(s => s.status === 'cancelled');
            setStats({
                total: mySessions.length,
                upcoming: upcoming.length,
                completed: completed.length,
                cancelled: cancelled.length
            });
            setUpcomingSessions(upcoming);

            // Recent activity: registrations, completions, feedback
            const recent = [];
            myRegistrations.slice(0, 5).forEach(reg => {
                recent.push({
                    type: 'registration_submitted',
                    description: `Registered for ${reg.trainingSession?.skill_name || 'Session'}`,
                    details: `Session on ${reg.trainingSession?.date || ''}`,
                    created_at: reg.created_at
                });
                if (reg.status === 'confirmed') {
                    recent.push({
                        type: 'session_completed',
                        description: `Completed ${reg.trainingSession?.skill_name || 'Session'}`,
                        details: `Session on ${reg.trainingSession?.date || ''}`,
                        created_at: reg.updated_at
                    });
                }
                // Feedback (if available)
                if (reg.feedback) {
                    recent.push({
                        type: 'feedback_submitted',
                        description: `Submitted feedback for ${reg.trainingSession?.skill_name || 'Session'}`,
                        details: `Rated ${reg.feedback.rating} stars`,
                        created_at: reg.feedback.created_at
                    });
                }
            });
            setRecentActivity(recent);
        } catch (error) {
            setStats({ total: 0, upcoming: 0, completed: 0, cancelled: 0 })
            setUpcomingSessions([])
            setRecentActivity([])
        } finally {
            setLoading(false)
        }
    }

    const navigationTabs = [
        {
            id: 'dashboard',
            label: 'Dashboard',
            icon: 'fas fa-home',
            description: 'Overview & upcoming sessions'
        },
        {
            id: 'sessions',
            label: 'My Sessions',
            icon: 'fas fa-calendar-alt',
            description: 'View and manage your sessions'
        }
    ]

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="bg-white/10 backdrop-blur-3xl rounded-3xl p-8 border border-white/20">
                    <div className="animate-spin w-12 h-12 border-4 border-cyan-400 border-t-transparent rounded-full mx-auto mb-4"></div>
                    <p className="text-white text-center">Loading your trainee dashboard...</p>
                </div>
            </div>
        )
    }

    return (
        <div className="min-h-screen relative overflow-hidden">
            <div className="relative z-10 max-w-5xl mx-auto px-6 py-12">
                {/* Trainee Welcome Header */}
                <div className="mb-12">
                    <div className="bg-white/10 backdrop-blur-3xl rounded-3xl p-8 border border-white/20 shadow-2xl relative overflow-hidden">
                        <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-cyan-400/20 to-blue-400/20 rounded-full blur-3xl"></div>
                        <div className="relative z-10">
                            <div className="mb-3">
                                <span className="text-3xl font-bold text-white">
                                    Welcome <span className="bg-gradient-to-r from-cyan-400 to-blue-400 bg-clip-text text-transparent">{user?.first_name}</span> 👋
                                </span>
                            </div>
                            <h1 className="text-5xl font-black mb-4">
                                <span className="bg-gradient-to-r from-blue-400 via-indigo-400 to-purple-400 bg-clip-text text-transparent">
                                    Trainee Hub
                                </span>
                            </h1>
                            <p className="text-xl text-white/80">Track your sessions and progress</p>
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
                        {/* Session Stats Overview */}
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
                            {[
                                {
                                    label: 'Total Sessions',
                                    value: stats.total,
                                    icon: 'fas fa-list',
                                    color: 'blue',
                                    change: 'All time'
                                },
                                {
                                    label: 'Upcoming',
                                    value: stats.upcoming,
                                    icon: 'fas fa-calendar-check',
                                    color: 'yellow',
                                    change: 'Next sessions'
                                },
                                {
                                    label: 'Completed',
                                    value: stats.completed,
                                    icon: 'fas fa-check-circle',
                                    color: 'green',
                                    change: 'Finished'
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
                            {/* Upcoming Sessions */}
                            <div className="lg:col-span-2">
                                <div className="bg-white/10 backdrop-blur-2xl rounded-3xl p-8 border border-white/20 shadow-xl">
                                    <h2 className="text-3xl font-bold text-white mb-6 flex items-center">
                                        <i className="fas fa-calendar-alt text-blue-400 mr-3"></i>
                                        Upcoming Sessions
                                        {upcomingSessions.length > 0 && (
                                            <span className="ml-3 px-3 py-1 bg-blue-400/20 text-blue-400 rounded-full text-sm font-semibold">
                                                {upcomingSessions.length}
                                            </span>
                                        )}
                                    </h2>

                                    {upcomingSessions.length === 0 ? (
                                        <div className="text-center py-12">
                                            <div className="w-20 h-20 bg-gradient-to-br from-green-400/20 to-emerald-600/20 rounded-full flex items-center justify-center mx-auto mb-4">
                                                <i className="fas fa-check-double text-3xl text-green-400"></i>
                                            </div>
                                            <h3 className="text-xl font-semibold text-white mb-2">No Upcoming Sessions</h3>
                                            <p className="text-white/70">You have no upcoming sessions scheduled.</p>
                                        </div>
                                    ) : (
                                        <div className="space-y-4 max-h-96 overflow-y-auto">
                                            {upcomingSessions.map((session) => (
                                                <div key={session.id} className="bg-white/10 backdrop-blur-xl rounded-2xl p-6 border border-white/20 hover:border-white/40 transition-all duration-300">
                                                    <div className="flex items-start justify-between mb-4">
                                                        <div className="flex-1">
                                                            <h3 className="text-xl font-bold text-white mb-1">
                                                                {session.skill_name}
                                                            </h3>
                                                            <div className="flex items-center text-white/60 text-sm mb-2">
                                                                <i className="fas fa-calendar mr-2"></i>
                                                                <span>{session.date} at {session.time}</span>
                                                            </div>
                                                            <div className="flex items-center text-white/60 text-sm mb-2">
                                                                <i className="fas fa-map-marker-alt mr-2"></i>
                                                                <span>{session.location}</span>
                                                            </div>
                                                            <div className="flex items-center text-white/60 text-sm">
                                                                <i className="fas fa-chalkboard-teacher mr-2"></i>
                                                                <span>{session.trainer}</span>
                                                            </div>
                                                        </div>
                                                        <div className="flex items-center space-x-3">
                                                            <button className="px-4 py-2 bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 rounded-xl text-white font-semibold transition-all duration-300 hover:scale-105 flex items-center">
                                                                <i className="fas fa-eye mr-2"></i>
                                                                View Details
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
                                        <button className="w-full px-4 py-3 bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 rounded-xl text-white font-semibold transition-all duration-300 hover:scale-105 flex items-center justify-center">
                                            <i className="fas fa-plus mr-2"></i>
                                            Register for Session
                                        </button>
                                        <button className="w-full px-4 py-3 bg-white/10 hover:bg-white/20 border border-white/20 hover:border-white/40 rounded-xl text-white font-semibold transition-all duration-300 flex items-center justify-center">
                                            <i className="fas fa-history mr-2"></i>
                                            View History
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
                                                    <div className={`flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center text-lg ${activity.type === 'registration_submitted' ? 'bg-blue-400/20 text-blue-400' :
                                                        activity.type === 'session_completed' ? 'bg-green-400/20 text-green-400' :
                                                            activity.type === 'feedback_submitted' ? 'bg-yellow-400/20 text-yellow-400' :
                                                                'bg-cyan-400/20 text-cyan-400'
                                                        }`}>
                                                        <i className={
                                                            activity.type === 'registration_submitted' ? 'fas fa-user-plus' :
                                                                activity.type === 'session_completed' ? 'fas fa-check-circle' :
                                                                    activity.type === 'feedback_submitted' ? 'fas fa-star' :
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
                                                    </div>
                                                </div>
                                            ))
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </>
                ) : (
                    // My Sessions View (can be expanded later)
                    <div className="bg-white/10 backdrop-blur-2xl rounded-3xl p-8 border border-white/20 shadow-xl">
                        <h2 className="text-3xl font-bold text-white mb-6 flex items-center">
                            <i className="fas fa-calendar-alt text-blue-400 mr-3"></i>
                            My Sessions
                        </h2>
                        <p className="text-white/70">List and manage your registered sessions here.</p>
                    </div>
                )}
            </div>
        </div>
    )
}

export default TraineeDashboard
