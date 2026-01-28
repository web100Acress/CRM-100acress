import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import SiteVisitApiService from '../api/siteVisitApi';
import { SITE_VISIT_STATUS, VISIT_TYPE, INTEREST_LEVEL } from '@/models/siteVisitModel';

// Async thunks
export const fetchSiteVisits = createAsyncThunk(
  'siteVisits/fetchSiteVisits',
  async (filters = {}, { rejectWithValue }) => {
    try {
      const response = await SiteVisitApiService.getSiteVisits(filters);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const fetchSiteVisitById = createAsyncThunk(
  'siteVisits/fetchSiteVisitById',
  async (id, { rejectWithValue }) => {
    try {
      const response = await SiteVisitApiService.getSiteVisitById(id);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const createSiteVisit = createAsyncThunk(
  'siteVisits/createSiteVisit',
  async (visitData, { rejectWithValue }) => {
    try {
      const response = await SiteVisitApiService.createSiteVisit(visitData);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const updateSiteVisit = createAsyncThunk(
  'siteVisits/updateSiteVisit',
  async ({ id, visitData }, { rejectWithValue }) => {
    try {
      const response = await SiteVisitApiService.updateSiteVisit(id, visitData);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const deleteSiteVisit = createAsyncThunk(
  'siteVisits/deleteSiteVisit',
  async (id, { rejectWithValue }) => {
    try {
      await SiteVisitApiService.deleteSiteVisit(id);
      return id;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const fetchSiteVisitsByLead = createAsyncThunk(
  'siteVisits/fetchSiteVisitsByLead',
  async (leadId, { rejectWithValue }) => {
    try {
      const response = await SiteVisitApiService.getSiteVisitsByLead(leadId);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const fetchSiteVisitsByAgent = createAsyncThunk(
  'siteVisits/fetchSiteVisitsByAgent',
  async (agentId, { rejectWithValue }) => {
    try {
      const response = await SiteVisitApiService.getSiteVisitsByAgent(agentId);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const fetchTodaySiteVisits = createAsyncThunk(
  'siteVisits/fetchTodaySiteVisits',
  async (_, { rejectWithValue }) => {
    try {
      const response = await SiteVisitApiService.getTodaySiteVisits();
      return response.data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const fetchUpcomingSiteVisits = createAsyncThunk(
  'siteVisits/fetchUpcomingSiteVisits',
  async (_, { rejectWithValue }) => {
    try {
      const response = await SiteVisitApiService.getUpcomingSiteVisits();
      return response.data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const submitFeedback = createAsyncThunk(
  'siteVisits/submitFeedback',
  async ({ id, feedbackData }, { rejectWithValue }) => {
    try {
      const response = await SiteVisitApiService.submitFeedback(id, feedbackData);
      return { id, feedback: response.data };
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const completeSiteVisit = createAsyncThunk(
  'siteVisits/completeSiteVisit',
  async ({ id, completionData }, { rejectWithValue }) => {
    try {
      const response = await SiteVisitApiService.completeSiteVisit(id, completionData);
      return { id, data: response.data };
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const cancelSiteVisit = createAsyncThunk(
  'siteVisits/cancelSiteVisit',
  async ({ id, cancellationData }, { rejectWithValue }) => {
    try {
      const response = await SiteVisitApiService.cancelSiteVisit(id, cancellationData);
      return { id, data: response.data };
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const rescheduleSiteVisit = createAsyncThunk(
  'siteVisits/rescheduleSiteVisit',
  async ({ id, rescheduleData }, { rejectWithValue }) => {
    try {
      const response = await SiteVisitApiService.rescheduleSiteVisit(id, rescheduleData);
      return { id, data: response.data };
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const fetchDashboardMetrics = createAsyncThunk(
  'siteVisits/fetchDashboardMetrics',
  async (_, { rejectWithValue }) => {
    try {
      const response = await SiteVisitApiService.getDashboardMetrics();
      return response.data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

// Initial state
const initialState = {
  siteVisits: [],
  currentSiteVisit: null,
  todaySiteVisits: [],
  upcomingSiteVisits: [],
  leadSiteVisits: [],
  agentSiteVisits: [],
  dashboardMetrics: null,
  loading: false,
  error: null,
  filters: {
    status: '',
    agentId: '',
    leadId: '',
    dateFrom: '',
    dateTo: '',
    visitType: ''
  }
};

// Slice
const siteVisitSlice = createSlice({
  name: 'siteVisits',
  initialState,
  reducers: {
    setFilters: (state, action) => {
      state.filters = { ...state.filters, ...action.payload };
    },
    clearFilters: (state) => {
      state.filters = initialState.filters;
    },
    clearError: (state) => {
      state.error = null;
    },
    clearCurrentSiteVisit: (state) => {
      state.currentSiteVisit = null;
    },
    updateSiteVisitStatus: (state, action) => {
      const { id, status } = action.payload;
      const visit = state.siteVisits.find(v => v._id === id);
      if (visit) {
        visit.status = status;
      }
    }
  },
  extraReducers: (builder) => {
    builder
      // Fetch site visits
      .addCase(fetchSiteVisits.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchSiteVisits.fulfilled, (state, action) => {
        state.loading = false;
        state.siteVisits = action.payload;
      })
      .addCase(fetchSiteVisits.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      
      // Fetch site visit by ID
      .addCase(fetchSiteVisitById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchSiteVisitById.fulfilled, (state, action) => {
        state.loading = false;
        state.currentSiteVisit = action.payload;
      })
      .addCase(fetchSiteVisitById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      
      // Create site visit
      .addCase(createSiteVisit.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createSiteVisit.fulfilled, (state, action) => {
        state.loading = false;
        state.siteVisits.push(action.payload);
      })
      .addCase(createSiteVisit.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      
      // Update site visit
      .addCase(updateSiteVisit.fulfilled, (state, action) => {
        const index = state.siteVisits.findIndex(v => v._id === action.payload._id);
        if (index !== -1) {
          state.siteVisits[index] = action.payload;
        }
        if (state.currentSiteVisit?._id === action.payload._id) {
          state.currentSiteVisit = action.payload;
        }
      })
      
      // Delete site visit
      .addCase(deleteSiteVisit.fulfilled, (state, action) => {
        state.siteVisits = state.siteVisits.filter(v => v._id !== action.payload);
        if (state.currentSiteVisit?._id === action.payload) {
          state.currentSiteVisit = null;
        }
      })
      
      // Fetch site visits by lead
      .addCase(fetchSiteVisitsByLead.fulfilled, (state, action) => {
        state.leadSiteVisits = action.payload;
      })
      
      // Fetch site visits by agent
      .addCase(fetchSiteVisitsByAgent.fulfilled, (state, action) => {
        state.agentSiteVisits = action.payload;
      })
      
      // Fetch today's site visits
      .addCase(fetchTodaySiteVisits.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchTodaySiteVisits.fulfilled, (state, action) => {
        state.loading = false;
        state.todaySiteVisits = action.payload;
      })
      .addCase(fetchTodaySiteVisits.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      
      // Fetch upcoming site visits
      .addCase(fetchUpcomingSiteVisits.fulfilled, (state, action) => {
        state.upcomingSiteVisits = action.payload;
      })
      
      // Submit feedback
      .addCase(submitFeedback.fulfilled, (state, action) => {
        const { id, feedback } = action.payload;
        const visit = state.siteVisits.find(v => v._id === id);
        if (visit) {
          visit.feedback = feedback;
        }
        if (state.currentSiteVisit?._id === id) {
          state.currentSiteVisit.feedback = feedback;
        }
      })
      
      // Complete site visit
      .addCase(completeSiteVisit.fulfilled, (state, action) => {
        const { id, data } = action.payload;
        const visit = state.siteVisits.find(v => v._id === id);
        if (visit) {
          Object.assign(visit, data);
        }
        if (state.currentSiteVisit?._id === id) {
          Object.assign(state.currentSiteVisit, data);
        }
      })
      
      // Cancel site visit
      .addCase(cancelSiteVisit.fulfilled, (state, action) => {
        const { id, data } = action.payload;
        const visit = state.siteVisits.find(v => v._id === id);
        if (visit) {
          Object.assign(visit, data);
        }
        if (state.currentSiteVisit?._id === id) {
          Object.assign(state.currentSiteVisit, data);
        }
      })
      
      // Reschedule site visit
      .addCase(rescheduleSiteVisit.fulfilled, (state, action) => {
        const { id, data } = action.payload;
        const visit = state.siteVisits.find(v => v._id === id);
        if (visit) {
          Object.assign(visit, data);
        }
        if (state.currentSiteVisit?._id === id) {
          Object.assign(state.currentSiteVisit, data);
        }
      })
      
      // Fetch dashboard metrics
      .addCase(fetchDashboardMetrics.fulfilled, (state, action) => {
        state.dashboardMetrics = action.payload;
      });
  },
});

export const {
  setFilters,
  clearFilters,
  clearError,
  clearCurrentSiteVisit,
  updateSiteVisitStatus
} = siteVisitSlice.actions;

// Selectors
export const selectSiteVisits = (state) => state.siteVisits.siteVisits;
export const selectCurrentSiteVisit = (state) => state.siteVisits.currentSiteVisit;
export const selectTodaySiteVisits = (state) => state.siteVisits.todaySiteVisits;
export const selectUpcomingSiteVisits = (state) => state.siteVisits.upcomingSiteVisits;
export const selectLeadSiteVisits = (state) => state.siteVisits.leadSiteVisits;
export const selectAgentSiteVisits = (state) => state.siteVisits.agentSiteVisits;
export const selectDashboardMetrics = (state) => state.siteVisits.dashboardMetrics;
export const selectLoading = (state) => state.siteVisits.loading;
export const selectError = (state) => state.siteVisits.error;
export const selectFilters = (state) => state.siteVisits.filters;

export default siteVisitSlice.reducer;
