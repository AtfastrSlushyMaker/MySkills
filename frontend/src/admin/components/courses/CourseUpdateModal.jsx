import React, { useEffect, useState } from "react";
import { Modal, Form, Input, Button, Select, notification, Upload, Image, Spin } from "antd";
import { UploadOutlined, BookOutlined } from '@ant-design/icons';
import { trainingCourseApi, courseContentApi } from '../../../services/api';

const { TextArea } = Input;
const { Option } = Select;

function CourseUpdateModal({ visible, course, onSuccess, onCancel }) {
    const [courseForm] = Form.useForm();
    const [loading, setLoading] = useState(false);
    const [contentId, setContentId] = useState(null);
    const [contentLoading, setContentLoading] = useState(false);
    const [imageFile, setImageFile] = useState(null);
    const [imagePreview, setImagePreview] = useState(null);
    const [contentType, setContentType] = useState('text');

    useEffect(() => {
        if (visible && course) {
            courseForm.setFieldsValue(course);
            setContentLoading(true);
            courseContentApi.getByCourse(course.id)
                .then(res => {
                    const content = res.data && res.data.length > 0 ? res.data[0] : null;
                    if (content) {
                        courseForm.setFieldsValue({
                            type: content.type || 'text',
                            content: content.type === 'image' ? '' : (content.content || '')
                        });
                        setContentType(content.type || 'text');
                        setContentId(content.id);
                        if (content.type === 'image' && content.content) {
                            setImagePreview(content.content); // Assuming content is image URL
                        } else {
                            setImagePreview(null);
                        }
                    } else {
                        courseForm.setFieldsValue({ type: 'text', content: '' });
                        setContentType('text');
                        setContentId(null);
                        setImagePreview(null);
                    }
                })
                .finally(() => setContentLoading(false));
        } else if (!visible) {
            courseForm.resetFields();
            setContentId(null);
            setImageFile(null);
            setImagePreview(null);
            setContentType('text');
        }
    }, [visible, course]);

    const resetImage = () => {
        setImageFile(null);
        setImagePreview(null);
    };

    const handleUpdate = async (values) => {
        setLoading(true);
        try {
            await trainingCourseApi.updateCourse(course.id, values);
            let contentValues;
            if (values.type === 'image') {
                if (!imageFile && !imagePreview) {
                    notification.error({ message: 'Please upload an image file.' });
                    setLoading(false);
                    return;
                }
                contentValues = new FormData();
                contentValues.append('type', 'image');
                contentValues.append('training_course_id', course.id);
                if (imageFile) contentValues.append('content', imageFile);
            } else {
                contentValues = { type: values.type, content: values.content, training_course_id: course.id };
            }
            if (contentId) {
                await courseContentApi.update(contentId, contentValues);
            } else {
                await courseContentApi.create(contentValues);
            }
            notification.success({
                message: 'Success',
                description: 'Course and content updated successfully',
                placement: 'topRight'
            });
            resetImage();
            onSuccess?.();
            onCancel();
        } catch (error) {
            notification.error({
                message: 'Update Failed',
                description: error.response?.data?.message || error.message || 'Please try again',
                placement: 'topRight'
            });
        } finally {
            setLoading(false);
        }
    };

    const handleCancel = () => {
        if (!loading) {
            onCancel();
            courseForm.resetFields();
            resetImage();
        }
    };

    return (
        <Modal
            title={
                <div className="flex items-center gap-3 text-xl font-bold text-gray-800 border-b border-gray-200 pb-4">
                    <div className="flex items-center justify-center w-10 h-10 bg-gradient-to-r from-cyan-500 to-blue-500 rounded-full text-white">
                        <BookOutlined className="text-lg" />
                    </div>
                    <span className="bg-gradient-to-r from-cyan-600 to-blue-600 bg-clip-text text-transparent">
                        Update Course
                    </span>
                </div>
            }
            open={visible}
            onCancel={handleCancel}
            afterClose={handleCancel}
            footer={null}
            className="update-course-modal"
            width={600}
            centered
            styles={{
                body: {
                    padding: '24px',
                    background: 'linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%)'
                }
            }}
        >
            <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
                {/* Header Section */}
                <div className="bg-gradient-to-r from-cyan-50 to-blue-50 p-4 rounded-lg mb-6 border-l-4 border-cyan-500">
                    <div className="flex items-center gap-3">
                        <div className="w-8 h-8 bg-gradient-to-r from-cyan-500 to-blue-500 rounded-full flex items-center justify-center">
                            <BookOutlined className="text-white text-sm" />
                        </div>
                        <div>
                            <h3 className="text-lg font-semibold text-gray-800 mb-1">Course Information</h3>
                            <p className="text-gray-600 text-sm">Update course details and content</p>
                        </div>
                    </div>
                </div>

                {contentLoading ? (
                    <div className="flex items-center justify-center py-12">
                        <Spin size="large" />
                        <span className="ml-3 text-gray-600">Loading course data...</span>
                    </div>
                ) : (
                    <Form
                        form={courseForm}
                        layout="vertical"
                        onFinish={handleUpdate}
                        autoComplete="off"
                        requiredMark={false}
                    >
                        <Form.Item
                            name="title"
                            label={<span className="text-gray-700 font-medium">Course Title</span>}
                            rules={[{ required: true, message: "Please enter the course title" }]}
                        >
                            <Input
                                placeholder="Course Title"
                                size="large"
                                className="rounded-lg border-gray-300 focus:border-cyan-500 focus:ring-cyan-500"
                                autoFocus
                            />
                        </Form.Item>

                        <Form.Item
                            name="description"
                            label={<span className="text-gray-700 font-medium">Description</span>}
                            rules={[{ required: true, message: "Please enter a description" }]}
                        >
                            <TextArea
                                placeholder="Description"
                                size="large"
                                className="rounded-lg border-gray-300 focus:border-cyan-500 focus:ring-cyan-500"
                                rows={4}
                                showCount
                                maxLength={500}
                            />
                        </Form.Item>

                        <Form.Item
                            name="duration_hours"
                            label={<span className="text-gray-700 font-medium">Duration (Hours)</span>}
                            rules={[{ required: true, message: 'Duration is required' }]}
                        >
                            <Input
                                type="number"
                                min="0.5"
                                max="100"
                                step="0.5"
                                placeholder="e.g., 8.5"
                                size="large"
                                className="rounded-lg border-gray-300 focus:border-cyan-500 focus:ring-cyan-500"
                                addonAfter="hours"
                            />
                        </Form.Item>

                        {/* Content Section */}
                        <div className="bg-gradient-to-r from-blue-50 to-cyan-50 p-4 rounded-lg border border-blue-200 mb-4">
                            <h4 className="text-gray-800 font-medium mb-3 flex items-center gap-2">
                                <div className="w-6 h-6 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-full flex items-center justify-center">
                                    <span className="text-white text-xs">📝</span>
                                </div>
                                Course Content
                            </h4>

                            <Form.Item
                                name="type"
                                label={<span className="text-gray-700 font-medium">Content Type</span>}
                                rules={[{ required: true, message: 'Please select content type' }]}
                                initialValue="text"
                            >
                                <Select
                                    size="large"
                                    disabled={contentLoading}
                                    value={contentType}
                                    onChange={val => {
                                        setContentType(val);
                                        resetImage();
                                        courseForm.setFieldsValue({ type: val, content: '' });
                                    }}
                                    className="rounded-lg"
                                >
                                    <Option value="text">📝 Text Content</Option>
                                    <Option value="video">🎥 Video</Option>
                                    <Option value="file">📎 File Attachment</Option>
                                    <Option value="image">🖼️ Image</Option>
                                </Select>
                            </Form.Item>

                            {contentType === 'image' ? (
                                <Form.Item label={<span className="text-gray-700 font-medium">Upload Image</span>} required>
                                    <div className="space-y-3">
                                        <Upload
                                            accept="image/*"
                                            showUploadList={false}
                                            beforeUpload={file => {
                                                setImageFile(file);
                                                const reader = new FileReader();
                                                reader.onload = e => setImagePreview(e.target.result);
                                                reader.readAsDataURL(file);
                                                return false;
                                            }}
                                        >
                                            <Button
                                                icon={<UploadOutlined />}
                                                size="large"
                                                className="bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600 text-white border-0"
                                            >
                                                Select Image
                                            </Button>
                                        </Upload>
                                        {imagePreview && (
                                            <div className="bg-white p-3 rounded-lg border border-gray-200">
                                                <p className="text-sm text-gray-600 mb-2 font-medium">Current Image:</p>
                                                <Image
                                                    src={imagePreview}
                                                    alt="Preview"
                                                    width={150}
                                                    style={{ borderRadius: 8, border: '2px solid #06b6d4' }}
                                                />
                                            </div>
                                        )}
                                    </div>
                                </Form.Item>
                            ) : (
                                <Form.Item
                                    name="content"
                                    label={<span className="text-gray-700 font-medium">Content</span>}
                                    rules={[
                                        { required: true, message: 'Content is required' },
                                        { min: 10, message: 'Content must be at least 10 characters' }
                                    ]}
                                >
                                    <TextArea
                                        placeholder="Detailed content for this section"
                                        rows={6}
                                        disabled={contentLoading}
                                        showCount
                                        className="rounded-lg border-gray-300 focus:border-cyan-500 focus:ring-cyan-500"
                                    />
                                </Form.Item>
                            )}
                        </div>

                        {/* Footer Buttons */}
                        <div className="flex justify-between items-center pt-4 border-t border-gray-200">
                            <Button
                                onClick={handleCancel}
                                disabled={loading}
                                size="large"
                            >
                                Cancel
                            </Button>

                            <Button
                                type="primary"
                                htmlType="submit"
                                loading={loading}
                                size="large"
                                className="bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600 border-0"
                            >
                                Update Course
                            </Button>
                        </div>
                    </Form>
                )}
            </div>
        </Modal>
    );
}

export default CourseUpdateModal;