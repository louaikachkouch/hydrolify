import React, { createContext, useContext, useState, useCallback } from 'react';
import { mockOrders as initialOrders } from '../data/mockData';

// Create the Orders Context
const OrdersContext = createContext(null);

/**
 * OrdersProvider component that manages orders state (multi-tenant)
 */
export function OrdersProvider({ children }) {
  const [allOrders, setAllOrders] = useState(initialOrders);

  /**
   * Get orders for a specific store
   * @param {number} storeId - Store ID
   * @returns {Array} Orders for the store
   */
  const getOrdersByStore = useCallback((storeId) => {
    return allOrders.filter(o => o.storeId === storeId);
  }, [allOrders]);

  /**
   * Update order status
   * @param {string} orderId - Order ID
   * @param {string} status - New status
   */
  const updateOrderStatus = (orderId, status) => {
    setAllOrders((prev) =>
      prev.map((order) =>
        order.id === orderId ? { ...order, status } : order
      )
    );
  };

  /**
   * Get an order by ID
   * @param {string} orderId - Order ID
   * @returns {Object|undefined} Order object
   */
  const getOrder = (orderId) => {
    return allOrders.find((order) => order.id === orderId);
  };

  /**
   * Get orders by status (optionally filtered by store)
   * @param {string} status - Order status
   * @param {number} storeId - Optional store ID
   * @returns {Array} Filtered orders
   */
  const getOrdersByStatus = (status, storeId = null) => {
    let filtered = allOrders.filter((order) => order.status === status);
    if (storeId) {
      filtered = filtered.filter(o => o.storeId === storeId);
    }
    return filtered;
  };

  /**
   * Add a new order
   * @param {Object} orderData - Order data
   * @param {number} storeId - Store ID
   */
  const addOrder = (orderData, storeId) => {
    const newOrder = {
      ...orderData,
      id: `ORD-${storeId}${String(allOrders.length + 1).padStart(3, '0')}`,
      storeId: storeId,
      createdAt: new Date().toISOString(),
      status: 'pending',
      paymentStatus: 'pending',
    };
    setAllOrders((prev) => [...prev, newOrder]);
    return newOrder;
  };

  // Backward compatible - returns all orders
  const orders = allOrders;

  const value = {
    orders,
    allOrders,
    getOrdersByStore,
    updateOrderStatus,
    getOrder,
    getOrdersByStatus,
    addOrder,
  };

  return (
    <OrdersContext.Provider value={value}>{children}</OrdersContext.Provider>
  );
}

/**
 * Custom hook to use orders context
 * @returns {Object} Orders context value
 */
export function useOrders() {
  const context = useContext(OrdersContext);
  if (!context) {
    throw new Error('useOrders must be used within an OrdersProvider');
  }
  return context;
}
