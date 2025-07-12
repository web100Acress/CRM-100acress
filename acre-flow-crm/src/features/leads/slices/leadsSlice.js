// Leads slice for Redux Toolkit
// Manages leads state

import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { leadsApi } from '@/features/leads/api/leadsApi';

// Async thunks
export const fetchLeads = createAsyncThunk(
  'leads/fetchLeads',
  async (_, { rejectWithValue }) => {
    try {
      const response = await leadsApi.fetchAll();
      return response;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const createLead = createAsyncThunk(
  'leads/createLead',
  async (leadData, { rejectWithValue }) => {
    try {
      const response = await leadsApi.create(leadData);
      return response;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const updateLead = createAsyncThunk(
  'leads/updateLead',
  async ({ leadId, leadData }, { rejectWithValue }) => {
    try {
      const response = await leadsApi.update(leadId, leadData);
      return response;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const deleteLead = createAsyncThunk(
  'leads/deleteLead',
  async (leadId, { rejectWithValue }) => {
    try {
      await leadsApi.delete(leadId);
      return leadId;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const assignLead = createAsyncThunk(
  'leads/assignLead',
  async ({ leadId, userId }, { rejectWithValue }) => {
    try {
      const response = await leadsApi.assign(leadId, userId);
      return response;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

// Initial state
const initialState = {
  leads: [],
  currentLead: null,
  isLoading: false,
  error: null,
};

// Leads slice
const leadsSlice = createSlice({
  name: 'leads',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    setCurrentLead: (state, action) => {
      state.currentLead = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch leads
      .addCase(fetchLeads.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchLeads.fulfilled, (state, action) => {
        state.isLoading = false;
        state.leads = action.payload;
      })
      .addCase(fetchLeads.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      // Create lead
      .addCase(createLead.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(createLead.fulfilled, (state, action) => {
        state.isLoading = false;
        state.leads.push(action.payload);
      })
      .addCase(createLead.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      // Update lead
      .addCase(updateLead.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(updateLead.fulfilled, (state, action) => {
        state.isLoading = false;
        const index = state.leads.findIndex(lead => lead.id === action.payload.id);
        if (index !== -1) {
          state.leads[index] = action.payload;
        }
      })
      .addCase(updateLead.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      // Delete lead
      .addCase(deleteLead.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(deleteLead.fulfilled, (state, action) => {
        state.isLoading = false;
        state.leads = state.leads.filter(lead => lead.id !== action.payload);
      })
      .addCase(deleteLead.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      // Assign lead
      .addCase(assignLead.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(assignLead.fulfilled, (state, action) => {
        state.isLoading = false;
        const index = state.leads.findIndex(lead => lead.id === action.payload.id);
        if (index !== -1) {
          state.leads[index] = action.payload;
        }
      })
      .addCase(assignLead.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      });
  },
});

export const { clearError, setCurrentLead } = leadsSlice.actions;
export default leadsSlice.reducer; 