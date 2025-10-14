import React, { createContext, useContext, useState, useEffect } from 'react';
import axios from '../config/axios';

const SuperAdminContext = createContext();

export const useSuperAdmin = () => {
  const context = useContext(SuperAdminContext);
  if (!context) {
    throw new Error('useSuperAdmin must be used within a SuperAdminProvider');
  }
  return context;
};

export const SuperAdminProvider = ({ children }) => {
  const [superAdmin, setSuperAdmin] = useState(null);
  const [loading, setLoading] = useState(true);
  const [websiteConfig, setWebsiteConfig] = useState(null);

  // Check if user is super admin
  useEffect(() => {
    const token = localStorage.getItem('superAdminToken');
    if (token) {
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      fetchSuperAdminProfile();
    } else {
      setLoading(false);
    }
  }, []);

  const fetchSuperAdminProfile = async () => {
    try {
      const response = await axios.get('/api/superadmin/config');
      setSuperAdmin(response.data.user || { role: 'superadmin' });
      setWebsiteConfig(response.data);
    } catch (error) {
      console.error('Error fetching super admin profile:', error);
      logout();
    } finally {
      setLoading(false);
    }
  };

  const login = async (email, password) => {
    try {
      const response = await axios.post('/api/superadmin/login', {
        email,
        password
      });

      const { token, user } = response.data;
      localStorage.setItem('superAdminToken', token);
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      
      setSuperAdmin(user);
      await fetchWebsiteConfig();
      
      return { success: true, user };
    } catch (error) {
      console.error('Super admin login error:', error);
      return { 
        success: false, 
        message: error.response?.data?.message || 'Login failed' 
      };
    }
  };

  const logout = () => {
    localStorage.removeItem('superAdminToken');
    delete axios.defaults.headers.common['Authorization'];
    setSuperAdmin(null);
    setWebsiteConfig(null);
  };

  const fetchWebsiteConfig = async () => {
    try {
      const response = await axios.get('/api/superadmin/config');
      setWebsiteConfig(response.data);
      return response.data;
    } catch (error) {
      console.error('Error fetching website config:', error);
      throw error;
    }
  };

  const updateWebsiteConfig = async (configData) => {
    try {
      const response = await axios.put('/api/superadmin/config', configData);
      setWebsiteConfig(response.data.config);
      return response.data;
    } catch (error) {
      console.error('Error updating website config:', error);
      throw error;
    }
  };

  const getDashboardStats = async () => {
    try {
      const response = await axios.get('/api/superadmin/dashboard');
      return response.data;
    } catch (error) {
      console.error('Error fetching dashboard stats:', error);
      throw error;
    }
  };

  const getUsers = async (params = {}) => {
    try {
      const response = await axios.get('/api/superadmin/users', { params });
      return response.data;
    } catch (error) {
      console.error('Error fetching users:', error);
      throw error;
    }
  };

  const updateUserRole = async (userId, role) => {
    try {
      const response = await axios.put(`/api/superadmin/users/${userId}/role`, { role });
      return response.data;
    } catch (error) {
      console.error('Error updating user role:', error);
      throw error;
    }
  };

  const deleteUser = async (userId) => {
    try {
      const response = await axios.delete(`/api/superadmin/users/${userId}`);
      return response.data;
    } catch (error) {
      console.error('Error deleting user:', error);
      throw error;
    }
  };

  const createAdminUser = async (userData) => {
    try {
      const response = await axios.post('/api/superadmin/users/admin', userData);
      return response.data;
    } catch (error) {
      console.error('Error creating admin user:', error);
      throw error;
    }
  };

  const getSystemLogs = async () => {
    try {
      const response = await axios.get('/api/superadmin/logs');
      return response.data;
    } catch (error) {
      console.error('Error fetching system logs:', error);
      throw error;
    }
  };

  const initiateBackup = async () => {
    try {
      const response = await axios.post('/api/superadmin/backup');
      return response.data;
    } catch (error) {
      console.error('Error initiating backup:', error);
      throw error;
    }
  };

  const value = {
    superAdmin,
    loading,
    websiteConfig,
    login,
    logout,
    fetchWebsiteConfig,
    updateWebsiteConfig,
    getDashboardStats,
    getUsers,
    updateUserRole,
    deleteUser,
    createAdminUser,
    getSystemLogs,
    initiateBackup
  };

  return (
    <SuperAdminContext.Provider value={value}>
      {children}
    </SuperAdminContext.Provider>
  );
};









