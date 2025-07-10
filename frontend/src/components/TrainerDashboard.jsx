import React, { useState, useEffect, useMemo } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { trainingSessionApi } from '../services/api';
import { Link } from 'react-router-dom';
import { format, parseISO } from 'date-fns';
import '../styles/dashboard.css';

const statsConfig = [
    { label: 'Assigned Sessions', icon: 'fas fa-calendar-alt', color: 'cyan', key: 'sessions' },
];

// REVISED: Combined and simplified date/time formatting for session cards
const formatCompactDateTime = (dateString) => {
    if (!dateString) return 'No date';
    try {
        const date = typeof dateString === 'string' ? parseISO(dateString) : dateString;
        return format(date, 'MMM do, yyyy h:mm a'); // e.g., "Jul 10th, 2025 1:08 PM"
    } catch (e) {
        console.warn("Error formatting date/time:", dateString, e);
        return dateString;
    }
};

// Keep for stats card if you like the very short date, or remove if only using the compact one
const formatSessionDate = (dateString) => {
    if (!dateString) return 'No date';
    try {
        const date = typeof dateString === 'string' ? parseISO(dateString) : dateString;
        return format(date, 'MMM do, yyyy'); // e.g., "Jul 10th, 2025"
    } catch (e) {
        console.warn("Error formatting date:", dateString, e);
        return dateString;
    }
};

const formatSessionTime = (dateString) => {
    if (!dateString) return '';
    try {
        const date = typeof dateString === 'string' ? parseISO(dateString) : dateString;
        return format(date, 'p'); // e.g., "1:08 PM"
    } catch (e) {
        console.warn("Error formatting time:", dateString, e);
        return '';
    }
};


const TrainerDashboard = () => {
    const { user } = useAuth();
    const [sessions, setSessions] = useState([]);
    const [loading, setLoading] = useState(true);
    const [activeView, setActiveView] = useState('dashboard');
    const [recentActivity] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');

    const navigationTabs = [
        {
            id: 'dashboard',
            label: 'Dashboard',
            icon: 'fas fa-chart-bar',
            description: 'Overview & sessions'
        },
        {
            id: 'sessions',
            label: 'Sessions',
            icon: 'fas fa-calendar-alt',
            description: 'All assigned sessions'
        }
    ];

    useEffect(() => {
        const fetchSessions = async () => {
            if (!user?.id) {
                setLoading(false);
                return;
            }
            setLoading(true);
            try {
                const res = await trainingSessionApi.getSessionsByTrainer(user.id);
                if (Array.isArray(res.data)) {
                    const sortedSessions = res.data.sort((a, b) => {
                        const dateA = a.date ? new Date(a.date) : new Date(0);
                        const dateB = b.date ? new Date(b.date) : new Date(0);
                        return dateA - dateB;
                    });
                    setSessions(sortedSessions);
                } else {
                    setSessions([]);
                }
            } catch (e) {
                console.error("Failed to fetch sessions:", e);
                setSessions([]);
            } finally {
                setLoading(false);
            }
        };

        fetchSessions();
    }, [user?.id]);

    const filteredSessions = useMemo(() => {
        const term = searchTerm.toLowerCase();
        return sessions.filter(session => {
            const skillName = session.skill_name?.toLowerCase() || '';
            const categoryName = session.category?.name?.toLowerCase() || '';
            const location = session.location?.toLowerCase() || '';

            return (
                skillName.includes(term) ||
                categoryName.includes(term) ||
                location.includes(term)
            );
        });
    }, [sessions, searchTerm]);

    const nextUpcomingSession = useMemo(() => {
        const now = new Date();
        now.setHours(0, 0, 0, 0);
        return sessions.find(s => {
            try {
                const sessionDate = parseISO(s.date);
                sessionDate.setHours(0, 0, 0, 0);
                return sessionDate >= now;
            } catch {
                return false;
            }
        });
    }, [sessions]);

    const colorClassMap = {
        cyan: {
            gradient: 'from-cyan-400/20 to-cyan-600/20',
            text: 'text-cyan-400',
        },
        purple: {
            gradient: 'from-purple-400/20 to-purple-600/20',
            text: 'text-purple-400',
        },
        pink: {
            gradient: 'from-pink-400/20 to-pink-600/20',
            text: 'text-pink-400',
        },
    };

    return (
        <div className="min-h-screen relative overflow-hidden">
            {/* Animated Orbs (HomePage style) */}
            <div className="absolute top-20 left-10 w-72 h-72 bg-gradient-to-br from-cyan-400/30 to-blue-600/30 rounded-full mix-blend-multiply filter blur-3xl animate-float" style={{ zIndex: 1 }}></div>
            <div className="absolute top-40 right-10 w-72 h-72 bg-gradient-to-br from-purple-400/30 to-pink-600/30 rounded-full mix-blend-multiply filter blur-3xl animate-float-delayed" style={{ zIndex: 1 }}></div>
            <div className="absolute bottom-20 left-1/3 w-72 h-72 bg-gradient-to-br from-emerald-400/30 to-cyan-600/30 rounded-full mix-blend-multiply filter blur-3xl animate-float-slow" style={{ zIndex: 1 }}></div>

            <div className="relative z-10 max-w-7xl mx-auto px-6 py-12">
                {/* Trainer Welcome Header */}
                <div className="mb-12">
                    <div className="dashboard-header">
                        <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-blue-400/20 to-indigo-400/20 rounded-full blur-3xl"></div>
                        <div className="relative z-10">
                            <div className="mb-3">
                                <span className="dashboard-welcome">
                                    Hello <span className="bg-gradient-to-r from-cyan-400 to-blue-400 bg-clip-text text-transparent">{user?.first_name}</span> 👋
                                </span>
                            </div>
                            <h1 className="dashboard-title">
                                Trainer Hub
                            </h1>
                            <p className="text-xl text-white/80">Manage your sessions and courses with style</p>
                        </div>
                    </div>
                </div>

                {/* Navigation Tabs */}
                <div className="dashboard-tabs">
                    {navigationTabs.map(tab => (
                        <button
                            key={tab.id}
                            onClick={() => setActiveView(tab.id)}
                            className={`dashboard-tab ${activeView === tab.id ? 'dashboard-tab-active' : 'dashboard-tab-inactive'}`}
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
                        {/* Stats Overview */}
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
                            {statsConfig.map((stat, index) => {
                                const colorClasses = colorClassMap[stat.color] || { gradient: '', text: '' };
                                return (
                                    <div key={index} className="dashboard-stats-card">
                                        <div className="flex items-center justify-between mb-4">
                                            <div className={`w-12 h-12 bg-gradient-to-br ${colorClasses.gradient} rounded-2xl flex items-center justify-center`}>
                                                <i className={`${stat.icon} text-xl ${colorClasses.text}`}></i>
                                            </div>
                                            <div className="text-right">
                                                {stat.key === 'sessions' && (
                                                    <>
                                                        <div className={`text-4xl font-black ${colorClasses.text}`}>{sessions.length}</div>
                                                        <h3 className="text-white font-semibold mb-2">{stat.label}</h3>
                                                        {sessions.length > 0 ? (
                                                            <div className="text-white/70 text-sm mt-1">
                                                                {nextUpcomingSession ? (
                                                                    <>Next: <span className="font-semibold">{nextUpcomingSession.skill_name}</span> on {formatSessionDate(nextUpcomingSession.date)} at {formatSessionTime(nextUpcomingSession.date)}</>
                                                                ) : (
                                                                    'No upcoming sessions found after today'
                                                                )}
                                                            </div>
                                                        ) : (
                                                            <div className="text-white/70 text-sm mt-1">No sessions assigned</div>
                                                        )}
                                                    </>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>

                        {/* Main Content Grid */}
                        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                            {/* Sessions Preview Section */}
                            <div className="lg:col-span-2">
                                <div className="dashboard-main-card">
                                    <div className="flex items-center justify-between mb-8">
                                        <h2 className="text-3xl font-bold bg-gradient-to-r from-cyan-400 via-purple-400 to-pink-400 bg-clip-text text-transparent flex items-center">
                                            <i className="fas fa-calendar-alt text-cyan-400 mr-3"></i>
                                            My Assigned Sessions
                                        </h2>
                                    </div>
                                    {loading ? (
                                        <div className="flex flex-col items-center justify-center py-12 animate-pulse">
                                            <div className="animate-spin w-12 h-12 border-4 border-cyan-400 border-t-transparent rounded-full mx-auto mb-4"></div>
                                            <div className="h-6 w-48 bg-cyan-400/20 rounded mb-4"></div>
                                            <div className="h-4 w-64 bg-cyan-400/10 rounded"></div>
                                        </div>
                                    ) : sessions.length === 0 ? (
                                        <div className="text-center py-12">
                                            <div className="w-24 h-24 bg-gradient-to-br from-cyan-400/20 to-purple-400/20 rounded-full flex items-center justify-center mx-auto mb-4 animate-float">
                                                <i className="fas fa-calendar-times text-4xl text-cyan-300"></i>
                                            </div>
                                            <h3 className="text-2xl font-semibold bg-gradient-to-r from-cyan-400 via-purple-400 to-pink-400 bg-clip-text text-transparent mb-2">
                                                No sessions assigned
                                            </h3>
                                            <p className="text-white/70 text-lg">
                                                You have no sessions yet. Contact your coordinator to get started!
                                            </p>
                                        </div>
                                    ) : (
                                        <>
                                            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-2 gap-8">
                                                {sessions.slice(0, 3).map(session => (
                                                    <div key={session.id} className="relative">
                                                        <Link
                                                            to={`/sessions/${session.id}`}
                                                            className="dashboard-session-card group flex flex-col justify-between"
                                                        >
                                                            <div className="flex items-start justify-between mb-4 flex-wrap">
                                                                <div className="flex-grow min-w-0 pr-2 max-w-[calc(100%-6rem)] md:max-w-none">
                                                                    <h3 className="dashboard-session-title" title={session.skill_name}>{session.skill_name}</h3>
                                                                    {/* REVISED: Use formatCompactDateTime for a single, compact line */}
                                                                    <p className="text-white/70 text-lg truncate" title={`${session.date ? formatCompactDateTime(session.date) : 'No date'} | ${session.location}`}>
                                                                        {session.date ? formatCompactDateTime(session.date) : 'No date'} | {session.location}
                                                                    </p>
                                                                </div>
                                                                <div className="flex-shrink-0 flex flex-col items-end min-w-[5rem] ml-2 mt-1 sm:mt-0">
                                                                    <span className="dashboard-session-category" title={session.category?.name}>{session.category?.name || 'No Category'}</span>
                                                                    <i className="fas fa-arrow-right text-cyan-400 text-2xl group-hover:translate-x-2 transition-transform duration-300 mt-2" />
                                                                </div>
                                                            </div>
                                                            <div className="text-white/60 text-lg mt-auto">
                                                                {session.training_courses && session.training_courses.length > 0 ? (
                                                                    <>
                                                                        <span className="font-bold text-cyan-400">{session.training_courses.length}</span> course{session.training_courses.length > 1 ? 's' : ''}
                                                                        <div className="dashboard-session-courses">
                                                                            {session.training_courses.slice(0, 2).map((course, idx) => (
                                                                                <span key={course.id || idx} className="px-3 py-1 bg-cyan-400/10 text-cyan-200 rounded text-sm font-semibold truncate max-w-[120px]" title={course.title}>
                                                                                    {course.title}
                                                                                </span>
                                                                            ))}
                                                                            {session.training_courses.length > 2 && (
                                                                                <span className="px-3 py-1 bg-cyan-400/10 text-cyan-200 rounded text-sm font-semibold">+{session.training_courses.length - 2} more</span>
                                                                            )}
                                                                        </div>
                                                                    </>
                                                                ) : (
                                                                    <span className="italic">No courses assigned</span>
                                                                )}
                                                            </div>
                                                        </Link>
                                                    </div>
                                                ))}
                                            </div>
                                            {sessions.length > 3 && (
                                                <div className="flex justify-end mt-6">
                                                    <button
                                                        className="px-6 py-2 bg-gradient-to-r from-cyan-500 to-purple-500 hover:from-cyan-600 hover:to-purple-600 rounded-xl text-white font-semibold transition-all duration-300 hover:scale-105 flex items-center"
                                                        onClick={() => setActiveView('sessions')}
                                                    >
                                                        <i className="fas fa-list mr-2"></i>
                                                        View All Sessions
                                                    </button>
                                                </div>
                                            )}
                                        </>
                                    )}
                                </div>
                            </div>

                            {/* Sidebar */}
                            <div className="space-y-8">
                                {/* Quick Actions */}
                                <div className="dashboard-sidebar-card">
                                    <h3 className="text-xl font-bold text-white mb-4 flex items-center">
                                        <i className="fas fa-bolt text-yellow-400 mr-2"></i>
                                        Quick Actions
                                    </h3>
                                    <div className="space-y-3">
                                        <button
                                            className="w-full px-4 py-3 bg-gradient-to-r from-cyan-500 to-purple-500 hover:from-cyan-600 hover:to-purple-600 rounded-xl text-white font-semibold transition-all duration-300 hover:scale-105 flex items-center justify-center"
                                            onClick={() => setActiveView('sessions')}
                                        >
                                            <i className="fas fa-calendar-alt mr-2"></i>
                                            View All Sessions
                                        </button>
                                    </div>
                                </div>

                                {/* Recent Activity */}
                                <div className="dashboard-sidebar-card">
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
                                                    <div className="flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center text-lg bg-cyan-400/20 text-cyan-400">
                                                        <i className="fas fa-activity"></i>
                                                    </div>
                                                    <div className="flex-1 min-w-0">
                                                        <div className="flex items-center justify-between mb-1">
                                                            <div className="text-white font-semibold text-sm truncate pr-2">Activity</div>
                                                            <div className="text-white/60 text-xs flex-shrink-0">--</div>
                                                        </div>
                                                        <div className="text-white/70 text-xs leading-relaxed">No activity yet.</div>
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
                    // Sessions tab (could be expanded in the future)
                    <div className="dashboard-main-card">
                        <h2 className="text-3xl font-bold bg-gradient-to-r from-cyan-400 via-purple-400 to-pink-400 bg-clip-text text-transparent flex items-center mb-8">
                            <i className="fas fa-calendar-alt text-cyan-400 mr-3"></i>
                            All Assigned Sessions
                        </h2>
                        {/* Search Bar */}
                        <div className="mb-6 flex items-center">
                            <div className="relative w-full max-w-md">
                                <input
                                    type="text"
                                    className="dashboard-search-bar"
                                    placeholder="Search by name, category, or location..."
                                    value={searchTerm}
                                    onChange={e => setSearchTerm(e.target.value)}
                                />
                                <i className="fas fa-search absolute left-4 top-1/2 -translate-y-1/2 text-cyan-300 text-lg"></i>
                            </div>
                        </div>
                        {/* List all sessions in a vertical list */}
                        <div className="dashboard-scroll">
                            {loading ? (
                                <div className="flex flex-col items-center justify-center py-12 animate-pulse">
                                    <div className="animate-spin w-12 h-12 border-4 border-purple-400 border-t-transparent rounded-full mx-auto mb-4"></div>
                                    <div className="h-6 w-48 bg-purple-400/20 rounded mb-4"></div>
                                </div>
                            ) : filteredSessions.length === 0 ? (
                                <div className="text-center py-12 text-white/70">No sessions found.</div>
                            ) : (
                                filteredSessions.map(session => (
                                    <Link
                                        key={session.id}
                                        to={`/sessions/${session.id}`}
                                        className="flex items-center justify-between py-6 px-2 hover:bg-white/10 transition rounded-xl group"
                                    >
                                        <div className="flex-grow min-w-0 pr-4">
                                            <div className="text-xl font-bold text-white group-hover:text-cyan-400 transition-colors duration-300 truncate" title={session.skill_name}>{session.skill_name}</div>
                                            {/* REVISED: Use formatCompactDateTime here as well for consistency */}
                                            <div className="text-white/70 text-md truncate">
                                                {session.date ? formatCompactDateTime(session.date) : 'No date'} | {session.location}
                                            </div>
                                        </div>
                                        <div className="flex-shrink-0 flex flex-col items-end ml-2">
                                            <span className="inline-block px-3 py-1 rounded-full bg-cyan-400/20 text-cyan-300 text-xs font-bold mb-2 truncate max-w-[120px]" title={session.category?.name}>{session.category?.name || 'No Category'}</span>
                                            <i className="fas fa-arrow-right text-cyan-400 text-xl group-hover:translate-x-2 transition-transform duration-300" />
                                        </div>
                                    </Link>
                                ))
                            )}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default TrainerDashboard;