// Centralized HTTP client configuration
// Axios setup with interceptors and base configuration

import axios from 'axios';

// Get base URL from environment variables or use default
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'https://bcrm.100acress.com/';

// Create axios instance with base configuration
const httpClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  withCredentials: true, // Important for cookies/sessions
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  },
});

// Request interceptor - adds auth token to requests
httpClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      // Basic token validation - check if it's not empty or malformed
      if (token.trim() && token !== 'null' && token !== 'undefined') {
        config.headers.Authorization = `Bearer ${token}`;
      } else {
        // Remove invalid token
        localStorage.removeItem('token');
        localStorage.removeItem('isLoggedIn');
      }
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor - handles common response scenarios
httpClient.interceptors.response.use(
  (response) => {
    // Return the response data directly for convenience
    return response.data;
  },
  async (error) => {
    // Handle common error scenarios
    if (error.response) {
      const { status, data } = error.response;
      
      // Handle authentication errors - be more intelligent about when to logout
      if (status === 401) {
        // Check if this is an auth endpoint - don't auto-logout from these
        const isAuthEndpoint = error.config?.url?.includes('/login') || 
                             error.config?.url?.includes('/auth') ||
                             error.config?.url?.includes('/register');
        
        // Check if error message indicates token expiration vs other auth issues
        const errorMessage = data?.message || '';
        const isTokenExpired = errorMessage.toLowerCase().includes('expired') || 
                              errorMessage.toLowerCase().includes('token expired');
        const isTokenNotFound = errorMessage.toLowerCase().includes('not found') || 
                               errorMessage.toLowerCase().includes('no token') ||
                               errorMessage.toLowerCase().includes('token not provided');
        
        // For token not found errors, try to refresh token once before failing
        if (!isAuthEndpoint && isTokenNotFound && !error.config.__isRetry) {
          error.config.__isRetry = true;
          
          // Try to get a fresh token by checking if user has valid session
          const user = localStorage.getItem('user');
          const isLoggedIn = localStorage.getItem('isLoggedIn');
          
          // If user exists and is logged in, try to continue with current token
          if (user && isLoggedIn === 'true') {
            // The session exists but token is missing - try to get a new token
            // This could be from a refresh endpoint or by re-authenticating silently
            try {
              // For now, let's try to continue with a basic auth header or clear the error
              const token = localStorage.getItem('token');
              if (token && token.trim() && token !== 'null' && token !== 'undefined') {
                error.config.headers.Authorization = `Bearer ${token}`;
                return httpClient(error.config);
              }
            } catch (retryError) {
              // Retry failed, proceed with normal error handling
            }
          }
        }
        
        // Only clear token and redirect if it's clearly an auth issue and not an auth endpoint
        if (!isAuthEndpoint && (isTokenExpired || (isTokenNotFound && error.config.__isRetry))) {
          localStorage.removeItem('token');
          localStorage.removeItem('isLoggedIn');
          localStorage.removeItem('user');
          localStorage.removeItem('role');
          localStorage.removeItem('refreshToken');
          
          // Use current domain for production compatibility
          const currentPath = window.location.pathname;
          if (currentPath !== '/login') {
            window.location.href = '/login';
          }
          
          return Promise.reject(new Error('Your session has expired. Please login again.'));
        }
        
        // For other 401 errors, return a more user-friendly message that doesn't immediately suggest login
        return Promise.reject({
          isAuthError: true,
          requiresAuth: true,
          message: 'Unable to authenticate. Please check your connection and try again.',
          shouldRetry: !isAuthEndpoint && isTokenNotFound && !error.config.__isRetry
        });
      }
      
      // Handle forbidden errors
      if (status === 403) {
        return Promise.reject(new Error('Access denied. You do not have permission to perform this action.'));
      }
      
      // Handle validation errors
      if (status === 422) {
        return Promise.reject(new Error(data.message || 'Validation failed. Please check your input.'));
      }
      
      // Handle server errors
      if (status >= 500) {
        return Promise.reject(new Error('Server error. Please try again later.'));
      }
      
      // Return the error message from the server
      return Promise.reject(new Error(data.message || 'An error occurred.'));
    }
    
    // Handle network errors
    if (error.request) {
      return Promise.reject(new Error('Network error. Please check your connection.'));
    }
    
    // Handle other errors
    return Promise.reject(error);
  }
);

// HTTP methods wrapper
export const http = {
  get: (url, config = {}) => httpClient.get(url, config),
  post: (url, data = {}, config = {}) => httpClient.post(url, data, config),
  put: (url, data = {}, config = {}) => httpClient.put(url, data, config),
  patch: (url, data = {}, config = {}) => httpClient.patch(url, data, config),
  delete: (url, config = {}) => httpClient.delete(url, config),
};

export default httpClient; 