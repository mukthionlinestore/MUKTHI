import React, { useEffect, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { useCart } from "../context/CartContext";
import { useWishlist } from "../context/WishlistContext";
import { useAuth } from "../context/AuthContext";
import { useSettings } from "../context/SettingsContext";
import SizeColorModal from "../components/products/SizeColorModal";
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
  FaCreditCard
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
  const { formatPrice } = useSettings();

  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedImage, setSelectedImage] = useState(0);
  const [qty, setQty] = useState(1);
  const [tab, setTab] = useState(0);
  const [related, setRelated] = useState([]);
  const [toast, setToast] = useState(null);
  const [showSizeColorModal, setShowSizeColorModal] = useState(false);
  const [modalAction, setModalAction] = useState('cart');
  const [isAddingToCart, setIsAddingToCart] = useState(false);
  const [isWishlistLoading, setIsWishlistLoading] = useState(false);
  const [selectedColor, setSelectedColor] = useState(null);
  const [selectedSize, setSelectedSize] = useState(null);

  const showToast = (msg, tone = "info") => {
    setToast({ msg, tone });
    setTimeout(() => setToast(null), 3500);
  };

  // Fetch product
  useEffect(() => {
    const run = async () => {
      try {
        setLoading(true);
        const res = await fetch(`/api/products/${id}`);
        if (!res.ok) throw new Error("Product not found");
        const data = await res.json();
        setProduct(data);
        if (data.thumbnailIndex != null) setSelectedImage(data.thumbnailIndex);
        fetchRelated(data.category, data._id);
      } catch (e) {
        showToast(e.message || "Failed to load product", "error");
      } finally {
        setLoading(false);
      }
    };
    if (id) run();
  }, [id]);

  const fetchRelated = async (category, currentId) => {
    try {
      const res = await fetch(`/api/products?category=${category}&limit=4`);
      if (res.ok) {
        const data = await res.json();
        const filtered = (data.products || []).filter((p) => p._id !== currentId).slice(0, 4);
        setRelated(filtered);
      }
    } catch {}
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
        await navigator.share({ title: product.name, text: product.description, url });
      } catch (e) {}
    } else {
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
      <div className="min-h-screen bg-gray-50 relative flex items-center justify-center">
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
      <div className="min-h-screen bg-gray-50 relative flex items-center justify-center px-4">
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
    <div className="min-h-screen bg-gray-50 relative">
      {/* Single Gradient Overlay for Entire Product Detail Page */}
      <div className="absolute inset-0 bg-gradient-to-br from-blue-600/20 via-transparent to-purple-600/20 pointer-events-none"></div>
      {/* Header */}
      <header className="sticky top-0 z-40 bg-white/80 backdrop-blur-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-3 sm:px-4 lg:px-6">
          <div className="flex items-center justify-between h-12 sm:h-14 lg:h-16">
            <div className="flex items-center gap-2 sm:gap-3">
              <button 
                onClick={() => navigate(-1)} 
                className="w-8 h-8 sm:w-10 sm:h-10 bg-white/80 backdrop-blur-sm rounded-lg flex items-center justify-center hover:bg-white transition-all duration-200 shadow-sm"
              >
                <FaArrowLeft className="w-3 h-3 sm:w-4 sm:h-4 text-gray-700" />
            </button>
              
              {/* Breadcrumb - Hidden on mobile */}
              <nav className="hidden md:block">
                <ol className="flex items-center gap-2 text-sm text-gray-500">
                  <li>
                    <Link to="/" className="hover:text-emerald-600 transition-colors duration-200 flex items-center gap-1">
                      <FaHome className="w-3 h-3" />
                      Home
                    </Link>
                  </li>
                <li className="text-gray-400">/</li>
                  <li>
                    <Link to={`/?category=${product.category}`} className="hover:text-emerald-600 transition-colors duration-200 flex items-center gap-1">
                      <FaFolder className="w-3 h-3" />
                      {product.category}
                    </Link>
                  </li>
                <li className="text-gray-400">/</li>
                  <li className="truncate max-w-[200px] text-gray-900 font-medium" title={product.name}>
                    {product.name}
                  </li>
              </ol>
            </nav>
          </div>
            
            <button 
              onClick={shareLink} 
              className="w-8 h-8 sm:w-10 sm:h-10 bg-white/80 backdrop-blur-sm rounded-lg flex items-center justify-center hover:bg-white transition-all duration-200 shadow-sm"
            >
              <FaShare className="w-3 h-3 sm:w-4 sm:h-4 text-gray-700" />
          </button>
          </div>
        </div>
      </header>

      <main className="py-4 sm:py-6 lg:py-8 relative overflow-hidden z-10">
        {/* Animated Background Elements */}
        <div className="absolute inset-0">
          <div className="absolute top-10 left-10 w-24 h-24 bg-blue-500/10 rounded-full animate-pulse"></div>
          <div className="absolute top-20 right-20 w-16 h-16 bg-purple-500/10 rounded-full animate-pulse animation-delay-1000"></div>
          <div className="absolute bottom-10 left-1/4 w-20 h-20 bg-pink-500/10 rounded-full animate-pulse animation-delay-2000"></div>
          <div className="absolute bottom-20 right-1/3 w-12 h-12 bg-green-500/10 rounded-full animate-pulse animation-delay-3000"></div>
        </div>
        
        <div className="max-w-7xl mx-auto px-3 sm:px-4 lg:px-6 relative z-10">
          {/* Modern Hero Section */}
          <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 p-8 sm:p-12 mb-8">
            {/* Background Pattern */}
            <div className="absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg width="60" height="60" viewBox="0 0 60 60" xmlns="http://www.w3.org/2000/svg"%3E%3Cg fill="none" fill-rule="evenodd"%3E%3Cg fill="%239C92AC" fill-opacity="0.1"%3E%3Ccircle cx="30" cy="30" r="2"/%3E%3C/g%3E%3C/g%3E%3C/svg%3E')] opacity-20"></div>
            
            <div className="relative z-10 grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-center">
              {/* Product Image Showcase */}
              <div className="relative group">
                <div className="relative overflow-hidden rounded-2xl bg-white/10 backdrop-blur-sm aspect-square shadow-2xl">
                  {product.images?.length ? (
                    <img
                      src={product.images[selectedImage] || product.images[0]}
                      alt={`${product.name} - Image ${selectedImage + 1}`}
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                      onError={(e) => (e.currentTarget.src = "https://images.unsplash.com/photo-1441986300917-64674bd600d8?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80")}
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-white/60">
                      <div className="text-center">
                        <FaEye className="w-16 h-16 mx-auto mb-4 text-white/40" />
                        <p className="text-lg font-medium">No Image Available</p>
                      </div>
                    </div>
                  )}

                  {/* Navigation Arrows */}
                  {product.images?.length > 1 && (
                    <>
                      <button
                        className="absolute left-4 top-1/2 -translate-y-1/2 w-12 h-12 bg-white/20 backdrop-blur-md rounded-full flex items-center justify-center shadow-xl hover:bg-white/30 transition-all duration-300 hover:scale-110 border border-white/20"
                        onClick={() => setSelectedImage(selectedImage > 0 ? selectedImage - 1 : product.images.length - 1)}
                      >
                        <FaChevronLeft className="w-5 h-5 text-white" />
                      </button>
                      <button
                        className="absolute right-4 top-1/2 -translate-y-1/2 w-12 h-12 bg-white/20 backdrop-blur-md rounded-full flex items-center justify-center shadow-xl hover:bg-white/30 transition-all duration-300 hover:scale-110 border border-white/20"
                        onClick={() => setSelectedImage(selectedImage < product.images.length - 1 ? selectedImage + 1 : 0)}
                      >
                        <FaChevronRight className="w-5 h-5 text-white" />
                      </button>
                    </>
                  )}

                  {/* Premium Badges */}
                  <div className="absolute top-4 left-4 flex flex-col gap-2 z-10">
                    {product.isNewProduct && (
                      <div className="bg-gradient-to-r from-emerald-500 to-teal-500 text-white px-3 py-1.5 rounded-full text-sm font-bold shadow-lg flex items-center gap-1">
                        <FaGift className="w-3 h-3" />
                        NEW
                      </div>
                    )}
                    {discountPct && (
                      <div className="bg-gradient-to-r from-red-500 to-pink-500 text-white px-3 py-1.5 rounded-full text-sm font-bold shadow-lg flex items-center gap-1">
                        <FaTag className="w-3 h-3" />
                        -{discountPct}%
                      </div>
                    )}
                    {product.quantity <= 10 && product.quantity > 0 && !product.isSold && (
                      <div className="bg-gradient-to-r from-orange-500 to-yellow-500 text-white px-3 py-1.5 rounded-full text-sm font-bold shadow-lg flex items-center gap-1">
                        <FaFire className="w-3 h-3" />
                        HOT
                      </div>
                    )}
                    {(product.quantity <= 0 || product.isSold) && (
                      <div className="bg-gradient-to-r from-gray-500 to-gray-600 text-white px-3 py-1.5 rounded-full text-sm font-bold shadow-lg">
                        SOLD
                      </div>
                    )}
                  </div>

                  {/* Image Thumbnails */}
                  {product.images?.length > 1 && (
                    <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
                      {product.images.map((_, index) => (
                        <button
                          key={index}
                          onClick={() => setSelectedImage(index)}
                          className={`w-3 h-3 rounded-full transition-all duration-300 ${
                            selectedImage === index
                              ? "bg-white shadow-lg scale-125"
                              : "bg-white/50 hover:bg-white/75"
                          }`}
                        />
                      ))}
                    </div>
                  )}
                </div>
              </div>

              {/* Product Information */}
              <div className="space-y-6">
                {/* Category & Brand */}
                <div className="flex items-center gap-3">
                  <span className="bg-white/20 backdrop-blur-sm text-white px-3 py-1 rounded-full text-sm font-medium">
                    {product.category}
                  </span>
                  {product.brand && (
                    <>
                      <span className="text-white/60">•</span>
                      <span className="text-emerald-400 font-semibold">{product.brand}</span>
                    </>
                  )}
                </div>

                {/* Product Name */}
                <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white leading-tight">
                  {product.name}
                </h1>

                {/* Price Section */}
                <div className="flex items-end gap-4">
                  <span className="text-4xl sm:text-5xl font-bold text-white">
                    {formatPrice(product.price)}
                  </span>
                  {product.originalPrice && product.originalPrice > product.price && (
                    <>
                      <span className="text-2xl text-white/60 line-through">
                        {formatPrice(product.originalPrice)}
                      </span>
                      <div className="bg-gradient-to-r from-red-500 to-pink-500 text-white px-3 py-1 rounded-full text-sm font-bold">
                        Save {formatPrice(product.originalPrice - product.price)}
                      </div>
                    </>
                  )}
                </div>

                {/* Stock Status */}
                <div className={`inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm font-medium ${
                  product.quantity > 0
                    ? "bg-emerald-500/20 text-emerald-300 border border-emerald-500/30"
                    : "bg-red-500/20 text-red-300 border border-red-500/30"
                }`}>
                  {product.quantity > 0 ? (
                    <>
                      <FaCheck className="w-4 h-4" />
                      <span>In Stock ({product.quantity} available)</span>
                    </>
                  ) : (
                    <>
                      <span className="w-4 h-4 rounded-full bg-red-500"></span>
                      <span>Out of Stock</span>
                    </>
                  )}
                </div>

                {/* Short Description */}
                {product.description && (
                  <p className="text-white/80 text-lg leading-relaxed">
                    {product.description}
                  </p>
                )}

                {/* Action Buttons */}
                <div className="flex flex-col sm:flex-row gap-4">
                  <button
                    onClick={handleAddToCart}
                    disabled={product.quantity <= 0 || isAddingToCart}
                    className="flex-1 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-8 py-4 rounded-2xl font-bold text-lg transition-all duration-300 shadow-xl hover:shadow-2xl transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none flex items-center justify-center gap-3"
                  >
                    {isAddingToCart ? (
                      <>
                        <FaSpinner className="w-5 h-5 animate-spin" />
                        <span>Adding...</span>
                      </>
                    ) : product.quantity <= 0 ? (
                      <>
                        <FaShoppingCart className="w-5 h-5" />
                        <span>Out of Stock</span>
                      </>
                    ) : (
                      <>
                        <FaShoppingCart className="w-5 h-5" />
                        <span>Add to Cart</span>
                      </>
                    )}
                  </button>
                  
                  <button
                    onClick={toggleWishlist}
                    disabled={isWishlistLoading}
                    className={`px-8 py-4 rounded-2xl font-bold text-lg transition-all duration-300 shadow-xl hover:shadow-2xl transform hover:scale-105 flex items-center justify-center gap-3 ${
                      isInWishlist(product._id)
                        ? "bg-red-500/20 text-red-300 border border-red-500/30 hover:bg-red-500/30"
                        : "bg-white/20 text-white border border-white/30 hover:bg-white/30"
                    }`}
                  >
                    {isWishlistLoading ? (
                      <FaSpinner className="w-5 h-5 animate-spin" />
                    ) : (
                      <FaHeart className="w-5 h-5" />
                    )}
                    <span>{isInWishlist(product._id) ? "In Wishlist" : "Add to Wishlist"}</span>
                  </button>
                </div>

                <button
                  onClick={buyNow}
                  disabled={product.quantity <= 0}
                  className="w-full bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white px-8 py-4 rounded-2xl font-bold text-lg transition-all duration-300 shadow-xl hover:shadow-2xl transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none flex items-center justify-center gap-3"
                >
                  <FaCreditCard className="w-5 h-5" />
                  <span>{product.quantity <= 0 ? "Sold Out" : "Buy Now"}</span>
                </button>
              </div>
            </div>
          </div>

          {/* Product Details Section */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
            {/* Main Product Details */}
            <div className="lg:col-span-2 space-y-6">
          
              {/* Modern Product Options Card */}
              <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20">
                <h3 className="text-xl font-bold text-white mb-6">Customize Your Product</h3>
              {product.images?.length ? (
                <img
                  src={product.images[selectedImage] || product.images[0]}
                  alt={`${product.name} - Image ${selectedImage + 1}`}
                  className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
                  onError={(e) => (e.currentTarget.src = "https://images.unsplash.com/photo-1441986300917-64674bd600d8?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80")}
                />
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
            {/* Category & Brand */}
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
                <span className="text-xs font-medium text-gray-700">Sizes:</span>
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
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5 sm:gap-2">
                <button
                  onClick={handleAddToCart}
                  disabled={product.quantity <= 0 || isAddingToCart}
                  className="w-full inline-flex items-center justify-center gap-1 px-2.5 py-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white text-xs font-bold rounded-lg hover:from-blue-700 hover:to-purple-700 disabled:from-gray-300 disabled:to-gray-400 disabled:cursor-not-allowed transition-all duration-300 shadow-md hover:shadow-lg transform hover:scale-[1.02] active:scale-[0.98]"
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
                    </>
                  )}
                </button>
                
                <button
                  onClick={toggleWishlist}
                  disabled={isWishlistLoading}
                  className={`w-full inline-flex items-center justify-center gap-1 px-2.5 py-2 border rounded-lg text-xs font-bold transition-all duration-300 shadow-sm hover:shadow-md transform hover:scale-[1.02] active:scale-[0.98] ${
                    isInWishlist(product._id)
                        ? "border-red-300 bg-red-50 text-red-600 hover:bg-red-100"
                        : "border-gray-300 bg-white text-gray-700 hover:bg-gray-50"
                  }`}
                >
                  {isWishlistLoading ? (
                    <FaSpinner className="w-2.5 h-2.5 animate-spin" />
                  ) : (
                    <FaHeart className="w-2.5 h-2.5" />
                  )}
                  <span>{isInWishlist(product._id) ? "In Wishlist" : "Wishlist"}</span>
                </button>
              </div>
              
              <button
                onClick={buyNow}
                disabled={product.quantity <= 0}
                className="w-full inline-flex items-center justify-center gap-1 px-2.5 py-2 bg-gradient-to-r from-orange-500 to-red-500 text-white text-xs font-bold rounded-lg hover:from-orange-600 hover:to-red-600 disabled:from-gray-300 disabled:to-gray-400 disabled:cursor-not-allowed transition-all duration-300 shadow-md hover:shadow-lg transform hover:scale-[1.02] active:scale-[0.98]"
              >
                <FaCreditCard className="w-2.5 h-2.5" />
                <span>{product.quantity <= 0 ? "Sold Out" : "Buy Now"}</span>
              </button>
            </div>

            {/* Trust Badges */}
            <div className="bg-white rounded-md border border-gray-200 p-2 shadow-sm">
              <h3 className="flex items-center gap-1 text-xs font-semibold text-gray-900 mb-1.5">
                <FaShieldAlt className="w-3 h-3 text-emerald-600" />
                Why choose this product?
              </h3>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-1.5">
                {[
                  { icon: FaTruck, text: "Free Shipping" },
                  { icon: FaGift, text: "30-Day Returns" },
                  { icon: FaShieldAlt, text: "2-Year Warranty" },
                  { icon: FaCheck, text: "Authentic Product" }
                ].map((item, index) => (
                  <div key={index} className="flex items-center gap-1 rounded-md bg-gray-50 px-1.5 py-1">
                    <item.icon className="w-2.5 h-2.5 text-emerald-600" />
                    <span className="text-xs text-gray-700">{item.text}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Tabs */}
            <div className="bg-white rounded-lg border border-gray-200 shadow-sm overflow-hidden">
              <div className="flex gap-2 border-b border-gray-200 px-2 overflow-x-auto">
                <TabButton active={tab === 0} onClick={() => setTab(0)} size="sm">
                  Description
                </TabButton>
                <TabButton active={tab === 1} onClick={() => setTab(1)} size="sm">
                  Specifications
                </TabButton>
                <TabButton active={tab === 2} onClick={() => setTab(2)} size="sm">
                  Features
                </TabButton>
                <TabButton active={tab === 3} onClick={() => setTab(3)} size="sm">
                  Reviews
                </TabButton>
              </div>

              <div className="p-2 sm:p-3">
                {tab === 0 && (
                  <div className="space-y-2">
                    <h4 className="text-xs font-semibold text-gray-900">{product.description}</h4>
                    <p className="text-xs text-gray-600 leading-tight">
                      {product.longDescription || "No detailed description available."}
                    </p>
                  </div>
                )}

                {tab === 1 && (
                  <div>
                    {product.specifications && Object.keys(product.specifications).length > 0 ? (
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        {Object.entries(product.specifications).map(([k, v]) => (
                          <div key={k} className="rounded-xl bg-gray-50 p-3">
                            <dt className="text-xs sm:text-sm font-medium text-gray-700 mb-1">{k}</dt>
                            <dd className="text-sm sm:text-base font-semibold text-gray-900">{v}</dd>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <p className="text-center text-sm sm:text-base text-gray-500 py-6">No specifications available.</p>
                    )}
                  </div>
                )}

                {tab === 2 && (
                  <div>
                    {product.features?.length ? (
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        {product.features.map((f, i) => (
                          <div key={i} className="flex items-center gap-2 rounded-xl bg-emerald-50 p-3">
                            <FaCheck className="w-3 h-3 sm:w-4 sm:h-4 text-emerald-600" />
                            <span className="text-sm sm:text-base text-emerald-900">{f}</span>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <p className="text-center text-sm sm:text-base text-gray-500 py-6">No features listed.</p>
                    )}
                  </div>
                )}

                {tab === 3 && (
                  <div className="text-center py-6">
                    <div className="w-12 h-12 sm:w-16 sm:h-16 bg-gradient-to-r from-emerald-500 to-teal-500 rounded-full flex items-center justify-center mx-auto mb-3 sm:mb-4">
                      <FaStar className="w-6 h-6 sm:w-8 sm:h-8 text-white" />
                    </div>
                    <h4 className="text-sm sm:text-base font-semibold text-gray-900 mb-1 sm:mb-2">
                      {product.numReviews > 0 ? `${product.numReviews} Reviews` : "No reviews yet"}
                    </h4>
                    <p className="text-xs sm:text-sm text-gray-500 mb-4 sm:mb-6">
                      {product.numReviews > 0 ? "Review system coming soon!" : "Be the first to review this product!"}
                    </p>
                    <button
                      onClick={() => showToast("Review feature coming soon!", "info")}
                      className="inline-flex items-center justify-center gap-2 px-4 py-2 sm:py-3 border border-gray-300 bg-white text-sm sm:text-base font-medium rounded-xl shadow-sm hover:bg-gray-50 transition-all duration-200"
                    >
                      Write a Review
                    </button>
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
    </div>
  );
}
