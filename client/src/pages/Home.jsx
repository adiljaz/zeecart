import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, Pagination, EffectFade } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/pagination';
import 'swiper/css/effect-fade';
import { motion } from 'framer-motion';
import { ArrowRight, Zap, TrendingUp, Star, Truck, ShieldCheck, Heart, ShoppingBag, PlusCircle, LayoutGrid } from 'lucide-react';
import { Helmet } from 'react-helmet';
import FlashSaleTimer from '../components/FlashSaleTimer';
import ProductCard from '../components/ProductCard';
import api from '../api';
import { useSettings } from '../context/SettingsContext';

const Home = () => {
  const { settings } = useSettings();
  const [trendingProducts, setTrendingProducts] = useState([]);
  const [bestSellers, setBestSellers] = useState([]);
  const [categories, setCategories] = useState([]);
  const [banners, setBanners] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [trendingRes, bestSellerRes, catRes, bannerRes] = await Promise.all([
          api.get('/api/products?isTrending=true&limit=4'),
          api.get('/api/products?isBestSeller=true&limit=4'),
          api.get('/api/categories'),
          api.get('/api/banners')
        ]);
        
        setTrendingProducts(trendingRes.data.products || trendingRes.data);
        setBestSellers(bestSellerRes.data.products || bestSellerRes.data);
        setBanners(bannerRes.data);
        // Filter out electronics from the UI if any exist in DB
        setCategories(catRes.data.filter(cat => cat.name !== 'Electronics'));
      } catch (err) {
        console.error('Failed to fetch home data', err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, []);

  const heroSlides = banners.filter(b => b.area === 'hero').length > 0 
    ? banners.filter(b => b.area === 'hero')
    : [
    {
      title: "Engineered for Performance.",
      subtitle: "The Sports Collection",
      image: "https://images.unsplash.com/photo-1556906781-9a412961c28c?auto=format&fit=crop&q=80&w=2070",
      ctaText: "Explore Footwear",
      link: "/products",
    },
    {
      title: "Elegance in Every Thread.",
      subtitle: "Premium Summer Edit",
      image: "https://images.unsplash.com/photo-1490481651871-ab68de25d43d?auto=format&fit=crop&q=80&w=2070",
      ctaText: "Shop Essentials",
      link: "/products",
    },
    {
      title: "Define Your Street Style.",
      subtitle: "Urban Nomads",
      image: "https://images.unsplash.com/photo-1523381210434-271e8be1f52b?auto=format&fit=crop&q=80&w=2070",
      ctaText: "Browse Urban",
      link: "/products",
    }
  ];

  const getImageUrl = (url) => {
    if (!url) return '';
    if (url.startsWith('http') || url.startsWith('data:image')) return url;
    const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';
    const baseUrl = API_URL.endsWith('/') ? API_URL.slice(0, -1) : API_URL;
    const path = url.startsWith('/') ? url : `/${url}`;
    return `${baseUrl}${path}`;
  };

  const getBannerByArea = (area, fallback) => {
    const banner = banners.find(b => b.area === area);
    return banner || fallback;
  };

  return (
    <div className="bg-warm-white">
      <Helmet>
        <title>{settings?.storeName || 'Zee Cart'} | Premium E-commerce</title>
      </Helmet>
      {/* 1. Hero Banner Carousel */}
      <section className="relative h-[85vh] lg:h-[95vh] bg-navy-fixed overflow-hidden">
        <Swiper
          modules={[Autoplay, Pagination, EffectFade]}
          effect="fade"
          autoplay={{ delay: 6000 }}
          pagination={{ clickable: true }}
          className="h-full"
        >
          {heroSlides.map((slide, index) => (
            <SwiperSlide key={index}>
              <div className="relative h-full w-full">
                <img 
                  src={getImageUrl(slide.image)} 
                  alt="" 
                  className="absolute inset-0 w-full h-full object-cover object-center" 
                  fetchpriority={index === 0 ? "high" : "auto"}
                  onError={(e) => {
                    e.target.onerror = null;
                    e.target.src = 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&q=80&w=1000';
                  }}
                />
                
                {/* Dynamic Overlays */}
                <div className="absolute inset-0 bg-black/10" />
                <div className="absolute bottom-0 left-0 right-0 h-1/3 bg-gradient-to-t from-black/40 to-transparent" />
                
                <div className="relative h-full max-w-[1600px] mx-auto px-6 md:px-12 flex flex-col justify-center items-start">
                  <motion.div
                    initial={{ opacity: 0, x: -30 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.8 }}
                  >
                    <p className="text-terracotta text-sm font-black uppercase tracking-[0.5em] mb-6 drop-shadow-lg">
                      {slide.subtitle}
                    </p>
                    <h2 className="text-white text-5xl md:text-8xl lg:text-9xl font-serif font-black tracking-tighter mb-10 max-w-4xl leading-[0.85] drop-shadow-2xl">
                      {slide.title.split(' ').map((word, i) => (
                        <span key={i} className={i === 2 ? 'text-terracotta' : ''}>{word} </span>
                      ))}
                    </h2>
                    <div className="flex gap-4">
                      <Link to={slide.link || "/products"} className="btn-premium px-12 py-5 text-sm shadow-2xl border-white/20">
                        {slide.ctaText || "Shop Now"} <ArrowRight size={20} />
                      </Link>
                    </div>
                  </motion.div>
                </div>
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
      </section>


      {/* 3. Category Strip */}
      <section className="py-12 bg-card-bg overflow-x-auto no-scrollbar scroll-smooth border-y border-border">
        <div className="max-w-[1600px] mx-auto px-6 md:px-12 flex items-center justify-start lg:justify-center gap-12 lg:gap-24">
          {categories.map((cat) => (
            <Link 
              key={cat._id} 
              to={`/products?category=${cat.name}`}
              className="flex flex-col items-center gap-4 group flex-shrink-0"
            >
              <div className="w-16 h-16 bg-warm-white rounded-full flex items-center justify-center text-2xl group-hover:bg-navy group-hover:text-white transition-premium shadow-sm">
                {cat.name === 'Ornaments' ? '💎' : 
                 cat.name === 'Watches' ? '⌚' : 
                 cat.name === 'Kids Wear' ? '🧸' : 
                 cat.name === 'Dresses' ? '👗' : 
                 cat.name === 'Clothing' ? '👕' : '🛍️'}
              </div>
              <div className="flex flex-col items-center">
                <span className="text-[10px] font-black text-navy uppercase tracking-widest">{cat.name}</span>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* 4. Trending Now Section */}
      <section className="py-16 md:py-24 px-4 md:px-12 max-w-[1600px] mx-auto">
        <div className="flex flex-col md:flex-row items-start md:items-end justify-between mb-10 md:mb-16 gap-6">
          <div>
            <h2 className="text-4xl md:text-7xl font-serif font-black text-navy tracking-tighter leading-none">Trending.</h2>
            <p className="text-terracotta text-[10px] md:text-xs font-black uppercase tracking-[0.4em] mt-4">The Style Pulse</p>
          </div>
          <Link to="/products?isTrending=true" className="group flex items-center gap-3 text-xs font-black uppercase tracking-widest text-navy border-b-2 border-navy/10 hover:border-terracotta transition-premium pb-1">
            Explore All Trends <ArrowRight size={16} className="group-hover:translate-x-2 transition-transform" />
          </Link>
        </div>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-x-4 gap-y-8 md:gap-x-8 md:gap-y-16">
          {isLoading ? (
            [1,2,3,4].map(i => <div key={i} className="animate-pulse aspect-product bg-warm-white rounded-2xl" />)
          ) : trendingProducts.map(product => (
            <ProductCard key={product._id} product={product} />
          ))}
        </div>
      </section>

      {/* 5. Highlight Area: Collection Spotlight */}
      <section className="py-24 px-6 md:px-12 max-w-[1600px] mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="relative aspect-[4/5] lg:aspect-auto group overflow-hidden">
            <img 
              src={getImageUrl(getBannerByArea('women', { image: "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&q=80&w=1000" }).image)} 
              className="absolute inset-0 w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105" 
              alt="Women's Collection" 
              onError={(e) => {
                e.target.onerror = null;
                e.target.src = 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&q=80&w=1000';
              }}
            />
            <div className="absolute inset-0 bg-black/20 group-hover:bg-black/40 transition-colors" />
            <div className="relative h-full p-6 md:p-12 flex flex-col justify-end">
              <h3 className="text-4xl md:text-6xl font-serif font-black text-white mb-6">
                {getBannerByArea('women', { title: "Bold In Blue." }).title}
              </h3>
              <Link to={getBannerByArea('women', { link: "/products?gender=women" }).link} className="w-fit px-8 py-4 bg-white text-navy-fixed text-xs font-black uppercase tracking-widest hover:bg-terracotta hover:text-white transition-premium">
                Shop Collection
              </Link>
            </div>
          </div>
          <div className="grid grid-rows-2 gap-8">
             <div className="relative overflow-hidden group">
               <img 
                 src={getImageUrl(getBannerByArea('men', { image: "https://images.unsplash.com/photo-1495121605193-b116b5b9c5fe?auto=format&fit=crop&q=80&w=1000" }).image)} 
                 className="absolute inset-0 w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105" 
                 alt="Men's Collection" 
                 onError={(e) => {
                   e.target.onerror = null;
                   e.target.src = 'https://images.unsplash.com/photo-1495121605193-b116b5b9c5fe?auto=format&fit=crop&q=80&w=1000';
                 }}
               />
               <div className="absolute inset-0 bg-black/20 group-hover:bg-black/40 transition-colors" />
               <div className="relative h-full p-6 md:p-10 flex flex-col justify-center">
                 <h4 className="text-xl md:text-2xl font-serif font-black text-white mb-4">
                   {getBannerByArea('men', { title: "Street Edit." }).title}
                 </h4>
                 <Link to={getBannerByArea('men', { link: "/products?gender=men" }).link} className="text-white text-[10px] font-black uppercase tracking-widest flex items-center gap-2 group-hover:gap-4 transition-all">
                    Shop Now <ArrowRight size={14} />
                 </Link>
               </div>
             </div>
             <div className="relative overflow-hidden group">
               <img 
                 src={getImageUrl(getBannerByArea('kids', { image: "https://images.unsplash.com/photo-1622290291468-a28f7a7dc6a8?auto=format&fit=crop&q=80&w=1000" }).image)} 
                 className="absolute inset-0 w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105" 
                 alt="Kids Fashion" 
                 onError={(e) => {
                   e.target.onerror = null;
                   e.target.src = 'https://images.unsplash.com/photo-1622290291468-a28f7a7dc6a8?auto=format&fit=crop&q=80&w=1000';
                 }}
               />
               <div className="absolute inset-0 bg-black/20 group-hover:bg-black/40 transition-colors" />
               <div className="relative h-full p-6 md:p-10 flex flex-col justify-center items-center text-center">
                 <h4 className="text-xl md:text-2xl font-serif font-black text-white mb-4">
                   {getBannerByArea('kids', { title: "Little Trendsetters." }).title}
                 </h4>
                  <Link to={getBannerByArea('kids', { link: "/products?gender=kids" }).link} className="text-white text-[10px] font-black uppercase tracking-widest flex items-center gap-2 group-hover:gap-4 transition-all border border-white/20 px-6 py-3 hover:bg-white hover:text-navy-fixed">
                     Shop Kids <ArrowRight size={14} />
                  </Link>
               </div>
             </div>
          </div>
        </div>
      </section>

      {/* 6. Most Sold Section */}
      <section className="py-16 md:py-24 px-4 md:px-12 max-w-[1600px] mx-auto bg-card-bg shadow-premium md:rounded-[3rem] border-y md:border border-border">
        <div className="flex flex-col md:flex-row items-start md:items-end justify-between mb-10 md:mb-16 md:px-4 gap-6">
          <div>
            <h2 className="text-3xl md:text-4xl font-serif font-black text-navy mb-2 tracking-tight">The Best-Sellers.</h2>
            <p className="text-navy/40 text-[10px] md:text-xs font-bold uppercase tracking-widest">Most loved by our community</p>
          </div>
          <Link to="/products?isBestSeller=true" className="text-xs font-black uppercase tracking-widest text-navy border-b-2 border-navy/10 hover:border-terracotta transition-premium pb-1">
            View All
          </Link>
        </div>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-x-4 gap-y-8 md:gap-x-8 md:gap-y-16">
          {isLoading ? (
            [1,2,3,4].map(i => <div key={i} className="animate-pulse aspect-product bg-warm-white rounded-2xl" />)
          ) : bestSellers.map(product => (
            <ProductCard key={product._id} product={product} />
          ))}
        </div>
      </section>

      {/* Trust Section */}
      <section className="py-24 border-t border-border bg-warm-white">
        <div className="max-w-[1600px] mx-auto px-6 md:px-12 grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-16">
          <div className="flex items-center gap-6">
            <div className="w-16 h-16 bg-navy-fixed flex items-center justify-center rounded-sm shadow-xl text-white">
              <Truck size={32} strokeWidth={1} />
            </div>
            <div>
              <h4 className="text-xs font-black uppercase tracking-widest text-navy mb-1">Elite Logistics</h4>
              <p className="text-[10px] text-navy/40 font-bold uppercase tracking-widest">Complimentary shipping on all premium orders</p>
            </div>
          </div>
          <div className="flex items-center gap-6">
            <div className="w-16 h-16 bg-navy-fixed flex items-center justify-center rounded-sm shadow-xl text-white">
              <ShieldCheck size={32} strokeWidth={1} />
            </div>
            <div>
              <h4 className="text-xs font-black uppercase tracking-widest text-navy mb-1">Authenticity Shield</h4>
              <p className="text-[10px] text-navy/40 font-bold uppercase tracking-widest">Every item is verified by our luxury experts</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
