import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, Mic, X, TrendingUp, History, ArrowRight } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useSearchStore } from '../store/useSearchStore';
import { useDebounce } from '../hooks/useDebounce';
import { getImageUrl } from '../utils/imageUtils';
import api from '../api';

const SearchBar = () => {
  const [query, setQuery] = useState('');
  const [isFocused, setIsFocused] = useState(false);
  const [suggestions, setSuggestions] = useState([]);
  const [trending, setTrending] = useState(['Luxury Watches', 'Silk Dresses', 'Summer Collection']);
  const [isLoading, setIsLoading] = useState(false);
  
  const debouncedQuery = useDebounce(query, 300);
  const navigate = useNavigate();
  const containerRef = useRef(null);
  const { recentSearches, addRecentSearch, clearRecentSearches } = useSearchStore();

  useEffect(() => {
    const fetchSuggestions = async () => {
      if (debouncedQuery.length < 2) {
        setSuggestions([]);
        return;
      }
      setIsLoading(true);
      try {
        const { data } = await api.get(`/api/products?search=${debouncedQuery}`);
        setSuggestions(data.products.slice(0, 6));
      } catch (err) {
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchSuggestions();
  }, [debouncedQuery]);

  const handleSearch = (e) => {
    e.preventDefault();
    if (query.trim()) {
      addRecentSearch(query.trim());
      navigate(`/products?search=${query.trim()}`);
      setIsFocused(false);
    }
  };

  const [isListening, setIsListening] = useState(false);

  const handleVoiceSearch = () => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (SpeechRecognition) {
      const recognition = new SpeechRecognition();
      recognition.onstart = () => {
        setIsFocused(true);
        setIsListening(true);
      };
      recognition.onresult = (event) => {
        let transcript = event.results[0][0].transcript;
        transcript = transcript.replace(/[.,?!]$/, '').trim();
        setQuery(transcript);
        addRecentSearch(transcript);
        navigate(`/products?search=${encodeURIComponent(transcript)}`);
        setIsFocused(false);
      };
      recognition.onend = () => setIsListening(false);
      recognition.start();
    } else {
      toast.error('Voice search is not supported in this browser.');
    }
  };

  // Click outside to close
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (containerRef.current && !containerRef.current.contains(e.target)) {
        setIsFocused(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div ref={containerRef} className="relative w-full max-w-2xl">
      <form onSubmit={handleSearch} className="relative group">
        <div className={`flex items-center bg-card-bg border transition-premium ${isFocused ? 'border-navy ring-1 ring-navy/5 shadow-lg' : 'border-border'}`}>
          <Search className="ml-4 text-navy/40" size={18} />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onFocus={() => setIsFocused(true)}
            placeholder="Search for items, brands and more..."
            className="w-full px-4 py-3 bg-transparent text-sm text-navy placeholder:text-navy/30 focus:outline-none"
          />
          <AnimatePresence>
            {query && (
              <motion.button
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                type="button"
                onClick={() => setQuery('')}
                className="p-2 text-navy/40 hover:text-navy"
              >
                <X size={16} />
              </motion.button>
            )}
          </AnimatePresence>
          <button
            type="button"
            onClick={handleVoiceSearch}
            className={`p-3 border-l border-border transition-colors ${isListening ? 'text-terracotta animate-pulse' : 'text-navy/60 hover:text-terracotta'}`}
          >
            <Mic size={18} />
          </button>
        </div>
      </form>

      <AnimatePresence>
        {isFocused && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            className="absolute top-full left-0 right-0 mt-2 bg-card-bg border border-border shadow-2xl z-50 overflow-hidden rounded-sm"
          >
            {/* Empty State: Recent & Trending */}
            {!query && (
              <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-8">
                {recentSearches.length > 0 && (
                  <div>
                    <div className="flex justify-between items-center mb-4">
                      <h3 className="text-[10px] uppercase tracking-widest font-bold text-navy flex items-center gap-2">
                        <History size={12} /> Recent Searches
                      </h3>
                      <button onClick={clearRecentSearches} className="text-[10px] text-navy/40 hover:text-terracotta">Clear All</button>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {recentSearches.map((item, index) => (
                        <button
                          key={index}
                          onClick={() => { setQuery(item); navigate(`/products?search=${item}`); setIsFocused(false); }}
                          className="px-3 py-1.5 bg-warm-white text-xs text-navy hover:bg-navy-fixed hover:text-white transition-premium rounded-full"
                        >
                          {item}
                        </button>
                      ))}
                    </div>
                  </div>
                )}
                <div>
                  <h3 className="text-[10px] uppercase tracking-widest font-bold text-navy flex items-center gap-2 mb-4">
                    <TrendingUp size={12} /> Trending Now
                  </h3>
                  <div className="space-y-3">
                    {trending.map((item, index) => (
                      <button
                        key={index}
                        onClick={() => { setQuery(item); navigate(`/products?search=${item}`); setIsFocused(false); }}
                        className="flex items-center gap-3 text-xs text-navy/60 hover:text-navy transition-premium w-full group"
                      >
                        <ArrowRight size={10} className="group-hover:translate-x-1 transition-transform" />
                        {item}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* Suggestions State */}
            {query && (
              <div className="py-2">
                {isLoading ? (
                  <div className="p-4 space-y-3">
                    {[1, 2, 3].map((i) => (
                      <div key={i} className="flex gap-3 animate-pulse">
                        <div className="w-12 h-12 bg-gray-100" />
                        <div className="flex-1 space-y-2 py-1">
                          <div className="h-3 bg-gray-100 w-3/4" />
                          <div className="h-3 bg-gray-100 w-1/4" />
                        </div>
                      </div>
                    ))}
                  </div>
                ) : suggestions.length > 0 ? (
                  <>
                    {suggestions.map((item) => (
                      <button
                        key={item._id}
                        onClick={() => { navigate(`/products/${item._id}`); setIsFocused(false); }}
                        className="w-full flex items-center gap-4 px-4 py-3 hover:bg-warm-white transition-premium group text-left"
                      >
                        <div className="w-12 h-12 flex-shrink-0 bg-card-bg overflow-hidden">
                          <img src={getImageUrl(item.images?.[0]?.url)} alt="" className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <h4 className="text-sm text-navy font-bold truncate">
                            {item.name.split(new RegExp(`(${query})`, 'gi')).map((part, i) => 
                              part.toLowerCase() === query.toLowerCase() ? <span key={i} className="bg-terracotta/10 text-terracotta">{part}</span> : part
                            )}
                          </h4>
                          <p className="text-xs text-navy/40">₹{item.price.toLocaleString()}</p>
                        </div>
                      </button>
                    ))}
                    <button
                      onClick={handleSearch}
                      className="w-full p-4 border-t border-border text-xs font-bold text-navy hover:text-terracotta transition-premium flex items-center justify-center gap-2"
                    >
                      See all results for "{query}" <ArrowRight size={14} />
                    </button>
                  </>
                ) : (
                  <div className="p-8 text-center text-navy/40 text-xs italic">
                    No results found for "{query}"
                  </div>
                )}
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default SearchBar;
