
import React from 'react';
import { Table, Tag, Button, Input, Select, Typography, message, Tooltip, Space, DatePicker, Card, Avatar, Badge } from 'antd';
import { BellOutlined, SearchOutlined, ReloadOutlined, UserOutlined, ClockCircleOutlined, ExclamationCircleOutlined, CheckCircleOutlined, InfoCircleOutlined, WarningOutlined, EyeOutlined, PlusOutlined } from '@ant-design/icons';
import { notificationApi } from '../../services/api';
import { useAuth } from '../../contexts/AuthContext';
import dayjs from 'dayjs';
import NotificationCreateModal from '../components/notifications/NotificationCreateModal';

const { Title, Text } = Typography;
const { RangePicker } = DatePicker;

function NotificationsPage() {
    const { user, loading: authLoading } = useAuth();
    const [data, setData] = React.useState([]);
    const [loading, setLoading] = React.useState(false);
    const [search, setSearch] = React.useState('');
    const [priority, setPriority] = React.useState('');
    const [type, setType] = React.useState('');
    const [dateRange, setDateRange] = React.useState([]);
    const [refreshing, setRefreshing] = React.useState(false);
    const [notificationStats, setNotificationStats] = React.useState({
        total: 0,
        unread: 0,
        urgent: 0,
        high: 0,
        normal: 0,
        low: 0
    });
    const [pagination, setPagination] = React.useState({ current: 1, pageSize: 12 });

    // Modal state
    const [createModalVisible, setCreateModalVisible] = React.useState(false);
    const [createLoading, setCreateLoading] = React.useState(false);
    // Send notification handler
    const handleSendNotification = async (values) => {
        setCreateLoading(true);
        try {
            let payload = { ...values };
            // Only send user_id, never user_ids, and remove empty fields
            if ('user_ids' in payload) delete payload.user_ids;
            Object.keys(payload).forEach(key => {
                if (payload[key] === undefined || payload[key] === null || payload[key] === '') {
                    delete payload[key];
                }
            });
            await notificationApi.sendNotification(payload);
            message.success('Notification sent successfully');
            setCreateModalVisible(false);
            fetchNotifications();
        } catch (e) {
            message.error('Failed to send notification');
        }
        setCreateLoading(false);
    };

    const fetchNotifications = async () => {
        setLoading(true);
        try {
            const res = await notificationApi.getNotifications();
            const notifications = Array.isArray(res.data.notifications) ? res.data.notifications : [];
            setData(notifications);

            // Calculate stats
            const stats = {
                total: notifications.length,
                unread: notifications.filter(n => !n.is_read).length,
                urgent: notifications.filter(n => n.priority === 'urgent').length,
                high: notifications.filter(n => n.priority === 'high').length,
                normal: notifications.filter(n => n.priority === 'normal').length,
                low: notifications.filter(n => n.priority === 'low').length
            };
            setNotificationStats(stats);
        } catch (e) {
            message.error('Failed to fetch notifications');
            setData([]);
        }
        setLoading(false);
    };

    // Single useEffect - removed the duplicate
    React.useEffect(() => {
        if (!authLoading && user) {
            fetchNotifications();
        }
    }, [authLoading, user]);

    // Guard: only render if user is loaded and is admin
    if (authLoading) {
        return <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><span>Loading...</span></div>;
    }
    if (!user) {
        return (
            <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column' }}>
                <span style={{ marginBottom: 16, color: 'red' }}>Session expired or not logged in.</span>
                <button
                    style={{ padding: '8px 20px', borderRadius: 6, background: '#6366f1', color: 'white', border: 'none', fontWeight: 600, cursor: 'pointer' }}
                    onClick={() => { window.location.href = '/login'; }}
                >Go to Login</button>
            </div>
        );
    }
    if (user.role !== 'admin') {
        return <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'red' }}>Access denied</div>;
    }

    const handleSearch = (value) => {
        setSearch(value);
        setPagination(prev => ({ ...prev, current: 1 }));
    };
    const handlePriorityChange = (value) => {
        setPriority(value);
        setPagination(prev => ({ ...prev, current: 1 }));
    };
    const handleTypeChange = (value) => {
        setType(value);
        setPagination(prev => ({ ...prev, current: 1 }));
    };
    const handleDateChange = (dates) => {
        setDateRange(dates || []);
        setPagination(prev => ({ ...prev, current: 1 }));
    };
    const handleRefresh = () => {
        setRefreshing(true);
        fetchNotifications().finally(() => setRefreshing(false));
    };

    const getPriorityColor = (priority) => {
        switch (priority?.toLowerCase()) {
            case 'urgent':
                return 'bg-red-100 text-red-800 border-red-200';
            case 'high':
                return 'bg-orange-100 text-orange-800 border-orange-200';
            case 'normal':
                return 'bg-blue-100 text-blue-800 border-blue-200';
            case 'low':
                return 'bg-green-100 text-green-800 border-green-200';
            default:
                return 'bg-gray-100 text-gray-800 border-gray-200';
        }
    };

    const getTypeColor = (type) => {
        switch (type?.toLowerCase()) {
            case 'deadline_approaching':
                return 'bg-yellow-100 text-yellow-800 border-yellow-200';
            case 'course_update':
                return 'bg-blue-100 text-blue-800 border-blue-200';
            case 'system_alert':
                return 'bg-red-100 text-red-800 border-red-200';
            case 'reminder':
                return 'bg-purple-100 text-purple-800 border-purple-200';
            default:
                return 'bg-gray-100 text-gray-800 border-gray-200';
        }
    };

    const getPriorityIcon = (priority) => {
        switch (priority?.toLowerCase()) {
            case 'urgent':
                return <ExclamationCircleOutlined className="text-red-600" />;
            case 'high':
                return <WarningOutlined className="text-orange-600" />;
            case 'normal':
                return <InfoCircleOutlined className="text-blue-600" />;
            case 'low':
                return <CheckCircleOutlined className="text-green-600" />;
            default:
                return <InfoCircleOutlined className="text-gray-600" />;
        }
    };

    const filteredDataArray = (data || []).filter(n => {
        const searchTerm = search.toLowerCase();
        const userName = n.user ? `${n.user.first_name} ${n.user.last_name}`.toLowerCase() : '';
        const userEmail = n.user?.email?.toLowerCase() || '';
        const matchesSearch =
            n.title?.toLowerCase().includes(searchTerm) ||
            n.message?.toLowerCase().includes(searchTerm) ||
            userName.includes(searchTerm) ||
            userEmail.includes(searchTerm);
        const matchesPriority = priority ? n.priority === priority : true;
        const matchesType = type ? n.type === type : true;
        const matchesDate = Array.isArray(dateRange) && dateRange.length === 2
            ? dayjs(n.created_at).isAfter(dateRange[0], 'day') && dayjs(n.created_at).isBefore(dateRange[1], 'day')
            : true;
        return matchesSearch && matchesPriority && matchesType && matchesDate;
    });

    const columns = [
        {
            title: 'User',
            dataIndex: 'user_id',
            key: 'user_id',
            render: (userId, record) => (
                <div className="flex items-center gap-3">
                    <Avatar
                        size={40}
                        icon={<UserOutlined />}
                        className="bg-gradient-to-br from-blue-500 to-purple-600 flex-shrink-0"
                    />
                    <div className="min-w-0">
                        <div className="font-semibold text-gray-900 truncate">
                            {record.user ? `${record.user.first_name} ${record.user.last_name}` : `User ${userId}`}
                        </div>
                        <div className="text-sm text-gray-500 truncate">
                            {record.user?.email || 'No email'}
                        </div>
                        <div className="text-sm text-gray-500 truncate">
                            {record.user?.role || 'Unknown role'}
                        </div>
                    </div>
                </div>
            ),
        },
        {
            title: 'Type',
            dataIndex: 'type',
            key: 'type',
            render: (type) => (
                <span className={`px-3 py-1 rounded-full text-xs font-medium border ${getTypeColor(type)}`}>
                    {type?.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}
                </span>
            ),
        },
        {
            title: 'Notification',
            key: 'notification',
            render: (_, record) => (
                <div className="max-w-xs">
                    <div className="flex items-center gap-2 mb-1">
                        {record.icon && <span className="text-lg">{record.icon}</span>}
                        <Text className="font-semibold text-gray-900 truncate">{record.title}</Text>
                    </div>
                    <Tooltip title={record.message}>
                        <Text className="text-sm text-gray-600 block truncate">{record.message}</Text>
                    </Tooltip>
                </div>
            ),
        },
        {
            title: 'Priority',
            dataIndex: 'priority',
            key: 'priority',
            render: (priority) => (
                <div className="flex items-center gap-2">
                    {getPriorityIcon(priority)}
                    <span className={`px-2 py-1 rounded-full text-xs font-medium border ${getPriorityColor(priority)}`}>
                        {priority?.charAt(0).toUpperCase() + priority?.slice(1)}
                    </span>
                </div>
            ),
        },
        {
            title: 'Status',
            dataIndex: 'is_read',
            key: 'is_read',
            render: (isRead) => (
                <div className="flex items-center gap-2">
                    <div className={`w-2 h-2 rounded-full ${isRead ? 'bg-green-500' : 'bg-red-500'}`} />
                    <span className={`px-2 py-1 rounded-full text-xs font-medium border ${isRead
                        ? 'bg-green-100 text-green-800 border-green-200'
                        : 'bg-red-100 text-red-800 border-red-200'
                        }`}>
                        {isRead ? 'Read' : 'Unread'}
                    </span>
                </div>
            ),
        },
        {
            title: 'Created',
            dataIndex: 'created_at',
            key: 'created_at',
            render: (date) => (
                <div className="text-sm">
                    <div className="text-gray-900">{date ? dayjs(date).format('MMM DD, YYYY') : '-'}</div>
                    <div className="text-gray-500">{date ? dayjs(date).format('HH:mm') : '-'}</div>
                </div>
            ),
        },
        {
            title: 'Actions',
            key: 'actions',
            render: (_, record) => (
                <Space size="small">
                    {record.action_url && (
                        <Button
                            type="text"
                            icon={<EyeOutlined />}
                            className="hover:bg-blue-50 hover:text-blue-600 border-0 text-gray-600"
                            size="small"
                            onClick={() => window.open(record.action_url, '_blank', 'noopener,noreferrer')}
                        />
                    )}
                </Space>
            ),
        },
    ];

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
                                <BellOutlined className="text-indigo-600 mr-3" />
                                Notifications Management
                            </Title>
                            <Text className="text-gray-600 text-base">
                                Monitor and manage system notifications for all users
                            </Text>
                        </div>
                        <div className="flex items-center gap-4">
                            <Button
                                icon={<PlusOutlined />}
                                type="primary"
                                size="large"
                                className="bg-gradient-to-r from-blue-500 to-indigo-600 border-0 shadow-lg backdrop-blur-sm text-white"
                                onClick={() => setCreateModalVisible(true)}
                            >
                                Send Notification
                            </Button>
                            <Badge count={notificationStats.unread} showZero color="#ef4444" className="mr-2">
                                <div className="bg-white/30 backdrop-blur-md px-4 py-2 rounded-lg shadow-sm border border-white/20">
                                    <Text className="text-sm font-medium text-gray-700">Unread</Text>
                                </div>
                            </Badge>
                            <Button
                                icon={<ReloadOutlined />}
                                onClick={handleRefresh}
                                loading={refreshing}
                                size="large"
                                className="bg-gradient-to-r from-blue-600/90 to-indigo-600/90 hover:from-blue-700/90 hover:to-indigo-700/90 border-0 shadow-lg backdrop-blur-sm text-white"
                            >
                                Refresh
                            </Button>
                        </div>
                    </div>
                </div>

                {/* Stats Cards */}
                <div className="flex flex-wrap justify-center items-stretch gap-6 mb-8">
                    <Card
                        className="flex-1 max-w-[220px] min-w-[180px] border-0 shadow-lg bg-white/20 backdrop-blur-md border border-white/30 flex flex-col justify-center items-stretch transition-transform duration-200 hover:scale-[1.04] hover:shadow-2xl hover:bg-white/40"
                        styles={{ body: { padding: '20px 24px' } }}
                    >
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-blue-100/50 backdrop-blur-sm rounded-lg flex items-center justify-center">
                                <BellOutlined className="text-blue-600 text-2xl" />
                            </div>
                            <div>
                                <Text className="text-sm text-gray-600">Total</Text>
                                <div className="text-2xl font-bold text-gray-900">{notificationStats.total}</div>
                            </div>
                        </div>
                    </Card>
                    <Card
                        className="flex-1 max-w-[220px] min-w-[180px] border-0 shadow-lg bg-white/20 backdrop-blur-md border border-white/30 flex flex-col justify-center items-stretch transition-transform duration-200 hover:scale-[1.04] hover:shadow-2xl hover:bg-white/40"
                        styles={{ body: { padding: '20px 24px' } }}
                    >
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-red-100/50 backdrop-blur-sm rounded-lg flex items-center justify-center">
                                <ExclamationCircleOutlined className="text-red-600 text-2xl" />
                            </div>
                            <div>
                                <Text className="text-sm text-gray-600">Unread</Text>
                                <div className="text-2xl font-bold text-gray-900">{notificationStats.unread}</div>
                            </div>
                        </div>
                    </Card>
                    <Card
                        className="flex-1 max-w-[220px] min-w-[180px] border-0 shadow-lg bg-white/20 backdrop-blur-md border border-white/30 flex flex-col justify-center items-stretch transition-transform duration-200 hover:scale-[1.04] hover:shadow-2xl hover:bg-white/40"
                        styles={{ body: { padding: '20px 24px' } }}
                    >
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-red-100/50 backdrop-blur-sm rounded-lg flex items-center justify-center">
                                <WarningOutlined className="text-red-600 text-2xl" />
                            </div>
                            <div>
                                <Text className="text-sm text-gray-600">Urgent</Text>
                                <div className="text-2xl font-bold text-gray-900">{notificationStats.urgent}</div>
                            </div>
                        </div>
                    </Card>
                    <Card
                        className="flex-1 max-w-[220px] min-w-[180px] border-0 shadow-lg bg-white/20 backdrop-blur-md border border-white/30 flex flex-col justify-center items-stretch transition-transform duration-200 hover:scale-[1.04] hover:shadow-2xl hover:bg-white/40"
                        styles={{ body: { padding: '20px 24px' } }}
                    >
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-orange-100/50 backdrop-blur-sm rounded-lg flex items-center justify-center">
                                <ClockCircleOutlined className="text-orange-600 text-2xl" />
                            </div>
                            <div>
                                <Text className="text-sm text-gray-600">High Priority</Text>
                                <div className="text-2xl font-bold text-gray-900">{notificationStats.high}</div>
                            </div>
                        </div>
                    </Card>
                </div>

                {/* Main Content */}
                <Card className="border-0 shadow-lg bg-white/20 backdrop-blur-md border border-white/30">
                    {/* Filters */}
                    <div className="flex flex-wrap gap-4 items-center mb-6">
                        <Input
                            prefix={<SearchOutlined className="text-gray-400" />}
                            placeholder="Search title, message, user name or email..."
                            value={search}
                            onChange={e => handleSearch(e.target.value)}
                            className="sm:max-w-sm bg-white/30 backdrop-blur-sm border-white/30"
                            size="large"
                        />
                        <Select
                            allowClear
                            placeholder="Priority"
                            value={priority}
                            onChange={handlePriorityChange}
                            className="min-w-[140px]"
                            size="large"
                            options={['urgent', 'high', 'normal', 'low'].map(p => ({
                                value: p,
                                label: p.charAt(0).toUpperCase() + p.slice(1)
                            }))}
                        />
                        <Select
                            allowClear
                            placeholder="Type"
                            value={type}
                            onChange={handleTypeChange}
                            className="min-w-[180px]"
                            size="large"
                            options={Array.from(new Set((data || []).map(n => n.type))).map(t => ({
                                value: t,
                                label: t?.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())
                            }))}
                        />
                        <RangePicker
                            onChange={handleDateChange}
                            value={dateRange}
                            size="large"
                            className="bg-white/30 backdrop-blur-sm border-white/30"
                        />
                    </div>

                    <Table
                        columns={columns}
                        dataSource={filteredDataArray}
                        loading={loading}
                        rowKey="id"
                        pagination={{
                            current: pagination.current,
                            pageSize: pagination.pageSize,
                            showSizeChanger: true,
                            showQuickJumper: true,
                            pageSizeOptions: ['10', '20', '50', '100'],
                            showTotal: (total, range) => `${range[0]}-${range[1]} of ${total} notifications`,
                            onChange: (page, pageSize) => setPagination({ current: page, pageSize })
                        }}
                        className="overflow-hidden bg-white/30 backdrop-blur-sm !mt-6"
                        rowClassName="hover:bg-white/20 transition-colors duration-200"
                        scroll={{ x: 1200 }}
                    />
                </Card>
            </div>

            {/* Notification Create Modal */}
            <NotificationCreateModal
                visible={createModalVisible}
                onCreate={handleSendNotification}
                onCancel={() => setCreateModalVisible(false)}
                loading={createLoading}
            />

            <style>{`
                .animate-fade-in-up {
                    animation: fadeInUp 0.3s cubic-bezier(0.4, 0, 0.2, 1);
                }
                @keyframes fadeInUp {
                    0% { opacity: 0; transform: translateY(40px); }
                    100% { opacity: 1; transform: translateY(0); }
                }
            `}</style>
        </div>
    );
}

export default NotificationsPage;