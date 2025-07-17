import React, { useEffect, useState } from "react";
import UserUpdateModal from "./UserUpdateModal";
import { Modal, Tabs, Table, Spin, Alert, Button, Space, Typography } from "antd";
import { UserOutlined, EditOutlined, DeleteOutlined, CloseOutlined } from "@ant-design/icons";
import { userApi, trainingSessionApi, registrationApi } from "../../../services/api";

const { Text } = Typography;

function UserDetailsModal({ open, user, onClose }) {
    // Import your actual modal components at the top of the file:
    // import UserUpdateModal from './UserUpdateModal';
    // import DeleteUserModal from './DeleteUserModal';
    const [loading, setLoading] = useState(false);
    const [sessions, setSessions] = useState([]);
    const [originalSessions, setOriginalSessions] = useState([]); // Store original for change tracking
    const [attendance, setAttendance] = useState([]);
    const [error, setError] = useState(null);
    const [saving, setSaving] = useState(false);

    // For edit/delete modals
    const [updateModalVisible, setUpdateModalVisible] = useState(false);
    const [deleteModalVisible, setDeleteModalVisible] = useState(false);
    const [deleting, setDeleting] = useState(false);

    useEffect(() => {
        if (!user || !open) return;
        setLoading(true);
        setError(null);
        // Fetch sessions enrolled using registrationApi.getRegistrationsByUser and attendance using trainingSessionApi
        Promise.all([
            registrationApi.getRegistrationsByUser(user.id || user._id),
            trainingSessionApi.getSessionsByCoordinator ? trainingSessionApi.getSessionsByCoordinator(user.id || user._id) : Promise.resolve({ data: [] })
        ])
            .then(([sessionsRes, attendanceRes]) => {
                const registrations = (sessionsRes.data?.registrations) || sessionsRes.registrations || [];
                const mappedSessions = registrations.map(reg => ({
                    name: reg.training_session?.skill_name,
                    date: reg.training_session?.date ? new Date(reg.training_session.date).toLocaleDateString() : '',
                    type: reg.training_session?.type || 'N/A',
                    status: reg.status,
                    id: reg.id,
                    _id: reg.id,
                    details: reg.training_session // pass the whole session for details
                }));
                setSessions(mappedSessions);
                setOriginalSessions(mappedSessions.map(s => ({ id: s.id, status: s.status })));
                setAttendance(attendanceRes.data || []);
            })
            .catch(err => {
                setError("Failed to load user details.");
            })
            .finally(() => setLoading(false));
    }, [user, open]);

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

    const sessionColumns = [
        {
            title: "Session Name",
            dataIndex: "name",
            key: "name",
            render: (text) => <Text className="font-medium text-gray-900">{text}</Text>
        },
        {
            title: "Date",
            dataIndex: "date",
            key: "date",
            render: (text) => <Text className="text-gray-600">{text}</Text>
        },
        {
            title: "Type",
            dataIndex: "type",
            key: "type",
            render: (type) => <Text className="text-gray-500 italic">{type}</Text>
        },
        {
            title: "Status",
            dataIndex: "status",
            key: "status",
            render: (status, record, idx) => (
                <select
                    className={`px-2 py-1 rounded-full text-xs font-medium border ${getStatusColor(status)} bg-white`}
                    value={status}
                    disabled={saving}
                    onChange={async e => {
                        const newStatus = e.target.value;
                        setSaving(true);
                        try {
                            // Update UI immediately
                            setSessions(prev => prev.map((s, i) => i === idx ? { ...s, status: newStatus } : s));
                            // Save to API
                            await registrationApi.updateRegistration(record.id, { status: newStatus });
                            setError(null);
                            // Optionally reload sessions from API for consistency
                            if (user) {
                                const sessionsRes = await registrationApi.getRegistrationsByUser(user.id || user._id);
                                const registrations = (sessionsRes.data?.registrations) || sessionsRes.registrations || [];
                                const mappedSessions = registrations.map(reg => ({
                                    name: reg.training_session?.skill_name,
                                    date: reg.training_session?.date ? new Date(reg.training_session.date).toLocaleDateString() : '',
                                    type: reg.training_session?.type || 'N/A',
                                    status: reg.status,
                                    id: reg.id,
                                    _id: reg.id,
                                    details: reg.training_session
                                }));
                                setSessions(mappedSessions);
                                setOriginalSessions(mappedSessions.map(s => ({ id: s.id, status: s.status })));
                            }
                        } catch (err) {
                            console.error('Update registration status error:', err);
                            let msg = 'Failed to update registration status.';
                            if (err?.response?.data?.message) {
                                msg += ' ' + err.response.data.message;
                            } else if (err?.message) {
                                msg += ' ' + err.message;
                            }
                            setError(msg);
                        }
                        setSaving(false);
                    }}
                >
                    <option value="confirmed">confirmed</option>
                    <option value="pending">pending</option>
                    <option value="cancelled">cancelled</option>
                </select>
            )
        },
        {
            title: "Options",
            key: "options",
            render: (_, record) => (
                <Button size="small" type="link" onClick={() => alert(`Session details: ${JSON.stringify(record.details, null, 2)}`)}>
                    Details
                </Button>
            )
        }
    ];

    const attendanceColumns = [
        {
            title: "Session",
            dataIndex: "session_name",
            key: "session_name",
            render: (text) => <Text className="font-medium text-gray-900">{text}</Text>
        },
        {
            title: "Date",
            dataIndex: "date",
            key: "date",
            render: (text) => <Text className="text-gray-600">{text}</Text>
        },
        {
            title: "Attendance",
            dataIndex: "attendance",
            key: "attendance",
            render: (attendance) => (
                <span className={`px-2 py-1 rounded-full text-xs font-medium border ${attendance === 'present' ? 'bg-green-100 text-green-800 border-green-200' : 'bg-red-100 text-red-800 border-red-200'}`}>
                    {attendance}
                </span>
            )
        },
    ];

    return (
        <Modal
            open={open}
            onCancel={onClose}
            footer={null}
            width={900}
            className="user-details-modal"
            title={null}
            closeIcon={<CloseOutlined className="close-x" />}
        >
            <div className="relative bg-gradient-to-br from-white/60 via-blue-100/40 to-indigo-100/30 backdrop-blur-md rounded-3xl border border-white/30 shadow-2xl">
                {loading ? (
                    <div className="flex justify-center items-center h-64">
                        <Spin size="large" />
                    </div>
                ) : error ? (
                    <div className="p-8">
                        <Alert type="error" message={error} className="bg-red-50/80 backdrop-blur-sm border-red-200/50" />
                    </div>
                ) : (
                    <>
                        {/* Header with avatar and name */}
                        <div className="relative p-8 pb-4">
                            <div className="flex items-start gap-6">
                                <div className="flex-shrink-0">
                                    <div className="w-24 h-24 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center shadow-lg ring-4 ring-white/20">
                                        <UserOutlined className="text-white text-4xl" />
                                    </div>
                                </div>
                                <div className="flex-1 min-w-0">
                                    <div className="text-3xl font-bold text-gray-900 mb-2">
                                        {user?.first_name} {user?.last_name}
                                    </div>
                                    <div className="text-lg text-gray-600 mb-1">{user?.email}</div>
                                    <div className="text-base text-gray-500 mb-4">{user?.phone || 'N/A'}</div>
                                    <div className="flex gap-3">
                                        <span className={`px-3 py-1 rounded-full text-sm font-medium border ${getRoleColor(user?.role)}`}>
                                            {user?.role}
                                        </span>
                                        <div className="flex items-center gap-2">
                                            <div className={`w-2 h-2 rounded-full ${user?.status === 'active' ? 'bg-green-500' : 'bg-gray-400'}`} />
                                            <span className={`px-2 py-1 rounded-full text-sm font-medium border ${getStatusColor(user?.status)}`}>
                                                {user?.status}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                                <div className="flex-shrink-0">
                                    <Space direction="vertical" size="small" className="w-full btn-container">
                                        <Button
                                            icon={<EditOutlined />}
                                            className="modern-btn btn-small"
                                            onClick={() => setUpdateModalVisible(true)}
                                        >
                                            Edit User
                                        </Button>
                                        <Button
                                            danger
                                            icon={<DeleteOutlined />}
                                            className="modern-btn danger btn-small"
                                            onClick={() => setDeleteModalVisible(true)}
                                        >
                                            Delete User
                                        </Button>
                                    </Space>
                                </div>
                            </div>
                        </div>

                        {/* Enhanced Details Section */}
                        <div className="px-8 pb-6">
                            <div className="bg-white/40 backdrop-blur-sm rounded-3xl shadow-sm p-6 border border-white/30">
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                    <div className="space-y-1">
                                        <Text className="text-xs text-gray-500 uppercase tracking-wider font-medium">Full Name</Text>
                                        <div className="text-lg font-semibold text-gray-900">
                                            {user?.first_name} {user?.last_name}
                                        </div>
                                    </div>
                                    <div className="space-y-1">
                                        <Text className="text-xs text-gray-500 uppercase tracking-wider font-medium">Email Address</Text>
                                        <div className="text-lg font-semibold text-gray-900 break-all">
                                            {user?.email}
                                        </div>
                                    </div>
                                    <div className="space-y-1">
                                        <Text className="text-xs text-gray-500 uppercase tracking-wider font-medium">Phone Number</Text>
                                        <div className="text-lg font-semibold text-gray-900">
                                            {user?.phone || <span className="text-gray-400 italic">Not provided</span>}
                                        </div>
                                    </div>
                                    <div className="space-y-1">
                                        <Text className="text-xs text-gray-500 uppercase tracking-wider font-medium">User Role</Text>
                                        <div>
                                            <span className={`inline-flex px-3 py-1 rounded-full text-sm font-medium border ${getRoleColor(user?.role)}`}>
                                                {user?.role}
                                            </span>
                                        </div>
                                    </div>
                                    <div className="space-y-1">
                                        <Text className="text-xs text-gray-500 uppercase tracking-wider font-medium">Account Status</Text>
                                        <div className="flex items-center gap-2">
                                            <div className={`w-2 h-2 rounded-full ${user?.status === 'active' ? 'bg-green-500' : 'bg-gray-400'}`} />
                                            <span className={`px-2 py-1 rounded-full text-sm font-medium border ${getStatusColor(user?.status)}`}>
                                                {user?.status}
                                            </span>
                                        </div>
                                    </div>
                                    <div className="space-y-1">
                                        <Text className="text-xs text-gray-500 uppercase tracking-wider font-medium">Last Active</Text>
                                        <div className="text-lg font-semibold text-gray-900">
                                            {user?.lastActive || <span className="text-gray-400 italic">Not available</span>}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Tabs Section */}
                        <div className="px-8 pb-8">
                            <Tabs
                                defaultActiveKey="sessions"
                                className="user-details-tabs"
                                items={[
                                    {
                                        key: "sessions",
                                        label: (
                                            <div className="flex items-center gap-2 px-2 py-1">
                                                <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                                                <span className="font-semibold text-blue-700">Sessions Enrolled</span>
                                                <div className="bg-blue-100 text-blue-800 px-2 py-0.5 rounded-full text-xs font-medium">
                                                    {sessions.length}
                                                </div>
                                            </div>
                                        ),
                                        children: (
                                            <div className="bg-white/40 backdrop-blur-sm rounded-3xl p-4 border border-white/30">
                                                <Table
                                                    dataSource={sessions}
                                                    columns={sessionColumns}
                                                    rowKey={record => record.id || record._id}
                                                    pagination={sessions.length > 5 ? { pageSize: 5, size: 'small' } : false}
                                                    size="middle"
                                                    className="custom-table"
                                                    rowClassName="hover:bg-white/30 transition-colors duration-200"
                                                />
                                                {/* Save button removed, auto-save on status change */}
                                            </div>
                                        ),
                                    },
                                    {
                                        key: "attendance",
                                        label: (
                                            <div className="flex items-center gap-2 px-2 py-1">
                                                <div className="w-2 h-2 bg-indigo-500 rounded-full"></div>
                                                <span className="font-semibold text-indigo-700">Attendance Records</span>
                                                <div className="bg-indigo-100 text-indigo-800 px-2 py-0.5 rounded-full text-xs font-medium">
                                                    {attendance.length}
                                                </div>
                                            </div>
                                        ),
                                        children: (
                                            <div className="bg-white/40 backdrop-blur-sm rounded-3xl p-4 border border-white/30">
                                                <Table
                                                    dataSource={attendance}
                                                    columns={attendanceColumns}
                                                    rowKey={record => record.id || record._id}
                                                    pagination={attendance.length > 5 ? { pageSize: 5, size: 'small' } : false}
                                                    size="middle"
                                                    className="custom-table"
                                                    rowClassName="hover:bg-white/30 transition-colors duration-200"
                                                />
                                            </div>
                                        ),
                                    },
                                ]}
                            />
                        </div>
                        {/* Edit Modal */}
                        {user && (
                            <UserUpdateModal
                                visible={updateModalVisible}
                                user={{ ...user }}
                                onCancel={() => setUpdateModalVisible(false)}
                                onUpdated={() => {
                                    setUpdateModalVisible(false);
                                    if (onClose) onClose();
                                }}
                            />
                        )}
                        {/* Delete Modal (inline) */}
                        {deleteModalVisible && (
                            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-30">
                                <div className="bg-white rounded-xl shadow-lg p-8 min-w-[400px]">
                                    <h2 className="text-xl font-bold mb-4">Delete User</h2>
                                    <p>Are you sure you want to delete this user?</p>
                                    <div className="flex gap-4 mt-6">
                                        <Button
                                            danger
                                            loading={deleting}
                                            onClick={async () => {
                                                setDeleting(true);
                                                try {
                                                    await userApi.deleteUser(user.id || user._id);
                                                    setDeleting(false);
                                                    setDeleteModalVisible(false);
                                                    onClose();
                                                } catch (err) {
                                                    setDeleting(false);
                                                    setError('Failed to delete user.');
                                                }
                                            }}
                                        >
                                            Delete
                                        </Button>
                                        <Button onClick={() => setDeleteModalVisible(false)}>Cancel</Button>
                                    </div>
                                </div>
                            </div>
                        )}
                    </>
                )}
            </div>

            {/* CSS Styles */}
            <style >{`
                .user-details-modal .ant-modal-content {
                    background: transparent;
                    box-shadow: none;
                    padding: 0;
                }
                
                .user-details-modal .ant-modal-header {
                    background: transparent;
                    border: none;
                    padding: 0;
                }
                
                .user-details-modal .ant-modal-body {
                    padding: 0;
                }
                
                .btn-container {
                    padding-top: 12px;
                    padding-right: 12px;
                }
                .close-x {
                    padding: 8px 10px 0 0;
                    font-size: 22px;
                    color: #6b7280;
                    border-radius: 50%;
                    transition: background 0.2s, color 0.2s;
                }
                .close-x:hover {
                    background: rgba(59,130,246,0.08);
                    color: #374151;
                }
                /* Modern Glassmorphism Buttons */
                .modern-btn {
                    background: linear-gradient(90deg, rgba(34,197,94,0.85) 0%, rgba(16,185,129,0.85) 100%);
                    color: #fff;
                    border: 1.5px solid rgba(255,255,255,0.25);
                    border-radius: 18px;
                    box-shadow: 0 4px 24px 0 rgba(34,197,94,0.12), 0 1.5px 6px 0 rgba(0,0,0,0.08);
                    backdrop-filter: blur(8px);
                    font-weight: 600;
                    font-size: 0.95rem;
                    transition: all 0.25s cubic-bezier(.4,0,.2,1);
                    padding: 0.5rem 0;
                    width: 120px;
                    min-width: 120px;
                    max-width: 120px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    gap: 0.5rem;
                }
                .modern-btn:hover {
                    background: linear-gradient(90deg, rgba(16,185,129,1) 0%, rgba(34,197,94,1) 100%);
                    box-shadow: 0 6px 24px 0 rgba(34,197,94,0.22), 0 2px 8px 0 rgba(0,0,0,0.14);
                    transform: scale(1.025);
                    border: 2px solid rgba(34,197,94,0.28);
                    filter: drop-shadow(0 0 6px rgba(34,197,94,0.18));
                }
                .modern-btn.danger {
                    background: linear-gradient(90deg, rgba(239,68,68,0.85) 0%, rgba(244,63,94,0.85) 100%);
                    box-shadow: 0 4px 24px 0 rgba(239,68,68,0.12), 0 1.5px 6px 0 rgba(0,0,0,0.08);
                    border: 1.5px solid rgba(255,255,255,0.25);
                }
                .modern-btn.danger:hover {
                    background: linear-gradient(90deg, rgba(244,63,94,1) 0%, rgba(239,68,68,1) 100%);
                    box-shadow: 0 6px 24px 0 rgba(239,68,68,0.22), 0 2px 8px 0 rgba(0,0,0,0.14);
                    transform: scale(1.025);
                    border: 2px solid rgba(239,68,68,0.28);
                    filter: drop-shadow(0 0 6px rgba(239,68,68,0.18));
                }
                .btn-small {
                    font-size: 0.95rem;
                    padding: 0.5rem 0;
                    width: 120px;
                    min-width: 120px;
                    max-width: 120px;
                }
                
                .user-details-tabs .ant-tabs-nav {
                    background: rgba(255, 255, 255, 0.3);
                    backdrop-filter: blur(10px);
                    border-radius: 24px;
                    padding: 8px;
                    margin-bottom: 16px;
                    border: 1px solid rgba(255, 255, 255, 0.2);
                }
                
                .user-details-tabs .ant-tabs-tab {
                    border: none;
                    background: transparent;
                    border-radius: 16px;
                    transition: all 0.3s ease;
                }
                
                .user-details-tabs .ant-tabs-tab:hover {
                    background: rgba(255, 255, 255, 0.4);
                }
                
                .user-details-tabs .ant-tabs-tab-active {
                    background: rgba(255, 255, 255, 0.6) !important;
                    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
                }
                
                .user-details-tabs .ant-tabs-ink-bar {
                    display: none !important;
                }
                .user-details-tabs .ant-tabs-nav::before {
                    display: none !important;
                    border: none !important;
                }
                
                .custom-table .ant-table {
                    background: transparent;
                }
                
                .custom-table .ant-table-thead > tr > th {
                    background: rgba(255, 255, 255, 0.4);
                    border: none;
                    color: #374151;
                    font-weight: 600;
                }
                
                .custom-table .ant-table-tbody > tr > td {
                    border: none;
                    background: transparent;
                }
                
                .custom-table .ant-table-tbody > tr:hover > td {
                    background: rgba(255, 255, 255, 0.3) !important;
                }
                
                .custom-table .ant-pagination {
                    margin-top: 16px;
                }
                
                .custom-table .ant-pagination .ant-pagination-item {
                    background: rgba(255, 255, 255, 0.6);
                    border: 1px solid rgba(255, 255, 255, 0.3);
                    backdrop-filter: blur(4px);
                }
                
                .custom-table .ant-pagination .ant-pagination-item-active {
                    background: rgba(59, 130, 246, 0.8);
                    border-color: rgba(59, 130, 246, 0.8);
                }
                
                .custom-table .ant-pagination .ant-pagination-item-active a {
                    color: white;
                }
            `}</style>
        </Modal>
    );
}

export default UserDetailsModal;