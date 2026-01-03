import { http } from './http.js';
import { ENDPOINTS } from './endpoints.js';

export const fetchWhatsappMessages = async (params = {}) => {
  const response = await http.get(ENDPOINTS.WHATSAPP.LIST_MESSAGES, { params });
  return response;
};

export const sendWhatsappMessage = async (payload = {}) => {
  const response = await http.post(ENDPOINTS.WHATSAPP.SEND, payload);
  return response;
};

export const whatsappApi = {
  listMessages: fetchWhatsappMessages,
  send: sendWhatsappMessage,
};
