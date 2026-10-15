import axios from "@/lib/axios";

export const getAdminOrders = async (params) => {
  const response = await axios.get("/admin/orders", { params });
  return response.data;
};

export const getAdminOrderById = async (id) => {
  const response = await axios.get(`/admin/orders/${id}`);
  return response.data;
};

export const deleteAdminOrder = async (id) => {
  const response = await axios.delete(`/admin/orders/${id}`);
  return response.data;
};

/** Download paid-order invoice PDF (admin). Returns a Blob. */
export const downloadAdminOrderInvoice = async (id) => {
  const blob = await axios.get(`/admin/orders/${id}/invoice`, {
    responseType: "blob",
    headers: { Accept: "application/pdf" },
  });
  return blob;
};

/** Request live tracking update from Amazon SP-API (admin). */
export const syncAdminOrderTracking = async (id) => {
  const response = await axios.post(`/admin/orders/${id}/sync-tracking`);
  return response.data;
};
