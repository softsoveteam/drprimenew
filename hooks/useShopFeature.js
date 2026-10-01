"use client";

import { useEffect } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { featureService } from "@/services/feature.service";
import { SHOP_DISABLED_EVENT } from "@/lib/shop-paths";

export const FEATURES_QUERY_KEY = ["features"];
export const ADMIN_FEATURES_QUERY_KEY = ["admin-features"];

function readEnabled(payload) {
  return payload?.shop_enabled === true || payload?.data?.shop_enabled === true;
}

export function useShopFeature() {
  const queryClient = useQueryClient();

  const query = useQuery({
    queryKey: FEATURES_QUERY_KEY,
    queryFn: async () => {
      const response = await featureService.getFeatures();
      return response?.data || { shop_enabled: false };
    },
    staleTime: 30_000,
    retry: false,
  });

  useEffect(() => {
    const turnOff = () => {
      queryClient.setQueryData(FEATURES_QUERY_KEY, { shop_enabled: false });
      queryClient.setQueryData(ADMIN_FEATURES_QUERY_KEY, { shop_enabled: false });
    };
    window.addEventListener(SHOP_DISABLED_EVENT, turnOff);
    return () => window.removeEventListener(SHOP_DISABLED_EVENT, turnOff);
  }, [queryClient]);

  return {
    shopEnabled: readEnabled(query.data),
    isLoading: query.isLoading,
    isFetched: query.isFetched,
  };
}
