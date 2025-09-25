const express = require('express');
const Wishlist = require('../models/Wishlist');
const Product = require('../models/Product');
const { auth } = require('../middleware/auth');

const router = express.Router();

// Get user wishlist
router.get('/', auth, async (req, res) => {
  try {
    let wishlist = await Wishlist.findOne({ user: req.user._id })
      .populate('products.product', 'name price images brand category isNewProduct colors sizes quantity isSold shippingCharge');

    if (!wishlist) {
      wishlist = new Wishlist({ user: req.user._id, products: [] });
      await wishlist.save();
    }

    res.json(wishlist);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Add product to wishlist
router.post('/add', auth, async (req, res) => {
  try {
    const { productId } = req.body;

    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    let wishlist = await Wishlist.findOne({ user: req.user._id });
    if (!wishlist) {
      wishlist = new Wishlist({ user: req.user._id, products: [] });
    }

    // Check if product already exists in wishlist
    const existingProduct = wishlist.products.find(
      item => item.product.toString() === productId
    );

    if (existingProduct) {
      return res.status(400).json({ message: 'Product already in wishlist' });
    }

    wishlist.products.push({ product: productId });
    await wishlist.save();
    await wishlist.populate('products.product', 'name price images brand category isNewProduct colors sizes quantity isSold shippingCharge');

    res.json(wishlist);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Remove product from wishlist
router.delete('/remove/:productId', auth, async (req, res) => {
  try {
    const wishlist = await Wishlist.findOne({ user: req.user._id });

    if (!wishlist) {
      return res.status(404).json({ message: 'Wishlist not found' });
    }

    wishlist.products = wishlist.products.filter(
      item => item.product.toString() !== req.params.productId
    );

    await wishlist.save();
    await wishlist.populate('products.product', 'name price images brand category isNewProduct colors sizes quantity isSold shippingCharge');

    res.json(wishlist);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Clear wishlist
router.delete('/clear', auth, async (req, res) => {
  try {
    const wishlist = await Wishlist.findOne({ user: req.user._id });

    if (!wishlist) {
      return res.status(404).json({ message: 'Wishlist not found' });
    }

    wishlist.products = [];
    await wishlist.save();

    res.json(wishlist);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
