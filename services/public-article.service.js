import api from "@/lib/axios";

export const publicArticleService = {
  /**
   * Get public published articles list
   * GET /articles
   * @param {Object} params - { search, page, per_page }
   */
  getArticles: async (params) => {
    return await api.get("/articles", { params });
  },

  /**
   * Get public article detail by slug
   * GET /articles/{slug}
   * @param {string} slug
   */
  getArticleBySlug: async (slug) => {
    return await api.get(`/articles/${slug}`);
  },
};
