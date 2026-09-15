"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { userAuthService } from "@/services/user-auth.service";
import { useUserStore } from "@/lib/store/useUserStore";
import toast from "react-hot-toast";

/**
 * Hook to register a new user
 * Corresponds to API spec 1.1: POST /user/register
 */
export function useUserRegister() {
  const router = useRouter();
  const queryClient = useQueryClient();
  const { setAuth } = useUserStore();

  return useMutation({
    mutationFn: async (payload) => {
      return await userAuthService.register(payload);
    },
    onSuccess: (res) => {
      const userData = res?.data?.user || res?.user;
      const token = res?.data?.token || res?.token;
      if (userData && token) {
        setAuth(userData, token);
        queryClient.invalidateQueries({ queryKey: ["user", "me"] });
      }
      toast.success(res?.message || "Registration successful!");
      router.push("/profile");
    },
    onError: (err) => {
      toast.error(err?.message || "Registration failed. Please try again.");
    },
  });
}

/**
 * Hook to log in an existing user
 * Corresponds to API spec 1.2: POST /user/login
 */
export function useUserLogin() {
  const router = useRouter();
  const queryClient = useQueryClient();
  const { setAuth } = useUserStore();

  return useMutation({
    mutationFn: async (credentials) => {
      return await userAuthService.login(credentials);
    },
    onSuccess: (res) => {
      const userData = res?.data?.user || res?.user;
      const token = res?.data?.token || res?.token;
      if (userData && token) {
        setAuth(userData, token);
        queryClient.invalidateQueries({ queryKey: ["user", "me"] });
      }
      toast.success(res?.message || "Logged in successfully!");
      router.push("/profile");
    },
    onError: (err) => {
      toast.error(err?.message || "Login failed. Please check your credentials.");
    },
  });
}

/**
 * Hook to fetch the currently authenticated user profile
 * Corresponds to API spec 1.3: GET /user/me
 */
export function useUserProfile() {
  const { setUser, token, isAuthenticated } = useUserStore();

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
    staleTime: 1000 * 60 * 15, // 15 minutes
    gcTime: 1000 * 60 * 30, // 30 minutes
    refetchOnWindowFocus: false,
    refetchOnMount: false,
    retry: 1,
  });
}

/**
 * Hook to perform user logout
 * Corresponds to API spec 1.4: POST /user/logout
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
      toast.success("Logged out successfully");
      router.push("/login");
    },
  });
}
