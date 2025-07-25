import React, { useState, useEffect } from 'react';
import { Modal, Steps, Form, Input, Button, Select, notification, Upload } from 'antd';
import { BookOutlined, FileTextOutlined, PlusOutlined, ArrowLeftOutlined, UploadOutlined, EyeOutlined } from '@ant-design/icons';
import { trainingCourseApi, courseContentApi } from '../../services/api';
import '../../styles/CreateCourseModal.css';

const { Step } = Steps;
const { TextArea } = Input;
const { Option } = Select;

const CreateCourseModal = ({ isOpen, onClose, session, onCourseCreated }) => {
    const [currentStep, setCurrentStep] = useState(0);
    const [courseForm] = Form.useForm();
    const [contentForm] = Form.useForm();
    const contentFormInitialValues = { content: '', type: 'text' };
    const [loading, setLoading] = useState(false);
    const [createdCourseId, setCreatedCourseId] = useState(null);
    const [selectedContentType, setSelectedContentType] = useState('text');
    const [fileList, setFileList] = useState([]);
    const [previewImage, setPreviewImage] = useState('');
    const [previewVisible, setPreviewVisible] = useState(false);

    useEffect(() => {
        if (isOpen) {
            courseForm.resetFields();
            contentForm.setFieldsValue(contentFormInitialValues);
            setCurrentStep(0);
            setCreatedCourseId(null);
            setLoading(false);
            setSelectedContentType('text');
            setFileList([]);
            setPreviewImage('');
            setPreviewVisible(false);
        }
    }, [isOpen]);

    const handleCourseSubmit = async () => {
        try {
            const values = await courseForm.validateFields();
            setLoading(true);

            const response = await trainingCourseApi.createCourse({
                ...values,
                training_session_id: session.id,
                created_by: session.trainer_id,
                is_active: true,
                duration_hours: parseFloat(values.duration_hours),
            });

            if (response?.data?.id) {
                setCreatedCourseId(response.data.id);
                setCurrentStep(1);
                notification.success({
                    message: 'Course Created',
                    description: 'Now add content to complete the setup',
                    placement: 'topRight',
                });
            }
        } catch (error) {
            notification.error({
                message: 'Failed to Create Course',
                description: error.response?.data?.message || error.message || 'Please try again',
                placement: 'topRight',
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

            if (selectedContentType === 'image' && fileList.length > 0) {
                // For image uploads, create FormData
                const formData = new FormData();
                formData.append('training_course_id', createdCourseId);
                formData.append('type', 'image');
                formData.append('content', fileList[0].originFileObj);

                console.log('Sending image content to backend');
                await courseContentApi.create(formData, {
                    headers: {
                        'Content-Type': 'multipart/form-data',
                    },
                });
            } else {
                // For text, video, and file content
                payload = {
                    training_course_id: createdCourseId,
                    content: typeof values.content === 'string' ? values.content : '',
                    type: values.type || 'text',
                };
                console.log('Sending course content to backend:', payload);
                await courseContentApi.create(payload);
            }

            notification.success({
                message: 'Content Added',
                description: 'Course is now ready',
                placement: 'topRight',
            });

            setCurrentStep(0);
            onCourseCreated?.();
            onClose();
        } catch (error) {
            notification.error({
                message: 'Failed to Add Content',
                description: error.response?.data?.message || error.message || 'Please try again',
                placement: 'topRight',
            });
        } finally {
            setLoading(false);
        }
    };

    const handleBack = () => currentStep === 0 ? onClose() : setCurrentStep(0);
    const handleCancel = () => {
        if (!loading) {
            onClose();
            courseForm.resetFields();
            contentForm.resetFields();
            setFileList([]);
            setPreviewImage('');
            setPreviewVisible(false);
        }
    };

    const handleContentTypeChange = (value) => {
        setSelectedContentType(value);
        if (value !== 'image') {
            setFileList([]);
            setPreviewImage('');
            setPreviewVisible(false);
        }
    };

    const handleFileChange = ({ fileList: newFileList }) => {
        setFileList(newFileList);
    };

    const handlePreview = async (file) => {
        if (!file.url && !file.preview) {
            file.preview = await getBase64(file.originFileObj);
        }
        setPreviewImage(file.url || file.preview);
        setPreviewVisible(true);
    };

    const getBase64 = (file) => {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.readAsDataURL(file);
            reader.onload = () => resolve(reader.result);
            reader.onerror = error => reject(error);
        });
    };

    const beforeUpload = (file) => {
        const isImage = file.type.startsWith('image/');
        if (!isImage) {
            notification.error({
                message: 'Invalid File Type',
                description: 'You can only upload image files!',
            });
            return false;
        }

        const isLt5M = file.size / 1024 / 1024 < 5;
        if (!isLt5M) {
            notification.error({
                message: 'File Too Large',
                description: 'Image must be smaller than 5MB!',
            });
            return false;
        }

        return false; // Prevent automatic upload
    };

    const uploadButton = (
        <div>
            <PlusOutlined />
            <div style={{ marginTop: 8 }}>Upload Image</div>
        </div>
    );

    return (
        <Modal
            title={
                <div className="modal-title">
                    <PlusOutlined className="modal-title-icon" />
                    <span>Create New Training Course</span>
                </div>
            }
            open={isOpen}
            onCancel={handleCancel}
            footer={null}
            width={600}
            centered
            className="create-course-modal"
        >
            <Steps current={currentStep} className="course-steps" size="small">
                <Step title="Course Details" icon={<BookOutlined />} />
                <Step title="Add Content" icon={<FileTextOutlined />} />
            </Steps>

            <div className="step-content">
                {/* Always mount both forms, toggle visibility with CSS */}
                <div style={{ display: currentStep === 0 ? 'block' : 'none' }}>
                    <Form form={courseForm} layout="vertical" requiredMark={false}>
                        <div className="step-header">
                            <BookOutlined className="step-icon" />
                            <div>
                                <h3>Course Information</h3>
                                <p>Set up the basic details for your training course</p>
                            </div>
                        </div>
                        <Form.Item
                            name="title"
                            label="Course Title"
                            rules={[
                                { required: true, message: 'Course title is required' },
                                { min: 3, message: 'Title must be at least 3 characters' },
                                { max: 100, message: 'Title cannot exceed 100 characters' }
                            ]}
                        >
                            <Input
                                placeholder="Enter a descriptive course title"
                                size="large"
                                disabled={loading}
                            />
                        </Form.Item>
                        <Form.Item
                            name="description"
                            label="Description"
                            rules={[{ max: 500, message: 'Description cannot exceed 500 characters' }]}
                        >
                            <TextArea
                                placeholder="Brief overview of what this course covers"
                                rows={3}
                                disabled={loading}
                                showCount
                                maxLength={500}
                            />
                        </Form.Item>
                        <Form.Item
                            name="duration_hours"
                            label="Duration (Hours)"
                            rules={[
                                { required: true, message: 'Duration is required' },
                                {
                                    validator: (_, value) => {
                                        const num = parseFloat(value);
                                        if (isNaN(num) || num < 0.5 || num > 100) {
                                            return Promise.reject('Must be between 0.5 and 100 hours');
                                        }
                                        return Promise.resolve();
                                    }
                                }
                            ]}
                        >
                            <Input
                                type="number"
                                min="0.5"
                                max="100"
                                step="0.5"
                                placeholder="e.g., 8.5"
                                size="large"
                                disabled={loading}
                                addonAfter="hours"
                            />
                        </Form.Item>
                    </Form>
                </div>

                <div style={{ display: currentStep === 1 ? 'block' : 'none' }}>
                    <Form form={contentForm} layout="vertical" requiredMark={false}>
                        <div className="step-header">
                            <FileTextOutlined className="step-icon" />
                            <div>
                                <h3>Course Content</h3>
                                <p>Add the first content item to your course</p>
                            </div>
                        </div>
                        <Form.Item
                            name="type"
                            label="Content Type"
                            rules={[{ required: true, message: 'Please select content type' }]}
                        >
                            <Select
                                size="large"
                                disabled={loading}
                                onChange={handleContentTypeChange}
                                value={selectedContentType}
                            >
                                <Option value="text">📄 Text Content</Option>
                                <Option value="video">🎥 Video</Option>
                                <Option value="file">📎 File Attachment</Option>
                                <Option value="image">🖼️ Image</Option>
                            </Select>
                        </Form.Item>

                        {selectedContentType === 'image' ? (
                            <Form.Item
                                label="Upload Image"
                                rules={[{ required: true, message: 'Please upload an image' }]}
                            >
                                <Upload
                                    listType="picture-card"
                                    fileList={fileList}
                                    onPreview={handlePreview}
                                    onChange={handleFileChange}
                                    beforeUpload={beforeUpload}
                                    disabled={loading}
                                    maxCount={1}
                                >
                                    {fileList.length >= 1 ? null : uploadButton}
                                </Upload>
                                {fileList.length > 0 && (
                                    <div style={{ marginTop: 8 }}>
                                        <Button
                                            type="link"
                                            icon={<EyeOutlined />}
                                            onClick={() => handlePreview(fileList[0])}
                                            size="small"
                                        >
                                            Preview Image
                                        </Button>
                                    </div>
                                )}
                            </Form.Item>
                        ) : (
                            <Form.Item
                                name="content"
                                label="Content"
                                rules={[
                                    { required: true, message: 'Content is required' },
                                    { min: 10, message: 'Content must be at least 10 characters' }
                                ]}
                            >
                                <TextArea
                                    placeholder="Detailed content for this section"
                                    rows={5}
                                    disabled={loading}
                                    showCount
                                />
                            </Form.Item>
                        )}

                        <div className="info-box">
                            <div>💡</div>
                            <p>
                                <strong>Note:</strong> You can add more content later. This is just the first piece to get started.
                            </p>
                        </div>
                    </Form>
                </div>
            </div>

            <div className="modal-footer">
                <Button
                    onClick={handleBack}
                    disabled={loading}
                    size="large"
                    icon={currentStep === 0 ? null : <ArrowLeftOutlined />}
                >
                    {currentStep === 0 ? 'Cancel' : 'Back'}
                </Button>

                <Button
                    type="primary"
                    onClick={currentStep === 0 ? handleCourseSubmit : handleContentSubmit}
                    loading={loading}
                    size="large"
                    className="submit-btn"
                    disabled={currentStep === 1 && selectedContentType === 'image' && fileList.length === 0}
                >
                    {currentStep === 0 ? 'Create Course & Continue' : 'Complete Setup'}
                </Button>
            </div>

            {/* Image Preview Modal */}
            <Modal
                open={previewVisible}
                title="Image Preview"
                footer={null}
                onCancel={() => setPreviewVisible(false)}
                centered
            >
                <img alt="preview" style={{ width: '100%' }} src={previewImage} />
            </Modal>
        </Modal>
    );
};

export default CreateCourseModal;