import React, { useState, useEffect } from 'react';
import { 
  FaCog, 
  FaSave, 
  FaSpinner, 
  FaCheckCircle, 
  FaExclamationTriangle,
  FaPercentage,
  FaDollarSign,
  FaEuro,
  FaPoundSign,
  FaYenSign,
  FaRupeeSign,
  FaShieldAlt,
  FaInfoCircle
} from 'react-icons/fa';
import axios from '../../config/axios';
import { toast } from 'react-toastify';

const AdminSettings = () => {
  const [settings, setSettings] = useState({
    taxPercentage: 0,
    currency: 'USD',
    currencySymbol: '$',
    freeShippingThreshold: 50
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [hasChanges, setHasChanges] = useState(false);

  const currencyOptions = [
    { code: 'USD', symbol: '$', name: 'US Dollar' },
    { code: 'EUR', symbol: '€', name: 'Euro' },
    { code: 'GBP', symbol: '£', name: 'British Pound' },
    { code: 'JPY', symbol: '¥', name: 'Japanese Yen' },
    { code: 'INR', symbol: '₹', name: 'Indian Rupee' },
    { code: 'CAD', symbol: 'C$', name: 'Canadian Dollar' },
    { code: 'AUD', symbol: 'A$', name: 'Australian Dollar' },
    { code: 'CHF', symbol: 'CHF', name: 'Swiss Franc' }
  ];

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    try {
      setLoading(true);
      const response = await axios.get('/api/settings/admin');
      setSettings(response.data);
    } catch (error) {
      console.error('Error fetching settings:', error);
      toast.error('Failed to load settings');
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (field, value) => {
    const newSettings = { ...settings, [field]: value };
    setSettings(newSettings);
    setHasChanges(true);
  };

  const handleCurrencyChange = (currencyCode) => {
    const selectedCurrency = currencyOptions.find(c => c.code === currencyCode);
    const newSettings = {
      ...settings,
      currency: currencyCode,
      currencySymbol: selectedCurrency.symbol
    };
    setSettings(newSettings);
    setHasChanges(true);
  };

  const handleSave = async () => {
    try {
      setSaving(true);
      await axios.put('/api/settings/admin', settings);
      toast.success('Settings saved successfully!');
      setHasChanges(false);
    } catch (error) {
      console.error('Error saving settings:', error);
      toast.error('Failed to save settings');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 flex items-center justify-center">
        <div className="text-center">
          <FaSpinner className="w-8 h-8 sm:w-12 sm:h-12 text-blue-600 animate-spin mx-auto mb-4" />
          <p className="text-sm sm:text-base text-gray-600">Loading settings...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-3 sm:px-4 lg:px-6 py-4 sm:py-6">
          <div className="flex items-center justify-between gap-3 sm:gap-4">
            <div className="flex items-center gap-3 sm:gap-4">
              <div className="w-8 h-8 sm:w-10 sm:h-10 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-lg flex items-center justify-center">
                <FaCog className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
              </div>
              <div>
                <h1 className="text-lg sm:text-xl lg:text-2xl font-bold text-gray-900">Store Settings</h1>
                <p className="text-xs sm:text-sm text-gray-600">Manage tax and currency settings</p>
              </div>
            </div>
            
            <button
              onClick={handleSave}
              disabled={!hasChanges || saving}
              className="inline-flex items-center justify-center gap-1.5 sm:gap-2 rounded-lg bg-gradient-to-r from-blue-500 to-indigo-600 text-white px-4 py-2 text-sm font-medium hover:from-blue-600 hover:to-indigo-700 disabled:opacity-60 disabled:cursor-not-allowed transition-all duration-200 shadow-sm hover:shadow-md"
            >
              {saving ? (
                <>
                  <FaSpinner className="w-3 h-3 sm:w-4 sm:h-4 animate-spin" />
                  Saving...
                </>
              ) : (
                <>
                  <FaSave className="w-3 h-3 sm:w-4 sm:h-4" />
                  Save Changes
                </>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-4xl mx-auto px-3 sm:px-4 lg:px-6 py-4 sm:py-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
          
          {/* Tax Settings */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 sm:p-6">
            <div className="flex items-center gap-2 sm:gap-3 mb-4 sm:mb-6">
              <div className="w-8 h-8 sm:w-10 sm:h-10 bg-gradient-to-r from-emerald-500 to-teal-500 rounded-lg flex items-center justify-center">
                <FaPercentage className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
              </div>
              <div>
                <h2 className="text-lg sm:text-xl font-bold text-gray-900">Tax Settings</h2>
                <p className="text-xs sm:text-sm text-gray-600">Configure sales tax percentage</p>
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Tax Percentage
                </label>
                <div className="relative">
                  <input
                    type="number"
                    min="0"
                    max="100"
                    step="0.01"
                    value={settings.taxPercentage}
                    onChange={(e) => handleInputChange('taxPercentage', parseFloat(e.target.value) || 0)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200"
                    placeholder="0.00"
                  />
                  <div className="absolute inset-y-0 right-0 flex items-center pr-3">
                    <FaPercentage className="w-4 h-4 text-gray-400" />
                  </div>
                </div>
                <p className="text-xs text-gray-500 mt-1">
                  Enter the tax percentage (e.g., 8.5 for 8.5%)
                </p>
              </div>

              <div className="p-3 bg-blue-50 rounded-lg border border-blue-100">
                <div className="flex items-center gap-2">
                  <FaInfoCircle className="w-4 h-4 text-blue-600" />
                  <p className="text-sm text-blue-700">
                    Tax will be automatically calculated on all orders based on this percentage.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Currency Settings */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 sm:p-6">
            <div className="flex items-center gap-2 sm:gap-3 mb-4 sm:mb-6">
              <div className="w-8 h-8 sm:w-10 sm:h-10 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg flex items-center justify-center">
                <FaDollarSign className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
              </div>
              <div>
                <h2 className="text-lg sm:text-xl font-bold text-gray-900">Currency Settings</h2>
                <p className="text-xs sm:text-sm text-gray-600">Select your store currency</p>
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Currency
                </label>
                <select
                  value={settings.currency}
                  onChange={(e) => handleCurrencyChange(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200"
                >
                  {currencyOptions.map((currency) => (
                    <option key={currency.code} value={currency.code}>
                      {currency.symbol} {currency.code} - {currency.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Currency Symbol
                </label>
                <div className="flex items-center gap-2">
                  <span className="text-2xl font-bold text-gray-900">
                    {settings.currencySymbol}
                  </span>
                  <span className="text-sm text-gray-600">
                    (Auto-updated based on currency selection)
                  </span>
                </div>
              </div>

              <div className="p-3 bg-purple-50 rounded-lg border border-purple-100">
                <div className="flex items-center gap-2">
                  <FaInfoCircle className="w-4 h-4 text-purple-600" />
                  <p className="text-sm text-purple-700">
                    Currency symbol will be used throughout the store for price displays.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Shipping Settings */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 sm:p-6">
          <div className="flex items-center gap-2 sm:gap-3 mb-4 sm:mb-6">
            <div className="w-8 h-8 sm:w-10 sm:h-10 bg-gradient-to-r from-green-500 to-emerald-500 rounded-lg flex items-center justify-center">
              <FaShieldAlt className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
            </div>
            <div>
              <h2 className="text-lg sm:text-xl font-bold text-gray-900">Shipping Settings</h2>
              <p className="text-xs sm:text-sm text-gray-600">Configure free shipping threshold</p>
            </div>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Free Shipping Threshold
              </label>
              <div className="relative">
                <input
                  type="number"
                  min="0"
                  step="0.01"
                  value={settings.freeShippingThreshold}
                  onChange={(e) => handleInputChange('freeShippingThreshold', parseFloat(e.target.value) || 0)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200"
                  placeholder="50.00"
                />
                <div className="absolute inset-y-0 right-0 flex items-center pr-3">
                  <span className="text-gray-400">{settings.currencySymbol}</span>
                </div>
              </div>
              <p className="text-xs text-gray-500 mt-1">
                Orders above this amount will qualify for free shipping
              </p>
            </div>

            <div className="p-3 bg-green-50 rounded-lg border border-green-100">
              <div className="flex items-center gap-2">
                <FaInfoCircle className="w-4 h-4 text-green-600" />
                <p className="text-sm text-green-700">
                  Individual product shipping charges will be applied for orders below this threshold.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Preview Section */}
        <div className="mt-6 sm:mt-8 bg-white rounded-xl shadow-sm border border-gray-200 p-4 sm:p-6">
          <div className="flex items-center gap-2 sm:gap-3 mb-4 sm:mb-6">
            <div className="w-8 h-8 sm:w-10 sm:h-10 bg-gradient-to-r from-yellow-500 to-orange-500 rounded-lg flex items-center justify-center">
              <FaShieldAlt className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
            </div>
            <div>
              <h2 className="text-lg sm:text-xl font-bold text-gray-900">Settings Preview</h2>
              <p className="text-xs sm:text-sm text-gray-600">How your settings will appear</p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            <div className="p-4 bg-gray-50 rounded-lg">
              <h3 className="text-sm font-semibold text-gray-900 mb-2">Product Price</h3>
              <p className="text-lg font-bold text-gray-900">
                {settings.currencySymbol}99.99
              </p>
            </div>
            
            <div className="p-4 bg-gray-50 rounded-lg">
              <h3 className="text-sm font-semibold text-gray-900 mb-2">Tax Amount</h3>
              <p className="text-lg font-bold text-gray-900">
                {settings.currencySymbol}{(99.99 * settings.taxPercentage / 100).toFixed(2)}
              </p>
              <p className="text-xs text-gray-600">
                ({settings.taxPercentage}% of {settings.currencySymbol}99.99)
              </p>
            </div>
            
            <div className="p-4 bg-gray-50 rounded-lg">
              <h3 className="text-sm font-semibold text-gray-900 mb-2">Total with Tax</h3>
              <p className="text-lg font-bold text-emerald-600">
                {settings.currencySymbol}{(99.99 * (1 + settings.taxPercentage / 100)).toFixed(2)}
              </p>
            </div>
          </div>
        </div>

        {/* Save Status */}
        {hasChanges && (
          <div className="mt-6 p-4 bg-yellow-50 rounded-lg border border-yellow-200">
            <div className="flex items-center gap-2">
              <FaExclamationTriangle className="w-4 h-4 text-yellow-600" />
              <p className="text-sm text-yellow-700">
                You have unsaved changes. Click "Save Changes" to apply your settings.
              </p>
            </div>
          </div>
        )}

        {!hasChanges && !loading && (
          <div className="mt-6 p-4 bg-emerald-50 rounded-lg border border-emerald-200">
            <div className="flex items-center gap-2">
              <FaCheckCircle className="w-4 h-4 text-emerald-600" />
              <p className="text-sm text-emerald-700">
                All settings are saved and up to date.
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminSettings;
