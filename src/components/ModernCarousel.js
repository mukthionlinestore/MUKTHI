import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  FaArrowRight,
  FaShoppingBag,
  FaGift,
  FaTruck,
  FaShieldAlt,
  FaStar,
  FaLeaf,
  FaFire
} from 'react-icons/fa';
import { useHomePageSettings } from '../context/HomePageSettingsContext';

const ModernCarousel = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const { homePageSettings, loading } = useHomePageSettings();

  // Get dynamic text from context or use defaults
  const getSlideData = (screenNumber) => {
    const screen = homePageSettings?.heroSection?.[`screen${screenNumber}`];
    return {
      title: screen?.title || `Screen ${screenNumber} Title`,
      subtitle: screen?.subtitle || `Screen ${screenNumber} Subtitle`,
      description: screen?.description || `Screen ${screenNumber} Description`
    };
  };

  // Carousel data with different content for each slide - now using dynamic text
  const slides = [
    {
      id: 1,
      image: 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80',
      ...getSlideData(1),
      badge: 'Best Quality Products',
      badgeIcon: FaLeaf,
      buttonText: 'Shop Now',
      buttonLink: '/products',
      gradient: 'from-green-600/80 to-blue-600/80',
      textColor: 'text-white',
      accentColor: 'text-yellow-300'
    },
    {
      id: 2,
      image: 'https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80',
      ...getSlideData(2),
      badge: 'New Arrivals',
      badgeIcon: FaFire,
      buttonText: 'Explore Collection',
      buttonLink: '/products?new=true',
      gradient: 'from-purple-600/80 to-pink-600/80',
      textColor: 'text-white',
      accentColor: 'text-yellow-300'
    },
    {
      id: 3,
      image: 'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80',
      ...getSlideData(3),
      badge: 'Free Shipping',
      badgeIcon: FaTruck,
      buttonText: 'Start Shopping',
      buttonLink: '/products',
      gradient: 'from-blue-600/80 to-indigo-600/80',
      textColor: 'text-white',
      accentColor: 'text-cyan-300'
    },
    {
      id: 4,
      image: 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80',
      ...getSlideData(4),
      badge: 'Special Deals',
      badgeIcon: FaGift,
      buttonText: 'View Offers',
      buttonLink: '/products?sale=true',
      gradient: 'from-orange-600/80 to-red-600/80',
      textColor: 'text-white',
      accentColor: 'text-yellow-300'
    },
    {
      id: 5,
      image: 'https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80',
      ...getSlideData(5),
      badge: 'Top Rated',
      badgeIcon: FaStar,
      buttonText: 'See Favorites',
      buttonLink: '/products?featured=true',
      gradient: 'from-emerald-600/80 to-teal-600/80',
      textColor: 'text-white',
      accentColor: 'text-lime-300'
    }
  ];

  // Auto-play functionality
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prev) => {
        if (prev === slides.length - 1) {
          return 0; // Reset to first slide instead of going backwards
        }
        return prev + 1;
      });
    }, 5000); // Change slide every 5 seconds
    return () => clearInterval(interval);
  }, [slides.length]);


  const goToSlide = (index) => {
    setCurrentSlide(index);
  };


  return (
    <div className="relative h-[30vh] sm:h-[48vh] md:h-[60vh] lg:h-[72vh] xl:h-[84vh] overflow-hidden group">
      {/* Loading State */}
      {loading && (
        <div className="flex items-center justify-center h-full bg-gray-100">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Loading carousel...</p>
          </div>
        </div>
      )}

      {/* Carousel Container */}
      {!loading && (
        <div className="relative w-full h-full">
        <div 
          className="flex transition-transform duration-1000 ease-in-out h-full"
          style={{ transform: `translateX(-${currentSlide * 100}%)` }}
        >
          {slides.map((slide, index) => (
            <div
              key={slide.id}
              className="w-full h-full flex-shrink-0 relative "
            >
            {/* Background Image */}
            <div
              className="absolute inset-4 sm:inset-6 md:inset-8 lg:inset-12 bg-cover bg-center bg-no-repeat rounded-2xl sm:rounded-3xl overflow-hidden"
              style={{ backgroundImage: `url('${slide.image}')` }}
            >
              {/* Overlay */}
              <div className={`absolute inset-0 bg-gradient-to-r ${slide.gradient}`}></div>
              
              {/* Decorative Elements */}
              <div className="absolute top-4 right-4 w-20 h-20 bg-white/10 rounded-full blur-xl animate-pulse"></div>
              <div className="absolute bottom-4 left-4 w-16 h-16 bg-white/5 rounded-full blur-lg animate-pulse animation-delay-500"></div>
              <div className="absolute top-1/2 left-1/4 w-12 h-12 bg-white/8 rounded-full blur-md animate-pulse animation-delay-300"></div>
            </div>

              {/* Content */}
              <div className="relative h-full flex items-center justify-center px-4 sm:px-6 lg:px-8 ">
                <div className="text-center max-w-4xl mx-auto relative">
                  {/* Floating Decorative Elements */}
                  <div className="absolute -top-4 -left-4 sm:-top-8 sm:-left-8 w-8 h-8 sm:w-16 sm:h-16 bg-gradient-to-br from-white/20 to-white/5 rounded-full blur-sm animate-pulse"></div>
                  <div className="absolute -top-2 -right-6 sm:-top-4 sm:-right-12 w-6 h-6 sm:w-12 sm:h-12 bg-gradient-to-br from-white/15 to-white/5 rounded-full blur-sm animate-pulse animation-delay-300"></div>
                  <div className="absolute -bottom-3 -left-8 sm:-bottom-6 sm:-left-16 w-10 h-10 sm:w-20 sm:h-20 bg-gradient-to-br from-white/10 to-white/5 rounded-full blur-sm animate-pulse animation-delay-500"></div>
                  
                  {/* Badge */}
                  <div className="inline-flex items-center gap-0.5 sm:gap-1.5 px-2 py-1 sm:px-3 sm:py-1.5 md:px-4 md:py-2 bg-white/20 backdrop-blur-md text-white rounded-full text-xs sm:text-sm font-medium mb-2 sm:mb-3 md:mb-4 animate-slide-in-from-bottom border border-white/20 shadow-lg">
                    <slide.badgeIcon className="w-2 h-2 sm:w-3 sm:h-3" />
                    {slide.badge}
                  </div>

                  {/* Main Heading */}
                  <h1 className={`text-base sm:text-xl md:text-2xl lg:text-3xl xl:text-4xl 2xl:text-5xl font-bold ${slide.textColor} mb-2 sm:mb-3 md:mb-4 leading-tight animate-zoom-in animation-delay-200 relative`}>
                    <span className="relative z-10">{slide.title}</span>
                    <br />
                    <span className={`${slide.accentColor} relative z-10`}>{slide.subtitle}</span>
                    {/* Text Shadow Effect */}
                    <div className="absolute inset-0 text-transparent bg-clip-text bg-gradient-to-r from-transparent via-white/20 to-transparent blur-sm animate-pulse"></div>
                  </h1>

                  {/* Description */}
                  <div className="relative mb-3 sm:mb-4 md:mb-6">
                    <p className={`text-xs sm:text-sm md:text-base lg:text-lg ${slide.textColor}/90 max-w-sm sm:max-w-md md:max-w-lg mx-auto animate-slide-in-up animation-delay-300 px-2 sm:px-3 leading-relaxed`}>
                      {slide.description}
                    </p>
                    {/* Decorative line */}
                    <div className="w-12 sm:w-16 md:w-20 h-0.5 bg-gradient-to-r from-transparent via-white/30 to-transparent mx-auto mt-2 sm:mt-3 animate-fade-in-scale animation-delay-400"></div>
                  </div>

                  {/* CTA Button */}
                  <div className="relative">
                    <Link
                      to={slide.buttonLink}
                      className="inline-flex items-center gap-1 sm:gap-1.5 md:gap-2 px-3 py-1.5 sm:px-4 sm:py-2 md:px-6 md:py-3 lg:px-8 lg:py-4 bg-white text-gray-800 text-xs sm:text-sm md:text-base font-semibold rounded-lg sm:rounded-xl hover:bg-gray-50 transition-all duration-300 shadow-lg sm:shadow-xl hover:shadow-2xl transform hover:scale-105 animate-glow animation-delay-400 border border-white/20 backdrop-blur-sm"
                    >
                      {slide.buttonText}
                      <FaArrowRight className="w-2.5 h-2.5 sm:w-3 sm:h-3 md:w-4 md:h-4 transition-transform duration-300 group-hover:translate-x-1" />
                    </Link>
                    {/* Button glow effect */}
                    <div className="absolute inset-0 bg-gradient-to-r from-white/20 to-white/10 rounded-lg sm:rounded-xl blur-lg -z-10 animate-pulse"></div>
                  </div>

                  {/* Additional Modern Elements */}
                  <div className="absolute -bottom-4 sm:-bottom-8 left-1/2 transform -translate-x-1/2 flex space-x-1 sm:space-x-2 animate-fade-in animation-delay-600">
                    <div className="w-1 h-1 sm:w-2 sm:h-2 bg-white/40 rounded-full animate-pulse"></div>
                    <div className="w-1 h-1 sm:w-2 sm:h-2 bg-white/60 rounded-full animate-pulse animation-delay-200"></div>
                    <div className="w-1 h-1 sm:w-2 sm:h-2 bg-white/40 rounded-full animate-pulse animation-delay-400"></div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
      )}


      {/* Dots Navigation */}
      {!loading && (
        <div className="absolute bottom-2 sm:bottom-4 left-1/2 -translate-x-1/2 flex gap-1.5 sm:gap-2 md:gap-3 bg-black/20 backdrop-blur-md px-2 sm:px-3 md:px-4 py-1 sm:py-1.5 md:py-2 rounded-full border border-white/30 shadow-lg">
          {slides.map((_, index) => (
            <button
              key={index}
              onClick={() => goToSlide(index)}
              className={`w-2.5 h-2.5 sm:w-3 sm:h-3 md:w-4 md:h-4 rounded-full transition-all duration-300 ${
                index === currentSlide
                  ? 'bg-white scale-125 shadow-lg ring-2 ring-white/50'
                  : 'bg-white/60 hover:bg-white/80 hover:scale-110 shadow-md'
              }`}
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default ModernCarousel;
