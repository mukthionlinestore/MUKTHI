import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import './styles/global-theme.css';

// Context Providers
import { AuthProvider } from './context/AuthContext';
import { CartProvider } from './context/CartContext';
import { WishlistProvider } from './context/WishlistContext';
import { SettingsProvider } from './context/SettingsContext';
import { FooterProvider } from './context/FooterContext';
import { WebsiteConfigProvider, useWebsiteConfig } from './context/WebsiteConfigContext';
import { HomePageSettingsProvider } from './context/HomePageSettingsContext';
import { NotificationProvider } from './context/NotificationContext';

// Theme Provider
import ThemeProvider from './components/ThemeProvider';

// Components
import Navbar from './components/layout/Navbar';
import ProtectedRoute from './components/auth/ProtectedRoute';
import AdminRoute from './components/auth/AdminRoute';
import AdminLayout from './components/AdminLayout';
import WebsiteWrapper from './components/WebsiteWrapper';

// Pages
import Home from './pages/Home';
import Products from './pages/Products';
import About from './pages/About';
import Login from './pages/Login';
import Register from './pages/Register';
import ForgotPassword from './pages/ForgotPassword';
import ResetPassword from './pages/ResetPassword';
import ResetPasswordOTP from './pages/ResetPasswordOTP';
import VerifyEmail from './pages/VerifyEmail';
import VerifySignupOTP from './pages/VerifySignupOTP';
import Dashboard from './pages/Dashboard';
import ProductDetail from './pages/ProductDetail';
import Cart from './pages/Cart';
import Wishlist from './pages/Wishlist';
import Notifications from './pages/Notifications';
import Checkout from './pages/Checkout';
import Payment from './pages/Payment';
import Orders from './pages/Orders';
import OrderDetail from './pages/OrderDetail';
import Profile from './pages/Profile';
import GoogleCallback from './pages/GoogleCallback';

// Admin Pages
import AdminDashboard from './pages/admin/AdminDashboard';
import AdminProducts from './pages/admin/AdminProducts';
import AddProduct from './pages/admin/AddProduct';
import EditProduct from './pages/admin/EditProduct';
import AdminOrders from './pages/admin/AdminOrders';
import AdminUsers from './pages/admin/AdminUsers';
import AdminSettings from './pages/admin/AdminSettings';
import AdminFooter from './pages/admin/AdminFooter';
import AdminNotifications from './pages/admin/AdminNotifications';
import ManageCategories from './pages/admin/ManageCategories';
import ManageBrands from './pages/admin/ManageBrands';
import AdminHomePage from './pages/admin/AdminHomePage';

// Super Admin Pages
import SuperAdminDashboard from './pages/SuperAdminDashboard';

// Dynamic Background Component
function DynamicBackground() {
  const { config } = useWebsiteConfig();
  
  const theme = config?.backgroundTheme || 'type1';
  
  // Define gradient classes for each theme
  const gradientClasses = {
    type1: 'bg-gradient-to-br from-blue-600/20 via-transparent to-purple-600/20',
    type2: 'bg-gradient-to-br from-red-600/20 via-transparent to-red-800/20',
    type3: 'bg-gradient-to-br from-red-900/20 via-transparent to-red-950/20',
    type4: 'bg-gradient-to-br from-amber-600/20 via-transparent to-amber-800/20',
    type5: 'bg-gradient-to-br from-red-800/20 via-transparent to-red-900/20',
    type6: 'bg-gradient-to-br from-black/30 via-transparent to-black/20',
    type7: ''
  };
  
  // Define animated element colors for each theme
  const animatedColors = {
    type1: {
      color1: 'bg-blue-500/10',
      color2: 'bg-purple-500/10',
      color3: 'bg-pink-500/10',
      color4: 'bg-green-500/10'
    },
    type2: {
      color1: 'bg-red-500/10',
      color2: 'bg-red-600/10',
      color3: 'bg-red-700/10',
      color4: 'bg-red-800/10'
    },
    type3: {
      color1: 'bg-red-800/10',
      color2: 'bg-red-900/10',
      color3: 'bg-red-950/10',
      color4: 'bg-rose-900/10'
    },
    type4: {
      color1: 'bg-amber-600/10',
      color2: 'bg-amber-700/10',
      color3: 'bg-yellow-600/10',
      color4: 'bg-yellow-700/10'
    },
    type5: {
      color1: 'bg-red-700/10',
      color2: 'bg-red-800/10',
      color3: 'bg-orange-500/10',
      color4: 'bg-orange-600/10'
    },
    type6: {
      color1: 'bg-black/20',
      color2: 'bg-black/25',
      color3: 'bg-black/15',
      color4: 'bg-black/18'
    }
  };
  
  const colors = animatedColors[theme] || animatedColors.type1;
  
  return (
    <>
      {/* Single Gradient Overlay for Entire Application */}
      <div className={`absolute inset-0 pointer-events-none ${
        theme === 'type6' 
          ? 'bg-gradient-to-br from-black/40 via-transparent to-black/30'
          : gradientClasses[theme] || gradientClasses.type1
      }`} style={theme === 'type6' ? {backgroundColor: '#A10C17'} : {}}></div>
      
      {/* Flower Image Background for Type 6 */}
      {theme === 'type6' && (
        <div 
          className="absolute inset-0 pointer-events-none bg-cover bg-center bg-no-repeat"
          style={{
            backgroundImage: `url('/images/flower-background.jpg')`,
            opacity: 0.4
          }}
        ></div>
      )}
      
      {/* Background Image for Type 7 */}
      {theme === 'type7' && config?.backgroundImageUrl && (
        <div
          className="absolute inset-0 pointer-events-none bg-no-repeat bg-center bg-cover"
          style={{ backgroundImage: `url('${config.backgroundImageUrl}')` }}
        ></div>
      )}

      {/* Additional black overlay for Type 6 to enhance contrast */}
      {theme === 'type6' && (
        <div className="absolute inset-0 bg-gradient-to-br from-black/20 via-transparent to-black/15 pointer-events-none"></div>
      )}
      
      {/* Animated Background Elements */}
      <div className="absolute inset-0">
        <div className={`absolute top-10 left-10 w-24 h-24 rounded-full animate-pulse ${colors.color1}`}></div>
        <div className={`absolute top-20 right-20 w-16 h-16 rounded-full animate-pulse animation-delay-1000 ${colors.color2}`}></div>
        <div className={`absolute bottom-10 left-1/4 w-20 h-20 rounded-full animate-pulse animation-delay-2000 ${colors.color3}`}></div>
        <div className={`absolute bottom-20 right-1/3 w-12 h-12 rounded-full animate-pulse animation-delay-3000 ${colors.color4}`}></div>
        
        {/* Additional black elements for Type 6 */}
        {theme === 'type6' && (
          <>
            <div className="absolute top-1/3 right-1/3 w-8 h-8 bg-black/20 rounded-full animate-pulse animation-delay-500"></div>
            <div className="absolute bottom-1/3 left-1/3 w-6 h-6 bg-black/25 rounded-full animate-pulse animation-delay-1500"></div>
            <div className="absolute top-2/3 left-1/2 w-10 h-10 bg-black/15 rounded-full animate-pulse animation-delay-2500"></div>
          </>
        )}
      </div>
    </>
  );
}

function App() {
  return (
    <AuthProvider>
      <WebsiteConfigProvider>
        <HomePageSettingsProvider>
          <ThemeProvider>
            <SettingsProvider>
              <FooterProvider>
                <CartProvider>
                  <WishlistProvider>
                    <NotificationProvider>
                  <Router>
                    <WebsiteWrapper>
                      <div className="min-h-screen bg-gray-50 relative">
                      {/* Dynamic Background based on configuration */}
                      <DynamicBackground />
                      <div className="relative z-10">
                        <Navbar />
                        <main>
                        <Routes>
                          <Route path="/" element={<Home />} />
                          <Route path="/products" element={<Products />} />
                          <Route path="/about" element={<About />} />
                          <Route path="/login" element={<Login />} />
                          <Route path="/register" element={<Register />} />
                          <Route path="/forgot-password" element={<ForgotPassword />} />
                          <Route path="/reset-password" element={<ResetPassword />} />
                          <Route path="/reset-password-otp" element={<ResetPasswordOTP />} />
                          <Route path="/verify-email" element={<VerifyEmail />} />
                          <Route path="/verify-signup-otp" element={<VerifySignupOTP />} />
                          <Route path="/product/:id" element={<ProductDetail />} />
                          <Route path="/auth/google/callback" element={<GoogleCallback />} />

                          {/* Protected Routes */}
                          <Route path="/dashboard" element={
                            <ProtectedRoute>
                              <Dashboard />
                            </ProtectedRoute>
                          } />
                          <Route path="/cart" element={
                            <ProtectedRoute>
                              <Cart />
                            </ProtectedRoute>
                          } />
                          <Route path="/wishlist" element={
                            <ProtectedRoute>
                              <Wishlist />
                            </ProtectedRoute>
                          } />
                          <Route path="/notifications" element={
                            <ProtectedRoute>
                              <Notifications />
                            </ProtectedRoute>
                          } />
                          <Route path="/checkout" element={
                            <ProtectedRoute>
                              <Checkout />
                            </ProtectedRoute>
                          } />
                          <Route path="/payment" element={
                            <ProtectedRoute>
                              <Payment />
                            </ProtectedRoute>
                          } />
                          <Route path="/orders" element={
                            <ProtectedRoute>
                              <Orders />
                            </ProtectedRoute>
                          } />
                          <Route path="/order/:id" element={
                            <ProtectedRoute>
                              <OrderDetail />
                            </ProtectedRoute>
                          } />
                          <Route path="/profile" element={
                            <ProtectedRoute>
                              <Profile />
                            </ProtectedRoute>
                          } />

                          {/* Admin Routes */}
                          <Route path="/admin" element={
                            <AdminRoute>
                              <AdminLayout />
                            </AdminRoute>
                          }>
                            <Route index element={<AdminDashboard />} />
                            <Route path="homepage" element={<AdminHomePage />} />
                            <Route path="products" element={<AdminProducts />} />
                            <Route path="products/add" element={<AddProduct />} />
                            <Route path="products/edit/:id" element={<EditProduct />} />
                            <Route path="orders" element={<AdminOrders />} />
                            <Route path="users" element={<AdminUsers />} />
                            <Route path="settings" element={<AdminSettings />} />
                            <Route path="footer" element={<AdminFooter />} />
                            <Route path="notifications" element={<AdminNotifications />} />
                            <Route path="categories" element={<ManageCategories />} />
                            <Route path="brands" element={<ManageBrands />} />
                          </Route>

                          {/* Super Admin Routes */}
                          <Route path="/superadmin/dashboard" element={<SuperAdminDashboard />} />
                        </Routes>
                        </main>
                      </div>
                      <ToastContainer
                        position="top-right"
                        autoClose={3000}
                        hideProgressBar={false}
                        newestOnTop={true}
                        closeOnClick={true}
                        rtl={false}
                        pauseOnFocusLoss={false}
                        draggable={false}
                        pauseOnHover={false}
                        theme="light"
                        limit={3}
                        enableMultiContainer={false}
                        toastClassName="custom-toast"
                        bodyClassName="custom-toast-body"
                        progressClassName="custom-toast-progress"
                        style={{
                          top: '80px',
                          right: '16px',
                          zIndex: 9999
                        }}
                      />
                    </div>
                  </WebsiteWrapper>
                </Router>
                    </NotificationProvider>
                  </WishlistProvider>
                </CartProvider>
              </FooterProvider>
            </SettingsProvider>
          </ThemeProvider>
        </HomePageSettingsProvider>
      </WebsiteConfigProvider>
    </AuthProvider>
  );
}

export default App;
