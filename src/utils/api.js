import axios from 'axios';

// API Base URL - Change this for production
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';

// Create axios instance with default config
const api = axios.create({
    baseURL: API_BASE_URL,
    headers: {
        'Content-Type': 'application/json',
    },
    timeout: 30000, // 30 seconds
});

// Request interceptor to add auth token
api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('access_token');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// Response interceptor for error handling
api.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response) {
            // Server responded with error
            console.error('API Error:', error.response.status, error.response.data);

            // Handle 401 Unauthorized
            if (error.response.status === 401) {
                localStorage.removeItem('access_token');
                localStorage.removeItem('user');
                window.location.href = '/';
            }
        } else if (error.request) {
            // Request made but no response
            console.error('Network Error:', error.message);
        } else {
            // Something else happened
            console.error('Error:', error.message);
        }
        return Promise.reject(error);
    }
);

// API endpoints
export const authAPI = {
    googleSignIn: (data) => api.post('/api/auth/google-signin', data),
    checkPhone: (phone) => api.get(`/api/auth/check-phone?phone=${phone}`),
    updatePhone: (userId, phoneNumber) =>
        api.post('/api/auth/update-phone', { user_id: userId, phone_number: phoneNumber }),
};

export const assessmentAPI = {
    getQuestions: () => api.get('/api/assessment/questions'),
    submitAssessment: (userId, data) =>
        api.post(`/api/assessment/submit?user_id=${userId}`, data),
    getStatus: (userId) => api.get(`/api/assessment/status/${userId}`),
};

export const chatAPI = {
    startSession: (userId, moodBefore) =>
        api.post(`/api/chat/start-session?user_id=${userId}`, { mood_before: moodBefore }),
    sendMessage: (userId, sessionId, message) =>
        api.post(`/api/chat/send-message?user_id=${userId}`, { session_id: sessionId, message }),
    endSession: (userId, sessionId, moodAfter) =>
        api.post(`/api/chat/end-session?user_id=${userId}`, { session_id: sessionId, mood_after: moodAfter }),
    getSessions: (userId) => api.get(`/api/chat/sessions/${userId}`),
    getSessionHistory: (sessionId, userId) =>
        api.get(`/api/chat/session/${sessionId}/history?user_id=${userId}`),
};

export const crisisAPI = {
    detect: (message) => api.post('/api/crisis/detect', { user_input: message }),
};

export default api;
