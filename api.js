// src/api.js
import axios from 'axios';
import ports from './config/ports.json';

const api = axios.create({
  baseURL: `http://localhost:${ports.SERVER_PORT}/api`,
  withCredentials: true, // если используете cookie для токена
});

// Вставляем токен в заголовки
api.interceptors.request.use(cfg => {
  const token = localStorage.getItem('token');
  if (token) cfg.headers.Authorization = `Bearer ${token}`;
  return cfg;
});

export default api;
