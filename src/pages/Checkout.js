import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import axios from '../config/axios';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import { useSettings } from '../context/SettingsContext';
import { useWebsiteConfig } from '../context/WebsiteConfigContext';
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
  const { config } = useWebsiteConfig();
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

  // Stock validation function
  const validateStock = async (items) => {
    const outOfStockItems = [];
    
    for (const item of items) {
      try {
        const productId = item.product._id || item.product;
        const response = await axios.get(`/api/products/${productId}`);
        const product = response.data;
        
        if (!product.isActive) {
          outOfStockItems.push({
            name: product.name,
            reason: 'Product is no longer available'
          });
        } else if (product.stock !== undefined && product.stock < item.quantity) {
          outOfStockItems.push({
            name: product.name,
            reason: `Only ${product.stock} items available in stock`
          });
        }
      } catch (error) {
        console.error('Error checking stock for product:', error);
        outOfStockItems.push({
          name: item.product?.name || 'Unknown Product',
          reason: 'Unable to verify stock'
        });
      }
    }
    
    return outOfStockItems;
  };

  // Helper functions for social media redirects
  const generateOrderMessage = (orderData) => {
    const { items, total, shippingAddress } = orderData;
    let message = `🛍️ *New Order Request*\n\n`;
    message += `📋 *Order Details:*\n`;
    
    items.forEach((item, index) => {
      // Handle different item structures (cart items vs direct buy items)
      const productName = item.name || item.productDetails?.name || item.product?.name || 'Product';
      const productDetails = item.productDetails || item.product || {};
      const quantity = item.quantity || 1;
      const price = item.price || productDetails.price || 0;
      
      message += `${index + 1}. *${productName}*\n`;
      
      // Product details
      if (productDetails.brand) {
        message += `   Brand: ${productDetails.brand}\n`;
      }
      if (productDetails.category) {
        message += `   Category: ${productDetails.category}\n`;
      }
      if (productDetails.description) {
        message += `   Description: ${productDetails.description.substring(0, 100)}${productDetails.description.length > 100 ? '...' : ''}\n`;
      }
      
      // Selected options (color, size, etc.)
      if (item.selectedColor) {
        // Handle color as object or string
        const colorValue = typeof item.selectedColor === 'object' 
          ? item.selectedColor.name || item.selectedColor.value || item.selectedColor.color || JSON.stringify(item.selectedColor)
          : item.selectedColor;
        message += `   Color: ${colorValue}\n`;
      }
      if (item.selectedSize) {
        // Handle size as object or string
        const sizeValue = typeof item.selectedSize === 'object' 
          ? item.selectedSize.name || item.selectedSize.value || item.selectedSize.size || JSON.stringify(item.selectedSize)
          : item.selectedSize;
        message += `   Size: ${sizeValue}\n`;
      }
      if (item.selectedOptions && Object.keys(item.selectedOptions).length > 0) {
        Object.entries(item.selectedOptions).forEach(([key, value]) => {
          if (value) {
            // Handle value as object or string
            const optionValue = typeof value === 'object' 
              ? value.name || value.value || value.label || JSON.stringify(value)
              : value;
            message += `   ${key.charAt(0).toUpperCase() + key.slice(1)}: ${optionValue}\n`;
          }
        });
      }
      
      // Pricing details
      message += `   Quantity: ${quantity}\n`;
      message += `   Unit Price: ₹${price}\n`;
      message += `   Subtotal: ₹${price * quantity}\n`;
      
      // Product image if available
      if (productDetails.images && productDetails.images.length > 0) {
        message += `   Image: ${productDetails.images[0]}\n`;
      }
      
      message += `\n`;
    });
    
    // Calculate totals
    const subtotal = items.reduce((sum, item) => {
      const quantity = item.quantity || 1;
      const price = item.price || item.productDetails?.price || item.product?.price || 0;
      return sum + (price * quantity);
    }, 0);
    const shipping = calculateShipping ? calculateShipping(items) : 0;
    const tax = calculateTax ? calculateTax(subtotal) : 0;
    const finalTotal = subtotal + shipping + tax;
    
    message += `💰 *Pricing Summary:*\n`;
    message += `Subtotal: ₹${subtotal}\n`;
    if (shipping > 0) {
      message += `Shipping: ₹${shipping}\n`;
    }
    if (tax > 0) {
      message += `Tax: ₹${tax}\n`;
    }
    message += `*Total Amount: ₹${finalTotal}*\n\n`;
    
    message += `👤 *Customer Details:*\n`;
    message += `Name: ${shippingAddress.fullName}\n`;
    message += `Email: ${shippingAddress.email}\n`;
    message += `Phone: ${shippingAddress.phone}\n`;
    message += `Address: ${shippingAddress.street}, ${shippingAddress.city}, ${shippingAddress.state} ${shippingAddress.zipCode}\n`;
    if (shippingAddress.country) {
      message += `Country: ${shippingAddress.country}\n`;
    }
    message += `\n`;
    
    message += `📅 *Order Date:* ${new Date().toLocaleDateString('en-IN', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })}\n\n`;
    
    message += `Please confirm this order and provide payment details.`;
    
    return message;
  };

  const createSocialMediaOrder = async (orderData) => {
    try {
      console.log('=== Creating Social Media Order ===');
      console.log('isDirectBuy:', isDirectBuy);
      console.log('directBuyItem:', directBuyItem);
      console.log('cart:', cart);
      console.log('cart.items:', cart?.items);
      console.log('isAuthenticated:', isAuthenticated);
      console.log('user:', user);

      // Check if user is authenticated
      if (!isAuthenticated) {
        throw new Error('User not authenticated');
      }

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
        if (!cart || !cart.items || cart.items.length === 0) {
          throw new Error('No items in cart');
        }
        
        orderItems = cart.items.map(item => {
          console.log('Processing cart item:', item);
          return {
            product: item.product._id || item.product,
            quantity: item.quantity,
            selectedColor: item.selectedColor,
            selectedSize: item.selectedSize,
            price: item.price
          };
        });
      }

      // Validate stock before placing order
      const outOfStockItems = await validateStock(orderItems);
      if (outOfStockItems.length > 0) {
        // Show toast for each out of stock item
        outOfStockItems.forEach(item => {
          toast.error(`${item.name}: ${item.reason}`);
        });
        throw new Error('Some items are out of stock');
      }

      const cleanBillingAddress = billingAddress.sameAsShipping 
        ? shippingAddress 
        : {
            fullName: billingAddress.fullName,
            street: billingAddress.street,
            city: billingAddress.city,
            state: billingAddress.state,
            zipCode: billingAddress.zipCode,
            country: billingAddress.country
          };

      const orderPayload = {
        items: orderItems,
        shippingAddress: {
          ...shippingAddress,
          fullName: shippingAddress.fullName,
          email: shippingAddress.email,
          phone: shippingAddress.phone
        },
        paymentMethod,
        paymentDetails: null, // No payment details for social media orders
        billingAddress: cleanBillingAddress
      };

      console.log('Creating social media order:', orderPayload);
      console.log('Order items:', orderItems);
      console.log('Shipping address:', shippingAddress);
      console.log('Payment method:', paymentMethod);

      const response = await axios.post('/api/orders', orderPayload);
      
      // Decrease cart quantities after successful order placement (only for cart checkout, not direct buy)
      if (!isDirectBuy && cart && cart.items) {
        // For social media orders, decrease quantities instead of clearing entire cart
        try {
          for (const item of cart.items) {
            // Remove the ordered quantity from cart
            await axios.delete(`/api/cart/remove/${item._id}`);
          }
          
          // Refresh cart state
          const updatedCart = await axios.get('/api/cart');
          setCart(updatedCart.data);
        } catch (error) {
          console.error('Error updating cart quantities:', error);
          // Don't show error to user as order was successful
        }
      }

      console.log('Social media order created successfully:', response.data);
      return response.data;
      
    } catch (error) {
      console.error('Error creating social media order:', error);
      console.error('Error response:', error.response?.data);
      console.error('Error status:', error.response?.status);
      throw error;
    }
  };

  const handleWhatsAppRedirect = async (orderData) => {
    const whatsappNumber = config?.paymentSettings?.whatsappNumber;
    
    if (!whatsappNumber) {
      toast.error('WhatsApp number not configured');
      return;
    }
    
    setPlacing(true);
    try {
      // First, create the order in the database (same as Cash on Delivery flow)
      const order = await createSocialMediaOrder(orderData);
      
      // Generate the message for WhatsApp
      const message = generateOrderMessage(orderData);
      const encodedMessage = encodeURIComponent(message);
      const whatsappUrl = `https://wa.me/${whatsappNumber.replace(/[^0-9]/g, '')}?text=${encodedMessage}`;
      
      // Open WhatsApp in a new tab
      window.open(whatsappUrl, '_blank');
      
      // Show success message and redirect to orders
      toast.success('Order placed successfully! Redirecting to WhatsApp...');
      
      // Redirect to orders page after a short delay
      setTimeout(() => {
        navigate('/orders');
      }, 2000);
      
    } catch (error) {
      console.error('Error creating WhatsApp order:', error);
      toast.error('Failed to place order. Please try again.');
    } finally {
      setPlacing(false);
    }
  };

  const handleInstagramRedirect = async (orderData) => {
    const instagramUsername = config?.paymentSettings?.instagramUsername;
    
    if (!instagramUsername) {
      toast.error('Instagram username not configured');
      return;
    }
    
    setPlacing(true);
    try {
      // First, create the order in the database (same as Cash on Delivery flow)
      const order = await createSocialMediaOrder(orderData);
      
      // Generate the message for Instagram
      const message = generateOrderMessage(orderData);
      
      // Show a modal with the order details and Instagram options
      const modal = document.createElement('div');
      modal.innerHTML = `
        <div style="position: fixed; top: 0; left: 0; width: 100%; height: 100%; background: rgba(0,0,0,0.8); z-index: 9999; display: flex; align-items: center; justify-content: center; padding: 20px;">
          <div style="background: white; padding: 30px; border-radius: 15px; max-width: 600px; max-height: 90vh; overflow-y: auto; box-shadow: 0 20px 40px rgba(0,0,0,0.3);">
            <div style="display: flex; align-items: center; margin-bottom: 20px;">
              <div style="width: 40px; height: 40px; background: linear-gradient(45deg, #f09433 0%, #e6683c 25%, #dc2743 50%, #cc2366 75%, #bc1888 100%); border-radius: 10px; display: flex; align-items: center; justify-content: center; margin-right: 15px;">
                <span style="color: white; font-weight: bold; font-size: 18px;">I</span>
              </div>
              <h3 style="margin: 0; color: #333; font-size: 24px;">Instagram Order</h3>
            </div>
            
            <p style="margin-bottom: 20px; color: #666; font-size: 16px; line-height: 1.5;">
              Your order details have been prepared. Choose how you'd like to send them to <strong>@${instagramUsername}</strong>:
            </p>
            
            <div style="background: #f8f9fa; padding: 20px; border-radius: 10px; margin-bottom: 20px; border-left: 4px solid #E4405F;">
              <h4 style="margin: 0 0 15px 0; color: #333; font-size: 18px;">📋 Order Details:</h4>
              <textarea readonly style="width: 100%; height: 200px; padding: 15px; border: 1px solid #ddd; border-radius: 8px; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; font-size: 14px; line-height: 1.4; resize: none; background: white;">${message}</textarea>
            </div>
            
            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 15px; margin-bottom: 20px;">
              <button id="copyBtn" style="padding: 15px 20px; background: #007bff; color: white; border: none; border-radius: 10px; cursor: pointer; font-size: 16px; font-weight: 600; transition: all 0.3s ease; display: flex; align-items: center; justify-content: center; gap: 8px;">
                📋 Copy Message
              </button>
              <button id="openInstagramBtn" style="padding: 15px 20px; background: linear-gradient(45deg, #f09433 0%, #e6683c 25%, #dc2743 50%, #cc2366 75%, #bc1888 100%); color: white; border: none; border-radius: 10px; cursor: pointer; font-size: 16px; font-weight: 600; transition: all 0.3s ease; display: flex; align-items: center; justify-content: center; gap: 8px;">
                📱 Open Instagram
              </button>
            </div>
            
            <div style="background: #e3f2fd; padding: 15px; border-radius: 8px; margin-bottom: 20px;">
              <h4 style="margin: 0 0 10px 0; color: #1976d2; font-size: 16px;">💡 Instructions:</h4>
              <ol style="margin: 0; padding-left: 20px; color: #555; font-size: 14px; line-height: 1.6;">
                <li>Click "Copy Message" to copy the order details</li>
                <li>Click "Open Instagram" to go to @${instagramUsername}'s profile</li>
                <li>Send them a direct message and paste the order details</li>
                <li>Wait for their confirmation and payment instructions</li>
              </ol>
            </div>
            
            <div style="display: flex; gap: 10px; justify-content: flex-end;">
              <button id="closeBtn" style="padding: 12px 24px; background: #6c757d; color: white; border: none; border-radius: 8px; cursor: pointer; font-size: 14px; font-weight: 500;">Close</button>
            </div>
          </div>
        </div>
      `;
      
      document.body.appendChild(modal);
      
      // Add event listeners
      const copyBtn = modal.querySelector('#copyBtn');
      const openInstagramBtn = modal.querySelector('#openInstagramBtn');
      const closeBtn = modal.querySelector('#closeBtn');
      const textarea = modal.querySelector('textarea');
      
      copyBtn.addEventListener('click', () => {
        textarea.select();
        navigator.clipboard.writeText(message).then(() => {
          copyBtn.innerHTML = '✅ Copied!';
          copyBtn.style.background = '#28a745';
          setTimeout(() => {
            copyBtn.innerHTML = '📋 Copy Message';
            copyBtn.style.background = '#007bff';
          }, 2000);
        }).catch(() => {
          copyBtn.innerHTML = '❌ Copy Failed';
          copyBtn.style.background = '#dc3545';
          setTimeout(() => {
            copyBtn.innerHTML = '📋 Copy Message';
            copyBtn.style.background = '#007bff';
          }, 2000);
        });
      });
      
      openInstagramBtn.addEventListener('click', () => {
        window.open(`https://www.instagram.com/${instagramUsername}/`, '_blank');
      });
      
      closeBtn.addEventListener('click', () => {
        modal.remove();
      });
      
      // Close modal when clicking outside
      modal.addEventListener('click', (e) => {
        if (e.target === modal) {
          modal.remove();
        }
      });
      
      // Show success message and redirect to orders
      toast.success('Order placed successfully! Opening Instagram...');
      
      // Redirect to orders page after a short delay
      setTimeout(() => {
        navigate('/orders');
      }, 2000);
      
    } catch (error) {
      console.error('Error creating Instagram order:', error);
      toast.error('Failed to place order. Please try again.');
    } finally {
      setPlacing(false);
    }
  };

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

  const [paymentMethod, setPaymentMethod] = useState('');
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

  // Set default payment method based on configuration
  useEffect(() => {
    console.log('Payment config in checkout:', config?.paymentSettings);
    console.log('Current payment method state:', paymentMethod);
    if (config?.paymentSettings?.paymentMethod) {
      switch (config.paymentSettings.paymentMethod) {
        case 'gateway':
          setPaymentMethod('Credit Card');
          break;
        case 'whatsapp':
          setPaymentMethod('WhatsApp');
          break;
        case 'instagram':
          setPaymentMethod('Instagram');
          break;
        default:
          setPaymentMethod('Credit Card');
      }
    } else {
      // Fallback to Credit Card if no config is available
      setPaymentMethod('Credit Card');
    }
  }, [config?.paymentSettings?.paymentMethod]);

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
        if (!paymentMethod) return false;
        if (paymentMethod === 'Cash on Delivery' || paymentMethod === 'Razorpay' || 
            paymentMethod === 'WhatsApp' || paymentMethod === 'Instagram') return true;
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

    // Handle different payment methods
    if (paymentMethod === 'Razorpay') {
      setShowPaymentInstructions(true);
      return;
    }

    // Handle WhatsApp payment
    if (paymentMethod === 'WhatsApp') {
      // Check if user is authenticated
      if (!isAuthenticated) {
        toast.error('Please login to place an order');
        return;
      }

      // Check if cart has items (for cart checkout)
      if (!isDirectBuy && (!cart || !cart.items || cart.items.length === 0)) {
        toast.error('Your cart is empty');
        return;
      }

      const itemsToUse = isDirectBuy ? [directBuyItem] : cart.items;
      const orderData = {
        items: itemsToUse,
        total: calculateTotalWithTax(itemsToUse),
        shippingAddress
      };
      await handleWhatsAppRedirect(orderData);
      return;
    }

    // Handle Instagram payment
    if (paymentMethod === 'Instagram') {
      // Check if user is authenticated
      if (!isAuthenticated) {
        toast.error('Please login to place an order');
        return;
      }

      // Check if cart has items (for cart checkout)
      if (!isDirectBuy && (!cart || !cart.items || cart.items.length === 0)) {
        toast.error('Your cart is empty');
        return;
      }

      const itemsToUse = isDirectBuy ? [directBuyItem] : cart.items;
      const orderData = {
        items: itemsToUse,
        total: calculateTotalWithTax(itemsToUse),
        shippingAddress
      };
      await handleInstagramRedirect(orderData);
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

      // Validate stock before placing order
      const outOfStockItems = await validateStock(orderItems);
      if (outOfStockItems.length > 0) {
        // Show toast for each out of stock item
        outOfStockItems.forEach(item => {
          toast.error(`${item.name}: ${item.reason}`);
        });
        setPlacing(false);
        return;
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
      
      // Remove ordered items from cart after successful order placement (only for cart checkout, not direct buy)
      if (!isDirectBuy && cart && cart.items) {
        try {
          // Remove all items that were ordered
          for (const item of cart.items) {
            await axios.delete(`/api/cart/remove/${item._id}`);
          }
          
          // Refresh cart state
          const updatedCart = await axios.get('/api/cart');
          setCart(updatedCart.data);
        } catch (error) {
          console.error('Error removing ordered items from cart:', error);
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

      // Validate stock before placing order
      const outOfStockItems = await validateStock(orderItems);
      if (outOfStockItems.length > 0) {
        // Show toast for each out of stock item
        outOfStockItems.forEach(item => {
          toast.error(`${item.name}: ${item.reason}`);
        });
        setPlacing(false);
        setShowRazorpay(false);
        return;
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
      
      // Remove ordered items from cart after successful payment
      if (!isDirectBuy && cart && cart.items) {
        try {
          // Remove all items that were ordered
          for (const item of cart.items) {
            await axios.delete(`/api/cart/remove/${item._id}`);
          }
          
          // Refresh cart state
          const updatedCart = await axios.get('/api/cart');
          setCart(updatedCart.data);
        } catch (error) {
          console.error('Error removing ordered items from cart:', error);
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
      <div className="min-h-screen flex items-center justify-center" style={{background: 'var(--bg-color)'}}>
        <div className="text-center">
          <FaSpinner className="w-8 h-8 sm:w-12 sm:h-12 text-blue-600 animate-spin mx-auto mb-4" />
          <p className="text-sm sm:text-base text-gray-600">Loading checkout...</p>
        </div>
      </div>
    );
  }

  // For direct buy, we need to fetch the product details
  if (isDirectBuy && (!directBuyItem || !directBuyItem.productDetails)) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{background: 'var(--bg-color)'}}>
        <div className="text-center">
          <FaSpinner className="w-8 h-8 sm:w-12 sm:h-12 text-blue-600 animate-spin mx-auto mb-4" />
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
    <div className="min-h-screen" style={{background: 'var(--bg-color)'}}>
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
            <div className={`flex items-center ${step >= 1 ? 'text-blue-600' : 'text-gray-400'}`}>
              <div className={`rounded-full h-6 w-6 sm:h-8 sm:w-8 flex items-center justify-center border-2 text-xs sm:text-sm font-medium ${step >= 1 ? 'bg-blue-600 border-emerald-600 text-white' : 'border-gray-300'}`}>
                {step > 1 ? <FaCheck className="w-3 h-3 sm:w-4 sm:h-4" /> : '1'}
              </div>
              <span className="ml-2 text-xs sm:text-sm font-medium">Shipping</span>
            </div>
            <div className={`h-1 w-8 sm:w-16 ${step >= 2 ? 'bg-blue-600' : 'bg-gray-300'}`}></div>
            <div className={`flex items-center ${step >= 2 ? 'text-blue-600' : 'text-gray-400'}`}>
              <div className={`rounded-full h-6 w-6 sm:h-8 sm:w-8 flex items-center justify-center border-2 text-xs sm:text-sm font-medium ${step >= 2 ? 'bg-blue-600 border-emerald-600 text-white' : 'border-gray-300'}`}>
                {step > 2 ? <FaCheck className="w-3 h-3 sm:w-4 sm:h-4" /> : '2'}
              </div>
              <span className="ml-2 text-xs sm:text-sm font-medium">Payment</span>
            </div>
            <div className={`h-1 w-8 sm:w-16 ${step >= 3 ? 'bg-blue-600' : 'bg-gray-300'}`}></div>
            <div className={`flex items-center ${step >= 3 ? 'text-blue-600' : 'text-gray-400'}`}>
              <div className={`rounded-full h-6 w-6 sm:h-8 sm:w-8 flex items-center justify-center border-2 text-xs sm:text-sm font-medium ${step >= 3 ? 'bg-blue-600 border-emerald-600 text-white' : 'border-gray-300'}`}>
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
                    <div className="w-8 h-8 sm:w-10 sm:h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                      <FaMapMarkerAlt className="w-4 h-4 sm:w-5 sm:h-5 text-blue-600" />
                    </div>
                    <h2 className="text-lg sm:text-xl font-semibold text-gray-900">Shipping Address</h2>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                    <div>
                      <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1.5 sm:mb-2">
                        <FaUser className="inline w-3 h-3 sm:w-4 sm:h-4 mr-1.5 text-blue-600" />
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
                        <FaEnvelope className="inline w-3 h-3 sm:w-4 sm:h-4 mr-1.5 text-blue-600" />
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
                        <FaPhone className="inline w-3 h-3 sm:w-4 sm:h-4 mr-1.5 text-blue-600" />
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
                      className="inline-flex items-center gap-2 px-4 sm:px-6 py-2 sm:py-3 bg-blue-gradient text-white text-xs sm:text-sm font-semibold rounded-lg hover:from-emerald-700 hover:to-teal-700 transition-all duration-200 shadow-lg hover:shadow-xl"
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
                  <div className="flex items-center justify-between mb-4 sm:mb-6">
                    <div className="flex items-center gap-2 sm:gap-3">
                      <div className="w-8 h-8 sm:w-10 sm:h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                        <FaCreditCard className="w-4 h-4 sm:w-5 sm:h-5 text-blue-600" />
                      </div>
                      <h2 className="text-lg sm:text-xl font-semibold text-gray-900">Payment Method</h2>
                    </div>
                    {config?.paymentSettings?.paymentMethod && (
                      <div className="text-xs sm:text-sm text-gray-500 bg-gray-100 px-2 py-1 rounded-full">
                        {config.paymentSettings.paymentMethod === 'gateway' && 'Payment Gateway'}
                        {config.paymentSettings.paymentMethod === 'whatsapp' && 'WhatsApp Orders'}
                        {config.paymentSettings.paymentMethod === 'instagram' && 'Instagram Orders'}
                      </div>
                    )}
                  </div>

                  {/* Payment Method Selection */}
                  <div className="space-y-3 sm:space-y-4 mb-6">
                    {!paymentMethod ? (
                      <div className="flex flex-col items-center justify-center p-8 text-center">
                        <FaSpinner className="w-6 h-6 text-blue-600 animate-spin mb-2" />
                        <span className="text-sm text-gray-600">Loading payment options...</span>
                        <span className="text-xs text-gray-500 mt-1">Please wait while we load your payment settings</span>
                      </div>
                    ) : !config?.paymentSettings?.paymentMethod ? (
                      <div className="flex flex-col items-center justify-center p-8 text-center">
                        <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mb-3">
                          <FaCreditCard className="w-6 h-6 text-red-600" />
                        </div>
                        <h3 className="text-sm font-medium text-gray-900 mb-1">No Payment Method Configured</h3>
                        <p className="text-xs text-gray-500">Please contact the administrator to set up payment options</p>
                      </div>
                    ) : (
                      <>
                        {/* Payment Gateway (Razorpay) */}
                        {config?.paymentSettings?.paymentMethod === 'gateway' && (
                      <>
                        <label className={`flex items-center p-3 sm:p-4 border-2 rounded-lg cursor-pointer transition-all duration-200 hover:shadow-md ${
                          paymentMethod === 'Credit Card' 
                            ? 'border-blue-500 bg-blue-50' 
                            : 'border-gray-200 hover:border-gray-300'
                        }`}>
                          <input
                            type="radio"
                            name="paymentMethod"
                            value="Credit Card"
                            checked={paymentMethod === 'Credit Card'}
                            onChange={(e) => setPaymentMethod(e.target.value)}
                            className="mr-3 w-4 h-4 text-blue-600 focus:ring-blue-500"
                          />
                          <FaCreditCard className="w-4 h-4 sm:w-5 sm:h-5 text-blue-600 mr-2" />
                          <span className="text-xs sm:text-sm font-medium">Credit/Debit Card</span>
                        </label>

                        <label className={`flex items-center p-3 sm:p-4 border-2 rounded-lg cursor-pointer transition-all duration-200 hover:shadow-md ${
                          paymentMethod === 'PayPal' 
                            ? 'border-blue-500 bg-blue-50' 
                            : 'border-gray-200 hover:border-gray-300'
                        }`}>
                          <input
                            type="radio"
                            name="paymentMethod"
                            value="PayPal"
                            checked={paymentMethod === 'PayPal'}
                            onChange={(e) => setPaymentMethod(e.target.value)}
                            className="mr-3 w-4 h-4 text-blue-600 focus:ring-blue-500"
                          />
                          <FaPaypal className="w-4 h-4 sm:w-5 sm:h-5 text-blue-600 mr-2" />
                          <span className="text-xs sm:text-sm text-blue-600 font-bold">PayPal</span>
                        </label>

                        <label className={`flex items-center p-3 sm:p-4 border-2 rounded-lg cursor-pointer transition-all duration-200 hover:shadow-md ${
                          paymentMethod === 'Razorpay' 
                            ? 'border-blue-500 bg-blue-50' 
                            : 'border-gray-200 hover:border-gray-300'
                        }`}>
                          <input
                            type="radio"
                            name="paymentMethod"
                            value="Razorpay"
                            checked={paymentMethod === 'Razorpay'}
                            onChange={(e) => setPaymentMethod(e.target.value)}
                            className="mr-3 w-4 h-4 text-blue-600 focus:ring-blue-500"
                          />
                          <div className="w-4 h-4 sm:w-5 sm:h-5 bg-blue-600 rounded mr-2 flex items-center justify-center">
                            <span className="text-white text-[6px] sm:text-xs font-bold">R</span>
                          </div>
                          <span className="text-xs sm:text-sm text-blue-600 font-bold">Razorpay</span>
                        </label>

                        <label className={`flex items-center p-3 sm:p-4 border-2 rounded-lg cursor-pointer transition-all duration-200 hover:shadow-md ${
                          paymentMethod === 'Cash on Delivery' 
                            ? 'border-green-500 bg-green-50' 
                            : 'border-gray-200 hover:border-gray-300'
                        }`}>
                          <input
                            type="radio"
                            name="paymentMethod"
                            value="Cash on Delivery"
                            checked={paymentMethod === 'Cash on Delivery'}
                            onChange={(e) => setPaymentMethod(e.target.value)}
                            className="mr-3 w-4 h-4 text-green-600 focus:ring-green-500"
                          />
                          <FaMoneyBillWave className="w-4 h-4 sm:w-5 sm:h-5 text-green-600 mr-2" />
                          <span className="text-xs sm:text-sm font-medium">Cash on Delivery</span>
                        </label>
                      </>
                    )}

                    {/* WhatsApp Payment */}
                    {config?.paymentSettings?.paymentMethod === 'whatsapp' && (
                      <label className={`flex items-center p-3 sm:p-4 border-2 rounded-lg cursor-pointer transition-all duration-200 hover:shadow-md ${
                        paymentMethod === 'WhatsApp' 
                          ? 'border-green-500 bg-green-50' 
                          : 'border-gray-200 hover:border-gray-300'
                      }`}>
                        <input
                          type="radio"
                          name="paymentMethod"
                          value="WhatsApp"
                          checked={paymentMethod === 'WhatsApp'}
                          onChange={(e) => setPaymentMethod(e.target.value)}
                          className="mr-3 w-4 h-4 text-green-600 focus:ring-green-500"
                        />
                        <div className="w-6 h-6 sm:w-8 sm:h-8 bg-green-100 rounded-lg mr-3 flex items-center justify-center">
                          <span className="text-green-600 text-sm font-bold">W</span>
                        </div>
                        <div className="flex-1">
                          <div className="text-xs sm:text-sm font-medium text-gray-900">WhatsApp Order</div>
                          <div className="text-xs text-gray-500">
                            {config?.paymentSettings?.whatsappNumber 
                              ? `Send order to ${config.paymentSettings.whatsappNumber}`
                              : 'WhatsApp number not configured'
                            }
                          </div>
                        </div>
                      </label>
                    )}

                    {/* Instagram Payment */}
                    {config?.paymentSettings?.paymentMethod === 'instagram' && (
                      <label className={`flex items-center p-3 sm:p-4 border-2 rounded-lg cursor-pointer transition-all duration-200 hover:shadow-md ${
                        paymentMethod === 'Instagram' 
                          ? 'border-purple-500 bg-purple-50' 
                          : 'border-gray-200 hover:border-gray-300'
                      }`}>
                        <input
                          type="radio"
                          name="paymentMethod"
                          value="Instagram"
                          checked={paymentMethod === 'Instagram'}
                          onChange={(e) => setPaymentMethod(e.target.value)}
                          className="mr-3 w-4 h-4 text-purple-600 focus:ring-purple-500"
                        />
                        <div className="w-6 h-6 sm:w-8 sm:h-8 bg-gradient-to-r from-purple-100 to-pink-100 rounded-lg mr-3 flex items-center justify-center">
                          <span className="text-purple-600 text-sm font-bold">I</span>
                        </div>
                        <div className="flex-1">
                          <div className="text-xs sm:text-sm font-medium text-gray-900">Instagram Order</div>
                          <div className="text-xs text-gray-500">
                            {config?.paymentSettings?.instagramUsername 
                              ? `Send order to @${config.paymentSettings.instagramUsername}`
                              : 'Instagram username not configured'
                            }
                          </div>
                        </div>
                      </label>
                    )}
                      </>
                    )}
                  </div>

                  {/* Card Details */}
                  {(paymentMethod === 'Credit Card' || paymentMethod === 'Debit Card') && (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                      <div className="sm:col-span-2">
                        <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1.5 sm:mb-2">
                          <FaIdCard className="inline w-3 h-3 sm:w-4 sm:h-4 mr-1.5 text-blue-600" />
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
                          <FaCalendar className="inline w-3 h-3 sm:w-4 sm:h-4 mr-1.5 text-blue-600" />
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
                      className="inline-flex items-center gap-2 px-4 sm:px-6 py-2 sm:py-3 bg-blue-gradient text-white text-xs sm:text-sm font-semibold rounded-lg hover:from-emerald-700 hover:to-teal-700 transition-all duration-200 shadow-lg hover:shadow-xl"
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
                    <div className="w-8 h-8 sm:w-10 sm:h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                      <FaCheck className="w-4 h-4 sm:w-5 sm:h-5 text-blue-600" />
                    </div>
                    <h2 className="text-lg sm:text-xl font-semibold text-gray-900">Review Your Order</h2>
                  </div>

                  {/* Shipping Address Review */}
                  <div className="mb-4 sm:mb-6 p-3 sm:p-4 bg-gray-50 rounded-lg">
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="text-sm sm:text-base font-medium text-gray-900">Shipping Address</h3>
                      <button 
                        onClick={() => setStep(1)} 
                        className="inline-flex items-center gap-1 text-xs sm:text-sm text-blue-600 hover:text-blue-700"
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
                        className="inline-flex items-center gap-1 text-xs sm:text-sm text-blue-600 hover:text-blue-700"
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
                      {paymentMethod === 'WhatsApp' && config?.paymentSettings?.whatsappNumber && (
                        <p>WhatsApp: {config.paymentSettings.whatsappNumber}</p>
                      )}
                      {paymentMethod === 'Instagram' && config?.paymentSettings?.instagramUsername && (
                        <p>Instagram: @{config.paymentSettings.instagramUsername}</p>
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
                  <span className={totals.shipping === 0 ? 'text-blue-600 font-medium' : ''}>
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
                  <FaShieldAlt className="w-3 h-3 sm:w-4 sm:h-4 text-blue-600" />
                  <span>Secure checkout</span>
                </div>
                <div className="flex items-center gap-2 text-xs sm:text-sm text-gray-600">
                  <FaTruck className="w-3 h-3 sm:w-4 sm:h-4 text-blue-600" />
                  <span>{totals.shipping === 0 ? 'Free shipping!' : 'Standard shipping'}</span>
                </div>
                <div className="flex items-center gap-2 text-xs sm:text-sm text-gray-600">
                  <FaCreditCard className="w-3 h-3 sm:w-4 sm:h-4 text-blue-600" />
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