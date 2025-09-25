import React, { useEffect, useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { 
  FaUser, 
  FaEnvelope, 
  FaLock, 
  FaEye, 
  FaEyeSlash, 
  FaStore,
  FaArrowLeft,
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
      navigate('/');
    }
  };

  // If already authenticated, avoid staying on register page
  useEffect(() => {
    if (!loading && isAuthenticated && location.pathname === '/register') {
      navigate('/', { replace: true });
    }
  }, [isAuthenticated, loading, navigate, location.pathname]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-teal-50 to-cyan-50 flex items-center justify-center p-3 sm:p-4">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute inset-0" style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23059b69' fill-opacity='0.1'%3E%3Ccircle cx='30' cy='30' r='2'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`
        }}></div>
      </div>

      <div className="relative w-full max-w-sm sm:max-w-md">
        {/* Back Button */}
        <Link
          to="/"
          className="absolute -top-12 left-0 inline-flex items-center gap-2 text-xs sm:text-sm text-emerald-600 hover:text-emerald-700 transition-colors duration-200"
        >
          <FaArrowLeft className="w-3 h-3 sm:w-4 sm:h-4" />
          Back to Home
        </Link>

        {/* Main Card */}
        <div className="bg-white rounded-xl sm:rounded-2xl shadow-xl border border-emerald-100 overflow-hidden">
          {/* Header */}
          <div className="bg-gradient-to-r from-emerald-500 to-teal-500 p-4 sm:p-6 text-center">
            <div className="flex items-center justify-center gap-2 sm:gap-3 mb-3 sm:mb-4">
              <div className="grid h-8 w-8 sm:h-10 sm:w-10 place-items-center rounded-lg sm:rounded-xl bg-white text-emerald-700 font-extrabold shadow-sm">
                <FaStore className="w-4 h-4 sm:w-5 sm:h-5" />
              </div>
              <span className="text-lg sm:text-xl font-bold tracking-tight text-white">
                E‑Shop
              </span>
            </div>
            <h1 className="text-lg sm:text-xl font-bold text-white mb-1 sm:mb-2">
              Create Your Account
            </h1>
            <p className="text-xs sm:text-sm text-emerald-100">
              Join our community and start shopping today
            </p>
          </div>

          {/* Form */}
          <div className="p-4 sm:p-6">
            {authError && (
              <div className="mb-4 sm:mb-6 p-3 sm:p-4 bg-red-50 border border-red-200 rounded-lg sm:rounded-xl flex items-start gap-2 sm:gap-3">
                <FaExclamationTriangle className="w-4 h-4 sm:w-5 sm:h-5 text-red-500 mt-0.5 flex-shrink-0" />
                <div>
                  <p className="text-xs sm:text-sm font-medium text-red-800">
                    Registration Failed
                  </p>
                  <p className="text-xs text-red-600 mt-1">
                    {authError}
                  </p>
                </div>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-3 sm:space-y-4">
              {/* Name Field */}
              <div>
                <label htmlFor="name" className="block text-xs sm:text-sm font-semibold text-gray-700 mb-1.5 sm:mb-2">
                  Full Name
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 sm:pl-4 flex items-center pointer-events-none">
                    <FaUser className="w-3 h-3 sm:w-4 sm:h-4 text-gray-400" />
                  </div>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    className={`w-full pl-9 sm:pl-10 pr-3 sm:pr-4 py-2.5 sm:py-3 text-xs sm:text-sm border rounded-lg sm:rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500/20 transition-all duration-200 ${
                      errors.name 
                        ? 'border-red-300 bg-red-50 focus:border-red-500' 
                        : 'border-gray-300 bg-white focus:border-emerald-500'
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
                <label htmlFor="email" className="block text-xs sm:text-sm font-semibold text-gray-700 mb-1.5 sm:mb-2">
                  Email Address
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 sm:pl-4 flex items-center pointer-events-none">
                    <FaEnvelope className="w-3 h-3 sm:w-4 sm:h-4 text-gray-400" />
                  </div>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    className={`w-full pl-9 sm:pl-10 pr-3 sm:pr-4 py-2.5 sm:py-3 text-xs sm:text-sm border rounded-lg sm:rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500/20 transition-all duration-200 ${
                      errors.email 
                        ? 'border-red-300 bg-red-50 focus:border-red-500' 
                        : 'border-gray-300 bg-white focus:border-emerald-500'
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
                <label htmlFor="password" className="block text-xs sm:text-sm font-semibold text-gray-700 mb-1.5 sm:mb-2">
                  Password
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 sm:pl-4 flex items-center pointer-events-none">
                    <FaLock className="w-3 h-3 sm:w-4 sm:h-4 text-gray-400" />
                  </div>
                  <input
                    type={showPassword ? 'text' : 'password'}
                    id="password"
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    className={`w-full pl-9 sm:pl-10 pr-10 sm:pr-12 py-2.5 sm:py-3 text-xs sm:text-sm border rounded-lg sm:rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500/20 transition-all duration-200 ${
                      errors.password 
                        ? 'border-red-300 bg-red-50 focus:border-red-500' 
                        : 'border-gray-300 bg-white focus:border-emerald-500'
                    }`}
                    placeholder="Create a password"
                  />
                  <button
                    type="button"
                    className="absolute inset-y-0 right-0 pr-3 sm:pr-4 flex items-center text-gray-400 hover:text-gray-600 transition-colors duration-200"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? (
                      <FaEyeSlash className="w-3 h-3 sm:w-4 sm:h-4" />
                    ) : (
                      <FaEye className="w-3 h-3 sm:w-4 sm:h-4" />
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
                <label htmlFor="confirmPassword" className="block text-xs sm:text-sm font-semibold text-gray-700 mb-1.5 sm:mb-2">
                  Confirm Password
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 sm:pl-4 flex items-center pointer-events-none">
                    <FaLock className="w-3 h-3 sm:w-4 sm:h-4 text-gray-400" />
                  </div>
                  <input
                    type={showConfirmPassword ? 'text' : 'password'}
                    id="confirmPassword"
                    name="confirmPassword"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    className={`w-full pl-9 sm:pl-10 pr-10 sm:pr-12 py-2.5 sm:py-3 text-xs sm:text-sm border rounded-lg sm:rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500/20 transition-all duration-200 ${
                      errors.confirmPassword 
                        ? 'border-red-300 bg-red-50 focus:border-red-500' 
                        : 'border-gray-300 bg-white focus:border-emerald-500'
                    }`}
                    placeholder="Confirm your password"
                  />
                  <button
                    type="button"
                    className="absolute inset-y-0 right-0 pr-3 sm:pr-4 flex items-center text-gray-400 hover:text-gray-600 transition-colors duration-200"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  >
                    {showConfirmPassword ? (
                      <FaEyeSlash className="w-3 h-3 sm:w-4 sm:h-4" />
                    ) : (
                      <FaEye className="w-3 h-3 sm:w-4 sm:h-4" />
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
                className="w-full mt-4 sm:mt-6 inline-flex items-center justify-center gap-2 px-4 sm:px-6 py-3 sm:py-4 bg-gradient-to-r from-emerald-500 to-teal-500 text-white text-xs sm:text-sm font-semibold rounded-lg sm:rounded-xl hover:from-emerald-600 hover:to-teal-600 disabled:from-gray-300 disabled:to-gray-400 disabled:cursor-not-allowed transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-[1.02]"
              >
                {isSubmitting ? (
                  <>
                    <FaSpinner className="w-3 h-3 sm:w-4 sm:h-4 animate-spin" />
                    Creating Account...
                  </>
                ) : (
                  <>
                    <FaCheckCircle className="w-3 h-3 sm:w-4 sm:h-4" />
                    Create Account
                  </>
                )}
              </button>
            </form>

            {/* Trust Indicators */}
            <div className="mt-4 sm:mt-6 p-3 sm:p-4 bg-emerald-50 rounded-lg sm:rounded-xl border border-emerald-200">
              <div className="flex items-start gap-2 sm:gap-3">
                <FaShieldAlt className="w-4 h-4 sm:w-5 sm:h-5 text-emerald-600 mt-0.5 flex-shrink-0" />
                <div>
                  <p className="text-xs sm:text-sm font-semibold text-emerald-800">
                    Secure Registration
                  </p>
                  <p className="text-xs text-emerald-600 mt-1">
                    Your data is protected with industry-standard encryption
                  </p>
                </div>
              </div>
            </div>

            {/* Login Link */}
            <div className="mt-4 sm:mt-6 text-center">
              <p className="text-xs sm:text-sm text-gray-600">
                Already have an account?{' '}
                <Link 
                  to="/login" 
                  className="text-emerald-600 hover:text-emerald-700 font-semibold hover:underline underline-offset-2 transition-colors duration-200"
                >
                  Sign in here
                </Link>
              </p>
            </div>
          </div>
        </div>

        {/* Footer Note */}
        <div className="mt-4 sm:mt-6 text-center">
          <p className="text-xs text-gray-500 flex items-center justify-center gap-1">
            Made with <FaHeart className="w-3 h-3 text-red-400" /> for our customers
          </p>
        </div>
      </div>
    </div>
  );
};

export default Register;
