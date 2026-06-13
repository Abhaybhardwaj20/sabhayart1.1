import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useSelector } from 'react-redux';

export default function ProtectedRoute({ children, admin = false }) {
  const { isLoggedIn, isAdmin } = useSelector(s => s.auth);
  const location = useLocation();

  if (!isLoggedIn) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }
  if (admin && !isAdmin) {
    return <Navigate to="/" replace />;
  }
  return children;
}