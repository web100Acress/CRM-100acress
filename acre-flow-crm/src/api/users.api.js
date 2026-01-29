import axios from 'axios';
import { API_ENDPOINTS as ENDPOINTS } from '@/config/apiConfig';

// Create axios instance for users API
const usersApi = axios.create({
  baseURL: ENDPOINTS.USERS.LIST.split('/users')[0],
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add request interceptor to include auth token
usersApi.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Add response interceptor to handle errors
usersApi.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Handle unauthorized access
      localStorage.removeItem('token');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// Users API functions
export const fetchUsers = async (filters = {}) => {
  try {
    const response = await usersApi.get(ENDPOINTS.USERS.LIST, { params: filters });
    return response.data;
  } catch (error) {
    console.error('Error fetching users:', error);
    throw error;
  }
};

export const fetchUserById = async (userId) => {
  try {
    const response = await usersApi.get(ENDPOINTS.USERS.GET_BY_ID(userId));
    return response.data;
  } catch (error) {
    console.error('Error fetching user by ID:', error);
    throw error;
  }
};

export const createUser = async (userData) => {
  try {
    const response = await usersApi.post(ENDPOINTS.USERS.CREATE, userData);
    return response.data;
  } catch (error) {
    console.error('Error creating user:', error);
    throw error;
  }
};

export const updateUser = async (userId, userData) => {
  try {
    const response = await usersApi.put(ENDPOINTS.USERS.UPDATE(userId), userData);
    return response.data;
  } catch (error) {
    console.error('Error updating user:', error);
    throw error;
  }
};

export const deleteUser = async (userId) => {
  try {
    const response = await usersApi.delete(ENDPOINTS.USERS.DELETE(userId));
    return response.data;
  } catch (error) {
    console.error('Error deleting user:', error);
    throw error;
  }
};

export const updateUserStatus = async (userId, status) => {
  try {
    const response = await usersApi.patch(ENDPOINTS.USERS.UPDATE_STATUS(userId), { status });
    return response.data;
  } catch (error) {
    console.error('Error updating user status:', error);
    throw error;
  }
};

export const fetchUserProfile = async () => {
  try {
    const response = await usersApi.get(ENDPOINTS.USERS.PROFILE);
    return response.data;
  } catch (error) {
    console.error('Error fetching user profile:', error);
    throw error;
  }
};

export const changePassword = async (passwordData) => {
  try {
    const response = await usersApi.post(ENDPOINTS.USERS.CHANGE_PASSWORD, passwordData);
    return response.data;
  } catch (error) {
    console.error('Error changing password:', error);
    throw error;
  }
};

// Additional users API functions
export const fetchUsersByRole = async (role) => {
  try {
    const response = await usersApi.get(`/users/role/${role}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching users by role:', error);
    throw error;
  }
};

export const fetchUsersByDepartment = async (department) => {
  try {
    const response = await usersApi.get(`/users/department/${department}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching users by department:', error);
    throw error;
  }
};

export const fetchUsersByStatus = async (status) => {
  try {
    const response = await usersApi.get(`/users/status/${status}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching users by status:', error);
    throw error;
  }
};

export const updateUserProfile = async (profileData) => {
  try {
    const response = await usersApi.put('/users/profile', profileData);
    return response.data;
  } catch (error) {
    console.error('Error updating user profile:', error);
    throw error;
  }
};

export const uploadUserAvatar = async (userId, avatarFile) => {
  try {
    const formData = new FormData();
    formData.append('avatar', avatarFile);

    const response = await usersApi.post(`/users/${userId}/avatar`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  } catch (error) {
    console.error('Error uploading user avatar:', error);
    throw error;
  }
};

export const deactivateUser = async (userId) => {
  try {
    const response = await usersApi.patch(`/users/${userId}/deactivate`);
    return response.data;
  } catch (error) {
    console.error('Error deactivating user:', error);
    throw error;
  }
};

export const activateUser = async (userId) => {
  try {
    const response = await usersApi.patch(`/users/${userId}/activate`);
    return response.data;
  } catch (error) {
    console.error('Error activating user:', error);
    throw error;
  }
};

export const resetUserPassword = async (userId) => {
  try {
    const response = await usersApi.post(`/users/${userId}/reset-password`);
    return response.data;
  } catch (error) {
    console.error('Error resetting user password:', error);
    throw error;
  }
};

export default usersApi;

export { usersApi };
