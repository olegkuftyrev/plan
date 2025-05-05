import React, { createContext, useState, useEffect } from 'react';
import api from '../api';

export const AuthContext = createContext({
  user: null,
  loading: true,
  login: async () => {},
  logout: () => {},
});

export function AuthProvider({ children }) {
  // user = undefined while we’re checking, then null or object
  const [user, setUser] = useState(undefined);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      setUser(null);
      return;
    }
    api.get('/auth/me')
      .then(res => setUser(res.data))
      .catch(() => {
        localStorage.removeItem('token');
        setUser(null);
      });
  }, []);

  const login = async (email, password) => {
    const { data } = await api.post('/auth/login', { email, password });
    localStorage.setItem('token', data.token);
    const me = await api.get('/auth/me');
    setUser(me.data);
  };

  const logout = () => {
    localStorage.removeItem('token');
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{
      user,
      loading: user === undefined,
      login,
      logout,
    }}>
      {children}
    </AuthContext.Provider>
  );
}
