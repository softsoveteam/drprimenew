"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { userAuthService } from "@/services/user-auth.service";
import { useUserStore } from "@/lib/store/useUserStore";
import {
  mergeGuestCart,
  getStoredGuestToken,
  clearStoredGuestToken,
} from "@/services/cart.service";
import toast from "react-hot-toast";

async function mergeGuestCartAfterAuth(queryClient) {
  const guestToken = getStoredGuestToken();
  if (!guestToken) return;

  try {
    await mergeGuestCart(guestToken);
  } catch (err) {
    console.warn("Guest cart merge failed:", err);
    // Still drop guest token so we don't keep a stale cart identity
    clearStoredGuestToken();
  }

  queryClient.invalidateQueries({ queryKey: ["cart"] });
}

/**
 * Hook to register a new user
 * @param {{ redirectTo?: string }} [options]
 */
export function useUserRegister(options = {}) {
  const router = useRouter();
  const queryClient = useQueryClient();
  const { setAuth } = useUserStore();

  return useMutation({
    mutationFn: async (payload) => {
      return await userAuthService.register(payload);
    },
    onSuccess: async (res) => {
      const userData = res?.data?.user || res?.user;
      const token = res?.data?.token || res?.token;
      if (userData && token) {
        setAuth(userData, token);
        queryClient.invalidateQueries({ queryKey: ["user", "me"] });
        await mergeGuestCartAfterAuth(queryClient);
      }
      toast.success(res?.message || "Registration successful!");
      const redirect =
        options.redirectTo && options.redirectTo.startsWith("/")
          ? options.redirectTo
          : "/profile";
      router.push(redirect);
    },
    onError: (err) => {
      toast.error(err?.message || "Registration failed. Please try again.");
    },
  });
}

/**
 * Hook to log in an existing user
 * @param {{ redirectTo?: string }} [options]
 */
export function useUserLogin(options = {}) {
  const router = useRouter();
  const queryClient = useQueryClient();
  const { setAuth } = useUserStore();

  return useMutation({
    mutationFn: async (credentials) => {
      return await userAuthService.login(credentials);
    },
    onSuccess: async (res) => {
      const userData = res?.data?.user || res?.user;
      const token = res?.data?.token || res?.token;
      if (userData && token) {
        setAuth(userData, token);
        queryClient.invalidateQueries({ queryKey: ["user", "me"] });
        await mergeGuestCartAfterAuth(queryClient);
      }
      toast.success(res?.message || "Logged in successfully!");
      const redirect =
        options.redirectTo && options.redirectTo.startsWith("/")
          ? options.redirectTo
          : "/profile";
      router.push(redirect);
    },
    onError: (err) => {
      toast.error(err?.message || "Login failed. Please check your credentials.");
    },
  });
}

/**
 * Hook to fetch the currently authenticated user profile
 */
export function useUserProfile() {
  const { setUser, token } = useUserStore();

  return useQuery({
    queryKey: ["user", "me"],
    queryFn: async () => {
      const response = await userAuthService.getProfile();
      const userData = response?.data?.user || response?.user || response?.data;
      if (userData) {
        setUser(userData);
      }
      return userData;
    },
    enabled: !!token || (typeof window !== "undefined" && !!localStorage.getItem("user_token")),
    staleTime: 1000 * 60 * 15,
    gcTime: 1000 * 60 * 30,
    refetchOnWindowFocus: false,
    refetchOnMount: false,
    retry: 1,
  });
}

/**
 * Hook to perform user logout
 */
export function useUserLogout() {
  const router = useRouter();
  const queryClient = useQueryClient();
  const { logout } = useUserStore();

  return useMutation({
    mutationFn: async () => {
      try {
        return await userAuthService.logout();
      } catch (err) {
        console.warn("Server logout request failed or timed out:", err);
        return null;
      }
    },
    onSettled: () => {
      logout();
      queryClient.removeQueries({ queryKey: ["user"] });
      queryClient.removeQueries({ queryKey: ["cart"] });
      toast.success("Logged out successfully");
      router.push("/login");
    },
  });
}
