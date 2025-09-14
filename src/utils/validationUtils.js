// src/utils/validationUtils.js

/**
 * Validation utilities for KeyZone application
 */

// Email validation regex
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

// Sri Lankan phone number regex (supports various formats)
const SRI_LANKAN_PHONE_REGEX = /^(\+94|0)?[1-9][0-9]{8}$/;

// Sri Lankan postal code regex (5 digits)
const POSTAL_CODE_REGEX = /^[0-9]{5}$/;

/**
 * Validate email address
 * @param {string} email - Email to validate
 * @returns {object} - { isValid: boolean, error: string }
 */
export const validateEmail = (email) => {
  if (!email || !email.trim()) {
    return { isValid: false, error: 'Email is required' };
  }
  
  if (!EMAIL_REGEX.test(email.trim())) {
    return { isValid: false, error: 'Please enter a valid email address' };
  }
  
  return { isValid: true, error: '' };
};

/**
 * Validate password
 * @param {string} password - Password to validate
 * @param {object} options - Validation options
 * @returns {object} - { isValid: boolean, error: string }
 */
export const validatePassword = (password, options = {}) => {
  const { minLength = 6, requireUppercase = false, requireNumbers = false, requireSpecialChars = false } = options;
  
  if (!password) {
    return { isValid: false, error: 'Password is required' };
  }
  
  if (password.length < minLength) {
    return { isValid: false, error: `Password must be at least ${minLength} characters long` };
  }
  
  if (requireUppercase && !/[A-Z]/.test(password)) {
    return { isValid: false, error: 'Password must contain at least one uppercase letter' };
  }
  
  if (requireNumbers && !/\d/.test(password)) {
    return { isValid: false, error: 'Password must contain at least one number' };
  }
  
  if (requireSpecialChars && !/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password)) {
    return { isValid: false, error: 'Password must contain at least one special character' };
  }
  
  return { isValid: true, error: '' };
};

/**
 * Validate password confirmation
 * @param {string} password - Original password
 * @param {string} confirmPassword - Password confirmation
 * @returns {object} - { isValid: boolean, error: string }
 */
export const validatePasswordConfirmation = (password, confirmPassword) => {
  if (!confirmPassword) {
    return { isValid: false, error: 'Password confirmation is required' };
  }
  
  if (password !== confirmPassword) {
    return { isValid: false, error: 'Passwords do not match' };
  }
  
  return { isValid: true, error: '' };
};

/**
 * Validate username
 * @param {string} username - Username to validate
 * @returns {object} - { isValid: boolean, error: string }
 */
export const validateUsername = (username) => {
  if (!username || !username.trim()) {
    return { isValid: false, error: 'Username is required' };
  }
  
  if (username.trim().length < 2) {
    return { isValid: false, error: 'Username must be at least 2 characters long' };
  }
  
  if (username.trim().length > 50) {
    return { isValid: false, error: 'Username must not exceed 50 characters' };
  }
  
  return { isValid: true, error: '' };
};

/**
 * Validate Sri Lankan phone number
 * @param {string} phoneNumber - Phone number to validate
 * @returns {object} - { isValid: boolean, error: string }
 */
export const validatePhoneNumber = (phoneNumber) => {
  if (!phoneNumber || !phoneNumber.trim()) {
    return { isValid: false, error: 'Phone number is required' };
  }
  
  const cleanPhone = phoneNumber.replace(/\s+/g, '');
  
  if (!SRI_LANKAN_PHONE_REGEX.test(cleanPhone)) {
    return { 
      isValid: false, 
      error: 'Please enter a valid Sri Lankan phone number (e.g., +94771234567 or 0771234567)' 
    };
  }
  
  return { isValid: true, error: '' };
};

/**
 * Validate postal code
 * @param {string} postalCode - Postal code to validate
 * @returns {object} - { isValid: boolean, error: string }
 */
export const validatePostalCode = (postalCode) => {
  if (!postalCode || !postalCode.trim()) {
    return { isValid: false, error: 'Postal code is required' };
  }
  
  if (!POSTAL_CODE_REGEX.test(postalCode.trim())) {
    return { isValid: false, error: 'Please enter a valid 5-digit Sri Lankan postal code' };
  }
  
  return { isValid: true, error: '' };
};

/**
 * Validate required field
 * @param {string} value - Value to validate
 * @param {string} fieldName - Name of the field for error message
 * @returns {object} - { isValid: boolean, error: string }
 */
export const validateRequired = (value, fieldName) => {
  if (!value || !value.toString().trim()) {
    return { isValid: false, error: `${fieldName} is required` };
  }
  
  return { isValid: true, error: '' };
};

/**
 * Validate address
 * @param {object} address - Address object to validate
 * @returns {object} - { isValid: boolean, errors: object }
 */
export const validateAddress = (address) => {
  const errors = {};
  let isValid = true;
  
  // Validate street
  const streetValidation = validateRequired(address.street, 'Street address');
  if (!streetValidation.isValid) {
    errors.street = streetValidation.error;
    isValid = false;
  }
  
  // Validate city
  const cityValidation = validateRequired(address.city, 'City');
  if (!cityValidation.isValid) {
    errors.city = cityValidation.error;
    isValid = false;
  }
  
  // Validate state
  const stateValidation = validateRequired(address.state, 'State/Province');
  if (!stateValidation.isValid) {
    errors.state = stateValidation.error;
    isValid = false;
  }
  
  // Validate postal code
  const postalCodeValidation = validatePostalCode(address.postal_code);
  if (!postalCodeValidation.isValid) {
    errors.postal_code = postalCodeValidation.error;
    isValid = false;
  }
  
  // Validate country
  const countryValidation = validateRequired(address.country, 'Country');
  if (!countryValidation.isValid) {
    errors.country = countryValidation.error;
    isValid = false;
  }
  
  return { isValid, errors };
};

/**
 * Validate registration form
 * @param {object} formData - Registration form data
 * @returns {object} - { isValid: boolean, errors: object, firstError: string }
 */
export const validateRegistrationForm = (formData) => {
  const errors = {};
  let isValid = true;
  let firstError = '';
  
  // Validate username
  const usernameValidation = validateUsername(formData.username);
  if (!usernameValidation.isValid) {
    errors.username = usernameValidation.error;
    if (!firstError) firstError = usernameValidation.error;
    isValid = false;
  }
  
  // Validate email
  const emailValidation = validateEmail(formData.email);
  if (!emailValidation.isValid) {
    errors.email = emailValidation.error;
    if (!firstError) firstError = emailValidation.error;
    isValid = false;
  }
  
  // Validate password
  const passwordValidation = validatePassword(formData.password);
  if (!passwordValidation.isValid) {
    errors.password = passwordValidation.error;
    if (!firstError) firstError = passwordValidation.error;
    isValid = false;
  }
  
  // Validate password confirmation
  const confirmPasswordValidation = validatePasswordConfirmation(formData.password, formData.confirmPassword);
  if (!confirmPasswordValidation.isValid) {
    errors.confirmPassword = confirmPasswordValidation.error;
    if (!firstError) firstError = confirmPasswordValidation.error;
    isValid = false;
  }
  
  // Validate phone number
  const phoneValidation = validatePhoneNumber(formData.phone_number);
  if (!phoneValidation.isValid) {
    errors.phone_number = phoneValidation.error;
    if (!firstError) firstError = phoneValidation.error;
    isValid = false;
  }
  
  // Validate address
  const addressValidation = validateAddress(formData.address);
  if (!addressValidation.isValid) {
    errors.address = addressValidation.errors;
    if (!firstError) {
      const firstAddressError = Object.values(addressValidation.errors)[0];
      if (firstAddressError) firstError = firstAddressError;
    }
    isValid = false;
  }
  
  return { isValid, errors, firstError };
};

/**
 * Validate login form
 * @param {object} formData - Login form data
 * @returns {object} - { isValid: boolean, errors: object, firstError: string }
 */
export const validateLoginForm = (formData) => {
  const errors = {};
  let isValid = true;
  let firstError = '';
  
  // Validate email
  const emailValidation = validateEmail(formData.email);
  if (!emailValidation.isValid) {
    errors.email = emailValidation.error;
    if (!firstError) firstError = emailValidation.error;
    isValid = false;
  }
  
  // Validate password
  const passwordValidation = validateRequired(formData.password, 'Password');
  if (!passwordValidation.isValid) {
    errors.password = passwordValidation.error;
    if (!firstError) firstError = passwordValidation.error;
    isValid = false;
  }
  
  return { isValid, errors, firstError };
};

// Export individual functions and a default object
const validationUtils = {
  validateEmail,
  validatePassword,
  validatePasswordConfirmation,
  validateUsername,
  validatePhoneNumber,
  validatePostalCode,
  validateRequired,
  validateAddress,
  validateRegistrationForm,
  validateLoginForm,
  EMAIL_REGEX,
  SRI_LANKAN_PHONE_REGEX,
  POSTAL_CODE_REGEX
};

export default validationUtils;