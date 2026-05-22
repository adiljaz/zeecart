import React, { useState } from 'react';
import { useCartStore } from '../store/useCartStore';
import { ArrowRight, MapPin, Phone, User, MessageCircle, ShoppingBag } from 'lucide-react';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';
import { useSettings } from '../context/SettingsContext';

const CheckoutPage = () => {
  const { settings } = useSettings();
  const { items, getTotal, clearCart } = useCartStore();
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    address: '',
    city: '',
    landmark: ''
  });

  const total = getTotal();
  const shipping = total >= 2000 ? 0 : 150;
  const finalTotal = total + shipping;

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleCheckout = (e) => {
    e.preventDefault();
    
    if (items.length === 0) {
      toast.error('Your cart is empty');
      return;
    }

    const whatsappNumber = settings?.whatsappNumber || '919567406456'; // Fallback to a real-looking number or placeholder
    
    let message = `*NEW ORDER - ${settings?.storeName || 'Zee Cart'}*\n\n`;
    message += `*Customer Details:*\n`;
    message += `Name: ${formData.name}\n`;
    message += `Phone: ${formData.phone}\n`;
    message += `Address: ${formData.address}, ${formData.city}\n`;
    if (formData.landmark) message += `Landmark: ${formData.landmark}\n`;
    message += `\n*Items:*\n`;
    
    items.forEach(item => {
      message += `- ${item.name} x ${item.quantity} ${item.selectedSize ? `(Size: ${item.selectedSize})` : ''} - ₹${(item.price * item.quantity).toLocaleString()}\n`;
    });
    
    message += `\n*Order Summary:*\n`;
    message += `Subtotal: ₹${total.toLocaleString()}\n`;
    message += `Shipping: ${shipping === 0 ? 'FREE' : `₹${shipping}`}\n`;
    message += `*Total Amount: ₹${finalTotal.toLocaleString()}*\n\n`;
    message += `_Please confirm my order._`;

    const encodedMessage = encodeURIComponent(message);
    const whatsappUrl = `https://wa.me/${whatsappNumber}?text=${encodedMessage}`;
    
    window.open(whatsappUrl, '_blank');
    clearCart();
    toast.success('Order sent to WhatsApp!');
  };

  if (items.length === 0) {
    return (
      <div className="pt-40 pb-24 text-center px-4">
        <ShoppingBag size={48} className="mx-auto text-navy/10 mb-6" />
        <h2 className="text-2xl font-serif font-black text-navy mb-4">Cart is empty</h2>
        <a href="/products" className="btn-premium px-12 py-4">Return to Shop</a>
      </div>
    );
  }

  return (
    <div className="pt-32 pb-24 px-4 md:px-8 max-w-[1600px] mx-auto min-h-screen">
      <div className="mb-12">
        <h1 className="text-5xl font-serif font-black text-navy mb-2 tracking-tighter text-center">Complete Your Order</h1>
        <p className="text-[10px] uppercase tracking-[0.4em] text-navy/40 font-black text-center">Checkout via WhatsApp</p>
      </div>

      <div className="grid lg:grid-cols-2 gap-16">
        {/* Checkout Form */}
        <motion.div 
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="bg-card-bg p-8 md:p-12 border border-border shadow-premium"
        >
          <form onSubmit={handleCheckout} className="space-y-8">
            <div>
              <h3 className="text-xs font-black uppercase tracking-[0.2em] text-navy mb-6 flex items-center gap-3">
                <User size={16} className="text-terracotta" /> Personal Information
              </h3>
              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-1">
                  <label className="text-[9px] font-black uppercase tracking-widest text-navy/40 pl-1">Full Name</label>
                  <input
                    type="text"
                    name="name"
                    required
                    value={formData.name}
                    onChange={handleInputChange}
                    className="w-full bg-warm-white border border-border p-4 text-xs font-bold text-navy focus:outline-none focus:border-navy transition-all"
                    placeholder="Enter your name"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[9px] font-black uppercase tracking-widest text-navy/40 pl-1">Phone Number</label>
                  <input
                    type="tel"
                    name="phone"
                    required
                    value={formData.phone}
                    onChange={handleInputChange}
                    className="w-full bg-warm-white border border-border p-4 text-xs font-bold text-navy focus:outline-none focus:border-navy transition-all"
                    placeholder="WhatsApp number"
                  />
                </div>
              </div>
            </div>

            <div>
              <h3 className="text-xs font-black uppercase tracking-[0.2em] text-navy mb-6 flex items-center gap-3">
                <MapPin size={16} className="text-terracotta" /> Delivery Details
              </h3>
              <div className="space-y-6">
                <div className="space-y-1">
                  <div className="flex justify-between items-center mb-1">
                    <label className="text-[9px] font-black uppercase tracking-widest text-navy/40 pl-1">Full Address</label>
                    <button 
                      type="button"
                      onClick={() => {
                        if (navigator.geolocation) {
                          navigator.geolocation.getCurrentPosition((position) => {
                            const { latitude, longitude } = position.coords;
                            setFormData(prev => ({ 
                              ...prev, 
                              address: `${prev.address ? prev.address + '\n' : ''}📍 Coordinates: ${latitude.toFixed(4)}, ${longitude.toFixed(4)}`,
                              landmark: prev.landmark || 'Location pinned via GPS'
                            }));
                            toast.success('Location coordinates added!');
                          }, () => {
                            toast.error('Unable to retrieve location');
                          });
                        }
                      }}
                      className="text-[8px] font-black uppercase tracking-widest text-terracotta hover:underline"
                    >
                      Use My Location
                    </button>
                  </div>
                  <textarea
                    name="address"
                    required
                    rows="3"
                    value={formData.address}
                    onChange={handleInputChange}
                    className="w-full bg-warm-white border border-border p-4 text-xs font-bold text-navy focus:outline-none focus:border-navy transition-all resize-none"
                    placeholder="Flat/House No., Building, Street"
                  />
                </div>
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="space-y-1">
                    <label className="text-[9px] font-black uppercase tracking-widest text-navy/40 pl-1">City / Town</label>
                    <input
                      type="text"
                      name="city"
                      required
                      value={formData.city}
                      onChange={handleInputChange}
                      className="w-full bg-warm-white border border-border p-4 text-xs font-bold text-navy focus:outline-none focus:border-navy transition-all"
                      placeholder="e.g. Kozhikode"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[9px] font-black uppercase tracking-widest text-navy/40 pl-1">Landmark (Optional)</label>
                    <input
                      type="text"
                      name="landmark"
                      value={formData.landmark}
                      onChange={handleInputChange}
                      className="w-full bg-warm-white border border-border p-4 text-xs font-bold text-navy focus:outline-none focus:border-navy transition-all"
                      placeholder="Nearby famous place"
                    />
                  </div>
                </div>
              </div>
            </div>

            <button type="submit" className="w-full bg-navy-fixed text-white h-16 flex items-center justify-center gap-3 text-xs font-black uppercase tracking-[0.2em] hover:bg-terracotta transition-premium shadow-xl">
              <MessageCircle size={20} /> Place Order on WhatsApp
            </button>
          </form>
        </motion.div>

        {/* Order Summary */}
        <motion.div 
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          className="flex flex-col h-fit"
        >
          <div className="bg-navy-fixed p-12 text-white shadow-2xl relative overflow-hidden">
            <ShoppingBag size={120} className="absolute -top-10 -right-10 text-white/5 rotate-12" />
            <h3 className="text-2xl font-serif font-black mb-8 relative z-10">Order Summary</h3>
            
            <div className="space-y-6 max-h-[400px] overflow-y-auto no-scrollbar pr-4 relative z-10">
              {items.map((item) => (
                <div key={`${item._id}-${item.selectedSize}`} className="flex justify-between items-start gap-4 pb-4 border-b border-white/10">
                  <div className="flex-1">
                    <h4 className="text-[10px] font-black uppercase tracking-widest mb-1">{item.name}</h4>
                    <p className="text-[9px] text-white/40 uppercase font-bold tracking-widest">
                      Qty: {item.quantity} {item.selectedSize ? `| Size: ${item.selectedSize}` : ''}
                    </p>
                  </div>
                  <span className="text-[10px] font-black tracking-widest">₹{(item.price * item.quantity).toLocaleString()}</span>
                </div>
              ))}
            </div>

            <div className="mt-12 space-y-4 pt-8 border-t border-white/10 relative z-10">
              <div className="flex justify-between text-[10px] font-black uppercase tracking-[0.2em] text-white/40">
                <span>Subtotal</span>
                <span>₹{total.toLocaleString()}</span>
              </div>
              <div className="flex justify-between text-[10px] font-black uppercase tracking-[0.2em] text-white/40">
                <span>Shipping</span>
                <span className={shipping === 0 ? 'text-green-400' : ''}>{shipping === 0 ? 'FREE' : `₹${shipping}`}</span>
              </div>
              <div className="flex justify-between text-3xl font-serif font-black pt-6">
                <span>Total</span>
                <span>₹{finalTotal.toLocaleString()}</span>
              </div>
            </div>
          </div>
          
          <p className="mt-8 text-[9px] text-navy/40 text-center uppercase tracking-widest leading-relaxed">
            By placing an order, you agree to our Terms of Service.<br/>Your order will be manually processed over WhatsApp.
          </p>
        </motion.div>
      </div>
    </div>
  );
};

export default CheckoutPage;
