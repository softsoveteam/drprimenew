import axios from "@/lib/axios";

function unwrap(response) {
  return response?.data ?? response;
}

export const addressService = {
  async list() {
    const data = unwrap(await axios.get("/user/addresses"));
    return data?.addresses || [];
  },

  async create(payload) {
    const data = unwrap(await axios.post("/user/addresses", payload));
    return data?.address;
  },

  async update(id, payload) {
    const data = unwrap(await axios.post(`/user/addresses/${id}`, payload));
    return data?.address;
  },

  async setDefault(id) {
    const data = unwrap(await axios.post(`/user/addresses/${id}/default`));
    return data?.address;
  },

  async remove(id) {
    return unwrap(await axios.delete(`/user/addresses/${id}`));
  },
};
