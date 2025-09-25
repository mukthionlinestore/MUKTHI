import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useWebsiteConfig } from '../context/WebsiteConfigContext';
import { useNavigate } from 'react-router-dom';
import { 
  FaUsers, 
  FaShoppingBag, 
  FaDollarSign, 
  FaCog, 
  FaPalette,
  FaGlobe,
  FaShieldAlt,
  FaChartLine,
  FaUserCog,
  FaDatabase,
  FaDownload,
  FaSignOutAlt,
  FaSpinner,
  FaEye,
  FaEdit,
  FaTrash,
  FaPlus
} from 'react-icons/fa';
import { toast } from 'react-toastify';
import axios from '../config/axios';

const SuperAdminDashboard = () => {
  const { user, logout } = useAuth();
  const { config, updateConfig, fetchConfig } = useWebsiteConfig();
  const navigate = useNavigate();

  const [activeTab, setActiveTab] = useState('dashboard');
  const [stats, setStats] = useState(null);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showCreateAdmin, setShowCreateAdmin] = useState(false);
  const [newAdminData, setNewAdminData] = useState({
    name: '',
    email: '',
    password: ''
  });
  const [systemLogs, setSystemLogs] = useState([]);

  useEffect(() => {
    if (activeTab === 'dashboard') {
      fetchDashboardStats();
    } else if (activeTab === 'users') {
      fetchUsers();
    } else if (activeTab === 'website' || activeTab === 'theme') {
      fetchConfig();
    } else if (activeTab === 'system') {
      fetchSystemLogs();
    }
  }, [activeTab]);

  const fetchDashboardStats = async () => {
    setLoading(true);
    try {
      const response = await axios.get('/api/superadmin/dashboard');
      setStats(response.data);
    } catch (error) {
      toast.error('Failed to fetch dashboard stats');
    } finally {
      setLoading(false);
    }
  };

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const response = await axios.get('/api/superadmin/users');
      setUsers(response.data.users);
    } catch (error) {
      toast.error('Failed to fetch users');
    } finally {
      setLoading(false);
    }
  };

  const handleRoleUpdate = async (userId, newRole) => {
    try {
      await axios.put(`/api/superadmin/users/${userId}/role`, { role: newRole });
      toast.success('User role updated successfully');
      fetchUsers();
    } catch (error) {
      toast.error('Failed to update user role');
    }
  };

  const handleDeleteUser = async (userId) => {
    if (window.confirm('Are you sure you want to delete this user?')) {
      try {
        await axios.delete(`/api/superadmin/users/${userId}`);
        toast.success('User deleted successfully');
        fetchUsers();
      } catch (error) {
        toast.error('Failed to delete user');
      }
    }
  };

  const handleCreateAdmin = async (e) => {
    e.preventDefault();
    try {
      await axios.post('/api/superadmin/users/admin', newAdminData);
      toast.success('Admin user created successfully');
      setShowCreateAdmin(false);
      setNewAdminData({ name: '', email: '', password: '' });
      fetchUsers();
    } catch (error) {
      toast.error('Failed to create admin user');
    }
  };

  const handleBackup = async () => {
    try {
      await axios.post('/api/superadmin/backup');
      toast.success('Backup initiated successfully');
    } catch (error) {
      toast.error('Failed to initiate backup');
    }
  };


  const fetchSystemLogs = async () => {
    setLoading(true);
    try {
      const response = await axios.get('/api/superadmin/logs');
      setSystemLogs(response.data.activities || []);
    } catch (error) {
      toast.error('Failed to fetch system logs');
    } finally {
      setLoading(false);
    }
  };

  // Helper function to update config
  const updateConfigField = (field, value) => {
    const updatedConfig = { ...config, [field]: value };
    updateConfig(updatedConfig);
  };

  // Helper function to update nested config fields
  const updateNestedConfigField = (parentField, childField, value) => {
    const updatedConfig = {
      ...config,
      [parentField]: {
        ...config[parentField],
        [childField]: value
      }
    };
    updateConfig(updatedConfig);
  };

  const StatCard = ({ title, value, icon: Icon, color, subtitle }) => (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-gray-600">{title}</p>
          <p className="text-2xl font-bold text-gray-900">{value}</p>
          {subtitle && <p className="text-xs text-gray-500 mt-1">{subtitle}</p>}
        </div>
        <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${color}`}>
          <Icon className="w-6 h-6 text-white" />
        </div>
      </div>
    </div>
  );

  const TabButton = ({ id, label, icon: Icon, isActive, onClick }) => (
    <button
      onClick={() => onClick(id)}
      className={`flex items-center justify-center gap-1.5 sm:gap-2 px-2 sm:px-4 py-2.5 sm:py-3 rounded-lg sm:rounded-xl transition-all duration-200 text-xs sm:text-sm font-medium ${
        isActive 
          ? 'bg-blue-600 text-white shadow-md' 
          : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
      }`}
    >
      <Icon className="w-3 h-3 sm:w-4 sm:h-4" />
      <span className="hidden sm:inline">{label}</span>
    </button>
  );

  // Redirect if not super admin
  useEffect(() => {
    if (user && user.role !== 'superadmin') {
      navigate('/');
    }
  }, [user, navigate]);

  if (!user || user.role !== 'superadmin') {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <FaSpinner className="w-8 h-8 text-blue-600 animate-spin mx-auto mb-4" />
          <p className="text-gray-600">Loading Super Admin Panel...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-r from-purple-600 to-blue-600 rounded-lg flex items-center justify-center">
                <FaShieldAlt className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-900">Super Admin Panel</h1>
                <p className="text-sm text-gray-500">Welcome, {user.name}</p>
              </div>
            </div>
            <button
              onClick={logout}
              className="flex items-center gap-2 px-4 py-2 text-gray-600 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
            >
              <FaSignOutAlt className="w-4 h-4" />
              Logout
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Navigation Tabs - Mobile Optimized */}
        <div className="mb-4 sm:mb-6 lg:mb-8">
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:flex gap-2 sm:gap-3 overflow-x-auto">
            <TabButton
              id="dashboard"
              label="Dashboard"
              icon={FaChartLine}
              isActive={activeTab === 'dashboard'}
              onClick={setActiveTab}
            />
            <TabButton
              id="users"
              label="Users"
              icon={FaUsers}
              isActive={activeTab === 'users'}
              onClick={setActiveTab}
            />
            <TabButton
              id="website"
              label="Website"
              icon={FaGlobe}
              isActive={activeTab === 'website'}
              onClick={setActiveTab}
            />
            <TabButton
              id="theme"
              label="Theme"
              icon={FaPalette}
              isActive={activeTab === 'theme'}
              onClick={setActiveTab}
            />
            <TabButton
              id="system"
              label="System"
              icon={FaCog}
              isActive={activeTab === 'system'}
              onClick={setActiveTab}
            />
          </div>
        </div>

        {/* Dashboard Tab */}
        {activeTab === 'dashboard' && (
          <div>
            {loading ? (
              <div className="flex justify-center py-12">
                <FaSpinner className="w-8 h-8 text-blue-600 animate-spin" />
              </div>
            ) : stats ? (
              <div className="space-y-8">
                {/* Stats Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                  <StatCard
                    title="Total Users"
                    value={stats.stats.totalUsers}
                    icon={FaUsers}
                    color="bg-blue-500"
                  />
                  <StatCard
                    title="Total Admins"
                    value={stats.stats.totalAdmins}
                    icon={FaUserCog}
                    color="bg-green-500"
                  />
                  <StatCard
                    title="Total Products"
                    value={stats.stats.totalProducts}
                    icon={FaShoppingBag}
                    color="bg-purple-500"
                  />
                  <StatCard
                    title="Total Revenue"
                    value={`$${stats.stats.totalRevenue.toFixed(2)}`}
                    icon={FaDollarSign}
                    color="bg-yellow-500"
                  />
                </div>

                {/* Recent Orders */}
                <div className="bg-white rounded-xl shadow-sm border border-gray-200">
                  <div className="p-6 border-b border-gray-200">
                    <h3 className="text-lg font-semibold text-gray-900">Recent Orders</h3>
                  </div>
                  <div className="p-6">
                    {stats.recentOrders.length > 0 ? (
                      <div className="space-y-4">
                        {stats.recentOrders.map((order) => (
                          <div key={order._id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                            <div>
                              <p className="font-medium text-gray-900">Order #{order._id.slice(-8)}</p>
                              <p className="text-sm text-gray-500">{order.user?.name}</p>
                            </div>
                            <div className="text-right">
                              <p className="font-medium text-gray-900">${order.totalAmount}</p>
                              <p className="text-sm text-gray-500">{order.status}</p>
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <p className="text-gray-500 text-center py-8">No recent orders</p>
                    )}
                  </div>
                </div>
              </div>
            ) : (
              <div className="text-center py-12">
                <p className="text-gray-500">Failed to load dashboard data</p>
              </div>
            )}
          </div>
        )}

        {/* Users Tab */}
        {activeTab === 'users' && (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-bold text-gray-900">User Management</h2>
              <button
                onClick={() => setShowCreateAdmin(true)}
                className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                <FaPlus className="w-4 h-4" />
                Create Admin
              </button>
            </div>

            {loading ? (
              <div className="flex justify-center py-12">
                <FaSpinner className="w-8 h-8 text-blue-600 animate-spin" />
              </div>
            ) : (
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          User
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Role
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Actions
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {users.map((user) => (
                        <tr key={user._id}>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div>
                              <div className="text-sm font-medium text-gray-900">{user.name}</div>
                              <div className="text-sm text-gray-500">{user.email}</div>
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <select
                              value={user.role}
                              onChange={(e) => handleRoleUpdate(user._id, e.target.value)}
                              className="text-sm border border-gray-300 rounded px-2 py-1"
                            >
                              <option value="user">User</option>
                              <option value="admin">Admin</option>
                              <option value="superadmin">Super Admin</option>
                            </select>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                            <button
                              onClick={() => handleDeleteUser(user._id)}
                              className="text-red-600 hover:text-red-900"
                            >
                              <FaTrash className="w-4 h-4" />
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Website Settings Tab */}
        {activeTab === 'website' && (
          <div className="space-y-4 sm:space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-lg sm:text-xl lg:text-2xl font-bold text-gray-900">Website Settings</h2>
              <button
                onClick={() => updateConfig(config)}
                disabled={loading}
                className="px-3 sm:px-4 py-2 bg-blue-600 text-white text-xs sm:text-sm rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
              >
                {loading ? 'Saving...' : 'Save Changes'}
              </button>
            </div>

            {loading ? (
              <div className="flex justify-center py-8">
                <FaSpinner className="w-6 h-6 text-blue-600 animate-spin" />
              </div>
            ) : config ? (
              <div className="space-y-4 sm:space-y-6">
                {/* Basic Information */}
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 sm:p-6">
                  <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-4">Basic Information</h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1.5">Website Name</label>
                      <input
                        type="text"
                        value={config.websiteName || ''}
                        onChange={(e) => updateConfigField('websiteName', e.target.value)}
                        className="w-full px-3 py-2 text-xs sm:text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        placeholder="Enter website name"
                      />
                    </div>
                    <div>
                      <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1.5">Contact Email</label>
                      <input
                        type="email"
                        value={config.contactEmail || ''}
                        onChange={(e) => updateConfigField('contactEmail', e.target.value)}
                        className="w-full px-3 py-2 text-xs sm:text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        placeholder="contact@example.com"
                      />
                    </div>
                    <div className="sm:col-span-2">
                      <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1.5">Website Description</label>
                      <textarea
                        value={config.websiteDescription || ''}
                        onChange={(e) => updateConfigField('websiteDescription', e.target.value)}
                        rows="3"
                        className="w-full px-3 py-2 text-xs sm:text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        placeholder="Enter website description"
                      />
                    </div>
                  </div>
                </div>

                {/* Contact Information */}
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 sm:p-6">
                  <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-4">Contact Information</h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1.5">Phone Number</label>
                      <input
                        type="tel"
                        value={config.contactPhone || ''}
                        onChange={(e) => updateConfigField('contactPhone', e.target.value)}
                        className="w-full px-3 py-2 text-xs sm:text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        placeholder="+1 (555) 123-4567"
                      />
                    </div>
                    <div>
                      <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1.5">Business Hours</label>
                      <input
                        type="text"
                        value={config.businessHours || ''}
                        onChange={(e) => updateConfigField('businessHours', e.target.value)}
                        className="w-full px-3 py-2 text-xs sm:text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        placeholder="Mon-Fri: 9AM-6PM"
                      />
                    </div>
                    <div className="sm:col-span-2">
                      <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1.5">Address</label>
                      <textarea
                        value={config.contactAddress || ''}
                        onChange={(e) => updateConfigField('contactAddress', e.target.value)}
                        rows="2"
                        className="w-full px-3 py-2 text-xs sm:text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        placeholder="Enter business address"
                      />
                    </div>
                  </div>
                </div>

                {/* Social Media */}
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 sm:p-6">
                  <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-4">Social Media Links</h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1.5">Facebook</label>
                      <input
                        type="url"
                        value={config.socialMedia?.facebook || ''}
                        onChange={(e) => updateNestedConfigField('socialMedia', 'facebook', e.target.value)}
                        className="w-full px-3 py-2 text-xs sm:text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        placeholder="https://facebook.com/yourpage"
                      />
                    </div>
                    <div>
                      <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1.5">Instagram</label>
                      <input
                        type="url"
                        value={config.socialMedia?.instagram || ''}
                        onChange={(e) => updateNestedConfigField('socialMedia', 'instagram', e.target.value)}
                        className="w-full px-3 py-2 text-xs sm:text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        placeholder="https://instagram.com/yourpage"
                      />
                    </div>
                    <div>
                      <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1.5">Twitter</label>
                      <input
                        type="url"
                        value={config.socialMedia?.twitter || ''}
                        onChange={(e) => updateNestedConfigField('socialMedia', 'twitter', e.target.value)}
                        className="w-full px-3 py-2 text-xs sm:text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        placeholder="https://twitter.com/yourpage"
                      />
                    </div>
                    <div>
                      <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1.5">LinkedIn</label>
                      <input
                        type="url"
                        value={config.socialMedia?.linkedin || ''}
                        onChange={(e) => updateNestedConfigField('socialMedia', 'linkedin', e.target.value)}
                        className="w-full px-3 py-2 text-xs sm:text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        placeholder="https://linkedin.com/company/yourcompany"
                      />
                    </div>
                  </div>
                </div>

                {/* SEO Settings */}
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 sm:p-6">
                  <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-4">SEO Settings</h3>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1.5">Meta Title</label>
                      <input
                        type="text"
                        value={config.metaTitle || ''}
                        onChange={(e) => updateConfigField('metaTitle', e.target.value)}
                        className="w-full px-3 py-2 text-xs sm:text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        placeholder="Your Website Title"
                      />
                    </div>
                    <div>
                      <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1.5">Meta Description</label>
                      <textarea
                        value={config.metaDescription || ''}
                        onChange={(e) => updateConfigField('metaDescription', e.target.value)}
                        rows="3"
                        className="w-full px-3 py-2 text-xs sm:text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        placeholder="Describe your website for search engines"
                      />
                    </div>
                    <div>
                      <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1.5">Meta Keywords</label>
                      <input
                        type="text"
                        value={config.metaKeywords || ''}
                        onChange={(e) => updateConfigField('metaKeywords', e.target.value)}
                        className="w-full px-3 py-2 text-xs sm:text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        placeholder="keyword1, keyword2, keyword3"
                      />
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <div className="text-center py-8">
                <p className="text-gray-500">Failed to load website configuration</p>
              </div>
            )}
          </div>
        )}

        {/* Theme & Design Tab */}
        {activeTab === 'theme' && (
          <div className="space-y-4 sm:space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-lg sm:text-xl lg:text-2xl font-bold text-gray-900">Theme & Design</h2>
              <button
                onClick={() => updateConfig(config)}
                disabled={loading}
                className="px-3 sm:px-4 py-2 bg-blue-600 text-white text-xs sm:text-sm rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
              >
                {loading ? 'Saving...' : 'Save Changes'}
              </button>
            </div>

            {loading ? (
              <div className="flex justify-center py-8">
                <FaSpinner className="w-6 h-6 text-blue-600 animate-spin" />
              </div>
            ) : config ? (
              <div className="space-y-4 sm:space-y-6">
                {/* Color Scheme */}
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 sm:p-6">
                  <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-4">Color Scheme</h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1.5">Primary Color</label>
                      <div className="flex items-center gap-2">
                        <input
                          type="color"
                          value={config.primaryColor || '#10B981'}
                          onChange={(e) => updateConfigField('primaryColor', e.target.value)}
                          className="w-8 h-8 rounded border border-gray-300"
                        />
                        <input
                          type="text"
                          value={config.primaryColor || '#10B981'}
                          onChange={(e) => updateConfigField('primaryColor', e.target.value)}
                          className="flex-1 px-2 py-1 text-xs border border-gray-300 rounded"
                          placeholder="#10B981"
                        />
                      </div>
                    </div>
                    <div>
                      <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1.5">Secondary Color</label>
                      <div className="flex items-center gap-2">
                        <input
                          type="color"
                          value={config.secondaryColor || '#059669'}
                          onChange={(e) => updateConfigField('secondaryColor', e.target.value)}
                          className="w-8 h-8 rounded border border-gray-300"
                        />
                        <input
                          type="text"
                          value={config.secondaryColor || '#059669'}
                          onChange={(e) => updateConfigField('secondaryColor', e.target.value)}
                          className="flex-1 px-2 py-1 text-xs border border-gray-300 rounded"
                          placeholder="#059669"
                        />
                      </div>
                    </div>
                    <div>
                      <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1.5">Accent Color</label>
                      <div className="flex items-center gap-2">
                        <input
                          type="color"
                          value={config.accentColor || '#0D9488'}
                          onChange={(e) => updateConfigField('accentColor', e.target.value)}
                          className="w-8 h-8 rounded border border-gray-300"
                        />
                        <input
                          type="text"
                          value={config.accentColor || '#0D9488'}
                          onChange={(e) => updateConfigField('accentColor', e.target.value)}
                          className="flex-1 px-2 py-1 text-xs border border-gray-300 rounded"
                          placeholder="#0D9488"
                        />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Feature Toggles */}
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 sm:p-6">
                  <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-4">Feature Toggles</h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="flex items-center justify-between p-3 border border-gray-200 rounded-lg">
                      <div>
                        <label className="text-xs sm:text-sm font-medium text-gray-700">Wishlist</label>
                        <p className="text-xs text-gray-500">Enable wishlist functionality</p>
                      </div>
                      <input
                        type="checkbox"
                        checked={config.features?.wishlist || true}
                        onChange={(e) => updateNestedConfigField('features', 'wishlist', e.target.checked)}
                        className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
                      />
                    </div>
                    <div className="flex items-center justify-between p-3 border border-gray-200 rounded-lg">
                      <div>
                        <label className="text-xs sm:text-sm font-medium text-gray-700">Reviews</label>
                        <p className="text-xs text-gray-500">Enable product reviews</p>
                      </div>
                      <input
                        type="checkbox"
                        checked={config.features?.reviews || true}
                        onChange={(e) => updateNestedConfigField('features', 'reviews', e.target.checked)}
                        className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
                      />
                    </div>
                    <div className="flex items-center justify-between p-3 border border-gray-200 rounded-lg">
                      <div>
                        <label className="text-xs sm:text-sm font-medium text-gray-700">Dark Mode</label>
                        <p className="text-xs text-gray-500">Enable dark mode option</p>
                      </div>
                      <input
                        type="checkbox"
                        checked={config.features?.darkMode || false}
                        onChange={(e) => updateNestedConfigField('features', 'darkMode', e.target.checked)}
                        className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
                      />
                    </div>
                    <div className="flex items-center justify-between p-3 border border-gray-200 rounded-lg">
                      <div>
                        <label className="text-xs sm:text-sm font-medium text-gray-700">Social Login</label>
                        <p className="text-xs text-gray-500">Enable social media login</p>
                      </div>
                      <input
                        type="checkbox"
                        checked={config.features?.socialLogin || true}
                        onChange={(e) => updateNestedConfigField('features', 'socialLogin', e.target.checked)}
                        className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
                      />
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <div className="text-center py-8">
                <p className="text-gray-500">Failed to load theme configuration</p>
              </div>
            )}
          </div>
        )}

        {/* System Management Tab */}
        {activeTab === 'system' && (
          <div className="space-y-4 sm:space-y-6">
            <h2 className="text-lg sm:text-xl lg:text-2xl font-bold text-gray-900">System Management</h2>
            
            {/* System Tools */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 sm:p-6">
                <div className="flex items-center gap-3 mb-4">
                  <FaDatabase className="w-6 h-6 sm:w-8 sm:h-8 text-blue-600" />
                  <h3 className="text-base sm:text-lg font-semibold text-gray-900">Database</h3>
                </div>
                <p className="text-xs sm:text-sm text-gray-600 mb-4">Manage database operations and maintenance</p>
                <div className="space-y-2">
                  <button className="w-full px-3 py-2 bg-blue-600 text-white text-xs sm:text-sm rounded-lg hover:bg-blue-700 transition-colors">
                    Database Status
                  </button>
                  <button className="w-full px-3 py-2 bg-gray-600 text-white text-xs sm:text-sm rounded-lg hover:bg-gray-700 transition-colors">
                    Optimize Database
                  </button>
                </div>
              </div>
              
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 sm:p-6">
                <div className="flex items-center gap-3 mb-4">
                  <FaDownload className="w-6 h-6 sm:w-8 sm:h-8 text-green-600" />
                  <h3 className="text-base sm:text-lg font-semibold text-gray-900">Backup</h3>
                </div>
                <p className="text-xs sm:text-sm text-gray-600 mb-4">Create system backups and restore data</p>
                <div className="space-y-2">
                  <button
                    onClick={handleBackup}
                    className="w-full px-3 py-2 bg-green-600 text-white text-xs sm:text-sm rounded-lg hover:bg-green-700 transition-colors"
                  >
                    Create Backup
                  </button>
                  <button className="w-full px-3 py-2 bg-gray-600 text-white text-xs sm:text-sm rounded-lg hover:bg-gray-700 transition-colors">
                    Restore Backup
                  </button>
                </div>
              </div>
            </div>

            {/* System Logs */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 sm:p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-base sm:text-lg font-semibold text-gray-900">System Logs</h3>
                <button
                  onClick={fetchSystemLogs}
                  className="px-3 py-1.5 bg-blue-600 text-white text-xs rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Refresh
                </button>
              </div>
              
              {loading ? (
                <div className="flex justify-center py-8">
                  <FaSpinner className="w-6 h-6 text-blue-600 animate-spin" />
                </div>
              ) : (
                <div className="space-y-3">
                  {systemLogs.length > 0 ? (
                    systemLogs.slice(0, 10).map((log, index) => (
                      <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                        <div className="flex-1">
                          <p className="text-xs sm:text-sm font-medium text-gray-900">
                            Order #{log._id?.slice(-8) || 'N/A'}
                          </p>
                          <p className="text-xs text-gray-500">
                            {log.user?.name || 'Unknown User'} - {log.status}
                          </p>
                        </div>
                        <div className="text-right">
                          <p className="text-xs sm:text-sm font-medium text-gray-900">
                            ${log.totalAmount || 0}
                          </p>
                          <p className="text-xs text-gray-500">
                            {log.createdAt ? new Date(log.createdAt).toLocaleDateString() : 'N/A'}
                          </p>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="text-center py-8">
                      <p className="text-gray-500 text-sm">No system logs available</p>
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Maintenance Mode */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 sm:p-6">
              <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-4">Maintenance Mode</h3>
              <div className="flex items-center justify-between p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                <div>
                  <p className="text-xs sm:text-sm font-medium text-yellow-800">Maintenance Mode</p>
                  <p className="text-xs text-yellow-600">Enable to show maintenance page to users</p>
                </div>
                <input
                  type="checkbox"
                  checked={config?.maintenanceMode || false}
                  onChange={(e) => updateConfigField('maintenanceMode', e.target.checked)}
                  className="w-4 h-4 text-yellow-600 rounded focus:ring-yellow-500"
                />
              </div>
              {config?.maintenanceMode && (
                <div className="mt-4">
                  <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1.5">Maintenance Message</label>
                  <textarea
                    value={config.maintenanceMessage || ''}
                    onChange={(e) => updateConfigField('maintenanceMessage', e.target.value)}
                    rows="3"
                    className="w-full px-3 py-2 text-xs sm:text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="We are currently performing maintenance. Please check back later."
                  />
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Create Admin Modal */}
      {showCreateAdmin && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl max-w-md w-full p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Create Admin User</h3>
            <form onSubmit={handleCreateAdmin} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
                <input
                  type="text"
                  value={newAdminData.name}
                  onChange={(e) => setNewAdminData({...newAdminData, name: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                <input
                  type="email"
                  value={newAdminData.email}
                  onChange={(e) => setNewAdminData({...newAdminData, email: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
                <input
                  type="password"
                  value={newAdminData.password}
                  onChange={(e) => setNewAdminData({...newAdminData, password: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>
              <div className="flex gap-3 pt-4">
                <button
                  type="button"
                  onClick={() => setShowCreateAdmin(false)}
                  className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Create Admin
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default SuperAdminDashboard;
