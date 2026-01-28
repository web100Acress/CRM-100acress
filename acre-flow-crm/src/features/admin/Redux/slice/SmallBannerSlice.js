import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

// Async thunks for small banner operations
export const fetchSmallBanners = createAsyncThunk(
  'smallBanner/fetchSmallBanners',
  async (_, { rejectWithValue }) => {
    try {
      const response = await fetch('/api/small-banners');
      if (!response.ok) {
        throw new Error('Failed to fetch small banners');
      }
      const data = await response.json();
      return data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const createSmallBanner = createAsyncThunk(
  'smallBanner/createSmallBanner',
  async (bannerData, { rejectWithValue }) => {
    try {
      const response = await fetch('/api/small-banners', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(bannerData),
      });
      if (!response.ok) {
        throw new Error('Failed to create small banner');
      }
      const data = await response.json();
      return data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const updateSmallBanner = createAsyncThunk(
  'smallBanner/updateSmallBanner',
  async ({ id, bannerData }, { rejectWithValue }) => {
    try {
      const response = await fetch(`/api/small-banners/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(bannerData),
      });
      if (!response.ok) {
        throw new Error('Failed to update small banner');
      }
      const data = await response.json();
      return data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const deleteSmallBanner = createAsyncThunk(
  'smallBanner/deleteSmallBanner',
  async (id, { rejectWithValue }) => {
    try {
      const response = await fetch(`/api/small-banners/${id}`, {
        method: 'DELETE',
      });
      if (!response.ok) {
        throw new Error('Failed to delete small banner');
      }
      return id;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const toggleSmallBanner = createAsyncThunk(
  'smallBanner/toggleSmallBanner',
  async ({ id, active }, { rejectWithValue }) => {
    try {
      const response = await fetch(`/api/small-banners/${id}/toggle`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ active }),
      });
      if (!response.ok) {
        throw new Error('Failed to toggle small banner');
      }
      const data = await response.json();
      return data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

const initialState = {
  smallBanners: [],
  loading: false,
  error: null,
  currentSmallBanner: null,
};

const smallBannerSlice = createSlice({
  name: 'smallBanner',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    setCurrentSmallBanner: (state, action) => {
      state.currentSmallBanner = action.payload;
    },
    clearCurrentSmallBanner: (state) => {
      state.currentSmallBanner = null;
    },
    reorderSmallBanners: (state, action) => {
      const { oldIndex, newIndex } = action.payload;
      const [movedBanner] = state.smallBanners.splice(oldIndex, 1);
      state.smallBanners.splice(newIndex, 0, movedBanner);
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch small banners
      .addCase(fetchSmallBanners.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchSmallBanners.fulfilled, (state, action) => {
        state.loading = false;
        state.smallBanners = action.payload;
      })
      .addCase(fetchSmallBanners.rejected, (state, action) => {
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
        state.smallBanners.push(action.payload);
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
        const index = state.smallBanners.findIndex(banner => banner.id === action.payload.id);
        if (index !== -1) {
          state.smallBanners[index] = action.payload;
        }
        if (state.currentSmallBanner && state.currentSmallBanner.id === action.payload.id) {
          state.currentSmallBanner = action.payload;
        }
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
        state.smallBanners = state.smallBanners.filter(banner => banner.id !== action.payload);
        if (state.currentSmallBanner && state.currentSmallBanner.id === action.payload) {
          state.currentSmallBanner = null;
        }
      })
      .addCase(deleteSmallBanner.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Toggle small banner
      .addCase(toggleSmallBanner.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(toggleSmallBanner.fulfilled, (state, action) => {
        state.loading = false;
        const index = state.smallBanners.findIndex(banner => banner.id === action.payload.id);
        if (index !== -1) {
          state.smallBanners[index] = action.payload;
        }
        if (state.currentSmallBanner && state.currentSmallBanner.id === action.payload.id) {
          state.currentSmallBanner = action.payload;
        }
      })
      .addCase(toggleSmallBanner.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { 
  clearError, 
  setCurrentSmallBanner, 
  clearCurrentSmallBanner, 
  reorderSmallBanners 
} = smallBannerSlice.actions;

export default smallBannerSlice.reducer;
