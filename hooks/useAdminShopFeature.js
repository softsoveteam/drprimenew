"use client";

import { useEffect } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { featureService } from "@/services/feature.service";
import { SHOP_DISABLED_EVENT } from "@/lib/shop-paths";
import { ADMIN_FEATURES_QUERY_KEY, FEATURES_QUERY_KEY } from "@/hooks/useShopFeature";

function readEnabled(payload) {
  return payload?.shop_enabled === true || payload?.data?.shop_enabled === true;
}

export function useAdminShopFeature(enabled = true) {
  const queryClient = useQueryClient();

  const query = useQuery({
    queryKey: ADMIN_FEATURES_QUERY_KEY,
    queryFn: async () => {
      const response = await featureService.getAdminFeatures();
      return response?.data || { shop_enabled: false };
    },
    enabled,
    staleTime: 0,
  });

  useEffect(() => {
    const turnOff = () => {
      queryClient.setQueryData(FEATURES_QUERY_KEY, { shop_enabled: false });
      queryClient.setQueryData(ADMIN_FEATURES_QUERY_KEY, { shop_enabled: false });
    };
    window.addEventListener(SHOP_DISABLED_EVENT, turnOff);
    return () => window.removeEventListener(SHOP_DISABLED_EVENT, turnOff);
  }, [queryClient]);

  const mutation = useMutation({
    mutationFn: (shop_enabled) => featureService.updateShopFeature(shop_enabled),
    onSuccess: (body) => {
      const shopEnabled = body?.data?.shop_enabled === true;
      const next = { shop_enabled: shopEnabled };
      queryClient.setQueryData(ADMIN_FEATURES_QUERY_KEY, next);
      queryClient.setQueryData(FEATURES_QUERY_KEY, next);
      toast.success(body?.message || (shopEnabled ? "Shop turned on." : "Shop turned off."));
    },
    onError: (error) => {
      toast.error(error?.message || "Could not update the shop setting");
    },
  });

  return {
    shopEnabled: readEnabled(query.data),
    isLoading: enabled && query.isLoading,
    isFetched: !enabled || query.isFetched,
    isError: query.isError,
    refetch: query.refetch,
    isUpdating: mutation.isPending,
    setShopEnabled: (value) => mutation.mutate(Boolean(value)),
  };
}
