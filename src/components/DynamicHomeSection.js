import React from 'react';
import { useHomePageSettings } from '../context/HomePageSettingsContext';

const DynamicHomeSection = ({ sectionId, children }) => {
  const { isSectionVisible, loading } = useHomePageSettings();

  // Show all sections while loading to prevent layout shift
  if (loading) {
    return children;
  }

  // Only render if section is visible according to admin settings
  if (!isSectionVisible(sectionId)) {
    return null;
  }

  return children;
};

export default DynamicHomeSection;

