// HRMS API Client
// Centralized API configuration and HTTP client

import axios from 'axios';

// Base configuration
const API_BASE_URL =
  import.meta.env?.VITE_HR_API_BASE_URL ||
  import.meta.env?.VITE_API_BASE_URL ||
  'http://localhost:5000/api';
const API_TIMEOUT = 30000; // 30 seconds

// Create axios instance
const apiClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: API_TIMEOUT,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json'
  }
});

// Request interceptor
apiClient.interceptors.request.use(
  (config) => {
    // Add auth token if available
    const token = localStorage.getItem('hrms_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    // Add request timestamp for debugging
    config.metadata = { startTime: new Date() };

    // Log request in development
    if (import.meta.env?.DEV) {
      console.log(` API Request: ${config.method?.toUpperCase()} ${config.url}`, {
        data: config.data,
        params: config.params
      });
    }

    return config;
  },
  (error) => {
    console.error(' Request Error:', error);
    return Promise.reject(error);
  }
);

// Response interceptor
apiClient.interceptors.response.use(
  (response) => {
    // Calculate request duration
    const endTime = new Date();
    const duration = endTime - response.config.metadata.startTime;

    // Log response in development
    if (import.meta.env?.DEV) {
      console.log(`✅ API Response: ${response.config.method?.toUpperCase()} ${response.config.url} (${duration}ms)`, {
        status: response.status,
        data: response.data
      });
    }

    return response;
  },
  (error) => {
    // Handle different error types
    if (error.response) {
      // Server responded with error status
      const { status, data, config } = error.response;
      
      console.error(`❌ API Error: ${config?.method?.toUpperCase()} ${config?.url}`, {
        status,
        data,
        message: data?.message || error.message
      });

      // Handle specific status codes
      switch (status) {
        case 401:
          // Unauthorized - clear token and redirect to login
          localStorage.removeItem('hrms_token');
          window.location.href = '/hr/login';
          break;
        case 403:
          // Forbidden - insufficient permissions
          console.error('Insufficient permissions for this action');
          break;
        case 404:
          // Not found
          console.error('Resource not found');
          break;
        case 500:
          // Server error
          console.error('Internal server error');
          break;
        default:
          console.error('API request failed');
      }
    } else if (error.request) {
      // Network error
      console.error('❌ Network Error:', error.message);
    } else {
      // Other error
      console.error('❌ Error:', error.message);
    }

    return Promise.reject(error);
  }
);

// API methods
export const api = {
  // GET request
  get: (url, config = {}) => {
    return apiClient.get(url, config);
  },

  // POST request
  post: (url, data = {}, config = {}) => {
    return apiClient.post(url, data, config);
  },

  // PUT request
  put: (url, data = {}, config = {}) => {
    return apiClient.put(url, data, config);
  },

  // PATCH request
  patch: (url, data = {}, config = {}) => {
    return apiClient.patch(url, data, config);
  },

  // DELETE request
  delete: (url, config = {}) => {
    return apiClient.delete(url, config);
  },

  // File upload
  upload: (url, formData, config = {}) => {
    return apiClient.post(url, formData, {
      ...config,
      headers: {
        'Content-Type': 'multipart/form-data',
        ...config.headers
      }
    });
  },

  // File download
  download: (url, config = {}) => {
    return apiClient.get(url, {
      ...config,
      responseType: 'blob'
    });
  }
};

// API endpoints
export const endpoints = {
  // Auth
  AUTH: {
    LOGIN: '/auth/login',
    LOGOUT: '/auth/logout',
    REFRESH: '/auth/refresh',
    PROFILE: '/auth/profile',
    CHANGE_PASSWORD: '/auth/change-password'
  },

  // Employees
  EMPLOYEES: {
    LIST: '/employees',
    CREATE: '/employees',
    GET: (id) => `/employees/${id}`,
    UPDATE: (id) => `/employees/${id}`,
    DELETE: (id) => `/employees/${id}`,
    IMPORT: '/employees/import',
    EXPORT: '/employees/export',
    SEARCH: '/employees/search'
  },

  // Attendance
  ATTENDANCE: {
    LIST: '/attendance',
    MARK: '/attendance/mark',
    APPROVE: '/attendance/approve',
    REPORT: '/attendance/report',
    SUMMARY: '/attendance/summary',
    CALENDAR: '/attendance/calendar'
  },

  // Payroll
  PAYROLL: {
    LIST: '/payroll',
    GENERATE: '/payroll/generate',
    APPROVE: '/payroll/approve',
    SLIP: (id) => `/payroll/slip/${id}`,
    REPORT: '/payroll/report',
    SUMMARY: '/payroll/summary'
  },

  // Leave
  LEAVE: {
    LIST: '/leave',
    REQUEST: '/leave/request',
    APPROVE: (id) => `/leave/approve/${id}`,
    REJECT: (id) => `/leave/reject/${id}`,
    CANCEL: (id) => `/leave/cancel/${id}`,
    BALANCE: '/leave/balance',
    CALENDAR: '/leave/calendar',
    POLICY: '/leave/policy'
  },

  // Recruitment
  RECRUITMENT: {
    JOBS: '/recruitment/jobs',
    CANDIDATES: '/recruitment/candidates',
    APPLICATIONS: '/recruitment/applications',
    INTERVIEWS: '/recruitment/interviews',
    OFFERS: '/recruitment/offers',
    HIRING: '/recruitment/hiring',
    PIPELINE: '/recruitment/pipeline'
  },

  // Performance
  PERFORMANCE: {
    REVIEWS: '/performance/reviews',
    GOALS: '/performance/goals',
    FEEDBACK: '/performance/feedback',
    ANALYTICS: '/performance/analytics',
    TEMPLATES: '/performance/templates'
  },

  // Reports
  REPORTS: {
    GENERATE: '/reports/generate',
    LIST: '/reports',
    SCHEDULE: '/reports/schedule',
    EXPORT: '/reports/export'
  },

  // System
  SYSTEM: {
    HEALTH: '/system/health',
    CONFIG: '/system/config',
    LOGS: '/system/logs',
    BACKUP: '/system/backup'
  }
};

// Utility functions
export const createQueryString = (params) => {
  const searchParams = new URLSearchParams();
  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== '') {
      searchParams.append(key, value);
    }
  });
  return searchParams.toString();
};

export const handleApiError = (error, defaultMessage = 'An error occurred') => {
  if (error.response?.data?.message) {
    return error.response.data.message;
  } else if (error.message) {
    return error.message;
  } else {
    return defaultMessage;
  }
};

export const isNetworkError = (error) => {
  return !error.response && error.request;
};

export const isServerError = (error) => {
  return error.response?.status >= 500;
};

export const isClientError = (error) => {
  return error.response?.status >= 400 && error.response?.status < 500;
};

export default apiClient;
