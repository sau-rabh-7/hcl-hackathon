import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export const useAuthStore = create(
  persist(
    (set) => ({
      user: null,
      token: null,
      isAuthenticated: false,
      isAdmin: false,
      login: (userData, token) => {
        set({
          user: userData,
          token: token,
          isAuthenticated: true,
          isAdmin: userData?.role === 'Admin',
        });
      },
      logout: () => {
        set({
          user: null,
          token: null,
          isAuthenticated: false,
          isAdmin: false,
        });
        // Also clear cart on logout
        localStorage.removeItem('cart-storage');
      },
    }),
    {
      name: 'auth-storage',
    }
  )
);
