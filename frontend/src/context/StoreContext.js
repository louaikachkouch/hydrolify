import React, { createContext, useContext, useState, useCallback } from 'react';
import { mockStores } from '../data/mockData';

// Create the Store Context
const StoreContext = createContext(null);

/**
 * StoreProvider component that manages store settings state for multi-tenant
 */
export function StoreProvider({ children }) {
  // All stores (for multi-tenant support)
  const [stores, setStores] = useState(mockStores);
  
  // Current active store (for dashboard - owner's store)
  const [currentStoreId, setCurrentStoreId] = useState(null);
  
  // Get current store settings
  const settings = stores.find(s => s.id === currentStoreId) || stores[0] || {};

  /**
   * Set the current store by ID (used when user logs in)
   */
  const setCurrentStore = useCallback((storeId) => {
    setCurrentStoreId(storeId);
  }, []);

  /**
   * Get store by slug (for public storefront)
   */
  const getStoreBySlug = useCallback((slug) => {
    return stores.find(s => s.slug === slug && s.isActive);
  }, [stores]);

  /**
   * Get store by ID
   */
  const getStoreById = useCallback((id) => {
    return stores.find(s => s.id === id);
  }, [stores]);

  /**
   * Get all active stores
   */
  const getActiveStores = useCallback(() => {
    return stores.filter(s => s.isActive);
  }, [stores]);

  /**
   * Update store settings
   * @param {Object} newSettings - Updated settings object
   */
  const updateSettings = (newSettings) => {
    setStores(prev => prev.map(store => 
      store.id === currentStoreId 
        ? { ...store, ...newSettings }
        : store
    ));
  };

  /**
   * Create a new store
   */
  const createStore = useCallback((storeData) => {
    const newStore = {
      id: Math.max(...stores.map(s => s.id)) + 1,
      slug: storeData.storeName.toLowerCase().replace(/\s+/g, '-'),
      isActive: true,
      createdAt: new Date().toISOString(),
      currency: 'TND',
      timezone: 'Africa/Tunis',
      themeColor: '#2563eb',
      ...storeData,
    };
    setStores(prev => [...prev, newStore]);
    return newStore;
  }, [stores]);

  /**
   * Reset settings to default for current store
   */
  const resetSettings = () => {
    const originalStore = mockStores.find(s => s.id === currentStoreId);
    if (originalStore) {
      setStores(prev => prev.map(store => 
        store.id === currentStoreId ? originalStore : store
      ));
    }
  };

  const value = {
    settings,
    stores,
    currentStoreId,
    setCurrentStore,
    getStoreBySlug,
    getStoreById,
    getActiveStores,
    updateSettings,
    createStore,
    resetSettings,
  };

  return (
    <StoreContext.Provider value={value}>{children}</StoreContext.Provider>
  );
}

/**
 * Custom hook to use store context
 * @returns {Object} Store context value
 */
export function useStore() {
  const context = useContext(StoreContext);
  if (!context) {
    throw new Error('useStore must be used within a StoreProvider');
  }
  return context;
}
