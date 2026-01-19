// API Configuration
const hostname = window.location.hostname;

const API_BASE_URL = (hostname === 'localhost' || hostname === '127.0.0.1')
  ? 'http://localhost:5001'
  : hostname === '192.168.1.16'
    ? 'http://192.168.1.16:5001'
    : 'https://bcrm.100acress.com';

const SOCKET_URL = (hostname === 'localhost' || hostname === '127.0.0.1')
  ? 'http://localhost:5001'
  : hostname === '192.168.1.16'
    ? 'http://192.168.1.16:5001'  // Use 5001 for socket as well, assuming it shares the server
    : 'https://bcrm.100acress.com';

export const apiUrl = API_BASE_URL;

export const API_CONFIG = {
  BASE_URL: API_BASE_URL,
  SOCKET_URL: SOCKET_URL,
  TIMEOUT: 30000, // 30 seconds
  RETRY_ATTEMPTS: 3,
  RETRY_DELAY: 1000, // 1 second
};

// API endpoints
export const API_ENDPOINTS = {
  // Auth
  LOGIN: `${API_BASE_URL}/auth/login`,
  REGISTER: `${API_BASE_URL}/auth/register`,
  LOGOUT: `${API_BASE_URL}/auth/logout`,
  REFRESH_TOKEN: `${API_BASE_URL}/auth/refresh`,
  RESET_PASSWORD: `${API_BASE_URL}/auth/reset-password`,
  REQUEST_RESET: `${API_BASE_URL}/auth/request-password-reset`,
  VERIFY_TOKEN: `${API_BASE_URL}/auth/verify`,

  // Users
  USERS: `${API_BASE_URL}/users`,
  USER_PROFILE: `${API_BASE_URL}/users/profile`,
  ME: `${API_BASE_URL}/api/users/me`,
  USER_BY_ID: (id) => `${API_BASE_URL}/users/${id}`,
  USER_UPDATE: (id) => `${API_BASE_URL}/users/${id}`,
  USER_DELETE: (id) => `${API_BASE_URL}/users/${id}`,
  USER_STATUS: (id) => `${API_BASE_URL}/users/${id}/status`,
  CHANGE_PASSWORD: `${API_BASE_URL}/users/change-password`,

  // Leads
  LEADS: `${API_BASE_URL}/api/leads`,
  LEADS_CREATE: `${API_BASE_URL}/api/leads`,
  LEADS_BY_ID: (id) => `${API_BASE_URL}/api/leads/${id}`,
  LEADS_UPDATE: (id) => `${API_BASE_URL}/api/leads/${id}`,
  LEADS_DELETE: (id) => `${API_BASE_URL}/api/leads/${id}`,
  LEADS_ASSIGN: (id) => `${API_BASE_URL}/api/leads/${id}/assign`,
  LEADS_FOLLOW_UPS: (id) => `${API_BASE_URL}/api/leads/${id}/followups`,
  LEADS_ADD_FOLLOW_UP: (id) => `${API_BASE_URL}/api/leads/${id}/followups`,
  LEADS_ASSIGNABLE_USERS: `${API_BASE_URL}/api/leads/assignable-users`,
  LEADS_BD_SUMMARY: `${API_BASE_URL}/api/leads/bd-status-summary`,
  LEADS_BD_DETAILS: (bdId) => `${API_BASE_URL}/api/leads/bd-status/${bdId}`,
  LEADS_CALLS: `${API_BASE_URL}/api/leads/calls`,
  LEADS_CALL_HISTORY: (leadId) => `${API_BASE_URL}/api/leads/${leadId}/calls`,

  // WhatsApp
  WHATSAPP_MESSAGES: `${API_BASE_URL}/api/whatsapp/messages`,
  WHATSAPP_SEND: `${API_BASE_URL}/api/whatsapp/send`,

  // Chat
  CHAT_ROOMS: `${API_BASE_URL}/api/chats`,
  CHAT_MESSAGES: `${API_BASE_URL}/api/chats/messages`,
  CHAT_CREATE: `${API_BASE_URL}/api/chats/create`,
  CHAT_CREATE_OR_GET: `${API_BASE_URL}/api/chats/create-or-get`,
  CHAT_SEND: `${API_BASE_URL}/api/chats/send`,
  CHAT_SEND_FILE: `${API_BASE_URL}/api/chats/send-file`,
  CHAT_FAVORITE: `${API_BASE_URL}/api/chats`, // Base for favorite and delete
  CHAT_USER_CHATS: `${API_BASE_URL}/api/chats/user-chats`,
  CHAT_READ: `${API_BASE_URL}/api/chats/read`,

  // Notifications
  NOTIFICATIONS: `${API_BASE_URL}/api/notifications`,
  NOTIFICATIONS_READ: (id) => `${API_BASE_URL}/api/notifications/${id}/read`,
  NOTIFICATIONS_READ_ALL: `${API_BASE_URL}/api/notifications/read-all`,

  // Meetings
  MEETINGS: `${API_BASE_URL}/meetings`,
  MEETINGS_SCHEDULE: `${API_BASE_URL}/meetings/schedule`,

  // --- Nested structure for backward compatibility ---
  AUTH: {
    LOGIN: `${API_BASE_URL}/auth/login`,
    REGISTER: `${API_BASE_URL}/auth/register`,
    LOGOUT: `${API_BASE_URL}/auth/logout`,
    REFRESH_TOKEN: `${API_BASE_URL}/auth/refresh`,
    RESET_PASSWORD: `${API_BASE_URL}/auth/reset-password`,
    REQUEST_RESET: `${API_BASE_URL}/auth/request-password-reset`,
    VERIFY_TOKEN: `${API_BASE_URL}/auth/verify`,
  },
  USERS: {
    LIST: `${API_BASE_URL}/users`,
    CREATE: `${API_BASE_URL}/users`,
    GET_BY_ID: (id) => `${API_BASE_URL}/users/${id}`,
    UPDATE: (id) => `${API_BASE_URL}/users/${id}`,
    DELETE: (id) => `${API_BASE_URL}/users/${id}`,
    UPDATE_STATUS: (id) => `${API_BASE_URL}/users/${id}/status`,
    PROFILE: `${API_BASE_URL}/users/profile`,
    CHANGE_PASSWORD: `${API_BASE_URL}/users/change-password`,
  },
  LEADS: {
    LIST: `${API_BASE_URL}/api/leads`,
    CREATE: `${API_BASE_URL}/api/leads`,
    GET_BY_ID: (id) => `${API_BASE_URL}/api/leads/${id}`,
    UPDATE: (id) => `${API_BASE_URL}/api/leads/${id}`,
    DELETE: (id) => `${API_BASE_URL}/api/leads/${id}`,
    ASSIGN: (id) => `${API_BASE_URL}/api/leads/${id}/assign`,
    FOLLOW_UPS: (id) => `${API_BASE_URL}/api/leads/${id}/followups`,
    ADD_FOLLOW_UP: (id) => `${API_BASE_URL}/api/leads/${id}/followups`,
    ASSIGNABLE_USERS: `${API_BASE_URL}/api/leads/assignable-users`,
    BD_STATUS_SUMMARY: `${API_BASE_URL}/api/leads/bd-status-summary`,
    BD_STATUS: (bdId) => `${API_BASE_URL}/api/leads/bd-status/${bdId}`,
  },
  TICKETS: {
    LIST: `${API_BASE_URL}/tickets`,
    CREATE: `${API_BASE_URL}/tickets`,
    GET_BY_ID: (id) => `${API_BASE_URL}/tickets/${id}`,
    UPDATE: (id) => `${API_BASE_URL}/tickets/${id}`,
    DELETE: (id) => `${API_BASE_URL}/tickets/${id}`,
    UPDATE_STATUS: (id) => `${API_BASE_URL}/tickets/${id}/status`,
    ASSIGN: (id) => `${API_BASE_URL}/tickets/${id}/assign`,
  },
  MEETINGS: {
    LIST: `${API_BASE_URL}/meetings`,
    CREATE: `${API_BASE_URL}/meetings`,
    GET_BY_ID: (id) => `${API_BASE_URL}/meetings/${id}`,
    UPDATE: (id) => `${API_BASE_URL}/meetings/${id}`,
    DELETE: (id) => `${API_BASE_URL}/meetings/${id}`,
    SCHEDULE: `${API_BASE_URL}/meetings/schedule`,
  },
  DASHBOARD: {
    STATS: `${API_BASE_URL}/dashboard/stats`,
    RECENT_ACTIVITY: `${API_BASE_URL}/dashboard/recent-activity`,
    CHARTS_DATA: `${API_BASE_URL}/dashboard/charts`,
  },
  CALLS: {
    CONFIG: `${API_BASE_URL}/api/calls/config`,
    START: `${API_BASE_URL}/api/calls/start`,
    END: `${API_BASE_URL}/api/calls/end`,
    LOGS: `${API_BASE_URL}/api/calls/logs`,
    INITIATE: `${API_BASE_URL}/api/calls/initiate`,
    STATISTICS: `${API_BASE_URL}/api/calls/statistics`,
    EXPORT: `${API_BASE_URL}/api/calls/export`,
    NOTES: (id) => `${API_BASE_URL}/api/calls/${id}/notes`,
  },
  COMM_ADMIN: {
    FEATURE_FLAGS: `${API_BASE_URL}/api/comm-admin/feature-flags`,
    PROVIDERS: `${API_BASE_URL}/api/comm-admin/providers`,
  },
  WHATSAPP: {
    LIST_MESSAGES: `${API_BASE_URL}/api/whatsapp/messages`,
    SEND: `${API_BASE_URL}/api/whatsapp/send`,
  },
  EMAIL: {
    LIST_TEMPLATES: `${API_BASE_URL}/api/email/templates`,
    CREATE_TEMPLATE: `${API_BASE_URL}/api/email/templates`,
    UPDATE_TEMPLATE: (id) => `${API_BASE_URL}/api/email/templates/${id}`,
    DELETE_TEMPLATE: (id) => `${API_BASE_URL}/api/email/templates/${id}`,
    LIST_MESSAGES: `${API_BASE_URL}/api/email/messages`,
    SEND: `${API_BASE_URL}/api/email/send`,
  },
};

export default API_CONFIG;
