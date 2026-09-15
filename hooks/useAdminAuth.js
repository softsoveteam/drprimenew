"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import api from "@/lib/axios";
import { useAdminStore } from "@/lib/store/useAdminStore";

/**
 * Hook to fetch the currently authenticated admin profile
 * Corresponds to API specification 1.2: GET /admin/me
 */
export function useAdminProfile() {
  const { setAdmin, token, isAuthenticated } = useAdminStore();

  return useQuery({
    queryKey: ["admin", "me"],
    queryFn: async () => {
      const response = await api.get("/admin/me");
      const userData = response?.data?.user || response?.user || response?.data;
      if (userData) {
        setAdmin(userData);
      }
      return userData;
    },
    enabled: !!token || (typeof window !== "undefined" && !!localStorage.getItem("admin_token")),
    staleTime: 1000 * 60 * 15, // 15 minutes
    gcTime: 1000 * 60 * 30, // 30 minutes
    refetchOnWindowFocus: false,
    refetchOnMount: false,
    retry: 1,
  });
}

/**
 * Hook to perform admin logout
 * Corresponds to API specification 1.3: POST /admin/logout
 */
export function useAdminLogout() {
  const router = useRouter();
  const queryClient = useQueryClient();
  const { logout } = useAdminStore();

  return useMutation({
    mutationFn: async () => {
      try {
        return await api.post("/admin/logout");
      } catch (err) {
        console.warn("Server-side admin logout notification failed or timed out:", err);
        return null;
      }
    },
    onSettled: () => {
      // Clear Zustand admin state and localStorage
      logout();
      // Invalidate all cached admin queries
      queryClient.removeQueries({ queryKey: ["admin"] });
      // Redirect to admin login screen
      router.replace("/auth-cp/login");
    },
  });
}
