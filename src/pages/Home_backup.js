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
  FaArrowUp,
  FaInfoCircle,
  FaQuoteLeft,
  FaCheckCircle,
  FaLeaf
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

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Function to create section components
  const createSectionComponent = (sectionId) => {
    switch (sectionId) {
      case 'carousel':
        return (
          <DynamicHomeSection key="carousel" sectionId="carousel">
            <ModernCarousel />
          </DynamicHomeSection>
        );
      
      case 'newArrivals':
        return (
          <DynamicHomeSection key="newArrivals" sectionId="newArrivals">
            <section className="pt-4 pb-12 relative overflow-hidden z-10">
            {/* Unique Background Pattern */}
            <div className="absolute inset-0 opacity-5">
              <div className="absolute top-10 left-10 w-20 h-20 bg-blue-500 rounded-full animate-pulse"></div>
              <div className="absolute top-32 right-20 w-16 h-16 bg-purple-500 rounded-full animate-pulse animation-delay-1000"></div>
              <div className="absolute bottom-20 left-1/4 w-12 h-12 bg-green-500 rounded-full animate-pulse animation-delay-2000"></div>
              <div className="absolute bottom-32 right-1/3 w-8 h-8 bg-pink-500 rounded-full animate-pulse animation-delay-3000"></div>
            </div>
            
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
               <div className="flex items-center justify-between mb-6 sm:mb-8">
                 <div className="flex items-center gap-2 sm:gap-3">
                   <div className="relative">
                     <div className="w-6 h-6 sm:w-10 sm:h-10 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center shadow-lg">
                     <FaGem className="w-3 h-3 sm:w-5 sm:h-5 text-white" />
                     </div>
                     <div className="absolute -top-1 -right-1 w-3 h-3 bg-green-500 rounded-full animate-ping"></div>
                   </div>
                   <h2 className="text-lg sm:text-3xl font-bold text-gray-900">
                   <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                     New Arrivals
                   </span>
                 </h2>
                 </div>
                 <Link
                   to="/products"
                   className="group inline-flex items-center gap-1 sm:gap-2 px-4 sm:px-6 py-2 sm:py-3 bg-gradient-to-r from-gray-800 to-gray-900 text-white text-xs sm:text-base font-semibold rounded-full transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105 hover:from-gray-900 hover:to-black"
                 >
                   <span>View All</span>
                   <FaArrowRight className="w-2 h-2 sm:w-4 sm:h-4 group-hover:translate-x-1 transition-transform duration-300" />
                 </Link>
               </div>

                  {loading ? (
                <div className="flex gap-3 sm:gap-4 overflow-x-auto pb-4 scrollbar-hide">
                  {Array.from({ length: 8 }).map((_, idx) => (
                    <div key={idx} className="flex-shrink-0 w-36 sm:w-56 bg-white rounded-lg shadow-sm p-2 sm:p-3 animate-pulse">
                      <div className="aspect-square w-full rounded-lg bg-gray-200 mb-2 sm:mb-3" />
                      <div className="h-3 w-3/4 rounded bg-gray-200 mb-1 sm:mb-2" />
                      <div className="h-3 w-1/2 rounded bg-gray-200" />
                    </div>
                  ))}
                </div>
              ) : newArrivals.length > 0 ? (
                <div className="flex gap-3 sm:gap-4 overflow-x-auto pb-4 scrollbar-hide">
                  {newArrivals.map((product) => (
                    <div key={product._id} className="flex-shrink-0 w-36 sm:w-56">
                      <ProductCard product={product} />
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8 sm:py-12">
                  <div className="w-16 h-16 sm:w-24 sm:h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-3 sm:mb-4">
                    <FaShoppingBag className="w-6 h-6 sm:w-10 sm:h-10 text-gray-400" />
                  </div>
                  <h3 className="text-base sm:text-xl font-semibold text-gray-900 mb-1 sm:mb-2">No New Arrivals Yet</h3>
                  <p className="text-xs sm:text-base text-gray-600 mb-4 sm:mb-6">Check back soon for the latest products!</p>
                  <Link
                    to="/products"
                    className="inline-flex items-center gap-1 sm:gap-2 px-4 sm:px-6 py-2 sm:py-3 bg-blue-600 text-white text-xs sm:text-base font-semibold rounded-lg hover:bg-blue-700 transition-colors duration-300"
                  >
                    <FaEye className="w-3 h-3 sm:w-4 sm:h-4" />
                    Browse All Products
                  </Link>
                </div>
              )}
              </div>
            </section>
          </DynamicHomeSection>
        );

      case 'featuredProducts':
        return (
          <DynamicHomeSection key="featuredProducts" sectionId="featuredProducts">
          <section className="pt-0 pb-12 relative overflow-hidden z-10">
            {/* Unique Background Pattern */}
            <div className="absolute inset-0 opacity-5">
              <div className="absolute top-10 left-10 w-16 h-16 bg-purple-500 rounded-full animate-pulse"></div>
              <div className="absolute top-32 right-20 w-20 h-20 bg-pink-500 rounded-full animate-pulse animation-delay-1000"></div>
              <div className="absolute bottom-20 left-1/4 w-12 h-12 bg-indigo-500 rounded-full animate-pulse animation-delay-2000"></div>
              <div className="absolute bottom-32 right-1/3 w-14 h-14 bg-cyan-500 rounded-full animate-pulse animation-delay-3000"></div>
            </div>
            
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
              <div className="flex items-center justify-between mb-6 sm:mb-8">
                <div className="flex items-center gap-2 sm:gap-3">
                  <div className="relative">
                    <div className="w-6 h-6 sm:w-10 sm:h-10 bg-gradient-to-r from-purple-500 to-pink-600 rounded-full flex items-center justify-center shadow-lg">
                      <FaStar className="w-3 h-3 sm:w-5 sm:h-5 text-white" />
                    </div>
                    <div className="absolute -top-1 -right-1 w-3 h-3 bg-yellow-500 rounded-full animate-ping"></div>
                  </div>
                  <h2 className="text-lg sm:text-3xl font-bold text-gray-900">
                    <span className="bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                      Featured Products
                    </span>
                  </h2>
                </div>
                <Link
                  to="/products?featured=true"
                  className="group inline-flex items-center gap-1 sm:gap-2 px-4 sm:px-6 py-2 sm:py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white text-xs sm:text-base font-semibold rounded-full transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105"
                >
                  <span>View All</span>
                  <FaArrowRight className="w-2 h-2 sm:w-4 sm:h-4 group-hover:translate-x-1 transition-transform duration-300" />
                </Link>
              </div>

              {loading ? (
                <div className="flex gap-3 sm:gap-4 overflow-x-auto pb-4 scrollbar-hide">
                  {Array.from({ length: 8 }).map((_, idx) => (
                    <div key={idx} className="flex-shrink-0 w-36 sm:w-56 bg-white rounded-lg shadow-sm p-2 sm:p-3 animate-pulse">
                      <div className="aspect-square w-full rounded-lg bg-gray-200 mb-2 sm:mb-3" />
                      <div className="h-3 w-3/4 rounded bg-gray-200 mb-1 sm:mb-2" />
                      <div className="h-3 w-1/2 rounded bg-gray-200" />
                    </div>
                  ))}
                </div>
              ) : featuredProducts.length > 0 ? (
                <div className="flex gap-3 sm:gap-4 overflow-x-auto pb-4 scrollbar-hide">
                  {featuredProducts.map((product) => (
                    <div key={product._id} className="flex-shrink-0 w-36 sm:w-56">
                      <ProductCard product={product} />
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8 sm:py-12">
                  <div className="w-16 h-16 sm:w-24 sm:h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-3 sm:mb-4">
                    <FaStar className="w-6 h-6 sm:w-10 sm:h-10 text-gray-400" />
                  </div>
                  <h3 className="text-base sm:text-xl font-semibold text-gray-900 mb-1 sm:mb-2">No Featured Products</h3>
                  <p className="text-xs sm:text-base text-gray-600 mb-4 sm:mb-6">Featured products will appear here soon!</p>
                  <Link
                    to="/products"
                    className="inline-flex items-center gap-1 sm:gap-2 px-4 sm:px-6 py-2 sm:py-3 bg-purple-600 text-white text-xs sm:text-base font-semibold rounded-lg hover:bg-purple-700 transition-colors duration-300"
                  >
                    <FaEye className="w-3 h-3 sm:w-4 sm:h-4" />
                    Browse All Products
                  </Link>
              </div>
            )}
          </div>
          </section>
          </DynamicHomeSection>
        );

      case 'banner':
        return (
          <DynamicHomeSection key="banner" sectionId="banner">
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

      default:
        return null;
    }
  };

  // Render sections in admin-defined order
  const renderSections = () => {
    if (settingsLoading) {
      // Show default order while loading settings
      return [
        'carousel', 'newArrivals', 'featuredProducts', 'banner', 
        'features', 'stats', 'testimonials', 'help', 'finalCTA'
      ].map(sectionId => createSectionComponent(sectionId)).filter(Boolean);
    }

    // Get sorted sections from admin settings
    const sortedSections = getSortedSections();
    return sortedSections.map(section => createSectionComponent(section.id)).filter(Boolean);
  };

  return (
    <div className="min-h-screen bg-gray-50 relative">
      {/* Single Gradient Overlay for Entire Home Page */}
      <div className="absolute inset-0 bg-gradient-to-br from-blue-600/20 via-transparent to-purple-600/20 pointer-events-none"></div>
      
      {/* Render sections in admin-defined order */}
      {renderSections()}

      {/* Footer */}
      <Footer />

      {/* Scroll to Top Button - Compact */}
    <button
        onClick={scrollToTop}
        className="fixed bottom-4 right-4 z-40 inline-flex h-10 w-10 items-center justify-center rounded-full text-white shadow-md transition-all duration-200 hover:scale-110 hover:shadow-lg"
        style={{background: 'var(--blue-gradient)'}}
        aria-label="Scroll to top"
      >
        <FaArrowUp className="w-4 h-4" />
    </button>
    </div>
  );
};

export default Home;
          <div className="absolute top-10 left-10 w-20 h-20 bg-blue-500 rounded-full animate-pulse"></div>
          <div className="absolute top-32 right-20 w-16 h-16 bg-purple-500 rounded-full animate-pulse animation-delay-1000"></div>
          <div className="absolute bottom-20 left-1/4 w-12 h-12 bg-green-500 rounded-full animate-pulse animation-delay-2000"></div>
          <div className="absolute bottom-32 right-1/3 w-8 h-8 bg-pink-500 rounded-full animate-pulse animation-delay-3000"></div>
        </div>
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
           <div className="flex items-center justify-between mb-6 sm:mb-8">
             <div className="flex items-center gap-2 sm:gap-3">
               <div className="relative">
                 <div className="w-6 h-6 sm:w-10 sm:h-10 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center shadow-lg">
                 <FaGem className="w-3 h-3 sm:w-5 sm:h-5 text-white" />
                 </div>
                 <div className="absolute -top-1 -right-1 w-3 h-3 bg-green-500 rounded-full animate-ping"></div>
               </div>
               <h2 className="text-lg sm:text-3xl font-bold text-gray-900">
               <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                 New Arrivals
               </span>
             </h2>
             </div>
             <Link
               to="/products"
               className="group inline-flex items-center gap-1 sm:gap-2 px-4 sm:px-6 py-2 sm:py-3 bg-gradient-to-r from-gray-800 to-gray-900 text-white text-xs sm:text-base font-semibold rounded-full transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105 hover:from-gray-900 hover:to-black"
             >
               <span>View All</span>
               <FaArrowRight className="w-2 h-2 sm:w-4 sm:h-4 group-hover:translate-x-1 transition-transform duration-300" />
             </Link>
           </div>

              {loading ? (
            <div className="flex gap-3 sm:gap-4 overflow-x-auto pb-4 scrollbar-hide">
              {Array.from({ length: 8 }).map((_, idx) => (
                <div key={idx} className="flex-shrink-0 w-36 sm:w-56 bg-white rounded-lg shadow-sm p-2 sm:p-3 animate-pulse">
                  <div className="aspect-square w-full rounded-lg bg-gray-200 mb-2 sm:mb-3" />
                  <div className="h-3 w-3/4 rounded bg-gray-200 mb-1 sm:mb-2" />
                  <div className="h-2 w-1/2 rounded bg-gray-200 mb-1 sm:mb-2" />
                  <div className="h-5 sm:h-6 w-full rounded bg-gray-200" />
                </div>
              ))}
            </div>
          ) : newArrivals.filter(product => product.isNewProduct && product.quantity > 0 && !product.isSold).length > 0 ? (
            <div className="flex gap-3 sm:gap-4 overflow-x-auto pb-4 scrollbar-hide">
              {newArrivals
                .filter(product => product.isNewProduct && product.quantity > 0 && !product.isSold)
                .slice(0, 8)
                .map((product, index) => (
                  <div key={product._id} className="flex-shrink-0 w-36 sm:w-56 group bg-white rounded-3xl shadow-sm hover:shadow-xl transition-all duration-500 transform hover:scale-105 hover:-translate-y-2 border border-gray-100 hover:border-gray-200" style={{animationDelay: `${index * 100}ms`}}>
                    <ProductCard product={product} />
                  </div>
                  ))}
                </div>
          ) : (
            <div className="text-center py-12">
              <div className="relative w-16 h-16 bg-gradient-to-br from-blue-100 to-purple-100 rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg">
                <FaStar className="w-8 h-8 text-blue-600" />
                <div className="absolute -top-1 -right-1 w-4 h-4 bg-green-500 rounded-full animate-ping"></div>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">No New Arrivals Yet</h3>
              <p className="text-gray-600 mb-6 max-w-md mx-auto">Check back soon for the latest products! We're constantly adding new items to our collection.</p>
              <Link
                to="/products"
                className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white text-sm font-semibold rounded-xl hover:from-blue-700 hover:to-purple-700 transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl"
              >
                <FaEye className="w-4 h-4" />
                Browse All Products
              </Link>
            </div>
          )}
          </div>
        </section>
      </DynamicHomeSection>

      {/* Featured Products Section - Compact */}
      <DynamicHomeSection sectionId="featuredProducts">
      <section className="pt-0 pb-12 relative overflow-hidden z-10">
        {/* Unique Background Pattern */}
        <div className="absolute inset-0 opacity-5">
          <div className="absolute top-10 left-10 w-16 h-16 bg-purple-500 rounded-full animate-pulse"></div>
          <div className="absolute top-32 right-20 w-20 h-20 bg-pink-500 rounded-full animate-pulse animation-delay-1000"></div>
          <div className="absolute bottom-20 left-1/4 w-14 h-14 bg-blue-500 rounded-full animate-pulse animation-delay-2000"></div>
          <div className="absolute bottom-32 right-1/3 w-10 h-10 bg-green-500 rounded-full animate-pulse animation-delay-3000"></div>
        </div>
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="flex items-center justify-between mb-6 sm:mb-8">
            <div className="flex items-center gap-2 sm:gap-3">
              <div className="relative">
                <div className="w-6 h-6 sm:w-10 sm:h-10 bg-gradient-to-r from-purple-500 to-pink-600 rounded-full flex items-center justify-center shadow-lg">
                <FaStar className="w-3 h-3 sm:w-5 sm:h-5 text-white" />
                </div>
                <div className="absolute -top-1 -right-1 w-3 h-3 bg-yellow-500 rounded-full animate-ping"></div>
              </div>
              <h2 className="text-lg sm:text-3xl font-bold text-gray-900">
              <span className="bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                Featured Products
              </span>
            </h2>
            </div>
            <Link
              to="/products"
              className="group inline-flex items-center gap-1 sm:gap-2 px-4 sm:px-6 py-2 sm:py-3 bg-gradient-to-r from-gray-800 to-gray-900 text-white text-xs sm:text-base font-semibold rounded-full transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105 hover:from-gray-900 hover:to-black"
            >
              <span>View All</span>
              <FaArrowRight className="w-2 h-2 sm:w-4 sm:h-4 group-hover:translate-x-1 transition-transform duration-300" />
            </Link>
          </div>

          {loading ? (
            <div className="flex gap-3 sm:gap-4 overflow-x-auto pb-4 scrollbar-hide">
              {Array.from({ length: 8 }).map((_, idx) => (
                <div key={idx} className="flex-shrink-0 w-36 sm:w-56 bg-white rounded-lg shadow-sm p-2 sm:p-3 animate-pulse">
                  <div className="aspect-square w-full rounded-lg bg-gray-200 mb-2 sm:mb-3" />
                  <div className="h-3 w-3/4 rounded bg-gray-200 mb-1 sm:mb-2" />
                  <div className="h-2 w-1/2 rounded bg-gray-200 mb-1 sm:mb-2" />
                  <div className="h-5 sm:h-6 w-full rounded bg-gray-200" />
                </div>
              ))}
            </div>
          ) : featuredProducts.filter(product => product.isFeatured && product.quantity > 0 && !product.isSold).length > 0 ? (
            <div className="flex gap-3 sm:gap-4 overflow-x-auto pb-4 scrollbar-hide">
              {featuredProducts
                .filter(product => product.isFeatured && product.quantity > 0 && !product.isSold)
                .slice(0, 8)
                .map((product, index) => (
                  <div key={product._id} className="flex-shrink-0 w-36 sm:w-56 group bg-white rounded-3xl shadow-sm hover:shadow-xl transition-all duration-500 transform hover:scale-105 hover:-translate-y-2 border border-gray-100 hover:border-gray-200" style={{animationDelay: `${index * 100}ms`}}>
                    <ProductCard product={product} />
                  </div>
                  ))}
                </div>
          ) : (
            <div className="text-center py-12">
              <div className="relative w-16 h-16 bg-gradient-to-br from-purple-100 to-pink-100 rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg">
                <FaStar className="w-8 h-8 text-purple-600" />
                <div className="absolute -top-1 -right-1 w-4 h-4 bg-yellow-500 rounded-full animate-ping"></div>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">No Featured Products Yet</h3>
              <p className="text-gray-600 mb-6 max-w-md mx-auto">Our featured products will appear here soon! We're curating the best products for you.</p>
              <Link
                to="/products"
                className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white text-sm font-semibold rounded-xl hover:from-purple-700 hover:to-pink-700 transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl"
              >
                <FaEye className="w-4 h-4" />
                Browse All Products
              </Link>
          </div>
        )}
      </div>
      </section>
      </DynamicHomeSection>

      {/* Enhanced Premium Banner Section */}
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

      {/* Modern Feature Boxes Section */}
      <DynamicHomeSection sectionId="features">
      <section className="py-6 sm:py-8 relative overflow-hidden z-10">
        {/* Animated Background Elements */}
        <div className="absolute inset-0">
          <div className="absolute top-10 left-10 w-24 h-24 bg-blue-500/10 rounded-full animate-pulse"></div>
          <div className="absolute top-20 right-20 w-16 h-16 bg-purple-500/10 rounded-full animate-pulse animation-delay-1000"></div>
          <div className="absolute bottom-10 left-1/3 w-12 h-12 bg-green-500/10 rounded-full animate-pulse animation-delay-2000"></div>
          <div className="absolute bottom-20 right-1/3 w-8 h-8 bg-pink-500/10 rounded-full animate-pulse animation-delay-3000"></div>
        </div>
        
        <div className="max-w-6xl mx-auto px-3 sm:px-4 lg:px-6 relative z-10">
          {/* Section Header */}
          <div className="text-center mb-8 sm:mb-10">
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 mb-3 sm:mb-4">
              Why Choose <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">Our Store</span>?
            </h2>
            <p className="text-sm sm:text-base text-gray-600 max-w-2xl mx-auto leading-relaxed">
              Experience premium shopping with our exceptional services and quality products
            </p>
          </div>

          {/* Feature Boxes Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4 lg:gap-6">
            {/* Feature 1 - Product Collection */}
            <ScrollAnimation direction="up" delay={0}>
              <div className="group relative bg-white rounded-xl sm:rounded-2xl p-4 sm:p-5 text-center border border-gray-200 hover:bg-gray-50 transition-all duration-500 transform hover:-translate-y-1 hover:scale-105 mobile-touch-feedback shadow-sm hover:shadow-md">
              {/* Animated Background */}
              <div className="absolute inset-0 bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl sm:rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
              
              {/* Floating Elements */}
              <div className="absolute top-2 right-2 w-1.5 h-1.5 bg-green-400 rounded-full animate-ping"></div>
              <div className="absolute bottom-3 left-3 w-1 h-1 bg-green-300 rounded-full animate-pulse animation-delay-1000"></div>
              
              <div className="relative z-10">
                {/* Icon Container */}
                <div className="relative mb-3 sm:mb-4">
                  <div className="w-8 h-8 sm:w-10 sm:h-10 bg-gradient-to-br from-green-500 to-emerald-600 rounded-xl flex items-center justify-center mx-auto group-hover:scale-110 group-hover:rotate-6 transition-all duration-500 shadow-md">
                    <FaShoppingBag className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
                  </div>
                  {/* Glow Effect */}
                  <div className="absolute inset-0 bg-gradient-to-br from-green-500 to-emerald-600 rounded-xl blur-lg opacity-0 group-hover:opacity-40 transition-opacity duration-500"></div>
                </div>

                {/* Content */}
                <div className="space-y-1.5">
                  <h3 className="text-lg sm:text-xl lg:text-2xl font-bold text-gray-900 group-hover:text-green-600 transition-colors duration-300">
                    Premium Products
                  </h3>
                  <p className="text-xs sm:text-sm text-gray-600 group-hover:text-gray-800 transition-colors duration-300 font-medium">
                    Curated collection of high-quality products
                  </p>
                  <div className="w-8 h-0.5 bg-gradient-to-r from-green-500 to-emerald-500 rounded-full mx-auto group-hover:w-12 transition-all duration-500"></div>
                </div>
              </div>
              </div>
            </ScrollAnimation>

            {/* Feature 2 - Free Shipping */}
            <ScrollAnimation direction="up" delay={200}>
              <div className="group relative bg-white rounded-xl sm:rounded-2xl p-4 sm:p-5 text-center border border-gray-200 hover:bg-gray-50 transition-all duration-500 transform hover:-translate-y-1 hover:scale-105 mobile-touch-feedback shadow-sm hover:shadow-md">
              {/* Animated Background */}
              <div className="absolute inset-0 bg-gradient-to-br from-blue-50 to-cyan-50 rounded-xl sm:rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
              
              {/* Floating Elements */}
              <div className="absolute top-2 right-2 w-1.5 h-1.5 bg-blue-400 rounded-full animate-ping animation-delay-500"></div>
              <div className="absolute bottom-3 left-3 w-1 h-1 bg-blue-300 rounded-full animate-pulse animation-delay-1500"></div>
              
              <div className="relative z-10">
                {/* Icon Container */}
                <div className="relative mb-3 sm:mb-4">
                  <div className="w-8 h-8 sm:w-10 sm:h-10 bg-gradient-to-br from-blue-500 to-cyan-600 rounded-xl flex items-center justify-center mx-auto group-hover:scale-110 group-hover:rotate-6 transition-all duration-500 shadow-md">
                    <FaTruck className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
                  </div>
                  {/* Glow Effect */}
                  <div className="absolute inset-0 bg-gradient-to-br from-blue-500 to-cyan-600 rounded-xl blur-lg opacity-0 group-hover:opacity-40 transition-opacity duration-500"></div>
            </div>
            
                {/* Content */}
                <div className="space-y-1.5">
                  <h3 className="text-lg sm:text-xl lg:text-2xl font-bold text-gray-900 group-hover:text-blue-600 transition-colors duration-300">
                    Free Shipping
                  </h3>
                  <p className="text-xs sm:text-sm text-gray-600 group-hover:text-gray-800 transition-colors duration-300 font-medium">
                    Fast and free delivery on all orders
                  </p>
                  <div className="w-8 h-0.5 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-full mx-auto group-hover:w-12 transition-all duration-500"></div>
                </div>
              </div>
              </div>
            </ScrollAnimation>

            {/* Feature 3 - Money Back Guarantee */}
            <ScrollAnimation direction="up" delay={400}>
              <div className="group relative bg-white rounded-xl sm:rounded-2xl p-4 sm:p-5 text-center border border-gray-200 hover:bg-gray-50 transition-all duration-500 transform hover:-translate-y-1 hover:scale-105 mobile-touch-feedback shadow-sm hover:shadow-md sm:col-span-2 lg:col-span-1">
              {/* Animated Background */}
              <div className="absolute inset-0 bg-gradient-to-br from-purple-50 to-pink-50 rounded-xl sm:rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
              
              {/* Floating Elements */}
              <div className="absolute top-2 right-2 w-1.5 h-1.5 bg-purple-400 rounded-full animate-ping animation-delay-1000"></div>
              <div className="absolute bottom-3 left-3 w-1 h-1 bg-purple-300 rounded-full animate-pulse animation-delay-2000"></div>
              
              <div className="relative z-10">
                {/* Icon Container */}
                <div className="relative mb-3 sm:mb-4">
                  <div className="w-8 h-8 sm:w-10 sm:h-10 bg-gradient-to-br from-purple-500 to-pink-600 rounded-xl flex items-center justify-center mx-auto group-hover:scale-110 group-hover:rotate-6 transition-all duration-500 shadow-md">
                    <FaCheckCircle className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
                  </div>
                  {/* Glow Effect */}
                  <div className="absolute inset-0 bg-gradient-to-br from-purple-500 to-pink-600 rounded-xl blur-lg opacity-0 group-hover:opacity-40 transition-opacity duration-500"></div>
            </div>
            
                {/* Content */}
                <div className="space-y-1.5">
                  <h3 className="text-lg sm:text-xl lg:text-2xl font-bold text-gray-900 group-hover:text-purple-600 transition-colors duration-300">
                    Money Back Guarantee
                  </h3>
                  <p className="text-xs sm:text-sm text-gray-600 group-hover:text-gray-800 transition-colors duration-300 font-medium">
                    30-day money back guarantee
                  </p>
                  <div className="w-8 h-0.5 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full mx-auto group-hover:w-12 transition-all duration-500"></div>
                </div>
              </div>
            </div>
            </ScrollAnimation>
          </div>
        </div>
      </section>
      </DynamicHomeSection>

      {/* Modern Stats Section */}
      <DynamicHomeSection sectionId="stats">
      <section className="py-8 sm:py-10 relative overflow-hidden z-10">
        {/* Animated Background Elements */}
        <div className="absolute inset-0">
          <div className="absolute top-10 left-10 w-24 h-24 bg-blue-500/10 rounded-full animate-pulse"></div>
          <div className="absolute top-20 right-20 w-16 h-16 bg-purple-500/10 rounded-full animate-pulse animation-delay-1000"></div>
          <div className="absolute bottom-10 left-1/3 w-12 h-12 bg-green-500/10 rounded-full animate-pulse animation-delay-2000"></div>
          <div className="absolute bottom-20 right-1/3 w-8 h-8 bg-pink-500/10 rounded-full animate-pulse animation-delay-3000"></div>
        </div>

        <div className="max-w-6xl mx-auto px-3 sm:px-4 lg:px-6 relative z-10">
          {/* Section Header */}
          <div className="text-center mb-8 sm:mb-10">
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 mb-3 sm:mb-4">
              Trusted by <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">Thousands</span>
            </h2>
            <p className="text-sm sm:text-base text-gray-600 max-w-2xl mx-auto leading-relaxed">
              Join our growing community of satisfied customers and experience the difference
            </p>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
            {/* Stat 1 - Happy Customers */}
            <ScrollAnimation direction="up" delay={0}>
              <div className="group relative bg-white rounded-xl sm:rounded-2xl p-4 sm:p-5 text-center border border-gray-200 hover:bg-gray-50 transition-all duration-500 transform hover:-translate-y-1 hover:scale-105 mobile-touch-feedback shadow-sm hover:shadow-md">
              {/* Animated Background */}
              <div className="absolute inset-0 bg-gradient-to-br from-blue-50 to-cyan-50 rounded-xl sm:rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
              
              {/* Floating Elements */}
              <div className="absolute top-2 right-2 w-1.5 h-1.5 bg-blue-400 rounded-full animate-ping"></div>
              <div className="absolute bottom-3 left-3 w-1 h-1 bg-blue-300 rounded-full animate-pulse animation-delay-1000"></div>
              
              <div className="relative z-10">
                {/* Icon */}
                <div className="relative mb-3 sm:mb-4">
                  <div className="w-8 h-8 sm:w-10 sm:h-10 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-xl flex items-center justify-center mx-auto group-hover:scale-110 group-hover:rotate-6 transition-all duration-500 shadow-md">
                    <FaUsers className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
                  </div>
                  {/* Glow Effect */}
                  <div className="absolute inset-0 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-xl blur-lg opacity-0 group-hover:opacity-40 transition-opacity duration-500"></div>
                </div>

                {/* Content */}
                <div className="space-y-1.5">
                  <h3 className="text-lg sm:text-xl lg:text-2xl font-bold text-gray-900 group-hover:text-blue-600 transition-colors duration-300">
                    10K+
                  </h3>
                  <p className="text-xs sm:text-sm text-gray-600 group-hover:text-gray-800 transition-colors duration-300 font-medium">
                    Happy Customers
                  </p>
                  <div className="w-8 h-0.5 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-full mx-auto group-hover:w-12 transition-all duration-500"></div>
                </div>
              </div>
              </div>
            </ScrollAnimation>

            {/* Stat 2 - Products */}
            <ScrollAnimation direction="up" delay={200}>
              <div className="group relative bg-white rounded-xl sm:rounded-2xl p-4 sm:p-5 text-center border border-gray-200 hover:bg-gray-50 transition-all duration-500 transform hover:-translate-y-1 hover:scale-105 mobile-touch-feedback shadow-sm hover:shadow-md">
              {/* Animated Background */}
              <div className="absolute inset-0 bg-gradient-to-br from-amber-50 to-orange-50 rounded-xl sm:rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
              
              {/* Floating Elements */}
              <div className="absolute top-2 right-2 w-1.5 h-1.5 bg-amber-400 rounded-full animate-ping animation-delay-500"></div>
              <div className="absolute bottom-3 left-3 w-1 h-1 bg-amber-300 rounded-full animate-pulse animation-delay-1500"></div>
              
              <div className="relative z-10">
                {/* Icon */}
                <div className="relative mb-3 sm:mb-4">
                  <div className="w-8 h-8 sm:w-10 sm:h-10 bg-gradient-to-br from-amber-500 to-orange-500 rounded-xl flex items-center justify-center mx-auto group-hover:scale-110 group-hover:rotate-6 transition-all duration-500 shadow-md">
                    <FaShoppingBag className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
                  </div>
                  {/* Glow Effect */}
                  <div className="absolute inset-0 bg-gradient-to-br from-amber-500 to-orange-500 rounded-xl blur-lg opacity-0 group-hover:opacity-40 transition-opacity duration-500"></div>
            </div>
            
                {/* Content */}
                <div className="space-y-1.5">
                  <h3 className="text-lg sm:text-xl lg:text-2xl font-bold text-gray-900 group-hover:text-amber-600 transition-colors duration-300">
                    500+
                  </h3>
                  <p className="text-xs sm:text-sm text-gray-600 group-hover:text-gray-800 transition-colors duration-300 font-medium">
                    Premium Products
                  </p>
                  <div className="w-8 h-0.5 bg-gradient-to-r from-amber-500 to-orange-500 rounded-full mx-auto group-hover:w-12 transition-all duration-500"></div>
                </div>
              </div>
              </div>
            </ScrollAnimation>

            {/* Stat 3 - Years Experience */}
            <ScrollAnimation direction="up" delay={400}>
              <div className="group relative bg-white rounded-xl sm:rounded-2xl p-4 sm:p-5 text-center border border-gray-200 hover:bg-gray-50 transition-all duration-500 transform hover:-translate-y-1 hover:scale-105 mobile-touch-feedback shadow-sm hover:shadow-md">
              {/* Animated Background */}
              <div className="absolute inset-0 bg-gradient-to-br from-purple-50 to-pink-50 rounded-xl sm:rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
              
              {/* Floating Elements */}
              <div className="absolute top-2 right-2 w-1.5 h-1.5 bg-purple-400 rounded-full animate-ping animation-delay-1000"></div>
              <div className="absolute bottom-3 left-3 w-1 h-1 bg-purple-300 rounded-full animate-pulse animation-delay-2000"></div>
              
              <div className="relative z-10">
                {/* Icon */}
                <div className="relative mb-3 sm:mb-4">
                  <div className="w-8 h-8 sm:w-10 sm:h-10 bg-gradient-to-br from-purple-500 to-pink-500 rounded-xl flex items-center justify-center mx-auto group-hover:scale-110 group-hover:rotate-6 transition-all duration-500 shadow-md">
                    <FaAward className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
                  </div>
                  {/* Glow Effect */}
                  <div className="absolute inset-0 bg-gradient-to-br from-purple-500 to-pink-500 rounded-xl blur-lg opacity-0 group-hover:opacity-40 transition-opacity duration-500"></div>
                </div>

                {/* Content */}
                <div className="space-y-1.5">
                  <h3 className="text-lg sm:text-xl lg:text-2xl font-bold text-gray-900 group-hover:text-purple-600 transition-colors duration-300">
                    5+
                  </h3>
                  <p className="text-xs sm:text-sm text-gray-600 group-hover:text-gray-800 transition-colors duration-300 font-medium">
                    Years Experience
                  </p>
                  <div className="w-8 h-0.5 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full mx-auto group-hover:w-12 transition-all duration-500"></div>
            </div>
          </div>
          </div>
            </ScrollAnimation>

            {/* Stat 4 - Satisfaction */}
            <ScrollAnimation direction="up" delay={600}>
              <div className="group relative bg-white rounded-xl sm:rounded-2xl p-4 sm:p-5 text-center border border-gray-200 hover:bg-gray-50 transition-all duration-500 transform hover:-translate-y-1 hover:scale-105 mobile-touch-feedback shadow-sm hover:shadow-md">
              {/* Animated Background */}
              <div className="absolute inset-0 bg-gradient-to-br from-emerald-50 to-green-50 rounded-xl sm:rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
              
              {/* Floating Elements */}
              <div className="absolute top-2 right-2 w-1.5 h-1.5 bg-emerald-400 rounded-full animate-ping animation-delay-1500"></div>
              <div className="absolute bottom-3 left-3 w-1 h-1 bg-emerald-300 rounded-full animate-pulse animation-delay-2500"></div>
              
              <div className="relative z-10">
                {/* Icon */}
                <div className="relative mb-3 sm:mb-4">
                  <div className="w-8 h-8 sm:w-10 sm:h-10 bg-gradient-to-br from-emerald-500 to-green-500 rounded-xl flex items-center justify-center mx-auto group-hover:scale-110 group-hover:rotate-6 transition-all duration-500 shadow-md">
                    <FaHeart className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
                  </div>
                  {/* Glow Effect */}
                  <div className="absolute inset-0 bg-gradient-to-br from-emerald-500 to-green-500 rounded-xl blur-lg opacity-0 group-hover:opacity-40 transition-opacity duration-500"></div>
                </div>

                {/* Content */}
                <div className="space-y-1.5">
                  <h3 className="text-lg sm:text-xl lg:text-2xl font-bold text-gray-900 group-hover:text-emerald-600 transition-colors duration-300">
                    99%
                  </h3>
                  <p className="text-xs sm:text-sm text-gray-600 group-hover:text-gray-800 transition-colors duration-300 font-medium">
                    Satisfaction Rate
                  </p>
                  <div className="w-8 h-0.5 bg-gradient-to-r from-emerald-500 to-green-500 rounded-full mx-auto group-hover:w-12 transition-all duration-500"></div>
                </div>
              </div>
              </div>
            </ScrollAnimation>
            </div>
            
          {/* Bottom CTA */}
          <ScrollAnimation direction="up" delay={800}>
            <div className="text-center mt-8 sm:mt-10">
              <p className="text-sm sm:text-base text-gray-600 mb-4 sm:mb-6">
                Ready to join our satisfied customers?
              </p>
              <Link
                to="/products"
                className="inline-flex items-center gap-2 px-6 sm:px-8 py-3 sm:py-4 bg-gradient-to-r from-blue-500 to-purple-600 text-white text-sm sm:text-base font-bold rounded-xl hover:from-blue-600 hover:to-purple-700 transition-all duration-300 transform hover:scale-105 hover:shadow-xl group mobile-touch-feedback"
              >
                <span>Start Shopping Now</span>
                <FaArrowRight className="w-4 h-4 sm:w-5 sm:h-5 group-hover:translate-x-2 transition-transform duration-300" />
              </Link>
            </div>
          </ScrollAnimation>
          </div>
        </section>
      </DynamicHomeSection>

      {/* Modern Help Section */}
      <DynamicHomeSection sectionId="help">
      <section className="py-6 sm:py-8 relative overflow-hidden z-10">
        {/* Animated Background Elements */}
        <div className="absolute inset-0">
          <div className="absolute top-10 left-10 w-24 h-24 bg-blue-500/10 rounded-full animate-pulse"></div>
          <div className="absolute top-20 right-20 w-16 h-16 bg-purple-500/10 rounded-full animate-pulse animation-delay-1000"></div>
          <div className="absolute bottom-10 left-1/3 w-12 h-12 bg-green-500/10 rounded-full animate-pulse animation-delay-2000"></div>
          <div className="absolute bottom-20 right-1/3 w-8 h-8 bg-pink-500/10 rounded-full animate-pulse animation-delay-3000"></div>
        </div>

        <div className="max-w-5xl mx-auto px-3 sm:px-4 lg:px-6 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8 items-center">
            {/* Content */}
            <ScrollAnimation direction="left" delay={0}>
              <div className="space-y-3 sm:space-y-4">
                {/* Header */}
                <div className="space-y-2">
                  <h2 className="text-lg sm:text-2xl lg:text-3xl font-bold text-gray-900 leading-tight">
                    Need Help Choosing the <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">Right Products</span>?
                  </h2>
                  <p className="text-xs sm:text-sm text-gray-600 leading-relaxed">
                    Our expert team is here to help you find the perfect products for your needs.
                  </p>
                </div>

                {/* Features List */}
                <div className="space-y-2">
                  <div className="flex items-start gap-2">
                    <div className="w-5 h-5 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5">
                      <FaInfoCircle className="w-2.5 h-2.5 text-white" />
                    </div>
                    <div>
                      <h3 className="text-xs sm:text-sm font-semibold text-gray-900 mb-0.5">Expert Consultation</h3>
                      <p className="text-xs text-gray-600">Get personalized product recommendations</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-2">
                    <div className="w-5 h-5 bg-gradient-to-br from-green-500 to-emerald-500 rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5">
                      <FaCheckCircle className="w-2.5 h-2.5 text-white" />
                    </div>
                    <div>
                      <h3 className="text-xs sm:text-sm font-semibold text-gray-900 mb-0.5">Quality Assurance</h3>
                      <p className="text-xs text-gray-600">All products are carefully vetted</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-2">
                    <div className="w-5 h-5 bg-gradient-to-br from-purple-500 to-pink-500 rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5">
                      <FaHeart className="w-2.5 h-2.5 text-white" />
                    </div>
                    <div>
                      <h3 className="text-xs sm:text-sm font-semibold text-gray-900 mb-0.5">Customer Satisfaction</h3>
                      <p className="text-xs text-gray-600">We're committed to your satisfaction</p>
                    </div>
                  </div>
                </div>

                {/* CTA Buttons */}
                <div className="flex flex-col sm:flex-row gap-2 pt-2">
                  <Link
                    to="/contact"
                    className="inline-flex items-center justify-center gap-1.5 px-4 py-2.5 bg-gradient-to-r from-blue-500 to-purple-600 text-white text-xs sm:text-sm font-bold rounded-lg hover:from-blue-600 hover:to-purple-700 transition-all duration-300 transform hover:scale-105 hover:shadow-lg group mobile-touch-feedback"
                  >
                    <span>Get Help</span>
                    <FaArrowRight className="w-3 h-3 group-hover:translate-x-1 transition-transform duration-300" />
                  </Link>
                  <Link
                    to="/products"
                    className="inline-flex items-center justify-center gap-1.5 px-4 py-2.5 bg-white text-gray-900 text-xs sm:text-sm font-bold rounded-lg border border-gray-300 hover:border-blue-500 hover:text-blue-600 transition-all duration-300 transform hover:scale-105 hover:shadow-md group mobile-touch-feedback"
                  >
                    <span>Browse Products</span>
                    <FaStore className="w-3 h-3 group-hover:scale-110 transition-transform duration-300" />
                  </Link>
                </div>
              </div>
            </ScrollAnimation>
            
            {/* Image/Visual - Stats Section Style */}
            <ScrollAnimation direction="right" delay={200}>
              <div className="relative">
                {/* Main Image Container - Smaller like Stats Cards */}
                <div className="relative bg-white rounded-xl p-4 sm:p-5 shadow-sm hover:shadow-md transition-all duration-500 border border-gray-200 overflow-hidden">
                  {/* Background Pattern */}
                  <div className="absolute inset-0 opacity-5">
                    <div className="absolute top-2 left-2 w-8 h-8 bg-blue-500 rounded-full"></div>
                    <div className="absolute top-4 right-4 w-6 h-6 bg-purple-500 rounded-full"></div>
                    <div className="absolute bottom-3 left-4 w-4 h-4 bg-green-500 rounded-full"></div>
                    <div className="absolute bottom-4 right-2 w-10 h-10 bg-pink-500 rounded-full"></div>
                  </div>

                  {/* Content */}
                  <div className="relative z-10 text-center">
                    <div className="w-12 h-12 sm:w-14 sm:h-14 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center mx-auto mb-3 shadow-md">
                      <FaStore className="w-6 h-6 sm:w-7 sm:h-7 text-white" />
                    </div>
                    <h3 className="text-sm sm:text-base font-bold mb-2 text-gray-900">Quality Products</h3>
                    <p className="text-xs text-gray-600 mb-3 leading-relaxed">
                      Discover our curated collection
                    </p>
                    
                    {/* Stats - Smaller */}
                    <div className="grid grid-cols-2 gap-2 mt-4">
                      <div className="bg-gray-50 rounded-lg p-2 border border-gray-100">
                        <div className="text-sm sm:text-base font-bold text-gray-900">500+</div>
                        <div className="text-xs text-gray-600">Products</div>
                      </div>
                      <div className="bg-gray-50 rounded-lg p-2 border border-gray-100">
                        <div className="text-sm sm:text-base font-bold text-gray-900">99%</div>
                        <div className="text-xs text-gray-600">Satisfaction</div>
                      </div>
                    </div>
                  </div>

                  {/* Floating Elements - Smaller */}
                  <div className="absolute top-2 right-2 w-1.5 h-1.5 bg-blue-400 rounded-full animate-ping"></div>
                  <div className="absolute bottom-3 left-3 w-1 h-1 bg-purple-400 rounded-full animate-pulse animation-delay-1000"></div>
                </div>

                {/* Decorative Elements - Smaller */}
                <div className="absolute -top-2 -right-2 w-4 h-4 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-full animate-bounce"></div>
                <div className="absolute -bottom-2 -left-2 w-3 h-3 bg-gradient-to-br from-green-400 to-emerald-500 rounded-full animate-bounce animation-delay-1000"></div>
              </div>
            </ScrollAnimation>
          </div>
        </div>
      </section>
      </DynamicHomeSection>

      {/* Modern Testimonials Section */}
      <DynamicHomeSection sectionId="testimonials">
      <section className="py-10 sm:py-12 relative overflow-hidden z-10">
        {/* Animated Background Elements */}
        <div className="absolute inset-0">
          <div className="absolute top-10 left-10 w-24 h-24 bg-blue-500/10 rounded-full animate-pulse"></div>
          <div className="absolute top-20 right-20 w-16 h-16 bg-purple-500/10 rounded-full animate-pulse animation-delay-1000"></div>
          <div className="absolute bottom-10 left-1/3 w-12 h-12 bg-green-500/10 rounded-full animate-pulse animation-delay-2000"></div>
          <div className="absolute bottom-20 right-1/3 w-8 h-8 bg-pink-500/10 rounded-full animate-pulse animation-delay-3000"></div>
        </div>

        <div className="max-w-6xl mx-auto px-3 sm:px-4 lg:px-6 relative z-10">
          {/* Section Header */}
          <ScrollAnimation direction="up" delay={0}>
            <div className="text-center mb-8 sm:mb-10">
              <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 mb-3 sm:mb-4">
                What Our <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">Customers Say</span>
              </h2>
              <p className="text-sm sm:text-base text-gray-600 max-w-2xl mx-auto leading-relaxed">
                Join our growing community of satisfied customers and experience the difference
            </p>
          </div>
          </ScrollAnimation>

          {/* Testimonials Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
            {/* Testimonial 1 */}
            <ScrollAnimation direction="up" delay={200}>
              <div className="group relative bg-white rounded-xl sm:rounded-2xl p-4 sm:p-5 text-center border border-gray-200 hover:bg-gray-50 transition-all duration-500 transform hover:-translate-y-1 hover:scale-105 mobile-touch-feedback shadow-sm hover:shadow-md">
                {/* Animated Background */}
                <div className="absolute inset-0 bg-gradient-to-br from-blue-50 to-cyan-50 rounded-xl sm:rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                
                {/* Floating Elements */}
                <div className="absolute top-2 right-2 w-1.5 h-1.5 bg-blue-400 rounded-full animate-ping"></div>
                <div className="absolute bottom-3 left-3 w-1 h-1 bg-blue-300 rounded-full animate-pulse animation-delay-1000"></div>
                
                <div className="relative z-10">
                  {/* Quote Icon */}
                  <div className="relative mb-3 sm:mb-4">
                    <div className="w-8 h-8 sm:w-10 sm:h-10 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-xl flex items-center justify-center mx-auto group-hover:scale-110 group-hover:rotate-6 transition-all duration-500 shadow-md">
                      <FaQuoteLeft className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
                    </div>
                    {/* Glow Effect */}
                    <div className="absolute inset-0 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-xl blur-lg opacity-0 group-hover:opacity-40 transition-opacity duration-500"></div>
                  </div>

                  {/* Content */}
                  <div className="space-y-1.5">
                    <h3 className="text-lg sm:text-xl lg:text-2xl font-bold text-gray-900 group-hover:text-blue-600 transition-colors duration-300">
                      ⭐⭐⭐⭐⭐
                    </h3>
                    <p className="text-xs sm:text-sm text-gray-600 group-hover:text-gray-800 transition-colors duration-300 font-medium italic">
                      "Amazing quality and service!"
                    </p>
                    <div className="w-8 h-0.5 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-full mx-auto group-hover:w-12 transition-all duration-500"></div>
                    <p className="text-xs text-gray-500 font-semibold">Sarah Johnson</p>
                  </div>
                </div>
              </div>
            </ScrollAnimation>

            {/* Testimonial 2 */}
            <ScrollAnimation direction="up" delay={400}>
              <div className="group relative bg-white rounded-xl sm:rounded-2xl p-4 sm:p-5 text-center border border-gray-200 hover:bg-gray-50 transition-all duration-500 transform hover:-translate-y-1 hover:scale-105 mobile-touch-feedback shadow-sm hover:shadow-md">
                {/* Animated Background */}
                <div className="absolute inset-0 bg-gradient-to-br from-purple-50 to-pink-50 rounded-xl sm:rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                
                {/* Floating Elements */}
                <div className="absolute top-2 right-2 w-1.5 h-1.5 bg-purple-400 rounded-full animate-ping animation-delay-500"></div>
                <div className="absolute bottom-3 left-3 w-1 h-1 bg-purple-300 rounded-full animate-pulse animation-delay-1500"></div>
                
                <div className="relative z-10">
                  {/* Quote Icon */}
                  <div className="relative mb-3 sm:mb-4">
                    <div className="w-8 h-8 sm:w-10 sm:h-10 bg-gradient-to-br from-purple-500 to-pink-500 rounded-xl flex items-center justify-center mx-auto group-hover:scale-110 group-hover:rotate-6 transition-all duration-500 shadow-md">
                      <FaQuoteLeft className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
                    </div>
                    {/* Glow Effect */}
                    <div className="absolute inset-0 bg-gradient-to-br from-purple-500 to-pink-500 rounded-xl blur-lg opacity-0 group-hover:opacity-40 transition-opacity duration-500"></div>
                  </div>

                  {/* Content */}
                  <div className="space-y-1.5">
                    <h3 className="text-lg sm:text-xl lg:text-2xl font-bold text-gray-900 group-hover:text-purple-600 transition-colors duration-300">
                      ⭐⭐⭐⭐⭐
                    </h3>
                    <p className="text-xs sm:text-sm text-gray-600 group-hover:text-gray-800 transition-colors duration-300 font-medium italic">
                      "Outstanding support and selection!"
                    </p>
                    <div className="w-8 h-0.5 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full mx-auto group-hover:w-12 transition-all duration-500"></div>
                    <p className="text-xs text-gray-500 font-semibold">Jessica Fox</p>
                  </div>
                </div>
              </div>
            </ScrollAnimation>

            {/* Testimonial 3 */}
            <ScrollAnimation direction="up" delay={600}>
              <div className="group relative bg-white rounded-xl sm:rounded-2xl p-4 sm:p-5 text-center border border-gray-200 hover:bg-gray-50 transition-all duration-500 transform hover:-translate-y-1 hover:scale-105 mobile-touch-feedback shadow-sm hover:shadow-md md:col-span-2 lg:col-span-1">
                {/* Animated Background */}
                <div className="absolute inset-0 bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl sm:rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                
                {/* Floating Elements */}
                <div className="absolute top-2 right-2 w-1.5 h-1.5 bg-green-400 rounded-full animate-ping animation-delay-1000"></div>
                <div className="absolute bottom-3 left-3 w-1 h-1 bg-green-300 rounded-full animate-pulse animation-delay-2000"></div>
                
                <div className="relative z-10">
                  {/* Quote Icon */}
                  <div className="relative mb-3 sm:mb-4">
                    <div className="w-8 h-8 sm:w-10 sm:h-10 bg-gradient-to-br from-green-500 to-emerald-500 rounded-xl flex items-center justify-center mx-auto group-hover:scale-110 group-hover:rotate-6 transition-all duration-500 shadow-md">
                      <FaQuoteLeft className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
                    </div>
                    {/* Glow Effect */}
                    <div className="absolute inset-0 bg-gradient-to-br from-green-500 to-emerald-500 rounded-xl blur-lg opacity-0 group-hover:opacity-40 transition-opacity duration-500"></div>
                  </div>

                  {/* Content */}
                  <div className="space-y-1.5">
                    <h3 className="text-lg sm:text-xl lg:text-2xl font-bold text-gray-900 group-hover:text-green-600 transition-colors duration-300">
                      ⭐⭐⭐⭐⭐
                    </h3>
                    <p className="text-xs sm:text-sm text-gray-600 group-hover:text-gray-800 transition-colors duration-300 font-medium italic">
                      "Top-notch quality and service!"
                    </p>
                    <div className="w-8 h-0.5 bg-gradient-to-r from-green-500 to-emerald-500 rounded-full mx-auto group-hover:w-12 transition-all duration-500"></div>
                    <p className="text-xs text-gray-500 font-semibold">Briana Luke</p>
                  </div>
                </div>
              </div>
            </ScrollAnimation>
          </div>

          {/* Bottom CTA */}
          <ScrollAnimation direction="up" delay={800}>
            <div className="text-center mt-8 sm:mt-10">
              <p className="text-sm sm:text-base text-gray-600 mb-4 sm:mb-6">
                Join thousands of satisfied customers today
              </p>
              <Link
                to="/products"
                className="inline-flex items-center gap-2 px-6 sm:px-8 py-3 sm:py-4 bg-gradient-to-r from-blue-500 to-purple-600 text-white text-sm sm:text-base font-bold rounded-xl hover:from-blue-600 hover:to-purple-700 transition-all duration-300 transform hover:scale-105 hover:shadow-xl group mobile-touch-feedback"
              >
                <span>Start Shopping Now</span>
                <FaArrowRight className="w-4 h-4 sm:w-5 sm:h-5 group-hover:translate-x-2 transition-transform duration-300" />
              </Link>
            </div>
          </ScrollAnimation>
        </div>
      </section>
      </DynamicHomeSection>

      {/* Modern Final CTA Section */}
      <DynamicHomeSection sectionId="finalCTA">
      <section className="py-8 sm:py-10 relative overflow-hidden z-10">
        {/* Animated Background Elements - Same as Stats Section */}
        <div className="absolute inset-0">
          <div className="absolute top-10 left-10 w-24 h-24 bg-blue-500/10 rounded-full animate-pulse"></div>
          <div className="absolute top-20 right-20 w-16 h-16 bg-purple-500/10 rounded-full animate-pulse animation-delay-1000"></div>
          <div className="absolute bottom-10 left-1/3 w-12 h-12 bg-green-500/10 rounded-full animate-pulse animation-delay-2000"></div>
          <div className="absolute bottom-20 right-1/3 w-8 h-8 bg-pink-500/10 rounded-full animate-pulse animation-delay-3000"></div>
        </div>

        <div className="max-w-6xl mx-auto px-3 sm:px-4 lg:px-6 relative z-10">
          <ScrollAnimation direction="up" delay={0}>
            <div className="text-center">
              {/* Header */}
              <div className="mb-8 sm:mb-10">
                <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 mb-3 sm:mb-4 leading-tight">
                  Ready to Transform Your <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">Shopping Experience</span>?
          </h2>
                <p className="text-sm sm:text-base text-gray-600 max-w-2xl mx-auto leading-relaxed">
                  Join our growing community of satisfied customers and experience the difference
                </p>
              </div>

              {/* Stats Grid - Exactly Like Stats Section */}
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-8 sm:mb-10">
                <div className="group relative bg-white rounded-xl sm:rounded-2xl p-4 sm:p-5 text-center border border-gray-200 hover:bg-gray-50 transition-all duration-500 transform hover:-translate-y-1 hover:scale-105 mobile-touch-feedback shadow-sm hover:shadow-md">
                  <div className="absolute inset-0 bg-gradient-to-br from-blue-50 to-cyan-50 rounded-xl sm:rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                  <div className="absolute top-2 right-2 w-1.5 h-1.5 bg-blue-400 rounded-full animate-ping"></div>
                  <div className="absolute bottom-3 left-3 w-1 h-1 bg-blue-300 rounded-full animate-pulse animation-delay-1000"></div>
                  <div className="relative z-10">
                    <div className="relative mb-3 sm:mb-4">
                      <div className="w-8 h-8 sm:w-10 sm:h-10 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-xl flex items-center justify-center mx-auto group-hover:scale-110 group-hover:rotate-6 transition-all duration-500 shadow-md">
                        <FaShoppingBag className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
                      </div>
                      <div className="absolute inset-0 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-xl blur-lg opacity-0 group-hover:opacity-40 transition-opacity duration-500"></div>
                    </div>
                    <div className="space-y-1.5">
                      <h3 className="text-lg sm:text-xl lg:text-2xl font-bold text-gray-900 group-hover:text-blue-600 transition-colors duration-300">500+</h3>
                      <p className="text-xs sm:text-sm text-gray-600 group-hover:text-gray-800 transition-colors duration-300 font-medium">Premium Products</p>
                      <div className="w-8 h-0.5 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-full mx-auto group-hover:w-12 transition-all duration-500"></div>
                    </div>
                  </div>
                </div>

                <div className="group relative bg-white rounded-xl sm:rounded-2xl p-4 sm:p-5 text-center border border-gray-200 hover:bg-gray-50 transition-all duration-500 transform hover:-translate-y-1 hover:scale-105 mobile-touch-feedback shadow-sm hover:shadow-md">
                  <div className="absolute inset-0 bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl sm:rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                  <div className="absolute top-2 right-2 w-1.5 h-1.5 bg-green-400 rounded-full animate-ping animation-delay-500"></div>
                  <div className="absolute bottom-3 left-3 w-1 h-1 bg-green-300 rounded-full animate-pulse animation-delay-1500"></div>
                  <div className="relative z-10">
                    <div className="relative mb-3 sm:mb-4">
                      <div className="w-8 h-8 sm:w-10 sm:h-10 bg-gradient-to-br from-green-500 to-emerald-500 rounded-xl flex items-center justify-center mx-auto group-hover:scale-110 group-hover:rotate-6 transition-all duration-500 shadow-md">
                        <FaTruck className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
                      </div>
                      <div className="absolute inset-0 bg-gradient-to-br from-green-500 to-emerald-500 rounded-xl blur-lg opacity-0 group-hover:opacity-40 transition-opacity duration-500"></div>
                    </div>
                    <div className="space-y-1.5">
                      <h3 className="text-lg sm:text-xl lg:text-2xl font-bold text-gray-900 group-hover:text-green-600 transition-colors duration-300">Fast</h3>
                      <p className="text-xs sm:text-sm text-gray-600 group-hover:text-gray-800 transition-colors duration-300 font-medium">Free Shipping</p>
                      <div className="w-8 h-0.5 bg-gradient-to-r from-green-500 to-emerald-500 rounded-full mx-auto group-hover:w-12 transition-all duration-500"></div>
                    </div>
                  </div>
                </div>

                <div className="group relative bg-white rounded-xl sm:rounded-2xl p-4 sm:p-5 text-center border border-gray-200 hover:bg-gray-50 transition-all duration-500 transform hover:-translate-y-1 hover:scale-105 mobile-touch-feedback shadow-sm hover:shadow-md">
                  <div className="absolute inset-0 bg-gradient-to-br from-purple-50 to-pink-50 rounded-xl sm:rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                  <div className="absolute top-2 right-2 w-1.5 h-1.5 bg-purple-400 rounded-full animate-ping animation-delay-1000"></div>
                  <div className="absolute bottom-3 left-3 w-1 h-1 bg-purple-300 rounded-full animate-pulse animation-delay-2000"></div>
                  <div className="relative z-10">
                    <div className="relative mb-3 sm:mb-4">
                      <div className="w-8 h-8 sm:w-10 sm:h-10 bg-gradient-to-br from-purple-500 to-pink-500 rounded-xl flex items-center justify-center mx-auto group-hover:scale-110 group-hover:rotate-6 transition-all duration-500 shadow-md">
                        <FaHeart className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
                      </div>
                      <div className="absolute inset-0 bg-gradient-to-br from-purple-500 to-pink-500 rounded-xl blur-lg opacity-0 group-hover:opacity-40 transition-opacity duration-500"></div>
                    </div>
                    <div className="space-y-1.5">
                      <h3 className="text-lg sm:text-xl lg:text-2xl font-bold text-gray-900 group-hover:text-purple-600 transition-colors duration-300">99%</h3>
                      <p className="text-xs sm:text-sm text-gray-600 group-hover:text-gray-800 transition-colors duration-300 font-medium">Satisfaction Rate</p>
                      <div className="w-8 h-0.5 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full mx-auto group-hover:w-12 transition-all duration-500"></div>
                    </div>
                  </div>
                </div>

                <div className="group relative bg-white rounded-xl sm:rounded-2xl p-4 sm:p-5 text-center border border-gray-200 hover:bg-gray-50 transition-all duration-500 transform hover:-translate-y-1 hover:scale-105 mobile-touch-feedback shadow-sm hover:shadow-md col-span-2 lg:col-span-1">
                  <div className="absolute inset-0 bg-gradient-to-br from-amber-50 to-orange-50 rounded-xl sm:rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                  <div className="absolute top-2 right-2 w-1.5 h-1.5 bg-amber-400 rounded-full animate-ping animation-delay-1500"></div>
                  <div className="absolute bottom-3 left-3 w-1 h-1 bg-amber-300 rounded-full animate-pulse animation-delay-2500"></div>
                  <div className="relative z-10">
                    <div className="relative mb-3 sm:mb-4">
                      <div className="w-8 h-8 sm:w-10 sm:h-10 bg-gradient-to-br from-amber-500 to-orange-500 rounded-xl flex items-center justify-center mx-auto group-hover:scale-110 group-hover:rotate-6 transition-all duration-500 shadow-md">
                        <FaUsers className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
                      </div>
                      <div className="absolute inset-0 bg-gradient-to-br from-amber-500 to-orange-500 rounded-xl blur-lg opacity-0 group-hover:opacity-40 transition-opacity duration-500"></div>
                    </div>
                    <div className="space-y-1.5">
                      <h3 className="text-lg sm:text-xl lg:text-2xl font-bold text-gray-900 group-hover:text-amber-600 transition-colors duration-300">10K+</h3>
                      <p className="text-xs sm:text-sm text-gray-600 group-hover:text-gray-800 transition-colors duration-300 font-medium">Happy Customers</p>
                      <div className="w-8 h-0.5 bg-gradient-to-r from-amber-500 to-orange-500 rounded-full mx-auto group-hover:w-12 transition-all duration-500"></div>
                    </div>
                  </div>
                </div>
              </div>

              {/* CTA Buttons */}
              <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center items-center">
          <Link
            to="/products"
                  className="inline-flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-blue-500 to-purple-600 text-white text-sm sm:text-base font-bold rounded-xl hover:from-blue-600 hover:to-purple-700 transition-all duration-300 transform hover:scale-105 hover:shadow-xl group mobile-touch-feedback"
                >
                  <span>Start Shopping Now</span>
                  <FaArrowRight className="w-4 h-4 sm:w-5 sm:h-5 group-hover:translate-x-2 transition-transform duration-300" />
                </Link>
                <Link
                  to="/contact"
                  className="inline-flex items-center gap-2 px-8 py-4 bg-white text-gray-900 text-sm sm:text-base font-bold rounded-xl border-2 border-gray-300 hover:border-blue-500 hover:text-blue-600 transition-all duration-300 transform hover:scale-105 hover:shadow-xl group mobile-touch-feedback"
                >
                  <span>Get Help</span>
                  <FaInfoCircle className="w-4 h-4 sm:w-5 sm:h-5 group-hover:scale-110 transition-transform duration-300" />
          </Link>
              </div>

              {/* Trust Indicators */}
              <div className="mt-8 sm:mt-10 pt-6 border-t border-gray-300">
                <p className="text-gray-600 text-xs sm:text-sm mb-4">Trusted by customers worldwide</p>
                <div className="flex flex-wrap justify-center items-center gap-6 sm:gap-8 opacity-60">
                  <div className="text-gray-500 font-semibold text-xs sm:text-sm">10K+ Happy Customers</div>
                  <div className="text-gray-500 font-semibold text-xs sm:text-sm">500+ Products</div>
                  <div className="text-gray-500 font-semibold text-xs sm:text-sm">5+ Years Experience</div>
                  <div className="text-gray-500 font-semibold text-xs sm:text-sm">99% Satisfaction</div>
                </div>
              </div>
            </div>
          </ScrollAnimation>
        </div>
      </section>
      </DynamicHomeSection>

      {/* Footer */}
      <Footer />

      {/* Scroll to Top Button - Compact */}
    <button
        onClick={scrollToTop}
        className="fixed bottom-4 right-4 z-40 inline-flex h-10 w-10 items-center justify-center rounded-full text-white shadow-md transition-all duration-200 hover:scale-110 hover:shadow-lg"
        style={{background: 'var(--blue-gradient)'}}
        aria-label="Scroll to top"
      >
        <FaArrowUp className="w-4 h-4" />
    </button>
    </div>
  );
};

export default Home;

