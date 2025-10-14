import React, { createContext, useContext, useReducer, useEffect, useCallback } from 'react';
import axios from '../config/axios';

const AuthContext = createContext();

const initialState = {
  user: null,
  token: localStorage.getItem('token'),
  isAuthenticated: !!localStorage.getItem('token'),
  loading: true,
  error: null
};

const authReducer = (state, action) => {
  switch (action.type) {
    case 'AUTH_START':
      return {
        ...state,
        loading: true,
        error: null
      };
    case 'AUTH_SUCCESS':
      return {
        ...state,
        user: action.payload.user,
        token: action.payload.token,
        isAuthenticated: true,
        loading: false,
        error: null
      };
    case 'AUTH_FAIL':
      return {
        ...state,
        user: null,
        token: null,
        isAuthenticated: false,
        loading: false,
        error: action.payload
      };
    case 'LOGOUT':
      return {
        ...state,
        user: null,
        token: null,
        isAuthenticated: false,
        loading: false,
        error: null
      };
    case 'UPDATE_PROFILE':
      return {
        ...state,
        user: { ...state.user, ...action.payload }
      };
    case 'CLEAR_ERROR':
      return {
        ...state,
        error: null
      };
    default:
      return state;
  }
};

export const AuthProvider = ({ children }) => {
  const [state, dispatch] = useReducer(authReducer, initialState);
  const [isInitialized, setIsInitialized] = React.useState(false);

  // Set auth token
  const setAuthToken = useCallback((token) => {
    if (token) {
      localStorage.setItem('token', token);
    } else {
      localStorage.removeItem('token');
    }
  }, []);

  // Load user on app start
  useEffect(() => {
    if (isInitialized) return; // Prevent multiple initialization attempts
    
    const loadUser = async () => {
      const token = localStorage.getItem('token');
      if (token) {
        setAuthToken(token);
        try {
          const res = await axios.get('/api/auth/profile');
          dispatch({
            type: 'AUTH_SUCCESS',
            payload: { user: res.data.user, token }
          });
        } catch (error) {
          console.log('Auth check failed:', error.response?.data?.message || error.message);
          // Clear invalid token
          localStorage.removeItem('token');
          dispatch({ type: 'AUTH_FAIL', payload: null });
        }
      } else {
        dispatch({ type: 'AUTH_FAIL', payload: null });
      }
      setIsInitialized(true);
    };

    loadUser();
  }, [setAuthToken, isInitialized]); // Add isInitialized to prevent multiple calls

  // Handle mobile Google OAuth token
  useEffect(() => {
    const handleGoogleToken = async () => {
      const googleToken = localStorage.getItem('google_token');
      if (googleToken && !state.isAuthenticated) {
        console.log('📱 Processing Google token from localStorage...');
        localStorage.removeItem('google_token'); // Clean up immediately
        await loginWithGoogle(googleToken);
      }
    };

    // Check on mount
    handleGoogleToken();

    // Listen for custom event from mobile redirect
    const handleTokenEvent = () => {
      console.log('📱 Google token event received');
      handleGoogleToken();
    };

    window.addEventListener('google_token_received', handleTokenEvent);
    
    // Listen for Google OAuth success event
    const handleAuthSuccess = (event) => {
      console.log('✅ Auth success event received:', event.detail);
      const { user, token } = event.detail;
      dispatch({
        type: 'AUTH_SUCCESS',
        payload: { user, token }
      });
    };
    
    window.addEventListener('authSuccess', handleAuthSuccess);
    
    return () => {
      window.removeEventListener('google_token_received', handleTokenEvent);
      window.removeEventListener('authSuccess', handleAuthSuccess);
    };
  }, [state.isAuthenticated]);

  // Register user
  const register = async (userData) => {
    dispatch({ type: 'AUTH_START' });
    try {
      const res = await axios.post('/api/auth/register', userData);
      
      // Don't automatically log in the user - they need to verify email first
      // Just return success without setting token or dispatching AUTH_SUCCESS
      dispatch({ type: 'AUTH_FAIL', payload: null }); // Reset loading state
      
      return { 
        success: true, 
        message: res.data.message,
        verificationOTP: res.data.verificationOTP // For development
      };
    } catch (error) {
      const message = error.response?.data?.message || 'Registration failed';
      dispatch({ type: 'AUTH_FAIL', payload: message });
      return { success: false, error: message };
    }
  };

  // Login user
  const login = async (credentials) => {
    dispatch({ type: 'AUTH_START' });
    try {
      // Try regular login first
      const res = await axios.post('/api/auth/login', credentials);
      setAuthToken(res.data.token);
      dispatch({
        type: 'AUTH_SUCCESS',
        payload: res.data
      });
      return { success: true, user: res.data.user };
    } catch (error) {
      // If regular login fails, try super admin login
      try {
        const superAdminRes = await axios.post('/api/superadmin/login', credentials);
        setAuthToken(superAdminRes.data.token);
        dispatch({
          type: 'AUTH_SUCCESS',
          payload: superAdminRes.data
        });
        return { success: true, user: superAdminRes.data.user, isSuperAdmin: true };
      } catch (superAdminError) {
        const message = error.response?.data?.message || 'Login failed';
        dispatch({ type: 'AUTH_FAIL', payload: message });
        return { success: false, error: message };
      }
    }
  };

  // Logout user
  const logout = useCallback(() => {
    setAuthToken(null);
    dispatch({ type: 'LOGOUT' });
  }, [setAuthToken]);

  // Update profile
  const updateProfile = async (profileData) => {
    try {
      const res = await axios.put('/api/auth/profile', profileData);
      dispatch({
        type: 'UPDATE_PROFILE',
        payload: res.data.user
      });
      return { success: true, message: res.data.message };
    } catch (error) {
      const message = error.response?.data?.message || 'Profile update failed';
      return { success: false, error: message };
    }
  };

  // Change password
  const changePassword = async (passwordData) => {
    try {
      const res = await axios.put('/api/auth/change-password', passwordData);
      return { success: true, message: res.data.message };
    } catch (error) {
      const message = error.response?.data?.message || 'Password change failed';
      return { success: false, error: message };
    }
  };

  // Update avatar
  const updateAvatar = async (avatarUrl) => {
    try {
      const res = await axios.put('/api/auth/avatar', { avatar: avatarUrl });
      dispatch({
        type: 'UPDATE_PROFILE',
        payload: res.data.user
      });
      return { success: true, message: res.data.message };
    } catch (error) {
      const message = error.response?.data?.message || 'Avatar update failed';
      return { success: false, error: message };
    }
  };

  // Login with Google
  const loginWithGoogle = async (token) => {
    console.log('🔐 loginWithGoogle called with token:', token ? '✅ Present' : '❌ Missing');
    console.log('🔐 Token length:', token?.length);
    dispatch({ type: 'AUTH_START' });
    try {
      setAuthToken(token);
      console.log('🔐 Token set in localStorage');
      
      // Get user profile with the token
      console.log('🔐 Fetching user profile...');
      const res = await axios.get('/api/auth/profile');
      console.log('🔐 User profile received:', res.data);
      
      dispatch({
        type: 'AUTH_SUCCESS',
        payload: { user: res.data, token }
      });
      console.log('🔐 User authenticated successfully');
      console.log('🔐 Auth state updated:', { user: res.data.name, email: res.data.email });
      return { success: true };
    } catch (error) {
      console.error('❌ Google login error:', error.response?.data || error.message);
      const message = error.response?.data?.message || 'Google login failed';
      dispatch({ type: 'AUTH_FAIL', payload: message });
      return { success: false, error: message };
    }
  };

  // Clear error
  const clearError = useCallback(() => {
    dispatch({ type: 'CLEAR_ERROR' });
  }, []);

  const value = {
    user: state.user,
    token: state.token,
    isAuthenticated: state.isAuthenticated,
    loading: state.loading,
    error: state.error,
    register,
    login,
    logout,
    loginWithGoogle,
    updateProfile,
    changePassword,
    updateAvatar,
    clearError
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
