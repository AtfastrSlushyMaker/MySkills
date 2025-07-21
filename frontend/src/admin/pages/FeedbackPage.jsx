

import React from 'react';
import { Button, Input, Card, Badge, Typography, Table, message, Tooltip } from 'antd';
import { PlusOutlined, SearchOutlined, MessageOutlined, UserOutlined, StarFilled, CalendarOutlined, EditOutlined, DeleteOutlined, EyeOutlined } from '@ant-design/icons';
import FeedbackCreateModal from '../components/feedback/FeedbackCreateModal';
import FeedbackDetailsModal from '../components/feedback/FeedbackDetailsModal';
import DeleteConfirmationModal from '../components/DeleteConfirmationModal';
import { feedbackApi } from '../../services/api';

const { Title, Text } = Typography;

function FeedbackPage() {
    const [data, setData] = React.useState([]);
    const [search, setSearch] = React.useState("");
    const [createModalVisible, setCreateModalVisible] = React.useState(false);
    const [detailsModalVisible, setDetailsModalVisible] = React.useState(false);
    const [selectedFeedback, setSelectedFeedback] = React.useState(null);
    const [modalLoading, setModalLoading] = React.useState(false);
    const [loading, setLoading] = React.useState(true);
    const [deleteModalVisible, setDeleteModalVisible] = React.useState(false);
    const [feedbackToDelete, setFeedbackToDelete] = React.useState(null);

    React.useEffect(() => {
        setLoading(true);
        feedbackApi.getAllFeedback()
            .then(res => {
                setData(res.data.map(fb => {
                    // Extract user name from nested registration.user if available
                    let userName = 'Unknown';
                    if (fb.registration && fb.registration.user) {
                        userName = `${fb.registration.user.first_name} ${fb.registration.user.last_name}`;
                    } else if (fb.user) {
                        userName = `${fb.user.first_name} ${fb.user.last_name}`;
                    }
                    // Extract session name from nested registration.training_session or training_session
                    let sessionName = '';
                    if (fb.registration && fb.registration.training_session) {
                        sessionName = fb.registration.training_session.skill_name || '';
                    } else if (fb.training_session && fb.training_session.skill_name) {
                        sessionName = fb.training_session.skill_name;
                    }
                    return {
                        ...fb,
                        userName,
                        session: sessionName,
                        created_at: fb.created_at || (fb.registration && fb.registration.created_at) || '',
                    };
                }));
            })
            .catch(() => message.error('Failed to fetch feedback'))
            .finally(() => setLoading(false));
    }, []);

    const filteredData = data.filter(fb => {
        const comment = fb.comment?.toLowerCase() || "";
        const user = fb.userName?.toLowerCase() || "";
        const searchTerm = search.toLowerCase();
        return comment.includes(searchTerm) || user.includes(searchTerm);
    });

    const columns = [
        {
            title: 'User',
            dataIndex: 'userName',
            key: 'userName',
            render: (userName, record) => (
                <span className="flex items-center gap-2"><UserOutlined className="text-blue-500" />{userName}</span>
            ),
        },
        {
            title: 'Comment',
            dataIndex: 'comment',
            key: 'comment',
            render: (text) => (
                <Tooltip title={text} placement="topLeft">
                    <span className="block max-w-xs truncate text-gray-900">{text}</span>
                </Tooltip>
            ),
        },
        {
            title: 'Session',
            dataIndex: 'session',
            key: 'session',
            render: (session) => (
                <span className="flex items-center gap-1 text-indigo-600">{session || '-'}</span>
            ),
        },
        {
            title: 'Rating',
            dataIndex: 'rating',
            key: 'rating',
            render: (rating) => (
                <span className="flex items-center gap-1 text-blue-500">{[...Array(rating)].map((_, i) => <StarFilled key={i} />)}</span>
            ),
        },
        {
            title: 'Date',
            dataIndex: 'created_at',
            key: 'created_at',
            render: (date) => (
                <span className="flex items-center gap-1 text-gray-500">
                    <CalendarOutlined />
                    {date ? new Date(date).toLocaleDateString() : '-'}
                </span>
            ),
        },
        {
            title: 'Actions',
            key: 'actions',
            render: (_, record) => (
                <span className="flex gap-1">
                    <Button
                        type="text"
                        icon={<EyeOutlined />}
                        className="hover:bg-blue-50 hover:text-blue-600 border-0 text-gray-600"
                        size="small"
                        onClick={() => { setSelectedFeedback(record); setDetailsModalVisible(true); }}
                    />
                    <Button
                        type="text"
                        icon={<EditOutlined />}
                        className="hover:bg-green-50 hover:text-green-600 border-0 text-gray-600"
                        size="small"
                        disabled
                    />
                    <Button
                        type="text"
                        icon={<DeleteOutlined />}
                        className="hover:bg-red-50 hover:text-red-600 border-0 text-gray-600"
                        size="small"
                        onClick={() => { setFeedbackToDelete(record); setDeleteModalVisible(true); }}
                    />
                </span>
            ),
        },
    ];

    const handleCreateFeedback = (payload) => {
        setModalLoading(true);
        feedbackApi.submitFeedback(payload)
            .then(res => {
                // Refetch feedback after creation
                return feedbackApi.getAllFeedback();
            })
            .then(res => {
                setData(res.data.map(fb => {
                    let userName = 'Unknown';
                    if (fb.registration && fb.registration.user) {
                        userName = `${fb.registration.user.first_name} ${fb.registration.user.last_name}`;
                    } else if (fb.user) {
                        userName = `${fb.user.first_name} ${fb.user.last_name}`;
                    }
                    let sessionName = '';
                    if (fb.registration && fb.registration.training_session) {
                        sessionName = fb.registration.training_session.skill_name || '';
                    } else if (fb.training_session && fb.training_session.skill_name) {
                        sessionName = fb.training_session.skill_name;
                    }
                    return {
                        ...fb,
                        userName,
                        session: sessionName,
                        created_at: fb.created_at || (fb.registration && fb.registration.created_at) || '',
                    };
                }));
                setCreateModalVisible(false);
                message.success('Feedback added');
            })
            .catch(() => message.error('Failed to add feedback'))
            .finally(() => setModalLoading(false));
    };

    const handleDeleteFeedback = async () => {
        if (!feedbackToDelete) return;
        setModalLoading(true);
        try {
            await feedbackApi.deleteFeedback(feedbackToDelete.id);
            setData(prev => prev.filter(fb => fb.id !== feedbackToDelete.id));
            message.success('Feedback deleted');
        } catch (error) {
            message.error('Failed to delete feedback');
        }
        setModalLoading(false);
        setDeleteModalVisible(false);
        setFeedbackToDelete(null);
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 relative">
            {/* Background overlay for glassmorphism effect */}
            <div className="absolute inset-0 bg-gradient-to-br from-white/20 via-blue-100/30 to-indigo-100/20 backdrop-blur-sm"></div>
            <div className="max-w-7xl mx-auto p-6 relative z-10">
                {/* Header */}
                <div className="mb-8">
                    <div className="flex items-center justify-between">
                        <div>
                            <Title level={1} className="!text-gray-900 !mb-2">
                                Feedback Management
                            </Title>
                            <Text className="text-gray-600 text-base">
                                View and manage user feedback for sessions and courses
                            </Text>
                        </div>
                        <Badge count={data.length} showZero color="#3b82f6" className="mr-4">
                            <div className="bg-white/30 backdrop-blur-md px-4 py-2 rounded-lg shadow-sm border border-white/20">
                                <Text className="text-sm font-medium text-gray-700">Total Feedback</Text>
                            </div>
                        </Badge>
                    </div>
                </div>

                {/* Main Content */}
                <Card className="border-0 shadow-lg bg-white/20 backdrop-blur-md border border-white/30">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
                        <Input
                            placeholder="Search feedback by comment or user..."
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
                            Add Feedback
                        </Button>
                    </div>

                    <Table
                        dataSource={filteredData}
                        columns={columns}
                        rowKey="id"
                        loading={loading}
                        pagination={{ pageSize: 10 }}
                        className="overflow-hidden bg-white/30 backdrop-blur-sm !mt-6"
                        rowClassName="hover:bg-white/20 transition-colors duration-200"
                    />
                </Card>
            </div>

            {/* Feedback Modals */}
            <FeedbackCreateModal
                visible={createModalVisible}
                onCreate={handleCreateFeedback}
                onCancel={() => setCreateModalVisible(false)}
                loading={modalLoading}
            />
            <FeedbackDetailsModal
                visible={detailsModalVisible}
                feedback={selectedFeedback}
                onCancel={() => setDetailsModalVisible(false)}
            />
            <DeleteConfirmationModal
                visible={deleteModalVisible}
                loading={modalLoading}
                onConfirm={handleDeleteFeedback}
                onCancel={() => { setDeleteModalVisible(false); setFeedbackToDelete(null); }}
                itemName={feedbackToDelete ? feedbackToDelete.comment : 'this feedback'}
            />
        </div>
    );
}

export default FeedbackPage;
