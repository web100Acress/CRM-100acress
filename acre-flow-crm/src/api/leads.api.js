import axios from 'axios';
import { ENDPOINTS } from './endpoints.js';

// Create axios instance for leads API
const leadsApi = axios.create({
  baseURL: ENDPOINTS.LEADS.LIST.split('/api/leads')[0],
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add request interceptor to include auth token
leadsApi.interceptors.request.use(
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
leadsApi.interceptors.response.use(
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

// Leads API functions
export const fetchLeads = async (filters = {}) => {
  try {
    const response = await leadsApi.get(ENDPOINTS.LEADS.LIST, { params: filters });
    return response.data;
  } catch (error) {
    console.error('Error fetching leads:', error);
    throw error;
  }
};

export const fetchLeadById = async (leadId) => {
  try {
    const response = await leadsApi.get(ENDPOINTS.LEADS.GET_BY_ID(leadId));
    return response.data;
  } catch (error) {
    console.error('Error fetching lead by ID:', error);
    throw error;
  }
};

export const createLead = async (leadData) => {
  try {
    const response = await leadsApi.post(ENDPOINTS.LEADS.CREATE, leadData);
    return response.data;
  } catch (error) {
    console.error('Error creating lead:', error);
    throw error;
  }
};

export const updateLead = async (leadId, leadData) => {
  try {
    const response = await leadsApi.put(ENDPOINTS.LEADS.UPDATE(leadId), leadData);
    return response.data;
  } catch (error) {
    console.error('Error updating lead:', error);
    throw error;
  }
};

export const deleteLead = async (leadId) => {
  try {
    const response = await leadsApi.delete(ENDPOINTS.LEADS.DELETE(leadId));
    return response.data;
  } catch (error) {
    console.error('Error deleting lead:', error);
    throw error;
  }
};

export const assignLead = async (leadId, assigneeId) => {
  try {
    const response = await leadsApi.patch(ENDPOINTS.LEADS.ASSIGN(leadId), { assigneeId });
    return response.data;
  } catch (error) {
    console.error('Error assigning lead:', error);
    throw error;
  }
};

export const fetchLeadFollowUps = async (leadId) => {
  try {
    const response = await leadsApi.get(ENDPOINTS.LEADS.FOLLOW_UPS(leadId));
    return response.data;
  } catch (error) {
    console.error('Error fetching lead follow-ups:', error);
    throw error;
  }
};

export const addLeadFollowUp = async (leadId, followUpData) => {
  try {
    const response = await leadsApi.post(ENDPOINTS.LEADS.ADD_FOLLOW_UP(leadId), followUpData);
    return response.data;
  } catch (error) {
    console.error('Error adding lead follow-up:', error);
    throw error;
  }
};

export const fetchAssignableUsers = async () => {
  try {
    const response = await leadsApi.get(ENDPOINTS.LEADS.ASSIGNABLE_USERS);
    return response.data;
  } catch (error) {
    console.error('Error fetching assignable users:', error);
    throw error;
  }
};

// Additional leads API functions
export const fetchLeadsByStatus = async (status) => {
  try {
    const response = await leadsApi.get(`/api/leads/status/${status}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching leads by status:', error);
    throw error;
  }
};

export const fetchLeadsByUser = async (userId) => {
  try {
    const response = await leadsApi.get(`/api/leads/user/${userId}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching leads by user:', error);
    throw error;
  }
};

export const fetchLeadsBySource = async (source) => {
  try {
    const response = await leadsApi.get(`/api/leads/source/${source}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching leads by source:', error);
    throw error;
  }
};

export const updateLeadStatus = async (leadId, status) => {
  try {
    const response = await leadsApi.patch(`/api/leads/${leadId}/status`, { status });
    return response.data;
  } catch (error) {
    console.error('Error updating lead status:', error);
    throw error;
  }
};

export const fetchBDStatusSummary = async () => {
  try {
    const response = await leadsApi.get(ENDPOINTS.LEADS.BD_STATUS_SUMMARY);
    return response.data;
  } catch (error) {
    console.error('Error fetching BD status summary:', error);
    throw error;
  }
};

export const fetchBDStatus = async (bdId) => {
  try {
    const response = await leadsApi.get(ENDPOINTS.LEADS.BD_STATUS(bdId));
    return response.data;
  } catch (error) {
    console.error('Error fetching BD status:', error);
    throw error;
  }
};

export const forwardLead = async (leadId, targetUserId, notes) => {
  try {
    const response = await leadsApi.post(`/api/leads/${leadId}/forward`, { 
      targetUserId, 
      notes 
    });
    return response.data;
  } catch (error) {
    console.error('Error forwarding lead:', error);
    throw error;
  }
};

export const swapLead = async (leadId, targetUserId) => {
  try {
    const response = await leadsApi.post(`/api/leads/${leadId}/swap`, { targetUserId });
    return response.data;
  } catch (error) {
    console.error('Error swapping lead:', error);
    throw error;
  }
};

export const switchLead = async (leadId, targetUserId) => {
  try {
    const response = await leadsApi.post(`/api/leads/${leadId}/switch`, { targetUserId });
    return response.data;
  } catch (error) {
    console.error('Error switching lead:', error);
    throw error;
  }
};

export default leadsApi;

export { leadsApi };
