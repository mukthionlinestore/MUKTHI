import React, { createContext, useContext, useReducer, useEffect } from 'react';
import axios from '../config/axios';
import { useAuth } from './AuthContext';
import { toast } from 'react-toastify';

const CartContext = createContext();

const initialState = {
  items: [],
  total: 0,
  totalItems: 0,
  loading: false,
  error: null
};

const cartReducer = (state, action) => {
  switch (action.type) {
    case 'CART_LOADING':
      return {
        ...state,
        loading: true,
        error: null
      };
    case 'CART_LOADED':
      return {
        ...state,
        items: action.payload.items || [],
        total: action.payload.total || 0,
        totalItems: action.payload.totalItems || 0,
        loading: false,
        error: null
      };
    case 'CART_ERROR':
      return {
        ...state,
        loading: false,
        error: action.payload
      };
    case 'ADD_TO_CART':
      return {
        ...state,
        items: action.payload.items || [],
        total: action.payload.total || 0,
        totalItems: action.payload.totalItems || 0,
        loading: false
      };
    case 'UPDATE_CART_ITEM':
      return {
        ...state,
        items: action.payload.items || [],
        total: action.payload.total || 0,
        totalItems: action.payload.totalItems || 0,
        loading: false
      };
    case 'REMOVE_FROM_CART':
      return {
        ...state,
        items: action.payload.items || [],
        total: action.payload.total || 0,
        totalItems: action.payload.totalItems || 0,
        loading: false
      };
    case 'CLEAR_CART':
      return {
        ...state,
        items: [],
        total: 0,
        totalItems: 0,
        loading: false
      };
    default:
      return state;
  }
};

export const CartProvider = ({ children }) => {
  const [state, dispatch] = useReducer(cartReducer, initialState);
  const { isAuthenticated } = useAuth();

  // Load cart on authentication
  useEffect(() => {
    if (isAuthenticated) {
      loadCart();
    }
  }, [isAuthenticated]);

  // Load cart from server
  const loadCart = async () => {
    if (!isAuthenticated) return;

    dispatch({ type: 'CART_LOADING' });
    try {
      const res = await axios.get('/api/cart');
      
      // Handle cleanup messages
      if (res.data.message) {
        toast.info(res.data.message);
      }
      
      dispatch({
        type: 'CART_LOADED',
        payload: res.data
      });
    } catch (error) {
      const message = error.response?.data?.message || 'Failed to load cart';
      dispatch({
        type: 'CART_ERROR',
        payload: message
      });
      toast.error(message);
    }
  };

  // Add item to cart - handles both product objects and product IDs
  const addToCart = async (product, quantity = 1, selectedColor = null, selectedSize = null) => {
    if (!isAuthenticated) {
      toast.error('Please login to add items to cart');
      return { success: false, error: 'Please login first' };
    }

    // Extract productId from product object or use product directly if it's an ID
    const productId = typeof product === 'object' ? product._id : product;

    dispatch({ type: 'CART_LOADING' });
    try {
      const res = await axios.post('/api/cart/add', {
        productId,
        quantity,
        selectedColor,
        selectedSize
      });

      dispatch({
        type: 'ADD_TO_CART',
        payload: res.data
      });

      toast.success('Item added to cart successfully!');
      return { success: true };
    } catch (error) {
      const message = error.response?.data?.message || 'Failed to add item to cart';
      dispatch({
        type: 'CART_ERROR',
        payload: message
      });
      toast.error(message);
      return { success: false, error: message };
    }
  };

  // Update cart item quantity
  const updateCartItem = async (itemId, quantity) => {
    if (!isAuthenticated) return { success: false, error: 'Please login first' };

    dispatch({ type: 'CART_LOADING' });
    try {
      const res = await axios.put(`/api/cart/update/${itemId}`, { quantity });
      
      // Handle cleanup messages
      if (res.data.message) {
        toast.info(res.data.message);
      }
      
      dispatch({
        type: 'UPDATE_CART_ITEM',
        payload: res.data
      });

      if (quantity <= 0) {
        toast.success('Item removed from cart');
      } else {
        toast.success('Cart updated successfully');
      }

      return { success: true };
    } catch (error) {
      const message = error.response?.data?.message || 'Failed to update cart';
      dispatch({
        type: 'CART_ERROR',
        payload: message
      });
      toast.error(message);
      return { success: false, error: message };
    }
  };

  // Remove item from cart
  const removeFromCart = async (itemId) => {
    if (!isAuthenticated) return { success: false, error: 'Please login first' };

    dispatch({ type: 'CART_LOADING' });
    try {
      const res = await axios.delete(`/api/cart/remove/${itemId}`);
      
      dispatch({
        type: 'REMOVE_FROM_CART',
        payload: res.data
      });

      toast.success('Item removed from cart');
      return { success: true };
    } catch (error) {
      const message = error.response?.data?.message || 'Failed to remove item from cart';
      dispatch({
        type: 'CART_ERROR',
        payload: message
      });
      toast.error(message);
      return { success: false, error: message };
    }
  };

  // Clear cart
  const clearCart = async () => {
    if (!isAuthenticated) return { success: false, error: 'Please login first' };

    dispatch({ type: 'CART_LOADING' });
    try {
      await axios.delete('/api/cart/clear');
      
      dispatch({ type: 'CLEAR_CART' });
      toast.success('Cart cleared successfully');
      return { success: true };
    } catch (error) {
      const message = error.response?.data?.message || 'Failed to clear cart';
      dispatch({
        type: 'CART_ERROR',
        payload: message
      });
      toast.error(message);
      return { success: false, error: message };
    }
  };

  // Get cart item by product ID
  const getCartItem = (productId, selectedColor = null, selectedSize = null) => {
    return state.items.find(item => 
      item.product._id === productId &&
      item.selectedColor?.name === selectedColor?.name &&
      item.selectedSize === selectedSize
    );
  };

  // Check if cart has any items
  const hasItems = state.items.length > 0;

  // Get cart summary
  const getCartSummary = () => {
    return {
      totalItems: state.totalItems,
      total: state.total,
      itemCount: state.items.length
    };
  };

  const value = {
    items: state.items,
    total: state.total,
    totalItems: state.totalItems,
    loading: state.loading,
    error: state.error,
    hasItems,
    addToCart,
    updateCartItem,
    removeFromCart,
    clearCart,
    loadCart,
    getCartItem,
    getCartSummary
  };

  return (
    <CartContext.Provider value={value}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};
