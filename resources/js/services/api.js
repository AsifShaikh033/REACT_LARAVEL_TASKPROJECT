import axios from 'axios';

const api = axios.create({
    baseURL: import.meta.env.VITE_API_BASE_URL || '/api',
    headers: {
        Accept: 'application/json',
    },
});

// Attach the token to every API request when available.
api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('taskflow_token');

        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }

        return config;
    },
    (error) => Promise.reject(error)
);

// Handle expired or revoked tokens globally.
api.interceptors.response.use(
    (response) => response,
    (error) => {
        if (
            error.response?.status === 401 &&
            localStorage.getItem('taskflow_token')
        ) {
            window.dispatchEvent(new Event('taskflow:unauthorized'));
        }

        return Promise.reject(error);
    }
);

export default api;