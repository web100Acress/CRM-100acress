import { http } from './http.js';
import { ENDPOINTS } from './endpoints.js';

export const fetchEmailTemplates = async () => {
  const response = await http.get(ENDPOINTS.EMAIL.LIST_TEMPLATES);
  return response;
};

export const createEmailTemplate = async (payload = {}) => {
  const response = await http.post(ENDPOINTS.EMAIL.CREATE_TEMPLATE, payload);
  return response;
};

export const updateEmailTemplate = async (id, payload = {}) => {
  const response = await http.put(ENDPOINTS.EMAIL.UPDATE_TEMPLATE(id), payload);
  return response;
};

export const deleteEmailTemplate = async (id) => {
  const response = await http.delete(ENDPOINTS.EMAIL.DELETE_TEMPLATE(id));
  return response;
};

export const fetchEmailMessages = async (params = {}) => {
  const response = await http.get(ENDPOINTS.EMAIL.LIST_MESSAGES, { params });
  return response;
};

export const sendEmail = async (payload = {}) => {
  const response = await http.post(ENDPOINTS.EMAIL.SEND, payload);
  return response;
};

export const emailApi = {
  templates: {
    list: fetchEmailTemplates,
    create: createEmailTemplate,
    update: updateEmailTemplate,
    remove: deleteEmailTemplate,
  },
  messages: {
    list: fetchEmailMessages,
    send: sendEmail,
  },
};
