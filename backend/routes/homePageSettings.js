const express = require('express');
const router = express.Router();
const HomePageSettings = require('../models/HomePageSettings');
const { auth } = require('../middleware/auth');

// Get home page settings
router.get('/', async (req, res) => {
  try {
    const settings = await HomePageSettings.getSettings();
    res.json(settings);
  } catch (error) {
    console.error('Get home page settings error:', error);
    res.status(500).json({ message: 'Failed to get home page settings' });
  }
});

// Update home page settings
router.put('/', auth, async (req, res) => {
  try {
    const userId = req.user.id;
    const { heroSection, sections, finalCTA } = req.body;
    
    console.log('Received data:', { heroSection, sections, finalCTA });
    
    let settings = await HomePageSettings.findOne();
    if (!settings) {
      settings = await HomePageSettings.getSettings();
    }
    
    // Update hero section if provided
    if (heroSection) {
      console.log('Updating heroSection:', heroSection);
      settings.heroSection = {
        ...settings.heroSection,
        ...heroSection
      };
    }
    
    // Update final CTA if provided
    if (finalCTA) {
      console.log('Updating finalCTA:', finalCTA);
      settings.finalCTA = {
        ...settings.finalCTA,
        ...finalCTA
      };
    }
    
    // Update sections if provided
    if (sections) {
      console.log('Updating sections:', sections);
      settings.sections = sections;
    }
    
    settings.lastUpdated = new Date();
    settings.updatedBy = userId;
    
    console.log('Saving settings:', settings);
    await settings.save();
    
    res.json({
      success: true,
      message: 'Home page settings updated successfully',
      settings
    });
  } catch (error) {
    console.error('Update home page settings error:', error);
    res.status(500).json({ 
      success: false,
      message: 'Failed to update home page settings' 
    });
  }
});

// Update only hero section (carousel text)
router.put('/hero', auth, async (req, res) => {
  try {
    const userId = req.user.id;
    const { heroSection } = req.body;
    
    let settings = await HomePageSettings.findOne();
    if (!settings) {
      settings = await HomePageSettings.getSettings();
    }
    
    settings.heroSection = {
      ...settings.heroSection,
      ...heroSection
    };
    
    settings.lastUpdated = new Date();
    settings.updatedBy = userId;
    
    await settings.save();
    
    res.json({
      success: true,
      message: 'Hero section updated successfully',
      heroSection: settings.heroSection
    });
  } catch (error) {
    console.error('Update hero section error:', error);
    res.status(500).json({ 
      success: false,
      message: 'Failed to update hero section' 
    });
  }
});

module.exports = router;
