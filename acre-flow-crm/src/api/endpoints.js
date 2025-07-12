// Centralized API endpoints configuration
// All API endpoint URLs are defined here for easy maintenance

const BASE_URL = 'http://13.233.167.95:5001/api';

export const ENDPOINTS = {
  // Auth endpoints
  AUTH: {
    LOGIN: `${BASE_URL}/auth/login`,
    REGISTER: `${BASE_URL}/auth/register`,
    LOGOUT: `${BASE_URL}/auth/logout`,
    REFRESH_TOKEN: `${BASE_URL}/auth/refresh`,
    RESET_PASSWORD: `${BASE_URL}/auth/reset-password`,
    REQUEST_RESET: `${BASE_URL}/auth/request-password-reset`,
    VERIFY_TOKEN: `${BASE_URL}/auth/verify`,
  },

  // Users endpoints
  USERS: {
    LIST: `${BASE_URL}/users`,
    CREATE: `${BASE_URL}/users`,
    GET_BY_ID: (id) => `${BASE_URL}/users/${id}`,
    UPDATE: (id) => `${BASE_URL}/users/${id}`,
    DELETE: (id) => `${BASE_URL}/users/${id}`,
    UPDATE_STATUS: (id) => `${BASE_URL}/users/${id}/status`,
    PROFILE: `${BASE_URL}/users/profile`,
    CHANGE_PASSWORD: `${BASE_URL}/users/change-password`,
  },

  // Leads endpoints
  LEADS: {
    LIST: `${BASE_URL}/leads`,
    CREATE: `${BASE_URL}/leads`,
    GET_BY_ID: (id) => `${BASE_URL}/leads/${id}`,
    UPDATE: (id) => `${BASE_URL}/leads/${id}`,
    DELETE: (id) => `${BASE_URL}/leads/${id}`,
    ASSIGN: (id) => `${BASE_URL}/leads/${id}/assign`,
    FOLLOW_UPS: (id) => `${BASE_URL}/leads/${id}/followups`,
    ADD_FOLLOW_UP: (id) => `${BASE_URL}/leads/${id}/followups`,
    ASSIGNABLE_USERS: `${BASE_URL}/leads/assignable-users`,
  },

  // Tickets endpoints
  TICKETS: {
    LIST: `${BASE_URL}/tickets`,
    CREATE: `${BASE_URL}/tickets`,
    GET_BY_ID: (id) => `${BASE_URL}/tickets/${id}`,
    UPDATE: (id) => `${BASE_URL}/tickets/${id}`,
    DELETE: (id) => `${BASE_URL}/tickets/${id}`,
    UPDATE_STATUS: (id) => `${BASE_URL}/tickets/${id}/status`,
    ASSIGN: (id) => `${BASE_URL}/tickets/${id}/assign`,
  },

  // Meetings endpoints
  MEETINGS: {
    LIST: `${BASE_URL}/meetings`,
    CREATE: `${BASE_URL}/meetings`,
    GET_BY_ID: (id) => `${BASE_URL}/meetings/${id}`,
    UPDATE: (id) => `${BASE_URL}/meetings/${id}`,
    DELETE: (id) => `${BASE_URL}/meetings/${id}`,
    SCHEDULE: `${BASE_URL}/meetings/schedule`,
  },

  // Dashboard endpoints
  DASHBOARD: {
    STATS: `${BASE_URL}/dashboard/stats`,
    RECENT_ACTIVITY: `${BASE_URL}/dashboard/recent-activity`,
    CHARTS_DATA: `${BASE_URL}/dashboard/charts`,
  },
};

export default ENDPOINTS; 