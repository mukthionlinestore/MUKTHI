const express = require('express');
const router = express.Router();
const Notification = require('../models/Notification');
const { auth, adminAuth } = require('../middleware/auth');

// Get notifications for current user
router.get('/', auth, async (req, res) => {
  try {
    console.log('User notifications request:', { userId: req.user.id, role: req.user.role });
    
    const notifications = await Notification.getNotificationsForUser(
      req.user.id, 
      req.user.role
    );
    
    console.log('Found notifications for user:', notifications.length);
    
    res.json({
      success: true,
      notifications
    });
  } catch (error) {
    console.error('Error fetching notifications:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch notifications'
    });
  }
});

// Get unread notification count
router.get('/unread-count', auth, async (req, res) => {
  try {
    const notifications = await Notification.getNotificationsForUser(
      req.user.id, 
      req.user.role
    );
    
    const unreadCount = notifications.filter(notification => 
      !notification.readBy.some(read => read.user.toString() === req.user.id)
    ).length;
    
    console.log('Unread count for user:', { userId: req.user.id, unreadCount, totalNotifications: notifications.length });
    
    res.json({
      success: true,
      unreadCount
    });
  } catch (error) {
    console.error('Error fetching unread count:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch unread count'
    });
  }
});

// Mark notification as read
router.post('/:id/read', auth, async (req, res) => {
  try {
    console.log('Mark as read request:', { notificationId: req.params.id, userId: req.user.id });
    
    const notification = await Notification.markAsRead(req.params.id, req.user.id);
    
    if (!notification) {
      return res.status(404).json({
        success: false,
        message: 'Notification not found'
      });
    }
    
    console.log('Notification marked as read successfully');
    
    res.json({
      success: true,
      message: 'Notification marked as read'
    });
  } catch (error) {
    console.error('Error marking notification as read:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to mark notification as read'
    });
  }
});

// Mark all notifications as read
router.post('/mark-all-read', auth, async (req, res) => {
  try {
    const notifications = await Notification.getNotificationsForUser(
      req.user.id, 
      req.user.role
    );
    
    const notificationIds = notifications.map(n => n._id);
    
    await Notification.updateMany(
      { _id: { $in: notificationIds } },
      { 
        $addToSet: { 
          readBy: { 
            user: req.user.id, 
            readAt: new Date() 
          } 
        } 
      }
    );
    
    res.json({
      success: true,
      message: 'All notifications marked as read'
    });
  } catch (error) {
    console.error('Error marking all notifications as read:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to mark all notifications as read'
    });
  }
});

// Admin routes
// Get all notifications (admin)
router.get('/admin/all', adminAuth, async (req, res) => {
  try {
    const { page = 1, limit = 20, type, priority, isActive } = req.query;
    
    console.log('Admin notifications request:', { 
      userId: req.user.id, 
      userRole: req.user.role, 
      userEmail: req.user.email,
      queryParams: { page, limit, type, priority, isActive }
    });
    
    const query = {};
    if (type) query.type = type;
    if (priority) query.priority = priority;
    if (isActive === 'true') {
      query.isActive = true;
    } else if (isActive === 'false') {
      query.isActive = false;
    }
    // If isActive is undefined or an empty string, no isActive filter is applied,
    // effectively showing all notifications regardless of their status.
    
    console.log('Final query:', query);
    
    // First, let's check if there are ANY notifications in the database
    const totalInDB = await Notification.countDocuments({});
    console.log('Total notifications in database:', totalInDB);
    
    // Let's also see what notifications actually exist
    const allNotifications = await Notification.find({}).limit(5);
    console.log('Sample notifications in database:', allNotifications.map(n => ({
      id: n._id,
      title: n.title,
      type: n.type,
      priority: n.priority,
      isActive: n.isActive,
      targetAudience: n.targetAudience,
      createdAt: n.createdAt
    })));
    
    const notifications = await Notification.find(query)
      .populate('createdBy', 'name email')
      .populate('relatedProduct', 'name price images')
      .sort({ createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);
    
    const total = await Notification.countDocuments(query);
    
    console.log('Query results:', {
      query,
      foundNotifications: notifications.length,
      totalForQuery: total,
      totalInDatabase: totalInDB,
      page,
      limit
    });
    
    res.json({
      success: true,
      notifications,
      totalPages: Math.ceil(total / limit),
      currentPage: page,
      total
    });
  } catch (error) {
    console.error('Error fetching admin notifications:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch notifications'
    });
  }
});

// Create new notification (admin)
router.post('/admin/create', adminAuth, async (req, res) => {
  try {
    const {
      title,
      message,
      type = 'announcement',
      priority = 'medium',
      targetAudience = 'all',
      expiresAt
    } = req.body;
    
    if (!title || !message) {
      return res.status(400).json({
        success: false,
        message: 'Title and message are required'
      });
    }
    
    const notification = new Notification({
      title,
      message,
      type,
      priority,
      targetAudience,
      expiresAt: expiresAt ? new Date(expiresAt) : null,
      createdBy: req.user.id
    });
    
    await notification.save();
    
    res.status(201).json({
      success: true,
      message: 'Notification created successfully',
      notification
    });
  } catch (error) {
    console.error('Error creating notification:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to create notification'
    });
  }
});

// Update notification (admin)
router.put('/admin/:id', adminAuth, async (req, res) => {
  try {
    const {
      title,
      message,
      type,
      priority,
      targetAudience,
      isActive,
      expiresAt
    } = req.body;
    
    const updateData = {};
    if (title) updateData.title = title;
    if (message) updateData.message = message;
    if (type) updateData.type = type;
    if (priority) updateData.priority = priority;
    if (targetAudience) updateData.targetAudience = targetAudience;
    if (isActive !== undefined) updateData.isActive = isActive;
    if (expiresAt !== undefined) updateData.expiresAt = expiresAt ? new Date(expiresAt) : null;
    
    const notification = await Notification.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true }
    ).populate('createdBy', 'name email')
     .populate('relatedProduct', 'name price images');
    
    if (!notification) {
      return res.status(404).json({
        success: false,
        message: 'Notification not found'
      });
    }
    
    res.json({
      success: true,
      message: 'Notification updated successfully',
      notification
    });
  } catch (error) {
    console.error('Error updating notification:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update notification'
    });
  }
});

// Delete notification (admin)
router.delete('/admin/:id', adminAuth, async (req, res) => {
  try {
    const notification = await Notification.findByIdAndDelete(req.params.id);
    
    if (!notification) {
      return res.status(404).json({
        success: false,
        message: 'Notification not found'
      });
    }
    
    res.json({
      success: true,
      message: 'Notification deleted successfully'
    });
  } catch (error) {
    console.error('Error deleting notification:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to delete notification'
    });
  }
});

// Toggle notification status (admin)
router.patch('/admin/:id/toggle', adminAuth, async (req, res) => {
  try {
    const notification = await Notification.findById(req.params.id);
    
    if (!notification) {
      return res.status(404).json({
        success: false,
        message: 'Notification not found'
      });
    }
    
    notification.isActive = !notification.isActive;
    await notification.save();
    
    res.json({
      success: true,
      message: `Notification ${notification.isActive ? 'activated' : 'deactivated'} successfully`,
      notification
    });
  } catch (error) {
    console.error('Error toggling notification:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to toggle notification'
    });
  }
});

module.exports = router;
