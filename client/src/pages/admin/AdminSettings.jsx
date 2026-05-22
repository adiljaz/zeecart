import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet';
import AdminSidebar from '../../components/AdminSidebar';
import api from '../../api';
import toast from 'react-hot-toast';
import { motion } from 'framer-motion';
import { Settings, Save, Phone, Mail, Store, Info, Moon, Sun } from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';
import { useSettings } from '../../context/SettingsContext';

const AdminSettings = () => {
  const { fetchSettings: reloadGlobalSettings } = useSettings();
  const [settings, setSettings] = useState({
    whatsappNumber: '',
    storeName: '',
    storeEmail: '',
  });
  const { theme, toggleTheme } = useTheme();
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    try {
      const response = await api.get('/api/settings');
      if (response.data) {
        setSettings(response.data);
      }
    } catch (error) {
      toast.error('Failed to load settings');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      await api.put('/api/settings', settings);
      toast.success('Settings updated successfully');
      await reloadGlobalSettings();
    } catch (error) {
      toast.error('Failed to update settings');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="flex bg-warm-white min-h-screen">
        <AdminSidebar />
        <div className="flex-1 flex items-center justify-center">
          <div className="w-12 h-12 border-4 border-navy/10 border-t-terracotta rounded-full animate-spin" />
        </div>
      </div>
    );
  }

  return (
    <>
      <Helmet>
        <title>Settings - {settings.storeName || 'Zee Cart'} Admin</title>
      </Helmet>
      <div className="flex bg-warm-white min-h-screen">
        <AdminSidebar />
        <div className="flex-1 p-4 md:p-8 lg:p-12 overflow-x-hidden">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="max-w-4xl"
          >
            <div className="flex flex-col md:flex-row items-start md:items-center gap-4 mb-8 md:mb-12 pt-20 md:pt-0">
              <div className="p-4 bg-navy-fixed text-white rounded-2xl shadow-xl">
                <Settings size={32} strokeWidth={1.5} />
              </div>
              <div>
                <h1 className="text-3xl md:text-4xl font-serif font-black text-navy tracking-tight">System Configuration</h1>
                <p className="text-navy/40 text-[10px] font-black uppercase tracking-[0.4em] mt-1">Core Business Parameters</p>
              </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-8">
              <div className="bg-card-bg rounded-[2rem] md:rounded-[2.5rem] p-6 md:p-10 shadow-premium border border-border space-y-8 md:space-y-10">
                
                {/* Store Name */}
                <div className="space-y-4">
                  <div className="flex items-center gap-3">
                    <Store size={18} className="text-terracotta" />
                    <label className="text-[10px] font-black uppercase tracking-[0.3em] text-navy">Brand Identity</label>
                  </div>
                  <input
                    type="text"
                    required
                    value={settings.storeName}
                    onChange={(e) => setSettings({ ...settings, storeName: e.target.value })}
                    placeholder="Store Name"
                    className="w-full bg-warm-white px-8 py-5 rounded-2xl text-navy border border-border focus:outline-none focus:border-navy transition-premium font-bold text-sm"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                  {/* WhatsApp */}
                  <div className="space-y-4">
                    <div className="flex items-center gap-3">
                      <Phone size={18} className="text-terracotta" />
                      <label className="text-[10px] font-black uppercase tracking-[0.3em] text-navy">WhatsApp Gateway</label>
                    </div>
                    <input
                      type="text"
                      required
                      value={settings.whatsappNumber}
                      onChange={(e) => setSettings({ ...settings, whatsappNumber: e.target.value })}
                      placeholder="9497062038"
                      className="w-full bg-warm-white px-8 py-5 rounded-2xl text-navy border border-border focus:outline-none focus:border-navy transition-premium font-bold text-sm"
                    />
                    <p className="text-[9px] text-navy/30 font-bold uppercase tracking-widest ml-2 flex items-center gap-2">
                      <Info size={12} /> Format: 10 digits without '+' or spaces
                    </p>
                  </div>

                  {/* Email */}
                  <div className="space-y-4">
                    <div className="flex items-center gap-3">
                      <Mail size={18} className="text-terracotta" />
                      <label className="text-[10px] font-black uppercase tracking-[0.3em] text-navy">Contact Email</label>
                    </div>
                    <input
                      type="email"
                      required
                      value={settings.storeEmail}
                      onChange={(e) => setSettings({ ...settings, storeEmail: e.target.value })}
                      placeholder="adiljaz17@gmail.com"
                      className="w-full bg-warm-white px-8 py-5 rounded-2xl text-navy border border-border focus:outline-none focus:border-navy transition-premium font-bold text-sm"
                    />
                  </div>
                </div>

                 {/* Theme Setting */}
                <div className="pt-10 border-t border-border">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      {theme === 'dark' ? <Moon size={18} className="text-terracotta" /> : <Sun size={18} className="text-terracotta" />}
                      <div>
                        <label className="text-[10px] font-black uppercase tracking-[0.3em] text-navy">Interface Theme</label>
                        <p className="text-[9px] text-navy/30 font-bold uppercase tracking-widest mt-1">Configure global appearance</p>
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={toggleTheme}
                      className="relative w-14 h-8 bg-warm-white border border-border rounded-full p-1 transition-premium flex items-center"
                    >
                      <motion.div
                        animate={{ x: theme === 'dark' ? 24 : 0 }}
                        className="w-6 h-6 bg-navy-fixed rounded-full flex items-center justify-center text-white"
                      >
                        {theme === 'dark' ? <Moon size={12} /> : <Sun size={12} />}
                      </motion.div>
                    </button>
                  </div>
                </div>
              </div>

              <div className="flex justify-end pt-4">
                <button
                  type="submit"
                  disabled={submitting}
                  className="w-full md:w-auto bg-navy-fixed text-white px-12 py-6 rounded-[2rem] font-black uppercase tracking-[0.3em] text-xs hover:bg-terracotta transition-premium shadow-2xl disabled:opacity-50 flex items-center justify-center gap-4 group"
                >
                  {submitting ? (
                    <div className="w-5 h-5 border-2 border-white/20 border-t-white rounded-full animate-spin" />
                  ) : (
                    <>
                      <Save size={18} /> Deploy Configuration
                    </>
                  )}
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      </div>
    </>
  );
};

export default AdminSettings;
