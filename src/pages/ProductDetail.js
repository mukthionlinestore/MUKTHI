import React, { useEffect, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { useCart } from "../context/CartContext";
import { useWishlist } from "../context/WishlistContext";
import { useAuth } from "../context/AuthContext";
import { useSettings } from "../context/SettingsContext";
import axios from "../config/axios";
import SizeColorModal from "../components/products/SizeColorModal";
import SizeChartModal from "../components/SizeChartModal";
import ProductCard from "../components/products/ProductCard";
import { 
  FaArrowLeft, 
  FaShare, 
  FaHeart, 
  FaShoppingCart, 
  FaStar, 
  FaEye,
  FaGift,
  FaFire,
  FaTag,
  FaTruck,
  FaShieldAlt,
  FaSpinner,
  FaCheck,
  FaMinus,
  FaPlus,
  FaChevronLeft,
  FaChevronRight,
  FaHome,
  FaFolder,
  FaCreditCard,
  FaRuler
} from "react-icons/fa";

const StarRating = ({ rating = 0, size = "sm" }) => {
  const sizes = {
    xs: "w-2.5 h-2.5",
    sm: "w-3 h-3",
    md: "w-4 h-4",
    lg: "w-5 h-5"
  };
  
  return (
    <div className="flex items-center">
      {Array.from({ length: 5 }).map((_, i) => (
        <FaStar
      key={i}
          className={`${sizes[size]} ${
            i < Math.floor(rating) ? "text-yellow-400" : "text-gray-300"
          }`}
        />
      ))}
    </div>
  );
};

const Badge = ({ children, variant = "default", size = "sm" }) => {
  const variants = {
    default: "bg-gray-100 text-gray-700",
    new: "bg-gradient-to-r from-emerald-500 to-teal-500 text-white",
    sale: "bg-gradient-to-r from-red-500 to-pink-500 text-white",
    hot: "bg-gradient-to-r from-orange-500 to-yellow-500 text-white",
    sold: "bg-gradient-to-r from-gray-500 to-gray-600 text-white",
    save: "bg-emerald-50 text-emerald-700 border border-emerald-200"
  };
  
  const sizes_class = {
    xs: "px-1.5 py-0.5 text-[8px]",
    sm: "px-2 py-1 text-[10px] sm:text-xs",
    md: "px-3 py-1.5 text-xs sm:text-sm"
  };
  
  return (
    <span className={`inline-flex items-center gap-1 rounded-full font-bold ${variants[variant]} ${sizes_class[size]}`}>
      {children}
    </span>
  );
};

const TabButton = ({ active, onClick, children, size = "sm" }) => {
  const sizes_class = {
    xs: "px-2 py-1.5 text-[10px]",
    sm: "px-3 py-2 text-xs sm:text-sm",
    md: "px-4 py-2.5 text-sm sm:text-base"
  };
  
  return (
  <button
    onClick={onClick}
      className={`whitespace-nowrap border-b-2 font-medium transition-all duration-200 ${sizes_class[size]} ${
        active 
          ? "border-emerald-600 text-emerald-600" 
          : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
      }`}
  >
    {children}
  </button>
);
};

export default function ProductDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { addToCart } = useCart();
  const { addToWishlist, removeFromWishlist, isInWishlist } = useWishlist();
  const { formatPrice, settings } = useSettings();

  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedImage, setSelectedImage] = useState(0);
  const [qty, setQty] = useState(1);
  const [tab, setTab] = useState(0);
  const [related, setRelated] = useState([]);
  const [showZoom, setShowZoom] = useState(false);
  const [zoomPosition, setZoomPosition] = useState({ x: 0, y: 0 });
  const [toast, setToast] = useState(null);
  const [showSizeColorModal, setShowSizeColorModal] = useState(false);
  const [modalAction, setModalAction] = useState('cart');
  const [isAddingToCart, setIsAddingToCart] = useState(false);
  const [isWishlistLoading, setIsWishlistLoading] = useState(false);
  const [selectedColor, setSelectedColor] = useState(null);
  const [selectedSize, setSelectedSize] = useState(null);
  const [showSizeChart, setShowSizeChart] = useState(false);

  const showToast = (msg, tone = "info") => {
    setToast({ msg, tone });
    setTimeout(() => setToast(null), 3500);
  };

  // Fetch product
  useEffect(() => {
    const fetchProduct = async () => {
      try {
        setLoading(true);
        console.log('Fetching product with ID:', id);
        
        const response = await axios.get(`/api/products/${id}`);
        console.log('Product response:', response.data);
        
        setProduct(response.data);
        if (response.data.thumbnailIndex != null) {
          setSelectedImage(response.data.thumbnailIndex);
        }
        fetchRelated(response.data.category, response.data._id);
      } catch (error) {
        console.error('Error fetching product:', error);
        console.error('Error response:', error.response?.data);
        console.error('Error status:', error.response?.status);
        
        if (error.response?.status === 404) {
          showToast("Product not found", "error");
        } else {
          showToast(error.message || "Failed to load product", "error");
        }
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchProduct();
    }
  }, [id]);

  const fetchRelated = async (category, currentId) => {
    try {
      const response = await axios.get(`/api/products?category=${category}&limit=4`);
      const filtered = (response.data.products || []).filter((p) => p._id !== currentId).slice(0, 4);
      setRelated(filtered);
    } catch (error) {
      console.error('Error fetching related products:', error);
    }
  };

  const discountPct =
    product?.originalPrice && product.originalPrice > product.price
      ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
      : null;

  const handleAddToCart = async () => {
    if (!user) {
      showToast("Please login to add items to cart", "error");
      navigate("/login");
      return;
    }
    if (product.quantity <= 0) {
      showToast("Product is out of stock", "error");
      return;
    }
    
    const hasColors = product.colors && product.colors.length > 0;
    const hasSizes = product.sizes && product.sizes.length > 0;
    
    if (hasColors || hasSizes) {
      setModalAction('cart');
      setShowSizeColorModal(true);
      return;
    }
    
    setIsAddingToCart(true);
    try {
      await addToCart(product, qty, selectedColor, selectedSize);
      showToast(`Added ${qty} item(s) to cart!`, "success");
    } catch {
      showToast("Failed to add to cart", "error");
    } finally {
      setIsAddingToCart(false);
    }
  };

  const toggleWishlist = async () => {
    if (!user) {
      showToast("Please login to manage wishlist", "error");
      navigate("/login");
      return;
    }
    setIsWishlistLoading(true);
    try {
      if (isInWishlist(product._id)) {
        await removeFromWishlist(product._id);
        showToast("Removed from wishlist", "success");
      } else {
        await addToWishlist(product);
        showToast("Added to wishlist!", "success");
      }
    } catch {
      showToast("Failed to update wishlist", "error");
    } finally {
      setIsWishlistLoading(false);
    }
  };

  const buyNow = async () => {
    if (!user) {
      showToast("Please login to continue", "error");
      navigate("/login");
      return;
    }
    if (product.quantity <= 0) {
      showToast("Product is out of stock", "error");
      return;
    }
    
    const hasColors = product.colors && product.colors.length > 0;
    const hasSizes = product.sizes && product.sizes.length > 0;
    
    if (hasColors || hasSizes) {
      setModalAction('buy');
      setShowSizeColorModal(true);
      return;
    }
    
    const directBuyItem = {
      product: product._id,
      quantity: qty,
      selectedColor: selectedColor,
      selectedSize: selectedSize,
      price: product.price
    };
    
    navigate("/checkout", { 
      state: { 
        directBuy: true, 
        directBuyItem: directBuyItem 
      } 
    });
  };

  const shareLink = async () => {
    const url = window.location.href;
    if (navigator.share) {
      try {
        await navigator.share({ 
          title: product.name, 
          text: `Check out ${product.name} - ${product.description || 'Available now!'}`, 
          url 
        });
        showToast("Product shared successfully!", "success");
      } catch (e) {
        // User cancelled or share failed
        if (e.name !== 'AbortError') {
          // If share failed (not cancelled), try copying to clipboard
          try {
            await navigator.clipboard.writeText(url);
            showToast("Link copied to clipboard!", "success");
          } catch {
            showToast("Failed to share product", "error");
          }
        }
      }
    } else {
      // Fallback to copying to clipboard
      try {
        await navigator.clipboard.writeText(url);
        showToast("Link copied to clipboard!", "success");
      } catch {
        showToast("Failed to copy link", "error");
      }
    }
  };

  const handleModalConfirm = async ({ product, quantity, selectedColor, selectedSize }) => {
    try {
      if (modalAction === 'buy') {
        const directBuyItem = {
          product: product._id,
          quantity: quantity,
          selectedColor: selectedColor,
          selectedSize: selectedSize,
          price: product.price
        };
        
        navigate("/checkout", { 
          state: { 
            directBuy: true, 
            directBuyItem: directBuyItem 
          } 
        });
      } else {
        await addToCart(product, quantity, selectedColor, selectedSize);
        showToast(`Added ${quantity} item(s) to cart!`, "success");
      }
    } catch {
      showToast("Failed to process request", "error");
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen relative flex items-center justify-center">
        {/* Single Gradient Overlay for Entire Product Detail Page */}
        <div className="absolute inset-0 bg-gradient-to-br from-blue-600/20 via-transparent to-purple-600/20 pointer-events-none"></div>
        <div className="text-center relative z-10">
          <div className="w-12 h-12 sm:w-16 sm:h-16 bg-gradient-to-r from-emerald-500 to-teal-500 rounded-full flex items-center justify-center mx-auto mb-4">
            <FaSpinner className="w-6 h-6 sm:w-8 sm:h-8 text-white animate-spin" />
          </div>
          <p className="text-sm sm:text-base text-gray-600">Loading product details...</p>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen relative flex items-center justify-center px-4">
        {/* Single Gradient Overlay for Entire Product Detail Page */}
        <div className="absolute inset-0 bg-gradient-to-br from-blue-600/20 via-transparent to-purple-600/20 pointer-events-none"></div>
        <div className="max-w-sm w-full bg-white rounded-2xl shadow-xl p-6 sm:p-8 text-center relative z-10">
          <div className="w-16 h-16 sm:w-20 sm:h-20 bg-gradient-to-r from-emerald-500 to-teal-500 rounded-full flex items-center justify-center mx-auto mb-4 sm:mb-6">
            <span className="text-2xl sm:text-3xl font-bold text-white">404</span>
          </div>
          <h1 className="text-xl sm:text-2xl font-bold text-gray-900 mb-2 sm:mb-3">Product Not Found</h1>
          <p className="text-sm sm:text-base text-gray-600 mb-6 sm:mb-8">
            The product you're looking for doesn't exist or has been removed.
          </p>
          <div className="flex flex-col sm:flex-row gap-3">
            <button 
              onClick={() => navigate("/")} 
              className="w-full sm:w-auto px-6 py-3 bg-gradient-to-r from-emerald-600 to-teal-600 text-white font-semibold rounded-xl hover:from-emerald-700 hover:to-teal-700 transition-all duration-200"
            >
              Back to Home
            </button>
            <button 
              onClick={() => navigate(-1)} 
              className="w-full sm:w-auto px-6 py-3 border border-gray-300 text-gray-700 font-semibold rounded-xl hover:bg-gray-50 transition-all duration-200"
            >
              Go Back
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen relative">

      <main className="py-4 sm:py-6 lg:py-8 relative overflow-hidden z-10">
        {/* Animated Background Elements */}
        <div className="absolute inset-0">
          <div className="absolute top-10 left-10 w-24 h-24 bg-blue-500/10 rounded-full animate-pulse"></div>
          <div className="absolute top-20 right-20 w-16 h-16 bg-purple-500/10 rounded-full animate-pulse animation-delay-1000"></div>
          <div className="absolute bottom-10 left-1/4 w-20 h-20 bg-pink-500/10 rounded-full animate-pulse animation-delay-2000"></div>
          <div className="absolute bottom-20 right-1/3 w-12 h-12 bg-green-500/10 rounded-full animate-pulse animation-delay-3000"></div>
        </div>
        
        <div className="max-w-7xl mx-auto px-3 sm:px-4 lg:px-6 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8 lg:gap-12">
          
          {/* Image Gallery */}
          <section className="lg:sticky lg:top-24">
            <div 
              className="relative overflow-hidden rounded-xl sm:rounded-2xl bg-gradient-to-br from-gray-50 to-gray-100 aspect-square shadow-lg border border-gray-200 md:cursor-crosshair"
              onMouseEnter={(e) => {
                // Only enable zoom on non-touch devices
                if (window.matchMedia('(hover: hover)').matches) {
                  setShowZoom(true);
                }
              }}
              onMouseLeave={() => setShowZoom(false)}
              onMouseMove={(e) => {
                // Only track mouse on non-touch devices
                if (window.matchMedia('(hover: hover)').matches && showZoom) {
                  const rect = e.currentTarget.getBoundingClientRect();
                  const x = ((e.clientX - rect.left) / rect.width) * 100;
                  const y = ((e.clientY - rect.top) / rect.height) * 100;
                  setZoomPosition({ x, y });
                }
              }}
            >
              {product.images?.length ? (
                <>
                  <img
                    src={product.images[selectedImage] || product.images[0]}
                    alt={`${product.name} - Image ${selectedImage + 1}`}
                    className="w-full h-full object-cover"
                    onError={(e) => (e.currentTarget.src = "https://images.unsplash.com/photo-1441986300917-64674bd600d8?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80")}
                  />
                  {/* Zoomed Image Overlay - Desktop Only */}
                  {showZoom && (
                    <div 
                      className="hidden md:block absolute inset-0 pointer-events-none bg-white"
                      style={{
                        backgroundImage: `url(${product.images[selectedImage] || product.images[0]})`,
                        backgroundPosition: `${zoomPosition.x}% ${zoomPosition.y}%`,
                        backgroundSize: '200%',
                        backgroundRepeat: 'no-repeat'
                      }}
                    />
                  )}
                </>
              ) : (
                <div className="w-full h-full flex items-center justify-center text-gray-500">
                  <div className="text-center">
                    <FaEye className="w-12 h-12 sm:w-16 sm:h-16 mx-auto mb-2 text-gray-300" />
                    <p className="text-sm sm:text-base">No Image Available</p>
                  </div>
                </div>
              )}

              {/* Navigation Arrows */}
              {product.images?.length > 1 && (
                <>
                  <button
                    className="absolute left-2 sm:left-3 top-1/2 -translate-y-1/2 w-8 h-8 sm:w-10 sm:h-10 bg-white/95 backdrop-blur-sm rounded-full flex items-center justify-center shadow-lg hover:bg-white transition-all duration-300 hover:scale-110 border border-gray-200"
                    onClick={() => setSelectedImage(selectedImage > 0 ? selectedImage - 1 : product.images.length - 1)}
                  >
                    <FaChevronLeft className="w-3 h-3 sm:w-4 sm:h-4 text-gray-700" />
                  </button>
                  <button
                    className="absolute right-2 sm:right-3 top-1/2 -translate-y-1/2 w-8 h-8 sm:w-10 sm:h-10 bg-white/95 backdrop-blur-sm rounded-full flex items-center justify-center shadow-lg hover:bg-white transition-all duration-300 hover:scale-110 border border-gray-200"
                    onClick={() => setSelectedImage(selectedImage < product.images.length - 1 ? selectedImage + 1 : 0)}
                  >
                    <FaChevronRight className="w-3 h-3 sm:w-4 sm:h-4 text-gray-700" />
                  </button>
                </>
              )}

              {/* Badges */}
              <div className="absolute top-2 sm:top-3 left-2 sm:left-3 flex flex-col gap-1.5 sm:gap-2 z-10">
                {product.isNewProduct && (
                  <Badge variant="new" size="sm">
                    <FaGift className="w-2 h-2 sm:w-3 sm:h-3" />
                    NEW
                  </Badge>
                )}
                {discountPct && (
                  <Badge variant="sale" size="sm">
                    <FaTag className="w-2 h-2 sm:w-3 sm:h-3" />
                    -{discountPct}%
                  </Badge>
                )}
                {product.quantity <= 10 && product.quantity > 0 && (
                  <Badge variant="hot" size="sm">
                    <FaFire className="w-2 h-2 sm:w-3 sm:h-3" />
                    HOT
                  </Badge>
                )}
                {product.quantity <= 0 && (
                  <Badge variant="sold" size="sm">
                    SOLD
                  </Badge>
                )}
              </div>

              {/* Stock Status Overlay */}
              {product.quantity <= 0 && (
                <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                  <span className="text-white text-xs sm:text-sm font-bold bg-red-500 px-3 py-1.5 rounded-full">
                    Out of Stock
                  </span>
                </div>
              )}
            </div>

            {/* Thumbnail Gallery */}
            {product.images?.length > 1 && (
              <div className="mt-3 sm:mt-4 flex gap-2 overflow-x-auto pb-2">
                {product.images.map((img, i) => (
                  <button
                    key={i}
                    onClick={() => setSelectedImage(i)}
                    className={`flex-none w-16 h-16 sm:w-20 sm:h-20 overflow-hidden rounded-lg ring-2 transition-all duration-200 ${
                      selectedImage === i 
                        ? "ring-emerald-500 scale-105" 
                        : "ring-gray-200 hover:ring-gray-300"
                    }`}
                  >
                    <img
                      src={img}
                      alt={`Thumbnail ${i + 1}`}
                      className="w-full h-full object-cover"
                      onError={(e) => (e.currentTarget.src = "https://images.unsplash.com/photo-1441986300917-64674bd600d8?ixlib=rb-4.0.3&auto=format&fit=crop&w=80&q=80")}
                    />
                  </button>
                ))}
              </div>
            )}
          </section>

          {/* Product Details */}
          <section className="bg-white rounded-xl sm:rounded-2xl p-3 sm:p-4 shadow-md border border-gray-100 space-y-3 sm:space-y-4">
            {/* Category & Brand with Share Icon */}
            <div className="flex items-center justify-between gap-2">
              <div className="flex flex-wrap items-center gap-2 text-xs sm:text-sm text-gray-600">
                <Badge variant="default" size="xs">
                  {product.category}
                </Badge>
                {product.brand && (
                  <>
                    <span className="text-gray-400">•</span>
                    <span className="font-medium text-emerald-600">{product.brand}</span>
                  </>
                )}
              </div>
              <button 
                onClick={shareLink} 
                className="flex-shrink-0 w-7 h-7 bg-white border border-gray-300 rounded-lg flex items-center justify-center hover:bg-gray-50 hover:border-gray-400 transition-all duration-200 shadow-sm hover:shadow-md"
              >
                <FaShare className="w-3 h-3 text-gray-700" />
              </button>
            </div>

            {/* Product Name */}
            <h1 className="text-base sm:text-lg font-bold text-gray-900 leading-tight">
              {product.name}
            </h1>

            {/* Price */}
            <div className="flex items-end gap-1.5 sm:gap-2">
              <span className="text-lg sm:text-xl font-bold text-gray-900">
                {formatPrice(product.price)}
              </span>
              {product.originalPrice && product.originalPrice > product.price && (
                <>
                  <span className="text-sm sm:text-base text-gray-500 line-through">
                    {formatPrice(product.originalPrice)}
                  </span>
                  <Badge variant="save" size="sm">
                    Save {formatPrice(product.originalPrice - product.price)}
                  </Badge>
                </>
              )}
            </div>

            {/* Stock Status */}
            <div className={`flex items-center gap-1.5 rounded-md border px-2 py-1 text-xs font-medium ${
                product.quantity > 0
                  ? "border-emerald-200 bg-emerald-50 text-emerald-700"
                : "border-red-200 bg-red-50 text-red-700"
            }`}>
              {product.quantity > 0 ? (
                <>
                  <FaCheck className="w-2.5 h-2.5" />
                  <span>In Stock ({product.quantity})</span>
                </>
              ) : (
                <>
                  <span className="w-2.5 h-2.5 rounded-full bg-red-500"></span>
                  <span>Out of Stock</span>
                </>
              )}
            </div>

            {/* Short Description */}
            {product.description && (
              <p className="text-xs leading-tight text-gray-600 line-clamp-2">
                {product.description}
              </p>
            )}

            {/* Colors */}
            {product.colors && product.colors.length > 0 && (
              <div className="space-y-1">
                <span className="text-xs font-medium text-gray-700">Colors:</span>
                <div className="flex gap-2">
                  {product.colors.map((color, index) => (
                    <button
                      key={index}
                      onClick={() => setSelectedColor(color)}
                      className={`w-5 h-5 sm:w-6 sm:h-6 rounded-full border-2 shadow-sm hover:scale-110 transition-all duration-200 ${
                        selectedColor?.name === color.name
                          ? 'border-emerald-500 ring-1 ring-emerald-200'
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                      style={{ backgroundColor: color.code }}
                      title={color.name}
                    >
                      {selectedColor?.name === color.name && (
                        <div className="w-full h-full flex items-center justify-center">
                          <FaCheck className="w-2 h-2 text-white drop-shadow-sm" />
                        </div>
                      )}
                    </button>
                  ))}
                </div>
                {selectedColor && (
                  <p className="text-xs sm:text-sm text-emerald-600 font-medium">
                    Selected: {selectedColor.name}
                  </p>
                )}
              </div>
            )}

            {/* Sizes */}
            {product.sizes && product.sizes.length > 0 && (
              <div className="space-y-1">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-medium text-gray-700">Sizes:</span>
                  {/* Debug: Always show size chart button for testing */}
                  <button
                    onClick={() => setShowSizeChart(true)}
                    className="flex items-center gap-1 text-xs text-emerald-600 hover:text-emerald-700 transition-colors border border-emerald-600 px-2 py-1 rounded"
                  >
                    <FaRuler className="w-3 h-3" />
                    <span>Size Chart</span>
                  </button>
                </div>
                <div className="flex gap-2">
                  {product.sizes.map((size, index) => (
                    <button
                      key={index}
                      onClick={() => size.available && setSelectedSize(size.name)}
                      disabled={!size.available}
                      className={`px-1.5 py-0.5 rounded-md text-xs border transition-all duration-200 ${
                        selectedSize === size.name
                          ? 'border-emerald-500 bg-emerald-50 text-emerald-700 ring-1 ring-emerald-200'
                          : size.available
                          ? 'border-gray-300 bg-white text-gray-700 hover:border-emerald-500 hover:bg-emerald-50'
                          : 'border-gray-200 bg-gray-100 text-gray-400 cursor-not-allowed'
                      }`}
                    >
                      {size.name}
                    </button>
                  ))}
                </div>
                {selectedSize && (
                  <p className="text-xs sm:text-sm text-emerald-600 font-medium">
                    Selected: {selectedSize}
                  </p>
                )}
              </div>
            )}

            {/* Quantity Selector */}
            {product.quantity > 0 && (
              <div className="bg-gray-50 rounded-md p-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold text-gray-700">Qty:</span>
                  <div className="inline-flex items-center overflow-hidden rounded-md border border-gray-200 bg-white shadow-sm">
                  <button
                      className="w-6 h-6 flex items-center justify-center hover:bg-gray-50 disabled:opacity-40 transition-all duration-200 hover:scale-105"
                    onClick={() => setQty(Math.max(1, qty - 1))}
                    disabled={qty <= 1}
                  >
                      <FaMinus className="w-2 h-2 text-gray-600" />
                  </button>
                    <div className="min-w-[32px] py-1 text-center font-bold text-xs text-gray-900">
                    {qty}
                  </div>
                  <button
                      className="w-6 h-6 flex items-center justify-center hover:bg-gray-50 disabled:opacity-40 transition-all duration-200 hover:scale-105"
                    onClick={() => setQty(Math.min(product.quantity, qty + 1))}
                    disabled={qty >= product.quantity}
                  >
                      <FaPlus className="w-2 h-2 text-gray-600" />
                  </button>
                  </div>
                </div>
              </div>
            )}

            {/* Action Buttons */}
            <div className="space-y-1.5">
              <div className="grid grid-cols-2 gap-1.5 sm:gap-2">
              <button
                onClick={handleAddToCart}
                  disabled={product.quantity <= 0 || isAddingToCart}
                  className="w-full relative inline-flex items-center justify-center gap-1.5 px-3 py-2.5 text-xs font-semibold text-white bg-gradient-to-r from-gray-700 via-gray-800 to-black hover:from-gray-800 hover:via-gray-900 hover:to-gray-800 rounded-xl shadow-lg hover:shadow-xl transition-all duration-200 hover:scale-105 focus:outline-none focus:ring-2 focus:ring-gray-500/20 disabled:from-gray-300 disabled:to-gray-400 disabled:cursor-not-allowed disabled:hover:scale-100"
                >
                  {isAddingToCart ? (
                    <>
                      <FaSpinner className="w-2.5 h-2.5 animate-spin" />
                      <span>Adding...</span>
                    </>
                  ) : product.quantity <= 0 ? (
                    <>
                      <FaShoppingCart className="w-2.5 h-2.5" />
                      <span>Out of Stock</span>
                    </>
                  ) : (
                    <>
                      <FaShoppingCart className="w-2.5 h-2.5" />
                      <span>Add to Cart</span>
                      <div className="absolute right-3 w-3 h-3 bg-white rounded-full flex items-center justify-center">
                        <svg className="w-1.5 h-1.5 text-black" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                        </svg>
                      </div>
                    </>
                  )}
              </button>
                
              <button
                onClick={toggleWishlist}
                  disabled={isWishlistLoading}
                  className={`w-full relative inline-flex items-center justify-center gap-1.5 px-3 py-2.5 text-xs font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-200 hover:scale-105 focus:outline-none focus:ring-2 focus:ring-gray-500/20 ${
                  isInWishlist(product._id)
                      ? "bg-gradient-to-r from-gray-700 via-gray-800 to-black hover:from-gray-800 hover:via-gray-900 hover:to-gray-800 text-white"
                      : "border-2 border-gray-300 bg-white text-gray-700 hover:bg-gray-50"
                }`}
              >
                  {isWishlistLoading ? (
                    <FaSpinner className="w-2.5 h-2.5 animate-spin" />
                  ) : (
                    <>
                      <FaHeart className="w-2.5 h-2.5" />
                      <span>{isInWishlist(product._id) ? "In Wishlist" : "Wishlist"}</span>
                      {isInWishlist(product._id) && (
                        <div className="absolute right-3 w-3 h-3 bg-white rounded-full flex items-center justify-center">
                          <svg className="w-1.5 h-1.5 text-black" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                          </svg>
                        </div>
                      )}
                    </>
                  )}
              </button>
              </div>
              
              <button
                onClick={buyNow}
                disabled={product.quantity <= 0}
                className="w-full relative inline-flex items-center justify-center gap-1.5 px-3 py-2.5 text-xs font-semibold text-white bg-gradient-to-r from-gray-700 via-gray-800 to-black hover:from-gray-800 hover:via-gray-900 hover:to-gray-800 rounded-xl shadow-lg hover:shadow-xl transition-all duration-200 hover:scale-105 focus:outline-none focus:ring-2 focus:ring-gray-500/20 disabled:from-gray-300 disabled:to-gray-400 disabled:cursor-not-allowed disabled:hover:scale-100"
              >
                <FaCreditCard className="w-2.5 h-2.5" />
                <span>{product.quantity <= 0 ? "Sold Out" : "Buy Now"}</span>
                {product.quantity > 0 && (
                  <div className="absolute right-3 w-3 h-3 bg-white rounded-full flex items-center justify-center">
                    <svg className="w-1.5 h-1.5 text-black" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </div>
                )}
              </button>
            </div>

            {/* Product Features */}
            <div className="bg-white rounded-md border border-gray-200 p-2 shadow-sm">
              <h3 className="flex items-center gap-1 text-xs font-semibold text-gray-900 mb-1.5">
                <FaShieldAlt className="w-3 h-3 text-emerald-600" />
                Why choose this product?
              </h3>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-1.5">
                {product.features && product.features.length > 0 ? (
                  product.features.map((feature, index) => (
                    <div key={index} className="flex items-center gap-1 rounded-md bg-gray-50 px-1.5 py-1">
                      <FaStar className="w-2.5 h-2.5 text-emerald-600" />
                      <span className="text-xs text-gray-700">{feature}</span>
                    </div>
                  ))
                ) : (
                  <div className="col-span-full text-center py-2">
                    <span className="text-xs text-gray-500">No features available</span>
                  </div>
                )}
              </div>
            </div>
          </section>
        </div>

        {/* Related Products */}
        {related.length > 0 && (
          <section className="mt-4 sm:mt-6 bg-white rounded-lg p-2 sm:p-3 shadow-sm border border-gray-100">
            <h2 className="text-base font-bold text-gray-900 mb-3 text-center">Related Products</h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-2 sm:gap-3">
              {related.map((p) => (
                <ProductCard key={p._id} product={p} />
              ))}
            </div>
          </section>
        )}
        </div>
      </main>

      {/* Toast */}
      {toast && (
        <div className={`fixed inset-x-4 bottom-4 z-50 mx-auto max-w-sm rounded-xl px-4 py-3 text-sm shadow-xl ${
            toast.tone === "error"
            ? "bg-red-600 text-white"
              : toast.tone === "success"
              ? "bg-emerald-600 text-white"
              : "bg-gray-900 text-white"
        }`}>
          {toast.msg}
        </div>
      )}

      {/* Size Color Modal */}
      <SizeColorModal
        isOpen={showSizeColorModal}
        onClose={() => setShowSizeColorModal(false)}
        onConfirm={handleModalConfirm}
        product={product}
        quantity={qty}
        actionType={modalAction}
        preSelectedColor={selectedColor}
        preSelectedSize={selectedSize}
      />

      {/* Size Chart Modal */}
      <SizeChartModal
        isOpen={showSizeChart}
        onClose={() => setShowSizeChart(false)}
        sizeChart={settings?.sizeChart}
      />
    </div>
  );
}
