import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from '../config/axios';
import { useAuth } from '../context/AuthContext';
import { useSettings } from '../context/SettingsContext';
import { 
  FaShoppingBag, 
  FaEye, 
  FaDownload, 
  FaTimes, 
  FaUndo,
  FaSearch,
  FaFilter,
  FaClock,
  FaBox,
  FaTruck,
  FaCheckCircle,
  FaExclamationTriangle,
  FaCalendarAlt,
  FaDollarSign
} from 'react-icons/fa';
import { toast } from 'react-toastify';

const UserOrders = () => {
  const { isAuthenticated } = useAuth();
  const { formatPrice } = useSettings();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState(null);
  const [filters, setFilters] = useState({
    status: 'all',
    search: '',
    dateRange: 'all'
  });
  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalPages: 1,
    totalOrders: 0
  });

  useEffect(() => {
    if (isAuthenticated) {
      fetchOrders();
      fetchStats();
    }
  }, [isAuthenticated, filters, pagination.currentPage]);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams({
        page: pagination.currentPage.toString(),
        limit: '10'
      });

      if (filters.status !== 'all') params.append('status', filters.status);
      if (filters.search) params.append('search', filters.search);

      const response = await axios.get(`/api/orders?${params}`);
      setOrders(response.data.orders);
      setPagination({
        currentPage: response.data.currentPage,
        totalPages: response.data.totalPages,
        totalOrders: response.data.totalOrders
      });
    } catch (error) {
      console.error('Error fetching orders:', error);
      toast.error('Failed to load orders');
    } finally {
      setLoading(false);
    }
  };

  const fetchStats = async () => {
    try {
      const response = await axios.get('/api/orders/user/stats');
      setStats(response.data);
    } catch (error) {
      console.error('Error fetching stats:', error);
    }
  };

  const handleFilterChange = (key, value) => {
    setFilters(prev => ({ ...prev, [key]: value }));
    setPagination(prev => ({ ...prev, currentPage: 1 }));
  };

  const handlePageChange = (page) => {
    setPagination(prev => ({ ...prev, currentPage: page }));
  };

  const cancelOrder = async (orderId) => {
    if (!window.confirm('Are you sure you want to cancel this order?')) return;

    try {
      await axios.post(`/api/orders/${orderId}/cancel`);
      toast.success('Order cancelled successfully');
      fetchOrders();
    } catch (error) {
      console.error('Error cancelling order:', error);
      toast.error(error.response?.data?.message || 'Failed to cancel order');
    }
  };

  const requestReturn = async (orderId) => {
    const reason = window.prompt('Please provide a reason for return:');
    if (!reason) return;

    try {
      await axios.post(`/api/orders/${orderId}/return`, { returnReason: reason });
      toast.success('Return request submitted successfully');
      fetchOrders();
    } catch (error) {
      console.error('Error requesting return:', error);
      toast.error(error.response?.data?.message || 'Failed to request return');
    }
  };

  const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case 'pending': return 'text-yellow-700 bg-yellow-100';
      case 'processing': return 'text-blue-700 bg-blue-100';
      case 'shipped': return 'text-purple-700 bg-purple-100';
      case 'delivered': return 'text-green-700 bg-green-100';
      case 'cancelled': return 'text-red-700 bg-red-100';
      case 'returned': return 'text-gray-700 bg-gray-100';
      default: return 'text-gray-700 bg-gray-100';
    }
  };

  const getStatusIcon = (status) => {
    switch (status?.toLowerCase()) {
      case 'pending': return <FaClock />;
      case 'processing': return <FaBox />;
      case 'shipped': return <FaTruck />;
      case 'delivered': return <FaCheckCircle />;
      case 'cancelled': return <FaExclamationTriangle />;
      case 'returned': return <FaUndo />;
      default: return <FaClock />;
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center px-4">
        <div className="text-center bg-white rounded-xl shadow-sm p-8 max-w-md">
          <FaShoppingBag className="text-4xl text-gray-400 mx-auto mb-4" />
          <h2 className="text-xl font-semibold mb-4">Please log in</h2>
          <p className="text-gray-600 mb-6">You need to be logged in to view your orders</p>
          <Link to="/login" className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700">
            Log In
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">My Orders</h1>
          <p className="text-gray-600">Track and manage all your orders</p>
        </div>

        {/* Stats Cards */}
        {stats && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div className="bg-white rounded-xl shadow-sm p-6">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
                  <FaShoppingBag className="text-blue-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-500">Total Orders</p>
                  <p className="text-2xl font-bold">{stats.totalOrders}</p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-sm p-6">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center">
                  <FaDollarSign className="text-green-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-500">Total Spent</p>
                  <p className="text-2xl font-bold">{formatPrice(stats.totalSpent)}</p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-sm p-6">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center">
                  <FaTruck className="text-purple-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-500">Delivered</p>
                  <p className="text-2xl font-bold">
                    {stats.ordersByStatus?.find(s => s._id === 'Delivered')?.count || 0}
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Filters */}
        <div className="bg-white rounded-xl shadow-sm p-6 mb-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <FaFilter className="inline mr-2" />
                Status Filter
              </label>
              <select
                value={filters.status}
                onChange={(e) => handleFilterChange('status', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="all">All Orders</option>
                <option value="Pending">Pending</option>
                <option value="Processing">Processing</option>
                <option value="Shipped">Shipped</option>
                <option value="Delivered">Delivered</option>
                <option value="Cancelled">Cancelled</option>
                <option value="Returned">Returned</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <FaSearch className="inline mr-2" />
                Search Orders
              </label>
              <input
                type="text"
                value={filters.search}
                onChange={(e) => handleFilterChange('search', e.target.value)}
                placeholder="Search by order number..."
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <FaCalendarAlt className="inline mr-2" />
                Date Range
              </label>
              <select
                value={filters.dateRange}
                onChange={(e) => handleFilterChange('dateRange', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="all">All Time</option>
                <option value="week">Last Week</option>
                <option value="month">Last Month</option>
                <option value="year">Last Year</option>
              </select>
            </div>
          </div>
        </div>

        {/* Orders List */}
        <div className="bg-white rounded-xl shadow-sm overflow-hidden">
          <div className="px-6 py-4 border-b">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-semibold">
                Orders ({pagination.totalOrders})
              </h2>
            </div>
          </div>

          {loading ? (
            <div className="flex items-center justify-center py-12">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
              <span className="ml-3">Loading orders...</span>
            </div>
          ) : orders.length === 0 ? (
            <div className="text-center py-12">
              <FaShoppingBag className="text-4xl text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No orders found</h3>
              <p className="text-gray-600 mb-6">
                {filters.status !== 'all' || filters.search 
                  ? 'Try adjusting your filters or search terms'
                  : "You haven't placed any orders yet"}
              </p>
              <Link 
                to="/" 
                className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700"
              >
                Start Shopping
              </Link>
            </div>
          ) : (
            <div className="divide-y">
              {orders.map((order) => (
                <div key={order._id} className="p-6">
                  <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                    {/* Order Info */}
                    <div className="flex-1">
                      <div className="flex items-start gap-4">
                        <div className="w-16 h-16 bg-gray-100 rounded-lg overflow-hidden flex-shrink-0">
                          <img
                            src={order.items[0]?.product?.images?.[0] || '/placeholder-image.jpg'}
                            alt="Order"
                            className="w-full h-full object-cover"
                          />
                        </div>
                        
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-3 mb-2">
                            <h3 className="font-semibold text-lg">
                              Order #{order.orderNumber}
                            </h3>
                            <span className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(order.status)}`}>
                              {getStatusIcon(order.status)}
                              {order.status}
                            </span>
                          </div>
                          
                          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2 text-sm text-gray-600">
                            <div>
                              <span className="font-medium">Placed:</span> {' '}
                              {new Date(order.createdAt).toLocaleDateString()}
                            </div>
                            <div>
                              <span className="font-medium">Items:</span> {order.items.length}
                            </div>
                            <div>
                              <span className="font-medium">Total:</span> {formatPrice(order.total)}
                            </div>
                            <div>
                              <span className="font-medium">Payment:</span> {' '}
                              <span className={order.isPaid ? 'text-green-600' : 'text-red-600'}>
                                {order.isPaid ? 'Paid' : 'Pending'}
                              </span>
                            </div>
                          </div>

                          {order.trackingNumber && (
                            <div className="mt-2">
                              <span className="text-sm text-gray-500">Tracking: </span>
                              <span className="text-sm font-mono bg-gray-100 px-2 py-1 rounded">
                                {order.trackingNumber}
                              </span>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="flex items-center gap-2 flex-shrink-0">
                      <Link
                        to={`/order/${order._id}`}
                        className="flex items-center gap-2 px-4 py-2 text-blue-600 border border-blue-200 rounded-lg hover:bg-blue-50"
                      >
                        <FaEye />
                        View
                      </Link>
                      
                      <button
                        onClick={() => toast.info('Invoice download coming soon')}
                        className="flex items-center gap-2 px-4 py-2 text-gray-600 border border-gray-200 rounded-lg hover:bg-gray-50"
                      >
                        <FaDownload />
                        Invoice
                      </button>

                      {(order.status === 'Pending' || order.status === 'Processing') && (
                        <button
                          onClick={() => cancelOrder(order._id)}
                          className="flex items-center gap-2 px-4 py-2 text-red-600 border border-red-200 rounded-lg hover:bg-red-50"
                        >
                          <FaTimes />
                          Cancel
                        </button>
                      )}

                      {order.status === 'Delivered' && order.returnStatus === 'None' && (
                        <button
                          onClick={() => requestReturn(order._id)}
                          className="flex items-center gap-2 px-4 py-2 text-orange-600 border border-orange-200 rounded-lg hover:bg-orange-50"
                        >
                          <FaUndo />
                          Return
                        </button>
                      )}
                    </div>
                  </div>

                  {/* Order Items Preview */}
                  {order.items.length > 1 && (
                    <div className="mt-4 pt-4 border-t">
                      <p className="text-sm text-gray-500 mb-2">
                        {order.items.length} items in this order:
                      </p>
                      <div className="flex gap-2 overflow-x-auto">
                        {order.items.slice(0, 5).map((item, index) => (
                          <div key={index} className="w-12 h-12 bg-gray-100 rounded flex-shrink-0 overflow-hidden">
                            <img
                              src={item.product?.images?.[0] || '/placeholder-image.jpg'}
                              alt={item.product?.name}
                              className="w-full h-full object-cover"
                            />
                          </div>
                        ))}
                        {order.items.length > 5 && (
                          <div className="w-12 h-12 bg-gray-200 rounded flex-shrink-0 flex items-center justify-center">
                            <span className="text-xs text-gray-600">+{order.items.length - 5}</span>
                          </div>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}

          {/* Pagination */}
          {pagination.totalPages > 1 && (
            <div className="px-6 py-4 border-t">
              <div className="flex items-center justify-between">
                <div className="text-sm text-gray-500">
                  Showing page {pagination.currentPage} of {pagination.totalPages}
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => handlePageChange(pagination.currentPage - 1)}
                    disabled={pagination.currentPage === 1}
                    className="px-3 py-2 text-sm border rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Previous
                  </button>
                  {Array.from({ length: pagination.totalPages }, (_, i) => i + 1).map(page => (
                    <button
                      key={page}
                      onClick={() => handlePageChange(page)}
                      className={`px-3 py-2 text-sm border rounded-lg ${
                        page === pagination.currentPage
                          ? 'bg-blue-600 text-white border-blue-600'
                          : 'hover:bg-gray-50'
                      }`}
                    >
                      {page}
                    </button>
                  ))}
                  <button
                    onClick={() => handlePageChange(pagination.currentPage + 1)}
                    disabled={pagination.currentPage === pagination.totalPages}
                    className="px-3 py-2 text-sm border rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Next
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default UserOrders;