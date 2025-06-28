import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';

const decodeJWT = (token) => {
  try {
    const payload = token.split('.')[1];
    return JSON.parse(atob(payload));
  } catch {
    return null;
  }
};

const ProtectedRoute = ({ children, allowedRoles = [] }) => {
  const location = useLocation();
  const token = localStorage.getItem('token');

  if (!token) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  const decoded = decodeJWT(token);
  const role = decoded?.roles?.[0];

  if (role === 'Admin') {
    return children;
  }

  if (allowedRoles.length > 0 && !allowedRoles.includes(role)) {
    return <Navigate to="/unauthorized" replace />;
  }

  return children;
};

export default ProtectedRoute;
