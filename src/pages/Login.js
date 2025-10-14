import React, { useState, useEffect, useRef } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useWebsiteConfig } from "../context/WebsiteConfigContext";
import axios from '../config/axios';
import { 
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
  FaHeart,
  FaGoogle,
  FaKey
} from "react-icons/fa";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import GoogleSignIn from "../components/GoogleSignIn";

/**
 * Mobile-first, modern Tailwind UI with robust validations using Zod.
 * - Focused on small screens (≤ 400px wide) with fluid scaling up
 * - Accessible labels, aria-live regions, and keyboard-friendly controls
 * - Strong password rules & helpful inline messages
 */

const LoginSchema = z.object({
  email: z
    .string({ required_error: "Email is required" })
    .min(1, "Email is required")
    .email("Please enter a valid email address"),
  password: z
    .string({ required_error: "Password is required" })
    .min(1, "Password is required"),
  remember: z.boolean().optional(),
});

export default function Login() {
  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from?.pathname || "/";
  const { login, error: authError, isAuthenticated, loading } = useAuth();
  const { config } = useWebsiteConfig();
  const hasNavigated = useRef(false);

  const [showPassword, setShowPassword] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    setError,
  } = useForm({
    resolver: zodResolver(LoginSchema),
    mode: "onBlur",
    reValidateMode: "onChange",
    defaultValues: { email: "", password: "", remember: false },
  });

  // Auto-navigate when user becomes authenticated, avoid same-path and /login loops
  useEffect(() => {
    if (!loading && isAuthenticated && !hasNavigated.current) {
      const target = (from && from !== '/login') ? from : '/';
      if (location.pathname !== target) {
        console.log(`Navigating from ${location.pathname} to ${target}`);
        hasNavigated.current = true;
        navigate(target, { replace: true });
      }
    }
  }, [isAuthenticated, loading, navigate, from, location.pathname]);

  // Handle Google OAuth token from redirect
  useEffect(() => {
    const urlParams = new URLSearchParams(location.search);
    const token = urlParams.get('token');
    const google = urlParams.get('google');
    const success = urlParams.get('success');
    const error = urlParams.get('error');
    
    console.log('🔍 URL params:', { token: token ? 'present' : 'missing', google, success, error });
    
    if (error) {
      console.log('❌ Google OAuth error:', error);
      setError("root", { type: "server", message: "Google sign-in failed" });
      // Clean up URL
      const newUrl = window.location.pathname;
      window.history.replaceState({}, document.title, newUrl);
      return;
    }
    
    if (token && google === 'true' && success === 'true') {
      console.log('✅ Processing Google OAuth token from redirect...');
      
      // Process the token immediately
      const processGoogleToken = async () => {
        try {
          // Set the token in localStorage
          localStorage.setItem('token', token);
          
          // Clean up URL immediately
          const newUrl = window.location.pathname;
          window.history.replaceState({}, document.title, newUrl);
          
          // Get user profile to complete authentication
          const response = await axios.get('/api/auth/profile');
          console.log('✅ User profile loaded:', response.data);
          
          // Dispatch success event to update AuthContext
          window.dispatchEvent(new CustomEvent('authSuccess', { 
            detail: { user: response.data.user, token } 
          }));
          
        } catch (error) {
          console.error('❌ Error processing Google token:', error);
          setError("root", { type: "server", message: "Failed to complete Google sign-in" });
        }
      };
      
      processGoogleToken();
    }
  }, [location.search]);

  const onSubmit = async (values) => {
    const result = await login({ email: values.email, password: values.password });
    if (result?.success) {
      // Navigation will be handled by the useEffect hook
      // Don't navigate here to avoid conflicts
      console.log('Login successful, navigation will be handled by useEffect');
    } else if (result?.error) {
      setError("root", { type: "server", message: result.error });
    }
  };

  return (
    <div className="min-h-screen relative flex items-center justify-center p-2 sm:p-3 ">
      {/* Subtle Background Elements */}
      <div className="absolute inset-0">
        <div className="absolute top-10 left-10 w-24 h-24 bg-gray-200/20 rounded-full animate-pulse"></div>
        <div className="absolute top-20 right-20 w-16 h-16 bg-gray-300/20 rounded-full animate-pulse animation-delay-1000"></div>
        <div className="absolute bottom-10 left-1/4 w-20 h-20 bg-gray-200/20 rounded-full animate-pulse animation-delay-2000"></div>
        <div className="absolute bottom-20 right-1/3 w-12 h-12 bg-gray-300/20 rounded-full animate-pulse animation-delay-3000"></div>
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
              Welcome Back
            </h1>
            <p className="text-sm sm:text-base lg:text-sm text-gray-600">
              Sign in to your account to continue shopping
            </p>
          </div>

          {/* Form */}
          <div className="p-3 sm:p-4 lg:p-6 xl:p-8 lg:w-1/2 lg:flex lg:flex-col lg:justify-center bg-transparent backdrop-blur-sm lg:bg-white/2 lg:backdrop-blur-3xl">
            {/* Global error */}
            {(authError || errors.root?.message) && (
              <div className="mb-3 sm:mb-4 p-2.5 sm:p-3 bg-red-50/80 backdrop-blur-sm border border-red-200/50 rounded-lg flex items-start gap-2">
                <FaExclamationTriangle className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-red-500 mt-0.5 flex-shrink-0" />
                <div>
                  <p className="text-xs font-semibold text-red-800">
                    Sign In Failed
                  </p>
                  <p className="text-xs text-red-600 mt-0.5">
                    {errors.root?.message || authError}
                  </p>
                </div>
              </div>
            )}

            <form onSubmit={handleSubmit(onSubmit)} noValidate className="space-y-2.5 sm:space-y-3">
              {/* Email Field */}
              <div>
                <label htmlFor="email" className="block text-xs font-semibold text-gray-800 mb-1">
                  Email Address
                </label>
                <div className="relative group">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <FaEnvelope className="w-3.5 h-3.5 text-gray-500 group-focus-within:text-blue-500 transition-colors duration-200" />
                  </div>
                  <input
                    id="email"
                    type="email"
                    inputMode="email"
                    autoComplete="email"
                    placeholder="Enter your email address"
                    className={`w-full pl-9 pr-3 py-2.5 text-xs border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all duration-200 ${
                      errors.email 
                        ? 'border-red-300 bg-red-50 focus:border-red-500 focus:ring-red-500/20' 
                        : 'border-gray-200/30 bg-white/40 backdrop-blur-sm focus:border-blue-500 focus:ring-blue-500/20'
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

              {/* Password Field */}
              <div>
                <div className="flex items-center justify-between mb-1">
                  <label htmlFor="password" className="block text-xs font-semibold text-gray-800">
                    Password
                  </label>
                  <Link 
                    to="/forgot-password" 
                    className="text-xs text-gray-600 hover:text-blue-600 font-medium hover:underline underline-offset-2 transition-colors duration-200"
                  >
                    Forgot password?
                  </Link>
                </div>
                <div className="relative group">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <FaLock className="w-3.5 h-3.5 text-gray-500 group-focus-within:text-blue-500 transition-colors duration-200" />
                  </div>
                  <input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    autoComplete="current-password"
                    placeholder="Enter your password"
                    className={`w-full pl-9 pr-10 py-2.5 text-xs border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all duration-200 ${
                      errors.password 
                        ? 'border-red-300 bg-red-50 focus:border-red-500 focus:ring-red-500/20' 
                        : 'border-gray-200/30 bg-white/40 backdrop-blur-sm focus:border-blue-500 focus:ring-blue-500/20'
                    }`}
                    {...register("password")}
                    aria-invalid={!!errors.password}
                    aria-describedby={errors.password ? "password-error" : undefined}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword((s) => !s)}
                    className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-500 hover:text-blue-500 transition-colors duration-200"
                    aria-label={showPassword ? "Hide password" : "Show password"}
                  >
                    {showPassword ? (
                      <FaEyeSlash className="w-3.5 h-3.5" />
                    ) : (
                      <FaEye className="w-3.5 h-3.5" />
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

              {/* Remember Me */}
              <div className="flex items-center justify-between">
                <label className="inline-flex items-center gap-2 text-xs text-gray-700 cursor-pointer">
                  <input
                    type="checkbox"
                    className="w-3.5 h-3.5 rounded border border-gray-300 text-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all duration-200"
                    {...register("remember")}
                  />
                  <span className="font-medium">Remember me</span>
                </label>
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
                    <span>Signing in...</span>
                  </div>
                ) : (
                  <>
                    <span>Sign In</span>
                    <div className="w-5 h-5 bg-white rounded-full flex items-center justify-center">
                      <svg className="w-2.5 h-2.5 text-black" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    </div>
                  </>
                )}
              </button>
            </form>

            {/* Divider */}
            <div className="mt-4">
              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-gray-200/50" />
                </div>
                <div className="relative flex justify-center text-xs uppercase">
                  <span className="bg-transparent backdrop-blur-sm px-4 text-gray-500 font-medium rounded-lg">Or continue with</span>
                </div>
              </div>
            </div>

            {/* Google Sign-In */}
            <div className="mt-4">
              <GoogleSignIn 
                onSuccess={() => {
                  console.log('🎯 Google Sign-In completed successfully');
                }}
                onError={() => {
                  setError("root", { type: "server", message: "Google sign-in failed" });
                }}
              />
            </div>

            {/* Trust Indicators */}
            <div className="mt-4 p-3 bg-transparent backdrop-blur-sm rounded-lg border border-gray-200/30">
              <div className="flex items-start gap-2">
                <FaShieldAlt className="w-3.5 h-3.5 text-blue-500 mt-0.5 flex-shrink-0" />
                <div>
                  <p className="text-xs font-bold text-gray-800">
                    Secure Sign In
                  </p>
                  <p className="text-xs text-gray-600 mt-0.5">
                    Your credentials are protected with industry-standard encryption
                  </p>
                </div>
              </div>
            </div>

            {/* Sign Up Link */}
            <div className="mt-4 text-center">
              <p className="text-xs text-gray-600">
                Don't have an account?{' '}
                <Link 
                  to="/register" 
                  className="text-blue-600 hover:text-blue-700 font-bold hover:underline underline-offset-2 transition-colors duration-200"
                >
                  Sign up here
                </Link>
              </p>
            </div>
          </div>
        </div>

        {/* Footer Note */}
        <div className="mt-4 text-center">
          <p className="text-xs text-gray-500 flex items-center justify-center gap-1">
            Made with <FaHeart className="w-3 h-3 text-red-400 animate-pulse" /> for our customers
          </p>
        </div>
      </div>
    </div>
  );
}



