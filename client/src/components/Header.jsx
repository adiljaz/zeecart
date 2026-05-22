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
      className={`fixed top-0 left-0 right-0 z-header transition-all duration-300 bg-card-bg ${
        isScrolled ? 'shadow-premium' : ''
      } border-b border-border`}
    >
      <div className={`max-w-[1600px] mx-auto h-full px-4 md:px-12 flex items-center justify-between gap-2 md:gap-12 transition-all duration-300 ${isScrolled ? 'h-16' : 'h-20'}`}>
        
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
            </motion.span>
          </Link>
        </div>

        {/* Center: Desktop Navigation & Mobile Centered Logo */}
        <div className="flex items-center justify-center flex-1 xl:flex-initial">
          {/* Mobile Centered Logo */}
          <Link to="/" className="xl:hidden absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 flex items-center gap-2 group">
            <motion.span 
              whileHover={{ scale: 1.02 }}
              className="text-xl md:text-3xl font-serif font-black tracking-tighter text-navy uppercase italic"
            >
              {settings?.storeName || 'Zee Cart'}
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
              <Link to="/wishlist" className="relative flex items-center justify-center p-2 hover:text-terracotta transition-colors" title="Wishlist">
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
                className="relative flex items-center justify-center p-2 hover:text-terracotta transition-colors"
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
            <motion.div whileHover={{ scale: 1.12, rotate: 45 }} whileTap={{ scale: 0.95 }} className="hidden md:block">
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
              className="fixed inset-0 bg-navy-fixed/80 backdrop-blur-sm z-[2001]"
            />
            <motion.div 
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%', transition: { duration: 0.3 } }}
              transition={{ type: 'spring', damping: 25, stiffness: 250 }}
              className="fixed top-0 left-0 bottom-0 w-[85%] max-w-[360px] bg-[#fafaf7] dark:bg-[#0f172a] z-[2002] p-8 flex flex-col shadow-[20px_0_40px_rgba(0,0,0,0.2)] border-r border-navy/5 dark:border-white/5"
            >
              <div className="flex justify-between items-center mb-12">
                <span className="text-2xl font-serif font-black text-navy dark:text-white uppercase tracking-tighter italic">
                  {settings?.storeName || 'Zee Cart'}
                </span>
                <button 
                  onClick={() => setIsMobileMenuOpen(false)} 
                  className="p-3 bg-navy/5 dark:bg-white/5 rounded-full text-navy dark:text-white hover:bg-terracotta hover:text-white transition-colors"
                >
                  <X size={20} strokeWidth={2} />
                </button>
              </div>

              <motion.nav 
                initial="hidden"
                animate="show"
                exit="hidden"
                variants={{
                  show: { transition: { staggerChildren: 0.08, delayChildren: 0.1 } },
                  hidden: { transition: { staggerChildren: 0.05, staggerDirection: -1 } }
                }}
                className="flex flex-col gap-2"
              >
                {mainLinks.map((link) => (
                  <motion.div 
                    key={link.name}
                    variants={{
                      hidden: { opacity: 0, x: -20 },
                      show: { opacity: 1, x: 0, transition: { type: 'spring', stiffness: 300, damping: 24 } }
                    }}
                  >
                    <Link
                      to={link.path}
                      onClick={() => setIsMobileMenuOpen(false)}
                      className="group flex items-center justify-between p-4 rounded-xl text-lg font-black uppercase tracking-[0.2em] text-navy dark:text-white hover:bg-terracotta/10 hover:text-terracotta transition-all"
                    >
                      <span>{link.name}</span>
                      <span className="opacity-0 -translate-x-4 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300 text-terracotta">
                        →
                      </span>
                    </Link>
                  </motion.div>
                ))}
              </motion.nav>

              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className="mt-auto pt-8 border-t border-navy/10 dark:border-white/10 space-y-3"
              >
                <button 
                  onClick={() => {
                    toggleTheme();
                    setIsMobileMenuOpen(false);
                  }}
                  className="w-full flex items-center justify-center gap-3 p-4 rounded-xl bg-navy/5 dark:bg-white/5 text-xs font-black uppercase tracking-widest text-navy dark:text-white hover:bg-navy hover:text-white dark:hover:bg-white dark:hover:text-navy transition-colors"
                >
                  {theme === 'dark' ? <Sun size={18} /> : <Moon size={18} />} 
                  {theme === 'dark' ? 'Light Mode' : 'Dark Mode'}
                </button>
                <Link 
                  to="/admin" 
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="w-full flex items-center justify-center gap-3 p-4 rounded-xl border border-navy/10 dark:border-white/10 text-xs font-black uppercase tracking-widest text-navy/60 dark:text-white/60 hover:text-navy dark:hover:text-white transition-colors"
                >
                  <User size={18} /> Staff Portal
                </Link>
              </motion.div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </header>
  );
};

export default Header;
