import axios from "@/lib/axios";

/** Public catalog — only active products */
export const getProducts = async (params) => {
  const response = await axios.get("/products", { params });
  return response.data;
};

export const getProductById = async (id) => {
  const response = await axios.get(`/products/${id}`);
  return response.data;
};
