import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { ShieldCheck, Lock, User, ArrowRight, Eye, EyeOff } from 'lucide-react';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';
import api from '../api';
import { useAuthStore } from '../store/useAuthStore';
import { useSettings } from '../context/SettingsContext';

const AdminLoginPage = () => {
  const { settings } = useSettings();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const login = useAuthStore((state) => state.login);

  const handleLogin = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    
    try {
      const { data } = await api.post('/api/auth/login', { username, password });
      login(data.token);
      toast.success('ACCESS GRANTED - WELCOME ADMIN');
      navigate('/admin/dashboard');
    } catch (err) {
      console.error("Login Error Details:", err);
      if (err.response) {
        toast.error(`FAILED (${err.response.status}): Trying to reach ${api.defaults.baseURL}. Server replied: ${err.response?.data?.message || 'No message'}`);
      } else {
        toast.error(`NETWORK ERROR: Cannot reach ${api.defaults.baseURL}. (${err.message})`);
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-warm-white flex items-center justify-center p-4 relative overflow-hidden">
      {/* Decorative Accents */}
      <div className="absolute top-0 left-0 w-full h-1 bg-navy/5" />

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md"
      >
        <div className="text-center mb-12">
          <Link to="/" className="inline-block mb-12">
            <span className="text-5xl font-serif font-black tracking-tight text-navy">
              {settings?.storeName || 'Zee Cart'}<span className="text-terracotta">.</span>
            </span>
          </Link>
          <p className="text-[10px] uppercase tracking-[0.4em] font-black text-navy/40">Secure Management Gateway</p>
        </div>

        <form onSubmit={handleLogin} className="space-y-6">
          <div className="relative group">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-navy/20 group-focus-within:text-terracotta transition-colors">
              <User size={18} />
            </div>
            <input
              type="text"
              placeholder="USERNAME"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full bg-card-bg border border-border pl-12 pr-4 py-4 text-xs font-black tracking-widest text-navy placeholder:text-navy/20 focus:outline-none focus:border-navy transition-all"
              required
            />
          </div>

          <div className="relative group">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-navy/20 group-focus-within:text-terracotta transition-colors">
              <Lock size={18} />
            </div>
            <input
              type={showPassword ? "text" : "password"}
              placeholder="PASSWORD"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full bg-card-bg border border-border pl-12 pr-12 py-4 text-xs font-black tracking-widest text-navy placeholder:text-navy/20 focus:outline-none focus:border-navy transition-all"
              required
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute inset-y-0 right-0 pr-4 flex items-center text-navy/20 hover:text-navy transition-colors"
            >
              {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full btn-premium h-16 group disabled:opacity-50"
          >
            {isLoading ? (
              <div className="w-6 h-6 border-2 border-white/20 border-t-white rounded-full animate-spin" />
            ) : (
              <span className="flex items-center gap-2">
                Authorize Access <ArrowRight size={18} className="group-hover:translate-x-2 transition-transform" />
              </span>
            )}
          </button>
        </form>

        <div className="mt-12 pt-8 border-t border-navy/5 text-center">
          <p className="text-[10px] font-black text-navy/30 uppercase tracking-widest">
            {settings?.storeName || 'Zee Cart'} Management Systems &copy; 2024
          </p>
        </div>
      </motion.div>
    </div>
  );
};

export default AdminLoginPage;
