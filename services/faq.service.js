import axios from "@/lib/axios";

export const getFaqs = async (params) => {
  const response = await axios.get("/admin/faqs", { params });
  return response.data;
};

export const getFaqById = async (id) => {
  const response = await axios.get(`/admin/faqs/${id}`);
  return response.data;
};

export const createFaq = async (data) => {
  const response = await axios.post("/admin/faqs", data);
  return response.data;
};

export const updateFaq = async (id, data) => {
  const response = await axios.post(`/admin/faqs/${id}`, data);
  return response.data;
};

export const deleteFaq = async (id) => {
  const response = await axios.delete(`/admin/faqs/${id}`);
  return response.data;
};
