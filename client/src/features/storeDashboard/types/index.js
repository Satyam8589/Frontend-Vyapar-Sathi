/**
 * Type definitions for Store Dashboard Feature
 * These are JSDoc types for better IDE support
 */

/**
 * @typedef {Object} Store
 * @property {string} _id - Store ID
 * @property {string} name - Store name
 * @property {string} phone - Store phone number
 * @property {string} email - Store email
 * @property {Object} address - Store address
 * @property {string} address.fullAddress - Full address
 * @property {string} address.city - City
 * @property {string} address.state - State
 * @property {string} address.pincode - Pincode
 * @property {string} businessType - Type of business
 * @property {string} description - Store description
 * @property {string} logo - Store logo URL
 * @property {Date} createdAt - Creation date
 * @property {Date} updatedAt - Last update date
 */

/**
 * @typedef {Object} DashboardFilters
 * @property {string} search - Search query
 * @property {string} businessType - Business type filter
 * @property {string} sortBy - Sort option
 */

/**
 * @typedef {Object} DashboardState
 * @property {Store[]} stores - List of stores
 * @property {boolean} loading - Loading state
 * @property {string|null} error - Error message
 * @property {DashboardFilters} filters - Active filters
 * @property {string} viewMode - Current view mode (grid/list)
 */

export {};
