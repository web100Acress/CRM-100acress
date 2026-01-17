// Centralized API endpoints configuration
// All API endpoint URLs are defined here for easy maintenance

// const BASE_URL = 'https://bcrm.100acress.com';
// Use live backend without trailing slash to avoid double slashes in paths
const BASE_URL = 'https://bcrm.100acress.com';

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
    LIST: `${BASE_URL}/api/leads`,
    CREATE: `${BASE_URL}/api/leads`,
    GET_BY_ID: (id) => `${BASE_URL}/api/leads/${id}`,
    UPDATE: (id) => `${BASE_URL}/api/leads/${id}`,
    DELETE: (id) => `${BASE_URL}/api/leads/${id}`,
    ASSIGN: (id) => `${BASE_URL}/api/leads/${id}/assign`,
    FOLLOW_UPS: (id) => `${BASE_URL}/api/leads/${id}/followups`,
    ADD_FOLLOW_UP: (id) => `${BASE_URL}/api/leads/${id}/followups`,
    ASSIGNABLE_USERS: `${BASE_URL}/api/leads/assignable-users`,
    BD_STATUS_SUMMARY: `${BASE_URL}/api/leads/bd-status-summary`,
    BD_STATUS: (bdId) => `${BASE_URL}/api/leads/bd-status/${bdId}`,
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

  CALLS: {
    CONFIG: `${BASE_URL}/api/calls/config`,
    START: `${BASE_URL}/api/calls/start`,
    END: `${BASE_URL}/api/calls/end`,
    LOGS: `${BASE_URL}/api/calls/logs`,
    NOTES: (id) => `${BASE_URL}/api/calls/${id}/notes`,
  },

  COMM_ADMIN: {
    FEATURE_FLAGS: `${BASE_URL}/api/comm-admin/feature-flags`,
    PROVIDERS: `${BASE_URL}/api/comm-admin/providers`,
  },

  WHATSAPP: {
    LIST_MESSAGES: `${BASE_URL}/api/whatsapp/messages`,
    SEND: `${BASE_URL}/api/whatsapp/send`,
  },

  EMAIL: {
    LIST_TEMPLATES: `${BASE_URL}/api/email/templates`,
    CREATE_TEMPLATE: `${BASE_URL}/api/email/templates`,
    UPDATE_TEMPLATE: (id) => `${BASE_URL}/api/email/templates/${id}`,
    DELETE_TEMPLATE: (id) => `${BASE_URL}/api/email/templates/${id}`,
    LIST_MESSAGES: `${BASE_URL}/api/email/messages`,
    SEND: `${BASE_URL}/api/email/send`,
  },
};

export default ENDPOINTS;
