import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export const useAuthStore = create()(
  persist(
    (set) => ({
      isLoggedIn: false,
      adminToken: null,
      login: (token) => {
        set({ isLoggedIn: true, adminToken: token });
      },
      logout: () => {
        set({ isLoggedIn: false, adminToken: null });
      },
    }),
    {
      name: 'zeecart-auth-storage',
    }
  )
);
