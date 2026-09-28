import api from "@/lib/axios";

export const publicBotQuestionService = {
  /**
   * Active bot questions for the chat widget.
   * GET /bot-questions
   * @param {Object} params - { search, page, per_page }
   */
  getBotQuestions: async (params) => {
    return await api.get("/bot-questions", { params });
  },

  /**
   * One bot question by id.
   * GET /bot-questions/{id}
   * @param {string|number} id
   */
  getBotQuestionById: async (id) => {
    return await api.get(`/bot-questions/${id}`);
  },
};
