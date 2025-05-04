// src/api.js
import axios from 'axios';
import ports from '../config/ports.json';

const api = axios.create({
  baseURL: `http://localhost:${ports.SERVER_PORT}/api`,  // ← now http://localhost:3001/api
  withCredentials: true,
});

api.interceptors.request.use(cfg => {
  const token = localStorage.getItem('token');
  if (token) cfg.headers.Authorization = `Bearer ${token}`;
  return cfg;
});

export default api;
