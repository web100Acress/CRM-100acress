import axios from 'axios';

const baseURL =
  import.meta.env?.VITE_100ACRESS_API_BASE_URL ||
  (window.location.hostname === 'localhost'
    ? 'http://localhost:3500'
    : 'https://api.100acress.com');

const api100acress = axios.create({
  baseURL, // This client is for 100acress Backend (port 3500) for user data etc.
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: false,
});

api100acress.interceptors.request.use(
  async (config) => {
    // Try multiple token sources in order of preference
    let token = null;
    
    // 1. Check for CRM token first (most common)
    token = localStorage.getItem('token');
    
    // 2. If no CRM token, check for 100acress token
    if (!token) {
      token = localStorage.getItem('myToken');
    }
    
    // 3. Clean up token (remove quotes if present)
    if (token) {
      token = token.replace(/^["']|["']$/g, '').trim();
      
      // Only add if token is not empty after cleaning
      if (token && token !== 'null' && token !== 'undefined') {
        config.headers.Authorization = `Bearer ${token}`;
      } else {
        console.warn('Token found but invalid:', localStorage.getItem('token') || localStorage.getItem('myToken'));
        token = null;
      }
    }
    
    // Log warning if no token (for debugging)
    if (!token) {
      console.warn('⚠️ No token available for 100acress API call:', {
        url: config.url,
        hasToken: !!localStorage.getItem('token'),
        hasMyToken: !!localStorage.getItem('myToken'),
        userRole: localStorage.getItem('userRole') || localStorage.getItem('adminRole')
      });
    }
    
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor to handle 401 errors
api100acress.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.response?.status === 401) {
      // Token might be expired or invalid
      // Try to refresh or get new token
      const userEmail = localStorage.getItem('userEmail') || localStorage.getItem('adminEmail');
      const sourceSystem = localStorage.getItem('sourceSystem');
      
      if (userEmail && sourceSystem === 'crm') {
        // User logged in via CRM but needs 100acress token
        // You might want to redirect to login or show a message
        console.warn('100acress API requires authentication. Please login via 100acress backend or contact admin.');
      } else if (!userEmail) {
        // No user info available
        console.warn('No user authentication found for 100acress API.');
      }
    }
    return Promise.reject(error);
  }
);

export default api100acress;
