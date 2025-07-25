import React, { useState, useEffect } from 'react';
import { courseContentApi } from '../../services/api';

const EditCourseContentModal = ({ open, onClose, content, onSave, trainingCourseId }) => {
    const [type, setType] = useState(content?.type || 'text');
    const [value, setValue] = useState(content?.content || '');
    const [file, setFile] = useState(null);
    const [preview, setPreview] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    // Reset form when modal opens/closes or content changes
    useEffect(() => {
        if (open && content) {
            setType(content.type || 'text');
            setValue(content.content || '');
            setFile(null);
            setPreview(content.type === 'image' ? content.content : '');
            setError('');
        }
    }, [open, content]);

    if (!open) return null;

    const handleFileChange = (e) => {
        const selectedFile = e.target.files[0];
        setFile(selectedFile);

        if (selectedFile) {
            // Validate file size (5MB limit)
            if (selectedFile.size > 5 * 1024 * 1024) {
                setError('File size must be less than 5MB');
                setFile(null);
                setPreview('');
                return;
            }

            // Validate file type
            if (!selectedFile.type.startsWith('image/')) {
                setError('Please select a valid image file');
                setFile(null);
                setPreview('');
                return;
            }

            // Create preview
            const reader = new FileReader();
            reader.onload = (ev) => setPreview(ev.target.result);
            reader.readAsDataURL(selectedFile);
            setError(''); // Clear any previous errors
        } else {
            setPreview(content?.type === 'image' ? content?.content : '');
        }
    };

    const handleTypeChange = (newType) => {
        setType(newType);
        setError('');

        // Reset file-related state when switching away from image
        if (newType !== 'image') {
            setFile(null);
            setPreview('');
        } else if (content?.type === 'image' && content?.content) {
            // Set preview to existing image when switching to image type
            setPreview(content.content);
        }
    };

    const validateForm = () => {
        if (!type) {
            setError('Please select a content type');
            return false;
        }

        if (type === 'image') {
            // For image type, we need either a file or existing content
            if (!file && (!content?.content || content?.type !== 'image')) {
                setError('Please select an image file');
                return false;
            }
        } else {
            // For non-image types, we can have empty content
            // but let's at least trim whitespace
            setValue(prev => prev?.trim() || '');
        }

        return true;
    };

    const handleSave = async () => {
        if (!validateForm()) {
            return;
        }

        setLoading(true);
        setError('');

        try {
            let response;
            const courseId = trainingCourseId || content?.training_course_id;

            if (!courseId) {
                throw new Error('Training course ID is required');
            }

            if (type === 'image' && file) {
                // Handle new image upload
                const formData = new FormData();
                formData.append('type', type);
                formData.append('content', file);
                formData.append('training_course_id', courseId);

                // ...existing code...

                response = await courseContentApi.update(content.id, formData);
            } else {
                // Handle text content or keeping existing image
                const payload = {
                    type: type,
                    training_course_id: courseId,
                    content: type === 'image' ? (content?.content || '') : (value || '')
                };

                response = await courseContentApi.update(content.id, payload);
            }



            // Call onSave callback if provided
            if (typeof onSave === 'function') {
                onSave(response.data);
            }

            // Close modal
            onClose();
        } catch (err) {

            // Handle different types of errors
            if (err.response?.status === 422) {
                // Validation errors
                const validationErrors = err.response.data.errors;
                const errorMessages = Object.values(validationErrors).flat();
                setError(errorMessages.join(', '));
            } else if (err.response?.data?.error) {
                setError(err.response.data.error);
            } else if (err.message) {
                setError(err.message);
            } else {
                setError('Failed to update course content. Please try again.');
            }
        } finally {
            setLoading(false);
        }
    };

    const handleCancel = () => {
        if (loading) return; // Prevent closing during API call

        // Reset form state
        setType(content?.type || 'text');
        setValue(content?.content || '');
        setFile(null);
        setPreview(content?.type === 'image' ? content?.content : '');
        setError('');

        onClose();
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
            <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-md relative">
                {loading && (
                    <div className="absolute inset-0 bg-white bg-opacity-60 flex items-center justify-center z-50 rounded-lg">
                        <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-blue-500 border-solid"></div>
                    </div>
                )}

                <h2 className="text-xl font-bold mb-4">Edit Course Content</h2>

                {error && (
                    <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
                        {error}
                    </div>
                )}

                <div className="mb-4">
                    <label className="block mb-2 font-medium text-gray-700">
                        Content Type
                    </label>
                    <select
                        value={type}
                        onChange={(e) => handleTypeChange(e.target.value)}
                        className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                        disabled={loading}
                    >
                        <option value="text">Text</option>
                        <option value="video">Video</option>
                        <option value="image">Image</option>
                        <option value="file">File</option>
                    </select>
                </div>

                <div className="mb-6">
                    <label className="block mb-2 font-medium text-gray-700">
                        Content
                    </label>
                    {type === 'image' ? (
                        <div className="space-y-3">
                            <input
                                type="file"
                                accept="image/*"
                                onChange={handleFileChange}
                                className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                                disabled={loading}
                            />
                            {preview && (
                                <div className="border border-gray-300 rounded p-2">
                                    <img
                                        src={preview}
                                        alt="Preview"
                                        className="w-full max-h-64 object-contain rounded"
                                        onError={() => setPreview('')}
                                    />
                                </div>
                            )}
                            {!file && content?.type === 'image' && (
                                <p className="text-sm text-gray-500">
                                    Current image will be kept if no new file is selected
                                </p>
                            )}
                        </div>
                    ) : (
                        <textarea
                            value={value}
                            onChange={(e) => setValue(e.target.value)}
                            className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                            rows={4}
                            placeholder={`Enter ${type} content...`}
                            disabled={loading}
                        />
                    )}
                </div>

                <div className="flex gap-2 justify-end">
                    <button
                        className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
                        onClick={handleSave}
                        disabled={loading}
                    >
                        {loading ? 'Saving...' : 'Save'}
                    </button>
                    <button
                        className="px-4 py-2 bg-gray-300 text-gray-700 rounded hover:bg-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-300 disabled:opacity-50 disabled:cursor-not-allowed"
                        onClick={handleCancel}
                        disabled={loading}
                    >
                        Cancel
                    </button>
                </div>
            </div>
        </div>
    );
};

export default EditCourseContentModal;