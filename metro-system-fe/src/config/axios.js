import axios from 'axios';
import { API_BASE_URL } from './api';

const axiosInstance = axios.create({
    baseURL: API_BASE_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

// Add request interceptor if needed
axiosInstance.interceptors.request.use(
    (config) => {
        // You can add auth token here
        const token = localStorage.getItem('token');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// Add response interceptor if needed
axiosInstance.interceptors.response.use(
    (response) => response,
    (error) => {
        // Handle errors globally here
        return Promise.reject(error);
    }
);

export default axiosInstance; 