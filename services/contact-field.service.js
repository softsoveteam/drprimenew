import axios from "@/lib/axios";

export const getFieldTypes = async () => {
  const response = await axios.get("/admin/contact-form/field-types");
  return response.data;
};

export const getContactFields = async (params) => {
  const response = await axios.get("/admin/contact-form/fields", { params });
  return response.data;
};

export const createContactField = async (data) => {
  const response = await axios.post("/admin/contact-form/fields", data);
  return response.data;
};

export const updateContactField = async (id, data) => {
  const response = await axios.post(`/admin/contact-form/fields/${id}`, data);
  return response.data;
};

export const deleteContactField = async (id) => {
  const response = await axios.delete(`/admin/contact-form/fields/${id}`);
  return response.data;
};
