// Centralized Tickets API functions
// All ticket management-related API calls are defined here

import { http } from './http.js';
import { ENDPOINTS } from './endpoints.js';

// Get all tickets
export const fetchTickets = async () => {
  try {
    const response = await http.get(ENDPOINTS.TICKETS.LIST);
    return response;
  } catch (error) {
    throw error;
  }
};

// Get ticket by ID
export const fetchTicketById = async (ticketId) => {
  try {
    const response = await http.get(ENDPOINTS.TICKETS.GET_BY_ID(ticketId));
    return response;
  } catch (error) {
    throw error;
  }
};

// Create new ticket
export const createTicket = async (ticketData) => {
  try {
    const response = await http.post(ENDPOINTS.TICKETS.CREATE, ticketData);
    return response;
  } catch (error) {
    throw error;
  }
};

// Update ticket
export const updateTicket = async (ticketId, ticketData) => {
  try {
    const response = await http.put(ENDPOINTS.TICKETS.UPDATE(ticketId), ticketData);
    return response;
  } catch (error) {
    throw error;
  }
};

// Delete ticket
export const deleteTicket = async (ticketId) => {
  try {
    const response = await http.delete(ENDPOINTS.TICKETS.DELETE(ticketId));
    return response;
  } catch (error) {
    throw error;
  }
};

// Update ticket status
export const updateTicketStatus = async (ticketId, status) => {
  try {
    const response = await http.put(ENDPOINTS.TICKETS.UPDATE_STATUS(ticketId), { status });
    return response;
  } catch (error) {
    throw error;
  }
};

// Assign ticket to user
export const assignTicket = async (ticketId, userId) => {
  try {
    const response = await http.put(ENDPOINTS.TICKETS.ASSIGN(ticketId), { assignedTo: userId });
    return response;
  } catch (error) {
    throw error;
  }
};

// Tickets API object for easy importing
export const ticketsApi = {
  fetchAll: fetchTickets,
  fetchById: fetchTicketById,
  create: createTicket,
  update: updateTicket,
  delete: deleteTicket,
  updateStatus: updateTicketStatus,
  assign: assignTicket,
}; 