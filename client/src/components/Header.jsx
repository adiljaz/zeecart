import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { ShoppingBag, User, Menu, Heart, Search, X, Sun, Moon } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useCartStore } from '../store/useCartStore';
import { useWishlistStore } from '../store/useWishlistStore';
import SearchBar from './SearchBar';
import { useTheme } from '../context/ThemeContext';
import { useSettings } from '../context/SettingsContext';

const Header = () => {
  const { settings } = useSettings();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileSearchOpen, setIsMobileSearchOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const location = useLocation();
  const { theme, toggleTheme } = useTheme();
  
  const cartCount = useCartStore((state) => state.getItemCount());
  const wishlistCount = useWishlistStore((state) => state.items.length);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const mainLinks = [
    { name: 'Men', path: '/products?gender=men' },
    { name: 'Women', path: '/products?gender=women' },
    { name: 'Kids', path: '/products?gender=kids' },
    { name: 'Latest Arrivals', path: '/products' },
    { name: 'Brand Story', path: '/about' },
  ];

  return (
    <header 
      className={`fixed top-0 left-0 right-0 z-header transition-all duration-300 ${
        isScrolled 
          ? 'header-glass-scrolled shadow-premium' 
          : 'header-glass'
      } border-b border-border`}
    >
      <div className={`max-w-[1600px] mx-auto h-full px-6 md:px-12 flex items-center justify-between gap-12 transition-all duration-300 ${isScrolled ? 'h-16' : 'h-20'}`}>
        
        {/* Left: Menu Trigger (mobile) & Brand Logo (desktop) */}
        <div className="flex items-center gap-8">
          <button 
            onClick={() => setIsMobileMenuOpen(true)}
            className="xl:hidden p-2 -ml-2 text-navy hover:text-terracotta transition-colors"
            title="Open Menu"
          >
            <Menu size={24} />
          </button>

          <Link to="/" className="hidden xl:flex items-center gap-2 group">
            <motion.span 
              whileHover={{ scale: 1.02 }}
              className="text-2xl md:text-3xl font-serif font-black tracking-tighter text-navy uppercase italic"
            >
              {settings?.storeName || 'Zee Cart'}
              <motion.span 
                animate={{ scale: [1, 1.4, 1], opacity: [1, 0.6, 1] }}
                transition={{ repeat: Infinity, duration: 2.5, ease: "easeInOut" }}
                className="text-terracotta not-italic inline-block ml-0.5"
              >
                .
              </motion.span>
            </motion.span>
          </Link>
        </div>

        {/* Center: Desktop Navigation & Mobile Centered Logo */}
        <div className="flex items-center justify-center flex-1 xl:flex-initial">
          {/* Mobile Centered Logo */}
          <Link to="/" className="xl:hidden absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 flex items-center gap-2 group">
            <motion.span 
              whileHover={{ scale: 1.02 }}
              className="text-2xl md:text-3xl font-serif font-black tracking-tighter text-navy uppercase italic"
            >
              {settings?.storeName || 'Zee Cart'}
              <motion.span 
                animate={{ scale: [1, 1.4, 1], opacity: [1, 0.6, 1] }}
                transition={{ repeat: Infinity, duration: 2.5, ease: "easeInOut" }}
                className="text-terracotta not-italic inline-block ml-0.5"
              >
                .
              </motion.span>
            </motion.span>
          </Link>

          {/* Desktop Navigation Links */}
          <nav className="hidden xl:flex items-center gap-8">
            {mainLinks.map((link) => {
              const isActive = location.pathname + location.search === link.path || 
                (link.path.includes('gender') && location.search.includes(link.path.split('?')[1]));
              return (
                <Link
                  key={link.name}
                  to={link.path}
                  className={`text-[9px] uppercase tracking-[0.25em] font-black transition-premium relative group py-2 ${
                    isActive ? 'text-terracotta' : 'text-navy hover:text-terracotta'
                  }`}
                >
                  {link.name}
                  <span className={`absolute -bottom-0.5 left-0 h-0.5 bg-terracotta transition-all duration-300 group-hover:w-full ${isActive ? 'w-full' : 'w-0'}`} />
                </Link>
              );
            })}
          </nav>
        </div>

        {/* Right: Search & Actions */}
        <div className="flex items-center gap-6">
          <div className="hidden xl:block w-64">
            <SearchBar />
          </div>

          <div className="flex items-center gap-2 md:gap-4 text-navy">
            {/* Mobile/Tablet Search Icon */}
            <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.95 }} className="xl:hidden">
              <button 
                onClick={() => setIsMobileSearchOpen(true)}
                className="p-2 hover:text-terracotta transition-colors"
                title="Search Products"
              >
                <Search size={20} />
              </button>
            </motion.div>

            {/* Wishlist */}
            <motion.div whileHover={{ scale: 1.12 }} whileTap={{ scale: 0.95 }}>
              <Link to="/wishlist" className="relative p-2 hover:text-terracotta transition-colors" title="Wishlist">
                <Heart size={20} strokeWidth={1.5} />
                {wishlistCount > 0 && (
                  <span className="absolute top-1 right-1 w-3.5 h-3.5 bg-terracotta text-white text-[8px] flex items-center justify-center rounded-full font-black">
                    {wishlistCount}
                  </span>
                )}
              </Link>
            </motion.div>

            {/* Cart Drawer */}
            <motion.div whileHover={{ scale: 1.12, rotate: [-3, 3, -3, 0] }} whileTap={{ scale: 0.95 }}>
              <button 
                onClick={() => useCartStore.getState().setDrawerOpen(true)}
                className="relative p-2 hover:text-terracotta transition-colors"
                title="Shopping Cart"
              >
                <ShoppingBag size={20} strokeWidth={1.5} />
                {cartCount > 0 && (
                  <span className="absolute top-1 right-1 w-3.5 h-3.5 bg-navy-fixed text-white text-[8px] flex items-center justify-center rounded-full font-black">
                    {cartCount}
                  </span>
                )}
              </button>
            </motion.div>

            {/* Staff / Admin Portal */}
            <motion.div whileHover={{ scale: 1.12 }} whileTap={{ scale: 0.95 }}>
              <Link to="/admin" className="p-2 hover:text-terracotta transition-colors hidden md:block" title="Staff Portal">
                <User size={20} strokeWidth={1.5} />
              </Link>
            </motion.div>

            {/* Theme Toggle */}
            <motion.div whileHover={{ scale: 1.12, rotate: 45 }} whileTap={{ scale: 0.95 }}>
              <button 
                onClick={toggleTheme}
                className="p-2 hover:text-terracotta transition-colors flex items-center justify-center"
                title={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
              >
                {theme === 'dark' ? <Sun size={20} strokeWidth={1.5} /> : <Moon size={20} strokeWidth={1.5} />}
              </button>
            </motion.div>
          </div>
        </div>
      </div>

      {/* Mobile Search Overlay */}
      <AnimatePresence>
        {isMobileSearchOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="fixed inset-0 bg-warm-white dark:bg-card-bg z-[2000] p-6 flex flex-col xl:hidden"
          >
            <div className="flex justify-between items-center mb-8">
              <span className="text-xl font-serif font-black text-navy dark:text-white uppercase tracking-tighter italic">Search Mode</span>
              <button onClick={() => setIsMobileSearchOpen(false)} className="p-2 text-navy/20 dark:text-white/20 hover:text-navy dark:hover:text-white">
                <X size={28} />
              </button>
            </div>
            <SearchBar onNavigate={() => setIsMobileSearchOpen(false)} />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Mobile Menu Drawer */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <>
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsMobileMenuOpen(false)}
              className="fixed inset-0 bg-navy-fixed/60 backdrop-blur-md z-[2001]"
            />
            <motion.div 
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              transition={{ type: 'spring', damping: 30, stiffness: 300 }}
              className="fixed top-0 left-0 bottom-0 w-[85%] max-w-sm bg-warm-white dark:bg-card-bg z-[2002] p-10 flex flex-col shadow-2xl"
            >
              <div className="flex justify-between items-center mb-16">
                <span className="text-3xl font-serif font-black text-navy dark:text-white uppercase italic">{settings?.storeName || 'Zee Cart'}</span>
                <button onClick={() => setIsMobileMenuOpen(false)} className="p-2 text-navy/20 dark:text-white/20 hover:text-navy dark:hover:text-white transition-colors">
                  <X size={28} />
                </button>
              </div>

              <nav className="flex flex-col gap-6">
                {mainLinks.map((link) => (
                  <Link
                    key={link.name}
                    to={link.path}
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="text-lg font-black uppercase tracking-[0.2em] text-navy dark:text-white hover:text-terracotta transition-colors border-b border-navy/5 dark:border-white/5 pb-4"
                  >
                    {link.name}
                  </Link>
                ))}
              </nav>

              <div className="mt-auto pt-10 border-t border-navy/5 dark:border-white/5">
                <Link 
                  to="/admin" 
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="flex items-center gap-4 text-xs font-black uppercase tracking-widest text-navy/40 dark:text-white/40 hover:text-navy dark:hover:text-white transition-colors"
                >
                  <User size={20} /> Staff Portal
                </Link>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </header>
  );
};

export default Header;
