"use client";

import { useQuery } from "@tanstack/react-query";
import { publicFaqService } from "@/services/public-faq.service";

/**
 * Hook to fetch public active FAQs list
 * Corresponds to USER API spec 5.1: GET /faqs
 * @param {Object} params - { search, page, per_page }
 */
export function usePublicFaqs({ search = "", page = 1, per_page = 50 } = {}, options = {}) {
  return useQuery({
    queryKey: ["public-faqs", { search, page, per_page }],
    queryFn: async () => {
      const response = await publicFaqService.getFaqs({ search, page, per_page });
      // response unwrap gives { success, message, data: { current_page, data: [...], total, per_page } }
      return response?.data || response;
    },
    staleTime: 1000 * 60 * 15, // 15 minutes
    ...options,
  });
}

/**
 * Hook to fetch single FAQ by ID
 * Corresponds to USER API spec 5.2: GET /faqs/{id}
 * @param {string|number} id
 */
export function usePublicFaq(id) {
  return useQuery({
    queryKey: ["public-faq", id],
    queryFn: async () => {
      if (!id) return null;
      const response = await publicFaqService.getFaqById(id);
      // response unwrap gives { success, message, data: { faq: {...} } }
      return response?.data?.faq || response?.faq || response?.data;
    },
    enabled: !!id,
    staleTime: 1000 * 60 * 15, // 15 minutes
  });
}
