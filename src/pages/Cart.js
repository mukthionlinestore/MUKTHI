import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import axios from '../config/axios';
import { useAuth } from '../context/AuthContext';
import { useSettings } from '../context/SettingsContext';
import { 
  FaTrash, 
  FaMinus, 
  FaPlus, 
  FaShoppingCart, 
  FaArrowLeft, 
  FaHeart, 
  FaTimes, 
  FaExclamationTriangle,
  FaSpinner,
  FaEye,
  FaTag,
  FaTruck,
  FaShieldAlt,
  FaCreditCard,
  FaGift
} from 'react-icons/fa';
import { toast } from 'react-toastify';

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

const useDebounce = (delay = 350) => {
  const timers = useRef(new Map());
  const debounce = (key, fn) => {
    if (timers.current.has(key)) clearTimeout(timers.current.get(key));
    const t = setTimeout(fn, delay);
    timers.current.set(key, t);
  };
  useEffect(() => () => timers.current.forEach(clearTimeout), []);
  return debounce;
};

const Cart = () => {
  const { isAuthenticated } = useAuth();
  const { formatPrice, calculateTax, calculateTotalWithTax, calculateShipping, settings } = useSettings();
  const [cart, setCart] = useState(null);
  const [loading, setLoading] = useState(true);
  const [updatingItems, setUpdatingItems] = useState({});
  const [moving, setMoving] = useState({});
  const [viewMode, setViewMode] = useState('list'); // 'list' or 'grid'
  const [selectedItems, setSelectedItems] = useState(new Set()); // Track selected item IDs
  const { withSignal } = useAbortableAxios();
  const debounce = useDebounce(350);

  // Handle item selection
  const toggleItemSelection = (itemId) => {
    setSelectedItems(prev => {
      const newSet = new Set(prev);
      if (newSet.has(itemId)) {
        newSet.delete(itemId);
      } else {
        newSet.add(itemId);
      }
      return newSet;
    });
  };

  // Select all items
  const selectAllItems = () => {
    if (!cart || !cart.items) return;
    const allItemIds = cart.items.map(item => item._id);
    setSelectedItems(new Set(allItemIds));
  };

  // Deselect all items
  const deselectAllItems = () => {
    setSelectedItems(new Set());
  };

  // Check if all items are selected
  const areAllItemsSelected = () => {
    if (!cart || !cart.items || cart.items.length === 0) return false;
    return cart.items.every(item => selectedItems.has(item._id));
  };

  // Get selected items data
  const getSelectedItemsData = () => {
    if (!cart || !cart.items) return [];
    return cart.items.filter(item => selectedItems.has(item._id));
  };

  // Calculate totals for selected items
  const getSelectedItemsTotals = () => {
    const selectedItemsData = getSelectedItemsData();
    const total = selectedItemsData.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    const totalItems = selectedItemsData.reduce((sum, item) => sum + item.quantity, 0);
    return { total, totalItems, itemCount: selectedItemsData.length };
  };

  // Debug shipping calculation
  const debugShippingCalculation = () => {
    const subtotal = selectedItems.size > 0 ? getSelectedItemsTotals().total : cart.total || 0;
    const shippingCharges = selectedItems.size > 0 
      ? getSelectedItemsData().map(item => item.product?.shippingCharge || 0)
      : cart.items?.map(item => item.product?.shippingCharge || 0) || [];
    const shipping = calculateShipping(subtotal, shippingCharges);
    
    console.log('Shipping Debug:', {
      subtotal,
      shippingCharges,
      shipping,
      threshold: settings.freeShippingThreshold,
      isFree: shipping === 0
    });
    
    return shipping;
  };

  useEffect(() => {
    const fetchCart = async () => {
      if (!isAuthenticated) { setLoading(false); return; }
      try {
        setLoading(true);
        const response = await axios.get('/api/cart', withSignal());
        setCart(response.data);
        
        // Auto-select all items when cart loads
        if (response.data && response.data.items && response.data.items.length > 0) {
          const allItemIds = response.data.items.map(item => item._id);
          setSelectedItems(new Set(allItemIds));
        }
        
        // Show cleanup message if any
        if (response.data.message) {
          toast.info(response.data.message);
        }
      } catch (error) {
        if (error.name !== 'CanceledError') {
          console.error('Error fetching cart:', error);
          if (error.code === 'ERR_NETWORK') {
            toast.error('Network error - Please check if the server is running');
          } else if (error.response?.status === 401) {
            toast.error('Please log in to view your cart');
          } else {
            toast.error('Failed to load cart');
          }
        }
      } finally {
        setLoading(false);
      }
    };
    fetchCart();
  }, [isAuthenticated]);

  const updateQuantity = (itemId, nextQty) => {
    if (nextQty < 1) return;
    
    // Optimistic UI
    setCart((prev) => {
      if (!prev) return prev;
      const items = prev.items.map((it) => it._id === itemId ? { ...it, quantity: nextQty } : it);
      const total = items.reduce((s, it) => s + (it.price * it.quantity), 0);
      const totalItems = items.reduce((s, it) => s + it.quantity, 0);
      return { ...prev, items, total, totalItems };
    });

    setUpdatingItems((p) => ({ ...p, [itemId]: true }));

    // Debounced network call
    debounce(`qty-${itemId}`, async () => {
      try {
        const response = await axios.put(`/api/cart/update/${itemId}`, { quantity: nextQty });
        setCart(response.data);
        
        // Show cleanup message if any
        if (response.data.message) {
          toast.info(response.data.message);
        } else {
          toast.success('Cart updated');
        }
      } catch (error) {
        console.error('Error updating cart:', error);
        toast.error('Failed to update cart');
      } finally {
        setUpdatingItems((p) => ({ ...p, [itemId]: false }));
      }
    });
  };

  const removeItem = async (itemId) => {
    if (!window.confirm('Remove this item from your cart?')) return;
    try {
      const response = await axios.delete(`/api/cart/remove/${itemId}`);
      setCart(response.data);
      toast.success('Item removed from cart');
    } catch (error) {
      console.error('Error removing item:', error);
      toast.error('Failed to remove item');
    }
  };

  const moveToWishlist = async (productId, itemId) => {
    if (moving[itemId]) return; // lock
    setMoving((p) => ({ ...p, [itemId]: true }));
    try {
      await axios.post('/api/wishlist/add', { productId });
      const response = await axios.delete(`/api/cart/remove/${itemId}`);
      setCart(response.data);
      toast.success('Moved to wishlist successfully');
    } catch (error) {
      console.error('Error moving to wishlist:', error);
      toast.error('Failed to move item to wishlist');
    } finally {
      setMoving((p) => ({ ...p, [itemId]: false }));
    }
  };

  const clearCart = async () => {
    if (!window.confirm('Clear all items from your cart? This action cannot be undone.')) return;
    try {
      const response = await axios.delete('/api/cart/clear');
      setCart(response.data);
      toast.success('Cart cleared');
    } catch (error) {
      console.error('Error clearing cart:', error);
      toast.error('Failed to clear cart');
    }
  };

  // Check if cart has any valid items
  const hasValidItems = cart?.items?.some(item => item.product && item.product.isActive !== false);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-emerald-50 to-teal-50 flex items-center justify-center">
        <div className="text-center">
          <FaSpinner className="w-8 h-8 sm:w-12 sm:h-12 text-emerald-600 animate-spin mx-auto mb-4" />
          <p className="text-sm sm:text-base text-gray-600">Loading your cart...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-emerald-50 to-teal-50 flex items-center justify-center px-3 sm:px-4">
        <div className="max-w-sm w-full bg-white shadow-xl rounded-2xl p-6 sm:p-8 text-center">
          <div className="w-16 h-16 sm:w-20 sm:h-20 bg-gradient-to-r from-emerald-500 to-teal-500 rounded-full flex items-center justify-center mx-auto mb-4 sm:mb-6">
            <FaShoppingCart className="w-8 h-8 sm:w-10 sm:h-10 text-white" />
          </div>
          <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-2 sm:mb-3">Access Your Cart</h2>
          <p className="text-sm sm:text-base text-gray-600 mb-6 sm:mb-8">Sign in to view and manage your shopping cart</p>
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

  if (!cart || !cart.items || cart.items.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-emerald-50 to-teal-50 flex items-center justify-center px-3 sm:px-4">
        <div className="max-w-sm w-full bg-white shadow-xl rounded-2xl p-6 sm:p-8 text-center">
          <div className="w-16 h-16 sm:w-20 sm:h-20 bg-gradient-to-r from-emerald-500 to-teal-500 rounded-full flex items-center justify-center mx-auto mb-4 sm:mb-6">
            <FaShoppingCart className="w-8 h-8 sm:w-10 sm:h-10 text-white" />
          </div>
          <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-2 sm:mb-3">Your Cart is Empty</h2>
          <p className="text-sm sm:text-base text-gray-600 mb-6 sm:mb-8">Add some products to get started with your shopping</p>
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

  // Filter out invalid items for display
  const validItems = cart.items.filter(item => item.product && item.product.isActive !== false);
  const invalidItems = cart.items.filter(item => !item.product || item.product.isActive === false);

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 to-teal-50">
      {/* Header Section */}
      <div className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-3 sm:px-4 lg:px-6 py-4 sm:py-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 sm:gap-4">
            <div className="flex items-center gap-3 sm:gap-4">
              <Link 
                to="/" 
                className="inline-flex items-center justify-center h-8 w-8 sm:h-10 sm:w-10 rounded-lg bg-gray-100 hover:bg-gray-200 transition-colors"
              >
                <FaArrowLeft className="w-3 h-3 sm:w-4 sm:h-4 text-gray-600" />
            </Link>
              <div>
                <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-900">Shopping Cart</h1>
                <p className="text-xs sm:text-sm text-gray-600 mt-1">
                  {cart.totalItems} {cart.totalItems === 1 ? 'item' : 'items'} in your cart
                </p>
              </div>
            </div>
            
            <div className="flex items-center gap-2 sm:gap-3">
              {/* Selection Controls */}
              {cart.items.length > 0 && (
                <div className="flex items-center gap-2 bg-gray-100 rounded-lg p-1">
                  <button
                    onClick={areAllItemsSelected() ? deselectAllItems : selectAllItems}
                    className="inline-flex items-center gap-1.5 px-2.5 py-1.5 text-xs sm:text-sm font-medium text-gray-700 hover:text-gray-900 transition-colors"
                  >
                    <input
                      type="checkbox"
                      checked={areAllItemsSelected()}
                      onChange={areAllItemsSelected() ? deselectAllItems : selectAllItems}
                      className="w-3 h-3 sm:w-4 sm:h-4 text-emerald-600 border-gray-300 rounded focus:ring-emerald-500"
                    />
                    {areAllItemsSelected() ? 'Deselect All' : 'Select All'}
                  </button>
                </div>
              )}
              
              {/* View Toggle */}
              <div className="flex items-center bg-gray-100 rounded-lg p-1">
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
          </div>
              
              {/* Clear Cart Button */}
          {cart.items.length > 0 && (
            <button
              onClick={clearCart}
                  className="inline-flex items-center gap-1.5 sm:gap-2 rounded-lg sm:rounded-xl border border-red-200 px-2.5 sm:px-3 py-1.5 sm:py-2 text-xs sm:text-sm font-medium text-red-600 hover:bg-red-50 transition-colors"
            >
                  <FaTrash className="w-3 h-3 sm:w-4 sm:h-4" />
                  Clear All
            </button>
          )}
            </div>
          </div>
        </div>
        </div>

      {/* Content Section */}
      <div className="max-w-7xl mx-auto px-3 sm:px-4 lg:px-6 py-4 sm:py-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6">
        {/* Cart Items */}
          <div className="lg:col-span-2 space-y-4 sm:space-y-6">
            {/* Invalid Items */}
              {invalidItems.map((item) => (
              <div key={item._id} className="bg-white rounded-xl shadow-sm border border-red-200 p-3 sm:p-4">
                <div className="flex items-center gap-3 sm:gap-4 p-3 sm:p-4 bg-red-50 rounded-lg">
                  <FaExclamationTriangle className="w-4 h-4 sm:w-5 sm:h-5 text-red-500 flex-shrink-0" />
                    <div className="flex-1">
                    <p className="text-xs sm:text-sm text-red-800 font-medium">Product No Longer Available</p>
                    <p className="text-xs text-red-600">This product has been removed from our store.</p>
                    </div>
                    <button
                      onClick={() => removeItem(item._id)}
                    className="text-red-600 hover:text-red-800 p-1 rounded-lg hover:bg-red-100 transition-colors"
                    >
                    <FaTimes className="w-3 h-3 sm:w-4 sm:h-4" />
                    </button>
                  </div>
                </div>
              ))}

            {/* Valid Items */}
            {viewMode === 'list' ? (
              // List View
              <div className="space-y-3 sm:space-y-4">
              {validItems.map((item) => (
                  <div key={item._id} className="bg-white rounded-xl shadow-sm border border-gray-200 p-3 sm:p-4">
                    <div className="flex items-center gap-3 sm:gap-4">
                      {/* Selection Checkbox */}
                      <input
                        type="checkbox"
                        checked={selectedItems.has(item._id)}
                        onChange={() => toggleItemSelection(item._id)}
                        className="w-4 h-4 sm:w-5 sm:h-5 text-emerald-600 border-gray-300 rounded focus:ring-emerald-500 flex-shrink-0"
                      />
                    <img
                      src={item.product.images?.[0] || 'https://via.placeholder.com/80x80?text=No+Image'}
                      alt={item.product.name}
                        className="w-16 h-16 sm:w-20 sm:h-20 object-cover rounded-lg"
                      />
                      <div className="flex-1 min-w-0">
                        <h3 className="text-sm sm:text-base font-semibold text-gray-900 truncate">{item.product.name}</h3>
                        <p className="text-xs sm:text-sm text-gray-500">{item.product.category}</p>
                      {item.selectedColor && (
                          <p className="text-xs sm:text-sm text-gray-500">Color: {item.selectedColor.name}</p>
                      )}
                      {item.selectedSize && (
                          <p className="text-xs sm:text-sm text-gray-500">Size: {item.selectedSize}</p>
                      )}
                        <p className="text-sm sm:text-base font-bold text-gray-900">{formatPrice(item.price)}</p>
                    </div>
                      
                      {/* Quantity Controls */}
                      <div className="flex items-center gap-2">
                      <button
                        onClick={() => updateQuantity(item._id, item.quantity - 1)}
                        disabled={updatingItems[item._id]}
                          className="p-1.5 sm:p-2 rounded-lg hover:bg-gray-100 disabled:opacity-50 transition-colors"
                        >
                          {updatingItems[item._id] ? (
                            <FaSpinner className="w-3 h-3 sm:w-4 sm:h-4 text-emerald-600 animate-spin" />
                          ) : (
                            <FaMinus className="w-3 h-3 sm:w-4 sm:h-4 text-gray-600" />
                          )}
                      </button>
                        <span className="w-6 sm:w-8 text-center text-sm sm:text-base font-medium">{item.quantity}</span>
                      <button
                        onClick={() => updateQuantity(item._id, item.quantity + 1)}
                        disabled={updatingItems[item._id]}
                          className="p-1.5 sm:p-2 rounded-lg hover:bg-gray-100 disabled:opacity-50 transition-colors"
                      >
                          <FaPlus className="w-3 h-3 sm:w-4 sm:h-4 text-gray-600" />
                      </button>
                    </div>
                      
                      {/* Actions */}
                      <div className="flex items-center gap-1 sm:gap-2">
                        <Link
                          to={`/product/${item.product._id}`}
                          className="p-1.5 sm:p-2 text-gray-400 hover:text-emerald-600 hover:bg-emerald-50 rounded-lg transition-colors"
                          title="View product"
                        >
                          <FaEye className="w-3 h-3 sm:w-4 sm:h-4" />
                        </Link>
                      <button
                        onClick={() => moveToWishlist(item.product._id, item._id)}
                        disabled={moving[item._id]}
                          className="p-1.5 sm:p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 disabled:opacity-50 transition-colors"
                        title="Move to wishlist"
                      >
                          {moving[item._id] ? (
                            <FaSpinner className="w-3 h-3 sm:w-4 sm:h-4 animate-spin" />
                          ) : (
                            <FaHeart className="w-3 h-3 sm:w-4 sm:h-4" />
                          )}
                        </button>
                        <button
                          onClick={() => removeItem(item._id)}
                          className="p-1.5 sm:p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 transition-colors"
                          title="Remove item"
                        >
                          <FaTrash className="w-3 h-3 sm:w-4 sm:h-4" />
                      </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              // Grid View
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                {validItems.map((item) => (
                  <div key={item._id} className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden group hover:shadow-lg transition-all duration-200">
                    {/* Image Section */}
                    <div className="relative aspect-[4/3] overflow-hidden">
                      {/* Selection Checkbox */}
                      <div className="absolute top-2 left-2 z-10">
                        <input
                          type="checkbox"
                          checked={selectedItems.has(item._id)}
                          onChange={() => toggleItemSelection(item._id)}
                          className="w-4 h-4 sm:w-5 sm:h-5 text-emerald-600 border-gray-300 rounded focus:ring-emerald-500 bg-white shadow-sm"
                        />
                      </div>
                      <Link to={`/product/${item.product._id}`}>
                        <img
                          src={item.product.images?.[0] || 'https://via.placeholder.com/80x80?text=No+Image'}
                          alt={item.product.name}
                          className="h-full w-full object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                      </Link>
                      
                      {/* Badges */}
                      <div className="absolute top-2 left-2 flex flex-col gap-1">
                        {item.product.isNewProduct && (
                          <span className="inline-flex items-center px-2 py-1 text-[8px] sm:text-xs font-medium bg-emerald-500 text-white rounded-full">
                            <FaGift className="w-2 h-2 sm:w-3 sm:h-3 mr-1" />
                            New
                          </span>
                        )}
                        {item.product.discount > 0 && (
                          <span className="inline-flex items-center px-2 py-1 text-[8px] sm:text-xs font-medium bg-red-500 text-white rounded-full">
                            -{item.product.discount}%
                          </span>
                        )}
                      </div>

                      {/* Remove Button */}
                      <button
                        onClick={() => removeItem(item._id)}
                        className="absolute top-2 right-2 inline-flex items-center justify-center h-6 w-6 sm:h-8 sm:w-8 rounded-full bg-white/90 shadow-sm hover:bg-white transition-colors"
                        title="Remove from cart"
                      >
                        <FaTimes className="w-3 h-3 sm:w-4 sm:h-4 text-red-500" />
                      </button>
                    </div>

                    {/* Content Section */}
                    <div className="p-3 sm:p-4">
                      {/* Product Info */}
                      <div className="mb-3">
                        <h3 className="text-sm sm:text-base font-semibold text-gray-900 leading-tight mb-1 line-clamp-2">
                          <Link to={`/product/${item.product._id}`} className="hover:text-emerald-600 transition-colors">
                            {item.product.name}
                          </Link>
                        </h3>
                        <p className="text-xs sm:text-sm text-gray-500">{item.product.category}</p>
                        {item.selectedColor && (
                          <p className="text-xs sm:text-sm text-gray-500">Color: {item.selectedColor.name}</p>
                        )}
                        {item.selectedSize && (
                          <p className="text-xs sm:text-sm text-gray-500">Size: {item.selectedSize}</p>
                        )}
                      </div>

                      {/* Price */}
                      <div className="flex items-center justify-between mb-3">
                        <span className="text-lg sm:text-xl font-bold text-gray-900">
                          {formatPrice(item.price)}
                        </span>
                        <span className="text-sm sm:text-base text-gray-600">
                          Total: {formatPrice(item.price * item.quantity)}
                        </span>
                      </div>

                      {/* Quantity Controls */}
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => updateQuantity(item._id, item.quantity - 1)}
                            disabled={updatingItems[item._id]}
                            className="p-1.5 sm:p-2 rounded-lg hover:bg-gray-100 disabled:opacity-50 transition-colors"
                          >
                            {updatingItems[item._id] ? (
                              <FaSpinner className="w-3 h-3 sm:w-4 sm:h-4 text-emerald-600 animate-spin" />
                            ) : (
                              <FaMinus className="w-3 h-3 sm:w-4 sm:h-4 text-gray-600" />
                            )}
                          </button>
                          <span className="w-6 sm:w-8 text-center text-sm sm:text-base font-medium">{item.quantity}</span>
                          <button
                            onClick={() => updateQuantity(item._id, item.quantity + 1)}
                            disabled={updatingItems[item._id]}
                            className="p-1.5 sm:p-2 rounded-lg hover:bg-gray-100 disabled:opacity-50 transition-colors"
                          >
                            <FaPlus className="w-3 h-3 sm:w-4 sm:h-4 text-gray-600" />
                          </button>
                        </div>
                      </div>

                      {/* Action Buttons */}
                      <div className="flex gap-2">
                        <Link
                          to={`/product/${item.product._id}`}
                          className="flex-1 inline-flex items-center justify-center gap-1.5 sm:gap-2 rounded-lg border border-gray-300 px-3 py-2 text-xs sm:text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
                        >
                          <FaEye className="w-3 h-3 sm:w-4 sm:h-4" />
                          View
                        </Link>
                        <button
                          onClick={() => moveToWishlist(item.product._id, item._id)}
                          disabled={moving[item._id]}
                          className="flex-1 inline-flex items-center justify-center gap-1.5 sm:gap-2 rounded-lg border border-red-200 px-3 py-2 text-xs sm:text-sm font-medium text-red-600 hover:bg-red-50 disabled:opacity-60 transition-colors"
                        >
                          {moving[item._id] ? (
                            <FaSpinner className="w-3 h-3 sm:w-4 sm:h-4 animate-spin" />
                          ) : (
                            <FaHeart className="w-3 h-3 sm:w-4 sm:h-4" />
                          )}
                          Wishlist
                      </button>
                    </div>
                  </div>
                </div>
              ))}
                </div>
              )}
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 sm:p-6 sticky top-8">
              <h2 className="text-lg sm:text-xl font-semibold text-gray-900 mb-4 sm:mb-6">Order Summary</h2>
              
              <div className="space-y-3 sm:space-y-4 mb-6 sm:mb-8">
                {/* Selection Status */}
                {selectedItems.size > 0 && (
                  <div className="bg-emerald-50 border border-emerald-200 rounded-lg p-3 mb-4">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-emerald-800 font-medium">
                        {selectedItems.size} of {validItems.length} items selected
                      </span>
                      <button
                        onClick={deselectAllItems}
                        className="text-emerald-600 hover:text-emerald-800 text-xs font-medium"
                      >
                        Clear Selection
                      </button>
                    </div>
                  </div>
                )}
                
                <div className="flex justify-between items-center">
                  <span className="text-sm sm:text-base text-gray-600">
                    Subtotal ({selectedItems.size > 0 ? getSelectedItemsTotals().totalItems : cart.totalItems} items)
                  </span>
                  <span className="text-sm sm:text-base font-medium">
                    {selectedItems.size > 0 ? formatPrice(getSelectedItemsTotals().total) : formatPrice(cart.total || 0)}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm sm:text-base text-gray-600">Shipping</span>
                  <span className={`text-sm sm:text-base font-medium ${debugShippingCalculation() === 0 ? 'text-emerald-600' : ''}`}>
                    {debugShippingCalculation() === 0 ? 'Free' : formatPrice(debugShippingCalculation())}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm sm:text-base text-gray-600">Tax</span>
                  <span className="text-sm sm:text-base font-medium">
                    {formatPrice(calculateTax(selectedItems.size > 0 ? getSelectedItemsTotals().total : cart.total || 0))}
                  </span>
                </div>
                <div className="border-t pt-3 sm:pt-4">
                  <div className="flex justify-between items-center">
                    <span className="text-lg sm:text-xl font-semibold text-gray-900">Total</span>
                    <span className="text-lg sm:text-xl font-semibold text-gray-900">
                      {formatPrice(calculateTotalWithTax(selectedItems.size > 0 ? getSelectedItemsTotals().total : cart.total || 0) + debugShippingCalculation())}
                    </span>
                  </div>
                </div>
              </div>

              {/* Benefits */}
              <div className="space-y-2 sm:space-y-3 mb-6 sm:mb-8">
                <div className="flex items-center gap-2 text-xs sm:text-sm text-gray-600">
                  <FaTruck className="w-3 h-3 sm:w-4 sm:h-4 text-emerald-600" />
                  <span>Free shipping on orders over {formatPrice(settings.freeShippingThreshold)}</span>
                </div>
                <div className="flex items-center gap-2 text-xs sm:text-sm text-gray-600">
                  <FaShieldAlt className="w-3 h-3 sm:w-4 sm:h-4 text-emerald-600" />
                  <span>Secure checkout</span>
                </div>
                <div className="flex items-center gap-2 text-xs sm:text-sm text-gray-600">
                  <FaCreditCard className="w-3 h-3 sm:w-4 sm:h-4 text-emerald-600" />
                  <span>Multiple payment options</span>
                </div>
              </div>

              {selectedItems.size > 0 ? (
                <Link
                  to="/checkout"
                  state={{ selectedItems: Array.from(selectedItems) }}
                  className="w-full inline-flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 text-white py-3 sm:py-4 px-4 text-sm sm:text-base font-semibold hover:from-emerald-700 hover:to-teal-700 transition-all duration-200 shadow-lg hover:shadow-xl"
                >
                  <FaCreditCard className="w-3 h-3 sm:w-4 sm:h-4" />
                  Checkout Selected ({selectedItems.size} items)
                </Link>
              ) : hasValidItems ? (
                <div className="text-center text-gray-500 text-sm sm:text-base">
                  Select items to checkout
                </div>
              ) : (
                <div className="text-center text-gray-500 text-sm sm:text-base">
                  No valid items in cart
                </div>
              )}

              {/* Continue Shopping */}
              <div className="mt-4 sm:mt-6 text-center">
                <Link 
                  to="/" 
                  className="inline-flex items-center gap-2 text-sm sm:text-base text-emerald-600 hover:text-emerald-700 font-medium"
                >
                  <FaArrowLeft className="w-3 h-3 sm:w-4 sm:h-4" />
                  Continue Shopping
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Cart;
