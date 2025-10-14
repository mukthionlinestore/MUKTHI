import React from 'react';
import { useLocation } from 'react-router-dom';
import { useWebsiteConfig } from '../context/WebsiteConfigContext';
import { useAuth } from '../context/AuthContext';
import MaintenanceMode from './MaintenanceMode';

const WebsiteWrapper = ({ children }) => {
  const { config, loading, isMaintenanceMode, getMaintenanceMessage } = useWebsiteConfig();
  const location = useLocation();
  const { user } = useAuth();
  const isSuperAdmin = user?.role === 'superadmin';

  const isAuthRoute = location?.pathname === '/login' || location?.pathname === '/register';
  const isSuperAdminRoute = location?.pathname?.startsWith('/superadmin');

  // Update document title and meta tags - MUST be before any returns
  React.useEffect(() => {
    if (config) {
      document.title = config.metaTitle || 'E-Shop';
      
      // Update meta description
      const metaDescription = document.querySelector('meta[name="description"]');
      if (metaDescription) {
        metaDescription.setAttribute('content', config.metaDescription || '');
      } else {
        const meta = document.createElement('meta');
        meta.name = 'description';
        meta.content = config.metaDescription || '';
        document.head.appendChild(meta);
      }

      // Update meta keywords
      const metaKeywords = document.querySelector('meta[name="keywords"]');
      if (metaKeywords) {
        metaKeywords.setAttribute('content', config.metaKeywords || '');
      } else {
        const meta = document.createElement('meta');
        meta.name = 'keywords';
        meta.content = config.metaKeywords || '';
        document.head.appendChild(meta);
      }
    }
  }, [config]);

  // Show loading state while fetching config (but not for super admin routes)
  if (loading && !isSuperAdminRoute) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  // Do not gate login/register to avoid redirect loops
  if (isAuthRoute) {
    return <>{children}</>;
  }

  // Show maintenance mode if enabled (but allow super admin)
  if (isMaintenanceMode() && !isSuperAdmin) {
    return <MaintenanceMode message={getMaintenanceMessage()} />;
  }

  return <>{children}</>;
};

export default WebsiteWrapper;
