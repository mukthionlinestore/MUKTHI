import React from 'react';
import { Link } from 'react-router-dom';
import { useFooter } from '../../context/FooterContext';
import { useWebsiteConfig } from '../../context/WebsiteConfigContext';
import { 
  FaFacebook, 
  FaTwitter, 
  FaInstagram, 
  FaLinkedin, 
  FaEnvelope, 
  FaPhone, 
  FaMapMarkerAlt,
  FaStore,
  FaHeart,
  FaArrowUp,
  FaShieldAlt,
  FaTruck,
  FaCreditCard,
  FaHeadset,
  FaGift,
  FaStar,
  FaShoppingBag,
  FaUser,
  FaHome,
  FaQuestionCircle,
  FaRocket,
  FaAward,
  FaClock,
  FaGlobe
} from 'react-icons/fa';

const Footer = () => {
  const { footerData } = useFooter();
  const { config, isFeatureEnabled } = useWebsiteConfig();
  const year = new Date().getFullYear();

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="relative ">

      <div className="relative z-10">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          
          {/* Main Footer Content */}
          <div className="py-6 sm:py-8 lg:py-12">
            {/* Mobile Layout - Compact */}
            <div className="block sm:hidden">
              {/* Brand Section - Mobile */}
              <div className="text-center mb-6">
                <div className="flex items-center justify-center gap-3 mb-3">
                  <div className="grid h-8 w-8 place-items-center rounded-xl font-extrabold shadow-lg transition-all duration-300 bg-gradient-to-br from-blue-600 to-purple-600">
                    {config?.websiteLogo ? (
                      <img 
                        src={config.websiteLogo} 
                        alt={config.logoAlt || 'Logo'} 
                        className="w-5 h-5 object-contain"
                      />
                    ) : (
                      <FaStore className="w-5 h-5 text-white" />
                    )}
                  </div>
                  <span className="text-lg font-bold tracking-tight text-gray-900">
                    {config?.websiteName || footerData.companyName || 'MUKHTI'}
                  </span>
                </div>
                <p className="text-xs text-gray-600 mb-4 max-w-xs mx-auto">
                  {config?.websiteDescription || footerData.companyDescription || 'Gracefully unbound - Premium lifestyle and fashion destination'}
                </p>
                
                {/* Social Media - Mobile */}
                <div className="flex items-center justify-center gap-2">
                  {(config?.socialMedia?.facebook || footerData.socialMedia?.facebook) && (
                    <a 
                      href={config?.socialMedia?.facebook || footerData.socialMedia?.facebook}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label="Facebook" 
                      className="inline-flex h-8 w-8 items-center justify-center rounded-lg bg-blue-50 text-blue-600 hover:bg-blue-100 hover:scale-110 transition-all duration-200"
                    >
                      <FaFacebook className="w-3 h-3" />
                    </a>
                  )}
                  {(config?.socialMedia?.twitter || footerData.socialMedia?.twitter) && (
                    <a 
                      href={config?.socialMedia?.twitter || footerData.socialMedia?.twitter}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label="Twitter" 
                      className="inline-flex h-8 w-8 items-center justify-center rounded-lg bg-sky-50 text-sky-600 hover:bg-sky-100 hover:scale-110 transition-all duration-200"
                    >
                      <FaTwitter className="w-3 h-3" />
                    </a>
                  )}
                  {(config?.socialMedia?.instagram || footerData.socialMedia?.instagram) && (
                    <a 
                      href={config?.socialMedia?.instagram || footerData.socialMedia?.instagram}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label="Instagram" 
                      className="inline-flex h-8 w-8 items-center justify-center rounded-lg bg-pink-50 text-pink-600 hover:bg-pink-100 hover:scale-110 transition-all duration-200"
                    >
                      <FaInstagram className="w-3 h-3" />
                    </a>
                  )}
                  {(config?.socialMedia?.linkedin || footerData.socialMedia?.linkedin) && (
                    <a 
                      href={config?.socialMedia?.linkedin || footerData.socialMedia?.linkedin}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label="LinkedIn" 
                      className="inline-flex h-8 w-8 items-center justify-center rounded-lg bg-blue-50 text-blue-700 hover:bg-blue-100 hover:scale-110 transition-all duration-200"
                    >
                      <FaLinkedin className="w-3 h-3" />
                    </a>
                  )}
                </div>
              </div>

              {/* Quick Links - Mobile */}
              <div className="mb-6">
                <h4 className="text-sm font-semibold mb-3 text-center text-gray-900">
                  Quick Links
                </h4>
                <div className="grid grid-cols-2 gap-3">
                  <Link 
                    to="/" 
                    className="text-xs text-gray-600 hover:text-blue-600 transition-colors duration-200 text-center py-2"
                  >
                    Home
                  </Link>
                  <Link 
                    to="/products" 
                    className="text-xs text-gray-600 hover:text-blue-600 transition-colors duration-200 text-center py-2"
                  >
                    Products
                  </Link>
                  <Link 
                    to="/about" 
                    className="text-xs text-gray-600 hover:text-blue-600 transition-colors duration-200 text-center py-2"
                  >
                    About
                  </Link>
                  <Link 
                    to="/contact" 
                    className="text-xs text-gray-600 hover:text-blue-600 transition-colors duration-200 text-center py-2"
                  >
                    Contact
                  </Link>
                </div>
              </div>

              {/* Contact - Mobile */}
              <div className="text-center">
                <h4 className="text-sm font-semibold mb-3 text-gray-900">
                  Contact Info
                </h4>
                <div className="space-y-2">
                  {(config?.contactPhone || footerData.contact?.phone) && (
                    <a 
                      href={`tel:${config?.contactPhone || footerData.contact?.phone}`}
                      className="text-xs text-gray-600 hover:text-cyan-600 transition-colors duration-200 block"
                    >
                      {config?.contactPhone || footerData.contact?.phone}
                    </a>
                  )}
                  {(config?.contactEmail || footerData.contact?.email) && (
                    <a 
                      href={`mailto:${config?.contactEmail || footerData.contact?.email}`}
                      className="text-xs text-gray-600 hover:text-cyan-600 transition-colors duration-200 block"
                    >
                      {config?.contactEmail || footerData.contact?.email}
                    </a>
                  )}
                </div>
              </div>
            </div>

            {/* Desktop Layout */}
            <div className="hidden sm:grid sm:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12">
              
              {/* Brand Section */}
              <div className="sm:col-span-2 lg:col-span-1">
                <div className="flex items-center gap-3 mb-4">
                  <div className="grid h-10 w-10 sm:h-12 sm:w-12 place-items-center rounded-2xl font-extrabold shadow-lg transition-all duration-300 bg-gradient-to-br from-blue-600 to-purple-600">
                    {config?.websiteLogo ? (
                      <img 
                        src={config.websiteLogo} 
                        alt={config.logoAlt || 'Logo'} 
                        className="w-6 h-6 sm:w-7 sm:h-7 object-contain"
                      />
                    ) : (
                      <FaStore className="w-6 h-6 sm:w-7 sm:h-7 text-white" />
                    )}
                  </div>
                  <span className="text-lg sm:text-xl font-bold tracking-tight text-gray-900">
                    {config?.websiteName || footerData.companyName || 'MUKHTI'}
                  </span>
                </div>
                <p className="text-sm leading-relaxed mb-6 max-w-sm text-gray-600">
                  {config?.websiteDescription || footerData.companyDescription || 'Gracefully unbound - Premium lifestyle and fashion destination'}
                </p>
                
                {/* Social Media */}
                <div className="flex items-center gap-3">
                  {(config?.socialMedia?.facebook || footerData.socialMedia?.facebook) && (
                    <a 
                      href={config?.socialMedia?.facebook || footerData.socialMedia?.facebook}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label="Facebook" 
                      className="inline-flex h-9 w-9 items-center justify-center rounded-xl bg-blue-50 text-blue-600 hover:bg-blue-100 hover:scale-110 transition-all duration-200 shadow-sm hover:shadow-md"
                    >
                      <FaFacebook className="w-4 h-4" />
                    </a>
                  )}
                  {(config?.socialMedia?.twitter || footerData.socialMedia?.twitter) && (
                    <a 
                      href={config?.socialMedia?.twitter || footerData.socialMedia?.twitter}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label="Twitter" 
                      className="inline-flex h-9 w-9 items-center justify-center rounded-xl bg-sky-50 text-sky-600 hover:bg-sky-100 hover:scale-110 transition-all duration-200 shadow-sm hover:shadow-md"
                    >
                      <FaTwitter className="w-4 h-4" />
                    </a>
                  )}
                  {(config?.socialMedia?.instagram || footerData.socialMedia?.instagram) && (
                    <a 
                      href={config?.socialMedia?.instagram || footerData.socialMedia?.instagram}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label="Instagram" 
                      className="inline-flex h-9 w-9 items-center justify-center rounded-xl bg-pink-50 text-pink-600 hover:bg-pink-100 hover:scale-110 transition-all duration-200 shadow-sm hover:shadow-md"
                    >
                      <FaInstagram className="w-4 h-4" />
                    </a>
                  )}
                  {(config?.socialMedia?.linkedin || footerData.socialMedia?.linkedin) && (
                    <a 
                      href={config?.socialMedia?.linkedin || footerData.socialMedia?.linkedin}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label="LinkedIn" 
                      className="inline-flex h-9 w-9 items-center justify-center rounded-xl bg-blue-50 text-blue-700 hover:bg-blue-100 hover:scale-110 transition-all duration-200 shadow-sm hover:shadow-md"
                    >
                      <FaLinkedin className="w-4 h-4" />
                    </a>
                  )}
                </div>
          </div>

          {/* Quick Links */}
          <div>
                <h4 className="text-base font-semibold mb-4 flex items-center gap-2 text-gray-900">
                  <FaHome className="w-4 h-4 text-blue-600" />
                  Quick Links
                </h4>
                <ul className="space-y-3">
                  <li>
                    <Link 
                      to="/" 
                      className="text-sm text-gray-600 hover:text-blue-600 transition-colors duration-200 hover:underline underline-offset-2 flex items-center gap-2"
                    >
                      <FaHome className="w-3 h-3" />
                      Home
                    </Link>
                  </li>
                  <li>
                    <Link 
                      to="/products" 
                      className="text-sm text-gray-600 hover:text-blue-600 transition-colors duration-200 hover:underline underline-offset-2 flex items-center gap-2"
                    >
                      <FaShoppingBag className="w-3 h-3" />
                      Products
                    </Link>
                  </li>
                  <li>
                    <Link 
                      to="/about" 
                      className="text-sm text-gray-600 hover:text-blue-600 transition-colors duration-200 hover:underline underline-offset-2 flex items-center gap-2"
                    >
                      <FaUser className="w-3 h-3" />
                      About Us
                    </Link>
                  </li>
                  <li>
                      <Link 
                      to="/contact" 
                      className="text-sm text-gray-600 hover:text-blue-600 transition-colors duration-200 hover:underline underline-offset-2 flex items-center gap-2"
                      >
                      <FaEnvelope className="w-3 h-3" />
                      Contact
                      </Link>
                    </li>
                </ul>
          </div>

          {/* Customer Service */}
          <div>
                <h4 className="text-base font-semibold mb-4 flex items-center gap-2 text-gray-900">
                  <FaHeadset className="w-4 h-4 text-purple-600" />
                  Support
                </h4>
                <ul className="space-y-3">
                  <li>
                    <Link 
                      to="/help" 
                      className="text-sm text-gray-600 hover:text-purple-600 transition-colors duration-200 hover:underline underline-offset-2 flex items-center gap-2"
                    >
                      <FaQuestionCircle className="w-3 h-3" />
                      Help Center
                    </Link>
                  </li>
                  <li>
                    <Link 
                      to="/shipping" 
                      className="text-sm text-gray-600 hover:text-purple-600 transition-colors duration-200 hover:underline underline-offset-2 flex items-center gap-2"
                    >
                      <FaTruck className="w-3 h-3" />
                      Shipping Info
                    </Link>
                  </li>
                  <li>
                    <Link 
                      to="/returns" 
                      className="text-sm text-gray-600 hover:text-purple-600 transition-colors duration-200 hover:underline underline-offset-2 flex items-center gap-2"
                    >
                      <FaGift className="w-3 h-3" />
                      Returns
                    </Link>
                  </li>
                  <li>
                    <Link 
                      to="/privacy" 
                      className="text-sm text-gray-600 hover:text-purple-600 transition-colors duration-200 hover:underline underline-offset-2 flex items-center gap-2"
                    >
                      <FaShieldAlt className="w-3 h-3" />
                      Privacy Policy
                    </Link>
                  </li>
            </ul>
          </div>

              {/* Contact Info */}
          <div>
                <h4 className="text-base font-semibold mb-4 flex items-center gap-2 text-gray-900">
                  <FaEnvelope className="w-4 h-4 text-cyan-600" />
                  Contact
                </h4>
                <ul className="space-y-3">
                  <li className="flex items-start gap-3">
                    <FaMapMarkerAlt className="w-4 h-4 mt-0.5 flex-shrink-0 text-cyan-600" />
                    <span className="text-sm text-gray-600 leading-relaxed">
                      {config?.contactAddress || (footerData.address ? `${footerData.address.street}, ${footerData.address.city}, ${footerData.address.state} ${footerData.address.zipCode}, ${footerData.address.country}` : '123 Business St, City, State 12345')}
                    </span>
                  </li>
                  {(config?.contactPhone || footerData.contact?.phone) && (
                    <li className="flex items-center gap-3">
                      <FaPhone className="w-4 h-4 text-cyan-600 flex-shrink-0" />
                      <a 
                        href={`tel:${config?.contactPhone || footerData.contact?.phone}`}
                        className="text-sm text-gray-600 hover:text-cyan-600 transition-colors duration-200"
                      >
                        {config?.contactPhone || footerData.contact?.phone}
                      </a>
                    </li>
                  )}
                  {(config?.contactEmail || footerData.contact?.email) && (
                    <li className="flex items-center gap-3">
                      <FaEnvelope className="w-4 h-4 text-cyan-600 flex-shrink-0" />
                      <a 
                        href={`mailto:${config?.contactEmail || footerData.contact?.email}`}
                        className="text-sm text-gray-600 hover:text-cyan-600 transition-colors duration-200"
                      >
                        {config?.contactEmail || footerData.contact?.email}
                      </a>
                    </li>
                  )}
                  {(config?.businessHours || footerData.businessHours) && (
                    <li className="flex items-center gap-3">
                      <FaClock className="w-4 h-4 text-cyan-600 flex-shrink-0" />
                      <span className="text-sm text-gray-600">
                        {config?.businessHours || footerData.businessHours}
                      </span>
                    </li>
                  )}
            </ul>
              </div>
            </div>
          </div>

          {/* Features Section - Desktop Only */}
          <div className="hidden sm:block py-6 sm:py-8 border-t border-gray-200/50">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
              <div className="flex items-center gap-3 p-4 bg-white/50 rounded-xl border border-gray-200/50 hover:shadow-md transition-all duration-200">
                <div className="w-10 h-10 rounded-xl flex items-center justify-center bg-blue-100">
                  <FaTruck className="w-5 h-5 text-blue-600" />
                </div>
                <div>
                  <p className="text-sm font-semibold text-gray-900">Free Shipping</p>
                  <p className="text-xs text-gray-600">On orders over ₹500</p>
                </div>
              </div>
              
              <div className="flex items-center gap-3 p-4 bg-white/50 rounded-xl border border-gray-200/50 hover:shadow-md transition-all duration-200">
                <div className="w-10 h-10 rounded-xl flex items-center justify-center bg-purple-100">
                  <FaShieldAlt className="w-5 h-5 text-purple-600" />
                </div>
                <div>
                  <p className="text-sm font-semibold text-gray-900">Secure Payment</p>
                  <p className="text-xs text-gray-600">100% secure checkout</p>
                </div>
              </div>
              
              <div className="flex items-center gap-3 p-4 bg-white/50 rounded-xl border border-gray-200/50 hover:shadow-md transition-all duration-200">
                <div className="w-10 h-10 rounded-xl flex items-center justify-center bg-cyan-100">
                  <FaGift className="w-5 h-5 text-cyan-600" />
                </div>
                <div>
                  <p className="text-sm font-semibold text-gray-900">Easy Returns</p>
                  <p className="text-xs text-gray-600">30 day return policy</p>
                </div>
              </div>
              
              <div className="flex items-center gap-3 p-4 bg-white/50 rounded-xl border border-gray-200/50 hover:shadow-md transition-all duration-200">
                <div className="w-10 h-10 rounded-xl flex items-center justify-center bg-green-100">
                  <FaAward className="w-5 h-5 text-green-600" />
                </div>
                <div>
                  <p className="text-sm font-semibold text-gray-900">Premium Quality</p>
                  <p className="text-xs text-gray-600">Handpicked products</p>
                </div>
              </div>
          </div>
        </div>

          {/* Bottom Section */}
          <div className="border-t border-gray-200/50 py-4 sm:py-6 lg:py-8">
            {/* Mobile Layout */}
            <div className="block sm:hidden text-center space-y-3">
              <p className="text-xs text-gray-600">
                © {year} {config?.websiteName || footerData.companyName || 'MUKHTI'}. All rights reserved.
              </p>
              <p className="text-xs text-gray-500 flex items-center justify-center gap-1">
                Made with <FaHeart className="w-3 h-3 text-red-500" /> for our customers
              </p>
              <div className="flex flex-wrap items-center justify-center gap-3 text-xs">
                <Link 
                  to="/terms" 
                  className="text-gray-600 hover:text-blue-600 transition-colors duration-200"
                >
                  Terms
                </Link>
                <span className="text-gray-300">•</span>
                <Link 
                  to="/privacy" 
                  className="text-gray-600 hover:text-blue-600 transition-colors duration-200"
                >
                  Privacy
                </Link>
                <span className="text-gray-300">•</span>
                <Link 
                  to="/cookies" 
                  className="text-gray-600 hover:text-blue-600 transition-colors duration-200"
                >
                  Cookies
                </Link>
              </div>
            </div>

            {/* Desktop Layout */}
            <div className="hidden sm:flex sm:flex-row items-center justify-between gap-4">
              <div className="flex flex-col sm:flex-row items-center gap-2 sm:gap-4">
                <p className="text-sm text-gray-600 text-center sm:text-left">
                  © {year} {config?.websiteName || footerData.companyName || 'MUKHTI'}. All rights reserved.
                </p>
                <p className="text-sm text-gray-500 flex items-center gap-1">
                  Made with <FaHeart className="w-3 h-3 text-red-500" /> for our customers
                </p>
              </div>
              <div className="flex flex-wrap items-center justify-center gap-4 text-sm">
                <Link 
                  to="/terms" 
                  className="text-gray-600 hover:text-blue-600 transition-colors duration-200 hover:underline underline-offset-2"
                >
                  Terms of Service
                </Link>
                <Link 
                  to="/privacy" 
                  className="text-gray-600 hover:text-blue-600 transition-colors duration-200 hover:underline underline-offset-2"
                >
                  Privacy Policy
                </Link>
                <Link 
                  to="/cookies" 
                  className="text-gray-600 hover:text-blue-600 transition-colors duration-200 hover:underline underline-offset-2"
                >
                  Cookie Policy
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Scroll to Top Button */}
      <button
        onClick={scrollToTop}
        className="fixed bottom-6 right-6 z-40 inline-flex h-12 w-12 items-center justify-center rounded-full bg-gradient-to-br from-blue-600 to-purple-600 text-white shadow-lg transition-all duration-200 hover:scale-110 hover:shadow-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20"
        aria-label="Scroll to top"
      >
        <FaArrowUp className="w-5 h-5" />
      </button>
    </footer>
  );
};

export default Footer;
