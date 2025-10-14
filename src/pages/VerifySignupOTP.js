import React, { useState, useEffect } from 'react';
import { Link, useSearchParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { FaKey, FaSpinner, FaCheckCircle, FaExclamationTriangle, FaStore, FaHeart, FaArrowLeft, FaEnvelope } from 'react-icons/fa';

const VerifySignupOTP = () => {
  const [otp, setOtp] = useState('');
  const [isVerifying, setIsVerifying] = useState(false);
  const [isVerified, setIsVerified] = useState(false);
  const [error, setError] = useState('');
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  
  const email = searchParams.get('email');

  useEffect(() => {
    if (!email) {
      navigate('/register');
    }
  }, [email, navigate]);

  const handleOtpChange = (e) => {
    const value = e.target.value.replace(/\D/g, ''); // Only allow digits
    if (value.length <= 6) {
      setOtp(value);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (otp.length !== 6) {
      setError('Please enter a valid 6-digit OTP');
      return;
    }

    try {
      setIsVerifying(true);
      setError('');

      const response = await axios.post('/api/auth/verify-email-otp', {
        email,
        otp,
      });

      if (response.data.success) {
        setIsVerified(true);
        // Redirect to login after 3 seconds
        setTimeout(() => {
          navigate('/login');
        }, 3000);
      } else {
        setError(response.data.message || 'Failed to verify OTP');
      }
    } catch (err) {
      console.error('Verify OTP error:', err);
      setError(
        err.response?.data?.message || 
        'Failed to verify OTP. Please try again.'
      );
    } finally {
      setIsVerifying(false);
    }
  };

  const handleResendOTP = async () => {
    if (!email) return;
    
    try {
      setIsVerifying(true);
      setError('');

      const response = await axios.post('/api/auth/resend-verification-otp', {
        email: email,
      });

      if (response.data.success) {
        setError(''); // Clear any previous errors
        alert('New OTP sent successfully!');
      } else {
        setError(response.data.message || 'Failed to resend OTP');
      }
    } catch (err) {
      console.error('Resend OTP error:', err);
      setError(
        err.response?.data?.message || 
        'Failed to resend OTP. Please try again.'
      );
    } finally {
      setIsVerifying(false);
    }
  };

  if (isVerified) {
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
                Email Verified!
              </h1>
              <p className="text-sm sm:text-base lg:text-sm text-white/90">
                Your account is now active and ready to use
              </p>
            </div>

            {/* Success Content */}
            <div className="p-4 sm:p-6 lg:p-6 xl:p-8 lg:w-1/2 lg:flex lg:flex-col lg:justify-center">
              <div className="text-center">
                <div className="w-16 h-16 sm:w-20 sm:h-20 lg:w-16 lg:h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4 sm:mb-6 lg:mb-4">
                  <FaCheckCircle className="w-8 h-8 sm:w-10 sm:h-10 lg:w-8 lg:h-8 text-green-600" />
                </div>
                
                <h2 className="text-lg sm:text-xl lg:text-lg font-bold text-gray-900 mb-2 sm:mb-3 lg:mb-2">
                  Email Verified Successfully!
                </h2>
                
                <p className="text-sm sm:text-base lg:text-sm text-gray-600 mb-4 sm:mb-6 lg:mb-4">
                  Your email address has been successfully verified. Your account is now fully activated and you can start shopping!
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
          to="/register"
          className="absolute -top-12 sm:-top-14 left-0 inline-flex items-center gap-1.5 px-2.5 py-1.5 text-xs hover:opacity-80 transition-all duration-200 text-gray-600 hover:text-gray-700 bg-white/60 backdrop-blur-sm rounded-lg border border-gray-200/30 shadow-sm hover:shadow-md"
        >
          <FaArrowLeft className="w-3 h-3" />
          Back to Register
        </Link>

        {/* Main Card */}
        <div className="bg-white/80 backdrop-blur-sm rounded-lg sm:rounded-xl shadow-sm border border-gray-200/50 overflow-hidden lg:flex lg:h-[70vh] xl:h-[75vh]">
          {/* Header */}
          <div className="p-4 sm:p-6 lg:p-6 xl:p-8 text-center lg:text-left bg-gradient-to-r from-blue-600 to-purple-600 lg:w-1/2 lg:flex lg:flex-col lg:justify-center">
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
              Verify Your Email
            </h1>
            <p className="text-sm sm:text-base lg:text-sm text-white/90">
              Enter the 6-digit OTP sent to your email
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

            <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-5 lg:space-y-4">
              {/* OTP Field */}
              <div>
                <label htmlFor="otp" className="block text-sm sm:text-base lg:text-sm font-semibold text-gray-800 mb-2 sm:mb-3 lg:mb-2">
                  Enter OTP Code
                </label>
                <div className="relative group">
                  <div className="absolute inset-y-0 left-0 pl-4 sm:pl-5 lg:pl-4 flex items-center pointer-events-none">
                    <FaKey className="w-4 h-4 sm:w-5 sm:h-5 lg:w-4 lg:h-4 text-gray-400 group-focus-within:text-blue-500 transition-colors duration-200" />
                  </div>
                  <input
                    id="otp"
                    type="text"
                    inputMode="numeric"
                    placeholder="Enter 6-digit OTP"
                    maxLength="6"
                    value={otp}
                    onChange={handleOtpChange}
                    className="w-full pl-12 sm:pl-14 lg:pl-10 pr-4 sm:pr-5 py-3 sm:py-4 lg:py-3 text-sm sm:text-base lg:text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 text-center tracking-widest font-mono text-lg"
                  />
                </div>
                <p className="mt-2 text-xs sm:text-sm lg:text-xs text-gray-500">
                  We sent a 6-digit code to <strong>{email}</strong>
                </p>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isVerifying || otp.length !== 6}
                className="w-full mt-6 sm:mt-8 lg:mt-6 text-white rounded-lg py-4 sm:py-5 lg:py-3 text-sm sm:text-base lg:text-sm font-semibold disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 hover:scale-[1.02] active:scale-[0.98] shadow-lg hover:shadow-xl bg-gradient-to-r from-blue-600 to-purple-600"
              >
                {isVerifying ? (
                  <div className="flex items-center justify-center gap-2">
                    <FaSpinner className="w-4 h-4 sm:w-5 sm:h-5 lg:w-4 lg:h-4 animate-spin" />
                    <span>Verifying...</span>
                  </div>
                ) : (
                  'Verify Email'
                )}
              </button>
            </form>

            {/* Resend OTP */}
            <div className="mt-6 sm:mt-8 lg:mt-6 text-center">
              <p className="text-sm sm:text-base lg:text-sm text-gray-600 mb-3">
                Didn't receive the code?
              </p>
              <button
                onClick={handleResendOTP}
                disabled={isVerifying}
                className="text-blue-600 hover:text-blue-700 font-semibold hover:underline underline-offset-2 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isVerifying ? 'Sending...' : 'Resend OTP'}
              </button>
            </div>

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

export default VerifySignupOTP;
