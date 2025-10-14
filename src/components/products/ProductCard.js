// import React, { useState } from 'react';
// import { Link, useNavigate } from 'react-router-dom';
// import { 
//   FaShoppingCart, 
//   FaHeart, 
//   FaStar, 
//   FaEye,
//   FaGift,
//   FaFire,
//   FaTag,
//   FaTruck,
//   FaShieldAlt,
//   FaSpinner,
//   FaCreditCard
// } from 'react-icons/fa';
// import { useCart } from '../../context/CartContext';
// import { useWishlist } from '../../context/WishlistContext';
// import { useSettings } from '../../context/SettingsContext';
// import { toast } from 'react-toastify';
// import SizeColorModal from './SizeColorModal';

// const ProductCard = ({ product }) => {
//   const { addToCart } = useCart();
//   const { addToWishlist, removeFromWishlist, isInWishlist } = useWishlist();
//   const { formatPrice } = useSettings();
//   const navigate = useNavigate();
//   const [showSizeColorModal, setShowSizeColorModal] = useState(false);
//   const [isAddingToCart, setIsAddingToCart] = useState(false);
//   const [isWishlistLoading, setIsWishlistLoading] = useState(false);
//   const [buyingNow, setBuyingNow] = useState(false);
//   const [modalAction, setModalAction] = useState('cart'); // 'cart' or 'buy'

//   // Safely get the product image
//   const getProductImage = () => {
//     if (!product.images || !Array.isArray(product.images) || product.images.length === 0) {
//       return 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80';
//     }
    
//     const thumbnailIndex = product.thumbnailIndex || 0;
//     const imageIndex = Math.min(thumbnailIndex, product.images.length - 1);
//     return product.images[imageIndex];
//   };

//   const handleAddToCart = async (e) => {
//     e.preventDefault();
//     e.stopPropagation();
    
//     if (product.quantity <= 0) {
//       toast.error('Product is out of stock');
//       return;
//     }

//     // Check if product has colors or sizes that need selection
//     const hasColors = product.colors && product.colors.length > 0;
//     const hasSizes = product.sizes && product.sizes.length > 0;
    
//     if (hasColors || hasSizes) {
//       setModalAction('cart');
//       setShowSizeColorModal(true);
//       return;
//     }

//     setIsAddingToCart(true);
//     try {
//     await addToCart(product, 1);
//       toast.success('Added to cart successfully!');
//     } catch (error) {
//       toast.error('Failed to add to cart');
//     } finally {
//       setIsAddingToCart(false);
//     }
//   };

//   const handleWishlistToggle = async (e) => {
//     e.preventDefault();
//     e.stopPropagation();
    
//     setIsWishlistLoading(true);
//     try {
//     if (isInWishlist(product._id)) {
//       await removeFromWishlist(product._id);
//         toast.success('Removed from wishlist');
//     } else {
//       await addToWishlist(product);
//         toast.success('Added to wishlist');
//       }
//     } catch (error) {
//       toast.error('Failed to update wishlist');
//     } finally {
//       setIsWishlistLoading(false);
//     }
//   };

//   const handleModalConfirm = async ({ product, quantity, selectedColor, selectedSize }) => {
//     if (modalAction === 'buy') {
//       buyNowDirectly(product, selectedColor, selectedSize, quantity);
//     } else {
//       setIsAddingToCart(true);
//       try {
//     await addToCart(product, quantity, selectedColor, selectedSize);
//         toast.success('Added to cart successfully!');
//       } catch (error) {
//         toast.error('Failed to add to cart');
//       } finally {
//         setIsAddingToCart(false);
//       }
//     }
//     setModalAction('cart'); // Reset modal action
//   };

//   const buyNow = (e) => {
//     e.preventDefault();
//     e.stopPropagation();
    
//     if (product.quantity <= 0) {
//       toast.error('Product is out of stock');
//       return;
//     }

//     // Check if product has colors or sizes that need selection
//     const hasColors = product.colors && product.colors.length > 0;
//     const hasSizes = product.sizes && product.sizes.length > 0;
    
//     if (hasColors || hasSizes) {
//       setModalAction('buy');
//       setShowSizeColorModal(true);
//       return;
//     }

//     buyNowDirectly(product, null, null, 1);
//   };

//   const buyNowDirectly = (product, selectedColor, selectedSize, quantity = 1) => {
//     const directBuyItem = {
//       product: product._id,
//       quantity: quantity,
//       selectedColor: selectedColor,
//       selectedSize: selectedSize
//     };
    
//     navigate('/checkout', { 
//       state: { 
//         directBuy: true, 
//         directBuyItem 
//       } 
//     });
//   };

//   const renderStars = (rating) => {
//     const stars = [];
//     for (let i = 1; i <= 5; i++) {
//       stars.push(
//         <FaStar
//           key={i}
//           className={`w-2 h-2 sm:w-2.5 sm:h-2.5 ${
//             i <= rating ? 'text-yellow-400' : 'text-gray-300'
//           }`}
//         />
//       );
//     }
//     return stars;
//   };

//   // Calculate discount percentage
//   const discountPercentage = product.originalPrice && product.originalPrice > product.price
//     ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
//     : null;

//   return (
//     <div className={`group relative bg-white rounded-lg sm:rounded-xl shadow-sm border border-gray-100 overflow-hidden transition-all duration-300 hover:shadow-lg hover:scale-[1.01] h-full flex flex-col ${
//       product.isSold ? 'opacity-60 grayscale' : ''
//     }`}>
      
//       {/* Image Container */}
//       <div className="relative aspect-square overflow-hidden bg-gradient-to-br from-gray-50 to-gray-100">
//         <img
//           src={getProductImage()}
//           alt={product.name || 'Product'}
//           className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
//           onError={(e) => {
//             e.currentTarget.src = 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80';
//           }}
//         />
        
//         {/* Subtle Gradient Overlay */}
//         <div className="absolute inset-0 bg-gradient-to-t from-black/10 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        
//         {/* Badges - Top Left */}
//         <div className="absolute top-1.5 sm:top-2 left-1.5 sm:left-2 flex flex-col gap-1 sm:gap-1.5 z-10">
//           {product.isNewProduct && (
//             <span className="inline-flex items-center gap-0.5 sm:gap-1 px-1.5 sm:px-2 py-0.5 sm:py-1 text-[6px] sm:text-xs font-bold text-white bg-gradient-to-r from-emerald-500 to-teal-500 rounded-full shadow-sm">
//               <FaGift className="w-1.5 h-1.5 sm:w-2 sm:h-2" />
//               <span className="hidden sm:inline">NEW</span>
//               <span className="sm:hidden">N</span>
//             </span>
//           )}
//           {product.isFeatured && (
//             <span className="inline-flex items-center gap-0.5 sm:gap-1 px-1.5 sm:px-2 py-0.5 sm:py-1 text-[6px] sm:text-xs font-bold text-white bg-gradient-to-r from-purple-500 to-pink-500 rounded-full shadow-sm">
//               <FaStar className="w-1.5 h-1.5 sm:w-2 sm:h-2" />
//               <span className="hidden sm:inline">FEATURED</span>
//               <span className="sm:hidden">F</span>
//             </span>
//           )}
//           {discountPercentage && (
//             <span className="inline-flex items-center gap-0.5 sm:gap-1 px-1.5 sm:px-2 py-0.5 sm:py-1 text-[6px] sm:text-xs font-bold text-white bg-gradient-to-r from-red-500 to-pink-500 rounded-full shadow-sm">
//               <FaTag className="w-1.5 h-1.5 sm:w-2 sm:h-2" />
//               -{discountPercentage}%
//             </span>
//           )}
//           {product.quantity <= 10 && product.quantity > 0 && !product.isSold && (
//             <span className="inline-flex items-center gap-0.5 sm:gap-1 px-1.5 sm:px-2 py-0.5 sm:py-1 text-[6px] sm:text-xs font-bold text-white bg-gradient-to-r from-orange-500 to-yellow-500 rounded-full shadow-sm">
//               <FaFire className="w-1.5 h-1.5 sm:w-2 sm:h-2" />
//               <span className="hidden sm:inline">HOT</span>
//               <span className="sm:hidden">H</span>
//             </span>
//           )}
//           {(product.quantity <= 0 || product.isSold) && (
//             <span className="inline-flex items-center gap-0.5 sm:gap-1 px-1.5 sm:px-2 py-0.5 sm:py-1 text-[6px] sm:text-xs font-bold text-white bg-gradient-to-r from-gray-500 to-gray-600 rounded-full shadow-sm">
//               <span className="hidden sm:inline">SOLD</span>
//               <span className="sm:hidden">S</span>
//             </span>
//           )}
//         </div>

//         {/* Action Buttons - Top Right */}
//         <div className="absolute top-1.5 sm:top-2 right-1.5 sm:right-2 flex flex-col gap-1 sm:gap-1.5 z-10">
//         {/* Wishlist Button */}
//         <button
//           onClick={handleWishlistToggle}
//             disabled={isWishlistLoading}
//             className="w-5 h-5 sm:w-6 sm:h-6 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center shadow-sm hover:bg-white transition-all duration-200 hover:scale-110 disabled:opacity-50"
//           >
//             {isWishlistLoading ? (
//               <FaSpinner className="w-2 h-2 sm:w-2.5 sm:h-2.5 text-blue-600 animate-spin" />
//             ) : (
//               <FaHeart className={`w-2 h-2 sm:w-2.5 sm:h-2.5 transition-colors duration-200 ${
//                 isInWishlist(product._id) ? 'text-red-500' : 'text-gray-600 group-hover:text-red-500'
//               }`} />
//             )}
//         </button>

//           {/* Quick View Button */}
//           <Link
//             to={`/product/${product._id}`}
//             className="w-5 h-5 sm:w-6 sm:h-6 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center shadow-sm hover:bg-white transition-all duration-200 hover:scale-110 opacity-0 group-hover:opacity-100"
//           >
//             <FaEye className="w-2 h-2 sm:w-2.5 sm:h-2.5 text-gray-600" />
//           </Link>
//         </div>

//         {/* Stock Status Overlay */}
//         {(product.quantity <= 0 || product.isSold) && (
//           <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
//             <span className="text-white text-xs sm:text-sm font-bold bg-red-500 px-2 sm:px-3 py-1 rounded-full">
//               {product.isSold ? 'Sold Out' : 'Out of Stock'}
//             </span>
//           </div>
//         )}
//       </div>

//       {/* Product Info */}
//       <div className="p-2 sm:p-3 flex-1 flex flex-col">
//         <Link
//           to={`/product/${product._id}`}
//           className="flex-1 flex flex-col group"
//         >
//           {/* Brand */}
//           <div className="flex items-center justify-between mb-1 sm:mb-1.5">
//             <span className="text-xs sm:text-sm font-medium" style={{color: 'var(--secondary-color)'}}>
//               {product.brand || 'Brand'}
//             </span>
//             {product.freeShipping && (
//               <span className="inline-flex items-center gap-0.5 sm:gap-1 text-[8px] sm:text-xs text-purple-600">
//                 <FaTruck className="w-1.5 h-1.5 sm:w-2 sm:h-2" />
//                 <span className="hidden sm:inline">Free</span>
//                 <span className="sm:hidden">F</span>
//               </span>
//             )}
//           </div>

//           {/* Product Name */}
//           <h3 className="text-xs sm:text-sm font-semibold text-gray-900 mb-1 sm:mb-1.5 line-clamp-2 leading-tight group-hover:text-blue-600 transition-colors duration-200">
//             {product.name}
//           </h3>

//           {/* Rating */}
//           <div className="flex items-center gap-1 sm:gap-1.5 mb-1.5 sm:mb-2">
//             <div className="flex items-center">
//               {renderStars(product.rating || 0)}
//             </div>
//             <span className="text-[8px] sm:text-xs text-gray-500">
//               ({product.numReviews || 0})
//             </span>
//             {product.isVerified && (
//               <FaShieldAlt className="w-2 h-2 sm:w-2.5 sm:h-2.5 text-blue-500" />
//             )}
//           </div>

//           {/* Price */}
//           <div className="flex items-center gap-1.5 sm:gap-2 mb-2 sm:mb-3">
//             <span className="text-sm sm:text-base font-bold text-gray-900">
//               {formatPrice(product.price)}
//             </span>
//             {product.originalPrice && product.originalPrice > product.price && (
//               <span className="text-xs sm:text-sm text-gray-500 line-through">
//                 {formatPrice(product.originalPrice)}
//               </span>
//             )}
//           </div>
//         </Link>

//         {/* Action Buttons */}
//         <div className="space-y-1.5 sm:space-y-2">
//         {/* Buy Now Button */}
//         <button
//           onClick={buyNow}
//           disabled={product.quantity <= 0 || product.isSold || buyingNow}
//           className="w-full inline-flex items-center justify-center gap-1 sm:gap-1.5 px-2 sm:px-3 py-1.5 sm:py-2 text-white text-xs sm:text-sm font-semibold rounded-lg disabled:from-gray-300 disabled:to-gray-400 disabled:cursor-not-allowed transition-all duration-200 shadow-sm hover:shadow-md transform hover:scale-[1.01]"
//           style={{background: 'var(--amber-gradient)'}}
//         >
//             {buyingNow ? (
//               <>
//                 <FaSpinner className="w-2 h-2 sm:w-2.5 sm:h-2.5 animate-spin" />
//                 <span className="hidden sm:inline">Processing...</span>
//                 <span className="sm:hidden">...</span>
//               </>
//             ) : (
//               <>
//                 <FaCreditCard className="w-2 h-2 sm:w-2.5 sm:h-2.5" />
//                 <span className="hidden sm:inline">
//                   {product.isSold ? 'Sold Out' : product.quantity <= 0 ? 'Out of Stock' : 'Buy Now'}
//                 </span>
//                 <span className="sm:hidden">
//                   {product.isSold ? 'Sold' : product.quantity <= 0 ? 'Stock' : 'Buy'}
//                 </span>
//               </>
//             )}
//           </button>

//         {/* Add to Cart Button */}
//         <button
//           onClick={handleAddToCart}
//             disabled={product.quantity <= 0 || product.isSold || isAddingToCart}
//             className="w-full inline-flex items-center justify-center gap-1 sm:gap-1.5 px-2 sm:px-3 py-1.5 sm:py-2 text-white text-xs sm:text-sm font-semibold rounded-lg disabled:from-gray-300 disabled:to-gray-400 disabled:cursor-not-allowed transition-all duration-200 shadow-sm hover:shadow-md transform hover:scale-[1.01]"
//             style={{background: 'var(--blue-gradient)'}}
//           >
//             {isAddingToCart ? (
//               <>
//                 <FaSpinner className="w-2 h-2 sm:w-2.5 sm:h-2.5 animate-spin" />
//                 <span className="hidden sm:inline">Adding...</span>
//                 <span className="sm:hidden">...</span>
//               </>
//             ) : (
//               <>
//                 <FaShoppingCart className="w-2 h-2 sm:w-2.5 sm:h-2.5" />
//                 <span className="hidden sm:inline">
//                   {product.isSold ? 'Sold Out' : product.quantity <= 0 ? 'Out of Stock' : 'Add to Cart'}
//                 </span>
//                 <span className="sm:hidden">
//                   {product.isSold ? 'Sold' : product.quantity <= 0 ? 'Stock' : 'Cart'}
//                 </span>
//               </>
//             )}
//         </button>
//         </div>

//         {/* Additional Features */}
//         <div className="mt-1.5 sm:mt-2 flex items-center justify-between text-[8px] sm:text-xs text-gray-500">
//           <span className="flex items-center gap-0.5 sm:gap-1">
//             <FaShieldAlt className="w-1.5 h-1.5 sm:w-2 sm:h-2" />
//             <span className="hidden sm:inline">Secure</span>
//             <span className="sm:hidden">S</span>
//           </span>
//           <span className="flex items-center gap-0.5 sm:gap-1">
//             <FaTruck className="w-1.5 h-1.5 sm:w-2 sm:h-2" />
//             <span className="hidden sm:inline">Fast</span>
//             <span className="sm:hidden">F</span>
//           </span>
//           <span className="flex items-center gap-0.5 sm:gap-1">
//             <FaGift className="w-1.5 h-1.5 sm:w-2 sm:h-2" />
//             <span className="hidden sm:inline">Returns</span>
//             <span className="sm:hidden">R</span>
//           </span>
//         </div>
//       </div>

//       {/* Size/Color Selection Modal */}
//       {showSizeColorModal && (
//         <SizeColorModal
//           product={product}
//           isOpen={showSizeColorModal}
//           onClose={() => setShowSizeColorModal(false)}
//           onConfirm={handleModalConfirm}
//           actionType={modalAction}
//         />
//       )}
//     </div>
//   );
// };

// export default ProductCard;

import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  FaShoppingCart, 
  FaHeart, 
  FaEye,
  FaGift,
  FaFire,
  FaTag,
  FaSpinner,
  FaCreditCard
} from 'react-icons/fa';
import { useCart } from '../../context/CartContext';
import { useWishlist } from '../../context/WishlistContext';
import { useSettings } from '../../context/SettingsContext';
import { toast } from 'react-toastify';
import SizeColorModal from './SizeColorModal';

const ProductCard = ({ product }) => {
  const { addToCart } = useCart();
  const { addToWishlist, removeFromWishlist, isInWishlist } = useWishlist();
  const { formatPrice } = useSettings();
  const navigate = useNavigate();
  const [showSizeColorModal, setShowSizeColorModal] = useState(false);
  const [isAddingToCart, setIsAddingToCart] = useState(false);
  const [isWishlistLoading, setIsWishlistLoading] = useState(false);
  const [buyingNow, setBuyingNow] = useState(false);
  const [modalAction, setModalAction] = useState('cart'); // 'cart' or 'buy'

  // Safely get the product image
  const getProductImage = () => {
    if (!product.images || !Array.isArray(product.images) || product.images.length === 0) {
      return 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80';
    }
    
    const thumbnailIndex = product.thumbnailIndex || 0;
    const imageIndex = Math.min(thumbnailIndex, product.images.length - 1);
    return product.images[imageIndex];
  };

  const handleAddToCart = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (product.quantity <= 0) {
      toast.error('Product is out of stock');
      return;
    }

    // Check if product has colors or sizes that need selection
    const hasColors = product.colors && product.colors.length > 0;
    const hasSizes = product.sizes && product.sizes.length > 0;
    
    if (hasColors || hasSizes) {
      setModalAction('cart');
      setShowSizeColorModal(true);
      return;
    }

    setIsAddingToCart(true);
    try {
      await addToCart(product, 1);
      toast.success('Added to cart!');
    } catch (error) {
      toast.error('Failed to add to cart');
    } finally {
      setIsAddingToCart(false);
    }
  };

  const handleWishlistToggle = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    
    setIsWishlistLoading(true);
    try {
      if (isInWishlist(product._id)) {
        await removeFromWishlist(product._id);
        toast.success('Removed from wishlist');
      } else {
        await addToWishlist(product);
        toast.success('Added to wishlist!');
      }
    } catch (error) {
      toast.error('Failed to update wishlist');
    } finally {
      setIsWishlistLoading(false);
    }
  };

  const handleModalConfirm = async ({ product, quantity, selectedColor, selectedSize }) => {
    if (modalAction === 'buy') {
      buyNowDirectly(product, selectedColor, selectedSize, quantity);
    } else {
      setIsAddingToCart(true);
      try {
        await addToCart(product, quantity, selectedColor, selectedSize);
        toast.success('Added to cart!');
      } catch (error) {
        toast.error('Failed to add to cart');
      } finally {
        setIsAddingToCart(false);
      }
    }
    setModalAction('cart'); // Reset modal action
  };

  const buyNow = (e) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (product.quantity <= 0) {
      toast.error('Product is out of stock');
      return;
    }

    // Check if product has colors or sizes that need selection
    const hasColors = product.colors && product.colors.length > 0;
    const hasSizes = product.sizes && product.sizes.length > 0;
    
    if (hasColors || hasSizes) {
      setModalAction('buy');
      setShowSizeColorModal(true);
      return;
    }

    buyNowDirectly(product, null, null, 1);
  };

  const buyNowDirectly = (product, selectedColor, selectedSize, quantity = 1) => {
    const directBuyItem = {
      product: product._id,
      quantity: quantity,
      selectedColor: selectedColor,
      selectedSize: selectedSize
    };
    
    navigate('/checkout', { 
      state: { 
        directBuy: true, 
        directBuyItem 
      } 
    });
  };

  // Calculate discount percentage
  const discountPercentage = product.originalPrice && product.originalPrice > product.price
    ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
    : null;

  return (
    <div className={`group relative bg-white rounded-3xl shadow-xl overflow-hidden transition-all duration-300 hover:shadow-2xl hover:scale-[1.02] h-full flex flex-col w-full ${
      product.isSold ? 'opacity-60 grayscale' : ''
    }`}>
      
      {/* Image Container with padding for margin effect */}
      <div className="p-2 sm:p-3">
        <div className="relative aspect-square rounded-2xl sm:rounded-3xl overflow-hidden bg-gradient-to-br from-gray-200 via-gray-100 to-gray-300">
          <img
            src={getProductImage()}
            alt={product.name || 'Product'}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
            onError={(e) => {
              e.currentTarget.src = 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80';
            }}
          />
          
          {/* Badges Row - Top */}
          <div className="absolute top-1.5 sm:top-3 left-1.5 sm:left-3 right-1.5 sm:right-3 flex justify-between items-start">
            {/* Left side badges */}
            <div className="flex flex-col gap-0.5 sm:gap-1">
              {product.isNewProduct && (
                <div className="bg-black bg-opacity-60 backdrop-blur-sm text-white px-2 sm:px-2 py-0.5 sm:py-1 rounded-full text-[8px] sm:text-xs font-bold">
                  <span className="flex items-center gap-0.5">
                    <FaGift className="w-1.5 h-1.5 sm:w-2.5 sm:h-2.5" />
                    New
                  </span>
                </div>
              )}
              {product.isFeatured && (
                <div className="bg-purple-500 bg-opacity-90 backdrop-blur-sm text-white px-2 sm:px-2 py-0.5 sm:py-1 rounded-full text-[8px] sm:text-xs font-bold">
                  Featured
                </div>
              )}
              {discountPercentage && (
                <div className="bg-red-500 bg-opacity-90 backdrop-blur-sm text-white px-2 sm:px-2 py-0.5 sm:py-1 rounded-full text-[8px] sm:text-xs font-bold">
                  <span className="flex items-center gap-0.5">
                    <FaTag className="w-1.5 h-1.5 sm:w-2.5 sm:h-2.5" />
                    -{discountPercentage}%
                  </span>
                </div>
              )}
              {product.quantity <= 10 && product.quantity > 0 && !product.isSold && (
                <div className="bg-orange-500 bg-opacity-90 backdrop-blur-sm text-white px-2 sm:px-2 py-0.5 sm:py-1 rounded-full text-[8px] sm:text-xs font-bold">
                  <span className="flex items-center gap-0.5">
                    <FaFire className="w-1.5 h-1.5 sm:w-2.5 sm:h-2.5" />
                    Hot
                  </span>
                </div>
              )}
              {(product.quantity <= 0 || product.isSold) && (
                <div className="bg-gray-500 bg-opacity-90 backdrop-blur-sm text-white px-2 sm:px-2 py-0.5 sm:py-1 rounded-full text-[8px] sm:text-xs font-bold">
                  Sold Out
                </div>
              )}
            </div>
            
            {/* Right side icons */}
            <div className="flex flex-col space-y-1">
              {/* Wishlist Icon */}
              <button
                onClick={handleWishlistToggle}
                disabled={isWishlistLoading}
                className="w-6 h-6 sm:w-8 sm:h-8 bg-white bg-opacity-20 backdrop-blur-sm rounded-full flex items-center justify-center transition-all duration-200 hover:bg-white hover:bg-opacity-30 disabled:opacity-50"
              >
                {isWishlistLoading ? (
                  <FaSpinner className="w-3 h-3 sm:w-4 sm:h-4 text-white animate-spin" />
                ) : (
                  <FaHeart className={`w-3 h-3 sm:w-4 sm:h-4 transition-colors duration-200 ${
                    isInWishlist(product._id) ? 'text-red-500' : 'text-white'
                  }`} />
                )}
              </button>
              
              {/* Quick View Icon */}
              <Link
                to={`/product/${product._id}`}
                className="w-6 h-6 sm:w-8 sm:h-8 bg-white bg-opacity-20 backdrop-blur-sm rounded-full flex items-center justify-center transition-all duration-200 hover:bg-white hover:bg-opacity-30"
              >
                <FaEye className="w-3 h-3 sm:w-4 sm:h-4 text-white" />
              </Link>
              
              {/* Add to Cart Icon */}
              <button
                onClick={handleAddToCart}
                disabled={product.quantity <= 0 || product.isSold || isAddingToCart}
                className="w-6 h-6 sm:w-8 sm:h-8 bg-white bg-opacity-20 backdrop-blur-sm rounded-full flex items-center justify-center transition-all duration-200 hover:bg-white hover:bg-opacity-30 disabled:opacity-50"
              >
                {isAddingToCart ? (
                  <FaSpinner className="w-3 h-3 sm:w-4 sm:h-4 text-white animate-spin" />
                ) : (
                  <FaShoppingCart className="w-3 h-3 sm:w-4 sm:h-4 text-white" />
                )}
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
          {(product.quantity <= 0 || product.isSold) && (
            <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
              <span className="text-white text-xs font-bold bg-red-500 px-2 py-1 rounded-full">
                {product.isSold ? 'Sold Out' : 'Out of Stock'}
              </span>
            </div>
          )}
        </div>
      </div>

      {/* Product Info */}
      <div className="px-3 sm:px-4 pb-3 sm:pb-4 flex-1 flex flex-col">
        <Link
          to={`/product/${product._id}`}
          className="flex-1 flex flex-col group"
        >
          {/* Main Title */}
          <h2 className="text-sm sm:text-base font-bold text-black mb-0.5 sm:mb-1 leading-tight group-hover:text-blue-600 transition-colors duration-200 line-clamp-2">
            {product.name}
          </h2>
          
          {/* Subtitle */}
          <h3 className="text-xs sm:text-sm font-normal text-gray-400 mb-1 sm:mb-2">
            {product.brand || 'Premium Quality'}
          </h3>
          
          {/* Description */}
          <p className="text-gray-500 text-[10px] sm:text-xs mb-2 sm:mb-3 leading-relaxed font-normal line-clamp-2">
            {product.description || 'Premium quality product with excellent features and durability.'}
          </p>
        </Link>

        {/* Price and Buy Button Row */}
        <div className="flex items-end justify-between mb-2 sm:mb-3">
          {/* Price */}
          <div className="flex flex-col">
            {product.originalPrice && product.originalPrice > product.price && (
              <span className="text-[10px] sm:text-xs text-gray-500 line-through">
                {formatPrice(product.originalPrice)}
              </span>
            )}
            <span className="text-sm sm:text-lg font-bold text-black">
              {formatPrice(product.price)}
            </span>
          </div>
          
          {/* Buy Now Button */}
          <button
            onClick={buyNow}
            disabled={product.quantity <= 0 || product.isSold || buyingNow}
            className="bg-black text-white px-2 sm:px-3 py-1 sm:py-1.5 rounded-full text-[10px] sm:text-xs font-medium flex items-center space-x-1 hover:bg-gray-800 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed"
          >
            {buyingNow ? (
              <>
                <FaSpinner className="w-2.5 h-2.5 sm:w-3 sm:h-3 animate-spin" />
                <span className="hidden sm:inline">Processing...</span>
                <span className="sm:hidden">...</span>
              </>
            ) : (
              <>
                <span className="hidden sm:inline">
                  {product.isSold ? 'Sold Out' : product.quantity <= 0 ? 'Out of Stock' : 'Buy Now'}
                </span>
                <span className="sm:hidden">
                  {product.isSold ? 'Sold' : product.quantity <= 0 ? 'Stock' : 'Buy'}
                </span>
                <svg className="w-2.5 h-2.5 sm:w-3 sm:h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3" />
                </svg>
              </>
            )}
          </button>
        </div>

      </div>

      {/* Size/Color Selection Modal */}
      {showSizeColorModal && (
        <SizeColorModal
          product={product}
          isOpen={showSizeColorModal}
          onClose={() => setShowSizeColorModal(false)}
          onConfirm={handleModalConfirm}
          actionType={modalAction}
        />
      )}
    </div>
  );
};

export default ProductCard;