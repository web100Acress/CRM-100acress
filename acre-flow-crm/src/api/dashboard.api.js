// Centralized Dashboard API functions
// All dashboard-related API calls are defined here

import { http } from './http.js';
import { ENDPOINTS } from './endpoints.js';

// Get dashboard statistics
export const fetchDashboardStats = async () => {
  try {
    const response = await http.get(ENDPOINTS.DASHBOARD.STATS);
    return response;
  } catch (error) {
    throw error;
  }
};

// Get recent activity
export const fetchRecentActivity = async () => {
  try {
    const response = await http.get(ENDPOINTS.DASHBOARD.RECENT_ACTIVITY);
    return response;
  } catch (error) {
    throw error;
  }
};

// Get charts data
export const fetchChartsData = async () => {
  try {
    const response = await http.get(ENDPOINTS.DASHBOARD.CHARTS_DATA);
    return response;
  } catch (error) {
    throw error;
  }
};

// Dashboard API object for easy importing
export const dashboardApi = {
  fetchStats: fetchDashboardStats,
  fetchRecentActivity,
  fetchChartsData,
}; 