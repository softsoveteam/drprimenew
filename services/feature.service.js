import api from "@/lib/axios";

export const featureService = {
  /** GET /features — public shop flag, no login */
  getFeatures: async () => {
    return await api.get("/features");
  },

  /** GET /admin/features */
  getAdminFeatures: async () => {
    return await api.get("/admin/features");
  },

  /** POST /admin/features/shop */
  updateShopFeature: async (shop_enabled) => {
    return await api.post("/admin/features/shop", { shop_enabled });
  },
};
