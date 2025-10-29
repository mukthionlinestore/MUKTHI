const express = require('express');
const { adminAuth, auth } = require('../middleware/auth');
const { superAdminAuth } = require('../middleware/superAdminAuth');
const { uploadMultiple, uploadSingle, uploadBase64Image, deleteImage, getPublicIdFromUrl } = require('../middleware/cloudinary');

const router = express.Router();

// Upload multiple images (Admin only)
router.post('/images', adminAuth, uploadMultiple, async (req, res) => {
  try {
    if (!req.files || req.files.length === 0) {
      return res.status(400).json({ message: 'No images uploaded' });
    }

    const uploadedImages = req.files.map(file => ({
      url: file.path,
      publicId: file.filename,
      originalName: file.originalname
    }));

    console.log('Images uploaded to Cloudinary:', uploadedImages.length);

    res.json({
      message: 'Images uploaded successfully',
      images: uploadedImages
    });
  } catch (error) {
    console.error('Image upload error:', error);
    res.status(500).json({ message: 'Error uploading images' });
  }
});

// Upload base64 images (Admin only)
router.post('/base64-images', adminAuth, async (req, res) => {
  try {
    console.log('📤 Base64 image upload request received');
    console.log('Request body keys:', Object.keys(req.body));
    
    const { images } = req.body;

    if (!images || !Array.isArray(images) || images.length === 0) {
      console.log('❌ No images provided in request');
      return res.status(400).json({ message: 'No images provided' });
    }

    console.log(`📋 Processing ${images.length} images`);

    const uploadPromises = images.map(async (base64Image, index) => {
      try {
        console.log(`🔄 Uploading image ${index + 1}/${images.length}`);
        
        // Validate base64 string
        if (!base64Image || typeof base64Image !== 'string') {
          throw new Error(`Invalid base64 string for image ${index + 1}`);
        }

        if (!base64Image.startsWith('data:image/')) {
          throw new Error(`Invalid image format for image ${index + 1}`);
        }

        const result = await uploadBase64Image(base64Image);
        console.log(`✅ Image ${index + 1} uploaded successfully:`, result.publicId);
        
        return {
          url: result.url,
          publicId: result.publicId
        };
      } catch (error) {
        console.error(`❌ Error uploading image ${index + 1}:`, error.message);
        throw error;
      }
    });

    const uploadedImages = await Promise.all(uploadPromises);

    console.log(`🎉 All ${uploadedImages.length} images uploaded successfully`);

    res.json({
      message: 'Images uploaded successfully',
      images: uploadedImages
    });
  } catch (error) {
    console.error('❌ Base64 image upload error:', error);
    console.error('Error stack:', error.stack);
    
    // Send more detailed error information
    res.status(500).json({ 
      message: 'Error uploading images',
      error: error.message,
      details: process.env.NODE_ENV === 'development' ? error.stack : undefined
    });
  }
});

// Delete image (Admin only)
router.delete('/images/:publicId', adminAuth, async (req, res) => {
  try {
    const { publicId } = req.params;

    if (!publicId) {
      return res.status(400).json({ message: 'Public ID is required' });
    }

    await deleteImage(publicId);

    res.json({ message: 'Image deleted successfully' });
  } catch (error) {
    console.error('Image deletion error:', error);
    res.status(500).json({ message: 'Error deleting image' });
  }
});

// Delete image by URL (Admin only)
router.delete('/images', adminAuth, async (req, res) => {
  try {
    const { url } = req.body;

    if (!url) {
      return res.status(400).json({ message: 'Image URL is required' });
    }

    const publicId = getPublicIdFromUrl(url);
    
    if (!publicId) {
      return res.status(400).json({ message: 'Invalid Cloudinary URL' });
    }

    await deleteImage(publicId);

    res.json({ message: 'Image deleted successfully' });
  } catch (error) {
    console.error('Image deletion error:', error);
    res.status(500).json({ message: 'Error deleting image' });
  }
});

// Upload avatar (User only)
router.post('/avatar', auth, uploadSingle, async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'No image uploaded' });
    }

    const uploadedImage = {
      url: req.file.path,
      publicId: req.file.filename,
      originalName: req.file.originalname
    };

    console.log('Avatar uploaded to Cloudinary:', uploadedImage);

    res.json({
      message: 'Avatar uploaded successfully',
      image: uploadedImage
    });
  } catch (error) {
    console.error('Avatar upload error:', error);
    res.status(500).json({ message: 'Error uploading avatar' });
  }
});

// Upload avatar to Cloudinary (for profile page)
router.post('/cloudinary', auth, async (req, res) => {
  try {
    if (!req.files || !req.files.image) {
      return res.status(400).json({ message: 'No image uploaded' });
    }

    const file = req.files.image;
    
    // Validate file type
    if (!file.mimetype.startsWith('image/')) {
      return res.status(400).json({ message: 'Only image files are allowed' });
    }

    // Validate file size (5MB limit)
    if (file.size > 5 * 1024 * 1024) {
      return res.status(400).json({ message: 'File size must be less than 5MB' });
    }

    // Read file data
    const fileData = file.data;
    const base64String = `data:${file.mimetype};base64,${fileData.toString('base64')}`;
    
    // Upload to Cloudinary
    const result = await uploadBase64Image(base64String, 'user-avatars');

    res.json({
      message: 'Avatar uploaded successfully',
      url: result.url,
      publicId: result.publicId
    });
  } catch (error) {
    console.error('Cloudinary avatar upload error:', error);
    res.status(500).json({ message: 'Error uploading avatar' });
  }
});

// Upload logo (Super Admin only)
router.post('/logo', superAdminAuth, async (req, res) => {
  console.log('🚀 ===== LOGO UPLOAD START =====');
  console.log('⏰ Timestamp:', new Date().toISOString());
  
  try {
    console.log('🔐 Authentication passed - Super Admin verified');
    console.log('📋 Request headers:', {
      'content-type': req.headers['content-type'],
      'content-length': req.headers['content-length'],
      'user-agent': req.headers['user-agent']
    });
    
    console.log('📁 Files object check:');
    console.log('  - req.files exists:', !!req.files);
    console.log('  - req.files type:', typeof req.files);
    console.log('  - req.files keys:', req.files ? Object.keys(req.files) : 'No files object');
    
    console.log('📋 Body object check:');
    console.log('  - req.body exists:', !!req.body);
    console.log('  - req.body type:', typeof req.body);
    console.log('  - req.body keys:', req.body ? Object.keys(req.body) : 'No body object');
    
    if (!req.files) {
      console.log('❌ req.files is undefined or null');
      return res.status(400).json({ message: 'No files in request' });
    }
    
    if (!req.files.logo) {
      console.log('❌ req.files.logo is undefined or null');
      console.log('📋 Available files:', Object.keys(req.files));
      return res.status(400).json({ message: 'No logo file found in request' });
    }

    const file = req.files.logo;
    console.log('📄 File object analysis:');
    console.log('  - file exists:', !!file);
    console.log('  - file type:', typeof file);
    console.log('  - file properties:', Object.keys(file || {}));
    console.log('  - file.name:', file.name);
    console.log('  - file.size:', file.size);
    console.log('  - file.mimetype:', file.mimetype);
    console.log('  - file.data exists:', !!file.data);
    console.log('  - file.data type:', typeof file.data);
    console.log('  - file.data length:', file.data ? file.data.length : 'N/A');
    
    // Validate file type
    console.log('🔍 Validating file type...');
    if (!file.mimetype || !file.mimetype.startsWith('image/')) {
      console.log('❌ Invalid file type:', file.mimetype);
      return res.status(400).json({ message: 'Only image files are allowed' });
    }
    console.log('✅ File type validation passed');

    // Validate file size (2MB limit for logos)
    console.log('🔍 Validating file size...');
    console.log('  - File size:', file.size, 'bytes');
    console.log('  - Max allowed:', 2 * 1024 * 1024, 'bytes');
    if (file.size > 2 * 1024 * 1024) {
      console.log('❌ File too large');
      return res.status(400).json({ message: 'File size must be less than 2MB' });
    }
    console.log('✅ File size validation passed');

    // Read file data
    console.log('📖 Processing file data...');
    const fileData = file.data;
    
    if (!fileData) {
      console.log('❌ File data is empty or undefined');
      console.log('  - file.data:', fileData);
      console.log('  - file.data type:', typeof fileData);
      return res.status(400).json({ message: 'File data is empty' });
    }
    
    console.log('📊 File data details:');
    console.log('  - Data length:', fileData.length);
    console.log('  - Data type:', typeof fileData);
    console.log('  - Is Buffer:', Buffer.isBuffer(fileData));
    
    console.log('🔤 Converting to base64...');
    const base64String = `data:${file.mimetype};base64,${fileData.toString('base64')}`;
    console.log('  - Base64 string length:', base64String.length);
    console.log('  - Base64 starts with:', base64String.substring(0, 50) + '...');
    
    // Upload to Cloudinary with logo-specific folder
    console.log('☁️ Starting Cloudinary upload...');
    console.log('  - Folder: ecommerce-logos');
    console.log('  - Base64 length:', base64String.length);
    
    const result = await uploadBase64Image(base64String, 'ecommerce-logos');
    console.log('✅ Cloudinary upload successful!');
    console.log('  - URL:', result.url);
    console.log('  - Public ID:', result.publicId);
    console.log('  - Result type:', typeof result);
    console.log('  - Result keys:', Object.keys(result || {}));

    console.log('📤 Sending success response...');
    const response = {
      message: 'Logo uploaded successfully',
      url: result.url,
      publicId: result.publicId
    };
    console.log('📋 Response object:', response);
    
    res.json(response);
    console.log('✅ ===== LOGO UPLOAD SUCCESS =====');
    
  } catch (error) {
    console.error('❌ ===== LOGO UPLOAD ERROR =====');
    console.error('⏰ Error timestamp:', new Date().toISOString());
    console.error('🚨 Error type:', error.constructor.name);
    console.error('📝 Error message:', error.message);
    console.error('📚 Error stack:', error.stack);
    console.error('🔍 Error details:', {
      name: error.name,
      code: error.code,
      status: error.status,
      statusCode: error.statusCode
    });
    
    if (error.response) {
      console.error('📡 Error response data:', error.response.data);
      console.error('📡 Error response status:', error.response.status);
      console.error('📡 Error response headers:', error.response.headers);
    }
    
    console.error('❌ ===== END ERROR LOG =====');
    res.status(500).json({ 
      message: 'Error uploading logo',
      error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
    });
  }
});

// Upload size chart (Admin only)
router.post('/size-chart', adminAuth, async (req, res) => {
  console.log('🚀 ===== SIZE CHART UPLOAD START =====');
  
  try {
    console.log('🔐 Authentication passed - Admin verified');
    
    if (!req.files) {
      console.log('❌ req.files is undefined');
      return res.status(400).json({ message: 'No files in request' });
    }
    
    if (!req.files.image) {
      console.log('❌ req.files.image is undefined');
      return res.status(400).json({ message: 'No image file found' });
    }

    const file = req.files.image;
    console.log('📄 File details:', {
      name: file.name,
      size: file.size,
      mimetype: file.mimetype
    });
    
    // Validate file type
    if (!file.mimetype || !file.mimetype.startsWith('image/')) {
      return res.status(400).json({ message: 'Only image files are allowed' });
    }
    
    // Validate file size (5MB limit)
    if (file.size > 5 * 1024 * 1024) {
      return res.status(400).json({ message: 'File size must be less than 5MB' });
    }
    
    // Read file data
    const fileData = file.data;
    const base64String = `data:${file.mimetype};base64,${fileData.toString('base64')}`;
    
    // Upload to Cloudinary
    console.log('☁️ Uploading to Cloudinary...');
    const result = await uploadBase64Image(base64String, 'size-charts');
    
    console.log('✅ Upload successful:', result.url);
    
    res.json({
      success: true,
      message: 'Size chart uploaded successfully',
      url: result.url,
      publicId: result.publicId
    });
    
  } catch (error) {
    console.error('❌ Size chart upload error:', error);
    res.status(500).json({ 
      success: false,
      message: 'Error uploading size chart',
      error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
    });
  }
});

module.exports = router;
// Upload theme background for type7 (Super Admin only)
router.post('/theme-background', superAdminAuth, async (req, res) => {
  try {
    if (!req.files || !req.files.image) {
      return res.status(400).json({ success: false, message: 'No image file provided' });
    }

    const file = req.files.image;
    if (!file.mimetype || !file.mimetype.startsWith('image/')) {
      return res.status(400).json({ success: false, message: 'Only image files are allowed' });
    }
    if (file.size > 8 * 1024 * 1024) {
      return res.status(400).json({ success: false, message: 'File size must be less than 8MB' });
    }

    const base64String = `data:${file.mimetype};base64,${file.data.toString('base64')}`;
    const result = await uploadBase64Image(base64String, 'theme-backgrounds');
    res.json({ success: true, url: result.url, publicId: result.publicId });
  } catch (error) {
    console.error('Theme background upload error:', error);
    res.status(500).json({ success: false, message: 'Failed to upload background image' });
  }
});
