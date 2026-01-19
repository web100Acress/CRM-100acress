import axios from 'axios';
import { API_ENDPOINTS as ENDPOINTS } from '@/config/apiConfig';

// Create axios instance for communication admin API
const commAdminApi = axios.create({
  baseURL: ENDPOINTS.COMM_ADMIN.FEATURE_FLAGS.split('/feature-flags')[0],
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add request interceptor to include auth token
commAdminApi.interceptors.request.use(
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
commAdminApi.interceptors.response.use(
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

// Communication Admin API functions
export const fetchFeatureFlags = async () => {
  try {
    const response = await commAdminApi.get(ENDPOINTS.COMMUNICATION.ADMIN.FEATURE_FLAGS);
    return response.data;
  } catch (error) {
    console.error('Error fetching feature flags:', error);
    throw error;
  }
};

export const updateFeatureFlags = async (flags) => {
  try {
    const response = await commAdminApi.put(ENDPOINTS.COMMUNICATION.ADMIN.FEATURE_FLAGS, flags);
    return response.data;
  } catch (error) {
    console.error('Error updating feature flags:', error);
    throw error;
  }
};

export const fetchProviders = async () => {
  try {
    const response = await commAdminApi.get(ENDPOINTS.COMMUNICATION.ADMIN.PROVIDERS);
    return response.data;
  } catch (error) {
    console.error('Error fetching providers:', error);
    throw error;
  }
};

export const upsertProvider = async (providerData) => {
  try {
    const response = await commAdminApi.post(ENDPOINTS.COMMUNICATION.ADMIN.PROVIDERS, providerData);
    return response.data;
  } catch (error) {
    console.error('Error upserting provider:', error);
    throw error;
  }
};

export const deleteProvider = async (providerId) => {
  try {
    const response = await commAdminApi.delete(`${ENDPOINTS.COMMUNICATION.ADMIN.PROVIDERS}/${providerId}`);
    return response.data;
  } catch (error) {
    console.error('Error deleting provider:', error);
    throw error;
  }
};

export const testProviderConnection = async (providerId) => {
  try {
    const response = await commAdminApi.post(`${ENDPOINTS.COMMUNICATION.ADMIN.PROVIDERS}/${providerId}/test`);
    return response.data;
  } catch (error) {
    console.error('Error testing provider connection:', error);
    throw error;
  }
};

export const fetchCallLogs = async (filters = {}) => {
  try {
    const response = await commAdminApi.get(ENDPOINTS.COMMUNICATION.ADMIN.CALL_LOGS, { params: filters });
    return response.data;
  } catch (error) {
    console.error('Error fetching call logs:', error);
    throw error;
  }
};

export const fetchCallSettings = async () => {
  try {
    const response = await commAdminApi.get(ENDPOINTS.COMMUNICATION.ADMIN.CALL_SETTINGS);
    return response.data;
  } catch (error) {
    console.error('Error fetching call settings:', error);
    throw error;
  }
};

export const updateCallSettings = async (settings) => {
  try {
    const response = await commAdminApi.put(ENDPOINTS.COMMUNICATION.ADMIN.CALL_SETTINGS, settings);
    return response.data;
  } catch (error) {
    console.error('Error updating call settings:', error);
    throw error;
  }
};

export const fetchWhatsAppSettings = async () => {
  try {
    const response = await commAdminApi.get(ENDPOINTS.COMMUNICATION.ADMIN.WHATSAPP_SETTINGS);
    return response.data;
  } catch (error) {
    console.error('Error fetching WhatsApp settings:', error);
    throw error;
  }
};

export const updateWhatsAppSettings = async (settings) => {
  try {
    const response = await commAdminApi.put(ENDPOINTS.COMMUNICATION.ADMIN.WHATSAPP_SETTINGS, settings);
    return response.data;
  } catch (error) {
    console.error('Error updating WhatsApp settings:', error);
    throw error;
  }
};

export const fetchEmailSettings = async () => {
  try {
    const response = await commAdminApi.get(ENDPOINTS.COMMUNICATION.ADMIN.EMAIL_SETTINGS);
    return response.data;
  } catch (error) {
    console.error('Error fetching email settings:', error);
    throw error;
  }
};

export const updateEmailSettings = async (settings) => {
  try {
    const response = await commAdminApi.put(ENDPOINTS.COMMUNICATION.ADMIN.EMAIL_SETTINGS, settings);
    return response.data;
  } catch (error) {
    console.error('Error updating email settings:', error);
    throw error;
  }
};

export default commAdminApi;
