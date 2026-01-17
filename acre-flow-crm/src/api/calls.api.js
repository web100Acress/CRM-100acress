import axios from 'axios';
import { ENDPOINTS } from './endpoints.js';

// Create axios instance for calls API
const callsApi = axios.create({
  baseURL: ENDPOINTS.CALLS.LOGS.split('/calls')[0],
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add request interceptor to include auth token
callsApi.interceptors.request.use(
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
callsApi.interceptors.response.use(
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

// Calls API functions
export const logs = async (filters = {}) => {
  try {
    const response = await callsApi.get(ENDPOINTS.CALLS.LOGS, { params: filters });
    return response.data;
  } catch (error) {
    console.error('Error fetching call logs:', error);
    throw error;
  }
};

export const getCallById = async (callId) => {
  try {
    const response = await callsApi.get(`${ENDPOINTS.CALLS.LOGS}/${callId}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching call by ID:', error);
    throw error;
  }
};

export const updateNotes = async (callId, notesData) => {
  try {
    const response = await callsApi.patch(`${ENDPOINTS.CALLS.LOGS}/${callId}/notes`, notesData);
    return response.data;
  } catch (error) {
    console.error('Error updating call notes:', error);
    throw error;
  }
};

export const updateCallStatus = async (callId, status) => {
  try {
    const response = await callsApi.patch(`${ENDPOINTS.CALLS.LOGS}/${callId}/status`, { status });
    return response.data;
  } catch (error) {
    console.error('Error updating call status:', error);
    throw error;
  }
};

export const deleteCall = async (callId) => {
  try {
    const response = await callsApi.delete(`${ENDPOINTS.CALLS.LOGS}/${callId}`);
    return response.data;
  } catch (error) {
    console.error('Error deleting call:', error);
    throw error;
  }
};

export const fetchCallRecording = async (callId) => {
  try {
    const response = await callsApi.get(`${ENDPOINTS.CALLS.LOGS}/${callId}/recording`);
    return response.data;
  } catch (error) {
    console.error('Error fetching call recording:', error);
    throw error;
  }
};

export const downloadCallRecording = async (callId) => {
  try {
    const response = await callsApi.get(`${ENDPOINTS.CALLS.LOGS}/${callId}/recording/download`, {
      responseType: 'blob'
    });
    return response.data;
  } catch (error) {
    console.error('Error downloading call recording:', error);
    throw error;
  }
};

export const initiateCall = async (callData) => {
  try {
    const response = await callsApi.post(ENDPOINTS.CALLS.INITIATE, callData);
    return response.data;
  } catch (error) {
    console.error('Error initiating call:', error);
    throw error;
  }
};

export const endCall = async (callId) => {
  try {
    const response = await callsApi.post(`${ENDPOINTS.CALLS.LOGS}/${callId}/end`);
    return response.data;
  } catch (error) {
    console.error('Error ending call:', error);
    throw error;
  }
};

export const holdCall = async (callId) => {
  try {
    const response = await callsApi.post(`${ENDPOINTS.CALLS.LOGS}/${callId}/hold`);
    return response.data;
  } catch (error) {
    console.error('Error holding call:', error);
    throw error;
  }
};

export const unholdCall = async (callId) => {
  try {
    const response = await callsApi.post(`${ENDPOINTS.CALLS.LOGS}/${callId}/unhold`);
    return response.data;
  } catch (error) {
    console.error('Error unholding call:', error);
    throw error;
  }
};

export const transferCall = async (callId, transferData) => {
  try {
    const response = await callsApi.post(`${ENDPOINTS.CALLS.LOGS}/${callId}/transfer`, transferData);
    return response.data;
  } catch (error) {
    console.error('Error transferring call:', error);
    throw error;
  }
};

export const fetchCallStatistics = async (filters = {}) => {
  try {
    const response = await callsApi.get(ENDPOINTS.CALLS.STATISTICS, { params: filters });
    return response.data;
  } catch (error) {
    console.error('Error fetching call statistics:', error);
    throw error;
  }
};

export const exportCallLogs = async (filters = {}) => {
  try {
    const response = await callsApi.get(ENDPOINTS.CALLS.EXPORT, { 
      params: filters,
      responseType: 'blob'
    });
    return response.data;
  } catch (error) {
    console.error('Error exporting call logs:', error);
    throw error;
  }
};

export default callsApi;

export { callsApi };
