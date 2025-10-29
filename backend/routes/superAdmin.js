const express = require('express');
const { superAdminAuth } = require('../middleware/superAdminAuth');
const WebsiteConfig = require('../models/WebsiteConfig');
const HomePageSettings = require('../models/HomePageSettings');
const User = require('../models/User');
const Product = require('../models/Product');
const Order = require('../models/Order');
const router = express.Router();

// Super Admin Authentication
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    // Find super admin user
    const user = await User.findOne({
      email: email.toLowerCase(),
      role: 'superadmin'
    });

    if (!user) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    // Check password
    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    // Generate JWT token
    const jwt = require('jsonwebtoken');
    const token = jwt.sign(
      { userId: user._id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );

    res.json({
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role
      }
    });
  } catch (error) {
    console.error('Super admin login error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get website configuration (Super Admin only)
router.get('/config', superAdminAuth, async (req, res) => {
  try {
    const config = await WebsiteConfig.getInstance();
    res.json(config);
  } catch (error) {
    console.error('Get config error:', error);
    res.status(500).json({ message: 'Failed to get configuration' });
  }
});

// Get public website configuration (No auth required)
router.get('/public-config', async (req, res) => {
  try {
    const config = await WebsiteConfig.getInstance();
    // Only return public-safe configuration
    const publicConfig = {
      websiteName: config.websiteName,
      websiteDescription: config.websiteDescription,
      websiteLogo: config.websiteLogo,
      logoAlt: config.logoAlt,
      contactEmail: config.contactEmail,
      contactPhone: config.contactPhone,
      contactAddress: config.contactAddress,
      businessHours: config.businessHours,
      primaryColor: config.primaryColor,
      secondaryColor: config.secondaryColor,
      accentColor: config.accentColor,
      tertiaryColor: config.tertiaryColor,
      quaternaryColor: config.quaternaryColor,
      headerBackground: config.headerBackground,
      headerTextColor: config.headerTextColor,
      footerBackground: config.footerBackground,
      footerTextColor: config.footerTextColor,
      backgroundColor: config.backgroundColor,
      navLinkColor: config.navLinkColor,
      navLinkHoverColor: config.navLinkHoverColor,
      navActiveColor: config.navActiveColor,
      buttonPrimaryColor: config.buttonPrimaryColor,
      buttonPrimaryHoverColor: config.buttonPrimaryHoverColor,
      buttonSecondaryColor: config.buttonSecondaryColor,
      buttonSecondaryHoverColor: config.buttonSecondaryHoverColor,
      textPrimaryColor: config.textPrimaryColor,
      textSecondaryColor: config.textSecondaryColor,
      textMutedColor: config.textMutedColor,
      borderColor: config.borderColor,
      shadowColor: config.shadowColor,
      successColor: config.successColor,
      warningColor: config.warningColor,
      errorColor: config.errorColor,
      infoColor: config.infoColor,
          // Include payment settings for checkout page
          paymentSettings: {
            paymentGatewayEnabled: config.paymentSettings?.paymentGatewayEnabled || false,
            whatsappEnabled: config.paymentSettings?.whatsappEnabled || false,
            instagramEnabled: config.paymentSettings?.instagramEnabled || false,
            whatsappNumber: config.paymentSettings?.whatsappNumber || '',
            instagramUsername: config.paymentSettings?.instagramUsername || ''
          },
          // Include background theme for dynamic styling
    backgroundTheme: config.backgroundTheme || 'type1',
    backgroundImageUrl: config.backgroundImageUrl || ''
    };
    res.json(publicConfig);
  } catch (error) {
    console.error('Get public config error:', error);
    res.status(500).json({ message: 'Failed to get public configuration' });
  }
});

// Update website configuration
router.put('/config', superAdminAuth, async (req, res) => {
  try {
    console.log('Received config update:', req.body);
    console.log('Payment settings received:', req.body.paymentSettings);
    
    const config = await WebsiteConfig.getInstance();
    console.log('Current config before update:', {
      paymentSettings: config.paymentSettings,
      _id: config._id
    });

    // Update configuration - handle both simple fields and nested objects
    Object.keys(req.body).forEach(key => {
      if (key === 'paymentSettings' && typeof req.body[key] === 'object') {
        // Handle paymentSettings as a nested object
        if (!config.paymentSettings) {
          config.paymentSettings = {};
        }
        Object.keys(req.body.paymentSettings).forEach(subKey => {
          config.paymentSettings[subKey] = req.body.paymentSettings[subKey];
        });
        console.log('Updated paymentSettings:', config.paymentSettings);
      } else if (config.schema.paths[key]) {
        // Handle simple field updates
        config[key] = req.body[key];
      }
    });

    // Mark the paymentSettings field as modified to ensure it gets saved
    if (req.body.paymentSettings) {
      config.markModified('paymentSettings');
    }

    console.log('Config after update:', config.paymentSettings);
    console.log('About to save config...');
    
    await config.save();
    console.log('Config saved successfully');
    res.json({ message: 'Configuration updated successfully', config });
  } catch (error) {
    console.error('Update config error:', error);
    console.error('Error details:', error.message);
    console.error('Error stack:', error.stack);
    res.status(500).json({ 
      message: 'Failed to update configuration', 
      error: error.message 
    });
  }
});

// Update logo
router.put('/logo', superAdminAuth, async (req, res) => {
  try {
    const { logoUrl, logoAlt } = req.body;
    
    if (!logoUrl) {
      return res.status(400).json({ message: 'Logo URL is required' });
    }

    const config = await WebsiteConfig.getInstance();
    config.websiteLogo = logoUrl;
    config.logoAlt = logoAlt || 'Website Logo';
    
    await config.save();
    
    res.json({ 
      message: 'Logo updated successfully', 
      config: {
        websiteLogo: config.websiteLogo,
        logoAlt: config.logoAlt
      }
    });
  } catch (error) {
    console.error('Logo update error:', error);
    res.status(500).json({ message: 'Failed to update logo' });
  }
});

// Get dashboard statistics
router.get('/dashboard', superAdminAuth, async (req, res) => {
  try {
    const [
      totalUsers,
      totalAdmins,
      totalProducts,
      totalOrders,
      recentOrders,
      lowStockProducts
    ] = await Promise.all([
      User.countDocuments({ role: 'user' }),
      User.countDocuments({ role: 'admin' }),
      Product.countDocuments(),
      Order.countDocuments(),
      Order.find()
        .populate('user', 'name email')
        .populate('items.product', 'name')
        .sort({ createdAt: -1 })
        .limit(5),
      Product.find({ quantity: { $lte: 10 } }).limit(5)
    ]);

    const totalRevenue = await Order.aggregate([
      { $match: { isPaid: true } },
      { $group: { _id: null, total: { $sum: '$totalAmount' } } }
    ]);

    res.json({
      stats: {
        totalUsers,
        totalAdmins,
        totalProducts,
        totalOrders,
        totalRevenue: totalRevenue[0]?.total || 0
      },
      recentOrders,
      lowStockProducts
    });
  } catch (error) {
    console.error('Dashboard error:', error);
    res.status(500).json({ message: 'Failed to get dashboard data' });
  }
});

// Manage users
router.get('/users', superAdminAuth, async (req, res) => {
  try {
    const { page = 1, limit = 10, role, search } = req.query;
    const query = {};

    if (role && role !== 'all') {
      query.role = role;
    }

    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } }
      ];
    }

    const users = await User.find(query)
      .select('-password')
      .sort({ createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);

    const total = await User.countDocuments(query);

    res.json({
      users,
      totalPages: Math.ceil(total / limit),
      currentPage: page,
      total
    });
  } catch (error) {
    console.error('Get users error:', error);
    res.status(500).json({ message: 'Failed to get users' });
  }
});

// Update user role
router.put('/users/:id/role', superAdminAuth, async (req, res) => {
  try {
    const { role } = req.body;
    const { id } = req.params;

    if (!['user', 'admin', 'superadmin'].includes(role)) {
      return res.status(400).json({ message: 'Invalid role' });
    }

    const user = await User.findByIdAndUpdate(
      id,
      { role },
      { new: true }
    ).select('-password');

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.json({ message: 'User role updated successfully', user });
  } catch (error) {
    console.error('Update user role error:', error);
    res.status(500).json({ message: 'Failed to update user role' });
  }
});

// Delete user
router.delete('/users/:id', superAdminAuth, async (req, res) => {
  try {
    const { id } = req.params;

    // Prevent deleting super admin
    const user = await User.findById(id);
    if (user && user.role === 'superadmin') {
      return res.status(400).json({ message: 'Cannot delete super admin' });
    }

    await User.findByIdAndDelete(id);
    res.json({ message: 'User deleted successfully' });
  } catch (error) {
    console.error('Delete user error:', error);
    res.status(500).json({ message: 'Failed to delete user' });
  }
});

// Create admin user
router.post('/users/admin', superAdminAuth, async (req, res) => {
  try {
    const { name, email, password } = req.body;

    // Check if user already exists
    const existingUser = await User.findOne({ email: email.toLowerCase() });
    if (existingUser) {
      return res.status(400).json({ message: 'User already exists' });
    }

    // Create admin user
    const adminUser = new User({
      name,
      email: email.toLowerCase(),
      password,
      role: 'admin'
    });

    await adminUser.save();

    res.status(201).json({
      message: 'Admin user created successfully',
      user: {
        id: adminUser._id,
        name: adminUser.name,
        email: adminUser.email,
        role: adminUser.role
      }
    });
  } catch (error) {
    console.error('Create admin error:', error);
    res.status(500).json({ message: 'Failed to create admin user' });
  }
});

// Get system logs (placeholder)
router.get('/logs', superAdminAuth, async (req, res) => {
  try {
    // This would typically connect to a logging system
    // For now, return recent activities
    const recentActivities = await Order.find()
      .populate('user', 'name email')
      .sort({ createdAt: -1 })
      .limit(20)
      .select('status totalAmount createdAt user');

    res.json({ activities: recentActivities });
  } catch (error) {
    console.error('Get logs error:', error);
    res.status(500).json({ message: 'Failed to get system logs' });
  }
});

// Backup system (placeholder)
router.post('/backup', superAdminAuth, async (req, res) => {
  try {
    // This would typically trigger a database backup
    res.json({ message: 'Backup initiated successfully' });
  } catch (error) {
    console.error('Backup error:', error);
    res.status(500).json({ message: 'Failed to initiate backup' });
  }
});

// Homepage Settings Management Routes

// Get homepage settings
router.get('/homepage-settings', superAdminAuth, async (req, res) => {
  try {
    const settings = await HomePageSettings.getSettings();
    res.json({
      success: true,
      settings: settings
    });
  } catch (error) {
    console.error('Error fetching homepage settings:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch homepage settings'
    });
  }
});

// Update homepage settings
router.put('/homepage-settings', superAdminAuth, async (req, res) => {
  try {
    const { sections } = req.body;
    
    if (!sections || !Array.isArray(sections)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid sections data'
      });
    }

    // Validate sections structure
    for (const section of sections) {
      if (!section.id || !section.name || typeof section.isVisible !== 'boolean' || typeof section.order !== 'number') {
        return res.status(400).json({
          success: false,
          message: 'Invalid section structure'
        });
      }
    }

    const updatedSettings = await HomePageSettings.updateSettings(sections, req.user.id);
    
    res.json({
      success: true,
      message: 'Homepage settings updated successfully',
      settings: updatedSettings
    });
  } catch (error) {
    console.error('Error updating homepage settings:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update homepage settings'
    });
  }
});

// Get public homepage settings (for frontend)
router.get('/public/homepage-settings', async (req, res) => {
  try {
    const settings = await HomePageSettings.getSettings();
    
    // Return only necessary data for frontend
    const publicSettings = {
      sections: settings.sections.map(section => ({
        id: section.id,
        isVisible: section.isVisible,
        order: section.order
      })).sort((a, b) => a.order - b.order)
    };
    
    res.json({
      success: true,
      settings: publicSettings
    });
  } catch (error) {
    console.error('Error fetching public homepage settings:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch homepage settings'
    });
  }
});

module.exports = router;


