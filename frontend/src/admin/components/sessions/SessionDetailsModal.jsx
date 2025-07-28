import React, { useState, useMemo } from "react";
import { Modal, Descriptions, Tag, Badge, Avatar, Input, Tooltip, Button, Pagination, message } from "antd";
import {
    CalendarOutlined,
    ClockCircleOutlined,
    EnvironmentOutlined,
    TeamOutlined,
    UserOutlined,
    BookOutlined,
    LinkOutlined,
    CheckCircleOutlined,
    ExclamationCircleOutlined,
    CloseCircleOutlined,
    EditOutlined,
    DeleteOutlined,
    PlusOutlined
} from "@ant-design/icons";
import DeleteConfirmationModal from '../DeleteConfirmationModal';
import CourseCreateModal from '../courses/CourseCreateModal';
import CourseUpdateModal from '../courses/CourseUpdateModal';

function formatDate(dateStr) {
    if (!dateStr) return '';
    const d = new Date(dateStr);
    if (isNaN(d)) return dateStr;
    return d.toLocaleDateString('en-US', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    });
}

function formatTime(timeStr) {
    if (!timeStr) return '';
    const parts = timeStr.split(':');
    if (parts.length >= 2) {
        const hours = parseInt(parts[0]);
        const minutes = parseInt(parts[1]);
        return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`;
    }
    return timeStr;
}

function formatTimeRange(startTime, endTime) {
    const start = formatTime(startTime);
    const end = formatTime(endTime);

    if (!start || !end) return 'Time TBD';

    // Check if end time is before start time (likely an error)
    const [startHour, startMin] = start.split(':').map(Number);
    const [endHour, endMin] = end.split(':').map(Number);
    const startMinutes = startHour * 60 + startMin;
    const endMinutes = endHour * 60 + endMin;

    if (endMinutes < startMinutes) {
        return `${start} - ${end} ⚠️`;
    }

    return `${start} - ${end}`;
}

function getStatusColor(status) {
    const statusColors = {
        'active': 'green',
        'completed': 'blue',
        'cancelled': 'red',
        'pending': 'orange',
        'draft': 'gray'
    };
    return statusColors[status?.toLowerCase()] || 'default';
}

function getStatusIcon(status) {
    const statusIcons = {
        'active': <CheckCircleOutlined />,
        'completed': <CheckCircleOutlined />,
        'cancelled': <CloseCircleOutlined />,
        'pending': <ExclamationCircleOutlined />,
        'draft': <ExclamationCircleOutlined />
    };
    return statusIcons[status?.toLowerCase()] || <ExclamationCircleOutlined />;
}


function SessionDetailsModal({ visible, session, onCancel, onRefresh }) {
    const [editModalOpen, setEditModalOpen] = useState(false);
    const [createModalOpen, setCreateModalOpen] = useState(false);
    const [deleteModalOpen, setDeleteModalOpen] = useState(false);
    const [selectedCourse, setSelectedCourse] = useState(null);
    const [courseToDelete, setCourseToDelete] = useState(null);
    const [deleteLoading, setDeleteLoading] = useState(false);
    const [courseSearch, setCourseSearch] = useState("");
    const [coursePage, setCoursePage] = useState(1);
    const [participantPage, setParticipantPage] = useState(1);
    const [localCourses, setLocalCourses] = useState(session?.training_courses || []);

    React.useEffect(() => {
        setLocalCourses(session?.training_courses || []);
    }, [session?.training_courses]);

    const COURSES_PER_PAGE = 3;
    const PARTICIPANTS_PER_PAGE = 5;

    const filteredCourses = useMemo(() => {
        if (!Array.isArray(localCourses)) return [];
        if (!courseSearch.trim()) return localCourses;
        const search = courseSearch.trim().toLowerCase();
        return localCourses.filter(c =>
            (c.title && c.title.toLowerCase().includes(search)) ||
            (c.description && c.description.toLowerCase().includes(search))
        );
    }, [localCourses, courseSearch]);

    const paginatedCourses = useMemo(() => {
        const start = (coursePage - 1) * COURSES_PER_PAGE;
        const end = start + COURSES_PER_PAGE;
        return filteredCourses.slice(start, end);
    }, [filteredCourses, coursePage]);

    const paginatedParticipants = useMemo(() => {
        const participants = session?.registrations || [];
        const start = (participantPage - 1) * PARTICIPANTS_PER_PAGE;
        const end = start + PARTICIPANTS_PER_PAGE;
        return participants.slice(start, end);
    }, [session?.registrations, participantPage]);

    // Reset pagination when search changes
    React.useEffect(() => {
        setCoursePage(1);
    }, [courseSearch]);

    const modalStyles = {
        body: {
            padding: '24px',
            maxHeight: '75vh',
            overflowY: 'auto',
            background: 'linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%)'
        }
    };

    return (
        <Modal
            open={visible}
            onCancel={onCancel}
            footer={null}
            centered
            width={900}
            styles={modalStyles}
            className="session-details-modal"
            title={
                <div className="flex items-center gap-3 text-xl font-bold text-gray-800 border-b border-gray-200 pb-4">
                    <div className="flex items-center justify-center w-10 h-10 bg-gradient-to-r from-cyan-500 to-blue-500 rounded-full text-white">
                        <CalendarOutlined className="text-lg" />
                    </div>
                    <span className="bg-gradient-to-r from-cyan-600 to-blue-600 bg-clip-text text-transparent">
                        Session Details
                    </span>
                </div>
            }
        >
            <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
                <div className="space-y-6">
                    {/* Header Section */}
                    <div className="bg-gradient-to-r from-cyan-50 to-blue-50 p-6 rounded-lg border-l-4 border-cyan-500">
                        <h2 className="text-2xl font-bold text-gray-800 mb-2">
                            {session?.title || session?.skill_name || 'Training Session'}
                        </h2>
                        <p className="text-gray-600 text-base leading-relaxed">
                            {session?.description || session?.skill_description || 'No description available'}
                        </p>
                    </div>

                    {/* Quick Info Cards */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                        <div className="bg-white p-4 rounded-lg border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                                    <BookOutlined className="text-green-600" />
                                </div>
                                <div>
                                    <p className="text-sm text-gray-500">Category</p>
                                    <p className="font-semibold text-gray-800">{session?.category?.name || 'N/A'}</p>
                                </div>
                            </div>
                        </div>

                        <div className="bg-white p-4 rounded-lg border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                                    <ClockCircleOutlined className="text-blue-600" />
                                </div>
                                <div>
                                    <p className="text-sm text-gray-500">Duration</p>
                                    <p className="font-semibold text-gray-800">
                                        {formatTimeRange(session?.start_time, session?.end_time)}
                                    </p>
                                </div>
                            </div>
                        </div>

                        <div className="bg-white p-4 rounded-lg border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center">
                                    <EnvironmentOutlined className="text-purple-600" />
                                </div>
                                <div>
                                    <p className="text-sm text-gray-500">Location</p>
                                    <p className="font-semibold text-gray-800">{session?.location || 'TBD'}</p>
                                </div>
                            </div>
                        </div>

                        <div className="bg-white p-4 rounded-lg border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 bg-orange-100 rounded-full flex items-center justify-center">
                                    <TeamOutlined className="text-orange-600" />
                                </div>
                                <div>
                                    <p className="text-sm text-gray-500">Capacity</p>
                                    <p className="font-semibold text-gray-800">
                                        {session?.registrations?.length || 0} / {session?.max_participants || 'N/A'}
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Detailed Information */}
                    <Descriptions
                        bordered
                        column={1}
                        size="middle"
                        className="custom-descriptions"
                        styles={{
                            label: {
                                backgroundColor: '#f8fafc',
                                fontWeight: '600',
                                color: '#374151',
                                width: '200px'
                            },
                            content: {
                                backgroundColor: '#ffffff',
                                color: '#1f2937'
                            }
                        }}
                    >
                        <Descriptions.Item
                            label={
                                <div className="flex items-center gap-2">
                                    <BookOutlined className="text-cyan-600" />
                                    <span>Title & Description</span>
                                </div>
                            }
                        >
                            <div>
                                <p className="font-semibold text-gray-800 mb-2">
                                    {session?.title || session?.skill_name || 'Training Session'}
                                </p>
                                <p className="text-gray-600">
                                    {session?.description || session?.skill_description || 'No description available'}
                                </p>
                            </div>
                        </Descriptions.Item>

                        <Descriptions.Item
                            label={
                                <div className="flex items-center gap-2">
                                    <ClockCircleOutlined className="text-cyan-600" />
                                    <span>Time</span>
                                </div>
                            }
                        >
                            <div className="flex items-center gap-2">
                                <span className="font-medium">{formatTimeRange(session?.start_time, session?.end_time)}</span>
                                {session?.start_time && session?.end_time && (() => {
                                    const [startHour, startMin] = session.start_time.split(':').map(Number);
                                    const [endHour, endMin] = session.end_time.split(':').map(Number);
                                    const startMinutes = startHour * 60 + startMin;
                                    const endMinutes = endHour * 60 + endMin;
                                    if (endMinutes < startMinutes) {
                                        return <span className="text-red-500 text-sm">(Time conflict detected)</span>;
                                    }
                                    return null;
                                })()}
                            </div>
                        </Descriptions.Item>

                        <Descriptions.Item
                            label={
                                <div className="flex items-center gap-2">
                                    <CalendarOutlined className="text-cyan-600" />
                                    <span>Date</span>
                                </div>
                            }
                        >
                            <div className="flex items-center gap-2">
                                <span className="font-medium">{formatDate(session?.date)}</span>
                                {session?.end_date && (
                                    <span className="text-gray-500">→ {formatDate(session?.end_date)}</span>
                                )}
                            </div>
                        </Descriptions.Item>

                        <Descriptions.Item
                            label={
                                <div className="flex items-center gap-2">
                                    <CheckCircleOutlined className="text-cyan-600" />
                                    <span>Status</span>
                                </div>
                            }
                        >
                            <Tag
                                color={getStatusColor(session?.status)}
                                icon={getStatusIcon(session?.status)}
                                className="px-3 py-1 text-sm font-medium"
                            >
                                {session?.status?.toUpperCase() || 'UNKNOWN'}
                            </Tag>
                        </Descriptions.Item>

                        <Descriptions.Item
                            label={
                                <div className="flex items-center gap-2">
                                    <UserOutlined className="text-cyan-600" />
                                    <span>Staff</span>
                                </div>
                            }
                        >
                            <div className="space-y-2">
                                {session?.trainer && (
                                    <div className="flex items-center gap-2">
                                        <Avatar size="small" icon={<UserOutlined />} className="bg-blue-500" />
                                        <span className="font-medium">Trainer:</span>
                                        <span>{`${session.trainer.first_name} ${session.trainer.last_name}`}</span>
                                    </div>
                                )}
                                {session?.coordinator && (
                                    <div className="flex items-center gap-2">
                                        <Avatar size="small" icon={<UserOutlined />} className="bg-green-500" />
                                        <span className="font-medium">Coordinator:</span>
                                        <span>{`${session.coordinator.first_name} ${session.coordinator.last_name}`}</span>
                                    </div>
                                )}
                            </div>
                        </Descriptions.Item>

                        <Descriptions.Item
                            label={
                                <div className="flex items-center gap-2">
                                    <BookOutlined className="text-cyan-600" />
                                    <span>Courses ({filteredCourses.length})</span>
                                </div>
                            }
                        >
                            <div className="space-y-4">
                                <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3">
                                    <Input.Search
                                        allowClear
                                        placeholder="Search courses by title or description..."
                                        value={courseSearch}
                                        onChange={e => setCourseSearch(e.target.value)}
                                        style={{ maxWidth: 350 }}
                                        size="middle"
                                    />
                                    <Button
                                        type="primary"
                                        icon={<PlusOutlined />}
                                        size="middle"
                                        onClick={() => setCreateModalOpen(true)}
                                        className="bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600 border-0"
                                    >
                                        Add Course
                                    </Button>
                                </div>

                                {Array.isArray(session?.training_courses) && session.training_courses.length > 0 ? (
                                    <div className="space-y-4">
                                        {paginatedCourses.length > 0 ? (
                                            <>
                                                <div className="space-y-3">
                                                    {paginatedCourses.map(course => (
                                                        <div key={course.id} className="bg-gradient-to-r from-cyan-50 to-blue-50 p-4 rounded-lg border-l-4 border-cyan-400 hover:shadow-sm transition-shadow">
                                                            <div className="flex items-start justify-between">
                                                                <div className="flex-1">
                                                                    <h4 className="font-semibold text-gray-800 flex items-center gap-2 mb-2">
                                                                        <BookOutlined className="text-cyan-600" />
                                                                        {course.title}
                                                                        <div className="flex gap-1">
                                                                            <Tooltip title="Edit Course">
                                                                                <Button
                                                                                    type="text"
                                                                                    icon={<EditOutlined />}
                                                                                    size="small"
                                                                                    className="text-cyan-600 hover:text-cyan-700 hover:bg-cyan-100"
                                                                                    onClick={() => {
                                                                                        setSelectedCourse(course);
                                                                                        setEditModalOpen(true);
                                                                                    }}
                                                                                />
                                                                            </Tooltip>
                                                                            <Tooltip title="Delete Course">
                                                                                <Button
                                                                                    type="text"
                                                                                    danger
                                                                                    icon={<DeleteOutlined />}
                                                                                    size="small"
                                                                                    className="hover:bg-red-100"
                                                                                    onClick={() => {
                                                                                        setCourseToDelete(course);
                                                                                        setDeleteModalOpen(true);
                                                                                    }}
                                                                                />
                                                                            </Tooltip>
                                                                        </div>
                                                                    </h4>
                                                                    <p className="text-sm text-gray-600 leading-relaxed">{course.description}</p>
                                                                </div>
                                                                <Badge
                                                                    count={`${course.duration_hours}h`}
                                                                    style={{ backgroundColor: '#06b6d4', color: 'white' }}
                                                                    className="ml-3 flex-shrink-0"
                                                                />
                                                            </div>
                                                        </div>
                                                    ))}
                                                </div>
                                                {filteredCourses.length > COURSES_PER_PAGE && (
                                                    <div className="flex justify-center pt-2">
                                                        <Pagination
                                                            current={coursePage}
                                                            total={filteredCourses.length}
                                                            pageSize={COURSES_PER_PAGE}
                                                            onChange={setCoursePage}
                                                            showSizeChanger={false}
                                                            showQuickJumper={false}
                                                            size="small"
                                                            className="text-center"
                                                        />
                                                    </div>
                                                )}
                                            </>
                                        ) : (
                                            <div className="text-gray-500 italic text-center py-4 bg-gray-50 rounded-lg">
                                                No courses match your search criteria
                                            </div>
                                        )}
                                    </div>
                                ) : (
                                    <div className="text-gray-500 italic text-center py-6 bg-gray-50 rounded-lg">
                                        <BookOutlined className="text-2xl mb-2 text-gray-400" />
                                        <div>No courses assigned to this session</div>
                                    </div>
                                )}
                            </div>
                        </Descriptions.Item>

                        <Descriptions.Item
                            label={
                                <div className="flex items-center gap-2">
                                    <TeamOutlined className="text-cyan-600" />
                                    <span>Participants ({session?.registrations?.length || 0})</span>
                                </div>
                            }
                        >
                            {Array.isArray(session?.registrations) && session.registrations.length > 0 ? (
                                <div className="space-y-4">
                                    <div className="space-y-3">
                                        {paginatedParticipants.map(reg => (
                                            <div key={reg.id} className="flex items-center gap-3 p-3 bg-gradient-to-r from-gray-50 to-blue-50 rounded-lg border border-gray-200 hover:shadow-sm transition-shadow">
                                                <Avatar size="small" icon={<UserOutlined />} className="bg-gradient-to-r from-cyan-500 to-blue-500" />
                                                <span className="font-medium flex-1 text-gray-800">
                                                    {reg.user ? `${reg.user.first_name} ${reg.user.last_name}` : 'Unknown User'}
                                                </span>
                                                <Tag
                                                    color={getStatusColor(reg.status)}
                                                    size="small"
                                                    className="text-xs font-medium"
                                                >
                                                    {reg.status}
                                                </Tag>
                                            </div>
                                        ))}
                                    </div>
                                    {session.registrations.length > PARTICIPANTS_PER_PAGE && (
                                        <div className="flex justify-center pt-2">
                                            <Pagination
                                                current={participantPage}
                                                total={session.registrations.length}
                                                pageSize={PARTICIPANTS_PER_PAGE}
                                                onChange={setParticipantPage}
                                                showSizeChanger={false}
                                                showQuickJumper={false}
                                                size="small"
                                                className="text-center"
                                            />
                                        </div>
                                    )}
                                </div>
                            ) : (
                                <div className="text-gray-500 italic text-center py-6 bg-gray-50 rounded-lg">
                                    <TeamOutlined className="text-2xl mb-2 text-gray-400" />
                                    <div>No participants registered for this session</div>
                                </div>
                            )}
                        </Descriptions.Item>

                        {Array.isArray(session?.links) && session.links.length > 0 && (
                            <Descriptions.Item
                                label={
                                    <div className="flex items-center gap-2">
                                        <LinkOutlined className="text-cyan-600" />
                                        <span>Related Links</span>
                                    </div>
                                }
                            >
                                <div className="space-y-2">
                                    {session.links.map((link, idx) => (
                                        <div key={idx} className="flex items-center gap-2 p-3 bg-gradient-to-r from-blue-50 to-cyan-50 rounded-lg hover:from-blue-100 hover:to-cyan-100 transition-colors border border-blue-200">
                                            <LinkOutlined className="text-blue-600" />
                                            <a
                                                href={link.url}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="text-blue-600 hover:text-blue-800 font-medium hover:underline"
                                            >
                                                {link.label || link.url}
                                            </a>
                                        </div>
                                    ))}
                                </div>
                            </Descriptions.Item>
                        )}
                    </Descriptions>

                    {/* Footer with metadata */}
                    <div className="bg-gradient-to-r from-gray-50 to-blue-50 p-4 rounded-lg border border-gray-200">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-gray-600">
                            <div>
                                <span className="font-medium">Created:</span> {formatDate(session?.created_at)}
                            </div>
                            <div>
                                <span className="font-medium">Last Updated:</span> {formatDate(session?.updated_at)}
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <CourseUpdateModal
                visible={editModalOpen}
                course={selectedCourse}
                onSuccess={() => {
                    setEditModalOpen(false);
                    setSelectedCourse(null);
                    // TODO: Optionally trigger a refresh in parent if needed
                }}
                onCancel={() => {
                    setEditModalOpen(false);
                    setSelectedCourse(null);
                }}
            />

            <CourseCreateModal
                visible={createModalOpen}
                session={session}
                onSuccess={() => {
                    setCreateModalOpen(false);
                    // TODO: Optionally trigger a refresh in parent if needed
                }}
                onCancel={() => setCreateModalOpen(false)}
            />

            <DeleteConfirmationModal
                visible={deleteModalOpen}
                loading={deleteLoading}
                itemName={courseToDelete?.title || 'this course'}
                onConfirm={async () => {
                    setDeleteLoading(true);
                    try {
                        if (courseToDelete?.id) {
                            const { trainingCourseApi } = await import('../../../services/api');
                            await trainingCourseApi.deleteCourse(courseToDelete.id);
                            // Remove from localCourses for instant UI update
                            setLocalCourses(prev => prev.filter(c => c.id !== courseToDelete.id));
                            message.success('Course deleted successfully!');
                        }
                        setDeleteModalOpen(false);
                        setCourseToDelete(null);
                        if (typeof onRefresh === 'function') onRefresh();
                    } catch (err) {
                        message.error('Failed to delete course.');
                    } finally {
                        setDeleteLoading(false);
                    }
                }}
                onCancel={() => {
                    setDeleteModalOpen(false);
                    setCourseToDelete(null);
                    if (typeof onRefresh === 'function') onRefresh();
                }}
            />
        </Modal>
    );
}

export default SessionDetailsModal;