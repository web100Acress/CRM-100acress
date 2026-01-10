import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api100acress from '../../config/api100acressClient';

// Async thunk to fetch active banners
export const fetchActiveBanners = createAsyncThunk(
  'banner/fetchActiveBanners',
  async (_, { rejectWithValue }) => {
    try {
      console.log('BannerSlice: fetchActiveBanners - Using api100acress');
      
      const response = await api100acress.get('/api/banners/active');
      return response.data?.banners || [];
    } catch (error) {
      console.error('BannerSlice: fetchActiveBanners - Error:', error);
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);

// Async thunk to fetch all banners (admin)
export const fetchAllBanners = createAsyncThunk(
  'banner/fetchAllBanners',
  async (_, { rejectWithValue }) => {
    try {
      console.log('BannerSlice: fetchAllBanners - Using api100acress');
      
      const response = await api100acress.get('/api/admin/banners');
      return response.data?.banners || [];
    } catch (error) {
      console.error('BannerSlice: fetchAllBanners - Error:', error);
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);

const bannerSlice = createSlice({
  name: 'banner',
  initialState: {
    activeBanners: [],
    allBanners: [],
    currentBanner: null,
    loading: false,
    error: null,
  },
  reducers: {
    clearBanners: (state) => {
      state.activeBanners = [];
      state.allBanners = [];
      state.currentBanner = null;
      state.error = null;
    },
    setCurrentBanner: (state, action) => {
      state.currentBanner = action.payload;
    },
    clearError: (state) => {
      state.error = null;
    }
  },
  extraReducers: (builder) => {
    builder
      // Fetch active banners
      .addCase(fetchActiveBanners.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchActiveBanners.fulfilled, (state, action) => {
        state.loading = false;
        state.activeBanners = action.payload;
        state.error = null;
      })
      .addCase(fetchActiveBanners.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Fetch all banners
      .addCase(fetchAllBanners.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchAllBanners.fulfilled, (state, action) => {
        state.loading = false;
        state.allBanners = action.payload;
        state.error = null;
      })
      .addCase(fetchAllBanners.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  }
});

export const { clearBanners, setCurrentBanner, clearError } = bannerSlice.actions;
export default bannerSlice.reducer;
