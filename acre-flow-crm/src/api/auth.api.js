// Centralized Auth API functions
// All authentication-related API calls are defined here

import { http } from './http.js';
import { ENDPOINTS } from './endpoints.js';

// Login user
export const loginUser = async (credentials) => {
  try {
    const response = await http.post(ENDPOINTS.AUTH.LOGIN, credentials);
    return response;
  } catch (error) {
    throw error;
  }
};

// Register user
export const registerUser = async (userData) => {
  try {
    const response = await http.post(ENDPOINTS.AUTH.REGISTER, userData);
    return response;
  } catch (error) {
    throw error;
  }
};

// Logout user
export const logoutUser = async () => {
  try {
    const response = await http.post(ENDPOINTS.AUTH.LOGOUT);
    return response;
  } catch (error) {
    throw error;
  }
};

// Refresh token
export const refreshToken = async () => {
  try {
    const response = await http.post(ENDPOINTS.AUTH.REFRESH_TOKEN);
    return response;
  } catch (error) {
    throw error;
  }
};

// Request password reset
export const requestPasswordReset = async (email) => {
  try {
    const response = await http.post(ENDPOINTS.AUTH.REQUEST_RESET, { email });
    return response;
  } catch (error) {
    throw error;
  }
};

// Reset password
export const resetPassword = async (token, newPassword) => {
  try {
    const response = await http.post(ENDPOINTS.AUTH.RESET_PASSWORD, {
      token,
      newPassword,
    });
    return response;
  } catch (error) {
    throw error;
  }
};

// Verify token
export const verifyToken = async () => {
  try {
    const response = await http.get(ENDPOINTS.AUTH.VERIFY_TOKEN);
    return response;
  } catch (error) {
    throw error;
  }
};

// Auth API object for easy importing
export const authApi = {
  login: loginUser,
  register: registerUser,
  logout: logoutUser,
  refreshToken,
  requestPasswordReset,
  resetPassword,
  verifyToken,
}; 