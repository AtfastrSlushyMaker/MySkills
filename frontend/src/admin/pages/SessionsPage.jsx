import React, { useState, useEffect } from "react";
import SessionDeleteModal from "../components/DeleteConfirmationModal";
import { trainingSessionApi } from "../../services/api";
import SessionCreateModal from "../components/sessions/SessionCreateModal";
import SessionUpdateModal from "../components/sessions/SessionUpdateModal";
import SessionDetailsModal from "../components/sessions/SessionDetailsModal";
import { registrationApi } from "../../services/api";
import { Table, Button, Input, Space, Card, Badge, Typography, message, Tag, Tooltip } from "antd";
import { SearchOutlined, PlusOutlined, EditOutlined, DeleteOutlined, EyeOutlined, CalendarOutlined, CheckCircleOutlined, InboxOutlined, UserOutlined, ClockCircleOutlined, EnvironmentOutlined, TeamOutlined } from "@ant-design/icons";

const { Title, Text } = Typography;

function SessionsPage() {
    const [data, setData] = useState([]);
    const [sessionStats, setSessionStats] = useState({
        total_sessions: 0,
        active_sessions: 0,
        archived_sessions: 0
    });
    const [pagination, setPagination] = useState({ current: 1, pageSize: 10 });
    const [search, setSearch] = useState("");
    const [loading, setLoading] = useState(false);
    const [createModalVisible, setCreateModalVisible] = useState(false);
    const [updateModalVisible, setUpdateModalVisible] = useState(false);
    const [modalLoading, setModalLoading] = useState(false);
    const [selectedSession, setSelectedSession] = useState(null);
    const [deleteModalVisible, setDeleteModalVisible] = useState(false);
    const [sessionToDelete, setSessionToDelete] = useState(null);
    const [detailsModalVisible, setDetailsModalVisible] = useState(false);
    const [sessionToView, setSessionToView] = useState(null);

    useEffect(() => {
        setLoading(true);
        trainingSessionApi.getAllSessions()
            .then(res => {
                const sessions = Array.isArray(res.data) ? res.data : res.data.data || [];
                setData(sessions.map(s => ({ ...s, key: s.id })));
            })
            .catch(() => message.error('Failed to fetch sessions'))
            .finally(() => setLoading(false));
    }, []);

    useEffect(() => {
        const activeCount = data.filter(s => s.status === 'active').length;
        const archivedCount = data.filter(s => s.status === 'archived').length;
        setSessionStats({
            total_sessions: data.length,
            active_sessions: activeCount,
            archived_sessions: archivedCount
        });
    }, [data]);

    const handleCreateSession = async (values) => {
        setModalLoading(true);
        try {
            const response = await trainingSessionApi.createSession(values);
            const newSession = response.data;
            setData(prev => [{ ...newSession, key: newSession.id }, ...prev]);
            setCreateModalVisible(false);
            message.success("Session created successfully");
        } catch (error) {
            message.error("Failed to create session");
        }
        setModalLoading(false);
    };

    const handleUpdateSession = async (session) => {
        setModalLoading(true);
        try {
            const response = await trainingSessionApi.updateSession(session.id, session);
            const updatedSession = response.data;
            setData(prev => prev.map(s => s.id === updatedSession.id ? { ...updatedSession, key: updatedSession.id } : s));
            setUpdateModalVisible(false);
            message.success("Session updated successfully");
        } catch (error) {
            message.error("Failed to update session");
        }
        setModalLoading(false);
    };

    const handleDeleteSession = async () => {
        if (!sessionToDelete) return;
        setModalLoading(true);
        try {
            await trainingSessionApi.deleteSession(sessionToDelete.id);
            setData(prev => prev.filter(s => s.id !== sessionToDelete.id));
            message.success("Session deleted successfully");
        } catch (error) {
            message.error("Failed to delete session");
        }
        setModalLoading(false);
        setDeleteModalVisible(false);
        setSessionToDelete(null);
    };

    const getStatusColor = (status) => {
        switch (status?.toLowerCase()) {
            case 'active':
                return 'green';
            case 'archived':
                return 'default';
            default:
                return 'default';
        }
    };

    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
        });
    };

    const formatTime = (timeStr) => {
        if (!timeStr) return '';
        const parts = timeStr.split(':');
        return parts.length >= 2 ? `${parts[0].padStart(2, '0')}:${parts[1].padStart(2, '0')}` : timeStr;
    };

    const columns = [
        {
            title: 'Session Details',
            key: 'session_details',
            width: 150,
            render: (_, record) => (
                <div className="space-y-1">
                    <Tag color="blue" className="mb-1">
                        {record.category?.name || 'N/A'}
                    </Tag>
                    <div className="text-sm font-medium text-gray-700">
                        {record.skill_name || 'N/A'}
                    </div>
                </div>
            ),
        },
        {
            title: 'People',
            key: 'people',
            width: 180,
            render: (_, record) => (
                <div className="space-y-2">
                    <div className="flex items-center gap-2">
                        <UserOutlined className="text-blue-500 text-xs" />
                        <div>
                            <div className="text-xs text-gray-500">Trainer</div>
                            <div className="text-sm font-medium">
                                {record.trainer ? `${record.trainer.first_name} ${record.trainer.last_name}` : 'N/A'}
                            </div>
                        </div>
                    </div>
                    <div className="flex items-center gap-2">
                        <TeamOutlined className="text-green-500 text-xs" />
                        <div>
                            <div className="text-xs text-gray-500">Coordinator</div>
                            <div className="text-sm font-medium">
                                {record.coordinator ? `${record.coordinator.first_name} ${record.coordinator.last_name}` : 'N/A'}
                            </div>
                        </div>
                    </div>
                </div>
            ),
        },
        {
            title: 'Location & Capacity',
            key: 'location_capacity',
            width: 140,
            render: (_, record) => (
                <div className="space-y-2">
                    <div className="flex items-center gap-2">
                        <EnvironmentOutlined className="text-red-500 text-xs" />
                        <span className="text-sm font-medium">{record.location || 'N/A'}</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <TeamOutlined className="text-orange-500 text-xs" />
                        <span className="text-sm">Max: {record.max_participants || 0}</span>
                    </div>
                </div>
            ),
        },
        {
            title: 'Status',
            key: 'status',
            width: 100,
            render: (_, record) => (
                <Tag
                    color={getStatusColor(record.status)}
                    className="capitalize font-medium"
                >
                    {record.status || 'Unknown'}
                </Tag>
            ),
        },
        {
            title: 'Courses',
            key: 'courses',
            width: 200,
            render: (_, record) => (
                <div className="space-y-1">
                    {Array.isArray(record.training_courses) && record.training_courses.length > 0 ? (
                        record.training_courses.slice(0, 2).map((course) => (
                            <div key={course.id} className="p-2 bg-gray-50 rounded text-xs">
                                <div className="font-semibold text-gray-900 mb-1">
                                    {course.title}
                                </div>
                                <div className="text-gray-600">
                                    {course.duration_hours}h
                                    {course.description && (
                                        <span className="ml-2 text-gray-500">
                                            {course.description.length > 30
                                                ? `${course.description.substring(0, 30)}...`
                                                : course.description
                                            }
                                        </span>
                                    )}
                                </div>
                            </div>
                        ))
                    ) : (
                        <span className="text-gray-400 text-sm">No courses</span>
                    )}
                    {record.training_courses?.length > 2 && (
                        <div className="text-xs text-blue-600 font-medium">
                            +{record.training_courses.length - 2} more
                        </div>
                    )}
                </div>
            ),
        },
        {
            title: 'Participants',
            key: 'participants',
            width: 180,
            render: (_, record) => (
                <div className="space-y-1">
                    {Array.isArray(record.registrations) && record.registrations.length > 0 ? (
                        <>
                            {record.registrations.slice(0, 3).map((reg) => (
                                <div key={reg.id} className="flex items-center justify-between p-1 bg-gray-50 rounded text-xs">
                                    <span className="font-medium text-gray-900">
                                        {reg.user ? `${reg.user.first_name} ${reg.user.last_name}` : 'Unknown'}
                                    </span>
                                    <Tag
                                        size="small"
                                        color={reg.status === 'confirmed' ? 'green' : 'orange'}
                                    >
                                        {reg.status}
                                    </Tag>
                                </div>
                            ))}
                            {record.registrations.length > 3 && (
                                <div className="text-xs text-blue-600 font-medium">
                                    +{record.registrations.length - 3} more
                                </div>
                            )}
                        </>
                    ) : (
                        <span className="text-gray-400 text-sm">No participants</span>
                    )}
                </div>
            ),
        },
        {
            title: 'Actions',
            key: 'actions',
            width: 120,
            fixed: 'right',
            render: (_, record) => (
                <Space size="small" direction="vertical">
                    <div className="flex gap-1">
                        <Tooltip title="View Details">
                            <Button
                                type="text"
                                icon={<EyeOutlined />}
                                size="small"
                                className="hover:bg-blue-50 hover:text-blue-600"
                                onClick={() => {
                                    setSessionToView(record);
                                    setDetailsModalVisible(true);
                                }}
                            />
                        </Tooltip>
                        <Tooltip title="Edit Session">
                            <Button
                                type="text"
                                icon={<EditOutlined />}
                                size="small"
                                className="hover:bg-green-50 hover:text-green-600"
                                onClick={() => {
                                    setSelectedSession(record);
                                    setUpdateModalVisible(true);
                                }}
                            />
                        </Tooltip>
                        <Tooltip title="Delete Session">
                            <Button
                                type="text"
                                icon={<DeleteOutlined />}
                                size="small"
                                className="hover:bg-red-50 hover:text-red-600"
                                onClick={() => {
                                    setSessionToDelete(record);
                                    setDeleteModalVisible(true);
                                }}
                            />
                        </Tooltip>
                    </div>
                </Space>
            ),
        },
    ];

    const filteredData = data.filter(session => {
        const searchTerm = search.toLowerCase();
        const fields = [
            session.title,
            session.description,
            session.status,
            session.category?.name,
            session.skill_name,
            session.trainer ? `${session.trainer.first_name} ${session.trainer.last_name}` : '',
            session.coordinator ? `${session.coordinator.first_name} ${session.coordinator.last_name}` : '',
            session.location,
            Array.isArray(session.training_courses) ?
                session.training_courses.map(c => c.title).join(' ') : '',
            Array.isArray(session.registrations) ?
                session.registrations.map(r => r.user ?
                    `${r.user.first_name} ${r.user.last_name}` : '').join(' ') : ''
        ];
        return fields.some(f => (f || '').toLowerCase().includes(searchTerm));
    });

    return (
        <>
            <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 relative">
                {/* Background overlay for glassmorphism effect */}
                <div className="absolute inset-0 bg-gradient-to-br from-white/20 via-blue-100/30 to-indigo-100/20 backdrop-blur-sm"></div>
                <div className="max-w-7xl mx-auto p-6 relative z-10">
                    {/* Header */}
                    <div className="mb-8">
                        <div className="flex items-center justify-between">
                            <div>
                                <Title level={1} className="!text-gray-900 !mb-2">
                                    Sessions Management
                                </Title>
                                <Text className="text-gray-600 text-base">
                                    Manage your training sessions and schedules
                                </Text>
                            </div>
                            <Badge count={data.length} showZero color="#06b6d4" className="mr-4">
                                <div className="bg-white/30 backdrop-blur-md px-4 py-2 rounded-lg shadow-sm border border-white/20">
                                    <Text className="text-sm font-medium text-gray-700">Total Sessions</Text>
                                </div>
                            </Badge>
                        </div>
                    </div>

                    {/* Stats Cards */}
                    <div className="flex flex-wrap justify-center items-stretch gap-6 mb-8">
                        <Card className="flex-1 max-w-[220px] min-w-[180px] border-0 shadow-lg bg-white/20 backdrop-blur-md border border-white/30 flex flex-col justify-center items-stretch transition-transform duration-200 hover:scale-[1.04] hover:shadow-2xl hover:bg-white/40">
                            <div className="flex items-center gap-4">
                                <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg flex items-center justify-center">
                                    <CalendarOutlined className="text-white text-xl" />
                                </div>
                                <div>
                                    <Text className="text-sm text-gray-600">Total Sessions</Text>
                                    <div className="text-2xl font-bold text-gray-900">{sessionStats.total_sessions}</div>
                                </div>
                            </div>
                        </Card>
                        <Card className="flex-1 max-w-[220px] min-w-[180px] border-0 shadow-lg bg-white/20 backdrop-blur-md border border-white/30 flex flex-col justify-center items-stretch transition-transform duration-200 hover:scale-[1.04] hover:shadow-2xl hover:bg-white/40">
                            <div className="flex items-center gap-4">
                                <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-green-600 rounded-lg flex items-center justify-center">
                                    <CheckCircleOutlined className="text-white text-xl" />
                                </div>
                                <div>
                                    <Text className="text-sm text-gray-600">Active Sessions</Text>
                                    <div className="text-2xl font-bold text-gray-900">{sessionStats.active_sessions}</div>
                                </div>
                            </div>
                        </Card>
                        <Card className="flex-1 max-w-[220px] min-w-[180px] border-0 shadow-lg bg-white/20 backdrop-blur-md border border-white/30 flex flex-col justify-center items-stretch transition-transform duration-200 hover:scale-[1.04] hover:shadow-2xl hover:bg-white/40">
                            <div className="flex items-center gap-4">
                                <div className="w-12 h-12 bg-gradient-to-br from-gray-500 to-gray-600 rounded-lg flex items-center justify-center">
                                    <InboxOutlined className="text-white text-xl" />
                                </div>
                                <div>
                                    <Text className="text-sm text-gray-600">Archived Sessions</Text>
                                    <div className="text-2xl font-bold text-gray-900">{sessionStats.archived_sessions}</div>
                                </div>
                            </div>
                        </Card>
                    </div>

                    {/* Main Content */}
                    <Card className="border-0 shadow-lg bg-white/20 backdrop-blur-md border border-white/30">
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
                            <Input
                                placeholder="Search sessions..."
                                prefix={<SearchOutlined className="text-gray-400" />}
                                value={search}
                                onChange={e => setSearch(e.target.value)}
                                className="sm:max-w-sm bg-white/30 backdrop-blur-sm border-white/30"
                                size="large"
                            />
                            <Button
                                type="primary"
                                icon={<PlusOutlined />}
                                size="large"
                                className="bg-gradient-to-r from-blue-600/90 to-indigo-600/90 hover:from-blue-700/90 hover:to-indigo-700/90 border-0 shadow-lg backdrop-blur-sm"
                                onClick={() => setCreateModalVisible(true)}
                            >
                                Add Session
                            </Button>
                        </div>

                        <div className="overflow-hidden rounded-lg border border-gray-200">
                            <Table
                                dataSource={filteredData}
                                columns={columns}
                                loading={loading}
                                pagination={{
                                    current: pagination.current,
                                    pageSize: pagination.pageSize,
                                    showSizeChanger: true,
                                    showQuickJumper: true,
                                    pageSizeOptions: ['10', '20', '50'],
                                    showTotal: (total, range) => `${range[0]}-${range[1]} of ${total} sessions`,
                                    onChange: (page, pageSize) => setPagination({ current: page, pageSize })
                                }}
                                scroll={{ x: 1400 }}
                                rowClassName="hover:bg-white/20 transition-colors duration-200"
                                className="bg-white/30 backdrop-blur-sm"
                            />
                        </div>
                    </Card>
                </div>

                <style>{`
                    .line-clamp-1 {
                        display: -webkit-box;
                        -webkit-line-clamp: 1;
                        -webkit-box-orient: vertical;
                        overflow: hidden;
                    }
                    .line-clamp-2 {
                        display: -webkit-box;
                        -webkit-line-clamp: 2;
                        -webkit-box-orient: vertical;
                        overflow: hidden;
                    }
                    .ant-table-thead > tr > th {
                        background-color: #f8fafc;
                        border-bottom: 2px solid #e2e8f0;
                        font-weight: 600;
                        color: #374151;
                    }
                    .ant-table-tbody > tr > td {
                        border-bottom: 1px solid #f1f5f9;
                        padding: 12px 16px;
                    }
                    .ant-table-tbody > tr:last-child > td {
                        border-bottom: none;
                    }
                `}</style>
            </div>
            {/* Modals */}
            <SessionCreateModal
                visible={createModalVisible}
                onCancel={() => setCreateModalVisible(false)}
                onCreate={handleCreateSession}
                loading={modalLoading}
            />
            <SessionUpdateModal
                visible={updateModalVisible}
                onCancel={() => setUpdateModalVisible(false)}
                session={selectedSession}
                onUpdate={handleUpdateSession}
                loading={modalLoading}
            />
            {/* Details Modal with links */}
            <SessionDetailsModal
                visible={detailsModalVisible}
                onCancel={() => setDetailsModalVisible(false)}
                session={sessionToView}
                links={sessionToView && sessionToView.links ? sessionToView.links : []}
            />
            {/* Details Modal Links */}
            {/* ...existing code... */}
            {/* Delete Confirmation Modal with links */}
            <SessionDeleteModal
                visible={deleteModalVisible}
                onCancel={() => setDeleteModalVisible(false)}
                session={sessionToDelete}
                onDelete={handleDeleteSession}
                loading={modalLoading}
                links={sessionToDelete && sessionToDelete.links ? sessionToDelete.links : []}
            />
        </>
    );
}

export default SessionsPage;