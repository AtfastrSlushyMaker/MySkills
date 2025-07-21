import React from 'react';
import { Modal, Form, Input, Rate, Button, Select, Spin, message } from 'antd';
import { registrationApi, trainingSessionApi } from '../../../services/api';

function FeedbackCreateModal({ visible, onCreate, onCancel, loading }) {
    const [form] = Form.useForm();
    const [sessions, setSessions] = React.useState([]);
    const [sessionsLoading, setSessionsLoading] = React.useState(false);
    const [users, setUsers] = React.useState([]);
    const [usersLoading, setUsersLoading] = React.useState(false);
    const [selectedSession, setSelectedSession] = React.useState(null);
    // Map user_id to registration_id for quick lookup
    const userIdToRegistrationId = React.useRef({});

    React.useEffect(() => {
        if (visible) {
            setSessionsLoading(true);
            trainingSessionApi.getAllSessions()
                .then(res => {
                    setSessions(Array.isArray(res.data) ? res.data : []);
                })
                .catch(() => setSessions([]))
                .finally(() => setSessionsLoading(false));
            setUsers([]);
            setSelectedSession(null);
            form.resetFields(['session_id', 'user_id']);
        }
    }, [visible]);

    const handleSessionChange = (sessionId) => {
        setSelectedSession(sessionId);
        setUsersLoading(true);
        registrationApi.getConfirmedUsersBySession(sessionId)
            .then(res => {
                // Expecting res.data.users to be [{id, first_name, last_name, email, registration_id}]
                const usersArr = Array.isArray(res.data?.users) ? res.data.users : [];
                setUsers(usersArr);
                // Build lookup map
                const map = {};
                usersArr.forEach(u => {
                    // registration_id may be on user or as user.registration_id
                    map[u.id] = u.registration_id || (u.registration && u.registration.id);
                });
                userIdToRegistrationId.current = map;
            })
            .catch(() => {
                setUsers([]);
                userIdToRegistrationId.current = {};
            })
            .finally(() => setUsersLoading(false));
        form.setFieldsValue({ user_id: undefined });
    };

    const handleOk = () => {
        form.validateFields().then(values => {
            // Map user_id to registration_id
            const registration_id = userIdToRegistrationId.current[values.user_id];
            if (!registration_id) {
                message.error('Could not find registration for selected user.');
                return;
            }
            const payload = {
                registration_id,
                rating: values.rating,
                comment: values.comment || '',
            };
            onCreate(payload);
            form.resetFields();
        });
    };

    return (
        <Modal
            open={visible}
            title={<span className="font-bold text-lg text-blue-700">Add Feedback</span>}
            onCancel={() => { form.resetFields(); onCancel(); }}
            onOk={handleOk}
            footer={[
                <Button key="back" onClick={() => { form.resetFields(); onCancel(); }}>
                    Cancel
                </Button>,
                <Button key="submit" type="primary" loading={loading} onClick={handleOk} className="bg-gradient-to-r from-blue-600 to-indigo-600 border-0">
                    Submit
                </Button>
            ]}
            className="rounded-xl shadow-lg backdrop-blur-md"
        >
            <Form
                form={form}
                layout="vertical"
                name="feedback_create_form"
                className="pt-2"
            >
                <Form.Item
                    name="session_id"
                    label={<span className="text-gray-700 font-medium">Session</span>}
                    rules={[{ required: true, message: 'Please select a session' }]}
                >
                    {sessionsLoading ? <Spin /> : (
                        <Select
                            showSearch
                            placeholder="Select a session"
                            optionFilterProp="children"
                            onChange={handleSessionChange}
                            filterOption={(input, option) =>
                                (option?.children ?? '').toLowerCase().includes(input.toLowerCase())
                            }
                        >
                            {sessions.map(session => (
                                <Select.Option key={session.id} value={session.id}>
                                    {session.skill_name || 'Session'} — {session.date ? new Date(session.date).toLocaleDateString() : ''}
                                </Select.Option>
                            ))}
                        </Select>
                    )}
                </Form.Item>
                <Form.Item
                    name="user_id"
                    label={<span className="text-gray-700 font-medium">User</span>}
                    rules={[{ required: true, message: 'Please select a user' }]}
                >
                    <Select
                        showSearch
                        placeholder={selectedSession ? (usersLoading ? 'Loading users...' : 'Select a user') : 'Select a session first'}
                        optionFilterProp="children"
                        disabled={!selectedSession || usersLoading}
                        filterOption={(input, option) =>
                            (option?.children ?? '').toLowerCase().includes(input.toLowerCase())
                        }
                    >
                        {users.map(user => (
                            <Select.Option key={user.id} value={user.id}>
                                {user.first_name} {user.last_name} ({user.email})
                            </Select.Option>
                        ))}
                    </Select>
                </Form.Item>
                <Form.Item
                    name="rating"
                    label={<span className="text-gray-700 font-medium">Rating</span>}
                    rules={[{ required: true, message: 'Please provide a rating' }]}
                >
                    <Rate className="text-blue-500" />
                </Form.Item>
                <Form.Item
                    name="comment"
                    label={<span className="text-gray-700 font-medium">Comment</span>}
                    rules={[{ required: false }]}
                >
                    <Input.TextArea rows={4} placeholder="Enter feedback..." className="rounded-lg" />
                </Form.Item>
            </Form>
        </Modal>
    );
}

export default FeedbackCreateModal;
