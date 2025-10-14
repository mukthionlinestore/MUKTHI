import React from 'react';
import { useWebsiteConfig } from '../context/WebsiteConfigContext';
import { useFooter } from '../context/FooterContext';
import { 
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
  FaLinkedin,
  FaClock
} from 'react-icons/fa';

const About = () => {
  const { config } = useWebsiteConfig();
  const { footerData } = useFooter();

  return (
    <div className="min-h-screen relative">

      {/* Hero Section */}
      <section className="py-6 sm:py-8 lg:py-12 relative overflow-hidden z-10">
        {/* Animated Background Elements */}
        <div className="absolute inset-0">
          <div className="absolute top-4 left-4 w-12 h-12 bg-blue-500/10 rounded-full animate-pulse"></div>
          <div className="absolute top-8 right-8 w-8 h-8 bg-purple-500/10 rounded-full animate-pulse animation-delay-1000"></div>
          <div className="absolute bottom-4 left-1/4 w-10 h-10 bg-pink-500/10 rounded-full animate-pulse animation-delay-2000"></div>
          <div className="absolute bottom-8 right-1/3 w-6 h-6 bg-green-500/10 rounded-full animate-pulse animation-delay-3000"></div>
        </div>
        <div className="max-w-6xl mx-auto px-3 sm:px-4 lg:px-6 relative z-10">
          <div className="text-center">
            <div className="inline-flex items-center gap-1.5 px-2.5 py-1 sm:px-3 sm:py-1.5 rounded-full border border-blue-200 bg-blue-50 mb-4 sm:mb-6">
              <FaHeart className="w-2.5 h-2.5 sm:w-3 sm:h-3 text-blue-600" />
              <span className="text-xs font-medium text-blue-600">Established 2024</span>
            </div>
            
            <h2 className="text-xl sm:text-2xl lg:text-3xl font-bold mb-3 sm:mb-4 leading-tight text-gray-900">
              We're Passionate About
              <span className="block bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                Quality & Innovation
              </span>
            </h2>
            
            <p className="text-xs sm:text-sm lg:text-base max-w-2xl mx-auto leading-relaxed text-gray-600">
              At MUKHTI, we believe in delivering exceptional products that enhance your lifestyle. 
              Our commitment to quality, innovation, and customer satisfaction drives everything we do.
            </p>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-4 sm:py-6 lg:py-8 relative overflow-hidden z-10">
        {/* Animated Background Elements */}
        <div className="absolute inset-0">
          <div className="absolute top-4 left-4 w-12 h-12 bg-blue-500/10 rounded-full animate-pulse"></div>
          <div className="absolute top-8 right-8 w-8 h-8 bg-purple-500/10 rounded-full animate-pulse animation-delay-1000"></div>
          <div className="absolute bottom-4 left-1/4 w-10 h-10 bg-pink-500/10 rounded-full animate-pulse animation-delay-2000"></div>
          <div className="absolute bottom-8 right-1/3 w-6 h-6 bg-green-500/10 rounded-full animate-pulse animation-delay-3000"></div>
        </div>
        <div className="max-w-5xl mx-auto px-3 sm:px-4 lg:px-6 relative z-10">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4 lg:gap-6">
            <div className="text-center">
              <div className="w-8 h-8 sm:w-10 sm:h-10 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg flex items-center justify-center mx-auto mb-2 sm:mb-3">
                <FaUsers className="w-3 h-3 sm:w-4 sm:h-4 text-white" />
              </div>
              <h3 className="text-sm sm:text-base lg:text-lg font-bold mb-1 text-gray-900">10K+</h3>
              <p className="text-xs text-gray-600">Happy Customers</p>
            </div>
            
            <div className="text-center">
              <div className="w-8 h-8 sm:w-10 sm:h-10 bg-gradient-to-r from-purple-600 to-cyan-600 rounded-lg flex items-center justify-center mx-auto mb-2 sm:mb-3">
                <FaAward className="w-3 h-3 sm:w-4 sm:h-4 text-white" />
              </div>
              <h3 className="text-sm sm:text-base lg:text-lg font-bold mb-1 text-gray-900">500+</h3>
              <p className="text-xs text-gray-600">Products</p>
            </div>
            
            <div className="text-center">
              <div className="w-8 h-8 sm:w-10 sm:h-10 bg-gradient-to-r from-cyan-600 to-blue-600 rounded-lg flex items-center justify-center mx-auto mb-2 sm:mb-3">
                <FaStar className="w-3 h-3 sm:w-4 sm:h-4 text-white" />
              </div>
              <h3 className="text-sm sm:text-base lg:text-lg font-bold mb-1 text-gray-900">4.9</h3>
              <p className="text-xs text-gray-600">Average Rating</p>
            </div>
            
            <div className="text-center">
              <div className="w-8 h-8 sm:w-10 sm:h-10 bg-gradient-to-r from-green-600 to-emerald-600 rounded-lg flex items-center justify-center mx-auto mb-2 sm:mb-3">
                <FaShieldAlt className="w-3 h-3 sm:w-4 sm:h-4 text-white" />
              </div>
              <h3 className="text-sm sm:text-base lg:text-lg font-bold mb-1 text-gray-900">100%</h3>
              <p className="text-xs text-gray-600">Secure</p>
            </div>
          </div>
        </div>
      </section>

      {/* Mission & Vision Section */}
      <section className="py-4 sm:py-6 lg:py-8 relative overflow-hidden z-10">
        {/* Animated Background Elements */}
        <div className="absolute inset-0">
          <div className="absolute top-4 left-4 w-12 h-12 bg-blue-500/10 rounded-full animate-pulse"></div>
          <div className="absolute top-8 right-8 w-8 h-8 bg-purple-500/10 rounded-full animate-pulse animation-delay-1000"></div>
          <div className="absolute bottom-4 left-1/4 w-10 h-10 bg-pink-500/10 rounded-full animate-pulse animation-delay-2000"></div>
          <div className="absolute bottom-8 right-1/3 w-6 h-6 bg-green-500/10 rounded-full animate-pulse animation-delay-3000"></div>
        </div>
        <div className="max-w-5xl mx-auto px-3 sm:px-4 lg:px-6 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6 lg:gap-8">
            {/* Mission */}
            <div className="bg-white rounded-lg sm:rounded-xl p-4 sm:p-6 lg:p-8 shadow-sm border border-gray-100">
              <div className="w-8 h-8 sm:w-10 sm:h-10 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg flex items-center justify-center mb-3 sm:mb-4">
                <FaHeart className="w-3 h-3 sm:w-4 sm:h-4 text-white" />
              </div>
              <h3 className="text-base sm:text-lg lg:text-xl font-bold text-gray-900 mb-2 sm:mb-3">Our Mission</h3>
              <p className="text-xs sm:text-sm lg:text-base text-gray-600 leading-relaxed">
                To provide our customers with the highest quality products at competitive prices, 
                while delivering exceptional service and creating lasting relationships built on trust and satisfaction.
              </p>
            </div>

            {/* Vision */}
            <div className="bg-white rounded-lg sm:rounded-xl p-4 sm:p-6 lg:p-8 shadow-sm border border-gray-100">
              <div className="w-8 h-8 sm:w-10 sm:h-10 bg-gradient-to-r from-purple-600 to-cyan-600 rounded-lg flex items-center justify-center mb-3 sm:mb-4">
                <FaGlobe className="w-3 h-3 sm:w-4 sm:h-4 text-white" />
              </div>
              <h3 className="text-base sm:text-lg lg:text-xl font-bold text-gray-900 mb-2 sm:mb-3">Our Vision</h3>
              <p className="text-xs sm:text-sm lg:text-base text-gray-600 leading-relaxed">
                To become the leading destination for quality products, innovation, and customer satisfaction, 
                setting new standards in the e-commerce industry while making a positive impact on our community.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="py-4 sm:py-6 lg:py-8 relative overflow-hidden z-10">
        {/* Animated Background Elements */}
        <div className="absolute inset-0">
          <div className="absolute top-4 left-4 w-12 h-12 bg-blue-500/10 rounded-full animate-pulse"></div>
          <div className="absolute top-8 right-8 w-8 h-8 bg-purple-500/10 rounded-full animate-pulse animation-delay-1000"></div>
          <div className="absolute bottom-4 left-1/4 w-10 h-10 bg-pink-500/10 rounded-full animate-pulse animation-delay-2000"></div>
          <div className="absolute bottom-8 right-1/3 w-6 h-6 bg-green-500/10 rounded-full animate-pulse animation-delay-3000"></div>
        </div>
        <div className="max-w-5xl mx-auto px-3 sm:px-4 lg:px-6 relative z-10">
          <div className="text-center mb-4 sm:mb-6">
            <h2 className="text-lg sm:text-xl lg:text-2xl font-bold text-gray-900 mb-2 sm:mb-3">
              Our Core Values
            </h2>
            <p className="text-xs sm:text-sm lg:text-base text-gray-600 max-w-xl mx-auto">
              These principles guide everything we do and shape our relationship with customers, partners, and the community.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4 lg:gap-6">
            <div className="bg-white rounded-lg sm:rounded-xl p-3 sm:p-4 lg:p-6 shadow-sm border border-gray-100 text-center">
              <div className="w-8 h-8 sm:w-10 sm:h-10 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg flex items-center justify-center mx-auto mb-2 sm:mb-3">
                <FaShieldAlt className="w-3 h-3 sm:w-4 sm:h-4 text-white" />
              </div>
              <h3 className="text-sm sm:text-base font-bold text-gray-900 mb-1 sm:mb-2">Quality</h3>
              <p className="text-xs sm:text-sm text-gray-600">
                We never compromise on quality. Every product in our collection meets the highest standards.
              </p>
            </div>

            <div className="bg-white rounded-lg sm:rounded-xl p-3 sm:p-4 lg:p-6 shadow-sm border border-gray-100 text-center">
              <div className="w-8 h-8 sm:w-10 sm:h-10 bg-gradient-to-r from-purple-600 to-cyan-600 rounded-lg flex items-center justify-center mx-auto mb-2 sm:mb-3">
                <FaHeart className="w-3 h-3 sm:w-4 sm:h-4 text-white" />
              </div>
              <h3 className="text-sm sm:text-base font-bold text-gray-900 mb-1 sm:mb-2">Customer First</h3>
              <p className="text-xs sm:text-sm text-gray-600">
                Our customers are at the heart of everything we do. Their satisfaction is our top priority.
              </p>
            </div>

            <div className="bg-white rounded-lg sm:rounded-xl p-3 sm:p-4 lg:p-6 shadow-sm border border-gray-100 text-center">
              <div className="w-8 h-8 sm:w-10 sm:h-10 bg-gradient-to-r from-cyan-600 to-blue-600 rounded-lg flex items-center justify-center mx-auto mb-2 sm:mb-3">
                <FaAward className="w-3 h-3 sm:w-4 sm:h-4 text-white" />
              </div>
              <h3 className="text-sm sm:text-base font-bold text-gray-900 mb-1 sm:mb-2">Excellence</h3>
              <p className="text-xs sm:text-sm text-gray-600">
                We strive for excellence in every aspect of our business, from product selection to customer service.
              </p>
            </div>

            <div className="bg-white rounded-lg sm:rounded-xl p-3 sm:p-4 lg:p-6 shadow-sm border border-gray-100 text-center">
              <div className="w-8 h-8 sm:w-10 sm:h-10 bg-gradient-to-r from-green-600 to-emerald-600 rounded-lg flex items-center justify-center mx-auto mb-2 sm:mb-3">
                <FaTruck className="w-3 h-3 sm:w-4 sm:h-4 text-white" />
              </div>
              <h3 className="text-sm sm:text-base font-bold text-gray-900 mb-1 sm:mb-2">Reliability</h3>
              <p className="text-xs sm:text-sm text-gray-600">
                You can count on us to deliver on our promises, every time, with reliable service and support.
              </p>
            </div>

            <div className="bg-white rounded-lg sm:rounded-xl p-3 sm:p-4 lg:p-6 shadow-sm border border-gray-100 text-center">
              <div className="w-8 h-8 sm:w-10 sm:h-10 bg-gradient-to-r from-indigo-600 to-purple-600 rounded-lg flex items-center justify-center mx-auto mb-2 sm:mb-3">
                <FaCreditCard className="w-3 h-3 sm:w-4 sm:h-4 text-white" />
              </div>
              <h3 className="text-sm sm:text-base font-bold text-gray-900 mb-1 sm:mb-2">Transparency</h3>
              <p className="text-xs sm:text-sm text-gray-600">
                We believe in honest, transparent communication and fair pricing for all our customers.
              </p>
            </div>

            <div className="bg-white rounded-lg sm:rounded-xl p-3 sm:p-4 lg:p-6 shadow-sm border border-gray-100 text-center">
              <div className="w-8 h-8 sm:w-10 sm:h-10 bg-gradient-to-r from-pink-600 to-rose-600 rounded-lg flex items-center justify-center mx-auto mb-2 sm:mb-3">
                <FaUsers className="w-3 h-3 sm:w-4 sm:h-4 text-white" />
              </div>
              <h3 className="text-sm sm:text-base font-bold text-gray-900 mb-1 sm:mb-2">Community</h3>
              <p className="text-xs sm:text-sm text-gray-600">
                We're committed to building a strong community and supporting local initiatives.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section className="py-4 sm:py-6 lg:py-8 relative overflow-hidden z-10">
        {/* Animated Background Elements */}
        <div className="absolute inset-0">
          <div className="absolute top-4 left-4 w-12 h-12 bg-blue-500/10 rounded-full animate-pulse"></div>
          <div className="absolute top-8 right-8 w-8 h-8 bg-purple-500/10 rounded-full animate-pulse animation-delay-1000"></div>
          <div className="absolute bottom-4 left-1/4 w-10 h-10 bg-pink-500/10 rounded-full animate-pulse animation-delay-2000"></div>
          <div className="absolute bottom-8 right-1/3 w-6 h-6 bg-green-500/10 rounded-full animate-pulse animation-delay-3000"></div>
        </div>
        <div className="max-w-5xl mx-auto px-3 sm:px-4 lg:px-6 relative z-10">
          <div className="bg-white rounded-lg sm:rounded-xl p-4 sm:p-6 lg:p-8 shadow-sm border border-gray-100">
            <div className="text-center mb-4 sm:mb-6">
              <h2 className="text-lg sm:text-xl lg:text-2xl font-bold text-gray-900 mb-2 sm:mb-3">
                Get in Touch
              </h2>
              <p className="text-xs sm:text-sm lg:text-base text-gray-600 max-w-xl mx-auto">
                Have questions? We'd love to hear from you. Send us a message and we'll respond as soon as possible.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4 lg:gap-6">
              <div className="text-center">
                <div className="w-8 h-8 sm:w-10 sm:h-10 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg flex items-center justify-center mx-auto mb-2 sm:mb-3">
                  <FaMapMarkerAlt className="w-3 h-3 sm:w-4 sm:h-4 text-white" />
                </div>
                <h3 className="text-sm sm:text-base font-bold text-gray-900 mb-1 sm:mb-2">Address</h3>
                <p className="text-xs sm:text-sm text-gray-600">
                  {config?.contactAddress || (footerData.address ? `${footerData.address.street}, ${footerData.address.city}, ${footerData.address.state} ${footerData.address.zipCode}, ${footerData.address.country}` : '123 Business St, City, State 12345')}
                </p>
              </div>

              {(config?.contactPhone || footerData.contact?.phone) && (
                <div className="text-center">
                  <div className="w-8 h-8 sm:w-10 sm:h-10 bg-gradient-to-r from-purple-600 to-cyan-600 rounded-lg flex items-center justify-center mx-auto mb-2 sm:mb-3">
                    <FaPhone className="w-3 h-3 sm:w-4 sm:h-4 text-white" />
                  </div>
                  <h3 className="text-sm sm:text-base font-bold text-gray-900 mb-1 sm:mb-2">Phone</h3>
                  <p className="text-xs sm:text-sm text-gray-600">
                    <a 
                      href={`tel:${config?.contactPhone || footerData.contact?.phone}`}
                      className="hover:text-cyan-600 transition-colors duration-200"
                    >
                      {config?.contactPhone || footerData.contact?.phone}
                    </a>
                    {(config?.businessHours || footerData.businessHours) && (
                      <>
                        <br />
                        {config?.businessHours || footerData.businessHours}
                      </>
                    )}
                  </p>
                </div>
              )}

              {(config?.contactEmail || footerData.contact?.email) && (
                <div className="text-center">
                  <div className="w-8 h-8 sm:w-10 sm:h-10 bg-gradient-to-r from-cyan-600 to-blue-600 rounded-lg flex items-center justify-center mx-auto mb-2 sm:mb-3">
                    <FaEnvelope className="w-3 h-3 sm:w-4 sm:h-4 text-white" />
                  </div>
                  <h3 className="text-sm sm:text-base font-bold text-gray-900 mb-1 sm:mb-2">Email</h3>
                  <p className="text-xs sm:text-sm text-gray-600">
                    <a 
                      href={`mailto:${config?.contactEmail || footerData.contact?.email}`}
                      className="hover:text-cyan-600 transition-colors duration-200"
                    >
                      {config?.contactEmail || footerData.contact?.email}
                    </a>
                  </p>
                </div>
              )}
            </div>

            {/* Social Media */}
            <div className="mt-4 sm:mt-6 text-center">
              <h3 className="text-sm sm:text-base font-bold text-gray-900 mb-2 sm:mb-3">Follow Us</h3>
              <div className="flex justify-center gap-2 sm:gap-3">
                {(config?.socialMedia?.facebook || footerData.socialMedia?.facebook) && (
                  <a 
                    href={config?.socialMedia?.facebook || footerData.socialMedia?.facebook}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label="Facebook"
                    className="w-8 h-8 sm:w-10 sm:h-10 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg flex items-center justify-center hover:scale-110 transition-transform"
                  >
                    <FaFacebook className="w-3 h-3 sm:w-4 sm:h-4 text-white" />
                  </a>
                )}
                {(config?.socialMedia?.twitter || footerData.socialMedia?.twitter) && (
                  <a 
                    href={config?.socialMedia?.twitter || footerData.socialMedia?.twitter}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label="Twitter"
                    className="w-8 h-8 sm:w-10 sm:h-10 bg-gradient-to-r from-purple-600 to-cyan-600 rounded-lg flex items-center justify-center hover:scale-110 transition-transform"
                  >
                    <FaTwitter className="w-3 h-3 sm:w-4 sm:h-4 text-white" />
                  </a>
                )}
                {(config?.socialMedia?.instagram || footerData.socialMedia?.instagram) && (
                  <a 
                    href={config?.socialMedia?.instagram || footerData.socialMedia?.instagram}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label="Instagram"
                    className="w-8 h-8 sm:w-10 sm:h-10 bg-gradient-to-r from-cyan-600 to-blue-600 rounded-lg flex items-center justify-center hover:scale-110 transition-transform"
                  >
                    <FaInstagram className="w-3 h-3 sm:w-4 sm:h-4 text-white" />
                  </a>
                )}
                {(config?.socialMedia?.linkedin || footerData.socialMedia?.linkedin) && (
                  <a 
                    href={config?.socialMedia?.linkedin || footerData.socialMedia?.linkedin}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label="LinkedIn"
                    className="w-8 h-8 sm:w-10 sm:h-10 bg-gradient-to-r from-indigo-600 to-purple-600 rounded-lg flex items-center justify-center hover:scale-110 transition-transform"
                  >
                    <FaLinkedin className="w-3 h-3 sm:w-4 sm:h-4 text-white" />
                  </a>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default About;
