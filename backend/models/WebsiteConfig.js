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
  logoAlt: {
    type: String,
    default: 'Website Logo'
  },
  websiteFavicon: {
    type: String,
    default: ''
  },
  
  // Main Brand Colors (MUKHTI Burgundy + White Combination)
  primaryColor: {
    type: String,
    default: '#5D1A1D' // Deep burgundy/maroon from MUKHTI logo
  },
  secondaryColor: {
    type: String,
    default: '#D4AF37' // Elegant gold from lotus
  },
  accentColor: {
    type: String,
    default: '#FFFFFF' // Pure white accent
  },
  
  // Layout Colors (Burgundy + White combination)
  headerBackground: {
    type: String,
    default: '#5D1A1D' // Rich burgundy header like your logo
  },
  headerTextColor: {
    type: String,
    default: '#D4AF37' // Gold text on burgundy
  },
  footerBackground: {
    type: String,
    default: '#5D1A1D' // Matching burgundy footer
  },
  footerTextColor: {
    type: String,
    default: '#FFFFFF' // White text in footer
  },
  backgroundColor: {
    type: String,
    default: '#FFFFFF' // Pure white background for contrast
  },
  
  // Navigation Colors
  navLinkColor: {
    type: String,
    default: '#D4AF37' // Gold nav links on burgundy header
  },
  navLinkHoverColor: {
    type: String,
    default: '#FFFFFF' // White on hover
  },
  navActiveColor: {
    type: String,
    default: '#FFFFFF' // White for active
  },
  
  // UI Element Colors
  buttonPrimaryColor: {
    type: String,
    default: '#5D1A1D' // Burgundy primary buttons
  },
  buttonPrimaryHoverColor: {
    type: String,
    default: '#7A2428' // Lighter burgundy on hover
  },
  buttonSecondaryColor: {
    type: String,
    default: '#D4AF37' // Gold secondary buttons
  },
  buttonSecondaryHoverColor: {
    type: String,
    default: '#B8941F' // Darker gold on hover
  },
  buttonDangerColor: {
    type: String,
    default: '#B91C1C' // Red for danger
  },
  buttonSuccessColor: {
    type: String,
    default: '#059669' // Green for success
  },
  
  // Text Colors (Optimized for white background)
  textPrimaryColor: {
    type: String,
    default: '#1F2937' // Dark gray for primary text
  },
  textSecondaryColor: {
    type: String,
    default: '#6B7280' // Medium gray for secondary text
  },
  textMutedColor: {
    type: String,
    default: '#9CA3AF' // Light gray for muted text
  },
  linkColor: {
    type: String,
    default: '#5D1A1D' // Burgundy links
  },
  linkHoverColor: {
    type: String,
    default: '#D4AF37' // Gold on hover
  },
  
  // Border & Surface Colors (Clean white design)
  borderColor: {
    type: String,
    default: '#E5E7EB' // Light gray borders
  },
  cardBackground: {
    type: String,
    default: '#FFFFFF' // Pure white cards
  },
  cardBorderColor: {
    type: String,
    default: '#F3F4F6' // Very light gray card borders
  },
  inputBackground: {
    type: String,
    default: '#FFFFFF' // White inputs
  },
  inputBorderColor: {
    type: String,
    default: '#D1D5DB' // Light gray input borders
  },
  inputFocusBorderColor: {
    type: String,
    default: '#5D1A1D' // Burgundy focus
  },
  
  // Product Colors
  productCardBackground: {
    type: String,
    default: '#FFFFFF'
  },
  productCardBorderColor: {
    type: String,
    default: '#F3F4F6'
  },
  productPriceColor: {
    type: String,
    default: '#5D1A1D'
  },
  productSalePriceColor: {
    type: String,
    default: '#DC2626'
  },
  productBadgeColor: {
    type: String,
    default: '#D4AF37'
  },
  
  // Status Colors
  successColor: {
    type: String,
    default: '#10B981'
  },
  warningColor: {
    type: String,
    default: '#F59E0B'
  },
  errorColor: {
    type: String,
    default: '#EF4444'
  },
  infoColor: {
    type: String,
    default: '#3B82F6'
  },
  
  // Form Colors
  formLabelColor: {
    type: String,
    default: '#374151'
  },
  formPlaceholderColor: {
    type: String,
    default: '#9CA3AF'
  },
  formErrorColor: {
    type: String,
    default: '#EF4444'
  },
  formSuccessColor: {
    type: String,
    default: '#10B981'
  },
  
  // Modal & Overlay Colors
  modalBackgroundColor: {
    type: String,
    default: '#FFFFFF'
  },
  modalBorderColor: {
    type: String,
    default: '#E5E7EB'
  },
  overlayColor: {
    type: String,
    default: 'rgba(0, 0, 0, 0.5)'
  },
  
  // Advanced Colors
  hoverColor: {
    type: String,
    default: '#7A2428' // Lighter burgundy for hovers
  },
  shadowColor: {
    type: String,
    default: 'rgba(0, 0, 0, 0.1)' // Subtle black shadow
  },
  gradientStart: {
    type: String,
    default: '#5D1A1D' // Burgundy gradient start
  },
  gradientEnd: {
    type: String,
    default: '#D4AF37' // Gold gradient end
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
  
    // Background Theme Selection
    backgroundTheme: {
      type: String,
      enum: ['type1', 'type2', 'type3', 'type4', 'type5', 'type6', 'type7'],
      default: 'type1'
    },
    // Optional background image for theme type7
    backgroundImageUrl: {
      type: String,
      default: ''
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
    // Multiple payment methods can be enabled simultaneously
    paymentGatewayEnabled: {
      type: Boolean,
      default: true
    },
    whatsappEnabled: {
      type: Boolean,
      default: false
    },
    instagramEnabled: {
      type: Boolean,
      default: false
    },
    // Contact information for social payment methods
    whatsappNumber: {
      type: String,
      default: ''
    },
    instagramUsername: {
      type: String,
      default: ''
    },
    // Individual gateway settings
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
    },
    // Legacy field for backward compatibility (deprecated)
    paymentMethod: {
      type: String,
      enum: ['gateway', 'whatsapp', 'instagram'],
      default: 'gateway'
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
    // Ensure paymentSettings is properly initialized
    if (!config.paymentSettings) {
      config.paymentSettings = {
        paymentGatewayEnabled: true,
        whatsappEnabled: false,
        instagramEnabled: false,
        whatsappNumber: '',
        instagramUsername: '',
        stripeEnabled: true,
        razorpayEnabled: true,
        paypalEnabled: true,
        codEnabled: true,
        paymentMethod: 'gateway' // Legacy field
      };
    }
    await config.save();
  }
  return config;
};

module.exports = mongoose.model('WebsiteConfig', websiteConfigSchema);


