// src/contexts/AuthContext.js
import React, { createContext, useState, useContext } from 'react';

const AuthContext = createContext();

// eslint-disable-next-line react/prop-types
export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  const login = (username, password) => {
    // Placeholder for login logic
    // For now, just set isAuthenticated to true
    console.log('User logged in:', { username, password });
    setIsAuthenticated(true);
  };

  const signup = (username, password) => {
    // Placeholder for signup logic
    // For now, just set isAuthenticated to true
    console.log('User signed up:', { username, password });
    setIsAuthenticated(true); 
  };

  const logout = () => {
    setIsAuthenticated(false);
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, login, signup, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
