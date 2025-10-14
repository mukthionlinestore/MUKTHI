import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { Link } from 'react-router-dom';
import axios from '../config/axios';
import { 
  FaSearch, 
  FaStar, 
  FaFilter, 
  FaTimes,
  FaSpinner,
  FaEye,
  FaSort
} from 'react-icons/fa';
import ProductCard from '../components/products/ProductCard';
import FilterSidebar from '../components/products/FilterSidebar';
import SortDropdown from '../components/products/SortDropdown';

const Products = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [selectedBrand, setSelectedBrand] = useState('');
  const [sortBy, setSortBy] = useState('newest');
  const [categories, setCategories] = useState([]);
  const [brands, setBrands] = useState([]);
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);
  const [sortDropdownOpen, setSortDropdownOpen] = useState(false);
  const [searchLoading, setSearchLoading] = useState(false);

  // Close sort dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (sortDropdownOpen && !event.target.closest('.sort-dropdown-container')) {
        setSortDropdownOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [sortDropdownOpen]);

  // Debounced search to avoid too many API calls
  const debouncedSearch = useCallback(
    (() => {
      let timeoutId;
      return (term) => {
        clearTimeout(timeoutId);
        timeoutId = setTimeout(() => {
          setSearchTerm(term);
        }, 300); // 300ms delay
      };
    })(),
    []
  );

  useEffect(() => {
    fetchProducts(searchTerm, selectedCategory, selectedBrand, sortBy);
    fetchCategories();
    fetchBrands();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedCategory, selectedBrand, sortBy]);

  // Separate effect for search to avoid conflicts
  useEffect(() => {
    if (searchTerm !== undefined) {
      fetchProducts(searchTerm, selectedCategory, selectedBrand, sortBy);
    }
  }, [searchTerm]);

  const fetchProducts = async (search = searchTerm, category = selectedCategory, brand = selectedBrand, sort = sortBy) => {
    try {
      setLoading(true);
      setSearchLoading(true);
      setError(null);
      const params = new URLSearchParams();
      
      // Only add parameters if they have values
      if (search && search.trim()) params.append('search', search.trim());
      if (category) params.append('category', category);
      if (brand) params.append('brand', brand);
      if (sort) params.append('sort', sort);

      console.log('🔍 Fetching products with params:', params.toString());
      console.log('🔍 Sort value:', sort);
      
      const response = await axios.get(`/api/products?${params}`);
      console.log('✅ Products response:', response.data);
      
      setProducts(response.data.products || []);
    } catch (error) {
      console.error('❌ Error fetching products:', error);
      setError('Failed to load products. Please try again later.');
      setProducts([]);
    } finally {
      setLoading(false);
      setSearchLoading(false);
    }
  };

  const fetchCategories = async () => {
    try {
      const response = await axios.get('/api/products/categories/list');
      setCategories(response.data || []);
    } catch (error) {
      console.error('Error fetching categories:', error);
      setCategories([]);
    }
  };

  const fetchBrands = async () => {
    try {
      const response = await axios.get('/api/products/brands/list');
      setBrands(response.data || []);
    } catch (error) {
      console.error('Error fetching brands:', error);
      setBrands([]);
    }
  };

  const handleSearchInput = (e) => {
    const value = e.target.value;
    debouncedSearch(value);
  };

  const handleCategoryChange = (category) => {
    setSelectedCategory(category === selectedCategory ? '' : category);
  };

  const handleBrandChange = (brand) => {
    setSelectedBrand(brand === selectedBrand ? '' : brand);
  };

  const handleSortChange = (newSortBy) => {
    console.log('🔄 Sort changed from:', sortBy, 'to:', newSortBy);
    setSortBy(newSortBy);
  };

  const clearAll = () => {
    setSelectedCategory('');
    setSelectedBrand('');
    setSearchTerm('');
    setSortBy('newest');
  };

  const filteredProducts = useMemo(() => {
    return products;
  }, [products]);

  return (
    <div className="min-h-screen relative">

      {/* Search and Filters Section */}
      <section className="relative z-20" style={{overflow: 'visible'}}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3 sm:py-4">
          <div className="flex items-center gap-2 sm:gap-3">
            {/* Search Bar with Icon - Made Longer */}
            <div className="relative flex-1 max-w-4xl">
              <FaSearch className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 w-3 h-3 sm:w-4 sm:h-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search products..."
                onChange={handleSearchInput}
                className="w-full rounded-lg sm:rounded-xl border border-gray-200 py-2 sm:py-2.5 pl-9 sm:pl-10 pr-10 sm:pr-12 text-xs sm:text-sm shadow-sm outline-none transition bg-white hover:border-blue-500 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
              />
              {/* Search Icon at End */}
              <div className="absolute right-3 top-1/2 -translate-y-1/2">
                <FaSearch className="w-3 h-3 sm:w-4 sm:h-4 text-gray-400" />
              </div>
            </div>

            {/* Sort Icon Button */}
            <div className="flex-shrink-0 relative sort-dropdown-container z-30" style={{overflow: 'visible'}}>
              <button
                onClick={() => setSortDropdownOpen(!sortDropdownOpen)}
                className="inline-flex items-center gap-1.5 sm:gap-2 rounded-lg sm:rounded-xl border border-gray-200 px-3 sm:px-4 py-2 sm:py-2.5 text-xs sm:text-sm font-medium shadow-sm hover:shadow-md transition-all duration-200 bg-white hover:bg-gray-50 hover:border-blue-500 text-gray-700 hover:text-blue-600"
              >
                <FaSort className="w-3 h-3 sm:w-4 sm:h-4" />
                <span className="hidden sm:inline">Sort</span>
              </button>

              {/* Sort Dropdown Menu */}
              {sortDropdownOpen && (
                <div 
                  className="absolute right-0 top-full mt-2 bg-white rounded-lg shadow-xl border border-gray-200 z-[9999] w-56"
                >
                  <div className="py-1">
                    {[
                      { value: 'newest', label: 'Newest First' },
                      { value: 'oldest', label: 'Oldest First' },
                      { value: 'price_asc', label: 'Price: Low to High' },
                      { value: 'price_desc', label: 'Price: High to Low' },
                      { value: 'rating', label: 'Highest Rated' },
                      { value: 'name_asc', label: 'Name: A to Z' },
                      { value: 'name_desc', label: 'Name: Z to A' },
                    ].map((option) => (
                      <button
                        key={option.value}
                        onClick={() => {
                          handleSortChange(option.value);
                          setSortDropdownOpen(false);
                        }}
                        className={`w-full text-left px-4 py-2 text-sm hover:bg-gray-50 transition-colors ${
                          sortBy === option.value ? 'bg-blue-50 text-blue-700' : 'text-gray-700'
                        }`}
                      >
                        {option.label}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Filter Button - Mobile Only */}
            <div className="flex-shrink-0 lg:hidden">
              <button
                onClick={() => setMobileFiltersOpen(true)}
                className="inline-flex items-center gap-1.5 sm:gap-2 rounded-lg sm:rounded-xl border border-gray-200 px-3 sm:px-4 py-2 sm:py-2.5 text-xs sm:text-sm font-medium shadow-sm hover:shadow-md transition-all duration-200 bg-white hover:bg-gray-50 hover:border-blue-500 text-gray-700 hover:text-blue-600"
              >
                <FaFilter className="w-3 h-3 sm:w-4 sm:h-4" />
                <span className="hidden sm:inline">Filters</span>
              </button>
            </div>
          </div>

          {/* Active Filters */}
          {(selectedCategory || selectedBrand || searchTerm) && (
            <div className="mt-3 sm:mt-4 flex flex-wrap items-center gap-2">
              {selectedCategory && (
                <Chip onClear={() => setSelectedCategory('')}>
                  Category: {selectedCategory}
                </Chip>
              )}
              {selectedBrand && (
                <Chip onClear={() => setSelectedBrand('')}>
                  Brand: {selectedBrand}
                </Chip>
              )}
              {searchTerm && (
                <Chip onClear={() => setSearchTerm('')}>
                  Search: {searchTerm}
                </Chip>
              )}
              <button
                onClick={clearAll}
                className="text-xs sm:text-sm text-gray-600 hover:text-blue-600 transition-colors"
              >
                Clear all
              </button>
            </div>
          )}
        </div>
      </section>

      {/* Products Section */}
      <section className="py-6 sm:py-8 relative overflow-hidden z-10">
        {/* Animated Background Elements */}
        <div className="absolute inset-0">
          <div className="absolute top-10 left-10 w-24 h-24 bg-blue-500/10 rounded-full animate-pulse"></div>
          <div className="absolute top-20 right-20 w-16 h-16 bg-purple-500/10 rounded-full animate-pulse animation-delay-1000"></div>
          <div className="absolute bottom-10 left-1/4 w-20 h-20 bg-pink-500/10 rounded-full animate-pulse animation-delay-2000"></div>
          <div className="absolute bottom-20 right-1/3 w-12 h-12 bg-green-500/10 rounded-full animate-pulse animation-delay-3000"></div>
        </div>
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="flex gap-4 sm:gap-6 lg:gap-8">
          {/* Desktop Sidebar - Always Visible on Desktop */}
          <div className="hidden lg:block w-72 flex-shrink-0">
            <div className="sticky top-4">
              <div className="bg-white rounded-xl p-4 sm:p-5 shadow-sm hover:shadow-md transition-all duration-500 border border-gray-200 hover:bg-gray-50">
                <h3 className="text-lg font-semibold mb-4 text-gray-900">Filters</h3>
                <FilterSidebar
                  categories={categories}
                  brands={brands}
                  selectedCategory={selectedCategory}
                  selectedBrand={selectedBrand}
                  onCategoryChange={handleCategoryChange}
                  onBrandChange={handleBrandChange}
                />
              </div>
            </div>
          </div>

          {/* Products Grid */}
          <div className="flex-1">
            {loading ? (
              <SkeletonGrid />
            ) : error ? (
              <ErrorState message={error} onRetry={fetchProducts} />
            ) : filteredProducts.length === 0 ? (
              <EmptyState onReset={clearAll} searchTerm={searchTerm} />
            ) : (
              <div className="grid grid-cols-2 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 sm:gap-4 md:gap-5 lg:gap-6">
                {filteredProducts.map((product) => (
                  <ProductCard key={product._id} product={product} />
                ))}
              </div>
            )}
          </div>
        </div>
        </div>
      </section>

      {/* Mobile Filters Drawer */}
      {mobileFiltersOpen && (
        <div className="lg:hidden fixed inset-0 z-50">
          <div className="absolute inset-0 bg-gray-900/50" onClick={() => setMobileFiltersOpen(false)} />
          <div className="absolute inset-y-0 right-0 w-full max-w-sm bg-white shadow-xl animate-in slide-in-from-right flex flex-col">
            <div className="flex items-center justify-between border-b border-gray-200 p-3 sm:p-4 flex-shrink-0">
              <h3 className="text-sm sm:text-base font-semibold text-gray-900">Filters</h3>
              <button
                className="inline-flex h-6 w-6 sm:h-8 sm:w-8 items-center justify-center rounded-full hover:bg-gray-100 transition-colors"
                onClick={() => setMobileFiltersOpen(false)}
                aria-label="Close"
              >
                <FaTimes className="w-3 h-3 sm:w-4 sm:h-4" />
              </button>
            </div>
            <div className="flex-1 overflow-y-auto p-3 sm:p-4">
              <FilterSidebar
                categories={categories}
                brands={brands}
                selectedCategory={selectedCategory}
                selectedBrand={selectedBrand}
                onCategoryChange={handleCategoryChange}
                onBrandChange={handleBrandChange}
              />
            </div>
            <div className="sticky bottom-0 border-t border-gray-200 bg-white p-3 sm:p-4 flex items-center justify-end gap-2 flex-shrink-0">
              <button onClick={clearAll} className="text-xs sm:text-sm text-gray-600 hover:text-blue-600 transition-colors mr-auto">Reset</button>
              <button
                onClick={() => setMobileFiltersOpen(false)}
                className="rounded-lg sm:rounded-xl px-3 sm:px-4 py-2 text-xs sm:text-sm font-medium text-white transition-colors"
                style={{background: 'var(--blue-gradient)'}}
              >
                Apply
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

/* ---------------------- Small UI helpers ---------------------- */
const Chip = ({ children, onClear }) => (
  <span className="inline-flex items-center gap-1.5 sm:gap-2 rounded-full border border-gray-200 bg-white px-2.5 sm:px-3 py-1 sm:py-1.5 text-xs sm:text-sm text-gray-700 shadow-sm">
    {children}
    <button
      onClick={onClear}
      className="-mr-1 inline-flex h-4 w-4 sm:h-5 sm:w-5 items-center justify-center rounded-full hover:bg-gray-100 transition-colors"
      aria-label="Remove filter"
    >
      <FaTimes className="w-2.5 h-2.5 sm:w-3 sm:h-3" />
    </button>
  </span>
);

const SkeletonGrid = () => {
  const items = Array.from({ length: 8 });
  return (
    <div className="grid grid-cols-2 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 sm:gap-4 md:gap-5 lg:gap-6">
      {items.map((_, idx) => (
        <div key={idx} className="rounded-3xl border border-gray-200 bg-white p-3 sm:p-4 shadow-sm">
          <div className="aspect-square w-full rounded-3xl bg-gray-100 animate-pulse" />
          <div className="mt-3 h-3 sm:h-4 w-3/4 rounded bg-gray-100 animate-pulse" />
          <div className="mt-2 h-3 sm:h-4 w-1/2 rounded bg-gray-100 animate-pulse" />
          <div className="mt-3 h-8 sm:h-9 w-full rounded-lg bg-gray-100 animate-pulse" />
        </div>
      ))}
    </div>
  );
};

const ErrorState = ({ message, onRetry }) => (
  <div className="rounded-xl sm:rounded-2xl border border-red-200 bg-red-50 p-4 sm:p-6 text-center shadow-sm">
    <div className="mx-auto mb-3 h-8 w-8 sm:h-10 sm:w-10 rounded-full bg-red-100 flex items-center justify-center">
      <span className="text-lg sm:text-xl">⚠️</span>
    </div>
    <h3 className="text-base sm:text-lg font-semibold text-red-800">Something went wrong</h3>
    <p className="mt-1 text-xs sm:text-sm text-red-700">{message}</p>
    <button 
      onClick={onRetry} 
      className="mt-4 rounded-lg sm:rounded-xl bg-red-600 px-3 sm:px-4 py-2 text-xs sm:text-sm font-medium text-white hover:bg-red-700 transition-colors"
    >
      Try again
    </button>
  </div>
);

const EmptyState = ({ onReset, searchTerm }) => (
  <div className="rounded-xl sm:rounded-2xl border border-gray-200 bg-white p-6 sm:p-10 text-center shadow-sm">
    <div className="mx-auto mb-4 h-10 w-10 sm:h-12 sm:w-12 rounded-full bg-gray-100 flex items-center justify-center">
      <span className="text-xl sm:text-2xl">🔎</span>
    </div>
    <h3 className="text-base sm:text-lg font-semibold text-gray-900">
      {searchTerm ? `No products found for "${searchTerm}"` : 'No products found'}
    </h3>
    <p className="mt-1 text-xs sm:text-sm text-gray-600">
      {searchTerm ? 'Try adjusting your search terms or filters.' : 'Try adjusting your filters.'}
    </p>
    <div className="mt-4 sm:mt-6 flex items-center justify-center gap-2">
      <button 
        onClick={onReset} 
        className="rounded-lg sm:rounded-xl px-3 sm:px-4 py-2 text-xs sm:text-sm font-medium text-white transition-colors"
        style={{background: 'var(--blue-gradient)'}}
      >
        Clear all
      </button>
      <Link 
        to="/" 
        className="text-xs sm:text-sm text-gray-700 underline underline-offset-2 hover:text-blue-600 transition-colors"
      >
        Go to home
      </Link>
    </div>
  </div>
);

export default Products;
