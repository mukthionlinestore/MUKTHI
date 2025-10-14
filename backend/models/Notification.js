const mongoose = require('mongoose');

const notificationSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true,
    maxlength: 200
  },
  message: {
    type: String,
    required: true,
    trim: true,
    maxlength: 500
  },
  type: {
    type: String,
    enum: ['product', 'announcement', 'system', 'promotion'],
    default: 'announcement'
  },
  priority: {
    type: String,
    enum: ['low', 'medium', 'high', 'urgent'],
    default: 'medium'
  },
  isActive: {
    type: Boolean,
    default: true
  },
  targetAudience: {
    type: String,
    enum: ['all', 'registered', 'premium'],
    default: 'all'
  },
  relatedProduct: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Product',
    required: false
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  readBy: [{
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    readAt: {
      type: Date,
      default: Date.now
    }
  }],
  expiresAt: {
    type: Date,
    required: false
  }
}, {
  timestamps: true
});

// Index for efficient queries
notificationSchema.index({ isActive: 1, createdAt: -1 });
notificationSchema.index({ targetAudience: 1, isActive: 1 });
notificationSchema.index({ type: 1, isActive: 1 });

// Virtual for read status
notificationSchema.virtual('isRead').get(function() {
  return this.readBy.length > 0;
});

// Static method to get notifications for user
notificationSchema.statics.getNotificationsForUser = async function(userId, userRole = 'user') {
  const query = {
    isActive: true,
    $or: [
      { targetAudience: 'all' },
      { targetAudience: 'registered' },
      ...(userRole === 'premium' ? [{ targetAudience: 'premium' }] : [])
    ]
  };

  // Add expiration filter
  query.$or.push({ expiresAt: { $exists: false } });
  query.$or.push({ expiresAt: { $gt: new Date() } });

  return await this.find(query)
    .populate('createdBy', 'name email')
    .populate('relatedProduct', 'name price images')
    .sort({ priority: -1, createdAt: -1 })
    .limit(50);
};

// Static method to mark notification as read
notificationSchema.statics.markAsRead = async function(notificationId, userId) {
  return await this.findByIdAndUpdate(
    notificationId,
    { 
      $addToSet: { 
        readBy: { 
          user: userId, 
          readAt: new Date() 
        } 
      } 
    },
    { new: true }
  );
};

// Static method to create product notification
notificationSchema.statics.createProductNotification = async function(product, createdBy) {
  const notification = new this({
    title: 'New Product Added!',
    message: `Check out our latest product: ${product.name}`,
    type: 'product',
    priority: 'medium',
    relatedProduct: product._id,
    createdBy: createdBy
  });

  return await notification.save();
};

module.exports = mongoose.model('Notification', notificationSchema);

