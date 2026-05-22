import React, { useState, useEffect, useMemo, useRef } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet';
import { useSettings } from '../context/SettingsContext';
import { 
  ShoppingCart, Heart, Share2, Truck, ShieldCheck, 
  RotateCcw, Star, ChevronRight, ChevronLeft, Plus, Minus,
  CheckCircle2, Info
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import api from '../api';
import toast from 'react-hot-toast';
import { getImageUrl } from '../utils/imageUtils';
import ProductCard from '../components/ProductCard';
import { useCartStore } from '../store/useCartStore';
import { useWishlistStore } from '../store/useWishlistStore';

const ProductDetail = () => {
  const { settings } = useSettings();
  const { id } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);
  const [relatedProducts, setRelatedProducts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedImage, setSelectedImage] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [selectedSize, setSelectedSize] = useState('');
  const [activeTab, setActiveTab] = useState('description');
  const [showStickyBar, setShowStickyBar] = useState(false);
  const addItem = useCartStore(state => state.addItem);
  const removeItem = useCartStore(state => state.removeItem);
  const isInCart = useCartStore(state => state.isInCart);
  const { toggleWishlist, isInWishlist } = useWishlistStore();
  const isWishlisted = product ? isInWishlist(product._id) : false;
  const isProductInCart = product ? isInCart(product._id) : false;

  const addToCartRef = useRef(null);

  useEffect(() => {
    fetchProduct();
    
    if (!addToCartRef.current) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting && entry.boundingClientRect.top < 0) {
          setShowStickyBar(true);
        } else {
          setShowStickyBar(false);
        }
      },
      { threshold: 0 }
    );
    
    observer.observe(addToCartRef.current);
    return () => observer.disconnect();
  }, [id, isLoading]);

  const fetchProduct = async () => {
    setIsLoading(true);
    try {
      const { data } = await api.get(`/api/products/${id}`);
      setProduct(data);
      // Fetch related
      const { data: relatedData } = await api.get(`/api/products?category=${data.category}`);
      setRelatedProducts(relatedData.products.filter(p => p._id !== id).slice(0, 4));
      
      // Add to recently viewed
      const recent = JSON.parse(localStorage.getItem('zeecart_recent') || '[]');
      const updated = [data, ...recent.filter(p => p._id !== id)].slice(0, 10);
      localStorage.setItem('zeecart_recent', JSON.stringify(updated));
    } catch (err) {
      toast.error('Failed to load product');
    } finally {
      setIsLoading(false);
    }
  };

  const images = useMemo(() => {
    if (!product || !product.images) return [];
    return product.images.map(img => img.url);
  }, [product]);

  const handleAddToCart = () => {
    if (!product) return;
    if (product.sizes?.length > 0 && !selectedSize) {
      toast.error('Please select a size first');
      return;
    }
    if (isProductInCart) {
      removeItem(product._id, selectedSize);
      toast.success(`${product.name} removed from cart`);
    } else {
      addItem(product, quantity, selectedSize);
      toast.success(`${product.name} added to cart`);
    }
  };

  const handleToggleWishlist = () => {
    if (!product) return;
    toggleWishlist(product);
    if (!isWishlisted) {
      toast.success('Added to wishlist!');
    } else {
      toast.success('Removed from wishlist');
    }
  };

  const handleShare = async () => {
    const shareData = {
      title: product.name,
      text: `Check out this ${product.name} on ${settings?.storeName || 'Zee Cart'}! Only ₹${product.price.toLocaleString()}`,
      url: window.location.href,
    };

    try {
      if (navigator.share) {
        // Try sharing with image if possible
        try {
          const response = await fetch(getImageUrl(product.images?.[0]?.url));
          const blob = await response.blob();
          const file = new File([blob], 'product.jpg', { type: 'image/jpeg' });
          
          if (navigator.canShare && navigator.canShare({ files: [file] })) {
            await navigator.share({
              ...shareData,
              files: [file],
            });
            return;
          }
        } catch (e) {
          console.log('File sharing not supported or failed, falling back to link sharing');
        }
        
        await navigator.share(shareData);
        toast.success('Shared successfully');
      } else {
        // Fallback: Copy to clipboard
        await navigator.clipboard.writeText(`${shareData.text} \n\n ${shareData.url}`);
        toast.success('Link copied to clipboard!');
      }
    } catch (err) {
      if (err.name !== 'AbortError') {
        toast.error('Sharing failed');
      }
    }
  };

  if (isLoading) return (
    <div className="pt-32 px-4 md:px-8 max-w-[1600px] mx-auto animate-pulse">
      <div className="flex flex-col md:flex-row gap-12">
        <div className="w-full md:w-1/2 aspect-[4/5] bg-gray-100" />
        <div className="w-full md:w-1/2 space-y-6">
          <div className="h-10 bg-gray-100 w-3/4" />
          <div className="h-6 bg-gray-100 w-1/4" />
          <div className="h-32 bg-gray-100" />
        </div>
      </div>
    </div>
  );

  if (!product) return <div className="pt-32 text-center">Product not found</div>;

  return (
    <div className="bg-warm-white min-h-screen">
      <Helmet>
        <title>{product.name} | {settings?.storeName || 'Zee Cart'} Premium</title>
        <meta property="og:title" content={`${product.name} | ${settings?.storeName || 'Zee Cart'} Premium`} />
        <meta property="og:description" content={product.description?.substring(0, 160)} />
        <meta property="og:image" content={getImageUrl(product.images?.[0]?.url)} />
        <meta property="og:type" content="product" />
        <meta name="twitter:card" content="summary_large_image" />
      </Helmet>

      {/* Breadcrumb */}
      <div className="pt-24 pb-8 px-4 md:px-8 max-w-[1600px] mx-auto">
        <nav className="flex items-center gap-2 text-[10px] uppercase tracking-widest font-black text-navy/40">
          <Link to="/" className="hover:text-navy transition-colors">Home</Link>
          <ChevronRight size={10} />
          <Link to="/products" className="hover:text-navy transition-colors">Shop</Link>
          <ChevronRight size={10} />
          <span className="text-navy">{product.name}</span>
        </nav>
      </div>

      <div className="px-4 md:px-8 max-w-[1600px] mx-auto pb-24">
        <div className="flex flex-col lg:flex-row gap-16">
          
          {/* Section: Image Gallery */}
          <div className="w-full lg:w-3/5">
            <div className="flex flex-col-reverse md:flex-row gap-4">
              {/* Thumbnails (Desktop Only) */}
              <div className="hidden md:flex flex-col gap-4 overflow-y-auto no-scrollbar max-h-[600px]">
                {images.map((img, idx) => (
                  <button 
                    key={idx}
                    onClick={() => setSelectedImage(idx)}
                    className={`w-24 aspect-[4/5] flex-shrink-0 bg-card-bg border transition-premium p-1 ${selectedImage === idx ? 'border-navy shadow-lg' : 'border-border hover:border-navy/30'}`}
                  >
                    <img 
                      src={getImageUrl(img)} 
                      alt="" 
                      className="w-full h-full object-cover" 
                      onError={(e) => {
                        e.target.onerror = null;
                        e.target.src = 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&q=80&w=1000';
                      }}
                    />
                  </button>
                ))}
              </div>
              {/* Main Image */}
              <div className="flex-1 aspect-square md:aspect-auto md:h-[600px] bg-card-bg border border-border overflow-hidden relative group">
                
                {/* Mobile Swipeable Gallery */}
                <div 
                  className="flex md:hidden w-full h-full overflow-x-auto snap-x snap-mandatory no-scrollbar"
                  onScroll={(e) => {
                    const index = Math.round(e.target.scrollLeft / e.target.offsetWidth);
                    setSelectedImage(index);
                  }}
                >
                  {images.map((img, idx) => (
                    <img 
                      key={idx}
                      src={getImageUrl(img)} 
                      className="w-full h-full flex-shrink-0 object-cover snap-center" 
                      alt=""
                      onError={(e) => {
                        e.target.onerror = null;
                        e.target.src = 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&q=80&w=1000';
                      }}
                    />
                  ))}
                </div>

                {/* Mobile Pagination Dots */}
                {images.length > 1 && (
                  <div className="md:hidden absolute bottom-4 left-0 right-0 flex justify-center gap-2 z-10">
                    {images.map((_, idx) => (
                      <div 
                        key={idx} 
                        className={`w-1.5 h-1.5 rounded-full transition-all ${selectedImage === idx ? 'bg-navy w-4' : 'bg-navy/30'}`}
                      />
                    ))}
                  </div>
                )}

                {/* Desktop Main Image */}
                <motion.img 
                  key={selectedImage}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  src={getImageUrl(images[selectedImage])} 
                  className="hidden md:block w-full h-full object-cover transition-transform duration-700 hover:scale-110 cursor-zoom-in" 
                  onError={(e) => {
                    e.target.onerror = null;
                    e.target.src = 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&q=80&w=1000';
                  }}
                />
                
                {/* Wishlist Icon on Image */}
                <button 
                  onClick={handleToggleWishlist}
                  className={`absolute top-4 right-4 z-10 w-12 h-12 rounded-full flex items-center justify-center transition-all duration-300 ${
                    isWishlisted 
                      ? 'bg-terracotta text-white shadow-lg shadow-terracotta/20 scale-110' 
                      : 'bg-white/90 backdrop-blur-md text-navy hover:bg-white hover:text-terracotta hover:scale-110 shadow-sm'
                  }`}
                >
                  <Heart size={20} fill={isWishlisted ? "currentColor" : "none"} strokeWidth={isWishlisted ? 0 : 1.5} />
                </button>
              </div>
            </div>
          </div>

          {/* Section: Product Info */}
          <div className="w-full lg:w-2/5">
            <div className="sticky top-28">
              <div className="flex items-center justify-between mb-4">
                <span className="px-2 py-1 bg-navy-fixed text-white text-[8px] font-black uppercase tracking-widest">New Arrival</span>
                <button 
                  onClick={handleShare}
                  className="text-navy/40 hover:text-terracotta transition-colors flex items-center gap-2 group"
                >
                  <span className="text-[8px] font-black uppercase tracking-widest opacity-0 group-hover:opacity-100 transition-opacity">Share</span>
                  <Share2 size={18} />
                </button>
              </div>

              <h1 className="text-4xl md:text-5xl font-serif font-black text-navy mb-4 leading-tight">{product.name}</h1>
              
              <div className="flex items-center gap-4 mb-8">
                <div className="flex items-center gap-1">
                  {[1,2,3,4,5].map((i) => (
                    <Star key={i} size={14} className={i <= 4 ? "fill-terracotta text-terracotta" : "text-navy/20"} />
                  ))}
                </div>
                <span className="text-xs font-bold text-navy/40 uppercase tracking-widest">(128 Verified Reviews)</span>
              </div>

              <div className="flex items-baseline gap-4 mb-8 pb-8 border-b border-border">
                <span className="text-3xl font-black text-navy">₹{product.price.toLocaleString()}</span>
                {product.originalPrice > product.price && (
                  <>
                    <span className="text-xl text-navy/30 line-through">₹{product.originalPrice.toLocaleString()}</span>
                    <span className="text-sm font-black text-terracotta bg-terracotta/5 px-2 py-1 uppercase">
                      Save {Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)}%
                    </span>
                  </>
                )}
              </div>

              {/* Variant Selector */}
              <div className="space-y-8 mb-10">
                {product.sizes && product.sizes.length > 0 && (
                  <div>
                    <div className="flex justify-between items-center mb-4">
                      <h4 className="text-[10px] uppercase tracking-widest font-black text-navy">Select Size</h4>
                      <button className="text-[10px] font-black uppercase tracking-widest text-terracotta hover:underline">Size Guide</button>
                    </div>
                    <div className="flex flex-wrap gap-3">
                      {product.sizes.map((size) => (
                        <button 
                          key={size}
                          onClick={() => setSelectedSize(size)}
                          className={`min-w-14 px-3 h-14 flex items-center justify-center text-xs font-bold transition-premium border ${selectedSize === size ? 'border-navy-fixed bg-navy-fixed text-white shadow-xl' : 'border-border text-navy/40 hover:border-navy'}`}
                        >
                          {size}
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                <div>
                  <h4 className="text-[10px] uppercase tracking-widest font-black text-navy mb-4">Quantity</h4>
                  <div className="flex items-center w-32 border border-border">
                    <button onClick={() => setQuantity(q => Math.max(1, q-1))} className="p-3 text-navy hover:text-terracotta transition-colors"><Minus size={16} /></button>
                    <input type="text" readOnly value={quantity} className="flex-1 bg-transparent text-center text-sm font-black text-navy" />
                    <button onClick={() => setQuantity(q => q+1)} className="p-3 text-navy hover:text-terracotta transition-colors"><Plus size={16} /></button>
                  </div>
                </div>
              </div>

              {/* Urgency */}
              {product.stock < 10 && (
                <div className="mb-8 p-4 bg-terracotta/5 border border-terracotta/10 flex items-center gap-3">
                  <div className="w-2 h-2 bg-terracotta rounded-full animate-pulse" />
                  <p className="text-xs font-bold text-terracotta uppercase tracking-widest">Only {product.stock} left in stock - Order fast!</p>
                </div>
              )}

              {/* Actions */}
              <div ref={addToCartRef} className="flex flex-col gap-4 mb-8">
                <button 
                  onClick={handleAddToCart}
                  className={`w-full btn-premium h-16 shadow-2xl flex items-center justify-center gap-3 ${
                    isProductInCart ? '!bg-terracotta' : ''
                  }`}
                >
                  <ShoppingCart size={20} fill={isProductInCart ? "currentColor" : "none"} /> {isProductInCart ? 'Remove from Cart' : 'Add to Cart'}
                </button>
                {!isProductInCart && (
                  <button 
                    onClick={() => { handleAddToCart(); navigate('/checkout'); }}
                    className="w-full h-16 border border-navy text-navy text-[10px] font-black uppercase tracking-[0.4em] hover:bg-navy hover:text-white transition-premium flex items-center justify-center gap-3"
                  >
                    Buy it Now
                  </button>
                )}
              </div>

              {/* Trust Badges */}
              <div className="grid grid-cols-3 gap-4 py-8 border-y border-border mb-10">
                <div className="flex flex-col items-center justify-center gap-3 text-center group">
                  <div className="w-12 h-12 rounded-full bg-navy/5 flex items-center justify-center text-navy group-hover:bg-navy group-hover:text-white transition-colors">
                    <Truck size={20} strokeWidth={1.5} />
                  </div>
                  <span className="text-[9px] font-bold uppercase tracking-widest text-navy/60">Free Global Delivery</span>
                </div>
                <div className="flex flex-col items-center justify-center gap-3 text-center group">
                  <div className="w-12 h-12 rounded-full bg-navy/5 flex items-center justify-center text-navy group-hover:bg-navy group-hover:text-white transition-colors">
                    <RotateCcw size={20} strokeWidth={1.5} />
                  </div>
                  <span className="text-[9px] font-bold uppercase tracking-widest text-navy/60">30-Day Free Returns</span>
                </div>
                <div className="flex flex-col items-center justify-center gap-3 text-center group">
                  <div className="w-12 h-12 rounded-full bg-navy/5 flex items-center justify-center text-navy group-hover:bg-navy group-hover:text-white transition-colors">
                    <ShieldCheck size={20} strokeWidth={1.5} />
                  </div>
                  <span className="text-[9px] font-bold uppercase tracking-widest text-navy/60">100% Secure Checkout</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-24">
          <div className="flex border-b border-border overflow-x-auto no-scrollbar">
            {['description', 'reviews'].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-8 py-6 text-[10px] uppercase tracking-[0.3em] font-black transition-premium border-b-2 ${activeTab === tab ? 'border-navy text-navy' : 'border-transparent text-navy/30 hover:text-navy'}`}
              >
                {tab}
              </button>
            ))}
          </div>
          <div className="py-12">
            <AnimatePresence mode="wait">
              <motion.div
                key={activeTab}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="max-w-4xl"
              >
                {activeTab === 'description' && (
                  <div className="space-y-6 text-sm text-navy/60 leading-relaxed">
                    <p>{product.description}</p>
                    <ul className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {['100% Organic Cotton', 'Sustainable Dyes', 'Ethically Manufactured', 'Premium Finish'].map(feat => (
                        <li key={feat} className="flex items-center gap-3">
                          <CheckCircle2 size={16} className="text-terracotta" />
                          <span className="font-bold text-navy">{feat}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
                {activeTab === 'reviews' && (
                  <div className="space-y-12">
                    <div className="flex flex-col md:flex-row gap-12 items-center">
                      <div className="text-center p-8 bg-navy-fixed text-white rounded-sm">
                        <h2 className="text-5xl font-black mb-2">4.9</h2>
                        <div className="flex gap-1 mb-2">
                          {[1,2,3,4,5].map(i => <Star key={i} size={14} className="fill-terracotta text-terracotta" />)}
                        </div>
                        <p className="text-[10px] uppercase tracking-widest font-bold text-white/40">Based on 128 Reviews</p>
                      </div>
                      <div className="flex-1 space-y-3 w-full">
                        {[5,4,3,2,1].map(star => (
                          <div key={star} className="flex items-center gap-4">
                            <span className="text-xs font-bold text-navy w-4">{star}</span>
                            <div className="flex-1 h-1.5 bg-gray-100 rounded-full overflow-hidden">
                              <motion.div initial={{ width: 0 }} animate={{ width: `${star === 5 ? 85 : star === 4 ? 12 : 1}%` }} className="h-full bg-terracotta" />
                            </div>
                            <span className="text-[10px] text-navy/40 font-bold w-12 text-right">{star === 5 ? '85%' : star === 4 ? '12%' : '1%'}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                )}
              </motion.div>
            </AnimatePresence>
          </div>
        </div>

        {/* Recently Viewed */}
        <section className="mt-24">
          <div className="flex items-center justify-between mb-12">
            <h2 className="text-2xl font-serif font-black text-navy">Recently Viewed</h2>
            <div className="flex gap-2">
              <button className="p-2 border border-border hover:border-navy transition-premium"><ChevronLeft size={20} /></button>
              <button className="p-2 border border-border hover:border-navy transition-premium"><ChevronRight size={20} /></button>
            </div>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {relatedProducts.map(p => <ProductCard key={p._id} product={p} />)}
          </div>
        </section>
      </div>

      {/* Sticky Bottom Bar (Mobile & Scroll) */}
      <AnimatePresence>
        {showStickyBar && (
          <motion.div 
            initial={{ y: 100 }}
            animate={{ y: 0 }}
            exit={{ y: 100 }}
            className="fixed bottom-0 left-0 right-0 bg-card-bg border-t border-border z-header p-4 shadow-[0_-10px_30px_rgba(0,0,0,0.1)]"
          >
            <div className="max-w-[1600px] mx-auto flex items-center justify-between gap-4">
              <div className="hidden sm:flex items-center gap-4">
                <img 
                  src={getImageUrl(product.images?.[0]?.url)} 
                  className="w-12 h-12 object-cover" 
                  alt="" 
                  onError={(e) => {
                    e.target.onerror = null;
                    e.target.src = 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&q=80&w=1000';
                  }}
                />
                <div>
                  <h4 className="text-xs font-black text-navy truncate max-w-[200px]">{product.name}</h4>
                  <p className="text-xs font-black text-terracotta">₹{product.price.toLocaleString()}</p>
                </div>
              </div>
              <div className="flex-1 sm:flex-none flex items-center gap-4">
                <div className="flex items-center border border-border h-12">
                  <button onClick={() => setQuantity(q => Math.max(1, q-1))} className="px-3"><Minus size={14} /></button>
                  <span className="px-4 text-xs font-bold">{quantity}</span>
                  <button onClick={() => setQuantity(q => q+1)} className="px-3"><Plus size={14} /></button>
                </div>
                <button 
                  onClick={handleAddToCart}
                  className={`flex-1 sm:px-12 h-12 text-white text-[10px] font-black uppercase tracking-widest hover:bg-terracotta transition-premium ${
                    isProductInCart ? 'bg-terracotta' : 'bg-navy-fixed'
                  }`}
                >
                  {isProductInCart ? 'Remove from Cart' : 'Add to Cart'}
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default ProductDetail;
