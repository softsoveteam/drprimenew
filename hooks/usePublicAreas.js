"use client";

import { useQuery } from "@tanstack/react-query";
import { publicAreaService } from "@/services/public-area.service";

/**
 * Utility to convert an area name to a URL slug
 * e.g. "Madrid" -> "madrid", "Sol" -> "sol"
 */
export function slugifyAreaName(name = "") {
  return name
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, "")
    .replace(/[\s_-]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

/**
 * Utility to extract clean area identifier from slug
 * e.g. "primeheal-in-madrid" -> "madrid", "madrid" -> "madrid"
 */
export function parseAreaSlug(rawSlug = "") {
  if (!rawSlug) return "";
  let clean = decodeURIComponent(rawSlug).toLowerCase().trim();
  clean = clean.replace(/^(primeheal-in-|doctor-prime-in-|drprime-in-|pillow-in-)/, "");
  return clean;
}

/**
 * Hook to fetch public areas list
 * Corresponds to USER API spec 3.1: GET /areas
 * @param {Object} params - { parent_id }
 */
export function usePublicAreas(params = {}, options = {}) {
  return useQuery({
    queryKey: ["public-areas", params],
    queryFn: async () => {
      const response = await publicAreaService.getAreas(params);
      return response?.data?.areas || response?.areas || response?.data || [];
    },
    staleTime: 1000 * 60 * 15, // 15 minutes
    ...options,
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
      return response?.data?.area || response?.area || response?.data;
    },
    enabled: !!id,
    staleTime: 1000 * 60 * 15, // 15 minutes
  });
}

/**
 * Hook to fetch single area by slug OR ID
 * Handles URLs like /service-area/primeheal-in-madrid or /service-area/madrid or /service-area/1
 */
export function usePublicAreaBySlugOrId(slugOrId) {
  const cleanKey = parseAreaSlug(slugOrId);

  return useQuery({
    queryKey: ["public-area-slug", cleanKey],
    queryFn: async () => {
      if (!cleanKey) return null;

      // 1. If cleanKey is numeric ID
      if (!isNaN(cleanKey) && Number.isInteger(Number(cleanKey))) {
        const response = await publicAreaService.getAreaById(cleanKey);
        return response?.data?.area || response?.area || response?.data;
      }

      // 2. Fetch all areas list to search for matching area by name / slug
      const areasRes = await publicAreaService.getAreas();
      const allAreas = areasRes?.data?.areas || areasRes?.areas || areasRes?.data || [];

      // Search parent areas and child subareas
      let targetArea = null;

      for (const parent of allAreas) {
        if (
          slugifyAreaName(parent.name) === cleanKey ||
          parent.name?.toLowerCase() === cleanKey
        ) {
          targetArea = parent;
          break;
        }

        if (parent.children && parent.children.length > 0) {
          const childMatch = parent.children.find(
            (child) =>
              slugifyAreaName(child.name) === cleanKey ||
              child.name?.toLowerCase() === cleanKey
          );
          if (childMatch) {
            targetArea = childMatch;
            break;
          }
        }
      }

      // 3. If matched in list, fetch full details by ID
      if (targetArea?.id) {
        const fullAreaRes = await publicAreaService.getAreaById(targetArea.id);
        const fullArea = fullAreaRes?.data?.area || fullAreaRes?.area || fullAreaRes?.data;
        if (fullArea) return fullArea;
        return targetArea;
      }

      // 4. Fallback formatted name if not found in DB list (e.g. "madrid" -> "Madrid")
      const formattedName = cleanKey
        .split("-")
        .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
        .join(" ");

      return {
        id: cleanKey,
        name: formattedName,
        parent_id: null,
        parent: null,
        children: [],
        is_fallback: true,
      };
    },
    enabled: !!slugOrId,
    staleTime: 1000 * 60 * 15, // 15 minutes
  });
}
