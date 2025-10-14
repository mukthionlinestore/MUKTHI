const mongoose = require('mongoose');

const sectionSchema = new mongoose.Schema({
  id: {
    type: String,
    required: true
  },
  name: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: true
  },
  icon: {
    type: String,
    required: true
  },
  isVisible: {
    type: Boolean,
    default: true
  },
  order: {
    type: Number,
    required: true
  }
});

const homePageSettingsSchema = new mongoose.Schema({
  sections: [sectionSchema],
  lastUpdated: {
    type: Date,
    default: Date.now
  },
  updatedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }
}, {
  timestamps: true
});

// Ensure only one settings document exists
homePageSettingsSchema.statics.getSettings = async function() {
  let settings = await this.findOne();
  if (!settings) {
    // Create default settings
    settings = new this({
      sections: [
        {
          id: 'carousel',
          name: 'Hero Carousel',
          description: 'Main carousel with featured images and content',
          icon: 'FaImage',
          isVisible: true,
          order: 1
        },
        {
          id: 'newArrivals',
          name: 'New Arrivals',
          description: 'Display latest products added to the store',
          icon: 'FaStar',
          isVisible: true,
          order: 2
        },
        {
          id: 'featuredProducts',
          name: 'Featured Products',
          description: 'Showcase selected featured products',
          icon: 'FaShoppingBag',
          isVisible: true,
          order: 3
        },
        {
          id: 'banner',
          name: 'Promotional Banner',
          description: 'Special offers and promotional content banner',
          icon: 'FaGift',
          isVisible: true,
          order: 4
        },
        {
          id: 'features',
          name: 'Feature Boxes',
          description: 'Highlight key store features and benefits',
          icon: 'FaCheckCircle',
          isVisible: true,
          order: 5
        },
        {
          id: 'stats',
          name: 'Statistics',
          description: 'Display store statistics and achievements',
          icon: 'FaUsers',
          isVisible: true,
          order: 6
        },
        {
          id: 'testimonials',
          name: 'Customer Testimonials',
          description: 'Customer reviews and feedback',
          icon: 'FaQuoteLeft',
          isVisible: true,
          order: 7
        },
        {
          id: 'help',
          name: 'Help Section',
          description: 'Customer support and help information',
          icon: 'FaInfoCircle',
          isVisible: true,
          order: 8
        },
        {
          id: 'finalCTA',
          name: 'Final Call to Action',
          description: 'Bottom section with final conversion elements',
          icon: 'FaTruck',
          isVisible: true,
          order: 9
        }
      ]
    });
    await settings.save();
  }
  return settings;
};

homePageSettingsSchema.statics.updateSettings = async function(sectionsData, userId) {
  let settings = await this.findOne();
  if (!settings) {
    settings = await this.getSettings();
  }
  
  settings.sections = sectionsData;
  settings.lastUpdated = new Date();
  settings.updatedBy = userId;
  
  return await settings.save();
};

module.exports = mongoose.model('HomePageSettings', homePageSettingsSchema);

