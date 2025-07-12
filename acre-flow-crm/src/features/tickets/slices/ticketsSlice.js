// Tickets slice for Redux Toolkit
// Manages tickets state

import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { ticketsApi } from '@/features/tickets/api/ticketsApi';

// Async thunks
export const fetchTickets = createAsyncThunk(
  'tickets/fetchTickets',
  async (_, { rejectWithValue }) => {
    try {
      const response = await ticketsApi.fetchAll();
      return response;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const createTicket = createAsyncThunk(
  'tickets/createTicket',
  async (ticketData, { rejectWithValue }) => {
    try {
      const response = await ticketsApi.create(ticketData);
      return response;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const updateTicket = createAsyncThunk(
  'tickets/updateTicket',
  async ({ ticketId, ticketData }, { rejectWithValue }) => {
    try {
      const response = await ticketsApi.update(ticketId, ticketData);
      return response;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const deleteTicket = createAsyncThunk(
  'tickets/deleteTicket',
  async (ticketId, { rejectWithValue }) => {
    try {
      await ticketsApi.delete(ticketId);
      return ticketId;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const updateTicketStatus = createAsyncThunk(
  'tickets/updateTicketStatus',
  async ({ ticketId, status }, { rejectWithValue }) => {
    try {
      const response = await ticketsApi.updateStatus(ticketId, status);
      return response;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const assignTicket = createAsyncThunk(
  'tickets/assignTicket',
  async ({ ticketId, userId }, { rejectWithValue }) => {
    try {
      const response = await ticketsApi.assign(ticketId, userId);
      return response;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

// Initial state
const initialState = {
  tickets: [],
  currentTicket: null,
  isLoading: false,
  error: null,
};

// Tickets slice
const ticketsSlice = createSlice({
  name: 'tickets',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    setCurrentTicket: (state, action) => {
      state.currentTicket = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch tickets
      .addCase(fetchTickets.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchTickets.fulfilled, (state, action) => {
        state.isLoading = false;
        state.tickets = action.payload;
      })
      .addCase(fetchTickets.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      // Create ticket
      .addCase(createTicket.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(createTicket.fulfilled, (state, action) => {
        state.isLoading = false;
        state.tickets.push(action.payload);
      })
      .addCase(createTicket.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      // Update ticket
      .addCase(updateTicket.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(updateTicket.fulfilled, (state, action) => {
        state.isLoading = false;
        const index = state.tickets.findIndex(ticket => ticket.id === action.payload.id);
        if (index !== -1) {
          state.tickets[index] = action.payload;
        }
      })
      .addCase(updateTicket.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      // Delete ticket
      .addCase(deleteTicket.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(deleteTicket.fulfilled, (state, action) => {
        state.isLoading = false;
        state.tickets = state.tickets.filter(ticket => ticket.id !== action.payload);
      })
      .addCase(deleteTicket.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      // Update ticket status
      .addCase(updateTicketStatus.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(updateTicketStatus.fulfilled, (state, action) => {
        state.isLoading = false;
        const index = state.tickets.findIndex(ticket => ticket.id === action.payload.id);
        if (index !== -1) {
          state.tickets[index] = action.payload;
        }
      })
      .addCase(updateTicketStatus.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      // Assign ticket
      .addCase(assignTicket.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(assignTicket.fulfilled, (state, action) => {
        state.isLoading = false;
        const index = state.tickets.findIndex(ticket => ticket.id === action.payload.id);
        if (index !== -1) {
          state.tickets[index] = action.payload;
        }
      })
      .addCase(assignTicket.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      });
  },
});

export const { clearError, setCurrentTicket } = ticketsSlice.actions;
export default ticketsSlice.reducer; 