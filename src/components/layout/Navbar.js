import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useCart } from '../../context/CartContext';
import { useWishlist } from '../../context/WishlistContext';
import { useWebsiteConfig } from '../../context/WebsiteConfigContext';
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
  const { user, isAuthenticated, logout } = useAuth();
  const { totalItems } = useCart();
  const { products: wishlistItems } = useWishlist();
  const { config, isFeatureEnabled } = useWebsiteConfig();
  const navigate = useNavigate();
  const location = useLocation();
  const userMenuRef = useRef(null);

  // Close menus when route changes
  useEffect(() => {
    setIsMenuOpen(false);
    setIsUserMenuOpen(false);
  }, [location]);

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
      <span className="absolute -top-1 -right-1 inline-flex h-4 w-4 sm:h-5 sm:w-5 items-center justify-center rounded-full bg-red-500 text-[8px] sm:text-[10px] font-bold text-white shadow-sm">
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
    <header className="sticky top-0 z-50 w-full bg-gradient-to-r from-emerald-600 via-teal-600 to-cyan-600 text-white shadow-lg backdrop-blur-sm">
      <nav className="mx-auto max-w-7xl px-2 sm:px-4 lg:px-6">
        <div className="flex h-12 sm:h-14 lg:h-16 items-center justify-between">
          {/* Left: Brand & mobile toggle */}
          <div className="flex items-center gap-2 sm:gap-3">
            <button
              className="inline-flex h-8 w-8 sm:h-9 sm:w-9 lg:h-10 lg:w-10 items-center justify-center rounded-lg sm:rounded-xl bg-white/10 backdrop-blur transition-all duration-200 hover:bg-white/20 hover:scale-105 focus:outline-none focus:ring-2 focus:ring-white/40 lg:hidden"
              onClick={() => setIsMenuOpen((s) => !s)}
              aria-label="Toggle menu"
              aria-expanded={isMenuOpen}
            >
              {isMenuOpen ? (
                <FaTimes className="w-3 h-3 sm:w-4 sm:h-4" />
              ) : (
                <FaBars className="w-3 h-3 sm:w-4 sm:h-4" />
              )}
            </button>

            <Link to="/" className="group inline-flex items-center gap-1.5 sm:gap-2">
              <div className="grid h-7 w-7 sm:h-8 sm:w-8 lg:h-9 lg:w-9 place-items-center rounded-lg sm:rounded-xl bg-white text-emerald-700 font-extrabold shadow-sm transition-transform group-hover:scale-105">
                <FaStore className="w-3 h-3 sm:w-4 sm:h-4" />
              </div>
              <span className="text-sm sm:text-base lg:text-lg font-bold tracking-tight drop-shadow-sm">
                {config?.websiteName || 'E‑Shop'}
              </span>
            </Link>
          </div>

          {/* Center: Navigation (desktop) */}
          <div className="hidden lg:flex items-center space-x-1">
            <Link
              to="/"
              className={`inline-flex items-center gap-1.5 px-3 py-2 text-xs sm:text-sm font-medium rounded-lg transition-all duration-200 hover:bg-white/10 hover:scale-105 ${
                isActive('/') ? 'bg-white/20 text-white' : 'text-white/90 hover:text-white'
              }`}
            >
              <FaHome className="w-3 h-3 sm:w-4 sm:h-4" />
              <span>Home</span>
            </Link>
            <Link
              to="/products"
              className={`inline-flex items-center gap-1.5 px-3 py-2 text-xs sm:text-sm font-medium rounded-lg transition-all duration-200 hover:bg-white/10 hover:scale-105 ${
                isActive('/products') ? 'bg-white/20 text-white' : 'text-white/90 hover:text-white'
              }`}
            >
              <FaStore className="w-3 h-3 sm:w-4 sm:h-4" />
              <span>Products</span>
            </Link>
            <Link
              to="/about"
              className={`inline-flex items-center gap-1.5 px-3 py-2 text-xs sm:text-sm font-medium rounded-lg transition-all duration-200 hover:bg-white/10 hover:scale-105 ${
                isActive('/about') ? 'bg-white/20 text-white' : 'text-white/90 hover:text-white'
              }`}
            >
              <FaUser className="w-3 h-3 sm:w-4 sm:h-4" />
              <span>About</span>
            </Link>
            </div>

          {/* Right: Actions */}
          <div className="flex items-center gap-1 sm:gap-2">
            {/* Notification Bell */}
            <button className="relative inline-flex h-8 w-8 sm:h-9 sm:w-9 lg:h-10 lg:w-10 items-center justify-center rounded-lg sm:rounded-xl bg-white/10 backdrop-blur transition-all duration-200 hover:bg-white/20 hover:scale-105 focus:outline-none focus:ring-2 focus:ring-white/40">
              <FaBell className="w-3 h-3 sm:w-4 sm:h-4" />
              <span className="absolute -top-0.5 -right-0.5 h-2 w-2 sm:h-2.5 sm:w-2.5 bg-yellow-400 rounded-full"></span>
            </button>

            {/* Wishlist */}
            <Link
              to="/wishlist"
              className="relative inline-flex h-8 w-8 sm:h-9 sm:w-9 lg:h-10 lg:w-10 items-center justify-center rounded-lg sm:rounded-xl bg-white/10 backdrop-blur transition-all duration-200 hover:bg-white/20 hover:scale-105 focus:outline-none focus:ring-2 focus:ring-white/40"
            >
              <FaHeart className="w-3 h-3 sm:w-4 sm:h-4" />
              <Counter count={wishlistItems.length} />
            </Link>

            {/* Cart */}
            <Link
              to="/cart"
              className="relative inline-flex h-8 w-8 sm:h-9 sm:w-9 lg:h-10 lg:w-10 items-center justify-center rounded-lg sm:rounded-xl bg-white/10 backdrop-blur transition-all duration-200 hover:bg-white/20 hover:scale-105 focus:outline-none focus:ring-2 focus:ring-white/40"
            >
              <FaShoppingCart className="w-3 h-3 sm:w-4 sm:h-4" />
              <Counter count={totalItems} />
            </Link>

            {/* User */}
            {isAuthenticated ? (
              <div className="relative" ref={userMenuRef}>
                <button
                  className="inline-flex items-center gap-1.5 sm:gap-2 rounded-lg sm:rounded-xl bg-white/10 p-1.5 sm:p-2 backdrop-blur transition-all duration-200 hover:bg-white/20 hover:scale-105 focus:outline-none focus:ring-2 focus:ring-white/40"
                  onClick={() => setIsUserMenuOpen((s) => !s)}
                  aria-haspopup="menu"
                  aria-expanded={isUserMenuOpen}
                >
                  <div className="grid h-5 w-5 sm:h-6 sm:w-6 lg:h-7 lg:w-7 place-items-center rounded-full bg-white text-emerald-700">
                    <FaUser className="w-2.5 h-2.5 sm:w-3 sm:h-3" />
                  </div>
                  <span className="hidden sm:inline max-w-[8rem] truncate text-xs sm:text-sm font-medium">
                    {user?.name}
                  </span>
                </button>

                {isUserMenuOpen && (
                  <div
                    role="menu"
                    className="absolute right-0 mt-2 w-48 sm:w-56 overflow-hidden rounded-xl border border-white/20 bg-white/95 p-1.5 text-slate-800 shadow-xl backdrop-blur animate-in fade-in-0 zoom-in-95"
                  >
                    <Link 
                      to="/profile" 
                      className="flex items-center gap-2 rounded-lg px-3 py-2 text-xs sm:text-sm hover:bg-slate-100 transition-colors"
                    >
                      <FaUserCircle className="w-3 h-3 sm:w-4 sm:h-4" /> 
                      Profile
                    </Link>
                    <Link 
                      to="/orders" 
                      className="flex items-center gap-2 rounded-lg px-3 py-2 text-xs sm:text-sm hover:bg-slate-100 transition-colors"
                    >
                      <FaShoppingCart className="w-3 h-3 sm:w-4 sm:h-4" /> 
                      Orders
                    </Link>
                    {user?.role === 'admin' && (
                      <Link 
                        to="/admin" 
                        className="flex items-center gap-2 rounded-lg px-3 py-2 text-xs sm:text-sm hover:bg-slate-100 transition-colors"
                      >
                        <FaCog className="w-3 h-3 sm:w-4 sm:h-4" /> 
                        Admin Panel
                      </Link>
                    )}
                    {user?.role === 'superadmin' && (
                      <Link 
                        to="/superadmin/dashboard" 
                        className="flex items-center gap-2 rounded-lg px-3 py-2 text-xs sm:text-sm hover:bg-slate-100 transition-colors"
                      >
                        <FaShieldAlt className="w-3 h-3 sm:w-4 sm:h-4" /> 
                        Super Admin
                      </Link>
                    )}
                    <button 
                      onClick={handleLogout} 
                      className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-left text-xs sm:text-sm hover:bg-slate-100 transition-colors"
                    >
                      <FaSignOutAlt className="w-3 h-3 sm:w-4 sm:h-4" /> 
                      Logout
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <div className="hidden items-center gap-1.5 sm:gap-2 md:flex">
                <Link
                  to="/login"
                  className="rounded-lg sm:rounded-xl bg-white/90 px-2.5 sm:px-3 py-1.5 sm:py-2 text-xs sm:text-sm font-semibold text-emerald-700 shadow transition-all duration-200 hover:bg-white hover:scale-105"
                >
                  Login
                </Link>
                <Link
                  to="/register"
                  className="rounded-lg sm:rounded-xl border border-white/60 px-2.5 sm:px-3 py-1.5 sm:py-2 text-xs sm:text-sm font-semibold text-white backdrop-blur transition-all duration-200 hover:bg-white/10 hover:scale-105"
                >
                  Register
                </Link>
              </div>
            )}
          </div>
        </div>

        {/* Mobile drawer */}
        {isMenuOpen && (
          <div className="origin-top animate-in fade-in-0 zoom-in-95">
            <div className="mt-2 sm:mt-3 rounded-xl border border-white/25 bg-white/95 p-3 sm:p-4 text-slate-800 shadow-2xl backdrop-blur lg:hidden">
              <div className="grid gap-1 sm:gap-2">
                {/* Navigation Links */}
                <Link 
                  to="/" 
                  onClick={() => setIsMenuOpen(false)} 
                  className={`flex items-center gap-2 rounded-lg px-3 py-2 text-xs sm:text-sm font-medium transition-colors ${
                    isActive('/') ? 'bg-emerald-100 text-emerald-700' : 'hover:bg-slate-100'
                  }`}
                >
                  <FaHome className="w-3 h-3 sm:w-4 sm:h-4" /> 
                  Home
                </Link>
                <Link 
                  to="/products" 
                  onClick={() => setIsMenuOpen(false)} 
                  className={`flex items-center gap-2 rounded-lg px-3 py-2 text-xs sm:text-sm font-medium transition-colors ${
                    isActive('/products') ? 'bg-emerald-100 text-emerald-700' : 'hover:bg-slate-100'
                  }`}
                >
                  <FaStore className="w-3 h-3 sm:w-4 sm:h-4" /> 
                  Products
                </Link>
                <Link 
                  to="/about" 
                  onClick={() => setIsMenuOpen(false)} 
                  className={`flex items-center gap-2 rounded-lg px-3 py-2 text-xs sm:text-sm font-medium transition-colors ${
                    isActive('/about') ? 'bg-emerald-100 text-emerald-700' : 'hover:bg-slate-100'
                  }`}
                >
                  <FaUser className="w-3 h-3 sm:w-4 sm:h-4" /> 
                  About
                </Link>

                {/* Divider */}
                <div className="border-t border-slate-200 my-1"></div>

                {/* User Actions */}
                {isFeatureEnabled('wishlist') && (
                  <Link 
                    to="/wishlist" 
                    onClick={() => setIsMenuOpen(false)} 
                    className="flex items-center justify-between rounded-lg px-3 py-2 text-xs sm:text-sm font-medium hover:bg-slate-100 transition-colors"
                  >
                    <div className="flex items-center gap-2">
                      <FaHeart className="w-3 h-3 sm:w-4 sm:h-4" /> 
                      Wishlist
                  </div>
                    {wishlistItems.length > 0 && (
                      <span className="inline-flex h-4 w-4 sm:h-5 sm:w-5 items-center justify-center rounded-full bg-red-500 text-[8px] sm:text-[10px] font-bold text-white">
                        {wishlistItems.length > 99 ? '99+' : wishlistItems.length}
                      </span>
                    )}
                  </Link>
                )}
                <Link 
                  to="/cart" 
                  onClick={() => setIsMenuOpen(false)} 
                  className="flex items-center justify-between rounded-lg px-3 py-2 text-xs sm:text-sm font-medium hover:bg-slate-100 transition-colors"
                >
                  <div className="flex items-center gap-2">
                    <FaShoppingCart className="w-3 h-3 sm:w-4 sm:h-4" /> 
                    Cart
                  </div>
                  {totalItems > 0 && (
                    <span className="inline-flex h-4 w-4 sm:h-5 sm:w-5 items-center justify-center rounded-full bg-red-500 text-[8px] sm:text-[10px] font-bold text-white">
                      {totalItems > 99 ? '99+' : totalItems}
                    </span>
                  )}
                </Link>

                {isAuthenticated ? (
                  <>
                    <div className="border-t border-slate-200 my-1"></div>
                    <Link 
                      to="/profile" 
                      onClick={() => setIsMenuOpen(false)} 
                      className="flex items-center gap-2 rounded-lg px-3 py-2 text-xs sm:text-sm font-medium hover:bg-slate-100 transition-colors"
                    >
                      <FaUserCircle className="w-3 h-3 sm:w-4 sm:h-4" /> 
                      Profile
                    </Link>
                    <Link 
                      to="/orders" 
                      onClick={() => setIsMenuOpen(false)} 
                      className="flex items-center gap-2 rounded-lg px-3 py-2 text-xs sm:text-sm font-medium hover:bg-slate-100 transition-colors"
                    >
                      <FaShoppingCart className="w-3 h-3 sm:w-4 sm:h-4" /> 
                      Orders
                    </Link>
                    {user?.role === 'admin' && (
                      <Link 
                        to="/admin" 
                        onClick={() => setIsMenuOpen(false)} 
                        className="flex items-center gap-2 rounded-lg px-3 py-2 text-xs sm:text-sm font-medium hover:bg-slate-100 transition-colors"
                      >
                        <FaCog className="w-3 h-3 sm:w-4 sm:h-4" /> 
                        Admin Panel
                      </Link>
                    )}
                    {user?.role === 'superadmin' && (
                      <Link 
                        to="/superadmin/dashboard" 
                        onClick={() => setIsMenuOpen(false)} 
                        className="flex items-center gap-2 rounded-lg px-3 py-2 text-xs sm:text-sm font-medium hover:bg-slate-100 transition-colors"
                      >
                        <FaShieldAlt className="w-3 h-3 sm:w-4 sm:h-4" /> 
                        Super Admin
                      </Link>
                    )}
                    <button 
                      onClick={handleLogout} 
                      className="flex items-center gap-2 rounded-lg px-3 py-2 text-left text-xs sm:text-sm font-medium hover:bg-slate-100 transition-colors"
                    >
                      <FaSignOutAlt className="w-3 h-3 sm:w-4 sm:h-4" /> 
                      Logout
                    </button>
                  </>
                ) : (
                  <>
                    <div className="border-t border-slate-200 my-1"></div>
                    <Link 
                      to="/login" 
                      onClick={() => setIsMenuOpen(false)} 
                      className="flex items-center justify-center rounded-lg bg-emerald-600 px-3 py-2 text-xs sm:text-sm font-semibold text-white hover:bg-emerald-700 transition-colors"
                    >
                      Login
                    </Link>
                    <Link 
                      to="/register" 
                      onClick={() => setIsMenuOpen(false)} 
                      className="flex items-center justify-center rounded-lg border border-slate-300 px-3 py-2 text-xs sm:text-sm font-semibold hover:bg-slate-50 transition-colors"
                    >
                      Register
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
