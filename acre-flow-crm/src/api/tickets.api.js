import axios from 'axios';
import { API_ENDPOINTS as ENDPOINTS } from '@/config/apiConfig';

// Create axios instance for tickets API
const ticketsApi = axios.create({
  baseURL: ENDPOINTS.TICKETS.LIST.split('/tickets')[0],
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add request interceptor to include auth token
ticketsApi.interceptors.request.use(
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
ticketsApi.interceptors.response.use(
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

// Tickets API functions
export const fetchTickets = async (filters = {}) => {
  try {
    const response = await ticketsApi.get(ENDPOINTS.TICKETS.LIST, { params: filters });
    return response.data;
  } catch (error) {
    console.error('Error fetching tickets:', error);
    throw error;
  }
};

export const fetchTicketById = async (ticketId) => {
  try {
    const response = await ticketsApi.get(ENDPOINTS.TICKETS.GET_BY_ID(ticketId));
    return response.data;
  } catch (error) {
    console.error('Error fetching ticket by ID:', error);
    throw error;
  }
};

export const createTicket = async (ticketData) => {
  try {
    const response = await ticketsApi.post(ENDPOINTS.TICKETS.CREATE, ticketData);
    return response.data;
  } catch (error) {
    console.error('Error creating ticket:', error);
    throw error;
  }
};

export const updateTicket = async (ticketId, ticketData) => {
  try {
    const response = await ticketsApi.put(ENDPOINTS.TICKETS.UPDATE(ticketId), ticketData);
    return response.data;
  } catch (error) {
    console.error('Error updating ticket:', error);
    throw error;
  }
};

export const deleteTicket = async (ticketId) => {
  try {
    const response = await ticketsApi.delete(ENDPOINTS.TICKETS.DELETE(ticketId));
    return response.data;
  } catch (error) {
    console.error('Error deleting ticket:', error);
    throw error;
  }
};

export const updateTicketStatus = async (ticketId, status) => {
  try {
    const response = await ticketsApi.patch(ENDPOINTS.TICKETS.UPDATE_STATUS(ticketId), { status });
    return response.data;
  } catch (error) {
    console.error('Error updating ticket status:', error);
    throw error;
  }
};

export const assignTicket = async (ticketId, assigneeId) => {
  try {
    const response = await ticketsApi.patch(ENDPOINTS.TICKETS.ASSIGN(ticketId), { assigneeId });
    return response.data;
  } catch (error) {
    console.error('Error assigning ticket:', error);
    throw error;
  }
};

// Additional tickets API functions
export const fetchTicketsByStatus = async (status) => {
  try {
    const response = await ticketsApi.get(`/tickets/status/${status}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching tickets by status:', error);
    throw error;
  }
};

export const fetchTicketsByUser = async (userId) => {
  try {
    const response = await ticketsApi.get(`/tickets/user/${userId}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching tickets by user:', error);
    throw error;
  }
};

export const fetchTicketsByPriority = async (priority) => {
  try {
    const response = await ticketsApi.get(`/tickets/priority/${priority}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching tickets by priority:', error);
    throw error;
  }
};

export const addTicketComment = async (ticketId, comment) => {
  try {
    const response = await ticketsApi.post(`/tickets/${ticketId}/comments`, { comment });
    return response.data;
  } catch (error) {
    console.error('Error adding ticket comment:', error);
    throw error;
  }
};

export const fetchTicketComments = async (ticketId) => {
  try {
    const response = await ticketsApi.get(`/tickets/${ticketId}/comments`);
    return response.data;
  } catch (error) {
    console.error('Error fetching ticket comments:', error);
    throw error;
  }
};

export const updateTicketPriority = async (ticketId, priority) => {
  try {
    const response = await ticketsApi.patch(`/tickets/${ticketId}/priority`, { priority });
    return response.data;
  } catch (error) {
    console.error('Error updating ticket priority:', error);
    throw error;
  }
};

export const closeTicket = async (ticketId, resolution) => {
  try {
    const response = await ticketsApi.patch(`/tickets/${ticketId}/close`, { resolution });
    return response.data;
  } catch (error) {
    console.error('Error closing ticket:', error);
    throw error;
  }
};

export const reopenTicket = async (ticketId, reason) => {
  try {
    const response = await ticketsApi.patch(`/tickets/${ticketId}/reopen`, { reason });
    return response.data;
  } catch (error) {
    console.error('Error reopening ticket:', error);
    throw error;
  }
};

export default ticketsApi;

export { ticketsApi };
