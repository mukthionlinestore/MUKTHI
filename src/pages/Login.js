import React, { useState, useEffect, useRef } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
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
              Welcome Back
            </h1>
            <p className="text-xs sm:text-sm text-emerald-100">
              Sign in to your account to continue
            </p>
          </div>

          {/* Form */}
          <div className="p-4 sm:p-6">
            {/* Global error */}
            {(authError || errors.root?.message) && (
              <div className="mb-4 sm:mb-6 p-3 sm:p-4 bg-red-50 border border-red-200 rounded-lg sm:rounded-xl flex items-start gap-2 sm:gap-3">
                <FaExclamationTriangle className="w-4 h-4 sm:w-5 sm:h-5 text-red-500 mt-0.5 flex-shrink-0" />
                <div>
                  <p className="text-xs sm:text-sm font-medium text-red-800">
                    Sign In Failed
                  </p>
                  <p className="text-xs text-red-600 mt-1">
                    {errors.root?.message || authError}
                  </p>
                </div>
              </div>
            )}

            <form onSubmit={handleSubmit(onSubmit)} noValidate className="space-y-3 sm:space-y-4">
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
                    id="email"
                    type="email"
                    inputMode="email"
                    autoComplete="email"
                    placeholder="Enter your email"
                    className={`w-full pl-9 sm:pl-10 pr-3 sm:pr-4 py-2.5 sm:py-3 text-xs sm:text-sm border rounded-lg sm:rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500/20 transition-all duration-200 ${
                      errors.email 
                        ? 'border-red-300 bg-red-50 focus:border-red-500' 
                        : 'border-gray-300 bg-white focus:border-emerald-500'
                    }`}
                    {...register("email")}
                    aria-invalid={!!errors.email}
                    aria-describedby={errors.email ? "email-error" : undefined}
                  />
                </div>
                {errors.email && (
                  <p id="email-error" className="mt-1.5 text-xs text-red-600 flex items-center gap-1" aria-live="polite">
                    <FaExclamationTriangle className="w-3 h-3 flex-shrink-0" />
                    {errors.email.message}
                  </p>
                )}
              </div>

              {/* Password Field */}
              <div>
                <div className="flex items-center justify-between mb-1.5 sm:mb-2">
                  <label htmlFor="password" className="block text-xs sm:text-sm font-semibold text-gray-700">
                    Password
                  </label>
                  <Link 
                    to="/forgot-password" 
                    className="text-xs text-emerald-600 hover:text-emerald-700 font-medium hover:underline underline-offset-2 transition-colors duration-200"
                  >
                    Forgot password?
                  </Link>
                </div>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 sm:pl-4 flex items-center pointer-events-none">
                    <FaLock className="w-3 h-3 sm:w-4 sm:h-4 text-gray-400" />
                  </div>
                  <input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    autoComplete="current-password"
                    placeholder="Enter your password"
                    className={`w-full pl-9 sm:pl-10 pr-10 sm:pr-12 py-2.5 sm:py-3 text-xs sm:text-sm border rounded-lg sm:rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500/20 transition-all duration-200 ${
                      errors.password 
                        ? 'border-red-300 bg-red-50 focus:border-red-500' 
                        : 'border-gray-300 bg-white focus:border-emerald-500'
                    }`}
                    {...register("password")}
                    aria-invalid={!!errors.password}
                    aria-describedby={errors.password ? "password-error" : undefined}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword((s) => !s)}
                    className="absolute inset-y-0 right-0 pr-3 sm:pr-4 flex items-center text-gray-400 hover:text-gray-600 transition-colors duration-200"
                    aria-label={showPassword ? "Hide password" : "Show password"}
                  >
                    {showPassword ? (
                      <FaEyeSlash className="w-3 h-3 sm:w-4 sm:h-4" />
                    ) : (
                      <FaEye className="w-3 h-3 sm:w-4 sm:h-4" />
                    )}
                  </button>
                </div>
                {errors.password && (
                  <p id="password-error" className="mt-1.5 text-xs text-red-600 flex items-center gap-1" aria-live="polite">
                    <FaExclamationTriangle className="w-3 h-3 flex-shrink-0" />
                    {errors.password.message}
                  </p>
                )}
              </div>

              {/* Remember Me */}
              <div className="flex items-center justify-between">
                <label className="inline-flex items-center gap-2 text-xs sm:text-sm text-gray-700">
                  <input
                    type="checkbox"
                    className="w-3 h-3 sm:w-4 sm:h-4 rounded border-gray-300 text-emerald-600 focus:ring-emerald-500/20"
                    {...register("remember")}
                  />
                  Remember me
                </label>
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
                    Signing in...
                  </>
                ) : (
                  <>
                    <FaKey className="w-3 h-3 sm:w-4 sm:h-4" />
                    Sign In
                  </>
                )}
              </button>
            </form>

            {/* Divider */}
            <div className="mt-4 sm:mt-6">
              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-gray-200" />
                </div>
                <div className="relative flex justify-center text-xs uppercase">
                  <span className="bg-white px-3 text-gray-500">Or continue with</span>
                </div>
              </div>
            </div>

            {/* Google Sign-In */}
            <div className="mt-4 sm:mt-6">
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
            <div className="mt-4 sm:mt-6 p-3 sm:p-4 bg-emerald-50 rounded-lg sm:rounded-xl border border-emerald-200">
              <div className="flex items-start gap-2 sm:gap-3">
                <FaShieldAlt className="w-4 h-4 sm:w-5 sm:h-5 text-emerald-600 mt-0.5 flex-shrink-0" />
                <div>
                  <p className="text-xs sm:text-sm font-semibold text-emerald-800">
                    Secure Sign In
                  </p>
                  <p className="text-xs text-emerald-600 mt-1">
                    Your credentials are protected with industry-standard encryption
                  </p>
                </div>
              </div>
            </div>

            {/* Sign Up Link */}
            <div className="mt-4 sm:mt-6 text-center">
              <p className="text-xs sm:text-sm text-gray-600">
                Don't have an account?{' '}
                <Link 
                  to="/register" 
                  className="text-emerald-600 hover:text-emerald-700 font-semibold hover:underline underline-offset-2 transition-colors duration-200"
                >
                  Sign up here
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
}



