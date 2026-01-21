import React, { useEffect } from 'react';
import { useProducts } from '../../context/ProductsContext';
import { useOrders } from '../../context/OrdersContext';
import { useAuth } from '../../context/AuthContext';
import { Card, CardTitle, Spinner } from '../../components/ui';
import {
  CurrencyDollarIcon,
  ShoppingCartIcon,
  CubeIcon,
  UserGroupIcon,
  ArrowUpIcon,
  ArrowDownIcon,
} from '@heroicons/react/24/outline';
import { mockDashboardStats } from '../../data/mockData';

/**
 * Dashboard page with store statistics and overview
 */
export default function Dashboard() {
  const { user } = useAuth();
  const { products, loadMyProducts, isLoading: productsLoading } = useProducts();
  const { allOrders, loadMyOrders, isLoading: ordersLoading } = useOrders();

  // Load data on mount
  useEffect(() => {
    loadMyProducts();
    loadMyOrders();
  }, [loadMyProducts, loadMyOrders]);

  const isLoading = productsLoading || ordersLoading;

  // Ensure products and orders are arrays
  const productList = Array.isArray(products) ? products : [];
  const orderList = Array.isArray(allOrders) ? allOrders : [];

  // Calculate total sales from DELIVERED orders only
  const totalSales = orderList
    .filter(order => order.status === 'delivered')
    .reduce((sum, order) => sum + (order.total || 0), 0);

  // Calculate sales by day for the last 7 days (from delivered orders only)
  const calculateRecentSales = () => {
    const salesByDay = {};
    
    // Initialize last 7 days with 0
    for (let i = 6; i >= 0; i--) {
      const date = new Date();
      date.setDate(date.getDate() - i);
      const dateStr = date.toISOString().split('T')[0];
      salesByDay[dateStr] = 0;
    }
    
    // Sum delivered orders by day
    orderList
      .filter(order => order.status === 'delivered')
      .forEach(order => {
        const orderDate = new Date(order.createdAt).toISOString().split('T')[0];
        if (salesByDay[orderDate] !== undefined) {
          salesByDay[orderDate] += order.total || 0;
        }
      });
    
    // Convert to array sorted by date
    return Object.entries(salesByDay)
      .map(([date, amount]) => ({ date, amount }))
      .sort((a, b) => new Date(a.date) - new Date(b.date));
  };

  const recentSales = calculateRecentSales();
  const maxSale = Math.max(...recentSales.map(s => s.amount), 1); // Avoid division by 0

  // Calculate stats
  const stats = [
    {
      name: 'Total Sales',
      value: `${totalSales.toLocaleString()} TND`,
      change: mockDashboardStats.salesGrowth,
      icon: CurrencyDollarIcon,
      color: 'bg-green-500',
    },
    {
      name: 'Total Orders',
      value: orderList.length,
      change: mockDashboardStats.ordersGrowth,
      icon: ShoppingCartIcon,
      color: 'bg-blue-500',
    },
    {
      name: 'Products',
      value: productList.length,
      change: null,
      icon: CubeIcon,
      color: 'bg-purple-500',
    },
    {
      name: 'Customers',
      value: new Set(orderList.map(o => o.customer?.email).filter(Boolean)).size,
      change: 5.2,
      icon: UserGroupIcon,
      color: 'bg-orange-500',
    },
  ];

  // Recent orders for display
  const recentOrders = orderList.slice(0, 5);

  // Status colors for badges
  const getStatusColor = (status) => {
    const colors = {
      delivered: 'bg-green-100 text-green-700',
      shipped: 'bg-blue-100 text-blue-700',
      processing: 'bg-yellow-100 text-yellow-700',
      pending: 'bg-gray-100 text-gray-700',
    };
    return colors[status] || colors.pending;
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div>
        <h1 className="text-2xl font-bold text-secondary-800">Dashboard</h1>
        <p className="text-secondary-500 mt-1">
          Welcome back, {user?.name || 'there'}! Here's an overview of your store.
        </p>
      </div>

      {isLoading ? (
        <div className="flex items-center justify-center py-20">
          <Spinner size="lg" />
        </div>
      ) : (
        <>
          {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat) => (
          <Card key={stat.name} className="relative overflow-hidden">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm text-secondary-500">{stat.name}</p>
                <p className="text-2xl font-bold text-secondary-800 mt-1">
                  {stat.value}
                </p>
                {stat.change !== null && (
                  <div className="flex items-center mt-2">
                    {stat.change >= 0 ? (
                      <ArrowUpIcon className="h-4 w-4 text-green-500" />
                    ) : (
                      <ArrowDownIcon className="h-4 w-4 text-red-500" />
                    )}
                    <span
                      className={`text-sm font-medium ml-1 ${
                        stat.change >= 0 ? 'text-green-600' : 'text-red-600'
                      }`}
                    >
                      {Math.abs(stat.change)}%
                    </span>
                    <span className="text-sm text-secondary-400 ml-1">
                      vs last month
                    </span>
                  </div>
                )}
              </div>
              <div
                className={`flex items-center justify-center w-12 h-12 rounded-xl ${stat.color}`}
              >
                <stat.icon className="h-6 w-6 text-white" />
              </div>
            </div>
          </Card>
        ))}
      </div>

      {/* Two Column Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Orders */}
        <Card>
          <CardTitle>Recent Orders</CardTitle>
          <div className="mt-4 space-y-4">
            {recentOrders.map((order) => (
              <div
                key={order._id || order.id}
                className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
              >
                <div className="flex items-center gap-3">
                  <div className="flex items-center justify-center w-10 h-10 bg-white rounded-lg border border-gray-200">
                    <ShoppingCartIcon className="h-5 w-5 text-secondary-400" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-secondary-800">
                      {order.orderId || order._id?.slice(-8)}
                    </p>
                    <p className="text-xs text-secondary-500">
                      {order.customer?.name || 'Customer'}
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-sm font-semibold text-secondary-800">
                    {(order.total || 0).toFixed(2)} TND
                  </p>
                  <span
                    className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${getStatusColor(
                      order.status
                    )}`}
                  >
                    {order.status?.charAt(0).toUpperCase() + order.status?.slice(1)}
                  </span>
                </div>
              </div>
            ))}
            {recentOrders.length === 0 && (
              <p className="text-secondary-500 text-center py-4">No orders yet</p>
            )}
          </div>
        </Card>

        {/* Top Products */}
        <Card>
          <CardTitle>Top Products</CardTitle>
          <div className="mt-4 space-y-4">
            {productList.slice(0, 5).map((product) => (
              <div
                key={product._id || product.id}
                className="flex items-center gap-4 p-3 bg-gray-50 rounded-lg"
              >
                <img
                  src={product.image}
                  alt={product.name}
                  className="w-12 h-12 object-cover rounded-lg"
                />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-secondary-800 truncate">
                    {product.name}
                  </p>
                  <p className="text-xs text-secondary-500">
                    {product.inventory} in stock
                  </p>
                </div>
                <p className="text-sm font-semibold text-secondary-800">
                  {(product.price || 0).toFixed(2)} TND
                </p>
              </div>
            ))}
            {productList.length === 0 && (
              <p className="text-secondary-500 text-center py-4">No products yet</p>
            )}
          </div>
        </Card>
      </div>

      {/* Sales Chart */}
      <Card>
        <CardTitle>Sales Overview (Last 7 Days - Delivered Orders)</CardTitle>
        <div className="mt-4">
          <div className="flex items-end justify-between h-48 px-4">
            {recentSales.map((sale, index) => (
              <div
                key={index}
                className="flex flex-col items-center flex-1"
              >
                <div className="text-xs text-secondary-600 mb-1 font-medium">
                  {sale.amount > 0 ? `${sale.amount.toFixed(0)} TND` : ''}
                </div>
                <div
                  className="w-10 bg-primary-500 rounded-t-lg transition-all hover:bg-primary-600"
                  style={{
                    height: `${Math.max((sale.amount / maxSale) * 100, sale.amount > 0 ? 5 : 0)}%`,
                    minHeight: sale.amount > 0 ? '8px' : '0px'
                  }}
                />
                <span className="text-xs text-secondary-500 mt-2">
                  {new Date(sale.date).toLocaleDateString('en-US', {
                    weekday: 'short',
                  })}
                </span>
              </div>
            ))}
          </div>
          {recentSales.every(s => s.amount === 0) && (
            <p className="text-secondary-500 text-center py-4">No delivered sales in the last 7 days</p>
          )}
        </div>
      </Card>
        </>
      )}
    </div>
  );
}
