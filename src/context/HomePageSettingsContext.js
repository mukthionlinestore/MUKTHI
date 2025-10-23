import React, { createContext, useContext, useState, useEffect } from 'react';
import axios from '../config/axios';

const HomePageSettingsContext = createContext();

export const useHomePageSettings = () => {
  const context = useContext(HomePageSettingsContext);
  if (!context) {
    throw new Error('useHomePageSettings must be used within a HomePageSettingsProvider');
  }
  return context;
};

export const HomePageSettingsProvider = ({ children }) => {
  const [settings, setSettings] = useState({
    sections: [],
    heroSection: {
      screen1: { title: '', subtitle: '', description: '' },
      screen2: { title: '', subtitle: '', description: '' },
      screen3: { title: '', subtitle: '', description: '' },
      screen4: { title: '', subtitle: '', description: '' },
      screen5: { title: '', subtitle: '', description: '' }
    },
    finalCTA: {
      badge: '',
      title: '',
      subtitle: '',
      buttonText: '',
      buttonLink: '',
      stats: {
        customers: { number: '', label: '' },
        products: { number: '', label: '' },
        countries: { number: '', label: '' },
        satisfaction: { number: '', label: '' }
      }
    }
  });
  const [loading, setLoading] = useState(true);

  const fetchSettings = async () => {
    try {
      setLoading(true);
      const response = await axios.get('/api/homepage');
      setSettings(response.data);
    } catch (error) {
      console.error('Error fetching homepage settings:', error);
      // Set default settings if API fails
      setSettings({
        sections: [
          { id: 'carousel', isVisible: true, order: 1 },
          { id: 'newArrivals', isVisible: true, order: 2 },
          { id: 'featuredProducts', isVisible: true, order: 3 },
          { id: 'banner', isVisible: true, order: 4 },
          { id: 'features', isVisible: true, order: 5 },
          { id: 'stats', isVisible: true, order: 6 },
          { id: 'testimonials', isVisible: true, order: 7 },
          { id: 'help', isVisible: true, order: 8 },
          { id: 'finalCTA', isVisible: true, order: 9 }
        ],
        heroSection: {
          screen1: { title: 'Welcome to MUKHTI', subtitle: 'Your Premium Shopping Destination', description: 'Discover amazing products and exclusive deals' },
          screen2: { title: 'Quality Products', subtitle: 'Handpicked for You', description: 'Curated selection of premium quality items' },
          screen3: { title: 'Fast Delivery', subtitle: 'Quick & Reliable', description: 'Get your orders delivered fast and safely' },
          screen4: { title: 'Premium Quality', subtitle: 'Free Shipping Worldwide', description: 'Experience luxury shopping with our curated selection of high-end products' },
          screen5: { title: 'Start Shopping', subtitle: 'Explore Our Collection', description: 'Browse through thousands of premium products and find your perfect match' }
        },
        finalCTA: {
          badge: 'Ready to Shop?',
          title: 'Start Your Shopping Journey',
          subtitle: 'Discover amazing products and enjoy a seamless shopping experience with us.',
          buttonText: 'Start Shopping Now',
          buttonLink: '/products',
          stats: {
            customers: { number: '10K+', label: 'Happy Customers' },
            products: { number: '500+', label: 'Products' },
            countries: { number: '50+', label: 'Countries' },
            satisfaction: { number: '99%', label: 'Satisfaction' }
          }
        }
      });
    } finally {
      setLoading(false);
    }
  };

  const updateHomePageSettings = async (newSettings) => {
    try {
      // Extract the specific fields that the backend expects
      const payload = {
        heroSection: newSettings.heroSection,
        finalCTA: newSettings.finalCTA,
        sections: newSettings.sections
      };
      
      const response = await axios.put('/api/homepage', payload);
      if (response.data.success) {
        setSettings(response.data.settings);
        return { success: true };
      }
      return { success: false, error: response.data.message };
    } catch (error) {
      console.error('Error updating homepage settings:', error);
      return { success: false, error: error.response?.data?.message || 'Failed to update settings' };
    }
  };

  useEffect(() => {
    fetchSettings();
  }, []);

  const getSectionSettings = (sectionId) => {
    const section = settings.sections.find(s => s.id === sectionId);
    return section || { isVisible: true, order: 999 };
  };

  const isSectionVisible = (sectionId) => {
    const section = getSectionSettings(sectionId);
    return section.isVisible;
  };

  const getSortedSections = () => {
    return settings.sections.sort((a, b) => a.order - b.order);
  };

  const value = {
    homePageSettings: settings,
    updateHomePageSettings,
    loading,
    fetchSettings,
    getSectionSettings,
    isSectionVisible,
    getSortedSections
  };

  return (
    <HomePageSettingsContext.Provider value={value}>
      {children}
    </HomePageSettingsContext.Provider>
  );
};

export default HomePageSettingsContext;
