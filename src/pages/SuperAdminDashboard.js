import { useState, useEffect } from 'react';
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
  FaTrash,
  FaPlus,
  FaStore,
  FaHome
} from 'react-icons/fa';
import { toast } from 'react-toastify';
import axios from '../config/axios';
import SuperAdminHomePage from './admin/SuperAdminHomePage';

const SuperAdminDashboard = () => {
  const { user, logout } = useAuth();
  const { config, updateConfig, fetchConfig, setConfig, refreshConfig } = useWebsiteConfig();
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
  const [localConfig, setLocalConfig] = useState(null);
  const [configSaving, setConfigSaving] = useState(false);

  useEffect(() => {
    if (activeTab === 'dashboard') {
      fetchDashboardStats();
    } else if (activeTab === 'users') {
      fetchUsers();
    } else if (activeTab === 'website' || activeTab === 'theme' || activeTab === 'payment') {
      fetchConfig();
    } else if (activeTab === 'system') {
      fetchSystemLogs();
    }
  }, [activeTab]);

  // Sync local config with global config
  useEffect(() => {
    if (config) {
      console.log('Config loaded:', config);
      console.log('Payment settings in config:', config.paymentSettings);
      setLocalConfig(config);
      applyThemeCSS(config);
    } else {
      // If no config is available, initialize with default values
      const defaultConfig = {
        websiteName: 'MUKHTI',
        websiteDescription: 'Gracefully unbound - Premium lifestyle and fashion destination',
        contactEmail: 'contact@mukhti.com',
        contactPhone: '+1 (555) 123-4567',
        contactAddress: '123 Business St, City, State 12345',
        businessHours: 'Mon-Fri: 9AM-6PM',
        
        // Main Brand Colors - White Dominating with Maroon Gradients
        primaryColor: '#FFFFFF',
        secondaryColor: '#8B1538',
        accentColor: '#B91C1C',
        
        // Layout Colors
        headerBackground: '#FFFFFF',
        headerTextColor: '#1F2937',
        footerBackground: '#FFFFFF',
        footerTextColor: '#64748B',
        backgroundColor: '#FFFFFF',
        
        // UI Element Colors
        buttonPrimaryColor: '#8B1538',
        buttonSecondaryColor: '#FFFFFF',
        buttonDangerColor: '#DC2626',
        buttonSuccessColor: '#059669',
        
        // Text Colors
        textPrimaryColor: '#111827',
        textSecondaryColor: '#374151',
        textMutedColor: '#6B7280',
        linkColor: '#2563EB',
        
        // Border & Surface Colors
        borderColor: '#E5E7EB',
        cardBackground: '#FFFFFF',
        inputBackground: '#FFFFFF',
        inputBorderColor: '#D1D5DB',
        
        // Status Colors
        successColor: '#10B981',
        warningColor: '#F59E0B',
        errorColor: '#EF4444',
        infoColor: '#06B6D4',
        
        socialMedia: {
          facebook: '',
          instagram: '',
          twitter: '',
          linkedin: ''
        },
        metaTitle: 'E-Shop - Premium Online Shopping',
        metaDescription: 'Discover amazing products at great prices. Fast shipping and excellent customer service.',
        metaKeywords: 'shopping, online store, ecommerce, products',
        features: {
          wishlist: true,
          reviews: true,
          darkMode: false,
          socialLogin: true
        },
        maintenanceMode: false,
        maintenanceMessage: 'We are currently performing maintenance. Please check back later.',
        paymentSettings: {
          paymentMethod: 'gateway',
          whatsappNumber: '',
          instagramUsername: '',
          paymentGatewayEnabled: true,
          whatsappEnabled: false,
          instagramEnabled: false
        }
      };
      setLocalConfig(defaultConfig);
      applyThemeCSS(defaultConfig);
    }
  }, [config]);

  // Cleanup theme preview styles when component unmounts
  useEffect(() => {
    return () => {
      const styleElement = document.getElementById('superadmin-theme-preview');
      if (styleElement) {
        styleElement.remove();
      }
    };
  }, []);

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

  // Helper function to convert hex to RGB
  const hexToRgb = (hex) => {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result ? {
      r: parseInt(result[1], 16),
      g: parseInt(result[2], 16),
      b: parseInt(result[3], 16)
    } : null;
  };

  // Helper function to apply theme CSS immediately
  const applyThemeCSS = (config) => {
    if (!config) return;
    
    const styleId = 'superadmin-theme-preview';
    let styleElement = document.getElementById(styleId);
    
    if (!styleElement) {
      styleElement = document.createElement('style');
      styleElement.id = styleId;
      document.head.appendChild(styleElement);
    }
    
    const primaryRgb = hexToRgb(config.primaryColor || '#2563EB');
    const secondaryRgb = hexToRgb(config.secondaryColor || '#7C3AED');
    const accentRgb = hexToRgb(config.accentColor || '#06B6D4');
    
    styleElement.textContent = `
      :root {
        /* Main Brand Colors */
        --primary-color: ${config.primaryColor || '#2563EB'};
        --secondary-color: ${config.secondaryColor || '#7C3AED'};
        --accent-color: ${config.accentColor || '#06B6D4'};
        
        /* Layout Colors */
        --header-bg: ${config.headerBackground || '#FFFFFF'};
        --header-text: ${config.headerTextColor || '#1F2937'};
        --footer-bg: ${config.footerBackground || '#F8FAFC'};
        --footer-text: ${config.footerTextColor || '#64748B'};
        --bg-color: ${config.backgroundColor || '#FFFFFF'};
        
        /* UI Element Colors */
        --button-primary: ${config.buttonPrimaryColor || '#2563EB'};
        --button-secondary: ${config.buttonSecondaryColor || '#7C3AED'};
        --button-danger: ${config.buttonDangerColor || '#DC2626'};
        --button-success: ${config.buttonSuccessColor || '#059669'};
        
        /* Text Colors */
        --text-primary: ${config.textPrimaryColor || '#111827'};
        --text-secondary: ${config.textSecondaryColor || '#374151'};
        --text-muted: ${config.textMutedColor || '#6B7280'};
        --link-color: ${config.linkColor || '#2563EB'};
        
        /* Border & Surface Colors */
        --border-color: ${config.borderColor || '#E5E7EB'};
        --card-bg: ${config.cardBackground || '#FFFFFF'};
        --input-bg: ${config.inputBackground || '#FFFFFF'};
        --input-border: ${config.inputBorderColor || '#D1D5DB'};
        
        /* Status Colors */
        --success-color: ${config.successColor || '#10B981'};
        --warning-color: ${config.warningColor || '#F59E0B'};
        --error-color: ${config.errorColor || '#EF4444'};
        --info-color: ${config.infoColor || '#06B6D4'};
        
        --primary-color-rgb: ${primaryRgb ? `${primaryRgb.r}, ${primaryRgb.g}, ${primaryRgb.b}` : '37, 99, 235'};
        --secondary-color-rgb: ${secondaryRgb ? `${secondaryRgb.r}, ${secondaryRgb.g}, ${secondaryRgb.b}` : '124, 58, 237'};
        --accent-color-rgb: ${accentRgb ? `${accentRgb.r}, ${accentRgb.g}, ${accentRgb.b}` : '6, 182, 212'};
      }
    `;
  };

  // Helper function to update local config
  const updateConfigField = (field, value) => {
    if (!localConfig) return;
    
    // Handle nested object updates (e.g., paymentSettings.paymentMethod)
    if (field.includes('.')) {
      const keys = field.split('.');
      const newConfig = JSON.parse(JSON.stringify(localConfig)); // Deep copy
      let current = newConfig;
      
      // Navigate to the nested object
      for (let i = 0; i < keys.length - 1; i++) {
        if (!current[keys[i]]) {
          current[keys[i]] = {};
        }
        current = current[keys[i]];
      }
      
      // Set the final value
      current[keys[keys.length - 1]] = value;
      console.log('Updated nested field:', field, '=', value);
      console.log('New config paymentSettings:', newConfig.paymentSettings);
      setLocalConfig(newConfig);
    } else {
      // Handle simple field updates
      const newConfig = { ...localConfig, [field]: value };
      setLocalConfig(newConfig);
    }
    
    // Apply theme changes immediately for live preview
    const themeFields = [
      'primaryColor', 'secondaryColor', 'accentColor',
      'headerBackground', 'headerTextColor', 'footerBackground', 'footerTextColor', 'backgroundColor',
      'navLinkColor', 'navLinkHoverColor', 'navActiveColor',
      'buttonPrimaryColor', 'buttonPrimaryHoverColor', 'buttonSecondaryColor', 'buttonSecondaryHoverColor', 'buttonDangerColor', 'buttonSuccessColor',
      'textPrimaryColor', 'textSecondaryColor', 'textMutedColor', 'linkColor', 'linkHoverColor',
      'borderColor', 'cardBackground', 'cardBorderColor', 'inputBackground', 'inputBorderColor', 'inputFocusBorderColor',
      'productCardBackground', 'productCardBorderColor', 'productPriceColor', 'productSalePriceColor', 'productBadgeColor',
      'successColor', 'warningColor', 'errorColor', 'infoColor',
      'formLabelColor', 'formPlaceholderColor', 'formErrorColor', 'formSuccessColor',
      'modalBackgroundColor', 'modalBorderColor', 'overlayColor',
      'hoverColor', 'shadowColor', 'gradientStart', 'gradientEnd'
    ];
    
    if (themeFields.includes(field)) {
      applyThemeCSS(newConfig);
    }
  };

  // Helper function to update nested config fields
  const updateNestedConfigField = (parentField, childField, value) => {
    const newConfig = {
      ...localConfig,
      [parentField]: {
        ...(localConfig?.[parentField] || {}),
        [childField]: value
      }
    };
    setLocalConfig(newConfig);
    
    // Apply theme changes immediately for live preview
    if (parentField === 'features' || (parentField === 'socialMedia')) {
      // Features don't need immediate CSS updates, but we could add logic here for other theme-related nested fields
    }
  };

  // Handle logo upload
  const handleLogoUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith('image/')) {
      toast.error('Please select an image file');
      return;
    }

    // Validate file size (2MB limit)
    if (file.size > 2 * 1024 * 1024) {
      toast.error('File size must be less than 2MB');
      return;
    }

    try {
      setConfigSaving(true);
      
      // Create FormData for file upload
      const formData = new FormData();
      formData.append('logo', file);

      // Upload logo to Cloudinary
      const uploadResponse = await axios.post('/api/upload/logo', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      if (uploadResponse.data.url) {
        // Update logo URL in config
        const newConfig = {
          ...localConfig,
          websiteLogo: uploadResponse.data.url,
          logoAlt: localConfig?.logoAlt || file.name.split('.')[0]
        };
        
        setLocalConfig(newConfig);
        
        // Save to server
        await axios.put('/api/superadmin/logo', {
          logoUrl: uploadResponse.data.url,
          logoAlt: newConfig.logoAlt
        });

        // Refresh config to update all users
        await refreshConfig();

        toast.success('Logo uploaded successfully!');
      }
    } catch (error) {
      console.error('Logo upload error:', error);
      toast.error(error.response?.data?.message || 'Failed to upload logo');
    } finally {
      setConfigSaving(false);
      // Reset file input
      e.target.value = '';
    }
  };

  // Save config changes to server
  const handleSaveConfig = async () => {
    if (!localConfig) return;
    
    setConfigSaving(true);
    try {
      // Flatten nested objects for the API
      const flattenedConfig = { ...localConfig };
      
      // Handle paymentSettings as a nested object
      if (localConfig.paymentSettings) {
        flattenedConfig.paymentSettings = localConfig.paymentSettings;
      }
      
      console.log('Saving config:', flattenedConfig);
      console.log('Payment settings:', flattenedConfig.paymentSettings);
      
      const result = await updateConfig(flattenedConfig);
      if (result.success) {
        toast.success('Configuration saved successfully');
        // Update the global config with the saved data to keep everything in sync
        if (result.config) {
          console.log('Updating global config with:', result.config);
          setConfig(result.config);
        }
      } else {
        console.error('Save failed:', result);
        toast.error(result.error || 'Failed to save configuration');
      }
    } catch (error) {
      console.error('Save config error:', error);
      toast.error(`Failed to save configuration: ${error.message || error}`);
    } finally {
      setConfigSaving(false);
    }
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
              id="homepage"
              label="Homepage"
              icon={FaHome}
              isActive={activeTab === 'homepage'}
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
              id="payment"
              label="Payment"
              icon={FaDollarSign}
              isActive={activeTab === 'payment'}
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

        {/* Homepage Management Tab */}
        {activeTab === 'homepage' && (
          <SuperAdminHomePage />
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
              <div className="flex gap-2">
                <button
                  onClick={() => setLocalConfig(config || localConfig)}
                  disabled={configSaving || loading}
                  className="px-3 sm:px-4 py-2 bg-gray-500 text-white text-xs sm:text-sm rounded-lg hover:bg-gray-600 transition-colors disabled:opacity-50"
                >
                  Reset
                </button>
                <button
                  onClick={handleSaveConfig}
                  disabled={configSaving || loading}
                  className="px-3 sm:px-4 py-2 bg-blue-600 text-white text-xs sm:text-sm rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
                >
                  {configSaving ? 'Saving...' : 'Save Changes'}
                </button>
              </div>
            </div>

            {loading ? (
              <div className="flex justify-center py-8">
                <FaSpinner className="w-6 h-6 text-blue-600 animate-spin" />
              </div>
            ) : (
              <div className="space-y-4 sm:space-y-6">
                {/* Basic Information */}
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 sm:p-6">
                  <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-4">Basic Information</h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1.5">Website Name</label>
                      <input
                        type="text"
                        value={localConfig?.websiteName || ''}
                        onChange={(e) => updateConfigField('websiteName', e.target.value)}
                        className="w-full px-3 py-2 text-xs sm:text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        placeholder="Enter website name"
                      />
                    </div>
                    <div>
                      <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1.5">Contact Email</label>
                      <input
                        type="email"
                        value={localConfig.contactEmail || ''}
                        onChange={(e) => updateConfigField('contactEmail', e.target.value)}
                        className="w-full px-3 py-2 text-xs sm:text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        placeholder="contact@example.com"
                      />
                    </div>
                    <div className="sm:col-span-2">
                      <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1.5">Website Description</label>
                      <textarea
                        value={localConfig.websiteDescription || ''}
                        onChange={(e) => updateConfigField('websiteDescription', e.target.value)}
                        rows="3"
                        className="w-full px-3 py-2 text-xs sm:text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        placeholder="Enter website description"
                      />
                    </div>
                  </div>
                </div>

                {/* Logo Upload */}
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 sm:p-6">
                  <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-4">Website Logo</h3>
                  <div className="space-y-4">
                    {/* Current Logo Display */}
                    <div className="flex items-center gap-4">
                      <div className="w-16 h-16 bg-gray-100 rounded-lg flex items-center justify-center overflow-hidden">
                        {localConfig?.websiteLogo ? (
                          <img 
                            src={localConfig.websiteLogo} 
                            alt={localConfig.logoAlt || 'Current Logo'} 
                            className="w-full h-full object-contain"
                          />
                        ) : (
                          <FaStore className="w-8 h-8 text-gray-400" />
                        )}
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-900">
                          {localConfig?.websiteLogo ? 'Current Logo' : 'No Logo Uploaded'}
                        </p>
                        <p className="text-xs text-gray-500">
                          {localConfig?.websiteLogo ? 'Logo is displayed in the navbar' : 'Upload a logo to replace the default icon'}
                        </p>
                      </div>
                    </div>

                    {/* Logo Upload Form */}
                    <div className="space-y-3">
                      <div>
                        <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1.5">
                          Upload New Logo
                        </label>
                        <input
                          type="file"
                          accept="image/*"
                          onChange={handleLogoUpload}
                          className="w-full px-3 py-2 text-xs sm:text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        />
                        <p className="text-xs text-gray-500 mt-1">
                          Supported formats: JPG, PNG, GIF, WebP. Max size: 2MB
                        </p>
                      </div>
                      
                      <div>
                        <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1.5">
                          Logo Alt Text
                        </label>
                        <input
                          type="text"
                          value={localConfig?.logoAlt || ''}
                          onChange={(e) => updateConfigField('logoAlt', e.target.value)}
                          className="w-full px-3 py-2 text-xs sm:text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                          placeholder="Enter alt text for accessibility"
                        />
                      </div>
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
                        value={localConfig.contactPhone || ''}
                        onChange={(e) => updateConfigField('contactPhone', e.target.value)}
                        className="w-full px-3 py-2 text-xs sm:text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        placeholder="+1 (555) 123-4567"
                      />
                    </div>
                    <div>
                      <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1.5">Contact Email</label>
                      <input
                        type="email"
                        value={localConfig.contactEmail || ''}
                        onChange={(e) => updateConfigField('contactEmail', e.target.value)}
                        className="w-full px-3 py-2 text-xs sm:text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        placeholder="contact@example.com"
                      />
                    </div>
                    <div>
                      <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1.5">Business Hours</label>
                      <input
                        type="text"
                        value={localConfig.businessHours || ''}
                        onChange={(e) => updateConfigField('businessHours', e.target.value)}
                        className="w-full px-3 py-2 text-xs sm:text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        placeholder="Mon-Fri: 9AM-6PM"
                      />
                    </div>
                    <div className="sm:col-span-2">
                      <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1.5">Address</label>
                      <textarea
                        value={localConfig.contactAddress || ''}
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
                        value={localConfig.socialMedia?.facebook || ''}
                        onChange={(e) => updateNestedConfigField('socialMedia', 'facebook', e.target.value)}
                        className="w-full px-3 py-2 text-xs sm:text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        placeholder="https://facebook.com/yourpage"
                      />
                    </div>
                    <div>
                      <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1.5">Instagram</label>
                      <input
                        type="url"
                        value={localConfig.socialMedia?.instagram || ''}
                        onChange={(e) => updateNestedConfigField('socialMedia', 'instagram', e.target.value)}
                        className="w-full px-3 py-2 text-xs sm:text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        placeholder="https://instagram.com/yourpage"
                      />
                    </div>
                    <div>
                      <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1.5">Twitter</label>
                      <input
                        type="url"
                        value={localConfig.socialMedia?.twitter || ''}
                        onChange={(e) => updateNestedConfigField('socialMedia', 'twitter', e.target.value)}
                        className="w-full px-3 py-2 text-xs sm:text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        placeholder="https://twitter.com/yourpage"
                      />
                    </div>
                    <div>
                      <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1.5">LinkedIn</label>
                      <input
                        type="url"
                        value={localConfig.socialMedia?.linkedin || ''}
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
                        value={localConfig.metaTitle || ''}
                        onChange={(e) => updateConfigField('metaTitle', e.target.value)}
                        className="w-full px-3 py-2 text-xs sm:text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        placeholder="Your Website Title"
                      />
                    </div>
                    <div>
                      <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1.5">Meta Description</label>
                      <textarea
                        value={localConfig.metaDescription || ''}
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
                        value={localConfig.metaKeywords || ''}
                        onChange={(e) => updateConfigField('metaKeywords', e.target.value)}
                        className="w-full px-3 py-2 text-xs sm:text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        placeholder="keyword1, keyword2, keyword3"
                      />
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Theme & Design Tab */}
        {activeTab === 'theme' && (
          <div className="space-y-4 sm:space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-lg sm:text-xl lg:text-2xl font-bold text-gray-900">Theme & Design</h2>
              <div className="flex gap-2">
                <button
                  onClick={() => setLocalConfig(config)}
                  disabled={configSaving || loading}
                  className="px-3 sm:px-4 py-2 bg-gray-500 text-white text-xs sm:text-sm rounded-lg hover:bg-gray-600 transition-colors disabled:opacity-50"
                >
                  Reset
                </button>
                <button
                  onClick={handleSaveConfig}
                  disabled={configSaving || loading}
                  className="px-3 sm:px-4 py-2 bg-blue-600 text-white text-xs sm:text-sm rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
                >
                  {configSaving ? 'Saving...' : 'Save Changes'}
                </button>
              </div>
            </div>

            {loading ? (
              <div className="flex justify-center py-8">
                <FaSpinner className="w-6 h-6 text-blue-600 animate-spin" />
              </div>
            ) : (
              <div className="space-y-4 sm:space-y-6">
                {/* Live Preview */}
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 sm:p-6">
                  <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-4">Live Preview</h3>
                  
        {/* Brand Colors Preview */}
        <div className="mb-6">
          <h4 className="text-sm font-medium text-gray-700 mb-3">Luxury Brand Colors</h4>
          <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
            <div className="text-center p-4 rounded-lg border-2 border-dashed border-gray-200">
              <div className="w-12 h-12 mx-auto mb-2 rounded-lg bg-blue-gradient flex items-center justify-center">
                <FaStore className="w-6 h-6 text-white" />
              </div>
              <p className="text-sm font-medium text-gray-700">Blue Gradient</p>
            </div>
            <div className="text-center p-4 rounded-lg border-2 border-dashed border-gray-200">
              <div className="w-12 h-12 mx-auto mb-2 rounded-lg bg-amber-gradient flex items-center justify-center">
                <FaStore className="w-6 h-6 text-white" />
              </div>
              <p className="text-sm font-medium text-gray-700">Amber Gradient</p>
            </div>
            <div className="text-center p-4 rounded-lg border-2 border-dashed border-gray-200">
              <div className="w-12 h-12 mx-auto mb-2 rounded-lg bg-purple-gradient flex items-center justify-center">
                <FaStore className="w-6 h-6 text-white" />
              </div>
              <p className="text-sm font-medium text-gray-700">Purple Gradient</p>
            </div>
                      <div className="text-center p-4 rounded-lg border-2 border-dashed border-gray-200">
                        <div className="flex gap-2 justify-center mb-2">
                          <div className="w-6 h-6 rounded" style={{backgroundColor: 'var(--primary-color)'}}></div>
                          <div className="w-6 h-6 rounded" style={{backgroundColor: 'var(--secondary-color)'}}></div>
                          <div className="w-6 h-6 rounded" style={{backgroundColor: 'var(--accent-color)'}}></div>
                        </div>
                        <p className="text-sm font-medium text-gray-700">Color Palette</p>
                      </div>
                    </div>
                  </div>

                  {/* Button Preview */}
                  <div className="mb-6">
                    <h4 className="text-sm font-medium text-gray-700 mb-3">Luxury Button Styles</h4>
                    <div className="flex flex-wrap gap-2">
                      <button className="btn-elegant-primary px-4 py-2 rounded-lg text-sm font-medium">Gold Primary</button>
                      <button className="btn-elegant-secondary px-4 py-2 rounded-lg text-sm font-medium">Wine Secondary</button>
                      <button className="btn-theme-success px-4 py-2 rounded-lg text-sm font-medium">Success</button>
                      <button className="btn-theme-danger px-4 py-2 rounded-lg text-sm font-medium">Danger</button>
                    </div>
                  </div>

                  {/* Text Colors Preview */}
                  <div className="mb-6">
                    <h4 className="text-sm font-medium text-gray-700 mb-3">Text Colors</h4>
                    <div className="space-y-2">
                      <p className="text-theme-primary">Primary text color - Main content</p>
                      <p className="text-theme-secondary">Secondary text color - Subtitles</p>
                      <p className="text-theme-muted">Muted text color - Less important info</p>
                      <a href="#" className="text-theme-link hover:underline">Link color - Clickable links</a>
                    </div>
                  </div>

                  {/* Status Colors Preview */}
                  <div>
                    <h4 className="text-sm font-medium text-gray-700 mb-3">Status Colors</h4>
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                      <div className="text-center p-2 rounded bg-theme-success text-white text-xs">Success</div>
                      <div className="text-center p-2 rounded bg-theme-warning text-white text-xs">Warning</div>
                      <div className="text-center p-2 rounded bg-theme-error text-white text-xs">Error</div>
                      <div className="text-center p-2 rounded bg-theme-info text-white text-xs">Info</div>
                    </div>
                  </div>
                </div>

                {/* Brand Colors */}
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 sm:p-6">
                  <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-4">Brand Colors</h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1.5">Primary Color</label>
                      <div className="flex items-center gap-2">
                        <input
                          type="color"
                          value={localConfig?.primaryColor || '#FFFFFF'}
                          onChange={(e) => updateConfigField('primaryColor', e.target.value)}
                          className="w-8 h-8 rounded border border-gray-300"
                        />
                        <input
                          type="text"
                          value={localConfig?.primaryColor || '#FFFFFF'}
                          onChange={(e) => updateConfigField('primaryColor', e.target.value)}
                          className="flex-1 px-2 py-1 text-xs border border-gray-300 rounded"
                          placeholder="#FFFFFF"
                        />
                      </div>
                    </div>
                    <div>
                      <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1.5">Secondary Color</label>
                      <div className="flex items-center gap-2">
                        <input
                          type="color"
                          value={localConfig?.secondaryColor || '#6B0F1A'}
                          onChange={(e) => updateConfigField('secondaryColor', e.target.value)}
                          className="w-8 h-8 rounded border border-gray-300"
                        />
                        <input
                          type="text"
                          value={localConfig?.secondaryColor || '#6B0F1A'}
                          onChange={(e) => updateConfigField('secondaryColor', e.target.value)}
                          className="flex-1 px-2 py-1 text-xs border border-gray-300 rounded"
                          placeholder="#6B0F1A"
                        />
                      </div>
                    </div>
                    <div>
                      <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1.5">Accent Color</label>
                      <div className="flex items-center gap-2">
                        <input
                          type="color"
                          value={localConfig?.accentColor || '#B91372'}
                          onChange={(e) => updateConfigField('accentColor', e.target.value)}
                          className="w-8 h-8 rounded border border-gray-300"
                        />
                        <input
                          type="text"
                          value={localConfig?.accentColor || '#B91372'}
                          onChange={(e) => updateConfigField('accentColor', e.target.value)}
                          className="flex-1 px-2 py-1 text-xs border border-gray-300 rounded"
                          placeholder="#B91372"
                        />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Layout Colors */}
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 sm:p-6">
                  <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-4">Layout Colors</h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1.5">Header Background</label>
                      <div className="flex items-center gap-2">
                        <input
                          type="color"
                          value={localConfig?.headerBackground || '#FFFFFF'}
                          onChange={(e) => updateConfigField('headerBackground', e.target.value)}
                          className="w-8 h-8 rounded border border-gray-300"
                        />
                        <input
                          type="text"
                          value={localConfig?.headerBackground || '#FFFFFF'}
                          onChange={(e) => updateConfigField('headerBackground', e.target.value)}
                          className="flex-1 px-2 py-1 text-xs border border-gray-300 rounded"
                          placeholder="#FFFFFF"
                        />
                      </div>
                    </div>
                    <div>
                      <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1.5">Header Text</label>
                      <div className="flex items-center gap-2">
                        <input
                          type="color"
                          value={localConfig?.headerTextColor || '#1F2937'}
                          onChange={(e) => updateConfigField('headerTextColor', e.target.value)}
                          className="w-8 h-8 rounded border border-gray-300"
                        />
                        <input
                          type="text"
                          value={localConfig?.headerTextColor || '#1F2937'}
                          onChange={(e) => updateConfigField('headerTextColor', e.target.value)}
                          className="flex-1 px-2 py-1 text-xs border border-gray-300 rounded"
                          placeholder="#1F2937"
                        />
                      </div>
                    </div>
                    <div>
                      <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1.5">Footer Background</label>
                      <div className="flex items-center gap-2">
                        <input
                          type="color"
                          value={localConfig?.footerBackground || '#1F2937'}
                          onChange={(e) => updateConfigField('footerBackground', e.target.value)}
                          className="w-8 h-8 rounded border border-gray-300"
                        />
                        <input
                          type="text"
                          value={localConfig?.footerBackground || '#1F2937'}
                          onChange={(e) => updateConfigField('footerBackground', e.target.value)}
                          className="flex-1 px-2 py-1 text-xs border border-gray-300 rounded"
                          placeholder="#1F2937"
                        />
                      </div>
                    </div>
                    <div>
                      <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1.5">Footer Text</label>
                      <div className="flex items-center gap-2">
                        <input
                          type="color"
                          value={localConfig?.footerTextColor || '#F9FAFB'}
                          onChange={(e) => updateConfigField('footerTextColor', e.target.value)}
                          className="w-8 h-8 rounded border border-gray-300"
                        />
                        <input
                          type="text"
                          value={localConfig?.footerTextColor || '#F9FAFB'}
                          onChange={(e) => updateConfigField('footerTextColor', e.target.value)}
                          className="flex-1 px-2 py-1 text-xs border border-gray-300 rounded"
                          placeholder="#F9FAFB"
                        />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Button Colors */}
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 sm:p-6">
                  <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-4">Button Colors</h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1.5">Primary Button</label>
                      <div className="flex items-center gap-2">
                        <input
                          type="color"
                          value={localConfig?.buttonPrimaryColor || '#FFD700'}
                          onChange={(e) => updateConfigField('buttonPrimaryColor', e.target.value)}
                          className="w-8 h-8 rounded border border-gray-300"
                        />
                        <input
                          type="text"
                          value={localConfig?.buttonPrimaryColor || '#FFD700'}
                          onChange={(e) => updateConfigField('buttonPrimaryColor', e.target.value)}
                          className="flex-1 px-2 py-1 text-xs border border-gray-300 rounded"
                          placeholder="#FFD700"
                        />
                      </div>
                    </div>
                    <div>
                      <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1.5">Secondary Button</label>
                      <div className="flex items-center gap-2">
                        <input
                          type="color"
                          value={localConfig?.buttonSecondaryColor || '#6B0F1A'}
                          onChange={(e) => updateConfigField('buttonSecondaryColor', e.target.value)}
                          className="w-8 h-8 rounded border border-gray-300"
                        />
                        <input
                          type="text"
                          value={localConfig?.buttonSecondaryColor || '#6B0F1A'}
                          onChange={(e) => updateConfigField('buttonSecondaryColor', e.target.value)}
                          className="flex-1 px-2 py-1 text-xs border border-gray-300 rounded"
                          placeholder="#6B0F1A"
                        />
                      </div>
                    </div>
                    <div>
                      <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1.5">Danger Button</label>
                      <div className="flex items-center gap-2">
                        <input
                          type="color"
                          value={localConfig?.buttonDangerColor || '#DC2626'}
                          onChange={(e) => updateConfigField('buttonDangerColor', e.target.value)}
                          className="w-8 h-8 rounded border border-gray-300"
                        />
                        <input
                          type="text"
                          value={localConfig?.buttonDangerColor || '#DC2626'}
                          onChange={(e) => updateConfigField('buttonDangerColor', e.target.value)}
                          className="flex-1 px-2 py-1 text-xs border border-gray-300 rounded"
                          placeholder="#DC2626"
                        />
                      </div>
                    </div>
                    <div>
                      <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1.5">Success Button</label>
                      <div className="flex items-center gap-2">
                        <input
                          type="color"
                          value={localConfig?.buttonSuccessColor || '#10B981'}
                          onChange={(e) => updateConfigField('buttonSuccessColor', e.target.value)}
                          className="w-8 h-8 rounded border border-gray-300"
                        />
                        <input
                          type="text"
                          value={localConfig?.buttonSuccessColor || '#10B981'}
                          onChange={(e) => updateConfigField('buttonSuccessColor', e.target.value)}
                          className="flex-1 px-2 py-1 text-xs border border-gray-300 rounded"
                          placeholder="#10B981"
                        />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Text Colors */}
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 sm:p-6">
                  <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-4">Text Colors</h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1.5">Primary Text</label>
                      <div className="flex items-center gap-2">
                        <input
                          type="color"
                          value={localConfig?.textPrimaryColor || '#111827'}
                          onChange={(e) => updateConfigField('textPrimaryColor', e.target.value)}
                          className="w-8 h-8 rounded border border-gray-300"
                        />
                        <input
                          type="text"
                          value={localConfig?.textPrimaryColor || '#111827'}
                          onChange={(e) => updateConfigField('textPrimaryColor', e.target.value)}
                          className="flex-1 px-2 py-1 text-xs border border-gray-300 rounded"
                          placeholder="#111827"
                        />
                      </div>
                    </div>
                    <div>
                      <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1.5">Secondary Text</label>
                      <div className="flex items-center gap-2">
                        <input
                          type="color"
                          value={localConfig?.textSecondaryColor || '#374151'}
                          onChange={(e) => updateConfigField('textSecondaryColor', e.target.value)}
                          className="w-8 h-8 rounded border border-gray-300"
                        />
                        <input
                          type="text"
                          value={localConfig?.textSecondaryColor || '#374151'}
                          onChange={(e) => updateConfigField('textSecondaryColor', e.target.value)}
                          className="flex-1 px-2 py-1 text-xs border border-gray-300 rounded"
                          placeholder="#374151"
                        />
                      </div>
                    </div>
                    <div>
                      <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1.5">Muted Text</label>
                      <div className="flex items-center gap-2">
                        <input
                          type="color"
                          value={localConfig?.textMutedColor || '#6B7280'}
                          onChange={(e) => updateConfigField('textMutedColor', e.target.value)}
                          className="w-8 h-8 rounded border border-gray-300"
                        />
                        <input
                          type="text"
                          value={localConfig?.textMutedColor || '#6B7280'}
                          onChange={(e) => updateConfigField('textMutedColor', e.target.value)}
                          className="flex-1 px-2 py-1 text-xs border border-gray-300 rounded"
                          placeholder="#6B7280"
                        />
                      </div>
                    </div>
                    <div>
                      <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1.5">Link Color</label>
                      <div className="flex items-center gap-2">
                        <input
                          type="color"
                          value={localConfig?.linkColor || '#2563EB'}
                          onChange={(e) => updateConfigField('linkColor', e.target.value)}
                          className="w-8 h-8 rounded border border-gray-300"
                        />
                        <input
                          type="text"
                          value={localConfig?.linkColor || '#2563EB'}
                          onChange={(e) => updateConfigField('linkColor', e.target.value)}
                          className="flex-1 px-2 py-1 text-xs border border-gray-300 rounded"
                          placeholder="#2563EB"
                        />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Surface & Border Colors */}
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 sm:p-6">
                  <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-4">Surface & Border Colors</h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1.5">Card Background</label>
                      <div className="flex items-center gap-2">
                        <input
                          type="color"
                          value={localConfig?.cardBackground || '#FFFFFF'}
                          onChange={(e) => updateConfigField('cardBackground', e.target.value)}
                          className="w-8 h-8 rounded border border-gray-300"
                        />
                        <input
                          type="text"
                          value={localConfig?.cardBackground || '#FFFFFF'}
                          onChange={(e) => updateConfigField('cardBackground', e.target.value)}
                          className="flex-1 px-2 py-1 text-xs border border-gray-300 rounded"
                          placeholder="#FFFFFF"
                        />
                      </div>
                    </div>
                    <div>
                      <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1.5">Border Color</label>
                      <div className="flex items-center gap-2">
                        <input
                          type="color"
                          value={localConfig?.borderColor || '#E5E7EB'}
                          onChange={(e) => updateConfigField('borderColor', e.target.value)}
                          className="w-8 h-8 rounded border border-gray-300"
                        />
                        <input
                          type="text"
                          value={localConfig?.borderColor || '#E5E7EB'}
                          onChange={(e) => updateConfigField('borderColor', e.target.value)}
                          className="flex-1 px-2 py-1 text-xs border border-gray-300 rounded"
                          placeholder="#E5E7EB"
                        />
                      </div>
                    </div>
                    <div>
                      <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1.5">Input Background</label>
                      <div className="flex items-center gap-2">
                        <input
                          type="color"
                          value={localConfig?.inputBackground || '#FFFFFF'}
                          onChange={(e) => updateConfigField('inputBackground', e.target.value)}
                          className="w-8 h-8 rounded border border-gray-300"
                        />
                        <input
                          type="text"
                          value={localConfig?.inputBackground || '#FFFFFF'}
                          onChange={(e) => updateConfigField('inputBackground', e.target.value)}
                          className="flex-1 px-2 py-1 text-xs border border-gray-300 rounded"
                          placeholder="#FFFFFF"
                        />
                      </div>
                    </div>
                    <div>
                      <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1.5">Input Border</label>
                      <div className="flex items-center gap-2">
                        <input
                          type="color"
                          value={localConfig?.inputBorderColor || '#D1D5DB'}
                          onChange={(e) => updateConfigField('inputBorderColor', e.target.value)}
                          className="w-8 h-8 rounded border border-gray-300"
                        />
                        <input
                          type="text"
                          value={localConfig?.inputBorderColor || '#D1D5DB'}
                          onChange={(e) => updateConfigField('inputBorderColor', e.target.value)}
                          className="flex-1 px-2 py-1 text-xs border border-gray-300 rounded"
                          placeholder="#D1D5DB"
                        />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Status Colors */}
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 sm:p-6">
                  <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-4">Status Colors</h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1.5">Success Color</label>
                      <div className="flex items-center gap-2">
                        <input
                          type="color"
                          value={localConfig?.successColor || '#10B981'}
                          onChange={(e) => updateConfigField('successColor', e.target.value)}
                          className="w-8 h-8 rounded border border-gray-300"
                        />
                        <input
                          type="text"
                          value={localConfig?.successColor || '#10B981'}
                          onChange={(e) => updateConfigField('successColor', e.target.value)}
                          className="flex-1 px-2 py-1 text-xs border border-gray-300 rounded"
                          placeholder="#10B981"
                        />
                      </div>
                    </div>
                    <div>
                      <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1.5">Warning Color</label>
                      <div className="flex items-center gap-2">
                        <input
                          type="color"
                          value={localConfig?.warningColor || '#F59E0B'}
                          onChange={(e) => updateConfigField('warningColor', e.target.value)}
                          className="w-8 h-8 rounded border border-gray-300"
                        />
                        <input
                          type="text"
                          value={localConfig?.warningColor || '#F59E0B'}
                          onChange={(e) => updateConfigField('warningColor', e.target.value)}
                          className="flex-1 px-2 py-1 text-xs border border-gray-300 rounded"
                          placeholder="#F59E0B"
                        />
                      </div>
                    </div>
                    <div>
                      <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1.5">Error Color</label>
                      <div className="flex items-center gap-2">
                        <input
                          type="color"
                          value={localConfig?.errorColor || '#EF4444'}
                          onChange={(e) => updateConfigField('errorColor', e.target.value)}
                          className="w-8 h-8 rounded border border-gray-300"
                        />
                        <input
                          type="text"
                          value={localConfig?.errorColor || '#EF4444'}
                          onChange={(e) => updateConfigField('errorColor', e.target.value)}
                          className="flex-1 px-2 py-1 text-xs border border-gray-300 rounded"
                          placeholder="#EF4444"
                        />
                      </div>
                    </div>
                    <div>
                      <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1.5">Info Color</label>
                      <div className="flex items-center gap-2">
                        <input
                          type="color"
                          value={localConfig?.infoColor || '#06B6D4'}
                          onChange={(e) => updateConfigField('infoColor', e.target.value)}
                          className="w-8 h-8 rounded border border-gray-300"
                        />
                        <input
                          type="text"
                          value={localConfig?.infoColor || '#06B6D4'}
                          onChange={(e) => updateConfigField('infoColor', e.target.value)}
                          className="flex-1 px-2 py-1 text-xs border border-gray-300 rounded"
                          placeholder="#06B6D4"
                        />
                      </div>
                    </div>
                  </div>
                </div>

        {/* Luxury Gradients */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 sm:p-6">
          <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-4">Luxury Gradients</h3>
          <div className="space-y-4">
            <div>
              <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1.5">Blue Gradient (Headers & Sidebar)</label>
              <div className="flex items-center gap-2">
                <div
                  className="w-8 h-8 rounded border border-gray-300"
                  style={{background: localConfig?.blueGradient || 'linear-gradient(135deg, #2563EB 0%, #1D4ED8 100%)'}}
                ></div>
                <input
                  type="text"
                  value={localConfig?.blueGradient || 'linear-gradient(135deg, #2563EB 0%, #1D4ED8 100%)'}
                  onChange={(e) => updateConfigField('blueGradient', e.target.value)}
                  className="flex-1 px-2 py-1 text-xs border border-gray-300 rounded"
                  placeholder="linear-gradient(135deg, #2563EB 0%, #1D4ED8 100%)"
                />
              </div>
              <p className="text-xs text-gray-500 mt-1">Used for headers, hero sections, and sidebar accents</p>
            </div>
                    
                    <div>
                      <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1.5">Amber Gradient (Call-to-Action)</label>
                      <div className="flex items-center gap-2">
                        <div
                          className="w-8 h-8 rounded border border-gray-300"
                          style={{background: localConfig?.amberGradient || 'linear-gradient(135deg, #F59E0B 0%, #D97706 100%)'}}
                        ></div>
                        <input
                          type="text"
                          value={localConfig?.amberGradient || 'linear-gradient(135deg, #F59E0B 0%, #D97706 100%)'}
                          onChange={(e) => updateConfigField('amberGradient', e.target.value)}
                          className="flex-1 px-2 py-1 text-xs border border-gray-300 rounded"
                          placeholder="linear-gradient(135deg, #F59E0B 0%, #D97706 100%)"
                        />
                      </div>
                      <p className="text-xs text-gray-500 mt-1">Used for buttons, hover states, and highlights</p>
                    </div>
                    
                    <div>
                      <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1.5">Purple Gradient (Special Elements)</label>
                      <div className="flex items-center gap-2">
                        <div
                          className="w-8 h-8 rounded border border-gray-300"
                          style={{background: localConfig?.purpleGradient || 'linear-gradient(135deg, #7C3AED 0%, #6D28D9 100%)'}}
                        ></div>
                        <input
                          type="text"
                          value={localConfig?.purpleGradient || 'linear-gradient(135deg, #7C3AED 0%, #6D28D9 100%)'}
                          onChange={(e) => updateConfigField('purpleGradient', e.target.value)}
                          className="flex-1 px-2 py-1 text-xs border border-gray-300 rounded"
                          placeholder="linear-gradient(135deg, #7C3AED 0%, #6D28D9 100%)"
                        />
                      </div>
                      <p className="text-xs text-gray-500 mt-1">Used for premium elements and special highlights</p>
                    </div>
                  </div>
                </div>

                {/* Advanced Theme Colors */}
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 sm:p-6">
                  <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-4">Advanced Colors</h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1.5">Hover Color</label>
                      <div className="flex items-center gap-2">
                        <input
                          type="color"
                          value={localConfig?.hoverColor || '#1D4ED8'}
                          onChange={(e) => updateConfigField('hoverColor', e.target.value)}
                          className="w-8 h-8 rounded border border-gray-300"
                        />
                        <input
                          type="text"
                          value={localConfig?.hoverColor || '#1D4ED8'}
                          onChange={(e) => updateConfigField('hoverColor', e.target.value)}
                          className="flex-1 px-2 py-1 text-xs border border-gray-300 rounded"
                          placeholder="#1D4ED8"
                        />
                      </div>
                    </div>
                    <div>
                      <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1.5">Shadow Color</label>
                      <div className="flex items-center gap-2">
                        <input
                          type="color"
                          value={localConfig?.shadowColor || 'rgba(37, 99, 235, 0.1)'}
                          onChange={(e) => updateConfigField('shadowColor', e.target.value)}
                          className="w-8 h-8 rounded border border-gray-300"
                        />
                        <input
                          type="text"
                          value={localConfig?.shadowColor || 'rgba(37, 99, 235, 0.1)'}
                          onChange={(e) => updateConfigField('shadowColor', e.target.value)}
                          className="flex-1 px-2 py-1 text-xs border border-gray-300 rounded"
                          placeholder="rgba(37, 99, 235, 0.1)"
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
                        checked={localConfig.features?.wishlist || true}
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
                        checked={localConfig.features?.reviews || true}
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
                        checked={localConfig.features?.darkMode || false}
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
                        checked={localConfig.features?.socialLogin || true}
                        onChange={(e) => updateNestedConfigField('features', 'socialLogin', e.target.checked)}
                        className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
                      />
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Payment Settings Tab */}
        {activeTab === 'payment' && (
          <div className="space-y-4 sm:space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-lg sm:text-xl lg:text-2xl font-bold text-gray-900">Payment Settings</h2>
              <div className="flex gap-2">
                <button
                  onClick={() => setLocalConfig(config)}
                  disabled={configSaving || loading}
                  className="px-3 sm:px-4 py-2 bg-gray-500 text-white text-xs sm:text-sm rounded-lg hover:bg-gray-600 transition-colors disabled:opacity-50"
                >
                  Reset
                </button>
                <button
                  onClick={handleSaveConfig}
                  disabled={configSaving || loading}
                  className="px-3 sm:px-4 py-2 bg-blue-600 text-white text-xs sm:text-sm rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
                >
                  {configSaving ? 'Saving...' : 'Save Changes'}
                </button>
              </div>
            </div>

            {/* Payment Method Selection */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 sm:p-6">
              <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-4">Payment Method</h3>
              <div className="mb-4 p-2 bg-gray-100 rounded text-xs">
                <strong>Debug Info:</strong><br/>
                Current paymentMethod: {localConfig?.paymentSettings?.paymentMethod || 'undefined'}<br/>
                PaymentSettings: {JSON.stringify(localConfig?.paymentSettings || {})}
              </div>
              <div className="space-y-3">
                {/* Payment Gateway Option */}
                <label className={`flex items-center p-4 border-2 rounded-lg cursor-pointer transition-all duration-200 hover:shadow-md ${
                  localConfig?.paymentSettings?.paymentMethod === 'gateway' 
                    ? 'border-blue-500 bg-blue-50' 
                    : 'border-gray-200 hover:border-gray-300'
                }`}>
                  <input
                    type="radio"
                    name="paymentMethod"
                    value="gateway"
                    checked={localConfig?.paymentSettings?.paymentMethod === 'gateway'}
                    onChange={(e) => {
                      console.log('Gateway radio clicked:', e.target.value);
                      updateConfigField('paymentSettings.paymentMethod', e.target.value);
                    }}
                    className="w-4 h-4 text-blue-600 focus:ring-blue-500"
                  />
                  <div className="ml-3 flex items-center">
                    <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center mr-3">
                      <FaDollarSign className="w-4 h-4 text-blue-600" />
                    </div>
                    <div>
                      <div className="text-sm sm:text-base font-medium text-gray-900">Payment Gateway (Razorpay)</div>
                      <div className="text-xs text-gray-500">Secure online payments with multiple options</div>
                    </div>
                  </div>
                </label>

                {/* WhatsApp Option */}
                <label className={`flex items-center p-4 border-2 rounded-lg cursor-pointer transition-all duration-200 hover:shadow-md ${
                  localConfig?.paymentSettings?.paymentMethod === 'whatsapp' 
                    ? 'border-green-500 bg-green-50' 
                    : 'border-gray-200 hover:border-gray-300'
                }`}>
                  <input
                    type="radio"
                    name="paymentMethod"
                    value="whatsapp"
                    checked={localConfig?.paymentSettings?.paymentMethod === 'whatsapp'}
                    onChange={(e) => {
                      console.log('WhatsApp radio clicked:', e.target.value);
                      updateConfigField('paymentSettings.paymentMethod', e.target.value);
                    }}
                    className="w-4 h-4 text-green-600 focus:ring-green-500"
                  />
                  <div className="ml-3 flex items-center">
                    <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center mr-3">
                      <span className="text-green-600 text-sm font-bold">W</span>
                    </div>
                    <div>
                      <div className="text-sm sm:text-base font-medium text-gray-900">WhatsApp Orders</div>
                      <div className="text-xs text-gray-500">Customers send orders via WhatsApp message</div>
                    </div>
                  </div>
                </label>

                {/* Instagram Option */}
                <label className={`flex items-center p-4 border-2 rounded-lg cursor-pointer transition-all duration-200 hover:shadow-md ${
                  localConfig?.paymentSettings?.paymentMethod === 'instagram' 
                    ? 'border-purple-500 bg-purple-50' 
                    : 'border-gray-200 hover:border-gray-300'
                }`}>
                  <input
                    type="radio"
                    name="paymentMethod"
                    value="instagram"
                    checked={localConfig?.paymentSettings?.paymentMethod === 'instagram'}
                    onChange={(e) => {
                      console.log('Instagram radio clicked:', e.target.value);
                      updateConfigField('paymentSettings.paymentMethod', e.target.value);
                    }}
                    className="w-4 h-4 text-purple-600 focus:ring-purple-500"
                  />
                  <div className="ml-3 flex items-center">
                    <div className="w-8 h-8 bg-gradient-to-r from-purple-100 to-pink-100 rounded-lg flex items-center justify-center mr-3">
                      <span className="text-purple-600 text-sm font-bold">I</span>
                    </div>
                    <div>
                      <div className="text-sm sm:text-base font-medium text-gray-900">Instagram Orders</div>
                      <div className="text-xs text-gray-500">Customers send orders via Instagram DM</div>
                    </div>
                  </div>
                </label>
              </div>
            </div>

            {/* WhatsApp Settings */}
            {localConfig?.paymentSettings?.paymentMethod === 'whatsapp' && (
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 sm:p-6">
                <div className="flex items-center mb-4">
                  <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center mr-3">
                    <span className="text-green-600 text-sm font-bold">W</span>
                  </div>
                  <h3 className="text-base sm:text-lg font-semibold text-gray-900">WhatsApp Configuration</h3>
                </div>
                <div className="space-y-4">
                  <div>
                    <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1.5">
                      WhatsApp Number *
                    </label>
                    <div className="relative">
                      <input
                        type="tel"
                        value={localConfig?.paymentSettings?.whatsappNumber || ''}
                        onChange={(e) => updateConfigField('paymentSettings.whatsappNumber', e.target.value)}
                        placeholder="+1234567890"
                        className="w-full px-3 py-2 text-xs sm:text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                      />
                      <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                        <span className="text-green-500 text-sm">📱</span>
                      </div>
                    </div>
                    <p className="text-xs text-gray-500 mt-1">
                      Include country code (e.g., +1234567890)
                    </p>
                    {localConfig?.paymentSettings?.whatsappNumber && (
                      <p className="text-xs text-green-600 mt-1">
                        ✓ WhatsApp number configured
                      </p>
                    )}
                  </div>
                  <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                    <h4 className="text-sm font-semibold text-green-800 mb-2">How WhatsApp Orders Work:</h4>
                    <ul className="text-xs sm:text-sm text-green-700 space-y-1">
                      <li>• Customer adds items to cart and proceeds to checkout</li>
                      <li>• They select "WhatsApp Order" as payment method</li>
                      <li>• System generates a detailed order message with all items and customer details</li>
                      <li>• Customer is redirected to WhatsApp with pre-filled message</li>
                      <li>• You receive the order details and can process payment manually</li>
                    </ul>
                  </div>
                </div>
              </div>
            )}

            {/* Instagram Settings */}
            {localConfig?.paymentSettings?.paymentMethod === 'instagram' && (
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 sm:p-6">
                <div className="flex items-center mb-4">
                  <div className="w-8 h-8 bg-gradient-to-r from-purple-100 to-pink-100 rounded-lg flex items-center justify-center mr-3">
                    <span className="text-purple-600 text-sm font-bold">I</span>
                  </div>
                  <h3 className="text-base sm:text-lg font-semibold text-gray-900">Instagram Configuration</h3>
                </div>
                <div className="space-y-4">
                  <div>
                    <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1.5">
                      Instagram Username *
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <span className="text-gray-500 text-sm">@</span>
                      </div>
                      <input
                        type="text"
                        value={localConfig?.paymentSettings?.instagramUsername || ''}
                        onChange={(e) => updateConfigField('paymentSettings.instagramUsername', e.target.value)}
                        placeholder="yourusername"
                        className="w-full pl-8 pr-3 py-2 text-xs sm:text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                      />
                      <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                        <span className="text-purple-500 text-sm">📸</span>
                      </div>
                    </div>
                    <p className="text-xs text-gray-500 mt-1">
                      Enter without @ symbol (e.g., yourusername)
                    </p>
                    {localConfig?.paymentSettings?.instagramUsername && (
                      <p className="text-xs text-purple-600 mt-1">
                        ✓ Instagram username configured
                      </p>
                    )}
                  </div>
                  <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
                    <h4 className="text-sm font-semibold text-purple-800 mb-2">How Instagram Orders Work:</h4>
                    <ul className="text-xs sm:text-sm text-purple-700 space-y-1">
                      <li>• Customer adds items to cart and proceeds to checkout</li>
                      <li>• They select "Instagram Order" as payment method</li>
                      <li>• System generates a detailed order message with all items and customer details</li>
                      <li>• Customer is redirected to Instagram DM with pre-filled message</li>
                      <li>• You receive the order details and can process payment manually</li>
                    </ul>
                  </div>
                </div>
              </div>
            )}

            {/* Payment Gateway Settings */}
            {localConfig?.paymentSettings?.paymentMethod === 'gateway' && (
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 sm:p-6">
                <div className="flex items-center mb-4">
                  <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center mr-3">
                    <FaDollarSign className="w-4 h-4 text-blue-600" />
                  </div>
                  <h3 className="text-base sm:text-lg font-semibold text-gray-900">Payment Gateway Settings</h3>
                </div>
                <div className="space-y-4">
                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                    <div className="flex items-center mb-2">
                      <div className="w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center mr-2">
                        <span className="text-white text-xs font-bold">R</span>
                      </div>
                      <h4 className="text-sm font-semibold text-blue-800">Razorpay Payment Gateway</h4>
                    </div>
                    <p className="text-xs sm:text-sm text-blue-700">
                      Your payment gateway is configured and ready to process secure online payments.
                    </p>
                  </div>
                  
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="bg-gray-50 rounded-lg p-3">
                      <h5 className="text-sm font-medium text-gray-900 mb-2">Payment Methods</h5>
                      <ul className="text-xs text-gray-600 space-y-1">
                        <li>• Credit/Debit Cards</li>
                        <li>• Net Banking</li>
                        <li>• UPI Payments</li>
                        <li>• Digital Wallets</li>
                      </ul>
                    </div>
                    <div className="bg-gray-50 rounded-lg p-3">
                      <h5 className="text-sm font-medium text-gray-900 mb-2">Security Features</h5>
                      <ul className="text-xs text-gray-600 space-y-1">
                        <li>• SSL Encryption</li>
                        <li>• PCI DSS Compliant</li>
                        <li>• Fraud Protection</li>
                        <li>• Real-time Monitoring</li>
                      </ul>
                    </div>
                  </div>
                  
                  <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                    <h4 className="text-sm font-semibold text-green-800 mb-2">How Gateway Payments Work:</h4>
                    <ul className="text-xs sm:text-sm text-green-700 space-y-1">
                      <li>• Customer selects payment method at checkout</li>
                      <li>• They are redirected to secure Razorpay payment page</li>
                      <li>• Payment is processed securely with multiple options</li>
                      <li>• Order is automatically confirmed upon successful payment</li>
                      <li>• You receive payment confirmation and order details</li>
                    </ul>
                  </div>
                </div>
              </div>
            )}

            {/* Live Preview */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 sm:p-6">
              <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-4">Live Preview</h3>
              <div className="space-y-4">
                <div className="p-4 bg-gray-50 rounded-lg">
                  <h4 className="text-sm font-medium text-gray-900 mb-3">Current Payment Method:</h4>
                  <div className="flex items-center gap-3">
                    {localConfig?.paymentSettings?.paymentMethod === 'gateway' && (
                      <>
                        <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                          <FaDollarSign className="w-4 h-4 text-blue-600" />
                        </div>
                        <div>
                          <div className="text-sm font-medium text-gray-900">Payment Gateway (Razorpay)</div>
                          <div className="text-xs text-gray-500">Secure online payments with multiple options</div>
                        </div>
                      </>
                    )}
                    {localConfig?.paymentSettings?.paymentMethod === 'whatsapp' && (
                      <>
                        <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center">
                          <span className="text-green-600 text-sm font-bold">W</span>
                        </div>
                        <div>
                          <div className="text-sm font-medium text-gray-900">WhatsApp Orders</div>
                          <div className="text-xs text-gray-500">
                            {localConfig?.paymentSettings?.whatsappNumber 
                              ? `Orders via ${localConfig.paymentSettings.whatsappNumber}`
                              : 'WhatsApp number not configured'
                            }
                          </div>
                        </div>
                      </>
                    )}
                    {localConfig?.paymentSettings?.paymentMethod === 'instagram' && (
                      <>
                        <div className="w-8 h-8 bg-gradient-to-r from-purple-100 to-pink-100 rounded-lg flex items-center justify-center">
                          <span className="text-purple-600 text-sm font-bold">I</span>
                        </div>
                        <div>
                          <div className="text-sm font-medium text-gray-900">Instagram Orders</div>
                          <div className="text-xs text-gray-500">
                            {localConfig?.paymentSettings?.instagramUsername 
                              ? `Orders via @${localConfig.paymentSettings.instagramUsername}`
                              : 'Instagram username not configured'
                            }
                          </div>
                        </div>
                      </>
                    )}
                  </div>
                </div>
                
                {/* Configuration Status */}
                <div className="p-4 bg-blue-50 rounded-lg">
                  <h4 className="text-sm font-medium text-blue-900 mb-2">Configuration Status:</h4>
                  <div className="space-y-2">
                    {localConfig?.paymentSettings?.paymentMethod === 'whatsapp' && (
                      <div className="flex items-center gap-2">
                        {localConfig?.paymentSettings?.whatsappNumber ? (
                          <span className="text-green-600 text-sm">✓</span>
                        ) : (
                          <span className="text-red-600 text-sm">✗</span>
                        )}
                        <span className="text-xs text-blue-800">
                          WhatsApp number {localConfig?.paymentSettings?.whatsappNumber ? 'configured' : 'required'}
                        </span>
                      </div>
                    )}
                    {localConfig?.paymentSettings?.paymentMethod === 'instagram' && (
                      <div className="flex items-center gap-2">
                        {localConfig?.paymentSettings?.instagramUsername ? (
                          <span className="text-green-600 text-sm">✓</span>
                        ) : (
                          <span className="text-red-600 text-sm">✗</span>
                        )}
                        <span className="text-xs text-blue-800">
                          Instagram username {localConfig?.paymentSettings?.instagramUsername ? 'configured' : 'required'}
                        </span>
                      </div>
                    )}
                    {localConfig?.paymentSettings?.paymentMethod === 'gateway' && (
                      <div className="flex items-center gap-2">
                        <span className="text-green-600 text-sm">✓</span>
                        <span className="text-xs text-blue-800">Payment gateway ready to use</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
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
                  checked={localConfig?.maintenanceMode || false}
                  onChange={(e) => updateConfigField('maintenanceMode', e.target.checked)}
                  className="w-4 h-4 text-yellow-600 rounded focus:ring-yellow-500"
                />
              </div>
              {localConfig?.maintenanceMode && (
                <div className="mt-4">
                  <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1.5">Maintenance Message</label>
                  <textarea
                    value={localConfig.maintenanceMessage || ''}
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
