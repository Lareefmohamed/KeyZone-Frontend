// src/services/productService.js
import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:3000';

// Create axios instance
const api = axios.create({
  baseURL: `${API_URL}/api/products`,
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

const productService = {
  // Get all products with filtering and pagination
  getAllProducts: (params = {}) => {
    return api.get('/', { params });
  },

  // Get single product by ID
  getProductById: (productId) => {
    return api.get(`/${productId}`);
  },

  // Get products by category
  getProductsByCategory: (category, params = {}) => {
    return api.get(`/category/${category}`, { params });
  },

  // Create new product (Admin only)
  createProduct: (productData) => {
    return api.post('/', productData);
  },

  // Update product (Admin only)
  updateProduct: (productId, productData) => {
    return api.put(`/${productId}`, productData);
  },

  // Delete product (Admin only)
  deleteProduct: (productId) => {
    return api.delete(`/${productId}`);
  },
};

export default productService;