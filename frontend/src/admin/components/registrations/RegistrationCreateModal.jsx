import React from "react";
import { Modal, Form, Input, Select, Button } from "antd";
import { SolutionOutlined, UserOutlined, BookOutlined } from "@ant-design/icons";

import '../../styles/RegistrationCreateModal.css';
import { registrationApi, userApi, trainingSessionApi } from '../../../services/api';

const { Option } = Select;

function RegistrationCreateModal({ visible, onCreate, onCancel, loading }) {
    const [form] = Form.useForm();
    const [users, setUsers] = React.useState([]);
    const [sessions, setSessions] = React.useState([]);

    React.useEffect(() => {
        userApi.getUsers().then(res => setUsers(res.data || []));
        trainingSessionApi.getAllSessions().then(res => setSessions(res.data || []));
    }, []);

    const handleCancel = () => {
        onCancel();
    };


    const handleOk = (values) => {
        const payload = {
            user_id: values.user_id,
            training_session_id: values.training_session_id,
            status: values.status,
            registered_at: new Date().toISOString(),
        };
        onCreate(payload);
    };

    return (
        <Modal
            open={visible}
            onCancel={handleCancel}
            afterClose={() => form.resetFields()}
            footer={null}
            className="glass-modal"
            title={
                <div className="flex items-center gap-3 text-xl font-bold text-gray-800">
                    <SolutionOutlined className="text-blue-600" />
                    <span>Add New Registration</span>
                </div>
            }
        >
            <Form
                form={form}
                layout="vertical"
                onFinish={handleOk}
                autoComplete="off"
            >
                <Form.Item
                    name="user_id"
                    label="User"
                    rules={[{ required: true, message: "Please select a user" }]}
                >
                    <Select
                        showSearch
                        placeholder="Select user"
                        optionFilterProp="children"
                        size="large"
                        className="rounded-lg"
                        filterOption={(input, option) =>
                            option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                        }
                    >
                        {users.map(user => (
                            <Option key={user.id} value={user.id}>
                                <UserOutlined className="mr-2" />
                                {user.first_name} {user.last_name} ({user.email})
                            </Option>
                        ))}
                    </Select>
                </Form.Item>
                <Form.Item
                    name="training_session_id"
                    label="Session"
                    rules={[{ required: true, message: "Please select a session" }]}
                >
                    <Select
                        showSearch
                        placeholder="Select session"
                        optionFilterProp="children"
                        size="large"
                        className="rounded-lg"
                        filterOption={(input, option) =>
                            option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                        }
                    >
                        {sessions.map(session => (
                            <Option key={session.id} value={session.id}>
                                <BookOutlined className="mr-2" />
                                {session.skill_name} ({session.date?.slice(0, 10)}{session.location ? ` • ${session.location}` : ''})
                            </Option>
                        ))}
                    </Select>
                </Form.Item>
                <Form.Item
                    name="status"
                    label="Status"
                    rules={[{ required: true, message: "Please select a status" }]}
                >
                    <Select placeholder="Select status" size="large" className="rounded-lg">
                        <Option value="pending">Pending</Option>
                        <Option value="confirmed">Confirmed</Option>
                        <Option value="rejected">Rejected</Option>
                    </Select>
                </Form.Item>
                {/* Notes field removed: not present in backend model */}
                <div className="flex justify-end gap-2 mt-4">
                    <Button onClick={handleCancel} className="rounded-lg" size="large">
                        Cancel
                    </Button>
                    <Button type="primary" htmlType="submit" className="bg-gradient-to-r from-blue-600 to-indigo-600 rounded-lg" size="large" loading={loading}>
                        Create
                    </Button>
                </div>
            </Form>
        </Modal>
    );
}

export default RegistrationCreateModal;
