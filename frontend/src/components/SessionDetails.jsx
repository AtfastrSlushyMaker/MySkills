import { useEffect, useState } from 'react';
import { trainingSessionApi, trainingCourseApi, toggleCourseActiveApi } from '../services/api';
import Modal from './modals/CreateSessionModal' // for style reference only

const SessionDetails = ({ sessionId, onBack, canCreateCourse = true }) => {
    const [session, setSession] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [showCreateCourseModal, setShowCreateCourseModal] = useState(false);
    const [showUpdateModal, setShowUpdateModal] = useState(false)
    const [selectedCourse, setSelectedCourse] = useState(null)
    const [updating, setUpdating] = useState(false)
    const [updateForm, setUpdateForm] = useState({ title: '', description: '' })

    useEffect(() => {
        const fetchSession = async () => {
            setLoading(true);
            try {
                const res = await trainingSessionApi.getSession(sessionId);
                setSession(res.data);
            } catch (e) {
                setError('Session not found.');
            } finally {
                setLoading(false);
            }
        };
        fetchSession();
    }, [sessionId]);

    // Always prefer session.training_courses if present, else fallback to course, else empty array
    const courses = session && (Array.isArray(session.training_courses)
        ? session.training_courses
        : session?.course
            ? [session.course]
            : []);

    if (loading) return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-cyan-900 via-purple-900 to-pink-900">
            <div className="bg-white/10 backdrop-blur-3xl rounded-3xl p-8 border border-white/20">
                <div className="animate-spin w-12 h-12 border-4 border-cyan-400 border-t-transparent rounded-full mx-auto mb-4"></div>
                <p className="text-white text-center">Loading session details...</p>
            </div>
        </div>
    );
    if (error || !session) return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-cyan-900 via-purple-900 to-pink-900">
            <div className="bg-red-500/10 border border-red-400/30 rounded-3xl p-8">
                <p className="text-red-400 text-center">{error || 'Session not found.'}</p>
                <button onClick={onBack} className="mt-4 px-4 py-2 bg-red-400/20 text-red-300 rounded-lg">Go Back</button>
            </div>
        </div>
    );

    const openUpdateModal = (course) => {
        setSelectedCourse(course)
        setUpdateForm({ title: course.title, description: course.description || '' })
        setShowUpdateModal(true)
    }
    const closeUpdateModal = () => {
        setShowUpdateModal(false)
        setSelectedCourse(null)
    }
    const handleUpdateChange = (e) => {
        setUpdateForm({ ...updateForm, [e.target.name]: e.target.value })
    }
    const handleUpdateSubmit = async (e) => {
        e.preventDefault()
        if (!selectedCourse) return
        setUpdating(true)
        try {
            await trainingCourseApi.updateCourse(selectedCourse.id, updateForm)
            // refetch session
            const res = await trainingSessionApi.getSession(sessionId)
            setSession(res.data)
            closeUpdateModal()
        } catch (err) {
            // handle error
        } finally {
            setUpdating(false)
        }
    }
    const handleToggleActive = async (course) => {
        try {
            await toggleCourseActiveApi(course.id, !course.is_active)
            const res = await trainingSessionApi.getSession(sessionId)
            setSession(res.data)
        } catch (err) {
            // handle error
        }
    }

    return (
        <div className="min-h-screen relative overflow-hidden">
            {/* Animated Orbs for glassmorphism effect */}
            <div className="absolute top-20 left-10 w-80 h-80 bg-gradient-to-br from-cyan-400/40 to-blue-600/40 rounded-full mix-blend-multiply filter blur-3xl animate-float" style={{ zIndex: 1 }}></div>
            <div className="absolute top-40 right-10 w-96 h-96 bg-gradient-to-br from-purple-400/40 to-pink-600/40 rounded-full mix-blend-multiply filter blur-3xl animate-float-delayed" style={{ zIndex: 1 }}></div>
            <div className="absolute bottom-20 left-1/3 w-80 h-80 bg-gradient-to-br from-emerald-400/40 to-cyan-600/40 rounded-full mix-blend-multiply filter blur-3xl animate-float-slow" style={{ zIndex: 1 }}></div>
            <div className="relative z-10 max-w-5xl mx-auto px-4 py-16 flex flex-col gap-10">
                {/* Back Button */}
                <div className="flex items-center gap-4 mb-6">
                    <button onClick={onBack} className="flex items-center gap-2 px-4 py-2 bg-white/10 hover:bg-white/20 text-cyan-200 font-semibold rounded-xl shadow-lg backdrop-blur border border-white/20 transition">
                        <i className="fas fa-arrow-left text-lg"></i> Back to Sessions
                    </button>
                </div>
                {/* Session Header Card */}
                <div className="bg-white/10 backdrop-blur-3xl rounded-3xl p-10 border border-white/20 shadow-2xl flex flex-col gap-4 relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-cyan-400/20 to-purple-400/20 rounded-full blur-3xl"></div>
                    <div className="absolute left-0 top-0 w-24 h-24 bg-gradient-to-br from-cyan-400/20 to-pink-400/20 rounded-full blur-2xl"></div>
                    <div className="relative z-10">
                        <h2 className="text-5xl font-black mb-2 bg-gradient-to-r from-cyan-400 via-purple-400 to-pink-400 bg-clip-text text-transparent flex items-center drop-shadow-xl">
                            <i className="fas fa-calendar-alt text-4xl text-cyan-400 mr-3"></i>
                            {session.skill_name}
                        </h2>
                        <div className="flex flex-wrap gap-4 items-center mb-4">
                            <span className="text-white/80 text-lg font-semibold">
                                <i className="fas fa-map-marker-alt mr-2"></i>{session.location}
                            </span>
                            <span className="text-white/80 text-lg font-semibold">
                                <i className="fas fa-clock mr-2"></i>
                                {session.date && (
                                    new Date(session.date).toLocaleDateString('en-US', {
                                        weekday: 'long',
                                        year: 'numeric',
                                        month: 'long',
                                        day: 'numeric',
                                    })
                                )}
                            </span>
                            <span className="inline-block px-3 py-1 rounded-full bg-cyan-400/20 text-cyan-300 text-xs font-bold">
                                {session.category?.name || 'No Category'}
                            </span>
                            <span className="inline-block px-3 py-1 rounded-full bg-purple-400/20 text-purple-300 text-xs font-bold">
                                <i className="fas fa-users mr-1"></i>Max {session.max_participants} participants
                            </span>
                            {session.status && (
                                <span className="inline-block px-3 py-1 rounded-full bg-green-400/20 text-green-300 text-xs font-bold capitalize">
                                    <i className="fas fa-check-circle mr-1"></i>{session.status}
                                </span>
                            )}
                        </div>
                        <div className="text-white/70 text-lg mb-2 font-light italic">{session.skill_description}</div>
                        <div className="text-white/60 text-md mb-2">
                            <span className="font-bold">Coordinator:</span> {session.coordinator?.first_name} {session.coordinator?.last_name}
                        </div>
                    </div>
                </div>
                {/* Courses Section */}
                <div className="bg-white/10 backdrop-blur-3xl rounded-3xl p-8 border border-white/20 shadow-xl animate-fade-in relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-purple-400/20 to-pink-400/20 rounded-full blur-3xl"></div>
                    <div className="absolute bottom-0 left-0 w-24 h-24 bg-gradient-to-br from-cyan-400/20 to-blue-400/20 rounded-full blur-3xl"></div>
                    <div className="relative z-10">
                        <h3 className="text-3xl font-black text-white mb-6 flex items-center tracking-tight">
                            <i className="fas fa-book-open text-purple-400 mr-3"></i>
                            Courses in this Session
                        </h3>
                        {courses.length === 0 ? (
                            <div className="text-white/60 italic mb-4">No courses assigned to this session yet.</div>
                        ) : (
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                {courses.map((course, idx) => (
                                    <div key={course.id || idx} className="bg-gradient-to-br from-purple-900/30 via-cyan-900/20 to-pink-900/30 backdrop-blur-xl rounded-2xl p-6 border border-white/20 hover:border-purple-400 transition-all duration-300 shadow-2xl hover:scale-105 relative overflow-hidden">
                                        <div className="absolute top-0 right-0 w-16 h-16 bg-gradient-to-br from-blue-400/20 to-indigo-400/20 rounded-full blur-2xl"></div>
                                        <div className="absolute bottom-0 left-0 w-12 h-12 bg-gradient-to-br from-purple-400/20 to-pink-400/20 rounded-full blur-2xl"></div>
                                        <div className="relative z-10">
                                            <div className="flex items-center justify-between mb-2">
                                                <h4 className="text-2xl font-bold text-white mb-1 text-glow tracking-tight drop-shadow-lg">{course.title}</h4>
                                                <span className="text-lg font-bold text-purple-400">{course.duration_hours}h</span>
                                            </div>
                                            <div className="text-white/70 mb-2 text-base font-light">{course.description}</div>
                                            <div className="flex flex-wrap gap-2 text-xs text-white/60 mb-2">
                                                {course.is_active ? (
                                                    <span className="px-2 py-1 rounded bg-green-400/20 text-green-300">Active</span>
                                                ) : (
                                                    <span className="px-2 py-1 rounded bg-red-400/20 text-red-300">Inactive</span>
                                                )}
                                                {course.created_at && (
                                                    <span className="px-2 py-1 rounded bg-white/10">Created: {new Date(course.created_at).toLocaleDateString()}</span>
                                                )}
                                            </div>
                                            <div className="flex gap-2 mt-2">
                                                <button
                                                    type="button"
                                                    className="px-3 py-1 bg-white/20 hover:bg-cyan-400/20 rounded text-cyan-200 text-xs font-semibold flex items-center gap-1 border border-cyan-300/30 hover:border-cyan-400/60 transition"
                                                    onClick={() => openUpdateModal(course)}
                                                    title="Edit Course"
                                                >
                                                    <i className="fas fa-edit"></i> Edit
                                                </button>
                                                <button
                                                    type="button"
                                                    className={`px-3 py-1 rounded text-xs font-semibold flex items-center gap-1 border transition ${course.is_active ? 'bg-green-400/10 text-green-300 border-green-300/30 hover:bg-green-400/20' : 'bg-red-400/10 text-red-300 border-red-300/30 hover:bg-red-400/20'}`}
                                                    onClick={() => handleToggleActive(course)}
                                                    title={course.is_active ? 'Make Inactive' : 'Make Active'}
                                                >
                                                    <i className={`fas ${course.is_active ? 'fa-toggle-on' : 'fa-toggle-off'}`}></i>
                                                    {course.is_active ? 'Active' : 'Inactive'}
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                        {/* Only show create course if allowed */}
                        {canCreateCourse && (
                            <div className="mt-8 flex justify-end">
                                <button
                                    onClick={() => setShowCreateCourseModal(true)}
                                    className="px-7 py-3 bg-gradient-to-r from-cyan-500 to-purple-500 hover:from-cyan-600 hover:to-purple-600 rounded-xl text-white font-bold text-lg transition-all duration-300 hover:scale-105 shadow-lg flex items-center"
                                >
                                    <i className="fas fa-plus mr-2"></i> Create Course for this Session
                                </button>
                            </div>
                        )}
                    </div>
                </div>
                {/* Modal rendered at root level for proper overlay */}
                {/* You can add CreateCourseModal here if needed */}
            </div>
            {/* Update Course Modal styled like CreateSessionModal */}
            {showUpdateModal && (
                <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-lg p-4 overflow-y-auto pt-24">
                    <div className="min-h-full flex items-center justify-center py-4">
                        <div className="bg-white/25 backdrop-blur-3xl rounded-3xl p-6 border border-white/30 shadow-2xl max-w-lg w-full relative transform transition-all duration-300 ease-out">
                            {/* Decorative background elements */}
                            <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-blue-400/20 to-indigo-400/20 rounded-full blur-3xl"></div>
                            <div className="absolute bottom-0 left-0 w-24 h-24 bg-gradient-to-br from-purple-400/20 to-pink-400/20 rounded-full blur-3xl"></div>
                            <div className="relative z-10">
                                <div className="flex items-center justify-between mb-6">
                                    <h2 className="text-2xl font-bold bg-gradient-to-r from-blue-400 via-indigo-400 to-purple-400 bg-clip-text text-transparent">
                                        Update Course
                                    </h2>
                                    <button
                                        onClick={closeUpdateModal}
                                        className="w-8 h-8 bg-white/15 hover:bg-white/25 rounded-full flex items-center justify-center transition-all duration-300 border border-white/25 hover:border-white/40"
                                    >
                                        <i className="fas fa-times text-white text-sm"></i>
                                    </button>
                                </div>
                                <form onSubmit={handleUpdateSubmit} className="space-y-3">
                                    <div className="mb-4">
                                        <label className="block text-white/90 text-sm font-medium mb-1.5">Title</label>
                                        <input
                                            type="text"
                                            name="title"
                                            value={updateForm.title}
                                            onChange={handleUpdateChange}
                                            className="w-full px-3 py-2.5 bg-white/15 border border-white/25 rounded-lg text-white placeholder-white/60 focus:outline-none focus:border-blue-400 focus:bg-white/20 transition-all"
                                            required
                                        />
                                    </div>
                                    <div className="mb-6">
                                        <label className="block text-white/90 text-sm font-medium mb-1.5">Description</label>
                                        <textarea
                                            name="description"
                                            value={updateForm.description}
                                            onChange={handleUpdateChange}
                                            rows="3"
                                            className="w-full px-3 py-2.5 bg-white/15 border border-white/25 rounded-lg text-white placeholder-white/60 focus:outline-none focus:border-blue-400 focus:bg-white/20 transition-all resize-none"
                                        />
                                    </div>
                                    <div className="flex justify-end gap-4 pt-2">
                                        <button
                                            type="button"
                                            onClick={closeUpdateModal}
                                            disabled={updating}
                                            className="px-4 py-2.5 bg-white/15 hover:bg-white/25 border border-white/25 hover:border-white/40 rounded-lg text-white font-medium transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                                        >
                                            Cancel
                                        </button>
                                        <button
                                            type="submit"
                                            disabled={updating}
                                            className="px-4 py-2.5 bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 rounded-lg text-white font-medium transition-all duration-300 hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 flex items-center justify-center"
                                        >
                                            {updating ? (
                                                <>
                                                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin mr-2"></div>
                                                    Updating...
                                                </>
                                            ) : (
                                                <>
                                                    <i className="fas fa-save mr-2"></i>
                                                    Update Course
                                                </>
                                            )}
                                        </button>
                                    </div>
                                </form>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default SessionDetails;
