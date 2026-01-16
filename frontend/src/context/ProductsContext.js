import React, { createContext, useContext, useState, useCallback } from 'react';
import { productsAPI } from '../services/api';

// Create the Products Context
const ProductsContext = createContext(null);

/**
 * ProductsProvider component that manages products state (multi-tenant)
 */
export function ProductsProvider({ children }) {
  const [allProducts, setAllProducts] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  /**
   * Load products for current user's store (dashboard)
   */
  const loadMyProducts = useCallback(async () => {
    setIsLoading(true);
    try {
      const products = await productsAPI.getMyProducts();
      setAllProducts(products);
      return products;
    } catch (error) {
      console.error('Failed to load products:', error);
      return [];
    } finally {
      setIsLoading(false);
    }
  }, []);

  /**
   * Get products for a specific store (public storefront)
   * @param {string} storeId - Store ID
   * @returns {Promise<Array>} Products for the store
   */
  const getProductsByStore = useCallback(async (storeId) => {
    try {
      const products = await productsAPI.getByStore(storeId);
      return products;
    } catch (error) {
      console.error('Failed to load store products:', error);
      return [];
    }
  }, []);

  /**
   * Get active products for storefront
   * @param {string} storeId - Store ID
   * @returns {Promise<Array>} Active products for the store
   */
  const getActiveProductsByStore = useCallback(async (storeId) => {
    try {
      const products = await productsAPI.getActiveByStore(storeId);
      return products;
    } catch (error) {
      console.error('Failed to load active products:', error);
      return [];
    }
  }, []);

  /**
   * Add a new product
   * @param {Object} product - Product data
   */
  const addProduct = useCallback(async (product) => {
    try {
      const newProduct = await productsAPI.create(product);
      setAllProducts((prev) => [newProduct, ...prev]);
      return { success: true, product: newProduct };
    } catch (error) {
      return { success: false, error: error.message };
    }
  }, []);

  /**
   * Update an existing product
   * @param {string} id - Product ID
   * @param {Object} updates - Updated product data
   */
  const updateProduct = useCallback(async (id, updates) => {
    try {
      const updatedProduct = await productsAPI.update(id, updates);
      setAllProducts((prev) =>
        prev.map((product) =>
          product._id === id ? updatedProduct : product
        )
      );
      return { success: true, product: updatedProduct };
    } catch (error) {
      return { success: false, error: error.message };
    }
  }, []);

  /**
   * Delete a product
   * @param {string} id - Product ID
   */
  const deleteProduct = useCallback(async (id) => {
    try {
      await productsAPI.delete(id);
      setAllProducts((prev) => prev.filter((product) => product._id !== id));
      return { success: true };
    } catch (error) {
      return { success: false, error: error.message };
    }
  }, []);

  /**
   * Get a product by ID from local state
   * @param {string} id - Product ID
   * @returns {Object|undefined} Product object
   */
  const getProduct = useCallback((id) => {
    return allProducts.find((product) => product._id === id || product.id === id);
  }, [allProducts]);

  // Backward compatible - returns all products
  const products = allProducts;

  const value = {
    products,
    allProducts,
    isLoading,
    loadMyProducts,
    getProductsByStore,
    getActiveProductsByStore,
    addProduct,
    updateProduct,
    deleteProduct,
    getProduct,
  };

  return (
    <ProductsContext.Provider value={value}>
      {children}
    </ProductsContext.Provider>
  );
}

/**
 * Custom hook to use products context
 * @returns {Object} Products context value
 */
export function useProducts() {
  const context = useContext(ProductsContext);
  if (!context) {
    throw new Error('useProducts must be used within a ProductsProvider');
  }
  return context;
}
