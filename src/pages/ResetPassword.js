import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import axios from 'axios';
import { FaKey, FaEye, FaEyeSlash, FaSpinner, FaCheckCircle, FaExclamationTriangle, FaStore, FaHeart, FaArrowLeft } from 'react-icons/fa';

// Validation schema
const resetPasswordSchema = z.object({
  password: z
    .string()
    .min(8, 'Password must be at least 8 characters')
    .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/, 'Password must contain at least one uppercase letter, one lowercase letter, and one number'),
  confirmPassword: z.string().min(1, 'Please confirm your password'),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
});

const ResetPassword = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [error, setError] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  
  const email = searchParams.get('email');
  const token = searchParams.get('token');

  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
  } = useForm({
    resolver: zodResolver(resetPasswordSchema),
  });

  const password = watch('password');

  useEffect(() => {
    if (!email || !token) {
      navigate('/forgot-password');
    }
  }, [email, token, navigate]);

  const onSubmit = async (data) => {
    try {
      setIsSubmitting(true);
      setError('');

      const response = await axios.post('/api/auth/reset-password', {
        email,
        token,
        password: data.password,
      });

      if (response.data.success) {
        setIsSuccess(true);
        // Redirect to login after 3 seconds
        setTimeout(() => {
          navigate('/login');
        }, 3000);
      } else {
        setError(response.data.message || 'Failed to reset password');
      }
    } catch (err) {
      console.error('Reset password error:', err);
      setError(
        err.response?.data?.message || 
        'Failed to reset password. Please try again.'
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isSuccess) {
    return (
      <div className="min-h-screen relative flex items-center justify-center p-2 sm:p-3">
        {/* Animated Background Elements */}
        <div className="absolute inset-0">
          <div className="absolute top-10 left-10 w-24 h-24 bg-blue-500/10 rounded-full animate-pulse"></div>
          <div className="absolute top-20 right-20 w-16 h-16 bg-purple-500/10 rounded-full animate-pulse animation-delay-1000"></div>
          <div className="absolute bottom-10 left-1/4 w-20 h-20 bg-pink-500/10 rounded-full animate-pulse animation-delay-2000"></div>
          <div className="absolute bottom-20 right-1/3 w-12 h-12 bg-green-500/10 rounded-full animate-pulse animation-delay-3000"></div>
        </div>

        <div className="relative w-full max-w-sm sm:max-w-2xl lg:max-w-4xl xl:max-w-5xl">
          {/* Main Card */}
          <div className="bg-white/90 backdrop-blur-sm rounded-xl sm:rounded-2xl shadow-xl border border-gray-200/50 overflow-hidden lg:flex lg:h-[70vh] xl:h-[75vh]">
            {/* Header */}
            <div className="p-4 sm:p-6 lg:p-6 xl:p-8 text-center lg:text-left bg-gradient-to-br from-blue-600 via-purple-600 to-pink-600 lg:w-1/2 lg:flex lg:flex-col lg:justify-center">
              <div className="flex items-center justify-center lg:justify-start gap-2 sm:gap-3 mb-3 sm:mb-4 lg:mb-4">
                <div className="w-10 h-10 sm:w-12 sm:h-12 lg:w-12 lg:h-12 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center shadow-lg">
                  <FaStore className="w-5 h-5 sm:w-6 sm:h-6 lg:w-6 lg:h-6 text-white" />
                </div>
                <div>
                  <span className="text-xl sm:text-2xl lg:text-2xl font-bold text-white">
                    MUKHTI
                  </span>
                  <span className="text-sm sm:text-base lg:text-sm text-white/80 block">
                    Premium Store
                  </span>
                </div>
              </div>
              <h1 className="text-xl sm:text-2xl lg:text-2xl font-bold text-white mb-2 sm:mb-3 lg:mb-2">
                Password Reset
              </h1>
              <p className="text-sm sm:text-base lg:text-sm text-white/90">
                Your password has been successfully reset
              </p>
            </div>

            {/* Success Content */}
            <div className="p-4 sm:p-6 lg:p-6 xl:p-8 lg:w-1/2 lg:flex lg:flex-col lg:justify-center">
              <div className="text-center">
                <div className="w-16 h-16 sm:w-20 sm:h-20 lg:w-16 lg:h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4 sm:mb-6 lg:mb-4">
                  <FaCheckCircle className="w-8 h-8 sm:w-10 sm:h-10 lg:w-8 lg:h-8 text-green-600" />
                </div>
                
                <h2 className="text-lg sm:text-xl lg:text-lg font-bold text-gray-900 mb-2 sm:mb-3 lg:mb-2">
                  Password Reset Successfully!
                </h2>
                
                <p className="text-sm sm:text-base lg:text-sm text-gray-600 mb-4 sm:mb-6 lg:mb-4">
                  Your password has been successfully reset. You can now sign in with your new password.
                </p>

                <div className="space-y-3 sm:space-y-4 lg:space-y-3">
                  <Link
                    to="/login"
                    className="block w-full py-3 sm:py-4 lg:py-3 px-4 sm:px-6 text-sm sm:text-base lg:text-sm font-semibold text-white bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg hover:from-blue-700 hover:to-purple-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-all duration-200 text-center"
                  >
                    Sign In Now
                  </Link>

                  <p className="text-xs sm:text-sm lg:text-xs text-gray-500">
                    Redirecting to login page in 3 seconds...
                  </p>
                </div>
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
    <div className="min-h-screen relative flex items-center justify-center p-2 sm:p-3">
      {/* Animated Background Elements */}
      <div className="absolute inset-0">
        <div className="absolute top-10 left-10 w-24 h-24 bg-blue-500/10 rounded-full animate-pulse"></div>
        <div className="absolute top-20 right-20 w-16 h-16 bg-purple-500/10 rounded-full animate-pulse animation-delay-1000"></div>
        <div className="absolute bottom-10 left-1/4 w-20 h-20 bg-pink-500/10 rounded-full animate-pulse animation-delay-2000"></div>
        <div className="absolute bottom-20 right-1/3 w-12 h-12 bg-green-500/10 rounded-full animate-pulse animation-delay-3000"></div>
      </div>

      <div className="relative w-full max-w-sm sm:max-w-2xl lg:max-w-4xl xl:max-w-5xl">
        {/* Back Button */}
        <Link
          to="/forgot-password"
          className="absolute -top-12 sm:-top-14 left-0 inline-flex items-center gap-1.5 px-2.5 py-1.5 text-xs hover:opacity-80 transition-all duration-200 text-gray-600 hover:text-gray-700 bg-white/60 backdrop-blur-sm rounded-lg border border-gray-200/30 shadow-sm hover:shadow-md"
        >
          <FaArrowLeft className="w-3 h-3" />
          Back to Forgot Password
        </Link>

        {/* Main Card */}
        <div className="bg-white/90 backdrop-blur-sm rounded-xl sm:rounded-2xl shadow-xl border border-gray-200/50 overflow-hidden lg:flex lg:h-[70vh] xl:h-[75vh]">
          {/* Header */}
          <div className="p-4 sm:p-6 lg:p-6 xl:p-8 text-center lg:text-left bg-gradient-to-br from-blue-600 via-purple-600 to-pink-600 lg:w-1/2 lg:flex lg:flex-col lg:justify-center">
            <div className="flex items-center justify-center lg:justify-start gap-2 sm:gap-3 mb-3 sm:mb-4 lg:mb-4">
              <div className="w-10 h-10 sm:w-12 sm:h-12 lg:w-12 lg:h-12 bg-white/20 backdrop-blur-sm rounded-lg flex items-center justify-center">
                <FaStore className="w-5 h-5 sm:w-6 sm:h-6 lg:w-6 lg:h-6 text-white" />
              </div>
              <div>
                <span className="text-xl sm:text-2xl lg:text-2xl font-bold text-white">
                  MUKHTI
                </span>
                <span className="text-sm sm:text-base lg:text-sm text-white/80 block">
                  Premium Store
                </span>
              </div>
            </div>
            <h1 className="text-xl sm:text-2xl lg:text-2xl font-bold text-white mb-2 sm:mb-3 lg:mb-2">
              Reset Password
            </h1>
            <p className="text-sm sm:text-base lg:text-sm text-white/90">
              Create your new password
            </p>
          </div>

          {/* Form */}
          <div className="p-4 sm:p-6 lg:p-6 xl:p-8 lg:w-1/2 lg:flex lg:flex-col lg:justify-center">
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

              {/* New Password Field */}
              <div>
                <label htmlFor="password" className="block text-sm sm:text-base lg:text-sm font-semibold text-gray-800 mb-2 sm:mb-3 lg:mb-2">
                  New Password
                </label>
                <div className="relative group">
                  <div className="absolute inset-y-0 left-0 pl-4 sm:pl-5 lg:pl-4 flex items-center pointer-events-none">
                    <FaKey className="w-4 h-4 sm:w-5 sm:h-5 lg:w-4 lg:h-4 text-gray-400 group-focus-within:text-blue-500 transition-colors duration-200" />
                  </div>
                  <input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    autoComplete="new-password"
                    placeholder="Enter new password"
                    className={`w-full pl-12 sm:pl-14 lg:pl-10 pr-12 sm:pr-14 lg:pr-10 py-3 sm:py-4 lg:py-3 text-sm sm:text-base lg:text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 ${
                      errors.password 
                        ? 'border-red-300 bg-red-50 focus:border-red-500 focus:ring-red-500/20' 
                        : 'border-gray-300 bg-gray-50 focus:border-blue-500 focus:bg-white'
                    }`}
                    {...register("password")}
                    aria-invalid={!!errors.password}
                    aria-describedby={errors.password ? "password-error" : undefined}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword((s) => !s)}
                    className="absolute inset-y-0 right-0 pr-4 sm:pr-5 lg:pr-4 flex items-center text-gray-400 hover:text-gray-600 transition-colors duration-200"
                    aria-label={showPassword ? "Hide password" : "Show password"}
                  >
                    {showPassword ? (
                      <FaEyeSlash className="w-4 h-4 sm:w-5 sm:h-5 lg:w-4 lg:h-4" />
                    ) : (
                      <FaEye className="w-4 h-4 sm:w-5 sm:h-5 lg:w-4 lg:h-4" />
                    )}
                  </button>
                </div>
                {errors.password && (
                  <p id="password-error" className="mt-2 text-sm lg:text-xs text-red-600 flex items-center gap-2" aria-live="polite">
                    <FaExclamationTriangle className="w-4 h-4 lg:w-3 lg:h-3 flex-shrink-0" />
                    {errors.password.message}
                  </p>
                )}
              </div>

              {/* Confirm Password Field */}
              <div>
                <label htmlFor="confirmPassword" className="block text-sm sm:text-base lg:text-sm font-semibold text-gray-800 mb-2 sm:mb-3 lg:mb-2">
                  Confirm New Password
                </label>
                <div className="relative group">
                  <div className="absolute inset-y-0 left-0 pl-4 sm:pl-5 lg:pl-4 flex items-center pointer-events-none">
                    <FaKey className="w-4 h-4 sm:w-5 sm:h-5 lg:w-4 lg:h-4 text-gray-400 group-focus-within:text-blue-500 transition-colors duration-200" />
                  </div>
                  <input
                    id="confirmPassword"
                    type={showConfirmPassword ? "text" : "password"}
                    autoComplete="new-password"
                    placeholder="Confirm new password"
                    className={`w-full pl-12 sm:pl-14 lg:pl-10 pr-12 sm:pr-14 lg:pr-10 py-3 sm:py-4 lg:py-3 text-sm sm:text-base lg:text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 ${
                      errors.confirmPassword 
                        ? 'border-red-300 bg-red-50 focus:border-red-500 focus:ring-red-500/20' 
                        : 'border-gray-300 bg-gray-50 focus:border-blue-500 focus:bg-white'
                    }`}
                    {...register("confirmPassword")}
                    aria-invalid={!!errors.confirmPassword}
                    aria-describedby={errors.confirmPassword ? "confirmPassword-error" : undefined}
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword((s) => !s)}
                    className="absolute inset-y-0 right-0 pr-4 sm:pr-5 lg:pr-4 flex items-center text-gray-400 hover:text-gray-600 transition-colors duration-200"
                    aria-label={showConfirmPassword ? "Hide password" : "Show password"}
                  >
                    {showConfirmPassword ? (
                      <FaEyeSlash className="w-4 h-4 sm:w-5 sm:h-5 lg:w-4 lg:h-4" />
                    ) : (
                      <FaEye className="w-4 h-4 sm:w-5 sm:h-5 lg:w-4 lg:h-4" />
                    )}
                  </button>
                </div>
                {errors.confirmPassword && (
                  <p id="confirmPassword-error" className="mt-2 text-sm lg:text-xs text-red-600 flex items-center gap-2" aria-live="polite">
                    <FaExclamationTriangle className="w-4 h-4 lg:w-3 lg:h-3 flex-shrink-0" />
                    {errors.confirmPassword.message}
                  </p>
                )}
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full mt-6 sm:mt-8 lg:mt-6 text-white rounded-lg py-4 sm:py-5 lg:py-3 text-sm sm:text-base lg:text-sm font-semibold disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 hover:scale-[1.02] active:scale-[0.98] shadow-lg hover:shadow-xl bg-gradient-to-r from-blue-600 to-purple-600"
              >
                {isSubmitting ? (
                  <div className="flex items-center justify-center gap-2">
                    <FaSpinner className="w-4 h-4 sm:w-5 sm:h-5 lg:w-4 lg:h-4 animate-spin" />
                    <span>Resetting...</span>
                  </div>
                ) : (
                  'Reset Password'
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

export default ResetPassword;
