import axios from 'axios';

const API_URL = '/api';

// Create axios instance with auth header
const api = axios.create({
  baseURL: API_URL
});

// Add auth token to requests
api.interceptors.request.use(
  config => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
  },
  error => {
    return Promise.reject(error);
  }
);

export default api;
