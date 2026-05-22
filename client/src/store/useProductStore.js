import { create } from 'zustand';

export const useProductStore = create((set) => ({
  products: [],
  filteredProducts: [],
  selectedFilters: {
    category: '',
    subcategory: '',
    gender: '',
    minPrice: 0,
    maxPrice: 100000,
    sort: 'newest',
  },
  setProducts: (products) => set({ products, filteredProducts: products }),
  setFilteredProducts: (products) => set({ filteredProducts: products }),
  setSelectedFilters: (filters) => set((state) => ({
    selectedFilters: { ...state.selectedFilters, ...filters },
  })),
}));
