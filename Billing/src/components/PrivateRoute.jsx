// src/components/PrivateRoute.js

import React from 'react';
import { Navigate, Route } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const PrivateRoute = ({ element, redirectTo = '/login', ...props }) => {
  const { isAuthenticated } = useAuth();

  return isAuthenticated ? <Route {...props} element={element} /> : <Navigate to={redirectTo} replace />;
};

export default PrivateRoute;
