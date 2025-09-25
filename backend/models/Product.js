const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    required: true
  },
  price: {
    type: Number,
    required: true,
    min: 0
  },
  originalPrice: {
    type: Number,
    min: 0
  },
  category: {
    type: String,
    required: true,
    trim: true
  },
  subcategory: {
    type: String,
    trim: true
  },
  brand: {
    type: String,
    trim: true
  },
  sku: {
    type: String,
    unique: true,
    sparse: true,
    default: function() {
      return 'SKU-' + Date.now() + '-' + Math.random().toString(36).substr(2, 9).toUpperCase();
    }
  },
  images: [{
    type: String,
    required: true
  }],
  thumbnailIndex: {
    type: Number,
    default: 0
  },
  colors: [{
    name: String,
    code: String,
    available: {
      type: Boolean,
      default: true
    }
  }],
  sizes: [{
    name: String,
    available: {
      type: Boolean,
      default: true
    }
  }],
  variants: [{
    color: String,
    size: String,
    quantity: {
      type: Number,
      default: 0,
      min: 0
    },
    price: Number
  }],
  quantity: {
    type: Number,
    default: 0,
    min: 0
  },
  isNewProduct: {
    type: Boolean,
    default: false
  },
  isFeatured: {
    type: Boolean,
    default: false
  },
  isSold: {
    type: Boolean,
    default: false
  },
  isActive: {
    type: Boolean,
    default: true
  },
  rating: {
    type: Number,
    default: 0,
    min: 0,
    max: 5
  },
  numReviews: {
    type: Number,
    default: 0
  },
  reviews: [{
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    rating: {
      type: Number,
      required: true,
      min: 1,
      max: 5
    },
    comment: String,
    date: {
      type: Date,
      default: Date.now
    }
  }],
  tags: [String],
  features: [String],
  specifications: {
    type: Map,
    of: String
  },
  shippingWeight: Number,
  shippingCharge: {
    type: Number,
    default: 0,
    min: 0
  },
  dimensions: {
    length: Number,
    width: Number,
    height: Number
  }
}, {
  timestamps: true
});

// Enhanced indexes for better performance
productSchema.index({ name: 'text', description: 'text', category: 'text', brand: 'text', tags: 'text' });
productSchema.index({ isActive: 1, category: 1 });
productSchema.index({ isActive: 1, brand: 1 });
productSchema.index({ isActive: 1, price: 1 });
productSchema.index({ isActive: 1, rating: -1 });
productSchema.index({ isActive: 1, createdAt: -1 });
productSchema.index({ isActive: 1, name: 1 });
productSchema.index({ isActive: 1, quantity: 1 });

module.exports = mongoose.model('Product', productSchema);
