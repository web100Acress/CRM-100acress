// Tickets feature API - Local re-export from centralized API
// This file only imports and configures the central tickets API functions

import { 
  fetchTickets, 
  fetchTicketById, 
  createTicket, 
  updateTicket, 
  deleteTicket, 
  updateTicketStatus, 
  assignTicket,
  ticketsApi 
} from '@/api/tickets.api';

// Re-export all tickets API functions for use in tickets feature
export {
  fetchTickets,
  fetchTicketById,
  createTicket,
  updateTicket,
  deleteTicket,
  updateTicketStatus,
  assignTicket,
  ticketsApi,
};

// Tickets API object for easy importing within the tickets feature
export const ticketsFeatureApi = {
  fetchAll: fetchTickets,
  fetchById: fetchTicketById,
  create: createTicket,
  update: updateTicket,
  delete: deleteTicket,
  updateStatus: updateTicketStatus,
  assign: assignTicket,
}; 