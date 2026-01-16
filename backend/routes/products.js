const express = require('express');
const { body, validationResult } = require('express-validator');
const Product = require('../models/Product');
const auth = require('../middleware/auth');

const router = express.Router();

// Get products by store ID (public)
router.get('/store/:storeId', async (req, res) => {
  try {
    const products = await Product.find({ storeId: req.params.storeId })
      .sort({ createdAt: -1 });
    res.json(products);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch products' });
  }
});

// Get active products by store ID (public - for storefront)
router.get('/store/:storeId/active', async (req, res) => {
  try {
    const products = await Product.find({ 
      storeId: req.params.storeId,
      status: 'active'
    }).sort({ createdAt: -1 });
    res.json(products);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch products' });
  }
});

// Get all products for current user's store (protected)
router.get('/my-products', auth, async (req, res) => {
  try {
    const products = await Product.find({ storeId: req.user.storeId })
      .sort({ createdAt: -1 });
    res.json(products);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch products' });
  }
});

// Get single product
router.get('/:id', async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) {
      return res.status(404).json({ error: 'Product not found' });
    }
    res.json(product);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch product' });
  }
});

// Create product (protected)
router.post('/', auth, [
  body('name').trim().notEmpty().withMessage('Product name is required'),
  body('price').isFloat({ min: 0 }).withMessage('Valid price is required')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const product = new Product({
      storeId: req.user.storeId,
      name: req.body.name,
      description: req.body.description,
      price: req.body.price,
      compareAtPrice: req.body.compareAtPrice || null,
      inventory: req.body.inventory || 0,
      category: req.body.category || 'Other',
      status: req.body.status || 'draft',
      image: req.body.image || null
    });

    await product.save();
    res.status(201).json(product);
  } catch (error) {
    res.status(500).json({ error: 'Failed to create product' });
  }
});

// Update product (protected)
router.put('/:id', auth, async (req, res) => {
  try {
    const product = await Product.findOne({
      _id: req.params.id,
      storeId: req.user.storeId
    });

    if (!product) {
      return res.status(404).json({ error: 'Product not found' });
    }

    const allowedUpdates = [
      'name', 'description', 'price', 'compareAtPrice',
      'inventory', 'category', 'status', 'image'
    ];

    allowedUpdates.forEach(field => {
      if (req.body[field] !== undefined) {
        product[field] = req.body[field];
      }
    });

    await product.save();
    res.json(product);
  } catch (error) {
    res.status(500).json({ error: 'Failed to update product' });
  }
});

// Delete product (protected)
router.delete('/:id', auth, async (req, res) => {
  try {
    const product = await Product.findOneAndDelete({
      _id: req.params.id,
      storeId: req.user.storeId
    });

    if (!product) {
      return res.status(404).json({ error: 'Product not found' });
    }

    res.json({ success: true, message: 'Product deleted' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete product' });
  }
});

module.exports = router;
