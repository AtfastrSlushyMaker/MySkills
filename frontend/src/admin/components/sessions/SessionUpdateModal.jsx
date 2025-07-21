import React from "react";
import { Modal, Form, Input, DatePicker, Button, TimePicker } from "antd";
import { EditOutlined } from "@ant-design/icons";
import { userApi, categoryApi } from '../../../services/api';
import dayjs from 'dayjs';

function SessionUpdateModal({ visible, session, onUpdate, onCancel, loading }) {
    const [form] = Form.useForm();
    const [trainers, setTrainers] = React.useState([]);
    const [coordinators, setCoordinators] = React.useState([]);
    const [categories, setCategories] = React.useState([]);

    React.useEffect(() => {
        userApi.getAllTrainers().then(res => setTrainers(res.data || []));
        userApi.getAllCoordinators().then(res => setCoordinators(res.data || []));
        categoryApi.getAllCategories().then(res => setCategories(res.data || []));
    }, []);

    React.useEffect(() => {
        if (session) {
            form.setFieldsValue({
                ...session,
                date: session.date ? dayjs(session.date) : null,
                end_date: session.end_date ? dayjs(session.end_date) : null,
                start_time: session.start_time ? dayjs(`1970-01-01T${session.start_time}`) : null,
                end_time: session.end_time ? dayjs(`1970-01-01T${session.end_time}`) : null
            });
        }
    }, [session, form]);

    const handleCancel = () => {
        onCancel();
    };

    const handleOk = (values) => {
        // Only send fields that are editable and expected by backend
        const formattedValues = {
            category_id: values.category_id,
            coordinator_id: values.coordinator_id,
            trainer_id: values.trainer_id,
            location: values.location,
            max_participants: values.max_participants,
            date: values.date ? values.date.format('YYYY-MM-DD') : null,
            end_date: values.end_date ? values.end_date.format('YYYY-MM-DD') : null,
            start_time: values.start_time ? values.start_time.format('HH:mm') : null,
            end_time: values.end_time ? values.end_time.format('HH:mm') : null,
            status: values.status,
            skill_name: values.skill_name,
            skill_description: values.skill_description,
        };
        onUpdate({ id: session.id, ...formattedValues });
    };

    return (
        <Modal
            open={visible}
            onCancel={handleCancel}
            afterClose={() => form.resetFields()}
            footer={null}
            centered
            className="glass-modal"
            title={
                <div className="flex items-center gap-3 text-xl font-bold text-gray-800">
                    <EditOutlined className="text-cyan-600" />
                    <span>Edit Session</span>
                </div>
            }
        >
            <Form
                form={form}
                layout="vertical"
                onFinish={handleOk}
                autoComplete="off"
            >
                <div style={{ display: 'flex', gap: 24 }}>
                    <div style={{ flex: 1 }}>
                        <Form.Item
                            name="category_id"
                            label="Category"
                            rules={[{ required: true, message: 'Please select a category' }]}
                        >
                            <select className="w-full p-2 rounded border border-gray-300">
                                <option value="">Select Category</option>
                                {categories.map(cat => (
                                    <option key={cat.id} value={cat.id}>{cat.name}</option>
                                ))}
                            </select>
                        </Form.Item>

                        <Form.Item
                            name="coordinator_id"
                            label="Coordinator"
                            rules={[{ required: true, message: 'Please select a coordinator' }]}
                        >
                            <select className="w-full p-2 rounded border border-gray-300">
                                <option value="">Select Coordinator</option>
                                {coordinators.map(user => (
                                    <option key={user.id} value={user.id}>
                                        {user.first_name} {user.last_name}
                                    </option>
                                ))}
                            </select>
                        </Form.Item>

                        <Form.Item
                            name="trainer_id"
                            label="Trainer"
                            rules={[{ required: true, message: 'Please select a trainer' }]}
                        >
                            <select className="w-full p-2 rounded border border-gray-300">
                                <option value="">Select Trainer</option>
                                {trainers.map(user => (
                                    <option key={user.id} value={user.id}>
                                        {user.first_name} {user.last_name}
                                    </option>
                                ))}
                            </select>
                        </Form.Item>

                        <Form.Item
                            name="location"
                            label="Location"
                            rules={[{ required: true, message: 'Please enter a location' }]}
                        >
                            <Input placeholder="Location" />
                        </Form.Item>

                        <Form.Item
                            name="max_participants"
                            label="Max Participants"
                            rules={[{
                                required: true,
                                message: 'Please enter max participants',
                                type: 'number',
                                min: 1,
                                transform: value => Number(value)
                            }]}
                        >
                            <Input type="number" placeholder="Max Participants" min={1} />
                        </Form.Item>
                    </div>

                    <div style={{ flex: 1 }}>
                        <Form.Item
                            name="date"
                            label="Date"
                            rules={[{ required: true, message: 'Please select a date' }]}
                        >
                            <DatePicker className="w-full" format="YYYY-MM-DD" />
                        </Form.Item>

                        <Form.Item name="end_date" label="End Date">
                            <DatePicker className="w-full" format="YYYY-MM-DD" />
                        </Form.Item>

                        <Form.Item
                            name="start_time"
                            label="Start Time"
                            rules={[{ required: true, message: 'Please select a start time' }]}
                        >
                            <TimePicker className="w-full" format="HH:mm" />
                        </Form.Item>

                        <Form.Item
                            name="end_time"
                            label="End Time"
                            rules={[{ required: true, message: 'Please select an end time' }]}
                        >
                            <TimePicker className="w-full" format="HH:mm" />
                        </Form.Item>

                        <Form.Item
                            name="status"
                            label="Status"
                            rules={[{ required: true, message: 'Please select a status' }]}
                        >
                            <select className="w-full p-2 rounded border border-gray-300">
                                <option value="active">Active</option>
                                <option value="archived">Archived</option>
                            </select>
                        </Form.Item>

                        <Form.Item
                            name="skill_name"
                            label="Skill Name"
                            rules={[{
                                required: true,
                                message: 'Please enter skill name',
                                max: 255,
                                whitespace: true
                            }]}
                        >
                            <Input placeholder="Skill Name" />
                        </Form.Item>

                        <Form.Item
                            name="skill_description"
                            label="Skill Description"
                            rules={[{ max: 1000, message: 'Description cannot exceed 1000 characters' }]}
                        >
                            <Input.TextArea placeholder="Skill Description" rows={3} />
                        </Form.Item>
                    </div>
                </div>

                <Form.Item style={{ marginTop: 24 }}>
                    <Button
                        type="primary"
                        htmlType="submit"
                        loading={loading}
                        className="bg-cyan-600 hover:bg-cyan-700"
                        block
                    >
                        Update Session
                    </Button>
                </Form.Item>
            </Form>
        </Modal>
    );
}

export default SessionUpdateModal;