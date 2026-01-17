import axios from 'axios';
import { ENDPOINTS } from './endpoints.js';
import store from '@/store';

// Create axios instance for chat API
const chatApi = axios.create({
  baseURL: process.env.NODE_ENV === 'production' 
    ? 'https://bcrm.100acress.com' 
    : 'http://localhost:5001',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add request interceptor to include auth token from Redux
chatApi.interceptors.request.use(
  (config) => {
    const state = store.getState();
    const token = state.auth.token;
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
chatApi.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Dispatch logout action to clear auth state
      store.dispatch({ type: 'auth/clearAuth' });
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// Chat API functions
export const fetchUserChats = async () => {
  try {
    // Use the existing backend endpoint with correct path
    const response = await chatApi.get('/api/chats/user-chats');
    return response.data;
  } catch (error) {
    console.error('Error fetching user chats:', error);
    throw error;
  }
};

export const createChat = async (chatData) => {
  try {
    // Use the existing backend endpoint with the correct format
    const response = await chatApi.post('/api/chats/create', chatData);
    console.log('✅ Chat created successfully:', response.data);
    return response.data;
  } catch (error) {
    console.error('Error creating chat:', error);
    throw error;
  }
};

export const sendChatMessage = async (chatId, messageData) => {
  try {
    const response = await chatApi.post(`/api/chats/${chatId}/messages`, messageData);
    return response.data;
  } catch (error) {
    console.error('Error sending message:', error);
    throw error;
  }
};

export const fetchChatMessages = async (chatId) => {
  try {
    const response = await chatApi.get(`/api/chats/messages?chatId=${chatId}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching chat messages:', error);
    throw error;
  }
};

export default chatApi;
