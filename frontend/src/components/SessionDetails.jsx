import { useEffect, useState } from 'react';
import { trainingSessionApi, trainingCourseApi, toggleCourseActiveApi, registrationApi } from '../services/api';
import { useAuth } from '../contexts/AuthContext'; // Assuming user context provides role
import Modal from './modals/CreateSessionModal' // for style reference only
import CreateCourseModal from './modals/CreateCourseModal';

const SessionDetails = ({ sessionId, onBack, canCreateCourse = true }) => {
    const [session, setSession] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [showCreateCourseModal, setShowCreateCourseModal] = useState(false);
    const [showUpdateModal, setShowUpdateModal] = useState(false)
    const [selectedCourse, setSelectedCourse] = useState(null)
    const [updating, setUpdating] = useState(false)
    const [updateForm, setUpdateForm] = useState({ title: '', description: '' })
    const [enrolling, setEnrolling] = useState(false);
    const [enrollSuccess, setEnrollSuccess] = useState(false);
    const [enrollError, setEnrollError] = useState(null);
    const { user } = useAuth();

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

    // Find current user's registration for this session
    const userRegistration = session && session.registrations && user
        ? session.registrations.find(r => r.user_id === user.id)
        : null;

    // Registration status for current user
    const [registrationStatus, setRegistrationStatus] = useState(null);
    useEffect(() => {
        if (user && user.role === 'trainee') {
            registrationApi.getStatusByUserAndSession(user.id, sessionId)
                .then(res => {
                    setRegistrationStatus(res.data?.status || res.data?.status === null ? res.data.status : res.data.status);
                })
                .catch(() => setRegistrationStatus(null));
        }
    }, [user, sessionId]);

    // Helper to map registration status to icon and color classes
    const getStatusIconAndColor = (status) => {
        switch (status) {
            case 'pending':
                return { icon: 'fa-hourglass-half', color: 'bg-amber-500/30 text-amber-300 border border-amber-400/50' }; // Example: 30% opacity on a darker amber, brighter text
            case 'confirmed':
                return { icon: 'fa-check-circle', color: 'bg-emerald-500/30 text-emerald-300 border border-emerald-400/50' };
            case 'cancelled':
                return { icon: 'fa-times-circle', color: 'bg-rose-500/30 text-rose-300 border border-rose-400/50' };
            case 'completed':
                return { icon: 'fa-flag-checkered', color: 'bg-cyan-500/30 text-cyan-300 border border-cyan-400/50' };
            case 'failed':
                return { icon: 'fa-exclamation-triangle', color: 'bg-slate-500/30 text-slate-300 border border-slate-400/50' };
            default:
                return { icon: 'fa-info-circle', color: 'bg-purple-500/30 text-purple-300 border border-purple-400/50' };
        }
    };

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
    const handleEnroll = async () => {
        if (!user || !session) return;
        setEnrolling(true);
        setEnrollError(null);
        try {
            const today = new Date();
            const registeredAt = today.toISOString().split('T')[0]; // YYYY-MM-DD
            await registrationApi.createRegistration({
                user_id: user.id,
                training_session_id: session.id,
                registered_at: registeredAt,
                status: 'pending',
            });
            setEnrollSuccess(true);
            // Optionally refetch session or update UI
        } catch (err) {
            setEnrollError(err?.response?.data?.message || 'Enrollment failed.');
        } finally {
            setEnrolling(false);
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
                        {/* Trainer Name */}
                        <div className="text-white/60 text-md mb-2">
                            <span className="font-bold">Trainer:</span> {session.trainer ? `${session.trainer.first_name} ${session.trainer.last_name}` : 'TBA'}
                        </div>
                        <div className="text-white/60 text-md mb-2">
                            <span className="font-bold">Coordinator:</span> {session.coordinator?.first_name} {session.coordinator?.last_name}
                        </div>
                        {/* Enroll button for trainees only */}
                        {user && user.role === 'trainee' && (
                            <div className="mt-6 flex flex-col items-start gap-2">
                                <button
                                    className={`px-7 py-3 font-bold rounded-full shadow-lg backdrop-blur border transition-all duration-300 flex items-center gap-2 overflow-hidden relative disabled:opacity-60 disabled:cursor-not-allowed ${registrationStatus ? getStatusIconAndColor(registrationStatus).color : 'bg-transparent hover:bg-white/10 text-white border-white/30 hover:scale-105'}`}
                                    onClick={handleEnroll}
                                    disabled={enrolling || enrollSuccess || registrationStatus}
                                    style={{ minWidth: 180 }}
                                >
                                    <span className="flex items-center gap-2 relative z-10">
                                        <i className={`fas ${registrationStatus ? getStatusIconAndColor(registrationStatus).icon : 'fa-user-plus'} text-lg`}></i>
                                        {enrolling
                                            ? 'Enrolling...'
                                            : registrationStatus
                                                ? `Status: ${registrationStatus.charAt(0).toUpperCase() + registrationStatus.slice(1)}`
                                                : enrollSuccess
                                                    ? 'Enrolled!'
                                                    : 'Enroll in this Session'}
                                    </span>
                                    <span className="absolute inset-0 opacity-0 hover:opacity-100 transition-opacity duration-300 bg-gradient-to-r from-cyan-400 via-purple-400 to-pink-400 bg-opacity-70 rounded-full"></span>
                                </button>
                                {enrollError && (
                                    <span className="text-red-400 text-sm mt-1">{enrollError}</span>
                                )}
                                {enrollSuccess && !registrationStatus && (
                                    <span className="text-green-400 text-sm mt-1">Successfully enrolled!</span>
                                )}
                            </div>
                        )}
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
                                    <div key={course.id || idx} className="bg-white/5 hover:bg-white/10 backdrop-blur-2xl rounded-2xl p-6 border border-white/20 hover:border-purple-400 transition-all duration-300 shadow-2xl hover:scale-105 relative overflow-hidden group">
                                        {/* Glassy gradient orb overlays for extra depth */}
                                        <div className="absolute top-0 right-0 w-16 h-16 bg-gradient-to-br from-blue-400/30 to-indigo-400/30 rounded-full blur-2xl opacity-60 group-hover:opacity-80 transition-all"></div>
                                        <div className="absolute bottom-0 left-0 w-12 h-12 bg-gradient-to-br from-purple-400/30 to-pink-400/30 rounded-full blur-2xl opacity-60 group-hover:opacity-80 transition-all"></div>
                                        <div className="relative z-10">
                                            <div className="flex items-center justify-between mb-2">
                                                <h4 className="text-2xl font-bold text-white mb-1 text-glow tracking-tight drop-shadow-lg">{course.title}</h4>
                                                <span className="text-lg font-bold text-purple-400">{course.duration_hours}h</span>
                                            </div>
                                            <div className="text-white/70 mb-2 text-base font-light">{course.description || 'No description provided.'}</div>
                                            <div className="flex flex-wrap gap-2 text-xs text-white/60 mb-2">
                                                {/* Only show Active/Inactive status and created date to trainers */}
                                                {user && user.role === 'trainer' && (
                                                    <>
                                                        {course.is_active ? (
                                                            <span className="px-2 py-1 rounded bg-green-400/20 text-green-300">Active</span>
                                                        ) : (
                                                            <span className="px-2 py-1 rounded bg-red-400/20 text-red-300">Inactive</span>
                                                        )}
                                                        {course.created_at && (
                                                            <span className="px-2 py-1 rounded bg-white/10">Created: {new Date(course.created_at).toLocaleDateString()}</span>
                                                        )}
                                                    </>
                                                )}
                                                {/* Show tags, level, and prerequisites if available */}
                                                {course.level && (
                                                    <span className="px-2 py-1 rounded bg-blue-400/20 text-blue-200">Level: {course.level}</span>
                                                )}
                                                {course.prerequisites && course.prerequisites.length > 0 && (
                                                    <span className="px-2 py-1 rounded bg-pink-400/20 text-pink-200">Prerequisites: {course.prerequisites.join(', ')}</span>
                                                )}
                                                {course.tags && course.tags.length > 0 && course.tags.map((tag, i) => (
                                                    <span key={i} className="px-2 py-1 rounded bg-cyan-400/20 text-cyan-200">{tag}</span>
                                                ))}
                                            </div>
                                            {/* Show trainer if available */}
                                            {course.trainer && (
                                                <div className="text-white/70 text-xs mb-1 flex items-center gap-1">
                                                    <i className="fas fa-user-tie text-cyan-300"></i>
                                                    <span>Trainer: {course.trainer.first_name} {course.trainer.last_name}</span>
                                                </div>
                                            )}
                                            {/* Only trainers can edit or toggle active */}
                                            {user && user.role === 'trainer' && (
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
                                            )}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                        {/* Only show create course if allowed */}
                        {user && (user.role === 'trainer') && (
                            <div className="mt-8 flex justify-end">
                                <button
                                    onClick={() => setShowCreateCourseModal(true)}
                                    className="mt-6 px-7 py-3 bg-white/10 hover:bg-white/20 backdrop-blur-xl rounded-xl border border-white/20 hover:border-white/40 text-white font-semibold transition-all duration-300 text-base flex items-center justify-center gap-2 shadow-none cursor-pointer"
                                >
                                    <i className="fas fa-plus mr-2"></i> Create Course for this Session
                                </button>
                            </div>
                        )}
                    </div>
                </div>
                {/* Modal rendered at root level for proper overlay */}
                <CreateCourseModal
                    isOpen={showCreateCourseModal}
                    onClose={() => setShowCreateCourseModal(false)}
                    session={session}
                    onCourseCreated={(newCourse) => {
                        // Refetch session to update course list
                        trainingSessionApi.getSession(sessionId).then(res => setSession(res.data));
                        setShowCreateCourseModal(false);
                    }}
                    modalClassName="bg-white/80 backdrop-blur-3xl rounded-3xl p-6 border border-white/30 shadow-2xl max-w-lg w-full relative transform transition-all duration-300 ease-out"
                    innerSectionClassName="bg-white/15 backdrop-blur-xl rounded-2xl p-4 border border-white/25"
                />
            </div>
            {/* Update Course Modal styled like CreateSessionModal */}
            {showUpdateModal && (
                <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-lg p-4 overflow-y-auto pt-24">
                    <div className="min-h-full flex items-center justify-center py-4">
                        <div className="bg-white/80 backdrop-blur-3xl rounded-3xl p-6 border border-white/30 shadow-2xl max-w-lg w-full relative transform transition-all duration-300 ease-out">
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
                                    <div className="mb-4 bg-white/15 backdrop-blur-xl rounded-2xl p-4 border border-white/25">
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
                                    <div className="mb-6 bg-white/15 backdrop-blur-xl rounded-2xl p-4 border border-white/25">
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
