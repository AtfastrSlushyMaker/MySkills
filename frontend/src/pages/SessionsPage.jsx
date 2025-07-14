import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { trainingSessionApi, categoryApi } from '../services/api'

function SessionsPage() {
    const [sessions, setSessions] = useState([])
    const [loading, setLoading] = useState(true)
    const [activeFilter, setActiveFilter] = useState('All Sessions')
    const [categories, setCategories] = useState([])
    const navigate = useNavigate()

    useEffect(() => {
        fetchSessions()
        fetchCategories()
    }, [])

    const fetchSessions = async () => {
        setLoading(true)
        try {
            const res = await trainingSessionApi.getAllSessions()
            setSessions(Array.isArray(res.data) ? res.data : [])
        } catch (err) {
            setSessions([])
        } finally {
            setLoading(false)
        }
    }

    const fetchCategories = async () => {
        try {
            const res = await categoryApi.getAllCategories()
            setCategories(Array.isArray(res.data) ? res.data : [])
        } catch (err) {
            setCategories([])
        }
    }

    // Build filter list from categories
    const filters = ['All Sessions', ...categories.map(cat => cat.name)]
    const [showAllCategories, setShowAllCategories] = useState(false)
    const CATEGORY_LIMIT = 10
    const visibleFilters = showAllCategories ? filters : filters.slice(0, CATEGORY_LIMIT)

    // Filter sessions by category name and only show sessions that haven't started yet
    const today = new Date();
    const filteredSessions = (activeFilter === 'All Sessions'
        ? sessions
        : sessions.filter(s => s.category?.name === activeFilter)
    ).filter(s => {
        // Assume s.date is in YYYY-MM-DD format
        if (!s.date) return false;
        const sessionDate = new Date(s.date);
        // Only show sessions with date after today
        return sessionDate > today;
    });

    // Helper: assign an icon and gradient color to each category (fallbacks for unknown)
    const categoryIconMap = {
        'Frontend Development': 'fas fa-code',
        'Backend Development': 'fas fa-server',
        'Full Stack Development': 'fas fa-laptop-code',
        'Mobile Development': 'fas fa-mobile-alt',
        'DevOps & Cloud': 'fas fa-cloud',
        'Database Management': 'fas fa-database',
        'Web Design': 'fas fa-paint-brush',
        'Game Development': 'fas fa-gamepad',
        'Data Science': 'fas fa-chart-line',
        'Machine Learning': 'fas fa-robot',
        'Business Intelligence': 'fas fa-lightbulb',
        'Big Data': 'fas fa-database',
        'Project Management': 'fas fa-tasks',
        'Digital Marketing': 'fas fa-bullhorn',
        'Business Analysis': 'fas fa-briefcase',
        'Leadership & Management': 'fas fa-user-tie',
        'Entrepreneurship': 'fas fa-rocket',
        'Graphic Design': 'fas fa-palette',
        'Video Production': 'fas fa-video',
        '3D Modeling & Animation': 'fas fa-cube',
        'Photography': 'fas fa-camera',
        'Cybersecurity': 'fas fa-shield-alt',
        'Cloud Computing': 'fas fa-cloud',
        'Software Testing': 'fas fa-vial',
        'Network Administration': 'fas fa-network-wired',
        'Communication Skills': 'fas fa-comments',
        'Time Management': 'fas fa-clock',
        'Problem Solving': 'fas fa-puzzle-piece',
        'Team Collaboration': 'fas fa-users',
        'Healthcare Technology': 'fas fa-heartbeat',
        'Financial Technology': 'fas fa-coins',
        'E-commerce': 'fas fa-shopping-cart',
        'Education Technology': 'fas fa-graduation-cap',
        'Artificial Intelligence': 'fas fa-brain',
        'Blockchain': 'fas fa-link',
        'Internet of Things': 'fas fa-project-diagram',
        'Virtual Reality': 'fas fa-vr-cardboard',
        'JavaScript Frameworks': 'fab fa-js-square',
        'Python Programming': 'fab fa-python',
        'Java Development': 'fab fa-java',
        'PHP Development': 'fab fa-php',
        'C# & .NET': 'fas fa-code-branch',
        'API Development': 'fas fa-plug',
        'Microservices': 'fas fa-cubes',
        'Performance Optimization': 'fas fa-tachometer-alt',
        'Accessibility': 'fas fa-universal-access',
    }
    const cardGradients = [
        'from-cyan-500 to-blue-600',
        'from-purple-500 to-pink-600',
        'from-emerald-500 to-cyan-600',
        'from-orange-500 to-red-600',
        'from-indigo-500 to-purple-600',
        'from-pink-500 to-purple-600',
        'from-yellow-400 to-orange-500',
        'from-green-400 to-emerald-600',
        'from-blue-400 to-indigo-600',
        'from-fuchsia-500 to-pink-500',
    ]

    return (
        <div className="min-h-screen relative overflow-hidden">
            <div className="relative z-10 max-w-7xl mx-auto px-6 py-12">
                {/* Header Section */}
                <div className="text-center mb-20">
                    <div className="inline-flex items-center justify-center p-3 bg-white/10 backdrop-blur-3xl rounded-2xl border border-white/20 shadow-xl mb-6">
                        <i className="fas fa-graduation-cap text-4xl text-cyan-400"></i>
                    </div>
                    <h1 className="text-6xl font-black mb-6">
                        <span className="bg-gradient-to-r from-cyan-400 via-purple-400 to-pink-400 bg-clip-text text-transparent animate-gradient-x">
                            Session Catalog
                        </span>
                    </h1>
                    <p className="text-xl text-white/80 max-w-3xl mx-auto leading-relaxed">
                        Browse and enroll in upcoming training sessions to boost your skills and career
                    </p>
                </div>

                {/* Filter Section */}
                <div className="mb-16">
                    <div className="bg-white/10 backdrop-blur-2xl rounded-3xl p-6 border border-white/20 shadow-xl">
                        <div className="flex flex-wrap justify-center gap-4">
                            {visibleFilters.map((filter) => (
                                <button
                                    key={filter}
                                    className={`px-6 py-3 bg-white/10 hover:bg-gradient-to-r hover:from-cyan-500/20 hover:to-purple-500/20 backdrop-blur-xl rounded-full border border-white/20 hover:border-white/40 text-white transition-all duration-300 hover:scale-105 ${activeFilter === filter ? 'bg-gradient-to-r from-cyan-500/20 to-purple-500/20 border-white/40 scale-105' : ''}`}
                                    onClick={() => setActiveFilter(filter)}
                                >
                                    {filter}
                                </button>
                            ))}
                        </div>
                        {filters.length > CATEGORY_LIMIT && (
                            <div className="flex justify-center mt-8">
                                <button
                                    className={`w-full max-w-2xl px-6 py-4 rounded-2xl font-bold flex items-center justify-center gap-2 transition-all duration-300 shadow-lg text-lg
                                        ${showAllCategories
                                            ? 'bg-gradient-to-r from-pink-500 to-purple-500 text-white border-none hover:from-pink-600 hover:to-purple-600 scale-105'
                                            : 'bg-gradient-to-r from-cyan-500 to-blue-500 text-white border-none hover:from-cyan-600 hover:to-blue-600 scale-105'}
                                    `}
                                    onClick={() => setShowAllCategories(v => !v)}
                                >
                                    {showAllCategories ? (
                                        <>
                                            <i className="fas fa-chevron-up"></i> Show Less
                                        </>
                                    ) : (
                                        <>
                                            <i className="fas fa-chevron-down"></i> Show {filters.length - CATEGORY_LIMIT} More
                                        </>
                                    )}
                                </button>
                            </div>
                        )}
                    </div>
                </div>

                {/* Sessions Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {loading ? (
                        <div className="col-span-3 text-center py-12">
                            <div className="animate-spin w-12 h-12 border-4 border-cyan-400 border-t-transparent rounded-full mx-auto mb-4"></div>
                            <p className="text-white/70">Loading sessions...</p>
                        </div>
                    ) : filteredSessions.length === 0 ? (
                        <div className="col-span-3 text-center py-12">
                            <div className="w-20 h-20 bg-gradient-to-br from-cyan-400/20 to-purple-600/20 rounded-full flex items-center justify-center mx-auto mb-4">
                                <i className="fas fa-calendar-times text-4xl text-cyan-400"></i>
                            </div>
                            <h3 className="text-2xl font-semibold text-white mb-2">No sessions found</h3>
                            <p className="text-white/70">Try a different filter or check back later.</p>
                        </div>
                    ) : (
                        filteredSessions.map((session, index) => {
                            const cat = session.category?.name || 'General'
                            const icon = categoryIconMap[cat] || 'fas fa-chalkboard-teacher'
                            const gradient = cardGradients[index % cardGradients.length]
                            // Format date and time
                            let formattedDate = session.date
                            let formattedTime = session.start_time
                            if (session.date) {
                                const dateObj = new Date(session.date)
                                formattedDate = dateObj.toLocaleDateString('en-US', {
                                    year: 'numeric', month: 'short', day: 'numeric'
                                })
                            }
                            if (session.start_time) {
                                // Assume start_time is in HH:mm:ss or HH:mm format
                                const [hour, minute] = session.start_time.split(':')
                                const timeObj = new Date()
                                timeObj.setHours(hour, minute)
                                formattedTime = timeObj.toLocaleTimeString('en-US', {
                                    hour: '2-digit', minute: '2-digit'
                                })
                            }
                            return (
                                <div key={session.id || index} className="group relative">
                                    {/* Hover glow effect */}
                                    <div className={`absolute inset-0 bg-gradient-to-r ${gradient} opacity-0 group-hover:opacity-20 transition-opacity duration-500 rounded-3xl blur-xl`}></div>

                                    <div className={`relative bg-white/10 backdrop-blur-2xl rounded-3xl overflow-hidden border border-white/20 hover:border-white/40 transition-all duration-500 group-hover:scale-105 shadow-xl`}>
                                        {/* Session Header */}
                                        <div className={`p-6 bg-gradient-to-r ${gradient} relative`}>
                                            <div className="flex items-center justify-between mb-4">
                                                <div className="text-5xl">
                                                    <i className={`${icon} text-white drop-shadow-lg`}></i>
                                                </div>
                                                <div className="bg-white/20 backdrop-blur-xl px-3 py-1 rounded-full text-white text-sm font-semibold">
                                                    {cat}
                                                </div>
                                            </div>
                                            <h3 className="text-2xl font-bold text-white truncate max-w-xs" title={session.skill_name}>{session.skill_name}</h3>
                                            <div className="flex items-center gap-2 text-white/90 text-sm mt-2">
                                                <i className="fas fa-user-tie text-cyan-300"></i>
                                                <span title={session.trainer ? `${session.trainer.first_name} ${session.trainer.last_name}` : 'TBA'}>
                                                    {session.trainer ? `${session.trainer.first_name} ${session.trainer.last_name}` : 'TBA'}
                                                </span>
                                            </div>
                                        </div>

                                        {/* Session Content */}
                                        <div className="p-6">
                                            {/* Stats */}
                                            <div className="flex flex-wrap items-center justify-between mb-4 text-sm text-white/80 gap-2">
                                                <div className="flex items-center gap-2">
                                                    <i className="fas fa-clock text-cyan-300"></i>
                                                    <span>{formattedDate}{formattedTime ? ` at ${formattedTime}` : ''}</span>
                                                </div>
                                                {session.duration && (
                                                    <div className="flex items-center gap-2">
                                                        <i className="fas fa-hourglass-half text-purple-300"></i>
                                                        <span>{session.duration} min</span>
                                                    </div>
                                                )}
                                                {session.enrolled_count !== undefined && (
                                                    <div className="flex items-center gap-2">
                                                        <i className="fas fa-users text-green-300"></i>
                                                        <span>{session.enrolled_count} enrolled</span>
                                                    </div>
                                                )}
                                            </div>

                                            {/* Tags */}
                                            <div className="flex flex-wrap gap-2 mb-6">
                                                {session.trainingCourses && session.trainingCourses.map((course, i) => (
                                                    <span key={course.id || i} className="bg-gradient-to-r from-cyan-500/30 to-purple-500/30 text-white/90 px-3 py-1 rounded-full text-xs font-semibold shadow">
                                                        {course.title}
                                                    </span>
                                                ))}
                                            </div>

                                            {/* Location and CTA */}
                                            <div className="flex items-center justify-between">
                                                <div className="text-lg font-bold text-white truncate max-w-xs" title={session.location}>
                                                    <i className="fas fa-map-marker-alt mr-2 text-cyan-400"></i>{session.location}
                                                </div>
                                                {/* Registration Status Button */}
                                                {session.registration_status === 'registered' ? (
                                                    <button
                                                        className={`relative px-6 py-3 bg-emerald-500/80 text-white font-semibold rounded-xl shadow-lg border border-white/20 cursor-not-allowed group backdrop-blur-xl`}
                                                        disabled
                                                    >
                                                        <span className="flex items-center gap-2 relative z-10">
                                                            <i className="fas fa-check-circle"></i>
                                                            Registered
                                                        </span>
                                                    </button>
                                                ) : session.registration_status === 'pending' ? (
                                                    <button
                                                        className={`relative px-6 py-3 bg-yellow-500/80 text-white font-semibold rounded-xl shadow-lg border border-white/20 cursor-not-allowed group backdrop-blur-xl`}
                                                        disabled
                                                    >
                                                        <span className="flex items-center gap-2 relative z-10">
                                                            <i className="fas fa-hourglass-half"></i>
                                                            Pending
                                                        </span>
                                                    </button>
                                                ) : (
                                                    <button
                                                        className={`relative px-6 py-3 bg-transparent hover:bg-white/5 rounded-xl text-white font-semibold transition-all duration-300 hover:scale-105 shadow-lg border border-white/20 overflow-hidden group backdrop-blur-xl`}
                                                        onClick={() => navigate(`/sessions/${session.id}`)}
                                                    >
                                                        <span className="flex items-center gap-2 relative z-10">
                                                            <i className="fas fa-sign-in-alt"></i>
                                                            Enroll
                                                        </span>
                                                        <span className={`absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-gradient-to-r ${gradient} bg-opacity-70 rounded-xl`}></span>
                                                    </button>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            )
                        })
                    )}
                </div>

                {/* Load More Section */}
                {filteredSessions.length > 6 && (
                    <div className="text-center mt-16">
                        <button className="px-12 py-4 bg-white/10 hover:bg-white/20 backdrop-blur-2xl border border-white/20 hover:border-white/40 rounded-2xl text-white font-semibold transition-all duration-300 hover:scale-105 shadow-xl flex items-center justify-center gap-3">
                            <i className="fas fa-arrow-down animate-bounce"></i>
                            Load More Sessions
                        </button>
                    </div>
                )}

            </div>
        </div>
    )
}

export default SessionsPage
