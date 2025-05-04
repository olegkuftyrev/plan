// src/context/AuthContext.jsx
import React, { createContext, useState, useEffect } from 'react';
import api from '../api';

export const AuthContext = createContext({
  user: null,
  login: async () => {},
  logout: () => {},
});

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);

  // При монтировании проверяем, есть ли токен — и только тогда дергаем /auth/me
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      setUser(null);
      return;
    }

    api.get('/auth/me')
      .then(res => setUser(res.data))
      .catch(() => {
        setUser(null);
        localStorage.removeItem('token');
      });
  }, []);

  // Функция логина: сохраняем токен и запрашиваем /auth/me
  async function login(email, password) {
    const { data } = await api.post('/auth/login', { email, password });
    localStorage.setItem('token', data.token);
    const me = await api.get('/auth/me');
    setUser(me.data);
  }

  // Выход: удаляем токен и сбрасываем user
  function logout() {
    localStorage.removeItem('token');
    setUser(null);
  }

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}
