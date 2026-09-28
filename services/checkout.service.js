import axios from "@/lib/axios";

export const createCheckout = async (shipping) => {
  const response = await axios.post("/checkout", shipping);
  return response?.data ?? response;
};
