const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  storeId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Store',
    required: true
  },
  name: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    trim: true
  },
  price: {
    type: Number,
    required: true,
    min: 0
  },
  compareAtPrice: {
    type: Number,
    default: null
  },
  inventory: {
    type: Number,
    default: 0,
    min: 0
  },
  category: {
    type: String,
    trim: true,
    default: 'Other'
  },
  status: {
    type: String,
    enum: ['active', 'draft', 'archived'],
    default: 'draft'
  },
  image: {
    type: String,
    default: null
  }
}, {
  timestamps: true
});

// Index for faster lookups
productSchema.index({ storeId: 1 });
productSchema.index({ storeId: 1, status: 1 });
productSchema.index({ category: 1 });

module.exports = mongoose.model('Product', productSchema);
