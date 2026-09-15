import api from "@/lib/axios";

export const userAuthService = {
  /**
   * Register a new user
   * POST /user/register
   */
  register: async (payload) => {
    return await api.post("/user/register", payload);
  },

  /**
   * Login user
   * POST /user/login
   */
  login: async (credentials) => {
    return await api.post("/user/login", credentials);
  },

  /**
   * Get user profile
   * GET /user/me
   */
  getProfile: async () => {
    return await api.get("/user/me");
  },

  /**
   * Logout user
   * POST /user/logout
   */
  logout: async () => {
    return await api.post("/user/logout");
  },
};
