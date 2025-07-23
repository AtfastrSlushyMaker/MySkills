import React, { useEffect, useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { courseCompletionApi, trainingSessionApi, trainingCourseApi, courseContentApi } from '../services/api';
import { useParams } from 'react-router-dom';
import ManageCourseContentModal from './modals/ManageCourseContentModal';
import EditCourseContentModal from './modals/EditCourseContentModal';
import DeleteCourseContentModal from './modals/DeleteCourseContentModal';

const CourseContent = () => {
    const { courseId, sessionId } = useParams();
    const [course, setCourse] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const { user } = useAuth();
    const [markingComplete, setMarkingComplete] = useState(false);
    const [completed, setCompleted] = useState(false);
    const [session, setSession] = useState(null);
    const [manageModalOpen, setManageModalOpen] = useState(false);
    const [editModalOpen, setEditModalOpen] = useState(false);
    const [deleteModalOpen, setDeleteModalOpen] = useState(false);

    useEffect(() => {
        setLoading(true);
        Promise.all([
            trainingCourseApi.getCourse(courseId),
            sessionId ? trainingSessionApi.getSession(sessionId) : Promise.resolve({ data: null })
        ])
            .then(([courseRes, sessionRes]) => {
                setCourse(courseRes.data);
                setSession(sessionRes.data);
                setLoading(false);
            })
            .catch(err => {
                setError('Failed to load course content');
                setLoading(false);
            });
    }, [courseId, sessionId]);

    useEffect(() => {
        if (user && course) {
            courseCompletionApi.getAll().then(res => {
                const completions = Array.isArray(res.data) ? res.data : [];
                const isCompleted = completions.some(cc => cc.user_id === user.id && cc.training_course_id === course.id && cc.status === 'completed');
                setCompleted(isCompleted);
            });
        }
    }, [user, course]);

    const handleMarkAsComplete = async () => {
        if (!user || !course) return;
        setMarkingComplete(true);
        try {
            await courseCompletionApi.markAsComplete({ user_id: user.id, training_course_id: course.id });
            setCompleted(true);
        } catch (e) {
            // Optionally show error
        } finally {
            setMarkingComplete(false);
        }
    };

    if (loading) return <div className="flex items-center justify-center h-64 text-lg text-gray-500 animate-pulse">Loading course content...</div>;
    if (error) return <div className="flex items-center justify-center h-64 text-lg text-red-500">{error}</div>;
    if (!course) return <div className="flex items-center justify-center h-64 text-lg text-gray-500">No course found.</div>;

    // Determine if user can manage content (trainee, session coordinator, or assigned trainer only)
    const isCoordinator = user && session && user.id === session.coordinator_id;
    const isTrainer = user && session && session.trainer && user.id === session.trainer.id;
    const canManage = user && (user.role === 'trainee' || isCoordinator || isTrainer);

    return (
        <div className="min-h-screen relative overflow-hidden">
            <div className="relative z-10 max-w-5xl mx-auto px-6 py-12">
                {/* Glassmorphism Header */}
                <div className="mb-12">
                    <div className="bg-white/10 backdrop-blur-3xl rounded-3xl p-8 border border-white/20 shadow-2xl relative overflow-hidden">
                        <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-cyan-400/20 to-blue-400/20 rounded-full blur-3xl"></div>
                        <div className="relative z-10">
                            <h1 className="text-4xl font-bold mb-4 text-white">
                                <span className="bg-gradient-to-r from-blue-400 via-indigo-400 to-purple-400 bg-clip-text text-transparent">{course.title}</span>
                            </h1>
                            <div className="mb-2 text-lg text-white/80">{course.description}</div>
                            <div className="mb-2 text-sm text-white/60">Duration: {course.duration_hours} hours</div>
                            <div className="mb-2 text-sm text-white/60">Created: {course.created_at ? new Date(course.created_at).toLocaleString() : 'N/A'}</div>
                        </div>
                    </div>
                </div>

                {/* Course Content Section */}
                <section className="mt-8">
                    <h2 className="text-2xl font-semibold mb-4 text-blue-400">Course Content</h2>
                    {course.content ? (
                        <div className="p-8 bg-white/10 backdrop-blur-2xl rounded-3xl border border-white/20 shadow-xl">
                            <div className="font-medium text-white mb-2">Type: <span className="px-2 py-1 rounded bg-blue-400/20 text-blue-400 text-xs">{course.content.type}</span></div>
                            <div className="mt-2 text-white/80">
                                {course.content.type === 'video' && course.content.content ? (
                                    <video controls className="w-full max-h-96 rounded">
                                        <source src={course.content.content} type="video/mp4" />
                                        Your browser does not support the video tag.
                                    </video>
                                ) : course.content.type === 'image' && course.content.content ? (
                                    <img src={course.content.content} alt="Course" className="w-full max-h-96 rounded object-contain" />
                                ) : course.content.type === 'file' && course.content.content ? (
                                    <a href={course.content.content} target="_blank" rel="noopener noreferrer" className="text-blue-400 underline">Download file</a>
                                ) : course.content.type === 'text' ? (
                                    course.content.content ? course.content.content : <span className="italic text-white/40">No content available.</span>
                                ) : (
                                    <span className="italic text-white/40">No content available.</span>
                                )}
                            </div>
                            <div className="mt-4 text-xs text-white/40">Created: {course.content.created_at ? new Date(course.content.created_at).toLocaleString() : 'N/A'}</div>
                            {/* Management buttons for trainees and coordinator only */}
                            {canManage && (
                                <div className="flex gap-2 mt-6">
                                    <button className="px-4 py-2 rounded bg-blue-500 text-white font-semibold" onClick={() => setEditModalOpen(true)}>Edit</button>
                                    <button className="px-4 py-2 rounded bg-red-500 text-white font-semibold" onClick={() => setDeleteModalOpen(true)}>Delete</button>
                                </div>
                            )}
                            {/* Mark as Complete button for trainees */}
                            {user && user.role === 'trainee' && !completed && (
                                <button
                                    className={`mt-6 px-4 py-2 rounded font-semibold shadow transition disabled:opacity-60 disabled:cursor-not-allowed bg-green-500/80 text-white hover:bg-green-600`}
                                    disabled={markingComplete}
                                    onClick={handleMarkAsComplete}
                                >
                                    {markingComplete ? 'Marking...' : 'Mark as Complete'}
                                </button>
                            )}
                            {user && user.role === 'trainee' && completed && (
                                <div className="mt-6 px-4 py-2 rounded font-semibold bg-green-600 text-white">Completed</div>
                            )}
                        </div>
                    ) : (
                        <div className="flex flex-col items-center justify-center h-40 text-white/40">
                            <span className="text-lg mb-4">No course content available.</span>
                            {canManage && (
                                <button className="px-4 py-2 rounded bg-blue-500 text-white font-semibold" onClick={() => setEditModalOpen(true)}>Add Content</button>
                            )}
                        </div>
                    )}
                </section>
                {/* Modals */}
                <ManageCourseContentModal
                    open={manageModalOpen}
                    onClose={() => setManageModalOpen(false)}
                    onEdit={() => { setManageModalOpen(false); setEditModalOpen(true); }}
                    onDelete={() => { setManageModalOpen(false); setDeleteModalOpen(true); }}
                    content={course.content}
                />
                <EditCourseContentModal
                    open={editModalOpen}
                    onClose={() => setEditModalOpen(false)}
                    content={course.content}
                    onSave={async (newContent) => {
                        if (course.content && course.content.id) {
                            try {
                                await courseContentApi.update(course.content.id, newContent);
                                setCourse(prev => ({ ...prev, content: { ...prev.content, ...newContent } }));
                            } catch (err) {
                                setError('Failed to update course content');
                            }
                        } else {
                            // If no content exists, create new
                            try {
                                const res = await courseContentApi.create({ ...newContent, training_course_id: course.id });
                                setCourse(prev => ({ ...prev, content: res.data }));
                            } catch (err) {
                                setError('Failed to create course content');
                            }
                        }
                        setEditModalOpen(false);
                    }}
                />
                <DeleteCourseContentModal
                    open={deleteModalOpen}
                    onClose={() => setDeleteModalOpen(false)}
                    onConfirm={() => {
                        // TODO: Implement delete logic (API call)
                        setDeleteModalOpen(false);
                    }}
                />
            </div>
        </div>
    );
};

export default CourseContent;
