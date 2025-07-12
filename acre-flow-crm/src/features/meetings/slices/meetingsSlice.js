// Meetings slice for Redux Toolkit
// Manages meetings state

import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { meetingsApi } from '@/features/meetings/api/meetingsApi';

// Async thunks
export const fetchMeetings = createAsyncThunk(
  'meetings/fetchMeetings',
  async (_, { rejectWithValue }) => {
    try {
      const response = await meetingsApi.fetchAll();
      return response;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const createMeeting = createAsyncThunk(
  'meetings/createMeeting',
  async (meetingData, { rejectWithValue }) => {
    try {
      const response = await meetingsApi.create(meetingData);
      return response;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const updateMeeting = createAsyncThunk(
  'meetings/updateMeeting',
  async ({ meetingId, meetingData }, { rejectWithValue }) => {
    try {
      const response = await meetingsApi.update(meetingId, meetingData);
      return response;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const deleteMeeting = createAsyncThunk(
  'meetings/deleteMeeting',
  async (meetingId, { rejectWithValue }) => {
    try {
      await meetingsApi.delete(meetingId);
      return meetingId;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const scheduleMeeting = createAsyncThunk(
  'meetings/scheduleMeeting',
  async (meetingData, { rejectWithValue }) => {
    try {
      const response = await meetingsApi.schedule(meetingData);
      return response;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

// Initial state
const initialState = {
  meetings: [],
  currentMeeting: null,
  isLoading: false,
  error: null,
};

// Meetings slice
const meetingsSlice = createSlice({
  name: 'meetings',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    setCurrentMeeting: (state, action) => {
      state.currentMeeting = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch meetings
      .addCase(fetchMeetings.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchMeetings.fulfilled, (state, action) => {
        state.isLoading = false;
        state.meetings = action.payload;
      })
      .addCase(fetchMeetings.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      // Create meeting
      .addCase(createMeeting.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(createMeeting.fulfilled, (state, action) => {
        state.isLoading = false;
        state.meetings.push(action.payload);
      })
      .addCase(createMeeting.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      // Update meeting
      .addCase(updateMeeting.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(updateMeeting.fulfilled, (state, action) => {
        state.isLoading = false;
        const index = state.meetings.findIndex(meeting => meeting.id === action.payload.id);
        if (index !== -1) {
          state.meetings[index] = action.payload;
        }
      })
      .addCase(updateMeeting.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      // Delete meeting
      .addCase(deleteMeeting.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(deleteMeeting.fulfilled, (state, action) => {
        state.isLoading = false;
        state.meetings = state.meetings.filter(meeting => meeting.id !== action.payload);
      })
      .addCase(deleteMeeting.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      // Schedule meeting
      .addCase(scheduleMeeting.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(scheduleMeeting.fulfilled, (state, action) => {
        state.isLoading = false;
        state.meetings.push(action.payload);
      })
      .addCase(scheduleMeeting.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      });
  },
});

export const { clearError, setCurrentMeeting } = meetingsSlice.actions;
export default meetingsSlice.reducer; 