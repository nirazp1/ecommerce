import axios from 'axios';

const API_URL = 'http://localhost:3000'; // Replace with your API URL

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const login = (credentials) => api.post('/auth/login', credentials);
export const register = (userData) => api.post('/auth/register', userData);
export const getProducts = () => api.get('/search/products');
export const getSuppliers = () => api.get('/suppliers');
export const updateInventory = (productId, newQuantity) => api.post('/inventory/update', { productId, newQuantity });

export default api;
