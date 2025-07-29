import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    Card,
    Button,
    Typography,
    Spin,
    Alert,
    Modal,
    Form,
    Input,
    Switch,
    Tag,
    Avatar,
    Divider,
    Pagination,
    Row,
    Col,
    Space,
    Badge,
    message,
    Tooltip,
    Empty,
    Image,
    Progress,
    Statistic
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
    FileImageOutlined
} from '@ant-design/icons';
import Lightbox from 'yet-another-react-lightbox';
import 'yet-another-react-lightbox/styles.css';
import { sessionCompletionApi, trainingSessionApi, trainingCourseApi, toggleCourseActiveApi, registrationApi, feedbackApi, courseCompletionApi } from '../services/api';
import { useAuth } from '../contexts/AuthContext';
import CreateCourseModal from './modals/CreateCourseModal';
import SessionInfo from './sessionDetails/SessionInfo';
import TraineeList from './sessionDetails/TraineeList';
import FeedbackForm from './sessionDetails/FeedbackForm';
import CommentsList from './sessionDetails/CommentsList';

const { Title, Text, Paragraph } = Typography;
const { Meta } = Card;

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

    // Pagination state
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

    const userRegistration = session && session.registrations && user
        ? session.registrations.find(r => r.user_id === user.id)
        : null;

    // Pagination calculations
    const startIndex = (currentPage - 1) * pageSize;
    const endIndex = startIndex + pageSize;
    const paginatedCourses = courses.slice(startIndex, endIndex);

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
            {/* Glassmorphism background is now handled globally */}
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
                                    <Title level={4} style={{ color: 'white', margin: 0 }}>
                                        Enrollment Status
                                    </Title>
                                    {registrationStatus && (
                                        <Badge
                                            status={getStatusConfig(registrationStatus).color}
                                            text={
                                                <Text style={{ color: 'rgba(255, 255, 255, 0.8)' }}>
                                                    {getStatusConfig(registrationStatus).text}
                                                </Text>
                                            }
                                        />
                                    )}
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
                        <Row justify="space-between" align="middle">
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
                    </div>

                    {courses.length === 0 ? (
                        <Empty
                            description={
                                <Text style={{ color: 'rgba(255, 255, 255, 0.6)' }}>
                                    No courses assigned to this session yet
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

                                    return (
                                        <Col xs={24} md={12} lg={8} key={course.id || idx}>
                                            <Card
                                                hoverable
                                                style={{
                                                    background: isCompleted
                                                        ? 'rgba(34, 197, 94, 0.2)'
                                                        : 'rgba(255, 255, 255, 0.05)',
                                                    backdropFilter: 'blur(20px)',
                                                    border: isCompleted
                                                        ? '1px solid rgba(34, 197, 94, 0.4)'
                                                        : '1px solid rgba(255, 255, 255, 0.2)',
                                                    borderRadius: '16px',
                                                    height: '100%',
                                                    transform: isCompleted ? 'scale(1.02)' : 'scale(1)',
                                                    transition: 'all 0.3s ease'
                                                }}
                                                onClick={() => navigate(`/courses/${course.id}`)}
                                                actions={[
                                                    ...(user && user.role === 'trainer' ? [
                                                        <Tooltip title="Edit Course" key="edit">
                                                            <Button
                                                                icon={<EditOutlined />}
                                                                type="text"
                                                                style={{ color: '#06b6d4' }}
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
                                                            />
                                                        </Tooltip>
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
                                                                border: 'none'
                                                            }}
                                                        >
                                                            {isCompleted ? 'Completed' : isMarking ? 'Marking...' : 'Complete'}
                                                        </Button>
                                                    ] : [])
                                                ]}
                                            >
                                                <Meta
                                                    title={
                                                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                                            <Text strong style={{ color: 'white', fontSize: '16px' }}>
                                                                {course.title}
                                                            </Text>
                                                            <Tag color="purple">
                                                                {course.duration_hours}h
                                                            </Tag>
                                                        </div>
                                                    }
                                                    description={
                                                        <div>
                                                            <Paragraph
                                                                style={{ color: 'rgba(255, 255, 255, 0.7)', margin: '8px 0' }}
                                                                ellipsis={{ rows: 2 }}
                                                            >
                                                                {course.description || 'No description provided.'}
                                                            </Paragraph>

                                                            <Space wrap style={{ marginTop: '12px' }}>
                                                                {course.level && (
                                                                    <Tag color="blue">Level: {course.level}</Tag>
                                                                )}
                                                                {course.is_active !== undefined && (
                                                                    <Tag color={course.is_active ? 'green' : 'red'}>
                                                                        {course.is_active ? 'Active' : 'Inactive'}
                                                                    </Tag>
                                                                )}
                                                                {course.tags && course.tags.map((tag, i) => (
                                                                    <Tag key={i} color="cyan">{tag}</Tag>
                                                                ))}
                                                            </Space>

                                                            {course.trainer && (
                                                                <div style={{ marginTop: '12px', display: 'flex', alignItems: 'center' }}>
                                                                    <Avatar size="small" icon={<UserOutlined />} style={{ marginRight: '8px' }} />
                                                                    <Text style={{ color: 'rgba(255, 255, 255, 0.8)', fontSize: '12px' }}>
                                                                        {course.trainer.first_name} {course.trainer.last_name}
                                                                    </Text>
                                                                </div>
                                                            )}

                                                            {course.prerequisites && course.prerequisites.length > 0 && (
                                                                <div style={{ marginTop: '8px' }}>
                                                                    <Text style={{ color: 'rgba(255, 255, 255, 0.6)', fontSize: '12px' }}>
                                                                        Prerequisites: {course.prerequisites.join(', ')}
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
                            {courses.length > pageSize && (
                                <div style={{ textAlign: 'center', marginTop: '32px' }}>
                                    <Pagination
                                        current={currentPage}
                                        pageSize={pageSize}
                                        total={courses.length}
                                        onChange={(page, size) => {
                                            setCurrentPage(page);
                                            setPageSize(size);
                                        }}
                                        showSizeChanger
                                        showQuickJumper
                                        showTotal={(total, range) =>
                                            <Text style={{ color: 'rgba(255, 255, 255, 0.8)' }}>
                                                {`${range[0]}-${range[1]} of ${total} courses`}
                                            </Text>
                                        }
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
                                    fontWeight: 600
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
                                style={{ borderRadius: '8px' }}
                            />
                        </Form.Item>

                        <Form.Item
                            name="description"
                            label={<Text strong>Description</Text>}
                        >
                            <Input.TextArea
                                rows={4}
                                placeholder="Enter course description"
                                style={{ borderRadius: '8px' }}
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

            <style jsx>{`
                @keyframes float {
                    0%, 100% { transform: translateY(0px) rotate(0deg); }
                    50% { transform: translateY(-20px) rotate(5deg); }
                }

                .ant-pagination-item {
                    background: rgba(255, 255, 255, 0.1) !important;
                    border: 1px solid rgba(255, 255, 255, 0.2) !important;
                    border-radius: 8px !important;
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
                }

                .ant-select-selector {
                    background: rgba(255, 255, 255, 0.1) !important;
                    border: 1px solid rgba(255, 255, 255, 0.2) !important;
                    color: white !important;
                    border-radius: 6px !important;
                }

                .ant-select-arrow {
                    color: white !important;
                }

                .ant-card-actions {
                    background: rgba(255, 255, 255, 0.05) !important;
                    border-top: 1px solid rgba(255, 255, 255, 0.1) !important;
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
            `}</style>
        </div>
    );
};

export default SessionDetails;