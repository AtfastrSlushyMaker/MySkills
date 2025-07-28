import React from "react";
import { Modal, Descriptions, Tag, Avatar, Button, Space } from "antd";
import { UserOutlined, CheckCircleOutlined, CloseCircleOutlined, ClockCircleOutlined } from "@ant-design/icons";

function getStatusColor(status) {
    switch ((status || '').toLowerCase()) {
        case 'confirmed':
            return 'green';
        case 'pending':
            return 'orange';
        case 'rejected':
        case 'cancelled':
            return 'red';
        default:
            return 'default';
    }
}

function getStatusIcon(status) {
    switch ((status || '').toLowerCase()) {
        case 'confirmed':
            return <CheckCircleOutlined />;
        case 'pending':
            return <ClockCircleOutlined />;
        case 'rejected':
        case 'cancelled':
            return <CloseCircleOutlined />;
        default:
            return <ClockCircleOutlined />;
    }
}

const RegistrationDetailsModal = ({ visible, registration, onCancel }) => {
    if (!registration) return null;
    const user = registration.user || {};
    const session = registration.training_session || {};
    return (
        <Modal
            open={visible}
            onCancel={onCancel}
            footer={null}
            title="Registration Details"
            width={600}
            centered
        >
            <Descriptions bordered column={1} size="middle">
                <Descriptions.Item label="User">
                    <Space>
                        {user.profile_picture ? (
                            <Avatar src={user.profile_picture} size={48} />
                        ) : (
                            <Avatar icon={<UserOutlined />} size={48} />
                        )}
                        <div>
                            <div className="font-semibold text-gray-900">
                                {user.first_name} {user.last_name}
                            </div>
                            <div className="text-gray-500 text-sm">{user.email}</div>
                            <div className="text-gray-400 text-xs">{user.role}</div>
                        </div>
                    </Space>
                </Descriptions.Item>
                <Descriptions.Item label="Session">
                    <div>
                        <div className="font-semibold text-gray-900">{session.skill_name}</div>
                        <div className="text-gray-500 text-sm">{session.date?.slice(0, 10)}{session.location ? ` • ${session.location}` : ''}</div>
                    </div>
                </Descriptions.Item>
                <Descriptions.Item label="Status">
                    <Tag color={getStatusColor(registration.status)} icon={getStatusIcon(registration.status)}>
                        {registration.status}
                    </Tag>
                </Descriptions.Item>
                <Descriptions.Item label="Registered At">
                    {registration.registered_at ? new Date(registration.registered_at).toLocaleString() : '-'}
                </Descriptions.Item>
                <Descriptions.Item label="Created">
                    {registration.created_at ? new Date(registration.created_at).toLocaleString() : '-'}
                </Descriptions.Item>
            </Descriptions>
            <div className="flex justify-end mt-6">
                <Button onClick={onCancel} type="primary">
                    Close
                </Button>
            </div>
        </Modal>
    );
};

export default RegistrationDetailsModal;
