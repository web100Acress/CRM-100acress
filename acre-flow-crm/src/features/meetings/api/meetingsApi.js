// Meetings feature API - Local re-export from centralized API
// This file only imports and configures the central meetings API functions

import { 
  fetchMeetings, 
  fetchMeetingById, 
  createMeeting, 
  updateMeeting, 
  deleteMeeting, 
  scheduleMeeting,
  meetingsApi 
} from '@/api/meetings.api';

// Re-export all meetings API functions for use in meetings feature
export {
  fetchMeetings,
  fetchMeetingById,
  createMeeting,
  updateMeeting,
  deleteMeeting,
  scheduleMeeting,
  meetingsApi,
};

// Meetings API object for easy importing within the meetings feature
export const meetingsFeatureApi = {
  fetchAll: fetchMeetings,
  fetchById: fetchMeetingById,
  create: createMeeting,
  update: updateMeeting,
  delete: deleteMeeting,
  schedule: scheduleMeeting,
}; 