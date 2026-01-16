const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { body, validationResult } = require('express-validator');
const User = require('../models/User');
const Store = require('../models/Store');
const auth = require('../middleware/auth');

const router = express.Router();

// Generate JWT token
const generateToken = (userId) => {
  return jwt.sign({ userId }, process.env.JWT_SECRET, { expiresIn: '7d' });
};

// Register new user with store
router.post('/register', [
  body('name').trim().notEmpty().withMessage('Name is required'),
  body('email').isEmail().withMessage('Valid email is required'),
  body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters'),
  body('storeName').trim().notEmpty().withMessage('Store name is required')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { name, email, password, storeName } = req.body;

    // Check if user exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ error: 'Email already registered' });
    }

    // Generate slug from store name
    let slug = storeName.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');
    
    // Check if slug exists and make it unique
    let slugExists = await Store.findOne({ slug });
    let counter = 1;
    const originalSlug = slug;
    while (slugExists) {
      slug = `${originalSlug}-${counter}`;
      slugExists = await Store.findOne({ slug });
      counter++;
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create user first
    const user = new User({
      name,
      email,
      password: hashedPassword
    });

    // Create store
    const store = new Store({
      slug,
      subdomain: slug,
      ownerId: user._id,
      storeName,
      storeEmail: email,
      description: 'Welcome to my store!',
      isActive: true
    });

    await store.save();
    
    // Update user with store reference
    user.storeId = store._id;
    await user.save();

    const token = generateToken(user._id);

    res.status(201).json({
      success: true,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        storeId: store._id,
        storeSlug: store.slug,
        storeName: store.storeName
      },
      token
    });
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({ error: 'Registration failed' });
  }
});

// Login
router.post('/login', [
  body('email').isEmail().withMessage('Valid email is required'),
  body('password').notEmpty().withMessage('Password is required')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { email, password } = req.body;

    // Find user
    const user = await User.findOne({ email }).populate('storeId');
    if (!user) {
      return res.status(401).json({ error: 'Invalid email or password' });
    }

    // Check password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ error: 'Invalid email or password' });
    }

    const token = generateToken(user._id);

    res.json({
      success: true,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        storeId: user.storeId?._id,
        storeSlug: user.storeId?.slug,
        storeName: user.storeId?.storeName
      },
      token
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ error: 'Login failed' });
  }
});

// Get current user
router.get('/me', auth, async (req, res) => {
  try {
    const store = await Store.findById(req.user.storeId);
    res.json({
      user: {
        id: req.user._id,
        name: req.user.name,
        email: req.user.email,
        storeId: store?._id,
        storeSlug: store?.slug,
        storeName: store?.storeName
      }
    });
  } catch (error) {
    res.status(500).json({ error: 'Failed to get user' });
  }
});

module.exports = router;
