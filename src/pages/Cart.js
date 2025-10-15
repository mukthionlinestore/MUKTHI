import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import axios from '../config/axios';
import { useAuth } from '../context/AuthContext';
import { useSettings } from '../context/SettingsContext';
import { useCart } from '../context/CartContext';
import { useWishlist } from '../context/WishlistContext';
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
  FaGift,
  FaCheckCircle,
  FaQuestionCircle,
  FaStar,
  FaFire
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
  const { 
    items: cartItems, 
    total: cartTotal, 
    totalItems: cartTotalItems, 
    loading: cartLoading, 
    updateCartItem, 
    removeFromCart, 
    clearCart 
  } = useCart();
  const { addToWishlist } = useWishlist();
  const [updatingItems, setUpdatingItems] = useState({});
  const [moving, setMoving] = useState({});
  const [viewMode, setViewMode] = useState('list'); // 'list' or 'grid'
  const [selectedItems, setSelectedItems] = useState(new Set()); // Track selected item IDs
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [confirmAction, setConfirmAction] = useState(null);
  const [confirmData, setConfirmData] = useState(null);
  const [stockStatus, setStockStatus] = useState({});
  const [checkingStock, setCheckingStock] = useState(false);
  const { withSignal } = useAbortableAxios();
  const debounce = useDebounce(350);

  // Stock validation function
  const validateCartStock = async (items) => {
    const outOfStockItems = [];
    const insufficientStockItems = [];
    
    for (const item of items) {
      try {
        const productId = item.product._id || item.product;
        const response = await axios.get(`/api/products/${productId}`);
        const product = response.data;
        
        if (!product.isActive) {
          outOfStockItems.push({
            name: product.name,
            reason: 'Product is no longer available'
          });
        } else {
          // Check multiple possible stock fields (prioritize quantity as it's used in ProductDetail)
          const stockQuantity = product.quantity !== undefined ? product.quantity : 
                               product.stock !== undefined ? product.stock : 
                               product.inventory !== undefined ? product.inventory : 
                               null;
          
          if (stockQuantity !== null) {
            if (stockQuantity === 0) {
              outOfStockItems.push({
                name: product.name,
                reason: 'Out of Stock'
              });
            } else if (stockQuantity < item.quantity) {
              insufficientStockItems.push({
                name: product.name,
                available: stockQuantity,
                requested: item.quantity
              });
            }
          }
        }
      } catch (error) {
        console.error('Error checking stock for product:', error);
        outOfStockItems.push({
          name: item.product?.name || 'Unknown Product',
          reason: 'Unable to verify stock'
        });
      }
    }
    
    return { outOfStockItems, insufficientStockItems };
  };

  // Check stock status for all cart items
  const checkAllStockStatus = async () => {
    if (!cartItems || cartItems.length === 0) return;
    
    setCheckingStock(true);
    const newStockStatus = {};
    
    for (const item of cartItems) {
      try {
        const productId = item.product._id || item.product;
        const response = await axios.get(`/api/products/${productId}`);
        const product = response.data;
        
        if (!product.isActive) {
          newStockStatus[item._id] = {
            status: 'unavailable',
            message: 'Product no longer available',
            available: 0
          };
        } else {
          // Check multiple possible stock fields (prioritize quantity as it's used in ProductDetail)
          const stockQuantity = product.quantity !== undefined ? product.quantity : 
                               product.stock !== undefined ? product.stock : 
                               product.inventory !== undefined ? product.inventory : 
                               null;
          
          if (stockQuantity !== null) {
            if (stockQuantity === 0) {
              newStockStatus[item._id] = {
                status: 'out_of_stock',
                message: 'Out of Stock',
                available: 0
              };
            } else if (stockQuantity < item.quantity) {
              newStockStatus[item._id] = {
                status: 'insufficient',
                message: `Only ${stockQuantity} available`,
                available: stockQuantity
              };
            } else {
              newStockStatus[item._id] = {
                status: 'available',
                message: `In Stock (${stockQuantity})`,
                available: stockQuantity
              };
            }
          } else {
            newStockStatus[item._id] = {
              status: 'unknown',
              message: 'Stock unknown',
              available: null
            };
          }
        }
      } catch (error) {
        console.error('Error checking stock for product:', error);
        newStockStatus[item._id] = {
          status: 'error',
          message: 'Unable to verify stock',
          available: null
        };
      }
    }
    
    setStockStatus(newStockStatus);
    setCheckingStock(false);
  };

  // Check stock status when cart items change
  useEffect(() => {
    if (cartItems && cartItems.length > 0) {
      checkAllStockStatus();
    }
  }, [cartItems]);

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
    if (!cartItems || !cartItems.length) return;
    const allItemIds = cartItems.map(item => item._id);
    setSelectedItems(new Set(allItemIds));
  };

  // Deselect all items
  const deselectAllItems = () => {
    setSelectedItems(new Set());
  };

  // Check if all items are selected
  const areAllItemsSelected = () => {
    if (!cartItems || !cartItems.length) return false;
    return cartItems.every(item => selectedItems.has(item._id));
  };

  // Handle checkout with stock validation
  const handleCheckout = async (e) => {
    e.preventDefault();
    
    if (selectedItems.size === 0) {
      toast.error('Please select items to checkout');
      return;
    }

    // Get selected cart items
    const selectedCartItems = cartItems.filter(item => selectedItems.has(item._id));
    
    try {
      // Validate stock for selected items
      const { outOfStockItems, insufficientStockItems } = await validateCartStock(selectedCartItems);
      
      if (outOfStockItems.length > 0 || insufficientStockItems.length > 0) {
        // Show error messages for out of stock items
        outOfStockItems.forEach(item => {
          toast.error(`${item.name}: ${item.reason}`);
        });
        
        // Show error messages for insufficient stock items
        insufficientStockItems.forEach(item => {
          toast.error(`${item.name}: Only ${item.available} available, you have ${item.requested} in cart`);
        });
        
        // Show main error message
        toast.error('Some items in your cart are out of stock or have insufficient quantity. Please decrease the quantity or remove the item before proceeding.');
        return;
      }
      
      // If all items have sufficient stock, navigate to checkout
      window.location.href = `/checkout?selectedItems=${Array.from(selectedItems).join(',')}`;
      
    } catch (error) {
      console.error('Error validating stock:', error);
      toast.error('Unable to verify stock. Please try again.');
    }
  };

  // Get selected items data
  const getSelectedItemsData = () => {
    if (!cartItems || !cartItems.length) return [];
    return cartItems.filter(item => selectedItems.has(item._id));
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
    const subtotal = selectedItems.size > 0 ? getSelectedItemsTotals().total : cartTotal || 0;
    const shippingCharges = selectedItems.size > 0 
      ? getSelectedItemsData().map(item => item.product?.shippingCharge || 0)
      : cartItems?.map(item => item.product?.shippingCharge || 0) || [];
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
        
        // Auto-select all items when cart loads
  useEffect(() => {
    if (cartItems && cartItems.length > 0) {
      const allItemIds = cartItems.map(item => item._id);
          setSelectedItems(new Set(allItemIds));
        }
  }, [cartItems]);

  const updateQuantity = async (itemId, nextQty) => {
    if (nextQty < 1) return;

    setUpdatingItems((p) => ({ ...p, [itemId]: true }));

    try {
      await updateCartItem(itemId, nextQty);
      } catch (error) {
        console.error('Error updating cart:', error);
      } finally {
        setUpdatingItems((p) => ({ ...p, [itemId]: false }));
      }
  };

  const removeItem = (itemId) => {
    setConfirmAction('removeItem');
    setConfirmData({ itemId });
    setShowConfirmModal(true);
  };

  const handleRemoveItem = async () => {
    try {
      await removeFromCart(confirmData.itemId);
      setShowConfirmModal(false);
    } catch (error) {
      console.error('Error removing item:', error);
    }
  };

  const moveToWishlist = async (productId, itemId) => {
    if (moving[itemId]) return; // lock
    setMoving((p) => ({ ...p, [itemId]: true }));
    try {
      await addToWishlist(productId);
      await removeItem(itemId);
    } catch (error) {
      console.error('Error moving to wishlist:', error);
    } finally {
      setMoving((p) => ({ ...p, [itemId]: false }));
    }
  };

  const handleClearCart = () => {
    setConfirmAction('clearCart');
    setConfirmData({});
    setShowConfirmModal(true);
  };

  const executeClearCart = async () => {
    try {
      await clearCart();
      setShowConfirmModal(false);
    } catch (error) {
      console.error('Error clearing cart:', error);
    }
  };

  // Check if cart has any valid items
  const hasValidItems = cartItems?.some(item => item.product && item.product.isActive !== false);

  // Confirmation Modal Component
  const ConfirmationModal = () => {
    if (!showConfirmModal) return null;

    const getModalContent = () => {
      switch (confirmAction) {
        case 'removeItem':
          return {
            icon: <FaTrash className="w-8 h-8 text-red-500" />,
            title: 'Remove Item',
            message: 'Are you sure you want to remove this item from your cart?',
            confirmText: 'Remove',
            confirmClass: 'bg-red-600 hover:bg-red-700 text-white',
            cancelClass: 'bg-gray-200 hover:bg-gray-300 text-gray-800'
          };
        case 'clearCart':
          return {
            icon: <FaExclamationTriangle className="w-8 h-8 text-orange-500" />,
            title: 'Clear Cart',
            message: 'Are you sure you want to clear all items from your cart? This action cannot be undone.',
            confirmText: 'Clear All',
            confirmClass: 'bg-orange-600 hover:bg-orange-700 text-white',
            cancelClass: 'bg-gray-200 hover:bg-gray-300 text-gray-800'
          };
        default:
          return {
            icon: <FaQuestionCircle className="w-8 h-8 text-blue-500" />,
            title: 'Confirm Action',
            message: 'Are you sure you want to proceed?',
            confirmText: 'Confirm',
            confirmClass: 'bg-blue-600 hover:bg-blue-700 text-white',
            cancelClass: 'bg-gray-200 hover:bg-gray-300 text-gray-800'
          };
      }
    };

    const content = getModalContent();

    const handleConfirm = () => {
      if (confirmAction === 'removeItem') {
        handleRemoveItem();
      } else if (confirmAction === 'clearCart') {
        executeClearCart();
      }
    };

    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        {/* Backdrop */}
        <div 
          className="absolute inset-0 bg-black/50 backdrop-blur-sm"
          onClick={() => setShowConfirmModal(false)}
        ></div>
        
        {/* Modal */}
        <div className="relative bg-white rounded-2xl shadow-2xl max-w-md w-full mx-4 transform transition-all duration-300 scale-100">
          {/* Header */}
          <div className="flex items-center justify-center p-6 border-b border-gray-200">
            <div className="flex items-center justify-center w-16 h-16 bg-gray-50 rounded-full">
              {content.icon}
            </div>
          </div>
          
          {/* Content */}
          <div className="p-6 text-center">
            <h3 className="text-xl font-bold text-gray-900 mb-2">
              {content.title}
            </h3>
            <p className="text-gray-600 mb-6 leading-relaxed">
              {content.message}
            </p>
          </div>
          
          {/* Actions */}
          <div className="flex gap-3 p-6 pt-0">
            <button
              onClick={() => setShowConfirmModal(false)}
              className={`flex-1 px-4 py-3 rounded-xl font-semibold transition-all duration-200 transform hover:scale-105 ${content.cancelClass}`}
            >
              Cancel
            </button>
            <button
              onClick={handleConfirm}
              className={`flex-1 px-4 py-3 rounded-xl font-semibold transition-all duration-200 transform hover:scale-105 ${content.confirmClass}`}
            >
              {content.confirmText}
            </button>
          </div>
        </div>
      </div>
    );
  };

  if (cartLoading) {
    return (
      <div className="min-h-screen relative flex items-center justify-center">
        {/* Single Gradient Overlay for Entire Cart Page */}
        <div className="absolute inset-0 "></div>
        <div className="text-center relative z-10">
          <FaSpinner className="w-8 h-8 sm:w-12 sm:h-12 text-blue-600 animate-spin mx-auto mb-4" />
          <p className="text-sm sm:text-base text-gray-600">Loading your cart...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen relative flex items-center justify-center px-3 sm:px-4">
        {/* Single Gradient Overlay for Entire Cart Page */}
        <div className="absolute inset-0 "></div>
        <div className="max-w-sm w-full bg-white shadow-xl border border-gray-200 rounded-2xl p-6 sm:p-8 text-center relative z-10">
          <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full flex items-center justify-center mx-auto mb-4 sm:mb-6 bg-gradient-to-r from-blue-600 to-purple-600">
            <FaShoppingCart className="w-8 h-8 sm:w-10 sm:h-10 text-white" />
          </div>
          <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-2 sm:mb-3">Access Your Cart</h2>
          <p className="text-sm sm:text-base text-gray-600 mb-6 sm:mb-8">Sign in to view and manage your shopping cart</p>
          <Link 
            to="/login" 
            className="inline-flex items-center justify-center w-full rounded-xl px-4 py-3 text-white font-semibold transition-all duration-200 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 shadow-lg hover:shadow-xl transform hover:scale-105"
          >
            Sign In
          </Link>
        </div>
      </div>
    );
  }

  if (!cartItems || !cartItems.length) {
    return (
      <div className="min-h-screen relative flex items-center justify-center px-3 sm:px-4">
        {/* Single Gradient Overlay for Entire Cart Page */}
        <div className="absolute inset-0 "></div>
        <div className="max-w-sm w-full bg-white shadow-xl rounded-2xl p-6 sm:p-8 text-center relative z-10">
          <div className="w-16 h-16 sm:w-20 sm:h-20 bg-gradient-to-r from-gray-700 via-gray-800 to-black rounded-full flex items-center justify-center mx-auto mb-4 sm:mb-6 relative">
            <div className="absolute inset-0 bg-white rounded-full m-1"></div>
            <FaShoppingCart className="w-8 h-8 sm:w-10 sm:h-10 text-black relative z-10" />
          </div>
          <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-2 sm:mb-3">Your Cart is Empty</h2>
          <p className="text-sm sm:text-base text-gray-600 mb-6 sm:mb-8">Add some products to get started with your shopping</p>
          <Link 
            to="/" 
            className="inline-flex items-center justify-center gap-2 w-full px-4 py-3 text-sm font-semibold text-white bg-gradient-to-r from-gray-700 via-gray-800 to-black hover:from-gray-800 hover:via-gray-900 hover:to-gray-800 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-200 hover:scale-105 focus:outline-none focus:ring-2 focus:ring-gray-500/20"
          >
            <FaArrowLeft className="w-3 h-3 sm:w-4 sm:h-4" />
            <span>Start Shopping</span>
          </Link>
        </div>
      </div>
    );
  }

  // Filter out invalid items for display
  const validItems = cartItems.filter(item => item.product && item.product.isActive !== false);
  const invalidItems = cartItems.filter(item => !item.product || item.product.isActive === false);

  return (
    <div className="min-h-screen relative">

      {/* Content Section */}
      <div className="py-2 sm:py-6 relative overflow-hidden z-10">
        {/* Animated Background Elements */}
        <div className="absolute inset-0">
          <div className="absolute top-10 left-10 w-16 h-16 sm:w-24 sm:h-24 bg-blue-500/10 rounded-full animate-pulse"></div>
          <div className="absolute top-20 right-20 w-12 h-12 sm:w-16 sm:h-16 bg-purple-500/10 rounded-full animate-pulse animation-delay-1000"></div>
          <div className="absolute bottom-10 left-1/4 w-14 h-14 sm:w-20 sm:h-20 bg-pink-500/10 rounded-full animate-pulse animation-delay-2000"></div>
          <div className="absolute bottom-20 right-1/3 w-8 h-8 sm:w-12 sm:h-12 bg-green-500/10 rounded-full animate-pulse animation-delay-3000"></div>
            </div>
            
        <div className="max-w-7xl mx-auto px-2 sm:px-4 lg:px-6 relative z-10">
          {/* Top Controls Bar */}
          <div className="flex items-center justify-end mb-3 sm:mb-4">
            {/* Control Buttons */}
            <div className="flex items-center gap-1.5 sm:gap-2">
              {/* Selection Controls */}
              {cartItems.length > 0 && (
                  <button
                    onClick={areAllItemsSelected() ? deselectAllItems : selectAllItems}
                  className="inline-flex items-center justify-between gap-2 px-3 py-2 text-xs sm:text-sm font-semibold text-white bg-gradient-to-r from-gray-700 via-gray-800 to-black hover:from-gray-800 hover:via-gray-900 hover:to-gray-800 rounded-xl shadow-lg hover:shadow-xl transition-all duration-200 hover:scale-105 focus:outline-none focus:ring-2 focus:ring-gray-500/20"
                  >
                    <div className="flex items-center gap-1">
                      <input
                        type="checkbox"
                        checked={areAllItemsSelected()}
                        onChange={areAllItemsSelected() ? deselectAllItems : selectAllItems}
                        className="w-3 h-3 sm:w-4 sm:h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                      />
                      <span className="hidden sm:inline">{areAllItemsSelected() ? 'Deselect All' : 'Select All'}</span>
                      <span className="sm:hidden">{areAllItemsSelected() ? 'Deselect' : 'Select'}</span>
                    </div>
                    <div className="w-3 h-3 bg-white rounded-full flex items-center justify-center">
                      <svg className="w-1.5 h-1.5 text-black" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    </div>
                  </button>
              )}
              
              {/* View Toggle */}
              <div className="flex items-center gap-1.5">
                <button
                  onClick={() => setViewMode('list')}
                  className={`inline-flex items-center justify-center gap-1.5 px-3 py-2 text-xs sm:text-sm font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-200 hover:scale-105 focus:outline-none focus:ring-2 focus:ring-gray-500/20 ${
                    viewMode === 'list' 
                      ? 'bg-gradient-to-r from-gray-700 via-gray-800 to-black text-white' 
                      : 'bg-white text-gray-700 border border-gray-200 hover:bg-gray-50'
                  }`}
                >
                  <span className="hidden sm:inline">List</span>
                  <span className="sm:hidden">L</span>
                  {viewMode === 'list' && (
                    <div className="w-3 h-3 bg-white rounded-full flex items-center justify-center">
                      <svg className="w-1.5 h-1.5 text-black" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                  )}
                </button>
                <button
                  onClick={() => setViewMode('grid')}
                  className={`inline-flex items-center justify-center gap-1.5 px-3 py-2 text-xs sm:text-sm font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-200 hover:scale-105 focus:outline-none focus:ring-2 focus:ring-gray-500/20 ${
                    viewMode === 'grid' 
                      ? 'bg-gradient-to-r from-gray-700 via-gray-800 to-black text-white' 
                      : 'bg-white text-gray-700 border border-gray-200 hover:bg-gray-50'
                  }`}
                >
                  <span className="hidden sm:inline">Grid</span>
                  <span className="sm:hidden">G</span>
                  {viewMode === 'grid' && (
                    <div className="w-3 h-3 bg-white rounded-full flex items-center justify-center">
                      <svg className="w-1.5 h-1.5 text-black" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                  )}
                </button>
          </div>
              
              {/* Clear Cart Button */}
              {cartItems.length > 0 && (
            <button
                  onClick={handleClearCart}
                  className="inline-flex items-center justify-between gap-2 px-3 py-2 text-xs sm:text-sm font-semibold text-white bg-gradient-to-r from-gray-700 via-gray-800 to-black hover:from-gray-800 hover:via-gray-900 hover:to-gray-800 rounded-xl shadow-lg hover:shadow-xl transition-all duration-200 hover:scale-105 focus:outline-none focus:ring-2 focus:ring-gray-500/20"
            >
                  <FaTrash className="w-3 h-3 sm:w-4 sm:h-4" />
                  <span className="hidden sm:inline">Clear All</span>
                  <span className="sm:hidden">Clear</span>
                  <div className="w-3 h-3 bg-white rounded-full flex items-center justify-center">
                    <svg className="w-1.5 h-1.5 text-black" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </div>
            </button>
          )}
            </div>
          </div>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-2 sm:gap-6">
        {/* Cart Items */}
          <div className="lg:col-span-2 space-y-2 sm:space-y-6">
            {/* Invalid Items */}
              {invalidItems.map((item) => (
              <div key={item._id} className="group bg-white rounded-3xl shadow-sm hover:shadow-xl transition-all duration-500 transform hover:scale-105 hover:-translate-y-2 border border-red-200 hover:border-red-300 p-3 sm:p-5">
                <div className="flex items-center gap-2 sm:gap-4 p-2 sm:p-4 bg-gradient-to-r from-red-50 to-pink-50 rounded-lg sm:rounded-xl">
                  <FaExclamationTriangle className="w-4 h-4 sm:w-6 sm:h-6 text-red-500 flex-shrink-0" />
                    <div className="flex-1">
                    <p className="text-xs sm:text-base text-red-800 font-semibold">Product No Longer Available</p>
                    <p className="text-xs text-red-600">This product has been removed from our store.</p>
                    </div>
                    <button
                      onClick={() => removeItem(item._id)}
                    className="text-red-600 hover:text-red-800 p-1.5 sm:p-2 rounded-lg sm:rounded-xl hover:bg-red-100 transition-all duration-300 hover:scale-110"
                    >
                    <FaTimes className="w-3 h-3 sm:w-5 sm:h-5" />
                    </button>
                  </div>
                </div>
              ))}

            {/* Valid Items */}
            {viewMode === 'list' ? (
              // List View - Mobile Optimized
              <div className="space-y-2 sm:space-y-3">
              {validItems.map((item) => (
                  <div key={item._id} className="group bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-[1.01] border border-gray-100 hover:border-gray-200 overflow-hidden">
                    <div className="flex gap-3 p-3">
                      {/* Image */}
                      <div className="relative w-20 h-20 sm:w-24 sm:h-24 rounded-xl overflow-hidden bg-gradient-to-br from-gray-100 to-gray-200 flex-shrink-0">
                        <img
                          src={item.product.images?.[0] || 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80'}
                          alt={item.product.name}
                          className="h-full w-full object-cover group-hover:scale-105 transition-transform duration-300"
                          onError={(e) => {
                            e.currentTarget.src = 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80';
                          }}
                        />
                        
                      {/* Selection Checkbox */}
                        <div className="absolute top-1 left-1">
                      <input
                        type="checkbox"
                        checked={selectedItems.has(item._id)}
                        onChange={() => toggleItemSelection(item._id)}
                        disabled={stockStatus[item._id]?.status === 'out_of_stock' || stockStatus[item._id]?.status === 'unavailable'}
                            className={`w-3 h-3 sm:w-4 sm:h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500 bg-white/90 backdrop-blur-sm ${
                              stockStatus[item._id]?.status === 'out_of_stock' || stockStatus[item._id]?.status === 'unavailable'
                                ? 'opacity-50 cursor-not-allowed'
                                : ''
                            }`}
                          />
                        </div>
                        
                        {/* Badges */}
                        <div className="absolute top-1 right-1 flex flex-col gap-0.5">
                          {item.product.isNewProduct && (
                            <span className="inline-flex items-center px-1 py-0.5 text-[6px] sm:text-[8px] font-bold bg-emerald-500 text-white rounded-full">
                              <FaGift className="w-1.5 h-1.5 sm:w-2 sm:h-2 mr-0.5" />
                              <span className="hidden sm:inline">New</span>
                            </span>
                          )}
                          {item.product.isFeatured && (
                            <span className="inline-flex items-center px-1 py-0.5 text-[6px] sm:text-[8px] font-bold bg-purple-500 text-white rounded-full">
                              <FaStar className="w-1.5 h-1.5 sm:w-2 sm:h-2 mr-0.5" />
                              <span className="hidden sm:inline">F</span>
                            </span>
                          )}
                          {item.product.discount > 0 && (
                            <span className="inline-flex items-center px-1 py-0.5 text-[6px] sm:text-[8px] font-bold bg-red-500 text-white rounded-full">
                              -{item.product.discount}%
                            </span>
                          )}
                        </div>
                      </div>

                      {/* Product Info */}
                      <div className="flex-1 min-w-0 flex flex-col justify-between">
                        <div className="flex-1">
                          <h3 className="text-xs sm:text-sm font-bold text-gray-900 leading-tight mb-1 line-clamp-2">
                            <Link to={`/product/${item.product._id}`} className="hover:text-blue-600 transition-colors">
                              {item.product.name}
                            </Link>
                          </h3>
                          <p className="text-[10px] sm:text-xs text-gray-500 mb-1">{item.product.brand || item.product.category}</p>
                          
                          {/* Stock Status */}
                          {stockStatus[item._id] && (
                            <div className={`text-[8px] sm:text-[10px] font-medium px-2 py-1 rounded-full inline-block mb-1 ${
                              stockStatus[item._id].status === 'available' 
                                ? 'bg-green-100 text-green-700' 
                                : stockStatus[item._id].status === 'insufficient'
                                ? 'bg-yellow-100 text-yellow-700'
                                : 'bg-red-100 text-red-700'
                            }`}>
                              {stockStatus[item._id].message}
                              {stockStatus[item._id].available !== null && ` (${stockStatus[item._id].available})`}
                            </div>
                          )}
                          {(item.selectedColor || item.selectedSize) && (
                            <div className="text-[8px] sm:text-[10px] text-gray-400">
                              {item.selectedColor && <span>Color: {item.selectedColor.name}</span>}
                              {item.selectedColor && item.selectedSize && <span className="mx-1">•</span>}
                              {item.selectedSize && <span>Size: {item.selectedSize}</span>}
                            </div>
                          )}
                        </div>

                        {/* Price and Controls Row */}
                        <div className="flex items-center justify-between mt-2">
                          {/* Price */}
                          <div className="flex flex-col">
                            <span className="text-sm sm:text-base font-bold text-gray-900">
                              {formatPrice(item.price)}
                            </span>
                            {item.product.originalPrice && item.product.originalPrice > item.price && (
                              <span className="text-[10px] sm:text-xs text-gray-400 line-through">
                                {formatPrice(item.product.originalPrice)}
                              </span>
                            )}
                            <span className="text-[8px] sm:text-[10px] text-gray-500">
                              Total: {formatPrice(item.price * item.quantity)}
                            </span>
                    </div>
                      
                      {/* Quantity Controls */}
                          <div className="flex items-center gap-1 bg-gray-100 rounded-full px-1 py-0.5">
                      <button
                        onClick={() => updateQuantity(item._id, item.quantity - 1)}
                        disabled={updatingItems[item._id]}
                              className="w-5 h-5 sm:w-6 sm:h-6 rounded-full flex items-center justify-center hover:bg-white disabled:opacity-50 transition-colors"
                        >
                          {updatingItems[item._id] ? (
                                <FaSpinner className="w-2 h-2 sm:w-3 sm:h-3 text-blue-600 animate-spin" />
                          ) : (
                                <FaMinus className="w-2 h-2 sm:w-3 sm:h-3 text-gray-600" />
                          )}
                      </button>
                            <span className="w-5 text-center text-[10px] sm:text-xs font-medium">{item.quantity}</span>
                      <button
                        onClick={() => updateQuantity(item._id, item.quantity + 1)}
                        disabled={updatingItems[item._id]}
                              className="w-5 h-5 sm:w-6 sm:h-6 rounded-full flex items-center justify-center hover:bg-white disabled:opacity-50 transition-colors"
                      >
                              <FaPlus className="w-2 h-2 sm:w-3 sm:h-3 text-gray-600" />
                      </button>
                          </div>
                        </div>
                    </div>
                      
                      {/* Action Buttons */}
                      <div className="flex flex-col justify-center gap-1">
                        <Link
                          to={`/product/${item.product._id}`}
                          className="w-6 h-6 sm:w-8 sm:h-8 bg-blue-50 hover:bg-blue-100 text-blue-500 rounded-full flex items-center justify-center transition-colors"
                          title="View product"
                        >
                          <FaEye className="w-3 h-3 sm:w-4 sm:h-4" />
                        </Link>
                      <button
                        onClick={() => moveToWishlist(item.product._id, item._id)}
                        disabled={moving[item._id]}
                          className="w-6 h-6 sm:w-8 sm:h-8 bg-pink-50 hover:bg-pink-100 text-pink-500 disabled:opacity-50 rounded-full flex items-center justify-center transition-colors"
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
                          className="w-6 h-6 sm:w-8 sm:h-8 bg-red-50 hover:bg-red-100 text-red-500 rounded-full flex items-center justify-center transition-colors"
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
              <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-2 sm:gap-3">
                {validItems.map((item) => (
                  <div key={item._id} className={`group relative bg-white rounded-3xl shadow-xl overflow-hidden transition-all duration-300 hover:shadow-2xl hover:scale-[1.02] h-full flex flex-col w-full ${
                    item.product.isSold ? 'opacity-60 grayscale' : ''
                  }`}>
                    
                    {/* Image Container with padding for margin effect */}
                    <div className="p-2 sm:p-3">
                      <div className="relative aspect-square rounded-2xl sm:rounded-3xl overflow-hidden bg-gradient-to-br from-gray-200 via-gray-100 to-gray-300">
                        <img
                          src={item.product.images?.[0] || 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80'}
                          alt={item.product.name || 'Product'}
                          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                          onError={(e) => {
                            e.currentTarget.src = 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80';
                          }}
                        />
                        
                      {/* Selection Checkbox */}
                        <div className="absolute top-1.5 sm:top-3 left-1.5 sm:left-3 z-20">
                        <input
                          type="checkbox"
                          checked={selectedItems.has(item._id)}
                          onChange={() => toggleItemSelection(item._id)}
                          disabled={stockStatus[item._id]?.status === 'out_of_stock' || stockStatus[item._id]?.status === 'unavailable'}
                            className={`w-4 h-4 sm:w-5 sm:h-5 text-blue-600 border-gray-300 rounded focus:ring-blue-500 bg-white/90 backdrop-blur-sm ${
                              stockStatus[item._id]?.status === 'out_of_stock' || stockStatus[item._id]?.status === 'unavailable'
                                ? 'opacity-50 cursor-not-allowed'
                                : ''
                            }`}
                        />
                      </div>
                        
                        {/* Badges Row - Top */}
                        <div className="absolute top-1.5 sm:top-3 left-1.5 sm:left-3 right-1.5 sm:right-3 flex justify-between items-start">
                          {/* Left side badges */}
                          <div className="flex flex-col gap-0.5 sm:gap-1 ml-8 sm:ml-10">
                        {item.product.isNewProduct && (
                              <div className="bg-black bg-opacity-60 backdrop-blur-sm text-white px-2 sm:px-2 py-0.5 sm:py-1 rounded-full text-[8px] sm:text-xs font-bold">
                                <span className="flex items-center gap-0.5">
                                  <FaGift className="w-1.5 h-1.5 sm:w-2.5 sm:h-2.5" />
                            New
                          </span>
                              </div>
                            )}
                            {item.product.isFeatured && (
                              <div className="bg-purple-500 bg-opacity-90 backdrop-blur-sm text-white px-2 sm:px-2 py-0.5 sm:py-1 rounded-full text-[8px] sm:text-xs font-bold">
                                Featured
                              </div>
                        )}
                        {item.product.discount > 0 && (
                              <div className="bg-red-500 bg-opacity-90 backdrop-blur-sm text-white px-2 sm:px-2 py-0.5 sm:py-1 rounded-full text-[8px] sm:text-xs font-bold">
                                <span className="flex items-center gap-0.5">
                                  <FaTag className="w-1.5 h-1.5 sm:w-2.5 sm:h-2.5" />
                            -{item.product.discount}%
                          </span>
                              </div>
                            )}
                            {item.product.isHot && (
                              <div className="bg-orange-500 bg-opacity-90 backdrop-blur-sm text-white px-2 sm:px-2 py-0.5 sm:py-1 rounded-full text-[8px] sm:text-xs font-bold">
                                <span className="flex items-center gap-0.5">
                                  <FaFire className="w-1.5 h-1.5 sm:w-2.5 sm:h-2.5" />
                                  Hot
                                </span>
                              </div>
                            )}
                            {(item.product.quantity <= 0 || item.product.isSold) && (
                              <div className="bg-gray-500 bg-opacity-90 backdrop-blur-sm text-white px-2 sm:px-2 py-0.5 sm:py-1 rounded-full text-[8px] sm:text-xs font-bold">
                                Sold Out
                              </div>
                        )}
                      </div>

                          {/* Right side icons */}
                          <div className="flex flex-col space-y-1">
                            {/* Wishlist Icon */}
                      <button
                              onClick={(e) => {
                                e.preventDefault();
                                e.stopPropagation();
                                // Add to wishlist functionality
                              }}
                              className="w-6 h-6 sm:w-8 sm:h-8 bg-white bg-opacity-20 backdrop-blur-sm rounded-full flex items-center justify-center transition-all duration-200 hover:bg-white hover:bg-opacity-30"
                            >
                              <FaHeart className="w-3 h-3 sm:w-4 sm:h-4 text-white" />
                            </button>
                            
                            {/* Quick View Icon */}
                            <Link
                              to={`/product/${item.product._id}`}
                              className="w-6 h-6 sm:w-8 sm:h-8 bg-white bg-opacity-20 backdrop-blur-sm rounded-full flex items-center justify-center transition-all duration-200 hover:bg-white hover:bg-opacity-30"
                            >
                              <FaEye className="w-3 h-3 sm:w-4 sm:h-4 text-white" />
                            </Link>
                            
                            {/* Remove from Cart Icon */}
                            <button
                              onClick={(e) => {
                                e.preventDefault();
                                e.stopPropagation();
                                removeItem(item._id);
                              }}
                              className="w-6 h-6 sm:w-8 sm:h-8 bg-white bg-opacity-20 backdrop-blur-sm rounded-full flex items-center justify-center transition-all duration-200 hover:bg-white hover:bg-opacity-30"
                            >
                              <FaTimes className="w-3 h-3 sm:w-4 sm:h-4 text-white" />
                      </button>
                          </div>
                    </div>

                        {/* Carousel dots */}
                        <div className="absolute bottom-1.5 sm:bottom-3 left-1/2 transform -translate-x-1/2 flex space-x-1">
                          <div className="w-1 h-1 sm:w-1.5 sm:h-1.5 bg-white rounded-full shadow-sm"></div>
                          <div className="w-1 h-1 sm:w-1.5 sm:h-1.5 bg-white bg-opacity-50 rounded-full"></div>
                          <div className="w-1 h-1 sm:w-1.5 sm:h-1.5 bg-white bg-opacity-50 rounded-full"></div>
                          <div className="w-1 h-1 sm:w-1.5 sm:h-1.5 bg-white bg-opacity-50 rounded-full"></div>
                        </div>

                        {/* Stock Status Overlay */}
                        {(item.product.quantity <= 0 || item.product.isSold) && (
                          <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                            <span className="text-white text-xs font-bold bg-red-500 px-2 py-1 rounded-full">
                              {item.product.isSold ? 'Sold Out' : 'Out of Stock'}
                            </span>
                          </div>
                        )}
                      </div>
                    </div>

                      {/* Product Info */}
                    <div className="px-3 sm:px-4 pb-3 sm:pb-4 flex-1 flex flex-col">
                      <Link
                        to={`/product/${item.product._id}`}
                        className="flex-1 flex flex-col group"
                      >
                        {/* Main Title */}
                        <h2 className="text-sm sm:text-base font-bold text-black mb-0.5 sm:mb-1 leading-tight group-hover:text-blue-600 transition-colors duration-200 line-clamp-2">
                            {item.product.name}
                        </h2>
                        
                        {/* Subtitle */}
                        <h3 className="text-xs sm:text-sm font-normal text-gray-400 mb-1 sm:mb-2">
                          {item.product.brand || item.product.category || 'Premium Quality'}
                        </h3>
                        
                        {/* Description */}
                        <p className="text-gray-500 text-[10px] sm:text-xs mb-2 sm:mb-3 leading-relaxed font-normal line-clamp-2">
                          {item.product.description || item.product.material || 'Premium quality product with excellent features and durability.'}
                        </p>
                        
                        {/* Stock Status */}
                        {stockStatus[item._id] && (
                          <div className={`text-[8px] sm:text-[10px] font-medium px-2 py-1 rounded-full inline-block mb-2 ${
                            stockStatus[item._id].status === 'available' 
                              ? 'bg-green-100 text-green-700' 
                              : stockStatus[item._id].status === 'insufficient'
                              ? 'bg-yellow-100 text-yellow-700'
                              : 'bg-red-100 text-red-700'
                          }`}>
                            {stockStatus[item._id].message}
                            {stockStatus[item._id].available !== null && ` (${stockStatus[item._id].available})`}
                          </div>
                        )}
                        
                        {/* Color & Size Info */}
                        {(item.selectedColor || item.selectedSize) && (
                          <div className="text-[10px] sm:text-xs text-gray-500 mb-2">
                            {item.selectedColor && <span>Color: {item.selectedColor.name}</span>}
                            {item.selectedColor && item.selectedSize && <span className="mx-1">•</span>}
                            {item.selectedSize && <span>Size: {item.selectedSize}</span>}
                      </div>
                        )}
                      </Link>

                      {/* Price and Quantity Row */}
                      <div className="flex items-end justify-between mb-2 sm:mb-3">
                      {/* Price */}
                        <div className="flex flex-col">
                          {item.product.originalPrice && item.product.originalPrice > item.price && (
                            <span className="text-[10px] sm:text-xs text-gray-500 line-through">
                              {formatPrice(item.product.originalPrice)}
                            </span>
                          )}
                          <span className="text-sm sm:text-lg font-bold text-black">
                          {formatPrice(item.price)}
                        </span>
                          <span className="text-[10px] sm:text-xs text-gray-500">
                          Total: {formatPrice(item.price * item.quantity)}
                        </span>
                      </div>

                      {/* Quantity Controls */}
                        <div className="flex items-center gap-1 bg-gray-100 rounded-full px-1 py-0.5">
                          <button
                            onClick={() => updateQuantity(item._id, item.quantity - 1)}
                            disabled={updatingItems[item._id]}
                            className="w-5 h-5 sm:w-6 sm:h-6 rounded-full flex items-center justify-center hover:bg-white disabled:opacity-50 transition-colors"
                          >
                            {updatingItems[item._id] ? (
                              <FaSpinner className="w-2 h-2 sm:w-3 sm:h-3 text-blue-600 animate-spin" />
                            ) : (
                              <FaMinus className="w-2 h-2 sm:w-3 sm:h-3 text-gray-600" />
                            )}
                          </button>
                          <span className="w-6 text-center text-xs sm:text-sm font-medium">{item.quantity}</span>
                          <button
                            onClick={() => updateQuantity(item._id, item.quantity + 1)}
                            disabled={updatingItems[item._id]}
                            className="w-5 h-5 sm:w-6 sm:h-6 rounded-full flex items-center justify-center hover:bg-white disabled:opacity-50 transition-colors"
                          >
                            <FaPlus className="w-2 h-2 sm:w-3 sm:h-3 text-gray-600" />
                          </button>
                        </div>
                      </div>

                      {/* View Product Button */}
                        <Link
                          to={`/product/${item.product._id}`}
                        className="bg-black text-white px-3 py-1.5 rounded-full text-[10px] sm:text-xs font-medium flex items-center justify-center space-x-1 hover:bg-gray-800 transition-colors"
                      >
                        <span className="hidden sm:inline">View Product</span>
                        <span className="sm:hidden">View</span>
                        <svg className="w-2.5 h-2.5 sm:w-3 sm:h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3" />
                        </svg>
                        </Link>
                  </div>
                </div>
              ))}
                </div>
              )}
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <div className="group bg-white rounded-3xl shadow-sm hover:shadow-xl transition-all duration-500 transform hover:scale-105 hover:-translate-y-2 border border-gray-100 hover:border-gray-200 p-3 sm:p-6 sticky top-4 sm:top-8">
              <h2 className="text-lg sm:text-2xl font-bold text-gray-900 mb-3 sm:mb-6 flex items-center gap-2">
                <FaCreditCard className="w-4 h-4 sm:w-5 sm:h-5 text-blue-600" />
                Order Summary
              </h2>
              
              <div className="space-y-2 sm:space-y-4 mb-4 sm:mb-8">
                {/* Selection Status */}
                {selectedItems.size > 0 && (
                  <div className="bg-gradient-to-r from-emerald-50 to-green-50 border border-emerald-200 rounded-lg sm:rounded-xl p-3 sm:p-4 mb-3 sm:mb-4 shadow-sm">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-emerald-800 font-medium">
                        {selectedItems.size} of {validItems.length} items selected
                      </span>
                      <button
                        onClick={deselectAllItems}
                        className="text-blue-600 hover:text-blue-800 text-xs font-medium"
                      >
                        Clear Selection
                      </button>
                    </div>
                  </div>
                )}
                
                <div className="flex justify-between items-center">
                  <span className="text-sm sm:text-base text-gray-600">
                    Subtotal ({selectedItems.size > 0 ? getSelectedItemsTotals().totalItems : cartTotalItems} items)
                  </span>
                  <span className="text-sm sm:text-base font-medium">
                    {selectedItems.size > 0 ? formatPrice(getSelectedItemsTotals().total) : formatPrice(cartTotal || 0)}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm sm:text-base text-gray-600">Shipping</span>
                  <span className={`text-sm sm:text-base font-medium ${debugShippingCalculation() === 0 ? 'text-blue-600' : ''}`}>
                    {debugShippingCalculation() === 0 ? 'Free' : formatPrice(debugShippingCalculation())}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm sm:text-base text-gray-600">Tax</span>
                  <span className="text-sm sm:text-base font-medium">
                    {formatPrice(calculateTax(selectedItems.size > 0 ? getSelectedItemsTotals().total : cartTotal || 0))}
                  </span>
                </div>
                <div className="border-t pt-3 sm:pt-4">
                  <div className="flex justify-between items-center">
                    <span className="text-lg sm:text-xl font-semibold text-gray-900">Total</span>
                    <span className="text-lg sm:text-xl font-semibold text-gray-900">
                      {formatPrice(calculateTotalWithTax(selectedItems.size > 0 ? getSelectedItemsTotals().total : cartTotal || 0) + debugShippingCalculation())}
                    </span>
                  </div>
                </div>
              </div>

              {/* Benefits */}
              <div className="space-y-2 sm:space-y-3 mb-6 sm:mb-8">
                <div className="flex items-center gap-2 text-xs sm:text-sm text-gray-600">
                  <FaTruck className="w-3 h-3 sm:w-4 sm:h-4 text-blue-600" />
                  <span>Free shipping on orders over {formatPrice(settings.freeShippingThreshold)}</span>
                </div>
                <div className="flex items-center gap-2 text-xs sm:text-sm text-gray-600">
                  <FaShieldAlt className="w-3 h-3 sm:w-4 sm:h-4 text-blue-600" />
                  <span>Secure checkout</span>
                </div>
                <div className="flex items-center gap-2 text-xs sm:text-sm text-gray-600">
                  <FaCreditCard className="w-3 h-3 sm:w-4 sm:h-4 text-blue-600" />
                  <span>Multiple payment options</span>
                </div>
              </div>

              {selectedItems.size > 0 ? (
                <button
                  onClick={handleCheckout}
                  className="w-full inline-flex items-center justify-center gap-2 rounded-xl sm:rounded-2xl bg-gradient-to-r from-gray-700 via-gray-800 to-black hover:from-gray-800 hover:via-gray-900 hover:to-gray-800 text-white py-3 sm:py-5 px-4 sm:px-6 text-xs sm:text-base font-semibold transition-all duration-200 hover:scale-105 shadow-lg hover:shadow-xl focus:outline-none focus:ring-2 focus:ring-gray-500/20"
                >
                  <FaCreditCard className="w-3 h-3 sm:w-5 sm:h-5" />
                  <span>Checkout Selected ({selectedItems.size} items)</span>
                  <div className="w-4 h-4 bg-white rounded-full flex items-center justify-center">
                    <svg className="w-2 h-2 text-black" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </div>
                </button>
              ) : hasValidItems ? (
                <div className="text-center text-gray-500 text-xs sm:text-base">
                  Select items to checkout
                </div>
              ) : (
                <div className="text-center text-gray-500 text-xs sm:text-base">
                  No valid items in cart
                </div>
              )}

              {/* Continue Shopping */}
              <div className="mt-3 sm:mt-6 text-center">
                <Link 
                  to="/" 
                  className="inline-flex items-center gap-2 text-black hover:text-gray-700 transition-colors text-sm font-medium"
                >
                  <FaArrowLeft className="w-3 h-3 sm:w-4 sm:h-4" />
                  <span>Continue Shopping</span>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
      </div>
      
      {/* Confirmation Modal */}
      <ConfirmationModal />
    </div>
  );
};

export default Cart;
