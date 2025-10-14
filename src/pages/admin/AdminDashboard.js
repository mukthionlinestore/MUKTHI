import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from '../../config/axios';
import { useSettings } from '../../context/SettingsContext';
import { 
  FaUsers, 
  FaShoppingCart, 
  FaBox, 
  FaDollarSign, 
  FaPlus, 
  FaEdit, 
  FaList, 
  FaChartLine,
  FaEye,
  FaArrowUp,
  FaArrowDown,
  FaClock,
  FaCheckCircle,
  FaExclamationTriangle,
  FaTruck,
  FaStar,
  FaCalendarAlt,
  FaBell,
  FaCog,
  FaSearch,
  FaFilter,
  FaHome,
  FaUserCog,
  FaClipboardList,
  FaTags,
  FaStore
} from 'react-icons/fa';

const AdminDashboard = () => {
  const { formatPrice } = useSettings();
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalOrders: 0,
    totalProducts: 0,
    totalRevenue: 0
  });
  const [recentOrders, setRecentOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedPeriod, setSelectedPeriod] = useState('today');
  const [quickStats, setQuickStats] = useState({
    todayOrders: 0,
    todayRevenue: 0,
    lowStockProducts: 0,
    pendingOrders: 0
  });

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const [statsRes, ordersRes] = await Promise.all([
        axios.get('/api/admin/stats'),
        axios.get('/api/admin/recent-orders')
      ]);
      
      setStats(statsRes.data);
      setRecentOrders(ordersRes.data);
      
      // Calculate quick stats
      const today = new Date().toDateString();
      const todayOrders = ordersRes.data.filter(order => 
        new Date(order.createdAt).toDateString() === today
      );
      
      setQuickStats({
        todayOrders: todayOrders.length,
        todayRevenue: todayOrders.reduce((sum, order) => sum + order.total, 0),
        lowStockProducts: 0, // This would need a separate API call
        pendingOrders: ordersRes.data.filter(order => order.status === 'Pending').length
      });
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status) => {
    switch (status.toLowerCase()) {
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'processing': return 'bg-blue-100 text-blue-800';
      case 'shipped': return 'bg-purple-100 text-purple-800';
      case 'delivered': return 'bg-green-100 text-green-800';
      case 'cancelled': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusIcon = (status) => {
    switch (status.toLowerCase()) {
      case 'pending': return <FaClock className="w-4 h-4" />;
      case 'processing': return <FaEdit className="w-4 h-4" />;
      case 'shipped': return <FaTruck className="w-4 h-4" />;
      case 'delivered': return <FaCheckCircle className="w-4 h-4" />;
      case 'cancelled': return <FaExclamationTriangle className="w-4 h-4" />;
      default: return <FaClock className="w-4 h-4" />;
    }
  };

  const getTrendIcon = (value) => {
    return value > 0 ? 
      <FaArrowUp className="w-4 h-4 text-green-500" /> : 
      <FaArrowDown className="w-4 h-4 text-red-500" />;
  };

  if (loading) {
    return (
    <div className="min-h-screen ">
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-center">
            <div className="animate-spin rounded-full h-10 w-10 sm:h-12 sm:w-12 border-b-2 border-blue-600 mx-auto"></div>
            <p className="mt-3 sm:mt-4 text-sm sm:text-base text-gray-600">Loading your dashboard...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen ">
      <div className="px-2 py-3 sm:px-4 md:px-6 lg:px-8 sm:py-4 md:py-6">
        {/* Quick Stats Cards - Mobile Responsive */}
        <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-2 sm:gap-4 mb-6 sm:mb-8">
          <div className="bg-white rounded-xl sm:rounded-2xl p-2 sm:p-6 shadow-sm border border-gray-100">
            <div className="flex items-center justify-between">
              <div className="flex-1">
                <p className="text-xs sm:text-sm font-medium text-gray-600 mb-1">Today's Orders</p>
                <p className="text-xl sm:text-3xl font-bold text-gray-900">{quickStats.todayOrders}</p>
              </div>
              <div className="w-8 h-8 sm:w-14 sm:h-14 bg-blue-100 rounded-lg sm:rounded-xl flex items-center justify-center ml-2 sm:ml-4">
                <FaShoppingCart className="w-4 h-4 sm:w-7 sm:h-7 text-blue-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl sm:rounded-2xl p-2 sm:p-6 shadow-sm border border-gray-100">
            <div className="flex items-center justify-between">
              <div className="flex-1">
                <p className="text-xs sm:text-sm font-medium text-gray-600 mb-1">Revenue</p>
                <p className="text-xl sm:text-3xl font-bold text-gray-900">{formatPrice(quickStats.todayRevenue)}</p>
              </div>
              <div className="w-8 h-8 sm:w-14 sm:h-14 bg-green-100 rounded-lg sm:rounded-xl flex items-center justify-center ml-2 sm:ml-4">
                <FaDollarSign className="w-4 h-4 sm:w-7 sm:h-7 text-green-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl sm:rounded-2xl p-2 sm:p-6 shadow-sm border border-gray-100">
            <div className="flex items-center justify-between">
              <div className="flex-1">
                <p className="text-xs sm:text-sm font-medium text-gray-600 mb-1">Pending</p>
                <p className="text-xl sm:text-3xl font-bold text-gray-900">{quickStats.pendingOrders}</p>
              </div>
              <div className="w-8 h-8 sm:w-14 sm:h-14 bg-yellow-100 rounded-lg sm:rounded-xl flex items-center justify-center ml-2 sm:ml-4">
                <FaClock className="w-4 h-4 sm:w-7 sm:h-7 text-yellow-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl sm:rounded-2xl p-2 sm:p-6 shadow-sm border border-gray-100">
            <div className="flex items-center justify-between">
              <div className="flex-1">
                <p className="text-xs sm:text-sm font-medium text-gray-600 mb-1">Low Stock</p>
                <p className="text-xl sm:text-3xl font-bold text-gray-900">{quickStats.lowStockProducts}</p>
              </div>
              <div className="w-8 h-8 sm:w-14 sm:h-14 bg-red-100 rounded-lg sm:rounded-xl flex items-center justify-center ml-2 sm:ml-4">
                <FaExclamationTriangle className="w-4 h-4 sm:w-7 sm:h-7 text-red-600" />
              </div>
            </div>
          </div>
        </div>

        {/* Main Stats Cards - Mobile Responsive */}
        <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-2 sm:gap-6 mb-6 sm:mb-8">
          <div className="bg-white rounded-xl sm:rounded-2xl p-2 sm:p-6 shadow-sm border border-gray-100">
            <div className="flex items-center justify-between mb-3 sm:mb-4">
              <div className="w-8 h-8 sm:w-12 sm:h-12 bg-gradient-to-r from-blue-500 to-blue-600 rounded-lg sm:rounded-xl flex items-center justify-center">
                <FaUsers className="w-4 h-4 sm:w-6 sm:h-6 text-white" />
              </div>
              <div className="flex items-center space-x-1">
                {getTrendIcon(12)}
                <span className="text-xs sm:text-sm font-medium text-green-600">+12%</span>
              </div>
            </div>
            <h3 className="text-lg sm:text-2xl font-bold text-gray-900 mb-1">{stats.totalUsers}</h3>
            <p className="text-xs sm:text-sm text-gray-600">Total Users</p>
          </div>

          <div className="bg-white rounded-xl sm:rounded-2xl p-2 sm:p-6 shadow-sm border border-gray-100">
            <div className="flex items-center justify-between mb-3 sm:mb-4">
              <div className="w-8 h-8 sm:w-12 sm:h-12 bg-gradient-to-r from-green-500 to-green-600 rounded-lg sm:rounded-xl flex items-center justify-center">
                <FaShoppingCart className="w-4 h-4 sm:w-6 sm:h-6 text-white" />
              </div>
              <div className="flex items-center space-x-1">
                {getTrendIcon(8)}
                <span className="text-xs sm:text-sm font-medium text-green-600">+8%</span>
              </div>
            </div>
            <h3 className="text-lg sm:text-2xl font-bold text-gray-900 mb-1">{stats.totalOrders}</h3>
            <p className="text-xs sm:text-sm text-gray-600">Total Orders</p>
          </div>

          <div className="bg-white rounded-xl sm:rounded-2xl p-2 sm:p-6 shadow-sm border border-gray-100">
            <div className="flex items-center justify-between mb-3 sm:mb-4">
              <div className="w-8 h-8 sm:w-12 sm:h-12 bg-gradient-to-r from-purple-500 to-purple-600 rounded-lg sm:rounded-xl flex items-center justify-center">
                <FaBox className="w-4 h-4 sm:w-6 sm:h-6 text-white" />
              </div>
              <div className="flex items-center space-x-1">
                {getTrendIcon(15)}
                <span className="text-xs sm:text-sm font-medium text-green-600">+15%</span>
              </div>
            </div>
            <h3 className="text-lg sm:text-2xl font-bold text-gray-900 mb-1">{stats.totalProducts}</h3>
            <p className="text-xs sm:text-sm text-gray-600">Total Products</p>
          </div>

          <div className="bg-white rounded-xl sm:rounded-2xl p-2 sm:p-6 shadow-sm border border-gray-100">
            <div className="flex items-center justify-between mb-3 sm:mb-4">
              <div className="w-8 h-8 sm:w-12 sm:h-12 bg-gradient-to-r from-orange-500 to-orange-600 rounded-lg sm:rounded-xl flex items-center justify-center">
                <FaDollarSign className="w-4 h-4 sm:w-6 sm:h-6 text-white" />
              </div>
              <div className="flex items-center space-x-1">
                {getTrendIcon(23)}
                <span className="text-xs sm:text-sm font-medium text-green-600">+23%</span>
              </div>
            </div>
            <h3 className="text-lg sm:text-2xl font-bold text-gray-900 mb-1">{formatPrice(stats.totalRevenue)}</h3>
            <p className="text-xs sm:text-sm text-gray-600">Total Revenue</p>
          </div>
        </div>

        {/* Quick Actions - Mobile Responsive */}
        <div className="bg-white rounded-xl sm:rounded-2xl p-4 sm:p-6 shadow-sm border border-gray-100 mb-6 sm:mb-8">
          <h2 className="text-base sm:text-lg font-semibold text-gray-900 mb-3 sm:mb-4">Quick Actions</h2>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
            <Link to="/admin/products/add" className="flex flex-col items-center p-3 sm:p-4 rounded-lg sm:rounded-xl bg-blue-50 hover:bg-blue-100 transition-colors">
              <FaPlus className="w-5 h-5 sm:w-6 sm:h-6 text-blue-600 mb-2" />
              <span className="text-xs sm:text-sm font-medium text-blue-900 text-center">Add Product</span>
            </Link>
            
            <Link to="/admin/products" className="flex flex-col items-center p-3 sm:p-4 rounded-lg sm:rounded-xl bg-green-50 hover:bg-green-100 transition-colors">
              <FaList className="w-5 h-5 sm:w-6 sm:h-6 text-green-600 mb-2" />
              <span className="text-xs sm:text-sm font-medium text-green-900 text-center">Manage Products</span>
            </Link>
            
            <Link to="/admin/orders" className="flex flex-col items-center p-3 sm:p-4 rounded-lg sm:rounded-xl bg-purple-50 hover:bg-purple-100 transition-colors">
              <FaClipboardList className="w-5 h-5 sm:w-6 sm:h-6 text-purple-600 mb-2" />
              <span className="text-xs sm:text-sm font-medium text-purple-900 text-center">View Orders</span>
            </Link>
            
            <Link to="/admin/users" className="flex flex-col items-center p-3 sm:p-4 rounded-lg sm:rounded-xl bg-orange-50 hover:bg-orange-100 transition-colors">
              <FaUserCog className="w-5 h-5 sm:w-6 sm:h-6 text-orange-600 mb-2" />
              <span className="text-xs sm:text-sm font-medium text-orange-900 text-center">Manage Users</span>
            </Link>
          </div>
        </div>

        {/* Recent Orders - Mobile Responsive */}
        <div className="bg-white rounded-xl sm:rounded-2xl shadow-sm border border-gray-100">
          <div className="p-4 sm:p-6 border-b border-gray-100">
            <div className="flex items-center justify-between">
              <h2 className="text-base sm:text-lg font-semibold text-gray-900">Recent Orders</h2>
              <Link to="/admin/orders" className="text-xs sm:text-sm font-medium text-blue-600 hover:text-blue-700">
                View All
              </Link>
            </div>
          </div>
          
          <div className="divide-y divide-gray-100">
            {recentOrders.slice(0, 5).map((order) => (
              <div key={order._id} className="p-3 sm:p-4 hover:bg-gray-50 transition-colors">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2 sm:space-x-3">
                    <div className="w-8 h-8 sm:w-10 sm:h-10 bg-gray-100 rounded-full flex items-center justify-center">
                      <FaShoppingCart className="w-4 h-4 sm:w-5 sm:h-5 text-gray-600" />
                    </div>
                    <div>
                      <p className="text-xs sm:text-sm font-medium text-gray-900">Order #{order._id.slice(-6)}</p>
                      <p className="text-xs sm:text-sm text-gray-500">{order.user?.name || 'Guest User'}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-xs sm:text-sm font-medium text-gray-900">{formatPrice(order.total)}</p>
                    <div className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(order.status)}`}>
                      {getStatusIcon(order.status)}
                      <span className="ml-1">{order.status}</span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
