import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from '../config/axios';
import { 
  FaArrowRight,
  FaGift,
  FaTruck,
  FaShieldAlt,
  FaCreditCard,
  FaFire,
  FaPlay,
  FaStar,
  FaEye,
  FaStore,
  FaHeart,
  FaGem,
  FaAward,
  FaUsers,
  FaShoppingBag,
  FaInfoCircle,
  FaQuoteLeft,
  FaCheckCircle,
  FaLeaf,
  FaBox
} from 'react-icons/fa';
import ProductCard from '../components/products/ProductCard';
import Footer from '../components/layout/Footer';
import ModernCarousel from '../components/ModernCarousel';
import ScrollAnimation from '../components/ScrollAnimation';
import DynamicHomeSection from '../components/DynamicHomeSection';
import { useHomePageSettings } from '../context/HomePageSettingsContext';

const Home = () => {
  const [newArrivals, setNewArrivals] = useState([]);
  const [featuredProducts, setFeaturedProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const { getSortedSections, loading: settingsLoading } = useHomePageSettings();

  // Dynamic section renderer based on admin settings
  const renderSection = (sectionId) => {
    switch (sectionId) {
      case 'carousel':
        return (
          <DynamicHomeSection sectionId="carousel">
            <ModernCarousel />
          </DynamicHomeSection>
        );
      
      case 'newArrivals':
        return (
          <DynamicHomeSection sectionId="newArrivals">
            <section className="pt-4 pb-12 relative overflow-hidden z-10">
              {/* Unique Background Pattern */}
              <div className="absolute inset-0 opacity-5">
                <div className="absolute top-10 left-10 w-20 h-20 bg-blue-500 rounded-full animate-pulse"></div>
                <div className="absolute top-32 right-20 w-16 h-16 bg-purple-500 rounded-full animate-pulse animation-delay-1000"></div>
                <div className="absolute bottom-20 left-1/4 w-12 h-12 bg-green-500 rounded-full animate-pulse animation-delay-2000"></div>
                <div className="absolute bottom-32 right-1/3 w-8 h-8 bg-pink-500 rounded-full animate-pulse animation-delay-3000"></div>
              </div>
              
              <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                <ScrollAnimation direction="up" delay={0}>
                  <div className="text-center mb-8 sm:mb-12">
                    <div className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-blue-100 to-purple-100 rounded-full mb-4">
                      <div className="w-2 h-2 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full animate-pulse"></div>
                      <span className="text-sm font-semibold text-gray-700">New Arrivals</span>
                    </div>
                    <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
                      Discover Our Latest
                      <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent"> Products</span>
                    </h2>
                    <p className="text-gray-600 max-w-2xl mx-auto text-sm sm:text-base">
                      Fresh arrivals just for you. Explore our newest collection and be the first to experience the latest trends.
                    </p>
                  </div>
                </ScrollAnimation>

                {loading ? (
                  <div className="flex justify-center py-12">
                    <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
                  </div>
                ) : newArrivals.length > 0 ? (
                  <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 sm:gap-6">
                    {newArrivals.slice(0, 10).map((product) => (
                      <ProductCard key={product._id} product={product} />
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-12">
                    <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                      <FaBox className="w-8 h-8 text-gray-400" />
                    </div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">No New Products Yet</h3>
                    <p className="text-gray-600 mb-6">Check back soon for exciting new arrivals!</p>
                    <Link
                      to="/products"
                      className="inline-flex items-center justify-between gap-2 px-6 py-3 bg-gradient-to-r from-gray-700 via-gray-800 to-black hover:from-gray-800 hover:via-gray-900 hover:to-gray-800 text-white font-semibold rounded-2xl transition-all duration-300 transform hover:scale-105"
                    >
                      <span>Browse All Products</span>
                      <div className="w-5 h-5 bg-white rounded-full flex items-center justify-center">
                        <svg className="w-2.5 h-2.5 text-black" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                        </svg>
                      </div>
                    </Link>
                  </div>
                )}

                {newArrivals.length > 0 && (
                  <div className="text-center mt-8 sm:mt-12">
                    <Link
                      to="/products"
                      className="inline-flex items-center justify-between gap-2 px-6 py-3 bg-gradient-to-r from-gray-700 via-gray-800 to-black hover:from-gray-800 hover:via-gray-900 hover:to-gray-800 text-white font-semibold rounded-2xl transition-all duration-300 transform hover:scale-105"
                    >
                      <span>Browse All Products</span>
                      <div className="w-5 h-5 bg-white rounded-full flex items-center justify-center">
                        <svg className="w-2.5 h-2.5 text-black" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                        </svg>
                      </div>
                    </Link>
                  </div>
                )}
              </div>
            </section>
          </DynamicHomeSection>
        );

      case 'featuredProducts':
        return (
          <DynamicHomeSection sectionId="featuredProducts">
            <section className="pt-0 pb-12 relative overflow-hidden z-10">
              {/* Unique Background Pattern */}
              <div className="absolute inset-0 opacity-5">
                <div className="absolute top-10 left-10 w-16 h-16 bg-purple-500 rounded-full animate-pulse"></div>
                <div className="absolute top-32 right-20 w-20 h-20 bg-pink-500 rounded-full animate-pulse animation-delay-1000"></div>
                <div className="absolute bottom-20 left-1/4 w-12 h-12 bg-blue-500 rounded-full animate-pulse animation-delay-2000"></div>
                <div className="absolute bottom-32 right-1/3 w-14 h-14 bg-green-500 rounded-full animate-pulse animation-delay-3000"></div>
              </div>
              
              <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                <ScrollAnimation direction="up" delay={0}>
                  <div className="text-center mb-8 sm:mb-12">
                    <div className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-purple-100 to-pink-100 rounded-full mb-4">
                      <div className="w-2 h-2 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full animate-pulse"></div>
                      <span className="text-sm font-semibold text-gray-700">Featured Products</span>
                    </div>
                    <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
                      Handpicked
                      <span className="bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent"> Favorites</span>
                    </h2>
                    <p className="text-gray-600 max-w-2xl mx-auto text-sm sm:text-base">
                      Our team's carefully selected products that we absolutely love. Quality guaranteed, style assured.
                    </p>
                  </div>
                </ScrollAnimation>

                {loading ? (
                  <div className="flex justify-center py-12">
                    <div className="w-8 h-8 border-4 border-purple-600 border-t-transparent rounded-full animate-spin"></div>
                  </div>
                ) : featuredProducts.length > 0 ? (
                  <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 sm:gap-6">
                    {featuredProducts.slice(0, 8).map((product) => (
                      <ProductCard key={product._id} product={product} />
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-12">
                    <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                      <FaStar className="w-8 h-8 text-gray-400" />
                    </div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">No Featured Products</h3>
                    <p className="text-gray-600 mb-6">We're working on curating amazing products for you!</p>
                    <Link
                      to="/products"
                      className="inline-flex items-center justify-between gap-2 px-6 py-3 bg-gradient-to-r from-gray-700 via-gray-800 to-black hover:from-gray-800 hover:via-gray-900 hover:to-gray-800 text-white font-semibold rounded-2xl transition-all duration-300 transform hover:scale-105"
                    >
                      <span>Browse All Products</span>
                      <div className="w-5 h-5 bg-white rounded-full flex items-center justify-center">
                        <svg className="w-2.5 h-2.5 text-black" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                        </svg>
                      </div>
                    </Link>
                  </div>
                )}

                {featuredProducts.length > 0 && (
                  <div className="text-center mt-8 sm:mt-12">
                    <Link
                      to="/products"
                      className="inline-flex items-center justify-between gap-2 px-6 py-3 bg-gradient-to-r from-gray-700 via-gray-800 to-black hover:from-gray-800 hover:via-gray-900 hover:to-gray-800 text-white font-semibold rounded-2xl transition-all duration-300 transform hover:scale-105"
                    >
                      <span>Browse All Products</span>
                      <div className="w-5 h-5 bg-white rounded-full flex items-center justify-center">
                        <svg className="w-2.5 h-2.5 text-black" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                        </svg>
                      </div>
                    </Link>
                  </div>
                )}
              </div>
            </section>
          </DynamicHomeSection>
        );

      case 'banner':
        return (
          <DynamicHomeSection sectionId="banner">
            <section className="py-8 sm:py-12 lg:py-16 relative overflow-hidden z-10">
              <ScrollAnimation direction="up" delay={0}>
                <div className="w-full">
                  <div className="relative overflow-hidden rounded-none sm:rounded-2xl lg:rounded-3xl mx-0 sm:mx-4 lg:mx-8">
                    {/* Background Image */}
                    <div
                      className="absolute inset-0 bg-cover bg-center bg-no-repeat"
                      style={{
                        backgroundImage: `url('https://images.unsplash.com/photo-1441986300917-64674bd600d8?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80')`
                      }}
                    >
                      {/* Enhanced Overlay */}
                      <div className="absolute inset-0 bg-gradient-to-br from-blue-900/90 via-purple-900/85 to-gray-900/90"></div>

                      {/* Dynamic Background Elements */}
                      <div className="absolute inset-0 overflow-hidden">
                        <div className="absolute top-8 left-8 w-24 h-24 bg-white/10 rounded-full blur-2xl animate-pulse"></div>
                        <div className="absolute top-16 right-16 w-32 h-32 bg-blue-400/20 rounded-full blur-3xl animate-pulse animation-delay-1000"></div>
                        <div className="absolute bottom-12 left-1/4 w-20 h-20 bg-purple-400/15 rounded-full blur-xl animate-pulse animation-delay-2000"></div>
                        <div className="absolute bottom-8 right-1/3 w-28 h-28 bg-white/8 rounded-full blur-2xl animate-pulse animation-delay-3000"></div>
                        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-40 h-40 bg-white/5 rounded-full blur-3xl animate-pulse animation-delay-1500"></div>
                      </div>
                    </div>

                    {/* Content */}
                    <div className="relative z-10 px-6 py-16 sm:px-8 sm:py-20 lg:px-12 lg:py-24">
                      <div className="max-w-7xl mx-auto">
                        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
                          {/* Left Content */}
                          <div className="lg:col-span-7 text-center lg:text-left">
                            <div className="space-y-6 sm:space-y-8">
                              {/* Enhanced Badge */}
                              <div className="inline-flex items-center gap-3 px-5 py-2.5 bg-gradient-to-r from-white/20 to-white/10 backdrop-blur-md border border-white/30 rounded-full shadow-lg">
                                <div className="w-2.5 h-2.5 bg-gradient-to-r from-blue-400 to-purple-400 rounded-full animate-pulse"></div>
                                <span className="text-sm font-semibold text-white">✨ Premium Collection</span>
                              </div>

                              {/* Main Heading */}
                              <div className="space-y-4">
                                <h2 className="text-2xl sm:text-3xl lg:text-4xl xl:text-5xl font-bold text-white leading-tight">
                                  Discover Amazing
                                  <br />
                                  <span className="bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
                                    Premium Products
                                  </span>
                                </h2>
                                <p className="text-lg sm:text-xl text-white/90 leading-relaxed max-w-2xl">
                                  Experience luxury shopping with our curated collection of high-quality products,
                                  exceptional service, and unbeatable value.
                                </p>
                              </div>

                              {/* Enhanced Features */}
                              <div className="flex flex-wrap justify-center lg:justify-start gap-3 sm:gap-4">
                                <div className="flex items-center gap-2.5 bg-white/15 backdrop-blur-sm px-4 py-2.5 rounded-full border border-white/25 shadow-md hover:bg-white/20 transition-all duration-300">
                                  <div className="w-6 h-6 bg-gradient-to-br from-green-400 to-emerald-500 rounded-lg flex items-center justify-center">
                                    <FaTruck className="w-3 h-3 text-white" />
                                  </div>
                                  <span className="text-white font-medium text-sm">Free Shipping</span>
                                </div>
                                <div className="flex items-center gap-2.5 bg-white/15 backdrop-blur-sm px-4 py-2.5 rounded-full border border-white/25 shadow-md hover:bg-white/20 transition-all duration-300">
                                  <div className="w-6 h-6 bg-gradient-to-br from-blue-400 to-cyan-500 rounded-lg flex items-center justify-center">
                                    <FaShieldAlt className="w-3 h-3 text-white" />
                                  </div>
                                  <span className="text-white font-medium text-sm">Secure Payment</span>
                                </div>
                                <div className="flex items-center gap-2.5 bg-white/15 backdrop-blur-sm px-4 py-2.5 rounded-full border border-white/25 shadow-md hover:bg-white/20 transition-all duration-300">
                                  <div className="w-6 h-6 bg-gradient-to-br from-purple-400 to-pink-500 rounded-lg flex items-center justify-center">
                                    <FaStar className="w-3 h-3 text-white" />
                                  </div>
                                  <span className="text-white font-medium text-sm">Top Rated</span>
                                </div>
                              </div>

                              {/* Trust Indicators */}
                              <div className="flex items-center justify-center lg:justify-start gap-8 pt-4">
                                <div className="text-center">
                                  <div className="text-2xl sm:text-3xl font-bold text-white">10K+</div>
                                  <div className="text-sm text-white/70">Happy Customers</div>
                                </div>
                                <div className="text-center">
                                  <div className="text-2xl sm:text-3xl font-bold text-white">500+</div>
                                  <div className="text-sm text-white/70">Products</div>
                                </div>
                                <div className="text-center">
                                  <div className="text-2xl sm:text-3xl font-bold text-white">99%</div>
                                  <div className="text-sm text-white/70">Satisfaction</div>
                                </div>
                              </div>
                            </div>
                          </div>

                          {/* Right CTA Section */}
                          <div className="lg:col-span-5 flex flex-col gap-4 sm:gap-6">
                            {/* Main CTA */}
                            <Link
                              to="/products"
                              className="group relative inline-flex items-center justify-center gap-3 px-8 py-4 bg-gradient-to-r from-white to-gray-100 text-gray-900 font-bold rounded-2xl hover:from-gray-100 hover:to-white transition-all duration-300 transform hover:scale-105 shadow-xl hover:shadow-2xl overflow-hidden"
                            >
                              <div className="absolute inset-0 bg-gradient-to-r from-blue-600/10 to-purple-600/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                              <FaShoppingBag className="w-5 h-5 relative z-10" />
                              <span className="relative z-10">Shop Now</span>
                              <FaArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform duration-300 relative z-10" />
                            </Link>

                            {/* Secondary CTA */}
                            <Link
                              to="/products?featured=true"
                              className="group inline-flex items-center justify-center gap-3 px-8 py-4 bg-white/10 backdrop-blur-md text-white font-bold rounded-2xl border-2 border-white/30 hover:bg-white/20 hover:border-white/50 transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl"
                            >
                              <FaEye className="w-5 h-5" />
                              <span>Explore Collection</span>
                            </Link>

                            {/* Special Offer Badge */}
                            <div className="text-center lg:text-left">
                              <div className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-yellow-500/20 to-orange-500/20 backdrop-blur-sm border border-yellow-400/30 rounded-full">
                                <FaGift className="w-4 h-4 text-yellow-300" />
                                <span className="text-sm font-medium text-yellow-100">Free gift with orders over $100</span>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Enhanced Decorative Elements */}
                    <div className="absolute top-4 right-6 w-3 h-3 bg-white/40 rounded-full animate-bounce"></div>
                    <div className="absolute top-8 right-12 w-2 h-2 bg-blue-400/60 rounded-full animate-bounce animation-delay-500"></div>
                    <div className="absolute bottom-4 left-6 w-4 h-4 bg-purple-400/40 rounded-full animate-bounce animation-delay-1000"></div>
                    <div className="absolute bottom-8 left-12 w-2.5 h-2.5 bg-white/30 rounded-full animate-bounce animation-delay-1500"></div>
                  </div>
                </div>
              </ScrollAnimation>
            </section>
          </DynamicHomeSection>
        );

      case 'features':
        return (
          <DynamicHomeSection sectionId="features">
            <section className="py-6 sm:py-8 relative overflow-hidden z-10">
              {/* Animated Background Elements */}
              <div className="absolute inset-0">
                <div className="absolute top-10 left-10 w-24 h-24 bg-blue-500/10 rounded-full animate-pulse"></div>
                <div className="absolute top-20 right-20 w-16 h-16 bg-purple-500/10 rounded-full animate-pulse animation-delay-1000"></div>
                <div className="absolute bottom-10 left-1/4 w-20 h-20 bg-pink-500/10 rounded-full animate-pulse animation-delay-2000"></div>
                <div className="absolute bottom-20 right-1/3 w-12 h-12 bg-green-500/10 rounded-full animate-pulse animation-delay-3000"></div>
              </div>

              <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                <ScrollAnimation direction="up" delay={0}>
                  <div className="text-center mb-8 sm:mb-12">
                    <div className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-green-100 to-blue-100 rounded-full mb-4">
                      <div className="w-2 h-2 bg-gradient-to-r from-green-500 to-blue-500 rounded-full animate-pulse"></div>
                      <span className="text-sm font-semibold text-gray-700">Why Choose Us</span>
                    </div>
                    <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
                      What Makes Us
                      <span className="bg-gradient-to-r from-green-600 to-blue-600 bg-clip-text text-transparent"> Special</span>
                    </h2>
                    <p className="text-gray-600 max-w-2xl mx-auto text-sm sm:text-base">
                      We're committed to providing you with the best shopping experience possible.
                    </p>
                  </div>
                </ScrollAnimation>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
                  <ScrollAnimation direction="up" delay={100}>
                    <div className="bg-white rounded-xl sm:rounded-2xl p-4 sm:p-5 text-center border border-gray-200 hover:bg-gray-50 transition-all duration-500 transform hover:-translate-y-1 hover:scale-105 mobile-touch-feedback shadow-sm hover:shadow-md">
                      <div className="w-12 h-12 sm:w-16 sm:h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center mx-auto mb-4 sm:mb-6">
                        <FaTruck className="w-6 h-6 sm:w-8 sm:h-8 text-white" />
                      </div>
                      <h3 className="text-lg sm:text-xl font-bold text-gray-900 mb-2 sm:mb-3">Free Shipping</h3>
                      <p className="text-gray-600 text-sm sm:text-base leading-relaxed">
                        Free shipping on all orders over $50. Fast and reliable delivery to your doorstep.
                      </p>
                    </div>
                  </ScrollAnimation>

                  <ScrollAnimation direction="up" delay={200}>
                    <div className="bg-white rounded-xl sm:rounded-2xl p-4 sm:p-5 text-center border border-gray-200 hover:bg-gray-50 transition-all duration-500 transform hover:-translate-y-1 hover:scale-105 mobile-touch-feedback shadow-sm hover:shadow-md">
                      <div className="w-12 h-12 sm:w-16 sm:h-16 bg-gradient-to-br from-green-500 to-emerald-600 rounded-xl flex items-center justify-center mx-auto mb-4 sm:mb-6">
                        <FaShieldAlt className="w-6 h-6 sm:w-8 sm:h-8 text-white" />
                      </div>
                      <h3 className="text-lg sm:text-xl font-bold text-gray-900 mb-2 sm:mb-3">Secure Payment</h3>
                      <p className="text-gray-600 text-sm sm:text-base leading-relaxed">
                        Your payment information is safe and secure with our encrypted checkout process.
                      </p>
                    </div>
                  </ScrollAnimation>

                  <ScrollAnimation direction="up" delay={300}>
                    <div className="bg-white rounded-xl sm:rounded-2xl p-4 sm:p-5 text-center border border-gray-200 hover:bg-gray-50 transition-all duration-500 transform hover:-translate-y-1 hover:scale-105 mobile-touch-feedback shadow-sm hover:shadow-md">
                      <div className="w-12 h-12 sm:w-16 sm:h-16 bg-gradient-to-br from-purple-500 to-pink-600 rounded-xl flex items-center justify-center mx-auto mb-4 sm:mb-6">
                        <FaUsers className="w-6 h-6 sm:w-8 sm:h-8 text-white" />
                      </div>
                      <h3 className="text-lg sm:text-xl font-bold text-gray-900 mb-2 sm:mb-3">24/7 Support</h3>
                      <p className="text-gray-600 text-sm sm:text-base leading-relaxed">
                        Our customer support team is here to help you anytime, anywhere.
                      </p>
                    </div>
                  </ScrollAnimation>
                </div>
              </div>
            </section>
          </DynamicHomeSection>
        );

      case 'stats':
        return (
          <DynamicHomeSection sectionId="stats">
            <section className="py-8 sm:py-10 relative overflow-hidden z-10">
              {/* Animated Background Elements */}
              <div className="absolute inset-0">
                <div className="absolute top-10 left-10 w-24 h-24 bg-blue-500/10 rounded-full animate-pulse"></div>
                <div className="absolute top-20 right-20 w-16 h-16 bg-purple-500/10 rounded-full animate-pulse animation-delay-1000"></div>
                <div className="absolute bottom-10 left-1/4 w-20 h-20 bg-pink-500/10 rounded-full animate-pulse animation-delay-2000"></div>
                <div className="absolute bottom-20 right-1/3 w-12 h-12 bg-green-500/10 rounded-full animate-pulse animation-delay-3000"></div>
              </div>

              <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                <ScrollAnimation direction="up" delay={0}>
                  <div className="text-center mb-8 sm:mb-12">
                    <div className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-blue-100 to-purple-100 rounded-full mb-4">
                      <div className="w-2 h-2 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full animate-pulse"></div>
                      <span className="text-sm font-semibold text-gray-700">Our Impact</span>
                    </div>
                    <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
                      Trusted by
                      <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent"> Thousands</span>
                    </h2>
                    <p className="text-gray-600 max-w-2xl mx-auto text-sm sm:text-base">
                      Join thousands of satisfied customers who trust us with their shopping needs.
                    </p>
                  </div>
                </ScrollAnimation>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 sm:gap-6 lg:gap-8">
                  <ScrollAnimation direction="up" delay={100}>
                    <div className="bg-white rounded-xl sm:rounded-2xl p-4 sm:p-5 text-center border border-gray-200 hover:bg-gray-50 transition-all duration-500 transform hover:-translate-y-1 hover:scale-105 mobile-touch-feedback shadow-sm hover:shadow-md">
                      <div className="text-2xl sm:text-3xl lg:text-4xl font-bold text-blue-600 mb-2">10K+</div>
                      <div className="text-gray-600 font-semibold text-xs sm:text-sm">Happy Customers</div>
                    </div>
                  </ScrollAnimation>

                  <ScrollAnimation direction="up" delay={200}>
                    <div className="bg-white rounded-xl sm:rounded-2xl p-4 sm:p-5 text-center border border-gray-200 hover:bg-gray-50 transition-all duration-500 transform hover:-translate-y-1 hover:scale-105 mobile-touch-feedback shadow-sm hover:shadow-md">
                      <div className="text-2xl sm:text-3xl lg:text-4xl font-bold text-green-600 mb-2">500+</div>
                      <div className="text-gray-600 font-semibold text-xs sm:text-sm">Products</div>
                    </div>
                  </ScrollAnimation>

                  <ScrollAnimation direction="up" delay={300}>
                    <div className="bg-white rounded-xl sm:rounded-2xl p-4 sm:p-5 text-center border border-gray-200 hover:bg-gray-50 transition-all duration-500 transform hover:-translate-y-1 hover:scale-105 mobile-touch-feedback shadow-sm hover:shadow-md">
                      <div className="text-2xl sm:text-3xl lg:text-4xl font-bold text-purple-600 mb-2">50+</div>
                      <div className="text-gray-600 font-semibold text-xs sm:text-sm">Countries</div>
                    </div>
                  </ScrollAnimation>

                  <ScrollAnimation direction="up" delay={400}>
                    <div className="bg-white rounded-xl sm:rounded-2xl p-4 sm:p-5 text-center border border-gray-200 hover:bg-gray-50 transition-all duration-500 transform hover:-translate-y-1 hover:scale-105 mobile-touch-feedback shadow-sm hover:shadow-md">
                      <div className="text-2xl sm:text-3xl lg:text-4xl font-bold text-pink-600 mb-2">99%</div>
                      <div className="text-gray-600 font-semibold text-xs sm:text-sm">Satisfaction</div>
                    </div>
                  </ScrollAnimation>
                </div>
              </div>
            </section>
          </DynamicHomeSection>
        );

      case 'testimonials':
        return (
          <DynamicHomeSection sectionId="testimonials">
            <section className="py-10 sm:py-12 relative overflow-hidden z-10">
              {/* Animated Background Elements */}
              <div className="absolute inset-0">
                <div className="absolute top-10 left-10 w-24 h-24 bg-blue-500/10 rounded-full animate-pulse"></div>
                <div className="absolute top-20 right-20 w-16 h-16 bg-purple-500/10 rounded-full animate-pulse animation-delay-1000"></div>
                <div className="absolute bottom-10 left-1/4 w-20 h-20 bg-pink-500/10 rounded-full animate-pulse animation-delay-2000"></div>
                <div className="absolute bottom-20 right-1/3 w-12 h-12 bg-green-500/10 rounded-full animate-pulse animation-delay-3000"></div>
              </div>

              <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                <ScrollAnimation direction="up" delay={0}>
                  <div className="text-center mb-8 sm:mb-12">
                    <div className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-yellow-100 to-orange-100 rounded-full mb-4">
                      <div className="w-2 h-2 bg-gradient-to-r from-yellow-500 to-orange-500 rounded-full animate-pulse"></div>
                      <span className="text-sm font-semibold text-gray-700">Customer Reviews</span>
                    </div>
                    <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
                      What Our
                      <span className="bg-gradient-to-r from-yellow-600 to-orange-600 bg-clip-text text-transparent"> Customers Say</span>
                    </h2>
                    <p className="text-gray-600 max-w-2xl mx-auto text-sm sm:text-base">
                      Don't just take our word for it. Here's what our customers have to say about us.
                    </p>
                  </div>
                </ScrollAnimation>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
                  <ScrollAnimation direction="up" delay={100}>
                    <div className="bg-white rounded-xl sm:rounded-2xl p-4 sm:p-5 text-center border border-gray-200 hover:bg-gray-50 transition-all duration-500 transform hover:-translate-y-1 hover:scale-105 mobile-touch-feedback shadow-sm hover:shadow-md">
                      <div className="flex justify-center mb-4">
                        {[...Array(5)].map((_, i) => (
                          <FaStar key={i} className="w-4 h-4 text-yellow-400" />
                        ))}
                      </div>
                      <p className="text-gray-600 text-sm sm:text-base mb-4 italic">
                        "Amazing quality and fast delivery! I've been shopping here for months and never disappointed."
                      </p>
                      <div className="font-semibold text-gray-900 text-sm sm:text-base">Sarah Johnson</div>
                      <div className="text-gray-500 text-xs sm:text-sm">Verified Customer</div>
                    </div>
                  </ScrollAnimation>

                  <ScrollAnimation direction="up" delay={200}>
                    <div className="bg-white rounded-xl sm:rounded-2xl p-4 sm:p-5 text-center border border-gray-200 hover:bg-gray-50 transition-all duration-500 transform hover:-translate-y-1 hover:scale-105 mobile-touch-feedback shadow-sm hover:shadow-md">
                      <div className="flex justify-center mb-4">
                        {[...Array(5)].map((_, i) => (
                          <FaStar key={i} className="w-4 h-4 text-yellow-400" />
                        ))}
                      </div>
                      <p className="text-gray-600 text-sm sm:text-base mb-4 italic">
                        "Great customer service and excellent products. Highly recommended!"
                      </p>
                      <div className="font-semibold text-gray-900 text-sm sm:text-base">Mike Chen</div>
                      <div className="text-gray-500 text-xs sm:text-sm">Verified Customer</div>
                    </div>
                  </ScrollAnimation>

                  <ScrollAnimation direction="up" delay={300}>
                    <div className="bg-white rounded-xl sm:rounded-2xl p-4 sm:p-5 text-center border border-gray-200 hover:bg-gray-50 transition-all duration-500 transform hover:-translate-y-1 hover:scale-105 mobile-touch-feedback shadow-sm hover:shadow-md">
                      <div className="flex justify-center mb-4">
                        {[...Array(5)].map((_, i) => (
                          <FaStar key={i} className="w-4 h-4 text-yellow-400" />
                        ))}
                      </div>
                      <p className="text-gray-600 text-sm sm:text-base mb-4 italic">
                        "Best online shopping experience I've had. Will definitely shop again!"
                      </p>
                      <div className="font-semibold text-gray-900 text-sm sm:text-base">Emily Davis</div>
                      <div className="text-gray-500 text-xs sm:text-sm">Verified Customer</div>
                    </div>
                  </ScrollAnimation>
                </div>
              </div>
            </section>
          </DynamicHomeSection>
        );

      case 'help':
        return (
          <DynamicHomeSection sectionId="help">
            <section className="py-6 sm:py-8 relative overflow-hidden z-10">
              {/* Animated Background Elements */}
              <div className="absolute inset-0">
                <div className="absolute top-10 left-10 w-24 h-24 bg-blue-500/10 rounded-full animate-pulse"></div>
                <div className="absolute top-20 right-20 w-16 h-16 bg-purple-500/10 rounded-full animate-pulse animation-delay-1000"></div>
                <div className="absolute bottom-10 left-1/4 w-20 h-20 bg-pink-500/10 rounded-full animate-pulse animation-delay-2000"></div>
                <div className="absolute bottom-20 right-1/3 w-12 h-12 bg-green-500/10 rounded-full animate-pulse animation-delay-3000"></div>
              </div>

              <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                <ScrollAnimation direction="up" delay={0}>
                  <div className="text-center mb-6 sm:mb-8">
                    <div className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-blue-100 to-purple-100 rounded-full mb-4">
                      <div className="w-2 h-2 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full animate-pulse"></div>
                      <span className="text-sm font-semibold text-gray-700">Need Help?</span>
                    </div>
                    <h2 className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-900 mb-4">
                      We're Here to
                      <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent"> Help You</span>
                    </h2>
                    <p className="text-gray-600 max-w-2xl mx-auto text-sm sm:text-base">
                      Have questions? We've got answers. Our support team is ready to assist you.
                    </p>
                  </div>
                </ScrollAnimation>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
                  <ScrollAnimation direction="up" delay={100}>
                    <div className="bg-white rounded-xl p-4 sm:p-5 text-center border border-gray-200 hover:bg-gray-50 transition-all duration-500 transform hover:-translate-y-1 hover:scale-105 mobile-touch-feedback shadow-sm hover:shadow-md">
                      <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center mx-auto mb-3 sm:mb-4">
                        <FaInfoCircle className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
                      </div>
                      <h3 className="text-sm sm:text-base font-bold text-gray-900 mb-2">FAQ</h3>
                      <p className="text-gray-600 text-xs sm:text-sm leading-relaxed">
                        Find answers to common questions about orders, shipping, and returns.
                      </p>
                    </div>
                  </ScrollAnimation>

                  <ScrollAnimation direction="up" delay={200}>
                    <div className="bg-white rounded-xl p-4 sm:p-5 text-center border border-gray-200 hover:bg-gray-50 transition-all duration-500 transform hover:-translate-y-1 hover:scale-105 mobile-touch-feedback shadow-sm hover:shadow-md">
                      <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-br from-green-500 to-emerald-600 rounded-xl flex items-center justify-center mx-auto mb-3 sm:mb-4">
                        <FaUsers className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
                      </div>
                      <h3 className="text-sm sm:text-base font-bold text-gray-900 mb-2">Live Chat</h3>
                      <p className="text-gray-600 text-xs sm:text-sm leading-relaxed">
                        Chat with our support team in real-time for instant help.
                      </p>
                    </div>
                  </ScrollAnimation>

                  <ScrollAnimation direction="up" delay={300}>
                    <div className="bg-white rounded-xl p-4 sm:p-5 text-center border border-gray-200 hover:bg-gray-50 transition-all duration-500 transform hover:-translate-y-1 hover:scale-105 mobile-touch-feedback shadow-sm hover:shadow-md">
                      <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-br from-purple-500 to-pink-600 rounded-xl flex items-center justify-center mx-auto mb-3 sm:mb-4">
                        <FaTruck className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
                      </div>
                      <h3 className="text-sm sm:text-base font-bold text-gray-900 mb-2">Track Order</h3>
                      <p className="text-gray-600 text-xs sm:text-sm leading-relaxed">
                        Track your order status and get real-time updates on delivery.
                      </p>
                    </div>
                  </ScrollAnimation>
                </div>

                <ScrollAnimation direction="up" delay={400}>
                  <div className="text-center mt-6 sm:mt-8">
                    <Link
                      to="/products"
                      className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold rounded-xl hover:from-blue-700 hover:to-purple-700 transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl"
                    >
                      <span>Start Shopping Now</span>
                      <FaArrowRight className="w-4 h-4 sm:w-5 sm:h-5 group-hover:translate-x-2 transition-transform duration-300" />
                    </Link>
                  </div>
                </ScrollAnimation>
              </div>
            </section>
          </DynamicHomeSection>
        );

      case 'finalCTA':
        return (
          <DynamicHomeSection sectionId="finalCTA">
            <section className="py-8 sm:py-10 relative overflow-hidden z-10">
              {/* Animated Background Elements - Same as Stats Section */}
              <div className="absolute inset-0">
                <div className="absolute top-10 left-10 w-24 h-24 bg-blue-500/10 rounded-full animate-pulse"></div>
                <div className="absolute top-20 right-20 w-16 h-16 bg-purple-500/10 rounded-full animate-pulse animation-delay-1000"></div>
                <div className="absolute bottom-10 left-1/4 w-20 h-20 bg-pink-500/10 rounded-full animate-pulse animation-delay-2000"></div>
                <div className="absolute bottom-20 right-1/3 w-12 h-12 bg-green-500/10 rounded-full animate-pulse animation-delay-3000"></div>
              </div>

              <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                <ScrollAnimation direction="up" delay={0}>
                  <div className="text-center mb-8 sm:mb-12">
                    <div className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-green-100 to-blue-100 rounded-full mb-4">
                      <div className="w-2 h-2 bg-gradient-to-r from-green-500 to-blue-500 rounded-full animate-pulse"></div>
                      <span className="text-sm font-semibold text-gray-700">Ready to Shop?</span>
                    </div>
                    <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
                      Start Your
                      <span className="bg-gradient-to-r from-green-600 to-blue-600 bg-clip-text text-transparent"> Shopping Journey</span>
                    </h2>
                    <p className="text-gray-600 max-w-2xl mx-auto text-sm sm:text-base">
                      Discover amazing products and enjoy a seamless shopping experience with us.
                    </p>
                  </div>
                </ScrollAnimation>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 sm:gap-6 lg:gap-8">
                  <ScrollAnimation direction="up" delay={100}>
                    <div className="bg-white rounded-xl sm:rounded-2xl p-4 sm:p-5 text-center border border-gray-200 hover:bg-gray-50 transition-all duration-500 transform hover:-translate-y-1 hover:scale-105 mobile-touch-feedback shadow-sm hover:shadow-md">
                      <div className="text-2xl sm:text-3xl font-bold text-green-600 mb-2">10K+</div>
                      <div className="text-gray-500 font-semibold text-xs sm:text-sm">Happy Customers</div>
                    </div>
                  </ScrollAnimation>

                  <ScrollAnimation direction="up" delay={200}>
                    <div className="bg-white rounded-xl sm:rounded-2xl p-4 sm:p-5 text-center border border-gray-200 hover:bg-gray-50 transition-all duration-500 transform hover:-translate-y-1 hover:scale-105 mobile-touch-feedback shadow-sm hover:shadow-md">
                      <div className="text-2xl sm:text-3xl font-bold text-blue-600 mb-2">500+</div>
                      <div className="text-gray-500 font-semibold text-xs sm:text-sm">Products</div>
                    </div>
                  </ScrollAnimation>

                  <ScrollAnimation direction="up" delay={300}>
                    <div className="bg-white rounded-xl sm:rounded-2xl p-4 sm:p-5 text-center border border-gray-200 hover:bg-gray-50 transition-all duration-500 transform hover:-translate-y-1 hover:scale-105 mobile-touch-feedback shadow-sm hover:shadow-md">
                      <div className="text-2xl sm:text-3xl font-bold text-purple-600 mb-2">50+</div>
                      <div className="text-gray-500 font-semibold text-xs sm:text-sm">Countries</div>
                    </div>
                  </ScrollAnimation>

                  <ScrollAnimation direction="up" delay={400}>
                    <div className="bg-white rounded-xl sm:rounded-2xl p-4 sm:p-5 text-center border border-gray-200 hover:bg-gray-50 transition-all duration-500 transform hover:-translate-y-1 hover:scale-105 mobile-touch-feedback shadow-sm hover:shadow-md">
                      <div className="text-2xl sm:text-3xl font-bold text-pink-600 mb-2">99%</div>
                      <div className="text-gray-500 font-semibold text-xs sm:text-sm">Satisfaction</div>
                    </div>
                  </ScrollAnimation>
                </div>

                <ScrollAnimation direction="up" delay={500}>
                  <div className="text-center mt-8 sm:mt-12">
                    <Link
                      to="/products"
                      className="inline-flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-green-600 to-blue-600 text-white font-bold rounded-2xl hover:from-green-700 hover:to-blue-700 transition-all duration-300 transform hover:scale-105 shadow-xl hover:shadow-2xl"
                    >
                      <span>Start Shopping Now</span>
                      <FaArrowRight className="w-4 h-4 sm:w-5 sm:h-5 group-hover:translate-x-2 transition-transform duration-300" />
                    </Link>
                  </div>
                </ScrollAnimation>
              </div>
            </section>
          </DynamicHomeSection>
        );

      default:
        return null;
    }
  };

  useEffect(() => {
    let isMounted = true;
    
    const fetchData = async () => {
      if (isMounted) {
        await fetchNewArrivals();
        await fetchFeaturedProducts();
      }
    };
    
    fetchData();
    
    return () => {
      isMounted = false;
    };
  }, []);

  const fetchNewArrivals = async () => {
    try {
      const response = await axios.get('/api/products?isNew=true&limit=8');
      setNewArrivals(response.data.products || []);
    } catch (error) {
      console.error('Error fetching new arrivals:', error);
    }
  };

  const fetchFeaturedProducts = async () => {
    try {
      const response = await axios.get('/api/products?featured=true&limit=8');
      setFeaturedProducts(response.data.products || []);
    } catch (error) {
      console.error('Error fetching featured products:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen relative">
      
      {/* Dynamic Section Rendering Based on Admin Settings */}
      {!settingsLoading && getSortedSections().map((section) => (
        <React.Fragment key={section.id}>
          {renderSection(section.id)}
        </React.Fragment>
      ))}

      {/* Footer */}
      <Footer />
    </div>
  );
};

export default Home;
