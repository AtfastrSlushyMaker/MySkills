import { useState } from 'react';
import { trainingCourseApi } from '../../services/api';
import '../../styles/myskills-modal.css';

const CreateCourseModal = ({ isOpen, onClose, session, onCourseCreated }) => {
    // State to manage form data for the new course
    const [courseData, setCourseData] = useState({
        title: '',
        description: '',
        duration_hours: '',
        is_active: true, // Defaulting to active
    });

    // State for handling validation errors from the API
    const [errors, setErrors] = useState({});

    // State for managing loading state during API calls
    const [loading, setLoading] = useState(false);

    // State for displaying success messages
    const [successMessage, setSuccessMessage] = useState('');

    // Handles changes to form input fields
    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setCourseData({
            ...courseData,
            [name]: type === 'checkbox' ? checked : value,
        });
        // Clear specific error messages as the user types/changes input
        if (errors[name]) {
            setErrors(prevErrors => {
                const newErrors = { ...prevErrors };
                delete newErrors[name];
                return newErrors;
            });
        }
    };

    // Handles form submission
    const handleSubmit = async (e) => {
        e.preventDefault(); // Prevent default browser form submission
        setLoading(true);   // Activate loading state
        setErrors({});      // Clear any previous errors
        setSuccessMessage(''); // Clear any previous success messages

        try {
            // Prepare data to be sent to the API
            const dataToSubmit = {
                ...courseData,
                training_session_id: session.id, // Link course to the specific session
                created_by: session.trainer_id,  // Assign trainer as creator
            };

            // Call the API to create the course
            const response = await trainingCourseApi.createCourse(dataToSubmit);

            // Notify parent component that a course was successfully created
            onCourseCreated(response.data);

            // Display success message
            setSuccessMessage('Course created successfully!');

            // Reset form fields after successful submission
            setCourseData({
                title: '',
                description: '',
                duration_hours: '',
                is_active: true,
            });

            // Close the modal after a short delay
            setTimeout(() => {
                setSuccessMessage('');
                onClose();
            }, 2000);

        } catch (error) {
            // Handle errors from the API response
            if (error.response && error.response.data) {
                // If the API returns validation errors, display them
                setErrors(error.response.data.errors || { general: 'An unexpected error occurred. Please try again.' });
            } else {
                // Fallback for general network or other unexpected errors
                setErrors({ general: 'An unexpected error occurred. Please try again.' });
            }
        } finally {
            setLoading(false); // Deactivate loading state regardless of success or failure
        }
    };

    // Do not render the modal if it's not open
    if (!isOpen) return null;

    return (
        // Modal Overlay: Unified glassmorphism style
        <div className="modal-overlay">
            {/* Modal Centering Container */}
            <div className="modal-container">
                {/* Main Modal Content Container: Unified glassmorphism style */}
                <div className="modal-content">
                    {/* Decorative background elements (for visual aesthetics) */}
                    <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-blue-400/20 to-indigo-400/20 rounded-full blur-3xl"></div>
                    <div className="absolute bottom-0 left-0 w-24 h-24 bg-gradient-to-br from-purple-400/20 to-pink-400/20 rounded-full blur-3xl"></div>

                    <div className="relative z-10"> {/* Ensures form content is above decorative blurs */}
                        {/* Modal Header */}
                        <div className="modal-header">
                            <h2 className="modal-title">
                                Create New Course
                            </h2>
                            {/* Close Button */}
                            <button
                                onClick={onClose}
                                className="close-button"
                                aria-label="Close modal"
                            >
                                <i className="fas fa-times text-white text-sm"></i>
                            </button>
                        </div>

                        {/* Course Creation Form */}
                        <form onSubmit={handleSubmit} className="space-y-3">
                            {/* Course Details Section */}
                            <div className="form-section">
                                <h3 className="section-header">
                                    <i className="fas fa-book section-icon info mr-2"></i>
                                    Course Details
                                </h3>
                                <div className="form-grid">
                                    {/* Title Field */}
                                    <div className="form-grid-full">
                                        <label htmlFor="title" className="form-label">Title</label>
                                        <input
                                            type="text"
                                            id="title"
                                            name="title"
                                            placeholder="e.g., Advanced React Hooks"
                                            value={courseData.title}
                                            onChange={handleChange}
                                            className="form-input"
                                            required
                                            aria-invalid={errors.title ? "true" : "false"}
                                            aria-describedby={errors.title ? "title-error" : undefined}
                                        />
                                        {errors.title && <p id="title-error" className="error-message">{errors.title[0]}</p>}
                                    </div>

                                    {/* Description Field */}
                                    <div className="form-grid-full">
                                        <label htmlFor="description" className="form-label">Description</label>
                                        <textarea
                                            id="description"
                                            name="description"
                                            placeholder="Brief overview of the course content..."
                                            value={courseData.description}
                                            onChange={handleChange}
                                            rows="3"
                                            className="form-textarea"
                                            aria-invalid={errors.description ? "true" : "false"}
                                            aria-describedby={errors.description ? "description-error" : undefined}
                                        />
                                        {errors.description && <p id="description-error" className="error-message">{errors.description[0]}</p>}
                                    </div>

                                    {/* Duration Field */}
                                    <div>
                                        <label htmlFor="duration_hours" className="form-label">Duration (Hours)</label>
                                        <input
                                            type="number"
                                            id="duration_hours"
                                            name="duration_hours"
                                            placeholder="e.g., 8"
                                            value={courseData.duration_hours}
                                            onChange={handleChange}
                                            min="0.5"
                                            step="0.5"
                                            className="form-input"
                                            required
                                            aria-invalid={errors.duration_hours ? "true" : "false"}
                                            aria-describedby={errors.duration_hours ? "duration-error" : undefined}
                                        />
                                        {errors.duration_hours && <p id="duration-error" className="error-message">{errors.duration_hours[0]}</p>}
                                    </div>
                                </div>
                            </div>

                            {/* Success Message Display */}
                            {successMessage && (
                                <div className="success-message">
                                    <i className="fas fa-check-circle mr-2"></i>
                                    {successMessage}
                                </div>
                            )}

                            {/* General Error Message Display */}
                            {errors.general && (
                                <div className="general-error">
                                    <i className="fas fa-exclamation-triangle mr-2"></i>
                                    {errors.general}
                                </div>
                            )}

                            {/* Action Buttons */}
                            <div className="button-container">
                                {/* Cancel Button */}
                                <button
                                    type="button"
                                    onClick={onClose}
                                    disabled={loading}
                                    className="button button-cancel"
                                >
                                    Cancel
                                </button>
                                {/* Create Course Submit Button */}
                                <button
                                    type="submit"
                                    disabled={loading}
                                    className="button button-submit"
                                >
                                    {loading ? (
                                        <>
                                            <div className="loading-spinner"></div>
                                            Creating...
                                        </>
                                    ) : (
                                        <>
                                            <i className="fas fa-plus button-icon"></i>
                                            Create Course
                                        </>
                                    )}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CreateCourseModal;