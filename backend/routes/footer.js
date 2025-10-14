const express = require('express');
const router = express.Router();
const Footer = require('../models/Footer');
const { adminAuth } = require('../middleware/auth');

// GET /api/footer - Public route to get footer data
router.get('/', async (req, res) => {
  try {
    const footer = await Footer.getInstance();
    res.json(footer);
  } catch (error) {
    console.error('Error fetching footer:', error);
    res.status(500).json({ message: 'Failed to fetch footer data' });
  }
});

// GET /api/footer/admin - Admin route to get footer data
router.get('/admin', adminAuth, async (req, res) => {
  try {
    const footer = await Footer.getInstance();
    res.json(footer);
  } catch (error) {
    console.error('Error fetching admin footer:', error);
    res.status(500).json({ message: 'Failed to fetch footer data' });
  }
});

// PUT /api/footer/admin - Admin route to update footer data
router.put('/admin', adminAuth, async (req, res) => {
  try {
    const {
      companyName,
      companyDescription,
      address,
      contact,
      socialMedia,
      businessHours,
      copyrightText,
      quickLinks,
      isActive
    } = req.body;

    // Validate required fields
    if (!companyName || !companyDescription) {
      return res.status(400).json({ message: 'Company name and description are required' });
    }

    // Validate email format
    if (contact?.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(contact.email)) {
      return res.status(400).json({ message: 'Invalid email format' });
    }

    if (contact?.supportEmail && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(contact.supportEmail)) {
      return res.status(400).json({ message: 'Invalid support email format' });
    }

    // Get or create footer
    let footer = await Footer.getInstance();
    
    // Update footer data
    footer.companyName = companyName;
    footer.companyDescription = companyDescription;
    footer.address = address || footer.address;
    footer.contact = contact || footer.contact;
    footer.socialMedia = socialMedia || footer.socialMedia;
    footer.businessHours = businessHours || footer.businessHours;
    footer.copyrightText = copyrightText || footer.copyrightText;
    footer.quickLinks = quickLinks || footer.quickLinks;
    footer.isActive = isActive !== undefined ? isActive : footer.isActive;
    
    await footer.save();

    res.json(footer);
  } catch (error) {
    console.error('Error updating footer:', error);
    res.status(500).json({ message: 'Failed to update footer data' });
  }
});

module.exports = router;









