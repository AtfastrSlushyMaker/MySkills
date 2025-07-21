import axios from 'axios';

const API_BASE_URL = 'http://localhost:8000/api';

const api = axios.create({
    baseURL: API_BASE_URL,
    headers: {
        'Content-Type': 'application/json',
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
    updateProfile: (data) => api.put('/users/profile', data),
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

export const attendanceApi = {
    // Get attendance for a session
    getAttendanceBySession: (sessionId) => api.get(`/attendance/session/${sessionId}`),
    // Mark attendance for a user in a session
    markAttendance: (data) => api.post('/attendance', data),
    // Get attendance stats for a user
    getUserAttendanceStats: (userId) => api.get(`/attendance/user/${userId}`),
    // Get attendance stats for a session
    getSessionAttendanceStats: (sessionId) => api.get(`/attendance/session-stats/${sessionId}`),
};





// Add this function for toggling course active status
export const toggleCourseActiveApi = (courseId, isActive) =>
    api.patch(`/courses/${courseId}/toggle-active`, { is_active: isActive });
