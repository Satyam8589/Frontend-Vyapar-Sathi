/**
 * Constants for Create Store Feature
 */

// Business Types
export const BUSINESS_TYPES = [
  { value: 'retail', label: 'Retail' },
  { value: 'wholesale', label: 'Wholesale' },
  { value: 'both', label: 'Both Retail & Wholesale' },
  { value: 'service', label: 'Service' },
  { value: 'other', label: 'Other' }
];

// Currency Options
export const CURRENCY_OPTIONS = [
  { value: 'INR', label: 'INR (₹)', symbol: '₹' },
  { value: 'USD', label: 'USD ($)', symbol: '$' },
  { value: 'EUR', label: 'EUR (€)', symbol: '€' },
  { value: 'GBP', label: 'GBP (£)', symbol: '£' }
];

// Indian States
export const INDIAN_STATES = [
  { value: 'AN', label: 'Andaman and Nicobar Islands' },
  { value: 'AP', label: 'Andhra Pradesh' },
  { value: 'AR', label: 'Arunachal Pradesh' },
  { value: 'AS', label: 'Assam' },
  { value: 'BR', label: 'Bihar' },
  { value: 'CH', label: 'Chandigarh' },
  { value: 'CT', label: 'Chhattisgarh' },
  { value: 'DN', label: 'Dadra and Nagar Haveli' },
  { value: 'DD', label: 'Daman and Diu' },
  { value: 'DL', label: 'Delhi' },
  { value: 'GA', label: 'Goa' },
  { value: 'GJ', label: 'Gujarat' },
  { value: 'HR', label: 'Haryana' },
  { value: 'HP', label: 'Himachal Pradesh' },
  { value: 'JK', label: 'Jammu and Kashmir' },
  { value: 'JH', label: 'Jharkhand' },
  { value: 'KA', label: 'Karnataka' },
  { value: 'KL', label: 'Kerala' },
  { value: 'LA', label: 'Ladakh' },
  { value: 'LD', label: 'Lakshadweep' },
  { value: 'MP', label: 'Madhya Pradesh' },
  { value: 'MH', label: 'Maharashtra' },
  { value: 'MN', label: 'Manipur' },
  { value: 'ML', label: 'Meghalaya' },
  { value: 'MZ', label: 'Mizoram' },
  { value: 'NL', label: 'Nagaland' },
  { value: 'OR', label: 'Odisha' },
  { value: 'PY', label: 'Puducherry' },
  { value: 'PB', label: 'Punjab' },
  { value: 'RJ', label: 'Rajasthan' },
  { value: 'SK', label: 'Sikkim' },
  { value: 'TN', label: 'Tamil Nadu' },
  { value: 'TG', label: 'Telangana' },
  { value: 'TR', label: 'Tripura' },
  { value: 'UP', label: 'Uttar Pradesh' },
  { value: 'UT', label: 'Uttarakhand' },
  { value: 'WB', label: 'West Bengal' }
];

// Form Steps for Multi-Step Form
export const FORM_STEPS = [
  { id: 1, label: 'Basic Information', description: 'Store name and contact details' },
  { id: 2, label: 'Address', description: 'Store location and address' },
  { id: 3, label: 'Business Details', description: 'Business type and settings' },
  { id: 4, label: 'Review', description: 'Review and submit' }
];

// Default Settings
export const DEFAULT_SETTINGS = {
  lowStockThreshold: 10,
  expiryAlertDays: 7,
  currency: 'INR'
};

// Validation Patterns
export const VALIDATION_PATTERNS = {
  phone: /^[0-9]{10}$/,
  email: /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/,
  pincode: /^[0-9]{6}$/
};

// Field Length Limits
export const FIELD_LIMITS = {
  name: 100,
  description: 500,
  phone: 10,
  pincode: 6
};

// Error Messages
export const ERROR_MESSAGES = {
  required: (field) => `${field} is required`,
  invalidEmail: 'Please provide a valid email address',
  invalidPhone: 'Please provide a valid 10-digit phone number',
  invalidPincode: 'Please provide a valid 6-digit pincode',
  maxLength: (field, max) => `${field} cannot exceed ${max} characters`,
  minValue: (field, min) => `${field} must be at least ${min}`,
  storeCreationFailed: 'Failed to create store. Please try again.',
  networkError: 'Network error. Please check your connection.'
};

// Success Messages
export const SUCCESS_MESSAGES = {
  storeCreated: 'Store created successfully!',
  storeUpdated: 'Store updated successfully!',
  storeDeleted: 'Store deleted successfully!'
};
