import React from 'react';
import { Link } from 'react-router-dom';
import { X, ShoppingBag, Trash2, Plus, Minus, ArrowRight, Heart, Info, Undo2, ShieldCheck } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useCartStore } from '../store/useCartStore';
import toast from 'react-hot-toast';
import { getImageUrl } from '../utils/imageUtils';

const CartDrawer = () => {
  const { 
    items, isDrawerOpen, setDrawerOpen, updateQuantity, 
    removeItem, saveForLater, getTotal, getItemCount 
  } = useCartStore();

  const freeShippingThreshold = 2000;
  const total = getTotal();
  const progress = Math.min((total / freeShippingThreshold) * 100, 100);

  const handleRemove = (id, size, name) => {
    const item = items.find(i => i._id === id && i.selectedSize === size);
    removeItem(id, size);
    toast((t) => (
      <div className="flex items-center gap-4">
        <span className="text-xs font-bold uppercase tracking-widest text-navy">Removed {name}</span>
        <button 
          onClick={() => { useCartStore.getState().addItem(item, item.quantity, item.selectedSize); toast.dismiss(t.id); }}
          className="flex items-center gap-1 px-3 py-1 bg-navy-fixed text-white text-[10px] font-black uppercase tracking-widest hover:bg-terracotta"
        >
          <Undo2 size={12} /> Undo
        </button>
      </div>
    ), { duration: 5000, position: 'bottom-center' });
  };

  return (
    <AnimatePresence>
      {isDrawerOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setDrawerOpen(false)}
            className="fixed inset-0 bg-navy-fixed/40 backdrop-blur-sm z-[1000]"
          />

          {/* Drawer Panel */}
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 30, stiffness: 300 }}
            className="fixed right-0 top-0 h-full w-full sm:w-[450px] bg-[#fafaf7] dark:bg-[#0f172a] shadow-2xl z-[2000] flex flex-col"
          >
            {/* Header */}
            <div className="p-6 border-b border-border flex items-center justify-between">
              <div className="flex items-center gap-3">
                <ShoppingBag size={20} className="text-navy" />
                <h2 className="text-sm font-black uppercase tracking-[0.2em] text-navy">Shopping Bag ({getItemCount()})</h2>
              </div>
              <button onClick={() => setDrawerOpen(false)} className="p-2 hover:bg-warm-white rounded-full transition-colors">
                <X size={20} className="text-navy" />
              </button>
            </div>

            {/* Free Shipping Progress */}
            <div className="p-6 bg-warm-white border-b border-border">
              <div className="flex justify-between items-center mb-2">
                <p className="text-[10px] font-black uppercase tracking-widest text-navy">
                  {total >= freeShippingThreshold 
                    ? "🎉 You've unlocked FREE SHIPPING!" 
                    : `Add ₹${(freeShippingThreshold - total).toLocaleString()} more for FREE SHIPPING`}
                </p>
                <span className="text-[10px] font-black text-terracotta">{Math.round(progress)}%</span>
              </div>
              <div className="h-1 bg-navy/5 rounded-full overflow-hidden">
                <motion.div 
                  initial={{ width: 0 }} 
                  animate={{ width: `${progress}%` }} 
                  className="h-full bg-terracotta" 
                />
              </div>
            </div>

            {/* Cart Items */}
            <div className="flex-1 overflow-y-auto no-scrollbar p-6">
              {items.length === 0 ? (
                <div className="h-full flex flex-col items-center justify-center text-center">
                  <div className="w-20 h-20 bg-warm-white rounded-full flex items-center justify-center mb-6">
                    <ShoppingBag size={32} className="text-navy/10" />
                  </div>
                  <h3 className="text-lg font-serif font-black text-navy mb-2">Your bag is empty</h3>
                  <p className="text-xs text-navy/40 mb-8 max-w-[200px]">Looks like you haven't added anything to your bag yet.</p>
                  <button onClick={() => setDrawerOpen(false)} className="btn-premium">Start Shopping</button>
                </div>
              ) : (
                <div className="space-y-8">
                  {items.map((item, idx) => (
                    <div key={`${item._id}-${item.selectedSize}`} className="flex gap-4">
                      <div className="w-24 aspect-[4/5] bg-warm-white overflow-hidden flex-shrink-0 border border-border">
                        <img src={getImageUrl(item.images?.[0]?.url)} alt={item.name} className="w-full h-full object-cover" />
                      </div>
                      <div className="flex-1 flex flex-col justify-between">
                        <div>
                          <div className="flex justify-between items-start mb-1">
                            <h4 className="text-xs font-black text-navy uppercase tracking-wide truncate max-w-[150px]">{item.name}</h4>
                            <p className="text-xs font-black text-navy">₹{(item.price * item.quantity).toLocaleString()}</p>
                          </div>
                          {item.selectedSize && (
                            <p className="text-[10px] font-bold text-navy/40 uppercase tracking-widest mb-2">Size: {item.selectedSize}</p>
                          )}
                          <div className="flex items-center gap-4 mt-2">
                            <div className="flex items-center border border-border h-8">
                              <button onClick={() => updateQuantity(item._id, item.selectedSize, item.quantity - 1)} className="px-2 text-navy hover:text-terracotta"><Minus size={12} /></button>
                              <span className="px-2 text-xs font-bold text-navy">{item.quantity}</span>
                              <button onClick={() => updateQuantity(item._id, item.selectedSize, item.quantity + 1)} className="px-2 text-navy hover:text-terracotta"><Plus size={12} /></button>
                            </div>
                            <button 
                              onClick={() => saveForLater(item._id, item.selectedSize)}
                              className="text-[10px] font-black uppercase tracking-widest text-navy/40 hover:text-navy underline underline-offset-4"
                            >
                              Save for later
                            </button>
                          </div>
                        </div>
                        <button 
                          onClick={() => handleRemove(item._id, item.selectedSize, item.name)}
                          className="flex items-center gap-1 text-[10px] font-black uppercase tracking-widest text-red-500 hover:text-red-600 transition-colors mt-4"
                        >
                          <Trash2 size={12} /> Remove
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Footer Summary */}
            {items.length > 0 && (
              <div className="p-6 border-t border-border bg-card-bg">
                <div className="space-y-4 mb-6">
                  <div className="flex justify-between text-xs font-bold uppercase tracking-widest text-navy/40">
                    <span>Subtotal</span>
                    <span className="text-navy">₹{total.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between text-xs font-bold uppercase tracking-widest text-navy/40">
                    <span>Shipping</span>
                    <span className="text-green-600">{total >= freeShippingThreshold ? 'FREE' : '₹150'}</span>
                  </div>
                  <div className="flex justify-between text-lg font-black uppercase tracking-widest text-navy pt-4 border-t border-navy/5">
                    <span>Estimated Total</span>
                    <span>₹{(total + (total >= freeShippingThreshold ? 0 : 150)).toLocaleString()}</span>
                  </div>
                </div>
                <Link 
                  to="/checkout"
                  onClick={() => setDrawerOpen(false)}
                  className="w-full btn-premium h-14 group flex items-center justify-center gap-3"
                >
                  Proceed to Checkout <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
                </Link>
                <p className="mt-4 text-center text-[10px] text-navy/30 uppercase tracking-[0.2em] flex items-center justify-center gap-2">
                  <ShieldCheck size={12} /> Secure Checkout & Free Returns
                </p>
              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default CartDrawer;
