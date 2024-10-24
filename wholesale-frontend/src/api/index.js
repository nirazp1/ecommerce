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
    config.headers['Authorization'] = `Bearer ${token}`;
  }
  console.log('API request:', { url: config.url, method: config.method, headers: config.headers });
  return config;
}, (error) => {
  return Promise.reject(error);
});

export const getProducts = () => api.get('/inventory/products');
export const getSuppliers = () => api.get('/suppliers');
export const login = async (credentials) => {
  const response = await api.post('/auth/login', credentials);
  if (response.data.token) {
    localStorage.setItem('token', response.data.token);
    localStorage.setItem('userRole', response.data.role);
  }
  return response;
};
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
export const registerBusiness = (businessData) => api.post('/auth/register-business', businessData);
export const getSellerProfile = () => {
  console.log('Fetching seller profile...');
  return api.get('/seller/profile')
    .then(response => {
      console.log('Seller profile response:', response);
      return response;
    })
    .catch(error => {
      console.error('Error fetching seller profile:', error.response || error);
      throw error;
    });
};
export const updateSellerProfile = (profileData) => api.put('/seller/profile', profileData);
export const getSellerProducts = () => {
  console.log('Fetching seller products...');
  return api.get('/seller/products')
    .then(response => {
      console.log('Seller products response:', response);
      return response;
    })
    .catch(error => {
      console.error('Error fetching seller products:', error.response || error);
      throw error;
    });
};
export const addProduct = (productData) => api.post('/seller/products', productData);
export const updateProduct = (productId, productData) => api.put(`/seller/products/${productId}`, productData);
export const deleteProduct = (productId) => api.delete(`/seller/products/${productId}`);

// Add these new functions
export const getProductDetails = (productId) => Promise.resolve({
  _id: productId,
  name: 'Sample Product',
  description: 'This is a sample product description.',
  price: 99.99,
  image: 'https://via.placeholder.com/400',
  rating: 4.5,
  numReviews: 10,
  details: {
    'Brand': 'Sample Brand',
    'Model': 'Sample Model',
    'Color': 'Black'
  }
});

export const getRelatedProducts = (productId) => Promise.resolve([
  { _id: 'related1', name: 'Related Product 1', price: 89.99, image: 'https://via.placeholder.com/200' },
  { _id: 'related2', name: 'Related Product 2', price: 79.99, image: 'https://via.placeholder.com/200' },
  { _id: 'related3', name: 'Related Product 3', price: 69.99, image: 'https://via.placeholder.com/200' },
]);

export const getProductReviews = (productId) => Promise.resolve([
  { userName: 'John Doe', userAvatar: 'https://via.placeholder.com/50', rating: 5, comment: 'Great product!' },
  { userName: 'Jane Smith', userAvatar: 'https://via.placeholder.com/50', rating: 4, comment: 'Good value for money.' },
]);

// Add mock implementations for the new functions
export const getProductStock = (productId) => Promise.resolve(Math.floor(Math.random() * 100) + 1);
export const getShippingEstimate = (cart) => Promise.resolve(10.99);
export const getSuggestedProducts = (productIds) => Promise.resolve([
  { _id: 'sugg1', name: 'Suggested Product 1', price: 59.99, image: 'https://via.placeholder.com/200' },
  { _id: 'sugg2', name: 'Suggested Product 2', price: 69.99, image: 'https://via.placeholder.com/200' },
]);

export const getPopularItems = () => api.get('/products/popular');

// If you want to use mock data for now, you can use this instead:
// export const getPopularItems = () => Promise.resolve({
//   data: [
//     { _id: 'pop1', name: 'Trending Gadget', price: 129.99, image: 'https://source.unsplash.com/featured/?gadget' },
//     { _id: 'pop2', name: 'Best-selling Book', price: 19.99, image: 'https://source.unsplash.com/featured/?book' },
//     { _id: 'pop3', name: 'Popular Kitchenware', price: 79.99, image: 'https://source.unsplash.com/featured/?kitchen' },
//     { _id: 'pop4', name: 'Top-rated Electronics', price: 299.99, image: 'https://source.unsplash.com/featured/?electronics' },
//   ]
// });

export default api;
