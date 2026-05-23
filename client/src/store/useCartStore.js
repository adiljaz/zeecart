import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export const useCartStore = create()(
  persist(
    (set, get) => ({
      items: [],
      isDrawerOpen: false,
      savedItems: [],
      
      toggleDrawer: () => set({ isDrawerOpen: !get().isDrawerOpen }),
      setDrawerOpen: (open) => set({ isDrawerOpen: open }),
      
      addItem: (product, quantity = 1, size = '') => set((state) => {
        const existingItem = state.items.find(
          (item) => item._id === product._id && item.selectedSize === size
        );
        
        if (existingItem) {
          return {
            items: state.items.map((item) =>
              item === existingItem 
                ? { ...item, quantity: item.quantity + quantity }
                : item
            ),
          };
        }
        
        return { items: [...state.items, { ...product, quantity, selectedSize: size }] };
      }),
      
      removeItem: (id, size) => set((state) => ({
        items: state.items.filter((item) => {
          if (size !== undefined) {
            return !(item._id === id && item.selectedSize === size);
          }
          return item._id !== id;
        })
      })),
      
      updateQuantity: (id, size, quantity) => set((state) => ({
        items: state.items.map((item) =>
          (item._id === id && item.selectedSize === size) 
            ? { ...item, quantity: Math.max(1, quantity) }
            : item
        )
      })),
      
      saveForLater: (id, size) => set((state) => {
        const itemToSave = state.items.find((item) => item._id === id && item.selectedSize === size);
        return {
          items: state.items.filter((item) => !(item._id === id && item.selectedSize === size)),
          savedItems: [...state.savedItems, itemToSave]
        };
      }),
      
      moveToCart: (id, size) => set((state) => {
        const itemToMove = state.savedItems.find((item) => item._id === id && item.selectedSize === size);
        return {
          savedItems: state.savedItems.filter((item) => !(item._id === id && item.selectedSize === size)),
          items: [...state.items, itemToMove]
        };
      }),

      syncCart: (validIds) => set((state) => ({
        items: state.items.filter(item => validIds.includes(item._id)),
        savedItems: state.savedItems.filter(item => validIds.includes(item._id))
      })),

      getTotal: () => get().items.reduce((sum, item) => sum + (item.price * item.quantity), 0),
      getItemCount: () => get().items.reduce((sum, item) => sum + item.quantity, 0),
      isInCart: (id, size) => get().items.some(item => {
        if (size !== undefined) {
          return item._id === id && item.selectedSize === size;
        }
        return item._id === id;
      }),
    }),
    {
      name: 'zeecart-cart-storage',
    }
  )
);
