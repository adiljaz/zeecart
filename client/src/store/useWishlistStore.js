import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export const useWishlistStore = create()(
  persist(
    (set, get) => ({
      items: [],
      
      toggleWishlist: (product) => set((state) => {
        const exists = state.items.find((item) => item._id === product._id);
        if (exists) {
          return { items: state.items.filter((item) => item._id !== product._id) };
        }
        return { items: [...state.items, product] };
      }),
      
      isInWishlist: (id) => get().items.some((item) => item._id === id),
      clearWishlist: () => set({ items: [] }),
      syncWishlist: (validIds) => set((state) => ({
        items: state.items.filter(item => validIds.includes(item._id))
      })),
    }),
    {
      name: 'zeecart-wishlist-storage',
    }
  )
);
