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
          
          // Try to get a fresh token (you might have a refresh endpoint)
          const refreshToken = localStorage.getItem('refreshToken');
          if (refreshToken) {
            try {
              const response = await httpClient.post('/auth/refresh', { refreshToken });
              const newToken = response.data?.token;
              
              if (newToken) {
                localStorage.setItem('token', newToken);
                // Update the original request with new token
                error.config.headers.Authorization = `Bearer ${newToken}`;
                return httpClient(error.config);
              }
            } catch (refreshError) {
              // Refresh failed, proceed with normal 401 handling
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
        
        // For other 401 errors, let the component handle it with better error info
        const authError = {
          isAuthError: true,
          requiresAuth: true,
          message: errorMessage || 'Authentication required.',
          shouldRetry: !isAuthEndpoint && isTokenNotFound && !error.config.__isRetry
        };
        
        return Promise.reject(authError);
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