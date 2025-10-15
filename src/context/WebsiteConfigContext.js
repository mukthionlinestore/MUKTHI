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
    websiteName: 'MUKHTI',
    websiteDescription: 'Gracefully unbound - Premium lifestyle and fashion destination',
    contactEmail: 'contact@mukhti.com',
    contactPhone: '+1 (555) 123-4567',
    contactAddress: '123 Business St, City, State 12345',
    businessHours: 'Mon-Fri: 9AM-6PM',
    
    // Main Brand Colors - Luxury White & Vibrant Theme
    primaryColor: '#FFFFFF', // Pure white primary
    secondaryColor: '#2563EB', // Bright blue
    accentColor: '#F59E0B', // Vibrant amber
    tertiaryColor: '#7C3AED', // Rich purple
    quaternaryColor: '#059669', // Emerald green
    
    // Layout Colors
    headerBackground: '#FFFFFF', // Pure white header
    headerTextColor: '#1C1C1C', // Almost black text on white
    footerBackground: '#F9F9F9', // Off-white footer
    footerTextColor: '#555555', // Medium gray text in footer
    backgroundColor: '#FFFFFF', // Pure white background
    
    // Navigation Colors
    navLinkColor: '#1F2937', // Dark gray nav links
    navLinkHoverColor: '#2563EB', // Bright blue on hover
    navActiveColor: '#7C3AED', // Purple for active

    // UI Element Colors
    buttonPrimaryColor: '#2563EB', // Bright blue primary buttons
    buttonPrimaryHoverColor: '#1D4ED8', // Darker blue on hover
    buttonSecondaryColor: '#7C3AED', // Purple secondary buttons
    buttonSecondaryHoverColor: '#6D28D9', // Darker purple on hover
    buttonAccentColor: '#F59E0B', // Amber accent buttons
    buttonAccentHoverColor: '#D97706', // Darker amber on hover
    buttonDangerColor: '#DC2626', // Red for danger
    buttonSuccessColor: '#059669', // Green for success
    
    // Text Colors
    textPrimaryColor: '#1F2937', // Dark gray primary text
    textSecondaryColor: '#6B7280', // Medium gray secondary text
    textMutedColor: '#9CA3AF', // Light gray for muted text
    textAccentColor: '#2563EB', // Blue accent text
    textHighlightColor: '#7C3AED', // Purple highlight text
    linkColor: '#2563EB', // Blue links
    linkHoverColor: '#7C3AED', // Purple on hover
    
    // Border & Surface Colors
    borderColor: '#E5E5E5', // Soft gray borders
    cardBackground: '#FFFFFF', // Pure white cards
    cardBorderColor: '#E5E5E5', // Soft gray card borders
    inputBackground: '#FFFFFF', // White inputs
    inputBorderColor: '#E5E5E5', // Soft gray input borders
    inputFocusBorderColor: '#2563EB', // Blue focus

    // Product Colors
    productCardBackground: '#FFFFFF',
    productCardBorderColor: '#E5E5E5',
    productPriceColor: '#1F2937',
    productSalePriceColor: '#2563EB',
    productBadgeColor: '#F59E0B',
    
    // Status Colors
    successColor: '#10B981',
    warningColor: '#F59E0B',
    errorColor: '#EF4444',
    infoColor: '#06B6D4',
    
    // Advanced Colors
    hoverColor: '#2563EB', // Blue for hovers
    shadowColor: 'rgba(37, 99, 235, 0.1)', // Blue shadow
    gradientStart: '#2563EB', // Blue gradient start
    gradientEnd: '#7C3AED', // Purple gradient end

    // Luxury Gradients
    blueGradient: 'linear-gradient(135deg, #2563EB 0%, #1D4ED8 100%)',
    amberGradient: 'linear-gradient(135deg, #F59E0B 0%, #D97706 100%)',
    purpleGradient: 'linear-gradient(135deg, #7C3AED 0%, #6D28D9 100%)',
    emeraldGradient: 'linear-gradient(135deg, #059669 0%, #047857 100%)',
    luxuryGradient: 'linear-gradient(135deg, #2563EB 0%, #7C3AED 50%, #F59E0B 100%)',
    premiumGradient: 'linear-gradient(135deg, #F59E0B 0%, #7C3AED 50%, #2563EB 100%)',
    
    // Form Colors
    formLabelColor: '#1C1C1C',
    formPlaceholderColor: '#555555',
    formErrorColor: '#EF4444',
    formSuccessColor: '#10B981',
    
    // Modal & Overlay Colors
    modalBackgroundColor: '#FFFFFF',
    modalBorderColor: '#E5E5E5',
    overlayColor: 'rgba(0, 0, 0, 0.5)',
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
    maintenanceMessage: 'We are currently performing maintenance. Please check back later.',
    
    // Payment Settings
    paymentSettings: {
      paymentMethod: 'gateway', // 'gateway', 'whatsapp', 'instagram'
      whatsappNumber: '', // WhatsApp number for orders
      instagramUsername: '', // Instagram username for orders
      paymentGatewayEnabled: true,
      whatsappEnabled: false,
      instagramEnabled: false
    }
  };

  // Fetch website configuration
  const fetchConfig = async () => {
    try {
      setLoading(true);
      
      // Check if user is authenticated as super admin
      const token = localStorage.getItem('token');
      const isSuperAdmin = token && localStorage.getItem('userRole') === 'superadmin';
      
      let response;
      if (isSuperAdmin) {
        // Use authenticated endpoint for super admin (includes all config)
        response = await axios.get('/api/superadmin/config');
      } else {
        // Use public endpoint for regular users (includes logo and public config)
        response = await axios.get('/api/superadmin/public-config');
      }
      
      setConfig({ ...defaultConfig, ...response.data });
      setError(null);
    } catch (err) {
      console.error('Failed to fetch website config:', err);
      setConfig(defaultConfig);
      setError('Failed to load website configuration');
    } finally {
      setLoading(false);
    }
  };

  // Update website configuration
  const updateConfig = async (newConfig) => {
    try {
      console.log('Sending config to API:', newConfig);
      const response = await axios.put('/api/superadmin/config', newConfig);
      console.log('API response:', response.data);
      
      // Refresh the global config to ensure all components get the updated data
      await fetchConfig();
      
      return { success: true, config: response.data.config };
    } catch (err) {
      console.error('Failed to update website config:', err);
      console.error('Error response:', err.response?.data);
      console.error('Error status:', err.response?.status);
      return { success: false, error: err.response?.data?.message || err.response?.data?.error || 'Failed to update configuration' };
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

  // Get CSS custom properties for theme colors
  const getThemeCSS = () => {
    if (!config) return '';
    
    const primaryRgb = hexToRgb(config.primaryColor);
    const secondaryRgb = hexToRgb(config.secondaryColor);
    const accentRgb = hexToRgb(config.accentColor);
    
    return `
      :root {
        /* Main Brand Colors */
        --primary-color: ${config.primaryColor};
        --secondary-color: ${config.secondaryColor};
        --accent-color: ${config.accentColor};
        
        /* Layout Colors */
        --header-bg: ${config.headerBackground};
        --header-text: ${config.headerTextColor};
        --footer-bg: ${config.footerBackground};
        --footer-text: ${config.footerTextColor};
        --bg-color: ${config.backgroundColor};
        
        /* Navigation Colors */
        --nav-link-color: ${config.navLinkColor};
        --nav-link-hover-color: ${config.navLinkHoverColor};
        --nav-active-color: ${config.navActiveColor};
        
        /* UI Element Colors */
        --button-primary: ${config.buttonPrimaryColor};
        --button-primary-hover: ${config.buttonPrimaryHoverColor};
        --button-secondary: ${config.buttonSecondaryColor};
        --button-secondary-hover: ${config.buttonSecondaryHoverColor};
        --button-danger: ${config.buttonDangerColor};
        --button-success: ${config.buttonSuccessColor};
        
        /* Text Colors */
        --text-primary: ${config.textPrimaryColor};
        --text-secondary: ${config.textSecondaryColor};
        --text-muted: ${config.textMutedColor};
        --link-color: ${config.linkColor};
        --link-hover-color: ${config.linkHoverColor};
        
        /* Border & Surface Colors */
        --border-color: ${config.borderColor};
        --card-bg: ${config.cardBackground};
        --card-border-color: ${config.cardBorderColor};
        --input-bg: ${config.inputBackground};
        --input-border: ${config.inputBorderColor};
        --input-focus-border: ${config.inputFocusBorderColor};
        
        /* Product Colors */
        --product-card-bg: ${config.productCardBackground};
        --product-card-border: ${config.productCardBorderColor};
        --product-price-color: ${config.productPriceColor};
        --product-sale-price-color: ${config.productSalePriceColor};
        --product-badge-color: ${config.productBadgeColor};
        
        /* Status Colors */
        --success-color: ${config.successColor};
        --warning-color: ${config.warningColor};
        --error-color: ${config.errorColor};
        --info-color: ${config.infoColor};
        
        /* Form Colors */
        --form-label-color: ${config.formLabelColor};
        --form-placeholder-color: ${config.formPlaceholderColor};
        --form-error-color: ${config.formErrorColor};
        --form-success-color: ${config.formSuccessColor};
        
        /* Modal & Overlay Colors */
        --modal-bg: ${config.modalBackgroundColor};
        --modal-border: ${config.modalBorderColor};
        --overlay-color: ${config.overlayColor};
        
        /* Advanced Colors */
        --hover-color: ${config.hoverColor};
        --shadow-color: ${config.shadowColor};
        --gradient-start: ${config.gradientStart};
        --gradient-end: ${config.gradientEnd};
        
        /* RGB values for transparency */
        --primary-color-rgb: ${primaryRgb ? `${primaryRgb.r}, ${primaryRgb.g}, ${primaryRgb.b}` : '37, 99, 235'};
        --secondary-color-rgb: ${secondaryRgb ? `${secondaryRgb.r}, ${secondaryRgb.g}, ${secondaryRgb.b}` : '124, 58, 237'};
        --accent-color-rgb: ${accentRgb ? `${accentRgb.r}, ${accentRgb.g}, ${accentRgb.b}` : '6, 182, 212'};
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

  // Refresh config (useful after logo upload)
  const refreshConfig = async () => {
    await fetchConfig();
  };

  const value = {
    config,
    loading,
    error,
    updateConfig,
    fetchConfig,
    refreshConfig,
    setConfig,
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


