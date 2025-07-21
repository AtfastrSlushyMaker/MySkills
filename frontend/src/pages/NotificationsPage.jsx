import { useState, useEffect } from 'react'
import { useAuth } from '../contexts/AuthContext'
import GlassmorphismBackground from '../components/GlassmorphismBackground'
import LoadingSpinner from '../components/LoadingSpinner'
import { notificationApi } from '../services/api'
import {
    BellOutlined,
    ExclamationCircleOutlined,
    CheckCircleOutlined,
    InfoCircleOutlined,
    WarningOutlined,
    EyeOutlined,
    ClockCircleOutlined,
    DownOutlined,
    DeleteOutlined,
    FilterOutlined
} from '@ant-design/icons';
import {
    Card,
    List,
    Tag,
    Button,
    Tabs,
    Dropdown,
    Spin,
    Typography,
    message,
    Empty,
    Badge,
    Space,
    Tooltip,
    Divider
} from 'antd';

const { Title, Text } = Typography;


function NotificationsPage() {
    const { user } = useAuth()
    const [notifications, setNotifications] = useState([])
    const [loading, setLoading] = useState(false)
    const [filter, setFilter] = useState('all') // all, unread, read
    const [dropdownOpen, setDropdownOpen] = useState(false)

    // Fetch notifications from API
    useEffect(() => {
        const fetchNotifications = async () => {
            setLoading(true)
            try {
                const res = await notificationApi.getUserNotifications()
                // Map backend fields to frontend expected fields
                const apiNotifications = (res.data.notifications || []).map(n => ({
                    id: n.id,
                    type: n.type || 'info',
                    title: n.title,
                    message: n.message,
                    read: n.is_read,
                    created_at: new Date(n.created_at),
                    icon: n.icon || 'BellOutlined',
                    color: n.priority === 'urgent' ? 'red' : n.priority === 'high' ? 'yellow' : n.priority === 'low' ? 'green' : 'blue',
                }))
                setNotifications(apiNotifications)
            } catch (error) {
                console.warn('Failed to fetch notifications', error)

            } finally {
                setLoading(false)
            }
        }

        fetchNotifications()
    }, [])

    const filteredNotifications = notifications.filter(notification => {
        if (filter === 'unread') return !notification.read
        if (filter === 'read') return notification.read
        return true
    })

    const markAsRead = async (id) => {
        try {
            await notificationApi.markNotificationAsRead(id)
            setNotifications(prev => prev.map(notification =>
                notification.id === id ? { ...notification, read: true } : notification
            ))
            message.success('Notification marked as read')
        } catch (error) {
            // Fallback for demo
            setNotifications(prev => prev.map(notification =>
                notification.id === id ? { ...notification, read: true } : notification
            ))
            message.success('Notification marked as read (demo mode)')
        }
    }

    const markAllAsRead = async () => {
        setLoading(true)
        try {
            await notificationApi.markAllNotificationsAsRead()
            setNotifications(prev => prev.map(notification => ({ ...notification, read: true })))
            message.success('All notifications marked as read')
        } catch (error) {
            // Fallback for demo
            setNotifications(prev => prev.map(notification => ({ ...notification, read: true })))
            message.success('All notifications marked as read (demo mode)')
        }
        setLoading(false)
    }

    const deleteNotification = async (id) => {
        try {
            await notificationApi.deleteNotification(id)
            setNotifications(prev => prev.filter(notification => notification.id !== id))
            message.success('Notification deleted')
        } catch (error) {
            // Fallback for demo
            setNotifications(prev => prev.filter(notification => notification.id !== id))
            message.success('Notification deleted (demo mode)')
        }
    }

    const formatTime = (date) => {
        const now = new Date()
        const diff = now - date
        const minutes = Math.floor(diff / (1000 * 60))
        const hours = Math.floor(diff / (1000 * 60 * 60))
        const days = Math.floor(diff / (1000 * 60 * 60 * 24))

        if (minutes < 1) return 'Just now'
        if (minutes < 60) return `${minutes}m ago`
        if (hours < 24) return `${hours}h ago`
        return `${days}d ago`
    }

    const getColorClasses = (color) => {
        switch (color) {
            case 'blue':
                return {
                    bg: 'from-blue-500/20 to-cyan-500/20',
                    border: 'border-blue-400/30',
                    icon: 'text-blue-400',
                    glow: 'shadow-blue-500/20'
                }
            case 'green':
                return {
                    bg: 'from-green-500/20 to-emerald-500/20',
                    border: 'border-green-400/30',
                    icon: 'text-green-400',
                    glow: 'shadow-green-500/20'
                }
            case 'yellow':
                return {
                    bg: 'from-yellow-500/20 to-orange-500/20',
                    border: 'border-yellow-400/30',
                    icon: 'text-yellow-400',
                    glow: 'shadow-yellow-500/20'
                }
            case 'red':
                return {
                    bg: 'from-red-500/20 to-pink-500/20',
                    border: 'border-red-400/30',
                    icon: 'text-red-400',
                    glow: 'shadow-red-500/20'
                }
            default:
                return {
                    bg: 'from-gray-500/20 to-slate-500/20',
                    border: 'border-gray-400/30',
                    icon: 'text-gray-400',
                    glow: 'shadow-gray-500/20'
                }
        }
    }

    // Helper to render Ant Design icon from string
    const renderAntdIcon = (iconName, className = '') => {
        const iconMap = {
            BellOutlined: <BellOutlined className={className} />,
            ExclamationCircleOutlined: <ExclamationCircleOutlined className={className} />,
            CheckCircleOutlined: <CheckCircleOutlined className={className} />,
            InfoCircleOutlined: <InfoCircleOutlined className={className} />,
            WarningOutlined: <WarningOutlined className={className} />,
            EyeOutlined: <EyeOutlined className={className} />,
            ClockCircleOutlined: <ClockCircleOutlined className={className} />,
        };
        return iconMap[iconName] || <BellOutlined className={className} />;
    };

    const unreadCount = notifications.filter(n => !n.read).length;
    const readCount = notifications.filter(n => n.read).length;

    const dropdownItems = [
        {
            key: 'markAllRead',
            icon: <CheckCircleOutlined />,
            label: 'Mark All as Read',
            onClick: markAllAsRead,
            disabled: unreadCount === 0
        }
    ];

    return (
        <div className="min-h-screen pt-20 pb-8 bg-gradient-to-br from-blue-900 via-indigo-900 to-purple-900 relative overflow-hidden">
            {/* Animated background elements */}
            <div className="absolute inset-0 overflow-hidden">
                <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-blue-500/10 rounded-full blur-3xl animate-pulse"></div>
                <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
            </div>

            <GlassmorphismBackground />

            <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Header Card */}
                <Card
                    variant="filled"
                    className="mb-8 rounded-3xl shadow-2xl bg-white/5 backdrop-blur-3xl border border-white/10 overflow-hidden"
                    style={{ background: 'linear-gradient(135deg, rgba(255,255,255,0.1) 0%, rgba(255,255,255,0.05) 100%)' }}
                >
                    <div className="text-center mb-6">
                        <div className="flex items-center justify-center mb-4">
                            <div className="relative">
                                <BellOutlined className="text-5xl text-white drop-shadow-lg" />
                                {unreadCount > 0 && (
                                    <Badge
                                        count={unreadCount}
                                        className="absolute -top-2 -right-2"
                                        style={{ background: '#3b82f6', boxShadow: '0 0 20px rgba(59, 130, 246, 0.5)' }}
                                    />
                                )}
                            </div>
                        </div>

                        <Title
                            level={2}
                            className="!text-white !mb-2 !font-bold !drop-shadow-lg"
                            style={{
                                background: 'linear-gradient(90deg, #fff, #a5b4fc, #c4b5fd)',
                                WebkitBackgroundClip: 'text',
                                color: 'transparent',
                                fontSize: '2.5rem'
                            }}
                        >
                            Notifications
                        </Title>

                        <Text className="block text-white/80 text-lg mb-4">
                            Stay updated with your latest activities and messages
                        </Text>

                        <div className="flex justify-center space-x-6 text-white/70">
                            <div className="text-center">
                                <div className="text-2xl font-bold text-white">{notifications.length}</div>
                                <div className="text-sm">Total</div>
                            </div>
                            <Divider type="vertical" className="h-12 bg-white/20" />
                            <div className="text-center">
                                <div className="text-2xl font-bold text-blue-400">{unreadCount}</div>
                                <div className="text-sm">Unread</div>
                            </div>
                            <Divider type="vertical" className="h-12 bg-white/20" />
                            <div className="text-center">
                                <div className="text-2xl font-bold text-green-400">{readCount}</div>
                                <div className="text-sm">Read</div>
                            </div>
                        </div>
                    </div>

                    {/* Filter Tabs and Actions */}
                    <div className="flex flex-col lg:flex-row items-center justify-between gap-4">
                        <Tabs
                            activeKey={filter}
                            onChange={setFilter}
                            className="w-full lg:w-auto notifications-tabs"
                            items={[
                                {
                                    key: 'all',
                                    label: (
                                        <Space>
                                            <FilterOutlined />
                                            All
                                            <Badge count={notifications.length} style={{ background: '#6366f1' }} />
                                        </Space>
                                    )
                                },
                                {
                                    key: 'unread',
                                    label: (
                                        <Space>
                                            <BellOutlined />
                                            Unread
                                            <Badge count={unreadCount} style={{ background: '#f59e0b' }} />
                                        </Space>
                                    )
                                },
                                {
                                    key: 'read',
                                    label: (
                                        <Space>
                                            <CheckCircleOutlined />
                                            Read
                                            <Badge count={readCount} style={{ background: '#10b981' }} />
                                        </Space>
                                    )
                                }
                            ]}
                            animated
                            tabBarGutter={32}
                        />

                        <Dropdown
                            menu={{ items: dropdownItems }}
                            trigger={["click"]}
                            open={dropdownOpen}
                            onOpenChange={setDropdownOpen}
                        >
                            <Button
                                className="flex items-center bg-white/10 border-white/20 text-white hover:bg-white/20 hover:border-white/30 transition-all duration-300"
                                icon={<DownOutlined />}
                                size="large"
                            >
                                Actions
                            </Button>
                        </Dropdown>
                    </div>
                </Card>

                {/* Notifications List */}
                <Card
                    variant="filled"
                    className="rounded-3xl shadow-2xl bg-white/5 backdrop-blur-3xl border border-white/10"
                    style={{ background: 'linear-gradient(135deg, rgba(255,255,255,0.08) 0%, rgba(255,255,255,0.03) 100%)' }}
                >
                    {loading ? (
                        <div className="flex items-center justify-center py-16">
                            <Spin size="large" />
                            <Text className="ml-4 text-white/80 text-lg">Loading notifications...</Text>
                        </div>
                    ) : filteredNotifications.length === 0 ? (
                        <div className="flex flex-col items-center justify-center py-16">
                            <div className="relative mb-6">
                                <BellOutlined className="text-8xl text-white/20" />
                                <div className="absolute inset-0 animate-ping">
                                    <BellOutlined className="text-8xl text-white/10" />
                                </div>
                            </div>
                            <Title level={3} className="!text-white !mb-2">No notifications found</Title>
                            <Text className="text-white/60 text-lg text-center max-w-md">
                                {filter === 'all'
                                    ? "You're all caught up! No notifications to show."
                                    : `No ${filter} notifications to display. Check back later for updates.`
                                }
                            </Text>
                        </div>
                    ) : (
                        <List
                            itemLayout="vertical"
                            dataSource={filteredNotifications}
                            className="notification-list"
                            renderItem={(notification, index) => {
                                const colors = getColorClasses(notification.color)
                                return (
                                    <div
                                        key={notification.id}
                                        className={`notification-item rounded-2xl mb-6 overflow-hidden shadow-lg border transition-all duration-300 hover:scale-[1.02] hover:shadow-2xl ${!notification.read
                                            ? 'ring-2 ring-blue-400/60 shadow-blue-500/20'
                                            : 'border-white/10 read-fade'
                                            }`}
                                        style={{
                                            background: 'linear-gradient(135deg, rgba(255,255,255,0.12) 0%, rgba(255,255,255,0.06) 100%)',
                                            backdropFilter: 'blur(16px)',
                                            animationDelay: `${index * 100}ms`
                                        }}
                                    >
                                        <List.Item className="!p-0 !border-0">
                                            <div className="p-6">
                                                <div className="flex items-start space-x-4">
                                                    {/* Icon */}
                                                    <div className={`flex items-center justify-center w-14 h-14 bg-gradient-to-br ${colors.bg} rounded-xl border ${colors.border} flex-shrink-0 shadow-lg ${colors.glow}`}>
                                                        {renderAntdIcon(notification.icon, `${colors.icon} text-xl`)}
                                                    </div>

                                                    {/* Content */}
                                                    <div className="flex-1 min-w-0">
                                                        <div className="flex items-start justify-between mb-2">
                                                            <Title level={4} className="!text-white !mb-0 !font-semibold">
                                                                {notification.title}
                                                                {!notification.read && (
                                                                    <span className="ml-3 inline-block w-2 h-2 bg-blue-400 rounded-full animate-pulse"></span>
                                                                )}
                                                            </Title>
                                                            <div className="flex items-center space-x-2">
                                                                {!notification.read && (
                                                                    <Tooltip title="Mark as read">
                                                                        <Button
                                                                            type="text"
                                                                            icon={<CheckCircleOutlined className="text-2xl" />}
                                                                            onClick={() => markAsRead(notification.id)}
                                                                            className="text-blue-400 hover:text-blue-300 hover:bg-blue-500/10 border-0"
                                                                            size="small"
                                                                        />
                                                                    </Tooltip>
                                                                )}
                                                            </div>
                                                        </div>

                                                        <Text className="text-white/80 text-base leading-relaxed block mb-4">
                                                            {notification.message}
                                                        </Text>

                                                        <div className="flex items-center justify-between">
                                                            <div className="flex items-center space-x-4 text-sm text-white/50">
                                                                <span className="flex items-center">
                                                                    <ClockCircleOutlined className="mr-2" />
                                                                    {formatTime(notification.created_at)}
                                                                </span>
                                                            </div>

                                                            {notification.read && (
                                                                <Tooltip title="This notification has been read">
                                                                    <span className="inline-flex items-center px-3 py-1 rounded-full bg-green-500 text-white font-semibold text-sm shadow-sm animate-read-tag gap-1">
                                                                        <CheckCircleOutlined className="mr-1 animate-bounce-once text-lg" style={{ color: 'white' }} />
                                                                        Read
                                                                    </span>
                                                                </Tooltip>
                                                            )}
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </List.Item>
                                    </div>
                                )
                            }}
                        />
                    )}
                </Card>
            </div>

            {/* Custom Styles */}
            <style>{`
                .notifications-tabs .ant-tabs-tab {
                    color: rgba(255, 255, 255, 0.7) !important;
                }
                .notifications-tabs .ant-tabs-tab-active {
                    color: white !important;
                }
                .notifications-tabs .ant-tabs-ink-bar {
                    background: linear-gradient(90deg, #3b82f6, #8b5cf6) !important;
                }
                .notification-list .ant-list-item {
                    border: none !important;
                }
                .notification-item {
                    animation: slideInUp 0.6s ease-out forwards;
                    opacity: 0;
                    transform: translateY(20px);
                }
                .read-fade {
                    opacity: 0.7;
                    filter: grayscale(0.2);
                    transition: opacity 0.5s, filter 0.5s;
                }
                .animate-read-tag {
                    animation: fadeInReadTag 0.7s;
                }
                @keyframes fadeInReadTag {
                    from { opacity: 0; transform: scale(0.8); }
                    to { opacity: 1; transform: scale(1); }
                }
                .animate-bounce-once {
                    animation: bounceOnce 0.5s;
                }
                @keyframes bounceOnce {
                    0% { transform: scale(1); }
                    30% { transform: scale(1.3); }
                    60% { transform: scale(0.9); }
                    100% { transform: scale(1); }
                }
                @keyframes slideInUp {
                    to {
                        opacity: 1;
                        transform: translateY(0);
                    }
                }
            `}</style>
        </div>
    )
}

export default NotificationsPage