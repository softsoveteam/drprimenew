"use client";

import { useQuery } from "@tanstack/react-query";
import { getProductDetails } from "@/services/product-details.service";
import { DEFAULT_PRODUCT_DETAILS, resolveProductOffer } from "@/lib/product-details";

export const PRODUCT_DETAILS_QUERY_KEY = ["product-details"];

export function useProductDetails() {
  const query = useQuery({
    queryKey: PRODUCT_DETAILS_QUERY_KEY,
    queryFn: getProductDetails,
    staleTime: 30_000,
  });

  const details = query.isSuccess ? query.data : DEFAULT_PRODUCT_DETAILS;

  return {
    ...query,
    details,
    offer: resolveProductOffer(details),
  };
}
