import React, { useState } from 'react';
import { Link, useLocation, useNavigate, Outlet } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { 
  FaHome, 
  FaBox, 
  FaShoppingCart, 
  FaUsers, 
  FaTags, 
  FaStar, 
  FaCog, 
  FaSignOutAlt,
  FaBars,
  FaTimes,
  FaStore,
  FaChartLine,
  FaClipboardList,
  FaBuilding
} from 'react-icons/fa';

const AdminLayout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { logout } = useAuth();

  const navigation = [
    { name: 'Dashboard', href: '/admin', icon: FaHome },
    { name: 'Products', href: '/admin/products', icon: FaBox },
    { name: 'Orders', href: '/admin/orders', icon: FaShoppingCart },
    { name: 'Users', href: '/admin/users', icon: FaUsers },
    { name: 'Settings', href: '/admin/settings', icon: FaCog },
    { name: 'Footer', href: '/admin/footer', icon: FaBuilding },
    { name: 'Categories', href: '/admin/categories', icon: FaTags },
    { name: 'Brands', href: '/admin/brands', icon: FaStar },
  ];

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  const isActive = (path) => {
    if (path === '/admin') {
      return location.pathname === '/admin';
    }
    return location.pathname.startsWith(path);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Mobile sidebar overlay */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 z-40 bg-black bg-opacity-50 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <div className={`fixed top-16 left-0 bottom-0 z-50 w-64 bg-white shadow-lg transform transition-transform duration-300 ease-in-out lg:translate-x-0 lg:fixed lg:inset-y-0 lg:top-16 ${
        sidebarOpen ? 'translate-x-0' : '-translate-x-full'
      }`}>
        <div className="flex flex-col h-full overflow-y-auto">
          {/* Sidebar header */}
          <div className="flex items-center justify-between p-4 sm:p-6 border-b border-gray-200 flex-shrink-0">
            <div className="flex items-center space-x-2 sm:space-x-3">
              <div className="w-6 h-6 sm:w-8 sm:h-8 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
                <FaStore className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
              </div>
              <span className="text-base sm:text-lg font-bold text-gray-900">Admin</span>
            </div>
            <button
              onClick={() => setSidebarOpen(false)}
              className="lg:hidden p-1.5 sm:p-2 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-100"
            >
              <FaTimes className="w-4 h-4 sm:w-5 sm:h-5" />
            </button>
          </div>

          {/* Navigation */}
          <nav className="flex-1 px-3 sm:px-4 py-4 sm:py-6 space-y-1 sm:space-y-2 overflow-y-auto">
            {navigation.map((item) => {
              const Icon = item.icon;
              return (
                <Link
                  key={item.name}
                  to={item.href}
                  className={`flex items-center space-x-2 sm:space-x-3 px-3 sm:px-4 py-2.5 sm:py-3 rounded-lg sm:rounded-xl text-xs sm:text-sm font-medium transition-colors ${
                    isActive(item.href)
                      ? 'bg-blue-50 text-blue-700 border border-blue-200'
                      : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
                  }`}
                  onClick={() => setSidebarOpen(false)}
                >
                  <Icon className="w-4 h-4 sm:w-5 sm:h-5" />
                  <span>{item.name}</span>
                </Link>
              );
            })}
          </nav>

          {/* Sidebar footer */}
          <div className="p-3 sm:p-4 border-t border-gray-200 flex-shrink-0">
            <button
              onClick={handleLogout}
              className="flex items-center space-x-2 sm:space-x-3 w-full px-3 sm:px-4 py-2.5 sm:py-3 text-xs sm:text-sm font-medium text-gray-600 hover:bg-gray-100 hover:text-gray-900 rounded-lg sm:rounded-xl transition-colors"
            >
              <FaSignOutAlt className="w-4 h-4 sm:w-5 sm:h-5" />
              <span>Sign Out</span>
            </button>
          </div>
        </div>
      </div>

      {/* Main content */}
      <div className="lg:ml-64 lg:flex-1 lg:flex lg:flex-col lg:min-h-screen ">
        {/* Top bar */}
        <div className="sticky top-0 z-30 bg-white shadow-sm border-b border-gray-200">
          <div className="flex items-center justify-between px-3 sm:px-4 py-3 sm:py-4 lg:px-8">
            <div className="flex items-center">
              <button
                onClick={() => setSidebarOpen(true)}
                className="lg:hidden p-1.5 sm:p-2 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-100 mr-2 sm:mr-3"
              >
                <FaBars className="w-4 h-4 sm:w-5 sm:h-5" />
              </button>
              <h1 className="text-lg sm:text-xl font-semibold text-gray-900">
                {navigation.find(item => isActive(item.href))?.name || 'Admin Panel'}
              </h1>
            </div>
            
            <div className="flex items-center space-x-3 sm:space-x-4">
              <div className="hidden sm:flex items-center space-x-2 text-sm text-gray-500">
                <FaChartLine className="w-4 h-4" />
                <span>Analytics</span>
              </div>
              <div className="w-6 h-6 sm:w-8 sm:h-8 bg-gray-200 rounded-full flex items-center justify-center">
                <FaUsers className="w-3 h-3 sm:w-4 sm:h-4 text-gray-600" />
              </div>
            </div>
          </div>
        </div>

        {/* Page content */}
        <main className="flex-1 bg-gray-50">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;

