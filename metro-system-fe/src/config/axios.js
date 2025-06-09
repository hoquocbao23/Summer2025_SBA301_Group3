import axios from 'axios';

const axiosInstance = axios.create({
    baseURL: 'http://localhost:8080/api/v1',
    headers: {
                
        'Content-Type': 'application/json',
        'Accept': 'application/json',   
        
    },
    withCredentials: true
});

// Add a request interceptor
axiosInstance.interceptors.request.use(
    (config) => {
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