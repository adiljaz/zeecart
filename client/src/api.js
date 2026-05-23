import axios from 'axios';
import { useAuthStore } from './store/useAuthStore';

const API_URL = import.meta.env.VITE_API_URL || (import.meta.env.PROD ? 'https://zeecart-backend.onrender.com' : 'http://localhost:5000');

const api = axios.create({
  baseURL: API_URL,
});

// Add token to requests for admin routes
api.interceptors.request.use(
  (config) => {
    const token = useAuthStore.getState().adminToken;
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

export default api;
