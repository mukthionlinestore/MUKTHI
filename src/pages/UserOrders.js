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
  const [filters, setFilters] = useState({
    status: '',
    dateFrom: '',
    dateTo: ''
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
    printWindow.document.write(`
      <html>
        <head>
          <title>Order #${order.orderNumber}</title>
          <style>
            body { font-family: Arial, sans-serif; margin: 20px; }
            .header { text-align: center; border-bottom: 2px solid #333; padding-bottom: 20px; margin-bottom: 20px; }
            .order-info { margin-bottom: 20px; }
            .items { margin-bottom: 20px; }
            .item { border: 1px solid #ddd; padding: 10px; margin-bottom: 10px; }
            .total { font-weight: bold; font-size: 18px; }
            .status { color: #007bff; font-weight: bold; }
          </style>
        </head>
        <body>
          <div class="header">
            <h1>Order Receipt</h1>
            <h2>Order #${order.orderNumber}</h2>
            <p>Date: ${new Date(order.createdAt).toLocaleDateString()}</p>
          </div>
          
          <div class="order-info">
            <h3>Customer Information</h3>
            <p><strong>Name:</strong> ${order.user?.name}</p>
            <p><strong>Email:</strong> ${order.user?.email}</p>
            <p><strong>Phone:</strong> ${order.shippingAddress?.phone}</p>
            
            <h3>Shipping Address</h3>
            <p>${order.shippingAddress?.fullName}</p>
            <p>${order.shippingAddress?.street}</p>
            <p>${order.shippingAddress?.city}, ${order.shippingAddress?.state} ${order.shippingAddress?.zipCode}</p>
            <p>${order.shippingAddress?.country}</p>
            
            <h3>Order Status</h3>
            <p class="status">${order.status}</p>
            ${order.trackingNumber ? `<p><strong>Tracking Number:</strong> ${order.trackingNumber}</p>` : ''}
          </div>
          
          <div class="items">
            <h3>Order Items</h3>
            ${order.items.map(item => `
              <div class="item">
                <p><strong>${item.product?.name}</strong></p>
                <p>Quantity: ${item.quantity}</p>
                <p>Price: ${formatPrice(item.price)} each</p>
                <p>Total: ${formatPrice(item.price * item.quantity)}</p>
              </div>
            `).join('')}
          </div>
          
          <div class="total">
            <p>Subtotal: ${formatPrice(order.subtotal)}</p>
            <p>Shipping: ${order.shippingCost === 0 ? 'Free' : formatPrice(order.shippingCost)}</p>
            <p>Tax: ${formatPrice(order.tax)}</p>
            <p>Total: ${formatPrice(order.total)}</p>
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
      <div className="min-h-screen bg-gradient-to-br from-emerald-50 to-teal-50 flex items-center justify-center">
          <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 sm:h-12 sm:w-12 border-b-2 border-emerald-600 mx-auto mb-3 sm:mb-4"></div>
          <p className="text-sm sm:text-base text-gray-600">Loading your orders...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 to-teal-50">
      {/* Header Section */}
      <div className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-3 sm:px-4 lg:px-6 py-4 sm:py-6">
          <div className="flex items-center gap-3 sm:gap-4">
            <button 
              onClick={() => navigate('/profile')}
              className="inline-flex items-center justify-center h-8 w-8 sm:h-10 sm:w-10 rounded-lg bg-gray-100 hover:bg-gray-200 transition-colors"
            >
              <FaArrowLeft className="w-3 h-3 sm:w-4 sm:h-4 text-gray-600" />
            </button>
            <div>
              <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-900">My Orders</h1>
              <p className="text-xs sm:text-sm text-gray-600 mt-1">Track your order status and view order history</p>
            </div>
          </div>
          </div>
        </div>

      {/* Content Section */}
      <div className="max-w-7xl mx-auto px-3 sm:px-4 lg:px-6 py-4 sm:py-6">
        {/* Filters */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-3 sm:p-4 lg:p-6 mb-4 sm:mb-6">
          <div className="flex items-center justify-between mb-3 sm:mb-4">
            <div className="flex items-center gap-2 sm:gap-3">
              <div className="w-6 h-6 sm:w-8 sm:h-8 lg:w-10 lg:h-10 bg-emerald-100 rounded-lg sm:rounded-xl flex items-center justify-center">
                <FaFilter className="w-3 h-3 sm:w-4 sm:h-4 lg:w-5 lg:h-5 text-emerald-600" />
              </div>
              <h2 className="text-sm sm:text-base lg:text-lg font-semibold text-gray-900">Filter Orders</h2>
              {(filters.status || filters.dateFrom || filters.dateTo) && (
                <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs bg-emerald-100 text-emerald-700 font-medium">
                  Active
                </span>
              )}
            </div>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
            <div>
              <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1 sm:mb-2">Status</label>
              <select
                value={filters.status}
                onChange={(e) => setFilters(prev => ({ ...prev, status: e.target.value }))}
                className="w-full px-2 sm:px-3 py-1.5 sm:py-2 text-xs sm:text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
              >
                <option value="">All Orders</option>
                <option value="Pending">Pending</option>
                <option value="Processing">Processing</option>
                <option value="Shipped">Shipped</option>
                <option value="Delivered">Delivered</option>
                <option value="Cancelled">Cancelled</option>
                <option value="Returned">Returned</option>
              </select>
            </div>

            <div>
              <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1 sm:mb-2">Date From</label>
              <input
                type="date"
                value={filters.dateFrom}
                onChange={(e) => setFilters(prev => ({ ...prev, dateFrom: e.target.value }))}
                className="w-full px-2 sm:px-3 py-1.5 sm:py-2 text-xs sm:text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
              />
            </div>

            <div>
              <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1 sm:mb-2">Date To</label>
              <input
                type="date"
                value={filters.dateTo}
                onChange={(e) => setFilters(prev => ({ ...prev, dateTo: e.target.value }))}
                className="w-full px-2 sm:px-3 py-1.5 sm:py-2 text-xs sm:text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
              />
            </div>
          </div>
          
          {/* Clear Filters Button */}
          <div className="mt-4 sm:mt-6 flex justify-end">
            <button
              onClick={() => setFilters({ status: '', dateFrom: '', dateTo: '' })}
              className="inline-flex items-center gap-1.5 px-3 sm:px-4 py-2 bg-gray-100 text-gray-700 text-xs sm:text-sm font-medium rounded-lg hover:bg-gray-200 transition-colors"
            >
              <FaTimes className="w-3 h-3 sm:w-4 sm:h-4" />
              Clear Filters
            </button>
          </div>
        </div>

        {/* Orders List */}
        <div className="space-y-3 sm:space-y-4">
          {orders.length > 0 ? (
            orders.map((order) => (
              <div key={order._id} className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden hover:shadow-lg transition-all duration-200">
                {/* Order Header */}
                <div className="bg-gradient-to-r from-emerald-50 to-teal-50 p-3 sm:p-4 border-b border-gray-100">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2 sm:gap-3">
                      <div className="w-8 h-8 sm:w-10 sm:h-10 bg-emerald-100 rounded-lg flex items-center justify-center">
                        <FaShoppingCart className="w-4 h-4 sm:w-5 sm:h-5 text-emerald-600" />
                      </div>
                      <div>
                        <h3 className="text-sm sm:text-base lg:text-lg font-semibold text-gray-900">
                          Order #{order.orderNumber}
                        </h3>
                        <p className="text-xs sm:text-sm text-gray-600">
                          {new Date(order.createdAt).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-2">
                      <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs sm:text-sm font-medium ${
                        order.isPaid 
                          ? 'bg-green-100 text-green-800' 
                          : 'bg-yellow-100 text-yellow-800'
                      }`}>
                        {order.isPaid ? <FaCheckCircle className="w-3 h-3 sm:w-4 sm:h-4" /> : <FaExclamationTriangle className="w-3 h-3 sm:w-4 sm:h-4" />}
                          {order.isPaid ? 'Paid' : 'Unpaid'}
                        </span>
                    </div>
                  </div>
                      </div>

                {/* Order Content */}
                <div className="p-3 sm:p-4">
                  <div className="grid grid-cols-1 lg:grid-cols-3 gap-3 sm:gap-4 mb-3 sm:mb-4">
                    {/* Status */}
                    <div className="flex items-center gap-2 sm:gap-3">
                      <div className={`inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs sm:text-sm font-medium ${
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
                      <p className="text-xs sm:text-sm text-gray-600">Total Amount</p>
                      <p className="text-lg sm:text-xl font-bold text-emerald-600">
                        {formatPrice(order.total)}
                      </p>
                        </div>

                    {/* Items Count */}
                    <div className="text-center">
                      <p className="text-xs sm:text-sm text-gray-600">Items</p>
                      <p className="text-sm sm:text-base font-semibold text-gray-900">
                        {order.items?.length || 0} item(s)
                      </p>
                        </div>
                      </div>

                  {/* Status Description */}
                  <div className="mb-3 sm:mb-4">
                    <p className="text-xs sm:text-sm text-gray-600">
                          {getStatusDescription(order.status)}
                        </p>
                        {order.trackingNumber && (
                      <div className="flex items-center gap-1.5 mt-1.5">
                        <FaTruck className="w-3 h-3 sm:w-4 sm:h-4 text-emerald-600" />
                        <span className="text-xs sm:text-sm text-emerald-600 font-medium">
                          Tracking: {order.trackingNumber}
                        </span>
                      </div>
                    )}
                    </div>

                  {/* Action Buttons */}
                  <div className="flex flex-wrap gap-2 sm:gap-3">
                      <button
                        onClick={() => {
                          setSelectedOrder(order);
                          setShowOrderModal(true);
                        }}
                      className="flex-1 sm:flex-none inline-flex items-center justify-center gap-1.5 px-3 py-2 bg-emerald-600 text-white text-xs sm:text-sm font-medium rounded-lg hover:bg-emerald-700 transition-colors"
                      >
                      <FaEye className="w-3 h-3 sm:w-4 sm:h-4" />
                      View Details
                      </button>
                      
                      <button
                        onClick={() => printOrder(order)}
                      className="flex-1 sm:flex-none inline-flex items-center justify-center gap-1.5 px-3 py-2 bg-gray-100 text-gray-700 text-xs sm:text-sm font-medium rounded-lg hover:bg-gray-200 transition-colors"
                      >
                      <FaPrint className="w-3 h-3 sm:w-4 sm:h-4" />
                      Print
                      </button>

                      {order.status === 'Pending' && (
                        <button
                          onClick={() => handleCancelOrder(order._id)}
                        className="flex-1 sm:flex-none inline-flex items-center justify-center gap-1.5 px-3 py-2 bg-red-100 text-red-700 text-xs sm:text-sm font-medium rounded-lg hover:bg-red-200 transition-colors"
                        >
                        <FaTimes className="w-3 h-3 sm:w-4 sm:h-4" />
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
                        className="flex-1 sm:flex-none inline-flex items-center justify-center gap-1.5 px-3 py-2 bg-orange-100 text-orange-700 text-xs sm:text-sm font-medium rounded-lg hover:bg-orange-200 transition-colors"
                        >
                        <FaUndo className="w-3 h-3 sm:w-4 sm:h-4" />
                        Return
                        </button>
                      )}
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 sm:p-8 lg:p-12 text-center">
              <div className="w-16 h-16 sm:w-20 sm:h-20 lg:w-24 lg:h-24 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-4 sm:mb-6">
                <FaShoppingCart className="w-8 h-8 sm:w-10 sm:h-10 lg:w-12 lg:h-12 text-emerald-600" />
              </div>
              <h3 className="text-lg sm:text-xl lg:text-2xl font-semibold text-gray-900 mb-2 sm:mb-3">No Orders Yet</h3>
              <p className="text-sm sm:text-base text-gray-600 mb-6 sm:mb-8 max-w-md mx-auto">
                You haven't placed any orders yet. Start shopping to see your orders here!
              </p>
              <button
                onClick={() => navigate('/products')}
                className="inline-flex items-center gap-2 px-6 sm:px-8 py-3 sm:py-4 bg-gradient-to-r from-emerald-600 to-teal-600 text-white text-sm sm:text-base font-semibold rounded-xl hover:from-emerald-700 hover:to-teal-700 transition-all duration-200 shadow-lg hover:shadow-xl"
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
        <div className="p-3 sm:p-4 lg:p-6 border-b border-gray-100 bg-gradient-to-r from-emerald-50 to-teal-50">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2 sm:space-x-3">
              <div className="w-8 h-8 sm:w-10 sm:h-10 lg:w-12 lg:h-12 bg-emerald-100 rounded-lg sm:rounded-xl flex items-center justify-center">
                <FaShoppingCart className="w-4 h-4 sm:w-5 sm:h-5 lg:w-6 lg:h-6 text-emerald-600" />
              </div>
              <div>
                <h2 className="text-sm sm:text-lg lg:text-xl font-bold text-gray-900">Order Details</h2>
                <p className="text-xs text-gray-600">#{order.orderNumber || order._id.slice(-6)}</p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-1.5 sm:p-2 lg:p-3 text-gray-400 hover:text-gray-600 hover:bg-white rounded-lg sm:rounded-xl transition-all duration-200"
            >
              <FaTimes className="w-3 h-3 sm:w-4 sm:h-4 lg:w-5 lg:h-5" />
            </button>
          </div>
          </div>

        {/* Modal Body */}
        <div className="flex-1 overflow-y-auto p-3 sm:p-4 lg:p-6 space-y-3 sm:space-y-4 lg:space-y-6">
          {/* Order Status and Total Card */}
          <div className="bg-gradient-to-r from-emerald-500 to-teal-600 rounded-xl sm:rounded-2xl p-3 sm:p-4 lg:p-6 text-white">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-2 sm:space-y-3 lg:space-y-0">
              <div className="flex items-center space-x-2 sm:space-x-3">
                <div className={`inline-flex items-center px-2 py-1 sm:px-3 sm:py-1.5 rounded-full text-xs font-medium bg-white/20 backdrop-blur-sm ${
                  order.status === 'Pending' ? 'bg-yellow-100 text-yellow-800' :
                  order.status === 'Processing' ? 'bg-blue-100 text-blue-800' :
                  order.status === 'Shipped' ? 'bg-purple-100 text-purple-800' :
                  order.status === 'Delivered' ? 'bg-green-100 text-green-800' :
                  order.status === 'Cancelled' ? 'bg-red-100 text-red-800' :
                  'bg-gray-100 text-gray-800'
                }`}>
                  {getStatusIcon(order.status)}
                  <span className="ml-1 sm:ml-2">{order.status}</span>
                </div>
                {order.status === 'Cancelled' && order.cancelledBy && (
                  <div className="mt-1 text-xs text-red-200">
                    Cancelled by {order.cancelledBy === 'User' ? 'You' : order.cancelledBy}
                    {order.cancelledAt && ` on ${new Date(order.cancelledAt).toLocaleDateString()}`}
                  </div>
                )}
                <div className={`px-2 py-1 sm:px-3 sm:py-1.5 rounded-full text-xs font-medium ${order.isPaid ? 'bg-green-500/20' : 'bg-red-500/20'}`}>
                  {order.isPaid ? 'Paid' : 'Unpaid'}
                </div>
                  </div>
              <div className="text-right">
                <p className="text-xl sm:text-2xl lg:text-3xl font-bold">{formatPrice(order.total)}</p>
                <p className="text-xs opacity-90">Total Amount</p>
                    </div>
                </div>
              </div>

          {/* Customer Information Card */}
          <div className="bg-white rounded-xl sm:rounded-2xl border border-gray-100 p-3 sm:p-4 lg:p-6 shadow-sm">
            <div className="flex items-center space-x-2 sm:space-x-3 mb-3 sm:mb-4">
              <div className="w-6 h-6 sm:w-8 sm:h-8 lg:w-10 lg:h-10 bg-green-100 rounded-lg sm:rounded-xl flex items-center justify-center">
                <FaUser className="w-3 h-3 sm:w-4 sm:h-4 lg:w-5 lg:h-5 text-green-600" />
              </div>
              <h3 className="text-sm sm:text-base lg:text-lg font-semibold text-gray-900">Customer Information</h3>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 sm:gap-3 lg:gap-4">
              <div className="space-y-1">
                <p className="text-xs sm:text-sm text-gray-500 font-medium">Name</p>
                <p className="text-xs sm:text-sm lg:text-base font-semibold text-gray-900">{order.user?.name || 'Guest User'}</p>
              </div>
              <div className="space-y-1">
                <p className="text-xs sm:text-sm text-gray-500 font-medium">Email</p>
                <p className="text-xs sm:text-sm lg:text-base font-semibold text-gray-900">{order.user?.email || 'N/A'}</p>
              </div>
              <div className="space-y-1">
                <p className="text-xs sm:text-sm text-gray-500 font-medium">Phone</p>
                <p className="text-xs sm:text-sm lg:text-base font-semibold text-gray-900">{order.shippingAddress?.phone || 'N/A'}</p>
              </div>
              <div className="space-y-1">
                <p className="text-xs sm:text-sm text-gray-500 font-medium">Order Date</p>
                <p className="text-xs sm:text-sm lg:text-base font-semibold text-gray-900">{new Date(order.createdAt).toLocaleDateString()}</p>
                </div>
              </div>
            </div>

          {/* Shipping Address Card */}
          <div className="bg-white rounded-xl sm:rounded-2xl border border-gray-100 p-3 sm:p-4 lg:p-6 shadow-sm">
            <div className="flex items-center space-x-2 sm:space-x-3 mb-3 sm:mb-4">
              <div className="w-6 h-6 sm:w-8 sm:h-8 lg:w-10 lg:h-10 bg-purple-100 rounded-lg sm:rounded-xl flex items-center justify-center">
                <FaMapMarkerAlt className="w-3 h-3 sm:w-4 sm:h-4 lg:w-5 lg:h-5 text-purple-600" />
              </div>
              <h3 className="text-sm sm:text-base lg:text-lg font-semibold text-gray-900">Shipping Address</h3>
            </div>
            <div className="space-y-1 sm:space-y-2">
              <p className="text-xs sm:text-sm lg:text-base text-gray-900 font-medium">{order.shippingAddress?.street || 'N/A'}</p>
              <p className="text-xs sm:text-sm lg:text-base text-gray-700">
                {order.shippingAddress?.city && `${order.shippingAddress.city}, `}
                {order.shippingAddress?.state && `${order.shippingAddress.state} `}
                {order.shippingAddress?.zipCode}
              </p>
              <p className="text-xs sm:text-sm lg:text-base text-gray-700">{order.shippingAddress?.country || 'N/A'}</p>
            </div>
          </div>

          {/* Order Items Card */}
          <div className="bg-white rounded-xl sm:rounded-2xl border border-gray-100 p-3 sm:p-4 lg:p-6 shadow-sm">
            <div className="flex items-center space-x-2 sm:space-x-3 mb-3 sm:mb-4">
              <div className="w-6 h-6 sm:w-8 sm:h-8 lg:w-10 lg:h-10 bg-orange-100 rounded-lg sm:rounded-xl flex items-center justify-center">
                <FaShoppingCart className="w-3 h-3 sm:w-4 sm:h-4 lg:w-5 lg:h-5 text-orange-600" />
              </div>
              <h3 className="text-sm sm:text-base lg:text-lg font-semibold text-gray-900">Order Items ({order.items?.length || 0})</h3>
            </div>
            <div className="space-y-2 sm:space-y-3">
                  {order.items?.map((item, index) => (
                <div key={index} className="flex items-center gap-3 sm:gap-4 p-2 sm:p-3 lg:p-4 bg-gray-50 rounded-lg sm:rounded-xl">
                  {/* Product Image */}
                  <div className="flex-shrink-0">
                    <img
                      src={item.product?.images?.[0] || 'https://via.placeholder.com/60x60?text=No+Image'}
                      alt={item.product?.name || 'Product'}
                      className="w-12 h-12 sm:w-16 sm:h-16 lg:w-20 lg:h-20 object-cover rounded-lg"
                    />
                  </div>
                  
                  {/* Product Details */}
                  <div className="flex-1 min-w-0">
                    <p className="text-xs sm:text-sm lg:text-base font-semibold text-gray-900 truncate">
                      {item.product?.name || 'Product'}
                    </p>
                    {item.product?.brand && (
                      <p className="text-xs sm:text-sm text-gray-500 truncate">
                        Brand: {item.product.brand}
                      </p>
                    )}
                    {item.product?.category && (
                      <p className="text-xs sm:text-sm text-gray-500 truncate">
                        Category: {item.product.category}
                      </p>
                    )}
                    <div className="flex flex-wrap gap-1 sm:gap-2 mt-1">
                      <span className="text-xs bg-blue-100 text-blue-700 px-1.5 py-0.5 sm:px-2 sm:py-1 rounded-full">
                        Qty: {item.quantity}
                      </span>
                        {item.selectedSize && (
                        <span className="text-xs bg-green-100 text-green-700 px-1.5 py-0.5 sm:px-2 sm:py-1 rounded-full">
                          Size: {item.selectedSize}
                        </span>
                      )}
                      {item.selectedColor && (
                        <span className="text-xs bg-purple-100 text-purple-700 px-1.5 py-0.5 sm:px-2 sm:py-1 rounded-full">
                          Color: {item.selectedColor.name}
                        </span>
                      )}
                    </div>
                      </div>
                  
                  {/* Price Details */}
                  <div className="text-right ml-2 sm:ml-3 flex-shrink-0">
                    <p className="text-xs sm:text-sm lg:text-base font-bold text-gray-900">
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
          <div className="bg-white rounded-xl sm:rounded-2xl border border-gray-100 p-3 sm:p-4 lg:p-6 shadow-sm">
            <div className="flex items-center space-x-2 sm:space-x-3 mb-3 sm:mb-4">
              <div className="w-6 h-6 sm:w-8 sm:h-8 lg:w-10 lg:h-10 bg-green-100 rounded-lg sm:rounded-xl flex items-center justify-center">
                <FaDollarSign className="w-3 h-3 sm:w-4 sm:h-4 lg:w-5 lg:h-5 text-green-600" />
                  </div>
              <h3 className="text-sm sm:text-base lg:text-lg font-semibold text-gray-900">Order Summary</h3>
                  </div>
            <div className="space-y-2 sm:space-y-3">
              <div className="flex justify-between items-center py-1 sm:py-2">
                <span className="text-xs sm:text-sm lg:text-base text-gray-600">Subtotal</span>
                <span className="text-xs sm:text-sm lg:text-base font-semibold text-gray-900">{formatPrice(order.subtotal)}</span>
                  </div>
              <div className="flex justify-between items-center py-1 sm:py-2">
                <span className="text-xs sm:text-sm lg:text-base text-gray-600">Shipping</span>
                <span className="text-xs sm:text-sm lg:text-base font-semibold text-emerald-600">{order.shippingCost === 0 ? 'Free' : formatPrice(order.shippingCost)}</span>
                  </div>
              <div className="flex justify-between items-center py-1 sm:py-2">
                <span className="text-xs sm:text-sm lg:text-base text-gray-600">Tax</span>
                <span className="text-xs sm:text-sm lg:text-base font-semibold text-gray-900">{formatPrice(order.tax)}</span>
                </div>
              <div className="flex justify-between items-center pt-2 sm:pt-3 border-t border-gray-200">
                <span className="text-sm sm:text-base lg:text-lg font-bold text-gray-900">Total</span>
                <span className="text-base sm:text-lg lg:text-xl font-bold text-emerald-600">{formatPrice(order.total)}</span>
              </div>
            </div>
          </div>

          {/* Cancellation Information */}
          {order.status === 'Cancelled' && (
            <div className="bg-red-50 rounded-xl sm:rounded-2xl border border-red-100 p-3 sm:p-4 lg:p-6">
              <div className="flex items-center space-x-2 sm:space-x-3 mb-2 sm:mb-3">
                <div className="w-6 h-6 sm:w-8 sm:h-8 lg:w-10 lg:h-10 bg-red-100 rounded-lg sm:rounded-xl flex items-center justify-center">
                  <FaTimes className="w-3 h-3 sm:w-4 sm:w-4 lg:w-5 lg:h-5 text-red-600" />
                </div>
                <h3 className="text-sm sm:text-base lg:text-lg font-semibold text-red-900">Cancellation Details</h3>
              </div>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 sm:gap-3 mb-2 sm:mb-3">
                <div className="space-y-1">
                  <p className="text-xs sm:text-sm text-red-600 font-medium">Cancelled By</p>
                  <p className="text-xs sm:text-sm lg:text-base font-semibold text-red-900">
                    {order.cancelledBy === 'User' ? 'You' : order.cancelledBy || 'N/A'}
                  </p>
                </div>
                <div className="space-y-1">
                  <p className="text-xs sm:text-sm text-red-600 font-medium">Cancelled At</p>
                  <p className="text-xs sm:text-sm lg:text-base font-semibold text-red-900">
                    {order.cancelledAt ? new Date(order.cancelledAt).toLocaleDateString() : 'N/A'}
                  </p>
                </div>
              </div>
              
              {order.cancellationReason && (
                <div className="space-y-1">
                  <p className="text-xs sm:text-sm text-red-600 font-medium">Cancellation Reason</p>
                  <p className="text-xs sm:text-sm lg:text-base text-red-900 bg-red-100 p-2 sm:p-3 rounded-lg">
                    {order.cancellationReason}
                  </p>
                </div>
              )}
            </div>
          )}

          {/* Tracking Information */}
          {order.trackingNumber && (
            <div className="bg-blue-50 rounded-xl sm:rounded-2xl border border-blue-100 p-3 sm:p-4 lg:p-6">
              <div className="flex items-center space-x-2 sm:space-x-3 mb-2 sm:mb-3">
                <div className="w-6 h-6 sm:w-8 sm:h-8 lg:w-10 lg:h-10 bg-blue-100 rounded-lg sm:rounded-xl flex items-center justify-center">
                  <FaTruck className="w-3 h-3 sm:w-4 sm:h-4 lg:w-5 lg:h-5 text-blue-600" />
                </div>
                <h3 className="text-sm sm:text-base lg:text-lg font-semibold text-gray-900">Tracking Information</h3>
              </div>
              <p className="text-xs sm:text-sm lg:text-base text-gray-700 font-medium">Tracking Number: {order.trackingNumber}</p>
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="p-3 sm:p-4 lg:p-6 border-t border-gray-100 bg-gray-50">
          <div className="flex flex-col sm:flex-row gap-2 sm:gap-3">
            <button 
              onClick={onPrint} 
              className="flex-1 sm:flex-none inline-flex items-center justify-center gap-1.5 px-3 py-2 bg-gray-100 text-gray-700 text-xs sm:text-sm font-medium rounded-lg hover:bg-gray-200 transition-colors"
            >
              <FaPrint className="w-3 h-3 sm:w-4 sm:h-4" />
              Print Receipt
            </button>
            
            {order.status === 'Pending' && (
              <button 
                onClick={() => onCancel(order._id)} 
                className="flex-1 sm:flex-none inline-flex items-center justify-center gap-1.5 px-3 py-2 bg-red-100 text-red-700 text-xs sm:text-sm font-medium rounded-lg hover:bg-red-200 transition-colors"
              >
                <FaTimes className="w-3 h-3 sm:w-4 sm:h-4" />
                Cancel Order
              </button>
            )}

            {order.status === 'Delivered' && !showReturnForm && (
              <button 
                onClick={() => setShowReturnForm(true)} 
                className="flex-1 sm:flex-none inline-flex items-center justify-center gap-1.5 px-3 py-2 bg-orange-100 text-orange-700 text-xs sm:text-sm font-medium rounded-lg hover:bg-orange-200 transition-colors"
              >
                <FaUndo className="w-3 h-3 sm:w-4 sm:h-4" />
                Request Return
              </button>
            )}

            {showReturnForm && (
              <div className="w-full space-y-3">
                <textarea
                  value={returnReason}
                  onChange={(e) => setReturnReason(e.target.value)}
                  placeholder="Please provide a reason for return..."
                  className="w-full p-3 text-xs sm:text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                  rows="3"
                />
                <div className="flex gap-2 sm:gap-3">
                  <button 
                    onClick={handleReturnSubmit} 
                    className="flex-1 inline-flex items-center justify-center gap-1.5 px-3 py-2 bg-orange-600 text-white text-xs sm:text-sm font-medium rounded-lg hover:bg-orange-700 transition-colors"
                  >
                    Submit Return Request
                  </button>
                  <button 
                    onClick={() => setShowReturnForm(false)} 
                    className="flex-1 inline-flex items-center justify-center gap-1.5 px-3 py-2 bg-gray-100 text-gray-700 text-xs sm:text-sm font-medium rounded-lg hover:bg-gray-200 transition-colors"
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
