import { X, ShoppingCart, Heart, Star, ShieldCheck, Truck } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { getImageUrl } from '../utils/imageUtils';
import { useCartStore } from '../store/useCartStore';
import { useWishlistStore } from '../store/useWishlistStore';
import toast from 'react-hot-toast';

const QuickViewModal = ({ product, isOpen, onClose }) => {
  const addItem = useCartStore(state => state.addItem);
  const { toggleWishlist, isInWishlist } = useWishlistStore();
  const isWishlisted = product ? isInWishlist(product._id) : false;

  if (!product) return null;

  const handleAddToCart = () => {
    addItem(product, 1);
    toast.success(`${product.name} added to cart`);
    onClose();
  };

  const handleToggleWishlist = () => {
    toggleWishlist(product);
    if (!isWishlisted) {
      toast.success('Added to wishlist!');
    } else {
      toast.success('Removed from wishlist');
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[2000] flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-navy-fixed/60 backdrop-blur-sm"
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="relative w-full max-w-5xl bg-card-bg shadow-2xl overflow-hidden flex flex-col md:flex-row h-auto max-h-[90vh]"
          >
            <button
              onClick={onClose}
              className="absolute top-4 right-4 z-10 p-2 bg-card-bg/80 hover:bg-card-bg text-navy transition-premium rounded-full border border-border"
            >
              <X size={20} />
            </button>

            {/* Image Section */}
            <div className="w-full md:w-1/2 aspect-[4/5] bg-warm-white">
              <img 
                src={getImageUrl(product.images?.[0]?.url)} 
                alt={product.name} 
                className="w-full h-full object-cover" 
                onError={(e) => {
                  e.target.onerror = null;
                  e.target.src = 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&q=80&w=1000';
                }}
              />
            </div>

            {/* Content Section */}
            <div className="w-full md:w-1/2 p-8 md:p-12 overflow-y-auto">
              <div className="flex items-center gap-2 mb-4">
                <span className="text-[10px] uppercase tracking-[0.2em] font-black text-terracotta">{product.category}</span>
                <span className="w-1 h-1 bg-navy/20 rounded-full" />
                <div className="flex items-center gap-1">
                  <Star size={12} className="fill-terracotta text-terracotta" />
                  <span className="text-xs font-bold text-navy">4.9 (128 reviews)</span>
                </div>
              </div>

              <h2 className="text-3xl font-serif font-black text-navy mb-4 leading-tight">{product.name}</h2>
              
              <div className="flex items-baseline gap-4 mb-8">
                <span className="text-2xl font-black text-navy">₹{product.price.toLocaleString()}</span>
                {product.originalPrice > product.price && (
                  <span className="text-lg text-navy/30 line-through">₹{product.originalPrice.toLocaleString()}</span>
                )}
              </div>

              <p className="text-sm text-navy/60 mb-8 leading-relaxed">
                {product.description || "Indulge in the epitome of luxury with this masterfully crafted piece. Designed for those who appreciate the finer things in life, combining timeless aesthetics with modern comfort."}
              </p>

              {/* Variants Placeholder */}
              <div className="space-y-6 mb-10">
                <div>
                  <h4 className="text-[10px] uppercase tracking-widest font-black text-navy mb-3">Select Color</h4>
                  <div className="flex gap-2">
                    {['#0f172a', '#c2714f', '#94a3b8'].map((color) => (
                      <button key={color} className="w-8 h-8 rounded-full border border-border p-1">
                        <div className="w-full h-full rounded-full" style={{ backgroundColor: color }} />
                      </button>
                    ))}
                  </div>
                </div>
                <div>
                  <h4 className="text-[10px] uppercase tracking-widest font-black text-navy mb-3">Select Size</h4>
                  <div className="flex gap-2">
                    {['S', 'M', 'L', 'XL'].map((size) => (
                      <button key={size} className="w-10 h-10 border border-border flex items-center justify-center text-xs font-bold text-navy hover:border-navy hover:bg-navy-fixed hover:text-white transition-premium">
                        {size}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Actions */}
              <div className="flex gap-4 mb-8">
                <button 
                  onClick={handleAddToCart}
                  className="flex-1 btn-premium"
                >
                  <ShoppingCart size={18} /> Add to Cart
                </button>
                <button 
                  onClick={handleToggleWishlist}
                  className={`p-4 border transition-premium ${isWishlisted ? 'bg-terracotta text-white border-terracotta' : 'border-border text-navy hover:text-terracotta'}`}
                >
                  <Heart size={20} fill={isWishlisted ? "currentColor" : "none"} strokeWidth={isWishlisted ? 0 : 1.5} />
                </button>
              </div>

              {/* Trust Badges */}
              <div className="grid grid-cols-2 gap-4 pt-8 border-t border-border">
                <div className="flex items-center gap-3">
                  <Truck size={20} className="text-terracotta" />
                  <div className="flex flex-col">
                    <span className="text-[10px] font-black text-navy uppercase tracking-widest">Free Shipping</span>
                    <span className="text-[10px] text-navy/40">Orders over ₹2000</span>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <ShieldCheck size={20} className="text-terracotta" />
                  <div className="flex flex-col">
                    <span className="text-[10px] font-black text-navy uppercase tracking-widest">Secure Checkout</span>
                    <span className="text-[10px] text-navy/40">100% Protected</span>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default QuickViewModal;
