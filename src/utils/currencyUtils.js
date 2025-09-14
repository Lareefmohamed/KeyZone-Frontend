// src/utils/currencyUtils.js

/**
 * Format price in Sri Lankan Rupees (LKR)
 * @param {number} price - The price value to format
 * @returns {string} - Formatted price string
 */
export const formatPrice = (price) => {
  return new Intl.NumberFormat('en-LK', {
    style: 'currency',
    currency: 'LKR',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  }).format(price);
};

/**
 * Format price without currency symbol (just the number with formatting)
 * @param {number} price - The price value to format
 * @returns {string} - Formatted price string without currency symbol
 */
export const formatPriceNumber = (price) => {
  return new Intl.NumberFormat('en-LK', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  }).format(price);
};

/**
 * Parse price string to number (removes formatting)
 * @param {string} priceString - The formatted price string
 * @returns {number} - Parsed price number
 */
export const parsePrice = (priceString) => {
  const cleaned = priceString.replace(/[^\d.-]/g, '');
  return parseFloat(cleaned) || 0;
};

/**
 * Convert USD to LKR (approximate conversion rate)
 * This is for demonstration purposes only - in a real app, you'd use a live exchange rate API
 * @param {number} usdAmount - Amount in USD
 * @returns {number} - Equivalent amount in LKR
 */
export const convertUSDToLKR = (usdAmount) => {
  const exchangeRate = 300; // Approximate rate: 1 USD = 300 LKR
  return usdAmount * exchangeRate;
};

export default {
  formatPrice,
  formatPriceNumber,
  parsePrice,
  convertUSDToLKR
};