import React, { useState, useEffect } from 'react';
import { useOrders } from '../../context/OrdersContext';
import { useStore } from '../../context/StoreContext';
import { useAuth } from '../../context/AuthContext';
import { useProducts } from '../../context/ProductsContext';
import { ordersAPI } from '../../services/api';
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
  Spinner,
  Input,
} from '../../components/ui';
import {
  MagnifyingGlassIcon,
  EyeIcon,
  PlusIcon,
  TrashIcon,
} from '@heroicons/react/24/outline';

/**
 * Orders page with list view and status management
 */
export default function Orders() {
  const { user } = useAuth();
  const { currentStoreId, settings } = useStore();
  const { allOrders, loadMyOrders, updateOrderStatus, isLoading } = useOrders();
  const { products, loadMyProducts } = useProducts();
  
  // Load orders and products on mount
  useEffect(() => {
    loadMyOrders();
    loadMyProducts();
  }, [loadMyOrders, loadMyProducts]);
  
  // Use all orders (they're already filtered by the API for the current user's store)
  const orders = allOrders;
  
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newStatus, setNewStatus] = useState('');
  
  // Manual order creation state
  const [isAddOrderModalOpen, setIsAddOrderModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [orderError, setOrderError] = useState('');
  const [newOrderData, setNewOrderData] = useState({
    customerName: '',
    customerEmail: '',
    customerPhone: '',
    shippingAddress: '',
    items: [],
  });
  const [selectedProduct, setSelectedProduct] = useState('');
  const [selectedQuantity, setSelectedQuantity] = useState(1);

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
    const orderId = order.orderId || order._id || order.id || '';
    const customerName = order.customer?.name || '';
    const customerEmail = order.customer?.email || '';
    
    const matchesSearch =
      orderId.toLowerCase().includes(searchQuery.toLowerCase()) ||
      customerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      customerEmail.toLowerCase().includes(searchQuery.toLowerCase());
    
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
  const handleUpdateStatus = async () => {
    if (selectedOrder && newStatus !== selectedOrder.status) {
      await updateOrderStatus(selectedOrder._id, newStatus);
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

  // Add item to manual order
  const handleAddItem = () => {
    if (!selectedProduct) return;
    
    const product = products.find(p => (p._id || p.id) === selectedProduct);
    if (!product) return;
    
    const existingItem = newOrderData.items.find(
      item => (item.productId) === selectedProduct
    );
    
    if (existingItem) {
      setNewOrderData({
        ...newOrderData,
        items: newOrderData.items.map(item =>
          item.productId === selectedProduct
            ? { ...item, quantity: item.quantity + selectedQuantity }
            : item
        ),
      });
    } else {
      setNewOrderData({
        ...newOrderData,
        items: [
          ...newOrderData.items,
          {
            productId: product._id || product.id,
            name: product.name,
            price: product.price,
            quantity: selectedQuantity,
            image: product.image,
          },
        ],
      });
    }
    
    setSelectedProduct('');
    setSelectedQuantity(1);
  };

  // Remove item from manual order
  const handleRemoveItem = (productId) => {
    setNewOrderData({
      ...newOrderData,
      items: newOrderData.items.filter(item => item.productId !== productId),
    });
  };

  // Calculate order total
  const calculateOrderTotal = () => {
    return newOrderData.items.reduce(
      (sum, item) => sum + item.price * item.quantity,
      0
    );
  };

  // Submit manual order
  const handleSubmitOrder = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setOrderError('');

    try {
      const storeId = currentStoreId || settings?._id || user?.storeId;
      
      const orderData = {
        storeId,
        customer: {
          name: newOrderData.customerName,
          email: newOrderData.customerEmail,
          phone: newOrderData.customerPhone,
        },
        items: newOrderData.items,
        shippingAddress: newOrderData.shippingAddress,
        total: calculateOrderTotal(),
      };

      await ordersAPI.create(orderData);
      
      // Reset form and close modal
      setNewOrderData({
        customerName: '',
        customerEmail: '',
        customerPhone: '',
        shippingAddress: '',
        items: [],
      });
      setIsAddOrderModalOpen(false);
      
      // Reload orders
      loadMyOrders();
    } catch (error) {
      setOrderError(error.message || 'Failed to create order');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Reset add order modal
  const handleOpenAddOrderModal = () => {
    setNewOrderData({
      customerName: '',
      customerEmail: '',
      customerPhone: '',
      shippingAddress: '',
      items: [],
    });
    setOrderError('');
    setIsAddOrderModalOpen(true);
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-secondary-800">Orders</h1>
          <p className="text-secondary-500 mt-1">
            View and manage customer orders
          </p>
        </div>
        <Button onClick={handleOpenAddOrderModal}>
          <PlusIcon className="h-5 w-5 mr-2" />
          Add Order
        </Button>
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
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredOrders.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} className="text-center py-12 text-secondary-500">
                  {isLoading ? 'Loading orders...' : 'No orders found'}
                </TableCell>
              </TableRow>
            ) : (
              filteredOrders.map((order) => (
                <TableRow key={order._id || order.orderId}>
                  <TableCell>
                    <span className="font-medium text-secondary-800">
                      {order.orderId || order._id}
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
        title={`Order ${selectedOrder?.orderId || selectedOrder?._id}`}
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
                {selectedOrder.customer.phone && (
                  <p className="text-sm text-secondary-600">
                    {selectedOrder.customer.phone}
                  </p>
                )}
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

      {/* Add Order Modal */}
      <Modal
        isOpen={isAddOrderModalOpen}
        onClose={() => !isSubmitting && setIsAddOrderModalOpen(false)}
        title="Add New Order"
        size="lg"
      >
        <form onSubmit={handleSubmitOrder} className="space-y-6">
          {/* Customer Information */}
          <div>
            <h4 className="text-sm font-medium text-secondary-700 mb-3">
              Customer Information
            </h4>
            <div className="space-y-3">
              <Input
                label="Customer Name"
                placeholder="Enter customer name"
                value={newOrderData.customerName}
                onChange={(e) => setNewOrderData({ ...newOrderData, customerName: e.target.value })}
                required
              />
              <Input
                label="Email"
                type="email"
                placeholder="Enter customer email"
                value={newOrderData.customerEmail}
                onChange={(e) => setNewOrderData({ ...newOrderData, customerEmail: e.target.value })}
                required
              />
              <Input
                label="Phone Number"
                placeholder="Enter phone number"
                value={newOrderData.customerPhone}
                onChange={(e) => setNewOrderData({ ...newOrderData, customerPhone: e.target.value })}
              />
              <div>
                <label className="block text-sm font-medium text-secondary-700 mb-1">
                  Shipping Address
                </label>
                <textarea
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  rows="2"
                  placeholder="Enter shipping address"
                  value={newOrderData.shippingAddress}
                  onChange={(e) => setNewOrderData({ ...newOrderData, shippingAddress: e.target.value })}
                  required
                />
              </div>
            </div>
          </div>

          {/* Add Products */}
          <div>
            <h4 className="text-sm font-medium text-secondary-700 mb-3">
              Order Items
            </h4>
            <div className="flex gap-2 mb-3">
              <div className="flex-1">
                <Select
                  value={selectedProduct}
                  onChange={(e) => setSelectedProduct(e.target.value)}
                  options={[
                    { value: '', label: 'Select a product...' },
                    ...products
                      .filter(p => p.status === 'active')
                      .map(p => ({
                        value: p._id || p.id,
                        label: `${p.name} - ${p.price.toFixed(2)} TND`,
                      })),
                  ]}
                />
              </div>
              <div className="w-20">
                <Input
                  type="number"
                  min="1"
                  value={selectedQuantity}
                  onChange={(e) => setSelectedQuantity(parseInt(e.target.value) || 1)}
                />
              </div>
              <Button
                type="button"
                variant="secondary"
                onClick={handleAddItem}
                disabled={!selectedProduct}
              >
                Add
              </Button>
            </div>

            {/* Items List */}
            {newOrderData.items.length > 0 ? (
              <div className="bg-gray-50 rounded-lg divide-y divide-gray-200">
                {newOrderData.items.map((item, index) => (
                  <div key={index} className="flex items-center justify-between p-3">
                    <div className="flex-1">
                      <p className="font-medium text-secondary-800">{item.name}</p>
                      <p className="text-sm text-secondary-500">
                        {item.price.toFixed(2)} TND × {item.quantity}
                      </p>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="font-semibold text-secondary-800">
                        {(item.price * item.quantity).toFixed(2)} TND
                      </span>
                      <button
                        type="button"
                        onClick={() => handleRemoveItem(item.productId)}
                        className="text-red-500 hover:text-red-600"
                      >
                        <TrashIcon className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                ))}
                <div className="flex justify-between p-3 bg-gray-100 font-bold">
                  <span>Total</span>
                  <span className="text-primary-600">
                    {calculateOrderTotal().toFixed(2)} TND
                  </span>
                </div>
              </div>
            ) : (
              <p className="text-sm text-secondary-500 text-center py-4 bg-gray-50 rounded-lg">
                No items added yet. Select a product above.
              </p>
            )}
          </div>

          {/* Error Message */}
          {orderError && (
            <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-red-600 text-sm">
              {orderError}
            </div>
          )}

          <ModalFooter>
            <Button
              type="button"
              variant="secondary"
              onClick={() => setIsAddOrderModalOpen(false)}
              disabled={isSubmitting}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={isSubmitting || newOrderData.items.length === 0}
            >
              {isSubmitting ? (
                <span className="flex items-center gap-2">
                  <Spinner size="sm" />
                  Creating...
                </span>
              ) : (
                'Create Order'
              )}
            </Button>
          </ModalFooter>
        </form>
      </Modal>
    </div>
  );
}
