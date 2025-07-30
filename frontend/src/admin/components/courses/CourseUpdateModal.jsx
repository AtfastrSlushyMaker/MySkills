import React, { useEffect, useState } from "react";
import { Modal, Form, Input, Button, Select, notification, Upload, Image, Spin } from "antd";
import { UploadOutlined, BookOutlined } from '@ant-design/icons';
import { trainingCourseApi, courseContentApi } from '../../../services/api';

const { TextArea } = Input;
const { Option } = Select;

function CourseUpdateModal({ visible, course, onSuccess, onCancel }) {
    // CSS-in-JS styles to ensure proper isolation
    const globalStyles = `
    .backoffice-course-update-modal .ant-input,
    .backoffice-course-update-modal .ant-input-number,
    .backoffice-course-update-modal .ant-select-selector,
    .backoffice-course-update-modal .ant-input-affix-wrapper {
        background-color: #ffffff !important;
        color: #1f2937 !important;
        border-color: #d1d5db !important;
    }

    .backoffice-course-update-modal .ant-input::placeholder,
    .backoffice-course-update-modal .ant-input-number input::placeholder {
        color: #9ca3af !important;
    }

    .backoffice-course-update-modal .ant-select-selection-placeholder {
        color: #9ca3af !important;
    }

    .backoffice-course-update-modal .ant-form-item-label > label {
        color: #374151 !important;
        font-weight: 500 !important;
    }

    .backoffice-course-update-modal .ant-input:focus,
    .backoffice-course-update-modal .ant-input-focused,
    .backoffice-course-update-modal .ant-input-number:focus,
    .backoffice-course-update-modal .ant-input-number-focused,
    .backoffice-course-update-modal .ant-select-focused .ant-select-selector {
        border-color: #06b6d4 !important;
        box-shadow: 0 0 0 2px rgba(6, 182, 212, 0.1) !important;
    }
    `;

    // Inject styles
    useEffect(() => {
        const styleId = 'backoffice-course-modal-styles';
        if (!document.getElementById(styleId)) {
            const styleElement = document.createElement('style');
            styleElement.id = styleId;
            styleElement.textContent = globalStyles;
            document.head.appendChild(styleElement);
        }

        return () => {
            // Cleanup on unmount
            const styleElement = document.getElementById(styleId);
            if (styleElement) {
                styleElement.remove();
            }
        };
    }, []);
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
                            setImagePreview(content.content);
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

    // Scoped styles object
    const modalStyles = {
        title: {
            display: 'flex',
            alignItems: 'center',
            gap: '12px',
            fontSize: '20px',
            fontWeight: 'bold',
            color: '#1f2937',
            borderBottom: '1px solid #e5e7eb',
            paddingBottom: '16px'
        },
        titleIcon: {
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            width: '40px',
            height: '40px',
            background: 'linear-gradient(135deg, #06b6d4 0%, #3b82f6 100%)',
            borderRadius: '50%',
            color: 'white'
        },
        titleText: {
            background: 'linear-gradient(135deg, #0891b2 0%, #2563eb 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text'
        },
        modalBody: {
            padding: '24px',
            background: 'linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%)'
        },
        contentWrapper: {
            backgroundColor: 'white',
            borderRadius: '8px',
            padding: '24px',
            boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1)',
            border: '1px solid #e5e7eb'
        },
        headerSection: {
            background: 'linear-gradient(135deg, #ecfdf5 0%, #dbeafe 100%)',
            padding: '16px',
            borderRadius: '8px',
            marginBottom: '24px',
            borderLeft: '4px solid #06b6d4'
        },
        headerContent: {
            display: 'flex',
            alignItems: 'center',
            gap: '12px'
        },
        headerIcon: {
            width: '32px',
            height: '32px',
            background: 'linear-gradient(135deg, #06b6d4 0%, #3b82f6 100%)',
            borderRadius: '50%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
        },
        headerTitle: {
            fontSize: '18px',
            fontWeight: '600',
            color: '#1f2937',
            marginBottom: '4px'
        },
        headerSubtitle: {
            color: '#6b7280',
            fontSize: '14px'
        },
        loadingWrapper: {
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '48px 0'
        },
        loadingText: {
            marginLeft: '12px',
            color: '#6b7280'
        },
        label: {
            color: '#374151',
            fontWeight: '500'
        },
        contentSection: {
            background: 'linear-gradient(135deg, #eff6ff 0%, #ecfdf5 100%)',
            padding: '16px',
            borderRadius: '8px',
            border: '1px solid #bfdbfe',
            marginBottom: '16px'
        },
        contentSectionTitle: {
            color: '#1f2937',
            fontWeight: '500',
            marginBottom: '12px',
            display: 'flex',
            alignItems: 'center',
            gap: '8px'
        },
        contentIcon: {
            width: '24px',
            height: '24px',
            background: 'linear-gradient(135deg, #3b82f6 0%, #06b6d4 100%)',
            borderRadius: '50%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
        },
        imagePreviewWrapper: {
            backgroundColor: 'white',
            padding: '12px',
            borderRadius: '8px',
            border: '1px solid #e5e7eb'
        },
        imagePreviewText: {
            fontSize: '14px',
            color: '#6b7280',
            marginBottom: '8px',
            fontWeight: '500'
        },
        footer: {
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            paddingTop: '16px',
            borderTop: '1px solid #e5e7eb'
        }
    };

    return (
        <Modal
            title={
                <div style={modalStyles.title}>
                    <div style={modalStyles.titleIcon}>
                        <BookOutlined style={{ fontSize: '18px' }} />
                    </div>
                    <span style={modalStyles.titleText}>
                        Update Course
                    </span>
                </div>
            }
            open={visible}
            onCancel={handleCancel}
            afterClose={handleCancel}
            footer={null}
            className="backoffice-course-update-modal"
            width={600}
            centered
            styles={{
                body: modalStyles.modalBody
            }}
            getContainer={false}
        >
            <div style={modalStyles.contentWrapper}>
                {/* Header Section */}
                <div style={modalStyles.headerSection}>
                    <div style={modalStyles.headerContent}>
                        <div style={modalStyles.headerIcon}>
                            <BookOutlined style={{ color: 'white', fontSize: '14px' }} />
                        </div>
                        <div>
                            <h3 style={modalStyles.headerTitle}>Course Information</h3>
                            <p style={modalStyles.headerSubtitle}>Update course details and content</p>
                        </div>
                    </div>
                </div>

                {contentLoading ? (
                    <div style={modalStyles.loadingWrapper}>
                        <Spin size="large" />
                        <span style={modalStyles.loadingText}>Loading course data...</span>
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
                            label={<span style={modalStyles.label}>Course Title</span>}
                            rules={[{ required: true, message: "Please enter the course title" }]}
                        >
                            <Input
                                placeholder="Course Title"
                                size="large"
                                style={{
                                    borderRadius: '8px',
                                    borderColor: '#d1d5db',
                                    backgroundColor: '#ffffff',
                                    color: '#1f2937'
                                }}
                                autoFocus
                            />
                        </Form.Item>

                        <Form.Item
                            name="description"
                            label={<span style={modalStyles.label}>Description</span>}
                            rules={[{ required: true, message: "Please enter a description" }]}
                        >
                            <TextArea
                                placeholder="Description"
                                size="large"
                                style={{
                                    borderRadius: '8px',
                                    borderColor: '#d1d5db',
                                    backgroundColor: '#ffffff',
                                    color: '#1f2937'
                                }}
                                rows={4}
                                showCount
                                maxLength={500}
                            />
                        </Form.Item>

                        <Form.Item
                            name="duration_hours"
                            label={<span style={modalStyles.label}>Duration (Hours)</span>}
                            rules={[{ required: true, message: 'Duration is required' }]}
                        >
                            <Input
                                type="number"
                                min="0.5"
                                max="100"
                                step="0.5"
                                placeholder="e.g., 8.5"
                                size="large"
                                style={{
                                    borderRadius: '8px',
                                    borderColor: '#d1d5db',
                                    backgroundColor: '#ffffff',
                                    color: '#1f2937'
                                }}
                                addonAfter="hours"
                            />
                        </Form.Item>

                        {/* Content Section */}
                        <div style={modalStyles.contentSection}>
                            <h4 style={modalStyles.contentSectionTitle}>
                                <div style={modalStyles.contentIcon}>
                                    <span style={{ color: 'white', fontSize: '12px' }}>📝</span>
                                </div>
                                Course Content
                            </h4>

                            <Form.Item
                                name="type"
                                label={<span style={modalStyles.label}>Content Type</span>}
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
                                    style={{
                                        borderRadius: '8px'
                                    }}
                                    styles={{
                                        popup: {
                                            root: {
                                                backgroundColor: '#ffffff',
                                                color: '#1f2937'
                                            }
                                        }
                                    }}
                                >
                                    <Option value="text">📝 Text Content</Option>
                                    <Option value="video">🎥 Video</Option>
                                    <Option value="file">📎 File Attachment</Option>
                                    <Option value="image">🖼️ Image</Option>
                                </Select>
                            </Form.Item>

                            {contentType === 'image' ? (
                                <Form.Item label={<span style={modalStyles.label}>Upload Image</span>} required>
                                    <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
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
                                                style={{
                                                    background: 'linear-gradient(135deg, #06b6d4 0%, #3b82f6 100%)',
                                                    color: 'white',
                                                    border: 'none',
                                                    borderRadius: '8px'
                                                }}
                                            >
                                                Select Image
                                            </Button>
                                        </Upload>
                                        {imagePreview && (
                                            <div style={modalStyles.imagePreviewWrapper}>
                                                <p style={modalStyles.imagePreviewText}>Current Image:</p>
                                                <Image
                                                    src={imagePreview}
                                                    alt="Preview"
                                                    width={150}
                                                    style={{
                                                        borderRadius: '8px',
                                                        border: '2px solid #06b6d4'
                                                    }}
                                                />
                                            </div>
                                        )}
                                    </div>
                                </Form.Item>
                            ) : (
                                <Form.Item
                                    name="content"
                                    label={<span style={modalStyles.label}>Content</span>}
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
                                        style={{
                                            borderRadius: '8px',
                                            borderColor: '#d1d5db',
                                            backgroundColor: '#ffffff',
                                            color: '#1f2937'
                                        }}
                                    />
                                </Form.Item>
                            )}
                        </div>

                        {/* Footer Buttons */}
                        <div style={modalStyles.footer}>
                            <Button
                                onClick={handleCancel}
                                disabled={loading}
                                size="large"
                                style={{ borderRadius: '8px' }}
                            >
                                Cancel
                            </Button>

                            <Button
                                type="primary"
                                htmlType="submit"
                                loading={loading}
                                size="large"
                                style={{
                                    background: 'linear-gradient(135deg, #06b6d4 0%, #3b82f6 100%)',
                                    border: 'none',
                                    borderRadius: '8px'
                                }}
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