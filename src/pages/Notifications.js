import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useNotifications } from '../context/NotificationContext';
import { 
  FaBell, 
  FaCheck, 
  FaCheckDouble, 
  FaShoppingCart, 
  FaGift, 
  FaExclamationTriangle,
  FaInfoCircle,
  FaTag,
  FaSpinner,
  FaTimes,
  FaEye,
  FaSync
} from 'react-icons/fa';
import { formatDistanceToNow } from 'date-fns';

const Notifications = () => {
  const { isAuthenticated } = useAuth();
  const { 
    notifications, 
    unreadCount, 
    loading, 
    error, 
    fetchNotifications, 
    refreshNotifications,
    markAsRead, 
    markAllAsRead,
    isNotificationRead 
  } = useNotifications();

  const [filter, setFilter] = useState('all'); // all, unread, read

  // Filter notifications based on current filter
  const filteredNotifications = notifications.filter(notification => {
    const isRead = isNotificationRead(notification);
    if (filter === 'unread') return !isRead;
    if (filter === 'read') return isRead;
    return true;
  });

  // Debug logging
  useEffect(() => {
    console.log('Notifications Debug:', {
      totalNotifications: notifications.length,
      unreadCount,
      readCount: notifications.length - unreadCount,
      filter,
      filteredCount: filteredNotifications.length,
      notifications: notifications.map(n => ({
        id: n._id,
        title: n.title,
        isRead: isNotificationRead(n),
        readBy: n.readBy
      }))
    });
  }, [notifications, unreadCount, filter, filteredNotifications]);

  // Get notification icon based on type
  const getNotificationIcon = (type, priority) => {
    const iconClass = `w-4 h-4 ${
      priority === 'urgent' ? 'text-red-500' :
      priority === 'high' ? 'text-orange-500' :
      priority === 'medium' ? 'text-blue-500' :
      'text-gray-500'
    }`;

    switch (type) {
      case 'product':
        return <FaShoppingCart className={iconClass} />;
      case 'promotion':
        return <FaTag className={iconClass} />;
      case 'system':
        return <FaExclamationTriangle className={iconClass} />;
      default:
        return <FaInfoCircle className={iconClass} />;
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

  // Handle notification click
  const handleNotificationClick = async (notification) => {
    if (!isNotificationRead(notification)) {
      await markAsRead(notification._id);
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen relative flex items-center justify-center px-3 sm:px-4">
        <div className="max-w-sm w-full bg-white rounded-2xl shadow-xl p-6 sm:p-8 text-center relative z-10">
          <div className="w-16 h-16 sm:w-20 sm:h-20 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center mx-auto mb-4 sm:mb-6">
            <FaBell className="w-8 h-8 sm:w-10 sm:h-10 text-white" />
          </div>
          <h1 className="text-xl sm:text-2xl font-bold text-gray-900 mb-2 sm:mb-3">
            Sign In Required
          </h1>
          <p className="text-sm sm:text-base text-gray-600 mb-4 sm:mb-6">
            Please sign in to view your notifications.
          </p>
          <Link
            to="/login"
            className="inline-flex items-center gap-2 px-4 py-2.5 text-sm font-semibold text-white bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl shadow-lg hover:shadow-xl transition-all duration-200 hover:scale-105 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
          >
            Sign In
          </Link>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="min-h-screen relative flex items-center justify-center">
        <div className="text-center relative z-10">
          <FaSpinner className="w-8 h-8 sm:w-12 sm:h-12 text-blue-600 animate-spin mx-auto mb-4" />
          <p className="text-sm sm:text-base text-gray-600">Loading notifications...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen relative flex items-center justify-center px-3 sm:px-4">
        <div className="max-w-sm w-full bg-white rounded-2xl shadow-xl p-6 sm:p-8 text-center relative z-10">
          <div className="w-16 h-16 sm:w-20 sm:h-20 bg-gradient-to-r from-red-500 to-pink-500 rounded-full flex items-center justify-center mx-auto mb-4 sm:mb-6">
            <FaTimes className="w-8 h-8 sm:w-10 sm:h-10 text-white" />
          </div>
          <h1 className="text-xl sm:text-2xl font-bold text-gray-900 mb-2 sm:mb-3">
            Error Loading Notifications
          </h1>
          <p className="text-sm sm:text-base text-gray-600 mb-4 sm:mb-6">
            {error}
          </p>
          <button
            onClick={fetchNotifications}
            className="inline-flex items-center gap-2 px-4 py-2.5 text-sm font-semibold text-white bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl shadow-lg hover:shadow-xl transition-all duration-200 hover:scale-105 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen relative">

      {/* Filter Tabs and Controls - Mobile First */}
      <div className="px-3 sm:px-4 lg:px-6 py-3 sm:py-4">
        {/* Mobile Layout */}
        <div className="block sm:hidden space-y-3">
          {/* Filter Tabs - Mobile */}
          <div className="flex space-x-1 overflow-x-auto">
            {[
              { key: 'all', label: 'All', count: notifications.length },
              { key: 'unread', label: 'Unread', count: unreadCount },
              { key: 'read', label: 'Read', count: notifications.length - unreadCount }
            ].map(({ key, label, count }) => (
              <button
                key={key}
                onClick={() => setFilter(key)}
                className={`px-3 py-2 text-xs font-medium rounded-lg transition-colors whitespace-nowrap ${
                  filter === key
                    ? 'bg-blue-100 text-blue-700 border border-blue-200'
                    : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                }`}
              >
                {label} ({count})
              </button>
            ))}
          </div>
          
          {/* Action Buttons - Mobile */}
          <div className="flex items-center gap-2">
            <button
              onClick={refreshNotifications}
              className="flex-1 inline-flex items-center justify-center gap-2 px-3 py-2 text-xs font-medium text-gray-600 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
            >
              <FaSync className={`w-3 h-3 ${loading ? 'animate-spin' : ''}`} />
              Refresh
            </button>
            
            {unreadCount > 0 && (
              <button
                onClick={markAllAsRead}
                className="flex-1 inline-flex items-center justify-center gap-2 px-3 py-2 text-xs font-medium text-blue-600 bg-blue-50 rounded-lg hover:bg-blue-100 transition-colors"
              >
                <FaCheckDouble className="w-3 h-3" />
                Mark All
              </button>
            )}
          </div>
        </div>

        {/* Desktop Layout */}
        <div className="hidden sm:flex items-center justify-between">
          {/* Filter Tabs - Desktop */}
          <div className="flex space-x-1">
            {[
              { key: 'all', label: 'All', count: notifications.length },
              { key: 'unread', label: 'Unread', count: unreadCount },
              { key: 'read', label: 'Read', count: notifications.length - unreadCount }
            ].map(({ key, label, count }) => (
              <button
                key={key}
                onClick={() => setFilter(key)}
                className={`px-4 py-2 text-sm font-medium rounded-lg transition-colors ${
                  filter === key
                    ? 'bg-blue-100 text-blue-700 border border-blue-200'
                    : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                }`}
              >
                {label} ({count})
              </button>
            ))}
          </div>
          
          {/* Action Buttons - Desktop */}
          <div className="flex items-center gap-2">
            <button
              onClick={refreshNotifications}
              className="inline-flex items-center gap-2 px-3 py-2 text-sm font-medium text-gray-600 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
              title="Refresh notifications"
            >
              <FaSync className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
              Refresh
            </button>
            
            {unreadCount > 0 && (
              <button
                onClick={markAllAsRead}
                className="inline-flex items-center gap-2 px-3 py-2 text-sm font-medium text-blue-600 bg-blue-50 rounded-lg hover:bg-blue-100 transition-colors"
              >
                <FaCheckDouble className="w-4 h-4" />
                Mark All Read
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Notifications List */}
      <div className="max-w-4xl mx-auto px-3 sm:px-4 lg:px-6 py-6">
        {loading && notifications.length === 0 ? (
          <div className="text-center py-12">
            <FaSpinner className="w-8 h-8 sm:w-12 sm:h-12 text-blue-600 animate-spin mx-auto mb-4" />
            <p className="text-sm sm:text-base text-gray-600">Loading notifications...</p>
          </div>
        ) : filteredNotifications.length === 0 ? (
          <div className="text-center py-12">
            <div className="w-16 h-16 sm:w-20 sm:h-20 bg-gradient-to-r from-gray-400 to-gray-500 rounded-full flex items-center justify-center mx-auto mb-4 sm:mb-6">
              <FaBell className="w-8 h-8 sm:w-10 sm:h-10 text-white" />
            </div>
            <h3 className="text-lg sm:text-xl font-semibold text-gray-900 mb-2">
              {filter === 'all' ? 'No notifications yet' : 
               filter === 'unread' ? 'No unread notifications' : 
               'No read notifications'}
            </h3>
            <p className="text-sm sm:text-base text-gray-600">
              {filter === 'all' ? 'You\'ll see notifications here when admins add new products or announcements.' :
               filter === 'unread' ? 'All your notifications are read!' :
               'You haven\'t read any notifications yet.'}
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {filteredNotifications.map((notification) => (
              <div
                key={notification._id}
                onClick={() => handleNotificationClick(notification)}
                className={`bg-white rounded-xl border border-gray-200 p-4 sm:p-5 cursor-pointer transition-all duration-200 hover:shadow-md hover:scale-[1.01] ${
                  !isNotificationRead(notification) ? 'border-l-4 border-l-blue-500 bg-blue-50/30' : ''
                }`}
              >
                <div className="flex items-start gap-3 sm:gap-4">
                  {/* Icon */}
                  <div className="flex-shrink-0 mt-1">
                    {getNotificationIcon(notification.type, notification.priority)}
                  </div>
                  
                  {/* Content */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex-1">
                        <h3 className="text-sm sm:text-base font-semibold text-gray-900 mb-1">
                          {notification.title}
                        </h3>
                        <p className="text-xs sm:text-sm text-gray-600 mb-2">
                          {notification.message}
                        </p>
                        
                        {/* Related Product Link */}
                        {notification.relatedProduct && (
                          <Link
                            to={`/product/${notification.relatedProduct._id}`}
                            className="inline-flex items-center gap-1 text-xs text-blue-600 hover:text-blue-700 font-medium"
                            onClick={(e) => e.stopPropagation()}
                          >
                            <FaEye className="w-3 h-3" />
                            View Product
                          </Link>
                        )}
                      </div>
                      
                      {/* Status and Priority */}
                      <div className="flex flex-col items-end gap-2">
                        {!isNotificationRead(notification) && (
                          <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                        )}
                        
                        <div className={`px-2 py-1 rounded-full text-xs font-medium border ${getPriorityBadgeColor(notification.priority)}`}>
                          {notification.priority}
                        </div>
                      </div>
                    </div>
                    
                    {/* Footer */}
                    <div className="flex items-center justify-between mt-3 pt-2 border-t border-gray-100">
                      <div className="flex items-center gap-2 text-xs text-gray-500">
                        <span>
                          {formatDistanceToNow(new Date(notification.createdAt), { addSuffix: true })}
                        </span>
                        <span>•</span>
                        <span className="capitalize">{notification.type}</span>
                      </div>
                      
                      {isNotificationRead(notification) && (
                        <div className="flex items-center gap-1 text-xs text-green-600">
                          <FaCheck className="w-3 h-3" />
                          Read
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Notifications;
