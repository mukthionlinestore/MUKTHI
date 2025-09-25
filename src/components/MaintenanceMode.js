import React from 'react';
import { FaTools, FaClock } from 'react-icons/fa';

const MaintenanceMode = ({ message }) => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-white rounded-2xl shadow-xl p-8 text-center">
        <div className="mb-6">
          <div className="w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <FaTools className="w-10 h-10 text-blue-600" />
          </div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Under Maintenance</h1>
          <div className="flex items-center justify-center gap-2 text-gray-600 mb-4">
            <FaClock className="w-4 h-4" />
            <span className="text-sm">We'll be back soon</span>
          </div>
        </div>
        
        <div className="bg-gray-50 rounded-lg p-4 mb-6">
          <p className="text-gray-700 text-sm leading-relaxed">
            {message || 'We are currently performing maintenance to improve your experience. Please check back later.'}
          </p>
        </div>
        
        <div className="space-y-3">
          <div className="flex items-center justify-center gap-2 text-xs text-gray-500">
            <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></div>
            <span>Maintenance in progress</span>
          </div>
          
          <div className="text-xs text-gray-400">
            Thank you for your patience
          </div>
        </div>
      </div>
    </div>
  );
};

export default MaintenanceMode;
