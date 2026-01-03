import { http } from './http.js';
import { ENDPOINTS } from './endpoints.js';

export const fetchCallConfig = async () => {
  const response = await http.get(ENDPOINTS.CALLS.CONFIG);
  return response;
};

export const startCall = async ({ phoneNumber, leadId } = {}) => {
  const response = await http.post(ENDPOINTS.CALLS.START, { phoneNumber, leadId });
  return response;
};

export const endCall = async ({ callLogId } = {}) => {
  const response = await http.post(ENDPOINTS.CALLS.END, { callLogId });
  return response;
};

export const fetchCallLogs = async (params = {}) => {
  const response = await http.get(ENDPOINTS.CALLS.LOGS, { params });
  return response;
};

export const updateCallNotes = async (callLogId, { text, tags, disposition } = {}) => {
  const response = await http.patch(ENDPOINTS.CALLS.NOTES(callLogId), { text, tags, disposition });
  return response;
};

export const callsApi = {
  fetchConfig: fetchCallConfig,
  start: startCall,
  end: endCall,
  logs: fetchCallLogs,
  updateNotes: updateCallNotes,
};
