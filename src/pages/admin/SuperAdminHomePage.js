import React, { useState, useEffect } from 'react';
import axios from '../../config/axios';
import { 
  FaHome,
  FaEye,
  FaEyeSlash,
  FaGripVertical,
  FaSave,
  FaUndo,
  FaImage,
  FaStore,
  FaStar,
  FaShoppingBag,
  FaTruck,
  FaUsers,
  FaQuoteLeft,
  FaInfoCircle,
  FaGift,
  FaCheckCircle,
  FaChartLine
} from 'react-icons/fa';

const SuperAdminHomePage = () => {
  const [sections, setSections] = useState([
    {
      id: 'carousel',
      name: 'Hero Carousel',
      description: 'Main carousel with featured images and content',
      icon: FaImage,
      isVisible: true,
      order: 1
    },
    {
      id: 'newArrivals',
      name: 'New Arrivals',
      description: 'Display latest products added to the store',
      icon: FaStar,
      isVisible: true,
      order: 2
    },
    {
      id: 'featuredProducts',
      name: 'Featured Products',
      description: 'Showcase selected featured products',
      icon: FaShoppingBag,
      isVisible: true,
      order: 3
    },
    {
      id: 'banner',
      name: 'Promotional Banner',
      description: 'Special offers and promotional content banner',
      icon: FaGift,
      isVisible: true,
      order: 4
    },
    {
      id: 'features',
      name: 'Feature Boxes',
      description: 'Highlight key store features and benefits',
      icon: FaCheckCircle,
      isVisible: true,
      order: 5
    },
    {
      id: 'stats',
      name: 'Statistics',
      description: 'Display store statistics and achievements',
      icon: FaUsers,
      isVisible: true,
      order: 6
    },
    {
      id: 'testimonials',
      name: 'Customer Testimonials',
      description: 'Customer reviews and feedback',
      icon: FaQuoteLeft,
      isVisible: true,
      order: 7
    },
    {
      id: 'help',
      name: 'Help Section',
      description: 'Customer support and help information',
      icon: FaInfoCircle,
      isVisible: true,
      order: 8
    },
    {
      id: 'finalCTA',
      name: 'Final Call to Action',
      description: 'Bottom section with final conversion elements',
      icon: FaTruck,
      isVisible: true,
      order: 9
    }
  ]);

  const [draggedItem, setDraggedItem] = useState(null);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });
  const [hasChanges, setHasChanges] = useState(false);
  const [originalSections, setOriginalSections] = useState([]);

  // Load current settings on component mount
  useEffect(() => {
    loadHomePageSettings();
  }, []);

  const loadHomePageSettings = async () => {
    try {
      setLoading(true);
      const response = await axios.get('/api/superadmin/homepage-settings');
      if (response.data.success && response.data.settings) {
        const loadedSections = response.data.settings.sections || sections;
        setSections(loadedSections);
        setOriginalSections(JSON.parse(JSON.stringify(loadedSections)));
      }
    } catch (error) {
      console.error('Error loading homepage settings:', error);
      setMessage({ type: 'error', text: 'Failed to load homepage settings' });
    } finally {
      setLoading(false);
    }
  };

  const handleToggleVisibility = (sectionId) => {
    setSections(prevSections => 
      prevSections.map(section => 
        section.id === sectionId 
          ? { ...section, isVisible: !section.isVisible }
          : section
      )
    );
    setHasChanges(true);
  };

  const handleDragStart = (e, section) => {
    setDraggedItem(section);
    e.dataTransfer.effectAllowed = 'move';
    e.dataTransfer.setData('text/plain', section.id);
    
    // Add visual feedback
    e.currentTarget.style.opacity = '0.5';
  };

  const handleDragEnd = (e) => {
    e.currentTarget.style.opacity = '1';
    setDraggedItem(null);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
  };

  const handleDragEnter = (e) => {
    e.preventDefault();
    if (draggedItem && e.currentTarget.dataset.sectionId !== draggedItem.id) {
      e.currentTarget.style.backgroundColor = '#f3f4f6';
    }
  };

  const handleDragLeave = (e) => {
    e.currentTarget.style.backgroundColor = '';
  };

  const handleDrop = (e, targetSection) => {
    e.preventDefault();
    e.currentTarget.style.backgroundColor = '';
    
    if (!draggedItem || draggedItem.id === targetSection.id) {
      return;
    }

    const currentSections = [...sections].sort((a, b) => a.order - b.order);
    const draggedIndex = currentSections.findIndex(s => s.id === draggedItem.id);
    const targetIndex = currentSections.findIndex(s => s.id === targetSection.id);

    if (draggedIndex === -1 || targetIndex === -1) return;

    // Remove dragged item and insert at target position
    const [removed] = currentSections.splice(draggedIndex, 1);
    currentSections.splice(targetIndex, 0, removed);

    // Update order numbers
    const updatedSections = currentSections.map((section, index) => ({
      ...section,
      order: index + 1
    }));

    setSections(updatedSections);
    setDraggedItem(null);
    setHasChanges(true);
  };

  const handleSaveSettings = async () => {
    try {
      setLoading(true);
      const response = await axios.put('/api/superadmin/homepage-settings', {
        sections: sections
      });

      if (response.data.success) {
        setMessage({ type: 'success', text: 'Homepage settings saved successfully!' });
        setOriginalSections(JSON.parse(JSON.stringify(sections)));
        setHasChanges(false);
      }
    } catch (error) {
      console.error('Error saving homepage settings:', error);
      setMessage({ type: 'error', text: 'Failed to save homepage settings' });
    } finally {
      setLoading(false);
    }
  };

  const handleResetChanges = () => {
    setSections(JSON.parse(JSON.stringify(originalSections)));
    setHasChanges(false);
    setMessage({ type: 'info', text: 'Changes reset to last saved state' });
  };

  const toggleAllSections = (visible) => {
    setSections(prevSections => 
      prevSections.map(section => ({ ...section, isVisible: visible }))
    );
    setHasChanges(true);
  };

  // Clear messages after 3 seconds
  useEffect(() => {
    if (message.text) {
      const timer = setTimeout(() => {
        setMessage({ type: '', text: '' });
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [message]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 p-3 sm:p-4 lg:p-6">
      <div className="max-w-4xl mx-auto">
        {/* Mobile-First Header */}
        <div className="bg-white rounded-2xl shadow-xl p-4 sm:p-6 mb-6 border border-gray-100">
          <div className="flex flex-col sm:flex-row sm:items-center gap-4 mb-4 sm:mb-6">
            <div className="w-14 h-14 bg-gradient-to-br from-blue-500 via-purple-500 to-pink-500 rounded-2xl flex items-center justify-center shadow-lg">
              <FaHome className="w-7 h-7 text-white" />
            </div>
            <div className="flex-1">
              <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-900 mb-1">
                📱 Homepage Control
              </h1>
              <p className="text-sm sm:text-base text-gray-600">
                Drag to reorder • Toggle to show/hide sections
              </p>
            </div>
          </div>

          {/* Mobile-First Action Buttons */}
          <div className="grid grid-cols-2 sm:flex gap-2 sm:gap-3">
            {/* Primary Action */}
            <button
              onClick={handleSaveSettings}
              disabled={!hasChanges || loading}
              className="col-span-2 sm:col-span-1 inline-flex items-center justify-center gap-2 px-4 sm:px-6 py-3 sm:py-3.5 bg-gradient-to-r from-green-500 to-emerald-600 text-white font-bold rounded-xl hover:from-green-600 hover:to-emerald-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl text-sm sm:text-base"
            >
              <FaSave className="w-4 h-4" />
              {loading ? 'Saving...' : 'Save Changes'}
            </button>

            {/* Secondary Actions */}
            <button
              onClick={handleResetChanges}
              disabled={!hasChanges || loading}
              className="inline-flex items-center justify-center gap-2 px-3 sm:px-4 py-3 bg-gray-500 text-white font-semibold rounded-xl hover:bg-gray-600 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 text-sm sm:text-base"
            >
              <FaUndo className="w-3 h-3 sm:w-4 sm:h-4" />
              <span className="hidden sm:inline">Reset</span>
            </button>

            <button
              onClick={() => toggleAllSections(true)}
              className="inline-flex items-center justify-center gap-2 px-3 sm:px-4 py-3 bg-blue-500 text-white font-semibold rounded-xl hover:bg-blue-600 transition-all duration-300 text-sm sm:text-base"
            >
              <FaEye className="w-3 h-3 sm:w-4 sm:h-4" />
              <span className="hidden sm:inline">Show</span>
            </button>

            <button
              onClick={() => toggleAllSections(false)}
              className="inline-flex items-center justify-center gap-2 px-3 sm:px-4 py-3 bg-red-500 text-white font-semibold rounded-xl hover:bg-red-600 transition-all duration-300 text-sm sm:text-base"
            >
              <FaEyeSlash className="w-3 h-3 sm:w-4 sm:h-4" />
              <span className="hidden sm:inline">Hide</span>
            </button>
          </div>

          {/* Status Messages - Mobile Optimized */}
          {message.text && (
            <div className={`mt-4 p-3 sm:p-4 rounded-xl text-sm sm:text-base font-medium ${
              message.type === 'success' ? 'bg-green-50 text-green-800 border border-green-200' :
              message.type === 'error' ? 'bg-red-50 text-red-800 border border-red-200' :
              'bg-blue-50 text-blue-800 border border-blue-200'
            }`}>
              {message.text}
            </div>
          )}

          {/* Changes Indicator - Mobile Optimized */}
          {hasChanges && (
            <div className="mt-4 p-3 bg-yellow-50 text-yellow-800 rounded-xl border border-yellow-200">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-yellow-500 rounded-full animate-pulse"></div>
                <span className="font-medium text-sm sm:text-base">Unsaved changes</span>
              </div>
            </div>
          )}
        </div>

        {/* Mobile-First Sections List */}
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden border border-gray-100">
          <div className="p-4 sm:p-6 border-b border-gray-100 bg-gradient-to-r from-gray-50 to-white">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-lg sm:text-xl font-bold text-gray-900 mb-1">
                  🏗️ Page Sections
                </h2>
                <p className="text-xs sm:text-sm text-gray-600">
                  Drag ⬍⬍ to reorder • Tap 👁️ to toggle
                </p>
              </div>
              <div className="text-right">
                <div className="text-lg sm:text-xl font-bold text-blue-600">
                  {sections.filter(s => s.isVisible).length}/{sections.length}
                </div>
                <div className="text-xs text-gray-500">visible</div>
              </div>
            </div>
          </div>

          <div className="divide-y divide-gray-200">
            {sections
              .sort((a, b) => a.order - b.order)
              .map((section) => {
                const IconComponent = section.icon;
                return (
                  <div
                    key={section.id}
                    data-section-id={section.id}
                    draggable
                    onDragStart={(e) => handleDragStart(e, section)}
                    onDragEnd={handleDragEnd}
                    onDragOver={handleDragOver}
                    onDragEnter={handleDragEnter}
                    onDragLeave={handleDragLeave}
                    onDrop={(e) => handleDrop(e, section)}
                    className={`p-4 sm:p-6 hover:bg-gray-50 transition-all duration-200 cursor-move border-l-4 ${
                      section.isVisible ? 'border-l-green-500' : 'border-l-red-500'
                    } ${draggedItem?.id === section.id ? 'opacity-50 scale-95' : 'hover:scale-[1.02]'}`}
                  >
                    <div className="flex items-center gap-3 sm:gap-4">
                      {/* Drag Handle - Mobile Optimized */}
                      <div className="text-gray-400 hover:text-gray-600 p-1 cursor-grab active:cursor-grabbing">
                        <FaGripVertical className="w-4 h-4 sm:w-5 sm:h-5" />
                      </div>

                      {/* Order Badge - Mobile Optimized */}
                      <div className={`w-7 h-7 sm:w-8 sm:h-8 rounded-lg flex items-center justify-center text-xs sm:text-sm font-bold ${
                        section.isVisible 
                          ? 'bg-blue-100 text-blue-700' 
                          : 'bg-gray-100 text-gray-500'
                      }`}>
                        {section.order}
                      </div>

                      {/* Section Icon - Mobile Optimized */}
                      <div className={`w-10 h-10 sm:w-12 sm:h-12 rounded-xl flex items-center justify-center shadow-sm ${
                        section.isVisible 
                          ? 'bg-gradient-to-br from-blue-500 to-purple-600' 
                          : 'bg-gray-300'
                      }`}>
                        <IconComponent className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
                      </div>

                      {/* Section Info - Mobile Optimized */}
                      <div className="flex-1 min-w-0">
                        <h3 className={`text-sm sm:text-lg font-semibold leading-tight ${
                          section.isVisible ? 'text-gray-900' : 'text-gray-500'
                        }`}>
                          {section.name}
                        </h3>
                        <p className={`text-xs sm:text-sm leading-tight mt-0.5 ${
                          section.isVisible ? 'text-gray-600' : 'text-gray-400'
                        }`}>
                          {section.description}
                        </p>
                      </div>

                      {/* Large Touch-Friendly Toggle */}
                      <button
                        onClick={() => handleToggleVisibility(section.id)}
                        className={`w-12 h-12 sm:w-14 sm:h-14 rounded-2xl transition-all duration-300 transform active:scale-95 touch-manipulation ${
                          section.isVisible
                            ? 'bg-green-100 text-green-600 hover:bg-green-200 shadow-green-200/50'
                            : 'bg-red-100 text-red-600 hover:bg-red-200 shadow-red-200/50'
                        } shadow-lg hover:shadow-xl`}
                        title={section.isVisible ? 'Hide section' : 'Show section'}
                      >
                        {section.isVisible ? (
                          <FaEye className="w-5 h-5 sm:w-6 sm:h-6 mx-auto" />
                        ) : (
                          <FaEyeSlash className="w-5 h-5 sm:w-6 sm:h-6 mx-auto" />
                        )}
                      </button>
                    </div>
                  </div>
                );
              })}
          </div>
        </div>

        {/* Mobile-First Statistics */}
        <div className="mt-6 bg-gradient-to-br from-blue-50 to-purple-50 rounded-2xl p-4 sm:p-6 border border-blue-100">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-8 h-8 bg-blue-500 rounded-lg flex items-center justify-center">
              <FaChartLine className="w-4 h-4 text-white" />
            </div>
            <div>
              <h3 className="text-base sm:text-lg font-bold text-blue-900">
                📊 Quick Stats
              </h3>
              <p className="text-xs sm:text-sm text-blue-700">
                Changes apply after saving
              </p>
            </div>
          </div>
          
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
            <div className="bg-white rounded-xl p-3 sm:p-4 shadow-sm border border-green-100">
              <div className="text-xl sm:text-2xl font-bold text-green-600 mb-1">
                {sections.filter(s => s.isVisible).length}
              </div>
              <div className="text-xs sm:text-sm text-gray-600 font-medium">✅ Visible</div>
            </div>
            <div className="bg-white rounded-xl p-3 sm:p-4 shadow-sm border border-red-100">
              <div className="text-xl sm:text-2xl font-bold text-red-600 mb-1">
                {sections.filter(s => !s.isVisible).length}
              </div>
              <div className="text-xs sm:text-sm text-gray-600 font-medium">❌ Hidden</div>
            </div>
            <div className="bg-white rounded-xl p-3 sm:p-4 shadow-sm border border-blue-100">
              <div className="text-xl sm:text-2xl font-bold text-blue-600 mb-1">
                {sections.length}
              </div>
              <div className="text-xs sm:text-sm text-gray-600 font-medium">🏗️ Total</div>
            </div>
            <div className="bg-white rounded-xl p-3 sm:p-4 shadow-sm border border-purple-100">
              <div className="text-xl sm:text-2xl font-bold text-purple-600 mb-1">
                {Math.round((sections.filter(s => s.isVisible).length / sections.length) * 100)}%
              </div>
              <div className="text-xs sm:text-sm text-gray-600 font-medium">📈 Visible</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SuperAdminHomePage;
