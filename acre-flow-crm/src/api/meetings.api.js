import { http } from './http.js';
import { ENDPOINTS } from './endpoints.js';

// Get all meetings
export const fetchMeetings = async () => {
  try {
    const response = await http.get(ENDPOINTS.MEETINGS.LIST);
    return response;
  } catch (error) {
    throw error;
  }
};

// Get meeting by ID
export const fetchMeetingById = async (meetingId) => {
  try {
    const response = await http.get(ENDPOINTS.MEETINGS.GET_BY_ID(meetingId));
    return response;
  } catch (error) {
    throw error;
  }
};

// Create new meeting
export const createMeeting = async (meetingData) => {
  try {
    const response = await http.post(ENDPOINTS.MEETINGS.CREATE, meetingData);
    return response;
  } catch (error) {
    throw error;
  }
};

// Update meeting
export const updateMeeting = async (meetingId, meetingData) => {
  try {
    const response = await http.put(ENDPOINTS.MEETINGS.UPDATE(meetingId), meetingData);
    return response;
  } catch (error) {
    throw error;
  }
};

// Delete meeting
export const deleteMeeting = async (meetingId) => {
  try {
    const response = await http.delete(ENDPOINTS.MEETINGS.DELETE(meetingId));
    return response;
  } catch (error) {
    throw error;
  }
};

// Schedule meeting
export const scheduleMeeting = async (meetingData) => {
  try {
    const response = await http.post(ENDPOINTS.MEETINGS.SCHEDULE, meetingData);
    return response;
  } catch (error) {
    throw error;
  }
};

// Meetings API object for easy importing
export const meetingsApi = {
  fetchAll: fetchMeetings,
  fetchById: fetchMeetingById,
  create: createMeeting,
  update: updateMeeting,
  delete: deleteMeeting,
  schedule: scheduleMeeting,
}; 