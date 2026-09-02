/**
 * API service — centralized HTTP client for talking to the Express backend.
 * 
 * Key design decisions:
 * - Axios interceptor automatically attaches the Firebase ID token to every request
 * - In dev, Vite's proxy handles routing /api/* to localhost:4000
 * - In production, VITE_API_URL points to the Render backend URL
 */
import axios from 'axios';
import { auth } from './firebase';

// In dev mode, Vite proxy handles /api → localhost:4000
// In production, we need the full Render URL
const baseURL = import.meta.env.VITE_API_URL
  ? `${import.meta.env.VITE_API_URL}/api`
  : '/api';

const api = axios.create({
  baseURL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Attach Firebase ID token to every outgoing request
api.interceptors.request.use(async (config) => {
  const user = auth.currentUser;
  if (user) {
    const token = await user.getIdToken();
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Handle common error responses
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Token expired or invalid — force re-login
      auth.signOut();
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export default api;
