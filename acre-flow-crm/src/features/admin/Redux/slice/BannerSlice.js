import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

// Async thunks for banner operations
export const fetchBanners = createAsyncThunk(
  'banner/fetchBanners',
  async (_, { rejectWithValue }) => {
    try {
      const response = await fetch('/api/banners');
      if (!response.ok) {
        throw new Error('Failed to fetch banners');
      }
      const data = await response.json();
      return data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const createBanner = createAsyncThunk(
  'banner/createBanner',
  async (bannerData, { rejectWithValue }) => {
    try {
      const response = await fetch('/api/banners', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(bannerData),
      });
      if (!response.ok) {
        throw new Error('Failed to create banner');
      }
      const data = await response.json();
      return data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const updateBanner = createAsyncThunk(
  'banner/updateBanner',
  async ({ id, bannerData }, { rejectWithValue }) => {
    try {
      const response = await fetch(`/api/banners/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(bannerData),
      });
      if (!response.ok) {
        throw new Error('Failed to update banner');
      }
      const data = await response.json();
      return data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const deleteBanner = createAsyncThunk(
  'banner/deleteBanner',
  async (id, { rejectWithValue }) => {
    try {
      const response = await fetch(`/api/banners/${id}`, {
        method: 'DELETE',
      });
      if (!response.ok) {
        throw new Error('Failed to delete banner');
      }
      return id;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

const initialState = {
  banners: [],
  loading: false,
  error: null,
  currentBanner: null,
};

const bannerSlice = createSlice({
  name: 'banner',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    setCurrentBanner: (state, action) => {
      state.currentBanner = action.payload;
    },
    clearCurrentBanner: (state) => {
      state.currentBanner = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch banners
      .addCase(fetchBanners.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchBanners.fulfilled, (state, action) => {
        state.loading = false;
        state.banners = action.payload;
      })
      .addCase(fetchBanners.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Create banner
      .addCase(createBanner.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createBanner.fulfilled, (state, action) => {
        state.loading = false;
        state.banners.push(action.payload);
      })
      .addCase(createBanner.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Update banner
      .addCase(updateBanner.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateBanner.fulfilled, (state, action) => {
        state.loading = false;
        const index = state.banners.findIndex(banner => banner.id === action.payload.id);
        if (index !== -1) {
          state.banners[index] = action.payload;
        }
        if (state.currentBanner && state.currentBanner.id === action.payload.id) {
          state.currentBanner = action.payload;
        }
      })
      .addCase(updateBanner.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Delete banner
      .addCase(deleteBanner.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteBanner.fulfilled, (state, action) => {
        state.loading = false;
        state.banners = state.banners.filter(banner => banner.id !== action.payload);
        if (state.currentBanner && state.currentBanner.id === action.payload) {
          state.currentBanner = null;
        }
      })
      .addCase(deleteBanner.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { clearError, setCurrentBanner, clearCurrentBanner } = bannerSlice.actions;
export default bannerSlice.reducer;
