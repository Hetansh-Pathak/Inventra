import axios from 'axios';

// Connect to the proxy URL locally or specific env in Production
const api = axios.create({
  baseURL: 'http://localhost:5000/api',
});

// Automatically inject JWT Token
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('ci_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Handle unauthorized responses dynamically
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      localStorage.removeItem('ci_token');
      localStorage.removeItem('ci_user');
      window.location.href = '/login'; 
    }
    return Promise.reject(error);
  }
);

export default api;
