// Auth feature API - Local re-export from centralized API
// This file only imports and configures the central auth API functions

import { 
  loginUser, 
  registerUser, 
  logoutUser, 
  refreshToken, 
  requestPasswordReset, 
  resetPassword, 
  verifyToken,
  authApi 
} from '@/api/auth.api';

// Re-export all auth API functions for use in auth feature
export {
  loginUser,
  registerUser,
  logoutUser,
  refreshToken,
  requestPasswordReset,
  resetPassword,
  verifyToken,
  authApi,
};

// Auth API object for easy importing within the auth feature
export const authFeatureApi = {
  login: loginUser,
  register: registerUser,
  logout: logoutUser,
  refreshToken,
  requestPasswordReset,
  resetPassword,
  verifyToken,
}; 