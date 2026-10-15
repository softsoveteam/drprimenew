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
      const next = { ...query.data, shop_enabled: shopEnabled };
      queryClient.setQueryData(ADMIN_FEATURES_QUERY_KEY, next);
      queryClient.setQueryData(FEATURES_QUERY_KEY, { shop_enabled: shopEnabled });
      toast.success(body?.message || (shopEnabled ? "Shop turned on." : "Shop turned off."));
    },
    onError: (error) => {
      toast.error(error?.message || "Could not update the shop setting");
    },
  });

  const syncMutation = useMutation({
    mutationFn: () => featureService.syncAmazonCatalog(),
    onSuccess: (body) => {
      queryClient.invalidateQueries({ queryKey: ADMIN_FEATURES_QUERY_KEY });
      queryClient.invalidateQueries({ queryKey: ["admin-products"] });
      queryClient.invalidateQueries({ queryKey: ["products"] });
      const count = body?.data?.count ?? 0;
      toast.success(body?.message || `Successfully synced ${count} product(s) from Amazon.`);
    },
    onError: (error) => {
      toast.error(error?.response?.data?.message || error?.message || "Failed to sync from Amazon");
    },
  });

  return {
    shopEnabled: readEnabled(query.data),
    lastSyncedAt: query.data?.last_synced_at,
    totalProducts: query.data?.total_products ?? 0,
    totalStock: query.data?.total_stock ?? 0,
    isLoading: enabled && query.isLoading,
    isFetched: !enabled || query.isFetched,
    isError: query.isError,
    refetch: query.refetch,
    isUpdating: mutation.isPending,
    setShopEnabled: (value) => mutation.mutate(Boolean(value)),
    isSyncingAmazon: syncMutation.isPending,
    syncAmazon: () => syncMutation.mutate(),
  };
}
