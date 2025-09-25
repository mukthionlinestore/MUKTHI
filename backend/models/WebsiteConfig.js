const mongoose = require('mongoose');

const websiteConfigSchema = new mongoose.Schema({
  // Basic Website Information
  websiteName: {
    type: String,
    default: 'E-Shop',
    required: true
  },
  websiteDescription: {
    type: String,
    default: 'Your trusted online shopping destination'
  },
  websiteLogo: {
    type: String,
    default: ''
  },
  websiteFavicon: {
    type: String,
    default: ''
  },
  
  // Theme Configuration
  primaryColor: {
    type: String,
    default: '#10B981' // emerald-500
  },
  secondaryColor: {
    type: String,
    default: '#059669' // emerald-600
  },
  accentColor: {
    type: String,
    default: '#0D9488' // teal-600
  },
  backgroundColor: {
    type: String,
    default: '#F0FDF4' // emerald-50
  },
  
  // Header Configuration
  headerBackground: {
    type: String,
    default: '#FFFFFF'
  },
  headerTextColor: {
    type: String,
    default: '#1F2937'
  },
  
  // Footer Configuration
  footerBackground: {
    type: String,
    default: '#1F2937'
  },
  footerTextColor: {
    type: String,
    default: '#F9FAFB'
  },
  
  // Contact Information
  contactEmail: {
    type: String,
    default: 'contact@eshop.com'
  },
  contactPhone: {
    type: String,
    default: '+1 (555) 123-4567'
  },
  contactAddress: {
    type: String,
    default: '123 Business Street, City, State 12345'
  },
  
  // Social Media Links
  socialMedia: {
    facebook: {
      type: String,
      default: ''
    },
    twitter: {
      type: String,
      default: ''
    },
    instagram: {
      type: String,
      default: ''
    },
    linkedin: {
      type: String,
      default: ''
    },
    youtube: {
      type: String,
      default: ''
    }
  },
  
  // SEO Configuration
  metaTitle: {
    type: String,
    default: 'E-Shop - Your Online Shopping Destination'
  },
  metaDescription: {
    type: String,
    default: 'Shop the latest trends and best deals at E-Shop. Fast shipping, secure payments, and excellent customer service.'
  },
  metaKeywords: {
    type: String,
    default: 'online shopping, ecommerce, deals, fashion, electronics'
  },
  
  // Business Settings
  businessHours: {
    type: String,
    default: 'Mon-Fri: 9AM-6PM, Sat: 10AM-4PM, Sun: Closed'
  },
  timezone: {
    type: String,
    default: 'UTC'
  },
  currency: {
    type: String,
    default: 'USD'
  },
  currencySymbol: {
    type: String,
    default: '$'
  },
  
  // Feature Toggles
  features: {
    wishlist: {
      type: Boolean,
      default: true
    },
    reviews: {
      type: Boolean,
      default: true
    },
    newsletter: {
      type: Boolean,
      default: true
    },
    guestCheckout: {
      type: Boolean,
      default: true
    },
    socialLogin: {
      type: Boolean,
      default: true
    },
    multiLanguage: {
      type: Boolean,
      default: false
    },
    darkMode: {
      type: Boolean,
      default: false
    }
  },
  
  // Maintenance Mode
  maintenanceMode: {
    type: Boolean,
    default: false
  },
  maintenanceMessage: {
    type: String,
    default: 'We are currently performing maintenance. Please check back later.'
  },
  
  // Analytics
  googleAnalyticsId: {
    type: String,
    default: ''
  },
  facebookPixelId: {
    type: String,
    default: ''
  },
  
  // Email Configuration
  emailSettings: {
    fromEmail: {
      type: String,
      default: 'noreply@eshop.com'
    },
    fromName: {
      type: String,
      default: 'E-Shop'
    },
    supportEmail: {
      type: String,
      default: 'support@eshop.com'
    }
  },
  
  // Payment Configuration
  paymentSettings: {
    stripeEnabled: {
      type: Boolean,
      default: true
    },
    razorpayEnabled: {
      type: Boolean,
      default: true
    },
    paypalEnabled: {
      type: Boolean,
      default: true
    },
    codEnabled: {
      type: Boolean,
      default: true
    }
  },
  
  // Shipping Configuration
  shippingSettings: {
    freeShippingThreshold: {
      type: Number,
      default: 50
    },
    defaultShippingCost: {
      type: Number,
      default: 10
    },
    expressShippingCost: {
      type: Number,
      default: 25
    }
  }
}, {
  timestamps: true
});

// Static method to get or create website configuration
websiteConfigSchema.statics.getInstance = async function() {
  let config = await this.findOne();
  if (!config) {
    config = new this();
    await config.save();
  }
  return config;
};

module.exports = mongoose.model('WebsiteConfig', websiteConfigSchema);

