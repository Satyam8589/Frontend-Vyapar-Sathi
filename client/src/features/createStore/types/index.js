/**
 * Type definitions and data structures for Create Store feature
 * (JSDoc type definitions for JavaScript)
 */

/**
 * @typedef {Object} StoreAddress
 * @property {string} [street] - Street address
 * @property {string} [city] - City name
 * @property {string} [state] - State name or code
 * @property {string} [pincode] - 6-digit pincode
 * @property {string} [country] - Country name (default: "India")
 * @property {string} fullAddress - Complete address (required)
 */

/**
 * @typedef {Object} StoreSettings
 * @property {number} [lowStockThreshold=10] - Minimum stock level for alerts
 * @property {number} [expiryAlertDays=7] - Days before expiry to show alert
 * @property {string} [currency='INR'] - Currency code (INR|USD|EUR|GBP)
 */

/**
 * @typedef {Object} StoreData
 * @property {string} name - Store name (max 100 chars, required)
 * @property {string} phone - Phone number (10 digits, required)
 * @property {string} [email] - Email address (optional, validated)
 * @property {StoreAddress} address - Store address
 * @property {string} [businessType='retail'] - Business type (retail|wholesale|both|service|other)
 * @property {StoreSettings} [settings] - Store settings
 * @property {string} [description] - Store description (max 500 chars)
 * @property {string} [logo] - Logo URL
 */

/**
 * @typedef {Object} Store
 * @property {string} _id - Store ID (MongoDB ObjectId)
 * @property {string} name - Store name
 * @property {string} owner - Owner user ID
 * @property {string} ownerFirebaseUid - Owner Firebase UID
 * @property {string} phone - Phone number
 * @property {string} [email] - Email address
 * @property {StoreAddress} address - Store address
 * @property {string} businessType - Business type
 * @property {StoreSettings} settings - Store settings
 * @property {boolean} isActive - Is store active
 * @property {string} [description] - Store description
 * @property {string} [logo] - Logo URL
 * @property {Date} createdAt - Creation timestamp
 * @property {Date} updatedAt - Last update timestamp
 */

/**
 * @typedef {Object} ValidationResult
 * @property {boolean} isValid - Whether validation passed
 * @property {Object.<string, string>} errors - Validation errors by field
 */

/**
 * @typedef {Object} ApiResponse
 * @property {boolean} success - Whether request succeeded
 * @property {*} [data] - Response data
 * @property {string} [error] - Error message
 * @property {string} [message] - Success message
 * @property {number} [statusCode] - HTTP status code
 */

/**
 * @typedef {Object} FormErrors
 * @property {string} [name] - Name field error
 * @property {string} [phone] - Phone field error
 * @property {string} [email] - Email field error
 * @property {string} [fullAddress] - Full address field error
 * @property {string} [description] - Description field error
 */

/**
 * @typedef {Object} CreateStoreContextValue
 * @property {StoreData} formData - Current form data
 * @property {(field: string, value: any) => void} updateField - Update single field
 * @property {(updates: Partial<StoreData>) => void} updateFormData - Update multiple fields
 * @property {() => void} resetForm - Reset form to initial state
 * @property {boolean} loading - Loading state
 * @property {FormErrors} errors - Form validation errors
 * @property {string|null} submitError - Submission error message
 * @property {boolean} submitSuccess - Submission success state
 * @property {number} step - Current form step
 * @property {() => boolean} nextStep - Move to next step
 * @property {() => void} previousStep - Move to previous step
 * @property {(step: number) => void} setStep - Set specific step
 * @property {() => Promise<ApiResponse>} handleSubmit - Submit form
 * @property {(step: number) => boolean} validateStep - Validate specific step
 */

/**
 * Example usage:
 * 
 * ```javascript
 * // Creating a store
 * const storeData = {
 *   name: "My Store",
 *   phone: "9876543210",
 *   email: "store@example.com",
 *   address: {
 *     street: "123 Main St",
 *     city: "Mumbai",
 *     state: "Maharashtra",
 *     pincode: "400001",
 *     country: "India",
 *     fullAddress: "123 Main St, Mumbai, Maharashtra, 400001, India"
 *   },
 *   businessType: "retail",
 *   settings: {
 *     lowStockThreshold: 10,
 *     expiryAlertDays: 7,
 *     currency: "INR"
 *   },
 *   description: "My retail store"
 * };
 * 
 * const result = await createStore(storeData);
 * ```
 */

// Export empty object to make this a module
export {};
