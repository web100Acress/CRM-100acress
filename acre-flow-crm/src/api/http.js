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
      config.headers.Authorization = `Bearer ${token}`;
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
  (error) => {
    // Handle common error scenarios
    if (error.response) {
      const { status, data } = error.response;
      
      // Handle authentication errors
      if (status === 401) {
        localStorage.removeItem('token');
        localStorage.removeItem('isLoggedIn');
        window.location.href = '/login';
        return Promise.reject(new Error('Authentication failed. Please login again.'));
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