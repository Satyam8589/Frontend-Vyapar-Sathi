import axios from 'axios';

// Session ID management
const SESSION_STORAGE_KEY = 'copilot_session_id';

export function getSessionId() {
  return localStorage.getItem(SESSION_STORAGE_KEY);
}

export function setSessionId(sessionId) {
  if (sessionId) {
    localStorage.setItem(SESSION_STORAGE_KEY, sessionId);
  }
}

export function clearSessionId() {
  localStorage.removeItem(SESSION_STORAGE_KEY);
}

// Create axios instance with default config
const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor
api.interceptors.request.use(
  (config) => {
    // Get token from localStorage if it exists
    const token = localStorage.getItem('authToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    // Attach session ID if available
    const sessionId = getSessionId();
    if (sessionId) {
      config.headers['x-session-id'] = sessionId;
    }

    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor
api.interceptors.response.use(
  (response) => {
    // Capture session ID from response headers
    const sessionId = response.headers['x-session-id'];
    if (sessionId) {
      setSessionId(sessionId);
    }
    return response.data;
  },
  (error) => {
    if (error.response?.status === 401) {
      // Handle unauthorized access - token invalid/expired
      localStorage.removeItem('authToken');
      window.location.href = '/login';
    } else if (error.response?.status === 403) {
      // Handle forbidden - user not registered in database
      const message = error.response?.data?.message || 'Access forbidden';
      if (message.includes('not registered') || message.includes('complete registration')) {
        // Redirect to signup/register page if user hasn't completed registration
        localStorage.removeItem('authToken');
        window.location.href = '/signUp';
      }
    }
    return Promise.reject(error.response?.data || error.message);
  }
);

// API methods
export const apiGet = (url, config = {}) => api.get(url, config);
export const apiPost = (url, data = {}, config = {}) => api.post(url, data, config);
export const apiPut = (url, data = {}, config = {}) => api.put(url, data, config);
export const apiDelete = (url, config = {}) => api.delete(url, config);
export const apiPatch = (url, data = {}, config = {}) => api.patch(url, data, config);

export default api;
