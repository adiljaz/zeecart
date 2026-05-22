import React from 'react';
import AdminSidebar from '../../components/AdminSidebar';
import { Helmet } from 'react-helmet';
import api from '../../api';
import { useEffect, useState } from 'react';
import { useSettings } from '../../context/SettingsContext';

const AdminDashboardPage = () => {
  const { settings } = useSettings();
  const [stats, setStats] = useState({
    totalProducts: 0,
    totalCategories: 0,
    totalReviews: 0,
    total360Views: 0,
    totalBanners: 0,
  });

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const [products, categories, banners] = await Promise.all([
          api.get('/api/products?limit=1000'),
          api.get('/api/categories'),
          api.get('/api/banners/admin'),
        ]);

        const total360Views = products.data.products.filter((p) => p.is360View).length;

        setStats({
          totalProducts: products.data.total,
          totalCategories: categories.data.length,
          totalReviews: 0,
          total360Views,
          totalBanners: banners.data.length,
        });
      } catch (error) {
        console.error('Failed to fetch stats:', error);
      }
    };

    fetchStats();
  }, []);

  return (
    <>
      <Helmet>
        <title>Dashboard - {settings?.storeName || 'Zee Cart'} Admin</title>
      </Helmet>
      <div className="flex bg-warm-white min-h-screen">
        <AdminSidebar />
        <div className="flex-1 p-8 overflow-y-auto">
          <div className="flex justify-between items-center mb-10">
            <div>
              <h1 className="text-4xl font-serif font-black text-navy mb-2">Command Center</h1>
              <p className="text-navy/40 text-xs font-bold uppercase tracking-widest">Real-time Inventory & Analytics</p>
            </div>
            <div className="flex items-center gap-3 bg-card-bg px-6 py-3 rounded-full shadow-premium border border-border">
              <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
              <span className="text-[10px] font-black text-navy uppercase tracking-widest">Systems Online</span>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="bg-card-bg p-8 rounded-3xl shadow-premium border border-border group hover:border-terracotta transition-premium">
              <h3 className="text-[10px] font-black uppercase tracking-widest text-navy/40 mb-4 group-hover:text-terracotta transition-colors">Total Products</h3>
              <p className="text-4xl font-serif font-black text-navy leading-none">{stats.totalProducts}</p>
              <div className="mt-4 h-1 w-12 bg-terracotta/20 rounded-full" />
            </div>
            <div className="bg-card-bg p-8 rounded-3xl shadow-premium border border-border group hover:border-terracotta transition-premium">
              <h3 className="text-[10px] font-black uppercase tracking-widest text-navy/40 mb-4 group-hover:text-terracotta transition-colors">Total Categories</h3>
              <p className="text-4xl font-serif font-black text-navy leading-none">{stats.totalCategories}</p>
              <div className="mt-4 h-1 w-12 bg-navy/20 rounded-full" />
            </div>
            <div className="bg-card-bg p-8 rounded-3xl shadow-premium border border-border group hover:border-terracotta transition-premium">
              <h3 className="text-[10px] font-black uppercase tracking-widest text-navy/40 mb-4 group-hover:text-terracotta transition-colors">Visual Banners</h3>
              <p className="text-4xl font-serif font-black text-navy leading-none">{stats.totalBanners}</p>
              <div className="mt-4 h-1 w-12 bg-terracotta/20 rounded-full" />
            </div>
            <div className="bg-card-bg p-8 rounded-3xl shadow-premium border border-border group hover:border-terracotta transition-premium">
              <h3 className="text-[10px] font-black uppercase tracking-widest text-navy/40 mb-4 group-hover:text-terracotta transition-colors">360° Viewing Assets</h3>
              <p className="text-4xl font-serif font-black text-navy leading-none">{stats.total360Views}</p>
              <div className="mt-4 h-1 w-12 bg-navy/20 rounded-full" />
            </div>
          </div>

          {/* Quick Actions / Recent Activity Placeholder */}
          <div className="mt-12 grid grid-cols-1 lg:grid-cols-2 gap-8">
             <div className="bg-navy-fixed p-10 rounded-[2rem] text-white shadow-2xl relative overflow-hidden">
                <div className="relative z-10">
                  <h3 className="text-2xl font-serif font-black mb-4">Inventory Health</h3>
                  <p className="text-xs text-white/60 mb-8 max-w-xs leading-relaxed uppercase tracking-widest">Your store's inventory is optimized and synchronized across all channels.</p>
                  <button className="px-8 py-3 bg-white text-navy text-[10px] font-black uppercase tracking-widest hover:bg-terracotta hover:text-white transition-premium">
                    Generate Report
                  </button>
                </div>
                <div className="absolute -bottom-10 -right-10 w-64 h-64 bg-white/5 rounded-full blur-3xl" />
             </div>
             
             <div className="bg-card-bg p-10 rounded-[2rem] border border-border flex flex-col justify-center shadow-premium">
                <h3 className="text-[10px] font-black text-navy/40 uppercase tracking-[0.4em] mb-4 text-center">System Status</h3>
                <div className="space-y-4">
                  <div className="flex justify-between items-center py-2 border-b border-navy/5">
                    <span className="text-[10px] font-bold text-navy uppercase tracking-widest">Database</span>
                    <span className="text-[8px] font-black text-green-500 uppercase tracking-widest px-2 py-1 bg-green-50 rounded-full">Connected</span>
                  </div>
                  <div className="flex justify-between items-center py-2 border-b border-navy/5">
                    <span className="text-[10px] font-bold text-navy uppercase tracking-widest">Image Hosting</span>
                    <span className="text-[8px] font-black text-green-500 uppercase tracking-widest px-2 py-1 bg-green-50 rounded-full">Operational</span>
                  </div>
                  <div className="flex justify-between items-center py-2">
                    <span className="text-[10px] font-bold text-navy uppercase tracking-widest">WhatsApp API</span>
                    <span className="text-[8px] font-black text-green-500 uppercase tracking-widest px-2 py-1 bg-green-50 rounded-full">Active</span>
                  </div>
                </div>
             </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default AdminDashboardPage;
