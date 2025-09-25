import React, { useState, useEffect } from 'react';
import { useParams, useLocation, Link } from 'react-router-dom';
import axios from '../config/axios';
import { useAuth } from '../context/AuthContext';
import { useSettings } from '../context/SettingsContext';
import jsPDF from 'jspdf';
import { 
  FaCheckCircle, 
  FaArrowLeft, 
  FaDownload, 
  FaShippingFast, 
  FaMapMarkerAlt, 
  FaCreditCard,
  FaCalendarAlt,
  FaBox,
  FaTruck,
  FaClock,
  FaExclamationTriangle,
  FaStar,
  FaPhone,
  FaEnvelope,
  FaSpinner,
  FaGift,
  FaShieldAlt,
  FaHeart,
  FaPrint,
  FaShare,
  FaEye,
  FaTimes,
  FaCheck,
  FaInfoCircle
} from 'react-icons/fa';
import { toast } from 'react-toastify';

const OrderDetail = () => {
  const { id } = useParams();
  const location = useLocation();
  const { isAuthenticated } = useAuth();
  const { formatPrice } = useSettings();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [downloadingInvoice, setDownloadingInvoice] = useState(false);
  const isNewOrder = location.state?.newOrder;

  useEffect(() => {
    if (isAuthenticated && id) {
      fetchOrder();
    }
  }, [id, isAuthenticated]);

  const fetchOrder = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`/api/orders/${id}`);
      setOrder(response.data);
    } catch (error) {
      console.error('Error fetching order:', error);
      if (error.response?.status === 404) {
        toast.error('Order not found');
      } else if (error.response?.status === 403) {
        toast.error('You do not have permission to view this order');
      } else {
        toast.error('Failed to load order details');
      }
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case 'pending': return 'text-yellow-700 bg-yellow-50 border-yellow-200';
      case 'processing': return 'text-blue-700 bg-blue-50 border-blue-200';
      case 'shipped': return 'text-purple-700 bg-purple-50 border-purple-200';
      case 'delivered': return 'text-emerald-700 bg-emerald-50 border-emerald-200';
      case 'cancelled': return 'text-red-700 bg-red-50 border-red-200';
      case 'returned': return 'text-gray-700 bg-gray-50 border-gray-200';
      default: return 'text-gray-700 bg-gray-50 border-gray-200';
    }
  };

  const getStatusIcon = (status) => {
    switch (status?.toLowerCase()) {
      case 'pending': return <FaClock className="w-3 h-3 sm:w-4 sm:h-4" />;
      case 'processing': return <FaBox className="w-3 h-3 sm:w-4 sm:h-4" />;
      case 'shipped': return <FaTruck className="w-3 h-3 sm:w-4 sm:h-4" />;
      case 'delivered': return <FaCheckCircle className="w-3 h-3 sm:w-4 sm:h-4" />;
      case 'cancelled': return <FaExclamationTriangle className="w-3 h-3 sm:w-4 sm:h-4" />;
      case 'returned': return <FaExclamationTriangle className="w-3 h-3 sm:w-4 sm:h-4" />;
      default: return <FaClock className="w-3 h-3 sm:w-4 sm:h-4" />;
    }
  };

  const downloadInvoice = () => {
    if (!order) return;

    setDownloadingInvoice(true);
    
    try {
      const doc = new jsPDF();
    
    // Add company logo/header
    doc.setFontSize(20);
    doc.setTextColor(16, 185, 129); // emerald-500
    doc.text('E-Shop', 20, 20);
    
    doc.setFontSize(10);
    doc.setTextColor(100, 100, 100);
    doc.text('Your trusted shopping destination', 20, 30);
    doc.text('123 Shopping St, City, Country', 20, 35);
    doc.text('Phone: +1 (555) 123-4567', 20, 40);
    doc.text('Email: info@eshop.com', 20, 45);
    
    // Invoice title and details
    doc.setFontSize(16);
    doc.setTextColor(0, 0, 0);
    doc.text('INVOICE', 20, 65);
    
    doc.setFontSize(10);
    doc.setTextColor(100, 100, 100);
    doc.text(`Invoice #: ${order.orderNumber}`, 20, 75);
    doc.text(`Date: ${new Date(order.createdAt).toLocaleDateString()}`, 20, 80);
    doc.text(`Status: ${order.status.toUpperCase()}`, 20, 85);
    
    // Customer information
    doc.setFontSize(12);
    doc.setTextColor(0, 0, 0);
    doc.text('Bill To:', 20, 105);
    
    doc.setFontSize(10);
    doc.setTextColor(100, 100, 100);
    doc.text(order.shippingAddress.fullName, 20, 115);
    doc.text(order.shippingAddress.street, 20, 120);
    doc.text(`${order.shippingAddress.city}, ${order.shippingAddress.state} ${order.shippingAddress.zipCode}`, 20, 125);
    doc.text(order.shippingAddress.country, 20, 130);
    if (order.shippingAddress.phone) {
      doc.text(`Phone: ${order.shippingAddress.phone}`, 20, 135);
    }
    if (order.shippingAddress.email) {
      doc.text(`Email: ${order.shippingAddress.email}`, 20, 140);
    }
    
    // Payment information
    doc.setFontSize(12);
    doc.setTextColor(0, 0, 0);
    doc.text('Payment Information:', 120, 105);
    
    doc.setFontSize(10);
    doc.setTextColor(100, 100, 100);
    doc.text(`Method: ${order.paymentMethod}`, 120, 115);
    doc.text(`Status: ${order.isPaid ? 'Paid' : 'Pending'}`, 120, 120);
    if (order.isPaid && order.paidAt) {
      doc.text(`Paid on: ${new Date(order.paidAt).toLocaleDateString()}`, 120, 125);
    }
    if (order.transactionId) {
      doc.text(`Transaction ID: ${order.transactionId}`, 120, 130);
    }
    
    // Items table
    const tableY = 160;
    
    // Table headers
    doc.setFontSize(10);
    doc.setTextColor(255, 255, 255);
    doc.setFillColor(16, 185, 129); // emerald-500
    doc.rect(20, tableY, 175, 8, 'F');
    
    doc.text('Item', 25, tableY + 6);
    doc.text('Color/Size', 85, tableY + 6);
    doc.text('Qty', 125, tableY + 6);
    doc.text('Unit Price', 145, tableY + 6);
    doc.text('Total', 175, tableY + 6);
    
    // Table data
    let currentY = tableY + 15;
    doc.setTextColor(0, 0, 0);
    doc.setFontSize(9);
    
    order.items.forEach((item, index) => {
      const itemName = item.product?.name || 'Product not available';
      const colorSize = `${item.selectedColor ? item.selectedColor.name : ''}${item.selectedColor && item.selectedSize ? ' / ' : ''}${item.selectedSize || ''}`;
      const quantity = item.quantity.toString();
      const unitPrice = formatPrice(item.price);
      const total = formatPrice(item.price * item.quantity);
      
      // Draw row background for alternating rows
      if (index % 2 === 0) {
        doc.setFillColor(248, 250, 252); // gray-50
        doc.rect(20, currentY - 3, 175, 12, 'F');
      }
      
      doc.text(itemName, 25, currentY);
      doc.text(colorSize, 85, currentY);
      doc.text(quantity, 125, currentY);
      doc.text(unitPrice, 145, currentY);
      doc.text(total, 175, currentY);
      
      currentY += 15;
    });
    
    // Get the Y position after the table
    const finalY = currentY + 10;
    
    // Order summary
    doc.setFontSize(12);
    doc.setTextColor(0, 0, 0);
    doc.text('Order Summary:', 140, finalY);
    
    doc.setFontSize(10);
    doc.setTextColor(100, 100, 100);
    doc.text(`Subtotal: ${formatPrice(order.subtotal)}`, 140, finalY + 10);
    doc.text(`Shipping: ${order.shippingCost === 0 ? 'Free' : formatPrice(order.shippingCost)}`, 140, finalY + 15);
    doc.text(`Tax: ${formatPrice(order.tax)}`, 140, finalY + 20);
    if (order.discount && order.discount > 0) {
      doc.setTextColor(16, 185, 129); // emerald-500 for discount
      doc.text(`Discount: -${formatPrice(order.discount)}`, 140, finalY + 25);
      doc.setTextColor(100, 100, 100);
    }
    
    // Total
    doc.setFontSize(12);
    doc.setTextColor(0, 0, 0);
    doc.setFont(undefined, 'bold');
    doc.text(`Total: ${formatPrice(order.total)}`, 140, finalY + 35);
    doc.setFont(undefined, 'normal');
    
    // Footer
    const pageHeight = doc.internal.pageSize.height;
    doc.setFontSize(8);
    doc.setTextColor(150, 150, 150);
    doc.text('Thank you for your purchase!', 20, pageHeight - 20);
    doc.text('For any questions, please contact our customer support.', 20, pageHeight - 15);
    doc.text('support@eshop.com | +1 (555) 123-4567', 20, pageHeight - 10);
    
      // Save the PDF
      doc.save(`invoice-${order.orderNumber}.pdf`);
      
      toast.success('Invoice downloaded successfully!');
    } catch (error) {
      console.error('Error generating invoice:', error);
      toast.error('Failed to generate invoice. Please try again.');
    } finally {
      setDownloadingInvoice(false);
    }
  };

  const trackOrder = () => {
    if (order.trackingNumber) {
      toast.info(`Tracking number: ${order.trackingNumber}`);
    } else {
      toast.info('Tracking information will be available once your order is shipped');
    }
  };

  const contactSupport = () => {
    toast.info('Redirecting to customer support...');
  };

  const requestReturn = () => {
    if (order.status === 'delivered') {
      toast.info('Return request feature coming soon');
    } else {
      toast.warning('Returns can only be requested after delivery');
    }
  };

  const leaveReview = () => {
    if (order.status === 'delivered') {
      toast.info('Review feature coming soon');
    } else {
      toast.warning('Reviews can only be left after delivery');
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-emerald-50 to-teal-50 flex items-center justify-center px-3 sm:px-4">
        <div className="max-w-sm w-full bg-white shadow-xl rounded-2xl p-6 sm:p-8 text-center">
          <div className="w-16 h-16 sm:w-20 sm:h-20 bg-gradient-to-r from-emerald-500 to-teal-500 rounded-full flex items-center justify-center mx-auto mb-4 sm:mb-6">
            <FaShieldAlt className="w-8 h-8 sm:w-10 sm:h-10 text-white" />
          </div>
          <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-2 sm:mb-3">Access Required</h2>
          <p className="text-sm sm:text-base text-gray-600 mb-6 sm:mb-8">Please log in to view your order details</p>
          <Link 
            to="/login" 
            className="inline-flex items-center justify-center w-full rounded-xl px-4 py-3 bg-gradient-to-r from-emerald-600 to-teal-600 text-white font-semibold hover:from-emerald-700 hover:to-teal-700 transition-all duration-200 shadow-lg hover:shadow-xl"
          >
            Sign In
          </Link>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-emerald-50 to-teal-50 flex items-center justify-center">
        <div className="text-center">
          <FaSpinner className="w-8 h-8 sm:w-12 sm:h-12 text-emerald-600 animate-spin mx-auto mb-4" />
          <p className="text-sm sm:text-base text-gray-600">Loading order details...</p>
        </div>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-emerald-50 to-teal-50 flex items-center justify-center px-3 sm:px-4">
        <div className="max-w-sm w-full bg-white shadow-xl rounded-2xl p-6 sm:p-8 text-center">
          <div className="w-16 h-16 sm:w-20 sm:h-20 bg-gradient-to-r from-red-500 to-pink-500 rounded-full flex items-center justify-center mx-auto mb-4 sm:mb-6">
            <FaExclamationTriangle className="w-8 h-8 sm:w-10 sm:h-10 text-white" />
          </div>
          <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-2 sm:mb-3">Order Not Found</h2>
          <p className="text-sm sm:text-base text-gray-600 mb-6 sm:mb-8">The order you're looking for doesn't exist or you don't have permission to view it.</p>
          <Link 
            to="/orders" 
            className="inline-flex items-center justify-center w-full rounded-xl px-4 py-3 bg-gradient-to-r from-emerald-600 to-teal-600 text-white font-semibold hover:from-emerald-700 hover:to-teal-700 transition-all duration-200 shadow-lg hover:shadow-xl"
          >
            View All Orders
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 to-teal-50">
        {/* Success Message for New Orders */}
        {isNewOrder && (
        <div className="bg-gradient-to-r from-emerald-500 to-teal-600 text-white">
          <div className="max-w-7xl mx-auto px-3 sm:px-4 lg:px-6 py-4 sm:py-6">
            <div className="flex items-center gap-3 sm:gap-4">
              <div className="flex-shrink-0">
                <div className="w-8 h-8 sm:w-10 sm:h-10 bg-white/20 rounded-full flex items-center justify-center">
                  <FaCheckCircle className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
                </div>
              </div>
              <div className="flex-1">
                <h3 className="text-sm sm:text-base lg:text-lg font-bold">Order Placed Successfully!</h3>
                <p className="text-xs sm:text-sm text-emerald-100">Thank you for your purchase. Your order has been received and is being processed.</p>
              </div>
              </div>
            </div>
          </div>
        )}

      {/* Header Section */}
      <div className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-3 sm:px-4 lg:px-6 py-4 sm:py-6">
          <div className="flex items-center justify-between gap-3 sm:gap-4">
            <div className="flex items-center gap-3 sm:gap-4">
              <Link 
                to="/orders" 
                className="inline-flex items-center justify-center h-8 w-8 sm:h-10 sm:w-10 rounded-lg bg-gray-100 hover:bg-gray-200 transition-colors"
              >
                <FaArrowLeft className="w-3 h-3 sm:w-4 sm:h-4 text-gray-600" />
              </Link>
              <div>
                <h1 className="text-lg sm:text-xl lg:text-2xl font-bold text-gray-900">Order Details</h1>
                <p className="text-xs sm:text-sm text-gray-600">#{order.orderNumber}</p>
              </div>
            </div>
            
            {/* Action Buttons */}
            <div className="flex items-center gap-2 sm:gap-3">
              <button
                onClick={trackOrder}
                className="inline-flex items-center justify-center gap-1.5 sm:gap-2 rounded-lg bg-gradient-to-r from-blue-500 to-indigo-600 text-white px-3 py-2 text-xs sm:text-sm font-medium hover:from-blue-600 hover:to-indigo-700 transition-all duration-200 shadow-sm hover:shadow-md"
              >
                <FaTruck className="w-3 h-3 sm:w-4 sm:h-4" />
                <span className="hidden sm:inline">Track</span>
              </button>
              <button
                onClick={downloadInvoice}
                disabled={downloadingInvoice}
                className="inline-flex items-center justify-center gap-1.5 sm:gap-2 rounded-lg border border-gray-300 bg-white text-gray-700 px-3 py-2 text-xs sm:text-sm font-medium hover:bg-gray-50 disabled:opacity-60 disabled:cursor-not-allowed transition-all duration-200"
              >
                {downloadingInvoice ? (
                  <FaSpinner className="w-3 h-3 sm:w-4 sm:h-4 animate-spin" />
                ) : (
                  <FaDownload className="w-3 h-3 sm:w-4 sm:h-4" />
                )}
                <span className="hidden sm:inline">
                  {downloadingInvoice ? 'Generating...' : 'Invoice'}
                </span>
              </button>
            </div>
          </div>
            </div>
          </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-3 sm:px-4 lg:px-6 py-4 sm:py-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6">
          
          {/* Main Content Area */}
          <div className="lg:col-span-2 space-y-4 sm:space-y-6">
            
            {/* Order Status Card */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 sm:p-6">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 sm:gap-4 mb-4 sm:mb-6">
            <div>
                  <h2 className="text-lg sm:text-xl font-bold text-gray-900 mb-1">Order Status</h2>
                  <p className="text-xs sm:text-sm text-gray-600">
                Placed on {new Date(order.createdAt).toLocaleDateString('en-US', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric'
                })}
              </p>
            </div>
                <div className="flex items-center gap-2 sm:gap-3">
                  <span className={`inline-flex items-center gap-1.5 sm:gap-2 px-3 py-1.5 sm:py-2 rounded-full text-xs sm:text-sm font-medium border ${getStatusColor(order.status)}`}>
                {getStatusIcon(order.status)}
                {order.status}
              </span>
            </div>
            </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
                <div className="text-center p-3 sm:p-4 bg-gradient-to-r from-emerald-50 to-teal-50 rounded-lg">
                  <p className="text-xs sm:text-sm text-gray-600 mb-1">Total Amount</p>
                  <p className="text-lg sm:text-xl font-bold text-emerald-600">{formatPrice(order.total)}</p>
                </div>
                <div className="text-center p-3 sm:p-4 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg">
                  <p className="text-xs sm:text-sm text-gray-600 mb-1">Payment</p>
                  <p className={`text-lg sm:text-xl font-bold ${order.isPaid ? 'text-emerald-600' : 'text-red-600'}`}>
                {order.isPaid ? 'Paid' : 'Pending'}
              </p>
            </div>
                <div className="text-center p-3 sm:p-4 bg-gradient-to-r from-purple-50 to-pink-50 rounded-lg">
                  <p className="text-xs sm:text-sm text-gray-600 mb-1">Items</p>
                  <p className="text-lg sm:text-xl font-bold text-purple-600">{order.items.length}</p>
                </div>
                <div className="text-center p-3 sm:p-4 bg-gradient-to-r from-yellow-50 to-orange-50 rounded-lg">
                  <p className="text-xs sm:text-sm text-gray-600 mb-1">Order ID</p>
                  <p className="text-xs sm:text-sm font-mono font-bold text-yellow-600 truncate">{order.orderNumber}</p>
            </div>
          </div>
        </div>

          {/* Order Items */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
              <div className="p-4 sm:p-6 border-b border-gray-100">
                <h2 className="text-lg sm:text-xl font-bold text-gray-900 flex items-center gap-2">
                  <FaBox className="w-4 h-4 sm:w-5 sm:h-5 text-emerald-600" />
                  Order Items
                </h2>
            </div>
            
              <div className="divide-y divide-gray-100">
              {order.items.map((item, index) => (
                  <div key={index} className="p-4 sm:p-6">
                    <div className="flex gap-3 sm:gap-4">
                      <div className="w-16 h-16 sm:w-20 sm:h-20 bg-gray-100 rounded-lg overflow-hidden flex-shrink-0">
                    <img
                      src={item.product?.images?.[0] || '/placeholder-image.jpg'}
                      alt={item.product?.name || 'Product'}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  
                  <div className="flex-1 min-w-0">
                        <h3 className="text-sm sm:text-base font-semibold text-gray-900 truncate mb-1">
                      {item.product?.name || 'Product not available'}
                    </h3>
                    
                    {item.product?.brand && (
                          <p className="text-xs sm:text-sm text-gray-500 mb-2">{item.product.brand}</p>
                    )}
                    
                        <div className="flex flex-wrap gap-2 sm:gap-3 text-xs sm:text-sm text-gray-600">
                      {item.selectedColor && (
                            <div className="flex items-center gap-1.5">
                          <span>Color:</span>
                          <div
                                className="w-3 h-3 sm:w-4 sm:h-4 rounded-full border border-gray-300"
                            style={{ backgroundColor: item.selectedColor.code }}
                          />
                          <span>{item.selectedColor.name}</span>
                        </div>
                      )}
                      
                      {item.selectedSize && (
                            <span className="bg-gray-100 px-2 py-1 rounded-full">Size: {item.selectedSize}</span>
                      )}
                      
                          <span className="bg-emerald-100 text-emerald-700 px-2 py-1 rounded-full">Qty: {item.quantity}</span>
                    </div>
                  </div>
                  
                  <div className="text-right">
                        <p className="text-xs sm:text-sm text-gray-500 mb-1">Unit Price</p>
                        <p className="text-sm sm:text-base font-semibold text-gray-900">{formatPrice(item.price)}</p>
                        <p className="text-xs sm:text-sm text-gray-500 mt-1">Total</p>
                        <p className="text-sm sm:text-base font-bold text-emerald-600">{formatPrice(item.price * item.quantity)}</p>
                      </div>
                  </div>
                </div>
              ))}
            </div>

              {/* Order Summary */}
              <div className="p-4 sm:p-6 border-t border-gray-100 bg-gradient-to-r from-gray-50 to-gray-100">
                <div className="space-y-2 sm:space-y-3">
                  <div className="flex justify-between text-xs sm:text-sm">
                    <span className="text-gray-600">Subtotal</span>
                    <span className="font-medium">{formatPrice(order.subtotal)}</span>
                </div>
                  <div className="flex justify-between text-xs sm:text-sm">
                    <span className="text-gray-600">Shipping</span>
                    <span className={`font-medium ${order.shippingCost === 0 ? 'text-emerald-600' : ''}`}>
                      {order.shippingCost === 0 ? 'Free' : formatPrice(order.shippingCost)}
                    </span>
                </div>
                  <div className="flex justify-between text-xs sm:text-sm">
                    <span className="text-gray-600">Tax</span>
                    <span className="font-medium">{formatPrice(order.tax)}</span>
                </div>
                {order.discount && order.discount > 0 && (
                    <div className="flex justify-between text-xs sm:text-sm text-emerald-600">
                    <span>Discount</span>
                      <span className="font-medium">-{formatPrice(order.discount)}</span>
                  </div>
                )}
                  <div className="flex justify-between font-bold text-sm sm:text-base pt-2 sm:pt-3 border-t border-gray-200">
                  <span>Total</span>
                    <span className="text-emerald-600">{formatPrice(order.total)}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-4 sm:space-y-6">
            
            {/* Shipping Address */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 sm:p-6">
              <div className="flex items-center gap-2 sm:gap-3 mb-3 sm:mb-4">
                <div className="w-8 h-8 sm:w-10 sm:h-10 bg-gradient-to-r from-emerald-500 to-teal-500 rounded-lg flex items-center justify-center">
                  <FaMapMarkerAlt className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
                </div>
                <h3 className="text-sm sm:text-base font-bold text-gray-900">Shipping Address</h3>
              </div>
              
              <div className="space-y-1.5 sm:space-y-2 text-xs sm:text-sm">
                <p className="font-semibold text-gray-900">{order.shippingAddress.fullName}</p>
                <p className="text-gray-600">{order.shippingAddress.street}</p>
                <p className="text-gray-600">
                  {order.shippingAddress.city}, {order.shippingAddress.state} {order.shippingAddress.zipCode}
                </p>
                <p className="text-gray-600">{order.shippingAddress.country}</p>
                {order.shippingAddress.phone && (
                  <div className="flex items-center gap-1.5 sm:gap-2 mt-2 text-emerald-600">
                    <FaPhone className="w-3 h-3 sm:w-4 sm:h-4" />
                    <span className="text-xs sm:text-sm">{order.shippingAddress.phone}</span>
                  </div>
                )}
                {order.shippingAddress.email && (
                  <div className="flex items-center gap-1.5 sm:gap-2 text-emerald-600">
                    <FaEnvelope className="w-3 h-3 sm:w-4 sm:h-4" />
                    <span className="text-xs sm:text-sm">{order.shippingAddress.email}</span>
                  </div>
                )}
              </div>
            </div>

            {/* Payment Information */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 sm:p-6">
              <div className="flex items-center gap-2 sm:gap-3 mb-3 sm:mb-4">
                <div className="w-8 h-8 sm:w-10 sm:h-10 bg-gradient-to-r from-green-500 to-emerald-500 rounded-lg flex items-center justify-center">
                  <FaCreditCard className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
                </div>
                <h3 className="text-sm sm:text-base font-bold text-gray-900">Payment Information</h3>
              </div>
              
              <div className="space-y-2 sm:space-y-3 text-xs sm:text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">Method:</span>
                  <span className="font-semibold">{order.paymentMethod}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Status:</span>
                  <span className={`font-semibold ${order.isPaid ? 'text-emerald-600' : 'text-red-600'}`}>
                    {order.isPaid ? 'Paid' : 'Pending'}
                  </span>
                </div>
                {order.isPaid && order.paidAt && (
                  <div className="flex justify-between">
                    <span className="text-gray-600">Paid on:</span>
                    <span className="font-medium">{new Date(order.paidAt).toLocaleDateString()}</span>
                  </div>
                )}
                {order.transactionId && (
                  <div className="flex justify-between">
                    <span className="text-gray-600">Transaction ID:</span>
                    <span className="font-mono text-xs">{order.transactionId}</span>
                  </div>
                )}
              </div>
            </div>

            {/* Delivery Information */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 sm:p-6">
              <div className="flex items-center gap-2 sm:gap-3 mb-3 sm:mb-4">
                <div className="w-8 h-8 sm:w-10 sm:h-10 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg flex items-center justify-center">
                  <FaShippingFast className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
                </div>
                <h3 className="text-sm sm:text-base font-bold text-gray-900">Delivery Information</h3>
              </div>
              
              <div className="space-y-2 sm:space-y-3 text-xs sm:text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">Status:</span>
                  <span className="font-semibold">{order.status}</span>
                </div>
                
                {order.trackingNumber && (
                  <div className="flex justify-between">
                    <span className="text-gray-600">Tracking:</span>
                    <span className="font-semibold text-blue-600">{order.trackingNumber}</span>
                  </div>
                )}
                
                {order.shippingMethod && (
                  <div className="flex justify-between">
                    <span className="text-gray-600">Method:</span>
                    <span className="font-semibold">{order.shippingMethod}</span>
                  </div>
                )}
                
                {order.isDelivered && order.deliveredAt && (
                  <div className="flex justify-between">
                    <span className="text-gray-600">Delivered:</span>
                    <span className="font-semibold text-emerald-600">
                      {new Date(order.deliveredAt).toLocaleDateString()}
                    </span>
                  </div>
                )}

                {!order.isDelivered && order.status !== 'cancelled' && (
                  <div className="mt-3 p-3 bg-blue-50 rounded-lg border border-blue-100">
                    <div className="flex items-center gap-2">
                      <FaInfoCircle className="w-3 h-3 sm:w-4 sm:h-4 text-blue-600" />
                    <p className="text-blue-700 text-xs">
                        Estimated delivery: 3-5 business days
                    </p>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Order Timeline */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 sm:p-6">
              <div className="flex items-center gap-2 sm:gap-3 mb-3 sm:mb-4">
                <div className="w-8 h-8 sm:w-10 sm:h-10 bg-gradient-to-r from-gray-500 to-gray-600 rounded-lg flex items-center justify-center">
                  <FaCalendarAlt className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
                </div>
                <h3 className="text-sm sm:text-base font-bold text-gray-900">Order Timeline</h3>
              </div>
              
              <div className="space-y-3 sm:space-y-4">
                <div className="flex items-center gap-3">
                  <div className="w-2 h-2 bg-emerald-500 rounded-full flex-shrink-0"></div>
                  <div className="text-xs sm:text-sm">
                    <span className="font-semibold text-gray-900">Order Placed</span>
                    <p className="text-gray-500">{new Date(order.createdAt).toLocaleString()}</p>
                  </div>
                </div>
                
                {order.status !== 'pending' && (
                  <div className="flex items-center gap-3">
                    <div className="w-2 h-2 bg-blue-500 rounded-full flex-shrink-0"></div>
                    <div className="text-xs sm:text-sm">
                      <span className="font-semibold text-gray-900">Processing</span>
                      <p className="text-gray-500">Order confirmed and being prepared</p>
                    </div>
                  </div>
                )}
                
                {(order.status === 'shipped' || order.status === 'delivered') && (
                  <div className="flex items-center gap-3">
                    <div className="w-2 h-2 bg-purple-500 rounded-full flex-shrink-0"></div>
                    <div className="text-xs sm:text-sm">
                      <span className="font-semibold text-gray-900">Shipped</span>
                      <p className="text-gray-500">Order is on its way</p>
                    </div>
                  </div>
                )}
                
                {order.isDelivered && (
                  <div className="flex items-center gap-3">
                    <div className="w-2 h-2 bg-emerald-500 rounded-full flex-shrink-0"></div>
                    <div className="text-xs sm:text-sm">
                      <span className="font-semibold text-gray-900">Delivered</span>
                      <p className="text-gray-500">{new Date(order.deliveredAt).toLocaleString()}</p>
                    </div>
                  </div>
                )}

                {order.status === 'cancelled' && (
                  <div className="flex items-center gap-3">
                    <div className="w-2 h-2 bg-red-500 rounded-full flex-shrink-0"></div>
                    <div className="text-xs sm:text-sm">
                      <span className="font-semibold text-gray-900">Cancelled</span>
                      <p className="text-gray-500">Order was cancelled</p>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Customer Support */}
            <div className="bg-gradient-to-r from-emerald-50 to-teal-50 rounded-xl p-4 sm:p-6 border border-emerald-200">
              <div className="flex items-center gap-2 sm:gap-3 mb-3 sm:mb-4">
                <div className="w-8 h-8 sm:w-10 sm:h-10 bg-gradient-to-r from-emerald-500 to-teal-500 rounded-lg flex items-center justify-center">
                  <FaHeart className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
                </div>
                <h3 className="text-sm sm:text-base font-bold text-gray-900">Need Help?</h3>
              </div>
              <div className="space-y-2 sm:space-y-3 text-xs sm:text-sm">
                <p className="text-gray-600">If you have any questions about your order, please contact our customer support team.</p>
                <div className="flex items-center gap-2 text-emerald-600 cursor-pointer hover:text-emerald-700">
                  <FaPhone className="w-3 h-3 sm:w-4 sm:h-4" />
                  <span>1-800-123-4567</span>
                </div>
                <div className="flex items-center gap-2 text-emerald-600 cursor-pointer hover:text-emerald-700">
                  <FaEnvelope className="w-3 h-3 sm:w-4 sm:h-4" />
                  <span>support@example.com</span>
                </div>
                <button
                  onClick={contactSupport}
                  className="w-full mt-3 bg-gradient-to-r from-emerald-600 to-teal-600 text-white py-2.5 sm:py-3 px-4 rounded-lg hover:from-emerald-700 hover:to-teal-700 transition-all duration-200 shadow-sm hover:shadow-md text-xs sm:text-sm font-semibold"
                >
                  Contact Support
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderDetail;