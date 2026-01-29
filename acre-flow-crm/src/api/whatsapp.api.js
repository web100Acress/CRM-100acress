import axios from 'axios';
import { API_ENDPOINTS as ENDPOINTS } from '@/config/apiConfig';

// Create axios instance with default config
const api = axios.create({
  baseURL: ENDPOINTS.WHATSAPP.LIST_MESSAGES.split('/api/whatsapp')[0],
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add request interceptor to include auth token
api.interceptors.request.use(
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
api.interceptors.response.use(
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

export const whatsappApi = {
  // List all WhatsApp messages
  listMessages: async () => {
    const response = await api.get(ENDPOINTS.WHATSAPP.LIST_MESSAGES);
    return response.data;
  },

  // Send WhatsApp message
  send: async (messageData) => {
    const response = await api.post(ENDPOINTS.WHATSAPP.SEND, messageData);
    return response.data;
  },

  // Get message by ID (if needed)
  getMessageById: async (messageId) => {
    const response = await api.get(`${ENDPOINTS.WHATSAPP.LIST_MESSAGES}/${messageId}`);
    return response.data;
  },

  // Delete message (if needed)
  deleteMessage: async (messageId) => {
    const response = await api.delete(`${ENDPOINTS.WHATSAPP.LIST_MESSAGES}/${messageId}`);
    return response.data;
  },

  // Update message status (if needed)
  updateStatus: async (messageId, status) => {
    const response = await api.patch(`${ENDPOINTS.WHATSAPP.LIST_MESSAGES}/${messageId}/status`, { status });
    return response.data;
  }
};

export default whatsappApi;
