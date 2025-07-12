// Dashboard feature API - Local re-export from centralized API
// This file only imports and configures the central dashboard API functions

import { 
  fetchDashboardStats, 
  fetchRecentActivity, 
  fetchChartsData,
  dashboardApi 
} from '@/api/dashboard.api';

// Re-export all dashboard API functions for use in dashboard feature
export {
  fetchDashboardStats,
  fetchRecentActivity,
  fetchChartsData,
  dashboardApi,
};

// Dashboard API object for easy importing within the dashboard feature
export const dashboardFeatureApi = {
  fetchStats: fetchDashboardStats,
  fetchRecentActivity,
  fetchChartsData,
}; 