


const express = require('express');
const Order = require('../models/Order');
const Cart = require('../models/Cart');
const Product = require('../models/Product');
const Settings = require('../models/Settings');
const { auth } = require('../middleware/auth');

const router = express.Router();

// Create new order
router.post('/', auth, async (req, res) => {
  try {
    console.log('Order creation request received:', {
      userId: req.user._id,
      body: req.body
    });

    const { shippingAddress, paymentMethod, paymentDetails, billingAddress, items } = req.body;

    // Get cart items for the user if items not provided in request
    let orderItems = [];
    let subtotal = 0;

    if (items && items.length > 0) {
      console.log('Using items from request body:', items.length, 'items');
      // Use items from request body (for direct checkout)
      for (const item of items) {
        console.log('Processing item:', item);
        const product = await Product.findById(item.product);
        if (!product) {
          console.log('Product not found:', item.product);
          return res.status(404).json({ message: `Product ${item.product} not found` });
        }

        if (product.quantity < item.quantity) {
          console.log('Insufficient stock:', product.name, 'requested:', item.quantity, 'available:', product.quantity);
          return res.status(400).json({ 
            message: `Insufficient stock for ${product.name}. Only ${product.quantity} items available.` 
          });
        }

        const itemTotal = item.price * item.quantity;
        subtotal += itemTotal;

        orderItems.push({
          product: item.product,
          quantity: item.quantity,
          selectedColor: item.selectedColor,
          selectedSize: item.selectedSize,
          price: item.price
        });
      }
    } else {
      console.log('Getting items from cart for user:', req.user._id);
      // Get cart items for the user
      const cart = await Cart.findOne({ user: req.user._id }).populate('items.product');
      
      if (!cart || cart.items.length === 0) {
        console.log('Cart is empty for user:', req.user._id);
        return res.status(400).json({ message: 'Cart is empty' });
      }

      console.log('Cart items found:', cart.items.length);

      for (const item of cart.items) {
        console.log('Processing cart item:', item);
        const product = await Product.findById(item.product._id);
        if (!product) {
          console.log('Product not found in cart item:', item.product._id);
          return res.status(404).json({ message: `Product ${item.product.name} not found` });
        }

        if (product.quantity < item.quantity) {
          console.log('Insufficient stock in cart:', product.name, 'requested:', item.quantity, 'available:', product.quantity);
          return res.status(400).json({ 
            message: `Insufficient stock for ${product.name}. Only ${product.quantity} items available.` 
          });
        }

        const itemTotal = item.price * item.quantity;
        subtotal += itemTotal;

        orderItems.push({
          product: item.product._id,
          quantity: item.quantity,
          selectedColor: item.selectedColor,
          selectedSize: item.selectedSize,
          price: item.price
        });
      }
    }

    console.log('Order items processed:', orderItems.length, 'items, subtotal:', subtotal);

    // Validate required fields
    if (!shippingAddress || !shippingAddress.fullName || !shippingAddress.street || 
        !shippingAddress.city || !shippingAddress.state || !shippingAddress.zipCode) {
      console.log('Invalid shipping address:', shippingAddress);
      return res.status(400).json({ message: 'Complete shipping address is required' });
    }

    if (!paymentMethod) {
      console.log('Payment method missing');
      return res.status(400).json({ message: 'Payment method is required' });
    }

    // Get settings for tax calculation
    const settings = await Settings.getInstance();
    
    const shippingCost = subtotal > 1000 ? 0 : 50; // Free shipping over $1000
    const tax = (subtotal * settings.taxPercentage) / 100; // Use settings tax percentage
    const total = subtotal + shippingCost + tax;

    console.log('Calculated totals:', { subtotal, shippingCost, tax, total });

    // Create order
    const orderData = {
      user: req.user._id,
      items: orderItems,
      shippingAddress: {
        fullName: shippingAddress.fullName,
        email: shippingAddress.email,
        phone: shippingAddress.phone,
        street: shippingAddress.street,
        city: shippingAddress.city,
        state: shippingAddress.state,
        zipCode: shippingAddress.zipCode,
        country: shippingAddress.country || 'United States'
      },
      paymentMethod,
      paymentResult: paymentDetails ? {
        id: 'payment_' + Date.now(),
        status: 'completed',
        update_time: new Date().toISOString(),
        email_address: shippingAddress.email
      } : null,
      subtotal,
      tax,
      shippingCost,
      total,
      isPaid: ['Cash on Delivery', 'WhatsApp', 'Instagram'].includes(paymentMethod) ? false : true,
      paidAt: ['Cash on Delivery', 'WhatsApp', 'Instagram'].includes(paymentMethod) ? null : new Date(),
      status: 'Pending'
    };

    console.log('Creating order with data:', orderData);

    const order = new Order(orderData);

    console.log('Order object created, saving...');
    await order.save();
    console.log('Order saved successfully, ID:', order._id);

    // Update product quantities
    console.log('Updating product quantities...');
    for (const item of orderItems) {
      const product = await Product.findById(item.product);
      if (product) {
        product.quantity -= item.quantity;
        await product.save();
        console.log('Updated product:', product.name, 'new quantity:', product.quantity);
      }
    }

    // Clear cart after successful order (only if we used cart items, not direct buy)
    if (!items || items.length === 0) {
      console.log('Clearing cart after successful order...');
      const cart = await Cart.findOne({ user: req.user._id });
      if (cart) {
        cart.items = [];
        await cart.save();
        console.log('Cart cleared successfully');
      }
    }

    // Populate order with product details before sending response
    console.log('Populating order with product details...');
    const populatedOrder = await Order.findById(order._id)
      .populate('items.product', 'name images brand category')
      .populate('user', 'name email');

    console.log('Order creation completed successfully');
    res.status(201).json(populatedOrder);
  } catch (error) {
    console.error('Error creating order:', error);
    console.error('Error stack:', error.stack);
    res.status(500).json({ message: 'Failed to create order. Please try again.' });
  }
});

// Get user orders
router.get('/', auth, async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;
    
    // Build filter query
    const filterQuery = { user: req.user._id };
    
    // Add status filter
    if (req.query.status && req.query.status.trim() !== '') {
      filterQuery.status = req.query.status;
    }
    
    // Add date range filters
    if (req.query.dateFrom && req.query.dateFrom.trim() !== '') {
      filterQuery.createdAt = { $gte: new Date(req.query.dateFrom) };
    }
    
    if (req.query.dateTo && req.query.dateTo.trim() !== '') {
      if (filterQuery.createdAt) {
        filterQuery.createdAt.$lte = new Date(req.query.dateTo + 'T23:59:59.999Z');
      } else {
        filterQuery.createdAt = { $lte: new Date(req.query.dateTo + 'T23:59:59.999Z') };
      }
    }

    const orders = await Order.find(filterQuery)
      .populate('items.product', 'name images brand category')
      .populate('user', 'name email')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    const total = await Order.countDocuments(filterQuery);

    res.json({
      orders,
      currentPage: page,
      totalPages: Math.ceil(total / limit),
      totalOrders: total
    });
  } catch (error) {
    console.error('Error fetching orders:', error);
    res.status(500).json({ message: 'Failed to fetch orders' });
  }
});

// Get single order
router.get('/:id', auth, async (req, res) => {
  try {
    const order = await Order.findById(req.params.id)
      .populate('items.product', 'name images brand category price')
      .populate('user', 'name email');

    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    // Check if user owns this order or is admin
    if (order.user._id.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Not authorized to view this order' });
    }

    res.json(order);
  } catch (error) {
    console.error('Error fetching order:', error);
    if (error.name === 'CastError') {
      return res.status(400).json({ message: 'Invalid order ID' });
    }
    res.status(500).json({ message: 'Failed to fetch order details' });
  }
});

// Update order status (Admin only)
router.put('/:id/status', auth, async (req, res) => {
  try {
    const { status, trackingNumber } = req.body;

    if (req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Admin access required' });
    }

    const validStatuses = ['Pending', 'Processing', 'Shipped', 'Delivered', 'Cancelled', 'Returned'];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({ message: 'Invalid status' });
    }

    const order = await Order.findById(req.params.id);
    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    order.status = status;
    if (trackingNumber) order.trackingNumber = trackingNumber;
    if (status === 'Delivered') {
      order.isDelivered = true;
      order.deliveredAt = new Date();
    }

    await order.save();

    const updatedOrder = await Order.findById(order._id)
      .populate('items.product', 'name images brand category')
      .populate('user', 'name email');

    res.json(updatedOrder);
  } catch (error) {
    console.error('Error updating order status:', error);
    res.status(500).json({ message: 'Failed to update order status' });
  }
});

// Request return
router.post('/:id/return', auth, async (req, res) => {
  try {
    const { returnReason } = req.body;

    if (!returnReason || returnReason.trim().length === 0) {
      return res.status(400).json({ message: 'Return reason is required' });
    }

    const order = await Order.findById(req.params.id);
    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    if (order.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    if (order.status !== 'Delivered') {
      return res.status(400).json({ message: 'Order must be delivered to request return' });
    }

    // Check if return window is still open (e.g., 30 days)
    const daysSinceDelivery = Math.floor((new Date() - new Date(order.deliveredAt)) / (1000 * 60 * 60 * 24));
    if (daysSinceDelivery > 30) {
      return res.status(400).json({ message: 'Return window has expired (30 days)' });
    }

    order.returnStatus = 'Requested';
    order.returnReason = returnReason;
    await order.save();

    res.json(order);
  } catch (error) {
    console.error('Error requesting return:', error);
    res.status(500).json({ message: 'Failed to request return' });
  }
});

// Cancel order
router.post('/:id/cancel', auth, async (req, res) => {
  try {
    const { cancellationReason } = req.body;
    
    const order = await Order.findById(req.params.id);
    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    if (order.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    if (!['Pending', 'Processing'].includes(order.status)) {
      return res.status(400).json({ message: 'Order cannot be cancelled at this stage' });
    }

    // Update order with cancellation details
    order.status = 'Cancelled';
    order.cancelledBy = 'User';
    order.cancelledAt = new Date();
    order.cancellationReason = cancellationReason || 'No reason provided';
    
    await order.save();

    // Restore product quantities
    for (const item of order.items) {
      const product = await Product.findById(item.product);
      if (product) {
        product.quantity += item.quantity;
        await product.save();
      }
    }

    const cancelledOrder = await Order.findById(order._id)
      .populate('items.product', 'name images brand category')
      .populate('user', 'name email');

    res.json(cancelledOrder);
  } catch (error) {
    console.error('Error cancelling order:', error);
    res.status(500).json({ message: 'Failed to cancel order' });
  }
});

// Admin: Get all orders
router.get('/admin/all', auth, async (req, res) => {
  try {
    if (req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Admin access required' });
    }

    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 20;
    const skip = (page - 1) * limit;
    const status = req.query.status;
    const search = req.query.search;

    // Build query
    let query = {};
    if (status && status !== 'all') {
      query.status = status;
    }
    if (search) {
      query.$or = [
        { orderNumber: { $regex: search, $options: 'i' } },
        { 'shippingAddress.fullName': { $regex: search, $options: 'i' } },
        { 'shippingAddress.email': { $regex: search, $options: 'i' } }
      ];
    }

    const orders = await Order.find(query)
      .populate('items.product', 'name images brand category')
      .populate('user', 'name email')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    const total = await Order.countDocuments(query);

    res.json({
      orders,
      currentPage: page,
      totalPages: Math.ceil(total / limit),
      totalOrders: total
    });
  } catch (error) {
    console.error('Error fetching admin orders:', error);
    res.status(500).json({ message: 'Failed to fetch orders' });
  }
});

// Admin: Get dashboard stats
router.get('/admin/stats', auth, async (req, res) => {
  try {
    if (req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Admin access required' });
    }

    const totalOrders = await Order.countDocuments();
    const totalRevenue = await Order.aggregate([
      { $match: { status: { $ne: 'Cancelled' } } },
      { $group: { _id: null, total: { $sum: '$total' } } }
    ]);

    const pendingOrders = await Order.countDocuments({ status: 'Pending' });
    const processingOrders = await Order.countDocuments({ status: 'Processing' });
    const shippedOrders = await Order.countDocuments({ status: 'Shipped' });
    const deliveredOrders = await Order.countDocuments({ status: 'Delivered' });

    // Today's stats
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    const todayOrders = await Order.countDocuments({
      createdAt: { $gte: today, $lt: tomorrow }
    });

    const todayRevenue = await Order.aggregate([
      { 
        $match: { 
          createdAt: { $gte: today, $lt: tomorrow },
          status: { $ne: 'Cancelled' }
        } 
      },
      { $group: { _id: null, total: { $sum: '$total' } } }
    ]);

    res.json({
      totalOrders,
      totalRevenue: totalRevenue[0]?.total || 0,
      pendingOrders,
      processingOrders,
      shippedOrders,
      deliveredOrders,
      todayOrders,
      todayRevenue: todayRevenue[0]?.total || 0
    });
  } catch (error) {
    console.error('Error fetching admin stats:', error);
    res.status(500).json({ message: 'Failed to fetch statistics' });
  }
});

// Admin: Get recent orders for dashboard
router.get('/admin/recent', auth, async (req, res) => {
  try {
    if (req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Admin access required' });
    }

    const recentOrders = await Order.find()
      .populate('items.product', 'name images brand')
      .populate('user', 'name email')
      .sort({ createdAt: -1 })
      .limit(10);

    res.json(recentOrders);
  } catch (error) {
    console.error('Error fetching recent orders:', error);
    res.status(500).json({ message: 'Failed to fetch recent orders' });
  }
});

// Update payment status
router.put('/:id/payment', auth, async (req, res) => {
  try {
    const { isPaid, paymentResult } = req.body;
    
    const order = await Order.findById(req.params.id);
    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    // Check if user owns this order or is admin
    if (order.user.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Not authorized' });
    }

    order.isPaid = isPaid;
    if (isPaid) {
      order.paidAt = new Date();
      if (paymentResult) {
        order.paymentResult = paymentResult;
      }
      // Auto-update status to Processing if payment is successful
      if (order.status === 'Pending') {
        order.status = 'Processing';
      }
    }

    await order.save();

    const updatedOrder = await Order.findById(order._id)
      .populate('items.product', 'name images brand category')
      .populate('user', 'name email');

    res.json(updatedOrder);
  } catch (error) {
    console.error('Error updating payment status:', error);
    res.status(500).json({ message: 'Failed to update payment status' });
  }
});

// Get order statistics for a specific user
router.get('/user/stats', auth, async (req, res) => {
  try {
    const userId = req.user._id;

    const totalOrders = await Order.countDocuments({ user: userId });
    const totalSpent = await Order.aggregate([
      { $match: { user: userId, status: { $ne: 'Cancelled' } } },
      { $group: { _id: null, total: { $sum: '$total' } } }
    ]);

    const ordersByStatus = await Order.aggregate([
      { $match: { user: userId } },
      { $group: { _id: '$status', count: { $sum: 1 } } }
    ]);

    res.json({
      totalOrders,
      totalSpent: totalSpent[0]?.total || 0,
      ordersByStatus
    });
  } catch (error) {
    console.error('Error fetching user order stats:', error);
    res.status(500).json({ message: 'Failed to fetch order statistics' });
  }
});

// Admin: Add notes to cancelled order
router.put('/:id/admin-notes', auth, async (req, res) => {
  try {
    if (req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Admin access required' });
    }

    const { adminNotes } = req.body;
    
    const order = await Order.findById(req.params.id);
    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    if (order.status !== 'Cancelled') {
      return res.status(400).json({ message: 'Can only add notes to cancelled orders' });
    }

    order.adminNotes = adminNotes;
    await order.save();

    const updatedOrder = await Order.findById(order._id)
      .populate('items.product', 'name images brand category')
      .populate('user', 'name email');

    res.json(updatedOrder);
  } catch (error) {
    console.error('Error adding admin notes:', error);
    res.status(500).json({ message: 'Failed to add admin notes' });
  }
});

module.exports = router;
