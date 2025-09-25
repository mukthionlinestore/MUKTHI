import React, { createContext, useContext, useState, useEffect } from 'react';
import axios from '../config/axios';

const WebsiteConfigContext = createContext();

export const useWebsiteConfig = () => {
  const context = useContext(WebsiteConfigContext);
  if (!context) {
    throw new Error('useWebsiteConfig must be used within a WebsiteConfigProvider');
  }
  return context;
};

export const WebsiteConfigProvider = ({ children }) => {
  const [config, setConfig] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Default configuration
  const defaultConfig = {
    websiteName: 'E-Shop',
    websiteDescription: 'Your premium online shopping destination',
    contactEmail: 'contact@eshop.com',
    contactPhone: '+1 (555) 123-4567',
    contactAddress: '123 Business St, City, State 12345',
    businessHours: 'Mon-Fri: 9AM-6PM',
    primaryColor: '#10B981',
    secondaryColor: '#059669',
    accentColor: '#0D9488',
    headerBackground: '#FFFFFF',
    headerTextColor: '#1F2937',
    footerBackground: '#1F2937',
    footerTextColor: '#F9FAFB',
    backgroundColor: '#F0FDF4',
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
      newsletter: true,
      guestCheckout: true,
      socialLogin: true,
      darkMode: false
    },
    maintenanceMode: false,
    maintenanceMessage: 'We are currently performing maintenance. Please check back later.'
  };

  // Fetch website configuration
  const fetchConfig = async () => {
    try {
      setLoading(true);
      // Try to fetch config, but don't fail if unauthorized
      const response = await axios.get('/api/superadmin/config');
      setConfig({ ...defaultConfig, ...response.data });
      setError(null);
    } catch (err) {
      // If it's an auth error, just use default config silently
      if (err.response?.status === 401 || err.response?.status === 403) {
        console.log('Using default website config (not authenticated as super admin)');
        setConfig(defaultConfig);
        setError(null);
      } else {
        console.error('Failed to fetch website config:', err);
        setConfig(defaultConfig);
        setError('Failed to load website configuration');
      }
    } finally {
      setLoading(false);
    }
  };

  // Update website configuration
  const updateConfig = async (newConfig) => {
    try {
      const response = await axios.put('/api/superadmin/config', newConfig);
      setConfig({ ...defaultConfig, ...response.data.config });
      return { success: true };
    } catch (err) {
      console.error('Failed to update website config:', err);
      return { success: false, error: err.response?.data?.message || 'Failed to update configuration' };
    }
  };

  // Get CSS custom properties for theme colors
  const getThemeCSS = () => {
    if (!config) return '';
    
    return `
      :root {
        --primary-color: ${config.primaryColor};
        --secondary-color: ${config.secondaryColor};
        --accent-color: ${config.accentColor};
        --header-bg: ${config.headerBackground};
        --header-text: ${config.headerTextColor};
        --footer-bg: ${config.footerBackground};
        --footer-text: ${config.footerTextColor};
        --bg-color: ${config.backgroundColor};
      }
    `;
  };

  // Check if a feature is enabled
  const isFeatureEnabled = (featureName) => {
    return config?.features?.[featureName] ?? true;
  };

  // Get website metadata
  const getMetadata = () => {
    if (!config) return {};
    
    return {
      title: config.metaTitle,
      description: config.metaDescription,
      keywords: config.metaKeywords,
      websiteName: config.websiteName
    };
  };

  // Check if maintenance mode is enabled
  const isMaintenanceMode = () => {
    return config?.maintenanceMode ?? false;
  };

  // Get maintenance message
  const getMaintenanceMessage = () => {
    return config?.maintenanceMessage || 'We are currently performing maintenance. Please check back later.';
  };

  // Initialize configuration on mount
  useEffect(() => {
    fetchConfig();
  }, []);

  // Apply theme CSS to document
  useEffect(() => {
    if (config) {
      const styleId = 'website-theme-styles';
      let styleElement = document.getElementById(styleId);
      
      if (!styleElement) {
        styleElement = document.createElement('style');
        styleElement.id = styleId;
        document.head.appendChild(styleElement);
      }
      
      styleElement.textContent = getThemeCSS();
    }
  }, [config]);

  const value = {
    config,
    loading,
    error,
    updateConfig,
    fetchConfig,
    isFeatureEnabled,
    getMetadata,
    isMaintenanceMode,
    getMaintenanceMessage,
    getThemeCSS
  };

  return (
    <WebsiteConfigContext.Provider value={value}>
      {children}
    </WebsiteConfigContext.Provider>
  );
};
