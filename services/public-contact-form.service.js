import api from "@/lib/axios";

export const publicContactFormService = {
  /**
   * Get active contact form fields
   * GET /contact-form/fields
   */
  getFields: async () => {
    return await api.get("/contact-form/fields");
  },

  /**
   * Submit contact form payload
   * POST /contact-form/submit
   * @param {Object} payload - { fields: { [field_key]: value } }
   */
  submitForm: async (payload) => {
    return await api.post("/contact-form/submit", payload);
  },
};
