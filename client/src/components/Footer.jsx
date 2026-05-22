import React from 'react';
import { Link } from 'react-router-dom';
import { Mail, MapPin, Phone, Instagram, Facebook, Twitter } from 'lucide-react';
import { useSettings } from '../context/SettingsContext';

const Footer = () => {
  const { settings } = useSettings();
  const SocialIcon = ({ icon: Icon }) => (
    <button className="w-10 h-10 border border-white/10 flex items-center justify-center rounded-sm hover:bg-terracotta hover:border-terracotta transition-premium">
      {Icon ? <Icon size={18} /> : null}
    </button>
  );

  return (
    <footer className="bg-navy-fixed text-white pt-24 pb-12 overflow-hidden relative border-t border-white/10">
      {/* Background Decorative Text */}
      <div className="absolute top-0 right-0 text-[20vw] font-serif font-black text-white/[0.02] leading-none select-none pointer-events-none">
        {settings?.storeName || 'Zee Cart'}
      </div>

      <div className="max-w-[1600px] mx-auto px-4 md:px-8 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-16 mb-24">
          {/* Brand Section */}
          <div className="space-y-8">
            <Link to="/" className="text-3xl font-serif font-black tracking-tight uppercase italic">
              {settings?.storeName || 'Zee Cart'}<span className="text-terracotta not-italic">.</span>
            </Link>
            <p className="text-white/40 text-sm leading-relaxed font-medium">
              Redefining modern luxury through curated essentials and timeless designs. Join our journey towards a more refined lifestyle.
            </p>
            <div className="flex gap-4">
              <SocialIcon icon={Instagram} />
              <SocialIcon icon={Facebook} />
              <SocialIcon icon={Twitter} />
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-[10px] uppercase tracking-[0.4em] font-black text-terracotta mb-8">Collections</h4>
            <ul className="space-y-4">
              {['New Arrivals', 'Best Sellers', 'Editorial', 'Footwear', 'Accessories'].map((item) => (
                <li key={item}>
                  <Link to="/products" className="text-white/40 hover:text-white text-xs font-bold uppercase tracking-widest transition-premium flex items-center gap-2 group">
                    <span className="w-0 h-[1px] bg-terracotta transition-all duration-300 group-hover:w-4" />
                    {item}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Customer Care */}
          <div>
            <h4 className="text-[10px] uppercase tracking-[0.4em] font-black text-terracotta mb-8">Service</h4>
            <ul className="space-y-4">
              {['About Us', 'Contact', 'Shipping & Returns', 'Privacy Policy', 'Terms of Use'].map((item) => (
                <li key={item}>
                  <Link to="/" className="text-white/40 hover:text-white text-xs font-bold uppercase tracking-widest transition-premium">
                    {item}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Journal */}
          <div className="space-y-8">
            <h4 className="text-[10px] uppercase tracking-[0.4em] font-black text-terracotta mb-8">Journal</h4>
            <p className="text-white/40 text-xs font-bold uppercase tracking-widest leading-loose">
              Subscribe to receive updates, access to exclusive deals, and more.
            </p>
            <div className="flex border-b border-white/10 pb-2 group focus-within:border-terracotta transition-premium">
              <input 
                type="email" 
                placeholder="EMAIL ADDRESS" 
                className="bg-transparent border-none focus:ring-0 text-xs font-black tracking-widest flex-1 text-white placeholder:text-white/40"
              />
              <button type="button" className="text-terracotta hover:translate-x-2 transition-transform">
                <Mail size={18} />
              </button>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-12 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-8">
          <div className="flex flex-col md:flex-row items-center gap-8 text-[10px] font-black uppercase tracking-[0.2em] text-white/20">
            <span>&copy; {new Date().getFullYear()} {(settings?.storeName || 'Zee Cart').toUpperCase()} MANAGEMENT SYSTEMS</span>
            <div className="flex gap-4">
              <img src="https://upload.wikimedia.org/wikipedia/commons/5/5e/Visa_Inc._logo.svg" alt="Visa" className="h-4 opacity-20 grayscale hover:grayscale-0 hover:opacity-100 transition-all" />
              <img src="https://upload.wikimedia.org/wikipedia/commons/2/2a/Mastercard-logo.svg" alt="Mastercard" className="h-4 opacity-20 grayscale hover:grayscale-0 hover:opacity-100 transition-all" />
            </div>
          </div>
          <button 
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
            className="text-[10px] font-black uppercase tracking-[0.4em] text-white/40 hover:text-terracotta transition-premium"
          >
            Back to Top
          </button>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
