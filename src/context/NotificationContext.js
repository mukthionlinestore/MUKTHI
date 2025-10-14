import React, { createContext, useContext, useState, useEffect } from 'react';
import axios from '../config/axios';
import { useAuth } from './AuthContext';

const NotificationContext = createContext();

export const useNotifications = () => {
  const context = useContext(NotificationContext);
  if (!context) {
    throw new Error('useNotifications must be used within a NotificationProvider');
  }
  return context;
};

export const NotificationProvider = ({ children }) => {
  const { user } = useAuth();
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Fetch notifications
  const fetchNotifications = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await axios.get('/api/notifications');
      
      if (response.data.success) {
        setNotifications(response.data.notifications);
      }
    } catch (error) {
      console.error('Error fetching notifications:', error);
      setError('Failed to fetch notifications');
    } finally {
      setLoading(false);
    }
  };

  // Fetch unread count
  const fetchUnreadCount = async () => {
    try {
      const response = await axios.get('/api/notifications/unread-count');
      
      if (response.data.success) {
        setUnreadCount(response.data.unreadCount);
      }
    } catch (error) {
      console.error('Error fetching unread count:', error);
    }
  };

  // Mark notification as read
  const markAsRead = async (notificationId) => {
    try {
      const response = await axios.post(`/api/notifications/${notificationId}/read`);
      
      if (response.data.success) {
        // Update local state - add current user to readBy array
        setNotifications(prev => 
          prev.map(notification => {
            if (notification._id === notificationId) {
              const existingRead = notification.readBy || [];
              const isAlreadyRead = existingRead.some(read => read.user.toString() === user?._id);
              
              if (!isAlreadyRead) {
                return {
                  ...notification,
                  readBy: [...existingRead, { user: user._id, readAt: new Date() }]
                };
              }
            }
            return notification;
          })
        );
        
        // Update unread count
        setUnreadCount(prev => Math.max(0, prev - 1));
      }
    } catch (error) {
      console.error('Error marking notification as read:', error);
    }
  };

  // Mark all notifications as read
  const markAllAsRead = async () => {
    try {
      const response = await axios.post('/api/notifications/mark-all-read');
      
      if (response.data.success) {
        // Update local state - add current user to readBy array for all unread notifications
        setNotifications(prev => 
          prev.map(notification => {
            const existingRead = notification.readBy || [];
            const isAlreadyRead = existingRead.some(read => read.user.toString() === user?._id);
            
            if (!isAlreadyRead) {
              return {
                ...notification,
                readBy: [...existingRead, { user: user._id, readAt: new Date() }]
              };
            }
            return notification;
          })
        );
        
        setUnreadCount(0);
      }
    } catch (error) {
      console.error('Error marking all notifications as read:', error);
    }
  };

  // Check if notification is read
  const isNotificationRead = (notification) => {
    if (!notification.readBy || !user?._id) return false;
    return notification.readBy.some(read => read.user.toString() === user._id);
  };

  // Load notifications on mount
  useEffect(() => {
    if (user?._id) {
      fetchNotifications();
      fetchUnreadCount();
    }
  }, [user?._id]);

  // Refresh notifications every 10 seconds for real-time updates
  useEffect(() => {
    if (!user?._id) return;
    
    const interval = setInterval(() => {
      fetchNotifications();
      fetchUnreadCount();
    }, 10000);

    return () => clearInterval(interval);
  }, [user?._id]);

  // Manual refresh function
  const refreshNotifications = async () => {
    await fetchNotifications();
    await fetchUnreadCount();
  };

  const value = {
    notifications,
    unreadCount,
    loading,
    error,
    fetchNotifications,
    fetchUnreadCount,
    refreshNotifications,
    markAsRead,
    markAllAsRead,
    isNotificationRead
  };

  return (
    <NotificationContext.Provider value={value}>
      {children}
    </NotificationContext.Provider>
  );
};

export default NotificationContext;
