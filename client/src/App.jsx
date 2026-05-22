import React, { useEffect, Suspense, lazy } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import Header from './components/Header';
import Footer from './components/Footer';
import CartDrawer from './components/CartDrawer';
import PrivateRoute from './components/PrivateRoute';
import { useCartStore } from './store/useCartStore';
import { useWishlistStore } from './store/useWishlistStore';
import api from './api';
import { useSettings } from './context/SettingsContext';

// Pages
const ScrollToTop = () => {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  return null;
};

import Home from './pages/Home';
import Products from './pages/Products';
import ProductDetail from './pages/ProductDetail';
import AdminLoginPage from './pages/AdminLoginPage';

// Lazy Loaded Pages
const About = lazy(() => import('./pages/About'));
const Contact = lazy(() => import('./pages/Contact'));
const WishlistPage = lazy(() => import('./pages/WishlistPage'));
const CheckoutPage = lazy(() => import('./pages/CheckoutPage'));
const NotFound = lazy(() => import('./pages/NotFound'));
const AdminDashboardPage = lazy(() => import('./pages/admin/AdminDashboardPage'));
const AdminProducts = lazy(() => import('./pages/admin/AdminProducts'));
const AdminCategories = lazy(() => import('./pages/admin/AdminCategories'));
const AdminAddProduct = lazy(() => import('./pages/admin/AdminAddProduct'));
const AdminBanners = lazy(() => import('./pages/admin/AdminBanners'));
const AdminSettings = lazy(() => import('./pages/admin/AdminSettings'));
const AdminReviews = lazy(() => import('./pages/admin/AdminReviews'));

const PageLoader = () => {
  const { settings } = useSettings();
  return (
    <div className="fixed inset-0 bg-warm-white flex items-center justify-center z-[9999]">
      <div className="flex flex-col items-center gap-6 text-center">
        <div className="w-12 h-12 border-4 border-navy border-t-terracotta rounded-full animate-spin" />
        <span className="text-[10px] font-black uppercase tracking-[0.4em] text-navy animate-pulse">{settings?.storeName || 'Zee Cart'} Premium</span>
      </div>
    </div>
  );
};

const AppContent = () => {
  const location = useLocation();
  const isAdmin = location.pathname.startsWith('/admin');
  const syncCart = useCartStore(state => state.syncCart);
  const syncWishlist = useWishlistStore(state => state.syncWishlist);

  useEffect(() => {
    const syncStores = async () => {
      try {
        const { data } = await api.get('/api/products?limit=1000');
        const validIds = data.products.map(p => p._id);
        syncCart(validIds);
        syncWishlist(validIds);
      } catch (error) {
        console.error('Failed to sync stores:', error);
      }
    };
    if (!isAdmin) {
      syncStores();
    }
  }, [isAdmin, syncCart, syncWishlist]);

  return (
    <div className="flex flex-col min-h-screen w-full max-w-full overflow-x-hidden">
      <ScrollToTop />
      {!isAdmin && <Header />}
      <main className="flex-1">
        <Suspense fallback={<PageLoader />}>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/products" element={<Products />} />
            <Route path="/products/:id" element={<ProductDetail />} />
            <Route path="/about" element={<About />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/wishlist" element={<WishlistPage />} />
            <Route path="/checkout" element={<CheckoutPage />} />
            <Route path="/admin" element={<AdminLoginPage />} />
            
            <Route path="/admin/dashboard" element={<PrivateRoute><AdminDashboardPage /></PrivateRoute>} />
            <Route path="/admin/products" element={<PrivateRoute><AdminProducts /></PrivateRoute>} />
            <Route path="/admin/categories" element={<PrivateRoute><AdminCategories /></PrivateRoute>} />
            <Route path="/admin/products/add" element={<PrivateRoute><AdminAddProduct /></PrivateRoute>} />
            <Route path="/admin/banners" element={<PrivateRoute><AdminBanners /></PrivateRoute>} />
            <Route path="/admin/settings" element={<PrivateRoute><AdminSettings /></PrivateRoute>} />
            <Route path="/admin/reviews" element={<PrivateRoute><AdminReviews /></PrivateRoute>} />
            <Route path="/admin/products/edit/:id" element={<PrivateRoute><AdminAddProduct /></PrivateRoute>} />
            
            <Route path="*" element={<NotFound />} />
          </Routes>
        </Suspense>
      </main>
      {!isAdmin && <Footer />}
    </div>
  );
};

function App() {
  return (
    <Router>
      <div className="grain-overlay" />
      <CartDrawer />
      <Toaster 
        position="bottom-center"
        toastOptions={{
          style: {
            background: '#0f172a',
            color: '#fff',
            borderRadius: '0px',
            fontSize: '10px',
            textTransform: 'uppercase',
            letterSpacing: '0.2em',
            fontWeight: '900',
            padding: '16px 24px',
          }
        }}
      />
      <AppContent />
    </Router>
  );
}

export default App;
