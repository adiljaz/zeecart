import React, { useState } from 'react';
import { useAuthStore } from '../store/useAuthStore';
import { useNavigate, Link, useLocation } from 'react-router-dom';
import toast from 'react-hot-toast';
import { LayoutDashboard, ShoppingBag, PlusCircle, Layers, Star, Settings, LogOut, Menu, X, Image } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useSettings } from '../context/SettingsContext';

const AdminSidebar = () => {
  const { settings } = useSettings();
  const logout = useAuthStore((state) => state.logout);
  const navigate = useNavigate();
  const location = useLocation();
  const [isOpen, setIsOpen] = useState(false);

  const handleLogout = () => {
    logout();
    toast.success('Logged out successfully');
    navigate('/admin');
  };

  const navItems = [
    { name: 'Dashboard', path: '/admin/dashboard', icon: LayoutDashboard },
    { name: 'Inventory', path: '/admin/products', icon: ShoppingBag },
    { name: 'New Product', path: '/admin/products/add', icon: PlusCircle },
    { name: 'Categories', path: '/admin/categories', icon: Layers },
    { name: 'Banners', path: '/admin/banners', icon: Image },
    { name: 'Reviews', path: '/admin/reviews', icon: Star },
    { name: 'Settings', path: '/admin/settings', icon: Settings },
  ];

  const SidebarContent = () => (
    <div className="flex flex-col h-full">
      <div className="mb-12">
        <Link to="/" className="text-3xl font-serif font-black text-white tracking-tighter uppercase italic">{settings?.storeName || 'Zee Cart'}</Link>
        <p className="text-terracotta text-[10px] font-black uppercase tracking-[0.4em] mt-1">Management Console</p>
      </div>

      <nav className="space-y-2 flex-1">
        {navItems.map((item) => (
          <Link
            key={item.name}
            to={item.path}
            onClick={() => setIsOpen(false)}
            className={`flex items-center gap-4 px-6 py-4 rounded-xl transition-premium text-xs font-black uppercase tracking-widest ${
              location.pathname === item.path 
                ? 'bg-terracotta text-white shadow-premium' 
                : 'text-white/40 hover:text-white hover:bg-white/5'
            }`}
          >
            <item.icon size={18} strokeWidth={item.path === location.pathname ? 3 : 2} />
            {item.name}
          </Link>
        ))}
      </nav>

      <button
        onClick={handleLogout}
        className="mt-auto flex items-center justify-center gap-4 w-full bg-white/5 hover:bg-red-500/20 text-white/40 hover:text-red-500 py-4 rounded-xl transition-premium text-xs font-black uppercase tracking-widest border border-white/5 hover:border-red-500/20"
      >
        <LogOut size={18} />
        Terminate
      </button>
    </div>
  );

  return (
    <>
      {/* Mobile Toggle Button */}
      <div className="lg:hidden fixed top-6 right-6 z-[100]">
        <button 
          onClick={() => setIsOpen(!isOpen)}
          className="w-12 h-12 bg-navy-fixed text-white rounded-full flex items-center justify-center shadow-2xl"
        >
          {isOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Desktop Sidebar */}
      <aside className="hidden lg:flex bg-navy-fixed h-screen sticky top-0 w-72 p-8 border-r border-white/10 flex-col">
        <SidebarContent />
      </aside>

      {/* Mobile Sidebar Overlay */}
      <AnimatePresence>
        {isOpen && (
          <>
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsOpen(false)}
              className="fixed inset-0 bg-navy-fixed/80 backdrop-blur-md z-[90] lg:hidden"
            />
            <motion.aside 
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="fixed top-0 left-0 bottom-0 w-80 bg-navy-fixed p-8 z-[91] lg:hidden flex flex-col"
            >
              <SidebarContent />
            </motion.aside>
          </>
        )}
      </AnimatePresence>
    </>
  );
};

export default AdminSidebar;
