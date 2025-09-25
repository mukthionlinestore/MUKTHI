import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { useSettings } from '../../context/SettingsContext';
import { 
  FaCheck, 
  FaTimes, 
  FaMinus, 
  FaPlus, 
  FaShoppingCart, 
  FaCreditCard, 
  FaChevronDown,
  FaPalette,
  FaRuler,
  FaBox,
  FaStar,
  FaTruck,
  FaShieldAlt
} from 'react-icons/fa';

const SizeColorModal = ({ 
  isOpen, 
  onClose, 
  onConfirm, 
  product, 
  quantity = 1,
  actionType = 'cart', // 'cart' or 'buy'
  preSelectedColor = null,
  preSelectedSize = null
}) => {
  const { formatPrice } = useSettings();
  const [selectedColor, setSelectedColor] = useState(preSelectedColor);
  const [selectedSize, setSelectedSize] = useState(preSelectedSize);
  const [qty, setQty] = useState(quantity);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setQty(quantity);
      setSelectedColor(preSelectedColor);
      setSelectedSize(preSelectedSize);
      setIsLoading(false);
    }
  }, [isOpen, quantity, preSelectedColor, preSelectedSize]);

  const handleConfirm = async () => {
    if (!product) return;
    
    // Check if product requires color selection
    const requiresColor = product.colors && product.colors.length > 0;
    const requiresSize = product.sizes && product.sizes.length > 0;
    
    if (requiresColor && !selectedColor) {
      // Show error with better UX
      const colorError = document.getElementById('color-error');
      if (colorError) {
        colorError.style.display = 'block';
        setTimeout(() => {
          colorError.style.display = 'none';
        }, 3000);
      }
      return;
    }
    
    if (requiresSize && !selectedSize) {
      // Show error with better UX
      const sizeError = document.getElementById('size-error');
      if (sizeError) {
        sizeError.style.display = 'block';
        setTimeout(() => {
          sizeError.style.display = 'none';
        }, 3000);
      }
      return;
    }
    
    setIsLoading(true);
    
    try {
      await onConfirm({
        product,
        quantity: qty,
        selectedColor,
        selectedSize
      });
      onClose();
    } catch (error) {
      console.error('Error adding to cart:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleClose = () => {
    setSelectedColor(null);
    setSelectedSize(null);
    setQty(quantity);
    setIsLoading(false);
    onClose();
  };

  if (!isOpen || !product) return null;

  const hasColors = product.colors && product.colors.length > 0;
  const hasSizes = product.sizes && product.sizes.length > 0;

  const modalContent = (
    <div 
      className="fixed inset-0 flex items-center justify-center p-2 sm:p-4 z-50"
      style={{
        backdropFilter: 'blur(16px)',
        background: 'rgba(0, 0, 0, 0.5)',
        animation: 'fadeIn 0.3s ease-out'
      }}
      onClick={handleClose}
    >
      <div 
        className="bg-white rounded-xl sm:rounded-2xl shadow-2xl w-full max-w-sm sm:max-w-md max-h-[95vh] sm:max-h-[90vh] flex flex-col overflow-hidden"
        style={{
          animation: 'slideIn 0.4s ease-out',
          background: 'linear-gradient(135deg, #ffffff 0%, #f8fafc 100%)',
          border: '1px solid rgba(255, 255, 255, 0.3)',
          boxShadow: '0 32px 64px -12px rgba(0, 0, 0, 0.25), 0 0 0 1px rgba(255, 255, 255, 0.1)'
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Enhanced Header */}
        <div className="relative p-3 sm:p-4 border-b border-gray-100 bg-gradient-to-r from-emerald-50 to-teal-50">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 sm:gap-3">
              <div className="relative">
                <img
                  src={product.images?.[0] || "https://via.placeholder.com/40x40"}
                  alt={product.name}
                  className="w-8 h-8 sm:w-10 sm:h-10 object-cover rounded-lg sm:rounded-xl shadow-sm"
                  style={{ border: '2px solid white' }}
                />
                {selectedColor && (
                  <div 
                    className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 sm:w-3 sm:h-3 rounded-full border border-white shadow-sm"
                    style={{ backgroundColor: selectedColor.code }}
                  />
                )}
                {/* Badge for new products */}
                {product.isNewProduct && (
                  <div className="absolute -top-1 -left-1 w-4 h-4 sm:w-5 sm:h-5 bg-gradient-to-r from-emerald-500 to-teal-500 rounded-full flex items-center justify-center">
                    <FaStar className="w-2 h-2 sm:w-2.5 sm:h-2.5 text-white" />
                  </div>
                )}
                {/* Badge for featured products */}
                {product.isFeatured && (
                  <div className="absolute -top-1 -right-1 w-4 h-4 sm:w-5 sm:h-5 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center">
                    <FaStar className="w-2 h-2 sm:w-2.5 sm:h-2.5 text-white" />
                  </div>
                )}
              </div>
              <div className="min-w-0 flex-1">
                <h3 className="text-xs sm:text-sm font-bold text-gray-900 leading-tight truncate">{product.name}</h3>
                <div className="flex items-center gap-1 sm:gap-2 mt-0.5">
                  <span className="text-sm sm:text-lg font-bold text-emerald-600">{formatPrice(product.price)}</span>
                  {product.originalPrice && product.originalPrice > product.price && (
                    <span className="text-xs text-gray-500 line-through">{formatPrice(product.originalPrice)}</span>
                  )}
                </div>
              </div>
            </div>
            <button
              onClick={handleClose}
              className="w-6 h-6 sm:w-8 sm:h-8 rounded-lg sm:rounded-xl bg-white/80 hover:bg-white flex items-center justify-center transition-all duration-200 hover:scale-110 shadow-sm"
            >
              <FaTimes className="w-2.5 h-2.5 sm:w-3 sm:h-3 text-gray-600" />
            </button>
          </div>
        </div>

        {/* Scrollable Content */}
        <div className="flex-1 overflow-y-auto scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100">
          <div className="p-3 sm:p-4 space-y-3 sm:space-y-4">
            {/* Enhanced Stock Status */}
            <div className="flex items-center justify-between p-2 sm:p-3 rounded-lg sm:rounded-xl bg-gradient-to-r from-emerald-50 to-teal-50 border border-emerald-100">
              <div className="flex items-center gap-1.5 sm:gap-2">
                <FaBox className="w-3 h-3 sm:w-4 sm:h-4 text-emerald-600" />
                <span className="text-xs sm:text-sm font-medium text-emerald-800">Stock Status</span>
              </div>
              <span className={`text-xs sm:text-sm font-semibold px-2 py-1 rounded-full ${
                product.quantity > 0 
                  ? 'bg-green-100 text-green-700' 
                  : 'bg-red-100 text-red-700'
              }`}>
                {product.quantity > 0 ? `${product.quantity} available` : 'Out of stock'}
              </span>
            </div>

            {/* Enhanced Color Selection */}
            {hasColors && (
              <div className="space-y-2 sm:space-y-3">
                <div className="flex items-center justify-between">
                  <h4 className="text-xs sm:text-sm font-semibold text-gray-900 flex items-center gap-1.5 sm:gap-2">
                    <FaPalette className="w-3 h-3 sm:w-4 sm:h-4 text-emerald-600" />
                    <span>Color</span>
                    <span className="text-xs text-red-500">*</span>
                  </h4>
                  {selectedColor && (
                    <span className="text-xs text-emerald-600 font-medium bg-emerald-50 px-2 py-1 rounded-full">
                      Selected: {selectedColor.name}
                    </span>
                  )}
                </div>
                <div className="grid grid-cols-3 sm:grid-cols-4 gap-2 max-h-32 overflow-y-auto scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100">
                  {product.colors.map((color, index) => (
                    <button
                      key={index}
                      onClick={() => setSelectedColor(color)}
                      className={`relative group p-2 rounded-lg sm:rounded-xl border-2 transition-all duration-200 hover:scale-105 ${
                        selectedColor?.name === color.name
                          ? 'border-emerald-500 shadow-lg shadow-emerald-500/20 bg-emerald-50'
                          : 'border-gray-200 hover:border-emerald-300 hover:shadow-md bg-white'
                      }`}
                    >
                      <div className="space-y-1">
                        <div
                          className="w-full h-4 sm:h-6 rounded-md shadow-inner border border-gray-200"
                          style={{ 
                            backgroundColor: color.code,
                            backgroundImage: `linear-gradient(45deg, transparent 30%, rgba(255,255,255,0.15) 50%, transparent 70%)`
                          }}
                        />
                        <span className="block text-xs font-medium text-gray-700 text-center truncate">
                          {color.name}
                        </span>
                      </div>
                      {selectedColor?.name === color.name && (
                        <div className="absolute -top-1 -right-1 w-3 h-3 sm:w-4 sm:h-4 bg-emerald-500 rounded-full flex items-center justify-center shadow-lg">
                          <FaCheck className="w-1.5 h-1.5 sm:w-2 sm:h-2 text-white" />
                        </div>
                      )}
                    </button>
                  ))}
                </div>
                <div 
                  id="color-error" 
                  className="hidden text-xs text-red-600 bg-red-50 p-2 rounded-md border border-red-200"
                >
                  Please select a color to continue
                </div>
              </div>
            )}

            {/* Enhanced Size Selection */}
            {hasSizes && (
              <div className="space-y-2 sm:space-y-3">
                <div className="flex items-center justify-between">
                  <h4 className="text-xs sm:text-sm font-semibold text-gray-900 flex items-center gap-1.5 sm:gap-2">
                    <FaRuler className="w-3 h-3 sm:w-4 sm:h-4 text-emerald-600" />
                    <span>Size</span>
                    <span className="text-xs text-red-500">*</span>
                  </h4>
                  {selectedSize && (
                    <span className="text-xs text-emerald-600 font-medium bg-emerald-50 px-2 py-1 rounded-full">
                      Selected: {selectedSize}
                    </span>
                  )}
                </div>
                <div className="grid grid-cols-4 sm:grid-cols-5 gap-2 max-h-24 overflow-y-auto scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100">
                  {product.sizes.map((size, index) => (
                    <button
                      key={index}
                      onClick={() => size.available && setSelectedSize(size.name)}
                      disabled={!size.available}
                      className={`relative p-2 rounded-lg sm:rounded-xl border-2 transition-all duration-200 hover:scale-105 ${
                        selectedSize === size.name
                          ? 'border-emerald-500 bg-emerald-50 shadow-lg shadow-emerald-500/20'
                          : size.available
                          ? 'border-gray-200 hover:border-emerald-300 hover:shadow-md bg-white'
                          : 'border-gray-100 bg-gray-50 cursor-not-allowed opacity-50'
                      }`}
                    >
                      <span className={`text-xs font-semibold ${
                        size.available ? 'text-gray-900' : 'text-gray-400'
                      }`}>
                        {size.name}
                      </span>
                      {selectedSize === size.name && (
                        <div className="absolute -top-1 -right-1 w-2.5 h-2.5 sm:w-3 sm:h-3 bg-emerald-500 rounded-full flex items-center justify-center">
                          <FaCheck className="w-1.5 h-1.5 text-white" />
                        </div>
                      )}
                      {!size.available && (
                        <div className="absolute inset-0 flex items-center justify-center">
                          <FaTimes className="w-2 h-2 text-gray-400" />
                        </div>
                      )}
                    </button>
                  ))}
                </div>
                <div 
                  id="size-error" 
                  className="hidden text-xs text-red-600 bg-red-50 p-2 rounded-md border border-red-200"
                >
                  Please select a size to continue
                </div>
              </div>
            )}

            {/* Enhanced Quantity Selection */}
            <div className="space-y-2 sm:space-y-3">
              <h4 className="text-xs sm:text-sm font-semibold text-gray-900 flex items-center gap-1.5 sm:gap-2">
                <FaBox className="w-3 h-3 sm:w-4 sm:h-4 text-emerald-600" />
                <span>Quantity</span>
              </h4>
              <div className="flex items-center gap-2 sm:gap-3 p-2 sm:p-3 rounded-lg sm:rounded-xl bg-gradient-to-r from-gray-50 to-white border border-gray-200">
                <button
                  onClick={() => setQty(Math.max(1, qty - 1))}
                  className="w-6 h-6 sm:w-8 sm:h-8 rounded-lg border border-gray-300 flex items-center justify-center hover:bg-white hover:border-emerald-400 transition-all duration-200 hover:scale-105 bg-white"
                >
                  <FaMinus className="w-2 h-2 sm:w-2.5 sm:h-2.5 text-gray-600" />
                </button>
                <div className="flex-1 text-center">
                  <span className="text-sm sm:text-lg font-bold text-gray-900">{qty}</span>
                  <div className="text-xs text-gray-500">
                    of {product.quantity}
                  </div>
                </div>
                <button
                  onClick={() => setQty(Math.min(product.quantity, qty + 1))}
                  disabled={qty >= product.quantity}
                  className="w-6 h-6 sm:w-8 sm:h-8 rounded-lg border border-gray-300 flex items-center justify-center hover:bg-white hover:border-emerald-400 transition-all duration-200 hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed bg-white"
                >
                  <FaPlus className="w-2 h-2 sm:w-2.5 sm:h-2.5 text-gray-600" />
                </button>
              </div>
            </div>

            {/* Enhanced Total Price */}
            <div className="p-3 sm:p-4 rounded-lg sm:rounded-xl bg-gradient-to-r from-emerald-500 to-teal-600 text-white">
              <div className="flex items-center justify-between">
                <span className="text-xs sm:text-sm font-semibold">Total:</span>
                <span className="text-sm sm:text-lg font-bold">{formatPrice(product.price * qty)}</span>
              </div>
              {qty > 1 && (
                <div className="text-xs opacity-90 mt-1">
                  {formatPrice(product.price)} × {qty} items
                </div>
              )}
            </div>

            {/* Trust Indicators */}
            <div className="flex items-center justify-between p-2 sm:p-3 rounded-lg sm:rounded-xl bg-gray-50 border border-gray-100">
              <div className="flex items-center gap-1.5 sm:gap-2">
                <FaTruck className="w-3 h-3 sm:w-4 sm:h-4 text-emerald-600" />
                <span className="text-xs text-gray-600">Free Shipping</span>
              </div>
              <div className="flex items-center gap-1.5 sm:gap-2">
                <FaShieldAlt className="w-3 h-3 sm:w-4 sm:h-4 text-emerald-600" />
                <span className="text-xs text-gray-600">Secure Checkout</span>
              </div>
            </div>
          </div>
        </div>

        {/* Enhanced Action Buttons */}
        <div className="p-3 sm:p-4 border-t border-gray-100 bg-white">
          <div className="flex gap-2 sm:gap-3">
            <button
              onClick={handleClose}
              className="flex-1 px-3 sm:px-4 py-2.5 sm:py-3 border-2 border-gray-300 rounded-lg sm:rounded-xl text-gray-700 font-semibold hover:bg-gray-50 transition-all duration-200 hover:scale-105 text-xs sm:text-sm"
            >
              Cancel
            </button>
            <button
              onClick={handleConfirm}
              disabled={isLoading || product.quantity <= 0}
              className="flex-1 px-3 sm:px-4 py-2.5 sm:py-3 rounded-lg sm:rounded-xl font-semibold text-white transition-all duration-200 hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-1.5 sm:gap-2 text-xs sm:text-sm shadow-lg"
              style={{
                background: actionType === 'buy' 
                  ? 'linear-gradient(135deg, #10b981 0%, #059669 100%)'
                  : 'linear-gradient(135deg, #059669 0%, #047857 100%)'
              }}
            >
              {isLoading ? (
                <div className="w-3 h-3 sm:w-4 sm:h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
              ) : (
                <>
                  {actionType === 'buy' ? <FaCreditCard className="w-2.5 h-2.5 sm:w-3 sm:h-3" /> : <FaShoppingCart className="w-2.5 h-2.5 sm:w-3 sm:h-3" />}
                  {actionType === 'buy' ? 'Buy Now' : 'Add to Cart'}
                </>
              )}
            </button>
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        
        @keyframes slideIn {
          from { 
            opacity: 0; 
            transform: scale(0.95) translateY(-10px); 
          }
          to { 
            opacity: 1; 
            transform: scale(1) translateY(0); 
          }
        }

        .scrollbar-thin::-webkit-scrollbar {
          width: 4px;
        }

        .scrollbar-thin::-webkit-scrollbar-track {
          background: #f1f5f9;
          border-radius: 2px;
        }

        .scrollbar-thin::-webkit-scrollbar-thumb {
          background: #cbd5e1;
          border-radius: 2px;
        }

        .scrollbar-thin::-webkit-scrollbar-thumb:hover {
          background: #94a3b8;
        }
      `}</style>
    </div>
  );

  // Use portal to render modal at document body level
  if (typeof document !== 'undefined') {
    return createPortal(modalContent, document.body);
  }
  return modalContent;
};

export default SizeColorModal;
