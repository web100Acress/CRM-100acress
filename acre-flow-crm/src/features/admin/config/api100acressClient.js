import axios from 'axios';

const api100acress = axios.create({
  baseURL: 'https://api.100acress.com', // This client is for 100acress Backend (port 3500) for user data etc.
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true,
});

api100acress.interceptors.request.use(
  async (config) => {
    // Try to get 100acress token first
    let token = localStorage.getItem('myToken');
    
    // If no 100acress token, try to get it or use CRM token as fallback
    if (!token) {
      const crmToken = localStorage.getItem('token');
      const userEmail = localStorage.getItem('userEmail') || localStorage.getItem('adminEmail');
      const userPassword = localStorage.getItem('userPassword'); // Note: Password shouldn't be stored
      const userRole = localStorage.getItem('userRole') || localStorage.getItem('adminRole');
      const sourceSystem = localStorage.getItem('sourceSystem');
      
      // If user is admin and logged in via CRM, try to get 100acress token
      if (crmToken && (userRole === 'admin' || userRole === 'Admin')) {
        // Since we can't store password, try using CRM token
        // If 100acress backend uses same JWT_SECRET, CRM token should work
        token = crmToken;
      } else if (crmToken) {
        // Fallback: Use CRM token (might work if same JWT secret)
        token = crmToken;
      }
    }
    
    if (token) {
      // Remove quotes if present
      const cleanToken = token.replace(/"/g, '');
      config.headers.Authorization = `Bearer ${cleanToken}`;
    } else {
      console.warn('No token available for 100acress API call. Request will likely fail.');
      // Don't block the request, let the backend handle it
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
      }
    }
    return Promise.reject(error);
  }
);

export default api100acress;
