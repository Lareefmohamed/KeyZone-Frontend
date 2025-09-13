// src/services/userService.js
import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:3000';

// Create axios instance
const api = axios.create({
  baseURL: `${API_URL}/api/users`,
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

const userService = {
  // Set auth token for API calls
  setAuthToken: (token) => {
    if (token) {
      api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    } else {
      delete api.defaults.headers.common['Authorization'];
    }
  },

  // Remove auth token
  removeAuthToken: () => {
    delete api.defaults.headers.common['Authorization'];
  },

  // Register new user
  register: (userData) => {
    return api.post('/register', userData);
  },

  // Login user
  login: (credentials) => {
    return api.post('/login', credentials);
  },

  // Get user profile
  getProfile: () => {
    return api.get('/profile');
  },

  // Update user profile
  updateProfile: (profileData) => {
    return api.put('/profile', profileData);
  },

  // Change password
  changePassword: (passwordData) => {
    return api.put('/change-password', passwordData);
  },

  // Get user by ID (Admin only)
  getUserById: (userId) => {
    return api.get(`/${userId}`);
  },

  // Get all users (Admin only)
  getAllUsers: (params = {}) => {
    return api.get('/', { params });
  },

  // Update user (Admin only)
  updateUser: (userId, userData) => {
    return api.put(`/${userId}`, userData);
  },

  // Delete user (Admin only)
  deleteUser: (userId) => {
    return api.delete(`/${userId}`);
  },
};

export default userService;