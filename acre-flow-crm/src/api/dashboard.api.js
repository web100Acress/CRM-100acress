import axios from 'axios';
import { ENDPOINTS } from './endpoints.js';

// Create axios instance for dashboard API
export const dashboardApi = axios.create({
  baseURL: ENDPOINTS.DASHBOARD.STATS.split('/dashboard')[0],
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add request interceptor to include auth token
dashboardApi.interceptors.request.use(
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

// Add response interceptor to handle errors
dashboardApi.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Handle unauthorized access
      localStorage.removeItem('token');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// Dashboard API functions
export const fetchDashboardStats = async () => {
  try {
    const response = await dashboardApi.get(ENDPOINTS.DASHBOARD.STATS);
    return response.data;
  } catch (error) {
    console.error('Error fetching dashboard stats:', error);
    throw error;
  }
};

export const fetchRecentActivity = async () => {
  try {
    const response = await dashboardApi.get(ENDPOINTS.DASHBOARD.RECENT_ACTIVITY);
    return response.data;
  } catch (error) {
    console.error('Error fetching recent activity:', error);
    throw error;
  }
};

export const fetchChartsData = async () => {
  try {
    const response = await dashboardApi.get(ENDPOINTS.DASHBOARD.CHARTS_DATA);
    return response.data;
  } catch (error) {
    console.error('Error fetching charts data:', error);
    throw error;
  }
};

// Additional dashboard API functions
export const fetchUserStats = async (userId) => {
  try {
    const response = await dashboardApi.get(`/dashboard/user/${userId}/stats`);
    return response.data;
  } catch (error) {
    console.error('Error fetching user stats:', error);
    throw error;
  }
};

export const fetchDepartmentStats = async (department) => {
  try {
    const response = await dashboardApi.get(`/dashboard/department/${department}/stats`);
    return response.data;
  } catch (error) {
    console.error('Error fetching department stats:', error);
    throw error;
  }
};

export const fetchLeadMetrics = async (filters = {}) => {
  try {
    const response = await dashboardApi.get('/dashboard/leads/metrics', { params: filters });
    return response.data;
  } catch (error) {
    console.error('Error fetching lead metrics:', error);
    throw error;
  }
};

export const fetchPerformanceData = async (timeRange = '30d') => {
  try {
    const response = await dashboardApi.get(`/dashboard/performance?range=${timeRange}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching performance data:', error);
    throw error;
  }
};

export default dashboardApi;
