import axios from "@/lib/axios";

export const getSubmissions = async (params) => {
  const response = await axios.get("/admin/contact-form/submissions", { params });
  return response.data;
};

export const getSubmissionById = async (id) => {
  const response = await axios.get(`/admin/contact-form/submissions/${id}`);
  return response.data;
};

export const deleteSubmission = async (id) => {
  const response = await axios.delete(`/admin/contact-form/submissions/${id}`);
  return response.data;
};
