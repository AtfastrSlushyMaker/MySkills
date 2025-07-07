import axios from 'axios';

const API_BASE_URL = 'http://localhost:8000/api';

const api = axios.create({
    baseURL: API_BASE_URL,
    headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
    },
})

export const setAuthToken = (token) => {
    if (token) {
        api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    } else {
        delete api.defaults.headers.common['Authorization'];
    }
}

export const userApi = {
    // Authentication
    login: (data) => api.post('/login', data),
    register: (data) => api.post('/register', data),
    logout: () => api.post('/logout'),

    // Profile Management
    getProfile: () => api.get('/me'),
    updateProfile: (data) => api.put('/users/profile', data),
    changePassword: (data) => api.post('/users/change-password', data),

    // Password Reset
    resetPassword: (data) => api.post('/password/reset', data),

    // Email Verification
    verifyEmail: (data) => api.post('/email/verify', data),
    resendVerification: () => api.post('/email/resend'),

    // Notifications
    getNotifications: () => api.get('/notifications'),
    markNotificationAsRead: (id) => api.post(`/notifications/${id}/read`),
    markAllNotificationsAsRead: () => api.post('/notifications/read-all'),
    deleteNotification: (id) => api.delete(`/notifications/${id}`),
    deleteAllNotifications: () => api.delete('/notifications'),

    // Skills Management (future feature)
    getUserSkills: () => api.get('/skills'),
    addUserSkill: (data) => api.post('/skills', data),
    updateUserSkill: (id, data) => api.put(`/skills/${id}`, data),
    deleteUserSkill: (id) => api.delete(`/skills/${id}`),

    // Course Management (for trainers)
    getUserCourses: () => api.get('/courses'),
    addUserCourse: (data) => api.post('/courses', data),
    updateUserCourse: (id, data) => api.put(`/courses/${id}`, data),
    deleteUserCourse: (id) => api.delete(`/courses/${id}`)
};

export const registrationApi = {
    getPendingRegistrations: () => api.get('/registrations/status/pending'),
    getRegistrationStats: () => api.get('/registrations/dashboard/stats'),
    approveRegistration: (id) => api.post(`/registrations/${id}/approve`),
    rejectRegistration: (id) => api.post(`/registrations/${id}/reject`),
    getRegistrationDetails: (id) => api.get(`/registrations/${id}`),
    createRegistration: (data) => api.post('/registrations', data),
    updateRegistration: (id, data) => api.put(`/registrations/${id}`, data),
    deleteRegistration: (id) => api.delete(`/registrations/${id}`)
};
