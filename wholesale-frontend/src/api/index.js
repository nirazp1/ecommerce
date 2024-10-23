import axios from 'axios';

const API_URL = 'http://localhost:3000'; // Make sure this matches your backend port

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
export const getProfile = () => {
  console.log('Fetching profile...');
  return api.get('/profile').then(response => {
    console.log('Profile response:', response);
    return response;
  });
};
export const updateProfile = (profileData) => api.put('/profile', profileData);
export const submitKYC = () => api.post('/profile/kyc');
export const getRecentOrders = () => {
  console.log('Fetching recent orders...');
  return api.get('/orders/recent').then(response => {
    console.log('Recent orders response:', response);
    return response;
  });
};
export const getFavoriteProducts = () => {
  console.log('Fetching favorite products...');
  return api.get('/products/favorites').then(response => {
    console.log('Favorite products response:', response);
    return response;
  });
};

export default api;
