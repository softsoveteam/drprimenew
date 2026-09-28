import axios from "@/lib/axios";

export const getSettings = async (params) => {
  const response = await axios.get("/admin/settings", { params });
  return response.data;
};

export const getSettingById = async (id) => {
  const response = await axios.get(`/admin/settings/${id}`);
  return response.data;
};

export const createSetting = async (data) => {
  const response = await axios.post("/admin/settings", data);
  return response.data;
};

export const updateSetting = async (id, data) => {
  const response = await axios.post(`/admin/settings/${id}`, data);
  return response.data;
};

export const deleteSetting = async (id) => {
  const response = await axios.delete(`/admin/settings/${id}`);
  return response.data;
};
