import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useWishlist } from '../context/WishlistContext';
import { 
  FaArrowLeft, 
  FaRegHeart,
  FaSpinner,
  FaHeart
} from 'react-icons/fa';
import ProductCard from '../components/products/ProductCard';

const Wishlist = () => {
  const { isAuthenticated } = useAuth();
  const { products: wishlistProducts, loading } = useWishlist();

  // --- UI ---
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen relative flex items-center justify-center px-3 sm:px-4">
        {/* Single Gradient Overlay for Entire Wishlist Page */}
        <div className="absolute inset-0 bg-gradient-to-br from-blue-600/20 via-transparent to-purple-600/20 pointer-events-none"></div>
        <div className="max-w-sm w-full bg-white shadow-xl rounded-2xl p-6 sm:p-8 text-center relative z-10">
          <div className="w-16 h-16 sm:w-20 sm:h-20 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-4 sm:mb-6">
            <FaHeart className="w-8 h-8 sm:w-10 sm:h-10 text-white" />
          </div>
          <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-2 sm:mb-3">Access Your Wishlist</h2>
          <p className="text-sm sm:text-base text-gray-600 mb-6 sm:mb-8">Sign in to view and manage your saved items</p>
          <Link 
            to="/login" 
            className="inline-flex items-center justify-center w-full rounded-xl px-4 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold hover:from-blue-700 hover:to-purple-700 transition-all duration-200 shadow-lg hover:shadow-xl"
          >
            Sign In
          </Link>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="min-h-screen relative flex items-center justify-center">
        {/* Single Gradient Overlay for Entire Wishlist Page */}
        <div className="absolute inset-0 bg-gradient-to-br from-blue-600/20 via-transparent to-purple-600/20 pointer-events-none"></div>
        <div className="text-center relative z-10">
          <FaSpinner className="w-8 h-8 sm:w-12 sm:h-12 text-blue-600 animate-spin mx-auto mb-4" />
          <p className="text-sm sm:text-base text-gray-600">Loading your wishlist...</p>
        </div>
      </div>
    );
  }

  if (!wishlistProducts || wishlistProducts.length === 0) {
    return (
      <div className="min-h-screen relative flex items-center justify-center px-3 sm:px-4">
        {/* Single Gradient Overlay for Entire Wishlist Page */}
        <div className="absolute inset-0 bg-gradient-to-br from-blue-600/20 via-transparent to-purple-600/20 pointer-events-none"></div>
        <div className="max-w-sm w-full bg-white shadow-xl rounded-2xl p-6 sm:p-8 text-center relative z-10">
          <div className="w-16 h-16 sm:w-20 sm:h-20 bg-gradient-to-r from-gray-700 via-gray-800 to-black rounded-full flex items-center justify-center mx-auto mb-4 sm:mb-6 relative">
            <div className="absolute inset-0 bg-white rounded-full m-1"></div>
            <FaRegHeart className="w-8 h-8 sm:w-10 sm:h-10 text-black relative z-10" />
          </div>
          <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-2 sm:mb-3">Your Wishlist is Empty</h2>
          <p className="text-sm sm:text-base text-gray-600 mb-6 sm:mb-8">Start saving items you love by tapping the heart icon on products</p>
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

  return (
    <div className="min-h-screen relative">
      {/* Content Section */}
      <div className="py-4 sm:py-6 relative overflow-hidden z-10">
        {/* Animated Background Elements */}
        <div className="absolute inset-0">
          <div className="absolute top-10 left-10 w-24 h-24 bg-blue-500/10 rounded-full animate-pulse"></div>
          <div className="absolute top-20 right-20 w-16 h-16 bg-purple-500/10 rounded-full animate-pulse animation-delay-1000"></div>
          <div className="absolute bottom-10 left-1/4 w-20 h-20 bg-pink-500/10 rounded-full animate-pulse animation-delay-2000"></div>
          <div className="absolute bottom-20 right-1/3 w-12 h-12 bg-green-500/10 rounded-full animate-pulse animation-delay-3000"></div>
        </div>
        
        <div className="max-w-7xl mx-auto px-3 sm:px-4 lg:px-6 relative z-10">
        {/* Product Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3 sm:gap-4 md:gap-5 lg:gap-6">
          {wishlistProducts.map((item) => {
          const product = item.product;
          if (!product) {
            return (
                <div key={item._id} className="bg-white rounded-xl shadow-sm border border-gray-200 p-3 sm:p-4 flex items-center justify-center">
                    <p className="text-xs sm:text-sm text-gray-600">Product no longer available</p>
              </div>
            );
          }
          return (
              <div key={item._id}>
                {/* Product Card */}
                <ProductCard product={product} />
            </div>
          );
        })}
      </div>

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
        </div>
      </div>
    </div>
  );
};

export default Wishlist;
