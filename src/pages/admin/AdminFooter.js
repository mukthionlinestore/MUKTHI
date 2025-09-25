import React, { useState, useEffect } from 'react';
import { 
  FaSave, 
  FaSpinner, 
  FaCheckCircle, 
  FaExclamationTriangle,
  FaBuilding,
  FaMapMarkerAlt,
  FaPhone,
  FaEnvelope,
  FaClock,
  FaLink,
  FaFacebook,
  FaTwitter,
  FaInstagram,
  FaLinkedin,
  FaPlus,
  FaTrash,
  FaInfoCircle
} from 'react-icons/fa';
import axios from '../../config/axios';
import { toast } from 'react-toastify';

const AdminFooter = () => {
  const [footerData, setFooterData] = useState({
    companyName: '',
    companyDescription: '',
    address: {
      street: '',
      city: '',
      state: '',
      zipCode: '',
      country: ''
    },
    contact: {
      phone: '',
      email: '',
      supportEmail: ''
    },
    socialMedia: {
      facebook: '',
      twitter: '',
      instagram: '',
      linkedin: ''
    },
    businessHours: '',
    copyrightText: '',
    quickLinks: [],
    isActive: true
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [hasChanges, setHasChanges] = useState(false);
  const [newQuickLink, setNewQuickLink] = useState({ title: '', url: '' });

  useEffect(() => {
    fetchFooterData();
  }, []);

  const fetchFooterData = async () => {
    try {
      setLoading(true);
      const response = await axios.get('/api/footer/admin');
      setFooterData(response.data);
    } catch (error) {
      console.error('Error fetching footer data:', error);
      toast.error('Failed to load footer data');
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (field, value) => {
    const newFooterData = { ...footerData, [field]: value };
    setFooterData(newFooterData);
    setHasChanges(true);
  };

  const handleNestedInputChange = (parentField, field, value) => {
    const newFooterData = {
      ...footerData,
      [parentField]: {
        ...footerData[parentField],
        [field]: value
      }
    };
    setFooterData(newFooterData);
    setHasChanges(true);
  };

  const addQuickLink = () => {
    if (newQuickLink.title.trim() && newQuickLink.url.trim()) {
      const newFooterData = {
        ...footerData,
        quickLinks: [...footerData.quickLinks, { ...newQuickLink }]
      };
      setFooterData(newFooterData);
      setNewQuickLink({ title: '', url: '' });
      setHasChanges(true);
    }
  };

  const removeQuickLink = (index) => {
    const newFooterData = {
      ...footerData,
      quickLinks: footerData.quickLinks.filter((_, i) => i !== index)
    };
    setFooterData(newFooterData);
    setHasChanges(true);
  };

  const handleSave = async () => {
    try {
      setSaving(true);
      await axios.put('/api/footer/admin', footerData);
      toast.success('Footer data saved successfully!');
      setHasChanges(false);
    } catch (error) {
      console.error('Error saving footer data:', error);
      toast.error('Failed to save footer data');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 flex items-center justify-center">
        <div className="text-center">
          <FaSpinner className="w-8 h-8 sm:w-12 sm:h-12 text-blue-600 animate-spin mx-auto mb-4" />
          <p className="text-sm sm:text-base text-gray-600">Loading footer data...</p>
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
              <div className="w-8 h-8 sm:w-10 sm:h-10 bg-gradient-to-r from-green-500 to-emerald-500 rounded-lg flex items-center justify-center">
                <FaBuilding className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
              </div>
              <div>
                <h1 className="text-lg sm:text-xl lg:text-2xl font-bold text-gray-900">Footer Management</h1>
                <p className="text-xs sm:text-sm text-gray-600">Manage company details and footer information</p>
              </div>
            </div>
            
            <button
              onClick={handleSave}
              disabled={!hasChanges || saving}
              className="inline-flex items-center justify-center gap-1.5 sm:gap-2 rounded-lg bg-gradient-to-r from-green-500 to-emerald-600 text-white px-4 py-2 text-sm font-medium hover:from-green-600 hover:to-emerald-700 disabled:opacity-60 disabled:cursor-not-allowed transition-all duration-200 shadow-sm hover:shadow-md"
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
      <div className="max-w-6xl mx-auto px-3 sm:px-4 lg:px-6 py-4 sm:py-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
          
          {/* Company Information */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 sm:p-6">
            <div className="flex items-center gap-2 sm:gap-3 mb-4 sm:mb-6">
              <div className="w-8 h-8 sm:w-10 sm:h-10 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-lg flex items-center justify-center">
                <FaBuilding className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
              </div>
              <div>
                <h2 className="text-lg sm:text-xl font-bold text-gray-900">Company Information</h2>
                <p className="text-xs sm:text-sm text-gray-600">Basic company details</p>
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Company Name *
                </label>
                <input
                  type="text"
                  value={footerData.companyName}
                  onChange={(e) => handleInputChange('companyName', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200"
                  placeholder="Enter company name"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Company Description *
                </label>
                <textarea
                  value={footerData.companyDescription}
                  onChange={(e) => handleInputChange('companyDescription', e.target.value)}
                  rows="3"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200 resize-none"
                  placeholder="Enter company description"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Copyright Text
                </label>
                <input
                  type="text"
                  value={footerData.copyrightText}
                  onChange={(e) => handleInputChange('copyrightText', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200"
                  placeholder="© 2024 Company Name. All rights reserved."
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Business Hours
                </label>
                <input
                  type="text"
                  value={footerData.businessHours}
                  onChange={(e) => handleInputChange('businessHours', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200"
                  placeholder="Monday - Friday: 9:00 AM - 6:00 PM"
                />
              </div>
            </div>
          </div>

          {/* Contact Information */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 sm:p-6">
            <div className="flex items-center gap-2 sm:gap-3 mb-4 sm:mb-6">
              <div className="w-8 h-8 sm:w-10 sm:h-10 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg flex items-center justify-center">
                <FaPhone className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
              </div>
              <div>
                <h2 className="text-lg sm:text-xl font-bold text-gray-900">Contact Information</h2>
                <p className="text-xs sm:text-sm text-gray-600">Phone, email, and support details</p>
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Phone Number
                </label>
                <div className="relative">
                  <FaPhone className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <input
                    type="tel"
                    value={footerData.contact.phone}
                    onChange={(e) => handleNestedInputChange('contact', 'phone', e.target.value)}
                    className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200"
                    placeholder="+1 (555) 123-4567"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Email Address
                </label>
                <div className="relative">
                  <FaEnvelope className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <input
                    type="email"
                    value={footerData.contact.email}
                    onChange={(e) => handleNestedInputChange('contact', 'email', e.target.value)}
                    className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200"
                    placeholder="info@company.com"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Support Email
                </label>
                <div className="relative">
                  <FaEnvelope className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <input
                    type="email"
                    value={footerData.contact.supportEmail}
                    onChange={(e) => handleNestedInputChange('contact', 'supportEmail', e.target.value)}
                    className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200"
                    placeholder="support@company.com"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Address Information */}
        <div className="mt-4 sm:mt-6 bg-white rounded-xl shadow-sm border border-gray-200 p-4 sm:p-6">
          <div className="flex items-center gap-2 sm:gap-3 mb-4 sm:mb-6">
            <div className="w-8 h-8 sm:w-10 sm:h-10 bg-gradient-to-r from-orange-500 to-red-500 rounded-lg flex items-center justify-center">
              <FaMapMarkerAlt className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
            </div>
            <div>
              <h2 className="text-lg sm:text-xl font-bold text-gray-900">Address Information</h2>
              <p className="text-xs sm:text-sm text-gray-600">Company address details</p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Street Address
              </label>
              <input
                type="text"
                value={footerData.address.street}
                onChange={(e) => handleNestedInputChange('address', 'street', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200"
                placeholder="123 Main Street"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                City
              </label>
              <input
                type="text"
                value={footerData.address.city}
                onChange={(e) => handleNestedInputChange('address', 'city', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200"
                placeholder="New York"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                State/Province
              </label>
              <input
                type="text"
                value={footerData.address.state}
                onChange={(e) => handleNestedInputChange('address', 'state', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200"
                placeholder="NY"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                ZIP/Postal Code
              </label>
              <input
                type="text"
                value={footerData.address.zipCode}
                onChange={(e) => handleNestedInputChange('address', 'zipCode', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200"
                placeholder="10001"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Country
              </label>
              <input
                type="text"
                value={footerData.address.country}
                onChange={(e) => handleNestedInputChange('address', 'country', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200"
                placeholder="United States"
              />
            </div>
          </div>
        </div>

        {/* Social Media Links */}
        <div className="mt-4 sm:mt-6 bg-white rounded-xl shadow-sm border border-gray-200 p-4 sm:p-6">
          <div className="flex items-center gap-2 sm:gap-3 mb-4 sm:mb-6">
            <div className="w-8 h-8 sm:w-10 sm:h-10 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-lg flex items-center justify-center">
              <FaFacebook className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
            </div>
            <div>
              <h2 className="text-lg sm:text-xl font-bold text-gray-900">Social Media Links</h2>
              <p className="text-xs sm:text-sm text-gray-600">Social media profile URLs</p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Facebook URL
              </label>
              <div className="relative">
                <FaFacebook className="absolute left-3 top-1/2 -translate-y-1/2 text-blue-600 w-4 h-4" />
                <input
                  type="url"
                  value={footerData.socialMedia.facebook}
                  onChange={(e) => handleNestedInputChange('socialMedia', 'facebook', e.target.value)}
                  className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200"
                  placeholder="https://facebook.com/company"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Twitter URL
              </label>
              <div className="relative">
                <FaTwitter className="absolute left-3 top-1/2 -translate-y-1/2 text-blue-400 w-4 h-4" />
                <input
                  type="url"
                  value={footerData.socialMedia.twitter}
                  onChange={(e) => handleNestedInputChange('socialMedia', 'twitter', e.target.value)}
                  className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200"
                  placeholder="https://twitter.com/company"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Instagram URL
              </label>
              <div className="relative">
                <FaInstagram className="absolute left-3 top-1/2 -translate-y-1/2 text-pink-600 w-4 h-4" />
                <input
                  type="url"
                  value={footerData.socialMedia.instagram}
                  onChange={(e) => handleNestedInputChange('socialMedia', 'instagram', e.target.value)}
                  className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200"
                  placeholder="https://instagram.com/company"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                LinkedIn URL
              </label>
              <div className="relative">
                <FaLinkedin className="absolute left-3 top-1/2 -translate-y-1/2 text-blue-700 w-4 h-4" />
                <input
                  type="url"
                  value={footerData.socialMedia.linkedin}
                  onChange={(e) => handleNestedInputChange('socialMedia', 'linkedin', e.target.value)}
                  className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200"
                  placeholder="https://linkedin.com/company/company"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Quick Links */}
        <div className="mt-4 sm:mt-6 bg-white rounded-xl shadow-sm border border-gray-200 p-4 sm:p-6">
          <div className="flex items-center gap-2 sm:gap-3 mb-4 sm:mb-6">
            <div className="w-8 h-8 sm:w-10 sm:h-10 bg-gradient-to-r from-teal-500 to-cyan-500 rounded-lg flex items-center justify-center">
              <FaLink className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
            </div>
            <div>
              <h2 className="text-lg sm:text-xl font-bold text-gray-900">Quick Links</h2>
              <p className="text-xs sm:text-sm text-gray-600">Footer navigation links</p>
            </div>
          </div>

          <div className="space-y-4">
            {/* Add New Quick Link */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Link Title
                </label>
                <input
                  type="text"
                  value={newQuickLink.title}
                  onChange={(e) => setNewQuickLink({ ...newQuickLink, title: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200"
                  placeholder="About Us"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Link URL
                </label>
                <input
                  type="text"
                  value={newQuickLink.url}
                  onChange={(e) => setNewQuickLink({ ...newQuickLink, url: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200"
                  placeholder="/about"
                />
              </div>
              <div className="flex items-end">
                <button
                  onClick={addQuickLink}
                  className="w-full inline-flex items-center justify-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors duration-200"
                >
                  <FaPlus className="w-3 h-3" />
                  Add Link
                </button>
              </div>
            </div>

            {/* Existing Quick Links */}
            <div className="space-y-2">
              {footerData.quickLinks.map((link, index) => (
                <div key={index} className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                  <div className="flex-1">
                    <span className="font-medium text-gray-900">{link.title}</span>
                    <span className="text-gray-500 ml-2">→ {link.url}</span>
                  </div>
                  <button
                    onClick={() => removeQuickLink(index)}
                    className="text-red-600 hover:text-red-800 transition-colors duration-200"
                  >
                    <FaTrash className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Save Status */}
        {hasChanges && (
          <div className="mt-6 p-4 bg-yellow-50 rounded-lg border border-yellow-200">
            <div className="flex items-center gap-2">
              <FaExclamationTriangle className="w-4 h-4 text-yellow-600" />
              <p className="text-sm text-yellow-700">
                You have unsaved changes. Click "Save Changes" to apply your footer settings.
              </p>
            </div>
          </div>
        )}

        {!hasChanges && !loading && (
          <div className="mt-6 p-4 bg-emerald-50 rounded-lg border border-emerald-200">
            <div className="flex items-center gap-2">
              <FaCheckCircle className="w-4 h-4 text-emerald-600" />
              <p className="text-sm text-emerald-700">
                All footer settings are saved and up to date.
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminFooter;
