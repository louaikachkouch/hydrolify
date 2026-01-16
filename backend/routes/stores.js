const express = require('express');
const { body, validationResult } = require('express-validator');
const Store = require('../models/Store');
const auth = require('../middleware/auth');

const router = express.Router();

// Get all active stores (public)
router.get('/', async (req, res) => {
  try {
    const stores = await Store.find({ isActive: true })
      .select('-ownerId')
      .sort({ createdAt: -1 });
    res.json(stores);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch stores' });
  }
});

// Get store by slug (public)
router.get('/slug/:slug', async (req, res) => {
  try {
    const store = await Store.findOne({ 
      slug: req.params.slug,
      isActive: true 
    }).select('-ownerId');
    
    if (!store) {
      return res.status(404).json({ error: 'Store not found' });
    }
    res.json(store);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch store' });
  }
});

// Get store by subdomain (public)
router.get('/subdomain/:subdomain', async (req, res) => {
  try {
    const store = await Store.findOne({ 
      subdomain: req.params.subdomain,
      isActive: true 
    }).select('-ownerId');
    
    if (!store) {
      return res.status(404).json({ error: 'Store not found' });
    }
    res.json(store);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch store' });
  }
});

// Get current user's store (protected)
router.get('/my-store', auth, async (req, res) => {
  try {
    const store = await Store.findById(req.user.storeId);
    if (!store) {
      return res.status(404).json({ error: 'Store not found' });
    }
    res.json(store);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch store' });
  }
});

// Update store settings (protected)
router.put('/my-store', auth, [
  body('storeName').optional().trim().notEmpty(),
  body('storeEmail').optional().isEmail(),
  body('subdomain').optional().matches(/^[a-z0-9]([a-z0-9-]*[a-z0-9])?$/)
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const store = await Store.findById(req.user.storeId);
    if (!store) {
      return res.status(404).json({ error: 'Store not found' });
    }

    const allowedUpdates = [
      'storeName', 'storeEmail', 'storePhone', 'storeAddress',
      'storeLogo', 'themeColor', 'currency', 'timezone', 'description'
    ];

    allowedUpdates.forEach(field => {
      if (req.body[field] !== undefined) {
        store[field] = req.body[field];
      }
    });

    await store.save();
    res.json(store);
  } catch (error) {
    res.status(500).json({ error: 'Failed to update store' });
  }
});

// Update subdomain (protected)
router.put('/my-store/subdomain', auth, [
  body('subdomain')
    .trim()
    .isLength({ min: 3, max: 30 })
    .matches(/^[a-z0-9]([a-z0-9-]*[a-z0-9])?$/)
    .withMessage('Invalid subdomain format')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { subdomain } = req.body;

    // Check if subdomain is taken
    const existing = await Store.findOne({ 
      subdomain,
      _id: { $ne: req.user.storeId }
    });
    
    if (existing) {
      return res.status(400).json({ error: 'Subdomain is already taken' });
    }

    // Reserved subdomains
    const reserved = ['www', 'app', 'api', 'admin', 'dashboard', 'store', 'stores', 'login', 'register', 'help', 'support'];
    if (reserved.includes(subdomain)) {
      return res.status(400).json({ error: 'This subdomain is reserved' });
    }

    const store = await Store.findById(req.user.storeId);
    store.subdomain = subdomain;
    store.slug = subdomain;
    await store.save();

    res.json({ success: true, subdomain: store.subdomain });
  } catch (error) {
    res.status(500).json({ error: 'Failed to update subdomain' });
  }
});

// Check subdomain availability (public)
router.get('/check-subdomain/:subdomain', async (req, res) => {
  try {
    const { subdomain } = req.params;
    const { excludeStoreId } = req.query;

    const query = { subdomain: subdomain.toLowerCase() };
    if (excludeStoreId) {
      query._id = { $ne: excludeStoreId };
    }

    const existing = await Store.findOne(query);
    
    const reserved = ['www', 'app', 'api', 'admin', 'dashboard', 'store', 'stores', 'login', 'register', 'help', 'support'];
    const isReserved = reserved.includes(subdomain.toLowerCase());

    res.json({ 
      available: !existing && !isReserved,
      isReserved
    });
  } catch (error) {
    res.status(500).json({ error: 'Failed to check subdomain' });
  }
});

module.exports = router;
