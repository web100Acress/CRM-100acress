// Main Redux store configuration
// Centralized store setup with Redux Toolkit

import { configureStore } from '@reduxjs/toolkit';
import { combineReducers } from 'redux';

// Import all feature slices
import authSlice from '@/features/auth/slices/authSlice';
import usersSlice from '@/features/users/slices/usersSlice';
import leadsSlice from '@/features/leads/slices/leadsSlice';
import ticketsSlice from '@/features/tickets/slices/ticketsSlice';
import meetingsSlice from '@/features/meetings/slices/meetingsSlice';
import dashboardSlice from '@/features/dashboard/slices/dashboardSlice';

// Combine all reducers
const rootReducer = combineReducers({
  auth: authSlice,
  users: usersSlice,
  leads: leadsSlice,
  tickets: ticketsSlice,
  meetings: meetingsSlice,
  dashboard: dashboardSlice,
});

// Configure the store
const store = configureStore({
  reducer: rootReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        // Ignore these action types
        ignoredActions: ['persist/PERSIST', 'persist/REHYDRATE'],
        // Ignore these field paths in all actions
        ignoredActionPaths: ['meta.arg', 'payload.timestamp'],
        // Ignore these paths in the state
        ignoredPaths: ['some.path.to.ignore'],
      },
    }),
  devTools: process.env.NODE_ENV !== 'production',
});

export default store;
export { rootReducer }; 