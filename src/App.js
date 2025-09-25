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
import { WebsiteConfigProvider } from './context/WebsiteConfigContext';

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
import Dashboard from './pages/Dashboard';
import ProductDetail from './pages/ProductDetail';
import Cart from './pages/Cart';
import Wishlist from './pages/Wishlist';
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
import ManageCategories from './pages/admin/ManageCategories';
import ManageBrands from './pages/admin/ManageBrands';

// Super Admin Pages
import SuperAdminDashboard from './pages/SuperAdminDashboard';

function App() {
  return (
    <AuthProvider>
      <WebsiteConfigProvider>
        <SettingsProvider>
          <FooterProvider>
            <CartProvider>
              <WishlistProvider>
                <Router>
                  <WebsiteWrapper>
                    <div className="min-h-screen bg-gray-50">
                      <Navbar />
                      <main>
                        <Routes>
                          <Route path="/" element={<Home />} />
                          <Route path="/products" element={<Products />} />
                          <Route path="/about" element={<About />} />
                          <Route path="/login" element={<Login />} />
                          <Route path="/register" element={<Register />} />
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
                            <Route path="products" element={<AdminProducts />} />
                            <Route path="products/add" element={<AddProduct />} />
                            <Route path="products/edit/:id" element={<EditProduct />} />
                            <Route path="orders" element={<AdminOrders />} />
                            <Route path="users" element={<AdminUsers />} />
                            <Route path="settings" element={<AdminSettings />} />
                            <Route path="footer" element={<AdminFooter />} />
                            <Route path="categories" element={<ManageCategories />} />
                            <Route path="brands" element={<ManageBrands />} />
                          </Route>

                          {/* Super Admin Routes */}
                          <Route path="/superadmin/dashboard" element={<SuperAdminDashboard />} />
                        </Routes>
                      </main>
                      <ToastContainer
                        position="top-right"
                        autoClose={5000}
                        hideProgressBar={false}
                        newestOnTop={false}
                        closeOnClick
                        rtl={false}
                        pauseOnFocusLoss
                        draggable
                        pauseOnHover
                        theme="light"
                      />
                    </div>
                  </WebsiteWrapper>
                </Router>
              </WishlistProvider>
            </CartProvider>
          </FooterProvider>
        </SettingsProvider>
      </WebsiteConfigProvider>
    </AuthProvider>
  );
}

export default App;
