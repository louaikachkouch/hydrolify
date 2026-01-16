import React, { createContext, useContext, useState, useCallback, useEffect } from 'react';
import { storesAPI } from '../services/api';
import { validateSubdomain, normalizeSubdomain } from '../utils/subdomain';

// Create the Store Context
const StoreContext = createContext(null);

/**
 * StoreProvider component that manages store settings state for multi-tenant
 */
export function StoreProvider({ children }) {
  // All stores (for multi-tenant support)
  const [stores, setStores] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  
  // Current active store (for dashboard - owner's store)
  const [currentStoreId, setCurrentStoreId] = useState(null);
  const [settings, setSettings] = useState({});

  // Load all active stores on mount
  useEffect(() => {
    const loadStores = async () => {
      try {
        const allStores = await storesAPI.getAll();
        setStores(allStores);
      } catch (error) {
        console.error('Failed to load stores:', error);
      } finally {
        setIsLoading(false);
      }
    };
    loadStores();
  }, []);

  // Load current store settings when store ID changes
  useEffect(() => {
    const loadCurrentStore = async () => {
      if (currentStoreId) {
        try {
          const store = await storesAPI.getMyStore();
          setSettings(store);
        } catch (error) {
          console.error('Failed to load store settings:', error);
        }
      }
    };
    loadCurrentStore();
  }, [currentStoreId]);

  /**
   * Set the current store by ID (used when user logs in)
   */
  const setCurrentStore = useCallback((storeId) => {
    setCurrentStoreId(storeId);
  }, []);

  /**
   * Refresh stores list
   */
  const refreshStores = useCallback(async () => {
    try {
      const allStores = await storesAPI.getAll();
      setStores(allStores);
    } catch (error) {
      console.error('Failed to refresh stores:', error);
    }
  }, []);

  /**
   * Get store by slug (for public storefront)
   */
  const getStoreBySlug = useCallback(async (slug) => {
    try {
      return await storesAPI.getBySlug(slug);
    } catch (error) {
      return null;
    }
  }, []);

  /**
   * Get store by subdomain (for subdomain-based routing)
   */
  const getStoreBySubdomain = useCallback(async (subdomain) => {
    try {
      return await storesAPI.getBySubdomain(subdomain);
    } catch (error) {
      return null;
    }
  }, []);

  /**
   * Check if a subdomain is available
   */
  const isSubdomainAvailable = useCallback(async (subdomain, excludeStoreId = null) => {
    try {
      const result = await storesAPI.checkSubdomain(subdomain, excludeStoreId);
      return result.available;
    } catch (error) {
      return false;
    }
  }, []);

  /**
   * Update store subdomain with validation
   */
  const updateSubdomain = useCallback(async (newSubdomain) => {
    const normalized = normalizeSubdomain(newSubdomain);
    const validation = validateSubdomain(normalized);
    
    if (!validation.isValid) {
      return { success: false, error: validation.error };
    }
    
    try {
      const result = await storesAPI.updateSubdomain(normalized);
      setSettings(prev => ({ ...prev, subdomain: result.subdomain, slug: result.subdomain }));
      await refreshStores();
      return { success: true, subdomain: result.subdomain };
    } catch (error) {
      return { success: false, error: error.message };
    }
  }, [refreshStores]);

  /**
   * Get store by ID from local cache
   */
  const getStoreById = useCallback((id) => {
    return stores.find(s => s._id === id || s.id === id);
  }, [stores]);

  /**
   * Get all active stores from local cache
   */
  const getActiveStores = useCallback(() => {
    return stores.filter(s => s.isActive);
  }, [stores]);

  /**
   * Update store settings
   * @param {Object} newSettings - Updated settings object
   */
  const updateSettings = useCallback(async (newSettings) => {
    try {
      const updatedStore = await storesAPI.updateMyStore(newSettings);
      setSettings(updatedStore);
      await refreshStores();
      return { success: true };
    } catch (error) {
      return { success: false, error: error.message };
    }
  }, [refreshStores]);

  const value = {
    settings,
    stores,
    currentStoreId,
    isLoading,
    setCurrentStore,
    refreshStores,
    getStoreBySlug,
    getStoreBySubdomain,
    getStoreById,
    getActiveStores,
    updateSettings,
    updateSubdomain,
    isSubdomainAvailable,
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
