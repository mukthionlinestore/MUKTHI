import React, { useEffect, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { useCart } from "../context/CartContext";
import { useWishlist } from "../context/WishlistContext";
import { useAuth } from "../context/AuthContext";
import { useSettings } from "../context/SettingsContext";
import SizeColorModal from "../components/products/SizeColorModal";
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
  FaFolder
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
      <div className="min-h-screen bg-gradient-to-br from-emerald-50 to-teal-50 flex items-center justify-center">
        <div className="text-center">
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
      <div className="min-h-screen bg-gradient-to-br from-emerald-50 to-teal-50 flex items-center justify-center px-4">
        <div className="max-w-sm w-full bg-white rounded-2xl shadow-xl p-6 sm:p-8 text-center">
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
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 to-teal-50">
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

      <main className="max-w-7xl mx-auto px-3 sm:px-4 lg:px-6 py-4 sm:py-6 lg:py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8 lg:gap-12">
          
          {/* Image Gallery */}
          <section className="lg:sticky lg:top-24">
            <div className="relative overflow-hidden rounded-xl sm:rounded-2xl bg-gradient-to-br from-gray-50 to-gray-100 aspect-square shadow-lg">
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
                    className="absolute left-2 sm:left-3 top-1/2 -translate-y-1/2 w-8 h-8 sm:w-10 sm:h-10 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center shadow-lg hover:bg-white transition-all duration-200 hover:scale-110"
                    onClick={() => setSelectedImage(selectedImage > 0 ? selectedImage - 1 : product.images.length - 1)}
                  >
                    <FaChevronLeft className="w-3 h-3 sm:w-4 sm:h-4 text-gray-700" />
                  </button>
                  <button
                    className="absolute right-2 sm:right-3 top-1/2 -translate-y-1/2 w-8 h-8 sm:w-10 sm:h-10 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center shadow-lg hover:bg-white transition-all duration-200 hover:scale-110"
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
          <section className="space-y-4 sm:space-y-6">
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
            <h1 className="text-lg sm:text-2xl lg:text-3xl font-bold text-gray-900 leading-tight">
              {product.name}
            </h1>

            {/* Rating */}
            <div className="flex items-center gap-2 sm:gap-3">
              <StarRating rating={product.rating || 0} size="sm" />
              <span className="text-xs sm:text-sm text-gray-500">
                {product.rating || 0} ({product.numReviews || 0} reviews)
              </span>
              {product.isVerified && (
                <FaShieldAlt className="w-3 h-3 sm:w-4 sm:h-4 text-emerald-500" />
              )}
            </div>

            {/* Price */}
            <div className="flex items-end gap-2 sm:gap-3">
              <span className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900">
                {formatPrice(product.price)}
              </span>
              {product.originalPrice && product.originalPrice > product.price && (
                <>
                  <span className="text-lg sm:text-xl text-gray-500 line-through">
                    {formatPrice(product.originalPrice)}
                  </span>
                  <Badge variant="save" size="sm">
                    Save {formatPrice(product.originalPrice - product.price)}
                  </Badge>
                </>
              )}
            </div>

            {/* Stock Status */}
            <div className={`flex items-center gap-2 rounded-xl border px-3 sm:px-4 py-2 sm:py-3 text-sm ${
                product.quantity > 0
                  ? "border-emerald-200 bg-emerald-50 text-emerald-700"
                : "border-red-200 bg-red-50 text-red-700"
            }`}>
              {product.quantity > 0 ? (
                <>
                  <FaCheck className="w-3 h-3 sm:w-4 sm:h-4" />
                  In Stock ({product.quantity} available)
                </>
              ) : (
                <>
                  <span className="w-3 h-3 sm:w-4 sm:h-4 rounded-full bg-red-500"></span>
                  Out of Stock
                </>
              )}
            </div>

            {/* Short Description */}
            {product.description && (
              <p className="text-sm sm:text-base leading-relaxed text-gray-600">
                {product.description}
              </p>
            )}

            {/* Colors */}
            {product.colors && product.colors.length > 0 && (
              <div className="space-y-2">
                <span className="text-sm sm:text-base font-medium text-gray-700">Available Colors:</span>
                <div className="flex gap-2">
                  {product.colors.map((color, index) => (
                    <button
                      key={index}
                      onClick={() => setSelectedColor(color)}
                      className={`w-8 h-8 sm:w-10 sm:h-10 rounded-full border-2 shadow-sm hover:scale-110 transition-all duration-200 ${
                        selectedColor?.name === color.name
                          ? 'border-emerald-500 ring-2 ring-emerald-200'
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                      style={{ backgroundColor: color.code }}
                      title={color.name}
                    >
                      {selectedColor?.name === color.name && (
                        <div className="w-full h-full flex items-center justify-center">
                          <FaCheck className="w-2.5 h-2.5 sm:w-3 sm:h-3 text-white drop-shadow-sm" />
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
              <div className="space-y-2">
                <span className="text-sm sm:text-base font-medium text-gray-700">Available Sizes:</span>
                <div className="flex gap-2">
                  {product.sizes.map((size, index) => (
                    <button
                      key={index}
                      onClick={() => size.available && setSelectedSize(size.name)}
                      disabled={!size.available}
                      className={`px-3 py-1.5 rounded-lg text-xs sm:text-sm border transition-all duration-200 ${
                        selectedSize === size.name
                          ? 'border-emerald-500 bg-emerald-50 text-emerald-700 ring-2 ring-emerald-200'
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
              <div className="flex items-center gap-3">
                <span className="text-sm sm:text-base font-medium text-gray-700">Quantity:</span>
                <div className="inline-flex items-center overflow-hidden rounded-lg border border-gray-300 bg-white">
                  <button
                    className="w-8 h-8 sm:w-10 sm:h-10 flex items-center justify-center hover:bg-gray-50 disabled:opacity-40 transition-colors duration-200"
                    onClick={() => setQty(Math.max(1, qty - 1))}
                    disabled={qty <= 1}
                  >
                    <FaMinus className="w-2.5 h-2.5 sm:w-3 sm:h-3 text-gray-600" />
                  </button>
                  <div className="min-w-[40px] sm:min-w-[48px] py-2 text-center font-semibold text-sm sm:text-base">
                    {qty}
                  </div>
                  <button
                    className="w-8 h-8 sm:w-10 sm:h-10 flex items-center justify-center hover:bg-gray-50 disabled:opacity-40 transition-colors duration-200"
                    onClick={() => setQty(Math.min(product.quantity, qty + 1))}
                    disabled={qty >= product.quantity}
                  >
                    <FaPlus className="w-2.5 h-2.5 sm:w-3 sm:h-3 text-gray-600" />
                  </button>
                </div>
              </div>
            )}

            {/* Action Buttons */}
            <div className="space-y-3 sm:space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <button
                onClick={handleAddToCart}
                  disabled={product.quantity <= 0 || isAddingToCart}
                  className="w-full inline-flex items-center justify-center gap-2 px-4 py-3 sm:py-4 bg-gradient-to-r from-emerald-600 to-teal-600 text-white text-sm sm:text-base font-semibold rounded-xl hover:from-emerald-700 hover:to-teal-700 disabled:from-gray-300 disabled:to-gray-400 disabled:cursor-not-allowed transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-[1.02]"
                >
                  {isAddingToCart ? (
                    <>
                      <FaSpinner className="w-3 h-3 sm:w-4 sm:h-4 animate-spin" />
                      Adding...
                    </>
                  ) : product.quantity <= 0 ? (
                    <>
                      <FaShoppingCart className="w-3 h-3 sm:w-4 sm:h-4" />
                      Out of Stock
                    </>
                  ) : (
                    <>
                      <FaShoppingCart className="w-3 h-3 sm:w-4 sm:h-4" />
                {(product.colors && product.colors.length > 0) || (product.sizes && product.sizes.length > 0) 
                        ? "Add to Cart" 
                  : "Add to Cart"
                }
                    </>
                  )}
              </button>
                
              <button
                onClick={toggleWishlist}
                  disabled={isWishlistLoading}
                  className={`w-full inline-flex items-center justify-center gap-2 px-4 py-3 sm:py-4 border rounded-xl text-sm sm:text-base font-semibold transition-all duration-200 shadow-sm hover:shadow-md transform hover:scale-[1.02] ${
                  isInWishlist(product._id)
                      ? "border-red-300 bg-red-50 text-red-600 hover:bg-red-100"
                      : "border-gray-300 bg-white text-gray-700 hover:bg-gray-50"
                }`}
              >
                  {isWishlistLoading ? (
                    <FaSpinner className="w-3 h-3 sm:w-4 sm:h-4 animate-spin" />
                  ) : (
                    <FaHeart className="w-3 h-3 sm:w-4 sm:h-4" />
                  )}
                {isInWishlist(product._id) ? "In Wishlist" : "Add to Wishlist"}
              </button>
              </div>
              
              <button
                onClick={buyNow}
                disabled={product.quantity <= 0}
                className="w-full inline-flex items-center justify-center gap-2 px-4 py-3 sm:py-4 bg-gradient-to-r from-gray-900 to-gray-800 text-white text-sm sm:text-base font-semibold rounded-xl hover:from-gray-800 hover:to-gray-700 disabled:from-gray-300 disabled:to-gray-400 disabled:cursor-not-allowed transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-[1.02]"
              >
                {product.quantity <= 0 ? "Sold Out" : "Buy Now"}
              </button>
            </div>

            {/* Trust Badges */}
            <div className="bg-white rounded-xl sm:rounded-2xl border border-gray-200 p-4 sm:p-6 shadow-sm">
              <h3 className="flex items-center gap-2 text-sm sm:text-base font-semibold text-gray-900 mb-3 sm:mb-4">
                <FaShieldAlt className="w-4 h-4 sm:w-5 sm:h-5 text-emerald-600" />
                Why choose this product?
              </h3>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                {[
                  { icon: FaTruck, text: "Free Shipping" },
                  { icon: FaGift, text: "30-Day Returns" },
                  { icon: FaShieldAlt, text: "2-Year Warranty" },
                  { icon: FaCheck, text: "Authentic Product" }
                ].map((item, index) => (
                  <div key={index} className="flex items-center gap-2 rounded-lg bg-gray-50 px-2 py-2">
                    <item.icon className="w-3 h-3 sm:w-4 sm:h-4 text-emerald-600" />
                    <span className="text-xs sm:text-sm text-gray-700">{item.text}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Tabs */}
            <div className="bg-white rounded-xl sm:rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
              <div className="flex gap-4 border-b border-gray-200 px-4 overflow-x-auto">
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

              <div className="p-4 sm:p-6">
                {tab === 0 && (
                  <div className="space-y-3">
                    <h4 className="text-sm sm:text-base font-semibold text-gray-900">{product.description}</h4>
                    <p className="text-sm sm:text-base text-gray-600 leading-relaxed">
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
          <section className="mt-8 sm:mt-12 lg:mt-16">
            <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-4 sm:mb-6">Related Products</h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4">
              {related.map((p) => (
                <button
                  key={p._id}
                  onClick={() => navigate(`/product/${p._id}`)}
                  className="group bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-lg transition-all duration-200 hover:scale-[1.02] text-left"
                >
                  <div className="aspect-square overflow-hidden bg-gradient-to-br from-gray-50 to-gray-100">
                    <img
                      src={p.images?.[0] || "https://images.unsplash.com/photo-1441986300917-64674bd600d8?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80"}
                      alt={p.name}
                      className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
                      onError={(e) => (e.currentTarget.src = "https://images.unsplash.com/photo-1441986300917-64674bd600d8?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80")}
                    />
                  </div>
                  <div className="p-3">
                    <h3 className="text-xs sm:text-sm font-semibold text-gray-900 mb-1 line-clamp-2 group-hover:text-emerald-600 transition-colors duration-200">
                      {p.name}
                    </h3>
                    <div className="flex items-center gap-1 mb-1">
                      <StarRating rating={p.rating || 0} size="xs" />
                      <span className="text-[10px] sm:text-xs text-gray-500">({p.numReviews || 0})</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-sm sm:text-base font-bold text-gray-900">{formatPrice(p.price)}</span>
                      {p.originalPrice && p.originalPrice > p.price && (
                        <span className="text-xs sm:text-sm text-gray-500 line-through">{formatPrice(p.originalPrice)}</span>
                      )}
                    </div>
                  </div>
                </button>
              ))}
            </div>
          </section>
        )}
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
