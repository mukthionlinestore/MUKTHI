import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from '../config/axios';
import { useAuth } from '../context/AuthContext';
import { useSettings } from '../context/SettingsContext';
import { 
  FaShoppingCart, 
  FaTrash, 
  FaArrowLeft, 
  FaTimes, 
  FaRegHeart,
  FaHeart,
  FaSpinner,
  FaEye,
  FaCalendar,
  FaTag,
  FaStar,
  FaGift,
  FaShare,
  FaCreditCard
} from 'react-icons/fa';
import { toast } from 'react-toastify';
import SizeColorModal from '../components/products/SizeColorModal';

// --- Helpers ---
const useAbortableAxios = () => {
  const abortRef = useRef(null);
  useEffect(() => () => abortRef.current?.abort?.(), []);
  const withSignal = () => {
    abortRef.current?.abort?.();
    abortRef.current = new AbortController();
    return { signal: abortRef.current.signal };
  };
  return { withSignal };
};

const Wishlist = () => {
  const { isAuthenticated } = useAuth();
  const { formatPrice } = useSettings();
  const navigate = useNavigate();
  const [wishlist, setWishlist] = useState(null);
  const [loading, setLoading] = useState(true);
  const [movingToCart, setMovingToCart] = useState({});
  const [removing, setRemoving] = useState({});
  const [viewMode, setViewMode] = useState('grid'); // 'grid' or 'list'
  const { withSignal } = useAbortableAxios();

  useEffect(() => {
    const fetchWishlist = async () => {
      if (!isAuthenticated) { setLoading(false); return; }
      try {
        setLoading(true);
        const response = await axios.get('/api/wishlist', withSignal());
        setWishlist(response.data);
      } catch (error) {
        if (error.name !== 'CanceledError') {
          console.error('Error fetching wishlist:', error);
          toast.error('Failed to load wishlist');
        }
      } finally {
        setLoading(false);
      }
    };
    fetchWishlist();
  }, [isAuthenticated]);

  const removeFromWishlist = async (productId) => {
    if (removing[productId]) return; // lock
    if (!window.confirm('Remove this item from your wishlist?')) return;

    setRemoving((p) => ({ ...p, [productId]: true }));
    try {
      const response = await axios.delete(`/api/wishlist/remove/${productId}`);
      setWishlist(response.data);
      toast.success('Item removed from wishlist');
    } catch (error) {
      console.error('Error removing from wishlist:', error);
      toast.error('Failed to remove item');
    } finally {
      setRemoving((p) => ({ ...p, [productId]: false }));
    }
  };

  const [showSizeColorModal, setShowSizeColorModal] = useState(false);
  const [selectedProductForModal, setSelectedProductForModal] = useState(null);
  const [modalAction, setModalAction] = useState('cart'); // 'cart' or 'buy'
  const [buyingNow, setBuyingNow] = useState({});

  const moveToCart = async (product) => {
    if (movingToCart[product._id]) return; // lock
    
    // Check if product has colors or sizes that need selection
    const hasColors = product.colors && product.colors.length > 0;
    const hasSizes = product.sizes && product.sizes.length > 0;
    
    if (hasColors || hasSizes) {
      setSelectedProductForModal(product);
      setShowSizeColorModal(true);
      return;
    }

    // If no colors/sizes required, add directly
    await addToCartDirectly(product._id);
  };

  const addToCartDirectly = async (productId, selectedColor = null, selectedSize = null) => {
    setMovingToCart((p) => ({ ...p, [productId]: true }));
    try {
      const requestData = { 
        productId, 
        quantity: 1, 
        selectedColor, 
        selectedSize 
      };
      
      await axios.post('/api/cart/add', requestData);
      const response = await axios.delete(`/api/wishlist/remove/${productId}`);
      setWishlist(response.data);
      toast.success('Moved to cart successfully');
    } catch (error) {
      console.error('Error moving to cart:', error);
      if (error.response?.data?.message === 'Product already in wishlist') {
        toast.error('This item is already in your cart');
      } else {
        toast.error('Failed to move item to cart');
      }
    } finally {
      setMovingToCart((p) => ({ ...p, [productId]: false }));
    }
  };

  const buyNow = async (product) => {
    if (buyingNow[product._id]) return; // lock
    
    // Check if product has colors or sizes that need selection
    const hasColors = product.colors && product.colors.length > 0;
    const hasSizes = product.sizes && product.sizes.length > 0;
    
    if (hasColors || hasSizes) {
      setSelectedProductForModal(product);
      setModalAction('buy');
      setShowSizeColorModal(true);
      return;
    }

    // If no colors/sizes required, buy directly
    await buyNowDirectly(product);
  };

  const buyNowDirectly = async (product, selectedColor = null, selectedSize = null, quantity = 1) => {
    const productId = product._id;
    setBuyingNow((p) => ({ ...p, [productId]: true }));
    try {
      // Navigate to checkout with direct buy data
      const directBuyItem = {
        product: product,
        quantity: quantity,
        selectedColor,
        selectedSize
      };
      
      // Navigate to checkout with direct buy
      navigate('/checkout', {
        state: {
          directBuy: true,
          directBuyItem
        }
      });
    } catch (error) {
      console.error('Error buying now:', error);
      toast.error('Failed to proceed to checkout');
    } finally {
      setBuyingNow((p) => ({ ...p, [productId]: false }));
    }
  };

  const handleModalConfirm = async (data) => {
    if (selectedProductForModal) {
      // Extract selectedColor, selectedSize, and quantity from the data object
      const { selectedColor, selectedSize, quantity } = data;
      
      if (modalAction === 'buy') {
        await buyNowDirectly(selectedProductForModal, selectedColor, selectedSize, quantity);
      } else {
        await addToCartDirectly(selectedProductForModal._id, selectedColor, selectedSize);
      }
      
      setShowSizeColorModal(false);
      setSelectedProductForModal(null);
      setModalAction('cart');
    }
  };

  const clearWishlist = async () => {
    if (!window.confirm('Clear your entire wishlist? This action cannot be undone.')) return;
    try {
      const response = await axios.delete('/api/wishlist/clear');
      setWishlist(response.data);
      toast.success('Wishlist cleared');
    } catch (error) {
      console.error('Error clearing wishlist:', error);
      toast.error('Failed to clear wishlist');
    }
  };

  // --- UI ---
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-emerald-50 to-teal-50 flex items-center justify-center px-3 sm:px-4">
        <div className="max-w-sm w-full bg-white shadow-xl rounded-2xl p-6 sm:p-8 text-center">
          <div className="w-16 h-16 sm:w-20 sm:h-20 bg-gradient-to-r from-emerald-500 to-teal-500 rounded-full flex items-center justify-center mx-auto mb-4 sm:mb-6">
            <FaHeart className="w-8 h-8 sm:w-10 sm:h-10 text-white" />
          </div>
          <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-2 sm:mb-3">Access Your Wishlist</h2>
          <p className="text-sm sm:text-base text-gray-600 mb-6 sm:mb-8">Sign in to view and manage your saved items</p>
          <Link 
            to="/login" 
            className="inline-flex items-center justify-center w-full rounded-xl px-4 py-3 bg-gradient-to-r from-emerald-600 to-teal-600 text-white font-semibold hover:from-emerald-700 hover:to-teal-700 transition-all duration-200 shadow-lg hover:shadow-xl"
          >
            Sign In
          </Link>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-emerald-50 to-teal-50 flex items-center justify-center">
        <div className="text-center">
          <FaSpinner className="w-8 h-8 sm:w-12 sm:h-12 text-emerald-600 animate-spin mx-auto mb-4" />
          <p className="text-sm sm:text-base text-gray-600">Loading your wishlist...</p>
        </div>
      </div>
    );
  }

  if (!wishlist || wishlist.products.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-emerald-50 to-teal-50 flex items-center justify-center px-3 sm:px-4">
        <div className="max-w-sm w-full bg-white shadow-xl rounded-2xl p-6 sm:p-8 text-center">
          <div className="w-16 h-16 sm:w-20 sm:h-20 bg-gradient-to-r from-emerald-500 to-teal-500 rounded-full flex items-center justify-center mx-auto mb-4 sm:mb-6">
            <FaRegHeart className="w-8 h-8 sm:w-10 sm:h-10 text-white" />
          </div>
          <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-2 sm:mb-3">Your Wishlist is Empty</h2>
          <p className="text-sm sm:text-base text-gray-600 mb-6 sm:mb-8">Start saving items you love by tapping the heart icon on products</p>
          <Link 
            to="/" 
            className="inline-flex items-center gap-2 w-full justify-center rounded-xl px-4 py-3 bg-gradient-to-r from-emerald-600 to-teal-600 text-white font-semibold hover:from-emerald-700 hover:to-teal-700 transition-all duration-200 shadow-lg hover:shadow-xl"
          >
            <FaArrowLeft className="w-3 h-3 sm:w-4 sm:h-4" />
            Start Shopping
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 to-teal-50">
      {/* Header Section */}
      <div className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-3 sm:px-4 lg:px-6 py-4 sm:py-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 sm:gap-4">
        <div>
              <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-900">My Wishlist</h1>
              <p className="text-xs sm:text-sm text-gray-600 mt-1">
                {wishlist.products.length} {wishlist.products.length === 1 ? 'item' : 'items'} saved
              </p>
        </div>
            <div className="flex items-center gap-2 sm:gap-3">
              {/* View Toggle */}
              <div className="flex items-center bg-gray-100 rounded-lg p-1">
                <button
                  onClick={() => setViewMode('grid')}
                  className={`p-1.5 sm:p-2 rounded-md text-xs sm:text-sm font-medium transition-colors ${
                    viewMode === 'grid' 
                      ? 'bg-white text-emerald-600 shadow-sm' 
                      : 'text-gray-600 hover:text-gray-900'
                  }`}
                >
                  Grid
                </button>
                <button
                  onClick={() => setViewMode('list')}
                  className={`p-1.5 sm:p-2 rounded-md text-xs sm:text-sm font-medium transition-colors ${
                    viewMode === 'list' 
                      ? 'bg-white text-emerald-600 shadow-sm' 
                      : 'text-gray-600 hover:text-gray-900'
                  }`}
                >
                  List
        </button>
      </div>

              {/* Clear Wishlist Button */}
              <button 
                onClick={clearWishlist} 
                className="inline-flex items-center gap-1.5 sm:gap-2 rounded-lg sm:rounded-xl border border-red-200 px-2.5 sm:px-3 py-1.5 sm:py-2 text-xs sm:text-sm font-medium text-red-600 hover:bg-red-50 transition-colors"
              >
                <FaTrash className="w-3 h-3 sm:w-4 sm:h-4" />
                Clear All
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Content Section */}
      <div className="max-w-7xl mx-auto px-3 sm:px-4 lg:px-6 py-4 sm:py-6">
        {/* Grid View */}
        {viewMode === 'grid' ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 sm:gap-4">
        {wishlist.products.map((item) => {
          const product = item.product;
          if (!product) {
            return (
                  <div key={item._id} className="bg-white rounded-xl shadow-sm border border-gray-200 p-3 sm:p-4 flex items-center justify-between">
                    <p className="text-xs sm:text-sm text-gray-600">Product no longer available</p>
                    <button 
                      onClick={() => removeFromWishlist(item.product)} 
                      className="text-red-600 hover:text-red-700 text-xs sm:text-sm"
                    >
                      Remove
                    </button>
              </div>
            );
          }
          return (
                <div key={item._id} className="group bg-white rounded-xl shadow-sm border border-gray-200 hover:shadow-lg transition-all duration-200 overflow-hidden">
                  {/* Image Section */}
              <div className="relative aspect-[4/3] overflow-hidden">
                <Link to={`/product/${product._id}`}>
                      <img 
                        src={product.images?.[0] || '/placeholder-image.jpg'} 
                        alt={product.name} 
                        className="h-full w-full object-cover group-hover:scale-105 transition-transform duration-300" 
                      />
                </Link>
                    
                    {/* Badges */}
                    <div className="absolute top-2 left-2 flex flex-col gap-1">
                {product.isNewProduct && (
                        <span className="inline-flex items-center px-2 py-1 text-[8px] sm:text-xs font-medium bg-emerald-500 text-white rounded-full">
                          <FaGift className="w-2 h-2 sm:w-3 sm:h-3 mr-1" />
                          New
                        </span>
                      )}
                      {product.discount > 0 && (
                        <span className="inline-flex items-center px-2 py-1 text-[8px] sm:text-xs font-medium bg-red-500 text-white rounded-full">
                          -{product.discount}%
                        </span>
                      )}
                    </div>

                    {/* Remove Button */}
                <button
                  onClick={() => removeFromWishlist(product._id)}
                  disabled={removing[product._id]}
                      className="absolute top-2 right-2 inline-flex items-center justify-center h-6 w-6 sm:h-8 sm:w-8 rounded-full bg-white/90 shadow-sm hover:bg-white transition-colors"
                  title="Remove from wishlist"
                >
                      {removing[product._id] ? (
                        <FaSpinner className="w-3 h-3 sm:w-4 sm:h-4 text-red-500 animate-spin" />
                      ) : (
                        <FaTimes className="w-3 h-3 sm:w-4 sm:h-4 text-red-500" />
                      )}
                </button>
              </div>

                  {/* Content Section */}
                  <div className="p-3 sm:p-4">
                    {/* Brand & Category */}
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-xs sm:text-sm text-emerald-600 font-medium">{product.brand}</span>
                      <span className="text-xs sm:text-sm text-gray-500">{product.category}</span>
                    </div>

                    {/* Product Name */}
                    <h4 className="text-sm sm:text-base font-semibold text-gray-900 leading-tight mb-2 line-clamp-2">
                      <Link to={`/product/${product._id}`} className="hover:text-emerald-600 transition-colors">
                        {product.name}
                      </Link>
                </h4>

                    {/* Price */}
                    <div className="flex items-center gap-2 mb-2">
                      <span className="text-lg sm:text-xl font-bold text-gray-900">
                        {formatPrice(product.price || 0)}
                      </span>
                      {product.originalPrice && product.originalPrice > product.price && (
                        <span className="text-xs sm:text-sm text-gray-500 line-through">
                          {formatPrice(product.originalPrice)}
                        </span>
                      )}
                    </div>

                    {/* Rating */}
                    {product.rating && (
                      <div className="flex items-center gap-1 mb-2">
                        <FaStar className="w-3 h-3 sm:w-4 sm:h-4 text-yellow-400" />
                        <span className="text-xs sm:text-sm text-gray-600">{product.rating}</span>
                      </div>
                    )}

                    {/* Added Date */}
                    <div className="flex items-center gap-1 mb-3 text-xs text-gray-500">
                      <FaCalendar className="w-3 h-3" />
                      <span>Added {new Date(item.addedAt).toLocaleDateString()}</span>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex flex-col gap-2">
                      {/* Buy Now Button */}
                      <button
                        onClick={() => buyNow(product)}
                        disabled={buyingNow[product._id] || product.quantity <= 0}
                        className="w-full inline-flex items-center justify-center gap-1.5 sm:gap-2 rounded-lg bg-gradient-to-r from-purple-600 to-pink-600 text-white px-3 py-2 text-xs sm:text-sm font-medium hover:from-purple-700 hover:to-pink-700 disabled:opacity-60 transition-all duration-200"
                      >
                        {buyingNow[product._id] ? (
                          <>
                            <FaSpinner className="w-3 h-3 sm:w-4 sm:h-4 animate-spin" />
                            Processing...
                          </>
                        ) : (
                          <>
                            <FaCreditCard className="w-3 h-3 sm:w-4 sm:h-4" />
                            Buy Now
                          </>
                        )}
                      </button>

                      {/* Add to Cart Button */}
                      <button
                        onClick={() => moveToCart(product)}
                        disabled={movingToCart[product._id]}
                        className="w-full inline-flex items-center justify-center gap-1.5 sm:gap-2 rounded-lg bg-gradient-to-r from-emerald-600 to-teal-600 text-white px-3 py-2 text-xs sm:text-sm font-medium hover:from-emerald-700 hover:to-teal-700 disabled:opacity-60 transition-all duration-200"
                      >
                        {movingToCart[product._id] ? (
                          <>
                            <FaSpinner className="w-3 h-3 sm:w-4 sm:h-4 animate-spin" />
                            Adding...
                          </>
                        ) : (
                          <>
                            <FaShoppingCart className="w-3 h-3 sm:w-4 sm:h-4" />
                            Add to Cart
                          </>
                        )}
                      </button>
                      
                      <div className="flex gap-2">
                        <Link
                          to={`/product/${product._id}`}
                          className="flex-1 inline-flex items-center justify-center gap-1.5 sm:gap-2 rounded-lg border border-gray-300 px-3 py-2 text-xs sm:text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
                        >
                          <FaEye className="w-3 h-3 sm:w-4 sm:h-4" />
                          View
                        </Link>
                        <button
                          onClick={() => removeFromWishlist(product._id)}
                          disabled={removing[product._id]}
                          className="flex-1 inline-flex items-center justify-center gap-1.5 sm:gap-2 rounded-lg border border-red-200 px-3 py-2 text-xs sm:text-sm font-medium text-red-600 hover:bg-red-50 disabled:opacity-60 transition-colors"
                        >
                          <FaTrash className="w-3 h-3 sm:w-4 sm:h-4" />
                          Remove
                        </button>
                      </div>
                    </div>
              </div>
            </div>
          );
        })}
      </div>
        ) : (
          /* List View */
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-3 sm:px-4 py-2 sm:py-3 text-left text-xs sm:text-sm font-medium text-gray-500 uppercase tracking-wider">Product</th>
                    <th className="px-3 sm:px-4 py-2 sm:py-3 text-left text-xs sm:text-sm font-medium text-gray-500 uppercase tracking-wider">Price</th>
                    <th className="px-3 sm:px-4 py-2 sm:py-3 text-left text-xs sm:text-sm font-medium text-gray-500 uppercase tracking-wider">Added</th>
                    <th className="px-3 sm:px-4 py-2 sm:py-3 text-right text-xs sm:text-sm font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {wishlist.products.map((item) => {
                    const product = item.product;
                    if (!product) {
                      return (
                        <tr key={item._id}>
                          <td className="px-3 sm:px-4 py-2 sm:py-3 text-xs sm:text-sm text-gray-600">
                            Product no longer available
                          </td>
                          <td className="px-3 sm:px-4 py-2 sm:py-3"></td>
                          <td className="px-3 sm:px-4 py-2 sm:py-3"></td>
                          <td className="px-3 sm:px-4 py-2 sm:py-3 text-right">
                            <button 
                              onClick={() => removeFromWishlist(item.product)} 
                              className="text-red-600 hover:text-red-700 text-xs sm:text-sm"
                            >
                              Remove
                            </button>
                          </td>
                        </tr>
                      );
                    }
                    return (
                      <tr key={item._id} className="hover:bg-gray-50">
                        <td className="px-3 sm:px-4 py-2 sm:py-3 whitespace-nowrap">
                          <div className="flex items-center">
                            <div className="h-12 w-12 sm:h-16 sm:w-16 flex-shrink-0">
                              <img 
                                src={product.images?.[0] || '/placeholder-image.jpg'} 
                                alt={product.name} 
                                className="h-full w-full object-cover rounded-lg" 
                              />
                            </div>
                            <div className="ml-3 sm:ml-4">
                              <div className="text-xs sm:text-sm font-medium text-gray-900">{product.name}</div>
                              <div className="text-xs sm:text-sm text-gray-500">{product.brand}</div>
                            </div>
                          </div>
                        </td>
                        <td className="px-3 sm:px-4 py-2 sm:py-3 whitespace-nowrap">
                          <div className="text-sm sm:text-base font-semibold text-gray-900">
                            {formatPrice(product.price || 0)}
                          </div>
                        </td>
                        <td className="px-3 sm:px-4 py-2 sm:py-3 whitespace-nowrap text-xs sm:text-sm text-gray-500">
                          {new Date(item.addedAt).toLocaleDateString()}
                        </td>
                        <td className="px-3 sm:px-4 py-2 sm:py-3 whitespace-nowrap text-right text-xs sm:text-sm font-medium">
                          <div className="flex items-center justify-end space-x-1">
                            <button
                              onClick={() => buyNow(product)}
                              disabled={buyingNow[product._id] || product.quantity <= 0}
                              className="p-1.5 sm:p-2 text-purple-600 hover:bg-purple-50 rounded-md transition-colors"
                              title="Buy now"
                            >
                              {buyingNow[product._id] ? (
                                <FaSpinner className="w-3 h-3 sm:w-4 sm:h-4 animate-spin" />
                              ) : (
                                <FaCreditCard className="w-3 h-3 sm:w-4 sm:h-4" />
                              )}
                            </button>
                            <button
                              onClick={() => moveToCart(product)}
                              disabled={movingToCart[product._id]}
                              className="p-1.5 sm:p-2 text-emerald-600 hover:bg-emerald-50 rounded-md transition-colors"
                              title="Add to cart"
                            >
                              {movingToCart[product._id] ? (
                                <FaSpinner className="w-3 h-3 sm:w-4 sm:h-4 animate-spin" />
                              ) : (
                                <FaShoppingCart className="w-3 h-3 sm:w-4 sm:h-4" />
                              )}
                            </button>
                            <Link
                              to={`/product/${product._id}`}
                              className="p-1.5 sm:p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-md transition-colors"
                              title="View product"
                            >
                              <FaEye className="w-3 h-3 sm:w-4 sm:h-4" />
                            </Link>
                            <button
                              onClick={() => removeFromWishlist(product._id)}
                              disabled={removing[product._id]}
                              className="p-1.5 sm:p-2 text-red-600 hover:bg-red-50 rounded-md transition-colors"
                              title="Remove from wishlist"
                            >
                              {removing[product._id] ? (
                                <FaSpinner className="w-3 h-3 sm:w-4 sm:h-4 animate-spin" />
                              ) : (
                                <FaTrash className="w-3 h-3 sm:w-4 sm:h-4" />
                              )}
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Continue Shopping */}
        <div className="mt-6 sm:mt-8 text-center">
          <Link 
            to="/" 
            className="inline-flex items-center gap-2 rounded-xl border border-gray-300 px-4 py-2 sm:py-3 text-sm sm:text-base font-medium text-gray-700 hover:bg-gray-50 transition-colors"
          >
            <FaArrowLeft className="w-3 h-3 sm:w-4 sm:h-4" />
            Continue Shopping
        </Link>
        </div>

        {/* Size Color Modal */}
        {showSizeColorModal && selectedProductForModal && (
          <SizeColorModal
            isOpen={showSizeColorModal}
            onClose={() => {
              setShowSizeColorModal(false);
              setSelectedProductForModal(null);
              setModalAction('cart');
            }}
            onConfirm={handleModalConfirm}
            product={selectedProductForModal}
            quantity={1}
            actionType={modalAction}
          />
        )}
      </div>
    </div>
  );
};

export default Wishlist;
