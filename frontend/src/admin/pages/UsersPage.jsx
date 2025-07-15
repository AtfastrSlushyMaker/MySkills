import React, { useState, useEffect } from "react";

import { Table, Button, Input, Space, Tag, Avatar, Typography, Card, Badge } from "antd";
import { SearchOutlined, PlusOutlined, EditOutlined, DeleteOutlined, EyeOutlined, UserOutlined } from "@ant-design/icons";
import { userApi } from '../../services/api';


const { Title, Text } = Typography;



const fetchUsers = async () => {
    try {
        const response = await userApi.getUsers();
        return response.data;
    } catch (error) {
        console.error("Failed to fetch users:", error);
        return [];
    }
};



function UsersPage({ theme = 'light' }) {
    const [data, setData] = useState([]);
    const [search, setSearch] = useState("");
    const [loading, setLoading] = useState(false);

    React.useEffect(() => {
        const loadData = async () => {
            setLoading(true);
            const users = await fetchUsers();
            // Ensure each user has a unique key prop for Ant Design Table
            const usersWithKey = users.map((user, idx) => ({
                ...user,
                key: user.id || user._id || idx // Prefer id/_id, fallback to index
            }));
            setData(usersWithKey);
            setLoading(false);
        };
        loadData();
    }, []);


    const getRoleColor = (role) => {
        switch (role) {
            case 'Admin': return 'bg-red-100 text-red-800 border-red-200';
            case 'Moderator': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
            case 'User': return 'bg-blue-100 text-blue-800 border-blue-200';
            default: return 'bg-gray-100 text-gray-800 border-gray-200';
        }
    };

    const getStatusColor = (status) => {
        return status === 'active' ? 'bg-green-100 text-green-800 border-green-200' : 'bg-gray-100 text-gray-600 border-gray-200';
    };

    const columns = [
        {
            title: 'User',
            dataIndex: 'name',
            key: 'name',
            render: (text, record) => (
                <div className="flex items-center gap-3">
                    <Avatar
                        size={40}
                        icon={<UserOutlined />}
                        className="bg-gradient-to-br from-blue-500 to-purple-600 flex-shrink-0"
                    />
                    <div className="min-w-0">
                        <div className="font-semibold text-gray-900 truncate">{text}</div>
                        <div className="text-sm text-gray-500 truncate">{record.email}</div>
                    </div>
                </div>
            ),
        },
        {
            title: 'Role',
            dataIndex: 'role',
            key: 'role',
            render: (role) => (
                <span className={`px-3 py-1 rounded-full text-xs font-medium border ${getRoleColor(role)}`}>
                    {role}
                </span>
            ),
        },
        {
            title: 'Status',
            dataIndex: 'status',
            key: 'status',
            render: (status) => (
                <div className="flex items-center gap-2">
                    <div className={`w-2 h-2 rounded-full ${status === 'active' ? 'bg-green-500' : 'bg-gray-400'}`} />
                    <span className={`px-2 py-1 rounded-full text-xs font-medium border ${getStatusColor(status)}`}>
                        {status}
                    </span>
                </div>
            ),
        },
        {
            title: 'Last Active',
            dataIndex: 'lastActive',
            key: 'lastActive',
            render: (text) => (
                <Text className="text-sm text-gray-600">{text}</Text>
            ),
        },
        {
            title: 'Actions',
            key: 'actions',
            render: (_, record) => (
                <Space size="small">
                    <Button
                        type="text"
                        icon={<EyeOutlined />}
                        className="hover:bg-blue-50 hover:text-blue-600 border-0 text-gray-600"
                        size="small"
                    />
                    <Button
                        type="text"
                        icon={<EditOutlined />}
                        className="hover:bg-green-50 hover:text-green-600 border-0 text-gray-600"
                        size="small"
                    />
                    <Button
                        type="text"
                        icon={<DeleteOutlined />}
                        className="hover:bg-red-50 hover:text-red-600 border-0 text-gray-600"
                        size="small"
                    />
                </Space>
            ),
        },
    ];

    const filteredData = data.filter(user => {
        const name = user.name ? user.name.toLowerCase() : "";
        const email = user.email ? user.email.toLowerCase() : "";
        const role = user.role ? user.role.toLowerCase() : "";
        const searchTerm = search.toLowerCase();
        return name.includes(searchTerm) || email.includes(searchTerm) || role.includes(searchTerm);
    });

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
                                Users Management
                            </Title>
                            <Text className="text-gray-600 text-base">
                                Manage your team members and their permissions
                            </Text>
                        </div>
                        <Badge count={data.length} showZero color="#3b82f6" className="mr-4">
                            <div className="bg-white/30 backdrop-blur-md px-4 py-2 rounded-lg shadow-sm border border-white/20">
                                <Text className="text-sm font-medium text-gray-700">Total Users</Text>
                            </div>
                        </Badge>
                    </div>
                </div>

                {/* Stats Cards */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
                    <Card className="border-0 shadow-lg bg-white/20 backdrop-blur-md border border-white/30">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-blue-100/50 backdrop-blur-sm rounded-lg flex items-center justify-center">
                                <UserOutlined className="text-blue-600" />
                            </div>
                            <div>
                                <Text className="text-sm text-gray-600">Total Users</Text>
                                <div className="text-2xl font-bold text-gray-900">{data.length}</div>
                            </div>
                        </div>
                    </Card>
                    <Card className="border-0 shadow-lg bg-white/20 backdrop-blur-md border border-white/30">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-green-100/50 backdrop-blur-sm rounded-lg flex items-center justify-center">
                                <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                            </div>
                            <div>
                                <Text className="text-sm text-gray-600">Active</Text>
                                <div className="text-2xl font-bold text-gray-900">
                                    {data.filter(u => u.status === 'active').length}
                                </div>
                            </div>
                        </div>
                    </Card>
                    <Card className="border-0 shadow-lg bg-white/20 backdrop-blur-md border border-white/30">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-red-100/50 backdrop-blur-sm rounded-lg flex items-center justify-center">
                                <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                            </div>
                            <div>
                                <Text className="text-sm text-gray-600">Admins</Text>
                                <div className="text-2xl font-bold text-gray-900">
                                    {data.filter(u => u.role === 'Admin').length}
                                </div>
                            </div>
                        </div>
                    </Card>
                    <Card className="border-0 shadow-lg bg-white/20 backdrop-blur-md border border-white/30">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-yellow-100/50 backdrop-blur-sm rounded-lg flex items-center justify-center">
                                <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                            </div>
                            <div>
                                <Text className="text-sm text-gray-600">Moderators</Text>
                                <div className="text-2xl font-bold text-gray-900">
                                    {data.filter(u => u.role === 'Moderator').length}
                                </div>
                            </div>
                        </div>
                    </Card>
                </div>

                {/* Main Content */}
                <Card className="border-0 shadow-lg bg-white/20 backdrop-blur-md border border-white/30">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
                        <Input
                            placeholder="Search users by name, email, or role..."
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
                        >
                            Add User
                        </Button>
                    </div>

                    <Table
                        dataSource={filteredData}
                        columns={columns}
                        loading={loading}
                        pagination={{
                            pageSize: 10,
                            showSizeChanger: true,
                            showQuickJumper: true,
                            showTotal: (total, range) =>
                                `${range[0]}-${range[1]} of ${total} users`,
                            className: "!mt-6"
                        }}
                        className="overflow-hidden bg-white/30 backdrop-blur-sm"
                        rowClassName="hover:bg-white/20 transition-colors duration-200"
                        scroll={{ x: 800 }}
                    />
                </Card>
            </div>

            <style>{`
                .ant-table-thead > tr > th {
                    background: transparent !important;
                    border-bottom: 1px solid #e5e7eb !important;
                    color: #374151 !important;
                    font-weight: 600 !important;
                }
                .ant-table-tbody > tr > td {
                    border-bottom: 1px solid #f3f4f6 !important;
                }
                .ant-table-tbody > tr:last-child > td {
                    border-bottom: none !important;
                }
                .ant-pagination-item-active {
                    background: linear-gradient(45deg, #3b82f6, #6366f1) !important;
                    border-color: #3b82f6 !important;
                }
                .ant-pagination-item-active a {
                    color: white !important;
                }
                .ant-input-affix-wrapper {
                    border-radius: 8px !important;
                }
                .ant-btn {
                    border-radius: 8px !important;
                }
                .ant-card {
                    border-radius: 12px !important;
                }
                .ant-table {
                    border-radius: 8px !important;
                }
            `}</style>
        </div>
    );
}

export default UsersPage;