import axios from 'axios';

// const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';
const API_URL = 'https://mlakumulu-backend-production.up.railway.app';

const api = axios.create({
  baseURL: API_URL,
  withCredentials: true,
});

// console.log('Token:', localStorage.getItem('token'));
// console.log('User:', JSON.parse(localStorage.getItem('user') || '{}'));

// Request interceptor for adding auth token
api.interceptors.request.use(
    (config) => {
      const token = localStorage.getItem('token');
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
      return config;
    },
    (error) => Promise.reject(error)
  );
  
// Response interceptor for handling errors
api.interceptors.response.use(
(response) => response,
(error) => {
    // Handle 401 Unauthorized errors
    if (error.response && error.response.status === 401) {
    // Clear localStorage and redirect to login
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    window.location.href = '/login';
    }
    return Promise.reject(error);
}
);

export default api;