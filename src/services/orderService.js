// src/services/orderService.js
import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:3000';

// Create axios instance
const api = axios.create({
  baseURL: `${API_URL}/api/orders`,
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

const orderService = {
  // Create order from cart (Checkout)
  createOrder: () => {
    return api.post('/checkout');
  },

  // Get user's orders
  getUserOrders: (params = {}) => {
    return api.get('/my-orders', { params });
  },

  // Get order by ID
  getOrderById: (orderId) => {
    return api.get(`/${orderId}`);
  },

  // Get all orders (Admin only)
  getAllOrders: (params = {}) => {
    return api.get('/', { params });
  },

  // Get order statistics (Admin only)
  getOrderStats: () => {
    return api.get('/admin/stats');
  },
};

export default orderService;