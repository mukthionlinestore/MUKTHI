const express = require('express');
const { adminAuth, auth } = require('../middleware/auth');
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

module.exports = router;
