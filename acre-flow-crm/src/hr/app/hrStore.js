// 🏪 HRMS Redux Store Configuration
// Centralized state management for HR module

import { configureStore } from '@reduxjs/toolkit';
import { persistStore, persistReducer } from 'redux-persist';
import storage from 'redux-persist/lib/storage';

// Import slices
import authSlice from '../modules/auth/auth.slice';
import employeeSlice from '../modules/employee/employee.slice';
import attendanceSlice from '../modules/attendance/attendance.slice';
import payrollSlice from '../modules/payroll/payroll.slice';
import leaveSlice from '../modules/leave/leave.slice';
import recruitmentSlice from '../modules/recruitment/recruitment.slice';
import performanceSlice from '../modules/performance/performance.slice';

// Persist configuration
const persistConfig = {
  key: 'hrms',
  storage,
  whitelist: ['auth'], // Only persist auth state
  blacklist: ['employees', 'attendance', 'payroll', 'leave', 'recruitment', 'performance'] // Don't persist large data
};

// Auth persist reducer
const authPersistReducer = persistReducer(persistConfig, authSlice);

// Configure store
const store = configureStore({
  reducer: {
    auth: authPersistReducer,
    employees: employeeSlice,
    attendance: attendanceSlice,
    payroll: payrollSlice,
    leave: leaveSlice,
    recruitment: recruitmentSlice,
    performance: performanceSlice,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: ['persist/PERSIST', 'persist/REHYDRATE'],
      },
    }),
  devTools: !import.meta.env?.PROD,
});

// Create persistor
const persistor = persistStore(store);

export { store, persistor };
export default store;
