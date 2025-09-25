const mongoose = require('mongoose');

const settingsSchema = new mongoose.Schema({
  taxPercentage: {
    type: Number,
    default: 0,
    min: 0,
    max: 100
  },
  currency: {
    type: String,
    default: 'USD',
    enum: ['USD', 'EUR', 'GBP', 'JPY', 'INR', 'CAD', 'AUD', 'CHF']
  },
  currencySymbol: {
    type: String,
    default: '$'
  },
  freeShippingThreshold: {
    type: Number,
    default: 50,
    min: 0
  }
}, {
  timestamps: true
});

// Ensure only one settings document exists
settingsSchema.statics.getInstance = async function() {
  let settings = await this.findOne();
  if (!settings) {
    settings = await this.create({
      taxPercentage: 0,
      currency: 'USD',
      currencySymbol: '$',
      freeShippingThreshold: 50
    });
  }
  return settings;
};

module.exports = mongoose.model('Settings', settingsSchema);
