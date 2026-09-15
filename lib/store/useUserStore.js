import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

export const useUserStore = create(
  persist(
    (set) => ({
      // User auth state
      user: null,
      token: null,
      isAuthenticated: false,

      // Actions
      setAuth: (user, token) => {
        if (typeof window !== "undefined" && token) {
          localStorage.setItem("user_token", token);
        }
        set({ user, token, isAuthenticated: !!token });
      },

      setUser: (user) => {
        set({ user });
      },

      logout: () => {
        if (typeof window !== "undefined") {
          localStorage.removeItem("user_token");
        }
        set({ user: null, token: null, isAuthenticated: false });
      },
    }),
    {
      name: "user-storage",
      storage: createJSONStorage(() => (typeof window !== "undefined" ? localStorage : undefined)),
      partialize: (state) => ({
        user: state.user,
        token: state.token,
        isAuthenticated: state.isAuthenticated,
      }),
    }
  )
);
