import React, { useState, useEffect } from 'react';
import axios from '../../config/axios';
import { 
  FaPlus, 
  FaEdit, 
  FaTrash, 
  FaSave, 
  FaTimes, 
  FaStar, 
  FaChartBar,
  FaTag,
  FaLayerGroup,
  FaSpinner,
  FaCheckCircle,
  FaExclamationTriangle,
  FaArrowLeft,
  FaFolder,
  FaFolderOpen,
  FaSort,
  FaSearch,
  FaGlobe,
  FaBuilding,
  FaCrown
} from 'react-icons/fa';
import { toast } from 'react-toastify';

const ManageBrands = () => {
  const [brands, setBrands] = useState([]);
  const [loading, setLoading] = useState(true);
  const [newBrand, setNewBrand] = useState({
    name: '',
    description: '',
    website: ''
  });
  const [editingId, setEditingId] = useState(null);
  const [editingBrand, setEditingBrand] = useState({
    name: '',
    description: '',
    website: ''
  });
  const [submitting, setSubmitting] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState('name');

  useEffect(() => {
    fetchBrands();
  }, []);

  const fetchBrands = async () => {
    try {
      setLoading(true);
      // Use the stats endpoint to get brands with product counts
      const response = await axios.get('/api/admin/brands/stats');
      console.log('Fetched brands:', response.data); // Debug log
      
      // The response should be an array of brands with counts
      if (Array.isArray(response.data)) {
        setBrands(response.data);
      } else {
        console.error('Unexpected response format:', response.data);
        setBrands([]);
      }
    } catch (error) {
      console.error('Error fetching brands:', error);
      toast.error('Failed to load brands. Please check your API connection.');
      setBrands([]);
    } finally {
      setLoading(false);
    }
  };

  const handleAddBrand = async (e) => {
    e.preventDefault();
    if (!newBrand.name.trim() || submitting) return;

    try {
      setSubmitting(true);
      console.log('Adding brand:', newBrand); // Debug log
      
      const brandData = {
        name: newBrand.name.trim(),
        description: newBrand.description.trim() || '',
        website: newBrand.website.trim() || '',
        logo: '' // You can add logo field later if needed
      };

      const response = await axios.post('/api/admin/brands', brandData);
      console.log('Add brand response:', response.data); // Debug log
      
      toast.success('Brand added successfully!');
      setNewBrand({ name: '', description: '', website: '' });
      await fetchBrands(); // Refresh the list
    } catch (error) {
      console.error('Error adding brand:', error);
      console.error('Error response:', error.response?.data); // Debug log
      toast.error(error.response?.data?.message || 'Failed to add brand');
    } finally {
      setSubmitting(false);
    }
  };

  const startEditing = (brand) => {
    console.log('Editing brand:', brand); // Debug log
    setEditingId(brand._id);
    setEditingBrand({
      name: brand.name || '',
      description: brand.description || '',
      website: brand.website || ''
    });
  };

  const cancelEditing = () => {
    setEditingId(null);
    setEditingBrand({ name: '', description: '', website: '' });
  };

  const handleUpdateBrand = async (brandId) => {
    if (!editingBrand.name.trim() || submitting) {
      cancelEditing();
      return;
    }

    try {
      setSubmitting(true);
      console.log('Updating brand:', brandId, editingBrand); // Debug log
      
      const updateData = {
        name: editingBrand.name.trim(),
        description: editingBrand.description.trim() || '',
        website: editingBrand.website.trim() || '',
        logo: '' // You can add logo field later if needed
      };

      const response = await axios.put(`/api/admin/brands/${brandId}`, updateData);
      console.log('Update brand response:', response.data); // Debug log
      
      toast.success('Brand updated successfully!');
      cancelEditing();
      await fetchBrands();
    } catch (error) {
      console.error('Error updating brand:', error);
      toast.error(error.response?.data?.message || 'Failed to update brand');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeleteBrand = async (brand) => {
    const brandName = brand.name || 'this brand';
    const brandId = brand._id;
    
    if (!window.confirm(`Are you sure you want to delete "${brandName}"? This action cannot be undone.`)) {
      return;
    }

    try {
      setSubmitting(true);
      console.log('Deleting brand:', brandId); // Debug log
      
      const response = await axios.delete(`/api/admin/brands/${brandId}`);
      console.log('Delete brand response:', response.data); // Debug log
      
      toast.success('Brand deleted successfully!');
      await fetchBrands();
    } catch (error) {
      console.error('Error deleting brand:', error);
      toast.error(error.response?.data?.message || 'Failed to delete brand');
    } finally {
      setSubmitting(false);
    }
  };

  // Filter and sort brands
  const filteredAndSortedBrands = brands
    .filter(brand => 
      brand.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (brand.description && brand.description.toLowerCase().includes(searchTerm.toLowerCase()))
    )
    .sort((a, b) => {
      switch (sortBy) {
        case 'name':
          return a.name.localeCompare(b.name);
        case 'count':
          return (b.productCount || 0) - (a.productCount || 0);
        case 'name_desc':
          return b.name.localeCompare(a.name);
        case 'count_asc':
          return (a.productCount || 0) - (b.productCount || 0);
        default:
          return a.name.localeCompare(b.name);
      }
    });

  if (loading) {
    return (
      <div className="min-h-screen  flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 sm:h-12 sm:w-12 border-b-2 border-blue-600 mx-auto mb-3 sm:mb-4"></div>
          <p className="text-xs sm:text-sm text-gray-600">Loading brands...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen ">
      <div className="px-2 py-3 sm:px-4 lg:px-6 xl:px-8 sm:py-4 lg:py-6">
        {/* Header Section */}
        <div className="mb-4 sm:mb-6 lg:mb-8">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 sm:gap-4">
            <div>
              <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-900 mb-1">Manage Brands</h1>
              <p className="text-xs sm:text-sm lg:text-base text-gray-600">Add and manage product brands and manufacturers</p>
            </div>
            <div className="flex items-center space-x-2 sm:space-x-3">
              <div className="bg-white border border-gray-200 rounded-lg sm:rounded-xl px-3 py-2 sm:px-4 sm:py-3 shadow-sm">
                <div className="flex items-center space-x-2">
                  <FaCrown className="w-4 h-4 sm:w-5 sm:h-5 text-purple-600" />
                  <span className="text-xs sm:text-sm font-medium text-gray-700">
                    {brands.length} Brands
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Add New Brand */}
        <div className="bg-white rounded-lg sm:rounded-xl lg:rounded-2xl shadow-sm border border-gray-100 p-3 sm:p-4 lg:p-6 mb-4 sm:mb-6">
          <div className="flex items-center space-x-2 sm:space-x-3 mb-4 sm:mb-6">
            <div className="w-8 h-8 sm:w-10 sm:h-10 bg-purple-100 rounded-lg sm:rounded-xl flex items-center justify-center">
              <FaPlus className="w-4 h-4 sm:w-5 sm:h-5 text-purple-600" />
            </div>
            <h3 className="text-lg sm:text-xl lg:text-2xl font-semibold text-gray-900">Add New Brand</h3>
          </div>
          
          <form onSubmit={handleAddBrand} className="space-y-3 sm:space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
              <input
                type="text"
                value={newBrand.name}
                onChange={(e) => setNewBrand({ ...newBrand, name: e.target.value })}
                placeholder="Brand name (e.g., Apple, Samsung, Nike)"
                className="px-3 sm:px-4 py-2 sm:py-3 border border-gray-200 rounded-lg sm:rounded-xl text-xs sm:text-sm focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-all duration-200"
                required
                disabled={submitting}
              />
              <input
                type="text"
                value={newBrand.description}
                onChange={(e) => setNewBrand({ ...newBrand, description: e.target.value })}
                placeholder="Brand description (optional)"
                className="px-3 sm:px-4 py-2 sm:py-3 border border-gray-200 rounded-lg sm:rounded-xl text-xs sm:text-sm focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-all duration-200"
                disabled={submitting}
              />
              <input
                type="url"
                value={newBrand.website}
                onChange={(e) => setNewBrand({ ...newBrand, website: e.target.value })}
                placeholder="Website URL (optional)"
                className="px-3 sm:px-4 py-2 sm:py-3 border border-gray-200 rounded-lg sm:rounded-xl text-xs sm:text-sm focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-all duration-200"
                disabled={submitting}
              />
            </div>
            <div className="flex justify-end">
              <button 
                type="submit" 
                className="px-4 py-2 sm:px-6 sm:py-3 bg-purple-600 text-white rounded-lg sm:rounded-xl text-xs sm:text-sm font-medium hover:bg-purple-700 transition-all duration-200 flex items-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed"
                disabled={submitting || !newBrand.name.trim()}
              >
                {submitting ? (
                  <>
                    <FaSpinner className="w-3 h-3 sm:w-4 sm:h-4 animate-spin" />
                    <span>Adding...</span>
                  </>
                ) : (
                  <>
                    <FaPlus className="w-3 h-3 sm:w-4 sm:h-4" />
                    <span>Add Brand</span>
                  </>
                )}
              </button>
            </div>
          </form>
        </div>

        {/* Search and Sort */}
        <div className="bg-white rounded-lg sm:rounded-xl lg:rounded-2xl shadow-sm border border-gray-100 p-3 sm:p-4 lg:p-6 mb-4 sm:mb-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
            <div className="relative">
              <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-3 h-3 sm:w-4 sm:h-4" />
              <input
                type="text"
                placeholder="Search brands..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-9 sm:pl-10 pr-3 sm:pr-4 py-2 sm:py-3 border border-gray-200 rounded-lg sm:rounded-xl text-xs sm:text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
              />
            </div>
            <div className="relative">
              <FaSort className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-3 h-3 sm:w-4 sm:h-4" />
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="w-full pl-9 sm:pl-10 pr-3 sm:pr-4 py-2 sm:py-3 border border-gray-200 rounded-lg sm:rounded-xl text-xs sm:text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 bg-white"
              >
                <option value="name">Name A-Z</option>
                <option value="name_desc">Name Z-A</option>
                <option value="count">Most Products</option>
                <option value="count_asc">Least Products</option>
              </select>
            </div>
          </div>
        </div>

        {/* Brands List */}
        <div className="bg-white rounded-lg sm:rounded-xl lg:rounded-2xl shadow-sm border border-gray-100 p-3 sm:p-4 lg:p-6">
          <div className="flex items-center justify-between mb-4 sm:mb-6">
            <div className="flex items-center space-x-2 sm:space-x-3">
              <div className="w-8 h-8 sm:w-10 sm:h-10 bg-purple-100 rounded-lg sm:rounded-xl flex items-center justify-center">
                <FaStar className="w-4 h-4 sm:w-5 sm:h-5 text-purple-600" />
              </div>
              <h3 className="text-lg sm:text-xl lg:text-2xl font-semibold text-gray-900">Existing Brands</h3>
            </div>
            <div className="text-xs sm:text-sm text-gray-500">
              {filteredAndSortedBrands.length} of {brands.length} brands
            </div>
          </div>
          
          {filteredAndSortedBrands.length === 0 ? (
            <div className="text-center py-8 sm:py-12">
              <div className="w-12 h-12 sm:w-16 sm:h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-3 sm:mb-4">
                <FaBuilding className="w-6 h-6 sm:w-8 sm:h-8 text-gray-400" />
              </div>
              <h4 className="text-base sm:text-lg font-semibold text-gray-900 mb-1 sm:mb-2">
                {searchTerm ? 'No brands found' : 'No brands yet'}
              </h4>
              <p className="text-xs sm:text-sm text-gray-600 mb-4">
                {searchTerm 
                  ? 'Try adjusting your search terms'
                  : 'Add your first brand to start organizing your products'
                }
              </p>
              {!searchTerm && (
                <button
                  onClick={() => document.querySelector('input[type="text"]')?.focus()}
                  className="inline-flex items-center px-3 py-2 sm:px-4 sm:py-2.5 bg-purple-600 text-white text-xs sm:text-sm font-medium rounded-lg hover:bg-purple-700 transition-all duration-200"
                >
                  <FaPlus className="w-3 h-3 sm:w-4 sm:h-4 mr-1.5 sm:mr-2" />
                  Add Brand
                </button>
              )}
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 sm:gap-4 lg:gap-6">
              {filteredAndSortedBrands.map((brand) => {
                const brandId = brand._id;
                const isEditing = editingId === brandId;
                
                return (
                  <div key={brandId} className="bg-gradient-to-br from-white to-gray-50 border border-gray-200 rounded-lg sm:rounded-xl lg:rounded-2xl shadow-sm hover:shadow-lg transition-all duration-300 group">
                    <div className="p-3 sm:p-4 lg:p-6">
                      {/* Brand Header */}
                      <div className="flex items-start justify-between mb-3 sm:mb-4">
                        <div className="flex-1 min-w-0">
                          {isEditing ? (
                            <div className="space-y-2">
                              <input
                                type="text"
                                value={editingBrand.name}
                                onChange={(e) => setEditingBrand({ ...editingBrand, name: e.target.value })}
                                className="w-full px-2 py-1.5 sm:px-3 sm:py-2 border border-purple-300 rounded-lg text-xs sm:text-sm focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-all duration-200"
                                placeholder="Brand name"
                                autoFocus
                                disabled={submitting}
                              />
                              <input
                                type="text"
                                value={editingBrand.description}
                                onChange={(e) => setEditingBrand({ ...editingBrand, description: e.target.value })}
                                className="w-full px-2 py-1.5 sm:px-3 sm:py-2 border border-purple-300 rounded-lg text-xs sm:text-sm focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-all duration-200"
                                placeholder="Description"
                                disabled={submitting}
                              />
                              <input
                                type="url"
                                value={editingBrand.website}
                                onChange={(e) => setEditingBrand({ ...editingBrand, website: e.target.value })}
                                className="w-full px-2 py-1.5 sm:px-3 sm:py-2 border border-purple-300 rounded-lg text-xs sm:text-sm focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-all duration-200"
                                placeholder="Website URL"
                                disabled={submitting}
                              />
                              <div className="flex space-x-1">
                                <button
                                  onClick={() => handleUpdateBrand(brandId)}
                                  className="px-2 py-1 sm:px-3 sm:py-1.5 bg-purple-600 text-white rounded text-xs sm:text-sm hover:bg-purple-700 transition-all duration-200 flex items-center space-x-1 disabled:opacity-50"
                                  disabled={submitting}
                                >
                                  <FaSave className="w-3 h-3 sm:w-4 sm:h-4" />
                                  <span>Save</span>
                                </button>
                                <button
                                  onClick={cancelEditing}
                                  className="px-2 py-1 sm:px-3 sm:py-1.5 bg-gray-500 text-white rounded text-xs sm:text-sm hover:bg-gray-600 transition-all duration-200 flex items-center space-x-1 disabled:opacity-50"
                                  disabled={submitting}
                                >
                                  <FaTimes className="w-3 h-3 sm:w-4 sm:h-4" />
                                  <span>Cancel</span>
                                </button>
                              </div>
                            </div>
                          ) : (
                            <h4 className="text-sm sm:text-base lg:text-lg font-semibold text-gray-900 truncate group-hover:text-purple-600 transition-colors">
                              {brand.name}
                            </h4>
                          )}
                        </div>
                        
                        {!isEditing && (
                          <div className="flex space-x-1 ml-2">
                            <button
                              onClick={() => startEditing(brand)}
                              className="p-1.5 sm:p-2 text-gray-400 hover:text-purple-600 hover:bg-purple-50 rounded-lg transition-all duration-200"
                              title="Edit brand"
                            >
                              <FaEdit className="w-3 h-3 sm:w-4 sm:h-4" />
                            </button>
                            <button
                              onClick={() => handleDeleteBrand(brand)}
                              className="p-1.5 sm:p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all duration-200"
                              title="Delete brand"
                              disabled={submitting}
                            >
                              <FaTrash className="w-3 h-3 sm:w-4 sm:h-4" />
                            </button>
                          </div>
                        )}
                      </div>
                      
                      {/* Brand Info */}
                      {!isEditing && (
                        <div className="space-y-2 sm:space-y-3">
                          {brand.description && (
                            <div className="text-xs sm:text-sm text-gray-600 line-clamp-2">
                              {brand.description}
                            </div>
                          )}
                          
                          {brand.website && (
                            <div className="flex items-center space-x-2">
                              <FaGlobe className="w-3 h-3 sm:w-4 sm:h-4 text-gray-400" />
                              <a 
                                href={brand.website} 
                                target="_blank" 
                                rel="noopener noreferrer" 
                                className="text-xs sm:text-sm text-purple-600 hover:text-purple-700 truncate"
                              >
                                {brand.website.replace(/^https?:\/\//, '')}
                              </a>
                            </div>
                          )}
                          
                          {/* Brand Stats */}
                          <div className="flex items-center space-x-2 p-2 sm:p-3 bg-purple-50 rounded-lg">
                            <FaChartBar className="w-3 h-3 sm:w-4 sm:h-4 text-purple-600" />
                            <div className="flex-1 min-w-0">
                              <div className="text-xs sm:text-sm font-medium text-purple-900">
                                {brand.productCount || 0} {brand.productCount === 1 ? 'Product' : 'Products'}
                              </div>
                              <div className="text-xs text-purple-600">
                                {brands.length > 0 ? ((brand.productCount || 0) / Math.max(brands.reduce((sum, b) => sum + (b.productCount || 0), 0), 1) * 100).toFixed(1) : 0}% of total
                              </div>
                            </div>
                          </div>
                          
                          {/* Progress Bar */}
                          <div className="w-full bg-gray-200 rounded-full h-1.5 sm:h-2">
                            <div 
                              className="bg-gradient-to-r from-purple-500 to-purple-600 h-1.5 sm:h-2 rounded-full transition-all duration-300"
                              style={{ 
                                width: `${brands.length > 0 ? ((brand.productCount || 0) / Math.max(brands.reduce((sum, b) => sum + (b.productCount || 0), 0), 1)) * 100 : 0}%` 
                              }}
                            ></div>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Summary Stats */}
        {brands.length > 0 && (
          <div className="mt-4 sm:mt-6 lg:mt-8 grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4">
            <div className="bg-white rounded-lg sm:rounded-xl shadow-sm border border-gray-100 p-3 sm:p-4 text-center">
              <div className="w-8 h-8 sm:w-10 sm:h-10 bg-purple-100 rounded-lg sm:rounded-xl flex items-center justify-center mx-auto mb-2 sm:mb-3">
                <FaBuilding className="w-4 h-4 sm:w-5 sm:h-5 text-purple-600" />
              </div>
              <div className="text-lg sm:text-xl font-bold text-gray-900 mb-1">
                {brands.length}
              </div>
              <div className="text-xs sm:text-sm text-gray-600">Total Brands</div>
            </div>
            
            <div className="bg-white rounded-lg sm:rounded-xl shadow-sm border border-gray-100 p-3 sm:p-4 text-center">
              <div className="w-8 h-8 sm:w-10 sm:h-10 bg-green-100 rounded-lg sm:rounded-xl flex items-center justify-center mx-auto mb-2 sm:mb-3">
                <FaChartBar className="w-4 h-4 sm:w-5 sm:h-5 text-green-600" />
              </div>
              <div className="text-lg sm:text-xl font-bold text-gray-900 mb-1">
                {brands.reduce((sum, brand) => sum + (brand.productCount || 0), 0)}
              </div>
              <div className="text-xs sm:text-sm text-gray-600">Total Products</div>
            </div>
            
            <div className="bg-white rounded-lg sm:rounded-xl shadow-sm border border-gray-100 p-3 sm:p-4 text-center">
              <div className="w-8 h-8 sm:w-10 sm:h-10 bg-blue-100 rounded-lg sm:rounded-xl flex items-center justify-center mx-auto mb-2 sm:mb-3">
                <FaLayerGroup className="w-4 h-4 sm:w-5 sm:h-5 text-blue-600" />
              </div>
              <div className="text-lg sm:text-xl font-bold text-gray-900 mb-1">
                {brands.length > 0 ? (brands.reduce((sum, brand) => sum + (brand.productCount || 0), 0) / brands.length).toFixed(1) : 0}
              </div>
              <div className="text-xs sm:text-sm text-gray-600">Avg Products/Brand</div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ManageBrands;
