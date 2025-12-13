import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api100acress from '../../config/api100acressClient';

// Async thunk to fetch active small banners
export const fetchActiveSmallBanners = createAsyncThunk(
  'smallBanner/fetchActiveSmallBanners',
  async (_, { rejectWithValue }) => {
    try {
      console.log('SmallBannerSlice: fetchActiveSmallBanners - Using api100acress');
      
      const response = await api100acress.get('/api/small-banners/active');
      return response.data?.banners || [];
    } catch (error) {
      console.error('SmallBannerSlice: fetchActiveSmallBanners - Error:', error);
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);

// Async thunk to fetch all small banners (admin)
export const fetchAllSmallBanners = createAsyncThunk(
  'smallBanner/fetchAllSmallBanners',
  async (_, { rejectWithValue }) => {
    try {
      console.log('SmallBannerSlice: fetchAllSmallBanners - Using api100acress');
      
      const response = await api100acress.get('/api/admin/small-banners');
      return response.data?.banners || [];
    } catch (error) {
      console.error('SmallBannerSlice: fetchAllSmallBanners - Error:', error);
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);

// Async thunk to create small banner (admin)
export const createSmallBanner = createAsyncThunk(
  'smallBanner/createSmallBanner',
  async (bannerData, { rejectWithValue }) => {
    try {
      console.log('SmallBannerSlice: createSmallBanner - Using api100acress');
      
      const response = await api100acress.post('/api/admin/small-banners/upload', bannerData);
      return response.data?.smallBanner || response.data;
    } catch (error) {
      console.error('SmallBannerSlice: createSmallBanner - Error:', error);
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);

// Async thunk to update small banner (admin)
export const updateSmallBanner = createAsyncThunk(
  'smallBanner/updateSmallBanner',
  async ({ id, bannerData }, { rejectWithValue }) => {
    try {
      console.log('SmallBannerSlice: updateSmallBanner - Using api100acress');
      
      const response = await api100acress.put(`/api/admin/small-banners/${id}`, bannerData);
      return response.data?.smallBanner || response.data;
    } catch (error) {
      console.error('SmallBannerSlice: updateSmallBanner - Error:', error);
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);

// Async thunk to delete small banner (admin)
export const deleteSmallBanner = createAsyncThunk(
  'smallBanner/deleteSmallBanner',
  async (id, { rejectWithValue }) => {
    try {
      console.log('SmallBannerSlice: deleteSmallBanner - Using api100acress');
      
      await api100acress.delete(`/api/admin/small-banners/${id}`);
      return id;
    } catch (error) {
      console.error('SmallBannerSlice: deleteSmallBanner - Error:', error);
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);

// Async thunk to toggle small banner status (admin)
export const toggleSmallBannerStatus = createAsyncThunk(
  'smallBanner/toggleSmallBannerStatus',
  async (id, { rejectWithValue }) => {
    try {
      console.log('SmallBannerSlice: toggleSmallBannerStatus - Using api100acress');
      
      const response = await api100acress.patch(`/api/admin/small-banners/${id}/toggle`);
      return response.data?.smallBanner || response.data;
    } catch (error) {
      console.error('SmallBannerSlice: toggleSmallBannerStatus - Error:', error);
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);

const smallBannerSlice = createSlice({
  name: 'smallBanner',
  initialState: {
    activeSmallBanners: [],
    allSmallBanners: [],
    currentSmallBanner: null,
    loading: false,
    error: null,
  },
  reducers: {
    clearSmallBanners: (state) => {
      state.activeSmallBanners = [];
      state.allSmallBanners = [];
      state.currentSmallBanner = null;
      state.error = null;
    },
    setCurrentSmallBanner: (state, action) => {
      state.currentSmallBanner = action.payload;
    },
    clearError: (state) => {
      state.error = null;
    }
  },
  extraReducers: (builder) => {
    builder
      // Fetch active small banners
      .addCase(fetchActiveSmallBanners.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchActiveSmallBanners.fulfilled, (state, action) => {
        state.loading = false;
        state.activeSmallBanners = action.payload;
        state.error = null;
      })
      .addCase(fetchActiveSmallBanners.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Fetch all small banners
      .addCase(fetchAllSmallBanners.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchAllSmallBanners.fulfilled, (state, action) => {
        console.log('SmallBannerSlice: fetchAllSmallBanners.fulfilled - Payload:', action.payload);
        state.loading = false;
        state.allSmallBanners = action.payload;
        state.error = null;
      })
      .addCase(fetchAllSmallBanners.rejected, (state, action) => {
        console.log('SmallBannerSlice: fetchAllSmallBanners.rejected - Error:', action.payload);
        state.loading = false;
        state.error = action.payload;
      })
      // Create small banner
      .addCase(createSmallBanner.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createSmallBanner.fulfilled, (state, action) => {
        state.loading = false;
        state.allSmallBanners.push(action.payload);
        state.error = null;
      })
      .addCase(createSmallBanner.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Update small banner
      .addCase(updateSmallBanner.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateSmallBanner.fulfilled, (state, action) => {
        state.loading = false;
        const index = state.allSmallBanners.findIndex(banner => banner._id === action.payload._id);
        if (index !== -1) {
          state.allSmallBanners[index] = action.payload;
        }
        state.error = null;
      })
      .addCase(updateSmallBanner.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Delete small banner
      .addCase(deleteSmallBanner.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteSmallBanner.fulfilled, (state, action) => {
        state.loading = false;
        state.allSmallBanners = state.allSmallBanners.filter(banner => banner._id !== action.payload);
        state.error = null;
      })
      .addCase(deleteSmallBanner.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Toggle small banner status
      .addCase(toggleSmallBannerStatus.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(toggleSmallBannerStatus.fulfilled, (state, action) => {
        state.loading = false;
        const index = state.allSmallBanners.findIndex(banner => banner._id === action.payload._id);
        if (index !== -1) {
          state.allSmallBanners[index] = action.payload;
        }
        state.error = null;
      })
      .addCase(toggleSmallBannerStatus.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  }
});

export const { clearSmallBanners, setCurrentSmallBanner, clearError } = smallBannerSlice.actions;
export default smallBannerSlice.reducer;
