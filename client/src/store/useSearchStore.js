import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export const useSearchStore = create()(
  persist(
    (set) => ({
      recentSearches: [],
      addRecentSearch: (query) => 
        set((state) => {
          const filtered = state.recentSearches.filter((s) => s !== query);
          return { recentSearches: [query, ...filtered].slice(0, 5) };
        }),
      clearRecentSearches: () => set({ recentSearches: [] }),
    }),
    {
      name: 'zeecart-search-storage',
    }
  )
);
