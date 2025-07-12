import axios from 'axios';
import { useAuthStore } from '../stores/authStore';

// Use the environment variable for the base URL
const API_URL = import.meta.env.VITE_API_BASE_URL;

if (!API_URL) {
  console.error("VITE_API_BASE_URL is not defined. Please check your .env file.");
}

const apiClient = axios.create({
  baseURL: API_URL, 
  headers: {
    'Content-Type': 'application/json',
  },
});

// The interceptor remains the same
apiClient.interceptors.request.use(
  (config) => {
    const token = useAuthStore.getState().token;
    if (token) {
      config.headers.Authorization = `Token ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default apiClient;