import React, { useEffect, useState } from 'react';
import { Card, Button, message, Table, Input, Tag, Space, Typography, Badge } from 'antd';
import { SearchOutlined, PlusOutlined, SolutionOutlined, CheckCircleOutlined, ClockCircleOutlined, CloseCircleOutlined, EyeOutlined, EditOutlined, DeleteOutlined, UserOutlined, BookOutlined } from '@ant-design/icons';
import RegistrationCreateModal from '../components/registrations/RegistrationCreateModal';
import RegistrationEditModal from '../components/registrations/RegistrationEditModal';
import DeleteConfirmationModal from '../components/DeleteConfirmationModal';
import RegistrationDetailsModal from '../components/registrations/RegistrationDetailsModal';
import { registrationApi } from '../../services/api';

const { Title, Text } = Typography;

function RegistrationsPage() {
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(false);
    const [modalOpen, setModalOpen] = useState(false);
    const [modalLoading, setModalLoading] = useState(false);
    const [editModalOpen, setEditModalOpen] = useState(false);
    const [editLoading, setEditLoading] = useState(false);
    const [editingRegistration, setEditingRegistration] = useState(null);
    const [deleteModalOpen, setDeleteModalOpen] = useState(false);
    const [deleteLoading, setDeleteLoading] = useState(false);
    const [deletingRegistration, setDeletingRegistration] = useState(null);
    const [search, setSearch] = useState("");
    const [stats, setStats] = useState({ total: 0, confirmed: 0, pending: 0, rejected: 0 });
    const [pagination, setPagination] = useState({
        current: 1,
        pageSize: 10,
    });
    const [detailsModalOpen, setDetailsModalOpen] = useState(false);
    const [selectedRegistration, setSelectedRegistration] = useState(null);

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        setLoading(true);
        try {
            const res = await registrationApi.getGlobalRegistrationStats?.();
            if (res?.data?.stats) {
                setStats({
                    total: res.data.stats.total || 0,
                    confirmed: res.data.stats.confirmed || 0,
                    pending: res.data.stats.pending || 0,
                    rejected: res.data.stats.cancelled || 0,
                });
            }
        } catch { }
        try {
            const res = await registrationApi.getAllRegistrations?.();
            setData(Array.isArray(res?.data) ? res.data : []);
        } catch {
            setData([]);
        }
        setLoading(false);
    };

    const handleCreate = async (values) => {
        setModalLoading(true);
        try {
            await registrationApi.createRegistration(values);
            message.success('Registration created successfully!');
            setModalOpen(false);
            fetchData();
        } catch (err) {
            message.error('Failed to create registration.');
        } finally {
            setModalLoading(false);
        }
    };

    const handleDelete = async () => {
        if (!deletingRegistration) return;
        setDeleteLoading(true);
        try {
            await registrationApi.deleteRegistration(deletingRegistration.id);
            message.success('Registration deleted successfully!');
            setDeleteModalOpen(false);
            setDeletingRegistration(null);
            fetchData();
        } catch (err) {
            message.error('Failed to delete registration.');
        } finally {
            setDeleteLoading(false);
        }
    };

    const handleUpdate = async (values) => {
        if (!editingRegistration) return;
        setEditLoading(true);
        try {
            await registrationApi.updateRegistration(editingRegistration.id, values);
            message.success('Registration updated successfully!');
            setEditModalOpen(false);
            setEditingRegistration(null);
            fetchData();
        } catch (err) {
            message.error('Failed to update registration.');
        } finally {
            setEditLoading(false);
        }
    };

    const columns = [
        {
            title: 'User',
            dataIndex: 'user',
            key: 'user',
            render: (user) => user ? (
                <div className="flex items-center gap-3">
                    {user.profile_picture ? (
                        <img
                            src={user.profile_picture}
                            alt="Profile"
                            className="w-10 h-10 rounded-full object-cover flex-shrink-0 border border-white/40 shadow"
                        />
                    ) : (
                        <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center flex-shrink-0">
                            <UserOutlined className="text-white text-sm" />
                        </div>
                    )}
                    <div className="min-w-0">
                        <div className="font-semibold text-gray-900 truncate">
                            {user.first_name} {user.last_name}
                        </div>
                        <div className="text-sm text-gray-500 truncate">{user.email}</div>
                    </div>
                </div>
            ) : <span className="text-gray-400">N/A</span>
        },
        {
            title: 'Session',
            dataIndex: 'training_session',
            key: 'training_session',
            render: (session) => session ? (
                <div className="flex items-center gap-3">
                    <div className="min-w-0">
                        <div className="font-semibold text-gray-900 truncate">{session.skill_name}</div>
                        <div className="text-sm text-gray-500 truncate">
                            {session.date?.slice(0, 10)}{session.location ? ` • ${session.location}` : ''}
                        </div>
                    </div>
                </div>
            ) : <span className="text-gray-400">N/A</span>
        },
        {
            title: 'Status',
            dataIndex: 'status',
            key: 'status',
            render: (status) => {
                let color = 'default', icon = <ClockCircleOutlined />, dotColor = 'bg-gray-400';
                if (status === 'confirmed') {
                    color = 'green';
                    icon = <CheckCircleOutlined />;
                    dotColor = 'bg-green-500';
                }
                else if (status === 'pending') {
                    color = 'orange';
                    icon = <ClockCircleOutlined />;
                    dotColor = 'bg-yellow-400';
                }
                else if (status === 'rejected' || status === 'cancelled') {
                    color = 'red';
                    icon = <CloseCircleOutlined />;
                    dotColor = 'bg-red-500';
                }

                const getStatusColor = (status) => {
                    switch (status?.toLowerCase()) {
                        case 'confirmed':
                            return 'bg-green-100 text-green-800 border-green-200';
                        case 'pending':
                            return 'bg-yellow-100 text-yellow-800 border-yellow-200';
                        case 'rejected':
                        case 'cancelled':
                            return 'bg-red-100 text-red-800 border-red-200';
                        default:
                            return 'bg-gray-100 text-gray-800 border-gray-200';
                    }
                };

                return (
                    <div className="flex items-center gap-2">
                        <div className={`w-2 h-2 rounded-full ${dotColor}`} />
                        <span className={`px-2 py-1 rounded-full text-xs font-medium border capitalize ${getStatusColor(status)}`}>
                            {status}
                        </span>
                    </div>
                );
            }
        },
        {
            title: 'Registered At',
            dataIndex: 'registered_at',
            key: 'registered_at',
            render: (date) => date ? (
                <Text className="text-sm text-gray-600">{new Date(date).toLocaleString()}</Text>
            ) : <span className="text-gray-400">-</span>
        },
        {
            title: 'Created',
            dataIndex: 'created_at',
            key: 'created_at',
            render: (date) => date ? (
                <Text className="text-sm text-gray-600">{new Date(date).toLocaleString()}</Text>
            ) : <span className="text-gray-400">-</span>
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
                        onClick={() => {
                            setSelectedRegistration(record);
                            setDetailsModalOpen(true);
                        }}
                    />
                    <Button type="text" icon={<EditOutlined />} className="hover:bg-green-50 hover:text-green-600 border-0 text-gray-600" size="small" onClick={() => { setEditingRegistration(record); setEditModalOpen(true); }} />
                    <Button type="text" icon={<DeleteOutlined />} className="hover:bg-red-50 hover:text-red-600 border-0 text-gray-600" size="small" onClick={() => { setDeletingRegistration(record); setDeleteModalOpen(true); }} />
                </Space>
            )
        }
    ];

    const filteredData = data.filter(reg => {
        const searchTerm = search.toLowerCase();
        const fields = [
            reg.user ? `${reg.user.first_name} ${reg.user.last_name} ${reg.user.email}` : '',
            reg.training_session ? `${reg.training_session.skill_name} ${reg.training_session.date} ${reg.training_session.location}` : '',
            reg.status,
            reg.registered_at,
            reg.created_at
        ];
        return fields.some(f => (f || '').toLowerCase().includes(searchTerm));
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
                                <SolutionOutlined className="mr-2 align-middle" />
                                Registrations Management
                            </Title>
                            <Text className="text-gray-600 text-base">
                                Manage all user registrations for training sessions
                            </Text>
                        </div>
                        <Badge count={data.length} showZero color="#3b82f6" className="mr-4">
                            <div className="bg-white/30 backdrop-blur-md px-4 py-2 rounded-lg shadow-sm border border-white/20">
                                <Text className="text-sm font-medium text-gray-700">Total Registrations</Text>
                            </div>
                        </Badge>
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
                                <SolutionOutlined className="text-blue-600 text-2xl" />
                            </div>
                            <div>
                                <Text className="text-sm text-gray-600">Total</Text>
                                <div className="text-2xl font-bold text-gray-900">{stats.total}</div>
                            </div>
                        </div>
                    </Card>
                    <Card
                        className="flex-1 max-w-[220px] min-w-[180px] border-0 shadow-lg bg-white/20 backdrop-blur-md border border-white/30 flex flex-col justify-center items-stretch transition-transform duration-200 hover:scale-[1.04] hover:shadow-2xl hover:bg-white/40"
                        styles={{ body: { padding: '20px 24px' } }}
                    >
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-green-100/50 backdrop-blur-sm rounded-lg flex items-center justify-center">
                                <CheckCircleOutlined className="text-green-600 text-2xl" />
                            </div>
                            <div>
                                <Text className="text-sm text-gray-600">Confirmed</Text>
                                <div className="text-2xl font-bold text-gray-900">{stats.confirmed}</div>
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
                                <Text className="text-sm text-gray-600">Pending</Text>
                                <div className="text-2xl font-bold text-gray-900">{stats.pending}</div>
                            </div>
                        </div>
                    </Card>
                    <Card
                        className="flex-1 max-w-[220px] min-w-[180px] border-0 shadow-lg bg-white/20 backdrop-blur-md border border-white/30 flex flex-col justify-center items-stretch transition-transform duration-200 hover:scale-[1.04] hover:shadow-2xl hover:bg-white/40"
                        styles={{ body: { padding: '20px 24px' } }}
                    >
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-red-100/50 backdrop-blur-sm rounded-lg flex items-center justify-center">
                                <CloseCircleOutlined className="text-red-600 text-2xl" />
                            </div>
                            <div>
                                <Text className="text-sm text-gray-600">Rejected</Text>
                                <div className="text-2xl font-bold text-gray-900">{stats.rejected}</div>
                            </div>
                        </div>
                    </Card>
                </div>

                {/* Main Content */}
                <Card className="border-0 shadow-lg bg-white/20 backdrop-blur-md border border-white/30">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
                        <Input
                            placeholder="Search registrations by user, session, or status..."
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
                            onClick={() => setModalOpen(true)}
                        >
                            Add Registration
                        </Button>
                    </div>

                    <Table
                        dataSource={filteredData.map((r, i) => ({ ...r, key: r.id || i }))}
                        columns={columns}
                        loading={loading}
                        pagination={{
                            current: pagination.current,
                            pageSize: pagination.pageSize,
                            showSizeChanger: true,
                            showQuickJumper: true,
                            pageSizeOptions: ['10', '20', '50', '100'],
                            showTotal: (total, range) => `${range[0]}-${range[1]} of ${total} registrations`,
                            onChange: (page, pageSize) => setPagination({ current: page, pageSize })
                        }}
                        className="overflow-hidden bg-white/30 backdrop-blur-sm !mt-6"
                        rowClassName="hover:bg-white/20 transition-colors duration-200"
                        scroll={{ x: 800 }}
                    />
                </Card>

                <RegistrationCreateModal
                    visible={modalOpen}
                    onCreate={handleCreate}
                    onCancel={() => setModalOpen(false)}
                    loading={modalLoading}
                />
                <RegistrationEditModal
                    visible={editModalOpen}
                    onUpdate={handleUpdate}
                    onCancel={() => { setEditModalOpen(false); setEditingRegistration(null); }}
                    loading={editLoading}
                    registration={editingRegistration}
                />
                <DeleteConfirmationModal
                    visible={deleteModalOpen}
                    loading={deleteLoading}
                    onConfirm={handleDelete}
                    onCancel={() => { setDeleteModalOpen(false); setDeletingRegistration(null); }}
                    itemName="registration"
                    message={"Are you sure you want to delete this registration? This action cannot be undone."}
                />

                <RegistrationDetailsModal
                    visible={detailsModalOpen}
                    registration={selectedRegistration}
                    onCancel={() => {
                        setDetailsModalOpen(false);
                        setSelectedRegistration(null);
                    }}
                />
            </div>

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

export default RegistrationsPage;