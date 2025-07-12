// Centralized Users API functions
// All user management-related API calls are defined here

import { http } from './http.js';
import { ENDPOINTS } from './endpoints.js';

// Get all users
export const fetchUsers = async () => {
  try {
    const response = await http.get(ENDPOINTS.USERS.LIST);
    return response;
  } catch (error) {
    throw error;
  }
};

// Get user by ID
export const fetchUserById = async (userId) => {
  try {
    const response = await http.get(ENDPOINTS.USERS.GET_BY_ID(userId));
    return response;
  } catch (error) {
    throw error;
  }
};

// Create new user
export const createUser = async (userData) => {
  try {
    const response = await http.post(ENDPOINTS.USERS.CREATE, userData);
    return response;
  } catch (error) {
    throw error;
  }
};

// Update user
export const updateUser = async (userId, userData) => {
  try {
    const response = await http.put(ENDPOINTS.USERS.UPDATE(userId), userData);
    return response;
  } catch (error) {
    throw error;
  }
};

// Delete user
export const deleteUser = async (userId) => {
  try {
    const response = await http.delete(ENDPOINTS.USERS.DELETE(userId));
    return response;
  } catch (error) {
    throw error;
  }
};

// Update user status
export const updateUserStatus = async (userId, status) => {
  try {
    const response = await http.put(ENDPOINTS.USERS.UPDATE_STATUS(userId), { status });
    return response;
  } catch (error) {
    throw error;
  }
};

// Get user profile
export const fetchUserProfile = async () => {
  try {
    const response = await http.get(ENDPOINTS.USERS.PROFILE);
    return response;
  } catch (error) {
    throw error;
  }
};

// Change password
export const changePassword = async (passwordData) => {
  try {
    const response = await http.post(ENDPOINTS.USERS.CHANGE_PASSWORD, passwordData);
    return response;
  } catch (error) {
    throw error;
  }
};

// Users API object for easy importing
export const usersApi = {
  fetchAll: fetchUsers,
  fetchById: fetchUserById,
  create: createUser,
  update: updateUser,
  delete: deleteUser,
  updateStatus: updateUserStatus,
  fetchProfile: fetchUserProfile,
  changePassword,
}; 