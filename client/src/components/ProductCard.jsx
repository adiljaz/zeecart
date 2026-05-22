import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { ShoppingCart, Heart, Eye, Star } from 'lucide-react';
import toast from 'react-hot-toast';
import { getImageUrl } from '../utils/imageUtils';
import { useCartStore } from '../store/useCartStore';
import { useWishlistStore } from '../store/useWishlistStore';

const ProductCard = ({ product, isLoading = false, onQuickView }) => {
  const [isHovered, setIsHovered] = useState(false);
  const addItem = useCartStore((state) => state.addItem);
  const { toggleWishlist, isInWishlist } = useWishlistStore();
  
  if (isLoading || !product) {
    return (
      <div className="flex flex-col gap-4">
        <div className="aspect-product skeleton" />
        <div className="space-y-2">
          <div className="h-4 w-3/4 skeleton" />
          <div className="h-4 w-1/4 skeleton" />
        </div>
      </div>
    );
  }

  const isWishlisted = isInWishlist(product._id);
  const viewingNow = Math.floor(Math.random() * 14) + 2;

  const handleAddToCart = (e) => {
    e.preventDefault();
    e.stopPropagation();
    addItem(product, 1);
    toast.success(`${product.name} added to cart`);
  };

  const handleToggleWishlist = (e) => {
    e.preventDefault();
    e.stopPropagation();
    toggleWishlist(product);
    if (!isWishlisted) {
      toast.success('Added to wishlist!');
    } else {
      toast.success('Removed from wishlist');
    }
  };

  const discountPercent = (product.originalPrice && product.originalPrice > product.price)
    ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100) 
    : 0;

  const mainImage = product.images?.[0]?.url || '';

  return (
    <motion.div 
      layout
      className="group relative flex flex-col bg-card-bg rounded-2xl overflow-hidden p-2 border border-transparent hover:border-border transition-all duration-300"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Image Container */}
      <div className="aspect-product relative bg-warm-white overflow-hidden">
        {/* Badges */}
        <div className="absolute top-3 left-3 z-10 flex flex-col gap-2">
          {discountPercent > 0 && (
            <span className="bg-terracotta text-white text-[10px] font-black px-2 py-1 uppercase tracking-widest">
              {discountPercent}% OFF
            </span>
          )}
           {viewingNow > 10 && (
            <span className="bg-navy-fixed text-white text-[8px] font-black px-2 py-1 uppercase tracking-widest flex items-center gap-1">
              <span className="w-1.5 h-1.5 bg-red-500 rounded-full animate-pulse" />
              Popular
            </span>
          )}
        </div>

        {/* Wishlist Button */}
        <button 
          onClick={handleToggleWishlist}
          className={`absolute top-3 right-3 z-10 p-2 backdrop-blur-md rounded-full transition-all duration-300 lg:transform lg:translate-x-12 lg:group-hover:translate-x-0 ${
            isWishlisted ? 'bg-terracotta text-white' : 'bg-warm-white/80 text-navy hover:text-terracotta hover:bg-warm-white'
          }`}
        >
          <Heart size={16} strokeWidth={isWishlisted ? 0 : 1.5} fill={isWishlisted ? "currentColor" : "none"} />
        </button>

        {/* Main Image */}
        <Link to={`/products/${product._id}`} className="block h-full">
          <img 
            src={getImageUrl(mainImage)} 
            alt={product.name}
            className="img-premium"
          />
        </Link>

        {/* Quick Actions Overlay */}
        <AnimatePresence>
          {isHovered && (
            <motion.div 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 10 }}
              className="absolute inset-x-0 bottom-0 p-4 bg-gradient-to-t from-navy/60 to-transparent hidden lg:flex flex-col gap-2"
            >
              <button 
                onClick={() => onQuickView && onQuickView(product)}
                className="w-full py-3 bg-warm-white text-navy text-[10px] font-black uppercase tracking-[0.2em] hover:bg-terracotta hover:text-white transition-premium flex items-center justify-center gap-2"
              >
                <Eye size={14} /> Quick View
              </button>
              <button 
                onClick={handleAddToCart}
                className="w-full py-3 bg-navy-fixed text-white text-[10px] font-black uppercase tracking-[0.2em] hover:bg-terracotta transition-premium flex items-center justify-center gap-2 shadow-2xl"
              >
                <ShoppingCart size={14} /> Add to Cart
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Product Info */}
      <div className="pt-4 pb-2 flex flex-col gap-1">
        <div className="flex justify-between items-start gap-2">
          <p className="text-[10px] uppercase tracking-widest font-black text-navy/40">{product.category}</p>
          <div className="flex items-center gap-1">
            <Star size={10} className="fill-terracotta text-terracotta" />
            <span className="text-[10px] font-bold text-navy">{product.rating || '4.8'}</span>
          </div>
        </div>
        
        <Link to={`/products/${product._id}`}>
          <h3 className="text-sm font-black text-navy hover:text-terracotta transition-colors text-clamp-2 leading-snug">
            {product.name}
          </h3>
        </Link>
        
        <div className="mt-2 flex items-center justify-between gap-3">
          <div className="flex items-baseline gap-2">
            {product.discountedPrice && product.discountedPrice < product.price ? (
              <>
                <span className="text-sm font-black text-navy">₹{product.discountedPrice.toLocaleString()}</span>
                <span className="text-xs text-navy/30 line-through">₹{product.price.toLocaleString()}</span>
              </>
            ) : (
              <span className="text-sm font-black text-navy">₹{product.price.toLocaleString()}</span>
            )}
          </div>
          
          {/* Mobile Quick Add-to-Cart */}
          <button 
            onClick={handleAddToCart}
            className="lg:hidden w-8 h-8 rounded-full bg-navy-fixed text-white flex items-center justify-center hover:bg-terracotta active:scale-95 transition-all duration-200 shadow-md"
            title="Add to Cart"
          >
            <ShoppingCart size={14} />
          </button>
        </div>

        {isHovered && (
          <motion.p 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-[10px] text-terracotta font-bold uppercase tracking-widest mt-1"
          >
            {viewingNow} people viewing this
          </motion.p>
        )}
      </div>
    </motion.div>
  );
};

export default ProductCard;
