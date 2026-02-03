import { configureStore } from '@reduxjs/toolkit';
import authReducer from '../features/auth/slices/authSlice';
import leadsReducer from '../features/leads/slices/leadsSlice';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    leads: leadsReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: ['persist/PERSIST'],
      },
    }),
  devTools: import.meta.env.DEV,
});

export default store;
