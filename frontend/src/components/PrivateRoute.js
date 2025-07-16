import React from 'react';
import { Navigate } from 'react-router-dom';
import jwt_decode from 'jwt-decode';

const PrivateRoute = ({ children, adminOnly = false }) => {
  const token = localStorage.getItem('token');

  if (!token) {
    return <Navigate to="/login" />;
  }

  try {
    const user = jwt_decode(token);
    if (adminOnly && user.role !== 'ADMIN') {
      return <Navigate to="/" />;
    }
    return children;
  } catch (error) {
    return <Navigate to="/login" />;
  }
};

export default PrivateRoute;