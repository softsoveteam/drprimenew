"use client";

import { useEffect, useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useUserStore } from "@/lib/store/useUserStore";
import {
  getCart,
  addToCart,
  updateCartItem,
  removeCartItem,
  clearCart,
  ensureGuestToken,
  getStoredGuestToken,
} from "@/services/cart.service";
import toast from "react-hot-toast";

const CART_READY_EVENT = "dp-cart-ready";

function readHasUserToken() {
  if (typeof window === "undefined") return false;
  return !!(
    localStorage.getItem("user_token") ||
    localStorage.getItem("token") ||
    localStorage.getItem("auth_token")
  );
}

function readHasGuestToken() {
  if (typeof window === "undefined") return false;
  return !!localStorage.getItem("guest_token");
}

function notifyCartReady() {
  if (typeof window !== "undefined") {
    window.dispatchEvent(new Event(CART_READY_EVENT));
  }
}

export function useCart(options = {}) {
  const { token, isAuthenticated } = useUserStore();
  const [, setEpoch] = useState(0);

  useEffect(() => {
    const bump = () => setEpoch((n) => n + 1);
    window.addEventListener(CART_READY_EVENT, bump);
    return () => window.removeEventListener(CART_READY_EVENT, bump);
  }, []);

  const loggedIn = !!token || isAuthenticated || readHasUserToken();
  const canFetch = loggedIn || readHasGuestToken();

  return useQuery({
    queryKey: ["cart", loggedIn ? "user" : "guest"],
    queryFn: async () => getCart(),
    enabled: options.enabled !== false && canFetch,
    staleTime: 30_000,
    retry: (failureCount, error) => {
      if (error?.message?.toLowerCase().includes("unauthor")) return false;
      return failureCount < 1;
    },
  });
}

export function useAddToCart() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ product_id, quantity = 1 }) => {
      if (!readHasUserToken()) {
        await ensureGuestToken();
        notifyCartReady();
      }
      return addToCart({ product_id, quantity });
    },
    onSuccess: () => {
      notifyCartReady();
      queryClient.invalidateQueries({ queryKey: ["cart"] });
      toast.success("Added to cart");
    },
    onError: (error) => {
      toast.error(error?.message || "Could not add to cart");
    },
  });
}

export function useUpdateCartItem() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, quantity }) => updateCartItem(id, { quantity }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["cart"] });
    },
    onError: (error) => {
      toast.error(error?.message || "Could not update quantity");
    },
  });
}

export function useRemoveCartItem() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id) => removeCartItem(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["cart"] });
      toast.success("Item removed");
    },
    onError: (error) => {
      toast.error(error?.message || "Could not remove item");
    },
  });
}

export function useClearCart() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: () => clearCart(),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["cart"] });
      toast.success("Cart cleared");
    },
    onError: (error) => {
      toast.error(error?.message || "Could not clear cart");
    },
  });
}

export { getStoredGuestToken };
