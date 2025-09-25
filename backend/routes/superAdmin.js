const express = require('express');
const { superAdminAuth } = require('../middleware/superAdminAuth');
const WebsiteConfig = require('../models/WebsiteConfig');
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

// Get website configuration
router.get('/config', superAdminAuth, async (req, res) => {
  try {
    const config = await WebsiteConfig.getInstance();
    res.json(config);
  } catch (error) {
    console.error('Get config error:', error);
    res.status(500).json({ message: 'Failed to get configuration' });
  }
});

// Update website configuration
router.put('/config', superAdminAuth, async (req, res) => {
  try {
    const config = await WebsiteConfig.getInstance();

    // Update configuration
    Object.keys(req.body).forEach(key => {
      if (config.schema.paths[key]) {
        config[key] = req.body[key];
      }
    });

    await config.save();
    res.json({ message: 'Configuration updated successfully', config });
  } catch (error) {
    console.error('Update config error:', error);
    res.status(500).json({ message: 'Failed to update configuration' });
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

module.exports = router;
