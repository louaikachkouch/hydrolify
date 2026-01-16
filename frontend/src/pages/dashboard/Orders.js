import React, { useState } from 'react';
import { useOrders } from '../../context/OrdersContext';
import { useStore } from '../../context/StoreContext';
import { useAuth } from '../../context/AuthContext';
import {
  Card,
  Badge,
  getStatusVariant,
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
  Modal,
  Button,
  Select,
  ModalFooter,
} from '../../components/ui';
import {
  MagnifyingGlassIcon,
  EyeIcon,
} from '@heroicons/react/24/outline';

/**
 * Orders page with list view and status management
 */
export default function Orders() {
  const { user } = useAuth();
  const { currentStoreId } = useStore();
  const { getOrdersByStore, updateOrderStatus } = useOrders();
  
  // Get current store's orders
  const storeId = currentStoreId || user?.storeId || 1;
  const orders = getOrdersByStore(storeId);
  
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newStatus, setNewStatus] = useState('');

  // Status options for filter
  const statusFilterOptions = [
    { value: 'all', label: 'All Orders' },
    { value: 'pending', label: 'Pending' },
    { value: 'processing', label: 'Processing' },
    { value: 'shipped', label: 'Shipped' },
    { value: 'delivered', label: 'Delivered' },
  ];

  // Status options for updating
  const statusUpdateOptions = [
    { value: 'pending', label: 'Pending' },
    { value: 'processing', label: 'Processing' },
    { value: 'shipped', label: 'Shipped' },
    { value: 'delivered', label: 'Delivered' },
    { value: 'cancelled', label: 'Cancelled' },
  ];

  // Filter orders
  const filteredOrders = orders.filter((order) => {
    const matchesSearch =
      order.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      order.customer.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      order.customer.email.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesStatus =
      statusFilter === 'all' || order.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  // View order details
  const handleViewOrder = (order) => {
    setSelectedOrder(order);
    setNewStatus(order.status);
    setIsModalOpen(true);
  };

  // Update order status
  const handleUpdateStatus = () => {
    if (selectedOrder && newStatus !== selectedOrder.status) {
      updateOrderStatus(selectedOrder.id, newStatus);
      setSelectedOrder({ ...selectedOrder, status: newStatus });
    }
    setIsModalOpen(false);
  };

  // Format date
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div>
        <h1 className="text-2xl font-bold text-secondary-800">Orders</h1>
        <p className="text-secondary-500 mt-1">
          View and manage customer orders
        </p>
      </div>

      {/* Filters */}
      <Card>
        <div className="flex flex-col sm:flex-row gap-4">
          {/* Search */}
          <div className="relative flex-1">
            <MagnifyingGlassIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-secondary-400" />
            <input
              type="text"
              placeholder="Search orders..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            />
          </div>

          {/* Status Filter */}
          <div className="w-full sm:w-48">
            <Select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              options={statusFilterOptions}
            />
          </div>
        </div>
      </Card>

      {/* Orders Summary */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {['pending', 'processing', 'shipped', 'delivered'].map((status) => {
          const count = orders.filter((o) => o.status === status).length;
          return (
            <Card key={status} className="text-center">
              <p className="text-2xl font-bold text-secondary-800">{count}</p>
              <p className="text-sm text-secondary-500 capitalize">{status}</p>
            </Card>
          );
        })}
      </div>

      {/* Orders Table */}
      <Card noPadding>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Order ID</TableHead>
              <TableHead>Customer</TableHead>
              <TableHead>Date</TableHead>
              <TableHead>Total</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Payment</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredOrders.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} className="text-center py-12 text-secondary-500">
                  No orders found
                </TableCell>
              </TableRow>
            ) : (
              filteredOrders.map((order) => (
                <TableRow key={order.id}>
                  <TableCell>
                    <span className="font-medium text-secondary-800">
                      {order.id}
                    </span>
                  </TableCell>
                  <TableCell>
                    <div>
                      <p className="font-medium text-secondary-800">
                        {order.customer.name}
                      </p>
                      <p className="text-xs text-secondary-500">
                        {order.customer.email}
                      </p>
                    </div>
                  </TableCell>
                  <TableCell className="text-secondary-600">
                    {formatDate(order.createdAt)}
                  </TableCell>
                  <TableCell>
                    <span className="font-semibold text-secondary-800">
                      {order.total.toFixed(2)} TND
                    </span>
                  </TableCell>
                  <TableCell>
                    <Badge variant={getStatusVariant(order.status)}>
                      {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Badge variant={getStatusVariant(order.paymentStatus)}>
                      {order.paymentStatus.charAt(0).toUpperCase() + order.paymentStatus.slice(1)}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <button
                      onClick={() => handleViewOrder(order)}
                      className="p-2 text-secondary-400 hover:text-primary-600 hover:bg-primary-50 rounded-lg transition-colors"
                    >
                      <EyeIcon className="h-4 w-4" />
                    </button>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </Card>

      {/* Order Details Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={`Order ${selectedOrder?.id}`}
        size="lg"
      >
        {selectedOrder && (
          <div className="space-y-6">
            {/* Customer Info */}
            <div>
              <h4 className="text-sm font-medium text-secondary-500 mb-2">
                Customer Information
              </h4>
              <div className="bg-gray-50 rounded-lg p-4">
                <p className="font-medium text-secondary-800">
                  {selectedOrder.customer.name}
                </p>
                <p className="text-sm text-secondary-600">
                  {selectedOrder.customer.email}
                </p>
                <p className="text-sm text-secondary-600 mt-2">
                  {selectedOrder.shippingAddress}
                </p>
              </div>
            </div>

            {/* Order Items */}
            <div>
              <h4 className="text-sm font-medium text-secondary-500 mb-2">
                Order Items
              </h4>
              <div className="bg-gray-50 rounded-lg divide-y divide-gray-200">
                {selectedOrder.items.map((item, index) => (
                  <div key={index} className="flex justify-between p-4">
                    <div>
                      <p className="font-medium text-secondary-800">
                        {item.name}
                      </p>
                      <p className="text-sm text-secondary-500">
                        Qty: {item.quantity}
                      </p>
                    </div>
                    <p className="font-medium text-secondary-800">
                      {(item.price * item.quantity).toFixed(2)} TND
                    </p>
                  </div>
                ))}
                <div className="flex justify-between p-4 bg-gray-100">
                  <p className="font-semibold text-secondary-800">Total</p>
                  <p className="font-semibold text-secondary-800">
                    {selectedOrder.total.toFixed(2)} TND
                  </p>
                </div>
              </div>
            </div>

            {/* Update Status */}
            <div>
              <h4 className="text-sm font-medium text-secondary-500 mb-2">
                Update Status
              </h4>
              <Select
                value={newStatus}
                onChange={(e) => setNewStatus(e.target.value)}
                options={statusUpdateOptions}
              />
            </div>

            <ModalFooter>
              <Button
                variant="secondary"
                onClick={() => setIsModalOpen(false)}
              >
                Close
              </Button>
              <Button onClick={handleUpdateStatus}>
                Update Status
              </Button>
            </ModalFooter>
          </div>
        )}
      </Modal>
    </div>
  );
}
