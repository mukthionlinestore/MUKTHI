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
  FaArrowUp
} from 'react-icons/fa';
import ProductCard from '../components/products/ProductCard';
import Footer from '../components/layout/Footer';

const Home = () => {
  const [newArrivals, setNewArrivals] = useState([]);
  const [featuredProducts, setFeaturedProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchNewArrivals();
    fetchFeaturedProducts();
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

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-teal-50 to-cyan-50">
        {/* Hero Section */}
      <section className="relative h-80 sm:h-96 lg:h-[500px] overflow-hidden">
        {/* Background Image */}
        <div 
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{
            backgroundImage: `url('https://images.unsplash.com/photo-1441986300917-64674bd600d8?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80')`
          }}
        >
          {/* Overlay */}
          <div className="absolute inset-0 bg-gradient-to-r from-emerald-900/85 via-teal-800/75 to-cyan-800/65"></div>
        </div>
        
        {/* Content */}
        <div className="relative h-full flex items-center justify-center">
          <div className="text-center px-3 sm:px-4 lg:px-6 max-w-3xl mx-auto">
            <div className="inline-flex items-center gap-1.5 sm:gap-2 px-2.5 sm:px-3 py-1 sm:py-1.5 bg-emerald-500/20 backdrop-blur-sm rounded-full border border-emerald-400/30 mb-3 sm:mb-4">
              <FaFire className="w-2.5 h-2.5 sm:w-3 sm:h-3 text-emerald-300" />
              <span className="text-xs font-medium text-emerald-100">New Collection 2024</span>
            </div>
            
            <h1 className="text-2xl sm:text-3xl lg:text-5xl font-bold text-white mb-2 sm:mb-3 leading-tight">
              Discover Amazing
              <span className="block text-transparent bg-clip-text bg-gradient-to-r from-emerald-300 to-teal-300">
                Products
              </span>
              </h1>
            
            <p className="text-xs sm:text-sm lg:text-lg text-emerald-100 mb-4 sm:mb-6 max-w-xl mx-auto leading-relaxed">
              Explore our curated collection of premium products at unbeatable prices. 
              Quality meets affordability in every item.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-2 sm:gap-3 justify-center items-center">
                <Link
                  to="/products"
                className="inline-flex items-center gap-1.5 sm:gap-2 px-4 sm:px-6 py-2.5 sm:py-3 bg-gradient-to-r from-emerald-500 to-teal-500 text-white text-xs sm:text-sm font-semibold rounded-lg sm:rounded-xl hover:from-emerald-600 hover:to-teal-600 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-105"
                >
                  Shop Now
                <FaArrowRight className="w-2.5 h-2.5 sm:w-3 sm:h-3" />
                </Link>
              
              <button className="inline-flex items-center gap-1.5 sm:gap-2 px-4 sm:px-6 py-2.5 sm:py-3 bg-white/10 backdrop-blur-sm text-white text-xs sm:text-sm font-semibold rounded-lg sm:rounded-xl border border-white/20 hover:bg-white/20 transition-all duration-200">
                <FaPlay className="w-2.5 h-2.5 sm:w-3 sm:h-3" />
                Watch Video
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-4 sm:py-6 lg:py-8">
        <div className="max-w-6xl mx-auto px-3 sm:px-4 lg:px-6">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
            <div className="text-center p-3 sm:p-4 bg-white rounded-lg sm:rounded-xl shadow-sm border border-emerald-100">
              <div className="w-8 h-8 sm:w-10 sm:h-10 bg-gradient-to-r from-emerald-500 to-teal-500 rounded-lg sm:rounded-xl flex items-center justify-center mx-auto mb-2 sm:mb-3">
                <FaUsers className="w-3 h-3 sm:w-4 sm:h-4 text-white" />
              </div>
              <h3 className="text-lg sm:text-xl font-bold text-gray-900 mb-1">10K+</h3>
              <p className="text-xs text-gray-600">Happy Customers</p>
            </div>
            
            <div className="text-center p-3 sm:p-4 bg-white rounded-lg sm:rounded-xl shadow-sm border border-emerald-100">
              <div className="w-8 h-8 sm:w-10 sm:h-10 bg-gradient-to-r from-emerald-500 to-teal-500 rounded-lg sm:rounded-xl flex items-center justify-center mx-auto mb-2 sm:mb-3">
                <FaShoppingBag className="w-3 h-3 sm:w-4 sm:h-4 text-white" />
              </div>
              <h3 className="text-lg sm:text-xl font-bold text-gray-900 mb-1">500+</h3>
              <p className="text-xs text-gray-600">Products</p>
            </div>
            
            <div className="text-center p-3 sm:p-4 bg-white rounded-lg sm:rounded-xl shadow-sm border border-emerald-100">
              <div className="w-8 h-8 sm:w-10 sm:h-10 bg-gradient-to-r from-emerald-500 to-teal-500 rounded-lg sm:rounded-xl flex items-center justify-center mx-auto mb-2 sm:mb-3">
                <FaAward className="w-3 h-3 sm:w-4 sm:h-4 text-white" />
              </div>
              <h3 className="text-lg sm:text-xl font-bold text-gray-900 mb-1">5+</h3>
              <p className="text-xs text-gray-600">Years Experience</p>
            </div>
            
            <div className="text-center p-3 sm:p-4 bg-white rounded-lg sm:rounded-xl shadow-sm border border-emerald-100">
              <div className="w-8 h-8 sm:w-10 sm:h-10 bg-gradient-to-r from-emerald-500 to-teal-500 rounded-lg sm:rounded-xl flex items-center justify-center mx-auto mb-2 sm:mb-3">
                <FaHeart className="w-3 h-3 sm:w-4 sm:h-4 text-white" />
              </div>
              <h3 className="text-lg sm:text-xl font-bold text-gray-900 mb-1">99%</h3>
              <p className="text-xs text-gray-600">Satisfaction</p>
              </div>
            </div>
          </div>
        </section>

      {/* Features Section */}
      <section className="py-6 sm:py-8 lg:py-12">
        <div className="max-w-6xl mx-auto px-3 sm:px-4 lg:px-6">
          <div className="text-center mb-6 sm:mb-8">
            <h2 className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-900 mb-2">
              Why Choose Us
            </h2>
            <p className="text-xs sm:text-sm text-gray-600 max-w-2xl mx-auto">
              We provide the best shopping experience with premium quality products and exceptional service
            </p>
          </div>
          
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
            <div className="text-center p-3 sm:p-4 bg-white rounded-lg sm:rounded-xl shadow-sm border border-emerald-100 hover:shadow-md transition-all duration-200">
              <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-r from-emerald-500 to-teal-500 rounded-lg sm:rounded-xl flex items-center justify-center mx-auto mb-2 sm:mb-3">
                <FaTruck className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
              </div>
              <h3 className="text-xs sm:text-sm font-semibold text-gray-900 mb-1">Free Shipping</h3>
              <p className="text-xs text-gray-600">On orders over $50</p>
              </div>

            <div className="text-center p-3 sm:p-4 bg-white rounded-lg sm:rounded-xl shadow-sm border border-emerald-100 hover:shadow-md transition-all duration-200">
              <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-r from-emerald-500 to-teal-500 rounded-lg sm:rounded-xl flex items-center justify-center mx-auto mb-2 sm:mb-3">
                <FaShieldAlt className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
              </div>
              <h3 className="text-xs sm:text-sm font-semibold text-gray-900 mb-1">Secure Payment</h3>
              <p className="text-xs text-gray-600">100% secure checkout</p>
              </div>

            <div className="text-center p-3 sm:p-4 bg-white rounded-lg sm:rounded-xl shadow-sm border border-emerald-100 hover:shadow-md transition-all duration-200">
              <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-r from-emerald-500 to-teal-500 rounded-lg sm:rounded-xl flex items-center justify-center mx-auto mb-2 sm:mb-3">
                <FaGift className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
              </div>
              <h3 className="text-xs sm:text-sm font-semibold text-gray-900 mb-1">Easy Returns</h3>
              <p className="text-xs text-gray-600">30 day return policy</p>
            </div>

            <div className="text-center p-3 sm:p-4 bg-white rounded-lg sm:rounded-xl shadow-sm border border-emerald-100 hover:shadow-md transition-all duration-200">
              <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-r from-emerald-500 to-teal-500 rounded-lg sm:rounded-xl flex items-center justify-center mx-auto mb-2 sm:mb-3">
                <FaCreditCard className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
              </div>
              <h3 className="text-xs sm:text-sm font-semibold text-gray-900 mb-1">Multiple Payment</h3>
              <p className="text-xs text-gray-600">Credit card, PayPal</p>
            </div>
          </div>
          </div>
        </section>

      {/* New Arrivals Section */}
      <section className="py-6 sm:py-8 lg:py-12 bg-white">
        <div className="max-w-6xl mx-auto px-3 sm:px-4 lg:px-6">
          <div className="flex items-center justify-between mb-4 sm:mb-6">
            <div>
              <h2 className="text-lg sm:text-xl lg:text-2xl font-bold text-gray-900 mb-1 sm:mb-2 flex items-center gap-2">
                <FaGem className="w-4 h-4 sm:w-5 sm:h-5 text-emerald-500" />
                New Arrivals
              </h2>
              <p className="text-xs sm:text-sm text-gray-600">
                Discover the latest products added to our collection
              </p>
            </div>
            <Link
              to="/products"
              className="inline-flex items-center gap-1.5 sm:gap-2 px-3 sm:px-4 py-2 sm:py-2.5 bg-gradient-to-r from-emerald-500 to-teal-500 text-white text-xs sm:text-sm font-semibold rounded-lg sm:rounded-xl hover:from-emerald-600 hover:to-teal-600 transition-all duration-200 shadow-sm hover:shadow-md"
            >
              View All
              <FaArrowRight className="w-2.5 h-2.5 sm:w-3 sm:h-3" />
            </Link>
            </div>

              {loading ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 sm:gap-4">
              {Array.from({ length: 8 }).map((_, idx) => (
                <div key={idx} className="rounded-lg sm:rounded-xl border border-gray-200 bg-white p-3 sm:p-4 shadow-sm">
                  <div className="aspect-square w-full rounded-lg sm:rounded-xl bg-gray-100 animate-pulse" />
                  <div className="mt-3 h-3 sm:h-4 w-3/4 rounded bg-gray-100 animate-pulse" />
                  <div className="mt-2 h-3 sm:h-4 w-1/2 rounded bg-gray-100 animate-pulse" />
                  <div className="mt-3 h-8 sm:h-9 w-full rounded-lg bg-gray-100 animate-pulse" />
                </div>
              ))}
            </div>
          ) : newArrivals.filter(product => product.isNewProduct && product.quantity > 0 && !product.isSold).length > 0 ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 sm:gap-4">
              {newArrivals
                .filter(product => product.isNewProduct && product.quantity > 0 && !product.isSold)
                .map((product) => (
                    <ProductCard key={product._id} product={product} />
                  ))}
                </div>
          ) : (
            <div className="text-center py-8 sm:py-12">
              <div className="w-12 h-12 sm:w-16 sm:h-16 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-3 sm:mb-4">
                <FaStar className="w-6 h-6 sm:w-8 sm:h-8 text-emerald-600" />
              </div>
              <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-2">No New Arrivals Yet</h3>
              <p className="text-xs sm:text-sm text-gray-600 mb-4 sm:mb-6">
                Check back soon for the latest products!
              </p>
              <Link
                to="/products"
                className="inline-flex items-center gap-1.5 sm:gap-2 px-4 sm:px-6 py-2.5 sm:py-3 bg-gradient-to-r from-emerald-600 to-teal-600 text-white text-xs sm:text-sm font-semibold rounded-lg sm:rounded-xl hover:from-emerald-700 hover:to-teal-700 transition-all duration-200 shadow-lg hover:shadow-xl"
              >
                <FaEye className="w-2.5 h-2.5 sm:w-3 sm:h-3" />
                Browse All Products
              </Link>
            </div>
          )}
          </div>
        </section>

      {/* Featured Products Section */}
      <section className="py-6 sm:py-8 lg:py-12">
        <div className="max-w-6xl mx-auto px-3 sm:px-4 lg:px-6">
          <div className="flex items-center justify-between mb-4 sm:mb-6">
            <div>
              <h2 className="text-lg sm:text-xl lg:text-2xl font-bold text-gray-900 mb-1 sm:mb-2 flex items-center gap-2">
                <FaStar className="w-4 h-4 sm:w-5 sm:h-5 text-emerald-500" />
                Featured Products
              </h2>
              <p className="text-xs sm:text-sm text-gray-600">
                Our most popular and highly-rated products
              </p>
            </div>
            <Link
              to="/products"
              className="inline-flex items-center gap-1.5 sm:gap-2 px-3 sm:px-4 py-2 sm:py-2.5 bg-gradient-to-r from-emerald-500 to-teal-500 text-white text-xs sm:text-sm font-semibold rounded-lg sm:rounded-xl hover:from-emerald-600 hover:to-teal-600 transition-all duration-200 shadow-sm hover:shadow-md"
            >
              View All
              <FaArrowRight className="w-2.5 h-2.5 sm:w-3 sm:h-3" />
            </Link>
          </div>

          {featuredProducts.filter(product => product.isFeatured && product.quantity > 0 && !product.isSold).length > 0 ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 sm:gap-4">
              {featuredProducts
                .filter(product => product.isFeatured && product.quantity > 0 && !product.isSold)
                .map((product) => (
                  <ProductCard key={product._id} product={product} />
                ))}
              </div>
          ) : (
            <div className="text-center py-8 sm:py-12">
              <div className="w-12 h-12 sm:w-16 sm:h-16 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-3 sm:mb-4">
                <FaStar className="w-6 h-6 sm:w-8 sm:h-8 text-emerald-600" />
              </div>
              <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-2">No Featured Products Yet</h3>
              <p className="text-xs sm:text-sm text-gray-600 mb-4 sm:mb-6">
                Our featured products will appear here soon!
              </p>
              <Link
                to="/products"
                className="inline-flex items-center gap-1.5 sm:gap-2 px-4 sm:px-6 py-2.5 sm:py-3 bg-gradient-to-r from-emerald-600 to-teal-600 text-white text-xs sm:text-sm font-semibold rounded-lg sm:rounded-xl hover:from-emerald-700 hover:to-teal-700 transition-all duration-200 shadow-lg hover:shadow-xl"
              >
                <FaEye className="w-2.5 h-2.5 sm:w-3 sm:h-3" />
                Browse All Products
              </Link>
          </div>
        )}
      </div>
      </section>

      {/* CTA Section */}
      <section className="py-6 sm:py-8 lg:py-12 bg-gradient-to-r from-emerald-500 to-teal-500">
        <div className="max-w-4xl mx-auto px-3 sm:px-4 lg:px-6 text-center">
          <h2 className="text-lg sm:text-xl lg:text-2xl font-bold text-white mb-2 sm:mb-3">
            Ready to Start Shopping?
          </h2>
          <p className="text-xs sm:text-sm text-emerald-100 mb-4 sm:mb-6 max-w-2xl mx-auto">
            Join thousands of satisfied customers and discover amazing products at unbeatable prices
          </p>
          <Link
            to="/products"
            className="inline-flex items-center gap-1.5 sm:gap-2 px-4 sm:px-6 py-2.5 sm:py-3 bg-white text-emerald-600 text-xs sm:text-sm font-semibold rounded-lg sm:rounded-xl hover:bg-gray-50 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-105"
          >
            <FaStore className="w-2.5 h-2.5 sm:w-3 sm:h-3" />
            Explore Products
          </Link>
        </div>
      </section>

      {/* Footer */}
      <Footer />

      {/* Scroll to Top Button */}
    <button
        onClick={scrollToTop}
        className="fixed bottom-4 right-4 z-40 inline-flex h-8 w-8 sm:h-10 sm:w-10 items-center justify-center rounded-full bg-gradient-to-r from-emerald-500 to-teal-500 text-white shadow-lg hover:from-emerald-600 hover:to-teal-600 transition-all duration-200 hover:scale-110 hover:shadow-xl"
        aria-label="Scroll to top"
      >
        <FaArrowUp className="w-3 h-3 sm:w-4 sm:h-4" />
    </button>
    </div>
  );
};

export default Home;
