import React, { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext();

// Simple password for admin access (will be moved to backend)
const ADMIN_PASSWORD = 'lwr2025admin';

export const AuthProvider = ({ children }) => {
  const [isAdmin, setIsAdmin] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check if admin session exists
    const adminSession = localStorage.getItem('lwr_admin_session');
    if (adminSession === 'authenticated') {
      setIsAdmin(true);
    }
    setIsLoading(false);
  }, []);

  const login = (password) => {
    if (password === ADMIN_PASSWORD) {
      setIsAdmin(true);
      localStorage.setItem('lwr_admin_session', 'authenticated');
      return true;
    }
    return false;
  };

  const logout = () => {
    setIsAdmin(false);
    localStorage.removeItem('lwr_admin_session');
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
