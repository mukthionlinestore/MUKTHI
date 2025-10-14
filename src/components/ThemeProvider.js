import React, { useEffect } from 'react';
import { useWebsiteConfig } from '../context/WebsiteConfigContext';

const ThemeProvider = ({ children }) => {
  const { config } = useWebsiteConfig();

  // Helper function to convert hex to RGB
  const hexToRgb = (hex) => {
    if (!hex) return null;
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result ? {
      r: parseInt(result[1], 16),
      g: parseInt(result[2], 16),
      b: parseInt(result[3], 16)
    } : null;
  };

  // Apply theme CSS variables
  useEffect(() => {
    if (!config) return;

    const primaryRgb = hexToRgb(config.primaryColor);
    const secondaryRgb = hexToRgb(config.secondaryColor);
    const accentRgb = hexToRgb(config.accentColor);

    // Apply CSS variables to document root
    const root = document.documentElement;
    
    // Main Brand Colors
    root.style.setProperty('--primary-color', config.primaryColor);
    root.style.setProperty('--secondary-color', config.secondaryColor);
    root.style.setProperty('--accent-color', config.accentColor);
    
    // Layout Colors
    root.style.setProperty('--header-bg', config.headerBackground);
    root.style.setProperty('--header-text', config.headerTextColor);
    root.style.setProperty('--footer-bg', config.footerBackground);
    root.style.setProperty('--footer-text', config.footerTextColor);
    root.style.setProperty('--bg-color', config.backgroundColor);
    
    // Navigation Colors
    root.style.setProperty('--nav-link-color', config.navLinkColor);
    root.style.setProperty('--nav-link-hover-color', config.navLinkHoverColor);
    root.style.setProperty('--nav-active-color', config.navActiveColor);
    
    // UI Element Colors
    root.style.setProperty('--button-primary', config.buttonPrimaryColor);
    root.style.setProperty('--button-primary-hover', config.buttonPrimaryHoverColor);
    root.style.setProperty('--button-secondary', config.buttonSecondaryColor);
    root.style.setProperty('--button-secondary-hover', config.buttonSecondaryHoverColor);
    root.style.setProperty('--button-danger', config.buttonDangerColor);
    root.style.setProperty('--button-success', config.buttonSuccessColor);
    
    // Text Colors
    root.style.setProperty('--text-primary', config.textPrimaryColor);
    root.style.setProperty('--text-secondary', config.textSecondaryColor);
    root.style.setProperty('--text-muted', config.textMutedColor);
    root.style.setProperty('--link-color', config.linkColor);
    root.style.setProperty('--link-hover-color', config.linkHoverColor);
    
    // Border & Surface Colors
    root.style.setProperty('--border-color', config.borderColor);
    root.style.setProperty('--card-bg', config.cardBackground);
    root.style.setProperty('--card-border-color', config.cardBorderColor);
    root.style.setProperty('--input-bg', config.inputBackground);
    root.style.setProperty('--input-border', config.inputBorderColor);
    root.style.setProperty('--input-focus-border', config.inputFocusBorderColor);
    
    // Product Colors
    root.style.setProperty('--product-card-bg', config.productCardBackground);
    root.style.setProperty('--product-card-border', config.productCardBorderColor);
    root.style.setProperty('--product-price-color', config.productPriceColor);
    root.style.setProperty('--product-sale-price-color', config.productSalePriceColor);
    root.style.setProperty('--product-badge-color', config.productBadgeColor);
    
    // Status Colors
    root.style.setProperty('--success-color', config.successColor);
    root.style.setProperty('--warning-color', config.warningColor);
    root.style.setProperty('--error-color', config.errorColor);
    root.style.setProperty('--info-color', config.infoColor);
    
    // Form Colors
    root.style.setProperty('--form-label-color', config.formLabelColor);
    root.style.setProperty('--form-placeholder-color', config.formPlaceholderColor);
    root.style.setProperty('--form-error-color', config.formErrorColor);
    root.style.setProperty('--form-success-color', config.formSuccessColor);
    
    // Modal & Overlay Colors
    root.style.setProperty('--modal-bg', config.modalBackgroundColor);
    root.style.setProperty('--modal-border', config.modalBorderColor);
    root.style.setProperty('--overlay-color', config.overlayColor);
    
    // Advanced Colors
    root.style.setProperty('--hover-color', config.hoverColor);
    root.style.setProperty('--shadow-color', config.shadowColor);
    root.style.setProperty('--gradient-start', config.gradientStart);
    root.style.setProperty('--gradient-end', config.gradientEnd);
    
    // Luxury Gradients
    root.style.setProperty('--blue-gradient', config.blueGradient || 'linear-gradient(135deg, #2563EB 0%, #1D4ED8 100%)');
    root.style.setProperty('--amber-gradient', config.amberGradient || 'linear-gradient(135deg, #F59E0B 0%, #D97706 100%)');
    root.style.setProperty('--purple-gradient', config.purpleGradient || 'linear-gradient(135deg, #7C3AED 0%, #6D28D9 100%)');
    root.style.setProperty('--emerald-gradient', config.emeraldGradient || 'linear-gradient(135deg, #059669 0%, #047857 100%)');
    root.style.setProperty('--luxury-gradient', config.luxuryGradient || 'linear-gradient(135deg, #2563EB 0%, #7C3AED 50%, #F59E0B 100%)');
    root.style.setProperty('--premium-gradient', config.premiumGradient || 'linear-gradient(135deg, #F59E0B 0%, #7C3AED 50%, #2563EB 100%)');
    
    // RGB values for transparency
    root.style.setProperty('--primary-color-rgb', primaryRgb ? `${primaryRgb.r}, ${primaryRgb.g}, ${primaryRgb.b}` : '255, 255, 255');
    root.style.setProperty('--secondary-color-rgb', secondaryRgb ? `${secondaryRgb.r}, ${secondaryRgb.g}, ${secondaryRgb.b}` : '37, 99, 235');
    root.style.setProperty('--accent-color-rgb', accentRgb ? `${accentRgb.r}, ${accentRgb.g}, ${accentRgb.b}` : '245, 158, 11');

    // Apply body background
    document.body.style.backgroundColor = config.backgroundColor;
    
  }, [config]);

  return <>{children}</>;
};

export default ThemeProvider;