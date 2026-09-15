import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

export const useAdminStore = create(
  persist(
    (set) => ({
      // Auth state
      admin: null,
      token: null,
      isAuthenticated: false,

      // Auth actions
      setAuth: (admin, token) => {
        if (typeof window !== "undefined" && token) {
          localStorage.setItem("admin_token", token);
        }
        set({ admin, token, isAuthenticated: !!token });
      },

      setAdmin: (admin) => {
        set({ admin });
      },

      logout: () => {
        if (typeof window !== "undefined") {
          localStorage.removeItem("admin_token");
        }
        set({ admin: null, token: null, isAuthenticated: false });
      },

      // Admin UI State
      isSidebarOpen: true,
      toggleSidebar: () => set((state) => ({ isSidebarOpen: !state.isSidebarOpen })),
      setSidebarOpen: (isOpen) => set({ isSidebarOpen: isOpen }),

      // Admin Common DataTable State Management
      tableState: {
        page: 1,
        pageSize: 10,
        searchQuery: "",
        selectedRows: [],
        filters: {},
        sorting: [],
      },
      setTableState: (updater) =>
        set((state) => ({
          tableState:
            typeof updater === "function" ? updater(state.tableState) : { ...state.tableState, ...updater },
        })),
      resetTableState: () =>
        set({
          tableState: {
            page: 1,
            pageSize: 10,
            searchQuery: "",
            selectedRows: [],
            filters: {},
            sorting: [],
          },
        }),
    }),
    {
      name: "admin-storage",
      storage: createJSONStorage(() => (typeof window !== "undefined" ? localStorage : undefined)),
      partialize: (state) => ({
        admin: state.admin,
        token: state.token,
        isAuthenticated: state.isAuthenticated,
        isSidebarOpen: state.isSidebarOpen,
      }),
    }
  )
);
