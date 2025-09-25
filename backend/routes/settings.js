const express = require('express');
const router = express.Router();
const Settings = require('../models/Settings');
const { adminAuth } = require('../middleware/auth');

// GET /api/settings - Public route to get settings
router.get('/', async (req, res) => {
  try {
    const settings = await Settings.getInstance();
    res.json({
      taxPercentage: settings.taxPercentage,
      currency: settings.currency,
      currencySymbol: settings.currencySymbol,
      freeShippingThreshold: settings.freeShippingThreshold
    });
  } catch (error) {
    console.error('Error fetching settings:', error);
    res.status(500).json({ message: 'Failed to fetch settings' });
  }
});

// GET /api/admin/settings - Admin route to get settings
router.get('/admin', adminAuth, async (req, res) => {
  try {
    const settings = await Settings.getInstance();
    res.json({
      taxPercentage: settings.taxPercentage,
      currency: settings.currency,
      currencySymbol: settings.currencySymbol,
      freeShippingThreshold: settings.freeShippingThreshold
    });
  } catch (error) {
    console.error('Error fetching admin settings:', error);
    res.status(500).json({ message: 'Failed to fetch settings' });
  }
});

// PUT /api/admin/settings - Admin route to update settings
router.put('/admin', adminAuth, async (req, res) => {
  try {
    const { taxPercentage, currency, currencySymbol, freeShippingThreshold } = req.body;

    // Validate input
    if (taxPercentage < 0 || taxPercentage > 100) {
      return res.status(400).json({ message: 'Tax percentage must be between 0 and 100' });
    }

    if (!currency || !currencySymbol) {
      return res.status(400).json({ message: 'Currency and currency symbol are required' });
    }

    if (freeShippingThreshold < 0) {
      return res.status(400).json({ message: 'Free shipping threshold must be 0 or greater' });
    }

    // Get or create settings
    let settings = await Settings.getInstance();
    
    // Update settings
    settings.taxPercentage = taxPercentage;
    settings.currency = currency;
    settings.currencySymbol = currencySymbol;
    settings.freeShippingThreshold = freeShippingThreshold;
    
    await settings.save();

    res.json({
      taxPercentage: settings.taxPercentage,
      currency: settings.currency,
      currencySymbol: settings.currencySymbol,
      freeShippingThreshold: settings.freeShippingThreshold
    });
  } catch (error) {
    console.error('Error updating settings:', error);
    res.status(500).json({ message: 'Failed to update settings' });
  }
});

module.exports = router;
