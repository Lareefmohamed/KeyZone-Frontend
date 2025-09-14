// src/services/userService.js
import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:3000';

// Create axios instance
const api = axios.create({
  baseURL: `${API_URL}/api/users`,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 10000, // 10 second timeout
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
    console.error('Request interceptor error:', error);
    return Promise.reject(error);
  }
);

// Response interceptor to handle errors
api.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    console.error('API Error:', error);
    
    // Handle different error scenarios
    if (error.response) {
      // Server responded with error status
      const { status, data } = error.response;
      
      if (status === 401) {
        // Only redirect to login if we're not already on login/register pages
        const currentPath = window.location.pathname;
        const publicPaths = ['/login', '/register', '/', '/products'];
        const isPublicPath = publicPaths.some(path => currentPath.startsWith(path));
        
        if (!isPublicPath) {
          localStorage.removeItem('token');
          window.location.href = '/login?message=Session expired. Please login again.';
        }
      }
      
      // Enhance error message
      if (data?.message) {
        error.message = data.message;
      } else {
        switch (status) {
          case 400:
            error.message = 'Invalid request. Please check your input.';
            break;
          case 401:
            error.message = 'Invalid credentials. Please check your email and password.';
            break;
          case 403:
            error.message = 'Access denied. You do not have permission to perform this action.';
            break;
          case 404:
            error.message = 'The requested resource was not found.';
            break;
          case 409:
            error.message = 'A user with this email already exists.';
            break;
          case 422:
            error.message = 'Invalid data provided. Please check your input.';
            break;
          case 500:
            error.message = 'Server error. Please try again later.';
            break;
          default:
            error.message = `Request failed with status ${status}`;
        }
      }
    } else if (error.request) {
      // Network error or no response
      error.message = 'Unable to connect to the server. Please check your internet connection and try again.';
    } else {
      // Other error
      error.message = error.message || 'An unexpected error occurred. Please try again.';
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
  register: async (userData) => {
    try {
      // Validate required fields on client side
      if (!userData.username?.trim()) {
        throw new Error('Username is required');
      }
      if (!userData.email?.trim()) {
        throw new Error('Email is required');
      }
      if (!userData.password) {
        throw new Error('Password is required');
      }
      if (!userData.phone_number?.trim()) {
        throw new Error('Phone number is required');
      }
      if (!userData.address?.street?.trim()) {
        throw new Error('Street address is required');
      }

      const response = await api.post('/register', {
        ...userData,
        email: userData.email.trim().toLowerCase(),
        username: userData.username.trim(),
        phone_number: userData.phone_number.trim()
      });

      return response;
    } catch (error) {
      console.error('Registration service error:', error);
      throw error;
    }
  },

  // Login user
  login: async (credentials) => {
    try {
      // Validate required fields
      if (!credentials.email?.trim()) {
        throw new Error('Email is required');
      }
      if (!credentials.password) {
        throw new Error('Password is required');
      }

      const response = await api.post('/login', {
        email: credentials.email.trim().toLowerCase(),
        password: credentials.password
      });

      return response;
    } catch (error) {
      console.error('Login service error:', error);
      throw error;
    }
  },

  // Get user profile
  getProfile: async () => {
    try {
      const response = await api.get('/profile');
      return response;
    } catch (error) {
      console.error('Get profile service error:', error);
      throw error;
    }
  },

  // Update user profile
  updateProfile: async (profileData) => {
    try {
      if (!profileData) {
        throw new Error('Profile data is required');
      }

      const response = await api.put('/profile', profileData);
      return response;
    } catch (error) {
      console.error('Update profile service error:', error);
      throw error;
    }
  },

  // Change password
  changePassword: async (passwordData) => {
    try {
      if (!passwordData.currentPassword) {
        throw new Error('Current password is required');
      }
      if (!passwordData.newPassword) {
        throw new Error('New password is required');
      }

      const response = await api.put('/change-password', passwordData);
      return response;
    } catch (error) {
      console.error('Change password service error:', error);
      throw error;
    }
  },

  // Get user by ID (Admin only)
  getUserById: async (userId) => {
    try {
      if (!userId) {
        throw new Error('User ID is required');
      }

      const response = await api.get(`/${userId}`);
      return response;
    } catch (error) {
      console.error('Get user by ID service error:', error);
      throw error;
    }
  },

  // Get all users (Admin only)
  getAllUsers: async (params = {}) => {
    try {
      const response = await api.get('/', { params });
      return response;
    } catch (error) {
      console.error('Get all users service error:', error);
      throw error;
    }
  },

  // Update user (Admin only)
  updateUser: async (userId, userData) => {
    try {
      if (!userId) {
        throw new Error('User ID is required');
      }
      if (!userData) {
        throw new Error('User data is required');
      }

      const response = await api.put(`/${userId}`, userData);
      return response;
    } catch (error) {
      console.error('Update user service error:', error);
      throw error;
    }
  },

  // Delete user (Admin only)
  deleteUser: async (userId) => {
    try {
      if (!userId) {
        throw new Error('User ID is required');
      }

      const response = await api.delete(`/${userId}`);
      return response;
    } catch (error) {
      console.error('Delete user service error:', error);
      throw error;
    }
  },
};

export default userService;