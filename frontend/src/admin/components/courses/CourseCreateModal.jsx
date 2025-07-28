import React, { useState } from "react";
import { Modal, Steps, Form, Input, Button, Select, notification, Upload, Image } from "antd";
import { UploadOutlined, EyeOutlined } from '@ant-design/icons';
import { BookOutlined, FileTextOutlined, ArrowLeftOutlined, CheckCircleOutlined } from '@ant-design/icons';
import { trainingCourseApi, courseContentApi } from '../../../services/api';

import '../../styles/CourseCreateModal.css';

const { Step } = Steps;
const { TextArea } = Input;
const { Option } = Select;

function CourseCreateModal({ visible, onSuccess, onCancel, session }) {
    const [currentStep, setCurrentStep] = useState(0);
    const [loading, setLoading] = useState(false);
    const [createdCourseId, setCreatedCourseId] = useState(null);
    const [imageFile, setImageFile] = useState(null);
    const [imagePreview, setImagePreview] = useState(null);
    const [contentType, setContentType] = useState('text');
    const [courseForm] = Form.useForm();
    const [contentForm] = Form.useForm();

    const resetImage = () => {
        setImageFile(null);
        setImagePreview(null);
    };

    const resetModal = () => {
        courseForm.resetFields();
        contentForm.resetFields();
        setCurrentStep(0);
        setCreatedCourseId(null);
        setContentType('text');
        resetImage();
    };

    const handleCourseSubmit = async () => {
        try {
            const values = await courseForm.validateFields();
            setLoading(true);
            const response = await trainingCourseApi.createCourse({
                ...values,
                training_session_id: session?.id,
                created_by: session?.trainer_id,
                is_active: true,
                duration_hours: parseFloat(values.duration_hours),
            });
            if (response?.data?.id) {
                setCreatedCourseId(response.data.id);
                setCurrentStep(1);
                notification.success({
                    message: 'Course Created Successfully',
                    description: 'Now add content to complete the setup',
                    placement: 'topRight',
                    duration: 3
                });
            }
        } catch (error) {
            notification.error({
                message: 'Failed to Create Course',
                description: error.response?.data?.message || error.message || 'Please try again',
                placement: 'topRight',
                duration: 4
            });
        } finally {
            setLoading(false);
        }
    };

    const handleContentSubmit = async () => {
        try {
            const values = await contentForm.validateFields();
            setLoading(true);
            let payload;
            if (values.type === 'image') {
                if (!imageFile) {
                    notification.error({
                        message: 'Image Required',
                        description: 'Please upload an image file.',
                        placement: 'topRight'
                    });
                    setLoading(false);
                    return;
                }
                payload = new FormData();
                payload.append('training_course_id', createdCourseId);
                payload.append('type', 'image');
                payload.append('content', imageFile);
            } else {
                payload = {
                    training_course_id: createdCourseId,
                    content: values.content,
                    type: values.type || 'text',
                };
            }
            await courseContentApi.create(payload);
            notification.success({
                message: 'Course Created Successfully!',
                description: 'Your course is now ready and available',
                placement: 'topRight',
                duration: 4
            });
            resetModal();
            onSuccess?.();
            onCancel();
        } catch (error) {
            notification.error({
                message: 'Failed to Add Content',
                description: error.response?.data?.message || error.message || 'Please try again',
                placement: 'topRight',
                duration: 4
            });
        } finally {
            setLoading(false);
        }
    };

    const handleCancel = () => {
        if (!loading) {
            resetModal();
            onCancel();
        }
    };

    const handleBack = () => {
        if (!loading) {
            setCurrentStep(0);
        }
    };

    return (
        <Modal
            title={
                <div className="flex items-center gap-4 text-xl font-bold text-gray-800 border-b border-gray-200 pb-4 mb-2">
                    <div className="flex items-center justify-center w-12 h-12 bg-gradient-to-r from-cyan-500 to-blue-500 rounded-xl text-white shadow-lg">
                        <BookOutlined className="text-xl" />
                    </div>
                    <div>
                        <span className="bg-gradient-to-r from-cyan-600 to-blue-600 bg-clip-text text-transparent text-2xl">
                            Create New Course
                        </span>
                        <p className="text-sm text-gray-500 font-normal mt-1">
                            {currentStep === 0 ? 'Set up course details' : 'Add course content'}
                        </p>
                    </div>
                </div>
            }
            open={visible}
            onCancel={handleCancel}
            afterClose={resetModal}
            footer={null}
            className="create-course-modal"
            width={700}
            centered
            styles={{
                body: {
                    padding: '32px',
                    background: 'linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%)',
                    borderRadius: '16px'
                },
                content: {
                    borderRadius: '16px',
                    overflow: 'hidden'
                }
            }}
        >
            <div className="bg-white rounded-xl p-8 shadow-lg border border-gray-200">
                {/* Enhanced Steps */}
                <div className="mb-8">
                    <Steps
                        current={currentStep}
                        className="course-steps"
                        size="default"
                        items={[
                            {
                                title: <span className="font-semibold">Course Details</span>,
                                icon: <BookOutlined />,
                                status: currentStep > 0 ? 'finish' : currentStep === 0 ? 'process' : 'wait'
                            },
                            {
                                title: <span className="font-semibold">Add Content</span>,
                                icon: <FileTextOutlined />,
                                status: currentStep === 1 ? 'process' : 'wait'
                            }
                        ]}
                    />
                </div>

                <div className="step-content min-h-[400px]">
                    {/* Step 1: Course Details */}
                    {currentStep === 0 && (
                        <div className="animate-fade-in">
                            <Form form={courseForm} layout="vertical" requiredMark={false} size="large">
                                {/* Header Section */}
                                <div className="bg-gradient-to-r from-cyan-50 to-blue-50 p-6 rounded-xl mb-8 border border-cyan-200 shadow-sm">
                                    <div className="flex items-center gap-4">
                                        <div className="w-10 h-10 bg-gradient-to-r from-cyan-500 to-blue-500 rounded-lg flex items-center justify-center shadow-md">
                                            <BookOutlined className="text-white text-lg" />
                                        </div>
                                        <div>
                                            <h3 className="text-xl font-bold text-gray-800 mb-1">Course Information</h3>
                                            <p className="text-gray-600">Define the essential details for your training course</p>
                                        </div>
                                    </div>
                                </div>

                                <div className="space-y-6">
                                    <Form.Item
                                        name="title"
                                        label={<span className="text-gray-800 font-semibold text-base">Course Title</span>}
                                        rules={[{ required: true, message: 'Please enter a course title' }]}
                                    >
                                        <Input
                                            placeholder="Enter a descriptive and engaging course title"
                                            disabled={loading}
                                            className="rounded-lg border-2 border-gray-200 hover:border-cyan-400 focus:border-cyan-500 focus:ring-2 focus:ring-cyan-200 transition-all duration-200 py-3 px-4"
                                            style={{ fontSize: '16px' }}
                                        />
                                    </Form.Item>

                                    <Form.Item
                                        name="description"
                                        label={<span className="text-gray-800 font-semibold text-base">Course Description</span>}
                                        rules={[{ required: true, message: 'Please provide a course description' }]}
                                    >
                                        <TextArea
                                            placeholder="Provide a comprehensive overview of what this course covers, learning objectives, and target audience..."
                                            rows={4}
                                            disabled={loading}
                                            showCount
                                            maxLength={500}
                                            className="rounded-lg border-2 border-gray-200 hover:border-cyan-400 focus:border-cyan-500 focus:ring-2 focus:ring-cyan-200 transition-all duration-200"
                                        />
                                    </Form.Item>

                                    <Form.Item
                                        name="duration_hours"
                                        label={<span className="text-gray-800 font-semibold text-base">Course Duration</span>}
                                        rules={[
                                            { required: true, message: 'Please specify the course duration' },
                                            {
                                                pattern: /^[0-9]+(\.[05])?$/,
                                                message: 'Duration must be in increments of 0.5 hours (e.g., 1, 1.5, 2)'
                                            }
                                        ]}
                                        extra={<span className="text-gray-500">Enter duration in hours (minimum 0.5, increments of 0.5)</span>}
                                    >
                                        <Input
                                            type="number"
                                            min="0.5"
                                            max="100"
                                            step="0.5"
                                            placeholder="e.g., 2.5"
                                            disabled={loading}
                                            addonAfter={
                                                <span className=" text-white px-2 font-medium">
                                                    hours
                                                </span>
                                            }
                                            className="rounded-lg border-2 border-gray-200 hover:border-cyan-400 focus:border-cyan-500 focus:ring-2 focus:ring-cyan-200 transition-all duration-200"
                                            style={{ fontSize: '16px' }}
                                        />
                                    </Form.Item>
                                </div>

                                {/* Info Box */}
                                <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-xl p-4 mt-6">
                                    <div className="flex items-start gap-3">
                                        <div className="text-2xl">💡</div>
                                        <div>
                                            <p className="text-blue-800 font-medium mb-1">Quick Tip</p>
                                            <p className="text-blue-700 text-sm leading-relaxed">
                                                A good course title should be clear, specific, and indicate the learning outcome.
                                                The description should explain what participants will learn and how it benefits them.
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </Form>
                        </div>
                    )}

                    {/* Step 2: Add Content */}
                    {currentStep === 1 && (
                        <div className="animate-fade-in">
                            <Form form={contentForm} layout="vertical" requiredMark={false} size="large">
                                {/* Header Section */}
                                <div className="bg-gradient-to-r from-blue-50 to-cyan-50 p-6 rounded-xl mb-8 border border-blue-200 shadow-sm">
                                    <div className="flex items-center gap-4">
                                        <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-lg flex items-center justify-center shadow-md">
                                            <FileTextOutlined className="text-white text-lg" />
                                        </div>
                                        <div>
                                            <h3 className="text-xl font-bold text-gray-800 mb-1">Course Content</h3>
                                            <p className="text-gray-600">Add the initial content to get your course started</p>
                                        </div>
                                    </div>
                                </div>

                                <div className="space-y-6">
                                    <Form.Item
                                        name="type"
                                        label={<span className="text-gray-800 font-semibold text-base">Content Type</span>}
                                        rules={[{ required: true, message: 'Please select a content type' }]}
                                        initialValue="text"
                                    >
                                        <Select
                                            disabled={loading}
                                            value={contentType}
                                            onChange={val => {
                                                setContentType(val);
                                                resetImage();
                                                contentForm.setFieldsValue({ type: val, content: '' });
                                            }}
                                            className="rounded-lg"
                                            style={{ fontSize: '16px' }}
                                        >
                                            <Option value="text">
                                                <div className="flex items-center gap-2 py-1">
                                                    <span className="text-lg">📝</span>
                                                    <span className="font-medium">Text Content</span>
                                                </div>
                                            </Option>
                                            <Option value="video">
                                                <div className="flex items-center gap-2 py-1">
                                                    <span className="text-lg">🎥</span>
                                                    <span className="font-medium">Video</span>
                                                </div>
                                            </Option>
                                            <Option value="file">
                                                <div className="flex items-center gap-2 py-1">
                                                    <span className="text-lg">📎</span>
                                                    <span className="font-medium">File Attachment</span>
                                                </div>
                                            </Option>
                                            <Option value="image">
                                                <div className="flex items-center gap-2 py-1">
                                                    <span className="text-lg">🖼️</span>
                                                    <span className="font-medium">Image</span>
                                                </div>
                                            </Option>
                                        </Select>
                                    </Form.Item>

                                    {contentType === 'image' ? (
                                        <Form.Item
                                            label={<span className="text-gray-800 font-semibold text-base">Upload Image</span>}
                                            required
                                        >
                                            <div className="space-y-4">
                                                <div className="border-2 border-dashed border-gray-300 rounded-xl p-8 text-center hover:border-cyan-400 transition-colors duration-200">
                                                    <Upload
                                                        accept="image/*"
                                                        showUploadList={false}
                                                        beforeUpload={file => {
                                                            const isImage = file.type.startsWith('image/');
                                                            if (!isImage) {
                                                                notification.error({
                                                                    message: 'Invalid file type',
                                                                    description: 'Please upload an image file only.',
                                                                });
                                                                return false;
                                                            }
                                                            const isLt5M = file.size / 1024 / 1024 < 5;
                                                            if (!isLt5M) {
                                                                notification.error({
                                                                    message: 'File too large',
                                                                    description: 'Image must be smaller than 5MB.',
                                                                });
                                                                return false;
                                                            }
                                                            setImageFile(file);
                                                            const reader = new FileReader();
                                                            reader.onload = e => setImagePreview(e.target.result);
                                                            reader.readAsDataURL(file);
                                                            return false;
                                                        }}
                                                        className="w-full"
                                                    >
                                                        <div className="flex flex-col items-center gap-3">
                                                            <div className="w-16 h-16 bg-gradient-to-r from-cyan-500 to-blue-500 rounded-full flex items-center justify-center">
                                                                <UploadOutlined className="text-white text-2xl" />
                                                            </div>
                                                            <div>
                                                                <p className="text-lg font-semibold text-gray-800 mb-1">
                                                                    Click to upload image
                                                                </p>
                                                                <p className="text-gray-500">
                                                                    Supports JPG, PNG, GIF up to 5MB
                                                                </p>
                                                            </div>
                                                        </div>
                                                    </Upload>
                                                </div>
                                                {imagePreview && (
                                                    <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm">
                                                        <div className="flex items-center gap-2 mb-3">
                                                            <CheckCircleOutlined className="text-green-500" />
                                                            <span className="text-sm font-semibold text-gray-700">Image uploaded successfully</span>
                                                        </div>
                                                        <div className="flex justify-center">
                                                            <Image
                                                                src={imagePreview}
                                                                alt="Preview"
                                                                width={200}
                                                                style={{
                                                                    borderRadius: 12,
                                                                    border: '3px solid #06b6d4',
                                                                    boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
                                                                }}
                                                            />
                                                        </div>
                                                    </div>
                                                )}
                                            </div>
                                        </Form.Item>
                                    ) : (
                                        <Form.Item
                                            name="content"
                                            label={<span className="text-gray-800 font-semibold text-base">Content</span>}
                                            rules={[
                                                { required: true, message: 'Please provide content' },
                                                { min: 10, message: 'Content must be at least 10 characters long' }
                                            ]}
                                        >
                                            <TextArea
                                                placeholder="Write detailed, engaging content for this section. This will be the main learning material for participants..."
                                                rows={6}
                                                disabled={loading}
                                                showCount
                                                className="rounded-lg border-2 border-gray-200 hover:border-cyan-400 focus:border-cyan-500 focus:ring-2 focus:ring-cyan-200 transition-all duration-200"
                                            />
                                        </Form.Item>
                                    )}
                                </div>

                                {/* Success Info */}
                                <div className="bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200 rounded-xl p-4 mt-6">
                                    <div className="flex items-start gap-3">
                                        <div className="text-2xl">🎉</div>
                                        <div>
                                            <p className="text-green-800 font-medium mb-1">Almost Done!</p>
                                            <p className="text-green-700 text-sm leading-relaxed">
                                                this course is now ready to be published. You can always edit the content later.
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </Form>
                        </div>
                    )}
                </div>

                {/* Enhanced Footer Buttons */}
                <div className="flex justify-between items-center pt-8 border-t-2 border-gray-100 mt-8">
                    <Button
                        onClick={currentStep === 0 ? handleCancel : handleBack}
                        disabled={loading}
                        size="large"
                        icon={currentStep === 0 ? null : <ArrowLeftOutlined />}
                        className="px-6 py-2 h-12 font-semibold rounded-lg border-2 border-gray-300 hover:border-gray-400 hover:shadow-md transition-all duration-200"
                    >
                        {currentStep === 0 ? 'Cancel' : 'Back'}
                    </Button>
                    <Button
                        type="primary"
                        onClick={currentStep === 0 ? handleCourseSubmit : handleContentSubmit}
                        loading={loading}
                        size="large"
                        className="px-8 py-2 h-12 font-semibold bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600 border-0 rounded-lg shadow-lg hover:shadow-xl transition-all duration-200"
                        icon={currentStep === 1 ? <CheckCircleOutlined /> : null}
                    >
                        {currentStep === 0 ? 'Create Course & Continue' : 'Complete Setup'}
                    </Button>
                </div>
            </div>

            {/* Inline <style> block removed; all styles should be in CreateCourseModal.css */}
        </Modal>
    );
}

export default CourseCreateModal;