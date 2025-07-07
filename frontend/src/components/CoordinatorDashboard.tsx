
import { useState, useEffect } from 'react'
import { registrationApi } from '../services/api'
import { useAuth } from '../contexts/AuthContext'

interface User {
    id: number
    first_name: string
    last_name: string
    email: string
}

interface TrainingSession {
    id: number
    skill_name: string
    skill_description: string
}

interface Registration {
    id: number
    created_at: string
    user: User
    trainingSession: TrainingSession
}

interface Stats {
    total: number
    pending: number
    confirmed: number
    cancelled: number
}

function CoordinatorDashboard() {
    const { user } = useAuth()
    const [stats, setStats] = useState<Stats>({
        total: 0,
        pending: 0,
        confirmed: 0,
        cancelled: 0
    })
    const [pendingRegistrations, setPendingRegistrations] = useState<Registration[]>([])
    const [loading, setLoading] = useState(true)

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

            setStats(statsResponse.data.stats)
            setPendingRegistrations(pendingResponse.data.registrations)
        } catch (error) {
            console.error('Error fetching dashboard data:', error)
        } finally {
            setLoading(false)
        }
    }

    const handleApproval = async (registrationId: number) => {
        try {
            await registrationApi.approveRegistration(registrationId)
            // Refresh data after approval
            fetchDashboardData()
        } catch (error) {
            console.error('Error approving registration:', error)
        }
    }

    const handleRejection = async (registrationId: number) => {
        try {
            await registrationApi.rejectRegistration(registrationId)
            // Refresh data after rejection
            fetchDashboardData()
        } catch (error) {
            console.error('Error rejecting registration:', error)
        }
    }

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
                                <button className="w-full px-4 py-3 bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 rounded-xl text-white font-semibold transition-all duration-300 hover:scale-105 flex items-center justify-center">
                                    <i className="fas fa-plus mr-2"></i>
                                    Create Session
                                </button>
                                <button className="w-full px-4 py-3 bg-white/10 hover:bg-white/20 border border-white/20 hover:border-white/40 rounded-xl text-white font-semibold transition-all duration-300 flex items-center justify-center">
                                    <i className="fas fa-calendar-alt mr-2"></i>
                                    View Schedule
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
                                {[
                                    { action: 'Approved registration', user: 'John Doe', time: '2 hours ago', icon: 'fas fa-check', color: 'green' },
                                    { action: 'Created new session', user: 'React Advanced', time: '1 day ago', icon: 'fas fa-plus', color: 'blue' },
                                    { action: 'Updated session details', user: 'Laravel Workshop', time: '2 days ago', icon: 'fas fa-edit', color: 'yellow' }
                                ].map((activity, index) => (
                                    <div key={index} className="flex items-center space-x-3 p-3 bg-white/5 rounded-xl">
                                        <div className={`text-xl text-${activity.color}-400`}>
                                            <i className={activity.icon}></i>
                                        </div>
                                        <div className="flex-1">
                                            <div className="text-white font-semibold text-sm">{activity.action}</div>
                                            <div className="text-white/70 text-xs">{activity.user}</div>
                                        </div>
                                        <div className="text-white/60 text-xs">{activity.time}</div>
                                    </div>
                                ))}
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
            </div>
        </div>
    )
}

export default CoordinatorDashboard