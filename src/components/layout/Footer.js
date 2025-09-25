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
  FaStar
} from 'react-icons/fa';

const Footer = () => {
  const { footerData } = useFooter();
  const { config, isFeatureEnabled } = useWebsiteConfig();
  const year = new Date().getFullYear();

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="relative bg-gradient-to-br from-emerald-900 via-teal-800 to-cyan-900 text-white">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute inset-0" style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.1'%3E%3Ccircle cx='30' cy='30' r='2'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`
        }}></div>
      </div>

      <div className="relative">
              <div className="mx-auto max-w-7xl px-3 sm:px-4 lg:px-6">
          {/* Main Footer Content */}
          <div className="py-6 sm:py-8 lg:py-12">
            <div className="grid grid-cols-1 gap-6 sm:gap-8 lg:grid-cols-2 xl:grid-cols-4">
              
              {/* Brand Section */}
              <div className="lg:col-span-1 xl:col-span-1">
                <div className="flex items-center gap-2 sm:gap-3 mb-3 sm:mb-4">
                  <div className="grid h-7 w-7 sm:h-8 sm:w-8 lg:h-9 lg:w-9 place-items-center rounded-lg sm:rounded-xl bg-white text-emerald-700 font-extrabold shadow-sm">
                    <FaStore className="w-3 h-3 sm:w-4 sm:h-4" />
                  </div>
                  <span className="text-sm sm:text-base lg:text-lg font-bold tracking-tight text-white">
                    {config?.websiteName || footerData.companyName || 'E-Shop'}
                  </span>
                </div>
                <p className="text-xs sm:text-sm text-emerald-100 leading-relaxed mb-4 sm:mb-6 max-w-xs">
                  {config?.websiteDescription || footerData.companyDescription || 'Your premium online shopping destination'}
                </p>
                
                {/* Social Media */}
                <div className="flex items-center gap-2 sm:gap-3">
                  {(config?.socialMedia?.facebook || footerData.socialMedia?.facebook) && (
                    <a 
                      href={config?.socialMedia?.facebook || footerData.socialMedia?.facebook}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label="Facebook" 
                      className="inline-flex h-7 w-7 sm:h-8 sm:w-8 items-center justify-center rounded-lg sm:rounded-xl bg-white/10 backdrop-blur-sm text-emerald-100 hover:bg-white/20 hover:text-white transition-all duration-200 hover:scale-105"
                    >
                      <FaFacebook className="w-3 h-3 sm:w-4 sm:h-4" />
                    </a>
                  )}
                  {(config?.socialMedia?.twitter || footerData.socialMedia?.twitter) && (
                    <a 
                      href={config?.socialMedia?.twitter || footerData.socialMedia?.twitter}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label="Twitter" 
                      className="inline-flex h-7 w-7 sm:h-8 sm:w-8 items-center justify-center rounded-lg sm:rounded-xl bg-white/10 backdrop-blur-sm text-emerald-100 hover:bg-white/20 hover:text-white transition-all duration-200 hover:scale-105"
                    >
                      <FaTwitter className="w-3 h-3 sm:w-4 sm:h-4" />
                    </a>
                  )}
                  {(config?.socialMedia?.instagram || footerData.socialMedia?.instagram) && (
                    <a 
                      href={config?.socialMedia?.instagram || footerData.socialMedia?.instagram}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label="Instagram" 
                      className="inline-flex h-7 w-7 sm:h-8 sm:w-8 items-center justify-center rounded-lg sm:rounded-xl bg-white/10 backdrop-blur-sm text-emerald-100 hover:bg-white/20 hover:text-white transition-all duration-200 hover:scale-105"
                    >
                      <FaInstagram className="w-3 h-3 sm:w-4 sm:h-4" />
                    </a>
                  )}
                  {(config?.socialMedia?.linkedin || footerData.socialMedia?.linkedin) && (
                    <a 
                      href={config?.socialMedia?.linkedin || footerData.socialMedia?.linkedin}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label="LinkedIn" 
                      className="inline-flex h-7 w-7 sm:h-8 sm:w-8 items-center justify-center rounded-lg sm:rounded-xl bg-white/10 backdrop-blur-sm text-emerald-100 hover:bg-white/20 hover:text-white transition-all duration-200 hover:scale-105"
                    >
                      <FaLinkedin className="w-3 h-3 sm:w-4 sm:h-4" />
                    </a>
                  )}
                </div>
          </div>

          {/* Quick Links */}
          <div>
                <h4 className="text-xs sm:text-sm font-semibold text-white mb-3 sm:mb-4 flex items-center gap-2">
                  <FaStar className="w-3 h-3 sm:w-4 sm:h-4 text-emerald-300" />
                  Quick Links
                </h4>
                <ul className="space-y-2 sm:space-y-3">
                  {footerData.quickLinks.map((link, index) => (
                    <li key={index}>
                      <Link 
                        to={link.url} 
                        className="text-xs sm:text-sm text-emerald-100 hover:text-white transition-colors duration-200 hover:underline underline-offset-2"
                      >
                        {link.title}
                      </Link>
                    </li>
                  ))}
                </ul>
          </div>

          {/* Customer Service */}
          <div>
                <h4 className="text-xs sm:text-sm font-semibold text-white mb-3 sm:mb-4 flex items-center gap-2">
                  <FaHeadset className="w-3 h-3 sm:w-4 sm:h-4 text-emerald-300" />
                  Customer Service
                </h4>
                <ul className="space-y-2 sm:space-y-3">
                  <li>
                    <Link 
                      to="/help" 
                      className="text-xs sm:text-sm text-emerald-100 hover:text-white transition-colors duration-200 hover:underline underline-offset-2"
                    >
                      Help Center
                    </Link>
                  </li>
                  <li>
                    <Link 
                      to="/shipping" 
                      className="text-xs sm:text-sm text-emerald-100 hover:text-white transition-colors duration-200 hover:underline underline-offset-2"
                    >
                      Shipping Info
                    </Link>
                  </li>
                  <li>
                    <Link 
                      to="/returns" 
                      className="text-xs sm:text-sm text-emerald-100 hover:text-white transition-colors duration-200 hover:underline underline-offset-2"
                    >
                      Returns & Exchanges
                    </Link>
                  </li>
                  <li>
                    <Link 
                      to="/privacy" 
                      className="text-xs sm:text-sm text-emerald-100 hover:text-white transition-colors duration-200 hover:underline underline-offset-2"
                    >
                      Privacy Policy
                    </Link>
                  </li>
            </ul>
          </div>

              {/* Contact Info */}
          <div>
                <h4 className="text-xs sm:text-sm font-semibold text-white mb-3 sm:mb-4 flex items-center gap-2">
                  <FaEnvelope className="w-3 h-3 sm:w-4 sm:h-4 text-emerald-300" />
                  Contact Info
                </h4>
                <ul className="space-y-2 sm:space-y-3">
                  <li className="flex items-start gap-2 sm:gap-3">
                    <FaMapMarkerAlt className="w-3 h-3 sm:w-4 sm:h-4 text-emerald-300 mt-0.5 flex-shrink-0" />
                    <span className="text-xs sm:text-sm text-emerald-100">
                      {config?.contactAddress || (footerData.address ? `${footerData.address.street}, ${footerData.address.city}, ${footerData.address.state} ${footerData.address.zipCode}, ${footerData.address.country}` : '')}
                    </span>
                  </li>
                  {(config?.contactPhone || footerData.contact?.phone) && (
                    <li className="flex items-center gap-2 sm:gap-3">
                      <FaPhone className="w-3 h-3 sm:w-4 sm:h-4 text-emerald-300 flex-shrink-0" />
                      <a 
                        href={`tel:${config?.contactPhone || footerData.contact?.phone}`}
                        className="text-xs sm:text-sm text-emerald-100 hover:text-white transition-colors duration-200"
                      >
                        {config?.contactPhone || footerData.contact?.phone}
                      </a>
                    </li>
                  )}
                  {(config?.contactEmail || footerData.contact?.email) && (
                    <li className="flex items-center gap-2 sm:gap-3">
                      <FaEnvelope className="w-3 h-3 sm:w-4 sm:h-4 text-emerald-300 flex-shrink-0" />
                      <a 
                        href={`mailto:${config?.contactEmail || footerData.contact?.email}`}
                        className="text-xs sm:text-sm text-emerald-100 hover:text-white transition-colors duration-200"
                      >
                        {config?.contactEmail || footerData.contact?.email}
                      </a>
                    </li>
                  )}
            </ul>
              </div>
            </div>
          </div>

          {/* Features Section */}
          <div className="border-t border-emerald-700/30 py-4 sm:py-6">
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
              <div className="flex items-center gap-2 sm:gap-3">
                <div className="w-6 h-6 sm:w-8 sm:h-8 bg-emerald-500/20 rounded-lg sm:rounded-xl flex items-center justify-center">
                  <FaTruck className="w-3 h-3 sm:w-4 sm:h-4 text-emerald-300" />
                </div>
                <div>
                  <p className="text-xs sm:text-sm font-semibold text-white">Free Shipping</p>
                  <p className="text-xs text-emerald-200">On orders over $50</p>
                </div>
              </div>
              
              <div className="flex items-center gap-2 sm:gap-3">
                <div className="w-6 h-6 sm:w-8 sm:h-8 bg-emerald-500/20 rounded-lg sm:rounded-xl flex items-center justify-center">
                  <FaShieldAlt className="w-3 h-3 sm:w-4 sm:h-4 text-emerald-300" />
                </div>
                <div>
                  <p className="text-xs sm:text-sm font-semibold text-white">Secure Payment</p>
                  <p className="text-xs text-emerald-200">100% secure checkout</p>
                </div>
              </div>
              
              <div className="flex items-center gap-2 sm:gap-3">
                <div className="w-6 h-6 sm:w-8 sm:h-8 bg-emerald-500/20 rounded-lg sm:rounded-xl flex items-center justify-center">
                  <FaGift className="w-3 h-3 sm:w-4 sm:h-4 text-emerald-300" />
                </div>
                <div>
                  <p className="text-xs sm:text-sm font-semibold text-white">Easy Returns</p>
                  <p className="text-xs text-emerald-200">30 day return policy</p>
                </div>
              </div>
              
              <div className="flex items-center gap-2 sm:gap-3">
                <div className="w-6 h-6 sm:w-8 sm:h-8 bg-emerald-500/20 rounded-lg sm:rounded-xl flex items-center justify-center">
                  <FaCreditCard className="w-3 h-3 sm:w-4 sm:h-4 text-emerald-300" />
                </div>
                <div>
                  <p className="text-xs sm:text-sm font-semibold text-white">Multiple Payment</p>
                  <p className="text-xs text-emerald-200">Credit card, PayPal</p>
                </div>
              </div>
          </div>
        </div>

          {/* Bottom Section */}
          <div className="border-t border-emerald-700/30 py-4 sm:py-6">
            <div className="flex flex-col sm:flex-row items-center justify-between gap-3 sm:gap-4">
              <p className="text-xs sm:text-sm text-emerald-200 text-center sm:text-left">
                {footerData.copyrightText.replace('{year}', year)} Made with{' '}
                <FaHeart className="inline w-3 h-3 sm:w-4 sm:h-4 text-red-400" />{' '}
                for our customers.
              </p>
              <div className="flex flex-wrap items-center justify-center gap-3 sm:gap-4 text-xs sm:text-sm">
                <Link 
                  to="/terms" 
                  className="text-emerald-200 hover:text-white transition-colors duration-200 hover:underline underline-offset-2"
                >
                  Terms of Service
                </Link>
                <Link 
                  to="/privacy" 
                  className="text-emerald-200 hover:text-white transition-colors duration-200 hover:underline underline-offset-2"
                >
                  Privacy Policy
                </Link>
                <Link 
                  to="/cookies" 
                  className="text-emerald-200 hover:text-white transition-colors duration-200 hover:underline underline-offset-2"
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
        className="fixed bottom-4 right-4 z-40 inline-flex h-10 w-10 sm:h-12 sm:w-12 items-center justify-center rounded-full bg-gradient-to-r from-emerald-500 to-teal-500 text-white shadow-lg hover:from-emerald-600 hover:to-teal-600 transition-all duration-200 hover:scale-110 hover:shadow-xl"
        aria-label="Scroll to top"
      >
        <FaArrowUp className="w-4 h-4 sm:w-5 sm:h-5" />
      </button>
    </footer>
  );
};

export default Footer;
