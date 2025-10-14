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
  console.log('☁️ ===== CLOUDINARY UPLOAD START =====');
  console.log('⏰ Timestamp:', new Date().toISOString());
  console.log('📁 Folder:', folder);
  console.log('📊 Base64 string length:', base64String ? base64String.length : 'undefined');
  console.log('🔍 Base64 starts with:', base64String ? base64String.substring(0, 50) + '...' : 'undefined');
  
  try {
    console.log('🔧 Cloudinary configuration check:');
    console.log('  - Cloud name:', process.env.CLOUDINARY_CLOUD_NAME ? 'Set' : 'Missing');
    console.log('  - API key:', process.env.CLOUDINARY_API_KEY ? 'Set' : 'Missing');
    console.log('  - API secret:', process.env.CLOUDINARY_API_SECRET ? 'Set' : 'Missing');
    
    console.log('📤 Uploading to Cloudinary...');
    const uploadOptions = {
      folder: folder,
      transformation: [
        { width: 800, height: 800, crop: 'limit' },
        { quality: 'auto:good' }
      ]
    };
    console.log('📋 Upload options:', uploadOptions);
    
    const result = await cloudinary.uploader.upload(base64String, uploadOptions);
    console.log('✅ Cloudinary upload successful!');
    console.log('📊 Result details:');
    console.log('  - URL:', result.secure_url);
    console.log('  - Public ID:', result.public_id);
    console.log('  - Format:', result.format);
    console.log('  - Width:', result.width);
    console.log('  - Height:', result.height);
    console.log('  - Size:', result.bytes, 'bytes');
    console.log('  - Result type:', typeof result);
    console.log('  - Result keys:', Object.keys(result || {}));
    
    const returnData = {
      url: result.secure_url,
      publicId: result.public_id
    };
    console.log('📤 Returning data:', returnData);
    console.log('✅ ===== CLOUDINARY UPLOAD SUCCESS =====');
    
    return returnData;
  } catch (error) {
    console.error('❌ ===== CLOUDINARY UPLOAD ERROR =====');
    console.error('⏰ Error timestamp:', new Date().toISOString());
    console.error('🚨 Error type:', error.constructor.name);
    console.error('📝 Error message:', error.message);
    console.error('📚 Error stack:', error.stack);
    console.error('🔍 Error details:', {
      name: error.name,
      code: error.code,
      status: error.status,
      statusCode: error.statusCode,
      http_code: error.http_code,
      request_id: error.request_id
    });
    
    if (error.response) {
      console.error('📡 Error response data:', error.response.data);
      console.error('📡 Error response status:', error.response.status);
      console.error('📡 Error response headers:', error.response.headers);
    }
    
    console.error('❌ ===== END CLOUDINARY ERROR LOG =====');
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
