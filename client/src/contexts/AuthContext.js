'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { auth } from '../lib/api';

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const currentUser = auth.getCurrentUser();
    if (currentUser) {
      setUser(currentUser);
    }
    setLoading(false);
  }, []);

  const login = async (userData, token) => {
    if (userData && token) {
      setUser(userData);
      return { success: true, user: userData };
    }
    
    try {
      const { token: authToken, user: loggedUser } = await auth.login(userData);
      setUser(loggedUser);
      return { success: true, user: loggedUser };
    } catch (error) {
      return { 
        success: false, 
        error: error.response?.data?.message || 'Erro no login' 
      };
    }
  };

  const register = async (userData) => {
    try {
      const result = await auth.register(userData);
      return { success: true, data: result };
    } catch (error) {
      return { 
        success: false, 
        error: error.response?.data?.message || 'Erro no registro' 
      };
    }
  };

  const logout = () => {
    auth.logout();
    setUser(null);
  };

  const changePassword = async (passwordData) => {
    try {
      const result = await auth.changePassword(passwordData);
      return { success: true, data: result };
    } catch (error) {
      return { 
        success: false, 
        error: error.response?.data?.message || 'Erro ao alterar senha' 
      };
    }
  };

  const value = {
    user,
    login,
    register,
    logout,
    changePassword,
    loading,
    isAuthenticated: !!user
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth deve ser usado dentro de um AuthProvider');
  }
  return context;
} 