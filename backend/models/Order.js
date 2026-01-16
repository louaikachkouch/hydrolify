const mongoose = require('mongoose');

const orderItemSchema = new mongoose.Schema({
  productId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Product'
  },
  name: {
    type: String,
    required: true
  },
  quantity: {
    type: Number,
    required: true,
    min: 1
  },
  price: {
    type: Number,
    required: true,
    min: 0
  }
}, { _id: false });

const customerSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true,
    lowercase: true
  }
}, { _id: false });

const orderSchema = new mongoose.Schema({
  orderId: {
    type: String,
    required: true,
    unique: true
  },
  storeId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Store',
    required: true
  },
  customer: {
    type: customerSchema,
    required: true
  },
  items: {
    type: [orderItemSchema],
    required: true
  },
  total: {
    type: Number,
    required: true,
    min: 0
  },
  status: {
    type: String,
    enum: ['pending', 'processing', 'shipped', 'delivered', 'cancelled'],
    default: 'pending'
  },
  paymentStatus: {
    type: String,
    enum: ['pending', 'paid', 'refunded', 'failed'],
    default: 'pending'
  },
  shippingAddress: {
    type: String,
    trim: true
  }
}, {
  timestamps: true
});

// Index for faster lookups
orderSchema.index({ storeId: 1 });
orderSchema.index({ storeId: 1, status: 1 });
orderSchema.index({ orderId: 1 });

// Auto-generate order ID before saving
orderSchema.pre('save', async function(next) {
  if (!this.orderId) {
    const count = await this.constructor.countDocuments({ storeId: this.storeId });
    this.orderId = `ORD-${Date.now().toString(36).toUpperCase()}-${(count + 1).toString().padStart(4, '0')}`;
  }
  next();
});

module.exports = mongoose.model('Order', orderSchema);
