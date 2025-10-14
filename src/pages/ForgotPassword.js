import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import axios from 'axios';
import { useWebsiteConfig } from '../context/WebsiteConfigContext';
import { FaEnvelope, FaArrowLeft, FaSpinner, FaCheckCircle, FaExclamationTriangle, FaStore, FaHeart } from 'react-icons/fa';

// Validation schema
const forgotPasswordSchema = z.object({
  email: z
    .string()
    .min(1, 'Email is required')
    .email('Please enter a valid email address'),
});

const ForgotPassword = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isEmailSent, setIsEmailSent] = useState(false);
  const [error, setError] = useState('');
  const { config } = useWebsiteConfig();
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
  } = useForm({
    resolver: zodResolver(forgotPasswordSchema),
  });

  const email = watch('email');

  const onSubmit = async (data) => {
    try {
      setIsSubmitting(true);
      setError('');

      const response = await axios.post('/api/auth/forgot-password', {
        email: data.email,
      });

      if (response.data.success) {
        // Redirect to OTP verification page
        navigate(`/reset-password-otp?email=${encodeURIComponent(data.email)}`);
      } else {
        setError(response.data.message || 'Failed to send reset email');
      }
    } catch (err) {
      console.error('Forgot password error:', err);
      setError(
        err.response?.data?.message || 
        'Failed to send reset email. Please try again.'
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleResendEmail = async () => {
    if (!email) return;
    
    try {
      setIsSubmitting(true);
      setError('');

      const response = await axios.post('/api/auth/forgot-password', {
        email: email,
      });

      if (response.data.success) {
        setError(''); // Clear any previous errors
      } else {
        setError(response.data.message || 'Failed to resend email');
      }
    } catch (err) {
      console.error('Resend email error:', err);
      setError(
        err.response?.data?.message || 
        'Failed to resend email. Please try again.'
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isEmailSent) {
    return (
      <div className="min-h-screen relative flex items-center justify-center p-2 sm:p-3 -mt-16 sm:mt-0">
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
                Check Your Email
              </h1>
              <p className="text-sm sm:text-base lg:text-sm text-gray-600">
                We've sent you a password reset link
              </p>
            </div>

            {/* Success Content */}
            <div className="p-3 sm:p-4 lg:p-6 xl:p-8 lg:w-1/2 lg:flex lg:flex-col lg:justify-center bg-transparent backdrop-blur-sm lg:bg-white/2 lg:backdrop-blur-3xl">
              <div className="text-center">
                <div className="w-16 h-16 sm:w-20 sm:h-20 lg:w-16 lg:h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4 sm:mb-6 lg:mb-4">
                  <FaCheckCircle className="w-8 h-8 sm:w-10 sm:h-10 lg:w-8 lg:h-8 text-green-600" />
                </div>
                
                <h2 className="text-lg sm:text-xl lg:text-lg font-bold text-gray-900 mb-2 sm:mb-3 lg:mb-2">
                  Email Sent Successfully!
                </h2>
                
                <p className="text-sm sm:text-base lg:text-sm text-gray-600 mb-4 sm:mb-6 lg:mb-4">
                  We've sent a password reset link to <strong>{email}</strong>. 
                  Please check your email and click the link to reset your password.
                </p>

                <div className="space-y-3 sm:space-y-4 lg:space-y-3">
                  <button
                    onClick={handleResendEmail}
                    disabled={isSubmitting}
                    className="w-full py-3 sm:py-4 lg:py-3 px-4 sm:px-6 text-sm sm:text-base lg:text-sm font-semibold text-blue-600 bg-blue-50 border border-blue-200 rounded-lg hover:bg-blue-100 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
                  >
                    {isSubmitting ? (
                      <div className="flex items-center justify-center gap-2">
                        <FaSpinner className="w-4 h-4 animate-spin" />
                        <span>Resending...</span>
                      </div>
                    ) : (
                      'Resend Email'
                    )}
                  </button>

                  <Link
                    to="/login"
                    className="block w-full py-3 sm:py-4 lg:py-3 px-4 sm:px-6 text-sm sm:text-base lg:text-sm font-semibold text-gray-700 bg-gray-100 border border-gray-300 rounded-lg hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 transition-all duration-200 text-center"
                  >
                    Back to Login
                  </Link>
                </div>

                {error && (
                  <div className="mt-4 sm:mt-6 lg:mt-4 p-3 sm:p-4 lg:p-3 bg-red-50 border border-red-200 rounded-lg flex items-start gap-2 sm:gap-3 lg:gap-2">
                    <FaExclamationTriangle className="w-4 h-4 sm:w-5 sm:h-5 lg:w-4 lg:h-4 text-red-500 mt-0.5 flex-shrink-0" />
                    <div>
                      <p className="text-xs sm:text-sm lg:text-xs font-semibold text-red-800">
                        Error
                      </p>
                      <p className="text-xs sm:text-sm lg:text-xs text-red-600 mt-1">
                        {error}
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Footer Note */}
          <div className="mt-8 sm:mt-10 lg:mt-6 text-center">
            <p className="text-sm lg:text-xs text-gray-500 flex items-center justify-center gap-2">
              Made with <FaHeart className="w-4 h-4 lg:w-3 lg:h-3 text-red-400 animate-pulse" /> for our customers
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen relative flex items-center justify-center p-2 sm:p-3 -mt-16 sm:mt-0">
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
              Forgot Password?
            </h1>
            <p className="text-sm sm:text-base lg:text-sm text-gray-600">
              Enter your email address and we'll send you a password reset link
            </p>
          </div>

          {/* Form */}
          <div className="p-3 sm:p-4 lg:p-6 xl:p-8 lg:w-1/2 lg:flex lg:flex-col lg:justify-center bg-transparent backdrop-blur-sm lg:bg-white/2 lg:backdrop-blur-3xl">
            {/* Global error */}
            {error && (
              <div className="mb-4 sm:mb-6 lg:mb-4 p-3 sm:p-4 lg:p-3 bg-red-50 border border-red-200 rounded-lg flex items-start gap-2 sm:gap-3 lg:gap-2">
                <FaExclamationTriangle className="w-4 h-4 sm:w-5 sm:h-5 lg:w-4 lg:h-4 text-red-500 mt-0.5 flex-shrink-0" />
                <div>
                  <p className="text-xs sm:text-sm lg:text-xs font-semibold text-red-800">
                    Error
                  </p>
                  <p className="text-xs sm:text-sm lg:text-xs text-red-600 mt-1">
                    {error}
                  </p>
                </div>
              </div>
            )}

            <form onSubmit={handleSubmit(onSubmit)} noValidate className="space-y-4 sm:space-y-5 lg:space-y-4">
              {/* Email Field */}
              <div>
                <label htmlFor="email" className="block text-sm sm:text-base lg:text-sm font-semibold text-gray-800 mb-2 sm:mb-3 lg:mb-2">
                  Email Address
                </label>
                <div className="relative group">
                  <div className="absolute inset-y-0 left-0 pl-4 sm:pl-5 lg:pl-4 flex items-center pointer-events-none">
                    <FaEnvelope className="w-4 h-4 sm:w-5 sm:h-5 lg:w-4 lg:h-4 text-gray-400 group-focus-within:text-blue-500 transition-colors duration-200" />
                  </div>
                  <input
                    id="email"
                    type="email"
                    inputMode="email"
                    autoComplete="email"
                    placeholder="Enter your email address"
                    className={`w-full pl-12 sm:pl-14 lg:pl-10 pr-4 sm:pr-5 py-3 sm:py-4 lg:py-3 text-sm sm:text-base lg:text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 ${
                      errors.email 
                        ? 'border-red-300 bg-red-50 focus:border-red-500 focus:ring-red-500/20' 
                        : 'border-gray-300 bg-gray-50 focus:border-blue-500 focus:bg-white'
                    }`}
                    {...register("email")}
                    aria-invalid={!!errors.email}
                    aria-describedby={errors.email ? "email-error" : undefined}
                  />
                </div>
                {errors.email && (
                  <p id="email-error" className="mt-2 text-sm lg:text-xs text-red-600 flex items-center gap-2" aria-live="polite">
                    <FaExclamationTriangle className="w-4 h-4 lg:w-3 lg:h-3 flex-shrink-0" />
                    {errors.email.message}
                  </p>
                )}
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full mt-6 sm:mt-8 lg:mt-6 text-white rounded-2xl py-3 sm:py-4 lg:py-2.5 text-xs sm:text-sm lg:text-xs font-semibold disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 hover:scale-[1.02] active:scale-[0.98] shadow-lg hover:shadow-xl bg-gradient-to-r from-gray-700 via-gray-800 to-black hover:from-gray-800 hover:via-gray-900 hover:to-gray-800 flex items-center justify-between px-3 sm:px-4 lg:px-3"
              >
                {isSubmitting ? (
                  <div className="flex items-center justify-center gap-2 w-full">
                    <FaSpinner className="w-3 h-3 sm:w-4 sm:h-4 lg:w-3 lg:h-3 animate-spin" />
                    <span>Sending...</span>
                  </div>
                ) : (
                  <>
                    <span>Send Reset Link</span>
                    <div className="w-5 h-5 sm:w-6 sm:h-6 lg:w-5 lg:h-5 bg-white rounded-full flex items-center justify-center">
                      <svg className="w-2.5 h-2.5 sm:w-3 sm:h-3 lg:w-2.5 lg:h-2.5 text-black" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    </div>
                  </>
                )}
              </button>
            </form>

            {/* Back to Login */}
            <div className="mt-6 sm:mt-8 lg:mt-6 text-center">
              <p className="text-sm sm:text-base lg:text-sm text-gray-600">
                Remember your password?{' '}
                <Link 
                  to="/login" 
                  className="text-blue-600 hover:text-blue-700 font-bold hover:underline underline-offset-2 transition-colors duration-200"
                >
                  Sign in here
                </Link>
              </p>
            </div>
          </div>
        </div>

        {/* Footer Note */}
        <div className="mt-8 sm:mt-10 lg:mt-6 text-center">
          <p className="text-sm lg:text-xs text-gray-500 flex items-center justify-center gap-2">
            Made with <FaHeart className="w-4 h-4 lg:w-3 lg:h-3 text-red-400 animate-pulse" /> for our customers
          </p>
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;
