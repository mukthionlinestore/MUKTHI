import React from 'react';
import { FaTimes, FaRuler } from 'react-icons/fa';

const SizeChartModal = ({ isOpen, onClose, sizeChart }) => {
  if (!isOpen) return null;
  
  // Use fallback data if sizeChart is not provided or incomplete
  const chartData = sizeChart || {
    title: 'Size Chart',
    description: 'Please refer to the size chart below to find your perfect fit.',
    imageUrl: ''
  };

  // If there's no image URL, show a placeholder message
  if (!chartData.imageUrl) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
        <div className="bg-white rounded-lg max-w-md w-full relative">
          <div className="p-4 sm:p-6 flex items-center justify-between border-b border-gray-200">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg flex items-center justify-center">
                <FaRuler className="w-5 h-5 text-white" />
              </div>
              <h3 className="text-lg sm:text-xl font-semibold text-gray-900">
                {chartData.title || 'Size Chart'}
              </h3>
            </div>
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-100 rounded-full transition-colors"
            >
              <FaTimes className="w-5 h-5 text-gray-500" />
            </button>
          </div>
          <div className="p-8 text-center">
            <FaRuler className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-600 mb-2">{chartData.description || 'Size chart not available.'}</p>
            <p className="text-sm text-gray-500">
              Please contact the administrator to upload a size chart.
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg max-w-5xl w-full max-h-[90vh] overflow-auto relative">
        {/* Header */}
        <div className="sticky top-0 bg-white border-b border-gray-200 p-4 sm:p-6 flex items-center justify-between shadow-sm">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg flex items-center justify-center">
              <FaRuler className="w-5 h-5 text-white" />
            </div>
            <div>
              <h3 className="text-lg sm:text-xl font-semibold text-gray-900">{chartData.title || 'Size Chart'}</h3>
              {chartData.description && (
                <p className="text-sm text-gray-600">{chartData.description}</p>
              )}
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
          >
            <FaTimes className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        {/* Image */}
        <div className="p-4 sm:p-6">
          <img 
            src={chartData.imageUrl} 
            alt="Size Chart" 
            className="w-full h-auto rounded-lg shadow-sm border border-gray-200"
            onError={(e) => {
              console.error('Failed to load size chart image:', chartData.imageUrl);
              e.target.src = 'https://via.placeholder.com/800x600?text=Size+Chart+Image+Not+Found';
            }}
          />
        </div>
      </div>
    </div>
  );
};

export default SizeChartModal;

