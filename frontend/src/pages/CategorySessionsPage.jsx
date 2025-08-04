import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import {
    format,
    isSameDay,
    isSameMonth,
    isSameYear,
    parseISO,
    isValid,
    formatDistanceToNow,
    isAfter,
    isBefore,
    startOfDay
} from 'date-fns';
import GlassmorphismBackground from '../components/GlassmorphismBackground';

// Use environment variable for API URL, fallback to localhost for development
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000/api';

function CategorySessionsPage() {
    const { categoryId } = useParams();
    const { user } = useAuth();
    const navigate = useNavigate();
    const [category, setCategory] = useState(null);
    const [sessions, setSessions] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [search, setSearch] = useState("");

    useEffect(() => {
        fetchCategoryAndSessions();
    }, [categoryId]);

    const fetchCategoryAndSessions = async () => {
        try {
            setLoading(true);
            // Fetch category details
            const catRes = await fetch(`${API_BASE_URL}/categories/${categoryId}`);
            if (!catRes.ok) throw new Error('Failed to fetch category');
            const catData = await catRes.json();
            setCategory(catData);
            // Fetch sessions for this category
            const sessRes = await fetch(`${API_BASE_URL}/training-sessions/category/${categoryId}`);
            if (!sessRes.ok) throw new Error('Failed to fetch sessions');
            const sessData = await sessRes.json();
            setSessions(sessData);
            setError(null);
        } catch (err) {
            setError(err.message);
            setCategory(null);
            setSessions([]);
        } finally {
            setLoading(false);
        }
    };

    const filteredSessions = sessions.filter(session =>
        session.skill_name.toLowerCase().includes(search.toLowerCase()) ||
        (session.skill_description && session.skill_description.toLowerCase().includes(search.toLowerCase()))
    );

    return (
        <div className="min-h-screen relative overflow-hidden bg-gradient-to-br from-cyan-900/40 via-purple-900/40 to-pink-900/40">
            <div className="max-w-6xl mx-auto px-6 py-20">
                <div className="mb-12 text-center">
                    {category && (
                        <>
                            <h1 className="text-5xl font-black mb-4 bg-gradient-to-r from-cyan-400 via-purple-400 to-pink-400 bg-clip-text text-transparent drop-shadow-2xl animate-gradient-x">
                                {category.name}
                            </h1>
                            <p className="text-xl text-white/80 max-w-2xl mx-auto mb-4">{category.description}</p>
                        </>
                    )}
                    <Link to="/categories" className="text-cyan-400 hover:underline text-lg font-semibold">
                        &larr; Back to Categories
                    </Link>
                </div>
                <GlassmorphismBackground />
                <div className="flex justify-center mb-12">
                    <input
                        type="text"
                        value={search}
                        onChange={e => setSearch(e.target.value)}
                        placeholder="Search sessions..."
                        className="w-full max-w-lg px-6 py-4 rounded-2xl bg-white/10 border border-white/20 text-white placeholder-white/60 focus:outline-none focus:border-cyan-400 focus:bg-white/20 text-lg shadow-xl backdrop-blur-xl transition-all"
                    />
                </div>
                {error && (
                    <div className="mb-8 p-4 bg-red-500/20 backdrop-blur-xl rounded-xl border border-red-500/30 text-red-200 max-w-md mx-auto text-center">
                        <i className="fas fa-exclamation-triangle mr-2"></i>
                        {error}
                    </div>
                )}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
                    {loading ? (
                        Array.from({ length: 6 }).map((_, idx) => (
                            <div key={idx} className="bg-white/10 backdrop-blur-2xl rounded-3xl p-8 border border-white/20 animate-pulse h-72"></div>
                        ))
                    ) : filteredSessions.length === 0 ? (
                        <div className="col-span-full text-center text-white/70 text-xl py-24">
                            <i className="fas fa-calendar-times text-3xl mb-4"></i>
                            <div>No training sessions found for this category.</div>
                        </div>
                    ) : (
                        filteredSessions.map(session => (
                            <div key={session.id} className="relative bg-white/10 backdrop-blur-2xl rounded-3xl p-8 border border-white/20 hover:border-cyan-400/60 transition-all duration-500 shadow-xl h-80 flex flex-col group">
                                <div className="flex items-center justify-between mb-2">
                                    <h3 className="text-2xl font-bold text-white mb-1 truncate flex-1">
                                        {session.skill_name}
                                    </h3>
                                    <span className={`px-3 py-1 rounded-full text-xs font-bold ml-2 shadow-md ${session.status === 'confirmed' ? 'bg-green-500/20 text-green-300 border border-green-400/30' : session.status === 'cancelled' ? 'bg-red-500/20 text-red-300 border border-red-400/30' : 'bg-blue-500/20 text-blue-200 border border-blue-400/30'}`}>{session.status ? session.status.charAt(0).toUpperCase() + session.status.slice(1) : 'Active'}</span>
                                </div>
                                <div className="text-white/80 text-base mb-2 line-clamp-3 font-medium">
                                    {session.skill_description || <span className="italic text-white/40">No description provided.</span>}
                                </div>
                                <div className="flex flex-wrap gap-2 text-white/70 text-sm mb-2">
                                    <div className="flex items-center gap-1">
                                        <i className="fas fa-user mr-1 text-cyan-300"></i>
                                        <span className="font-semibold text-white/90">{session.trainer?.first_name} {session.trainer?.last_name}</span>
                                    </div>
                                    <span className="mx-2 text-white/30">|</span>
                                    <div className="flex items-center gap-1">
                                        <i className="fas fa-map-marker-alt mr-1 text-pink-300"></i>
                                        <span>{session.location || <span className="italic text-white/40">TBA</span>}</span>
                                    </div>
                                </div>
                                <div className="flex flex-col gap-1 text-white/70 text-xs mb-2">
                                    <div className="flex items-center gap-2">
                                        <i className="fas fa-calendar mr-1 text-purple-300"></i>
                                        <span className="font-semibold text-white/90">{formatSessionDate(session)}</span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <i className="fas fa-clock mr-1 text-cyan-200"></i>
                                        <span className="font-semibold text-white/90">{formatSessionTime(session)}</span>
                                    </div>
                                    {getSessionTimingInfo(session) && (
                                        <div className="flex items-center gap-2">
                                            <i className="fas fa-hourglass-half mr-1 text-yellow-300"></i>
                                            <span className="font-semibold text-white/90">{getSessionTimingInfo(session)}</span>
                                        </div>
                                    )}
                                </div>
                                <div className="flex items-center gap-2 text-white/60 text-xs mb-2">
                                    <i className="fas fa-users mr-1 text-blue-300"></i>
                                    <span>Capacity:</span>
                                    <span className="font-semibold text-white/80">{session.max_participants || 'N/A'}</span>
                                </div>
                                <div className="mt-auto flex gap-3">
                                    {user ? (
                                        <button
                                            className="w-full py-3 px-6 bg-white/10 hover:bg-white/20 backdrop-blur-xl rounded-xl border border-white/20 hover:border-white/40 text-white font-semibold transition-all duration-300 text-base flex items-center justify-center gap-2 shadow-none cursor-pointer focus:outline-none focus:ring-2 focus:ring-cyan-400"
                                            onClick={() => navigate(`/sessions/${session.id}?enroll=1`)}
                                        >
                                            <i className="fas fa-user-plus text-cyan-400 group-hover:text-pink-400 transition-colors duration-300"></i>
                                            <span>Enroll</span>
                                        </button>
                                    ) : (
                                        <button
                                            className="w-full py-3 px-6 bg-white/10 backdrop-blur-xl rounded-xl border border-white/20 text-white/60 font-semibold transition-all duration-300 text-base flex items-center justify-center gap-2 shadow-none cursor-not-allowed relative group"
                                            title="Login to enroll"
                                            onClick={() => navigate('/login')}
                                        >
                                            <i className="fas fa-lock text-cyan-400"></i>
                                            <span>Enroll</span>
                                            <span className="absolute left-1/2 -bottom-8 -translate-x-1/2 bg-black/80 text-white text-xs rounded px-2 py-1 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">Login to enroll</span>
                                        </button>
                                    )}
                                </div>
                            </div>
                        ))
                    )}
                </div>
            </div>
        </div>
    );
}

export default CategorySessionsPage;

// Enhanced helper functions for better date and time formatting
function formatSessionDate(session) {
    if (!session.date) return 'Date TBA';

    try {
        // Handle both ISO strings and regular date strings
        let dateToFormat = session.date;

        // If it's an ISO string with timezone, extract just the date part
        if (typeof dateToFormat === 'string' && dateToFormat.includes('T')) {
            dateToFormat = dateToFormat.split('T')[0];
        }

        const startDate = parseISO(dateToFormat);

        // Validate the parsed date
        if (!isValid(startDate)) {
            return 'Invalid date';
        }

        // If there's an end date and it's different from start date
        if (session.end_date && session.date !== session.end_date) {
            let endDateToFormat = session.end_date;

            // Handle ISO strings for end date too
            if (typeof endDateToFormat === 'string' && endDateToFormat.includes('T')) {
                endDateToFormat = endDateToFormat.split('T')[0];
            }

            const endDate = parseISO(endDateToFormat);

            if (!isValid(endDate)) {
                return format(startDate, 'EEEE, MMMM do, yyyy');
            }

            // Multi-day session formatting
            if (isSameYear(startDate, endDate)) {
                if (isSameMonth(startDate, endDate)) {
                    // Same month: "Jan 15-20, 2024"
                    return `${format(startDate, 'MMM do')} - ${format(endDate, 'do, yyyy')}`;
                } else {
                    // Different months, same year: "Jan 30 - Feb 5, 2024"
                    return `${format(startDate, 'MMM do')} - ${format(endDate, 'MMM do, yyyy')}`;
                }
            } else {
                // Different years: "Dec 30, 2023 - Jan 5, 2024"
                return `${format(startDate, 'MMM do, yyyy')} - ${format(endDate, 'MMM do, yyyy')}`;
            }
        }

        // Single day session: "Monday, January 15th, 2024"
        return format(startDate, 'EEEE, MMMM do, yyyy');

    } catch (error) {
        console.error('Error formatting session date:', error);
        return 'Date formatting error';
    }
}

function formatSessionTime(session) {
    if (!session.start_time) {
        return 'Time TBA';
    }

    try {
        let sessionDate = session.date;
        if (typeof sessionDate === 'string' && sessionDate.includes('T')) {
            sessionDate = sessionDate.split('T')[0];
        }
        const startDateTime = createDateTime(sessionDate, session.start_time);
        if (!isValid(startDateTime)) {
            return formatSimpleTime(session.start_time);
        }
        // If there's an end time
        if (session.end_time) {
            let endDate = session.end_date || sessionDate;
            if (typeof endDate === 'string' && endDate.includes('T')) {
                endDate = endDate.split('T')[0];
            }
            const endDateTime = createDateTime(endDate, session.end_time);
            if (!isValid(endDateTime)) {
                return `${format(startDateTime, 'h:mm a')} - ${formatSimpleTime(session.end_time)}`;
            }
            // If both times are midnight or the same, show 'All day'
            if (
                startDateTime.getHours() === 0 && startDateTime.getMinutes() === 0 &&
                endDateTime.getHours() === 0 && endDateTime.getMinutes() === 0
            ) {
                return 'All day';
            }
            if (
                startDateTime.getTime() === endDateTime.getTime()
            ) {
                return format(startDateTime, 'h:mm a');
            }
            // Same day session
            if (isSameDay(startDateTime, endDateTime)) {
                return `${format(startDateTime, 'h:mm a')} - ${format(endDateTime, 'h:mm a')}`;
            } else {
                // Multi-day session with times
                return `${format(startDateTime, 'MMM do, h:mm a')} - ${format(endDateTime, 'MMM do, h:mm a')}`;
            }
        }
        // Only start time available
        return `Starts at ${format(startDateTime, 'h:mm a')}`;
    } catch (error) {
        console.error('Error formatting session time:', error);
        return formatSimpleTime(session.start_time) || 'Time formatting error';
    }
}

function getSessionTimingInfo(session) {
    if (!session.date) return null;

    try {
        let sessionDate = session.date;

        // Extract date part if it's an ISO string
        if (typeof sessionDate === 'string' && sessionDate.includes('T')) {
            sessionDate = sessionDate.split('T')[0];
        }

        const sessionDateTime = parseISO(sessionDate);
        const now = new Date();

        if (!isValid(sessionDateTime)) return null;

        const sessionStart = startOfDay(sessionDateTime);
        const today = startOfDay(now);

        if (isBefore(sessionStart, today)) {
            return `Ended ${formatDistanceToNow(sessionDateTime, { addSuffix: true })}`;
        } else if (isSameDay(sessionStart, today)) {
            return 'Today';
        } else {
            return `Starts ${formatDistanceToNow(sessionDateTime, { addSuffix: true })}`;
        }

    } catch (error) {
        console.error('Error getting session timing info:', error);
        return null;
    }
}

function formatSimpleTime(timeString) {
    if (!timeString) return '';

    try {
        // Handle different time formats
        const [hours, minutes] = timeString.split(':');
        const hour = parseInt(hours, 10);
        const minute = parseInt(minutes, 10);

        if (isNaN(hour) || isNaN(minute)) {
            return timeString; // Return original if parsing fails
        }

        // Convert to 12-hour format
        const period = hour >= 12 ? 'PM' : 'AM';
        const displayHour = hour === 0 ? 12 : hour > 12 ? hour - 12 : hour;

        return `${displayHour}:${minute.toString().padStart(2, '0')} ${period}`;

    } catch (error) {
        return timeString; // Return original if any error occurs
    }
}

function createDateTime(dateString, timeString) {
    if (!dateString || !timeString) return null;

    try {
        // If timeString is already a time (HH:mm or HH:mm:ss), just append to date
        let cleanDate = dateString;
        if (typeof dateString === 'string' && dateString.includes('T')) {
            cleanDate = dateString.split('T')[0];
        }
        // If timeString is a full ISO string, extract time part
        let normalizedTime = normalizeTimeString(timeString);
        // If timeString is a full date (e.g. 2025-07-10T17:05:00.000000Z), extract time
        if (/\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}/.test(timeString)) {
            const match = timeString.match(/T(\d{2}:\d{2}:\d{2})/);
            if (match) normalizedTime = match[1];
        }
        // If timeString is a date (e.g. 2025-07-10 17:05:00), extract time
        if (/\d{4}-\d{2}-\d{2} \d{2}:\d{2}:\d{2}/.test(timeString)) {
            normalizedTime = timeString.split(' ')[1];
        }
        // If timeString is just HH:mm, add :00
        if (/^\d{1,2}:\d{2}$/.test(normalizedTime)) {
            normalizedTime = `${normalizedTime}:00`;
        }
        const dateTimeString = `${cleanDate}T${normalizedTime}`;
        return parseISO(dateTimeString);
    } catch (error) {
        console.error('Error creating datetime:', error);
        return null;
    }
}

function normalizeTimeString(timeString) {
    if (!timeString) return '00:00:00';

    // Remove any timezone info and whitespace
    let cleanTime = timeString.trim().split(/[+-]/)[0];

    // If it's an ISO datetime string, extract the time part
    if (/\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}/.test(cleanTime)) {
        // Example: 2025-07-09T17:05:00.000000Z or 2025-07-09T17:05:00
        const timeMatch = cleanTime.match(/T(\d{2}:\d{2}:\d{2})/);
        if (timeMatch) {
            cleanTime = timeMatch[1];
        } else {
            // Try to match HH:mm if seconds are missing
            const timeMatchShort = cleanTime.match(/T(\d{2}:\d{2})/);
            if (timeMatchShort) {
                cleanTime = `${timeMatchShort[1]}:00`;
            }
        }
    }

    // Handle Laravel's H:i format (24-hour format without seconds)
    if (/^\d{1,2}:\d{2}$/.test(cleanTime)) {
        // HH:mm format (Laravel's H:i) - add seconds
        return `${cleanTime}:00`;
    } else if (/^\d{1,2}:\d{2}:\d{2}$/.test(cleanTime)) {
        // HH:mm:ss format - already complete
        return cleanTime;
    } else {
        // Invalid format, return default
        console.warn('Invalid time format:', timeString);
        return '00:00:00';
    }
}