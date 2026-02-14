import { VALIDATION_PATTERNS, ERROR_MESSAGES, FIELD_LIMITS } from '../constants';

/**
 * Utility functions for Create Store Feature
 */

/**
 * Format phone number for display
 */
export const formatPhoneNumber = (phone) => {
  if (!phone) return '';
  
  // Remove all non-numeric characters
  const cleaned = phone.replace(/\D/g, '');
  
  // Format as XXX-XXX-XXXX
  if (cleaned.length === 10) {
    return `${cleaned.slice(0, 3)}-${cleaned.slice(3, 6)}-${cleaned.slice(6)}`;
  }
  
  return cleaned;
};

/**
 * Clean phone number (remove formatting)
 */
export const cleanPhoneNumber = (phone) => {
  if (!phone) return '';
  return phone.replace(/\D/g, '');
};

/**
 * Validate phone number
 */
export const validatePhone = (phone) => {
  const cleaned = cleanPhoneNumber(phone);
  return VALIDATION_PATTERNS.phone.test(cleaned);
};

/**
 * Validate email
 */
export const validateEmail = (email) => {
  if (!email) return true; // Email is optional
  return VALIDATION_PATTERNS.email.test(email);
};

/**
 * Validate pincode
 */
export const validatePincode = (pincode) => {
  if (!pincode) return false;
  return VALIDATION_PATTERNS.pincode.test(pincode);
};

/**
 * Validate field length
 */
export const validateLength = (value, maxLength) => {
  if (!value) return true;
  return value.length <= maxLength;
};

/**
 * Format address for display
 */
export const formatAddress = (address) => {
  if (!address) return '';
  
  const parts = [
    address.street,
    address.city,
    address.state,
    address.pincode,
    address.country
  ].filter(Boolean);
  
  return parts.join(', ');
};

/**
 * Generate full address from address object
 */
export const generateFullAddress = (address) => {
  if (!address) return '';
  
  const parts = [];
  
  if (address.street) parts.push(address.street);
  if (address.city) parts.push(address.city);
  if (address.state) parts.push(address.state);
  if (address.pincode) parts.push(address.pincode);
  if (address.country) parts.push(address.country);
  
  return parts.join(', ');
};

/**
 * Truncate text to specified length
 */
export const truncateText = (text, maxLength) => {
  if (!text || text.length <= maxLength) return text;
  return text.substring(0, maxLength - 3) + '...';
};

/**
 * Capitalize first letter of each word
 */
export const capitalizeWords = (str) => {
  if (!str) return '';
  return str.replace(/\b\w/g, (char) => char.toUpperCase());
};

/**
 * Get currency symbol
 */
export const getCurrencySymbol = (currencyCode) => {
  const symbols = {
    INR: '₹',
    USD: '$',
    EUR: '€',
    GBP: '£'
  };
  return symbols[currencyCode] || currencyCode;
};

/**
 * Check if form has unsaved changes
 */
export const hasUnsavedChanges = (formData, originalData) => {
  return JSON.stringify(formData) !== JSON.stringify(originalData);
};

/**
 * Deep clone object
 */
export const deepClone = (obj) => {
  return JSON.parse(JSON.stringify(obj));
};

/**
 * Remove empty fields from object
 */
export const removeEmptyFields = (obj) => {
  const cleaned = {};
  
  Object.keys(obj).forEach(key => {
    const value = obj[key];
    
    if (value === null || value === undefined || value === '') {
      return; // Skip empty values
    }
    
    if (typeof value === 'object' && !Array.isArray(value)) {
      const nestedCleaned = removeEmptyFields(value);
      if (Object.keys(nestedCleaned).length > 0) {
        cleaned[key] = nestedCleaned;
      }
    } else {
      cleaned[key] = value;
    }
  });
  
  return cleaned;
};

/**
 * Debounce function for input validation
 */
export const debounce = (func, delay = 300) => {
  let timeoutId;
  return function (...args) {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => func.apply(this, args), delay);
  };
};

/**
 * Get error message for field
 */
export const getFieldError = (errors, fieldName) => {
  if (!errors || !fieldName) return null;
  
  // Handle nested fields (e.g., address.city)
  if (fieldName.includes('.')) {
    const [parent, child] = fieldName.split('.');
    return errors[parent]?.[child] || errors[child] || null;
  }
  
  return errors[fieldName] || null;
};

/**
 * Check if step is valid (for multi-step forms)
 */
export const isStepValid = (step, formData, errors) => {
  // Define required fields for each step
  const stepRequirements = {
    1: ['name', 'phone'], // Basic info
    2: ['address.fullAddress'], // Address
    3: ['businessType'] // Business details
  };
  
  const requiredFields = stepRequirements[step] || [];
  
  // Check if all required fields are filled and have no errors
  return requiredFields.every(field => {
    if (field.includes('.')) {
      const [parent, child] = field.split('.');
      return formData[parent]?.[child] && !getFieldError(errors, field);
    }
    return formData[field] && !errors[field];
  });
};

/**
 * Get progress percentage for multi-step form
 */
export const getFormProgress = (currentStep, totalSteps) => {
  return Math.round((currentStep / totalSteps) * 100);
};

/**
 * Sanitize input (prevent XSS)
 */
export const sanitizeInput = (input) => {
  if (typeof input !== 'string') return input;
  
  const div = document.createElement('div');
  div.textContent = input;
  return div.innerHTML;
};

/**
 * Format date for display
 */
export const formatDate = (date) => {
  if (!date) return '';
  
  const d = new Date(date);
  const options = { year: 'numeric', month: 'long', day: 'numeric' };
  return d.toLocaleDateString('en-IN', options);
};

/**
 * Check if user is online
 */
export const isOnline = () => {
  return navigator.onLine;
};

const helpers = {
  formatPhoneNumber,
  cleanPhoneNumber,
  validatePhone,
  validateEmail,
  validatePincode,
  validateLength,
  formatAddress,
  generateFullAddress,
  truncateText,
  capitalizeWords,
  getCurrencySymbol,
  hasUnsavedChanges,
  deepClone,
  removeEmptyFields,
  debounce,
  getFieldError,
  isStepValid,
  getFormProgress,
  sanitizeInput,
  formatDate,
  isOnline
};

export default helpers;
