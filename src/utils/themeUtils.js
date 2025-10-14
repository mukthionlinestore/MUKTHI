// Comprehensive theme utility functions for MUKHTI brand

export const applyGlobalTheme = (config) => {
  if (!config) return;

  // Apply theme to all elements with specific classes
  const applyToElements = (selector, styles) => {
    const elements = document.querySelectorAll(selector);
    elements.forEach(element => {
      Object.keys(styles).forEach(property => {
        element.style[property] = styles[property];
      });
    });
  };

  // Apply comprehensive theme mappings
  const themeSelectors = {
    // Primary buttons and backgrounds
    '.btn-primary, .bg-emerald-500, .bg-emerald-600, .bg-blue-600': {
      backgroundColor: config.buttonPrimaryColor || 'var(--button-primary)',
      borderColor: config.buttonPrimaryColor || 'var(--button-primary)'
    },
    
    // Secondary buttons
    '.btn-secondary, .bg-teal-500, .bg-teal-600': {
      backgroundColor: config.buttonSecondaryColor || 'var(--button-secondary)',
      borderColor: config.buttonSecondaryColor || 'var(--button-secondary)'
    },
    
    // Text colors
    '.text-emerald-600, .text-emerald-700, .text-blue-600': {
      color: config.primaryColor || 'var(--primary-color)'
    },
    
    '.text-teal-600, .text-teal-700': {
      color: config.secondaryColor || 'var(--secondary-color)'
    },
    
    // Navigation links
    '.nav-link, .navbar-nav .nav-link': {
      color: config.navLinkColor || 'var(--nav-link-color)'
    },
    
    // Cards and surfaces
    '.bg-white, .card': {
      backgroundColor: config.cardBackground || 'var(--card-bg)',
      borderColor: config.cardBorderColor || 'var(--card-border-color)'
    },
    
    // Form elements
    'input, textarea, select': {
      backgroundColor: config.inputBackground || 'var(--input-bg)',
      borderColor: config.inputBorderColor || 'var(--input-border)',
      color: config.textPrimaryColor || 'var(--text-primary)'
    },
    
    // Links
    'a': {
      color: config.linkColor || 'var(--link-color)'
    },
    
    // Headers and footers
    '.header, .navbar': {
      backgroundColor: config.headerBackground || 'var(--header-bg)',
      color: config.headerTextColor || 'var(--header-text)'
    },
    
    '.footer': {
      backgroundColor: config.footerBackground || 'var(--footer-bg)',
      color: config.footerTextColor || 'var(--footer-text)'
    },
    
    // Product elements
    '.product-card': {
      backgroundColor: config.productCardBackground || 'var(--product-card-bg)',
      borderColor: config.productCardBorderColor || 'var(--product-card-border)'
    },
    
    '.product-price': {
      color: config.productPriceColor || 'var(--product-price-color)'
    },
    
    '.product-badge': {
      backgroundColor: config.productBadgeColor || 'var(--product-badge-color)'
    }
  };

  // Apply all theme selectors
  Object.keys(themeSelectors).forEach(selector => {
    applyToElements(selector, themeSelectors[selector]);
  });
};

export const createThemeCSS = (config) => {
  if (!config) return '';

  return `
    /* Dynamic MUKHTI Theme Overrides */
    .bg-emerald-50, .bg-emerald-100 { background-color: var(--accent-color) !important; }
    .bg-emerald-500, .bg-emerald-600 { background-color: var(--primary-color) !important; }
    .bg-teal-500, .bg-teal-600 { background-color: var(--secondary-color) !important; }
    
    .text-emerald-600, .text-emerald-700 { color: var(--primary-color) !important; }
    .text-emerald-100, .text-emerald-200 { color: var(--accent-color) !important; }
    
    .border-emerald-100, .border-emerald-200 { border-color: var(--border-color) !important; }
    
    .from-emerald-500 { --tw-gradient-from: var(--primary-color) !important; }
    .to-teal-500 { --tw-gradient-to: var(--secondary-color) !important; }
    .to-cyan-500 { --tw-gradient-to: var(--accent-color) !important; }
    
    /* Hover states */
    .hover\\:from-emerald-600:hover { --tw-gradient-from: var(--hover-color) !important; }
    .hover\\:to-teal-600:hover { --tw-gradient-to: var(--hover-color) !important; }
    
    /* Focus states */
    .focus\\:ring-emerald-500:focus { --tw-ring-color: var(--primary-color) !important; }
    .focus\\:border-emerald-500:focus { border-color: var(--primary-color) !important; }
  `;
};