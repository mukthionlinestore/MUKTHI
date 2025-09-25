import React, { useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';

const GoogleCallback = () => {
  const [searchParams] = useSearchParams();

  useEffect(() => {
    const token = searchParams.get('token');
    const error = searchParams.get('error');

    console.log('🔄 Processing Google OAuth callback...');

    if (error) {
      console.error('❌ Google OAuth error:', error);
      // Store error in localStorage for parent window to read
      localStorage.setItem('google_oauth_error', error);
      // Close popup
      setTimeout(() => window.close(), 500);
      return;
    }

    if (token) {
      console.log('✅ Google OAuth successful, storing token...');
      console.log('🔐 Token length:', token.length);
      // Store token in localStorage for parent window to read
      localStorage.setItem('google_token', token);
      console.log('💾 Token stored in localStorage');
      // Close popup
      setTimeout(() => {
        console.log('🔒 Closing popup window');
        window.close();
      }, 500);
    } else {
      console.log('❌ No token received');
      localStorage.setItem('google_oauth_error', 'No token received');
      setTimeout(() => window.close(), 500);
    }
  }, [searchParams]);

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
        <p className="mt-4 text-gray-600">Completing sign-in...</p>
        <p className="mt-2 text-sm text-gray-500">This window will close automatically</p>
      </div>
    </div>
  );
};

export default GoogleCallback;
