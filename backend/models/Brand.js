const mongoose = require('mongoose');

const brandSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true,
    trim: true
  },
  slug: {
    type: String,
    unique: true,
    sparse: true // Allow multiple null values
  },
  description: {
    type: String,
    trim: true
  },
  website: {
    type: String,
    trim: true
  },
  logo: {
    type: String,
    trim: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

// Generate slug from name before saving
brandSchema.pre('save', function(next) {
  if (this.name && !this.slug) {
    this.slug = this.name.toLowerCase()
      .replace(/[^a-z0-9 -]/g, '') // Remove special characters
      .replace(/\s+/g, '-') // Replace spaces with dashes
      .replace(/-+/g, '-') // Replace multiple dashes with single
      .trim('-'); // Remove leading/trailing dashes
  }
  next();
});

// Create a text index for search
brandSchema.index({ name: 'text', description: 'text' });

module.exports = mongoose.model('Brand', brandSchema);
