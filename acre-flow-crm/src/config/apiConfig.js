// API Configuration
const hostname = window.location.hostname;

const API_BASE_URL = (hostname === 'localhost' || hostname === '127.0.0.1')
  ? 'http://localhost:5001'
  : hostname === '192.168.1.16'
    ? 'http://192.168.1.16:5001'
    : 'https://bcrm.100acress.com';

const SOCKET_URL = (hostname === 'localhost' || hostname === '127.0.0.1')
  ? 'http://localhost:5000'
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

  // Users
  USERS: `${API_BASE_URL}/users`,
  USER_PROFILE: `${API_BASE_URL}/users/profile`,

  // Leads
  LEADS: `${API_BASE_URL}/api/leads`,
  LEADS_ASSIGNABLE_USERS: `${API_BASE_URL}/api/leads/assignable-users`,

  // WhatsApp
  WHATSAPP_MESSAGES: `${API_BASE_URL}/api/whatsapp/messages`,
  WHATSAPP_SEND: `${API_BASE_URL}/api/whatsapp/send`,

  // Chat
  CHAT_ROOMS: `${API_BASE_URL}/api/chat/rooms`,
  CHAT_MESSAGES: `${API_BASE_URL}/api/chat/messages`,

  // Notifications
  NOTIFICATIONS: `${API_BASE_URL}/api/notifications`,
};

export default API_CONFIG;
