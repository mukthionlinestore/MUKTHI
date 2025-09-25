import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from '../../config/axios';
import { useSettings } from '../../context/SettingsContext';
import { 
  FaPlus, 
  FaEdit, 
  FaTrash, 
  FaSearch, 
  FaEye, 
  FaFilter, 
  FaSort, 
  FaBox,
  FaEyeSlash,
  FaCheckCircle,
  FaExclamationTriangle,
  FaDownload,
  FaUpload,
  FaSync,
  FaTimes,
  FaCog,
  FaChartBar,
  FaStar,
  FaTag,
  FaEllipsisV,
  FaShoppingBag,
  FaDollarSign,
  FaLayerGroup,
  FaTags,
  FaImage,
  FaCalendarAlt,
  FaUser,
  FaHeart,
  FaShare,
  FaCopy,
  FaCircle
} from 'react-icons/fa';
import { toast } from 'react-toastify';

const AdminProducts = () => {
  const { formatPrice } = useSettings();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalProducts, setTotalProducts] = useState(0);
  const [categories, setCategories] = useState([]);
  const [brands, setBrands] = useState([]);
  const [filters, setFilters] = useState({
    category: '',
    brand: '',
    status: ''
  });
  const [sortBy, setSortBy] = useState('newest');
  const [showFilters, setShowFilters] = useState(false);
  const [selectedProducts, setSelectedProducts] = useState([]);
  const [bulkActions, setBulkActions] = useState(false);

  useEffect(() => {
    fetchProducts();
    fetchCategories();
    fetchBrands();
  }, [currentPage, searchTerm, filters, sortBy]);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams({
        page: currentPage,
        search: searchTerm,
        sort: sortBy,
        ...filters
      });
      
      const response = await axios.get(`/api/admin/products?${params}`);
      
      console.log('Products API response:', response.data);
      console.log('First product data:', response.data.products[0]);
      
      setProducts(response.data.products);
      setTotalPages(response.data.totalPages);
      setTotalProducts(response.data.total);
    } catch (error) {
      console.error('Error fetching products:', error);
      toast.error('Failed to load products');
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

  const handleDelete = async (productId) => {
    if (window.confirm('Are you sure you want to delete this product?')) {
      try {
        await axios.delete(`/api/admin/products/${productId}`);
        toast.success('Product deleted successfully');
        fetchProducts();
      } catch (error) {
        console.error('Error deleting product:', error);
        toast.error('Failed to delete product');
      }
    }
  };

  const handleBulkDelete = async () => {
    if (selectedProducts.length === 0) {
      toast.warning('Please select products to delete');
      return;
    }

    if (window.confirm(`Are you sure you want to delete ${selectedProducts.length} products?`)) {
      try {
        await Promise.all(selectedProducts.map(id => axios.delete(`/api/admin/products/${id}`)));
        toast.success(`${selectedProducts.length} products deleted successfully`);
        setSelectedProducts([]);
        setBulkActions(false);
        fetchProducts();
      } catch (error) {
        console.error('Error bulk deleting products:', error);
        toast.error('Failed to delete some products');
      }
    }
  };

  const handleSelectAll = (checked) => {
    if (checked) {
      setSelectedProducts(products.map(p => p._id));
    } else {
      setSelectedProducts([]);
    }
  };

  const handleSelectProduct = (productId, checked) => {
    if (checked) {
      setSelectedProducts([...selectedProducts, productId]);
    } else {
      setSelectedProducts(selectedProducts.filter(id => id !== productId));
    }
  };

  const clearFilters = () => {
    setFilters({
      category: '',
      brand: '',
      status: ''
    });
    setSearchTerm('');
    setSortBy('newest');
  };

  const getStatusBadgeClass = (status) => {
    switch (status?.toLowerCase()) {
      case 'active': return 'bg-green-100 text-green-800 border-green-200';
      case 'inactive': return 'bg-gray-100 text-gray-800 border-gray-200';
      case 'draft': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'archived': return 'bg-red-100 text-red-800 border-red-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getStatusIcon = (status) => {
    switch (status?.toLowerCase()) {
      case 'active': return <FaCheckCircle className="w-3 h-3 sm:w-4 sm:h-4" />;
      case 'inactive': return <FaEyeSlash className="w-3 h-3 sm:w-4 sm:h-4" />;
      case 'draft': return <FaEdit className="w-3 h-3 sm:w-4 sm:h-4" />;
      case 'archived': return <FaTimes className="w-3 h-3 sm:w-4 sm:h-4" />;
      default: return <FaCircle className="w-3 h-3 sm:w-4 sm:h-4" />;
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 sm:h-12 sm:w-12 border-b-2 border-blue-600 mx-auto mb-3 sm:mb-4"></div>
          <p className="text-xs sm:text-sm text-gray-600">Loading products...</p>
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
              <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-900 mb-1">Product Management</h1>
              <p className="text-xs sm:text-sm lg:text-base text-gray-600">Manage your product catalog ({totalProducts} products)</p>
            </div>
            <div className="flex flex-col sm:flex-row gap-2 sm:gap-3">
              <button
                onClick={() => setShowFilters(!showFilters)}
                className="inline-flex items-center justify-center px-3 py-2 sm:px-4 sm:py-2.5 bg-white border border-gray-200 rounded-lg sm:rounded-xl text-xs sm:text-sm font-medium text-gray-700 hover:bg-gray-50 transition-all duration-200 shadow-sm"
              >
                <FaFilter className="w-3 h-3 sm:w-4 sm:h-4 mr-1.5 sm:mr-2" />
                <span className="hidden sm:inline">Filters</span>
                <span className="sm:hidden">Filter</span>
              </button>
              <Link
                to="/admin/products/add"
                className="inline-flex items-center justify-center px-3 py-2 sm:px-4 sm:py-2.5 lg:px-6 lg:py-3 bg-blue-600 text-white rounded-lg sm:rounded-xl text-xs sm:text-sm font-medium hover:bg-blue-700 transition-all duration-200 shadow-sm"
              >
                <FaPlus className="w-3 h-3 sm:w-4 sm:h-4 lg:w-5 lg:h-5 mr-1.5 sm:mr-2" />
                <span className="hidden sm:inline">Add Product</span>
                <span className="sm:hidden">Add</span>
              </Link>
            </div>
          </div>
        </div>

        {/* Search Section */}
        <div className="bg-white rounded-lg sm:rounded-xl lg:rounded-2xl shadow-sm border border-gray-100 p-3 sm:p-4 lg:p-6 mb-4 sm:mb-6">
          <div className="relative">
            <FaSearch className="absolute left-2.5 sm:left-3 top-1/2 -translate-y-1/2 text-gray-400 w-3 h-3 sm:w-4 sm:h-4" />
            <input
              type="text"
              placeholder="Search products by name, category, or brand..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-8 sm:pl-10 pr-3 sm:pr-4 py-2 sm:py-2.5 lg:py-3 border border-gray-200 rounded-lg text-xs sm:text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
            />
          </div>
        </div>

        {/* Filters Section */}
        {showFilters && (
          <div className="bg-white rounded-lg sm:rounded-xl lg:rounded-2xl shadow-sm border border-gray-100 p-3 sm:p-4 lg:p-6 mb-4 sm:mb-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2 sm:gap-3 lg:gap-4">
              <select
                value={filters.category}
                onChange={(e) => setFilters({...filters, category: e.target.value})}
                className="px-3 sm:px-4 py-2 sm:py-2.5 lg:py-3 border border-gray-200 rounded-lg text-xs sm:text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 bg-white"
              >
                <option value="">All Categories</option>
                {categories.length === 0 ? (
                  <option value="" disabled>Loading categories...</option>
                ) : (
                  categories.map((category, index) => (
                    <option key={index} value={category}>
                      {category}
                    </option>
                  ))
                )}
              </select>

              <select
                value={filters.brand}
                onChange={(e) => setFilters({...filters, brand: e.target.value})}
                className="px-3 sm:px-4 py-2 sm:py-2.5 lg:py-3 border border-gray-200 rounded-lg text-xs sm:text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 bg-white"
              >
                <option value="">All Brands</option>
                {brands.length === 0 ? (
                  <option value="" disabled>Loading brands...</option>
                ) : (
                  brands.map((brand, index) => (
                    <option key={index} value={brand}>
                      {brand}
                    </option>
                  ))
                )}
              </select>

              <select
                value={filters.status}
                onChange={(e) => setFilters({...filters, status: e.target.value})}
                className="px-3 sm:px-4 py-2 sm:py-2.5 lg:py-3 border border-gray-200 rounded-lg text-xs sm:text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 bg-white"
              >
                <option value="">All Status</option>
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
                <option value="draft">Draft</option>
                <option value="archived">Archived</option>
              </select>

              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="px-3 sm:px-4 py-2 sm:py-2.5 lg:py-3 border border-gray-200 rounded-lg text-xs sm:text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 bg-white"
              >
                <option value="newest">Newest First</option>
                <option value="oldest">Oldest First</option>
                <option value="name">Name A-Z</option>
                <option value="price_high">Price High to Low</option>
                <option value="price_low">Price Low to High</option>
              </select>
            </div>
            
            <div className="flex justify-end mt-3 sm:mt-4">
              <button
                onClick={clearFilters}
                className="px-3 py-1.5 sm:px-4 sm:py-2 text-xs sm:text-sm text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-all duration-200"
              >
                Clear Filters
              </button>
            </div>
          </div>
        )}

        {/* Bulk Actions */}
        {selectedProducts.length > 0 && (
          <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-lg sm:rounded-xl p-3 sm:p-4 mb-4 sm:mb-6">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 sm:gap-0">
              <div className="flex items-center space-x-2">
                <FaCheckCircle className="w-4 h-4 sm:w-5 sm:h-5 text-blue-600" />
                <span className="text-xs sm:text-sm font-medium text-blue-900">
                  {selectedProducts.length} product(s) selected
                </span>
              </div>
              <div className="flex space-x-2">
                <button
                  onClick={handleBulkDelete}
                  className="px-2 py-1.5 sm:px-3 sm:py-2 text-xs sm:text-sm bg-red-600 text-white rounded-lg hover:bg-red-700 transition-all duration-200 flex items-center space-x-1"
                >
                  <FaTrash className="w-3 h-3 sm:w-4 sm:h-4" />
                  <span>Delete</span>
                </button>
                <button
                  onClick={() => setSelectedProducts([])}
                  className="px-2 py-1.5 sm:px-3 sm:py-2 text-xs sm:text-sm text-gray-600 hover:text-gray-900 hover:bg-white rounded-lg transition-all duration-200"
                >
                  Clear
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Select All */}
        {products.length > 0 && (
          <div className="flex items-center justify-between bg-white rounded-lg sm:rounded-xl shadow-sm border border-gray-100 p-3 sm:p-4 mb-4">
            <div className="flex items-center">
              <input
                type="checkbox"
                checked={selectedProducts.length === products.length}
                onChange={(e) => handleSelectAll(e.target.checked)}
                className="w-3 h-3 sm:w-4 sm:h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
              />
              <span className="ml-2 sm:ml-3 text-xs sm:text-sm font-medium text-gray-700">
                {selectedProducts.length} of {products.length} selected
              </span>
            </div>
            <div className="text-xs sm:text-sm text-gray-500">
              Total: {totalProducts} products
            </div>
          </div>
        )}

        {/* Products Grid */}
        {products.length === 0 && !loading ? (
          <div className="bg-white rounded-lg sm:rounded-xl lg:rounded-2xl shadow-sm border border-gray-100 p-6 sm:p-8 text-center">
            <div className="w-12 h-12 sm:w-16 sm:h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-3 sm:mb-4">
              <FaShoppingBag className="w-6 h-6 sm:w-8 sm:h-8 text-gray-400" />
            </div>
            <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-1 sm:mb-2">No products found</h3>
            <p className="text-xs sm:text-sm text-gray-600 mb-4">
              {searchTerm || Object.values(filters).some(f => f) 
                ? 'Try adjusting your search or filters'
                : 'Get started by adding your first product'
              }
            </p>
            {!searchTerm && !Object.values(filters).some(f => f) && (
              <Link
                to="/admin/products/add"
                className="inline-flex items-center px-3 py-2 sm:px-4 sm:py-2.5 bg-blue-600 text-white text-xs sm:text-sm font-medium rounded-lg hover:bg-blue-700 transition-all duration-200"
              >
                <FaPlus className="w-3 h-3 sm:w-4 sm:h-4 mr-1.5 sm:mr-2" />
                Add Product
              </Link>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 sm:gap-4 lg:gap-6">
            {products.map((product) => {
              console.log('Rendering product:', product);
              return (
              <div key={product._id} className="bg-white rounded-lg sm:rounded-xl lg:rounded-2xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-lg transition-all duration-300 group">
                {/* Product Image */}
                <div className="relative aspect-square bg-gradient-to-br from-gray-50 to-gray-100">
                  {product.images && product.images[0] ? (
                    <img
                      src={product.images[0]}
                      alt={product.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <FaImage className="w-8 h-8 sm:w-12 sm:h-12 text-gray-400" />
                    </div>
                  )}
                  
                  {/* Selection Checkbox */}
                  <div className="absolute top-2 left-2 z-10">
                    <input
                      type="checkbox"
                      checked={selectedProducts.includes(product._id)}
                      onChange={(e) => handleSelectProduct(product._id, e.target.checked)}
                      className="w-3 h-3 sm:w-4 sm:h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500 cursor-pointer"
                    />
                  </div>

                  {/* Status Badge */}
                  <div className="absolute top-2 right-2 z-10">
                    <span className={`inline-flex items-center px-1.5 py-0.5 sm:px-2 sm:py-1 rounded-full text-xs font-medium border ${getStatusBadgeClass(product.isActive !== false ? 'active' : 'inactive')}`}>
                      {getStatusIcon(product.isActive !== false ? 'active' : 'inactive')}
                      <span className="ml-1 hidden sm:inline">{product.isActive !== false ? 'Active' : 'Inactive'}</span>
                    </span>
                  </div>

                  {/* Quick Actions Overlay */}
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-all duration-300 flex items-center justify-center opacity-0 group-hover:opacity-100 z-5">
                    <div className="flex space-x-2">
                      <Link
                        to={`/product/${product._id}`}
                        className="p-2 bg-white/90 backdrop-blur-sm rounded-full text-blue-600 hover:bg-blue-600 hover:text-white transition-all duration-200"
                      >
                        <FaEye className="w-3 h-3 sm:w-4 sm:h-4" />
                      </Link>
                      <Link
                        to={`/admin/products/edit/${product._id}`}
                        className="p-2 bg-white/90 backdrop-blur-sm rounded-full text-green-600 hover:bg-green-600 hover:text-white transition-all duration-200"
                      >
                        <FaEdit className="w-3 h-3 sm:w-4 sm:h-4" />
                      </Link>
                      <button
                        onClick={() => handleDelete(product._id)}
                        className="p-2 bg-white/90 backdrop-blur-sm rounded-full text-red-600 hover:bg-red-600 hover:text-white transition-all duration-200"
                      >
                        <FaTrash className="w-3 h-3 sm:w-4 sm:h-4" />
                      </button>
                    </div>
                  </div>
                </div>

                {/* Product Info */}
                <div className="p-3 sm:p-4">
                  <div className="flex items-start justify-between mb-2">
                    <h3 className="text-xs sm:text-sm lg:text-base font-semibold text-gray-900 truncate flex-1 mr-2">
                      {product.name}
                    </h3>
                    <span className="text-lg sm:text-xl font-bold text-blue-600">
                      {formatPrice(product.price)}
                    </span>
                  </div>
                  
                  <div className="space-y-2 mb-3 sm:mb-4">
                    <div className="flex items-center space-x-2">
                      <FaTags className="w-3 h-3 sm:w-4 sm:h-4 text-gray-400" />
                      <span className="text-xs sm:text-sm text-gray-600 truncate">
                        {product.category || 'No Category'}
                      </span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <FaLayerGroup className="w-3 h-3 sm:w-4 sm:h-4 text-gray-400" />
                      <span className="text-xs sm:text-sm text-gray-600">
                        Stock: {product.quantity || 0}
                      </span>
                    </div>
                    {product.brand && (
                      <div className="flex items-center space-x-2">
                        <FaTag className="w-3 h-3 sm:w-4 sm:h-4 text-gray-400" />
                        <span className="text-xs sm:text-sm text-gray-600 truncate">
                          {product.brand}
                        </span>
                      </div>
                    )}
                  </div>

                  {/* Action Buttons */}
                  <div className="flex space-x-1.5 sm:space-x-2">
                    <Link
                      to={`/product/${product._id}`}
                      className="flex-1 flex items-center justify-center px-2 py-1.5 sm:px-3 sm:py-2 text-xs sm:text-sm text-blue-600 hover:bg-blue-50 rounded-lg transition-all duration-200"
                    >
                      <FaEye className="w-3 h-3 sm:w-4 sm:h-4 mr-1" />
                      <span className="hidden sm:inline">View</span>
                    </Link>
                    <Link
                      to={`/admin/products/edit/${product._id}`}
                      className="flex-1 flex items-center justify-center px-2 py-1.5 sm:px-3 sm:py-2 text-xs sm:text-sm text-green-600 hover:bg-green-50 rounded-lg transition-all duration-200"
                    >
                      <FaEdit className="w-3 h-3 sm:w-4 sm:h-4 mr-1" />
                      <span className="hidden sm:inline">Edit</span>
                    </Link>
                    <button
                      onClick={() => handleDelete(product._id)}
                      className="flex-1 flex items-center justify-center px-2 py-1.5 sm:px-3 sm:py-2 text-xs sm:text-sm text-red-600 hover:bg-red-50 rounded-lg transition-all duration-200"
                    >
                      <FaTrash className="w-3 h-3 sm:w-4 sm:h-4 mr-1" />
                      <span className="hidden sm:inline">Delete</span>
                    </button>
                  </div>
                </div>
              </div>
            );
            })}
          </div>
        )}

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="mt-6 sm:mt-8 flex items-center justify-center">
            <div className="flex items-center space-x-1.5 sm:space-x-2">
              <button
                onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                disabled={currentPage === 1}
                className="px-2 py-1.5 sm:px-3 sm:py-2 text-xs sm:text-sm text-gray-500 hover:text-gray-700 disabled:opacity-50 disabled:cursor-not-allowed bg-white border border-gray-200 rounded-lg hover:bg-gray-50 transition-all duration-200"
              >
                Previous
              </button>
              
              {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                <button
                  key={page}
                  onClick={() => setCurrentPage(page)}
                  className={`px-2 py-1.5 sm:px-3 sm:py-2 text-xs sm:text-sm rounded-lg transition-all duration-200 ${
                    currentPage === page
                      ? 'bg-blue-600 text-white shadow-sm'
                      : 'text-gray-500 hover:text-gray-700 hover:bg-gray-100 bg-white border border-gray-200'
                  }`}
                >
                  {page}
                </button>
              ))}
              
              <button
                onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                disabled={currentPage === totalPages}
                className="px-2 py-1.5 sm:px-3 sm:py-2 text-xs sm:text-sm text-gray-500 hover:text-gray-700 disabled:opacity-50 disabled:cursor-not-allowed bg-white border border-gray-200 rounded-lg hover:bg-gray-50 transition-all duration-200"
              >
                Next
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminProducts;
