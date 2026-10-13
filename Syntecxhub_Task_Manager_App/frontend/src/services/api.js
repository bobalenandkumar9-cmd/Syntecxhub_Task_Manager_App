import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || '/api',
  headers: { 'Content-Type': 'application/json' },
});

export const TOKEN_KEY = 'syntecxhub_token';
export const USER_KEY = 'syntecxhub_user';

// Attach the JWT to every outgoing request
api.interceptors.request.use((config) => {
  const token = localStorage.getItem(TOKEN_KEY);
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

// If the token is rejected (expired/invalid) on a protected call, log the user out
api.interceptors.response.use(
  (res) => res,
  (error) => {
    const isAuthCall = error.config?.url?.startsWith('/auth/login') ||
      error.config?.url?.startsWith('/auth/register');
    if (error.response?.status === 401 && !isAuthCall) {
      localStorage.removeItem(TOKEN_KEY);
      localStorage.removeItem(USER_KEY);
      window.dispatchEvent(new Event('auth:logout'));
    }
    return Promise.reject(error);
  }
);

// Extracts a readable message from an axios error
export const getErrorMessage = (error) =>
  error.response?.data?.message || error.message || 'Something went wrong';

export default api;
