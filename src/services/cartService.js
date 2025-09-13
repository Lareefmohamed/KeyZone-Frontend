// src/services/cartService.js
import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:3000';

// Create axios instance
const api = axios.create({
  baseURL: `${API_URL}/api/cart`,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add auth token
api.interceptors.request.use(
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

// Response interceptor to handle errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

const cartService = {
  // Get user's cart
  getCart: () => {
    return api.get('/');
  },

  // Add item to cart
  addToCart: (itemData) => {
    return api.post('/add', itemData);
  },

  // Update cart item quantity
  updateCartItem: (itemData) => {
    return api.put('/update', itemData);
  },

  // Remove item from cart
  removeFromCart: (productId) => {
    return api.delete(`/remove/${productId}`);
  },

  // Clear cart
  clearCart: () => {
    return api.delete('/clear');
  },
};

export default cartService;