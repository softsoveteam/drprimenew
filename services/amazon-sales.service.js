import axios from "@/lib/axios";

export const getAmazonSalesOrders = async (params) => {
  const response = await axios.get("/admin/amazon-sales", { params });
  return response.data;
};

export const getAmazonSalesStats = async (params) => {
  const response = await axios.get("/admin/amazon-sales/stats", { params });
  return response.data;
};

export const syncAmazonSales = async (data = {}) => {
  const response = await axios.post("/admin/amazon-sales/sync", data, {
    timeout: 300000,
  });
  return response.data;
};

export const getAmazonOrderDetails = async (amazonOrderId) => {
  const response = await axios.get(`/admin/amazon-sales/${amazonOrderId}`);
  return response.data;
};
