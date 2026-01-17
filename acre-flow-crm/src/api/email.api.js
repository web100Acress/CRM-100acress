import axios from 'axios';
import { ENDPOINTS } from './endpoints.js';

const emailAxios = axios.create({
  baseURL: ENDPOINTS.EMAIL.LIST_TEMPLATES.split('/api/email')[0],
  headers: {
    'Content-Type': 'application/json',
  },
});

emailAxios.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

emailAxios.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export const emailApi = {
  templates: {
    list: () => emailAxios.get(ENDPOINTS.EMAIL.LIST_TEMPLATES).then((r) => r.data),
    create: (payload) => emailAxios.post(ENDPOINTS.EMAIL.CREATE_TEMPLATE, payload).then((r) => r.data),
    update: (id, payload) => emailAxios.put(ENDPOINTS.EMAIL.UPDATE_TEMPLATE(id), payload).then((r) => r.data),
    remove: (id) => emailAxios.delete(ENDPOINTS.EMAIL.DELETE_TEMPLATE(id)).then((r) => r.data),
  },
  messages: {
    list: () => emailAxios.get(ENDPOINTS.EMAIL.LIST_MESSAGES).then((r) => r.data),
    send: (payload) => emailAxios.post(ENDPOINTS.EMAIL.SEND, payload).then((r) => r.data),
  },
};

export default emailApi;
