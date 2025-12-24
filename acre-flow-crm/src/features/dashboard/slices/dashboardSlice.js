
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { dashboardApi } from '@/features/dashboard/api/dashboardApi';

// Async thunks
export const fetchDashboardStats = createAsyncThunk(
  'dashboard/fetchDashboardStats',
  async (_, { rejectWithValue }) => {
    try {
      const response = await dashboardApi.fetchStats();
      return response;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const fetchRecentActivity = createAsyncThunk(
  'dashboard/fetchRecentActivity',
  async (_, { rejectWithValue }) => {
    try {
      const response = await dashboardApi.fetchRecentActivity();
      return response;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const fetchChartsData = createAsyncThunk(
  'dashboard/fetchChartsData',
  async (_, { rejectWithValue }) => {
    try {
      const response = await dashboardApi.fetchChartsData();
      return response;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

// Initial state
const initialState = {
  stats: null,
  recentActivity: [],
  chartsData: null,
  isLoading: false,
  error: null,
};

// Dashboard slice
const dashboardSlice = createSlice({
  name: 'dashboard',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch dashboard stats
      .addCase(fetchDashboardStats.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchDashboardStats.fulfilled, (state, action) => {
        state.isLoading = false;
        state.stats = action.payload;
      })
      .addCase(fetchDashboardStats.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      // Fetch recent activity
      .addCase(fetchRecentActivity.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchRecentActivity.fulfilled, (state, action) => {
        state.isLoading = false;
        state.recentActivity = action.payload;
      })
      .addCase(fetchRecentActivity.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      // Fetch charts data
      .addCase(fetchChartsData.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchChartsData.fulfilled, (state, action) => {
        state.isLoading = false;
        state.chartsData = action.payload;
      })
      .addCase(fetchChartsData.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      });
  },
});

export const { clearError } = dashboardSlice.actions;
export default dashboardSlice.reducer; 