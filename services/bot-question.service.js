import axios from "@/lib/axios";

export const getBotQuestions = async (params) => {
  const response = await axios.get("/admin/bot-questions", { params });
  return response.data;
};

export const getBotQuestionById = async (id) => {
  const response = await axios.get(`/admin/bot-questions/${id}`);
  return response.data;
};

export const createBotQuestion = async (data) => {
  const response = await axios.post("/admin/bot-questions", data);
  return response.data;
};

export const updateBotQuestion = async (id, data) => {
  const response = await axios.post(`/admin/bot-questions/${id}`, data);
  return response.data;
};

export const deleteBotQuestion = async (id) => {
  const response = await axios.delete(`/admin/bot-questions/${id}`);
  return response.data;
};
