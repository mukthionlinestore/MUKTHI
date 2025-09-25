const express = require('express');
const Cart = require('../models/Cart');
const Product = require('../models/Product');
const { auth } = require('../middleware/auth');

const router = express.Router();

// Get user cart - Updated with orphaned item cleanup
router.get('/', auth, async (req, res) => {
  try {
    let cart = await Cart.findOne({ user: req.user._id })
      .populate('items.product', 'name price images brand category isActive shippingCharge');

    if (!cart) {
      cart = new Cart({ user: req.user._id, items: [] });
      await cart.save();
    }

    // Clean up orphaned items (products that no longer exist or are inactive)
    const validItems = [];
    let hasOrphanedItems = false;

    for (const item of cart.items) {
      // Check if product exists and is active
      if (!item.product || item.product.isActive === false) {
        hasOrphanedItems = true;
        console.log(`Removing orphaned cart item for product: ${item.product?._id || 'unknown'}`);
      } else {
        validItems.push(item);
      }
    }

    // Update cart if orphaned items were found
    if (hasOrphanedItems) {
      cart.items = validItems;
      await cart.save();
      console.log(`Cleaned up ${cart.items.length - validItems.length} orphaned cart items for user: ${req.user._id}`);
    }

    // Recalculate totals using valid items only
    const total = validItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    const totalItems = validItems.reduce((sum, item) => sum + item.quantity, 0);

    res.json({
      ...cart.toObject(),
      items: validItems, // Send only valid items
      total,
      totalItems
    });
  } catch (error) {
    console.error('Cart get error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Add item to cart - Updated with better validation
router.post('/add', auth, async (req, res) => {
  try {
    const { productId, quantity, selectedColor, selectedSize } = req.body;

    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    // Check if product is active
    if (!product.isActive) {
      return res.status(400).json({ message: 'This product is no longer available' });
    }

    // Validate size and color requirements
    const hasColors = product.colors && product.colors.length > 0;
    const hasSizes = product.sizes && product.sizes.length > 0;

    if (hasColors && !selectedColor) {
      return res.status(400).json({ message: 'Color selection is required for this product' });
    }

    if (hasSizes && !selectedSize) {
      return res.status(400).json({ message: 'Size selection is required for this product' });
    }

    // Validate selected color exists
    if (hasColors && selectedColor) {
      const colorExists = product.colors.some(color => 
        color.name === selectedColor.name && color.available !== false
      );
      if (!colorExists) {
        return res.status(400).json({ message: 'Selected color is not available' });
      }
    }

    // Validate selected size exists
    if (hasSizes && selectedSize) {
      const sizeExists = product.sizes.some(size => 
        size.name === selectedSize && size.available !== false
      );
      if (!sizeExists) {
        return res.status(400).json({ message: 'Selected size is not available' });
      }
    }

    let cart = await Cart.findOne({ user: req.user._id });
    if (!cart) {
      cart = new Cart({ user: req.user._id, items: [] });
    }

    // Check if item already exists in cart
    const existingItemIndex = cart.items.findIndex(
      item => item.product.toString() === productId &&
              item.selectedColor?.name === selectedColor?.name &&
              item.selectedSize === selectedSize
    );

    if (existingItemIndex > -1) {
      // Update quantity if item exists
      cart.items[existingItemIndex].quantity += quantity;
    } else {
      // Add new item
      cart.items.push({
        product: productId,
        quantity,
        selectedColor,
        selectedSize,
        price: product.price
      });
    }

    await cart.save();
    await cart.populate('items.product', 'name price images brand category isActive shippingCharge');

    // Clean up and calculate totals
    const validItems = cart.items.filter(item => item.product && item.product.isActive !== false);
    const total = validItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    const totalItems = validItems.reduce((sum, item) => sum + item.quantity, 0);

    res.json({
      ...cart.toObject(),
      items: validItems,
      total,
      totalItems
    });
  } catch (error) {
    console.error('Cart add error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Update cart item quantity - Updated with validation
router.put('/update/:itemId', auth, async (req, res) => {
  try {
    const { quantity } = req.body;
    const cart = await Cart.findOne({ user: req.user._id });

    if (!cart) {
      return res.status(404).json({ message: 'Cart not found' });
    }

    const item = cart.items.id(req.params.itemId);
    if (!item) {
      return res.status(404).json({ message: 'Item not found' });
    }

    // Validate that the product still exists and is active
    const product = await Product.findById(item.product);
    if (!product || product.isActive === false) {
      // Remove the item if product no longer exists
      item.remove();
      await cart.save();
      await cart.populate('items.product', 'name price images brand category isActive shippingCharge');
      
      // Clean up and calculate totals
      const validItems = cart.items.filter(item => item.product && item.product.isActive !== false);
      const total = validItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
      const totalItems = validItems.reduce((sum, item) => sum + item.quantity, 0);
      
      return res.json({
        ...cart.toObject(),
        items: validItems,
        total,
        totalItems,
        message: 'Product no longer available, removed from cart'
      });
    }

    if (quantity <= 0) {
      item.remove();
    } else {
      item.quantity = quantity;
    }

    await cart.save();
    await cart.populate('items.product', 'name price images brand category isActive shippingCharge');

    // Clean up and calculate totals
    const validItems = cart.items.filter(item => item.product && item.product.isActive !== false);
    const total = validItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    const totalItems = validItems.reduce((sum, item) => sum + item.quantity, 0);

    res.json({
      ...cart.toObject(),
      items: validItems,
      total,
      totalItems
    });
  } catch (error) {
    console.error('Cart update error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Remove item from cart
router.delete('/remove/:itemId', auth, async (req, res) => {
  try {
    const cart = await Cart.findOne({ user: req.user._id });

    if (!cart) {
      return res.status(404).json({ message: 'Cart not found' });
    }

    cart.items = cart.items.filter(item => item._id.toString() !== req.params.itemId);
    await cart.save();
    await cart.populate('items.product', 'name price images brand category isActive shippingCharge');

    // Clean up and calculate totals
    const validItems = cart.items.filter(item => item.product && item.product.isActive !== false);
    const total = validItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    const totalItems = validItems.reduce((sum, item) => sum + item.quantity, 0);

    res.json({
      ...cart.toObject(),
      items: validItems,
      total,
      totalItems
    });
  } catch (error) {
    console.error('Cart remove error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Clear cart
router.delete('/clear', auth, async (req, res) => {
  try {
    const cart = await Cart.findOne({ user: req.user._id });

    if (!cart) {
      return res.status(404).json({ message: 'Cart not found' });
    }

    cart.items = [];
    await cart.save();

    res.json({
      ...cart.toObject(),
      items: [],
      total: 0,
      totalItems: 0
    });
  } catch (error) {
    console.error('Cart clear error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
