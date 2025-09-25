const cloudinary = require('cloudinary').v2;
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const multer = require('multer');

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});

// Configure Cloudinary storage
const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: 'ecommerce-products',
    allowed_formats: ['jpg', 'jpeg', 'png', 'gif', 'webp'],
    transformation: [
      { width: 800, height: 800, crop: 'limit' }, // Resize large images
      { quality: 'auto:good' } // Optimize quality
    ]
  }
});

// Configure multer for file uploads
const upload = multer({
  storage: storage,
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB limit
    files: 10 // Maximum 10 files
  },
  fileFilter: (req, file, cb) => {
    // Check file type
    if (file.mimetype.startsWith('image/')) {
      cb(null, true);
    } else {
      cb(new Error('Only image files are allowed!'), false);
    }
  }
});

// Middleware for single image upload
const uploadSingle = upload.single('image');

// Middleware for multiple image uploads
const uploadMultiple = upload.array('images', 10);

// Helper function to delete image from Cloudinary
const deleteImage = async (publicId) => {
  try {
    if (!publicId) {
      console.log('No public ID provided for Cloudinary deletion');
      return { result: 'no_public_id' };
    }
    
    const result = await cloudinary.uploader.destroy(publicId);
    console.log('Image deleted from Cloudinary:', result);
    return result;
  } catch (error) {
    console.error('Error deleting image from Cloudinary:', error);
    
    // Don't throw error for non-critical Cloudinary failures
    // Just log and return error info
    return {
      error: true,
      message: error.message,
      publicId: publicId
    };
  }
};

// Helper function to extract public ID from Cloudinary URL
const getPublicIdFromUrl = (url) => {
  if (!url) return null;
  
  try {
    // Extract public ID from Cloudinary URL
    // Example URL: https://res.cloudinary.com/cloud_name/image/upload/v1234567890/folder/image.jpg
    const urlParts = url.split('/');
    const uploadIndex = urlParts.findIndex(part => part === 'upload');
    
    if (uploadIndex !== -1 && uploadIndex + 2 < urlParts.length) {
      // Get everything after 'upload' and before the file extension
      const publicIdParts = urlParts.slice(uploadIndex + 2);
      const lastPart = publicIdParts[publicIdParts.length - 1];
      const publicId = publicIdParts.slice(0, -1).join('/') + '/' + lastPart.split('.')[0];
      return publicId;
    }
    
    return null;
  } catch (error) {
    console.error('Error extracting public ID from URL:', error);
    return null;
  }
};

// Helper function to upload base64 image to Cloudinary
const uploadBase64Image = async (base64String, folder = 'ecommerce-products') => {
  try {
    const result = await cloudinary.uploader.upload(base64String, {
      folder: folder,
      transformation: [
        { width: 800, height: 800, crop: 'limit' },
        { quality: 'auto:good' }
      ]
    });
    
    return {
      url: result.secure_url,
      publicId: result.public_id
    };
  } catch (error) {
    console.error('Error uploading base64 image to Cloudinary:', error);
    throw error;
  }
};

module.exports = {
  cloudinary,
  upload,
  uploadSingle,
  uploadMultiple,
  deleteImage,
  getPublicIdFromUrl,
  uploadBase64Image
};
