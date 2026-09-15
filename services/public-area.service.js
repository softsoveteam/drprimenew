import api from "@/lib/axios";

export const publicAreaService = {
  /**
   * Get list of public areas
   * GET /areas
   * @param {Object} params - { parent_id }
   */
  getAreas: async (params) => {
    return await api.get("/areas", { params });
  },

  /**
   * Get single public area detail by ID
   * GET /areas/{id}
   * @param {string|number} id
   */
  getAreaById: async (id) => {
    return await api.get(`/areas/${id}`);
  },
};
