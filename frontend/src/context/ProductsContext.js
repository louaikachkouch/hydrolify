import React, { createContext, useContext, useState, useCallback } from 'react';
import { mockProducts as initialProducts } from '../data/mockData';

// Create the Products Context
const ProductsContext = createContext(null);

/**
 * ProductsProvider component that manages products state (multi-tenant)
 */
export function ProductsProvider({ children }) {
  const [allProducts, setAllProducts] = useState(initialProducts);

  /**
   * Get products for a specific store
   * @param {number} storeId - Store ID
   * @returns {Array} Products for the store
   */
  const getProductsByStore = useCallback((storeId) => {
    return allProducts.filter(p => p.storeId === storeId);
  }, [allProducts]);

  /**
   * Add a new product to a store
   * @param {Object} product - Product data
   * @param {number} storeId - Store ID
   */
  const addProduct = (product, storeId) => {
    const newProduct = {
      ...product,
      id: Math.max(...allProducts.map((p) => p.id), 0) + 1,
      storeId: storeId,
      createdAt: new Date().toISOString(),
    };
    setAllProducts((prev) => [...prev, newProduct]);
    return newProduct;
  };

  /**
   * Update an existing product
   * @param {number} id - Product ID
   * @param {Object} updates - Updated product data
   */
  const updateProduct = (id, updates) => {
    setAllProducts((prev) =>
      prev.map((product) =>
        product.id === id ? { ...product, ...updates } : product
      )
    );
  };

  /**
   * Delete a product
   * @param {number} id - Product ID
   */
  const deleteProduct = (id) => {
    setAllProducts((prev) => prev.filter((product) => product.id !== id));
  };

  /**
   * Get a product by ID
   * @param {number} id - Product ID
   * @returns {Object|undefined} Product object
   */
  const getProduct = (id) => {
    return allProducts.find((product) => product.id === id);
  };

  // Backward compatible - returns all products (for components that haven't been updated)
  const products = allProducts;

  const value = {
    products,
    allProducts,
    getProductsByStore,
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
