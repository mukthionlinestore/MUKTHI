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
    sections: []
  });
  const [loading, setLoading] = useState(true);

  const fetchSettings = async () => {
    try {
      setLoading(true);
      const response = await axios.get('/api/superadmin/public/homepage-settings');
      if (response.data.success) {
        setSettings(response.data.settings);
      }
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
        ]
      });
    } finally {
      setLoading(false);
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
    settings,
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
