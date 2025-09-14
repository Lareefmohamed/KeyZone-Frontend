// src/constants/index.js

// Currency Configuration
export const CURRENCY = {
  CODE: 'LKR',
  SYMBOL: 'Rs',
  NAME: 'Sri Lankan Rupee',
  LOCALE: 'en-LK',
  DECIMAL_PLACES: 2
};

// App Configuration
export const APP_CONFIG = {
  NAME: 'KeyZone',
  TAGLINE: 'Your premium destination for digital game keys and software licenses',
  DESCRIPTION: 'KeyZone is Sri Lanka\'s leading digital marketplace for authentic game keys and professional software licenses.',
  COUNTRY: 'Sri Lanka',
  CURRENCY: CURRENCY.CODE
};

// Product Categories
export const PRODUCT_CATEGORIES = {
  GAMES: 'Games',
  SOFTWARE: 'Softwares'
};

// Order Status
export const ORDER_STATUS = {
  PENDING: 'pending',
  PROCESSING: 'processing',
  COMPLETED: 'completed',
  CANCELLED: 'cancelled'
};

// User Roles
export const USER_ROLES = {
  ADMIN: 'admin',
  USER: 'user'
};

// API Endpoints Base
export const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:3000';

// Pagination
export const PAGINATION = {
  DEFAULT_PAGE: 1,
  DEFAULT_LIMIT: 12,
  MAX_LIMIT: 100
};

// Price Ranges for Filters (in LKR)
export const PRICE_RANGES = [
  { label: 'Under Rs 5,000', min: 0, max: 5000 },
  { label: 'Rs 5,000 - Rs 15,000', min: 5000, max: 15000 },
  { label: 'Rs 15,000 - Rs 30,000', min: 15000, max: 30000 },
  { label: 'Rs 30,000 - Rs 60,000', min: 30000, max: 60000 },
  { label: 'Above Rs 60,000', min: 60000, max: Infinity }
];

// Stock Status
export const STOCK_STATUS = {
  IN_STOCK: 'in_stock',
  LOW_STOCK: 'low_stock',
  OUT_OF_STOCK: 'out_of_stock'
};

// Stock Thresholds
export const STOCK_THRESHOLDS = {
  LOW_STOCK: 10,
  OUT_OF_STOCK: 0
};

// Default Images
export const DEFAULT_IMAGES = {
  PRODUCT_PLACEHOLDER: '/images/placeholder-product.jpg',
  USER_AVATAR: '/images/default-avatar.png',
  LOGO: '/images/keyzone-logo.png'
};

// Contact Information
export const CONTACT_INFO = {
  EMAIL: 'support@keyzone.lk',
  PHONE: '+94 11 123 4567',
  ADDRESS: {
    STREET: '123 Digital Avenue',
    CITY: 'Colombo',
    PROVINCE: 'Western Province',
    POSTAL_CODE: '00100',
    COUNTRY: 'Sri Lanka'
  }
};

// Social Media Links
export const SOCIAL_LINKS = {
  FACEBOOK: 'https://facebook.com/keyzonelk',
  TWITTER: 'https://twitter.com/keyzonelk',
  INSTAGRAM: 'https://instagram.com/keyzonelk',
  LINKEDIN: 'https://linkedin.com/company/keyzonelk'
};

// Feature Flags
export const FEATURES = {
  ENABLE_REVIEWS: true,
  ENABLE_WISHLIST: true,
  ENABLE_NOTIFICATIONS: true,
  ENABLE_DARK_MODE: true,
  ENABLE_MULTI_LANGUAGE: false
};

export default {
  CURRENCY,
  APP_CONFIG,
  PRODUCT_CATEGORIES,
  ORDER_STATUS,
  USER_ROLES,
  API_BASE_URL,
  PAGINATION,
  PRICE_RANGES,
  STOCK_STATUS,
  STOCK_THRESHOLDS,
  DEFAULT_IMAGES,
  CONTACT_INFO,
  SOCIAL_LINKS,
  FEATURES
};