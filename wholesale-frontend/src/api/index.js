import axios from 'axios';

const API_URL = 'http://localhost:3000'; // Your backend URL

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add this interceptor to include the token in all requests
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
}, (error) => {
  return Promise.reject(error);
});

export const getProducts = () => api.get('/inventory/products');
export const getSuppliers = () => api.get('/suppliers');
export const login = (credentials) => api.post('/auth/login', credentials);
export const register = (userData) => api.post('/auth/register', userData);
export const getStoreName = () => api.get('/store/name');
export const getProfile = () => api.get('/profile');
export const updateProfile = (profileData) => api.put('/profile', profileData);
export const submitKYC = () => api.post('/profile/kyc');

export default api;
