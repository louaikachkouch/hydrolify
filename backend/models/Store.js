const mongoose = require('mongoose');

const storeSchema = new mongoose.Schema({
  slug: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true
  },
  subdomain: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true
  },
  ownerId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  storeName: {
    type: String,
    required: true,
    trim: true
  },
  storeEmail: {
    type: String,
    trim: true,
    lowercase: true
  },
  storePhone: {
    type: String,
    trim: true
  },
  storeAddress: {
    type: String,
    trim: true
  },
  storeLogo: {
    type: String,
    default: null
  },
  themeColor: {
    type: String,
    default: '#2563eb'
  },
  currency: {
    type: String,
    default: 'TND'
  },
  timezone: {
    type: String,
    default: 'Africa/Tunis'
  },
  description: {
    type: String,
    trim: true
  },
  isActive: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true
});

// Index for faster lookups
storeSchema.index({ slug: 1 });
storeSchema.index({ subdomain: 1 });
storeSchema.index({ ownerId: 1 });

module.exports = mongoose.model('Store', storeSchema);
