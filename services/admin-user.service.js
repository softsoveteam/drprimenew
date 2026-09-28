import axios from "@/lib/axios";

export const getAdminUsers = async (params) => {
  const response = await axios.get("/admin/users", { params });
  return response.data;
};

export const getAdminUserById = async (id) => {
  const response = await axios.get(`/admin/users/${id}`);
  return response.data;
};

export const deleteAdminUser = async (id) => {
  const response = await axios.delete(`/admin/users/${id}`);
  return response.data;
};
