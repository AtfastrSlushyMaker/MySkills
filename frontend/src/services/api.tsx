import axios from 'axios';

const API_BASE_URL = 'http://localhost:8000/api';

const api = axios.create({
    baseURL: API_BASE_URL,
    headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
    },
})

export const setAuthToken = (token: string | null) => {
    if (token) {
        api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    } else {
        delete api.defaults.headers.common['Authorization'];
    }
}

export const userApi = {
    login: (data: { email: string; password: string }) => api.post('/login', data),
    register: (data: { name: string; email: string; password: string }) => api.post('/register', data),
    getProfile: () => api.get('/profile'),
    updateProfile: (data: { name?: string; email?: string; password?: string }) => api.put('/profile', data),
    logout: () => api.post('/logout'),
    resetPassword: (data: { email: string }) => api.post('/password/reset', data),
    changePassword: (data: { current_password: string; new_password: string }) => api.post('/password/change', data),
    verifyEmail: (data: { email: string, token: string }) => api.post('/email/verify', data),
    resendVerification: () => api.post('/email/resend'),
    getNotifications: () => api.get('/notifications'),
    markNotificationAsRead: (id: number) => api.post(`/notifications/${id}/read`),
    markAllNotificationsAsRead: () => api.post('/notifications/read-all'),
    deleteNotification: (id: number) => api.delete(`/notifications/${id}`),
    deleteAllNotifications: () => api.delete('/notifications'),
    getUserSkills: () => api.get('/skills'),
    addUserSkill: (data: { skill_name: string }) => api.post('/skills', data),
    updateUserSkill: (id: number, data: { skill_name: string }) => api.put(`/skills/${id}`, data),
    deleteUserSkill: (id: number) => api.delete(`/skills/${id}`),
    getUserCourses: () => api.get('/courses'),
    addUserCourse: (data: { course_name: string; description: string }) => api.post('/courses', data),
    updateUserCourse: (id: number, data: { course_name: string; description: string }) => api.put(`/courses/${id}`, data),
    deleteUserCourse: (id: number) => api.delete(`/courses/${id}`)
};
