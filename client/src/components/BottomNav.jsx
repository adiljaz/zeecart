import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Home, LayoutGrid, ShoppingBag, User } from 'lucide-react';
import { useCartStore } from '../store/useCartStore';

const BottomNav = () => {
  const location = useLocation();
  const cartCount = useCartStore((state) => state.getItemCount());
  
  const navItems = [
    { path: '/', icon: Home, label: 'Home' },
    { path: '/products', icon: LayoutGrid, label: 'Shop' },
    { path: '/cart', icon: ShoppingBag, label: 'Cart', badge: cartCount },
    { path: '/admin', icon: User, label: 'Account' }
  ];

  const handleCartClick = (e, path) => {
    if (path === '/cart') {
      e.preventDefault();
      useCartStore.getState().setDrawerOpen(true);
    }
  };

  return (
    <div className="md:hidden fixed bottom-0 left-0 right-0 bg-card-bg border-t border-border z-[100] pb-safe">
      <div className="flex items-center justify-around h-16">
        {navItems.map((item) => {
          const isActive = location.pathname === item.path;
          const Icon = item.icon;
          
          return (
            <Link
              key={item.label}
              to={item.path}
              onClick={(e) => handleCartClick(e, item.path)}
              className={`relative flex flex-col items-center justify-center w-full h-full gap-1 transition-colors ${
                isActive ? 'text-terracotta' : 'text-navy/60 hover:text-navy'
              }`}
            >
              <div className="relative">
                <Icon size={20} strokeWidth={isActive ? 2.5 : 1.5} />
                {item.badge > 0 && (
                  <span className="absolute -top-1 -right-2 w-4 h-4 bg-navy-fixed text-white text-[10px] flex items-center justify-center rounded-full font-black">
                    {item.badge}
                  </span>
                )}
              </div>
              <span className={`text-[10px] font-black uppercase tracking-widest ${isActive ? 'opacity-100' : 'opacity-70'}`}>
                {item.label}
              </span>
            </Link>
          );
        })}
      </div>
    </div>
  );
};

export default BottomNav;
