import axios from "@/lib/axios";

export const getAdminProducts = async (params) => {
  const response = await axios.get("/admin/products", { params });
  return response.data;
};

export const getAdminProductById = async (id) => {
  const response = await axios.get(`/admin/products/${id}`);
  return response.data;
};

/** @param {FormData|object} data */
export const createAdminProduct = async (data) => {
  const response = await axios.post("/admin/products", data);
  return response?.data ?? response;
};

/** @param {FormData|object} data */
export const updateAdminProduct = async (id, data) => {
  const response = await axios.post(`/admin/products/${id}`, data);
  return response?.data ?? response;
};

export const deleteAdminProduct = async (id) => {
  const response = await axios.delete(`/admin/products/${id}`);
  return response?.data ?? response;
};

/**
 * Build multipart body for product create/update.
 * Prefer `images[]` files (max 12). Optional `image_urls[]` / legacy fields.
 *
 * @param {object} values - form fields
 * @param {{ imageFiles?: File[], removeImageIds?: number[], removeAllImages?: boolean }} [opts]
 */
export function buildProductFormData(
  values,
  { imageFiles = [], removeImageIds = [], removeAllImages = false } = {}
) {
  const fd = new FormData();

  fd.append("sku", values.sku?.trim() || "");
  fd.append("title", values.title?.trim() || "");
  fd.append("price", String(values.price ?? 0));
  fd.append("currency", values.currency || "USD");
  fd.append("stock_quantity", String(values.stock_quantity ?? 0));
  fd.append("is_active", values.is_active ? "1" : "0");
  fd.append("description", values.description ?? "");

  if (values.amazon_sku) fd.append("amazon_sku", values.amazon_sku.trim());
  if (values.asin) fd.append("asin", values.asin.trim());
  if (values.amazon_url) fd.append("amazon_url", values.amazon_url.trim());

  const files = (imageFiles || []).slice(0, 12);
  if (files.length > 0) {
    files.forEach((file) => {
      if (file instanceof File) {
        fd.append("images[]", file);
      }
    });
  } else if (values.image_url) {
    // Legacy / single external URL fallback
    fd.append("image_url", values.image_url.trim());
  }

  if (removeAllImages) {
    fd.append("remove_image", "1");
  } else if (Array.isArray(removeImageIds) && removeImageIds.length > 0) {
    removeImageIds.forEach((id) => {
      fd.append("remove_image_ids[]", String(id));
    });
  }

  return fd;
}
