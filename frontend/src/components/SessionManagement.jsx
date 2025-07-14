import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { trainingSessionApi } from '../services/api'
import UpdateSessionModal from './modals/UpdateSessionModal'

const SessionManagement = ({ onSessionUpdate }) => {
    const navigate = useNavigate()
    const [activeTab, setActiveTab] = useState('current')
    const [sessions, setSessions] = useState([])
    const [filteredSessions, setFilteredSessions] = useState([])
    const [loading, setLoading] = useState(true)
    const [selectedSession, setSelectedSession] = useState(null)
    const [showUpdateModal, setShowUpdateModal] = useState(false)
    const [deleteLoading, setDeleteLoading] = useState(null)
    const [showDeleteConfirm, setShowDeleteConfirm] = useState(false)
    const [sessionToDelete, setSessionToDelete] = useState(null)

    useEffect(() => {
        fetchSessions()
    }, [])

    useEffect(() => {
        filterSessions()
    }, [sessions, activeTab])

    const fetchSessions = async () => {
        try {
            setLoading(true)
            const response = await trainingSessionApi.getAllSessions()
            // Only keep sessions with status 'active'
            setSessions(response.data.filter(session => session.status === 'active'))
        } catch (error) {
            console.error('Error fetching sessions:', error)
        } finally {
            setLoading(false)
        }
    }

    const filterSessions = () => {
        const today = new Date()
        today.setHours(0, 0, 0, 0) // Reset time to start of day

        // Only consider sessions with status 'active'
        const activeSessions = sessions.filter(session => session.status === 'active')

        if (activeTab === 'current') {
            const currentSessions = activeSessions.filter(session => {
                const sessionDate = new Date(session.date)
                sessionDate.setHours(0, 0, 0, 0) // Reset time to start of day
                return sessionDate.getTime() >= today.getTime()
            })
            setFilteredSessions(currentSessions)
        } else {
            const pastSessions = activeSessions.filter(session => {
                const sessionDate = new Date(session.date)
                sessionDate.setHours(0, 0, 0, 0) // Reset time to start of day
                return sessionDate.getTime() < today.getTime()
            })
            setFilteredSessions(pastSessions)
        }
    }

    const handleUpdateSession = (session) => {
        setSelectedSession(session)
        setShowUpdateModal(true)
    }

    const handleDeleteSession = (sessionId) => {
        setSessionToDelete(sessionId)
        setShowDeleteConfirm(true)
    }

    const confirmDeleteSession = async () => {
        if (!sessionToDelete) return
        setDeleteLoading(sessionToDelete)
        setShowDeleteConfirm(false)
        try {
            await trainingSessionApi.archiveSession(sessionToDelete)
            await fetchSessions()
            onSessionUpdate?.()
        } catch (error) {
            console.error('Error deleting session:', error)
            alert('Failed to delete session. Please try again.')
        } finally {
            setDeleteLoading(null)
            setSessionToDelete(null)
        }
    }

    const handleSessionUpdated = async () => {
        await fetchSessions()
        onSessionUpdate?.()
    }

    const formatDate = (dateString) => {
        const date = new Date(dateString)
        return date.toLocaleDateString('en-US', {
            weekday: 'short',
            year: 'numeric',
            month: 'short',
            day: 'numeric'
        })
    }

    const formatTime = (timeString) => {
        if (!timeString) return ''
        const [hours, minutes] = timeString.split(':')
        const date = new Date()
        date.setHours(parseInt(hours), parseInt(minutes))
        return date.toLocaleTimeString('en-US', {
            hour: 'numeric',
            minute: '2-digit',
            hour12: true
        })
    }

    const getSessionStatus = (session) => {
        const today = new Date()
        today.setHours(0, 0, 0, 0) // Reset time to start of day

        const sessionDate = new Date(session.date)
        sessionDate.setHours(0, 0, 0, 0) // Reset time to start of day for accurate comparison

        if (sessionDate.getTime() < today.getTime()) {
            return {
                label: 'Completed',
                color: 'green',
                icon: 'fas fa-check-circle',
                bgClass: 'bg-green-400/20',
                textClass: 'text-green-400'
            }
        } else if (sessionDate.getTime() === today.getTime()) {
            return {
                label: 'Today',
                color: 'blue',
                icon: 'fas fa-play-circle',
                bgClass: 'bg-blue-400/20',
                textClass: 'text-blue-400'
            }
        } else {
            return {
                label: 'Upcoming',
                color: 'yellow',
                icon: 'fas fa-clock',
                bgClass: 'bg-yellow-400/20',
                textClass: 'text-yellow-400'
            }
        }
    }

    const tabs = [
        {
            id: 'current',
            label: 'Current Sessions',
            icon: 'fas fa-calendar-check',
            count: sessions.filter(s => {
                const today = new Date()
                today.setHours(0, 0, 0, 0)
                const sessionDate = new Date(s.date)
                sessionDate.setHours(0, 0, 0, 0)
                return sessionDate.getTime() >= today.getTime()
            }).length
        },
        {
            id: 'past',
            label: 'Past Sessions',
            icon: 'fas fa-history',
            count: sessions.filter(s => {
                const today = new Date()
                today.setHours(0, 0, 0, 0)
                const sessionDate = new Date(s.date)
                sessionDate.setHours(0, 0, 0, 0)
                return sessionDate.getTime() < today.getTime()
            }).length
        }
    ]

    if (loading) {
        return (
            <div className="bg-white/10 backdrop-blur-2xl rounded-3xl p-8 border border-white/20 shadow-xl">
                <div className="flex items-center justify-center py-12">
                    <div className="text-center">
                        <i className="fas fa-spinner fa-spin text-4xl text-white/60 mb-4"></i>
                        <p className="text-white/70">Loading sessions...</p>
                    </div>
                </div>
            </div>
        )
    }

    // ...existing code...
    return (
        <div className="bg-white/10 backdrop-blur-2xl rounded-3xl p-8 border border-white/20 shadow-xl">
            {/* Header */}
            <div className="flex items-center justify-between mb-8">
                <div>
                    <h2 className="text-3xl font-bold text-white mb-2 flex items-center">
                        <i className="fas fa-calendar-alt text-cyan-400 mr-3"></i>
                        Session Management
                    </h2>
                    <p className="text-white/70">Manage your training sessions</p>
                </div>
            </div>

            {/* Tabs */}
            <div className="flex space-x-2 mb-8">
                {tabs.map(tab => (
                    <button
                        key={tab.id}
                        onClick={() => setActiveTab(tab.id)}
                        className={`px-6 py-3 rounded-2xl font-semibold transition-all duration-300 flex items-center ${activeTab === tab.id
                            ? 'bg-white/20 text-white border border-white/30'
                            : 'bg-white/5 text-white/70 hover:bg-white/10 hover:text-white border border-white/10'
                            }`}
                    >
                        <i className={`${tab.icon} mr-2`}></i>
                        {tab.label}
                        {tab.count > 0 && (
                            <span className="ml-2 px-2 py-1 bg-cyan-400/20 text-cyan-400 rounded-full text-xs font-bold">
                                {tab.count}
                            </span>
                        )}
                    </button>
                ))}
            </div>

            {/* Sessions List */}
            {filteredSessions.length === 0 ? (
                <div className="text-center py-12">
                    <div className="w-20 h-20 bg-gradient-to-br from-gray-400/20 to-gray-600/20 rounded-full flex items-center justify-center mx-auto mb-4">
                        <i className="fas fa-calendar-times text-3xl text-gray-400"></i>
                    </div>
                    <h3 className="text-xl font-semibold text-white mb-2">
                        No {activeTab} sessions found
                    </h3>
                    <p className="text-white/70">
                        {activeTab === 'current'
                            ? 'Create your first training session to get started!'
                            : 'No past sessions available yet.'
                        }
                    </p>
                </div>
            ) : (
                <div className="space-y-4 max-h-96 overflow-y-auto">
                    {filteredSessions.map((session) => {
                        const status = getSessionStatus(session)
                        return (
                            <div key={session.id} className="bg-white/10 backdrop-blur-xl rounded-2xl p-6 border border-white/20 hover:border-cyan-400 cursor-pointer transition-all duration-300"
                                onClick={() => navigate(`/sessions/${session.id}`)}>
                                <div className="flex items-start justify-between">
                                    <div className="flex-1">
                                        {/* Session Header */}
                                        <div className="flex items-start justify-between mb-4">
                                            <div>
                                                <h3 className="text-xl font-bold text-white mb-1">
                                                    {session.skill_name}
                                                </h3>
                                                <div className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-semibold ${status.bgClass} ${status.textClass}`}>
                                                    <i className={`${status.icon} mr-1`}></i>
                                                    {status.label}
                                                </div>
                                            </div>
                                            {activeTab === 'current' && (
                                                <div className="flex items-center space-x-2">
                                                    <button
                                                        onClick={e => { e.stopPropagation(); handleUpdateSession(session); }}
                                                        className="p-3 bg-blue-500/20 hover:bg-blue-500/30 rounded-xl text-blue-400 transition-all duration-300 hover:scale-105"
                                                        title="Edit Session"
                                                    >
                                                        <i className="fas fa-edit"></i>
                                                    </button>
                                                    <button
                                                        onClick={e => { e.stopPropagation(); handleDeleteSession(session.id); }}
                                                        disabled={deleteLoading === session.id}
                                                        className="p-3 bg-red-500/20 hover:bg-red-500/30 rounded-xl text-red-400 transition-all duration-300 hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
                                                        title="Delete Session"
                                                    >
                                                        {deleteLoading === session.id ? (
                                                            <i className="fas fa-spinner fa-spin"></i>
                                                        ) : (
                                                            <i className="fas fa-trash"></i>
                                                        )}
                                                    </button>
                                                </div>
                                            )}
                                        </div>

                                        {/* Session Details */}
                                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 text-sm">
                                            <div className="flex items-center text-white/70">
                                                <i className="fas fa-calendar mr-2 text-emerald-400"></i>
                                                <span>{formatDate(session.date)}</span>
                                            </div>
                                            <div className="flex items-center text-white/70">
                                                <i className="fas fa-clock mr-2 text-blue-400"></i>
                                                <span>{formatTime(session.start_time)} - {formatTime(session.end_time)}</span>
                                            </div>
                                            <div className="flex items-center text-white/70">
                                                <i className="fas fa-map-marker-alt mr-2 text-red-400"></i>
                                                <span>{session.location}</span>
                                            </div>
                                            <div className="flex items-center text-white/70">
                                                <i className="fas fa-users mr-2 text-purple-400"></i>
                                                <span>Max {session.max_participants}</span>
                                            </div>
                                        </div>

                                        {/* Trainer and Category */}
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4 text-sm">
                                            {session.trainer && (
                                                <div className="flex items-center text-white/70">
                                                    <i className="fas fa-chalkboard-teacher mr-2 text-indigo-400"></i>
                                                    <span>{session.trainer.first_name} {session.trainer.last_name}</span>
                                                </div>
                                            )}
                                            {session.category && (
                                                <div className="flex items-center text-white/70">
                                                    <i className="fas fa-tag mr-2 text-cyan-400"></i>
                                                    <span>{session.category.name}</span>
                                                </div>
                                            )}
                                        </div>

                                        {/* Description */}
                                        {session.skill_description && (
                                            <div className="mt-4 p-4 bg-white/5 rounded-xl">
                                                <p className="text-white/80 text-sm leading-relaxed">
                                                    {session.skill_description}
                                                </p>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>
                        )
                    })}
                </div>
            )}

            {/* Update Session Modal */}
            <UpdateSessionModal
                isOpen={showUpdateModal}
                onClose={() => setShowUpdateModal(false)}
                session={selectedSession}
                onSessionUpdated={handleSessionUpdated}
            />

            {/* Confirmation Modal */}
            {showDeleteConfirm && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60">
                    <div className="bg-white rounded-2xl p-8 shadow-2xl max-w-md w-full">
                        <h2 className="text-xl font-bold mb-4 text-red-600 flex items-center"><i className="fas fa-exclamation-triangle mr-2"></i>Confirm Delete</h2>
                        <p className="mb-6 text-gray-700">Are you sure you want to <span className="font-semibold text-red-500">delete</span> this training session permanently? This action cannot be undone.</p>
                        <div className="flex justify-end space-x-3">
                            <button onClick={() => setShowDeleteConfirm(false)} className="px-4 py-2 rounded-lg bg-gray-200 hover:bg-gray-300 text-gray-700 font-semibold">Cancel</button>
                            <button onClick={confirmDeleteSession} className="px-4 py-2 rounded-lg bg-red-500 hover:bg-red-600 text-white font-semibold">Delete</button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}

export default SessionManagement
