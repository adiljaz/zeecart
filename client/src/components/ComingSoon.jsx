import React from 'react';
import { motion } from 'framer-motion';
import { Sparkles, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useSettings } from '../context/SettingsContext';

const ComingSoon = ({ title, subtitle }) => {
  const { settings } = useSettings();
  return (
    <div className="min-h-[80vh] flex items-center justify-center px-6">
      <div className="max-w-4xl w-full text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="space-y-8"
        >
          <div className="inline-flex items-center gap-3 px-6 py-2 bg-terracotta/10 rounded-full text-terracotta">
            <Sparkles size={16} />
            <span className="text-[10px] font-black uppercase tracking-[0.4em]">Coming Soon to {settings?.storeName || 'Zee Cart'}</span>
          </div>
          
          <h1 className="text-6xl md:text-8xl font-serif font-black text-navy tracking-tighter leading-none italic">
            {title}<span className="text-terracotta not-italic">.</span>
          </h1>
          
          <p className="text-navy/40 text-sm md:text-lg font-medium max-w-2xl mx-auto leading-relaxed">
            {subtitle || "We are currently handcrafting this experience to meet our premium standards. Sign up to be the first to know when we launch this section."}
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-6 pt-12">
            <Link to="/products" className="btn-premium px-12 py-5 shadow-2xl">
              Explore Collection <ArrowRight size={18} />
            </Link>
            <Link to="/" className="text-[10px] font-black uppercase tracking-[0.4em] text-navy border-b-2 border-navy/10 pb-1 hover:border-terracotta transition-premium">
              Back to Home
            </Link>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default ComingSoon;
