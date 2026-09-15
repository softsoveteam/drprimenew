"use client";

import { useQuery } from "@tanstack/react-query";
import { publicArticleService } from "@/services/public-article.service";

/**
 * Hook to fetch published articles list
 * Corresponds to USER API spec 2.1: GET /articles
 */
export function usePublicArticles({ search = "", page = 1, per_page = 9 } = {}) {
  return useQuery({
    queryKey: ["public-articles", { search, page, per_page }],
    queryFn: async () => {
      const response = await publicArticleService.getArticles({ search, page, per_page });
      // response unwrap from lib/axios gives { success, message, data: { current_page, data: [...], total, last_page, per_page } }
      return response?.data || response;
    },
    staleTime: 1000 * 60 * 5, // 5 minutes
    keepPreviousData: true,
  });
}

/**
 * Hook to fetch a single article by slug
 * Corresponds to USER API spec 2.2: GET /articles/{slug}
 */
export function usePublicArticle(slug) {
  return useQuery({
    queryKey: ["public-article", slug],
    queryFn: async () => {
      if (!slug) return null;
      const response = await publicArticleService.getArticleBySlug(slug);
      // response unwrap gives { success, message, data: { article: {...} } }
      return response?.data?.article || response?.article || response?.data;
    },
    enabled: !!slug,
    staleTime: 1000 * 60 * 10, // 10 minutes
  });
}
