import React, { useEffect } from "react";
import { Modal, Form, Input, Select, Button, Upload } from "antd";
import { UserOutlined, MailOutlined, PhoneOutlined, IdcardOutlined, UploadOutlined } from "@ant-design/icons";

const { Option } = Select;

const roles = [
    { value: "admin", label: "Administrator" },
    { value: "coordinator", label: "Coordinator" },
    { value: "trainer", label: "Trainer" },
    { value: "trainee", label: "Trainee" }
];
const statuses = [
    { value: "active", label: "Active" },
    { value: "banned", label: "Banned" },
    { value: "inactive", label: "Inactive" }
];

function UserUpdateModal({ visible, user, onUpdate, onCancel, loading }) {
    const [form] = Form.useForm();

    useEffect(() => {
        if (visible && user) {
            // Split name into first_name and last_name if needed
            const { name, ...rest } = user;
            let first_name = user.first_name;
            let last_name = user.last_name;
            if (!first_name && !last_name && name) {
                const parts = name.split(' ');
                first_name = parts[0] || '';
                last_name = parts.slice(1).join(' ') || '';
            }
            form.setFieldsValue({ ...rest, first_name, last_name });
        }
    }, [visible, user]);

    const handleCancel = () => {
        onCancel();
    };

    const handleOk = (values) => {
        onUpdate({ ...user, ...values });
        // Do not reset fields here; reset only in useEffect when modal is hidden
    };

    return (
        <Modal
            open={visible}
            onCancel={handleCancel}
            afterClose={() => form.resetFields()}
            footer={null}
        >
            <Form
                form={form}
                layout="vertical"
                onFinish={handleOk}
                autoComplete="off"
            >
                <Form.Item
                    name="first_name"
                    label="First Name"
                    rules={[{ required: true, message: "Please enter the user's first name" }]}
                >
                    <Input id="user-update-first-name" prefix={<UserOutlined />} placeholder="First Name" size="large" className="rounded-lg" autoFocus />
                </Form.Item>
                <Form.Item
                    name="last_name"
                    label="Last Name"
                    rules={[{ required: true, message: "Please enter the user's last name" }]}
                >
                    <Input id="user-update-last-name" prefix={<UserOutlined />} placeholder="Last Name" size="large" className="rounded-lg" />
                </Form.Item>
                <Form.Item
                    name="email"
                    label="Email"
                    rules={[{ required: true, type: "email", message: "Please enter a valid email" }]}
                >
                    <Input id="user-update-email" prefix={<MailOutlined />} placeholder="Email" size="large" className="rounded-lg" />
                </Form.Item>
                <Form.Item
                    name="phone"
                    label="Phone"
                    rules={[{ required: false, pattern: /^\+?[0-9\s-]{7,20}$/, message: "Please enter a valid phone number" }]}
                >
                    <Input id="user-update-phone" prefix={<PhoneOutlined />} placeholder="Phone" size="large" className="rounded-lg" />
                </Form.Item>
                <Form.Item
                    name="role"
                    label="Role"
                    rules={[{ required: true, message: "Please select a role" }]}
                >
                    <Select id="user-update-role" placeholder="Select role" size="large" className="rounded-lg">
                        {roles.map(role => (
                            <Select.Option key={role.value} value={role.value}>{role.label}</Select.Option>
                        ))}
                    </Select>
                </Form.Item>
                <Form.Item
                    name="status"
                    label="Status"
                    rules={[{ required: true, message: "Please select a status" }]}
                >
                    <Select id="user-update-status" placeholder="Select status" size="large" className="rounded-lg">
                        {statuses.map(status => (
                            <Select.Option key={status.value} value={status.value}>{status.label}</Select.Option>
                        ))}
                    </Select>
                </Form.Item>
                <Form.Item
                    name="password"
                    label="Password"
                    rules={[{ required: false, min: 6, message: "Password must be at least 6 characters" }]}
                >
                    <Input.Password id="user-update-password" prefix={<IdcardOutlined />} placeholder="Password" size="large" className="rounded-lg" autoComplete="new-password" />
                </Form.Item>
                <div className="flex justify-end gap-2 mt-4">
                    <Button onClick={handleCancel} className="rounded-lg" size="large">
                        Cancel
                    </Button>
                    <Button type="primary" htmlType="submit" loading={loading} className="bg-gradient-to-r from-blue-600 to-indigo-600 rounded-lg" size="large">
                        Update
                    </Button>
                </div>
            </Form>
        </Modal>
    );
}

export default UserUpdateModal;
