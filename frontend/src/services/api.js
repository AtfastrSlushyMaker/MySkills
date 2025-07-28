
import axios from 'axios';

const API_BASE_URL = 'http://localhost:8000/api';

const api = axios.create({
    baseURL: API_BASE_URL,
    headers: {
        'Accept': 'application/json',
    },
    withCredentials: true,
})

export const setAuthToken = (token) => {
    if (token) {
        api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    } else {
        delete api.defaults.headers.common['Authorization'];
    }
}

export const systemHealthApi = {
    getHealthStats: () => api.get('/system-health'),
}

export const userApi = {
    // Authentication
    login: (data) => api.post('/login', data),
    register: (data) => api.post('/register', data),
    logout: () => api.post('/logout'),

    createUser: (date) => api.post('/users', date),
    updateUser: (id, data) => api.put(`/users/${id}`, data),
    deleteUser: (id) => api.delete(`/users/${id}`),
    getUser: (id) => api.get(`/users/${id}`),

    // Profile Management
    getProfile: () => api.get('/me'),
    updateProfile: (data) => {
        // Always use POST for profile updates (FormData or JSON)
        const headers = {};
        return api.post('/users/profile', data, { headers });
    },
    changePassword: (data) => api.post('/users/change-password', data),

    // Password Reset
    resetPassword: (data) => api.post('/password/reset', data),

    // Email Verification
    verifyEmail: (data) => api.post('/email/verify', data),
    resendVerification: () => api.post('/email/resend'),

    // Skills Management (future feature)
    getUserSkills: () => api.get('/skills'),
    addUserSkill: (data) => api.post('/skills', data),
    updateUserSkill: (id, data) => api.put(`/skills/${id}`, data),
    deleteUserSkill: (id) => api.delete(`/skills/${id}`),

    // Course Management (for trainers)
    getUserCourses: () => api.get('/courses'),
    addUserCourse: (data) => api.post('/courses', data),
    updateUserCourse: (id, data) => api.put(`/courses/${id}`, data),
    deleteUserCourse: (id) => api.delete(`/courses/${id}`),
    getAllTrainers: () => api.get('/users/trainers'),
    getAllCoordinators: () => api.get('/users/coordinators'),

    getUserCount: () => api.get('/users/count'),
    getUsers: () => api.get('/users'),

    getUserStatistics: () => api.get('/users/statistics'),
};

export const notificationApi = {
    getNotifications: () => api.get('/notifications'), // admin only
    getUserNotifications: () => api.get('/user/notifications'), // for regular users
    getNotification: (id) => api.get(`/notifications/${id}`),
    sendNotification: (data) => api.post('/notifications', data),
    getUnreadNotifications: () => api.get('/notifications/unread'),
    markNotificationAsRead: (id) => api.post(`/notifications/${id}/read`),
    markAllNotificationsAsRead: () => api.post('/notifications/read-all'),
    deleteNotification: (id) => api.delete(`/notifications/${id}`),
    deleteAllNotifications: () => api.delete('/notifications'),
    broadcastNotification: (data) => api.post('/notifications/broadcast', data),
    getNotificationStats: () => api.get('/notifications/stats'),
};

export const registrationApi = {
    getPendingRegistrations: (coordinatorId) => api.get(`/registrations/status/pending/${coordinatorId}`),
    getRegistrationStats: () => api.get('/registrations/dashboard/stats'),
    getGlobalRegistrationStats: () => api.get('/registrations/dashboard/global-stats'),
    approveRegistration: (id) => api.post(`/registrations/${id}/approve`),
    rejectRegistration: (id) => api.post(`/registrations/${id}/reject`),
    getRegistrationDetails: (id) => api.get(`/registrations/${id}`),
    createRegistration: (data) => api.post('/registrations', data),
    updateRegistration: (id, data) => api.put(`/registrations/${id}`, data),
    deleteRegistration: (id) => api.delete(`/registrations/${id}`),
    getConfirmedRegistrationsLoggedInUser: () => api.get('/registrations/status/confirmed'),
    getConfirmedUsersBySession: (sessionId) => api.get(`/registrations/session/${sessionId}/confirmed-users`),
    getStatusByUserAndSession: (sessionId) => api.get(`/registrations/status/${sessionId}`),
    getRegistrationsByUser: (userId) => api.get(`/registrations/user/${userId}`),
    getAllRegistrations: () => api.get('/registrations'),
    getRegistrationsBySession: (sessionId) => api.get(`/registrations/session/${sessionId}`),
};

export const trainingSessionApi = {
    getAllSessions: () => api.get('/training-sessions'),
    getSession: (id) => api.get(`/training-sessions/${id}`),
    createSession: (data) => api.post('/training-sessions', data),
    updateSession: (id, data) => api.put(`/training-sessions/${id}`, data),
    deleteSession: (id) => api.delete(`/training-sessions/${id}`),
    archiveSession: (id) => api.post(`/training-sessions/${id}/archive`),
    getSessionsByTrainer: (trainerId) => api.get(`/training-sessions/trainer/${trainerId}`),
    getSessionsByCoordinator: (coordinatorId) => api.get(`/training-sessions/coordinator/${coordinatorId}`),
    getSessionsByCategory: (categoryId) => api.get(`/training-sessions/category/${categoryId}`),
    getRecentActivityByCoordinator: (coordinatorId) => api.get(`/training-sessions/recent-activity/coordinator/${coordinatorId}`),
};

export const trainingCourseApi = {
    getAllCourses: () => api.get('/courses'),
    getCourse: (id) => api.get(`/courses/${id}`),
    createCourse: (data) => api.post('/courses', data),
    updateCourse: (id, data) => api.put(`/courses/${id}`, data),
    deleteCourse: (id) => api.delete(`/courses/${id}`),
    getCoursesByTrainer: (trainerId) => api.get(`/courses/trainer/${trainerId}`),
};

export const categoryApi = {
    getAllCategories: () => api.get('/categories'),
    getCategory: (id) => api.get(`/categories/${id}`),
    createCategory: (data) => api.post('/categories', data),
    updateCategory: (id, data) => api.put(`/categories/${id}`, data),
    deleteCategory: (id) => api.delete(`/categories/${id}`)
};

export const feedbackApi = {
    // Get all feedback
    getAllFeedback: () => api.get('/feedbacks'),
    // Get all feedback for a session
    getFeedbackBySession: (sessionId) => api.get(`/feedbacks/session/${sessionId}`),
    // Get all feedback for a user
    getFeedbackByUser: (userId) => api.get(`/feedbacks/user/${userId}`),
    // Create feedback (requires registration_id, training_session_id, rating, comment)
    submitFeedback: (data) => api.post('/feedbacks', data),
    // Update feedback
    updateFeedback: (id, data) => api.put(`/feedbacks/${id}`, data),
    // Delete feedback
    deleteFeedback: (id) => api.delete(`/feedbacks/${id}`),
};


// Add this function for toggling course active status
export const toggleCourseActiveApi = (courseId, isActive) =>
    api.patch(`/courses/${courseId}/toggle-active`, { is_active: isActive });


export const courseCompletionApi = {
    getAll: () => api.get('/course-completions'),
    get: (id) => api.get(`/course-completions/${id}`),
    create: (data) => api.post('/course-completions', data),
    update: (id, data) => api.put(`/course-completions/${id}`, data),
    delete: (id) => api.delete(`/course-completions/${id}`),
    markAsComplete: async ({ user_id, training_course_id }) => {
        // Find the course completion record for this user and course
        const all = await api.get('/course-completions');
        const found = Array.isArray(all.data)
            ? all.data.find(cc => cc.user_id === user_id && cc.training_course_id === training_course_id)
            : null;
        if (found) {
            // Update the status to completed
            return api.put(`/course-completions/${found.id}`, {
                status: 'completed',
                completed_at: new Date().toISOString(),
            });
        } else {
            // Create a new completion record as completed
            return api.post('/course-completions', {
                user_id,
                training_course_id,
                status: 'completed',
                completed_at: new Date().toISOString(),
            });
        }
    },
};

export const courseContentApi = {
    getAll: (params = {}) => {
        // Support filtering by training_course_id
        const queryString = new URLSearchParams(params).toString();
        const url = queryString ? `/course-contents?${queryString}` : '/course-contents';
        return api.get(url);
    },

    get: (id) => api.get(`/course-contents/${id}`),

    create: (data) => {
        if (data instanceof FormData) {
            return api.post('/course-contents', data, {
                headers: { 'Content-Type': 'multipart/form-data' }
            });
        } else {
            return api.post('/course-contents', data);
        }
    },

    update: (id, data) => {
        if (data instanceof FormData) {
            // For FormData updates, use POST with method spoofing
            // This ensures Laravel properly handles file uploads
            // Don't add _method here - Laravel should handle PUT via the route
            return api.post(`/course-contents/${id}`, data, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                    'X-HTTP-Method-Override': 'PUT'
                }
            }).then(response => {
                return response;
            }).catch(error => {
                throw error;
            });
        } else {
            // For regular JSON updates, use PUT
            return api.put(`/course-contents/${id}`, data, {
                headers: { 'Content-Type': 'application/json' }
            }).then(response => {
                return response;
            }).catch(error => {
                throw error;
            });
        }
    },

    delete: (id) => api.delete(`/course-contents/${id}`),

    // Helper method to get content by course
    getByCourse: (trainingCourseId) => {
        return api.get(`/course-contents?training_course_id=${trainingCourseId}`);
    }
};

export const imageApi = {
    uploadImage: (formData) => api.post('/images/upload', formData, {
        headers: {
            'Content-Type': 'multipart/form-data',
        },
    }),
};