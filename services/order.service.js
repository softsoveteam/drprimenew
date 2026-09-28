import axios from "@/lib/axios";

export const getOrders = async (params) => {
  const response = await axios.get("/orders", { params });
  return response.data;
};

export const getOrderById = async (id) => {
  const response = await axios.get(`/orders/${id}`);
  return response.data;
};

/** Download paid-order invoice PDF (customer). Returns a Blob. */
export const downloadOrderInvoice = async (id) => {
  const blob = await axios.get(`/orders/${id}/invoice`, {
    responseType: "blob",
    headers: { Accept: "application/pdf" },
  });
  return blob;
};
