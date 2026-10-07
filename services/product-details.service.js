import api from "@/lib/axios";

export async function getProductDetails() {
  const body = await api.get("/product-details");
  return body?.data ?? body;
}

export async function getAdminProductDetails() {
  const body = await api.get("/admin/product-details");
  return body?.data ?? body;
}

export async function updateAdminProductDetails(payload) {
  return api.post("/admin/product-details", payload);
}
