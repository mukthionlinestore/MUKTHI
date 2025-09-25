import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import axios from '../config/axios';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import { useSettings } from '../context/SettingsContext';
import { 
  FaLock, 
  FaArrowLeft, 
  FaShippingFast, 
  FaCreditCard, 
  FaMapMarkerAlt, 
  FaUser, 
  FaPhone, 
  FaEnvelope,
  FaSpinner,
  FaCheck,
  FaShieldAlt,
  FaTruck,
  FaPaypal,
  FaMoneyBillWave,
  FaEdit,
  FaEye,
  FaEyeSlash,
  FaCalendar,
  FaIdCard
} from 'react-icons/fa';
import { toast } from 'react-toastify';
import RazorpayPayment from '../components/RazorpayPayment';
import PaymentInstructions from '../components/PaymentInstructions';

const Checkout = () => {
  const { user, isAuthenticated } = useAuth();
  const { clearCart } = useCart();
  const { settings, calculateTax, formatPrice, calculateTotalWithTax, calculateShipping } = useSettings();
  const navigate = useNavigate();
  const location = useLocation();
  const [loading, setLoading] = useState(true);
  const [placing, setPlacing] = useState(false);
  const [cart, setCart] = useState(null);
  const [directBuyItem, setDirectBuyItem] = useState(null);
  const [isDirectBuy, setIsDirectBuy] = useState(false);
  const [selectedItems, setSelectedItems] = useState([]);
  const [step, setStep] = useState(1);
  const [showPassword, setShowPassword] = useState(false);
  const [showRazorpay, setShowRazorpay] = useState(false);
  const [razorpayOrderId, setRazorpayOrderId] = useState(null);
  const [showPaymentInstructions, setShowPaymentInstructions] = useState(false);

  // Form data
  const [shippingAddress, setShippingAddress] = useState({
    fullName: user?.name || '',
    email: user?.email || '',
    phone: '',
    street: '',
    city: '',
    state: '',
    zipCode: '',
    country: 'United States'
  });

  const [paymentMethod, setPaymentMethod] = useState('Credit Card');
  const [paymentDetails, setPaymentDetails] = useState({
    cardNumber: '',
    expiryDate: '',
    cvv: '',
    nameOnCard: ''
  });

  const [billingAddress, setBillingAddress] = useState({
    sameAsShipping: true,
    fullName: '',
    street: '',
    city: '',
    state: '',
    zipCode: '',
    country: 'United States'
  });

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login?redirect=/checkout');
      return;
    }
    
    // Check if this is a direct buy
    if (location.state?.directBuy && location.state?.directBuyItem) {
      setIsDirectBuy(true);
      setDirectBuyItem(location.state.directBuyItem);
      
      // Check if we have the full product object or just the ID
      if (typeof location.state.directBuyItem.product === 'object') {
        // We already have the full product object, no need to fetch
        const updatedDirectBuyItem = {
          ...location.state.directBuyItem,
          productDetails: location.state.directBuyItem.product
        };
        setDirectBuyItem(updatedDirectBuyItem);
        setLoading(false);
      } else {
        // We have just the product ID, need to fetch the full product
        fetchDirectBuyProduct(location.state.directBuyItem.product);
      }
    } else {
      // Check if selected items are provided
      if (location.state?.selectedItems) {
        setSelectedItems(location.state.selectedItems);
        fetchCartWithSelectedItems(location.state.selectedItems);
      } else {
        fetchCart();
      }
    }
  }, [isAuthenticated, navigate, location.state]);

  const fetchDirectBuyProduct = async (productId) => {
    try {
      setLoading(true);
      const response = await axios.get(`/api/products/${productId}`);
      setDirectBuyItem(prev => ({
        ...prev,
        productDetails: response.data
      }));
    } catch (error) {
      console.error('Error fetching product details:', error);
      toast.error('Failed to load product details');
      navigate('/');
    } finally {
      setLoading(false);
    }
  };

  const fetchCart = async () => {
    try {
      setLoading(true);
      const response = await axios.get('/api/cart');
      setCart(response.data);
      
      if (!response.data || response.data.items.length === 0) {
        toast.error('Your cart is empty');
        navigate('/cart');
        return;
      }
    } catch (error) {
      console.error('Error fetching cart:', error);
      toast.error('Failed to load cart');
      navigate('/cart');
    } finally {
      setLoading(false);
    }
  };

  const fetchCartWithSelectedItems = async (selectedItemIds) => {
    try {
      setLoading(true);
      const response = await axios.get('/api/cart');
      const fullCart = response.data;
      
      if (!fullCart || fullCart.items.length === 0) {
        toast.error('Your cart is empty');
        navigate('/cart');
        return;
      }

      // Filter cart to only include selected items
      const filteredItems = fullCart.items.filter(item => selectedItemIds.includes(item._id));
      const total = filteredItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
      const totalItems = filteredItems.reduce((sum, item) => sum + item.quantity, 0);

      setCart({
        ...fullCart,
        items: filteredItems,
        total,
        totalItems
      });
    } catch (error) {
      console.error('Error fetching cart with selected items:', error);
      toast.error('Failed to load selected items');
      navigate('/cart');
    } finally {
      setLoading(false);
    }
  };

  const handleShippingChange = (e) => {
    const { name, value } = e.target;
    setShippingAddress(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handlePaymentChange = (e) => {
    const { name, value } = e.target;
    setPaymentDetails(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleBillingChange = (e) => {
    const { name, value, type, checked } = e.target;
    if (name === 'sameAsShipping') {
      setBillingAddress(prev => ({
        ...prev,
        sameAsShipping: checked
      }));
    } else {
      setBillingAddress(prev => ({
        ...prev,
        [name]: type === 'checkbox' ? checked : value
      }));
    }
  };

  const validateStep = (stepNumber) => {
    switch (stepNumber) {
      case 1:
        const requiredFields = ['fullName', 'email', 'phone', 'street', 'city', 'state', 'zipCode'];
        return requiredFields.every(field => shippingAddress[field].trim() !== '');
      
      case 2:
        if (paymentMethod === 'Cash on Delivery' || paymentMethod === 'Razorpay') return true;
        return paymentDetails.cardNumber && paymentDetails.expiryDate && 
               paymentDetails.cvv && paymentDetails.nameOnCard;
      
      default:
        return true;
    }
  };

  const nextStep = () => {
    if (validateStep(step)) {
      setStep(step + 1);
    } else {
      toast.error('Please fill in all required fields');
    }
  };

  const prevStep = () => {
    setStep(step - 1);
  };

  const calculateTotals = () => {
    if (isDirectBuy && directBuyItem && directBuyItem.productDetails) {
      const product = directBuyItem.productDetails;
      const quantity = directBuyItem.quantity || 1;
      const subtotal = product.price * quantity;
      const shipping = calculateShipping(subtotal, [product.shippingCharge || 0]);
      const tax = calculateTax(subtotal);
      const total = calculateTotalWithTax(subtotal) + shipping;
      
      return { subtotal, tax, shipping, total };
    }
    
    if (!cart) return { subtotal: 0, tax: 0, shipping: 0, total: 0 };
    
    const subtotal = cart.total || 0;
    const shipping = calculateShipping(subtotal, cart.items?.map(item => item.product?.shippingCharge || 0) || []);
    const tax = calculateTax(subtotal);
    const total = calculateTotalWithTax(subtotal) + shipping;
    
    return { subtotal, tax, shipping, total };
  };

  const placeOrder = async () => {
    if (!validateStep(2)) {
      toast.error('Please complete all payment information');
      return;
    }

    // Handle Razorpay payment
    if (paymentMethod === 'Razorpay') {
      setShowPaymentInstructions(true);
      return;
    }

    setPlacing(true);
    try {
      let orderItems = [];

      if (isDirectBuy && directBuyItem) {
        // For direct buy, transform the direct buy item
        orderItems = [{
          product: directBuyItem.productDetails._id,
          quantity: directBuyItem.quantity || 1,
          selectedColor: directBuyItem.selectedColor,
          selectedSize: directBuyItem.selectedSize,
          price: directBuyItem.productDetails.price
        }];
      } else {
        // For cart checkout, transform cart items
        orderItems = cart.items.map(item => ({
          product: item.product._id || item.product,
          quantity: item.quantity,
          selectedColor: item.selectedColor,
          selectedSize: item.selectedSize,
          price: item.price
        }));
      }

      const orderData = {
        items: orderItems,
        shippingAddress: {
          ...shippingAddress,
          fullName: shippingAddress.fullName,
          email: shippingAddress.email,
          phone: shippingAddress.phone
        },
        paymentMethod,
        paymentDetails: paymentMethod === 'Cash on Delivery' ? null : paymentDetails,
        billingAddress: billingAddress.sameAsShipping ? shippingAddress : billingAddress
      };

      const response = await axios.post('/api/orders', orderData);
      
      // Clear selected items from cart after successful order placement (only for cart checkout, not direct buy)
      if (!isDirectBuy && selectedItems.length > 0) {
        try {
          // Remove only the selected items from cart
          for (const itemId of selectedItems) {
            await axios.delete(`/api/cart/remove/${itemId}`);
          }
        } catch (error) {
          console.error('Error removing selected items from cart:', error);
          // Don't show error to user as order was successful
        }
      } else if (!isDirectBuy) {
        // If no selected items (full cart checkout), clear entire cart
        try {
          await clearCart();
        } catch (error) {
          console.error('Error clearing cart:', error);
          // Don't show error to user as order was successful
        }
      }
      
      toast.success('Order placed successfully!');
      navigate(`/order/${response.data._id}`, { 
        state: { newOrder: true } 
      });
    } catch (error) {
      console.error('Error placing order:', error);
      toast.error(error.response?.data?.message || 'Failed to place order');
    } finally {
      setPlacing(false);
    }
  };

  // Handle Razorpay payment success
  const handleRazorpaySuccess = async (paymentData) => {
    setPlacing(true);
    try {
      let orderItems = [];

      if (isDirectBuy && directBuyItem) {
        orderItems = [{
          product: directBuyItem.productDetails._id,
          quantity: directBuyItem.quantity || 1,
          selectedColor: directBuyItem.selectedColor,
          selectedSize: directBuyItem.selectedSize,
          price: directBuyItem.productDetails.price
        }];
      } else {
        orderItems = cart.items.map(item => ({
          product: item.product._id || item.product,
          quantity: item.quantity,
          selectedColor: item.selectedColor,
          selectedSize: item.selectedSize,
          price: item.price
        }));
      }

      const orderData = {
        items: orderItems,
        shippingAddress: {
          ...shippingAddress,
          fullName: shippingAddress.fullName,
          email: shippingAddress.email,
          phone: shippingAddress.phone
        },
        paymentMethod: 'Razorpay',
        paymentDetails: {
          razorpay_payment_id: paymentData.paymentId,
          razorpay_order_id: paymentData.orderId,
          razorpay_signature: paymentData.signature
        },
        billingAddress: billingAddress.sameAsShipping ? shippingAddress : billingAddress
      };

      const response = await axios.post('/api/orders', orderData);
      
      // Clear cart after successful payment
      if (!isDirectBuy && selectedItems.length > 0) {
        try {
          for (const itemId of selectedItems) {
            await axios.delete(`/api/cart/remove/${itemId}`);
          }
        } catch (error) {
          console.error('Error removing selected items from cart:', error);
        }
      } else if (!isDirectBuy) {
        try {
          await clearCart();
        } catch (error) {
          console.error('Error clearing cart:', error);
        }
      }
      
      toast.success('Payment successful! Order placed successfully!');
      navigate(`/order/${response.data._id}`, { 
        state: { newOrder: true } 
      });
    } catch (error) {
      console.error('Error placing order after payment:', error);
      toast.error(error.response?.data?.message || 'Failed to place order');
    } finally {
      setPlacing(false);
      setShowRazorpay(false);
    }
  };

  // Handle Razorpay payment failure
  const handleRazorpayFailure = (error) => {
    console.error('Razorpay payment failed:', error);
    toast.error('Payment failed. Please try again.');
    setShowRazorpay(false);
  };

  // Start Razorpay payment after instructions
  const startRazorpayPayment = () => {
    setShowPaymentInstructions(false);
    const totals = calculateTotals();
    setRazorpayOrderId(`order_${Date.now()}`);
    setShowRazorpay(true);
  };

  if (!isAuthenticated) {
    return null;
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-emerald-50 to-teal-50 flex items-center justify-center">
        <div className="text-center">
          <FaSpinner className="w-8 h-8 sm:w-12 sm:h-12 text-emerald-600 animate-spin mx-auto mb-4" />
          <p className="text-sm sm:text-base text-gray-600">Loading checkout...</p>
        </div>
      </div>
    );
  }

  // For direct buy, we need to fetch the product details
  if (isDirectBuy && (!directBuyItem || !directBuyItem.productDetails)) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-emerald-50 to-teal-50 flex items-center justify-center">
        <div className="text-center">
          <FaSpinner className="w-8 h-8 sm:w-12 sm:h-12 text-emerald-600 animate-spin mx-auto mb-4" />
          <p className="text-sm sm:text-base text-gray-600">Loading product details...</p>
        </div>
      </div>
    );
  }

  if (!isDirectBuy && (!cart || cart.items.length === 0)) {
    return null; // Will redirect in useEffect
  }

  const totals = calculateTotals();

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 to-teal-50">
      {/* Header Section */}
      <div className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-3 sm:px-4 lg:px-6 py-4 sm:py-6">
          <div className="flex items-center gap-3 sm:gap-4">
            <button 
              onClick={() => isDirectBuy ? navigate('/') : navigate('/cart')}
              className="inline-flex items-center justify-center h-8 w-8 sm:h-10 sm:w-10 rounded-lg bg-gray-100 hover:bg-gray-200 transition-colors"
            >
              <FaArrowLeft className="w-3 h-3 sm:w-4 sm:h-4 text-gray-600" />
            </button>
            <div>
              <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-900">Secure Checkout</h1>
              <p className="text-xs sm:text-sm text-gray-600 mt-1">Complete your purchase safely</p>
            </div>
          </div>
        </div>
      </div>

      {/* Progress Steps */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-3 sm:px-4 lg:px-6 py-4 sm:py-6">
          <div className="flex items-center justify-center space-x-4 sm:space-x-8">
            <div className={`flex items-center ${step >= 1 ? 'text-emerald-600' : 'text-gray-400'}`}>
              <div className={`rounded-full h-6 w-6 sm:h-8 sm:w-8 flex items-center justify-center border-2 text-xs sm:text-sm font-medium ${step >= 1 ? 'bg-emerald-600 border-emerald-600 text-white' : 'border-gray-300'}`}>
                {step > 1 ? <FaCheck className="w-3 h-3 sm:w-4 sm:h-4" /> : '1'}
              </div>
              <span className="ml-2 text-xs sm:text-sm font-medium">Shipping</span>
            </div>
            <div className={`h-1 w-8 sm:w-16 ${step >= 2 ? 'bg-emerald-600' : 'bg-gray-300'}`}></div>
            <div className={`flex items-center ${step >= 2 ? 'text-emerald-600' : 'text-gray-400'}`}>
              <div className={`rounded-full h-6 w-6 sm:h-8 sm:w-8 flex items-center justify-center border-2 text-xs sm:text-sm font-medium ${step >= 2 ? 'bg-emerald-600 border-emerald-600 text-white' : 'border-gray-300'}`}>
                {step > 2 ? <FaCheck className="w-3 h-3 sm:w-4 sm:h-4" /> : '2'}
              </div>
              <span className="ml-2 text-xs sm:text-sm font-medium">Payment</span>
            </div>
            <div className={`h-1 w-8 sm:w-16 ${step >= 3 ? 'bg-emerald-600' : 'bg-gray-300'}`}></div>
            <div className={`flex items-center ${step >= 3 ? 'text-emerald-600' : 'text-gray-400'}`}>
              <div className={`rounded-full h-6 w-6 sm:h-8 sm:w-8 flex items-center justify-center border-2 text-xs sm:text-sm font-medium ${step >= 3 ? 'bg-emerald-600 border-emerald-600 text-white' : 'border-gray-300'}`}>
                3
              </div>
              <span className="ml-2 text-xs sm:text-sm font-medium">Review</span>
            </div>
          </div>
        </div>
      </div>

      {/* Content Section */}
      <div className="max-w-7xl mx-auto px-3 sm:px-4 lg:px-6 py-4 sm:py-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6">
          {/* Main Content */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 sm:p-6">
              
              {/* Step 1: Shipping Address */}
              {step === 1 && (
                <div>
                  <div className="flex items-center gap-2 sm:gap-3 mb-4 sm:mb-6">
                    <div className="w-8 h-8 sm:w-10 sm:h-10 bg-emerald-100 rounded-lg flex items-center justify-center">
                      <FaMapMarkerAlt className="w-4 h-4 sm:w-5 sm:h-5 text-emerald-600" />
                    </div>
                    <h2 className="text-lg sm:text-xl font-semibold text-gray-900">Shipping Address</h2>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                    <div>
                      <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1.5 sm:mb-2">
                        <FaUser className="inline w-3 h-3 sm:w-4 sm:h-4 mr-1.5 text-emerald-600" />
                        Full Name *
                      </label>
                      <input
                        type="text"
                        name="fullName"
                        value={shippingAddress.fullName}
                        onChange={handleShippingChange}
                        className="w-full px-3 py-2 sm:py-2.5 text-xs sm:text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1.5 sm:mb-2">
                        <FaEnvelope className="inline w-3 h-3 sm:w-4 sm:h-4 mr-1.5 text-emerald-600" />
                        Email *
                      </label>
                      <input
                        type="email"
                        name="email"
                        value={shippingAddress.email}
                        onChange={handleShippingChange}
                        className="w-full px-3 py-2 sm:py-2.5 text-xs sm:text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1.5 sm:mb-2">
                        <FaPhone className="inline w-3 h-3 sm:w-4 sm:h-4 mr-1.5 text-emerald-600" />
                        Phone *
                      </label>
                      <input
                        type="tel"
                        name="phone"
                        value={shippingAddress.phone}
                        onChange={handleShippingChange}
                        className="w-full px-3 py-2 sm:py-2.5 text-xs sm:text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1.5 sm:mb-2">Country *</label>
                      <select
                        name="country"
                        value={shippingAddress.country}
                        onChange={handleShippingChange}
                        className="w-full px-3 py-2 sm:py-2.5 text-xs sm:text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                      >
                        <option value="United States">United States</option>
                        <option value="Canada">Canada</option>
                        <option value="United Kingdom">United Kingdom</option>
                      </select>
                    </div>

                    <div className="sm:col-span-2">
                      <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1.5 sm:mb-2">Street Address *</label>
                      <input
                        type="text"
                        name="street"
                        value={shippingAddress.street}
                        onChange={handleShippingChange}
                        className="w-full px-3 py-2 sm:py-2.5 text-xs sm:text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                        placeholder="123 Main Street"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1.5 sm:mb-2">City *</label>
                      <input
                        type="text"
                        name="city"
                        value={shippingAddress.city}
                        onChange={handleShippingChange}
                        className="w-full px-3 py-2 sm:py-2.5 text-xs sm:text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1.5 sm:mb-2">State *</label>
                      <input
                        type="text"
                        name="state"
                        value={shippingAddress.state}
                        onChange={handleShippingChange}
                        className="w-full px-3 py-2 sm:py-2.5 text-xs sm:text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1.5 sm:mb-2">ZIP Code *</label>
                      <input
                        type="text"
                        name="zipCode"
                        value={shippingAddress.zipCode}
                        onChange={handleShippingChange}
                        className="w-full px-3 py-2 sm:py-2.5 text-xs sm:text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                        required
                      />
                    </div>
                  </div>

                  <div className="mt-6 flex justify-end">
                    <button
                      onClick={nextStep}
                      className="inline-flex items-center gap-2 px-4 sm:px-6 py-2 sm:py-3 bg-gradient-to-r from-emerald-600 to-teal-600 text-white text-xs sm:text-sm font-semibold rounded-lg hover:from-emerald-700 hover:to-teal-700 transition-all duration-200 shadow-lg hover:shadow-xl"
                    >
                      Continue to Payment
                      <FaCreditCard className="w-3 h-3 sm:w-4 sm:h-4" />
                    </button>
                  </div>
                </div>
              )}

              {/* Step 2: Payment */}
              {step === 2 && (
                <div>
                  <div className="flex items-center gap-2 sm:gap-3 mb-4 sm:mb-6">
                    <div className="w-8 h-8 sm:w-10 sm:h-10 bg-emerald-100 rounded-lg flex items-center justify-center">
                      <FaCreditCard className="w-4 h-4 sm:w-5 sm:h-5 text-emerald-600" />
                    </div>
                    <h2 className="text-lg sm:text-xl font-semibold text-gray-900">Payment Method</h2>
                  </div>

                  {/* Payment Method Selection */}
                  <div className="space-y-3 sm:space-y-4 mb-6">
                    <label className="flex items-center p-3 sm:p-4 border border-gray-200 rounded-lg cursor-pointer hover:bg-gray-50 transition-colors">
                      <input
                        type="radio"
                        name="paymentMethod"
                        value="Credit Card"
                        checked={paymentMethod === 'Credit Card'}
                        onChange={(e) => setPaymentMethod(e.target.value)}
                        className="mr-3"
                      />
                      <FaCreditCard className="w-4 h-4 sm:w-5 sm:h-5 text-emerald-600 mr-2" />
                      <span className="text-xs sm:text-sm">Credit/Debit Card</span>
                    </label>

                    <label className="flex items-center p-3 sm:p-4 border border-gray-200 rounded-lg cursor-pointer hover:bg-gray-50 transition-colors">
                      <input
                        type="radio"
                        name="paymentMethod"
                        value="PayPal"
                        checked={paymentMethod === 'PayPal'}
                        onChange={(e) => setPaymentMethod(e.target.value)}
                        className="mr-3"
                      />
                      <FaPaypal className="w-4 h-4 sm:w-5 sm:h-5 text-blue-600 mr-2" />
                      <span className="text-xs sm:text-sm text-blue-600 font-bold">PayPal</span>
                    </label>

                    <label className="flex items-center p-3 sm:p-4 border border-gray-200 rounded-lg cursor-pointer hover:bg-gray-50 transition-colors">
                      <input
                        type="radio"
                        name="paymentMethod"
                        value="Razorpay"
                        checked={paymentMethod === 'Razorpay'}
                        onChange={(e) => setPaymentMethod(e.target.value)}
                        className="mr-3"
                      />
                      <div className="w-4 h-4 sm:w-5 sm:h-5 bg-blue-600 rounded mr-2 flex items-center justify-center">
                        <span className="text-white text-[6px] sm:text-xs font-bold">R</span>
                      </div>
                      <span className="text-xs sm:text-sm text-blue-600 font-bold">Razorpay</span>
                    </label>

                    <label className="flex items-center p-3 sm:p-4 border border-gray-200 rounded-lg cursor-pointer hover:bg-gray-50 transition-colors">
                      <input
                        type="radio"
                        name="paymentMethod"
                        value="Cash on Delivery"
                        checked={paymentMethod === 'Cash on Delivery'}
                        onChange={(e) => setPaymentMethod(e.target.value)}
                        className="mr-3"
                      />
                      <FaMoneyBillWave className="w-4 h-4 sm:w-5 sm:h-5 text-green-600 mr-2" />
                      <span className="text-xs sm:text-sm">Cash on Delivery</span>
                    </label>
                  </div>

                  {/* Card Details */}
                  {(paymentMethod === 'Credit Card' || paymentMethod === 'Debit Card') && (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                      <div className="sm:col-span-2">
                        <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1.5 sm:mb-2">
                          <FaIdCard className="inline w-3 h-3 sm:w-4 sm:h-4 mr-1.5 text-emerald-600" />
                          Card Number *
                        </label>
                        <input
                          type="text"
                          name="cardNumber"
                          value={paymentDetails.cardNumber}
                          onChange={handlePaymentChange}
                          placeholder="1234 5678 9012 3456"
                          className="w-full px-3 py-2 sm:py-2.5 text-xs sm:text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                          maxLength="19"
                        />
                      </div>

                      <div>
                        <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1.5 sm:mb-2">
                          <FaCalendar className="inline w-3 h-3 sm:w-4 sm:h-4 mr-1.5 text-emerald-600" />
                          Expiry Date *
                        </label>
                        <input
                          type="text"
                          name="expiryDate"
                          value={paymentDetails.expiryDate}
                          onChange={handlePaymentChange}
                          placeholder="MM/YY"
                          className="w-full px-3 py-2 sm:py-2.5 text-xs sm:text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                          maxLength="5"
                        />
                      </div>

                      <div>
                        <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1.5 sm:mb-2">CVV *</label>
                        <div className="relative">
                          <input
                            type={showPassword ? "text" : "password"}
                            name="cvv"
                            value={paymentDetails.cvv}
                            onChange={handlePaymentChange}
                            placeholder="123"
                            className="w-full px-3 py-2 sm:py-2.5 text-xs sm:text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 pr-10"
                            maxLength="4"
                          />
                          <button
                            type="button"
                            onClick={() => setShowPassword(!showPassword)}
                            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                          >
                            {showPassword ? <FaEyeSlash className="w-3 h-3 sm:w-4 sm:h-4" /> : <FaEye className="w-3 h-3 sm:w-4 sm:h-4" />}
                          </button>
                        </div>
                      </div>

                      <div className="sm:col-span-2">
                        <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1.5 sm:mb-2">Name on Card *</label>
                        <input
                          type="text"
                          name="nameOnCard"
                          value={paymentDetails.nameOnCard}
                          onChange={handlePaymentChange}
                          className="w-full px-3 py-2 sm:py-2.5 text-xs sm:text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                        />
                      </div>
                    </div>
                  )}

                  <div className="mt-6 flex justify-between">
                    <button
                      onClick={prevStep}
                      className="inline-flex items-center gap-2 px-4 sm:px-6 py-2 sm:py-3 border border-gray-300 text-gray-700 text-xs sm:text-sm font-medium rounded-lg hover:bg-gray-50 transition-colors"
                    >
                      <FaArrowLeft className="w-3 h-3 sm:w-4 sm:h-4" />
                      Back
                    </button>
                    <button
                      onClick={nextStep}
                      className="inline-flex items-center gap-2 px-4 sm:px-6 py-2 sm:py-3 bg-gradient-to-r from-emerald-600 to-teal-600 text-white text-xs sm:text-sm font-semibold rounded-lg hover:from-emerald-700 hover:to-teal-700 transition-all duration-200 shadow-lg hover:shadow-xl"
                    >
                      Review Order
                      <FaEye className="w-3 h-3 sm:w-4 sm:h-4" />
                    </button>
                  </div>
                </div>
              )}

              {/* Step 3: Review */}
              {step === 3 && (
                <div>
                  <div className="flex items-center gap-2 sm:gap-3 mb-4 sm:mb-6">
                    <div className="w-8 h-8 sm:w-10 sm:h-10 bg-emerald-100 rounded-lg flex items-center justify-center">
                      <FaCheck className="w-4 h-4 sm:w-5 sm:h-5 text-emerald-600" />
                    </div>
                    <h2 className="text-lg sm:text-xl font-semibold text-gray-900">Review Your Order</h2>
                  </div>

                  {/* Shipping Address Review */}
                  <div className="mb-4 sm:mb-6 p-3 sm:p-4 bg-gray-50 rounded-lg">
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="text-sm sm:text-base font-medium text-gray-900">Shipping Address</h3>
                      <button 
                        onClick={() => setStep(1)} 
                        className="inline-flex items-center gap-1 text-xs sm:text-sm text-emerald-600 hover:text-emerald-700"
                      >
                        <FaEdit className="w-3 h-3 sm:w-4 sm:h-4" />
                        Edit
                      </button>
                    </div>
                    <div className="text-xs sm:text-sm text-gray-600 space-y-1">
                      <p>{shippingAddress.fullName}</p>
                      <p>{shippingAddress.street}</p>
                      <p>{shippingAddress.city}, {shippingAddress.state} {shippingAddress.zipCode}</p>
                      <p>{shippingAddress.country}</p>
                      <p>Phone: {shippingAddress.phone}</p>
                    </div>
                  </div>

                  {/* Payment Method Review */}
                  <div className="mb-4 sm:mb-6 p-3 sm:p-4 bg-gray-50 rounded-lg">
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="text-sm sm:text-base font-medium text-gray-900">Payment Method</h3>
                      <button 
                        onClick={() => setStep(2)} 
                        className="inline-flex items-center gap-1 text-xs sm:text-sm text-emerald-600 hover:text-emerald-700"
                      >
                        <FaEdit className="w-3 h-3 sm:w-4 sm:h-4" />
                        Edit
                      </button>
                    </div>
                    <div className="text-xs sm:text-sm text-gray-600">
                      <p>{paymentMethod}</p>
                      {paymentMethod === 'Credit Card' && paymentDetails.cardNumber && (
                        <p>****-****-****-{paymentDetails.cardNumber.slice(-4)}</p>
                      )}
                    </div>
                  </div>

                  <div className="mt-6 flex justify-between">
                    <button
                      onClick={prevStep}
                      className="inline-flex items-center gap-2 px-4 sm:px-6 py-2 sm:py-3 border border-gray-300 text-gray-700 text-xs sm:text-sm font-medium rounded-lg hover:bg-gray-50 transition-colors"
                    >
                      <FaArrowLeft className="w-3 h-3 sm:w-4 sm:h-4" />
                      Back
                    </button>
                    <button
                      onClick={placeOrder}
                      disabled={placing}
                      className="inline-flex items-center gap-2 px-6 sm:px-8 py-2 sm:py-3 bg-gradient-to-r from-green-600 to-emerald-600 text-white text-xs sm:text-sm font-semibold rounded-lg hover:from-green-700 hover:to-emerald-700 transition-all duration-200 shadow-lg hover:shadow-xl disabled:opacity-50"
                    >
                      {placing ? (
                        <>
                          <FaSpinner className="w-3 h-3 sm:w-4 sm:h-4 animate-spin" />
                          Placing Order...
                        </>
                      ) : (
                        <>
                          <FaLock className="w-3 h-3 sm:w-4 sm:h-4" />
                          Place Order
                        </>
                      )}
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Order Summary Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 sm:p-6 sticky top-8">
              <h3 className="text-lg sm:text-xl font-semibold text-gray-900 mb-4 sm:mb-6">Order Summary</h3>
              
              {/* Order Items */}
              <div className="space-y-3 mb-4 sm:mb-6">
                {isDirectBuy && directBuyItem ? (
                  // Direct buy item
                  <div className="flex gap-3">
                    <img
                      src={directBuyItem.productDetails?.images?.[0]}
                      alt={directBuyItem.productDetails?.name}
                      className="w-12 h-12 sm:w-16 sm:h-16 object-cover rounded-lg"
                    />
                    <div className="flex-1 min-w-0">
                      <p className="text-xs sm:text-sm font-medium truncate">{directBuyItem.productDetails?.name}</p>
                      <p className="text-xs text-gray-500">Qty: {directBuyItem.quantity}</p>
                      {directBuyItem.selectedColor && (
                        <p className="text-xs text-gray-500">Color: {directBuyItem.selectedColor.name}</p>
                      )}
                      {directBuyItem.selectedSize && (
                        <p className="text-xs text-gray-500">Size: {directBuyItem.selectedSize}</p>
                      )}
                    </div>
                    <p className="text-xs sm:text-sm font-medium">{formatPrice(directBuyItem.productDetails?.price * directBuyItem.quantity)}</p>
                  </div>
                ) : (
                  // Cart items
                  cart.items.map((item) => (
                    <div key={item._id} className="flex gap-3">
                      <img
                        src={item.product?.images?.[0]}
                        alt={item.product?.name}
                        className="w-12 h-12 sm:w-16 sm:h-16 object-cover rounded-lg"
                      />
                      <div className="flex-1 min-w-0">
                        <p className="text-xs sm:text-sm font-medium truncate">{item.product?.name}</p>
                        <p className="text-xs text-gray-500">Qty: {item.quantity}</p>
                      </div>
                      <p className="text-xs sm:text-sm font-medium">{formatPrice(item.price * item.quantity)}</p>
                    </div>
                  ))
                )}
              </div>

              <div className="border-t pt-4 space-y-2 sm:space-y-3">
                <div className="flex justify-between text-xs sm:text-sm">
                  <span>Subtotal</span>
                  <span>{formatPrice(totals.subtotal)}</span>
                </div>
                <div className="flex justify-between text-xs sm:text-sm">
                  <span>Shipping</span>
                  <span className={totals.shipping === 0 ? 'text-emerald-600 font-medium' : ''}>
                    {totals.shipping === 0 ? 'Free' : formatPrice(totals.shipping)}
                  </span>
                </div>
                <div className="flex justify-between text-xs sm:text-sm">
                  <span>Tax</span>
                  <span>{formatPrice(totals.tax)}</span>
                </div>
                <div className="border-t pt-2 sm:pt-3 flex justify-between font-bold text-sm sm:text-base">
                  <span>Total</span>
                  <span>{formatPrice(totals.total)}</span>
                </div>
              </div>

              {/* Benefits */}
              <div className="mt-4 sm:mt-6 space-y-2 sm:space-y-3">
                <div className="flex items-center gap-2 text-xs sm:text-sm text-gray-600">
                  <FaShieldAlt className="w-3 h-3 sm:w-4 sm:h-4 text-emerald-600" />
                  <span>Secure checkout</span>
                </div>
                <div className="flex items-center gap-2 text-xs sm:text-sm text-gray-600">
                  <FaTruck className="w-3 h-3 sm:w-4 sm:h-4 text-emerald-600" />
                  <span>{totals.shipping === 0 ? 'Free shipping!' : 'Standard shipping'}</span>
                </div>
                <div className="flex items-center gap-2 text-xs sm:text-sm text-gray-600">
                  <FaCreditCard className="w-3 h-3 sm:w-4 sm:h-4 text-emerald-600" />
                  <span>Multiple payment options</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Payment Instructions Modal */}
      {showPaymentInstructions && (
        <PaymentInstructions onClose={startRazorpayPayment} />
      )}

      {/* Razorpay Payment Component */}
      {showRazorpay && (
        <RazorpayPayment
          amount={calculateTotals().total}
          currency="INR"
          onSuccess={handleRazorpaySuccess}
          onFailure={handleRazorpayFailure}
          orderId={razorpayOrderId}
          customerDetails={{
            name: shippingAddress.fullName,
            email: shippingAddress.email,
            phone: shippingAddress.phone,
            address: `${shippingAddress.street}, ${shippingAddress.city}, ${shippingAddress.state} ${shippingAddress.zipCode}`
          }}
        />
      )}
    </div>
  );
};

export default Checkout;