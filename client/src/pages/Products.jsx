import React, { useState, useEffect, useMemo } from 'react';
import { useLocation, useSearchParams } from 'react-router-dom';
import { Helmet } from 'react-helmet';
import { useSettings } from '../context/SettingsContext';
import { 
  Filter, X, ChevronDown, LayoutGrid, List, 
  Search, SlidersHorizontal, ArrowUpDown, RefreshCcw 
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import api from '../api';
import ProductCard from '../components/ProductCard';
import QuickViewModal from '../components/QuickViewModal';
import toast from 'react-hot-toast';

const Products = () => {
  const { settings } = useSettings();
  const [searchParams, setSearchParams] = useSearchParams();
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [viewMode, setViewMode] = useState('grid'); // 'grid' | 'list'
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [isQuickViewOpen, setIsQuickViewOpen] = useState(false);
  
  // Filter States
  const [priceRange, setPriceRange] = useState([0, 100000]);
  const [sortBy, setSortBy] = useState('newest');

  const activeCategory = searchParams.get('category') || 'All';
  const searchQuery = searchParams.get('search') || '';

  useEffect(() => {
    fetchProducts();
  }, [searchParams, sortBy]);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const { data } = await api.get('/api/categories');
        setCategories(data);
      } catch (err) {
        console.error('Failed to fetch categories');
      }
    };
    fetchCategories();
  }, []);

  const fetchProducts = async () => {
    setIsLoading(true);
    try {
      let url = '/api/products';
      const params = new URLSearchParams(searchParams);
      if (sortBy) params.append('sort', sortBy);
      
      const { data } = await api.get(`${url}?${params.toString()}`);
      setProducts(data.products);
    } catch (err) {
      toast.error('Failed to load products');
    } finally {
      setIsLoading(false);
    }
  };

  const activeFilters = useMemo(() => {
    const filters = [];
    if (activeCategory !== 'All') filters.push({ type: 'category', value: activeCategory });
    if (searchQuery) filters.push({ type: 'search', value: `"${searchQuery}"` });
    return filters;
  }, [activeCategory, searchQuery]);

  const removeFilter = (filter) => {
    const newParams = new URLSearchParams(searchParams);
    if (filter.type === 'category') newParams.delete('category');
    if (filter.type === 'search') newParams.delete('search');
    setSearchParams(newParams);
  };

  const uniqueCategoryNames = Array.from(new Set(categories.map(c => c.name)));

  return (
    <div className="bg-warm-white min-h-screen">
      <Helmet>
        <title>Shop All Products | {settings?.storeName || 'Zee Cart'}</title>
      </Helmet>

      {/* Page Header */}
      <div className="bg-navy-fixed pt-32 pb-16 px-4 md:px-8 text-white relative overflow-hidden">
        <div className="max-w-[1600px] mx-auto relative z-10">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
            <div>
              <nav className="flex gap-2 text-[10px] uppercase tracking-widest font-black text-white/40 mb-4">
                <a href="/" className="hover:text-terracotta transition-colors">Home</a>
                <span>/</span>
                <span className="text-white">Shop</span>
              </nav>
              <h1 className="text-4xl md:text-6xl font-serif font-black tracking-tight mb-2">
                {activeCategory === 'All' ? 'Our Collections' : activeCategory}
              </h1>
              <p className="text-white/60 text-xs md:text-sm max-w-lg font-medium tracking-wide">
                Quality essentials for every style and occasion.
              </p>
            </div>
            <div className="flex items-center gap-4">
              <div className="flex bg-white/10 p-1 rounded-sm border border-white/10">
                <button 
                  onClick={() => setViewMode('grid')}
                  className={`p-2 transition-premium rounded-sm ${viewMode === 'grid' ? 'bg-white text-navy-fixed shadow-lg' : 'text-white/60 hover:text-white'}`}
                >
                  <LayoutGrid size={16} />
                </button>
                <button 
                  onClick={() => setViewMode('list')}
                  className={`p-2 transition-premium rounded-sm ${viewMode === 'list' ? 'bg-white text-navy-fixed shadow-lg' : 'text-white/60 hover:text-white'}`}
                >
                  <List size={16} />
                </button>
              </div>
            </div>
          </div>
        </div>
        {/* Background Accent */}
        <div className="absolute top-0 right-0 w-1/3 h-full bg-gradient-to-l from-terracotta/20 to-transparent pointer-events-none" />
      </div>

      <div className="max-w-[1600px] mx-auto px-4 md:px-8 py-12">
        <div className="flex flex-col lg:flex-row gap-12">
          
          {/* Desktop Filter Sidebar */}
          <aside className="hidden lg:block w-72 flex-shrink-0">
            <div className="sticky top-24 space-y-10">
              <div>
                <h3 className="text-[10px] uppercase tracking-[0.2em] font-black text-navy mb-6 flex items-center justify-between">
                  Categories <RefreshCcw size={12} className="text-navy/20" />
                </h3>
                <div className="flex flex-col gap-3">
                  <button 
                    onClick={() => setSearchParams({})}
                    className={`text-xs font-bold tracking-wide text-left transition-premium flex items-center justify-between group ${activeCategory === 'All' ? 'text-terracotta' : 'text-navy/60 hover:text-navy'}`}
                  >
                    <span>All Products</span>
                    <span className={`w-1 h-1 rounded-full bg-terracotta transition-opacity ${activeCategory === 'All' ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'}`} />
                  </button>
                  {uniqueCategoryNames.map((cat) => (
                    <button 
                      key={cat}
                      onClick={() => setSearchParams({ category: cat })}
                      className={`text-xs font-bold tracking-wide text-left transition-premium flex items-center justify-between group ${activeCategory === cat ? 'text-terracotta' : 'text-navy/60 hover:text-navy'}`}
                    >
                      <span>{cat}</span>
                      <span className={`w-1 h-1 rounded-full bg-terracotta transition-opacity ${activeCategory === cat ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'}`} />
                    </button>
                  ))}
                </div>
              </div>

              <div className="pt-10 border-t border-border">
                <h3 className="text-[10px] uppercase tracking-[0.2em] font-black text-navy mb-6">Refine By Price</h3>
                <div className="space-y-4">
                  <input 
                    type="range" 
                    min="0" 
                    max="100000" 
                    step="1000"
                    className="w-full h-1 bg-border rounded-lg appearance-none cursor-pointer accent-navy"
                  />
                  <div className="flex justify-between text-[10px] font-black text-navy/40">
                    <span>₹0</span>
                    <span>₹1,00,000</span>
                  </div>
                </div>
              </div>
            </div>
          </aside>

          {/* Main Content Area */}
          <main className="flex-1">
            {/* Toolbar */}
            <div className="flex flex-wrap items-center justify-between gap-4 mb-8 pb-8 border-b border-border">
              <div className="flex items-center gap-4">
                <button 
                  onClick={() => setIsFilterOpen(true)}
                  className="lg:hidden flex items-center gap-2 px-4 py-2 border border-border text-[10px] font-black uppercase tracking-widest text-navy hover:border-navy transition-premium"
                >
                  <Filter size={14} /> Filters
                </button>
                <div className="flex items-center gap-2 text-xs font-bold text-navy/40 uppercase tracking-widest">
                  Showing <span className="text-navy">{products.length}</span> results
                </div>
              </div>

              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2">
                  <ArrowUpDown size={14} className="text-navy/40" />
                  <select 
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                    className="bg-transparent text-[10px] font-black uppercase tracking-widest text-navy focus:outline-none cursor-pointer"
                  >
                    <option value="newest">Newest First</option>
                    <option value="price-asc">Price: Low to High</option>
                    <option value="price-desc">Price: High to Low</option>
                    <option value="popular">Popularity</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Active Filter Chips */}
            <AnimatePresence>
              {activeFilters.length > 0 && (
                <motion.div 
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  className="flex flex-wrap gap-2 mb-8 overflow-hidden"
                >
                  {activeFilters.map((filter, index) => (
                    <button 
                      key={index}
                      onClick={() => removeFilter(filter)}
                      className="group flex items-center gap-2 px-3 py-1.5 bg-navy-fixed text-white text-[10px] font-black uppercase tracking-widest hover:bg-terracotta transition-premium shadow-md"
                    >
                      <span>{filter.type}: {filter.value}</span>
                      <X size={10} className="group-hover:rotate-90 transition-transform" />
                    </button>
                  ))}
                  <button 
                    onClick={() => setSearchParams({})}
                    className="text-[10px] font-black uppercase tracking-widest text-navy/40 hover:text-terracotta transition-colors ml-2"
                  >
                    Clear All
                  </button>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Product Grid */}
            {isLoading ? (
              <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-x-8 gap-y-12">
                {[1, 2, 3, 4, 5, 6, 7, 8].map((n) => (
                  <ProductCard key={n} isLoading={true} />
                ))}
              </div>
            ) : products.length > 0 ? (
              <div className={`grid ${viewMode === 'grid' ? 'grid-cols-2 md:grid-cols-2 xl:grid-cols-3' : 'grid-cols-1'} gap-x-8 gap-y-12`}>
                {products.map((product) => (
                  <ProductCard 
                    key={product._id} 
                    product={product} 
                    onQuickView={(p) => { setSelectedProduct(p); setIsQuickViewOpen(true); }}
                  />
                ))}
              </div>
            ) : (
              <div className="py-24 text-center">
                <Search size={48} className="mx-auto text-navy/10 mb-4" />
                <h2 className="text-2xl font-serif font-black text-navy mb-2">No results found</h2>
                <p className="text-navy/40 text-sm mb-8">Try adjusting your filters or searching for something else.</p>
                <button onClick={() => setSearchParams({})} className="btn-premium">Clear all filters</button>
              </div>
            )}
          </main>
        </div>
      </div>

      {/* Quick View Modal */}
      <QuickViewModal 
        isOpen={isQuickViewOpen} 
        product={selectedProduct} 
        onClose={() => setIsQuickViewOpen(false)} 
      />

      {/* Mobile Filter Drawer Placeholder */}
      <AnimatePresence>
        {isFilterOpen && (
          <div className="fixed inset-0 z-[2000] lg:hidden">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsFilterOpen(false)}
              className="absolute inset-0 bg-navy-fixed/60 backdrop-blur-sm"
            />
            <motion.div 
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              className="absolute top-0 left-0 bottom-0 w-80 bg-warm-white p-8 overflow-y-auto shadow-2xl"
            >
              <div className="flex justify-between items-center mb-10">
                <h2 className="text-sm font-black uppercase tracking-widest text-navy">Filters</h2>
                <button onClick={() => setIsFilterOpen(false)}><X size={20} /></button>
              </div>
              {/* Filter Content Re-use */}
              <div className="space-y-10">
                {/* Same category/price logic as desktop */}
                <div>
                  <h3 className="text-[10px] uppercase tracking-[0.2em] font-black text-navy mb-6">Categories</h3>
                  <div className="flex flex-wrap gap-2">
                    {['All', ...uniqueCategoryNames].map((cat) => (
                      <button 
                        key={cat}
                        onClick={() => { setSearchParams(cat === 'All' ? {} : { category: cat }); setIsFilterOpen(false); }}
                        className={`px-4 py-2 border text-[10px] font-black uppercase tracking-widest transition-premium ${activeCategory === cat ? 'bg-navy-fixed text-white border-navy-fixed' : 'border-border text-navy/60 hover:border-navy'}`}
                      >
                        {cat}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Products;
