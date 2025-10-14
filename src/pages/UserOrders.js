import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from '../config/axios';
import { useAuth } from '../context/AuthContext';
import { useSettings } from '../context/SettingsContext';
import { 
  FaEye, 
  FaTruck, 
  FaBox, 
  FaCheckCircle, 
  FaTimes, 
  FaClock, 
  FaUndo,
  FaMapMarkerAlt,
  FaPhone,
  FaEnvelope,
  FaCreditCard,
  FaMoneyBillWave,
  FaCalendarAlt,
  FaShoppingCart,
  FaDollarSign,
  FaPrint,
  FaDownload,
  FaStar,
  FaArrowLeft,
  FaExclamationTriangle,
  FaFilter,
  FaUser
} from 'react-icons/fa';
import { toast } from 'react-toastify';

const UserOrders = () => {
  const { user, isAuthenticated } = useAuth();
  const { formatPrice } = useSettings();
  const navigate = useNavigate();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [showOrderModal, setShowOrderModal] = useState(false);
  
  // Helper function to get default dates
  const getDefaultDates = () => {
    const today = new Date();
    const firstDayOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);
    
    // Format dates as YYYY-MM-DD
    const formatDate = (date) => {
      const year = date.getFullYear();
      const month = String(date.getMonth() + 1).padStart(2, '0');
      const day = String(date.getDate()).padStart(2, '0');
      return `${year}-${month}-${day}`;
    };
    
    return {
      dateFrom: formatDate(firstDayOfMonth),
      dateTo: formatDate(today)
    };
  };
  
  const [filters, setFilters] = useState({
    status: '',
    ...getDefaultDates()
  });

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login?redirect=/orders');
      return;
    }
    fetchOrders();
  }, [isAuthenticated, navigate, filters]);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      // Only include non-empty filter values
      const filterParams = {};
      Object.keys(filters).forEach(key => {
        if (filters[key] && filters[key].trim() !== '') {
          filterParams[key] = filters[key];
        }
      });
      const params = new URLSearchParams(filterParams);
      const response = await axios.get(`/api/orders?${params}`);
      setOrders(response.data.orders || []);
    } catch (error) {
      toast.error('Failed to load orders');
      console.error('Error fetching orders:', error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case 'pending': return 'warning';
      case 'processing': return 'info';
      case 'shipped': return 'primary';
      case 'delivered': return 'success';
      case 'cancelled': return 'danger';
      case 'returned': return 'secondary';
      default: return 'light';
    }
  };

  const getStatusIcon = (status) => {
    switch (status?.toLowerCase()) {
      case 'pending': return <FaClock />;
      case 'processing': return <FaBox />;
      case 'shipped': return <FaTruck />;
      case 'delivered': return <FaCheckCircle />;
      case 'cancelled': return <FaTimes />;
      case 'returned': return <FaUndo />;
      default: return <FaClock />;
    }
  };

  const getStatusDescription = (status) => {
    switch (status?.toLowerCase()) {
      case 'pending': return 'Your order has been placed and is awaiting confirmation';
      case 'processing': return 'Your order is being prepared for shipment';
      case 'shipped': return 'Your order has been shipped and is on its way';
      case 'delivered': return 'Your order has been delivered successfully';
      case 'cancelled': return 'Your order has been cancelled';
      case 'returned': return 'Your order has been returned';
      default: return 'Order status unknown';
    }
  };

  const handleCancelOrder = async (orderId) => {
    if (!window.confirm('Are you sure you want to cancel this order? This action cannot be undone.')) {
      return;
    }

    const cancellationReason = prompt('Please provide a reason for cancelling this order (optional):');
    
    try {
      await axios.post(`/api/orders/${orderId}/cancel`, { cancellationReason });
      toast.success('Order cancelled successfully');
      fetchOrders();
    } catch (error) {
      toast.error('Failed to cancel order');
      console.error('Error cancelling order:', error);
    }
  };

  const handleReturnRequest = async (orderId, returnReason) => {
    try {
      await axios.post(`/api/orders/${orderId}/return`, { returnReason });
      toast.success('Return request submitted successfully');
      fetchOrders();
    } catch (error) {
      toast.error('Failed to submit return request');
      console.error('Error submitting return request:', error);
    }
  };

  const printOrder = (order) => {
    const printWindow = window.open('', '_blank');
    
    // Helper function to safely get values and handle undefined
    const safeGet = (value, fallback = 'N/A') => value || fallback;
    
    printWindow.document.write(`
      <html>
        <head>
          <title>Order #${safeGet(order.orderNumber, 'N/A')}</title>
          <style>
            body { font-family: Arial, sans-serif; margin: 20px; line-height: 1.6; }
            .header { text-align: center; border-bottom: 2px solid #333; padding-bottom: 20px; margin-bottom: 20px; }
            .order-info { margin-bottom: 20px; }
            .items { margin-bottom: 20px; }
            .item { border: 1px solid #ddd; padding: 15px; margin-bottom: 10px; border-radius: 5px; }
            .total { font-weight: bold; font-size: 18px; background: #f8f9fa; padding: 15px; border-radius: 5px; }
            .status { color: #007bff; font-weight: bold; text-transform: capitalize; }
            .section { margin-bottom: 25px; }
            .section h3 { color: #333; border-bottom: 1px solid #ddd; padding-bottom: 5px; }
            .address { background: #f8f9fa; padding: 10px; border-radius: 5px; }
          </style>
        </head>
        <body>
          <div class="header">
            <h1>Order Receipt</h1>
            <h2>Order #${safeGet(order.orderNumber, 'N/A')}</h2>
            <p><strong>Date:</strong> ${order.createdAt ? new Date(order.createdAt).toLocaleDateString() : 'N/A'}</p>
            <p><strong>Status:</strong> <span class="status">${safeGet(order.status, 'Unknown')}</span></p>
          </div>
          
          <div class="order-info section">
            <h3>Customer Information</h3>
            <p><strong>Name:</strong> ${safeGet(order.user?.name, 'N/A')}</p>
            <p><strong>Email:</strong> ${safeGet(order.user?.email, 'N/A')}</p>
            <p><strong>Phone:</strong> ${safeGet(order.shippingAddress?.phone, 'N/A')}</p>
          </div>
          
          <div class="section">
            <h3>Shipping Address</h3>
            <div class="address">
              <p><strong>${safeGet(order.shippingAddress?.fullName, 'N/A')}</strong></p>
              <p>${safeGet(order.shippingAddress?.street, '')}</p>
              <p>${safeGet(order.shippingAddress?.city, '')}, ${safeGet(order.shippingAddress?.state, '')} ${safeGet(order.shippingAddress?.zipCode, '')}</p>
              <p>${safeGet(order.shippingAddress?.country, '')}</p>
            </div>
            ${order.trackingNumber ? `<p><strong>Tracking Number:</strong> ${order.trackingNumber}</p>` : ''}
          </div>
          
          <div class="items section">
            <h3>Order Items</h3>
            ${order.items && order.items.length > 0 ? order.items.map(item => `
              <div class="item">
                <p><strong>${safeGet(item.product?.name, 'Unknown Product')}</strong></p>
                <p><strong>Quantity:</strong> ${safeGet(item.quantity, 0)}</p>
                <p><strong>Price:</strong> ${item.price ? formatPrice(item.price) : 'N/A'} each</p>
                <p><strong>Total:</strong> ${item.price && item.quantity ? formatPrice(item.price * item.quantity) : 'N/A'}</p>
              </div>
            `).join('') : '<p>No items found</p>'}
          </div>
          
          <div class="total">
            <h3>Order Summary</h3>
            <p><strong>Subtotal:</strong> ${order.subtotal ? formatPrice(order.subtotal) : 'N/A'}</p>
            <p><strong>Shipping:</strong> ${order.shippingCost === 0 ? 'Free' : (order.shippingCost ? formatPrice(order.shippingCost) : 'N/A')}</p>
            <p><strong>Tax:</strong> ${order.tax ? formatPrice(order.tax) : 'N/A'}</p>
            <p><strong>Total:</strong> ${order.total ? formatPrice(order.total) : 'N/A'}</p>
          </div>
        </body>
      </html>
    `);
    printWindow.document.close();
    printWindow.print();
  };

  if (!isAuthenticated) {
    return null;
  }

  if (loading) {
    return (
      <div className="min-h-screen relative flex items-center justify-center">
        {/* Animated Background Elements */}
        <div className="absolute inset-0">
          <div className="absolute top-10 left-10 w-24 h-24 bg-blue-500/10 rounded-full animate-pulse"></div>
          <div className="absolute top-20 right-20 w-16 h-16 bg-purple-500/10 rounded-full animate-pulse animation-delay-1000"></div>
          <div className="absolute bottom-10 left-1/4 w-20 h-20 bg-pink-500/10 rounded-full animate-pulse animation-delay-2000"></div>
          <div className="absolute bottom-20 right-1/3 w-12 h-12 bg-green-500/10 rounded-full animate-pulse animation-delay-3000"></div>
        </div>
        <div className="text-center relative z-10">
          <div className="animate-spin rounded-full h-6 w-6 sm:h-8 sm:w-8 border-b-2 border-blue-600 mx-auto mb-3 sm:mb-4"></div>
          <p className="text-xs sm:text-sm text-gray-600">Loading your orders...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen relative">
      {/* Animated Background Elements */}
      <div className="absolute inset-0">
        <div className="absolute top-10 left-10 w-24 h-24 bg-blue-500/10 rounded-full animate-pulse"></div>
        <div className="absolute top-20 right-20 w-16 h-16 bg-purple-500/10 rounded-full animate-pulse animation-delay-1000"></div>
        <div className="absolute bottom-10 left-1/4 w-20 h-20 bg-pink-500/10 rounded-full animate-pulse animation-delay-2000"></div>
        <div className="absolute bottom-20 right-1/3 w-12 h-12 bg-green-500/10 rounded-full animate-pulse animation-delay-3000"></div>
      </div>


      {/* Content Section */}
      <div className="relative z-10 max-w-6xl mx-auto px-3 sm:px-4 lg:px-6 py-3 sm:py-4">
        {/* Filters */}
        <div className="bg-white/80 backdrop-blur-sm rounded-lg sm:rounded-xl shadow-sm border border-gray-200/50 p-3 sm:p-4 mb-3 sm:mb-4">
          <div className="flex items-center justify-between mb-2 sm:mb-3">
            <div className="flex items-center gap-2 sm:gap-3">
              <div className="w-6 h-6 sm:w-8 sm:h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                <FaFilter className="w-3 h-3 sm:w-4 sm:h-4 text-blue-600" />
              </div>
              <h2 className="text-sm sm:text-base font-semibold text-gray-900">Filter Orders</h2>
              {(filters.status || filters.dateFrom || filters.dateTo) && (
                <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs bg-blue-100 text-blue-700 font-medium">
                  Active
                </span>
              )}
            </div>
          </div>
          
          <div className="grid grid-cols-3 sm:grid-cols-2 lg:grid-cols-3 gap-1 sm:gap-3">
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">Status</label>
              <select
                value={filters.status}
                onChange={(e) => setFilters(prev => ({ ...prev, status: e.target.value }))}
                className="w-full px-1 sm:px-2 py-1 sm:py-1.5 text-xs border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="">All</option>
                <option value="Pending">Pending</option>
                <option value="Processing">Processing</option>
                <option value="Shipped">Shipped</option>
                <option value="Delivered">Delivered</option>
                <option value="Cancelled">Cancelled</option>
                <option value="Returned">Returned</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">From</label>
              <input
                type="date"
                value={filters.dateFrom}
                onChange={(e) => setFilters(prev => ({ ...prev, dateFrom: e.target.value }))}
                className="w-full px-1 sm:px-2 py-1 sm:py-1.5 text-xs border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">To</label>
              <input
                type="date"
                value={filters.dateTo}
                onChange={(e) => setFilters(prev => ({ ...prev, dateTo: e.target.value }))}
                className="w-full px-1 sm:px-2 py-1 sm:py-1.5 text-xs border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
          </div>
          
          {/* Clear Filters Button */}
          <div className="mt-3 flex justify-end">
            <button
              onClick={() => setFilters({ status: '', ...getDefaultDates() })}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-gray-100 text-gray-700 text-xs font-medium rounded-lg hover:bg-gray-200 transition-colors"
            >
              <FaTimes className="w-3 h-3" />
              Reset Filters
            </button>
          </div>
        </div>

        {/* Orders List */}
        <div className="space-y-2 sm:space-y-3">
          {orders.length > 0 ? (
            orders.map((order) => (
              <div key={order._id} className="bg-white/80 backdrop-blur-sm rounded-lg sm:rounded-xl shadow-sm border border-gray-200/50 overflow-hidden hover:shadow-md transition-all duration-200">
                {/* Order Header */}
                <div className="bg-gradient-to-r from-blue-50 to-purple-50 p-3 sm:p-4 border-b border-gray-100/50">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2 sm:gap-3">
                      <div className="w-6 h-6 sm:w-8 sm:h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                        <FaShoppingCart className="w-3 h-3 sm:w-4 sm:h-4 text-blue-600" />
                      </div>
                      <div>
                        <h3 className="text-sm sm:text-base font-semibold text-gray-900">
                          Order #{order.orderNumber}
                        </h3>
                        <p className="text-xs sm:text-sm text-gray-600">
                          {new Date(order.createdAt).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-2">
                      <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${
                        order.isPaid 
                          ? 'bg-green-100 text-green-800' 
                          : 'bg-yellow-100 text-yellow-800'
                      }`}>
                        {order.isPaid ? <FaCheckCircle className="w-3 h-3" /> : <FaExclamationTriangle className="w-3 h-3" />}
                          {order.isPaid ? 'Paid' : 'Unpaid'}
                        </span>
                    </div>
                  </div>
                </div>

                {/* Order Content */}
                <div className="p-3 sm:p-4">
                  <div className="grid grid-cols-1 lg:grid-cols-3 gap-2 sm:gap-3 mb-2 sm:mb-3">
                    {/* Status */}
                    <div className="flex items-center gap-2">
                      <div className={`inline-flex items-center gap-1 px-2 py-1 rounded-lg text-xs font-medium ${
                        order.status === 'Pending' ? 'bg-yellow-100 text-yellow-800' :
                        order.status === 'Processing' ? 'bg-blue-100 text-blue-800' :
                        order.status === 'Shipped' ? 'bg-purple-100 text-purple-800' :
                        order.status === 'Delivered' ? 'bg-green-100 text-green-800' :
                        order.status === 'Cancelled' ? 'bg-red-100 text-red-800' :
                        'bg-gray-100 text-gray-800'
                      }`}>
                        {getStatusIcon(order.status)}
                        {order.status}
                      </div>
                    </div>

                    {/* Total Amount */}
                    <div className="text-center">
                      <p className="text-xs text-gray-600">Total Amount</p>
                      <p className="text-sm sm:text-base font-bold text-blue-600">
                        {formatPrice(order.total)}
                      </p>
                    </div>

                    {/* Items Count */}
                    <div className="text-center">
                      <p className="text-xs text-gray-600">Items</p>
                      <p className="text-xs sm:text-sm font-semibold text-gray-900">
                        {order.items?.length || 0} item(s)
                      </p>
                    </div>
                  </div>

                  {/* Status Description */}
                  <div className="mb-2 sm:mb-3">
                    <p className="text-xs text-gray-600">
                      {getStatusDescription(order.status)}
                    </p>
                    {order.trackingNumber && (
                      <div className="flex items-center gap-1.5 mt-1">
                        <FaTruck className="w-3 h-3 text-blue-600" />
                        <span className="text-xs text-blue-600 font-medium">
                          Tracking: {order.trackingNumber}
                        </span>
                      </div>
                    )}
                  </div>

                  {/* Action Buttons */}
                  <div className="flex flex-wrap gap-1.5 sm:gap-2">
                    <button
                      onClick={() => {
                        setSelectedOrder(order);
                        setShowOrderModal(true);
                      }}
                      className="flex-1 sm:flex-none inline-flex items-center justify-between gap-1 px-2.5 py-1.5 text-xs font-semibold text-white bg-gradient-to-r from-gray-700 via-gray-800 to-black hover:from-gray-800 hover:via-gray-900 hover:to-gray-800 rounded-lg sm:rounded-xl transition-all duration-200 hover:scale-105 shadow-lg hover:shadow-xl focus:outline-none focus:ring-2 focus:ring-gray-500/20"
                    >
                      <FaEye className="w-3 h-3" />
                      <span className="sm:hidden">View</span>
                      <span className="hidden sm:inline">View Details</span>
                      <div className="w-3 h-3 bg-white rounded-full flex items-center justify-center">
                        <svg className="w-1.5 h-1.5 text-black" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                        </svg>
                      </div>
                    </button>
                    
                    <button
                      onClick={() => printOrder(order)}
                      className="flex-1 sm:flex-none inline-flex items-center justify-center gap-1 px-2.5 py-1.5 bg-gray-100 text-gray-700 text-xs font-medium rounded-lg hover:bg-gray-200 transition-colors"
                    >
                      <FaPrint className="w-3 h-3" />
                      Print
                    </button>

                    {order.status === 'Pending' && (
                      <button
                        onClick={() => handleCancelOrder(order._id)}
                        className="flex-1 sm:flex-none inline-flex items-center justify-center gap-1 px-2.5 py-1.5 bg-red-100 text-red-700 text-xs font-medium rounded-lg hover:bg-red-200 transition-colors"
                      >
                        <FaTimes className="w-3 h-3" />
                        Cancel
                      </button>
                    )}

                    {order.status === 'Delivered' && (
                      <button
                        onClick={() => {
                          const reason = prompt('Please provide a reason for return:');
                          if (reason) {
                            handleReturnRequest(order._id, reason);
                          }
                        }}
                        className="flex-1 sm:flex-none inline-flex items-center justify-center gap-1 px-2.5 py-1.5 bg-orange-100 text-orange-700 text-xs font-medium rounded-lg hover:bg-orange-200 transition-colors"
                      >
                        <FaUndo className="w-3 h-3" />
                        Return
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="bg-white/80 backdrop-blur-sm rounded-lg sm:rounded-xl shadow-sm border border-gray-200/50 p-4 sm:p-6 lg:p-8 text-center">
              <div className="w-12 h-12 sm:w-16 sm:h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-3 sm:mb-4">
                <FaShoppingCart className="w-6 h-6 sm:w-8 sm:h-8 text-blue-600" />
              </div>
              <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-2">No Orders Yet</h3>
              <p className="text-xs sm:text-sm text-gray-600 mb-4 sm:mb-6 max-w-md mx-auto">
                You haven't placed any orders yet. Start shopping to see your orders here!
              </p>
              <button
                onClick={() => navigate('/products')}
                className="inline-flex items-center gap-1.5 px-4 sm:px-6 py-2 sm:py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white text-xs sm:text-sm font-semibold rounded-lg hover:from-blue-700 hover:to-purple-700 transition-all duration-200 shadow-lg hover:shadow-xl"
              >
                <FaShoppingCart className="w-3 h-3 sm:w-4 sm:h-4" />
                Start Shopping
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Order Details Modal */}
      {showOrderModal && selectedOrder && (
        <OrderDetailsModal
          order={selectedOrder}
          formatPrice={formatPrice}
          onClose={() => {
            setShowOrderModal(false);
            setSelectedOrder(null);
          }}
          onCancel={handleCancelOrder}
          onReturn={handleReturnRequest}
          onPrint={printOrder}
           getStatusIcon={getStatusIcon}
        />
      )}
    </div>
  );
};

// Order Details Modal Component
const OrderDetailsModal = ({ order, formatPrice, onClose, onCancel, onReturn, onPrint, getStatusIcon }) => {
  const [showReturnForm, setShowReturnForm] = useState(false);
  const [returnReason, setReturnReason] = useState('');

  const handleReturnSubmit = () => {
    if (returnReason.trim()) {
      onReturn(order._id, returnReason);
      setShowReturnForm(false);
      setReturnReason('');
    }
  };

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-2 sm:p-4 z-50" onClick={onClose}>
      <div className="bg-white rounded-xl sm:rounded-2xl shadow-2xl max-w-xs sm:max-w-2xl lg:max-w-4xl w-full max-h-[90vh] overflow-hidden flex flex-col" onClick={(e) => e.stopPropagation()}>
        {/* Modal Header */}
        <div className="p-3 sm:p-4 border-b border-gray-100 bg-gradient-to-r from-blue-50 to-purple-50">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2 sm:space-x-3">
              <div className="w-6 h-6 sm:w-8 sm:h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                <FaShoppingCart className="w-3 h-3 sm:w-4 sm:h-4 text-blue-600" />
              </div>
              <div>
                <h2 className="text-sm sm:text-base font-bold text-gray-900">Order Details</h2>
                <p className="text-xs text-gray-600">#{order.orderNumber || order._id.slice(-6)}</p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-1.5 sm:p-2 text-gray-400 hover:text-gray-600 hover:bg-white rounded-lg transition-all duration-200"
            >
              <FaTimes className="w-3 h-3 sm:w-4 sm:h-4" />
            </button>
          </div>
        </div>

        {/* Modal Body */}
        <div className="flex-1 overflow-y-auto p-3 sm:p-4 lg:p-6 space-y-3 sm:space-y-4 lg:space-y-6">
          {/* Order Status and Total Card */}
          <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg sm:rounded-xl p-3 sm:p-4 text-white">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-2 sm:space-y-0">
              <div className="flex items-center space-x-2">
                <div className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-white/20 backdrop-blur-sm ${
                  order.status === 'Pending' ? 'bg-yellow-100 text-yellow-800' :
                  order.status === 'Processing' ? 'bg-blue-100 text-blue-800' :
                  order.status === 'Shipped' ? 'bg-purple-100 text-purple-800' :
                  order.status === 'Delivered' ? 'bg-green-100 text-green-800' :
                  order.status === 'Cancelled' ? 'bg-red-100 text-red-800' :
                  'bg-gray-100 text-gray-800'
                }`}>
                  {getStatusIcon(order.status)}
                  <span className="ml-1">{order.status}</span>
                </div>
                {order.status === 'Cancelled' && order.cancelledBy && (
                  <div className="mt-1 text-xs text-red-200">
                    Cancelled by {order.cancelledBy === 'User' ? 'You' : order.cancelledBy}
                    {order.cancelledAt && ` on ${new Date(order.cancelledAt).toLocaleDateString()}`}
                  </div>
                )}
                <div className={`px-2 py-1 rounded-full text-xs font-medium ${order.isPaid ? 'bg-green-500/20' : 'bg-red-500/20'}`}>
                  {order.isPaid ? 'Paid' : 'Unpaid'}
                </div>
              </div>
              <div className="text-right">
                <p className="text-lg sm:text-xl font-bold">{formatPrice(order.total)}</p>
                <p className="text-xs opacity-90">Total Amount</p>
              </div>
            </div>
          </div>

          {/* Customer Information Card */}
          <div className="bg-white rounded-lg sm:rounded-xl border border-gray-100 p-3 sm:p-4 shadow-sm">
            <div className="flex items-center space-x-2 mb-2 sm:mb-3">
              <div className="w-6 h-6 sm:w-8 sm:h-8 bg-green-100 rounded-lg flex items-center justify-center">
                <FaUser className="w-3 h-3 sm:w-4 sm:h-4 text-green-600" />
              </div>
              <h3 className="text-sm sm:text-base font-semibold text-gray-900">Customer Information</h3>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 sm:gap-3">
              <div className="space-y-1">
                <p className="text-xs text-gray-500 font-medium">Name</p>
                <p className="text-xs sm:text-sm font-semibold text-gray-900">{order.shippingAddress?.fullName || 'Guest User'}</p>
              </div>
              <div className="space-y-1">
                <p className="text-xs text-gray-500 font-medium">Email</p>
                <p className="text-xs sm:text-sm font-semibold text-gray-900">{order.shippingAddress?.email || 'N/A'}</p>
              </div>
              <div className="space-y-1">
                <p className="text-xs text-gray-500 font-medium">Phone</p>
                <p className="text-xs sm:text-sm font-semibold text-gray-900">{order.shippingAddress?.phone || 'N/A'}</p>
              </div>
              <div className="space-y-1">
                <p className="text-xs text-gray-500 font-medium">Order Date</p>
                <p className="text-xs sm:text-sm font-semibold text-gray-900">{new Date(order.createdAt).toLocaleDateString()}</p>
              </div>
            </div>
          </div>

          {/* Shipping Address Card */}
          <div className="bg-white rounded-lg sm:rounded-xl border border-gray-100 p-3 sm:p-4 shadow-sm">
            <div className="flex items-center space-x-2 mb-2 sm:mb-3">
              <div className="w-6 h-6 sm:w-8 sm:h-8 bg-purple-100 rounded-lg flex items-center justify-center">
                <FaMapMarkerAlt className="w-3 h-3 sm:w-4 sm:h-4 text-purple-600" />
              </div>
              <h3 className="text-sm sm:text-base font-semibold text-gray-900">Shipping Address</h3>
            </div>
            <div className="space-y-1">
              <p className="text-xs sm:text-sm text-gray-900 font-medium">{order.shippingAddress?.street || 'N/A'}</p>
              <p className="text-xs sm:text-sm text-gray-700">
                {order.shippingAddress?.city && `${order.shippingAddress.city}, `}
                {order.shippingAddress?.state && `${order.shippingAddress.state} `}
                {order.shippingAddress?.zipCode}
              </p>
              <p className="text-xs sm:text-sm text-gray-700">{order.shippingAddress?.country || 'N/A'}</p>
            </div>
          </div>

          {/* Order Items Card */}
          <div className="bg-white rounded-lg sm:rounded-xl border border-gray-100 p-3 sm:p-4 shadow-sm">
            <div className="flex items-center space-x-2 mb-2 sm:mb-3">
              <div className="w-6 h-6 sm:w-8 sm:h-8 bg-orange-100 rounded-lg flex items-center justify-center">
                <FaShoppingCart className="w-3 h-3 sm:w-4 sm:h-4 text-orange-600" />
              </div>
              <h3 className="text-sm sm:text-base font-semibold text-gray-900">Order Items ({order.items?.length || 0})</h3>
            </div>
            <div className="space-y-2">
              {order.items?.map((item, index) => (
                <div key={index} className="flex items-center gap-2 sm:gap-3 p-2 sm:p-3 bg-gray-50 rounded-lg">
                  {/* Product Image */}
                  <div className="flex-shrink-0">
                    <img
                      src={item.product?.images?.[0] || 'https://via.placeholder.com/60x60?text=No+Image'}
                      alt={item.product?.name || 'Product'}
                      className="w-10 h-10 sm:w-12 sm:h-12 object-cover rounded-lg"
                    />
                  </div>
                  
                  {/* Product Details */}
                  <div className="flex-1 min-w-0">
                    <p className="text-xs sm:text-sm font-semibold text-gray-900 truncate">
                      {item.product?.name || 'Product'}
                    </p>
                    {item.product?.brand && (
                      <p className="text-xs text-gray-500 truncate">
                        Brand: {item.product.brand}
                      </p>
                    )}
                    {item.product?.category && (
                      <p className="text-xs text-gray-500 truncate">
                        Category: {item.product.category}
                      </p>
                    )}
                    <div className="flex flex-wrap gap-1 mt-1">
                      <span className="text-xs bg-blue-100 text-blue-700 px-1.5 py-0.5 rounded-full">
                        Qty: {item.quantity}
                      </span>
                      {item.selectedSize && (
                        <span className="text-xs bg-green-100 text-green-700 px-1.5 py-0.5 rounded-full">
                          Size: {item.selectedSize}
                        </span>
                      )}
                      {item.selectedColor && (
                        <span className="text-xs bg-purple-100 text-purple-700 px-1.5 py-0.5 rounded-full">
                          Color: {item.selectedColor.name}
                        </span>
                      )}
                    </div>
                  </div>
                  
                  {/* Price Details */}
                  <div className="text-right ml-2 flex-shrink-0">
                    <p className="text-xs sm:text-sm font-bold text-gray-900">
                      {formatPrice(item.price)}
                    </p>
                    <p className="text-xs text-gray-600">
                      Total: {formatPrice(item.price * item.quantity)}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Order Summary Card */}
          <div className="bg-white rounded-lg sm:rounded-xl border border-gray-100 p-3 sm:p-4 shadow-sm">
            <div className="flex items-center space-x-2 mb-2 sm:mb-3">
              <div className="w-6 h-6 sm:w-8 sm:h-8 bg-green-100 rounded-lg flex items-center justify-center">
                <FaDollarSign className="w-3 h-3 sm:w-4 sm:h-4 text-green-600" />
              </div>
              <h3 className="text-sm sm:text-base font-semibold text-gray-900">Order Summary</h3>
            </div>
            <div className="space-y-2">
              <div className="flex justify-between items-center py-1">
                <span className="text-xs text-gray-600">Subtotal</span>
                <span className="text-xs sm:text-sm font-semibold text-gray-900">{formatPrice(order.subtotal)}</span>
              </div>
              <div className="flex justify-between items-center py-1">
                <span className="text-xs text-gray-600">Shipping</span>
                <span className="text-xs sm:text-sm font-semibold text-blue-600">{order.shippingCost === 0 ? 'Free' : formatPrice(order.shippingCost)}</span>
              </div>
              <div className="flex justify-between items-center py-1">
                <span className="text-xs text-gray-600">Tax</span>
                <span className="text-xs sm:text-sm font-semibold text-gray-900">{formatPrice(order.tax)}</span>
              </div>
              <div className="flex justify-between items-center pt-2 border-t border-gray-200">
                <span className="text-sm font-bold text-gray-900">Total</span>
                <span className="text-sm sm:text-base font-bold text-blue-600">{formatPrice(order.total)}</span>
              </div>
            </div>
          </div>

          {/* Cancellation Information */}
          {order.status === 'Cancelled' && (
            <div className="bg-red-50 rounded-lg sm:rounded-xl border border-red-100 p-3 sm:p-4">
              <div className="flex items-center space-x-2 mb-2 sm:mb-3">
                <div className="w-6 h-6 sm:w-8 sm:h-8 bg-red-100 rounded-lg flex items-center justify-center">
                  <FaTimes className="w-3 h-3 sm:w-4 sm:h-4 text-red-600" />
                </div>
                <h3 className="text-sm sm:text-base font-semibold text-red-900">Cancellation Details</h3>
              </div>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mb-2">
                <div className="space-y-1">
                  <p className="text-xs text-red-600 font-medium">Cancelled By</p>
                  <p className="text-xs sm:text-sm font-semibold text-red-900">
                    {order.cancelledBy === 'User' ? 'You' : order.cancelledBy || 'N/A'}
                  </p>
                </div>
                <div className="space-y-1">
                  <p className="text-xs text-red-600 font-medium">Cancelled At</p>
                  <p className="text-xs sm:text-sm font-semibold text-red-900">
                    {order.cancelledAt ? new Date(order.cancelledAt).toLocaleDateString() : 'N/A'}
                  </p>
                </div>
              </div>
              
              {order.cancellationReason && (
                <div className="space-y-1">
                  <p className="text-xs text-red-600 font-medium">Cancellation Reason</p>
                  <p className="text-xs sm:text-sm text-red-900 bg-red-100 p-2 rounded-lg">
                    {order.cancellationReason}
                  </p>
                </div>
              )}
            </div>
          )}

          {/* Tracking Information */}
          {order.trackingNumber && (
            <div className="bg-blue-50 rounded-lg sm:rounded-xl border border-blue-100 p-3 sm:p-4">
              <div className="flex items-center space-x-2 mb-2">
                <div className="w-6 h-6 sm:w-8 sm:h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                  <FaTruck className="w-3 h-3 sm:w-4 sm:h-4 text-blue-600" />
                </div>
                <h3 className="text-sm sm:text-base font-semibold text-gray-900">Tracking Information</h3>
              </div>
              <p className="text-xs sm:text-sm text-gray-700 font-medium">Tracking Number: {order.trackingNumber}</p>
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="p-3 sm:p-4 border-t border-gray-100 bg-gray-50">
          <div className="flex flex-col sm:flex-row gap-2">
            <button 
              onClick={onPrint} 
              className="flex-1 sm:flex-none inline-flex items-center justify-center gap-1 px-3 py-2 bg-gray-100 text-gray-700 text-xs font-medium rounded-lg hover:bg-gray-200 transition-colors"
            >
              <FaPrint className="w-3 h-3" />
              Print Receipt
            </button>
            
            {order.status === 'Pending' && (
              <button 
                onClick={() => onCancel(order._id)} 
                className="flex-1 sm:flex-none inline-flex items-center justify-center gap-1 px-3 py-2 bg-red-100 text-red-700 text-xs font-medium rounded-lg hover:bg-red-200 transition-colors"
              >
                <FaTimes className="w-3 h-3" />
                Cancel Order
              </button>
            )}

            {order.status === 'Delivered' && !showReturnForm && (
              <button 
                onClick={() => setShowReturnForm(true)} 
                className="flex-1 sm:flex-none inline-flex items-center justify-center gap-1 px-3 py-2 bg-orange-100 text-orange-700 text-xs font-medium rounded-lg hover:bg-orange-200 transition-colors"
              >
                <FaUndo className="w-3 h-3" />
                Request Return
              </button>
            )}

            {showReturnForm && (
              <div className="w-full space-y-2">
                <textarea
                  value={returnReason}
                  onChange={(e) => setReturnReason(e.target.value)}
                  placeholder="Please provide a reason for return..."
                  className="w-full p-2 text-xs border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  rows="3"
                />
                <div className="flex gap-2">
                  <button 
                    onClick={handleReturnSubmit} 
                    className="flex-1 inline-flex items-center justify-center gap-1 px-3 py-2 bg-orange-600 text-white text-xs font-medium rounded-lg hover:bg-orange-700 transition-colors"
                  >
                    Submit Return Request
                  </button>
                  <button 
                    onClick={() => setShowReturnForm(false)} 
                    className="flex-1 inline-flex items-center justify-center gap-1 px-3 py-2 bg-gray-100 text-gray-700 text-xs font-medium rounded-lg hover:bg-gray-200 transition-colors"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserOrders;
