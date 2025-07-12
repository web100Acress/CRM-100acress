// Users feature API - Local re-export from centralized API
// This file only imports and configures the central users API functions

import { 
  fetchUsers, 
  fetchUserById, 
  createUser, 
  updateUser, 
  deleteUser, 
  updateUserStatus, 
  fetchUserProfile, 
  changePassword,
  usersApi 
} from '@/api/users.api';

// Re-export all users API functions for use in users feature
export {
  fetchUsers,
  fetchUserById,
  createUser,
  updateUser,
  deleteUser,
  updateUserStatus,
  fetchUserProfile,
  changePassword,
  usersApi,
};

// Users API object for easy importing within the users feature
export const usersFeatureApi = {
  fetchAll: fetchUsers,
  fetchById: fetchUserById,
  create: createUser,
  update: updateUser,
  delete: deleteUser,
  updateStatus: updateUserStatus,
  fetchProfile: fetchUserProfile,
  changePassword,
}; 