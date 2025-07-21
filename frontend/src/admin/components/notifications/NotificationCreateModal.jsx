

import React from 'react';
import { Modal, Form, Input, Select, Button, message, Spin } from 'antd';
import { BellOutlined, ExclamationCircleOutlined, CheckCircleOutlined, InfoCircleOutlined, WarningOutlined, EyeOutlined, ClockCircleOutlined } from '@ant-design/icons';
import { userApi } from '../../../services/api';


function NotificationCreateModal({ visible, onCreate, onCancel, loading }) {
    const [form] = Form.useForm();
    const [users, setUsers] = React.useState([]);
    const [usersLoading, setUsersLoading] = React.useState(false);

    React.useEffect(() => {
        if (visible) {
            setUsersLoading(true);
            userApi.getUsers()
                .then(res => {
                    setUsers(Array.isArray(res.data) ? res.data : []);
                })
                .catch(() => setUsers([]))
                .finally(() => setUsersLoading(false));
        }
    }, [visible]);

    const handleOk = () => {
        form.validateFields().then(values => {
            onCreate(values);
            form.resetFields();
        });
    };

    // Icon options (Ant Design icons)
    const iconOptions = [
        { label: <BellOutlined />, value: 'BellOutlined', color: '#2563eb' },
        { label: <ExclamationCircleOutlined />, value: 'ExclamationCircleOutlined', color: '#dc2626' },
        { label: <CheckCircleOutlined />, value: 'CheckCircleOutlined', color: '#16a34a' },
        { label: <InfoCircleOutlined />, value: 'InfoCircleOutlined', color: '#2563eb' },
        { label: <WarningOutlined />, value: 'WarningOutlined', color: '#f59e42' },
        { label: <EyeOutlined />, value: 'EyeOutlined', color: '#64748b' },
        { label: <ClockCircleOutlined />, value: 'ClockCircleOutlined', color: '#f59e42' },
    ];

    const [selectedIcon, setSelectedIcon] = React.useState(null);

    // Sync form icon value with selectedIcon
    React.useEffect(() => {
        if (visible) {
            setSelectedIcon(null);
            form.setFieldsValue({ icon: undefined });
        }
    }, [visible]);

    return (
        <Modal
            open={visible}
            title={<span className="font-bold text-lg text-blue-700">Send Notification</span>}
            onCancel={() => { form.resetFields(); onCancel(); }}
            onOk={handleOk}
            footer={[
                <Button key="back" onClick={() => { form.resetFields(); onCancel(); }}>
                    Cancel
                </Button>,
                <Button key="submit" type="primary" loading={loading} onClick={handleOk} className="bg-gradient-to-r from-blue-600 to-indigo-600 border-0">
                    Send
                </Button>
            ]}
            className="rounded-xl shadow-lg backdrop-blur-md"
        >
            <Form
                form={form}
                layout="vertical"
                name="notification_create_form"
                className="pt-2"
            >
                <Form.Item
                    name="user_id"
                    label={<span className="text-gray-700 font-medium">Recipient</span>}
                    rules={[{ required: true, message: 'Please select a recipient' }]}
                >
                    {usersLoading ? <Spin /> : (
                        <Select
                            showSearch
                            placeholder="Select user"
                            optionFilterProp="children"
                            allowClear
                        >
                            {users.map(user => (
                                <Select.Option key={user.id} value={user.id}>
                                    {user.first_name} {user.last_name} ({user.email})
                                </Select.Option>
                            ))}
                        </Select>
                    )}
                </Form.Item>
                <Form.Item
                    name="title"
                    label={<span className="text-gray-700 font-medium">Title</span>}
                    rules={[{ required: true, message: 'Please enter a title' }]}
                >
                    <Input placeholder="Enter notification title" />
                </Form.Item>
                <Form.Item
                    name="message"
                    label={<span className="text-gray-700 font-medium">Message</span>}
                    rules={[{ required: true, message: 'Please enter a message' }]}
                >
                    <Input.TextArea rows={4} placeholder="Enter notification message..." className="rounded-lg" />
                </Form.Item>
                <Form.Item
                    name="priority"
                    label={<span className="text-gray-700 font-medium">Priority</span>}
                    rules={[{ required: true, message: 'Please select a priority' }]}
                >
                    <Select placeholder="Select priority">
                        <Select.Option value="urgent">Urgent</Select.Option>
                        <Select.Option value="high">High</Select.Option>
                        <Select.Option value="normal">Normal</Select.Option>
                        <Select.Option value="low">Low</Select.Option>
                    </Select>
                </Form.Item>
                <Form.Item
                    name="type"
                    label={<span className="text-gray-700 font-medium">Type</span>}
                    rules={[{ required: true, message: 'Please select a type' }]}
                >
                    <Select placeholder="Select type">
                        <Select.Option value="deadline_approaching">Deadline Approaching</Select.Option>
                        <Select.Option value="course_update">Course Update</Select.Option>
                        <Select.Option value="system_alert">System Alert</Select.Option>
                        <Select.Option value="reminder">Reminder</Select.Option>
                        <Select.Option value="registration_confirmed">Registration Confirmed</Select.Option>
                        <Select.Option value="course_reminder">Course Reminder</Select.Option>
                        <Select.Option value="new_course">New Course</Select.Option>
                        <Select.Option value="feedback_request">Feedback Request</Select.Option>
                        <Select.Option value="certificate_ready">Certificate Ready</Select.Option>
                        <Select.Option value="session_cancelled">Session Cancelled</Select.Option>
                        <Select.Option value="session_update">Session Update</Select.Option>
                    </Select>
                </Form.Item>
                <Form.Item
                    name="icon"
                    label={<span className="text-gray-700 font-medium">Icon</span>}
                    rules={[{ required: false }]}
                >
                    <div className="grid grid-cols-4 gap-3">
                        {iconOptions.map(opt => (
                            <button
                                type="button"
                                key={opt.value}
                                className={`flex flex-col items-center justify-center border rounded-lg p-2 transition-all duration-150 focus:outline-none ${selectedIcon === opt.value ? 'border-blue-600 bg-blue-50' : 'border-gray-200 bg-white hover:bg-gray-50'}`}
                                style={{ color: opt.color, fontSize: 24 }}
                                onClick={() => {
                                    setSelectedIcon(opt.value);
                                    form.setFieldsValue({ icon: opt.value });
                                }}
                                aria-label={opt.value}
                            >
                                {opt.label}
                            </button>
                        ))}
                    </div>
                </Form.Item>
                <Form.Item
                    name="action_url"
                    label={<span className="text-gray-700 font-medium">Action URL</span>}
                    rules={[{ required: false }]}
                >
                    <Input placeholder="e.g. /courses/1/sessions/1" />
                </Form.Item>
            </Form>
        </Modal>
    );
}

export default NotificationCreateModal;
