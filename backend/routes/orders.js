const express = require('express');
const { body, validationResult } = require('express-validator');
const Order = require('../models/Order');
const Product = require('../models/Product');
const auth = require('../middleware/auth');

const router = express.Router();

// Get orders for current user's store (protected)
router.get('/my-orders', auth, async (req, res) => {
  try {
    const orders = await Order.find({ storeId: req.user.storeId })
      .sort({ createdAt: -1 });
    res.json(orders);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch orders' });
  }
});

// Get single order (protected)
router.get('/:id', auth, async (req, res) => {
  try {
    const order = await Order.findOne({
      _id: req.params.id,
      storeId: req.user.storeId
    });

    if (!order) {
      return res.status(404).json({ error: 'Order not found' });
    }
    res.json(order);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch order' });
  }
});

// Create order (public - for storefront checkout)
router.post('/', [
  body('storeId').notEmpty().withMessage('Store ID is required'),
  body('customer.name').trim().notEmpty().withMessage('Customer name is required'),
  body('customer.email').isEmail().withMessage('Valid email is required'),
  body('items').isArray({ min: 1 }).withMessage('At least one item is required'),
  body('shippingAddress').trim().notEmpty().withMessage('Shipping address is required')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { storeId, customer, items, shippingAddress } = req.body;

    // Calculate total
    const total = items.reduce((sum, item) => sum + (item.price * item.quantity), 0);

    const order = new Order({
      storeId,
      customer,
      items,
      total,
      shippingAddress,
      status: 'pending',
      paymentStatus: 'pending'
    });

    await order.save();

    // Update inventory for each product
    for (const item of items) {
      if (item.productId) {
        await Product.findByIdAndUpdate(item.productId, {
          $inc: { inventory: -item.quantity }
        });
      }
    }

    res.status(201).json(order);
  } catch (error) {
    console.error('Order creation error:', error);
    res.status(500).json({ error: 'Failed to create order' });
  }
});

// Update order status (protected)
router.put('/:id/status', auth, [
  body('status').isIn(['pending', 'processing', 'shipped', 'delivered', 'cancelled'])
    .withMessage('Invalid status')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const order = await Order.findOne({
      _id: req.params.id,
      storeId: req.user.storeId
    });

    if (!order) {
      return res.status(404).json({ error: 'Order not found' });
    }

    order.status = req.body.status;
    await order.save();

    res.json(order);
  } catch (error) {
    res.status(500).json({ error: 'Failed to update order' });
  }
});

// Update payment status (protected)
router.put('/:id/payment', auth, [
  body('paymentStatus').isIn(['pending', 'paid', 'refunded', 'failed'])
    .withMessage('Invalid payment status')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const order = await Order.findOne({
      _id: req.params.id,
      storeId: req.user.storeId
    });

    if (!order) {
      return res.status(404).json({ error: 'Order not found' });
    }

    order.paymentStatus = req.body.paymentStatus;
    await order.save();

    res.json(order);
  } catch (error) {
    res.status(500).json({ error: 'Failed to update payment status' });
  }
});

// Get dashboard stats (protected)
router.get('/stats/dashboard', auth, async (req, res) => {
  try {
    const storeId = req.user.storeId;

    const [orders, products] = await Promise.all([
      Order.find({ storeId }),
      Product.countDocuments({ storeId })
    ]);

    const totalSales = orders
      .filter(o => o.paymentStatus === 'paid')
      .reduce((sum, o) => sum + o.total, 0);
    
    const totalOrders = orders.length;
    const uniqueCustomers = new Set(orders.map(o => o.customer.email)).size;

    // Sales for last 7 days
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
    
    const recentOrders = orders.filter(o => new Date(o.createdAt) >= sevenDaysAgo);
    
    const salesByDay = {};
    for (let i = 0; i < 7; i++) {
      const date = new Date();
      date.setDate(date.getDate() - i);
      const dateStr = date.toISOString().split('T')[0];
      salesByDay[dateStr] = 0;
    }

    recentOrders.forEach(order => {
      if (order.paymentStatus === 'paid') {
        const dateStr = new Date(order.createdAt).toISOString().split('T')[0];
        if (salesByDay[dateStr] !== undefined) {
          salesByDay[dateStr] += order.total;
        }
      }
    });

    const recentSales = Object.entries(salesByDay)
      .map(([date, amount]) => ({ date, amount }))
      .sort((a, b) => new Date(a.date) - new Date(b.date));

    res.json({
      totalSales,
      totalOrders,
      totalProducts: products,
      totalCustomers: uniqueCustomers,
      recentSales
    });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch stats' });
  }
});

module.exports = router;
