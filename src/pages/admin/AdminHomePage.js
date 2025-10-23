import React, { useState, useEffect } from 'react';
import { useHomePageSettings } from '../../context/HomePageSettingsContext';
import { FaSave, FaUndo, FaSpinner, FaEdit, FaEye } from 'react-icons/fa';
import { toast } from 'react-toastify';

const AdminHomePage = () => {
  const { homePageSettings, updateHomePageSettings, loading } = useHomePageSettings();
  const [localSettings, setLocalSettings] = useState(null);
  const [saving, setSaving] = useState(false);
  const [activeTab, setActiveTab] = useState('carousel');

  useEffect(() => {
    if (homePageSettings) {
      setLocalSettings(homePageSettings);
    }
  }, [homePageSettings]);

  const updateField = (path, value) => {
    setLocalSettings(prev => {
      const newSettings = { ...prev };
      const keys = path.split('.');
      let current = newSettings;
      
      for (let i = 0; i < keys.length - 1; i++) {
        if (!current[keys[i]]) {
          current[keys[i]] = {};
        }
        current = current[keys[i]];
      }
      
      current[keys[keys.length - 1]] = value;
      return newSettings;
    });
  };

  const handleSave = async () => {
    if (!localSettings) return;
    
    setSaving(true);
    try {
      await updateHomePageSettings(localSettings);
      toast.success('Home page settings saved successfully!');
    } catch (error) {
      console.error('Error saving home page settings:', error);
      toast.error('Failed to save home page settings');
    } finally {
      setSaving(false);
    }
  };

  const handleReset = () => {
    setLocalSettings(homePageSettings);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <FaSpinner className="w-8 h-8 text-blue-600 animate-spin" />
      </div>
    );
  }

  if (!localSettings) {
    return (
      <div className="text-center py-8">
        <p className="text-gray-500">Loading home page settings...</p>
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Home Page Settings</h1>
            <p className="text-gray-600 mt-2">Manage carousel text and home page content</p>
          </div>
          <div className="flex gap-3">
            <button
              onClick={handleReset}
              disabled={saving || loading}
              className="px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors disabled:opacity-50 flex items-center gap-2"
            >
              <FaUndo className="w-4 h-4" />
              Reset
            </button>
            <button
              onClick={handleSave}
              disabled={saving || loading}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 flex items-center gap-2"
            >
              {saving ? <FaSpinner className="w-4 h-4 animate-spin" /> : <FaSave className="w-4 h-4" />}
              {saving ? 'Saving...' : 'Save Changes'}
            </button>
          </div>
        </div>

        {/* Tabs */}
        <div className="border-b border-gray-200 mb-8">
          <nav className="-mb-px flex space-x-8">
            <button
              onClick={() => setActiveTab('carousel')}
              className={`py-2 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'carousel'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              <FaEdit className="w-4 h-4 inline mr-2" />
              Carousel Text
            </button>
            <button
              onClick={() => setActiveTab('preview')}
              className={`py-2 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'preview'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              <FaEye className="w-4 h-4 inline mr-2" />
              Preview
            </button>
          </nav>
        </div>

        {/* Carousel Text Editor */}
        {activeTab === 'carousel' && (
          <div className="space-y-6">
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <h3 className="text-xl font-semibold text-gray-900 mb-6">Carousel Screen Text</h3>
              
              {/* Screen 1 */}
              <div className="mb-8 p-4 border border-gray-200 rounded-lg">
                <h4 className="text-lg font-medium text-gray-900 mb-4">Screen 1</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Title</label>
                    <input
                      type="text"
                      value={localSettings.heroSection?.screen1?.title || ''}
                      onChange={(e) => updateField('heroSection.screen1.title', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      placeholder="Enter title for screen 1"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Subtitle</label>
                    <input
                      type="text"
                      value={localSettings.heroSection?.screen1?.subtitle || ''}
                      onChange={(e) => updateField('heroSection.screen1.subtitle', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      placeholder="Enter subtitle for screen 1"
                    />
                  </div>
                </div>
                <div className="mt-4">
                  <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
                  <textarea
                    value={localSettings.heroSection?.screen1?.description || ''}
                    onChange={(e) => updateField('heroSection.screen1.description', e.target.value)}
                    rows={3}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Enter description for screen 1"
                  />
                </div>
              </div>

              {/* Screen 2 */}
              <div className="mb-8 p-4 border border-gray-200 rounded-lg">
                <h4 className="text-lg font-medium text-gray-900 mb-4">Screen 2</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Title</label>
                    <input
                      type="text"
                      value={localSettings.heroSection?.screen2?.title || ''}
                      onChange={(e) => updateField('heroSection.screen2.title', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      placeholder="Enter title for screen 2"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Subtitle</label>
                    <input
                      type="text"
                      value={localSettings.heroSection?.screen2?.subtitle || ''}
                      onChange={(e) => updateField('heroSection.screen2.subtitle', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      placeholder="Enter subtitle for screen 2"
                    />
                  </div>
                </div>
                <div className="mt-4">
                  <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
                  <textarea
                    value={localSettings.heroSection?.screen2?.description || ''}
                    onChange={(e) => updateField('heroSection.screen2.description', e.target.value)}
                    rows={3}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Enter description for screen 2"
                  />
                </div>
              </div>

              {/* Screen 3 */}
              <div className="mb-8 p-4 border border-gray-200 rounded-lg">
                <h4 className="text-lg font-medium text-gray-900 mb-4">Screen 3</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Title</label>
                    <input
                      type="text"
                      value={localSettings.heroSection?.screen3?.title || ''}
                      onChange={(e) => updateField('heroSection.screen3.title', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      placeholder="Enter title for screen 3"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Subtitle</label>
                    <input
                      type="text"
                      value={localSettings.heroSection?.screen3?.subtitle || ''}
                      onChange={(e) => updateField('heroSection.screen3.subtitle', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      placeholder="Enter subtitle for screen 3"
                    />
                  </div>
                </div>
                <div className="mt-4">
                  <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
                  <textarea
                    value={localSettings.heroSection?.screen3?.description || ''}
                    onChange={(e) => updateField('heroSection.screen3.description', e.target.value)}
                    rows={3}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Enter description for screen 3"
                  />
                </div>
              </div>

              {/* Screen 4 */}
              <div className="mb-8 p-4 border border-gray-200 rounded-lg">
                <h4 className="text-lg font-medium text-gray-900 mb-4">Screen 4</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Title</label>
                    <input
                      type="text"
                      value={localSettings.heroSection?.screen4?.title || ''}
                      onChange={(e) => updateField('heroSection.screen4.title', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      placeholder="Enter title for screen 4"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Subtitle</label>
                    <input
                      type="text"
                      value={localSettings.heroSection?.screen4?.subtitle || ''}
                      onChange={(e) => updateField('heroSection.screen4.subtitle', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      placeholder="Enter subtitle for screen 4"
                    />
                  </div>
                </div>
                <div className="mt-4">
                  <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
                  <textarea
                    value={localSettings.heroSection?.screen4?.description || ''}
                    onChange={(e) => updateField('heroSection.screen4.description', e.target.value)}
                    rows={3}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Enter description for screen 4"
                  />
                </div>
              </div>

              {/* Screen 5 */}
              <div className="mb-8 p-4 border border-gray-200 rounded-lg">
                <h4 className="text-lg font-medium text-gray-900 mb-4">Screen 5</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Title</label>
                    <input
                      type="text"
                      value={localSettings.heroSection?.screen5?.title || ''}
                      onChange={(e) => updateField('heroSection.screen5.title', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      placeholder="Enter title for screen 5"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Subtitle</label>
                    <input
                      type="text"
                      value={localSettings.heroSection?.screen5?.subtitle || ''}
                      onChange={(e) => updateField('heroSection.screen5.subtitle', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      placeholder="Enter subtitle for screen 5"
                    />
                  </div>
                </div>
                <div className="mt-4">
                  <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
                  <textarea
                    value={localSettings.heroSection?.screen5?.description || ''}
                    onChange={(e) => updateField('heroSection.screen5.description', e.target.value)}
                    rows={3}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Enter description for screen 5"
                  />
                </div>
              </div>
            </div>

            {/* Final CTA Section */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <h3 className="text-xl font-semibold text-gray-900 mb-6">Final Call to Action Section</h3>
              
              <div className="space-y-6">
                {/* Main Content */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Badge Text</label>
                    <input
                      type="text"
                      value={localSettings.finalCTA?.badge || ''}
                      onChange={(e) => updateField('finalCTA.badge', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      placeholder="Enter badge text"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Button Text</label>
                    <input
                      type="text"
                      value={localSettings.finalCTA?.buttonText || ''}
                      onChange={(e) => updateField('finalCTA.buttonText', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      placeholder="Enter button text"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Title</label>
                  <input
                    type="text"
                    value={localSettings.finalCTA?.title || ''}
                    onChange={(e) => updateField('finalCTA.title', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Enter main title"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Subtitle</label>
                  <textarea
                    value={localSettings.finalCTA?.subtitle || ''}
                    onChange={(e) => updateField('finalCTA.subtitle', e.target.value)}
                    rows={3}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Enter subtitle description"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Button Link</label>
                  <input
                    type="text"
                    value={localSettings.finalCTA?.buttonLink || ''}
                    onChange={(e) => updateField('finalCTA.buttonLink', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Enter button link (e.g., /products)"
                  />
                </div>

                {/* Statistics Section */}
                <div className="border-t pt-6">
                  <h4 className="text-lg font-medium text-gray-900 mb-4">Statistics</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Customers */}
                    <div className="space-y-3">
                      <h5 className="font-medium text-gray-700">Happy Customers</h5>
                      <div className="grid grid-cols-2 gap-3">
                        <div>
                          <label className="block text-sm font-medium text-gray-600 mb-1">Number</label>
                          <input
                            type="text"
                            value={localSettings.finalCTA?.stats?.customers?.number || ''}
                            onChange={(e) => updateField('finalCTA.stats.customers.number', e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                            placeholder="10K+"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-600 mb-1">Label</label>
                          <input
                            type="text"
                            value={localSettings.finalCTA?.stats?.customers?.label || ''}
                            onChange={(e) => updateField('finalCTA.stats.customers.label', e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                            placeholder="Happy Customers"
                          />
                        </div>
                      </div>
                    </div>

                    {/* Products */}
                    <div className="space-y-3">
                      <h5 className="font-medium text-gray-700">Products</h5>
                      <div className="grid grid-cols-2 gap-3">
                        <div>
                          <label className="block text-sm font-medium text-gray-600 mb-1">Number</label>
                          <input
                            type="text"
                            value={localSettings.finalCTA?.stats?.products?.number || ''}
                            onChange={(e) => updateField('finalCTA.stats.products.number', e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                            placeholder="500+"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-600 mb-1">Label</label>
                          <input
                            type="text"
                            value={localSettings.finalCTA?.stats?.products?.label || ''}
                            onChange={(e) => updateField('finalCTA.stats.products.label', e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                            placeholder="Products"
                          />
                        </div>
                      </div>
                    </div>

                    {/* Countries */}
                    <div className="space-y-3">
                      <h5 className="font-medium text-gray-700">Countries</h5>
                      <div className="grid grid-cols-2 gap-3">
                        <div>
                          <label className="block text-sm font-medium text-gray-600 mb-1">Number</label>
                          <input
                            type="text"
                            value={localSettings.finalCTA?.stats?.countries?.number || ''}
                            onChange={(e) => updateField('finalCTA.stats.countries.number', e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                            placeholder="50+"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-600 mb-1">Label</label>
                          <input
                            type="text"
                            value={localSettings.finalCTA?.stats?.countries?.label || ''}
                            onChange={(e) => updateField('finalCTA.stats.countries.label', e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                            placeholder="Countries"
                          />
                        </div>
                      </div>
                    </div>

                    {/* Satisfaction */}
                    <div className="space-y-3">
                      <h5 className="font-medium text-gray-700">Satisfaction</h5>
                      <div className="grid grid-cols-2 gap-3">
                        <div>
                          <label className="block text-sm font-medium text-gray-600 mb-1">Number</label>
                          <input
                            type="text"
                            value={localSettings.finalCTA?.stats?.satisfaction?.number || ''}
                            onChange={(e) => updateField('finalCTA.stats.satisfaction.number', e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                            placeholder="99%"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-600 mb-1">Label</label>
                          <input
                            type="text"
                            value={localSettings.finalCTA?.stats?.satisfaction?.label || ''}
                            onChange={(e) => updateField('finalCTA.stats.satisfaction.label', e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                            placeholder="Satisfaction"
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Preview Tab */}
        {activeTab === 'preview' && (
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h3 className="text-xl font-semibold text-gray-900 mb-6">Carousel Preview</h3>
            <div className="space-y-6">
              {/* Screen 1 Preview */}
              <div className="p-4 bg-gray-50 rounded-lg">
                <h4 className="text-lg font-medium text-gray-900 mb-2">Screen 1 Preview</h4>
                <div className="text-sm text-gray-600">
                  <p><strong>Title:</strong> {localSettings.heroSection?.screen1?.title || 'No title set'}</p>
                  <p><strong>Subtitle:</strong> {localSettings.heroSection?.screen1?.subtitle || 'No subtitle set'}</p>
                  <p><strong>Description:</strong> {localSettings.heroSection?.screen1?.description || 'No description set'}</p>
                </div>
              </div>

              {/* Screen 2 Preview */}
              <div className="p-4 bg-gray-50 rounded-lg">
                <h4 className="text-lg font-medium text-gray-900 mb-2">Screen 2 Preview</h4>
                <div className="text-sm text-gray-600">
                  <p><strong>Title:</strong> {localSettings.heroSection?.screen2?.title || 'No title set'}</p>
                  <p><strong>Subtitle:</strong> {localSettings.heroSection?.screen2?.subtitle || 'No subtitle set'}</p>
                  <p><strong>Description:</strong> {localSettings.heroSection?.screen2?.description || 'No description set'}</p>
                </div>
              </div>

              {/* Screen 3 Preview */}
              <div className="p-4 bg-gray-50 rounded-lg">
                <h4 className="text-lg font-medium text-gray-900 mb-2">Screen 3 Preview</h4>
                <div className="text-sm text-gray-600">
                  <p><strong>Title:</strong> {localSettings.heroSection?.screen3?.title || 'No title set'}</p>
                  <p><strong>Subtitle:</strong> {localSettings.heroSection?.screen3?.subtitle || 'No subtitle set'}</p>
                  <p><strong>Description:</strong> {localSettings.heroSection?.screen3?.description || 'No description set'}</p>
                </div>
              </div>

              {/* Screen 4 Preview */}
              <div className="p-4 bg-gray-50 rounded-lg">
                <h4 className="text-lg font-medium text-gray-900 mb-2">Screen 4 Preview</h4>
                <div className="text-sm text-gray-600">
                  <p><strong>Title:</strong> {localSettings.heroSection?.screen4?.title || 'No title set'}</p>
                  <p><strong>Subtitle:</strong> {localSettings.heroSection?.screen4?.subtitle || 'No subtitle set'}</p>
                  <p><strong>Description:</strong> {localSettings.heroSection?.screen4?.description || 'No description set'}</p>
                </div>
              </div>

              {/* Screen 5 Preview */}
              <div className="p-4 bg-gray-50 rounded-lg">
                <h4 className="text-lg font-medium text-gray-900 mb-2">Screen 5 Preview</h4>
                <div className="text-sm text-gray-600">
                  <p><strong>Title:</strong> {localSettings.heroSection?.screen5?.title || 'No title set'}</p>
                  <p><strong>Subtitle:</strong> {localSettings.heroSection?.screen5?.subtitle || 'No subtitle set'}</p>
                  <p><strong>Description:</strong> {localSettings.heroSection?.screen5?.description || 'No description set'}</p>
                </div>
              </div>

              {/* Final CTA Preview */}
              <div className="p-4 bg-gray-50 rounded-lg">
                <h4 className="text-lg font-medium text-gray-900 mb-2">Final CTA Preview</h4>
                <div className="text-sm text-gray-600">
                  <p><strong>Badge:</strong> {localSettings.finalCTA?.badge || 'No badge set'}</p>
                  <p><strong>Title:</strong> {localSettings.finalCTA?.title || 'No title set'}</p>
                  <p><strong>Subtitle:</strong> {localSettings.finalCTA?.subtitle || 'No subtitle set'}</p>
                  <p><strong>Button Text:</strong> {localSettings.finalCTA?.buttonText || 'No button text set'}</p>
                  <p><strong>Button Link:</strong> {localSettings.finalCTA?.buttonLink || 'No button link set'}</p>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminHomePage;
