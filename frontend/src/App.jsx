import React, { useEffect } from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';

import { Provider } from 'react-redux';
import { store } from './redux/store';
import { ThemeProvider } from './context/ThemeContext';

import Navbar from './components/Navbar';
import Footer from './components/Footer';
import ProtectedRoute from './components/ProtectedRoute';

import Home from './pages/Home';
import Shop from './pages/Shop';
import Product from './pages/Product';
import Cart from './pages/Cart';
import Wishlist from './pages/Wishlist';
import Checkout from './pages/Checkout';
import Login from './pages/Login';
import Signup from './pages/Signup';
import ForgotPassword from './pages/ForgotPassword';
import Profile from './pages/Profile';
import Orders from './pages/Orders';
import OrderDetails from './pages/OrderDetails';
import About from './pages/About';
import Contact from './pages/Contact';
import FAQ from './pages/FAQ';
import PrivacyPolicy from './pages/PrivacyPolicy';
import Terms from './pages/Terms';
import NotFound from './pages/NotFound';

import Dashboard from './admin/Dashboard';
import AddProduct from './admin/AddProduct';
import EditProduct from './admin/EditProduct';
import ManageProducts from './admin/ManageProducts';
import ManageOrders from './admin/ManageOrders';
import ManageUsers from './admin/ManageUsers';
import Reviews from './admin/Reviews';
import Coupons from './admin/Coupons';
import Analytics from './admin/Analytics';

import './index.css';

function ScrollToTop() {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  return null;
}

function AppContent() {
  return (
    <>
      <ScrollToTop />

      <Navbar />

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/shop" element={<Shop />} />
        <Route path="/product/:id" element={<Product />} />

        <Route path="/about" element={<About />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/faq" element={<FAQ />} />
        <Route path="/privacy" element={<PrivacyPolicy />} />
        <Route path="/terms" element={<Terms />} />

        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />

        <Route
          path="/cart"
          element={<ProtectedRoute><Cart /></ProtectedRoute>}
        />

        <Route
          path="/wishlist"
          element={<ProtectedRoute><Wishlist /></ProtectedRoute>}
        />

        <Route
          path="/checkout"
          element={<ProtectedRoute><Checkout /></ProtectedRoute>}
        />

        <Route
          path="/profile"
          element={<ProtectedRoute><Profile /></ProtectedRoute>}
        />

        <Route
          path="/orders"
          element={<ProtectedRoute><Orders /></ProtectedRoute>}
        />

        <Route
          path="/orders/:id"
          element={<ProtectedRoute><OrderDetails /></ProtectedRoute>}
        />

        <Route
          path="/admin"
          element={<ProtectedRoute admin><Dashboard /></ProtectedRoute>}
        />

        <Route
          path="/admin/add-product"
          element={<ProtectedRoute admin><AddProduct /></ProtectedRoute>}
        />

        <Route
          path="/admin/edit-product/:id"
          element={<ProtectedRoute admin><EditProduct /></ProtectedRoute>}
        />

        <Route
          path="/admin/products"
          element={<ProtectedRoute admin><ManageProducts /></ProtectedRoute>}
        />

        <Route
          path="/admin/orders"
          element={<ProtectedRoute admin><ManageOrders /></ProtectedRoute>}
        />

        <Route
          path="/admin/users"
          element={<ProtectedRoute admin><ManageUsers /></ProtectedRoute>}
        />

        <Route
          path="/admin/reviews"
          element={<ProtectedRoute admin><Reviews /></ProtectedRoute>}
        />

        <Route
          path="/admin/coupons"
          element={<ProtectedRoute admin><Coupons /></ProtectedRoute>}
        />

        <Route
          path="/admin/analytics"
          element={<ProtectedRoute admin><Analytics /></ProtectedRoute>}
        />

        <Route path="*" element={<NotFound />} />
      </Routes>

      <Footer />
    </>
  );
}

export default function App() {
  return (
    <Provider store={store}>
      <ThemeProvider>
        <AppContent />
      </ThemeProvider>
    </Provider>
  );
}