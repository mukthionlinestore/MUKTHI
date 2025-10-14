import React, { useState, useEffect } from 'react';
import { 
  FaBell, 
  FaPlus, 
  FaEdit, 
  FaTrash, 
  FaToggleOn, 
  FaToggleOff,
  FaEye,
  FaEyeSlash,
  FaSpinner,
  FaCheck,
  FaTimes,
  FaExclamationTriangle,
  FaInfoCircle,
  FaTag,
  FaShoppingCart,
  FaSync,
  FaBullhorn,
  FaGift
} from 'react-icons/fa';
import axios from '../../config/axios';
import { formatDistanceToNow } from 'date-fns';

const AdminNotifications = () => {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [editingNotification, setEditingNotification] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [filters, setFilters] = useState({
    type: '',
    priority: '',
    isActive: ''
  });

  // Form state for creating/editing
  const [formData, setFormData] = useState({
    title: '',
    message: '',
    type: 'announcement',
    priority: 'medium',
    targetAudience: 'all',
    expiresAt: ''
  });

  // Fetch notifications
  const fetchNotifications = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const params = new URLSearchParams({
        page: currentPage,
        limit: 20,
        ...filters
      });
      
      const response = await axios.get(`/api/notifications/admin/all?${params}`);
      
      console.log('Notifications API Response:', response.data);
      
      // Handle different response formats
      if (response.data.success && response.data.notifications) {
        setNotifications(response.data.notifications || []);
        setTotalPages(response.data.totalPages || 1);
      } else if (Array.isArray(response.data)) {
        // If response.data is directly an array
        setNotifications(response.data);
        setTotalPages(1);
      } else if (response.data.notifications) {
        // If success flag is missing but notifications exist
        setNotifications(response.data.notifications || []);
        setTotalPages(response.data.totalPages || 1);
      } else {
        console.warn('Unexpected response format:', response.data);
        setNotifications([]);
        setTotalPages(1);
      }
    } catch (error) {
      console.error('Error fetching notifications:', error);
      console.error('Error details:', error.response?.data);
      setError(error.response?.data?.message || 'Failed to fetch notifications');
      setNotifications([]);
    } finally {
      setLoading(false);
    }
  };

  // Create notification
  const handleCreate = async (e) => {
    e.preventDefault();
    try {
      setError(null);
      const response = await axios.post('/api/notifications/admin/create', formData);
      
      if (response.data.success) {
        setSuccess('Notification created successfully!');
        setShowCreateModal(false);
        setFormData({
          title: '',
          message: '',
          type: 'announcement',
          priority: 'medium',
          targetAudience: 'all',
          expiresAt: ''
        });
        fetchNotifications();
        
        // Clear success message after 3 seconds
        setTimeout(() => setSuccess(null), 3000);
      }
    } catch (error) {
      console.error('Error creating notification:', error);
      setError('Failed to create notification');
    }
  };

  // Update notification
  const handleUpdate = async (e) => {
    e.preventDefault();
    try {
      setError(null);
      const response = await axios.put(`/api/notifications/admin/${editingNotification._id}`, formData);
      
      if (response.data.success) {
        setSuccess('Notification updated successfully!');
        setEditingNotification(null);
        setFormData({
          title: '',
          message: '',
          type: 'announcement',
          priority: 'medium',
          targetAudience: 'all',
          expiresAt: ''
        });
        fetchNotifications();
        
        // Clear success message after 3 seconds
        setTimeout(() => setSuccess(null), 3000);
      }
    } catch (error) {
      console.error('Error updating notification:', error);
      setError('Failed to update notification');
    }
  };

  // Delete notification
  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this notification?')) {
      return;
    }
    
    try {
      const response = await axios.delete(`/api/notifications/admin/${id}`);
      
      if (response.data.success) {
        setSuccess('Notification deleted successfully!');
        fetchNotifications();
        setTimeout(() => setSuccess(null), 3000);
      }
    } catch (error) {
      console.error('Error deleting notification:', error);
      setError('Failed to delete notification');
    }
  };

  // Toggle active status
  const handleToggle = async (id) => {
    try {
      const response = await axios.patch(`/api/notifications/admin/${id}/toggle`);
      
      if (response.data.success) {
        setSuccess('Notification status updated!');
        fetchNotifications();
        setTimeout(() => setSuccess(null), 2000);
      }
    } catch (error) {
      console.error('Error toggling notification:', error);
      setError('Failed to update notification status');
    }
  };

  // Start editing
  const startEditing = (notification) => {
    setEditingNotification(notification);
    setFormData({
      title: notification.title,
      message: notification.message,
      type: notification.type,
      priority: notification.priority,
      targetAudience: notification.targetAudience,
      expiresAt: notification.expiresAt ? new Date(notification.expiresAt).toISOString().split('T')[0] : ''
    });
  };

  // Cancel editing
  const cancelEditing = () => {
    setEditingNotification(null);
    setFormData({
      title: '',
      message: '',
      type: 'announcement',
      priority: 'medium',
      targetAudience: 'all',
      expiresAt: ''
    });
  };

  // Get icon based on notification type
  const getNotificationIcon = (type) => {
    switch (type) {
      case 'announcement':
        return <FaBullhorn className="w-4 h-4 sm:w-5 sm:h-5 text-blue-600" />;
      case 'product':
        return <FaShoppingCart className="w-4 h-4 sm:w-5 sm:h-5 text-green-600" />;
      case 'promotion':
        return <FaGift className="w-4 h-4 sm:w-5 sm:h-5 text-purple-600" />;
      case 'system':
        return <FaExclamationTriangle className="w-4 h-4 sm:w-5 sm:h-5 text-orange-600" />;
      default:
        return <FaBell className="w-4 h-4 sm:w-5 sm:h-5 text-gray-600" />;
    }
  };

  // Get priority badge color
  const getPriorityBadgeColor = (priority) => {
    switch (priority) {
      case 'urgent':
        return 'bg-red-100 text-red-800 border-red-200';
      case 'high':
        return 'bg-orange-100 text-orange-800 border-orange-200';
      case 'medium':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  useEffect(() => {
    fetchNotifications();
  }, [currentPage, filters]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <FaSpinner className="w-8 h-8 text-gray-600 animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen ">
      <div className="px-2 py-3 sm:px-4 md:px-6 lg:px-8 sm:py-4 md:py-6">
        {/* Success/Error Messages */}
        {success && (
          <div className="bg-green-50 border border-green-200 text-green-800 px-3 py-2 sm:px-4 sm:py-3 rounded-lg sm:rounded-xl mb-3 sm:mb-4 animate-fade-in">
            <div className="flex items-center gap-2">
              <FaCheck className="w-3 h-3 sm:w-4 sm:h-4 flex-shrink-0" />
              <span className="text-xs sm:text-sm">{success}</span>
            </div>
          </div>
        )}
        
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-800 px-3 py-2 sm:px-4 sm:py-3 rounded-lg sm:rounded-xl mb-3 sm:mb-4 animate-fade-in">
            <div className="flex items-center gap-2">
              <FaTimes className="w-3 h-3 sm:w-4 sm:h-4 flex-shrink-0" />
              <span className="text-xs sm:text-sm">{error}</span>
            </div>
          </div>
        )}

        {/* Header */}
        <div className="rounded-lg sm:rounded-xl lg:rounded-2xl shadow-sm border border-gray-100 p-3 sm:p-4 lg:p-6 mb-3 sm:mb-4 lg:mb-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 sm:gap-4">
            <div>
              <h1 className="text-lg sm:text-xl lg:text-2xl font-bold text-gray-900 mb-1">Notification Management</h1>
              <p className="text-xs sm:text-sm text-gray-600">Manage system notifications ({notifications.length} total)</p>
            </div>
            <div className="flex flex-row gap-2 sm:gap-3">
              <button
                onClick={fetchNotifications}
                className="inline-flex items-center justify-center px-3 py-2 sm:px-4 sm:py-2.5 bg-white border border-gray-200 rounded-lg sm:rounded-xl text-xs sm:text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors shadow-sm"
                disabled={loading}
              >
                <FaSync className={`w-3 h-3 sm:w-4 sm:h-4 mr-1.5 sm:mr-2 ${loading ? 'animate-spin' : ''}`} />
                <span className="hidden sm:inline">Refresh</span>
                <span className="sm:hidden">Sync</span>
              </button>
              
              <button
                onClick={() => setShowCreateModal(true)}
                className="inline-flex items-center justify-center gap-2 px-3 py-2 sm:px-4 sm:py-2.5 text-xs sm:text-sm font-semibold text-white bg-gradient-to-r from-gray-700 via-gray-800 to-black hover:from-gray-800 hover:via-gray-900 hover:to-gray-800 rounded-xl sm:rounded-2xl transition-all duration-200 hover:scale-105 shadow-lg hover:shadow-xl focus:outline-none focus:ring-2 focus:ring-gray-500/20"
              >
                <FaPlus className="w-3 h-3 sm:w-4 sm:h-4" />
                <span className="hidden sm:inline">Create Notification</span>
                <span className="sm:hidden">Create</span>
                <div className="w-3 h-3 sm:w-4 sm:h-4 bg-white rounded-full flex items-center justify-center">
                  <svg className="w-1.5 h-1.5 sm:w-2 sm:h-2 text-black" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </div>
              </button>
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className=" rounded-lg sm:rounded-xl lg:rounded-2xl shadow-sm border border-gray-100 p-3 sm:p-4 lg:p-6 mb-3 sm:mb-4 lg:mb-6">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 sm:gap-3 lg:gap-4">
            <select
              value={filters.type}
              onChange={(e) => setFilters({ ...filters, type: e.target.value })}
              className="px-2 sm:px-3 py-2 sm:py-2.5 border border-gray-200 rounded-lg text-xs sm:text-sm focus:ring-2 focus:ring-gray-500 focus:border-gray-500 transition-colors bg-white"
            >
              <option value="">All Types</option>
              <option value="announcement">Announcement</option>
              <option value="product">Product</option>
              <option value="promotion">Promotion</option>
              <option value="system">System</option>
            </select>
            
            <select
              value={filters.priority}
              onChange={(e) => setFilters({ ...filters, priority: e.target.value })}
              className="px-2 sm:px-3 py-2 sm:py-2.5 border border-gray-200 rounded-lg text-xs sm:text-sm focus:ring-2 focus:ring-gray-500 focus:border-gray-500 transition-colors bg-white"
            >
              <option value="">All Priorities</option>
              <option value="urgent">Urgent</option>
              <option value="high">High</option>
              <option value="medium">Medium</option>
              <option value="low">Low</option>
            </select>
            
            <select
              value={filters.isActive}
              onChange={(e) => setFilters({ ...filters, isActive: e.target.value })}
              className="px-2 sm:px-3 py-2 sm:py-2.5 border border-gray-200 rounded-lg text-xs sm:text-sm focus:ring-2 focus:ring-gray-500 focus:border-gray-500 transition-colors bg-white"
            >
              <option value="">All Status</option>
              <option value="true">Active</option>
              <option value="false">Inactive</option>
            </select>
            
            <button
              onClick={() => setFilters({ type: '', priority: '', isActive: '' })}
              className="px-2 sm:px-4 py-2 text-xs sm:text-sm text-gray-600 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
            >
              <span className="hidden sm:inline">Clear Filters</span>
              <span className="sm:hidden">Clear</span>
            </button>
          </div>
        </div>

        {/* Notifications List */}
        <div className="space-y-2 sm:space-y-3">
          {notifications.length === 0 ? (
            <div className="bg-white rounded-lg sm:rounded-xl lg:rounded-2xl shadow-sm border border-gray-100 p-6 sm:p-8 lg:p-12 text-center">
              <div className="w-12 h-12 sm:w-16 sm:h-16 bg-gradient-to-r from-gray-700 via-gray-800 to-black rounded-full flex items-center justify-center mx-auto mb-3 sm:mb-4 relative">
                <div className="absolute inset-0 bg-white rounded-full m-1"></div>
                <FaBell className="w-6 h-6 sm:w-8 sm:h-8 text-black relative z-10" />
              </div>
              <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-1 sm:mb-2">No notifications found</h3>
              <p className="text-xs sm:text-sm text-gray-600 mb-3 sm:mb-4">Create your first notification to get started.</p>
              <button
                onClick={() => setShowCreateModal(true)}
                className="inline-flex items-center justify-center gap-2 px-4 py-2.5 text-sm font-semibold text-white bg-gradient-to-r from-gray-700 via-gray-800 to-black hover:from-gray-800 hover:via-gray-900 hover:to-gray-800 rounded-xl shadow-lg hover:shadow-xl transition-all duration-200 hover:scale-105"
              >
                <FaPlus className="w-4 h-4" />
                <span>Create First Notification</span>
              </button>
            </div>
          ) : (
            <>
              {notifications.map((notification) => (
                <div key={notification._id} className="bg-white rounded-lg sm:rounded-xl border border-gray-100 overflow-hidden hover:shadow-md transition-all duration-200">
                  <div className="p-3 sm:p-4">
                    <div className="flex items-start gap-2 sm:gap-3">
                      {/* Icon */}
                      <div className="flex-shrink-0 mt-0.5">
                        {getNotificationIcon(notification.type)}
                      </div>
                      
                      {/* Content */}
                      <div className="flex-1 min-w-0">
                        {/* Title and Badges */}
                        <div className="flex flex-wrap items-center gap-1.5 sm:gap-2 mb-1 sm:mb-2">
                          <h3 className="font-semibold text-sm sm:text-base text-gray-900 truncate">{notification.title}</h3>
                          <div className={`px-1.5 py-0.5 sm:px-2 sm:py-1 rounded-full text-xs font-medium border ${getPriorityBadgeColor(notification.priority)}`}>
                            {notification.priority}
                          </div>
                          <div className={`px-1.5 py-0.5 sm:px-2 sm:py-1 rounded-full text-xs font-medium ${
                            notification.isActive ? 'bg-green-100 text-green-800 border border-green-200' : 'bg-gray-100 text-gray-600 border border-gray-200'
                          }`}>
                            {notification.isActive ? 'Active' : 'Inactive'}
                          </div>
                        </div>
                        
                        {/* Message */}
                        <p className="text-xs sm:text-sm text-gray-600 mb-2 line-clamp-2">{notification.message}</p>
                        
                        {/* Meta Info */}
                        <div className="flex flex-wrap items-center gap-2 sm:gap-3 text-xs text-gray-500">
                          <span className="inline-flex items-center gap-1">
                            <FaTag className="w-2.5 h-2.5" />
                            {notification.type}
                          </span>
                          <span>•</span>
                          <span className="truncate">Target: {notification.targetAudience}</span>
                          <span className="hidden sm:inline">•</span>
                          <span className="hidden sm:inline">{formatDistanceToNow(new Date(notification.createdAt), { addSuffix: true })}</span>
                          {notification.readBy && (
                            <>
                              <span className="hidden sm:inline">•</span>
                              <span className="hidden sm:inline">{notification.readBy.length} reads</span>
                            </>
                          )}
                        </div>
                      </div>
                      
                      {/* Actions */}
                      <div className="flex sm:flex-row flex-col gap-1 flex-shrink-0">
                        <button
                          onClick={() => handleToggle(notification._id)}
                          className={`p-1.5 sm:p-2 rounded-lg transition-colors ${
                            notification.isActive 
                              ? 'text-green-600 hover:bg-green-50' 
                              : 'text-gray-400 hover:bg-gray-100'
                          }`}
                          title={notification.isActive ? 'Deactivate' : 'Activate'}
                        >
                          {notification.isActive ? <FaEye className="w-3 h-3 sm:w-4 sm:h-4" /> : <FaEyeSlash className="w-3 h-3 sm:w-4 sm:h-4" />}
                        </button>
                        
                        <button
                          onClick={() => startEditing(notification)}
                          className="p-1.5 sm:p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                          title="Edit"
                        >
                          <FaEdit className="w-3 h-3 sm:w-4 sm:h-4" />
                        </button>
                        
                        <button
                          onClick={() => handleDelete(notification._id)}
                          className="p-1.5 sm:p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                          title="Delete"
                        >
                          <FaTrash className="w-3 h-3 sm:w-4 sm:h-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </>
          )}
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex items-center justify-center gap-2 mt-4 sm:mt-6">
            <button
              onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
              disabled={currentPage === 1}
              className="px-3 py-1.5 sm:px-4 sm:py-2 text-xs sm:text-sm text-gray-700 bg-white border border-gray-200 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 transition-colors"
            >
              Previous
            </button>
            <span className="text-xs sm:text-sm text-gray-600">
              Page {currentPage} of {totalPages}
            </span>
            <button
              onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
              disabled={currentPage === totalPages}
              className="px-3 py-1.5 sm:px-4 sm:py-2 text-xs sm:text-sm text-gray-700 bg-white border border-gray-200 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 transition-colors"
            >
              Next
            </button>
          </div>
        )}
      </div>

      {/* Create/Edit Modal */}
      {(showCreateModal || editingNotification) && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-black/50 backdrop-blur-sm">
          <div className="bg-white rounded-xl sm:rounded-2xl shadow-2xl w-full max-w-md max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-white border-b border-gray-200 px-4 sm:px-6 py-3 sm:py-4 rounded-t-xl sm:rounded-t-2xl">
              <div className="flex items-center justify-between">
                <h2 className="text-base sm:text-lg font-bold text-gray-900">
                  {editingNotification ? 'Edit Notification' : 'Create Notification'}
                </h2>
                <button
                  onClick={() => {
                    setShowCreateModal(false);
                    cancelEditing();
                  }}
                  className="p-1.5 sm:p-2 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-100 transition-colors"
                >
                  <FaTimes className="w-4 h-4 sm:w-5 sm:h-5" />
                </button>
              </div>
            </div>
            
            <form onSubmit={editingNotification ? handleUpdate : handleCreate} className="p-4 sm:p-6">
              <div className="space-y-3 sm:space-y-4">
                <div>
                  <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1 sm:mb-2">Title</label>
                  <input
                    type="text"
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    className="w-full px-3 py-2 sm:py-2.5 border border-gray-200 rounded-lg text-xs sm:text-sm focus:ring-2 focus:ring-gray-500 focus:border-gray-500"
                    required
                  />
                </div>
                
                <div>
                  <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1 sm:mb-2">Message</label>
                  <textarea
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    className="w-full px-3 py-2 sm:py-2.5 border border-gray-200 rounded-lg text-xs sm:text-sm focus:ring-2 focus:ring-gray-500 focus:border-gray-500"
                    rows="3"
                    required
                  />
                </div>
                
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1 sm:mb-2">Type</label>
                    <select
                      value={formData.type}
                      onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                      className="w-full px-2 sm:px-3 py-2 sm:py-2.5 border border-gray-200 rounded-lg text-xs sm:text-sm focus:ring-2 focus:ring-gray-500 focus:border-gray-500"
                    >
                      <option value="announcement">Announcement</option>
                      <option value="product">Product</option>
                      <option value="promotion">Promotion</option>
                      <option value="system">System</option>
                    </select>
                  </div>
                  
                  <div>
                    <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1 sm:mb-2">Priority</label>
                    <select
                      value={formData.priority}
                      onChange={(e) => setFormData({ ...formData, priority: e.target.value })}
                      className="w-full px-2 sm:px-3 py-2 sm:py-2.5 border border-gray-200 rounded-lg text-xs sm:text-sm focus:ring-2 focus:ring-gray-500 focus:border-gray-500"
                    >
                      <option value="low">Low</option>
                      <option value="medium">Medium</option>
                      <option value="high">High</option>
                      <option value="urgent">Urgent</option>
                    </select>
                  </div>
                </div>
                
                <div>
                  <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1 sm:mb-2">Target Audience</label>
                  <select
                    value={formData.targetAudience}
                    onChange={(e) => setFormData({ ...formData, targetAudience: e.target.value })}
                    className="w-full px-3 py-2 sm:py-2.5 border border-gray-200 rounded-lg text-xs sm:text-sm focus:ring-2 focus:ring-gray-500 focus:border-gray-500"
                  >
                    <option value="all">All Users</option>
                    <option value="users">Users Only</option>
                    <option value="admins">Admins Only</option>
                  </select>
                </div>
                
                <div>
                  <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1 sm:mb-2">Expires At (Optional)</label>
                  <input
                    type="date"
                    value={formData.expiresAt}
                    onChange={(e) => setFormData({ ...formData, expiresAt: e.target.value })}
                    className="w-full px-3 py-2 sm:py-2.5 border border-gray-200 rounded-lg text-xs sm:text-sm focus:ring-2 focus:ring-gray-500 focus:border-gray-500"
                  />
                </div>
              </div>
              
              <div className="flex gap-2 sm:gap-3 mt-4 sm:mt-6">
                <button
                  type="button"
                  onClick={() => {
                    setShowCreateModal(false);
                    cancelEditing();
                  }}
                  className="flex-1 px-4 py-2 sm:py-2.5 text-xs sm:text-sm font-semibold text-gray-700 bg-white border border-gray-200 rounded-xl hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 inline-flex items-center justify-center gap-2 px-4 py-2 sm:py-2.5 text-xs sm:text-sm font-semibold text-white bg-gradient-to-r from-gray-700 via-gray-800 to-black hover:from-gray-800 hover:via-gray-900 hover:to-gray-800 rounded-xl transition-all duration-200 hover:scale-105 shadow-lg hover:shadow-xl"
                >
                  {editingNotification ? 'Update' : 'Create'}
                  <div className="w-3 h-3 sm:w-4 sm:h-4 bg-white rounded-full flex items-center justify-center">
                    <svg className="w-1.5 h-1.5 sm:w-2 sm:h-2 text-black" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </div>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminNotifications;
