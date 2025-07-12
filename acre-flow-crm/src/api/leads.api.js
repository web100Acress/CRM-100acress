// Centralized Leads API functions
// All lead management-related API calls are defined here

import { http } from './http.js';
import { ENDPOINTS } from './endpoints.js';

// Get all leads
export const fetchLeads = async () => {
  try {
    const response = await http.get(ENDPOINTS.LEADS.LIST);
    return response;
  } catch (error) {
    throw error;
  }
};

// Get lead by ID
export const fetchLeadById = async (leadId) => {
  try {
    const response = await http.get(ENDPOINTS.LEADS.GET_BY_ID(leadId));
    return response;
  } catch (error) {
    throw error;
  }
};

// Create new lead
export const createLead = async (leadData) => {
  try {
    const response = await http.post(ENDPOINTS.LEADS.CREATE, leadData);
    return response;
  } catch (error) {
    throw error;
  }
};

// Update lead
export const updateLead = async (leadId, leadData) => {
  try {
    const response = await http.put(ENDPOINTS.LEADS.UPDATE(leadId), leadData);
    return response;
  } catch (error) {
    throw error;
  }
};

// Delete lead
export const deleteLead = async (leadId) => {
  try {
    const response = await http.delete(ENDPOINTS.LEADS.DELETE(leadId));
    return response;
  } catch (error) {
    throw error;
  }
};

// Assign lead to user
export const assignLead = async (leadId, userId) => {
  try {
    const response = await http.put(ENDPOINTS.LEADS.ASSIGN(leadId), { assignedTo: userId });
    return response;
  } catch (error) {
    throw error;
  }
};

// Get lead follow-ups
export const fetchLeadFollowUps = async (leadId) => {
  try {
    const response = await http.get(ENDPOINTS.LEADS.FOLLOW_UPS(leadId));
    return response;
  } catch (error) {
    throw error;
  }
};

// Add follow-up to lead
export const addLeadFollowUp = async (leadId, followUpData) => {
  try {
    const response = await http.post(ENDPOINTS.LEADS.ADD_FOLLOW_UP(leadId), followUpData);
    return response;
  } catch (error) {
    throw error;
  }
};

// Get assignable users for leads
export const fetchAssignableUsers = async () => {
  try {
    const response = await http.get(ENDPOINTS.LEADS.ASSIGNABLE_USERS);
    return response;
  } catch (error) {
    throw error;
  }
};

// Leads API object for easy importing
export const leadsApi = {
  fetchAll: fetchLeads,
  fetchById: fetchLeadById,
  create: createLead,
  update: updateLead,
  delete: deleteLead,
  assign: assignLead,
  fetchFollowUps: fetchLeadFollowUps,
  addFollowUp: addLeadFollowUp,
  fetchAssignableUsers,
}; 