const express = require('express');
const Product = require('../models/Product');
const Order = require('../models/Order');
const User = require('../models/User');
const Category = require('../models/Category');
const Brand = require('../models/Brand');
const Cart = require('../models/Cart');
const Wishlist = require('../models/Wishlist');
const { adminAuth } = require('../middleware/auth');
const { uploadBase64Image, deleteImage, getPublicIdFromUrl } = require('../middleware/cloudinary');
const rateLimit = require('express-rate-limit');

const router = express.Router();

// // Rate limiting for admin routes
// const adminLimiter = rateLimit({
//   windowMs: 1 * 60 * 1000, // 1 minute
//   max: 50, // Limit admin routes to 50 requests per minute
//   message: {
//     error: 'Too many admin requests',
//     message: 'Please try again later'
//   },
//   standardHeaders: true,
//   legacyHeaders: false,
// });

// // Apply rate limiting to all admin routes
// router.use(adminLimiter);

// OPTIMIZED: Single dashboard endpoint (replaces /stats and /dashboard)
router.get('/dashboard', adminAuth, async (req, res) => {
  try {
    // Execute all queries in parallel for better performance
    const [
      totalProducts,
      totalOrders,
      totalUsers,
      revenueResult,
      recentOrders,
      lowStockProducts
    ] = await Promise.all([
      Product.countDocuments(),
      Order.countDocuments(),
      User.countDocuments({ role: 'user' }),
      Order.aggregate([
        { $match: { status: { $in: ['Delivered', 'Shipped'] } } },
        { $group: { _id: null, total: { $sum: '$total' } } }
      ]),
      Order.find()
        .populate('user', 'name email')
        .sort({ createdAt: -1 })
        .limit(5)
        .lean(), // Use lean() for better performance
      Product.find({ quantity: { $lt: 10 } })
        .select('name quantity price')
        .limit(5)
        .lean()
    ]);

    res.json({
      stats: {
        totalProducts,
        totalOrders,
        totalUsers,
        totalRevenue: revenueResult[0]?.total || 0
      },
      recentOrders,
      lowStockProducts
    });
  } catch (error) {
    console.error('Dashboard error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get all orders (Admin) - Optimized with lean()
router.get('/orders', adminAuth, async (req, res) => {
  try {
    const { page = 1, limit = 10, status, search } = req.query;
    
    let query = {};
    if (status) query.status = status;
    if (search) {
      query.$or = [
        { orderId: { $regex: search, $options: 'i' } },
        { 'user.name': { $regex: search, $options: 'i' } },
        { 'user.email': { $regex: search, $options: 'i' } }
      ];
    }

    const skip = (page - 1) * parseInt(limit);
    const limitNum = parseInt(limit);

    const [orders, total] = await Promise.all([
      Order.find(query)
        .populate('user', 'name email')
        .populate('items.product', 'name images brand category price')
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limitNum)
        .lean(),
      Order.countDocuments(query)
    ]);

    res.json({
      orders,
      totalPages: Math.ceil(total / limitNum),
      currentPage: parseInt(page),
      total
    });
  } catch (error) {
    console.error('Orders fetch error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get all users (Admin) - Optimized
router.get('/users', adminAuth, async (req, res) => {
  try {
    const users = await User.find({ role: 'user' })
      .select('-password')
      .sort({ createdAt: -1 })
      .lean();

    res.json(users);
  } catch (error) {
    console.error('Users fetch error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get single product (Admin)
router.get('/products/:id', adminAuth, async (req, res) => {
  try {
    const product = await Product.findById(req.params.id).lean();
    
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }
    
    res.json(product);
  } catch (error) {
    console.error('Product fetch error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get all products (Admin) - Optimized with lean()
router.get('/products', adminAuth, async (req, res) => {
  try {
    const { page = 1, limit = 10, search, category, brand } = req.query;
    
    let query = {};
    if (search) {
      query.name = { $regex: search, $options: 'i' };
    }
    if (category) query.category = category;
    if (brand) query.brand = brand;

    const skip = (page - 1) * parseInt(limit);
    const limitNum = parseInt(limit);

    // Execute queries in parallel
    const [products, total] = await Promise.all([
      Product.find(query)
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limitNum)
        .lean(),
      Product.countDocuments(query)
    ]);

    res.json({
      products,
      totalPages: Math.ceil(total / limitNum),
      currentPage: parseInt(page),
      total
    });
  } catch (error) {
    console.error('Products fetch error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Add new product (Admin) - Updated for Cloudinary
router.post('/products', adminAuth, async (req, res) => {
  try {
    console.log('Product creation request received:', {
      body: req.body,
      user: req.user._id
    });

    // Validate required fields
    const { name, description, price, category, images } = req.body;
    
    if (!name || !description || !price || !category || !images || images.length === 0) {
      return res.status(400).json({ 
        message: 'Missing required fields: name, description, price, category, and at least one image are required' 
      });
    }

    // Upload images to Cloudinary if they are base64
    let cloudinaryImages = [];
    if (Array.isArray(images)) {
      const uploadPromises = images.map(async (image) => {
        // Check if image is already a Cloudinary URL
        if (image.startsWith('http') && image.includes('cloudinary.com')) {
          return image;
        }
        
        // Upload base64 image to Cloudinary
        if (image.startsWith('data:image')) {
          try {
            const result = await uploadBase64Image(image);
            return result.url;
          } catch (error) {
            console.error('Error uploading image to Cloudinary:', error);
            throw new Error('Failed to upload image to Cloudinary');
          }
        }
        
        return image; // Return as is if it's already a URL
      });

      cloudinaryImages = await Promise.all(uploadPromises);
    }

    // Create product with validated data
    const productData = {
      ...req.body,
      images: cloudinaryImages,
      price: parseFloat(price),
      originalPrice: req.body.originalPrice ? parseFloat(req.body.originalPrice) : null,
      quantity: req.body.isSold ? 0 : (req.body.quantity ? parseInt(req.body.quantity) : 0),
      // SKU will be auto-generated by the model's default function
      sku: req.body.sku || undefined
    };

    console.log('Creating product with data:', productData);

    const product = new Product(productData);
    await product.save();
    
    console.log('Product created successfully:', product._id);
    res.status(201).json(product);
  } catch (error) {
    console.error('Product creation error:', error);
    
    // Send more detailed error information
    if (error.name === 'ValidationError') {
      const validationErrors = Object.values(error.errors).map(err => err.message);
      return res.status(400).json({ 
        message: 'Validation error', 
        errors: validationErrors 
      });
    }
    
    res.status(500).json({ 
      message: 'Server error', 
      error: error.message 
    });
  }
});

// Update product (Admin) - Updated for Cloudinary
router.put('/products/:id', adminAuth, async (req, res) => {
  try {
    const { images, isSold } = req.body;
    
    // If marking as sold, automatically set quantity to 0
    if (isSold === true) {
      req.body.quantity = 0;
    }
    
    // Handle image updates
    if (images && Array.isArray(images)) {
      const uploadPromises = images.map(async (image) => {
        // Check if image is already a Cloudinary URL
        if (image.startsWith('http') && image.includes('cloudinary.com')) {
          return image;
        }
        
        // Upload base64 image to Cloudinary
        if (image.startsWith('data:image')) {
          try {
            const result = await uploadBase64Image(image);
            return result.url;
          } catch (error) {
            console.error('Error uploading image to Cloudinary:', error);
            throw new Error('Failed to upload image to Cloudinary');
          }
        }
        
        return image; // Return as is if it's already a URL
      });

      req.body.images = await Promise.all(uploadPromises);
    }

    const product = await Product.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );
    
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    res.json(product);
  } catch (error) {
    console.error('Product update error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Delete product (Admin) - Updated with cart and wishlist cleanup
router.delete('/products/:id', adminAuth, async (req, res) => {
  try {
    const productId = req.params.id;
    console.log('Delete product request received for ID:', productId);
    
    // Validate product ID format
    if (!productId || !require('mongoose').Types.ObjectId.isValid(productId)) {
      return res.status(400).json({ message: 'Invalid product ID format' });
    }
    
    // Find the product first to get its images for Cloudinary cleanup
    const product = await Product.findById(productId);
    
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    // Clean up images from Cloudinary if they exist
    if (product.images && Array.isArray(product.images)) {
      const deletePromises = product.images.map(async (imageUrl) => {
        if (imageUrl && imageUrl.includes('cloudinary.com')) {
          const publicId = getPublicIdFromUrl(imageUrl);
          const result = await deleteImage(publicId);
          
          if (result.error) {
            console.error('Error deleting image from Cloudinary:', result.message);
            return { success: false, url: imageUrl, error: result.message };
          } else {
            console.log('Deleted image from Cloudinary:', imageUrl);
            return { success: true, url: imageUrl };
          }
        }
        return { success: true, url: imageUrl, skipped: true };
      });
      
      const results = await Promise.allSettled(deletePromises);
      console.log('Cloudinary cleanup results:', results);
    }

    // Delete the product
    let deleteResult;
    try {
      deleteResult = await Product.findByIdAndDelete(productId);
      console.log('Product deletion result:', deleteResult ? 'Success' : 'Failed');
    } catch (dbError) {
      console.error('Database error during product deletion:', dbError);
      return res.status(500).json({ 
        message: 'Database error during product deletion',
        error: dbError.message 
      });
    }
    
    if (!deleteResult) {
      return res.status(404).json({ message: 'Product not found or already deleted' });
    }
    
    // Clean up cart items that reference this product
    const cartUpdateResult = await Cart.updateMany(
      { 'items.product': productId },
      { $pull: { items: { product: productId } } }
    );
    
    // Clean up wishlist items that reference this product
    const wishlistUpdateResult = await Wishlist.updateMany(
      { products: productId },
      { $pull: { products: productId } }
    );
    
    console.log(`Product deleted: ${product.name}`);
    console.log(`Cart items cleaned up: ${cartUpdateResult.modifiedCount} carts affected`);
    console.log(`Wishlist items cleaned up: ${wishlistUpdateResult.modifiedCount} wishlists affected`);
    
    console.log('Sending success response for product deletion');
    res.json({ 
      message: 'Product deleted successfully',
      cleanup: {
        cartsAffected: cartUpdateResult.modifiedCount,
        wishlistsAffected: wishlistUpdateResult.modifiedCount
      }
    });
  } catch (error) {
    console.error('Product delete error:', error);
    
    // Check if the error is related to Cloudinary or other non-critical operations
    if (error.message && error.message.includes('Cloudinary')) {
      // Product was likely deleted successfully, but Cloudinary cleanup failed
      res.status(200).json({ 
        message: 'Product deleted successfully (some images may not have been cleaned up)',
        warning: 'Cloudinary cleanup failed',
        error: error.message
      });
    } else {
      res.status(500).json({ 
        message: 'Failed to delete product',
        error: error.message 
      });
    }
  }
});

// Mark product as sold
router.put('/products/:id/sold', adminAuth, async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    product.isSold = !product.isSold;
    await product.save();

    res.json(product);
  } catch (error) {
    console.error('Product sold toggle error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// OPTIMIZED: Bulk operations with transaction support
router.post('/products/bulk-delete', adminAuth, async (req, res) => {
  try {
    const { productIds } = req.body;
    
    if (!productIds || !Array.isArray(productIds) || productIds.length === 0) {
      return res.status(400).json({ message: 'Product IDs are required' });
    }
    
    const result = await Product.deleteMany({ _id: { $in: productIds } });
    
    res.json({ 
      message: `${result.deletedCount} products deleted successfully`,
      deletedCount: result.deletedCount
    });
  } catch (error) {
    console.error('Bulk delete error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

router.post('/products/bulk-update', adminAuth, async (req, res) => {
  try {
    const { productIds, updates } = req.body;
    
    if (!productIds || !Array.isArray(productIds) || productIds.length === 0) {
      return res.status(400).json({ message: 'Product IDs are required' });
    }
    
    const result = await Product.updateMany(
      { _id: { $in: productIds } },
      { $set: updates },
      { runValidators: true }
    );
    
    res.json({ 
      message: `${result.modifiedCount} products updated successfully`,
      modifiedCount: result.modifiedCount
    });
  } catch (error) {
    console.error('Bulk update error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// CATEGORY MANAGEMENT - Optimized

// Add new category
router.post('/categories', adminAuth, async (req, res) => {
  try {
    const { name, description } = req.body;
    
    if (!name || !name.trim()) {
      return res.status(400).json({ message: 'Category name is required' });
    }
    
    // Check if category already exists (case-insensitive)
    const existingCategory = await Category.findOne({ 
      name: { $regex: new RegExp(`^${name.trim()}$`, 'i') }
    });
    
    if (existingCategory) {
      return res.status(400).json({ message: 'Category already exists' });
    }
    
    const category = new Category({
      name: name.trim(),
      description: description ? description.trim() : ''
    });
    
    await category.save();
    
    res.status(201).json({ 
      message: 'Category added successfully', 
      category: category 
    });
  } catch (error) {
    console.error('Category creation error:', error);
    if (error.code === 11000) {
      return res.status(400).json({ message: 'Category already exists' });
    }
    res.status(500).json({ message: 'Server error' });
  }
});

// OPTIMIZED: Get categories with product counts (Fixed N+1 query problem)
router.get('/categories/stats', adminAuth, async (req, res) => {
  try {
    // Execute both queries in parallel
    const [categories, productCounts] = await Promise.all([
      Category.find().sort({ name: 1 }).lean(),
      Product.aggregate([
        { $group: { _id: '$category', count: { $sum: 1 } } }
      ])
    ]);

    // Create a map for O(1) lookup
    const countMap = new Map(
      productCounts.map(item => [item._id, item.count])
    );

    // Combine results efficiently
    const categoriesWithCounts = categories.map(category => ({
      name: category.name,
      description: category.description,
      count: countMap.get(category.name) || 0,
      _id: category._id,
      createdAt: category.createdAt
    }));

    res.json(categoriesWithCounts);
  } catch (error) {
    console.error('Category stats error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Update category
router.put('/categories/:id', adminAuth, async (req, res) => {
  try {
    const { id } = req.params;
    const { name, description } = req.body;
    
    if (!name || !name.trim()) {
      return res.status(400).json({ message: 'Category name is required' });
    }
    
    // Check if another category with the same name exists
    const existingCategory = await Category.findOne({ 
      name: { $regex: new RegExp(`^${name.trim()}$`, 'i') },
      _id: { $ne: id }
    });
    
    if (existingCategory) {
      return res.status(400).json({ message: 'Category with this name already exists' });
    }
    
    // Get the old category to update products
    const oldCategory = await Category.findById(id);
    if (!oldCategory) {
      return res.status(404).json({ message: 'Category not found' });
    }
    
    // Update the category
    const updatedCategory = await Category.findByIdAndUpdate(
      id,
      {
        name: name.trim(),
        description: description ? description.trim() : ''
      },
      { new: true, runValidators: true }
    );
    
    // If category name changed, update all products with this category
    if (oldCategory.name !== name.trim()) {
      await Product.updateMany(
        { category: oldCategory.name },
        { category: name.trim() }
      );
    }
    
    res.json({ 
      message: 'Category updated successfully', 
      category: updatedCategory 
    });
  } catch (error) {
    console.error('Category update error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Delete category
router.delete('/categories/:id', adminAuth, async (req, res) => {
  try {
    const { id } = req.params;
    
    // Find the category first
    const category = await Category.findById(id);
    if (!category) {
      return res.status(404).json({ message: 'Category not found' });
    }
    
    // Check if any products use this category
    const productsWithCategory = await Product.countDocuments({ category: category.name });
    if (productsWithCategory > 0) {
      return res.status(400).json({ 
        message: `Cannot delete category "${category.name}" because it has ${productsWithCategory} products. Please update or delete the products first.` 
      });
    }
    
    // Delete the category
    await Category.findByIdAndDelete(id);
    
    res.json({ 
      message: 'Category deleted successfully',
      deletedCategory: category
    });
  } catch (error) {
    console.error('Category delete error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// BRAND MANAGEMENT - Optimized

// Add new brand
router.post('/brands', adminAuth, async (req, res) => {
  try {
    const { name, description, website, logo } = req.body;
    
    if (!name || !name.trim()) {
      return res.status(400).json({ message: 'Brand name is required' });
    }
    
    // Check if brand already exists (case-insensitive)
    const existingBrand = await Brand.findOne({ 
      name: { $regex: new RegExp(`^${name.trim()}$`, 'i') }
    });
    
    if (existingBrand) {
      return res.status(400).json({ message: 'Brand with this name already exists' });
    }
    
    const brand = new Brand({
      name: name.trim(),
      description: description ? description.trim() : '',
      website: website ? website.trim() : '',
      logo: logo ? logo.trim() : ''
    });
    
    await brand.save();
    
    res.status(201).json({ 
      message: 'Brand added successfully', 
      brand: brand 
    });
  } catch (error) {
    console.error('Brand creation error:', error);
    if (error.code === 11000) {
      return res.status(400).json({ message: 'Brand with this name already exists' });
    }
    res.status(500).json({ message: 'Server error' });
  }
});

// Get all brands
router.get('/brands', adminAuth, async (req, res) => {
  try {
    const brands = await Brand.find().sort({ createdAt: -1 }).lean();
    res.json(brands);
  } catch (error) {
    console.error('Brands fetch error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// OPTIMIZED: Get brands with product counts (Fixed N+1 query problem)
router.get('/brands/stats', adminAuth, async (req, res) => {
  try {
    // Execute both queries in parallel
    const [brands, productCounts] = await Promise.all([
      Brand.find().sort({ name: 1 }).lean(),
      Product.aggregate([
        { $group: { _id: '$brand', count: { $sum: 1 } } }
      ])
    ]);

    // Create a map for O(1) lookup
    const countMap = new Map(
      productCounts.map(item => [item._id, item.count])
    );

    // Combine results efficiently
    const brandsWithCounts = brands.map(brand => ({
      _id: brand._id,
      name: brand.name,
      description: brand.description,
      website: brand.website,
      logo: brand.logo,
      productCount: countMap.get(brand.name) || 0,
      createdAt: brand.createdAt,
      updatedAt: brand.updatedAt
    }));

    res.json(brandsWithCounts);
  } catch (error) {
    console.error('Brand stats error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Update brand
router.put('/brands/:id', adminAuth, async (req, res) => {
  try {
    const { id } = req.params;
    const { name, description, website, logo } = req.body;
    
    if (!name || !name.trim()) {
      return res.status(400).json({ message: 'Brand name is required' });
    }
    
    // Check if another brand with the same name exists
    const existingBrand = await Brand.findOne({ 
      name: { $regex: new RegExp(`^${name.trim()}$`, 'i') },
      _id: { $ne: id }
    });
    
    if (existingBrand) {
      return res.status(400).json({ message: 'Brand with this name already exists' });
    }
    
    // Get the old brand to update products
    const oldBrand = await Brand.findById(id);
    if (!oldBrand) {
      return res.status(404).json({ message: 'Brand not found' });
    }
    
    // Update the brand
    const updatedBrand = await Brand.findByIdAndUpdate(
      id,
      {
        name: name.trim(),
        description: description ? description.trim() : '',
        website: website ? website.trim() : '',
        logo: logo ? logo.trim() : ''
      },
      { new: true, runValidators: true }
    );
    
    // If brand name changed, update all products with this brand
    if (oldBrand.name !== name.trim()) {
      await Product.updateMany(
        { brand: oldBrand.name },
        { brand: name.trim() }
      );
    }
    
    res.json({ 
      message: 'Brand updated successfully', 
      brand: updatedBrand 
    });
  } catch (error) {
    console.error('Brand update error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Delete brand
router.delete('/brands/:id', adminAuth, async (req, res) => {
  try {
    const { id } = req.params;
    
    // Find the brand first
    const brand = await Brand.findById(id);
    if (!brand) {
      return res.status(404).json({ message: 'Brand not found' });
    }
    
    // Check if any products use this brand
    const productsWithBrand = await Product.countDocuments({ brand: brand.name });
    if (productsWithBrand > 0) {
      return res.status(400).json({ 
        message: `Cannot delete brand "${brand.name}" because it has ${productsWithBrand} products. Please update or delete the products first.` 
      });
    }
    
    // Delete the brand
    await Brand.findByIdAndDelete(id);
    
    res.json({ 
      message: 'Brand deleted successfully',
      deletedBrand: brand
    });
  } catch (error) {
    console.error('Brand delete error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// ==================== ORDER MANAGEMENT ROUTES ====================

// Get single order details (Admin)
router.get('/orders/:id', adminAuth, async (req, res) => {
  try {
    const order = await Order.findById(req.params.id)
      .populate('user', 'name email phone')
      .populate('items.product', 'name images brand category price')
      .lean();

    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    res.json(order);
  } catch (error) {
    console.error('Order fetch error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Update order status (Admin)
router.put('/orders/:id/status', adminAuth, async (req, res) => {
  try {
    const { id } = req.params;
    const { status, trackingNumber, notes } = req.body;

    // Validate status
    const validStatuses = ['Pending', 'Processing', 'Shipped', 'Delivered', 'Cancelled', 'Returned'];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({ message: 'Invalid status' });
    }

    const order = await Order.findById(id);
    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    // Update order
    const updateData = { status };
    if (trackingNumber) updateData.trackingNumber = trackingNumber;
    if (notes) updateData.notes = notes;

    // Set delivered date if status is Delivered
    if (status === 'Delivered') {
      updateData.isDelivered = true;
      updateData.deliveredAt = new Date();
    }

    // If cancelling order, restore product quantities
    if (status === 'Cancelled' && order.status !== 'Cancelled') {
      for (const item of order.items) {
        const product = await Product.findById(item.product);
        if (product) {
          product.quantity += item.quantity;
          await product.save();
        }
      }
    }

    const updatedOrder = await Order.findByIdAndUpdate(
      id,
      updateData,
      { new: true, runValidators: true }
    ).populate('user', 'name email')
     .populate('items.product', 'name images brand category');

    res.json({
      message: 'Order status updated successfully',
      order: updatedOrder
    });
  } catch (error) {
    console.error('Order status update error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Update payment status (Admin)
router.put('/orders/:id/payment', adminAuth, async (req, res) => {
  try {
    const { id } = req.params;
    const { isPaid, paymentResult } = req.body;

    const order = await Order.findById(id);
    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    const updateData = { isPaid };
    if (isPaid) {
      updateData.paidAt = new Date();
      if (paymentResult) {
        updateData.paymentResult = paymentResult;
      }
      // Auto-update status to Processing if payment is successful and order is Pending
      if (order.status === 'Pending') {
        updateData.status = 'Processing';
      }
    }

    const updatedOrder = await Order.findByIdAndUpdate(
      id,
      updateData,
      { new: true, runValidators: true }
    ).populate('user', 'name email')
     .populate('items.product', 'name images brand category');

    res.json({
      message: 'Payment status updated successfully',
      order: updatedOrder
    });
  } catch (error) {
    console.error('Payment status update error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get order statistics (Admin)
router.get('/orders/stats', adminAuth, async (req, res) => {
  try {
    const { period = 'all' } = req.query;
    
    let dateFilter = {};
    if (period === 'today') {
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      const tomorrow = new Date(today);
      tomorrow.setDate(tomorrow.getDate() + 1);
      dateFilter = { createdAt: { $gte: today, $lt: tomorrow } };
    } else if (period === 'week') {
      const weekAgo = new Date();
      weekAgo.setDate(weekAgo.getDate() - 7);
      dateFilter = { createdAt: { $gte: weekAgo } };
    } else if (period === 'month') {
      const monthAgo = new Date();
      monthAgo.setMonth(monthAgo.getMonth() - 1);
      dateFilter = { createdAt: { $gte: monthAgo } };
    }

    const [
      totalOrders,
      totalRevenue,
      ordersByStatus,
      recentOrders
    ] = await Promise.all([
      Order.countDocuments(dateFilter),
      Order.aggregate([
        { $match: { ...dateFilter, status: { $ne: 'Cancelled' } } },
        { $group: { _id: null, total: { $sum: '$total' } } }
      ]),
      Order.aggregate([
        { $match: dateFilter },
        { $group: { _id: '$status', count: { $sum: 1 } } }
      ]),
      Order.find(dateFilter)
        .populate('user', 'name email')
        .sort({ createdAt: -1 })
        .limit(5)
        .lean()
    ]);

    res.json({
      totalOrders,
      totalRevenue: totalRevenue[0]?.total || 0,
      ordersByStatus,
      recentOrders
    });
  } catch (error) {
    console.error('Order stats error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Delete order (Admin) - Only for cancelled orders
router.delete('/orders/:id', adminAuth, async (req, res) => {
  try {
    const { id } = req.params;

    const order = await Order.findById(id);
    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    // Only allow deletion of cancelled orders
    if (order.status !== 'Cancelled') {
      return res.status(400).json({ 
        message: 'Only cancelled orders can be deleted' 
      });
    }

    await Order.findByIdAndDelete(id);

    res.json({ 
      message: 'Order deleted successfully',
      deletedOrder: order
    });
  } catch (error) {
    console.error('Order delete error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Bulk update order statuses (Admin)
router.put('/orders/bulk/status', adminAuth, async (req, res) => {
  try {
    const { orderIds, status, trackingNumber, notes } = req.body;

    if (!orderIds || !Array.isArray(orderIds) || orderIds.length === 0) {
      return res.status(400).json({ message: 'Order IDs are required' });
    }

    const validStatuses = ['Pending', 'Processing', 'Shipped', 'Delivered', 'Cancelled', 'Returned'];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({ message: 'Invalid status' });
    }

    const updateData = { status };
    if (trackingNumber) updateData.trackingNumber = trackingNumber;
    if (notes) updateData.notes = notes;

    if (status === 'Delivered') {
      updateData.isDelivered = true;
      updateData.deliveredAt = new Date();
    }

    const result = await Order.updateMany(
      { _id: { $in: orderIds } },
      updateData
    );

    res.json({
      message: `${result.modifiedCount} orders updated successfully`,
      updatedCount: result.modifiedCount
    });
  } catch (error) {
    console.error('Bulk order update error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get admin stats (for dashboard)
router.get('/stats', adminAuth, async (req, res) => {
  try {
    const [
      totalProducts,
      totalOrders,
      totalUsers,
      revenueResult
    ] = await Promise.all([
      Product.countDocuments(),
      Order.countDocuments(),
      User.countDocuments({ role: 'user' }),
      Order.aggregate([
        { $match: { status: { $in: ['Delivered', 'Shipped'] } } },
        { $group: { _id: null, total: { $sum: '$total' } } }
      ])
    ]);

    res.json({
      totalProducts,
      totalOrders,
      totalUsers,
      totalRevenue: revenueResult[0]?.total || 0
    });
  } catch (error) {
    console.error('Stats error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get recent orders (for dashboard)
router.get('/recent-orders', adminAuth, async (req, res) => {
  try {
    const recentOrders = await Order.find()
      .populate('user', 'name email')
      .sort({ createdAt: -1 })
      .limit(5)
      .lean();

    res.json(recentOrders);
  } catch (error) {
    console.error('Recent orders error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;