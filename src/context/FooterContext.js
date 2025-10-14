import React, { createContext, useContext, useState, useEffect } from 'react';
import axios from '../config/axios';

const FooterContext = createContext();

export const useFooter = () => {
  const context = useContext(FooterContext);
  if (!context) {
    throw new Error('useFooter must be used within a FooterProvider');
  }
  return context;
};

export const FooterProvider = ({ children }) => {
  const [footerData, setFooterData] = useState({
    companyName: 'E-Shop',
    companyDescription: 'Your trusted online shopping destination',
    address: {
      street: '123 Main Street',
      city: 'New York',
      state: 'NY',
      zipCode: '10001',
      country: 'United States'
    },
    contact: {
      phone: '+1 (555) 123-4567',
      email: 'info@eshop.com',
      supportEmail: 'support@eshop.com'
    },
    socialMedia: {
      facebook: 'https://facebook.com/eshop',
      twitter: 'https://twitter.com/eshop',
      instagram: 'https://instagram.com/eshop',
      linkedin: 'https://linkedin.com/company/eshop'
    },
    businessHours: 'Monday - Friday: 9:00 AM - 6:00 PM',
    copyrightText: '© 2024 E-Shop. All rights reserved.',
    quickLinks: [
      { title: 'About Us', url: '/about' },
      { title: 'Contact', url: '/contact' },
      { title: 'Privacy Policy', url: '/privacy' },
      { title: 'Terms of Service', url: '/terms' }
    ],
    isActive: true
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchFooterData();
  }, []);

  const fetchFooterData = async () => {
    try {
      setLoading(true);
      const response = await axios.get('/api/footer');
      setFooterData(response.data);
    } catch (error) {
      console.error('Error fetching footer data:', error);
      // Use default footer data if API fails
    } finally {
      setLoading(false);
    }
  };

  const updateFooterData = async (newFooterData) => {
    try {
      const response = await axios.put('/api/footer/admin', newFooterData);
      setFooterData(response.data);
      return response.data;
    } catch (error) {
      console.error('Error updating footer data:', error);
      throw error;
    }
  };

  const value = {
    footerData,
    loading,
    updateFooterData,
    fetchFooterData
  };

  return (
    <FooterContext.Provider value={value}>
      {children}
    </FooterContext.Provider>
  );
};









