import React, { createContext, useContext, useReducer, useEffect } from 'react';
import axios from '../config/axios';
import { useAuth } from './AuthContext';
import { toast } from 'react-toastify';

const WishlistContext = createContext();

const initialState = {
  products: [],
  loading: false,
  error: null
};

const wishlistReducer = (state, action) => {
  switch (action.type) {
    case 'WISHLIST_LOADING':
      return {
        ...state,
        loading: true,
        error: null
      };
    case 'WISHLIST_LOADED':
      return {
        ...state,
        products: action.payload.products,
        loading: false,
        error: null
      };
    case 'WISHLIST_ERROR':
      return {
        ...state,
        loading: false,
        error: action.payload
      };
    case 'ADD_TO_WISHLIST':
      return {
        ...state,
        products: action.payload.products,
        loading: false
      };
    case 'REMOVE_FROM_WISHLIST':
      return {
        ...state,
        products: action.payload.products,
        loading: false
      };
    case 'CLEAR_WISHLIST':
      return {
        ...state,
        products: [],
        loading: false
      };
    default:
      return state;
  }
};

export const WishlistProvider = ({ children }) => {
  const [state, dispatch] = useReducer(wishlistReducer, initialState);
  const { isAuthenticated } = useAuth();

  // Load wishlist on authentication
  useEffect(() => {
    if (isAuthenticated) {
      loadWishlist();
    }
  }, [isAuthenticated]);

  // Load wishlist from server
  const loadWishlist = async () => {
    if (!isAuthenticated) return;

    dispatch({ type: 'WISHLIST_LOADING' });
    try {
      const res = await axios.get('/api/wishlist');
      dispatch({
        type: 'WISHLIST_LOADED',
        payload: res.data
      });
    } catch (error) {
      dispatch({
        type: 'WISHLIST_ERROR',
        payload: error.response?.data?.message || 'Failed to load wishlist'
      });
    }
  };

  // Add product to wishlist - handles both product objects and product IDs
  const addToWishlist = async (product) => {
    if (!isAuthenticated) {
      toast.error('Please login to add items to wishlist');
      return { success: false, error: 'Please login first' };
    }

    // Extract productId from product object or use product directly if it's an ID
    const productId = typeof product === 'object' ? product._id : product;

    dispatch({ type: 'WISHLIST_LOADING' });
    try {
      const res = await axios.post('/api/wishlist/add', { productId });

      dispatch({
        type: 'ADD_TO_WISHLIST',
        payload: res.data
      });

      toast.success('Item added to wishlist successfully!');
      return { success: true };
    } catch (error) {
      const message = error.response?.data?.message || 'Failed to add item to wishlist';
      dispatch({
        type: 'WISHLIST_ERROR',
        payload: message
      });
      toast.error(message);
      return { success: false, error: message };
    }
  };

  // Remove product from wishlist
  const removeFromWishlist = async (productId) => {
    if (!isAuthenticated) return { success: false, error: 'Please login first' };

    dispatch({ type: 'WISHLIST_LOADING' });
    try {
      const res = await axios.delete(`/api/wishlist/remove/${productId}`);
      
      dispatch({
        type: 'REMOVE_FROM_WISHLIST',
        payload: res.data
      });

      toast.success('Item removed from wishlist');
      return { success: true };
    } catch (error) {
      const message = error.response?.data?.message || 'Failed to remove item from wishlist';
      dispatch({
        type: 'WISHLIST_ERROR',
        payload: message
      });
      toast.error(message);
      return { success: false, error: message };
    }
  };

  // Clear wishlist
  const clearWishlist = async () => {
    if (!isAuthenticated) return { success: false, error: 'Please login first' };

    dispatch({ type: 'WISHLIST_LOADING' });
    try {
      await axios.delete('/api/wishlist/clear');
      
      dispatch({ type: 'CLEAR_WISHLIST' });
      toast.success('Wishlist cleared successfully');
      return { success: true };
    } catch (error) {
      const message = error.response?.data?.message || 'Failed to clear wishlist';
      dispatch({
        type: 'WISHLIST_ERROR',
        payload: message
      });
      toast.error(message);
      return { success: false, error: message };
    }
  };

  // Check if product is in wishlist - FIXED VERSION
  const isInWishlist = (productId) => {
    if (!productId || !state.products || !Array.isArray(state.products)) {
      return false;
    }
    
    return state.products.some(item => {
      // Handle null/undefined items
      if (!item) return false;
      
      // Handle different data structures
      if (item.product && item.product._id) {
        return item.product._id === productId;
      }
      
      // If item itself has _id (direct product reference)
      if (item._id) {
        return item._id === productId;
      }
      
      return false;
    });
  };

  const value = {
    products: state.products,
    loading: state.loading,
    error: state.error,
    addToWishlist,
    removeFromWishlist,
    clearWishlist,
    loadWishlist,
    isInWishlist
  };

  return (
    <WishlistContext.Provider value={value}>
      {children}
    </WishlistContext.Provider>
  );
};

export const useWishlist = () => {
  const context = useContext(WishlistContext);
  if (!context) {
    throw new Error('useWishlist must be used within a WishlistProvider');
  }
  return context;
};