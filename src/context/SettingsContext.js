import React, { createContext, useContext, useState, useEffect } from 'react';
import axios from '../config/axios';

const SettingsContext = createContext();

export const useSettings = () => {
  const context = useContext(SettingsContext);
  if (!context) {
    throw new Error('useSettings must be used within a SettingsProvider');
  }
  return context;
};

export const SettingsProvider = ({ children }) => {
  const [settings, setSettings] = useState({
    taxPercentage: 0,
    currency: 'USD',
    currencySymbol: '$',
    freeShippingThreshold: 50
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    try {
      setLoading(true);
      const response = await axios.get('/api/settings');
      setSettings(response.data);
    } catch (error) {
      console.error('Error fetching settings:', error);
      // Use default settings if API fails
      setSettings({
        taxPercentage: 0,
        currency: 'USD',
        currencySymbol: '$',
        freeShippingThreshold: 50
      });
    } finally {
      setLoading(false);
    }
  };

  const updateSettings = async (newSettings) => {
    try {
      const response = await axios.put('/api/settings/admin', newSettings);
      setSettings(response.data);
      return response.data;
    } catch (error) {
      console.error('Error updating settings:', error);
      throw error;
    }
  };

  const calculateTax = (amount) => {
    return (amount * settings.taxPercentage) / 100;
  };

  const formatPrice = (price) => {
    return `${settings.currencySymbol}${price.toFixed(2)}`;
  };

  const calculateTotalWithTax = (amount) => {
    const tax = calculateTax(amount);
    return amount + tax;
  };

  const calculateShipping = (subtotal, productShippingCharges = []) => {
    // If order total is above threshold, shipping is free
    if (subtotal >= settings.freeShippingThreshold) {
      return 0;
    }
    
    // Otherwise, calculate total shipping from products
    const totalShipping = productShippingCharges.reduce((sum, charge) => sum + charge, 0);
    return totalShipping;
  };

  const value = {
    settings,
    loading,
    updateSettings,
    calculateTax,
    formatPrice,
    calculateTotalWithTax,
    calculateShipping,
    fetchSettings
  };

  return (
    <SettingsContext.Provider value={value}>
      {children}
    </SettingsContext.Provider>
  );
};
