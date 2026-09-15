"use client";

import { useQuery } from "@tanstack/react-query";
import { publicAreaService } from "@/services/public-area.service";

/**
 * Hook to fetch public areas list
 * Corresponds to USER API spec 3.1: GET /areas
 * @param {Object} params - { parent_id }
 */
export function usePublicAreas(params = {}) {
  return useQuery({
    queryKey: ["public-areas", params],
    queryFn: async () => {
      const response = await publicAreaService.getAreas(params);
      // response unwrap from lib/axios gives { success, message, data: { areas: [...] } }
      return response?.data?.areas || response?.areas || response?.data || [];
    },
    staleTime: 1000 * 60 * 15, // 15 minutes
  });
}

/**
 * Hook to fetch a single area by ID
 * Corresponds to USER API spec 3.2: GET /areas/{id}
 * @param {string|number} id
 */
export function usePublicArea(id) {
  return useQuery({
    queryKey: ["public-area", id],
    queryFn: async () => {
      if (!id) return null;
      const response = await publicAreaService.getAreaById(id);
      // response unwrap gives { success, message, data: { area: {...} } }
      return response?.data?.area || response?.area || response?.data;
    },
    enabled: !!id,
    staleTime: 1000 * 60 * 15, // 15 minutes
  });
}
