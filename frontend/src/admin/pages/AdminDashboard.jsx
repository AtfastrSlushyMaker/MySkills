import React from "react";
import { useNavigate } from "react-router-dom";
import { Card, Typography, Badge, Button, Space } from "antd";
import {
    UserOutlined,
    BookOutlined,
    AppstoreOutlined,
    BarChartOutlined,
    PlusCircleOutlined,
    LineChartOutlined,
    UsergroupAddOutlined,
    RocketOutlined,
    CheckCircleOutlined
} from "@ant-design/icons";
import { userApi, categoryApi, trainingCourseApi, trainingSessionApi } from "../../services/api";
import UserCreateModal from "../components/users/UserCreateModal";
import { systemHealthApi } from "../../services/api";

const { Title, Text } = Typography;

const fetchData = async () => {
    try {
        const [users, categories, courses, sessions] = await Promise.all([
            userApi.getUserCount(),
            categoryApi.getAllCategories(),
            trainingCourseApi.getAllCourses(),
            trainingSessionApi.getAllSessions()
        ]);
        return {
            totalUsers: users.data.count,
            totalCategories: categories.data.length,
            totalCourses: courses.data.length,
            totalSessions: sessions.data.length
        };
    }
    catch (error) {
        console.error("Error fetching data:", error);
        return {
            totalUsers: 0,
            totalCategories: 0,
            totalCourses: 0,
            totalSessions: 0
        };
    }
};

function StatCard({ title, value, icon: IconComponent, trend = "+12%", color = "blue" }) {
    const colorMap = {
        blue: "from-blue-600/90 to-indigo-600/90",
        green: "from-green-600/90 to-emerald-600/90",
        purple: "from-purple-600/90 to-violet-600/90",
        orange: "from-orange-600/90 to-red-600/90"
    };

    const bgColorMap = {
        blue: "bg-blue-100/50",
        green: "bg-green-100/50",
        purple: "bg-purple-100/50",
        orange: "bg-orange-100/50"
    };

    const textColorMap = {
        blue: "text-blue-600",
        green: "text-green-600",
        purple: "text-purple-600",
        orange: "text-orange-600"
    };

    return (
        <Card className="border-0 shadow-lg bg-white/20 backdrop-blur-md border border-white/30 hover:bg-white/30 transition-all duration-300 hover:scale-105">
            <div className="flex items-center gap-4">
                <div className={`w-12 h-12 ${bgColorMap[color]} backdrop-blur-sm rounded-xl flex items-center justify-center`}>
                    <IconComponent className={`text-xl ${textColorMap[color]}`} />
                </div>
                <div className="flex-1">
                    <Text className="text-sm text-gray-600 block">{title}</Text>
                    <div className="text-2xl font-bold text-gray-900">{value}</div>
                    <div className="flex items-center gap-1 mt-1">
                        <span className="text-xs text-green-600 font-medium">{trend}</span>
                        <span className="text-xs text-gray-500">from last month</span>
                    </div>
                </div>
            </div>
        </Card>
    );
}

function QuickAction({ title, description, icon: IconComponent, color = "blue", onClick }) {
    const colorMap = {
        blue: "from-blue-600/90 to-indigo-600/90",
        green: "from-green-600/90 to-emerald-600/90",
        purple: "from-purple-600/90 to-violet-600/90",
        orange: "from-orange-600/90 to-red-600/90"
    };

    const bgColorMap = {
        blue: "bg-blue-100/50",
        green: "bg-green-100/50",
        purple: "bg-purple-100/50",
        orange: "bg-orange-100/50"
    };

    const textColorMap = {
        blue: "text-blue-600",
        green: "text-green-600",
        purple: "text-purple-600",
        orange: "text-orange-600"
    };

    return (
        <Card
            className="border-0 shadow-lg bg-white/20 backdrop-blur-md border border-white/30 hover:bg-white/30 transition-all duration-300 hover:scale-105 cursor-pointer"
            onClick={onClick}
        >
            <div className="text-center">
                <div className={`w-12 h-12 ${bgColorMap[color]} backdrop-blur-sm rounded-xl flex items-center justify-center mx-auto mb-4`}>
                    <IconComponent className={`text-xl ${textColorMap[color]}`} />
                </div>
                <Title level={5} className="!text-gray-900 !mb-2">{title}</Title>
                <Text className="text-sm text-gray-600">{description}</Text>
            </div>
        </Card>
    );
}

function AdminDashboard() {
    const [data, setData] = React.useState(null);
    const [systemHealth, setSystemHealth] = React.useState(null);
    const [loading, setLoading] = React.useState(true);
    const [healthLoading, setHealthLoading] = React.useState(true);
    const [userCreateModalOpen, setUserCreateModalOpen] = React.useState(false);
    const navigate = useNavigate();

    React.useEffect(() => {
        fetchData().then((result) => {
            setData(result);
            setLoading(false);
        });
        systemHealthApi.getHealthStats()
            .then((res) => {
                setSystemHealth(res.data);
                setHealthLoading(false);
            })
            .catch(() => setHealthLoading(false));
    }, []);

    if (loading || healthLoading) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 relative">
                <div className="absolute inset-0 bg-gradient-to-br from-white/20 via-blue-100/30 to-indigo-100/20 backdrop-blur-sm"></div>
                <div className="min-h-screen flex items-center justify-center relative z-10">
                    <div className="flex flex-col items-center gap-4">
                        <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
                        <span className="text-blue-600 text-xl font-semibold">Loading dashboard...</span>
                    </div>
                </div>
            </div>
        );
    }

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
                                Admin Dashboard
                            </Title>
                            <Text className="text-gray-600 text-base">
                                Welcome back, manage your learning platform
                            </Text>
                        </div>
                        <div className="flex items-center gap-4">
                            <Badge count="Online" color="#10b981" className="mr-4">
                                <div className="bg-white/30 backdrop-blur-md px-4 py-2 rounded-lg shadow-sm border border-white/20">
                                    <div className="flex items-center gap-2">
                                        <CheckCircleOutlined className="text-green-600" />
                                        <Text className="text-sm font-medium text-gray-700">System Status</Text>
                                    </div>
                                </div>
                            </Badge>
                        </div>
                    </div>
                </div>

                {/* Stats Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                    <StatCard
                        title="Total Users"
                        value={data ? data.totalUsers : "0"}
                        icon={UserOutlined}
                        color="blue"
                        trend="+12%"
                    />
                    <StatCard
                        title="Active Courses"
                        value={data ? data.totalCourses : "0"}
                        icon={BookOutlined}
                        color="green"
                        trend="+8%"
                    />
                    <StatCard
                        title="Categories"
                        value={data ? data.totalCategories : "0"}
                        icon={AppstoreOutlined}
                        color="purple"
                        trend="+5%"
                    />
                    <StatCard
                        title="Training Sessions"
                        value={data ? data.totalSessions : "0"}
                        icon={BarChartOutlined}
                        color="orange"
                        trend="+15%"
                    />
                </div>

                {/* Quick Actions */}
                <div className="mb-8">
                    <div className="flex items-center gap-3 mb-6">
                        <div className="w-1 h-8 bg-gradient-to-b from-blue-600 to-indigo-600 rounded-full"></div>
                        <Title level={2} className="!text-gray-900 !mb-0">Quick Actions</Title>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                        <QuickAction
                            title="Add User"
                            description="Create a new user account"
                            icon={PlusCircleOutlined}
                            color="blue"
                            onClick={() => setUserCreateModalOpen(true)}
                        />
                        <QuickAction
                            title="Manage Users"
                            description="View and edit user profiles"
                            icon={UsergroupAddOutlined}
                            color="green"
                            onClick={() => navigate('/admin/users')}
                        />
                        <QuickAction
                            title="Analytics"
                            description="View detailed reports"
                            icon={LineChartOutlined}
                            color="purple"
                            onClick={() => navigate('/admin/analytics')}
                        />
                    </div>
                </div>

                {/* User Create Modal */}
                <UserCreateModal
                    visible={userCreateModalOpen}
                    onCancel={() => setUserCreateModalOpen(false)}
                    onCreated={() => setUserCreateModalOpen(false)}
                />

                {/* Welcome Panel */}
                <Card className="border-0 shadow-lg bg-white/20 backdrop-blur-md border border-white/30">
                    <div className="flex items-start gap-6">
                        <div className="flex-shrink-0 w-16 h-16 bg-blue-100/50 backdrop-blur-sm rounded-2xl flex items-center justify-center">
                            <RocketOutlined className="text-2xl text-blue-600" />
                        </div>
                        <div className="flex-1">
                            <Title level={3} className="!text-gray-900 !mb-3">Welcome to the Admin Panel</Title>
                            <Text className="text-gray-600 text-base leading-relaxed block mb-6">
                                Manage your learning platform with confidence. Monitor user engagement,
                                create compelling courses, and track success metrics with our intuitive dashboard.
                            </Text>
                            <Space wrap>
                                <Button
                                    type="primary"
                                    className="bg-gradient-to-r from-blue-600/90 to-indigo-600/90 hover:from-blue-700/90 hover:to-indigo-700/90 border-0 shadow-lg backdrop-blur-sm"
                                    icon={<BookOutlined />}
                                    onClick={() => navigate('/admin/courses')}
                                >
                                    View Courses
                                </Button>
                                <Button
                                    className="bg-white/30 backdrop-blur-md border border-white/30 hover:bg-white/40 text-gray-700"
                                    icon={<LineChartOutlined />}
                                    onClick={() => navigate('/admin/analytics')}
                                >
                                    View Reports
                                </Button>
                            </Space>
                        </div>
                    </div>
                </Card>

                {/* Recent Activity */}
                <div className="mt-8">
                    <div className="flex items-center gap-3 mb-6">
                        <div className="w-1 h-8 bg-gradient-to-b from-purple-600 to-violet-600 rounded-full"></div>
                        <Title level={2} className="!text-gray-900 !mb-0">Recent Activity</Title>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <Card className="border-0 shadow-lg bg-white/20 backdrop-blur-md border border-white/30">
                            <Title level={4} className="!text-gray-900 !mb-4">Latest Updates</Title>
                            <div className="space-y-3">
                                <div className="flex items-center gap-3 p-3 bg-white/20 rounded-lg">
                                    <div className="w-8 h-8 bg-green-100/50 rounded-full flex items-center justify-center">
                                        <UserOutlined className="text-green-600 text-sm" />
                                    </div>
                                    <div>
                                        <Text className="text-sm font-medium text-gray-900 block">New user registered</Text>
                                        <Text className="text-xs text-gray-600">2 minutes ago</Text>
                                    </div>
                                </div>
                                <div className="flex items-center gap-3 p-3 bg-white/20 rounded-lg">
                                    <div className="w-8 h-8 bg-blue-100/50 rounded-full flex items-center justify-center">
                                        <BookOutlined className="text-blue-600 text-sm" />
                                    </div>
                                    <div>
                                        <Text className="text-sm font-medium text-gray-900 block">Course \"React Basics\" updated</Text>
                                        <Text className="text-xs text-gray-600">1 hour ago</Text>
                                    </div>
                                </div>
                                <div className="flex items-center gap-3 p-3 bg-white/20 rounded-lg">
                                    <div className="w-8 h-8 bg-purple-100/50 rounded-full flex items-center justify-center">
                                        <BarChartOutlined className="text-purple-600 text-sm" />
                                    </div>
                                    <div>
                                        <Text className="text-sm font-medium text-gray-900 block">Training session completed</Text>
                                        <Text className="text-xs text-gray-600">3 hours ago</Text>
                                    </div>
                                </div>
                            </div>
                        </Card>

                        <Card className="border-0 shadow-lg bg-white/20 backdrop-blur-md border border-white/30">
                            <Title level={4} className="!text-gray-900 !mb-4">System Health</Title>
                            <div className="space-y-4">
                                <div className="flex items-center justify-between">
                                    <Text className="text-sm text-gray-700">Server Status</Text>
                                    <Badge status={systemHealth?.server?.status === 'online' ? 'success' : 'error'} text={systemHealth?.server?.status || 'Unknown'} />
                                </div>
                                <div className="flex items-center justify-between">
                                    <Text className="text-sm text-gray-700">Server Uptime</Text>
                                    <Text className="text-xs text-gray-600">{systemHealth?.server?.uptime || '-'}</Text>
                                </div>
                                <div className="flex items-center justify-between">
                                    <Text className="text-sm text-gray-700">Database</Text>
                                    <Badge status={systemHealth?.database?.status === 'connected' ? 'success' : 'error'} text={systemHealth?.database?.status || 'Unknown'} />
                                </div>
                                <div className="flex items-center justify-between">
                                    <Text className="text-sm text-gray-700">API Response Time</Text>
                                    <Text className="text-xs text-gray-600">{systemHealth?.api?.response_time || '-'}</Text>
                                </div>
                                <div className="flex items-center justify-between">
                                    <Text className="text-sm text-gray-700">Storage</Text>
                                    <Badge status={systemHealth?.storage?.used_percent < 80 ? 'success' : 'warning'} text={`${systemHealth?.storage?.used_percent || 0}% Used`} />
                                </div>
                            </div>
                        </Card>
                    </div>
                </div>
            </div>

            <style>{`
                .ant-card {
                    border-radius: 12px !important;
                }
                .ant-btn {
                    border-radius: 8px !important;
                }
                .ant-badge-status-dot {
                    width: 8px;
                    height: 8px;
                }
            `}</style>
        </div>
    );
}

export default AdminDashboard;