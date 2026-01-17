import axios from 'axios';
import { ENDPOINTS } from './endpoints.js';

// Create axios instance for meetings API
const meetingsApi = axios.create({
  baseURL: ENDPOINTS.MEETINGS.LIST.split('/meetings')[0],
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add request interceptor to include auth token
meetingsApi.interceptors.request.use(
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
meetingsApi.interceptors.response.use(
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

// Meetings API functions
export const fetchMeetings = async (filters = {}) => {
  try {
    const response = await meetingsApi.get(ENDPOINTS.MEETINGS.LIST, { params: filters });
    return response.data;
  } catch (error) {
    console.error('Error fetching meetings:', error);
    throw error;
  }
};

export const fetchMeetingById = async (meetingId) => {
  try {
    const response = await meetingsApi.get(ENDPOINTS.MEETINGS.GET_BY_ID(meetingId));
    return response.data;
  } catch (error) {
    console.error('Error fetching meeting by ID:', error);
    throw error;
  }
};

export const createMeeting = async (meetingData) => {
  try {
    const response = await meetingsApi.post(ENDPOINTS.MEETINGS.CREATE, meetingData);
    return response.data;
  } catch (error) {
    console.error('Error creating meeting:', error);
    throw error;
  }
};

export const updateMeeting = async (meetingId, meetingData) => {
  try {
    const response = await meetingsApi.put(ENDPOINTS.MEETINGS.UPDATE(meetingId), meetingData);
    return response.data;
  } catch (error) {
    console.error('Error updating meeting:', error);
    throw error;
  }
};

export const deleteMeeting = async (meetingId) => {
  try {
    const response = await meetingsApi.delete(ENDPOINTS.MEETINGS.DELETE(meetingId));
    return response.data;
  } catch (error) {
    console.error('Error deleting meeting:', error);
    throw error;
  }
};

export const scheduleMeeting = async (meetingData) => {
  try {
    const response = await meetingsApi.post(ENDPOINTS.MEETINGS.SCHEDULE, meetingData);
    return response.data;
  } catch (error) {
    console.error('Error scheduling meeting:', error);
    throw error;
  }
};

// Additional meetings API functions
export const fetchMeetingsByDate = async (date) => {
  try {
    const response = await meetingsApi.get(`/meetings/date/${date}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching meetings by date:', error);
    throw error;
  }
};

export const fetchMeetingsByUser = async (userId) => {
  try {
    const response = await meetingsApi.get(`/meetings/user/${userId}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching meetings by user:', error);
    throw error;
  }
};

export const updateMeetingStatus = async (meetingId, status) => {
  try {
    const response = await meetingsApi.patch(`/meetings/${meetingId}/status`, { status });
    return response.data;
  } catch (error) {
    console.error('Error updating meeting status:', error);
    throw error;
  }
};

export const addMeetingNote = async (meetingId, note) => {
  try {
    const response = await meetingsApi.post(`/meetings/${meetingId}/notes`, { note });
    return response.data;
  } catch (error) {
    console.error('Error adding meeting note:', error);
    throw error;
  }
};

export const fetchMeetingNotes = async (meetingId) => {
  try {
    const response = await meetingsApi.get(`/meetings/${meetingId}/notes`);
    return response.data;
  } catch (error) {
    console.error('Error fetching meeting notes:', error);
    throw error;
  }
};

export default meetingsApi;

export { meetingsApi };
