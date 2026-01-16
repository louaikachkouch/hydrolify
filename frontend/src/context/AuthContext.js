import React, { createContext, useContext, useState, useEffect } from 'react';

// Create the Auth Context
const AuthContext = createContext(null);

// Mock user data for demo purposes (with storeId for multi-tenant)
const mockUsers = [
  {
    id: 1,
    email: 'demo@Hydrolify.com',
    password: 'demo123',
    name: 'Demo User',
    storeName: 'Demo Store',
    storeId: 1,
    storeSlug: 'demo-store',
  },
  {
    id: 2,
    email: 'fashion@Hydrolify.com',
    password: 'fashion123',
    name: 'Fashion Owner',
    storeName: 'Fashion Boutique',
    storeId: 2,
    storeSlug: 'fashion-boutique',
  },
  {
    id: 3,
    email: 'tech@Hydrolify.com',
    password: 'tech123',
    name: 'Tech Owner',
    storeName: 'Tech Zone',
    storeId: 3,
    storeSlug: 'tech-zone',
  },
];

/**
 * AuthProvider component that wraps the app and provides authentication state
 */
export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  // Check for existing session on mount
  useEffect(() => {
    const savedUser = localStorage.getItem('shopify_clone_user');
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }
    setIsLoading(false);
  }, []);

  /**
   * Login function - validates credentials against mock data
   * @param {string} email - User email
   * @param {string} password - User password
   * @returns {Promise<{success: boolean, error?: string}>}
   */
  const login = async (email, password) => {
    // Simulate API delay
    await new Promise((resolve) => setTimeout(resolve, 500));

    const foundUser = mockUsers.find(
      (u) => u.email === email && u.password === password
    );

    if (foundUser) {
      const userData = {
        id: foundUser.id,
        email: foundUser.email,
        name: foundUser.name,
        storeName: foundUser.storeName,
        storeId: foundUser.storeId,
        storeSlug: foundUser.storeSlug,
      };
      setUser(userData);
      localStorage.setItem('shopify_clone_user', JSON.stringify(userData));
      return { success: true, user: userData };
    }

    return { success: false, error: 'Invalid email or password' };
  };

  /**
   * Register function - creates a new user account with a new store
   * @param {Object} userData - User registration data
   * @returns {Promise<{success: boolean, error?: string}>}
   */
  const register = async ({ name, email, password, storeName }) => {
    // Simulate API delay
    await new Promise((resolve) => setTimeout(resolve, 500));

    // Check if email already exists
    const existingUser = mockUsers.find((u) => u.email === email);
    if (existingUser) {
      return { success: false, error: 'Email already registered' };
    }

    // Generate store slug from store name
    const storeSlug = storeName.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');
    const newStoreId = Math.max(...mockUsers.map(u => u.storeId || 0)) + 1;

    // Create new user with store association (in a real app, this would be an API call)
    const newUser = {
      id: mockUsers.length + 1,
      email,
      password,
      name,
      storeName,
      storeId: newStoreId,
      storeSlug: storeSlug,
    };
    mockUsers.push(newUser);

    const userData = {
      id: newUser.id,
      email: newUser.email,
      name: newUser.name,
      storeName: newUser.storeName,
      storeId: newUser.storeId,
      storeSlug: newUser.storeSlug,
    };
    setUser(userData);
    localStorage.setItem('shopify_clone_user', JSON.stringify(userData));
    return { success: true, user: userData, isNewStore: true };
  };

  /**
   * Logout function - clears user session
   */
  const logout = () => {
    setUser(null);
    localStorage.removeItem('shopify_clone_user');
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
