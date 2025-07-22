import api from './api';

export const courseCompletionApi = {
    getAll: () => api.get('/course-completions'),
    get: (id) => api.get(`/course-completions/${id}`),
    create: (data) => api.post('/course-completions', data),
    update: (id, data) => api.put(`/course-completions/${id}`, data),
    delete: (id) => api.delete(`/course-completions/${id}`),
    markAsComplete: ({ user_id, training_course_id }) =>
        api.put('/course-completions/mark-complete', { user_id, training_course_id, status: 'completed', completed_at: new Date().toISOString() }),
};
