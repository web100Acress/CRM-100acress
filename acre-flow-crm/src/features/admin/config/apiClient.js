import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:5001', // This client is for CRM Backend (port 5001) for login etc.
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true,
});

api.interceptors.request.use(
  (config) => {
    const myToken = localStorage.getItem('myToken');
    console.log("Axios Interceptor - myToken from localStorage:", myToken);
    if (myToken) {
      config.headers.Authorization = `Bearer ${myToken}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default api;
