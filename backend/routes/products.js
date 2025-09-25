const express = require('express');
const Product = require('../models/Product');
const Category = require('../models/Category');
const Brand = require('../models/Brand');
const { auth, adminAuth } = require('../middleware/auth');

const router = express.Router();

// Get all products with search, filter, and sort
router.get('/', async (req, res) => {
  try {
    const {
      search,
      category,
      brand,
      minPrice,
      maxPrice,
      sort,
      page = 1,
      limit = 12,
      isNew,
      featured,
      isSold
    } = req.query;

    let query = { 
      isActive: true,
      // Exclude sold out products (quantity > 0 and not sold)
      quantity: { $gt: 0 },
      $or: [{ isSold: { $ne: true } }, { isSold: { $exists: false } }]
    };

    // Enhanced search functionality - search from first character
    if (search && search.trim()) {
      const searchTerm = search.trim();
      console.log('🔍 Searching for:', searchTerm);
      
      // Create regex pattern - escape special characters
      const escapedSearchTerm = searchTerm.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
      const searchRegex = new RegExp(escapedSearchTerm, 'i');
      
      console.log('🔍 Escaped search term:', escapedSearchTerm);
      console.log('🔍 Regex pattern:', searchRegex);
      
      query.$or = [
        { name: searchRegex },
        { description: searchRegex },
        { category: searchRegex },
        { brand: searchRegex }
      ];
      
      // Only add tags search if tags exist
      if (searchTerm.length > 0) {
        query.$or.push({ tags: searchRegex });
      }
      
      console.log('🔍 Search query structure:', query.$or.length, 'conditions');
    }

    // Filter by category
    if (category) {
      query.category = category;
    }

    // Filter by brand
    if (brand) {
      query.brand = brand;
    }

    // Filter by price range
    if (minPrice || maxPrice) {
      query.price = {};
      if (minPrice) query.price.$gte = parseFloat(minPrice);
      if (maxPrice) query.price.$lte = parseFloat(maxPrice);
    }

    // Filter by new products
    if (isNew === 'true') {
      query.isNewProduct = true;
    }

    // Filter by featured products
    if (featured === 'true') {
      query.isFeatured = true;
    }

    // Filter by sold status
    if (isSold === 'true') {
      query.isSold = true;
    }

    // Enhanced sort options
    let sortOption = {};
    switch (sort) {
      case 'price_asc':
        sortOption = { price: 1 };
        break;
      case 'price_desc':
        sortOption = { price: -1 };
        break;
      case 'rating':
        sortOption = { rating: -1 };
        break;
      case 'newest':
        sortOption = { createdAt: -1 };
        break;
      case 'oldest':
        sortOption = { createdAt: 1 };
        break;
      case 'name_asc':
        sortOption = { name: 1 };
        break;
      case 'name_desc':
        sortOption = { name: -1 };
        break;
      default:
        sortOption = { createdAt: -1 };
    }

    const skip = (page - 1) * limit;

    console.log('🔍 Final query structure:', Object.keys(query));
    console.log('🔍 Sort option:', sortOption);

    const products = await Product.find(query)
      .sort(sortOption)
      .skip(skip)
      .limit(parseInt(limit))
      .populate('reviews.user', 'name');

    const total = await Product.countDocuments(query);

    console.log(`✅ Found ${products.length} products out of ${total} total`);

    res.json({
      products,
      totalPages: Math.ceil(total / limit),
      currentPage: parseInt(page),
      total
    });
  } catch (error) {
    console.error('Products API Error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get single product
router.get('/:id', async (req, res) => {
  try {
    const product = await Product.findById(req.params.id)
      .populate('reviews.user', 'name avatar');

    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    res.json(product);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Create product (Admin only)
router.post('/', adminAuth, async (req, res) => {
  try {
    const product = new Product(req.body);
    await product.save();
    res.status(201).json(product);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Update product (Admin only)
router.put('/:id', adminAuth, async (req, res) => {
  try {
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
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Delete product (Admin only)
router.delete('/:id', adminAuth, async (req, res) => {
  try {
    const product = await Product.findByIdAndDelete(req.params.id);

    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    res.json({ message: 'Product deleted successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Add review to product
router.post('/:id/reviews', auth, async (req, res) => {
  try {
    const { rating, comment } = req.body;
    const product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    // Check if user already reviewed
    const alreadyReviewed = product.reviews.find(
      review => review.user.toString() === req.user._id.toString()
    );

    if (alreadyReviewed) {
      return res.status(400).json({ message: 'Product already reviewed' });
    }

    const review = {
      user: req.user._id,
      rating: Number(rating),
      comment
    };

    product.reviews.push(review);
    product.numReviews = product.reviews.length;
    product.rating = product.reviews.reduce((acc, item) => item.rating + acc, 0) / product.reviews.length;

    await product.save();
    res.status(201).json({ message: 'Review added' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get categories
router.get('/categories/list', async (req, res) => {
  try {
    const categories = await Category.find().select('name').sort({ name: 1 });
    const categoryNames = categories.map(cat => cat.name);
    res.json(categoryNames);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get brands
router.get('/brands/list', async (req, res) => {
  try {
    const brands = await Brand.find().select('name').sort({ name: 1 });
    const brandNames = brands.map(brand => brand.name);
    res.json(brandNames);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get categories with counts (Admin only)
router.get('/categories/stats', async (req, res) => {
  try {
    const categories = await Product.aggregate([
      { $group: { _id: '$category', count: { $sum: 1 } } },
      { $sort: { count: -1 } },
      { $project: { name: '$_id', count: 1, _id: 0 } }
    ]);
    res.json(categories.filter(cat => cat.name && cat.name.trim()));
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get brands with counts (Admin only)
router.get('/brands/stats', async (req, res) => {
  try {
    const brands = await Product.aggregate([
      { $match: { brand: { $exists: true, $ne: null, $ne: '' } } },
      { $group: { _id: '$brand', count: { $sum: 1 } } },
      { $sort: { count: -1 } },
      { $project: { name: '$_id', count: 1, _id: 0 } }
    ]);
    res.json(brands.filter(brand => brand.name && brand.name.trim()));
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
