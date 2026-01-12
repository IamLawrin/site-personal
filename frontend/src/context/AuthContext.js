import React, { createContext, useContext, useState, useEffect } from 'react';
import { authAPI } from '../services/api';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [isAdmin, setIsAdmin] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check if admin session exists and verify token
    const checkAuth = async () => {
      const token = localStorage.getItem('lwr_admin_token');
      if (token) {
        const valid = await authAPI.verify();
        setIsAdmin(valid);
        if (!valid) {
          authAPI.logout();
        }
      }
      setIsLoading(false);
    };
    checkAuth();
  }, []);

  const login = async (password) => {
    try {
      const result = await authAPI.login(password);
      if (result.success) {
        setIsAdmin(true);
        localStorage.setItem('lwr_admin_session', 'authenticated');
        return true;
      }
      return false;
    } catch (error) {
      console.error('Login error:', error);
      return false;
    }
  };

  const logout = () => {
    authAPI.logout();
    setIsAdmin(false);
  };

  return (
    <AuthContext.Provider value={{ isAdmin, isLoading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
