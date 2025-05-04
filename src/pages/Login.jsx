// src/pages/Login.jsx
import React, { useState, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

export default function Login() {
  const [email, setEmail] = useState('');
  const [pw, setPw] = useState('');
  const { login } = useContext(AuthContext);
  const nav = useNavigate();

  const submit = async e => {
    e.preventDefault();
    try {
      await login(email, pw);
      nav('/dashboard');
    } catch {
      alert('Invalid credentials');
    }
  };

  return (
    <form onSubmit={submit}>
      <h2>Login</h2>
      <input
        type="email" value={email}
        onChange={e => setEmail(e.target.value)}
        placeholder="Email" required
      />
      <input
        type="password" value={pw}
        onChange={e => setPw(e.target.value)}
        placeholder="Password" required
      />
      <button type="submit">Sign in</button>
    </form>
  );
}
