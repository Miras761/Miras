import axios from 'axios';

// Используем хардкод URL из требований, или переменную окружения если доступна
const BASE_URL = typeof process !== 'undefined' ? process.env.VITE_API_URL : 'http://127.0.0.1:8000/api/v1';

export const api = axios.create({
  baseURL: BASE_URL || 'http://127.0.0.1:8000/api/v1',
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('access_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});
