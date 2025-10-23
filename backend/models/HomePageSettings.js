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
  heroSection: {
    screen1: {
      title: {
        type: String,
        default: 'Welcome to MUKHTI'
      },
      subtitle: {
        type: String,
        default: 'Your Premium Shopping Destination'
      },
      description: {
        type: String,
        default: 'Discover amazing products and exclusive deals'
      }
    },
    screen2: {
      title: {
        type: String,
        default: 'Quality Products'
      },
      subtitle: {
        type: String,
        default: 'Handpicked for You'
      },
      description: {
        type: String,
        default: 'Curated selection of premium quality items'
      }
    },
    screen3: {
      title: {
        type: String,
        default: 'Fast Delivery'
      },
      subtitle: {
        type: String,
        default: 'Quick & Reliable'
      },
      description: {
        type: String,
        default: 'Get your orders delivered fast and safely'
      }
    },
    screen4: {
      title: {
        type: String,
        default: 'Premium Quality'
      },
      subtitle: {
        type: String,
        default: 'Free Shipping Worldwide'
      },
      description: {
        type: String,
        default: 'Experience luxury shopping with our curated selection of high-end products'
      }
    },
    screen5: {
      title: {
        type: String,
        default: 'Start Shopping'
      },
      subtitle: {
        type: String,
        default: 'Explore Our Collection'
      },
      description: {
        type: String,
        default: 'Browse through thousands of premium products and find your perfect match'
      }
    }
  },
  finalCTA: {
    badge: {
      type: String,
      default: 'Ready to Shop?'
    },
    title: {
      type: String,
      default: 'Start Your Shopping Journey'
    },
    subtitle: {
      type: String,
      default: 'Discover amazing products and enjoy a seamless shopping experience with us.'
    },
    buttonText: {
      type: String,
      default: 'Start Shopping Now'
    },
    buttonLink: {
      type: String,
      default: '/products'
    },
    stats: {
      customers: {
        number: {
          type: String,
          default: '10K+'
        },
        label: {
          type: String,
          default: 'Happy Customers'
        }
      },
      products: {
        number: {
          type: String,
          default: '500+'
        },
        label: {
          type: String,
          default: 'Products'
        }
      },
      countries: {
        number: {
          type: String,
          default: '50+'
        },
        label: {
          type: String,
          default: 'Countries'
        }
      },
      satisfaction: {
        number: {
          type: String,
          default: '99%'
        },
        label: {
          type: String,
          default: 'Satisfaction'
        }
      }
    }
  },
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
      heroSection: {
        screen1: {
          title: 'Welcome to MUKHTI',
          subtitle: 'Your Premium Shopping Destination',
          description: 'Discover amazing products and exclusive deals'
        },
        screen2: {
          title: 'Quality Products',
          subtitle: 'Handpicked for You',
          description: 'Curated selection of premium quality items'
        },
        screen3: {
          title: 'Fast Delivery',
          subtitle: 'Quick & Reliable',
          description: 'Get your orders delivered fast and safely'
        },
        screen4: {
          title: 'Premium Quality',
          subtitle: 'Free Shipping Worldwide',
          description: 'Experience luxury shopping with our curated selection of high-end products'
        },
        screen5: {
          title: 'Start Shopping',
          subtitle: 'Explore Our Collection',
          description: 'Browse through thousands of premium products and find your perfect match'
        }
      },
      finalCTA: {
        badge: 'Ready to Shop?',
        title: 'Start Your Shopping Journey',
        subtitle: 'Discover amazing products and enjoy a seamless shopping experience with us.',
        buttonText: 'Start Shopping Now',
        buttonLink: '/products',
        stats: {
          customers: {
            number: '10K+',
            label: 'Happy Customers'
          },
          products: {
            number: '500+',
            label: 'Products'
          },
          countries: {
            number: '50+',
            label: 'Countries'
          },
          satisfaction: {
            number: '99%',
            label: 'Satisfaction'
          }
        }
      },
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

