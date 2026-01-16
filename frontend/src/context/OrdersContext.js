import React, { createContext, useContext, useState, useCallback } from 'react';
import { ordersAPI } from '../services/api';

// Create the Orders Context
const OrdersContext = createContext(null);

/**
 * OrdersProvider component that manages orders state (multi-tenant)
 */
export function OrdersProvider({ children }) {
  const [allOrders, setAllOrders] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [dashboardStats, setDashboardStats] = useState(null);

  /**
   * Load orders for current user's store
   */
  const loadMyOrders = useCallback(async () => {
    setIsLoading(true);
    try {
      const orders = await ordersAPI.getMyOrders();
      setAllOrders(orders);
      return orders;
    } catch (error) {
      console.error('Failed to load orders:', error);
      return [];
    } finally {
      setIsLoading(false);
    }
  }, []);

  /**
   * Load dashboard statistics
   */
  const loadDashboardStats = useCallback(async () => {
    try {
      const stats = await ordersAPI.getDashboardStats();
      setDashboardStats(stats);
      return stats;
    } catch (error) {
      console.error('Failed to load dashboard stats:', error);
      return null;
    }
  }, []);

  /**
   * Get orders by store from local state (for backward compatibility)
   * @param {string} storeId - Store ID
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
  const updateOrderStatus = useCallback(async (orderId, status) => {
    try {
      const updatedOrder = await ordersAPI.updateStatus(orderId, status);
      setAllOrders((prev) =>
        prev.map((order) =>
          order._id === orderId ? updatedOrder : order
        )
      );
      return { success: true, order: updatedOrder };
    } catch (error) {
      return { success: false, error: error.message };
    }
  }, []);

  /**
   * Update payment status
   * @param {string} orderId - Order ID
   * @param {string} paymentStatus - New payment status
   */
  const updatePaymentStatus = useCallback(async (orderId, paymentStatus) => {
    try {
      const updatedOrder = await ordersAPI.updatePaymentStatus(orderId, paymentStatus);
      setAllOrders((prev) =>
        prev.map((order) =>
          order._id === orderId ? updatedOrder : order
        )
      );
      return { success: true, order: updatedOrder };
    } catch (error) {
      return { success: false, error: error.message };
    }
  }, []);

  /**
   * Get an order by ID from local state
   * @param {string} orderId - Order ID
   * @returns {Object|undefined} Order object
   */
  const getOrder = useCallback((orderId) => {
    return allOrders.find((order) => order._id === orderId || order.orderId === orderId);
  }, [allOrders]);

  /**
   * Get orders by status from local state
   * @param {string} status - Order status
   * @returns {Array} Filtered orders
   */
  const getOrdersByStatus = useCallback((status) => {
    return allOrders.filter((order) => order.status === status);
  }, [allOrders]);

  /**
   * Add a new order (for storefront checkout)
   * @param {Object} orderData - Order data
   * @param {string} storeId - Store ID
   */
  const addOrder = useCallback(async (orderData, storeId) => {
    try {
      const newOrder = await ordersAPI.create({
        ...orderData,
        storeId,
      });
      setAllOrders((prev) => [newOrder, ...prev]);
      return { success: true, order: newOrder };
    } catch (error) {
      return { success: false, error: error.message };
    }
  }, []);

  // Backward compatible - returns all orders
  const orders = allOrders;

  const value = {
    orders,
    allOrders,
    isLoading,
    dashboardStats,
    loadMyOrders,
    loadDashboardStats,
    getOrdersByStore,
    updateOrderStatus,
    updatePaymentStatus,
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
