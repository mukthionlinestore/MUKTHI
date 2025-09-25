const mongoose = require('mongoose');

const footerSchema = new mongoose.Schema({
  companyName: {
    type: String,
    default: 'E-Shop',
    trim: true
  },
  companyDescription: {
    type: String,
    default: 'Your trusted online shopping destination',
    trim: true
  },
  address: {
    street: {
      type: String,
      default: '123 Main Street'
    },
    city: {
      type: String,
      default: 'New York'
    },
    state: {
      type: String,
      default: 'NY'
    },
    zipCode: {
      type: String,
      default: '10001'
    },
    country: {
      type: String,
      default: 'United States'
    }
  },
  contact: {
    phone: {
      type: String,
      default: '+1 (555) 123-4567'
    },
    email: {
      type: String,
      default: 'info@eshop.com'
    },
    supportEmail: {
      type: String,
      default: 'support@eshop.com'
    }
  },
  socialMedia: {
    facebook: {
      type: String,
      default: 'https://facebook.com/eshop'
    },
    twitter: {
      type: String,
      default: 'https://twitter.com/eshop'
    },
    instagram: {
      type: String,
      default: 'https://instagram.com/eshop'
    },
    linkedin: {
      type: String,
      default: 'https://linkedin.com/company/eshop'
    }
  },
  businessHours: {
    type: String,
    default: 'Monday - Friday: 9:00 AM - 6:00 PM'
  },
  copyrightText: {
    type: String,
    default: '© 2024 E-Shop. All rights reserved.'
  },
  quickLinks: [{
    title: {
      type: String,
      required: true
    },
    url: {
      type: String,
      required: true
    }
  }],
  isActive: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true
});

// Ensure only one footer document exists
footerSchema.statics.getInstance = async function() {
  let footer = await this.findOne();
  if (!footer) {
    footer = await this.create({
      companyName: 'E-Shop',
      companyDescription: 'Your trusted online shopping destination',
      address: {
        street: '123 Main Street',
        city: 'New York',
        state: 'NY',
        zipCode: '10001',
        country: 'United States'
      },
      contact: {
        phone: '+1 (555) 123-4567',
        email: 'info@eshop.com',
        supportEmail: 'support@eshop.com'
      },
      socialMedia: {
        facebook: 'https://facebook.com/eshop',
        twitter: 'https://twitter.com/eshop',
        instagram: 'https://instagram.com/eshop',
        linkedin: 'https://linkedin.com/company/eshop'
      },
      businessHours: 'Monday - Friday: 9:00 AM - 6:00 PM',
      copyrightText: '© 2024 E-Shop. All rights reserved.',
      quickLinks: [
        { title: 'About Us', url: '/about' },
        { title: 'Contact', url: '/contact' },
        { title: 'Privacy Policy', url: '/privacy' },
        { title: 'Terms of Service', url: '/terms' }
      ]
    });
  }
  return footer;
};

module.exports = mongoose.model('Footer', footerSchema);

