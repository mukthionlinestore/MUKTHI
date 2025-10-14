import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useCart } from '../../context/CartContext';
import { useWishlist } from '../../context/WishlistContext';
import { useWebsiteConfig } from '../../context/WebsiteConfigContext';
import { useNotifications } from '../../context/NotificationContext';
import { 
  FaShoppingCart, 
  FaHeart, 
  FaUser, 
  FaSignOutAlt, 
  FaCog, 
  FaBars, 
  FaTimes,
  FaHome,
  FaStore,
  FaUserCircle,
  FaBell,
  FaShieldAlt
} from 'react-icons/fa';

/**
 * Modern, mobile-first Navbar with emerald/teal theme
 * - No search functionality
 * - Mobile-optimized with smaller sizes
 * - Beautiful gradient and glassmorphism effects
 */
const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const { user, isAuthenticated, logout } = useAuth();
  const { totalItems } = useCart();
  const { products: wishlistItems } = useWishlist();
  const { config, isFeatureEnabled } = useWebsiteConfig();
  const { unreadCount } = useNotifications();
  const navigate = useNavigate();
  const location = useLocation();
  const userMenuRef = useRef(null);

  // Close menus when route changes
  useEffect(() => {
    setIsMenuOpen(false);
    setIsUserMenuOpen(false);
  }, [location]);

  // Scroll detection for navbar background
  useEffect(() => {
    const handleScroll = () => {
      const scrollTop = window.scrollY;
      setIsScrolled(scrollTop > 10);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close user dropdown on outside click / Escape
  useEffect(() => {
    const onClick = (e) => {
      if (userMenuRef.current && !userMenuRef.current.contains(e.target)) {
        setIsUserMenuOpen(false);
      }
    };
    const onKey = (e) => {
      if (e.key === 'Escape') {
        setIsUserMenuOpen(false);
        setIsMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', onClick);
    document.addEventListener('keydown', onKey);
    return () => {
      document.removeEventListener('mousedown', onClick);
      document.removeEventListener('keydown', onKey);
    };
  }, []);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const Counter = ({ count }) => (
    count > 0 ? (
      <span className="absolute -top-1 -right-1 inline-flex h-5 w-5 items-center justify-center rounded-full bg-red-500 text-[10px] font-bold text-white shadow-lg">
        {count > 99 ? '99+' : count}
      </span>
    ) : null
  );

  const isActive = (path) => {
    if (path === '/') {
      return location.pathname === '/';
    }
    return location.pathname.startsWith(path);
  };

  return (
    <header className={`sticky top-0 z-50 w-full transition-all duration-300 ${
      isScrolled 
        ? 'bg-white/10 backdrop-blur-md border-b border-white/20' 
        : 'bg-transparent'
    }`}>
      {/* Glass morphism background with blur effect - only when scrolled */}
      {isScrolled && (
        <div className="absolute inset-0 bg-gradient-to-r from-white/5 to-white/10 backdrop-blur-md"></div>
      )}
      
      <nav className="relative z-10 mx-auto max-w-7xl px-3 sm:px-4 lg:px-6">
        <div className="flex h-14 sm:h-16 lg:h-18 items-center justify-between">
          {/* Left: Brand & mobile toggle */}
          <div className="flex items-center gap-3 sm:gap-4">
            <button
              className="lg:hidden inline-flex h-8 w-8 items-center justify-center rounded-xl bg-white/40 backdrop-blur-sm border border-gray-200/30 shadow-sm hover:shadow-md transition-all duration-200 hover:scale-105 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
              onClick={() => setIsMenuOpen((s) => !s)}
              aria-label="Toggle menu"
              aria-expanded={isMenuOpen}
            >
              {isMenuOpen ? (
                <FaTimes className="w-3 h-3 text-gray-700" />
              ) : (
                <FaBars className="w-3 h-3 text-gray-700" />
              )}
            </button>

              <Link to="/" className="group inline-flex items-center gap-2 sm:gap-3">
                {config?.websiteLogo ? (
                  <img 
                    src={config.websiteLogo} 
                    alt={config.logoAlt || 'Logo'} 
                    className="w-8 h-8 sm:w-12 sm:h-12 lg:w-14 lg:h-14 object-contain transition-all duration-300 group-hover:scale-105"
                  />
                ) : (
                  <FaStore className="w-8 h-8 sm:w-12 sm:h-12 lg:w-14 lg:h-14 text-gray-800 transition-all duration-300 group-hover:scale-105" />
                )}
                <span className="text-lg sm:text-xl font-bold text-gray-900 group-hover:text-blue-600 transition-colors duration-200">
                {config?.websiteName || 'MUKHTI'}
              </span>
            </Link>
          </div>

          {/* Center: Navigation (desktop) */}
          <div className="hidden lg:flex items-center space-x-2">
            <Link
              to="/"
              className={`inline-flex items-center gap-2 px-4 py-2.5 text-sm font-semibold rounded-xl transition-all duration-200 hover:scale-105 ${
                isActive('/') 
                  ? 'bg-white/60 backdrop-blur-sm shadow-lg text-blue-600 border border-blue-200/30' 
                  : 'text-gray-700 hover:bg-white/40 hover:text-blue-600 hover:shadow-md'
              }`}
            >
              <FaHome className="w-3 h-3 sm:w-4 sm:h-4" />
              <span>Home</span>
            </Link>
            <Link
              to="/products"
              className={`inline-flex items-center gap-2 px-4 py-2.5 text-sm font-semibold rounded-xl transition-all duration-200 hover:scale-105 ${
                isActive('/products') 
                  ? 'bg-white/60 backdrop-blur-sm shadow-lg text-blue-600 border border-blue-200/30' 
                  : 'text-gray-700 hover:bg-white/40 hover:text-blue-600 hover:shadow-md'
              }`}
            >
              <FaStore className="w-3 h-3 sm:w-4 sm:h-4" />
              <span>Products</span>
            </Link>
            <Link
              to="/about"
              className={`inline-flex items-center gap-2 px-4 py-2.5 text-sm font-semibold rounded-xl transition-all duration-200 hover:scale-105 ${
                isActive('/about') 
                  ? 'bg-white/60 backdrop-blur-sm shadow-lg text-blue-600 border border-blue-200/30' 
                  : 'text-gray-700 hover:bg-white/40 hover:text-blue-600 hover:shadow-md'
              }`}
            >
              <FaUser className="w-3 h-3 sm:w-4 sm:h-4" />
              <span>About</span>
            </Link>
            </div>

          {/* Right: Actions */}
          <div className="flex items-center gap-2 sm:gap-3">
            {/* Notification Bell */}
            <Link
              to="/notifications"
              className="relative inline-flex h-8 w-8 sm:h-11 sm:w-11 items-center justify-center rounded-xl bg-white/40 backdrop-blur-sm border border-gray-200/30 shadow-sm hover:shadow-md transition-all duration-200 hover:scale-105 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
            >
              <FaBell className="w-3 h-3 sm:w-4 sm:h-4 text-gray-700" />
              <Counter count={unreadCount} />
            </Link>

            {/* Wishlist */}
            <Link
              to="/wishlist"
              className="relative inline-flex h-8 w-8 sm:h-11 sm:w-11 items-center justify-center rounded-xl bg-white/40 backdrop-blur-sm border border-gray-200/30 shadow-sm hover:shadow-md transition-all duration-200 hover:scale-105 focus:outline-none focus:ring-2 focus:ring-pink-500/20"
            >
              <FaHeart className="w-3 h-3 sm:w-4 sm:h-4 text-gray-700" />
              <Counter count={wishlistItems.length} />
            </Link>

            {/* Cart */}
            <Link
              to="/cart"
              className="relative inline-flex h-8 w-8 sm:h-11 sm:w-11 items-center justify-center rounded-xl bg-white/40 backdrop-blur-sm border border-gray-200/30 shadow-sm hover:shadow-md transition-all duration-200 hover:scale-105 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
            >
              <FaShoppingCart className="w-3 h-3 sm:w-4 sm:h-4 text-gray-700" />
              <Counter count={totalItems} />
            </Link>

            {/* User */}
            {isAuthenticated ? (
              <div className="relative" ref={userMenuRef}>
                <button
                  className="inline-flex items-center gap-1 sm:gap-3 rounded-xl px-2 sm:px-3 py-2 sm:py-2.5 bg-white/40 backdrop-blur-sm border border-gray-200/30 shadow-sm hover:shadow-md transition-all duration-200 hover:scale-105 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                  onClick={() => setIsUserMenuOpen((s) => !s)}
                  aria-haspopup="menu"
                  aria-expanded={isUserMenuOpen}
                >
                  <div className="grid h-6 w-6 sm:h-9 sm:w-9 place-items-center rounded-full bg-gradient-to-br from-blue-600 to-purple-600 shadow-sm">
                    <FaUser className="w-2.5 h-2.5 sm:w-4 sm:h-4 text-white" />
                  </div>
                  <span className="hidden sm:inline max-w-[8rem] truncate text-sm font-semibold text-gray-900">
                    {user?.name}
                  </span>
                </button>

                {isUserMenuOpen && (
                  <div
                    role="menu"
                    className="absolute right-0 mt-3 w-56 overflow-hidden rounded-2xl border border-white/20 bg-white/10 shadow-2xl backdrop-blur-md"
                  >
                    <div className="p-2">
                    <Link 
                      to="/profile" 
                        className="flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
                    >
                        <FaUserCircle className="w-3 h-3 sm:w-4 sm:h-4 text-blue-600" /> 
                      Profile
                    </Link>
                    <Link 
                      to="/orders" 
                        className="flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
                    >
                        <FaShoppingCart className="w-3 h-3 sm:w-4 sm:h-4 text-green-600" /> 
                      Orders
                    </Link>
                    {user?.role === 'admin' && (
                      <Link 
                        to="/admin" 
                          className="flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
                      >
                          <FaCog className="w-3 h-3 sm:w-4 sm:h-4 text-purple-600" /> 
                        Admin Panel
                      </Link>
                    )}
                    {user?.role === 'superadmin' && (
                      <Link 
                        to="/superadmin/dashboard" 
                          className="flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
                      >
                          <FaShieldAlt className="w-3 h-3 sm:w-4 sm:h-4 text-orange-600" /> 
                        Super Admin
                      </Link>
                    )}
                      <div className="border-t border-gray-100 my-1"></div>
                    <button 
                      onClick={handleLogout} 
                        className="flex w-full items-center gap-3 rounded-xl px-4 py-3 text-left text-sm font-medium text-red-600 hover:bg-red-50 transition-colors"
                    >
                        <FaSignOutAlt className="w-3 h-3 sm:w-4 sm:h-4" /> 
                      Logout
                    </button>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div className="hidden items-center gap-2 sm:gap-3 md:flex">
                <Link
                  to="/login"
                  className="px-4 py-2.5 text-sm font-semibold text-white bg-gradient-to-r from-gray-700 via-gray-800 to-black hover:from-gray-800 hover:via-gray-900 hover:to-gray-800 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-200 hover:scale-105 focus:outline-none focus:ring-2 focus:ring-gray-500/20 flex items-center justify-between gap-2"
                >
                  <span>Login</span>
                  <div className="w-4 h-4 bg-white rounded-full flex items-center justify-center">
                    <svg className="w-2 h-2 text-black" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </div>
                </Link>
                <Link
                  to="/register"
                  className="px-4 py-2.5 text-sm font-semibold text-white bg-gradient-to-r from-gray-700 via-gray-800 to-black hover:from-gray-800 hover:via-gray-900 hover:to-gray-800 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-200 hover:scale-105 focus:outline-none focus:ring-2 focus:ring-gray-500/20 flex items-center justify-between gap-2"
                >
                  <span>Register</span>
                  <div className="w-4 h-4 bg-white rounded-full flex items-center justify-center">
                    <svg className="w-2 h-2 text-black" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </div>
                </Link>
              </div>
            )}
          </div>
        </div>

        {/* Mobile drawer */}
        {isMenuOpen && (
          <div className="lg:hidden">
            <div className="mt-3 rounded-2xl border border-white/20 bg-white/10 backdrop-blur-md p-4 shadow-2xl">
              <div className="space-y-2">
                {/* Navigation Links */}
                <Link 
                  to="/" 
                  onClick={() => setIsMenuOpen(false)} 
                  className={`flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-semibold transition-all duration-200 ${
                    isActive('/') 
                      ? 'bg-blue-50 text-blue-600 border border-blue-200' 
                      : 'text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  <FaHome className="w-3 h-3 sm:w-4 sm:h-4" /> 
                  Home
                </Link>
                <Link 
                  to="/products" 
                  onClick={() => setIsMenuOpen(false)} 
                  className={`flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-semibold transition-all duration-200 ${
                    isActive('/products') 
                      ? 'bg-blue-50 text-blue-600 border border-blue-200' 
                      : 'text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  <FaStore className="w-3 h-3 sm:w-4 sm:h-4" /> 
                  Products
                </Link>
                <Link 
                  to="/about" 
                  onClick={() => setIsMenuOpen(false)} 
                  className={`flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-semibold transition-all duration-200 ${
                    isActive('/about') 
                      ? 'bg-blue-50 text-blue-600 border border-blue-200' 
                      : 'text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  <FaUser className="w-3 h-3 sm:w-4 sm:h-4" /> 
                  About
                </Link>

                {/* Notifications */}
                <Link 
                  to="/notifications" 
                  onClick={() => setIsMenuOpen(false)} 
                  className="flex items-center justify-between rounded-xl px-4 py-3 text-sm font-semibold text-gray-700 hover:bg-gray-50 transition-all duration-200"
                >
                  <div className="flex items-center gap-3">
                    <FaBell className="w-3 h-3 sm:w-4 sm:h-4 text-blue-600" /> 
                    Notifications
                  </div>
                  {unreadCount > 0 && (
                    <span className="inline-flex h-5 w-5 items-center justify-center rounded-full bg-red-500 text-[10px] font-bold text-white">
                      {unreadCount > 99 ? '99+' : unreadCount}
                    </span>
                  )}
                </Link>

                {/* Divider */}
                <div className="border-t border-gray-200 my-2"></div>

                {/* User Actions */}
                {isFeatureEnabled('wishlist') && (
                  <Link 
                    to="/wishlist" 
                    onClick={() => setIsMenuOpen(false)} 
                    className="flex items-center justify-between rounded-xl px-4 py-3 text-sm font-semibold text-gray-700 hover:bg-gray-50 transition-all duration-200"
                  >
                    <div className="flex items-center gap-3">
                      <FaHeart className="w-3 h-3 sm:w-4 sm:h-4 text-pink-600" /> 
                      Wishlist
                  </div>
                    {wishlistItems.length > 0 && (
                      <span className="inline-flex h-5 w-5 items-center justify-center rounded-full bg-red-500 text-[10px] font-bold text-white">
                        {wishlistItems.length > 99 ? '99+' : wishlistItems.length}
                      </span>
                    )}
                  </Link>
                )}
                <Link 
                  to="/cart" 
                  onClick={() => setIsMenuOpen(false)} 
                  className="flex items-center justify-between rounded-xl px-4 py-3 text-sm font-semibold text-gray-700 hover:bg-gray-50 transition-all duration-200"
                >
                  <div className="flex items-center gap-3">
                    <FaShoppingCart className="w-3 h-3 sm:w-4 sm:h-4 text-blue-600" /> 
                    Cart
                  </div>
                  {totalItems > 0 && (
                    <span className="inline-flex h-5 w-5 items-center justify-center rounded-full bg-red-500 text-[10px] font-bold text-white">
                      {totalItems > 99 ? '99+' : totalItems}
                    </span>
                  )}
                </Link>

                {isAuthenticated ? (
                  <>
                    <div className="border-t border-gray-200 my-2"></div>
                    <Link 
                      to="/profile" 
                      onClick={() => setIsMenuOpen(false)} 
                      className="flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-semibold text-gray-700 hover:bg-gray-50 transition-all duration-200"
                    >
                      <FaUserCircle className="w-3 h-3 sm:w-4 sm:h-4 text-blue-600" /> 
                      Profile
                    </Link>
                    <Link 
                      to="/orders" 
                      onClick={() => setIsMenuOpen(false)} 
                      className="flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-semibold text-gray-700 hover:bg-gray-50 transition-all duration-200"
                    >
                      <FaShoppingCart className="w-3 h-3 sm:w-4 sm:h-4 text-green-600" /> 
                      Orders
                    </Link>
                    {user?.role === 'admin' && (
                      <Link 
                        to="/admin" 
                        onClick={() => setIsMenuOpen(false)} 
                        className="flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-semibold text-gray-700 hover:bg-gray-50 transition-all duration-200"
                      >
                        <FaCog className="w-3 h-3 sm:w-4 sm:h-4 text-purple-600" /> 
                        Admin Panel
                      </Link>
                    )}
                    {user?.role === 'superadmin' && (
                      <Link 
                        to="/superadmin/dashboard" 
                        onClick={() => setIsMenuOpen(false)} 
                        className="flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-semibold text-gray-700 hover:bg-gray-50 transition-all duration-200"
                      >
                        <FaShieldAlt className="w-3 h-3 sm:w-4 sm:h-4 text-orange-600" /> 
                        Super Admin
                      </Link>
                    )}
                    <div className="border-t border-gray-200 my-2"></div>
                    <button 
                      onClick={handleLogout} 
                      className="flex items-center gap-3 rounded-xl px-4 py-3 text-left text-sm font-semibold text-red-600 hover:bg-red-50 transition-all duration-200"
                    >
                      <FaSignOutAlt className="w-3 h-3 sm:w-4 sm:h-4" /> 
                      Logout
                    </button>
                  </>
                ) : (
                  <>
                    <div className="border-t border-gray-200 my-2"></div>
                    <Link 
                      to="/login" 
                      onClick={() => setIsMenuOpen(false)} 
                      className="flex items-center justify-between rounded-2xl px-4 py-3 text-sm font-semibold text-white bg-gradient-to-r from-gray-700 via-gray-800 to-black hover:from-gray-800 hover:via-gray-900 hover:to-gray-800 shadow-lg hover:shadow-xl transition-all duration-200"
                    >
                      <span>Login</span>
                      <div className="w-4 h-4 bg-white rounded-full flex items-center justify-center">
                        <svg className="w-2 h-2 text-black" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                        </svg>
                      </div>
                    </Link>
                    <Link 
                      to="/register" 
                      onClick={() => setIsMenuOpen(false)} 
                      className="flex items-center justify-between rounded-2xl px-4 py-3 text-sm font-semibold text-white bg-gradient-to-r from-gray-700 via-gray-800 to-black hover:from-gray-800 hover:via-gray-900 hover:to-gray-800 shadow-lg hover:shadow-xl transition-all duration-200"
                    >
                      <span>Register</span>
                      <div className="w-4 h-4 bg-white rounded-full flex items-center justify-center">
                        <svg className="w-2 h-2 text-black" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                        </svg>
                      </div>
                    </Link>
                  </>
                )}
              </div>
            </div>
          </div>
        )}
      </nav>
    </header>
  );
};

export default Navbar;
