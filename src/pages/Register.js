import React, { useEffect, useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useWebsiteConfig } from '../context/WebsiteConfigContext';
import { 
  FaUser, 
  FaEnvelope, 
  FaLock, 
  FaEye, 
  FaEyeSlash, 
  FaStore,
  FaCheckCircle,
  FaExclamationTriangle,
  FaSpinner,
  FaShieldAlt,
  FaHeart
} from 'react-icons/fa';

const Register = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { register, error: authError, isAuthenticated, loading } = useAuth();
  const { config } = useWebsiteConfig();
  const navigate = useNavigate();
  const location = useLocation();

  const validateForm = () => {
    const newErrors = {};

    if (!formData.name.trim()) {
      newErrors.name = 'Name is required';
    } else if (formData.name.trim().length < 2) {
      newErrors.name = 'Name must be at least 2 characters';
    }

    if (!formData.email) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Email is invalid';
    }

    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }

    if (!formData.confirmPassword) {
      newErrors.confirmPassword = 'Please confirm your password';
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));

    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    setIsSubmitting(true);
    const result = await register({
      name: formData.name,
      email: formData.email,
      password: formData.password
    });
    setIsSubmitting(false);

    if (result.success) {
      // Show success message and redirect to OTP verification page
      console.log('Registration successful:', result.message);
      if (result.verificationOTP) {
        console.log('Development OTP:', result.verificationOTP);
      }
      navigate(`/verify-signup-otp?email=${encodeURIComponent(formData.email)}`);
    } else {
      // Show error message
      setErrors({ general: result.error || 'Registration failed' });
    }
  };

  // If already authenticated, avoid staying on register page
  useEffect(() => {
    if (!loading && isAuthenticated && location.pathname === '/register') {
      navigate('/', { replace: true });
    }
  }, [isAuthenticated, loading, navigate, location.pathname]);

  return (
    <div className="min-h-screen flex items-center justify-center p-2 sm:p-3" >
      {/* Animated Background Elements */}
      <div className="absolute inset-0">
        <div className="absolute top-10 left-10 w-24 h-24 bg-blue-500/10 rounded-full animate-pulse"></div>
        <div className="absolute top-20 right-20 w-16 h-16 bg-purple-500/10 rounded-full animate-pulse animation-delay-1000"></div>
        <div className="absolute bottom-10 left-1/4 w-20 h-20 bg-pink-500/10 rounded-full animate-pulse animation-delay-2000"></div>
        <div className="absolute bottom-20 right-1/3 w-12 h-12 bg-green-500/10 rounded-full animate-pulse animation-delay-3000"></div>
      </div>

      <div className="relative w-full max-w-sm sm:max-w-2xl lg:max-w-4xl xl:max-w-5xl">

        {/* Main Card */}
        <div className="bg-transparent backdrop-blur-sm rounded-2xl sm:rounded-3xl shadow-lg border border-gray-200/30 overflow-hidden lg:flex lg:h-[75vh] xl:h-[80vh] w-full lg:bg-white/5 lg:backdrop-blur-2xl lg:shadow-2xl lg:border-white/30">
          {/* Header */}
          <div className="p-4 sm:p-6 lg:p-6 xl:p-8 text-center lg:text-left bg-transparent backdrop-blur-sm border border-gray-200/30 lg:w-1/2 lg:flex lg:flex-col lg:justify-center lg:bg-white/2 lg:backdrop-blur-3xl lg:border-white/20">
            <div className="flex items-center justify-center lg:justify-start gap-2 sm:gap-3 mb-3 sm:mb-4 lg:mb-4">
              {config?.websiteLogo ? (
                <img
                  src={config.websiteLogo}
                  alt={config.logoAlt || 'Logo'}
                  className="w-12 h-12 sm:w-16 sm:h-16 lg:w-16 lg:h-16 object-contain"
                />
              ) : (
                <FaStore className="w-12 h-12 sm:w-16 sm:h-16 lg:w-16 lg:h-16 text-gray-800" />
              )}
              <div>
                <span className="text-xl sm:text-2xl lg:text-2xl font-bold text-gray-800">
                  {config?.websiteName || 'MUKHTI'}
                </span>
                <span className="text-sm sm:text-base lg:text-sm text-gray-600 block">
                  {config?.websiteDescription || 'Premium Store'}
                </span>
              </div>
            </div>
            <h1 className="text-xl sm:text-2xl lg:text-2xl font-bold text-gray-800 mb-2 sm:mb-3 lg:mb-2">
              Create Your Account
            </h1>
            <p className="text-sm sm:text-base lg:text-sm text-gray-600">
              Join our community and start shopping today
            </p>
          </div>

          {/* Form */}
          <div className="p-3 sm:p-4 lg:p-6 xl:p-8 lg:w-1/2 lg:flex lg:flex-col lg:justify-center bg-transparent backdrop-blur-sm lg:bg-white/2 lg:backdrop-blur-3xl">
            {(authError || errors.general) && (
              <div className="mb-3 sm:mb-4 p-2.5 sm:p-3 bg-red-50/80 backdrop-blur-sm border border-red-200/50 rounded-lg flex items-start gap-2">
                <FaExclamationTriangle className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-red-500 mt-0.5 flex-shrink-0" />
                <div>
                  <p className="text-xs font-medium text-red-800">
                    Registration Failed
                  </p>
                  <p className="text-xs text-red-600 mt-0.5">
                    {authError || errors.general}
                  </p>
                </div>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-2.5 sm:space-y-3">
              {/* Name Field */}
              <div>
                <label htmlFor="name" className="block text-xs font-semibold text-gray-700 mb-1">
                  Full Name
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <FaUser className="w-3.5 h-3.5 text-gray-400" />
                  </div>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    className={`w-full pl-9 pr-3 py-2.5 text-xs border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 transition-all duration-200 ${
                      errors.name 
                        ? 'border-red-300 bg-red-50 focus:border-red-500' 
                        : 'border-gray-300 bg-white focus:border-blue-500'
                    }`}
                    placeholder="Enter your full name"
                  />
                </div>
                {errors.name && (
                  <p className="mt-1.5 text-xs text-red-600 flex items-center gap-1">
                    <FaExclamationTriangle className="w-3 h-3 flex-shrink-0" />
                    {errors.name}
                  </p>
                )}
              </div>

              {/* Email Field */}
              <div>
                <label htmlFor="email" className="block text-xs font-semibold text-gray-700 mb-1">
                  Email Address
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <FaEnvelope className="w-3.5 h-3.5 text-gray-400" />
                  </div>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    className={`w-full pl-9 pr-3 py-2.5 text-xs border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 transition-all duration-200 ${
                      errors.email 
                        ? 'border-red-300 bg-red-50 focus:border-red-500' 
                        : 'border-gray-300 bg-white focus:border-blue-500'
                    }`}
                    placeholder="Enter your email"
                  />
                </div>
                {errors.email && (
                  <p className="mt-1.5 text-xs text-red-600 flex items-center gap-1">
                    <FaExclamationTriangle className="w-3 h-3 flex-shrink-0" />
                    {errors.email}
                  </p>
                )}
              </div>

              {/* Password Field */}
              <div>
                <label htmlFor="password" className="block text-xs font-semibold text-gray-700 mb-1">
                  Password
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <FaLock className="w-3.5 h-3.5 text-gray-400" />
                  </div>
                  <input
                    type={showPassword ? 'text' : 'password'}
                    id="password"
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    className={`w-full pl-9 pr-10 py-2.5 text-xs border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 transition-all duration-200 ${
                      errors.password 
                        ? 'border-red-300 bg-red-50 focus:border-red-500' 
                        : 'border-gray-300 bg-white focus:border-blue-500'
                    }`}
                    placeholder="Create a password"
                  />
                  <button
                    type="button"
                    className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600 transition-colors duration-200"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? (
                      <FaEyeSlash className="w-3.5 h-3.5" />
                    ) : (
                      <FaEye className="w-3.5 h-3.5" />
                    )}
                  </button>
                </div>
                {errors.password && (
                  <p className="mt-1.5 text-xs text-red-600 flex items-center gap-1">
                    <FaExclamationTriangle className="w-3 h-3 flex-shrink-0" />
                    {errors.password}
                  </p>
                )}
              </div>

              {/* Confirm Password Field */}
              <div>
                <label htmlFor="confirmPassword" className="block text-xs font-semibold text-gray-700 mb-1">
                  Confirm Password
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <FaLock className="w-3.5 h-3.5 text-gray-400" />
                  </div>
                  <input
                    type={showConfirmPassword ? 'text' : 'password'}
                    id="confirmPassword"
                    name="confirmPassword"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    className={`w-full pl-9 pr-10 py-2.5 text-xs border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 transition-all duration-200 ${
                      errors.confirmPassword 
                        ? 'border-red-300 bg-red-50 focus:border-red-500' 
                        : 'border-gray-300 bg-white focus:border-blue-500'
                    }`}
                    placeholder="Confirm your password"
                  />
                  <button
                    type="button"
                    className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600 transition-colors duration-200"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  >
                    {showConfirmPassword ? (
                      <FaEyeSlash className="w-3.5 h-3.5" />
                    ) : (
                      <FaEye className="w-3.5 h-3.5" />
                    )}
                  </button>
                </div>
                {errors.confirmPassword && (
                  <p className="mt-1.5 text-xs text-red-600 flex items-center gap-1">
                    <FaExclamationTriangle className="w-3 h-3 flex-shrink-0" />
                    {errors.confirmPassword}
                  </p>
                )}
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full mt-3 text-white rounded-2xl py-3 text-xs font-semibold disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 hover:scale-[1.02] active:scale-[0.98] shadow-lg hover:shadow-xl bg-gradient-to-r from-gray-700 via-gray-800 to-black hover:from-gray-800 hover:via-gray-900 hover:to-gray-800 flex items-center justify-between px-3"
              >
                {isSubmitting ? (
                  <div className="flex items-center justify-center gap-2 w-full">
                    <FaSpinner className="w-3 h-3 animate-spin" />
                    <span>Creating Account...</span>
                  </div>
                ) : (
                  <>
                    <span>Create Account</span>
                    <div className="w-5 h-5 bg-white rounded-full flex items-center justify-center">
                      <svg className="w-2.5 h-2.5 text-black" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    </div>
                  </>
                )}
              </button>
            </form>

            {/* Trust Indicators */}
            <div className="mt-3 p-2.5 bg-transparent backdrop-blur-sm rounded-lg border border-gray-200/30">
              <div className="flex items-start gap-2">
                <FaShieldAlt className="w-3.5 h-3.5 text-blue-500 mt-0.5 flex-shrink-0" />
                <div>
                  <p className="text-xs font-bold text-gray-800">
                    Secure Registration
                  </p>
                  <p className="text-xs text-gray-600 mt-0.5">
                    Your data is protected with industry-standard encryption
                  </p>
                </div>
              </div>
            </div>

            {/* Login Link */}
            <div className="mt-3 text-center">
              <p className="text-xs text-gray-600">
                Already have an account?{' '}
                <Link 
                  to="/login" 
                  className="text-blue-600 hover:text-blue-700 font-semibold hover:underline underline-offset-2 transition-colors duration-200"
                >
                  Sign in here
                </Link>
              </p>
            </div>
          </div>
        </div>

        {/* Footer Note */}
        <div className="mt-3 text-center">
          <p className="text-xs text-gray-500 flex items-center justify-center gap-1">
            Made with <FaHeart className="w-3 h-3 text-red-400 animate-pulse" /> for our customers
          </p>
        </div>
      </div>
    </div>
  );
};

export default Register;
