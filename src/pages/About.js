import React from 'react';
import { Link } from 'react-router-dom';
import { 
  FaArrowLeft,
  FaHeart,
  FaUsers,
  FaAward,
  FaShieldAlt,
  FaTruck,
  FaCreditCard,
  FaStar,
  FaMapMarkerAlt,
  FaPhone,
  FaEnvelope,
  FaGlobe,
  FaFacebook,
  FaTwitter,
  FaInstagram,
  FaLinkedin
} from 'react-icons/fa';

const About = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 to-teal-50">
      {/* Header Section */}
      <div className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-6">
          <div className="flex items-center gap-3 sm:gap-4">
            <Link
              to="/"
              className="inline-flex items-center justify-center h-8 w-8 sm:h-10 sm:w-10 rounded-lg bg-gray-100 hover:bg-gray-200 transition-colors"
            >
              <FaArrowLeft className="w-3 h-3 sm:w-4 sm:h-4 text-gray-600" />
            </Link>
            <div>
              <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-900">About Us</h1>
              <p className="text-xs sm:text-sm text-gray-600 mt-1">Learn more about our story and mission</p>
            </div>
          </div>
        </div>
      </div>

      {/* Hero Section */}
      <section className="relative py-12 sm:py-16 lg:py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 sm:px-4 sm:py-2 bg-emerald-500/10 rounded-full border border-emerald-200 mb-6 sm:mb-8">
              <FaHeart className="w-3 h-3 sm:w-4 sm:h-4 text-emerald-600" />
              <span className="text-xs sm:text-sm font-medium text-emerald-700">Established 2024</span>
            </div>
            
            <h2 className="text-2xl sm:text-3xl lg:text-5xl font-bold text-gray-900 mb-4 sm:mb-6 leading-tight">
              We're Passionate About
              <span className="block text-transparent bg-clip-text bg-gradient-to-r from-emerald-600 to-teal-600">
                Quality & Innovation
              </span>
            </h2>
            
            <p className="text-sm sm:text-lg lg:text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
              At E-Shop, we believe in delivering exceptional products that enhance your lifestyle. 
              Our commitment to quality, innovation, and customer satisfaction drives everything we do.
            </p>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-8 sm:py-12 lg:py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 sm:gap-6 lg:gap-8">
            <div className="text-center">
              <div className="w-12 h-12 sm:w-16 sm:h-16 bg-gradient-to-r from-emerald-500 to-teal-500 rounded-xl flex items-center justify-center mx-auto mb-3 sm:mb-4">
                <FaUsers className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
              </div>
              <h3 className="text-lg sm:text-xl lg:text-2xl font-bold text-gray-900 mb-1">10K+</h3>
              <p className="text-xs sm:text-sm text-gray-600">Happy Customers</p>
            </div>
            
            <div className="text-center">
              <div className="w-12 h-12 sm:w-16 sm:h-16 bg-gradient-to-r from-emerald-500 to-teal-500 rounded-xl flex items-center justify-center mx-auto mb-3 sm:mb-4">
                <FaAward className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
              </div>
              <h3 className="text-lg sm:text-xl lg:text-2xl font-bold text-gray-900 mb-1">500+</h3>
              <p className="text-xs sm:text-sm text-gray-600">Products</p>
            </div>
            
            <div className="text-center">
              <div className="w-12 h-12 sm:w-16 sm:h-16 bg-gradient-to-r from-emerald-500 to-teal-500 rounded-xl flex items-center justify-center mx-auto mb-3 sm:mb-4">
                <FaStar className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
              </div>
              <h3 className="text-lg sm:text-xl lg:text-2xl font-bold text-gray-900 mb-1">4.9</h3>
              <p className="text-xs sm:text-sm text-gray-600">Average Rating</p>
            </div>
            
            <div className="text-center">
              <div className="w-12 h-12 sm:w-16 sm:h-16 bg-gradient-to-r from-emerald-500 to-teal-500 rounded-xl flex items-center justify-center mx-auto mb-3 sm:mb-4">
                <FaShieldAlt className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
              </div>
              <h3 className="text-lg sm:text-xl lg:text-2xl font-bold text-gray-900 mb-1">100%</h3>
              <p className="text-xs sm:text-sm text-gray-600">Secure</p>
            </div>
          </div>
        </div>
      </section>

      {/* Mission & Vision Section */}
      <section className="py-8 sm:py-12 lg:py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 sm:gap-12 lg:gap-16">
            {/* Mission */}
            <div className="bg-white rounded-xl sm:rounded-2xl p-6 sm:p-8 lg:p-10 shadow-sm border border-gray-100">
              <div className="w-12 h-12 sm:w-16 sm:h-16 bg-gradient-to-r from-emerald-500 to-teal-500 rounded-xl flex items-center justify-center mb-4 sm:mb-6">
                <FaHeart className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
              </div>
              <h3 className="text-lg sm:text-xl lg:text-2xl font-bold text-gray-900 mb-3 sm:mb-4">Our Mission</h3>
              <p className="text-sm sm:text-base lg:text-lg text-gray-600 leading-relaxed">
                To provide our customers with the highest quality products at competitive prices, 
                while delivering exceptional service and creating lasting relationships built on trust and satisfaction.
              </p>
            </div>

            {/* Vision */}
            <div className="bg-white rounded-xl sm:rounded-2xl p-6 sm:p-8 lg:p-10 shadow-sm border border-gray-100">
              <div className="w-12 h-12 sm:w-16 sm:h-16 bg-gradient-to-r from-emerald-500 to-teal-500 rounded-xl flex items-center justify-center mb-4 sm:mb-6">
                <FaGlobe className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
              </div>
              <h3 className="text-lg sm:text-xl lg:text-2xl font-bold text-gray-900 mb-3 sm:mb-4">Our Vision</h3>
              <p className="text-sm sm:text-base lg:text-lg text-gray-600 leading-relaxed">
                To become the leading destination for quality products, innovation, and customer satisfaction, 
                setting new standards in the e-commerce industry while making a positive impact on our community.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="py-8 sm:py-12 lg:py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-8 sm:mb-12">
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
              Our Core Values
            </h2>
            <p className="text-sm sm:text-base lg:text-lg text-gray-600 max-w-2xl mx-auto">
              These principles guide everything we do and shape our relationship with customers, partners, and the community.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
            <div className="bg-white rounded-xl sm:rounded-2xl p-6 sm:p-8 shadow-sm border border-gray-100 text-center">
              <div className="w-12 h-12 sm:w-16 sm:h-16 bg-gradient-to-r from-emerald-500 to-teal-500 rounded-xl flex items-center justify-center mx-auto mb-4 sm:mb-6">
                <FaShieldAlt className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
              </div>
              <h3 className="text-lg sm:text-xl font-bold text-gray-900 mb-2 sm:mb-3">Quality</h3>
              <p className="text-sm sm:text-base text-gray-600">
                We never compromise on quality. Every product in our collection meets the highest standards.
              </p>
            </div>

            <div className="bg-white rounded-xl sm:rounded-2xl p-6 sm:p-8 shadow-sm border border-gray-100 text-center">
              <div className="w-12 h-12 sm:w-16 sm:h-16 bg-gradient-to-r from-emerald-500 to-teal-500 rounded-xl flex items-center justify-center mx-auto mb-4 sm:mb-6">
                <FaHeart className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
              </div>
              <h3 className="text-lg sm:text-xl font-bold text-gray-900 mb-2 sm:mb-3">Customer First</h3>
              <p className="text-sm sm:text-base text-gray-600">
                Our customers are at the heart of everything we do. Their satisfaction is our top priority.
              </p>
            </div>

            <div className="bg-white rounded-xl sm:rounded-2xl p-6 sm:p-8 shadow-sm border border-gray-100 text-center">
              <div className="w-12 h-12 sm:w-16 sm:h-16 bg-gradient-to-r from-emerald-500 to-teal-500 rounded-xl flex items-center justify-center mx-auto mb-4 sm:mb-6">
                <FaAward className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
              </div>
              <h3 className="text-lg sm:text-xl font-bold text-gray-900 mb-2 sm:mb-3">Excellence</h3>
              <p className="text-sm sm:text-base text-gray-600">
                We strive for excellence in every aspect of our business, from product selection to customer service.
              </p>
            </div>

            <div className="bg-white rounded-xl sm:rounded-2xl p-6 sm:p-8 shadow-sm border border-gray-100 text-center">
              <div className="w-12 h-12 sm:w-16 sm:h-16 bg-gradient-to-r from-emerald-500 to-teal-500 rounded-xl flex items-center justify-center mx-auto mb-4 sm:mb-6">
                <FaTruck className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
              </div>
              <h3 className="text-lg sm:text-xl font-bold text-gray-900 mb-2 sm:mb-3">Reliability</h3>
              <p className="text-sm sm:text-base text-gray-600">
                You can count on us to deliver on our promises, every time, with reliable service and support.
              </p>
            </div>

            <div className="bg-white rounded-xl sm:rounded-2xl p-6 sm:p-8 shadow-sm border border-gray-100 text-center">
              <div className="w-12 h-12 sm:w-16 sm:h-16 bg-gradient-to-r from-emerald-500 to-teal-500 rounded-xl flex items-center justify-center mx-auto mb-4 sm:mb-6">
                <FaCreditCard className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
              </div>
              <h3 className="text-lg sm:text-xl font-bold text-gray-900 mb-2 sm:mb-3">Transparency</h3>
              <p className="text-sm sm:text-base text-gray-600">
                We believe in honest, transparent communication and fair pricing for all our customers.
              </p>
            </div>

            <div className="bg-white rounded-xl sm:rounded-2xl p-6 sm:p-8 shadow-sm border border-gray-100 text-center">
              <div className="w-12 h-12 sm:w-16 sm:h-16 bg-gradient-to-r from-emerald-500 to-teal-500 rounded-xl flex items-center justify-center mx-auto mb-4 sm:mb-6">
                <FaUsers className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
              </div>
              <h3 className="text-lg sm:text-xl font-bold text-gray-900 mb-2 sm:mb-3">Community</h3>
              <p className="text-sm sm:text-base text-gray-600">
                We're committed to building a strong community and supporting local initiatives.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section className="py-8 sm:py-12 lg:py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white rounded-xl sm:rounded-2xl p-6 sm:p-8 lg:p-10 shadow-sm border border-gray-100">
            <div className="text-center mb-8 sm:mb-12">
              <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
                Get in Touch
              </h2>
              <p className="text-sm sm:text-base lg:text-lg text-gray-600 max-w-2xl mx-auto">
                Have questions? We'd love to hear from you. Send us a message and we'll respond as soon as possible.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
              <div className="text-center">
                <div className="w-12 h-12 sm:w-16 sm:h-16 bg-gradient-to-r from-emerald-500 to-teal-500 rounded-xl flex items-center justify-center mx-auto mb-4">
                  <FaMapMarkerAlt className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
                </div>
                <h3 className="text-lg sm:text-xl font-bold text-gray-900 mb-2">Address</h3>
                <p className="text-sm sm:text-base text-gray-600">
                  123 E-Shop Street<br />
                  Shopping District<br />
                  City, State 12345
                </p>
              </div>

              <div className="text-center">
                <div className="w-12 h-12 sm:w-16 sm:h-16 bg-gradient-to-r from-emerald-500 to-teal-500 rounded-xl flex items-center justify-center mx-auto mb-4">
                  <FaPhone className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
                </div>
                <h3 className="text-lg sm:text-xl font-bold text-gray-900 mb-2">Phone</h3>
                <p className="text-sm sm:text-base text-gray-600">
                  +1 (555) 123-4567<br />
                  Mon-Fri 9AM-6PM
                </p>
              </div>

              <div className="text-center">
                <div className="w-12 h-12 sm:w-16 sm:h-16 bg-gradient-to-r from-emerald-500 to-teal-500 rounded-xl flex items-center justify-center mx-auto mb-4">
                  <FaEnvelope className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
                </div>
                <h3 className="text-lg sm:text-xl font-bold text-gray-900 mb-2">Email</h3>
                <p className="text-sm sm:text-base text-gray-600">
                  hello@eshop.com<br />
                  support@eshop.com
                </p>
              </div>
            </div>

            {/* Social Media */}
            <div className="mt-8 sm:mt-12 text-center">
              <h3 className="text-lg sm:text-xl font-bold text-gray-900 mb-4">Follow Us</h3>
              <div className="flex justify-center gap-4">
                <a href="#" className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-r from-emerald-500 to-teal-500 rounded-xl flex items-center justify-center hover:scale-110 transition-transform">
                  <FaFacebook className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
                </a>
                <a href="#" className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-r from-emerald-500 to-teal-500 rounded-xl flex items-center justify-center hover:scale-110 transition-transform">
                  <FaTwitter className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
                </a>
                <a href="#" className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-r from-emerald-500 to-teal-500 rounded-xl flex items-center justify-center hover:scale-110 transition-transform">
                  <FaInstagram className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
                </a>
                <a href="#" className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-r from-emerald-500 to-teal-500 rounded-xl flex items-center justify-center hover:scale-110 transition-transform">
                  <FaLinkedin className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default About;
