import React, { useContext } from 'react';
import { Navigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

export default function ProtectedRoute({ children }) {
  const { user, loading } = useContext(AuthContext);

  // 1) still checking? render nothing (or spinner)
  if (loading) return null;

  // 2) no user? redirect to login
  if (!user) return <Navigate to="/login" replace />;

  // 3) we have a user! render the protected UI
  return children;
}
