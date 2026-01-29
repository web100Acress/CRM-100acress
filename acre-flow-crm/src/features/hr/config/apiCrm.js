import axios from 'axios';
import { apiUrl } from '@/config/apiConfig';

const baseURL = apiUrl;

const apiCrm = axios.create({
  baseURL,
  headers: {
    'Content-Type': 'application/json',
  },
});

apiCrm.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token.replace(/"/g, '')}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default apiCrm;
