import api from "@/lib/axios";

export const publicFaqService = {
  /**
   * Get active FAQs list
   * GET /faqs
   * @param {Object} params - { search, page, per_page }
   */
  getFaqs: async (params) => {
    return await api.get("/faqs", { params });
  },

  /**
   * Get single FAQ detail by ID
   * GET /faqs/{id}
   * @param {string|number} id
   */
  getFaqById: async (id) => {
    return await api.get(`/faqs/${id}`);
  },
};
