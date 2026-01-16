import React, { createContext, useContext, useState, useEffect } from 'react';
import { authAPI } from '../services/api';

// Create the Auth Context
const AuthContext = createContext(null);

/**
 * AuthProvider component that wraps the app and provides authentication state
 */
export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  // Check for existing session on mount
  useEffect(() => {
    const initAuth = async () => {
      const savedUser = localStorage.getItem('hydrolify_user');
      const savedToken = localStorage.getItem('hydrolify_token');
      
      if (savedUser && savedToken) {
        try {
          // Verify token is still valid
          const { user: userData } = await authAPI.getMe();
          setUser(userData);
          localStorage.setItem('hydrolify_user', JSON.stringify(userData));
        } catch (error) {
          // Token expired or invalid
          localStorage.removeItem('hydrolify_user');
          localStorage.removeItem('hydrolify_token');
        }
      }
      setIsLoading(false);
    };

    initAuth();
  }, []);

  /**
   * Login function
   * @param {string} email - User email
   * @param {string} password - User password
   * @returns {Promise<{success: boolean, error?: string}>}
   */
  const login = async (email, password) => {
    try {
      const { user: userData } = await authAPI.login(email, password);
      setUser(userData);
      localStorage.setItem('hydrolify_user', JSON.stringify(userData));
      return { success: true, user: userData };
    } catch (error) {
      return { success: false, error: error.message };
    }
  };

  /**
   * Register function - creates a new user account with a new store
   * @param {Object} userData - User registration data
   * @returns {Promise<{success: boolean, error?: string}>}
   */
  const register = async ({ name, email, password, storeName }) => {
    try {
      const { user: userData } = await authAPI.register(name, email, password, storeName);
      setUser(userData);
      localStorage.setItem('hydrolify_user', JSON.stringify(userData));
      return { success: true, user: userData, isNewStore: true };
    } catch (error) {
      return { success: false, error: error.message };
    }
  };

  /**
   * Logout function - clears user session
   */
  const logout = () => {
    authAPI.logout();
    setUser(null);
  };

  const value = {
    user,
    isLoading,
    isAuthenticated: !!user,
    login,
    register,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

/**
 * Custom hook to use auth context
 * @returns {Object} Auth context value
 */
export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
