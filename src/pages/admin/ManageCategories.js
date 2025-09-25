import React, { useState, useEffect } from 'react';
import axios from '../../config/axios';
import { 
  FaPlus, 
  FaEdit, 
  FaTrash, 
  FaSave, 
  FaTimes, 
  FaList, 
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
  FaSearch
} from 'react-icons/fa';
import { toast } from 'react-toastify';

const ManageCategories = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [newCategory, setNewCategory] = useState('');
  const [editingId, setEditingId] = useState(null);
  const [editingName, setEditingName] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState('name');

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      setLoading(true);
      const response = await axios.get('/api/admin/categories/stats');
      setCategories(response.data);
    } catch (error) {
      console.error('Error fetching categories:', error);
      toast.error('Failed to load categories');
    } finally {
      setLoading(false);
    }
  };

  const handleAddCategory = async (e) => {
    e.preventDefault();
    if (!newCategory.trim() || submitting) return;

    try {
      setSubmitting(true);
      await axios.post('/api/admin/categories', { name: newCategory.trim() });
      toast.success('Category added successfully!');
      setNewCategory('');
      fetchCategories();
    } catch (error) {
      console.error('Error adding category:', error);
      toast.error(error.response?.data?.message || 'Failed to add category');
    } finally {
      setSubmitting(false);
    }
  };

  const startEditing = (category) => {
    setEditingId(category.name);
    setEditingName(category.name);
  };

  const cancelEditing = () => {
    setEditingId(null);
    setEditingName('');
  };

  const handleUpdateCategory = async (oldName) => {
    if (!editingName.trim() || editingName === oldName || submitting) {
      cancelEditing();
      return;
    }

    try {
      setSubmitting(true);
      await axios.put(`/api/admin/categories/${encodeURIComponent(oldName)}`, {
        name: editingName.trim()
      });
      toast.success('Category updated successfully!');
      cancelEditing();
      fetchCategories();
    } catch (error) {
      console.error('Error updating category:', error);
      toast.error(error.response?.data?.message || 'Failed to update category');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeleteCategory = async (categoryName) => {
    if (!window.confirm(`Are you sure you want to delete "${categoryName}"? This action cannot be undone.`)) {
      return;
    }

    try {
      setSubmitting(true);
      await axios.delete(`/api/admin/categories/${encodeURIComponent(categoryName)}`);
      toast.success('Category deleted successfully!');
      fetchCategories();
    } catch (error) {
      console.error('Error deleting category:', error);
      toast.error(error.response?.data?.message || 'Failed to delete category');
    } finally {
      setSubmitting(false);
    }
  };

  // Filter and sort categories
  const filteredAndSortedCategories = categories
    .filter(category => 
      category.name.toLowerCase().includes(searchTerm.toLowerCase())
    )
    .sort((a, b) => {
      switch (sortBy) {
        case 'name':
          return a.name.localeCompare(b.name);
        case 'count':
          return b.count - a.count;
        case 'name_desc':
          return b.name.localeCompare(a.name);
        case 'count_asc':
          return a.count - b.count;
        default:
          return a.name.localeCompare(b.name);
      }
    });

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 sm:h-12 sm:w-12 border-b-2 border-blue-600 mx-auto mb-3 sm:mb-4"></div>
          <p className="text-xs sm:text-sm text-gray-600">Loading categories...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      <div className="px-2 py-3 sm:px-4 lg:px-6 xl:px-8 sm:py-4 lg:py-6">
        {/* Header Section */}
        <div className="mb-4 sm:mb-6 lg:mb-8">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 sm:gap-4">
            <div>
              <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-900 mb-1">Manage Categories</h1>
              <p className="text-xs sm:text-sm lg:text-base text-gray-600">Organize your products with categories and subcategories</p>
            </div>
            <div className="flex items-center space-x-2 sm:space-x-3">
              <div className="bg-white border border-gray-200 rounded-lg sm:rounded-xl px-3 py-2 sm:px-4 sm:py-3 shadow-sm">
                <div className="flex items-center space-x-2">
                  <FaFolder className="w-4 h-4 sm:w-5 sm:h-5 text-blue-600" />
                  <span className="text-xs sm:text-sm font-medium text-gray-700">
                    {categories.length} Categories
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Add New Category */}
        <div className="bg-white rounded-lg sm:rounded-xl lg:rounded-2xl shadow-sm border border-gray-100 p-3 sm:p-4 lg:p-6 mb-4 sm:mb-6">
          <div className="flex items-center space-x-2 sm:space-x-3 mb-4 sm:mb-6">
            <div className="w-8 h-8 sm:w-10 sm:h-10 bg-green-100 rounded-lg sm:rounded-xl flex items-center justify-center">
              <FaPlus className="w-4 h-4 sm:w-5 sm:h-5 text-green-600" />
            </div>
            <h3 className="text-lg sm:text-xl lg:text-2xl font-semibold text-gray-900">Add New Category</h3>
          </div>
          
          <form onSubmit={handleAddCategory} className="space-y-3 sm:space-y-4">
            <div className="flex space-x-2 sm:space-x-3">
              <input
                type="text"
                value={newCategory}
                onChange={(e) => setNewCategory(e.target.value)}
                placeholder="Enter category name (e.g., Electronics, Clothing, Books)"
                className="flex-1 px-3 sm:px-4 py-2 sm:py-3 border border-gray-200 rounded-lg sm:rounded-xl text-xs sm:text-sm focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all duration-200"
                required
                disabled={submitting}
              />
              <button 
                type="submit" 
                className="px-4 py-2 sm:px-6 sm:py-3 bg-green-600 text-white rounded-lg sm:rounded-xl text-xs sm:text-sm font-medium hover:bg-green-700 transition-all duration-200 flex items-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed"
                disabled={submitting || !newCategory.trim()}
              >
                {submitting ? (
                  <>
                    <FaSpinner className="w-3 h-3 sm:w-4 sm:h-4 animate-spin" />
                    <span>Adding...</span>
                  </>
                ) : (
                  <>
                    <FaPlus className="w-3 h-3 sm:w-4 sm:h-4" />
                    <span>Add Category</span>
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
                placeholder="Search categories..."
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

        {/* Categories List */}
        <div className="bg-white rounded-lg sm:rounded-xl lg:rounded-2xl shadow-sm border border-gray-100 p-3 sm:p-4 lg:p-6">
          <div className="flex items-center justify-between mb-4 sm:mb-6">
            <div className="flex items-center space-x-2 sm:space-x-3">
              <div className="w-8 h-8 sm:w-10 sm:h-10 bg-blue-100 rounded-lg sm:rounded-xl flex items-center justify-center">
                <FaList className="w-4 h-4 sm:w-5 sm:h-5 text-blue-600" />
              </div>
              <h3 className="text-lg sm:text-xl lg:text-2xl font-semibold text-gray-900">Existing Categories</h3>
            </div>
            <div className="text-xs sm:text-sm text-gray-500">
              {filteredAndSortedCategories.length} of {categories.length} categories
            </div>
          </div>
          
          {filteredAndSortedCategories.length === 0 ? (
            <div className="text-center py-8 sm:py-12">
              <div className="w-12 h-12 sm:w-16 sm:h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-3 sm:mb-4">
                <FaFolder className="w-6 h-6 sm:w-8 sm:h-8 text-gray-400" />
              </div>
              <h4 className="text-base sm:text-lg font-semibold text-gray-900 mb-1 sm:mb-2">
                {searchTerm ? 'No categories found' : 'No categories yet'}
              </h4>
              <p className="text-xs sm:text-sm text-gray-600 mb-4">
                {searchTerm 
                  ? 'Try adjusting your search terms'
                  : 'Add your first category to start organizing your products'
                }
              </p>
              {!searchTerm && (
                <button
                  onClick={() => document.querySelector('input[type="text"]')?.focus()}
                  className="inline-flex items-center px-3 py-2 sm:px-4 sm:py-2.5 bg-blue-600 text-white text-xs sm:text-sm font-medium rounded-lg hover:bg-blue-700 transition-all duration-200"
                >
                  <FaPlus className="w-3 h-3 sm:w-4 sm:h-4 mr-1.5 sm:mr-2" />
                  Add Category
                </button>
              )}
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 sm:gap-4 lg:gap-6">
              {filteredAndSortedCategories.map((category) => (
                <div key={category.name} className="bg-gradient-to-br from-white to-gray-50 border border-gray-200 rounded-lg sm:rounded-xl lg:rounded-2xl shadow-sm hover:shadow-lg transition-all duration-300 group">
                  <div className="p-3 sm:p-4 lg:p-6">
                    {/* Category Header */}
                    <div className="flex items-start justify-between mb-3 sm:mb-4">
                      <div className="flex-1 min-w-0">
                        {editingId === category.name ? (
                          <div className="space-y-2">
                            <input
                              type="text"
                              value={editingName}
                              onChange={(e) => setEditingName(e.target.value)}
                              className="w-full px-2 py-1.5 sm:px-3 sm:py-2 border border-blue-300 rounded-lg text-xs sm:text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
                              autoFocus
                              disabled={submitting}
                            />
                            <div className="flex space-x-1">
                              <button
                                onClick={() => handleUpdateCategory(category.name)}
                                className="px-2 py-1 sm:px-3 sm:py-1.5 bg-green-600 text-white rounded text-xs sm:text-sm hover:bg-green-700 transition-all duration-200 flex items-center space-x-1 disabled:opacity-50"
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
                          <h4 className="text-sm sm:text-base lg:text-lg font-semibold text-gray-900 truncate group-hover:text-blue-600 transition-colors">
                            {category.name}
                          </h4>
                        )}
                      </div>
                      
                      {editingId !== category.name && (
                        <div className="flex space-x-1 ml-2">
                          <button
                            onClick={() => startEditing(category)}
                            className="p-1.5 sm:p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all duration-200"
                            title="Edit category"
                          >
                            <FaEdit className="w-3 h-3 sm:w-4 sm:h-4" />
                          </button>
                          <button
                            onClick={() => handleDeleteCategory(category.name)}
                            className="p-1.5 sm:p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all duration-200"
                            title="Delete category"
                            disabled={submitting}
                          >
                            <FaTrash className="w-3 h-3 sm:w-4 sm:h-4" />
                          </button>
                        </div>
                      )}
                    </div>
                    
                    {/* Category Stats */}
                    {editingId !== category.name && (
                      <div className="space-y-2 sm:space-y-3">
                        <div className="flex items-center space-x-2 p-2 sm:p-3 bg-blue-50 rounded-lg">
                          <FaChartBar className="w-3 h-3 sm:w-4 sm:h-4 text-blue-600" />
                          <div className="flex-1 min-w-0">
                            <div className="text-xs sm:text-sm font-medium text-blue-900">
                              {category.count} {category.count === 1 ? 'Product' : 'Products'}
                            </div>
                            <div className="text-xs text-blue-600">
                              {((category.count / Math.max(categories.reduce((sum, cat) => sum + cat.count, 0), 1)) * 100).toFixed(1)}% of total
                            </div>
                          </div>
                        </div>
                        
                        {/* Progress Bar */}
                        <div className="w-full bg-gray-200 rounded-full h-1.5 sm:h-2">
                          <div 
                            className="bg-gradient-to-r from-blue-500 to-blue-600 h-1.5 sm:h-2 rounded-full transition-all duration-300"
                            style={{ 
                              width: `${(category.count / Math.max(categories.reduce((sum, cat) => sum + cat.count, 0), 1)) * 100}%` 
                            }}
                          ></div>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Summary Stats */}
        {categories.length > 0 && (
          <div className="mt-4 sm:mt-6 lg:mt-8 grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4">
            <div className="bg-white rounded-lg sm:rounded-xl shadow-sm border border-gray-100 p-3 sm:p-4 text-center">
              <div className="w-8 h-8 sm:w-10 sm:h-10 bg-blue-100 rounded-lg sm:rounded-xl flex items-center justify-center mx-auto mb-2 sm:mb-3">
                <FaFolder className="w-4 h-4 sm:w-5 sm:h-5 text-blue-600" />
              </div>
              <div className="text-lg sm:text-xl font-bold text-gray-900 mb-1">
                {categories.length}
              </div>
              <div className="text-xs sm:text-sm text-gray-600">Total Categories</div>
            </div>
            
            <div className="bg-white rounded-lg sm:rounded-xl shadow-sm border border-gray-100 p-3 sm:p-4 text-center">
              <div className="w-8 h-8 sm:w-10 sm:h-10 bg-green-100 rounded-lg sm:rounded-xl flex items-center justify-center mx-auto mb-2 sm:mb-3">
                <FaChartBar className="w-4 h-4 sm:w-5 sm:h-5 text-green-600" />
              </div>
              <div className="text-lg sm:text-xl font-bold text-gray-900 mb-1">
                {categories.reduce((sum, cat) => sum + cat.count, 0)}
              </div>
              <div className="text-xs sm:text-sm text-gray-600">Total Products</div>
            </div>
            
            <div className="bg-white rounded-lg sm:rounded-xl shadow-sm border border-gray-100 p-3 sm:p-4 text-center">
              <div className="w-8 h-8 sm:w-10 sm:h-10 bg-purple-100 rounded-lg sm:rounded-xl flex items-center justify-center mx-auto mb-2 sm:mb-3">
                <FaLayerGroup className="w-4 h-4 sm:w-5 sm:h-5 text-purple-600" />
              </div>
              <div className="text-lg sm:text-xl font-bold text-gray-900 mb-1">
                {categories.length > 0 ? (categories.reduce((sum, cat) => sum + cat.count, 0) / categories.length).toFixed(1) : 0}
              </div>
              <div className="text-xs sm:text-sm text-gray-600">Avg Products/Category</div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ManageCategories;
