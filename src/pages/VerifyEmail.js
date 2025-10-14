import React, { useState, useEffect } from 'react';
import { Link, useSearchParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { FaCheckCircle, FaExclamationTriangle, FaSpinner, FaStore, FaHeart, FaEnvelope, FaArrowLeft } from 'react-icons/fa';

const VerifyEmail = () => {
  const [isVerifying, setIsVerifying] = useState(false);
  const [isVerified, setIsVerified] = useState(false);
  const [error, setError] = useState('');
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  
  const token = searchParams.get('token');
  const email = searchParams.get('email');

  useEffect(() => {
    if (token && email) {
      verifyEmail();
    } else {
      setError('Invalid verification link');
    }
  }, [token, email]);

  const verifyEmail = async () => {
    try {
      setIsVerifying(true);
      setError('');

      const response = await axios.post('/api/auth/verify-email', {
        token,
        email,
      });

      if (response.data.success) {
        setIsVerified(true);
        // Redirect to login after 3 seconds
        setTimeout(() => {
          navigate('/login');
        }, 3000);
      } else {
        setError(response.data.message || 'Failed to verify email');
      }
    } catch (err) {
      console.error('Verify email error:', err);
      setError(
        err.response?.data?.message || 
        'Failed to verify email. Please try again.'
      );
    } finally {
      setIsVerifying(false);
    }
  };

  const handleResendVerification = async () => {
    if (!email) return;
    
    try {
      setIsVerifying(true);
      setError('');

      const response = await axios.post('/api/auth/send-verification', {
        email: email,
      });

      if (response.data.success) {
        setError(''); // Clear any previous errors
        alert('Verification email sent successfully!');
      } else {
        setError(response.data.message || 'Failed to resend verification email');
      }
    } catch (err) {
      console.error('Resend verification error:', err);
      setError(
        err.response?.data?.message || 
        'Failed to resend verification email. Please try again.'
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
          to="/login"
          className="absolute -top-12 sm:-top-14 left-0 inline-flex items-center gap-1.5 px-2.5 py-1.5 text-xs hover:opacity-80 transition-all duration-200 text-gray-600 hover:text-gray-700 bg-white/60 backdrop-blur-sm rounded-lg border border-gray-200/30 shadow-sm hover:shadow-md"
        >
          <FaArrowLeft className="w-3 h-3" />
          Back to Login
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
              Verify Email
            </h1>
            <p className="text-sm sm:text-base lg:text-sm text-white/90">
              Please wait while we verify your email address
            </p>
          </div>

          {/* Content */}
          <div className="p-4 sm:p-6 lg:p-6 xl:p-8 lg:w-1/2 lg:flex lg:flex-col lg:justify-center">
            <div className="text-center">
              {isVerifying ? (
                <div>
                  <div className="w-16 h-16 sm:w-20 sm:h-20 lg:w-16 lg:h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4 sm:mb-6 lg:mb-4">
                    <FaSpinner className="w-8 h-8 sm:w-10 sm:h-10 lg:w-8 lg:h-8 text-blue-600 animate-spin" />
                  </div>
                  
                  <h2 className="text-lg sm:text-xl lg:text-lg font-bold text-gray-900 mb-2 sm:mb-3 lg:mb-2">
                    Verifying Email...
                  </h2>
                  
                  <p className="text-sm sm:text-base lg:text-sm text-gray-600">
                    Please wait while we verify your email address.
                  </p>
                </div>
              ) : error ? (
                <div>
                  <div className="w-16 h-16 sm:w-20 sm:h-20 lg:w-16 lg:h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4 sm:mb-6 lg:mb-4">
                    <FaExclamationTriangle className="w-8 h-8 sm:w-10 sm:h-10 lg:w-8 lg:h-8 text-red-600" />
                  </div>
                  
                  <h2 className="text-lg sm:text-xl lg:text-lg font-bold text-gray-900 mb-2 sm:mb-3 lg:mb-2">
                    Verification Failed
                  </h2>
                  
                  <p className="text-sm sm:text-base lg:text-sm text-gray-600 mb-4 sm:mb-6 lg:mb-4">
                    {error}
                  </p>

                  <div className="space-y-3 sm:space-y-4 lg:space-y-3">
                    <button
                      onClick={handleResendVerification}
                      disabled={isVerifying}
                      className="w-full py-3 sm:py-4 lg:py-3 px-4 sm:px-6 text-sm sm:text-base lg:text-sm font-semibold text-blue-600 bg-blue-50 border border-blue-200 rounded-lg hover:bg-blue-100 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
                    >
                      {isVerifying ? (
                        <div className="flex items-center justify-center gap-2">
                          <FaSpinner className="w-4 h-4 animate-spin" />
                          <span>Resending...</span>
                        </div>
                      ) : (
                        'Resend Verification Email'
                      )}
                    </button>

                    <Link
                      to="/login"
                      className="block w-full py-3 sm:py-4 lg:py-3 px-4 sm:px-6 text-sm sm:text-base lg:text-sm font-semibold text-gray-700 bg-gray-100 border border-gray-300 rounded-lg hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 transition-all duration-200 text-center"
                    >
                      Back to Login
                    </Link>
                  </div>
                </div>
              ) : (
                <div>
                  <div className="w-16 h-16 sm:w-20 sm:h-20 lg:w-16 lg:h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4 sm:mb-6 lg:mb-4">
                    <FaEnvelope className="w-8 h-8 sm:w-10 sm:h-10 lg:w-8 lg:h-8 text-blue-600" />
                  </div>
                  
                  <h2 className="text-lg sm:text-xl lg:text-lg font-bold text-gray-900 mb-2 sm:mb-3 lg:mb-2">
                    Email Verification
                  </h2>
                  
                  <p className="text-sm sm:text-base lg:text-sm text-gray-600">
                    Click the button below to verify your email address.
                  </p>
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
};

export default VerifyEmail;

