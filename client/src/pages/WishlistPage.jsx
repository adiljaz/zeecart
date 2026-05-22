import React from 'react';
import { useWishlistStore } from '../store/useWishlistStore';
import ProductCard from '../components/ProductCard';
import { Heart, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

const WishlistPage = () => {
  const { items } = useWishlistStore();

  return (
    <div className="pt-32 pb-24 px-4 md:px-8 max-w-[1600px] mx-auto min-h-screen">
      <div className="mb-16">
        <h1 className="text-6xl font-serif font-black text-navy mb-4 tracking-tighter">Your Wishlist<span className="text-terracotta">.</span></h1>
        <p className="text-xs font-black uppercase tracking-[0.4em] text-navy/40">Saved for later</p>
      </div>

      {items.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-24 text-center">
          <div className="w-24 h-24 bg-warm-white rounded-full flex items-center justify-center mb-8">
            <Heart size={40} className="text-navy/10" strokeWidth={1} />
          </div>
          <h2 className="text-2xl font-serif font-black text-navy mb-4">Your wishlist is empty</h2>
          <p className="text-xs text-navy/40 mb-12 max-w-xs uppercase tracking-widest font-bold">
            Explore our collection and save your favorite items here.
          </p>
          <Link to="/products" className="btn-premium px-12 py-5 group">
            Start Exploring <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-x-8 gap-y-16">
          {items.map((product) => (
            <ProductCard key={product._id} product={product} />
          ))}
        </div>
      )}
    </div>
  );
};

export default WishlistPage;
