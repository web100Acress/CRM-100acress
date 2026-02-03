import axios from 'axios';
// import { API_ENDPOINTS as ENDPOINTS } from '@/config/apiConfig';
// import store from '@/store';
import { apiUrl } from '@/config/apiConfig';

// Create axios instance for chat API
const chatApi = axios.create({
  baseURL: apiUrl,
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
    // Use the correct endpoint for user search chats
    const response = await chatApi.post('/api/chats/create-chat', chatData);
    console.log('✅ Chat created successfully:', response.data);
    return response.data;
  } catch (error) {
    console.error('Error creating chat:', error);
    throw error;
  }
};

export const sendChatMessage = async (chatId, messageData) => {
  try {
    const state = store.getState();
    let senderId =
      messageData?.senderId || state?.auth?.user?._id || state?.auth?.user?.id;

    if (!senderId && state?.auth?.token) {
      try {
        const payload = JSON.parse(atob(state.auth.token.split('.')[1]));
        senderId = payload.userId || payload.id || payload._id || null;
      } catch (e) {
        senderId = null;
      }
    }

    if (!chatId || !messageData?.message || !senderId) {
      throw new Error('chatId, message, and senderId are required');
    }

    // Use the correct endpoint and data format for sending messages
    const response = await chatApi.post('/api/chats/send', {
      chatId: chatId,
      message: messageData.message,
      senderId: senderId,
      messageType: messageData.messageType || 'text',
      attachmentUrl: messageData.attachmentUrl || null
    });
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
