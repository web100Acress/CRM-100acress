// Leads feature API - Local re-export from centralized API
// This file only imports and configures the central leads API functions

import { 
  fetchLeads, 
  fetchLeadById, 
  createLead, 
  updateLead, 
  deleteLead, 
  assignLead, 
  fetchLeadFollowUps, 
  addLeadFollowUp, 
  fetchAssignableUsers,
  leadsApi 
} from '@/api/leads.api';

// Re-export all leads API functions for use in leads feature
export {
  fetchLeads,
  fetchLeadById,
  createLead,
  updateLead,
  deleteLead,
  assignLead,
  fetchLeadFollowUps,
  addLeadFollowUp,
  fetchAssignableUsers,
  leadsApi,
};

// Leads API object for easy importing within the leads feature
export const leadsFeatureApi = {
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