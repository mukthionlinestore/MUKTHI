import React, { useState, useEffect } from 'react';
import axios from '../../config/axios';
import { useSettings } from '../../context/SettingsContext';
import { 
  FaEye, 
  FaEdit, 
  FaTrash, 
  FaSearch, 
  FaFilter, 
  FaDownload, 
  FaCheck, 
  FaTimes,
  FaTruck,
  FaBox,
  FaCheckCircle,
  FaExclamationTriangle,
  FaClock,
  FaUndo,
  FaPrint,
  FaEnvelope,
  FaPhone,
  FaMapMarkerAlt,
  FaCreditCard,
  FaMoneyBillWave,
  FaCalendarAlt,
  FaUser,
  FaShoppingCart,
  FaDollarSign,
  FaSort,
  FaSortUp,
  FaSortDown
} from 'react-icons/fa';
import { toast } from 'react-toastify';

const AdminOrders = () => {
  const { formatPrice } = useSettings();
  
  // Get default dates (last 7 days)
  const getDefaultDates = () => {
    const today = new Date();
    const sevenDaysAgo = new Date(today);
    sevenDaysAgo.setDate(today.getDate() - 7);
    
    return {
      dateFrom: sevenDaysAgo.toISOString().split('T')[0],
      dateTo: today.toISOString().split('T')[0]
    };
  };
  
  const [allOrders, setAllOrders] = useState([]); // Store all orders
  const [orders, setOrders] = useState([]); // Filtered orders for display
  const [loading, setLoading] = useState(true);
  const [selectedOrders, setSelectedOrders] = useState([]);
  const [filters, setFilters] = useState({
    status: '',
    search: '',
    ...getDefaultDates() // Set default dates to last 7 days
  });
  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalPages: 1,
    total: 0,
    limit: 10
  });
  const [sortConfig, setSortConfig] = useState({
    field: 'createdAt',
    direction: 'desc'
  });
  const [showOrderModal, setShowOrderModal] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [showStatusModal, setShowStatusModal] = useState(false);
  const [statusUpdate, setStatusUpdate] = useState({
    status: '',
    trackingNumber: '',
    notes: ''
  });

  // Fetch orders only when status filter or sort changes (not on search)
  useEffect(() => {
    fetchOrders();
  }, [filters.status, filters.dateFrom, filters.dateTo, sortConfig]);

  // Client-side search filtering
  useEffect(() => {
    if (!filters.search.trim()) {
      setOrders(allOrders);
      return;
    }

    const searchLower = filters.search.toLowerCase();
    const filtered = allOrders.filter(order => 
      order.orderNumber?.toLowerCase().includes(searchLower) ||
      order.user?.name?.toLowerCase().includes(searchLower) ||
      order.user?.email?.toLowerCase().includes(searchLower) ||
      order.shippingAddress?.phone?.includes(searchLower) ||
      order.status?.toLowerCase().includes(searchLower) ||
      order.paymentMethod?.toLowerCase().includes(searchLower)
    );
    
    setOrders(filtered);
  }, [filters.search, allOrders]);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams({
        page: 1,
        limit: 1000, // Fetch all orders for client-side filtering
        status: filters.status,
        dateFrom: filters.dateFrom,
        dateTo: filters.dateTo,
        sortBy: sortConfig.field,
        sortOrder: sortConfig.direction
      });

      const response = await axios.get(`/api/admin/orders?${params}`);
      setAllOrders(response.data.orders);
      setOrders(response.data.orders);
      setPagination(prev => ({
        ...prev,
        totalPages: response.data.totalPages,
        total: response.data.total
      }));
    } catch (error) {
      toast.error('Failed to load orders');
      console.error('Error fetching orders:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleStatusUpdate = async () => {
    try {
      if (selectedOrders.length === 0) {
        toast.error('Please select orders to update');
        return;
      }

      const response = await axios.put('/api/admin/orders/bulk/status', {
        orderIds: selectedOrders,
        ...statusUpdate
      });

      toast.success(response.data.message);
      setSelectedOrders([]);
      setShowStatusModal(false);
      setStatusUpdate({ status: '', trackingNumber: '', notes: '' });
      fetchOrders();
    } catch (error) {
      toast.error('Failed to update order status');
      console.error('Error updating order status:', error);
    }
  };

  const handleSingleStatusUpdate = async (orderId) => {
    try {
      const response = await axios.put(`/api/admin/orders/${orderId}/status`, statusUpdate);
      toast.success('Order status updated successfully');
      setShowStatusModal(false);
      setStatusUpdate({ status: '', trackingNumber: '', notes: '' });
      fetchOrders();
    } catch (error) {
      toast.error('Failed to update order status');
      console.error('Error updating order status:', error);
    }
  };

  const handlePaymentUpdate = async (orderId, isPaid) => {
    try {
      const response = await axios.put(`/api/admin/orders/${orderId}/payment`, { isPaid });
      toast.success('Payment status updated successfully');
      fetchOrders();
    } catch (error) {
      toast.error('Failed to update payment status');
      console.error('Error updating payment status:', error);
    }
  };

  const handleDeleteOrder = async (orderId) => {
    if (!window.confirm('Are you sure you want to delete this order? This action cannot be undone.')) {
      return;
    }

    try {
      await axios.delete(`/api/admin/orders/${orderId}`);
      toast.success('Order deleted successfully');
      fetchOrders();
    } catch (error) {
      toast.error('Failed to delete order');
      console.error('Error deleting order:', error);
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

  const getStatusBadgeClass = (status) => {
    switch (status?.toLowerCase()) {
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'processing': return 'bg-blue-100 text-blue-800';
      case 'shipped': return 'bg-purple-100 text-purple-800';
      case 'delivered': return 'bg-green-100 text-green-800';
      case 'cancelled': return 'bg-red-100 text-red-800';
      case 'returned': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
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

  const handleSort = (field) => {
    setSortConfig(prev => ({
      field,
      direction: prev.field === field && prev.direction === 'asc' ? 'desc' : 'asc'
    }));
  };

  // Admin notes functions
  const handleAdminNotesChange = (orderId, notes) => {
    console.log('handleAdminNotesChange called:', { orderId, notes });
    
    // Update both the orders array and selectedOrder if it's the same order
    setOrders(prev => prev.map(order => 
      order._id === orderId ? { ...order, adminNotes: notes } : order
    ));
    
    // Also update selectedOrder if it's the same order
    if (selectedOrder && selectedOrder._id === orderId) {
      setSelectedOrder(prev => ({ ...prev, adminNotes: notes }));
    }
  };

  const handleSaveAdminNotes = async (orderId) => {
    try {
      const order = orders.find(o => o._id === orderId);
      if (!order) return;

      const response = await axios.put(`/api/orders/${orderId}/admin-notes`, {
        adminNotes: order.adminNotes
      });

      toast.success('Admin notes saved successfully');
      fetchOrders(); // Refresh to get updated data
    } catch (error) {
      toast.error('Failed to save admin notes');
      console.error('Error saving admin notes:', error);
    }
  };

  const handleBulkSelect = (orderId) => {
    const order = orders.find(o => o._id === orderId);
    // Prevent selecting cancelled orders
    if (order && order.status === 'Cancelled') {
      return;
    }
    
    setSelectedOrders(prev => 
      prev.includes(orderId) 
        ? prev.filter(id => id !== orderId)
        : [...prev, orderId]
    );
  };

  const handleSelectAll = () => {
    if (selectedOrders.length === orders.length) {
      setSelectedOrders([]);
    } else {
      // Only select non-cancelled orders
      const nonCancelledOrderIds = orders
        .filter(order => order.status !== 'Cancelled')
        .map(order => order._id);
      setSelectedOrders(nonCancelledOrderIds);
    }
  };

  // Check if any selected orders are cancelled
  const hasCancelledOrders = selectedOrders.some(orderId => {
    const order = orders.find(o => o._id === orderId);
    return order && order.status === 'Cancelled';
  });

  const exportOrders = () => {
    const csvContent = [
      ['Order ID', 'Customer', 'Email', 'Phone', 'Status', 'Total', 'Date', 'Payment Status'],
      ...orders.map(order => [
        order.orderNumber,
        order.user?.name || 'N/A',
        order.user?.email || 'N/A',
        order.shippingAddress?.phone || 'N/A',
        order.status,
        `${formatPrice(order.total)}`,
        new Date(order.createdAt).toLocaleDateString(),
        order.isPaid ? 'Paid' : 'Unpaid'
      ])
    ].map(row => row.join(',')).join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `orders-${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
  };

  if (loading) {
    return (
      <div className="min-h-screen ">
        <div className="px-3 py-4 sm:px-6 lg:px-8 sm:py-6">
          <div className="flex items-center justify-center min-h-[60vh]">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
              <p className="text-gray-600 text-sm sm:text-base">Loading orders...</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen ">
      <div className="px-2 py-3 sm:px-4 lg:px-6 xl:px-8 sm:py-4 lg:py-6">
        {/* Header Section */}
        <div className="mb-4 sm:mb-6 lg:mb-8">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 sm:gap-4">
            <div>
              <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-900 mb-1">Order Management</h1>
              <p className="text-xs sm:text-sm lg:text-base text-gray-600">Manage and track customer orders</p>
          </div>
            <div className="flex flex-row gap-2 sm:gap-3">
            <button 
                className="inline-flex items-center justify-center px-3 py-2 sm:px-4 sm:py-2.5 bg-white border border-gray-200 rounded-lg sm:rounded-xl text-xs sm:text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors shadow-sm"
              onClick={exportOrders}
              disabled={orders.length === 0}
            >
                <FaDownload className="w-3 h-3 sm:w-4 sm:h-4 mr-1.5 sm:mr-2" />
                <span className="hidden sm:inline">Export CSV</span>
                <span className="sm:hidden">Export</span>
            </button>
            <button 
                className="inline-flex items-center justify-center gap-2 px-3 py-2 sm:px-4 sm:py-2.5 text-xs sm:text-sm font-semibold text-white bg-gradient-to-r from-gray-700 via-gray-800 to-black hover:from-gray-800 hover:via-gray-900 hover:to-gray-800 rounded-xl sm:rounded-2xl transition-all duration-200 hover:scale-105 shadow-lg hover:shadow-xl focus:outline-none focus:ring-2 focus:ring-gray-500/20 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
              onClick={() => setShowStatusModal(true)}
              disabled={selectedOrders.length === 0 || hasCancelledOrders}
            >
                <FaEdit className="w-3 h-3 sm:w-4 sm:h-4" />
                <span className="hidden sm:inline">Update Status ({selectedOrders.length})</span>
                <span className="sm:hidden">Update ({selectedOrders.length})</span>
                <div className="w-3 h-3 sm:w-4 sm:h-4 bg-white rounded-full flex items-center justify-center">
                  <svg className="w-1.5 h-1.5 sm:w-2 sm:h-2 text-black" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </div>
            </button>
            </div>
          </div>
        </div>

        {/* Filters Section */}
        <div className="bg-white rounded-lg sm:rounded-xl lg:rounded-2xl shadow-sm border border-gray-100 p-3 sm:p-4 lg:p-6 mb-4 sm:mb-6 lg:mb-8">
          <div className="space-y-2 sm:space-y-3 lg:space-y-4">
            {/* Search and Status - First Row */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 sm:gap-3 lg:gap-4">
              {/* Search */}
              <div className="relative">
                <FaSearch className="absolute left-2.5 sm:left-3 top-1/2 -translate-y-1/2 text-gray-400 w-3 h-3 sm:w-4 sm:h-4" />
                  <input
                    type="text"
                  placeholder="Search orders..."
                    value={filters.search}
                    onChange={(e) => setFilters(prev => ({ ...prev, search: e.target.value }))}
                  className="w-full pl-8 sm:pl-10 pr-3 sm:pr-4 py-2 sm:py-2.5 lg:py-3 border border-gray-200 rounded-lg text-xs sm:text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                  />
              </div>

              {/* Status Filter */}
              <div>
                <select
                  value={filters.status}
                  onChange={(e) => setFilters(prev => ({ ...prev, status: e.target.value }))}
                  className="w-full px-3 sm:px-4 py-2 sm:py-2.5 lg:py-3 border border-gray-200 rounded-lg text-xs sm:text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors bg-white"
                >
                  <option value="">All Statuses</option>
                  <option value="Pending">Pending</option>
                  <option value="Processing">Processing</option>
                  <option value="Shipped">Shipped</option>
                  <option value="Delivered">Delivered</option>
                  <option value="Cancelled">Cancelled</option>
                  <option value="Returned">Returned</option>
                </select>
              </div>
            </div>

            {/* Date Filters - Second Row (2 columns on mobile) */}
            <div className="grid grid-cols-2 gap-2 sm:gap-3 lg:gap-4">
              {/* Date From */}
              <div>
                <input
                  type="date"
                  value={filters.dateFrom}
                  onChange={(e) => setFilters(prev => ({ ...prev, dateFrom: e.target.value }))}
                  className="w-full px-2 sm:px-4 py-2 sm:py-2.5 lg:py-3 border border-gray-200 rounded-lg text-xs sm:text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                  placeholder="From"
                />
              </div>

              {/* Date To */}
              <div>
                <input
                  type="date"
                  value={filters.dateTo}
                  onChange={(e) => setFilters(prev => ({ ...prev, dateTo: e.target.value }))}
                  className="w-full px-2 sm:px-4 py-2 sm:py-2.5 lg:py-3 border border-gray-200 rounded-lg text-xs sm:text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                  placeholder="To"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Orders List */}
        <div className="space-y-3 sm:space-y-4">
          {/* Select All */}
          {orders.length > 0 && (
            <div className="flex items-center justify-between bg-white rounded-lg sm:rounded-xl lg:rounded-2xl shadow-sm border border-gray-100 p-3 sm:p-4">
              <div className="flex items-center">
                  <input
                    type="checkbox"
                    checked={selectedOrders.length === orders.length}
                    onChange={handleSelectAll}
                    disabled={orders.every(order => order.status === 'Cancelled')}
                    className={`w-3 h-3 sm:w-4 sm:h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500 ${
                      orders.every(order => order.status === 'Cancelled') ? 'opacity-50 cursor-not-allowed' : ''
                    }`}
                  />
                <span className="ml-2 sm:ml-3 text-xs sm:text-sm font-medium text-gray-700">
                  {selectedOrders.length} of {orders.length} selected
                </span>
              </div>
              <div className="text-xs sm:text-sm text-gray-500">
                Total: {pagination.total} orders
                {orders.some(order => order.status === 'Cancelled') && (
                  <span className="ml-2 text-red-500">
                    • Cancelled orders cannot be selected for updates
                  </span>
                )}
              </div>
            </div>
          )}

          {/* Orders Grid */}
          {orders.length === 0 ? (
            <div className="bg-white rounded-lg sm:rounded-xl lg:rounded-2xl shadow-sm border border-gray-100 p-6 sm:p-8 text-center">
              <div className="w-12 h-12 sm:w-16 sm:h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-3 sm:mb-4">
                <FaShoppingCart className="w-6 h-6 sm:w-8 sm:h-8 text-gray-400" />
              </div>
              <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-1 sm:mb-2">No orders found</h3>
              <p className="text-xs sm:text-sm text-gray-600">Try adjusting your filters or search terms.</p>
            </div>
          ) : (
            <div className="grid gap-3 sm:gap-4">
              {orders.map((order) => (
                <div key={order._id} className="bg-white rounded-lg sm:rounded-xl lg:rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                  {/* Order Header */}
                  <div className="p-3 sm:p-4 lg:p-6 border-b border-gray-100">
                    <div className="flex items-start justify-between">
                      <div className="flex items-center space-x-2 sm:space-x-3">
                    <input
                      type="checkbox"
                      checked={selectedOrders.includes(order._id)}
                      onChange={() => handleBulkSelect(order._id)}
                      disabled={order.status === 'Cancelled'}
                      className={`w-3 h-3 sm:w-4 sm:h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500 ${
                        order.status === 'Cancelled' ? 'opacity-50 cursor-not-allowed' : ''
                      }`}
                    />
                        <div>
                          <h3 className="text-sm sm:text-base lg:text-lg font-semibold text-gray-900">
                            Order #{order.orderNumber || order._id.slice(-6)}
                          </h3>
                          <p className="text-xs sm:text-sm text-gray-600">
                            {order.user?.name || 'Guest User'} • {order.user?.email}
                          </p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-base sm:text-lg lg:text-xl font-bold text-gray-900">
                          {formatPrice(order.total)}
                        </p>
                        <div className={`inline-flex items-center px-1.5 py-0.5 sm:px-2 sm:py-1 rounded-full text-xs font-medium mt-1 ${getStatusBadgeClass(order.status)}`}>
                          {getStatusIcon(order.status)}
                          <span className="ml-1">{order.status}</span>
                        </div>
                        {order.status === 'Cancelled' && order.cancelledBy && (
                          <div className="mt-1 text-xs text-red-600">
                            Cancelled by {order.cancelledBy === 'User' ? 'Customer' : order.cancelledBy}
                            {order.cancelledAt && ` on ${new Date(order.cancelledAt).toLocaleDateString()}`}
                          </div>
                        )}
                      </div>
                    </div>
                    </div>

                  {/* Order Details */}
                  <div className="p-3 sm:p-4 lg:p-6">
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2 sm:gap-3 lg:gap-4 mb-3 sm:mb-4">
                      <div className="flex items-center space-x-1.5 sm:space-x-2">
                        <FaCalendarAlt className="w-3 h-3 sm:w-4 sm:h-4 text-gray-400" />
                        <span className="text-xs sm:text-sm text-gray-600">
                      {new Date(order.createdAt).toLocaleDateString()}
                    </span>
                      </div>
                      <div className="flex items-center space-x-1.5 sm:space-x-2">
                        <FaPhone className="w-3 h-3 sm:w-4 sm:h-4 text-gray-400" />
                        <span className="text-xs sm:text-sm text-gray-600">
                          {order.shippingAddress?.phone || 'N/A'}
                        </span>
                      </div>
                      <div className="flex items-center space-x-1.5 sm:space-x-2">
                        <FaMapMarkerAlt className="w-3 h-3 sm:w-4 sm:h-4 text-gray-400" />
                        <span className="text-xs sm:text-sm text-gray-600 truncate">
                          {order.shippingAddress?.city || 'N/A'}
                        </span>
                      </div>
                      <div className="flex items-center space-x-1.5 sm:space-x-2">
                        <FaCreditCard className="w-3 h-3 sm:w-4 sm:h-4 text-gray-400" />
                        <span className={`text-xs sm:text-sm font-medium ${order.isPaid ? 'text-green-600' : 'text-red-600'}`}>
                      {order.isPaid ? 'Paid' : 'Unpaid'}
                    </span>
                      </div>
                    </div>

                    {/* Order Items Preview */}
                    <div className="mb-3 sm:mb-4">
                      <h4 className="text-xs sm:text-sm font-medium text-gray-900 mb-1.5 sm:mb-2">Items ({order.items?.length || 0})</h4>
                      <div className="space-y-1.5 sm:space-y-2">
                        {order.items?.slice(0, 2).map((item, index) => (
                          <div key={index} className="flex items-center justify-between text-xs sm:text-sm">
                            <span className="text-gray-600 truncate">{item.product?.name || 'Product'}</span>
                            <span className="text-gray-900 font-medium">x{item.quantity}</span>
                          </div>
                        ))}
                        {order.items?.length > 2 && (
                          <p className="text-xs text-gray-500">+{order.items.length - 2} more items</p>
                        )}
                      </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex flex-wrap gap-1.5 sm:gap-2">
                      <button 
                        onClick={() => {
                          setSelectedOrder(order);
                          setShowOrderModal(true);
                        }}
                        className="inline-flex items-center px-2 py-1.5 sm:px-3 sm:py-2 bg-blue-50 text-blue-700 rounded-lg text-xs sm:text-sm font-medium hover:bg-blue-100 transition-colors"
                      >
                        <FaEye className="w-3 h-3 sm:w-4 sm:h-4 mr-1" />
                        View
                      </button>
                      
                      {/* Only show Update and Payment buttons for non-cancelled orders */}
                      {order.status !== 'Cancelled' && (
                        <>
                          <button 
                            onClick={() => {
                              setSelectedOrder(order);
                              setShowStatusModal(true);
                            }}
                            className="inline-flex items-center px-2 py-1.5 sm:px-3 sm:py-2 bg-green-50 text-green-700 rounded-lg text-xs sm:text-sm font-medium hover:bg-green-100 transition-colors"
                          >
                            <FaEdit className="w-3 h-3 sm:w-4 sm:h-4 mr-1" />
                            Update
                          </button>
                          <button 
                            onClick={() => handlePaymentUpdate(order._id, !order.isPaid)}
                            className={`inline-flex items-center px-2 py-1.5 sm:px-3 sm:py-2 rounded-lg text-xs sm:text-sm font-medium transition-colors ${
                              order.isPaid 
                                ? 'bg-red-50 text-red-700 hover:bg-red-100' 
                                : 'bg-green-50 text-green-700 hover:bg-green-100'
                            }`}
                          >
                            {order.isPaid ? <FaTimes className="w-3 h-3 sm:w-4 sm:h-4 mr-1" /> : <FaCheck className="w-3 h-3 sm:w-4 sm:h-4 mr-1" />}
                            {order.isPaid ? 'Mark Unpaid' : 'Mark Paid'}
                          </button>
                        </>
                      )}
                      
                      <button 
                        onClick={() => handleDeleteOrder(order._id)}
                        className="inline-flex items-center px-2 py-1.5 sm:px-3 sm:py-2 bg-red-50 text-red-700 rounded-lg text-xs sm:text-sm font-medium hover:bg-red-100 transition-colors"
                      >
                        <FaTrash className="w-3 h-3 sm:w-4 sm:h-4 mr-1" />
                        Delete
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Pagination */}
        {pagination.totalPages > 1 && (
          <div className="mt-6 sm:mt-8 flex items-center justify-center">
            <div className="flex items-center space-x-1.5 sm:space-x-2">
            <button
                onClick={() => setPagination(prev => ({ ...prev, currentPage: prev.currentPage - 1 }))}
              disabled={pagination.currentPage === 1}
                className="px-2 py-1.5 sm:px-3 sm:py-2 text-xs sm:text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Previous
            </button>
              <span className="px-2 py-1.5 sm:px-3 sm:py-2 text-xs sm:text-sm text-gray-700">
              Page {pagination.currentPage} of {pagination.totalPages} 
            </span>
            <button
                onClick={() => setPagination(prev => ({ ...prev, currentPage: prev.currentPage + 1 }))}
              disabled={pagination.currentPage === pagination.totalPages}
                className="px-2 py-1.5 sm:px-3 sm:py-2 text-xs sm:text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Next
            </button>
            </div>
          </div>
        )}
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
          onStatusUpdate={handleSingleStatusUpdate}
          onPaymentUpdate={handlePaymentUpdate}
          onAdminNotesChange={handleAdminNotesChange}
          onSaveAdminNotes={handleSaveAdminNotes}
        />
      )}

      {/* Status Update Modal */}
      {showStatusModal && (
        <StatusUpdateModal
          order={selectedOrder}
          statusUpdate={statusUpdate}
          setStatusUpdate={setStatusUpdate}
          onClose={() => {
            setShowStatusModal(false);
            setSelectedOrder(null);
            setStatusUpdate({ status: '', trackingNumber: '', notes: '' });
          }}
          onSubmit={selectedOrder ? handleSingleStatusUpdate : handleStatusUpdate}
          isBulk={!selectedOrder}
          selectedCount={selectedOrders.length}
        />
      )}
    </div>
  );
};

// Order Details Modal Component
const OrderDetailsModal = ({ order, formatPrice, onClose, onStatusUpdate, onPaymentUpdate, onAdminNotesChange, onSaveAdminNotes }) => {
  const getStatusBadgeClass = (status) => {
    switch (status?.toLowerCase()) {
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'processing': return 'bg-blue-100 text-blue-800';
      case 'shipped': return 'bg-purple-100 text-purple-800';
      case 'delivered': return 'bg-green-100 text-green-800';
      case 'cancelled': return 'bg-red-100 text-red-800';
      case 'returned': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
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

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-2 sm:p-4 z-50" onClick={onClose}>
      <div className="bg-white rounded-xl sm:rounded-2xl shadow-2xl max-w-xs sm:max-w-2xl lg:max-w-4xl w-full max-h-[90vh] overflow-hidden flex flex-col" onClick={(e) => e.stopPropagation()}>
        {/* Modal Header */}
        <div className="p-3 sm:p-4 lg:p-6 border-b border-gray-100 bg-gradient-to-r from-blue-50 to-indigo-50">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2 sm:space-x-3">
              <div className="w-8 h-8 sm:w-10 sm:h-10 lg:w-12 lg:h-12 bg-blue-100 rounded-lg sm:rounded-xl flex items-center justify-center">
                <FaShoppingCart className="w-4 h-4 sm:w-5 sm:h-5 lg:w-6 lg:h-6 text-blue-600" />
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
          <div className="bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl sm:rounded-2xl p-3 sm:p-4 lg:p-6 text-white">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-2 sm:space-y-3 lg:space-y-0">
              <div className="flex items-center space-x-2 sm:space-x-3">
                <div className={`inline-flex items-center px-2 py-1 sm:px-3 sm:py-1.5 rounded-full text-xs font-medium bg-white/20 backdrop-blur-sm ${getStatusBadgeClass(order.status)}`}>
                  {getStatusIcon(order.status)}
                  <span className="ml-1 sm:ml-2">{order.status}</span>
                </div>
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
                <span className="text-xs sm:text-sm lg:text-base font-semibold text-gray-900">{order.shippingCost === 0 ? 'Free' : formatPrice(order.shippingCost)}</span>
              </div>
              <div className="flex justify-between items-center py-1 sm:py-2">
                <span className="text-xs sm:text-sm lg:text-base text-gray-600">Tax</span>
                <span className="text-xs sm:text-sm lg:text-base font-semibold text-gray-900">{formatPrice(order.tax)}</span>
              </div>
              <div className="flex justify-between items-center pt-2 sm:pt-3 border-t border-gray-200">
                <span className="text-sm sm:text-base lg:text-lg font-bold text-gray-900">Total</span>
                <span className="text-base sm:text-lg lg:text-xl font-bold text-blue-600">{formatPrice(order.total)}</span>
              </div>
            </div>
          </div>

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

          {/* Notes */}
          {order.notes && (
            <div className="bg-yellow-50 rounded-xl sm:rounded-2xl border border-yellow-100 p-3 sm:p-4 lg:p-6">
              <div className="flex items-center space-x-2 sm:space-x-3 mb-2 sm:mb-3">
                <div className="w-6 h-6 sm:w-8 sm:h-8 lg:w-10 lg:h-10 bg-yellow-100 rounded-lg sm:rounded-xl flex items-center justify-center">
                  <FaEnvelope className="w-3 h-3 sm:w-4 sm:h-4 lg:w-5 lg:h-5 text-yellow-600" />
                </div>
                <h3 className="text-sm sm:text-base lg:text-lg font-semibold text-gray-900">Notes</h3>
              </div>
              <p className="text-xs sm:text-sm lg:text-base text-gray-700">{order.notes}</p>
            </div>
          )}

          {/* Cancellation Information */}
          {order.status === 'Cancelled' && (
            <div className="bg-red-50 border border-red-200 rounded-xl sm:rounded-2xl p-3 sm:p-4 lg:p-6">
              <div className="flex items-center space-x-2 sm:space-x-3 mb-3 sm:mb-4">
                <div className="w-6 h-6 sm:w-8 sm:h-8 lg:w-10 lg:h-10 bg-red-100 rounded-lg sm:rounded-xl flex items-center justify-center">
                  <FaTimes className="w-3 h-3 sm:w-4 sm:w-4 lg:w-5 lg:h-5 text-red-600" />
                </div>
                <div>
                  <h3 className="text-sm sm:text-base lg:text-lg font-semibold text-red-900">Cancellation Details</h3>
                  <p className="text-xs text-red-600 mt-1">This order cannot be modified - view only</p>
                </div>
              </div>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 mb-3 sm:mb-4">
                <div className="space-y-1">
                  <p className="text-xs sm:text-sm text-red-600 font-medium">Cancelled By</p>
                  <p className="text-xs sm:text-sm lg:text-base font-semibold text-red-900">
                    {order.cancelledBy === 'User' ? 'Customer' : order.cancelledBy || 'N/A'}
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
                <div className="space-y-1 mb-3 sm:mb-4">
                  <p className="text-xs sm:text-sm text-red-600 font-medium">Cancellation Reason</p>
                  <p className="text-xs sm:text-sm lg:text-base text-red-900 bg-red-100 p-2 sm:p-3 rounded-lg">
                    {order.cancellationReason}
                  </p>
                </div>
              )}
              
              {/* Admin Notes Section */}
              <div className="space-y-2 sm:space-y-3">
                <div className="flex items-center justify-between">
                  <label className="block text-xs sm:text-sm font-semibold text-red-700">Admin Notes</label>
                  <button
                    onClick={() => onSaveAdminNotes(order._id)}
                    className="px-2 sm:px-3 py-1 sm:py-2 bg-red-600 text-white text-xs rounded-lg hover:bg-red-700 transition-colors duration-200"
                  >
                    Save Notes
                  </button>
                </div>
                <textarea
                  value={order.adminNotes || ''}
                  onChange={(e) => onAdminNotesChange(order._id, e.target.value)}
                  placeholder="Add admin notes about this cancellation (optional)"
                  rows="3"
                  disabled={false}
                  readOnly={false}
                  className="w-full px-3 py-2 border border-red-200 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-colors duration-200 resize-none text-xs sm:text-sm bg-white"
                />
                <p className="text-xs text-red-500">Add internal notes about this cancellation for team reference</p>
              </div>
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="p-3 sm:p-4 lg:p-6 border-t border-gray-100 bg-gray-50">
          <div className="flex flex-col sm:flex-row gap-2 sm:gap-3">
            <button
              onClick={onClose}
              className="flex-1 px-3 py-2 sm:px-4 sm:py-3 lg:py-4 bg-white border border-gray-200 text-gray-700 rounded-lg sm:rounded-xl text-xs sm:text-sm font-medium hover:bg-gray-50 transition-all duration-200 shadow-sm"
            >
              Close
            </button>
            
            {/* Only show payment update button for non-cancelled orders */}
            {order.status !== 'Cancelled' && (
              <button 
                onClick={() => onPaymentUpdate(order._id, !order.isPaid)}
                className={`flex-1 px-3 py-2 sm:px-4 sm:py-3 lg:py-4 rounded-lg sm:rounded-xl text-xs sm:text-sm font-medium transition-all duration-200 shadow-sm ${
                  order.isPaid 
                    ? 'bg-red-500 text-white hover:bg-red-600' 
                    : 'bg-green-500 text-white hover:bg-green-600'
                }`}
              >
                {order.isPaid ? 'Mark as Unpaid' : 'Mark as Paid'}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

// Status Update Modal Component
const StatusUpdateModal = ({ order, statusUpdate, setStatusUpdate, onClose, onSubmit, isBulk, selectedCount }) => {
  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-2 sm:p-4 z-50" onClick={onClose}>
      <div className="bg-white rounded-xl sm:rounded-2xl shadow-2xl max-w-xs sm:max-w-md w-full max-h-[90vh] overflow-hidden flex flex-col" onClick={(e) => e.stopPropagation()}>
        {/* Modal Header */}
        <div className="p-3 sm:p-4 border-b border-gray-100 bg-gradient-to-r from-green-50 to-blue-50">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2 sm:space-x-3">
              <div className="w-8 h-8 sm:w-10 sm:h-10 bg-green-100 rounded-lg sm:rounded-xl flex items-center justify-center">
                <FaEdit className="w-4 h-4 sm:w-5 sm:h-5 text-green-600" />
              </div>
              <div>
                <h2 className="text-sm sm:text-lg font-bold text-gray-900">
                  {isBulk ? `Update ${selectedCount} Orders` : 'Update Status'}
                </h2>
                {!isBulk && order && (
                  <p className="text-xs text-gray-600">#{order.orderNumber || order._id.slice(-6)}</p>
                )}
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-1.5 sm:p-2 text-gray-400 hover:text-gray-600 hover:bg-white rounded-lg sm:rounded-xl transition-all duration-200"
            >
              <FaTimes className="w-3 h-3 sm:w-4 sm:h-4" />
            </button>
          </div>
        </div>
        
        {/* Modal Body */}
        <div className="flex-1 overflow-y-auto p-3 sm:p-4 space-y-3 sm:space-y-4">
          {/* Status Selection */}
          <div className="space-y-1.5 sm:space-y-2">
            <label className="block text-xs sm:text-sm font-semibold text-gray-700">Order Status</label>
            <select
              value={statusUpdate.status}
              onChange={(e) => setStatusUpdate(prev => ({ ...prev, status: e.target.value }))}
              className="w-full px-3 py-2 sm:px-4 sm:py-3 border border-gray-200 rounded-lg sm:rounded-xl text-xs sm:text-sm focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all duration-200 bg-white"
            >
              <option value="">Select Status</option>
              <option value="Pending">🕐 Pending</option>
              <option value="Processing">📦 Processing</option>
              <option value="Shipped">🚚 Shipped</option>
              <option value="Delivered">✅ Delivered</option>
              <option value="Cancelled">❌ Cancelled</option>
              <option value="Returned">↩️ Returned</option>
            </select>
          </div>

          {/* Tracking Number */}
          <div className="space-y-1.5 sm:space-y-2">
            <label className="block text-xs sm:text-sm font-semibold text-gray-700">Tracking Number</label>
            <div className="relative">
              <FaTruck className="absolute left-2.5 sm:left-3 top-1/2 -translate-y-1/2 text-gray-400 w-3 h-3 sm:w-4 sm:h-4" />
            <input
              type="text"
              value={statusUpdate.trackingNumber}
              onChange={(e) => setStatusUpdate(prev => ({ ...prev, trackingNumber: e.target.value }))}
                placeholder="Enter tracking number (optional)"
                className="w-full pl-8 sm:pl-10 pr-3 sm:pr-4 py-2 sm:py-3 border border-gray-200 rounded-lg sm:rounded-xl text-xs sm:text-sm focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all duration-200"
            />
            </div>
            <p className="text-xs text-gray-500">Leave empty if not available</p>
          </div>

          {/* Notes */}
          <div className="space-y-1.5 sm:space-y-2">
            <label className="block text-xs sm:text-sm font-semibold text-gray-700">Notes</label>
            <div className="relative">
              <FaEnvelope className="absolute left-2.5 sm:left-3 top-2 sm:top-3 text-gray-400 w-3 h-3 sm:w-4 sm:h-4" />
            <textarea
              value={statusUpdate.notes}
              onChange={(e) => setStatusUpdate(prev => ({ ...prev, notes: e.target.value }))}
                placeholder="Add any notes about this order (optional)"
                rows="2"
                className="w-full pl-8 sm:pl-10 pr-3 sm:pr-4 py-2 sm:py-3 border border-gray-200 rounded-lg sm:rounded-xl text-xs sm:text-sm focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all duration-200 resize-none"
            />
            </div>
            <p className="text-xs text-gray-500">Add internal notes for reference</p>
          </div>

          {/* Current Status Display */}
          {!isBulk && order && (
            <div className="bg-gray-50 rounded-lg sm:rounded-xl p-3 sm:p-4">
              <div className="flex items-center justify-between">
                <span className="text-xs sm:text-sm font-medium text-gray-600">Current Status:</span>
                <span className="text-xs sm:text-sm font-semibold text-gray-900">{order.status}</span>
              </div>
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="p-3 sm:p-4 border-t border-gray-100 bg-gray-50">
          <div className="flex flex-col sm:flex-row gap-2 sm:gap-3">
            <button
              onClick={onClose}
              className="flex-1 px-3 py-2 sm:px-4 sm:py-3 bg-white border border-gray-200 text-gray-700 rounded-lg sm:rounded-xl text-xs sm:text-sm font-medium hover:bg-gray-50 transition-all duration-200 shadow-sm"
            >
              Cancel
            </button>
          <button 
              className="flex-1 px-3 py-2 sm:px-4 sm:py-3 bg-green-500 text-white rounded-lg sm:rounded-xl text-xs sm:text-sm font-medium hover:bg-green-600 transition-all duration-200 shadow-sm disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-green-500"
            onClick={() => onSubmit(order?._id)}
            disabled={!statusUpdate.status}
          >
            Update Status
          </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminOrders;
