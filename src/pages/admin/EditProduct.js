import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from '../../config/axios';
import { 
  FaUpload, 
  FaTrash, 
  FaPlus, 
  FaSave, 
  FaArrowLeft, 
  FaCloudUploadAlt,
  FaImage,
  FaTag,
  FaPalette,
  FaListUl,
  FaBox,
  FaDollarSign,
  FaLayerGroup,
  FaCheckCircle,
  FaTimes,
  FaSpinner,
  FaStar,
  FaEdit
} from 'react-icons/fa';
import { toast } from 'react-toastify';

const EditProduct = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [imageUploading, setImageUploading] = useState(false);
  const [categories, setCategories] = useState([]);
  const [brands, setBrands] = useState([]);
  
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    originalPrice: '',
    quantity: '',
    shippingCharge: '',
    category: '',
    brand: '',
    images: [],
    thumbnailIndex: 0,
    colors: [],
    sizes: [],
    features: [],
    isNewProduct: false,
    isFeatured: false,
    isSold: false
  });

  useEffect(() => {
    fetchProduct();
    fetchCategories();
    fetchBrands();
  }, [id]);

  const fetchProduct = async () => {
    try {
      const response = await axios.get(`/api/admin/products/${id}`);
      const product = response.data;
      
      setFormData({
        name: product.name || '',
        description: product.description || '',
        price: product.price || '',
        originalPrice: product.originalPrice || '',
        quantity: product.quantity || '',
        shippingCharge: product.shippingCharge || '',
        category: product.category || '',
        brand: product.brand || '',
        images: product.images || [],
        thumbnailIndex: product.thumbnailIndex || 0,
        colors: product.colors || [],
        sizes: product.sizes || [],
        features: product.features || [],
        isNewProduct: product.isNewProduct || false,
        isFeatured: product.isFeatured || false,
        isSold: product.isSold || false
      });
    } catch (error) {
      toast.error('Failed to load product');
      console.error('Error fetching product:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchCategories = async () => {
    try {
      const response = await axios.get('/api/products/categories/list');
      console.log('Categories response:', response.data);
      setCategories(response.data || []);
    } catch (error) {
      console.error('Error fetching categories:', error);
      setCategories([]);
    }
  };

  const fetchBrands = async () => {
    try {
      const response = await axios.get('/api/products/brands/list');
      console.log('Brands response:', response.data);
      setBrands(response.data || []);
    } catch (error) {
      console.error('Error fetching brands:', error);
      setBrands([]);
    }
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    
    setFormData(prev => {
      let newData = {
        ...prev,
        [name]: type === 'checkbox' ? checked : value
      };
      
      // If marking as sold, automatically set quantity to 0
      if (name === 'isSold' && checked) {
        newData.quantity = '0';
      }
      
      return newData;
    });
  };

  const handleImageUpload = async (e) => {
    const files = Array.from(e.target.files);
    
    if (files.length === 0) return;
    
    setImageUploading(true);
    
    try {
      // Convert files to base64
      const imagePromises = files.map(file => {
        return new Promise((resolve) => {
          const reader = new FileReader();
          reader.onload = (e) => resolve(e.target.result);
          reader.readAsDataURL(file);
        });
      });

      const base64Images = await Promise.all(imagePromises);
      
      // Upload to Cloudinary via backend
      const response = await axios.post('/api/upload/base64-images', {
        images: base64Images
      });

      const cloudinaryUrls = response.data.images.map(img => img.url);
      
      setFormData(prev => ({
        ...prev,
        images: [...prev.images, ...cloudinaryUrls]
      }));
      
      toast.success(`${files.length} image(s) uploaded successfully!`);
    } catch (error) {
      console.error('Image upload error:', error);
      toast.error('Failed to upload images. Please try again.');
    } finally {
      setImageUploading(false);
    }
  };

  const removeImage = async (index) => {
    const imageUrl = formData.images[index];
    
    try {
      // Delete from Cloudinary if it's a Cloudinary URL
      if (imageUrl && imageUrl.includes('cloudinary.com')) {
        await axios.delete('/api/upload/images', {
          data: { url: imageUrl }
        });
      }
      
      setFormData(prev => ({
        ...prev,
        images: prev.images.filter((_, i) => i !== index),
        thumbnailIndex: prev.thumbnailIndex >= index ? Math.max(0, prev.thumbnailIndex - 1) : prev.thumbnailIndex
      }));
      
      toast.success('Image removed successfully!');
    } catch (error) {
      console.error('Error removing image:', error);
      toast.error('Failed to remove image. Please try again.');
    }
  };

  const setThumbnail = (index) => {
    setFormData(prev => ({
      ...prev,
      thumbnailIndex: index
    }));
  };

  const addColor = () => {
    setFormData(prev => ({
      ...prev,
      colors: [...prev.colors, { name: '', code: '#000000' }]
    }));
  };

  const removeColor = (index) => {
    setFormData(prev => ({
      ...prev,
      colors: prev.colors.filter((_, i) => i !== index)
    }));
  };

  const updateColor = (index, field, value) => {
    setFormData(prev => ({
      ...prev,
      colors: prev.colors.map((color, i) => 
        i === index ? { ...color, [field]: value } : color
      )
    }));
  };

  const addSize = () => {
    setFormData(prev => ({
      ...prev,
      sizes: [...prev.sizes, { name: '', available: true }]
    }));
  };

  const removeSize = (index) => {
    setFormData(prev => ({
      ...prev,
      sizes: prev.sizes.filter((_, i) => i !== index)
    }));
  };

  const updateSize = (index, field, value) => {
    setFormData(prev => ({
      ...prev,
      sizes: prev.sizes.map((size, i) => 
        i === index ? { ...size, [field]: value } : size
      )
    }));
  };

  const addFeature = () => {
    setFormData(prev => ({
      ...prev,
      features: [...prev.features, '']
    }));
  };

  const removeFeature = (index) => {
    setFormData(prev => ({
      ...prev,
      features: prev.features.filter((_, i) => i !== index)
    }));
  };

  const updateFeature = (index, value) => {
    setFormData(prev => ({
      ...prev,
      features: prev.features.map((feature, i) => 
        i === index ? value : feature
      )
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);

    try {
      // Filter out empty colors, sizes, and features
      const cleanedData = {
        ...formData,
        colors: formData.colors.filter(color => color.name.trim()),
        sizes: formData.sizes.filter(size => size.name.trim()),
        features: formData.features.filter(feature => feature.trim())
      };

      await axios.put(`/api/admin/products/${id}`, cleanedData);
      toast.success('Product updated successfully!');
      navigate('/admin/products');
    } catch (error) {
      toast.error('Failed to update product');
      console.error('Error updating product:', error);
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen  flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 sm:h-12 sm:w-12 border-b-2 border-blue-600 mx-auto mb-3 sm:mb-4"></div>
          <p className="text-xs sm:text-sm text-gray-600">Loading product...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen ">
      <div className="px-2 py-3 sm:px-4 lg:px-6 xl:px-8 sm:py-4 lg:py-6">
        {/* Header Section */}
        <div className="mb-4 sm:mb-6 lg:mb-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <button
                onClick={() => navigate('/admin/products')}
                className="p-2 sm:p-3 bg-white border border-gray-200 rounded-lg sm:rounded-xl text-gray-600 hover:text-gray-900 hover:bg-gray-50 transition-all duration-200 shadow-sm"
              >
                <FaArrowLeft className="w-4 h-4 sm:w-5 sm:h-5" />
          </button>
              <div>
                <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-900">Edit Product</h1>
                <p className="text-xs sm:text-sm lg:text-base text-gray-600">Update product information and details</p>
              </div>
            </div>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-6 lg:space-y-8">
            {/* Basic Information */}
          <div className="bg-white rounded-lg sm:rounded-xl lg:rounded-2xl shadow-sm border border-gray-100 p-3 sm:p-4 lg:p-6">
            <div className="flex items-center space-x-2 sm:space-x-3 mb-4 sm:mb-6">
              <div className="w-8 h-8 sm:w-10 sm:h-10 bg-blue-100 rounded-lg sm:rounded-xl flex items-center justify-center">
                <FaBox className="w-4 h-4 sm:w-5 sm:h-5 text-blue-600" />
              </div>
              <h3 className="text-lg sm:text-xl lg:text-2xl font-semibold text-gray-900">Basic Information</h3>
            </div>
            
            <div className="space-y-3 sm:space-y-4">
              <div>
                <label htmlFor="name" className="block text-xs sm:text-sm font-semibold text-gray-700 mb-1 sm:mb-2">
                  Product Name *
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  className="w-full px-3 sm:px-4 py-2 sm:py-3 border border-gray-200 rounded-lg sm:rounded-xl text-xs sm:text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
                  required
                />
              </div>

              <div>
                <label htmlFor="description" className="block text-xs sm:text-sm font-semibold text-gray-700 mb-1 sm:mb-2">
                  Description *
                </label>
                <textarea
                  id="description"
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  rows="3"
                  className="w-full px-3 sm:px-4 py-2 sm:py-3 border border-gray-200 rounded-lg sm:rounded-xl text-xs sm:text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 resize-none"
                  required
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                <div>
                  <label htmlFor="price" className="block text-xs sm:text-sm font-semibold text-gray-700 mb-1 sm:mb-2">
                    Price *
                  </label>
                  <div className="relative">
                    <FaDollarSign className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-3 h-3 sm:w-4 sm:h-4" />
                  <input
                    type="number"
                    id="price"
                    name="price"
                    value={formData.price}
                    onChange={handleInputChange}
                      className="w-full pl-8 sm:pl-10 pr-3 sm:pr-4 py-2 sm:py-3 border border-gray-200 rounded-lg sm:rounded-xl text-xs sm:text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
                    min="0"
                    step="0.01"
                      required
                  />
                  </div>
                </div>

                <div>
                  <label htmlFor="originalPrice" className="block text-xs sm:text-sm font-semibold text-gray-700 mb-1 sm:mb-2">
                    Original Price
                  </label>
                  <div className="relative">
                    <FaDollarSign className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-3 h-3 sm:w-4 sm:h-4" />
                  <input
                    type="number"
                    id="originalPrice"
                    name="originalPrice"
                    value={formData.originalPrice}
                    onChange={handleInputChange}
                      className="w-full pl-8 sm:pl-10 pr-3 sm:pr-4 py-2 sm:py-3 border border-gray-200 rounded-lg sm:rounded-xl text-xs sm:text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
                    min="0"
                    step="0.01"
                  />
                  </div>
                </div>
                </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                <div>
                  <label htmlFor="quantity" className="block text-xs sm:text-sm font-semibold text-gray-700 mb-1 sm:mb-2">
                    Quantity *
                  </label>
                  <input
                    type="number"
                    id="quantity"
                    name="quantity"
                    value={formData.quantity}
                    onChange={handleInputChange}
                    className="w-full px-3 sm:px-4 py-2 sm:py-3 border border-gray-200 rounded-lg sm:rounded-xl text-xs sm:text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
                    min="0"
                    required
                  />
                </div>

                <div>
                  <label htmlFor="shippingCharge" className="block text-xs sm:text-sm font-semibold text-gray-700 mb-1 sm:mb-2">
                    Shipping Charge
                  </label>
                  <div className="relative">
                    <FaDollarSign className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-3 h-3 sm:w-4 sm:h-4" />
                    <input
                      type="number"
                      id="shippingCharge"
                      name="shippingCharge"
                      value={formData.shippingCharge}
                      onChange={handleInputChange}
                      className="w-full pl-8 sm:pl-10 pr-3 sm:pr-4 py-2 sm:py-3 border border-gray-200 rounded-lg sm:rounded-xl text-xs sm:text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
                      min="0"
                      step="0.01"
                      placeholder="0.00"
                    />
                  </div>
                  <p className="text-xs text-gray-500 mt-1">Leave as 0 for free shipping on this product</p>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                <div>
                  <label htmlFor="category" className="block text-xs sm:text-sm font-semibold text-gray-700 mb-1 sm:mb-2">
                    Category *
                  </label>
                  <select
                    id="category"
                    name="category"
                    value={formData.category}
                    onChange={handleInputChange}
                    className="w-full px-3 sm:px-4 py-2 sm:py-3 border border-gray-200 rounded-lg sm:rounded-xl text-xs sm:text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 bg-white"
                    required
                  >
                    <option value="">Select Category</option>
                    {categories.length === 0 ? (
                      <option value="" disabled>Loading categories...</option>
                    ) : (
                      categories.map((category, index) => (
                        <option key={index} value={category}>{category}</option>
                      ))
                    )}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                <div>
                  <label htmlFor="brand" className="block text-xs sm:text-sm font-semibold text-gray-700 mb-1 sm:mb-2">
                    Brand
                  </label>
                  <select
                    id="brand"
                    name="brand"
                    value={formData.brand}
                    onChange={handleInputChange}
                    className="w-full px-3 sm:px-4 py-2 sm:py-3 border border-gray-200 rounded-lg sm:rounded-xl text-xs sm:text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 bg-white"
                  >
                    <option value="">Select Brand</option>
                    {brands.length === 0 ? (
                      <option value="" disabled>Loading brands...</option>
                    ) : (
                      brands.map((brand, index) => (
                        <option key={index} value={brand}>{brand}</option>
                      ))
                    )}
                  </select>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-2 sm:gap-4">
                <label className="flex items-center space-x-2 p-2 sm:p-3 bg-gray-50 rounded-lg sm:rounded-xl cursor-pointer hover:bg-gray-100 transition-all duration-200">
                  <input
                    type="checkbox"
                    name="isNewProduct"
                    checked={formData.isNewProduct}
                    onChange={handleInputChange}
                    className="w-3 h-3 sm:w-4 sm:h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                  />
                  <span className="text-xs sm:text-sm font-medium text-gray-700">Mark as New Product</span>
                </label>

                <label className="flex items-center space-x-2 p-2 sm:p-3 bg-gray-50 rounded-lg sm:rounded-xl cursor-pointer hover:bg-gray-100 transition-all duration-200">
                  <input
                    type="checkbox"
                    name="isFeatured"
                    checked={formData.isFeatured}
                    onChange={handleInputChange}
                    className="w-3 h-3 sm:w-4 sm:h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                  />
                  <span className="text-xs sm:text-sm font-medium text-gray-700">Mark as Featured</span>
                </label>

                <label className="flex items-center space-x-2 p-2 sm:p-3 bg-gray-50 rounded-lg sm:rounded-xl cursor-pointer hover:bg-gray-100 transition-all duration-200">
                  <input
                    type="checkbox"
                    name="isSold"
                    checked={formData.isSold}
                    onChange={handleInputChange}
                    className="w-3 h-3 sm:w-4 sm:h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                  />
                  <span className="text-xs sm:text-sm font-medium text-gray-700">Mark as Sold</span>
                </label>
                </div>
              </div>
            </div>

          {/* Product Images */}
          <div className="bg-white rounded-lg sm:rounded-xl lg:rounded-2xl shadow-sm border border-gray-100 p-3 sm:p-4 lg:p-6">
            <div className="flex items-center space-x-2 sm:space-x-3 mb-4 sm:mb-6">
              <div className="w-8 h-8 sm:w-10 sm:h-10 bg-green-100 rounded-lg sm:rounded-xl flex items-center justify-center">
                <FaImage className="w-4 h-4 sm:w-5 sm:h-5 text-green-600" />
              </div>
              <h3 className="text-lg sm:text-xl lg:text-2xl font-semibold text-gray-900">Product Images</h3>
            </div>
            
            <div>
              <label 
                htmlFor="images" 
                className="flex flex-col items-center justify-center p-4 sm:p-6 border-2 border-dashed border-gray-300 rounded-lg sm:rounded-xl bg-gray-50 hover:bg-gray-100 cursor-pointer transition-all duration-200"
              >
                {imageUploading ? (
                  <div className="text-center">
                    <FaSpinner className="w-6 h-6 sm:w-8 sm:h-8 text-blue-600 animate-spin mx-auto mb-2" />
                    <p className="text-xs sm:text-sm text-blue-600">Uploading images...</p>
                  </div>
                ) : (
                  <div className="text-center">
                    <FaUpload className="w-6 h-6 sm:w-8 sm:h-8 text-gray-400 mx-auto mb-2" />
                    <p className="text-xs sm:text-sm font-medium text-gray-700">Upload Images</p>
                    <p className="text-xs text-gray-500 mt-1">Click to select or drag and drop</p>
                  </div>
                )}
                <input
                  type="file"
                  id="images"
                  multiple
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="hidden"
                  disabled={imageUploading}
                />
              </label>
              </div>

              {formData.images.length > 0 && (
              <div className="mt-4 sm:mt-6">
                <h4 className="text-sm sm:text-base font-semibold text-gray-900 mb-3 sm:mb-4">Uploaded Images</h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 sm:gap-4">
                  {formData.images.map((image, index) => (
                    <div key={index} className="bg-white border border-gray-200 rounded-lg sm:rounded-xl overflow-hidden shadow-sm">
                      <div className="relative aspect-square">
                        <img src={image} alt={`Product ${index + 1}`} className="w-full h-full object-cover" />
                        {index === formData.thumbnailIndex && (
                          <div className="absolute top-2 left-2 bg-yellow-500 text-white px-2 py-1 rounded-full text-xs font-medium flex items-center space-x-1">
                            <FaStar className="w-3 h-3" />
                            <span>Thumbnail</span>
                          </div>
                        )}
                      </div>
                      <div className="p-2 sm:p-3 space-y-2">
                        <button
                          type="button"
                          onClick={() => setThumbnail(index)}
                          className="w-full px-2 py-1.5 sm:px-3 sm:py-2 bg-blue-50 text-blue-700 rounded-lg text-xs sm:text-sm font-medium hover:bg-blue-100 transition-all duration-200 flex items-center justify-center space-x-1"
                          disabled={index === formData.thumbnailIndex}
                        >
                          <FaStar className="w-3 h-3 sm:w-4 sm:h-4" />
                          <span>Set Thumbnail</span>
                        </button>
                        <button
                          type="button"
                          onClick={() => removeImage(index)}
                          className="w-full px-2 py-1.5 sm:px-3 sm:py-2 bg-red-50 text-red-700 rounded-lg text-xs sm:text-sm font-medium hover:bg-red-100 transition-all duration-200 flex items-center justify-center space-x-1"
                        >
                          <FaTrash className="w-3 h-3 sm:w-4 sm:h-4" />
                          <span>Remove</span>
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
                </div>
              )}
            </div>

          {/* Available Sizes */}
          <div className="bg-white rounded-lg sm:rounded-xl lg:rounded-2xl shadow-sm border border-gray-100 p-3 sm:p-4 lg:p-6">
            <div className="flex items-center justify-between mb-4 sm:mb-6">
              <div className="flex items-center space-x-2 sm:space-x-3">
                <div className="w-8 h-8 sm:w-10 sm:h-10 bg-purple-100 rounded-lg sm:rounded-xl flex items-center justify-center">
                  <FaTag className="w-4 h-4 sm:w-5 sm:h-5 text-purple-600" />
                </div>
                <h3 className="text-lg sm:text-xl lg:text-2xl font-semibold text-gray-900">Available Sizes</h3>
              </div>
              <button 
                type="button" 
                onClick={addSize} 
                className="px-3 py-2 sm:px-4 sm:py-2.5 bg-purple-600 text-white rounded-lg sm:rounded-xl text-xs sm:text-sm font-medium hover:bg-purple-700 transition-all duration-200 flex items-center space-x-1"
              >
                <FaPlus className="w-3 h-3 sm:w-4 sm:h-4" />
                <span className="hidden sm:inline">Add Size</span>
                <span className="sm:hidden">Add</span>
              </button>
            </div>
            
            <div className="space-y-3 sm:space-y-4">
              {formData.sizes.map((size, index) => (
                <div key={index} className="flex items-center space-x-2 sm:space-x-3 p-3 sm:p-4 bg-purple-50 rounded-lg sm:rounded-xl">
                  <input
                    type="text"
                    placeholder="Size name (e.g., S, M, L, XL)"
                    value={size.name}
                    onChange={(e) => updateSize(index, 'name', e.target.value)}
                    className="flex-1 px-3 sm:px-4 py-2 sm:py-3 border border-purple-200 rounded-lg sm:rounded-xl text-xs sm:text-sm focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-all duration-200 bg-white"
                  />
                  <label className="flex items-center space-x-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={size.available}
                      onChange={(e) => updateSize(index, 'available', e.target.checked)}
                      className="w-3 h-3 sm:w-4 sm:h-4 text-purple-600 border-purple-300 rounded focus:ring-purple-500"
                    />
                    <span className="text-xs sm:text-sm text-purple-700 font-medium">Available</span>
                  </label>
                  <button
                    type="button"
                    onClick={() => removeSize(index)}
                    className="p-2 text-purple-500 hover:text-purple-700 hover:bg-purple-100 rounded-lg transition-all duration-200"
                  >
                    <FaTimes className="w-3 h-3 sm:w-4 sm:h-4" />
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Available Colors */}
          <div className="bg-white rounded-lg sm:rounded-xl lg:rounded-2xl shadow-sm border border-gray-100 p-3 sm:p-4 lg:p-6">
            <div className="flex items-center justify-between mb-4 sm:mb-6">
              <div className="flex items-center space-x-2 sm:space-x-3">
                <div className="w-8 h-8 sm:w-10 sm:h-10 bg-pink-100 rounded-lg sm:rounded-xl flex items-center justify-center">
                  <FaPalette className="w-4 h-4 sm:w-5 sm:h-5 text-pink-600" />
                </div>
                <h3 className="text-lg sm:text-xl lg:text-2xl font-semibold text-gray-900">Available Colors</h3>
              </div>
              <button 
                type="button" 
                onClick={addColor} 
                className="px-3 py-2 sm:px-4 sm:py-2.5 bg-pink-600 text-white rounded-lg sm:rounded-xl text-xs sm:text-sm font-medium hover:bg-pink-700 transition-all duration-200 flex items-center space-x-1"
              >
                <FaPlus className="w-3 h-3 sm:w-4 sm:h-4" />
                <span className="hidden sm:inline">Add Color</span>
                <span className="sm:hidden">Add</span>
              </button>
            </div>

            <div className="space-y-3 sm:space-y-4">
              {formData.colors.map((color, index) => (
                <div key={index} className="flex items-center space-x-2 sm:space-x-3 p-3 sm:p-4 bg-pink-50 rounded-lg sm:rounded-xl">
                  <input
                    type="text"
                    placeholder="Color name (e.g., Red, Blue)"
                    value={color.name}
                    onChange={(e) => updateColor(index, 'name', e.target.value)}
                    className="flex-1 px-3 sm:px-4 py-2 sm:py-3 border border-pink-200 rounded-lg sm:rounded-xl text-xs sm:text-sm focus:ring-2 focus:ring-pink-500 focus:border-pink-500 transition-all duration-200 bg-white"
                  />
                  <input
                    type="color"
                    value={color.code}
                    onChange={(e) => updateColor(index, 'code', e.target.value)}
                    className="w-12 h-10 sm:w-14 sm:h-12 border border-pink-200 rounded-lg sm:rounded-xl cursor-pointer"
                  />
                  <button
                    type="button"
                    onClick={() => removeColor(index)}
                    className="p-2 text-pink-500 hover:text-pink-700 hover:bg-pink-100 rounded-lg transition-all duration-200"
                  >
                    <FaTimes className="w-3 h-3 sm:w-4 sm:h-4" />
                  </button>
                </div>
              ))}
            </div>
            </div>

          {/* Product Features */}
          <div className="bg-white rounded-lg sm:rounded-xl lg:rounded-2xl shadow-sm border border-gray-100 p-3 sm:p-4 lg:p-6">
            <div className="flex items-center justify-between mb-4 sm:mb-6">
              <div className="flex items-center space-x-2 sm:space-x-3">
                <div className="w-8 h-8 sm:w-10 sm:h-10 bg-orange-100 rounded-lg sm:rounded-xl flex items-center justify-center">
                  <FaListUl className="w-4 h-4 sm:w-5 sm:h-5 text-orange-600" />
                </div>
                <h3 className="text-lg sm:text-xl lg:text-2xl font-semibold text-gray-900">Product Features</h3>
              </div>
                  <button
                    type="button"
                onClick={addFeature} 
                className="px-3 py-2 sm:px-4 sm:py-2.5 bg-orange-600 text-white rounded-lg sm:rounded-xl text-xs sm:text-sm font-medium hover:bg-orange-700 transition-all duration-200 flex items-center space-x-1"
                  >
                <FaPlus className="w-3 h-3 sm:w-4 sm:h-4" />
                <span className="hidden sm:inline">Add Feature</span>
                <span className="sm:hidden">Add</span>
                  </button>
            </div>

            <div className="space-y-3 sm:space-y-4">
              {formData.features.map((feature, index) => (
                <div key={index} className="flex items-center space-x-2 sm:space-x-3 p-3 sm:p-4 bg-orange-50 rounded-lg sm:rounded-xl">
                  <input
                    type="text"
                    placeholder="Enter feature description"
                    value={feature}
                    onChange={(e) => updateFeature(index, e.target.value)}
                    className="flex-1 px-3 sm:px-4 py-2 sm:py-3 border border-orange-200 rounded-lg sm:rounded-xl text-xs sm:text-sm focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-all duration-200 bg-white"
                  />
                  <button
                    type="button"
                    onClick={() => removeFeature(index)}
                    className="p-2 text-orange-500 hover:text-orange-700 hover:bg-orange-100 rounded-lg transition-all duration-200"
                  >
                    <FaTimes className="w-3 h-3 sm:w-4 sm:h-4" />
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Form Actions */}
          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center">
            <button
              type="button"
              onClick={() => navigate('/admin/products')}
              className="flex-1 sm:flex-none px-4 py-3 sm:px-6 sm:py-3 bg-white border border-gray-200 text-gray-700 rounded-lg sm:rounded-xl text-xs sm:text-sm font-medium hover:bg-gray-50 transition-all duration-200 shadow-sm flex items-center justify-center space-x-2"
            >
              <FaArrowLeft className="w-3 h-3 sm:w-4 sm:h-4" />
              <span>Cancel</span>
            </button>
            <button
              type="submit"
              className="flex-1 sm:flex-none px-4 py-3 sm:px-6 sm:py-3 bg-blue-600 text-white rounded-lg sm:rounded-xl text-xs sm:text-sm font-medium hover:bg-blue-700 transition-all duration-200 shadow-sm flex items-center justify-center space-x-2"
              disabled={saving}
            >
              {saving ? (
                <>
                  <FaSpinner className="w-3 h-3 sm:w-4 sm:h-4 animate-spin" />
                  <span>Updating Product...</span>
                </>
              ) : (
                <>
                  <FaSave className="w-3 h-3 sm:w-4 sm:h-4" />
                  <span>Update Product</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditProduct;
