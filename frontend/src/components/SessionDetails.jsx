import { feedbackApi, trainingSessionApi, trainingCourseApi, toggleCourseActiveApi, registrationApi, courseCompletionApi, sessionCompletionApi } from '../services/api';
import { message } from 'antd';
import { useAuth } from '../contexts/AuthContext';
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    Card,
    Button,
    Typography,
    Spin,
    Statistic,
    Popconfirm,
    Alert,
    Badge,
    Progress,
    Row,
    Col,
    Space,
    Tag,
    Tooltip,
    Switch,
    Pagination,
    Avatar,
    Modal,
    Form,
    Input,
    Empty,
    Image
} from 'antd';

import {
    ArrowLeftOutlined,
    BookOutlined,
    UserAddOutlined,
    EditOutlined,
    CheckCircleOutlined,
    ClockCircleOutlined,
    ExclamationCircleOutlined,
    PlusOutlined,
    TrophyOutlined,
    LockOutlined,
    UserOutlined,
    CalendarOutlined,
    EnvironmentOutlined,
    TeamOutlined,
    StarOutlined,
    FileImageOutlined,
    SearchOutlined,
    DeleteOutlined,
    FireOutlined
} from '@ant-design/icons';
import CreateCourseModal from './modals/CreateCourseModal';
import SessionInfo from './sessionDetails/SessionInfo';
import TraineeList from './sessionDetails/TraineeList';
import FeedbackForm from './sessionDetails/FeedbackForm';
import CommentsList from './sessionDetails/CommentsList';

// Import Lightbox for image viewing
import Lightbox from "yet-another-react-lightbox";
import "yet-another-react-lightbox/styles.css";

const { Title, Text, Paragraph } = Typography;
const { Meta } = Card;
const { Search } = Input;

const SessionDetails = ({ sessionId, onBack, canCreateCourse = true }) => {
    const navigate = useNavigate();
    const { user } = useAuth();
    const [form] = Form.useForm();

    // State management
    const [session, setSession] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [showCreateCourseModal, setShowCreateCourseModal] = useState(false);
    const [showUpdateModal, setShowUpdateModal] = useState(false);
    const [selectedCourse, setSelectedCourse] = useState(null);
    const [updating, setUpdating] = useState(false);
    const [enrolling, setEnrolling] = useState(false);
    const [enrollSuccess, setEnrollSuccess] = useState(false);
    const [enrollError, setEnrollError] = useState(null);
    const [feedbacks, setFeedbacks] = useState([]);
    const [feedbackLoading, setFeedbackLoading] = useState(true);
    const [feedbackError, setFeedbackError] = useState(null);
    const [completedCourses, setCompletedCourses] = useState([]);
    const [markingComplete, setMarkingComplete] = useState({});
    const [registrationStatus, setRegistrationStatus] = useState(null);
    const [sessionCompletion, setSessionCompletion] = useState(null);
    const [completionLoading, setCompletionLoading] = useState(false);
    const [deletingCourse, setDeletingCourse] = useState({});

    // Search and pagination state
    const [searchTerm, setSearchTerm] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const [pageSize, setPageSize] = useState(6);

    // Lightbox state
    const [lightboxOpen, setLightboxOpen] = useState(false);
    const [lightboxImages, setLightboxImages] = useState([]);
    const [lightboxIndex, setLightboxIndex] = useState(0);

    // Derived values
    const courses = Array.isArray(session?.training_courses)
        ? session.training_courses
        : session?.course
            ? [session.course]
            : [];

    // Filter courses based on search term
    const filteredCourses = courses.filter(course =>
        course.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        course.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        course.level?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (course.trainer && `${course.trainer.first_name} ${course.trainer.last_name}`.toLowerCase().includes(searchTerm.toLowerCase()))
    );

    const userRegistration = session && session.registrations && user
        ? session.registrations.find(r => r.user_id === user.id)
        : null;

    // Pagination calculations
    const startIndex = (currentPage - 1) * pageSize;
    const endIndex = startIndex + pageSize;
    const paginatedCourses = filteredCourses.slice(startIndex, endIndex);

    // Helper functions
    const isSessionFinished = (() => {
        if (!session) return false;
        let endDateStr = session.end_date || session.date;
        let endTimeStr = session.end_time || session.start_time || '23:59:59';
        if (!endDateStr) return false;
        const [hour, minute, second] = (endTimeStr || '23:59:59').split(':').map(Number);
        const endDate = new Date(endDateStr);
        endDate.setHours(hour || 0, minute || 0, second || 0, 0);
        return endDate <= new Date();
    })();

    const getStatusConfig = (status) => {
        const configs = {
            pending: { icon: ClockCircleOutlined, color: 'warning', text: 'Pending' },
            confirmed: { icon: CheckCircleOutlined, color: 'success', text: 'Confirmed' },
            cancelled: { icon: ExclamationCircleOutlined, color: 'error', text: 'Cancelled' },
            completed: { icon: CheckCircleOutlined, color: 'processing', text: 'Completed' },
            failed: { icon: ExclamationCircleOutlined, color: 'default', text: 'Failed' }
        };
        return configs[status] || { icon: ExclamationCircleOutlined, color: 'default', text: status };
    };

    const getDifficultyColor = (level) => {
        const colors = {
            'beginner': '#10b981',
            'intermediate': '#f59e0b',
            'advanced': '#ef4444',
            'expert': '#8b5cf6'
        };
        return colors[level?.toLowerCase()] || '#6b7280';
    };

    const openLightbox = (imageUrl, index = 0) => {
        setLightboxImages([{ src: imageUrl }]);
        setLightboxIndex(index);
        setLightboxOpen(true);
    };

    // API calls and effects
    useEffect(() => {
        const fetchSession = async () => {
            setLoading(true);
            try {
                const res = await trainingSessionApi.getSession(sessionId);
                setSession(res.data);
            } catch (e) {
                setError('Session not found.');
                message.error('Failed to load session details');
            } finally {
                setLoading(false);
            }
        };
        fetchSession();
    }, [sessionId]);

    useEffect(() => {
        setFeedbackLoading(true);
        feedbackApi.getFeedbackBySession(sessionId)
            .then(res => {
                setFeedbacks(res.data);
                setFeedbackError(null);
            })
            .catch(() => {
                setFeedbackError('Could not load feedback.');
                message.error('Failed to load feedback');
            })
            .finally(() => setFeedbackLoading(false));
    }, [sessionId]);

    useEffect(() => {
        if (user && user.role === 'trainee' && courses.length > 0) {
            courseCompletionApi.getAll().then(res => {
                const completions = Array.isArray(res.data) ? res.data : [];
                const completed = completions
                    .filter(cc => cc.user_id === user.id && cc.status === 'completed')
                    .map(cc => cc.training_course_id);
                setCompletedCourses(completed);
            });
        }
    }, [user, courses]);

    useEffect(() => {
        if (user && user.role === 'trainee') {
            registrationApi.getStatusByUserAndSession(sessionId)
                .then(res => {
                    setRegistrationStatus(res.data?.status ?? null);
                })
                .catch(() => setRegistrationStatus(null));
        }
    }, [user, sessionId]);

    // Session completion effect
    useEffect(() => {
        if (
            user &&
            user.role === 'trainee' &&
            courses.length > 0 &&
            completedCourses.length === courses.length &&
            session &&
            userRegistration
        ) {
            setCompletionLoading(true);

            const now = new Date().toISOString().slice(0, 19).replace('T', ' ');
            const completionPayload = {
                registration_id: userRegistration.id,
                training_session_id: session.id,
                courses_completed: courses.length,
                total_courses: courses.length,
                status: 'completed',
                completed_at: now,
            };

            sessionCompletionApi.getByRegistration(userRegistration.id)
                .then(res => {
                    if (res.data && res.data.data) {
                        setSessionCompletion(res.data.data);
                    } else {
                        return sessionCompletionApi.create(completionPayload);
                    }
                })
                .then(createRes => {
                    if (createRes) {
                        setSessionCompletion(createRes.data.data);
                        message.success('Session completed! Certificate generated.');
                    }
                })
                .catch(error => {
                    console.error('Session completion error:', error);
                    if (error.response && error.response.status === 409) {
                        sessionCompletionApi.getByRegistration(userRegistration.id)
                            .then(res => {
                                if (res.data && res.data.data) {
                                    setSessionCompletion(res.data.data);
                                }
                            })
                            .catch(fetchError => {
                                console.error('Failed to fetch after conflict:', fetchError);
                            });
                    }
                })
                .finally(() => {
                    setCompletionLoading(false);
                });
        }
    }, [user, courses, completedCourses, session, userRegistration]);

    // Event handlers
    const handleUpdateCourse = async (values) => {
        if (!selectedCourse) return;
        setUpdating(true);
        try {
            await trainingCourseApi.updateCourse(selectedCourse.id, values);
            const res = await trainingSessionApi.getSession(sessionId);
            setSession(res.data);
            setShowUpdateModal(false);
            form.resetFields();
            message.success('Course updated successfully');
        } catch (err) {
            message.error('Failed to update course');
        } finally {
            setUpdating(false);
        }
    };

    const handleDeleteCourse = async (courseId) => {
        setDeletingCourse(prev => ({ ...prev, [courseId]: true }));
        try {
            await trainingCourseApi.deleteCourse(courseId);
            const res = await trainingSessionApi.getSession(sessionId);
            setSession(res.data);
            message.success('Course deleted successfully');
        } catch (err) {
            message.error('Failed to delete course');
        } finally {
            setDeletingCourse(prev => ({ ...prev, [courseId]: false }));
        }
    };

    const handleToggleActive = async (course) => {
        try {
            await toggleCourseActiveApi(course.id, !course.is_active);
            const res = await trainingSessionApi.getSession(sessionId);
            setSession(res.data);
            message.success(`Course ${course.is_active ? 'deactivated' : 'activated'} successfully`);
        } catch (err) {
            message.error('Failed to toggle course status');
        }
    };

    const handleEnroll = async () => {
        if (!user || !session) return;
        setEnrolling(true);
        setEnrollError(null);
        try {
            const today = new Date();
            const registeredAt = today.toISOString().split('T')[0];
            await registrationApi.createRegistration({
                user_id: user.id,
                training_session_id: session.id,
                registered_at: registeredAt,
                status: 'pending',
            });
            setEnrollSuccess(true);
            message.success('Successfully enrolled in session!');
            setTimeout(() => {
                setRegistrationStatus('pending');
            }, 1000);
        } catch (err) {
            const errorMsg = err?.response?.data?.message || 'Enrollment failed.';
            setEnrollError(errorMsg);
            message.error(errorMsg);
        } finally {
            setEnrolling(false);
        }
    };

    const handleMarkAsComplete = async (courseId, e) => {
        if (e) e.stopPropagation();
        setMarkingComplete(prev => ({ ...prev, [courseId]: true }));
        try {
            await courseCompletionApi.markAsComplete({ user_id: user.id, training_course_id: courseId });
            setCompletedCourses(prev => {
                const updated = [...prev, courseId];
                setTimeout(async () => {
                    if (session && Array.isArray(session.training_courses)) {
                        const allCourseIds = session.training_courses.map(c => c.id);
                        const allCompleted = allCourseIds.every(cid => [...updated].includes(cid));
                        if (allCompleted && userRegistration) {
                            const now = new Date().toISOString().slice(0, 19).replace('T', ' ');
                            const completionPayload = {
                                registration_id: userRegistration.id,
                                training_session_id: session.id,
                                courses_completed: allCourseIds.length,
                                total_courses: allCourseIds.length,
                                status: 'completed',
                                completed_at: now,
                            };
                            try {
                                const res = await sessionCompletionApi.getByRegistration(userRegistration.id);
                                if (!res.data || !res.data.data) {
                                    await sessionCompletionApi.create(completionPayload);
                                }
                            } catch (err) {
                                await sessionCompletionApi.create(completionPayload);
                            }
                        }
                    }
                }, 0);
                return updated;
            });
            message.success('Course marked as complete!');
        } catch (e) {
            message.error('Failed to mark course as complete');
        } finally {
            setMarkingComplete(prev => ({ ...prev, [courseId]: false }));
        }
    };

    const openUpdateModal = (course) => {
        setSelectedCourse(course);
        form.setFieldsValue({
            title: course.title,
            description: course.description || ''
        });
        setShowUpdateModal(true);
    };

    // Reset pagination when search changes
    useEffect(() => {
        setCurrentPage(1);
    }, [searchTerm]);

    // Loading state
    if (loading) {
        return (
            <div style={{
                minHeight: '100vh',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                background: 'linear-gradient(135deg, #0c4a6e 0%, #7c3aed 50%, #db2777 100%)'
            }}>
                <Card style={{
                    background: 'rgba(255, 255, 255, 0.1)',
                    backdropFilter: 'blur(20px)',
                    border: '1px solid rgba(255, 255, 255, 0.2)',
                    borderRadius: '24px'
                }}>
                    <div style={{ textAlign: 'center', padding: '20px' }}>
                        <Spin size="large" />
                        <div style={{ marginTop: 16, color: 'white' }}>Loading session details...</div>
                    </div>
                </Card>
            </div>
        );
    }

    // Error state
    if (error || !session) {
        return (
            <div style={{
                minHeight: '100vh',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                background: 'linear-gradient(135deg, #0c4a6e 0%, #7c3aed 50%, #db2777 100%)'
            }}>
                <Card style={{
                    background: 'rgba(239, 68, 68, 0.1)',
                    backdropFilter: 'blur(20px)',
                    border: '1px solid rgba(239, 68, 68, 0.3)',
                    borderRadius: '24px'
                }}>
                    <Alert
                        message="Error"
                        description={error || 'Session not found.'}
                        type="error"
                        showIcon
                        style={{ background: 'transparent', border: 'none' }}
                    />
                    <div style={{ textAlign: 'center', marginTop: 16 }}>
                        <Button onClick={onBack} type="primary" danger>
                            Go Back
                        </Button>
                    </div>
                </Card>
            </div>
        );
    }

    const completionPercentage = courses.length > 0 ? (completedCourses.length / courses.length) * 100 : 0;

    return (
        <div style={{
            minHeight: '100vh',
            position: 'relative',
            overflow: 'hidden'
        }}>
            <div style={{
                position: 'relative',
                zIndex: 10,
                maxWidth: '1200px',
                margin: '0 auto',
                padding: '24px'
            }}>
                {/* Back Button */}
                <div style={{ marginBottom: '24px' }}>
                    <Button
                        icon={<ArrowLeftOutlined />}
                        onClick={onBack}
                        size="large"
                        style={{
                            background: 'rgba(255, 255, 255, 0.1)',
                            backdropFilter: 'blur(20px)',
                            border: '1px solid rgba(255, 255, 255, 0.2)',
                            color: 'white',
                            borderRadius: '12px',
                            fontWeight: 600
                        }}
                    >
                        Back
                    </Button>
                </div>

                {/* Session Info */}
                <Card
                    style={{
                        background: 'rgba(255, 255, 255, 0.1)',
                        backdropFilter: 'blur(20px)',
                        border: '1px solid rgba(255, 255, 255, 0.2)',
                        borderRadius: '24px',
                        marginBottom: '24px'
                    }}
                >
                    <SessionInfo session={session} />
                </Card>

                {/* Enrollment Section for Trainees */}
                {user && user.role === 'trainee' && (
                    <Card
                        style={{
                            background: 'rgba(255, 255, 255, 0.1)',
                            backdropFilter: 'blur(20px)',
                            border: '1px solid rgba(255, 255, 255, 0.2)',
                            borderRadius: '24px',
                            marginBottom: '24px'
                        }}
                    >
                        <Row align="middle" justify="space-between">
                            <Col>
                                <Space direction="vertical" size="small">
                                    <Title level={3} style={{ color: 'white', margin: 0 }}>
                                        <BookOutlined style={{ marginRight: '12px', color: '#a855f7' }} />
                                        Courses in this Session
                                    </Title>
                                    <Badge
                                        status={getStatusConfig(registrationStatus).color}
                                        text={
                                            <Text style={{ color: 'rgba(255, 255, 255, 0.8)' }}>
                                                {getStatusConfig(registrationStatus).text}
                                            </Text>
                                        }
                                    />
                                    {completionPercentage > 0 && (
                                        <div style={{ minWidth: '200px' }}>
                                            <Text style={{ color: 'rgba(255, 255, 255, 0.8)', fontSize: '12px' }}>
                                                Course Progress
                                            </Text>
                                            <Progress
                                                percent={completionPercentage}
                                                size="small"
                                                strokeColor={{
                                                    '0%': '#06b6d4',
                                                    '100%': '#10b981'
                                                }}
                                            />
                                        </div>
                                    )}
                                </Space>
                            </Col>
                            <Col>
                                <Button
                                    type="primary"
                                    size="large"
                                    icon={isSessionFinished ? <LockOutlined /> : <UserAddOutlined />}
                                    loading={enrolling}
                                    disabled={enrolling || enrollSuccess || registrationStatus || isSessionFinished}
                                    onClick={handleEnroll}
                                    style={{
                                        background: isSessionFinished
                                            ? 'rgba(107, 114, 128, 0.3)'
                                            : registrationStatus
                                                ? 'rgba(34, 197, 94, 0.3)'
                                                : 'linear-gradient(135deg, #06b6d4 0%, #8b5cf6 100%)',
                                        border: 'none',
                                        borderRadius: '12px',
                                        fontWeight: 600,
                                        minWidth: '180px'
                                    }}
                                >
                                    {isSessionFinished
                                        ? 'Session Finished'
                                        : enrolling
                                            ? 'Enrolling...'
                                            : registrationStatus
                                                ? `Status: ${getStatusConfig(registrationStatus).text}`
                                                : enrollSuccess
                                                    ? 'Enrolled!'
                                                    : 'Enroll in Session'
                                    }
                                </Button>
                            </Col>
                        </Row>
                        {enrollError && (
                            <Alert
                                message={enrollError}
                                type="error"
                                style={{ marginTop: 16, background: 'rgba(239, 68, 68, 0.1)', border: '1px solid rgba(239, 68, 68, 0.3)' }}
                            />
                        )}
                    </Card>
                )}

                {/* Registered Trainees (for coordinators and trainers) */}
                {user && (user.role === 'coordinator' || user.role === 'trainer') && (
                    <Card
                        style={{
                            background: 'rgba(255, 255, 255, 0.1)',
                            backdropFilter: 'blur(20px)',
                            border: '1px solid rgba(255, 255, 255, 0.2)',
                            borderRadius: '24px',
                            marginBottom: '24px'
                        }}
                    >
                        <TraineeList registrations={session.registrations || []} />
                    </Card>
                )}

                {/* Courses Section */}
                <Card
                    style={{
                        background: 'rgba(255, 255, 255, 0.1)',
                        backdropFilter: 'blur(20px)',
                        border: '1px solid rgba(255, 255, 255, 0.2)',
                        borderRadius: '24px',
                        marginBottom: '24px'
                    }}
                >
                    <div style={{ marginBottom: '24px' }}>
                        <Row justify="space-between" align="middle" style={{ marginBottom: '20px' }}>
                            <Col>
                                <Title level={3} style={{ color: 'white', margin: 0 }}>
                                    <BookOutlined style={{ marginRight: '12px', color: '#a855f7' }} />
                                    Courses in this Session
                                </Title>
                            </Col>
                            <Col>
                                <Space>
                                    <Statistic
                                        title={<span style={{ color: 'rgba(255, 255, 255, 0.6)' }}>Total Courses</span>}
                                        value={courses.length}
                                        valueStyle={{ color: 'white', fontSize: '18px' }}
                                    />
                                    {user && user.role === 'trainee' && courses.length > 0 && (
                                        <Statistic
                                            title={<span style={{ color: 'rgba(255, 255, 255, 0.6)' }}>Completed</span>}
                                            value={completedCourses.length}
                                            valueStyle={{ color: '#10b981', fontSize: '18px' }}
                                        />
                                    )}
                                </Space>
                            </Col>
                        </Row>

                        {/* Search Bar */}
                        <Input
                            placeholder="Search courses by title, description, level, or trainer..."
                            allowClear
                            size="large"
                            prefix={<SearchOutlined style={{ color: 'rgba(255, 255, 255, 0.5)' }} />}
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            style={{
                                maxWidth: '500px',
                                height: '44px',
                                fontSize: '16px',
                                lineHeight: '44px',
                                padding: '0 12px',
                                borderRadius: '12px'
                            }}
                            className="custom-search"
                        />
                        <style>{`
                            .custom-search .ant-input {
                                height: 44px !important;
                                font-size: 16px !important;
                                line-height: 44px !important;
                                border-radius: 12px !important;
                                padding: 0 12px !important;
                            }
                        `}</style>
                    </div>

                    {filteredCourses.length === 0 ? (
                        <Empty
                            description={
                                <Text style={{ color: 'rgba(255, 255, 255, 0.6)' }}>
                                    {searchTerm ? 'No courses match your search criteria' : 'No courses assigned to this session yet'}
                                </Text>
                            }
                            style={{ margin: '40px 0' }}
                        />
                    ) : (
                        <>
                            <Row gutter={[24, 24]}>
                                {paginatedCourses.map((course, idx) => {
                                    const isCompleted = completedCourses.includes(course.id);
                                    const isMarking = markingComplete[course.id];
                                    const isDeleting = deletingCourse[course.id];

                                    return (
                                        <Col xs={24} md={12} lg={8} key={course.id || idx}>
                                            <Card
                                                hoverable
                                                style={{
                                                    background: isCompleted
                                                        ? 'rgba(16, 185, 129, 0.15)'
                                                        : 'rgba(255, 255, 255, 0.08)',
                                                    backdropFilter: 'blur(20px)',
                                                    border: isCompleted
                                                        ? '2px solid rgba(16, 185, 129, 0.4)'
                                                        : '1px solid rgba(255, 255, 255, 0.15)',
                                                    borderRadius: '20px',
                                                    height: '100%',
                                                    transform: isCompleted ? 'scale(1.02)' : 'scale(1)',
                                                    transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                                                    boxShadow: isCompleted
                                                        ? '0 20px 40px rgba(16, 185, 129, 0.2)'
                                                        : '0 10px 30px rgba(0, 0, 0, 0.1)',
                                                    position: 'relative',
                                                    overflow: 'hidden'
                                                }}
                                                styles={{ body: { padding: '20px' } }}
                                                onClick={() => navigate(`/courses/${course.id}`)}
                                                actions={[
                                                    ...(user && user.role === 'trainer' ? [
                                                        <Tooltip title="Edit Course" key="edit">
                                                            <Button
                                                                icon={<EditOutlined />}
                                                                type="text"
                                                                style={{
                                                                    color: '#06b6d4',
                                                                    background: 'rgba(6, 182, 212, 0.1)',
                                                                    border: 'none'
                                                                }}
                                                                onClick={(e) => {
                                                                    e.stopPropagation();
                                                                    openUpdateModal(course);
                                                                }}
                                                            />
                                                        </Tooltip>,
                                                        <Tooltip title={course.is_active ? 'Deactivate' : 'Activate'} key="toggle">
                                                            <Switch
                                                                checked={course.is_active}
                                                                size="small"
                                                                onChange={(checked) => {
                                                                    handleToggleActive(course);
                                                                }}
                                                                onClick={(checked, e) => e.stopPropagation()}
                                                                style={{
                                                                    background: course.is_active ? '#10b981' : '#6b7280'
                                                                }}
                                                            />
                                                        </Tooltip>,
                                                        <Popconfirm
                                                            key="delete"
                                                            title="Delete Course"
                                                            description="Are you sure you want to delete this course? This action cannot be undone."
                                                            onConfirm={(e) => {
                                                                e?.stopPropagation();
                                                                handleDeleteCourse(course.id);
                                                            }}
                                                            onCancel={(e) => e?.stopPropagation()}
                                                            okText="Delete"
                                                            cancelText="Cancel"
                                                            okButtonProps={{ danger: true }}
                                                        >
                                                            <Tooltip title="Delete Course">
                                                                <Button
                                                                    icon={<DeleteOutlined />}
                                                                    type="text"
                                                                    danger
                                                                    loading={isDeleting}
                                                                    style={{
                                                                        background: 'rgba(239, 68, 68, 0.1)',
                                                                        border: 'none'
                                                                    }}
                                                                    onClick={(e) => e.stopPropagation()}
                                                                />
                                                            </Tooltip>
                                                        </Popconfirm>
                                                    ] : []),
                                                    ...(user && user.role === 'trainee' && registrationStatus === 'confirmed' ? [
                                                        <Button
                                                            key="complete"
                                                            type={isCompleted ? "default" : "primary"}
                                                            size="small"
                                                            icon={isCompleted ? <CheckCircleOutlined /> : <ClockCircleOutlined />}
                                                            loading={isMarking}
                                                            disabled={isCompleted || isMarking}
                                                            onClick={(e) => handleMarkAsComplete(course.id, e)}
                                                            style={{
                                                                background: isCompleted ? '#10b981' : '#06b6d4',
                                                                border: 'none',
                                                                borderRadius: '8px',
                                                                fontWeight: 600
                                                            }}
                                                        >
                                                            {isCompleted ? 'Completed' : isMarking ? 'Marking...' : 'Complete'}
                                                        </Button>
                                                    ] : [])
                                                ]}
                                            >
                                                {/* Course completion indicator */}
                                                {isCompleted && (
                                                    <div style={{
                                                        position: 'absolute',
                                                        top: 0,
                                                        right: 0,
                                                        background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
                                                        color: 'white',
                                                        padding: '4px 12px',
                                                        borderRadius: '0 20px 0 12px',
                                                        fontSize: '11px',
                                                        fontWeight: 600,
                                                        zIndex: 1
                                                    }}>
                                                        <CheckCircleOutlined style={{ marginRight: '4px' }} />
                                                        COMPLETED
                                                    </div>
                                                )}

                                                {/* Difficulty badge */}
                                                {course.level && (
                                                    <div style={{
                                                        position: 'absolute',
                                                        top: '12px',
                                                        left: '12px',
                                                        background: getDifficultyColor(course.level),
                                                        color: 'white',
                                                        padding: '4px 8px',
                                                        borderRadius: '8px',
                                                        fontSize: '10px',
                                                        fontWeight: 600,
                                                        textTransform: 'uppercase',
                                                        zIndex: 1,
                                                        boxShadow: '0 2px 8px rgba(0, 0, 0, 0.15)'
                                                    }}>
                                                        {course.level}
                                                    </div>
                                                )}

                                                <Meta
                                                    title={
                                                        <div style={{
                                                            display: 'flex',
                                                            justifyContent: 'space-between',
                                                            alignItems: 'flex-start',
                                                            marginTop: course.level ? '20px' : '0'
                                                        }}>
                                                            <Text strong style={{
                                                                color: 'white',
                                                                fontSize: '18px',
                                                                lineHeight: '1.4',
                                                                display: 'block',
                                                                marginRight: '8px'
                                                            }}>
                                                                {course.title}
                                                            </Text>
                                                            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                                                                <Tag
                                                                    color="purple"
                                                                    style={{
                                                                        background: 'rgba(139, 92, 246, 0.2)',
                                                                        border: '1px solid rgba(139, 92, 246, 0.4)',
                                                                        color: '#c4b5fd',
                                                                        fontWeight: 600
                                                                    }}
                                                                >
                                                                    <ClockCircleOutlined style={{ marginRight: '4px' }} />
                                                                    {course.duration_hours}h
                                                                </Tag>
                                                            </div>
                                                        </div>
                                                    }
                                                    description={
                                                        <div style={{ marginTop: '12px' }}>
                                                            <Paragraph
                                                                style={{
                                                                    color: 'rgba(255, 255, 255, 0.8)',
                                                                    margin: '0 0 16px 0',
                                                                    fontSize: '14px',
                                                                    lineHeight: '1.6'
                                                                }}
                                                                ellipsis={{ rows: 3 }}
                                                            >
                                                                {course.description || 'No description provided.'}
                                                            </Paragraph>

                                                            {/* Course status - only visible to trainees and coordinators */}
                                                            {user && (user.role === 'trainee' || user.role === 'coordinator') && (
                                                                <Space wrap style={{ marginBottom: '12px' }}>
                                                                    <Tag
                                                                        color={course.is_active ? 'green' : 'red'}
                                                                        style={{
                                                                            background: course.is_active
                                                                                ? 'rgba(16, 185, 129, 0.2)'
                                                                                : 'rgba(239, 68, 68, 0.2)',
                                                                            border: course.is_active
                                                                                ? '1px solid rgba(16, 185, 129, 0.4)'
                                                                                : '1px solid rgba(239, 68, 68, 0.4)',
                                                                            color: course.is_active ? '#10b981' : '#ef4444',
                                                                            fontWeight: 600
                                                                        }}
                                                                    >
                                                                        {course.is_active ? (
                                                                            <>
                                                                                <CheckCircleOutlined style={{ marginRight: '4px' }} />
                                                                                Active
                                                                            </>
                                                                        ) : (
                                                                            <>
                                                                                <ExclamationCircleOutlined style={{ marginRight: '4px' }} />
                                                                                Inactive
                                                                            </>
                                                                        )}
                                                                    </Tag>
                                                                </Space>
                                                            )}

                                                            {/* Tags */}
                                                            <Space wrap style={{ marginBottom: '12px' }}>
                                                                {course.tags && course.tags.map((tag, i) => (
                                                                    <Tag
                                                                        key={i}
                                                                        style={{
                                                                            background: 'rgba(6, 182, 212, 0.2)',
                                                                            border: '1px solid rgba(6, 182, 212, 0.4)',
                                                                            color: '#67e8f9',
                                                                            borderRadius: '12px'
                                                                        }}
                                                                    >
                                                                        <BookOutlined style={{ marginRight: '4px' }} />
                                                                        {tag}
                                                                    </Tag>
                                                                ))}
                                                            </Space>

                                                            {/* Trainer info */}
                                                            {course.trainer && (
                                                                <div style={{
                                                                    marginTop: '16px',
                                                                    display: 'flex',
                                                                    alignItems: 'center',
                                                                    padding: '8px',
                                                                    background: 'rgba(255, 255, 255, 0.05)',
                                                                    borderRadius: '8px',
                                                                    border: '1px solid rgba(255, 255, 255, 0.1)'
                                                                }}>
                                                                    <Avatar
                                                                        size="small"
                                                                        icon={<UserOutlined />}
                                                                        style={{
                                                                            marginRight: '8px',
                                                                            background: 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)'
                                                                        }}
                                                                    />
                                                                    <div>
                                                                        <Text style={{
                                                                            color: 'rgba(255, 255, 255, 0.9)',
                                                                            fontSize: '13px',
                                                                            fontWeight: 600,
                                                                            display: 'block'
                                                                        }}>
                                                                            {course.trainer.first_name} {course.trainer.last_name}
                                                                        </Text>
                                                                        <Text style={{
                                                                            color: 'rgba(255, 255, 255, 0.6)',
                                                                            fontSize: '11px'
                                                                        }}>
                                                                            Course Trainer
                                                                        </Text>
                                                                    </div>
                                                                </div>
                                                            )}

                                                            {/* Prerequisites */}
                                                            {course.prerequisites && course.prerequisites.length > 0 && (
                                                                <div style={{
                                                                    marginTop: '12px',
                                                                    padding: '8px',
                                                                    background: 'rgba(251, 191, 36, 0.1)',
                                                                    borderRadius: '8px',
                                                                    border: '1px solid rgba(251, 191, 36, 0.3)'
                                                                }}>
                                                                    <Text style={{
                                                                        color: '#fbbf24',
                                                                        fontSize: '12px',
                                                                        fontWeight: 600,
                                                                        display: 'block',
                                                                        marginBottom: '4px'
                                                                    }}>
                                                                        <FireOutlined style={{ marginRight: '4px' }} />
                                                                        Prerequisites:
                                                                    </Text>
                                                                    <Text style={{
                                                                        color: 'rgba(255, 255, 255, 0.8)',
                                                                        fontSize: '11px'
                                                                    }}>
                                                                        {course.prerequisites.join(', ')}
                                                                    </Text>
                                                                </div>
                                                            )}
                                                        </div>
                                                    }
                                                />
                                            </Card>
                                        </Col>
                                    );
                                })}
                            </Row>

                            {/* Pagination */}
                            {filteredCourses.length > pageSize && (
                                <div style={{ textAlign: 'center', marginTop: '32px' }}>
                                    <Pagination
                                        current={currentPage}
                                        pageSize={pageSize}
                                        total={filteredCourses.length}
                                        onChange={(page, size) => {
                                            setCurrentPage(page);
                                            setPageSize(size);
                                        }}
                                        showSizeChanger
                                        showQuickJumper
                                        showTotal={(total, range) =>
                                            <Text style={{ color: 'rgba(255, 255, 255, 0.8)' }}>
                                                {`${range[0]}-${range[1]} of ${total} courses`}
                                                {searchTerm && ` (filtered from ${courses.length} total)`}
                                            </Text>
                                        }
                                        style={{
                                            background: 'rgba(255, 255, 255, 0.05)',
                                            padding: '16px',
                                            borderRadius: '12px',
                                            border: '1px solid rgba(255, 255, 255, 0.1)'
                                        }}
                                    />
                                </div>
                            )}
                        </>
                    )}

                    {/* Create Course Button for Trainers */}
                    {user && user.role === 'trainer' && (
                        <div style={{ textAlign: 'center', marginTop: '24px' }}>
                            <Button
                                type="primary"
                                size="large"
                                icon={<PlusOutlined />}
                                onClick={() => setShowCreateCourseModal(true)}
                                style={{
                                    background: 'linear-gradient(135deg, #8b5cf6 0%, #06b6d4 100%)',
                                    border: 'none',
                                    borderRadius: '12px',
                                    fontWeight: 600,
                                    height: '48px',
                                    padding: '0 32px'
                                }}
                            >
                                Create Course for this Session
                            </Button>
                        </div>
                    )}
                </Card>

                {/* Certificate Section */}
                {user && user.role === 'trainee' && sessionCompletion && sessionCompletion.certificate_url && (
                    <Card
                        style={{
                            background: 'rgba(255, 255, 255, 0.1)',
                            backdropFilter: 'blur(20px)',
                            border: '1px solid rgba(255, 255, 255, 0.2)',
                            borderRadius: '24px',
                            marginBottom: '24px',
                            textAlign: 'center'
                        }}
                    >
                        <Space direction="vertical" size="large" style={{ width: '100%' }}>
                            <Title level={3} style={{ color: 'white', margin: 0 }}>
                                <TrophyOutlined style={{ marginRight: '12px', color: '#fbbf24' }} />
                                Your Certificate
                            </Title>

                            <div style={{ position: 'relative', display: 'inline-block' }}>
                                <Image
                                    src={sessionCompletion.certificate_url}
                                    alt="Certificate"
                                    style={{
                                        maxWidth: '100%',
                                        maxHeight: '400px',
                                        borderRadius: '12px',
                                        border: '2px solid rgba(251, 191, 36, 0.5)',
                                        cursor: 'pointer'
                                    }}
                                    preview={{
                                        mask: (
                                            <div style={{
                                                background: 'rgba(0, 0, 0, 0.6)',
                                                color: 'white',
                                                padding: '8px 16px',
                                                borderRadius: '8px',
                                                display: 'flex',
                                                alignItems: 'center',
                                                gap: '8px'
                                            }}>
                                                <FileImageOutlined />
                                                View Full Size
                                            </div>
                                        )
                                    }}
                                />
                            </div>

                            <Button
                                type="primary"
                                size="large"
                                icon={<TrophyOutlined />}
                                onClick={() => window.open(sessionCompletion.certificate_url, '_blank')}
                                style={{
                                    background: 'linear-gradient(135deg, #fbbf24 0%, #f59e0b 100%)',
                                    border: 'none',
                                    borderRadius: '12px',
                                    fontWeight: 600
                                }}
                            >
                                Download Certificate
                            </Button>
                        </Space>
                    </Card>
                )}

                {/* Comments/Feedback Section */}
                <Card
                    style={{
                        background: 'rgba(255, 255, 255, 0.1)',
                        backdropFilter: 'blur(20px)',
                        border: '1px solid rgba(255, 255, 255, 0.2)',
                        borderRadius: '24px',
                        marginBottom: '24px'
                    }}
                >
                    <CommentsList feedbacks={feedbacks} loading={feedbackLoading} error={feedbackError}>
                        {user && user.role === 'trainee' && userRegistration && (
                            registrationStatus === 'confirmed' ? (
                                <FeedbackForm
                                    sessionId={sessionId}
                                    onSubmit={async (data) => {
                                        const payload = {
                                            registration_id: userRegistration.id,
                                            rating: data.rating,
                                            comment: data.comment,
                                        };
                                        await feedbackApi.submitFeedback(payload);
                                        setFeedbackLoading(true);
                                        feedbackApi.getFeedbackBySession(sessionId)
                                            .then(res => setFeedbacks(res.data))
                                            .finally(() => setFeedbackLoading(false));
                                        message.success('Feedback submitted successfully!');
                                    }}
                                />
                            ) : (
                                <Alert
                                    message="Feedback Restricted"
                                    description="Only confirmed trainees can submit feedback for this session."
                                    type="info"
                                    showIcon
                                    icon={<LockOutlined />}
                                    style={{
                                        background: 'rgba(59, 130, 246, 0.1)',
                                        border: '1px solid rgba(59, 130, 246, 0.3)',
                                        borderRadius: '12px'
                                    }}
                                />
                            )
                        )}
                    </CommentsList>
                </Card>

                {/* Create Course Modal */}
                <CreateCourseModal
                    isOpen={showCreateCourseModal}
                    onClose={() => setShowCreateCourseModal(false)}
                    session={session}
                    onCourseCreated={() => {
                        trainingSessionApi.getSession(sessionId).then(res => setSession(res.data));
                        message.success('Course created successfully!');
                    }}
                />

                {/* Update Course Modal */}
                <Modal
                    title={
                        <Title level={4} style={{ margin: 0, color: '#1f2937' }}>
                            <EditOutlined style={{ marginRight: '8px', color: '#6366f1' }} />
                            Update Course
                        </Title>
                    }
                    open={showUpdateModal}
                    onCancel={() => {
                        setShowUpdateModal(false);
                        form.resetFields();
                    }}
                    footer={null}
                    width={600}
                    style={{
                        backdropFilter: 'blur(20px)'
                    }}
                >
                    <Form
                        form={form}
                        layout="vertical"
                        onFinish={handleUpdateCourse}
                        style={{ marginTop: '24px' }}
                    >
                        <Form.Item
                            name="title"
                            label={<Text strong>Course Title</Text>}
                            rules={[{ required: true, message: 'Please enter course title' }]}
                        >
                            <Input
                                size="large"
                                placeholder="Enter course title"
                                style={{
                                    borderRadius: '8px',
                                    background: '#f9fafb',
                                    color: '#1f2937',
                                    border: '1px solid #d1d5db'
                                }}
                                className="update-modal-input"
                            />
                        </Form.Item>

                        <Form.Item
                            name="description"
                            label={<Text strong>Description</Text>}
                        >
                            <Input.TextArea
                                rows={4}
                                placeholder="Enter course description"
                                style={{
                                    borderRadius: '8px',
                                    background: '#f9fafb',
                                    color: '#1f2937',
                                    border: '1px solid #d1d5db'
                                }}
                                className="update-modal-input"
                            />
                        </Form.Item>

                        <Form.Item style={{ marginBottom: 0, textAlign: 'right' }}>
                            <Space>
                                <Button
                                    onClick={() => {
                                        setShowUpdateModal(false);
                                        form.resetFields();
                                    }}
                                    disabled={updating}
                                    style={{ borderRadius: '8px' }}
                                >
                                    Cancel
                                </Button>
                                <Button
                                    type="primary"
                                    htmlType="submit"
                                    loading={updating}
                                    icon={<CheckCircleOutlined />}
                                    style={{
                                        background: 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)',
                                        border: 'none',
                                        borderRadius: '8px',
                                        fontWeight: 600
                                    }}
                                >
                                    {updating ? 'Updating...' : 'Update Course'}
                                </Button>
                            </Space>
                        </Form.Item>
                    </Form>
                </Modal>

                {/* Lightbox for Images */}
                <Lightbox
                    open={lightboxOpen}
                    close={() => setLightboxOpen(false)}
                    slides={lightboxImages}
                    index={lightboxIndex}
                />
            </div>

            <style>{`
                @keyframes float {
                    0%, 100% { transform: translateY(0px) rotate(0deg); }
                    50% { transform: translateY(-20px) rotate(5deg); }
                }

                /* Scoped styles for update course modal inputs */
                .ant-modal .update-modal-input,
                .ant-modal .update-modal-input textarea {
                    background: #f9fafb !important;
                    color: #1f2937 !important;
                    border: 1px solid #d1d5db !important;
                }
                .ant-modal .update-modal-input::placeholder,
                .ant-modal .update-modal-input textarea::placeholder {
                    color: #6b7280 !important;
                }


                .custom-search .ant-input::placeholder {
                    color: rgba(255, 255, 255, 0.5) !important;
                }

                .custom-search .ant-input:focus,
                .custom-search .ant-input:hover {
                    border-color: rgba(139, 92, 246, 0.6) !important;
                    box-shadow: 0 0 0 2px rgba(139, 92, 246, 0.2) !important;
                }

                .ant-pagination-item {
                    background: rgba(255, 255, 255, 0.1) !important;
                    border: 1px solid rgba(255, 255, 255, 0.2) !important;
                    border-radius: 8px !important;
                    backdrop-filter: blur(20px);
                }

                .ant-pagination-item a {
                    color: white !important;
                }

                .ant-pagination-item-active {
                    background: rgba(99, 102, 241, 0.6) !important;
                    border-color: rgba(99, 102, 241, 0.8) !important;
                }

                .ant-pagination-item-active a {
                    color: white !important;
                }

                .ant-pagination-prev .ant-pagination-item-link,
                .ant-pagination-next .ant-pagination-item-link {
                    background: rgba(255, 255, 255, 0.1) !important;
                    border: 1px solid rgba(255, 255, 255, 0.2) !important;
                    color: white !important;
                    border-radius: 8px !important;
                    backdrop-filter: blur(20px);
                }

                .ant-pagination-prev:hover .ant-pagination-item-link,
                .ant-pagination-next:hover .ant-pagination-item-link {
                    background: rgba(255, 255, 255, 0.2) !important;
                    border-color: rgba(255, 255, 255, 0.4) !important;
                }

                .ant-pagination-options-quick-jumper input {
                    background: rgba(255, 255, 255, 0.1) !important;
                    border: 1px solid rgba(255, 255, 255, 0.2) !important;
                    color: white !important;
                    border-radius: 6px !important;
                    backdrop-filter: blur(20px);
                }

                .ant-select-selector {
                    background: rgba(255, 255, 255, 0.1) !important;
                    border: 1px solid rgba(255, 255, 255, 0.2) !important;
                    color: white !important;
                    border-radius: 6px !important;
                    backdrop-filter: blur(20px);
                }

                .ant-select-arrow {
                    color: white !important;
                }

                .ant-card-actions {
                    background: rgba(255, 255, 255, 0.05) !important;
                    border-top: 1px solid rgba(255, 255, 255, 0.1) !important;
                    backdrop-filter: blur(20px);
                }

                .ant-card-actions > li {
                    border-right: 1px solid rgba(255, 255, 255, 0.1) !important;
                }

                .ant-card-actions > li:last-child {
                    border-right: none !important;
                }

                .ant-image-mask {
                    background: rgba(0, 0, 0, 0.6) !important;
                    border-radius: 12px !important;
                }

                .ant-progress-bg {
                    background: linear-gradient(135deg, #06b6d4 0%, #10b981 100%) !important;
                }

                .ant-statistic-content {
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                }

                .ant-card:hover {
                    transform: translateY(-2px) !important;
                    box-shadow: 0 20px 40px rgba(0, 0, 0, 0.15) !important;
                }

                .ant-popconfirm .ant-popover-inner {
                    background: rgba(255, 255, 255, 0.95) !important;
                    backdrop-filter: blur(20px) !important;
                    border-radius: 12px !important;
                }
            `}</style>
        </div>
    );
};

export default SessionDetails;