import axios from "axios";
import { SHOP_DISABLED_EVENT } from "@/lib/shop-paths";

const getBaseUrl = () => {
  return (
    process.env.NEXT_PUBLIC_API_URL ||
    "https://drprime-v1.softsove.life/api"
  );
};

const api = axios.create({
  baseURL: getBaseUrl(),
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
  },
  timeout: 30000,
});

function isAdminRequest(config) {
  const url = `${config?.baseURL || ""}${config?.url || ""}`;
  return url.includes("/admin");
}

function isCartRelatedRequest(config) {
  const url = `${config?.url || ""}`;
  return url.includes("/cart") || url.includes("/checkout");
}

// Request Interceptor — use the correct token per area
api.interceptors.request.use(
  (config) => {
    if (typeof window !== "undefined") {
      if (isAdminRequest(config)) {
        const adminToken = localStorage.getItem("admin_token");
        if (adminToken) {
          config.headers.Authorization = `Bearer ${adminToken}`;
        }
      } else {
        const userToken =
          localStorage.getItem("user_token") ||
          localStorage.getItem("token") ||
          localStorage.getItem("auth_token");

        if (userToken) {
          config.headers.Authorization = `Bearer ${userToken}`;
        }

        // Guest cart: send X-Guest-Token when no user Bearer (or always alongside for merge)
        const guestToken = localStorage.getItem("guest_token");
        if (guestToken && isCartRelatedRequest(config)) {
          // Prefer Bearer for logged-in users; still attach guest token for merge endpoint
          const isMerge = (config.url || "").includes("/cart/merge");
          if (!userToken || isMerge) {
            config.headers["X-Guest-Token"] = guestToken;
          }
        }
      }
    }

    // Let the browser set multipart boundary for FormData
    if (typeof FormData !== "undefined" && config.data instanceof FormData) {
      if (config.headers && typeof config.headers.set === "function") {
        config.headers.delete("Content-Type");
      } else if (config.headers) {
        delete config.headers["Content-Type"];
        delete config.headers["content-type"];
      }
    }

    return config;
  },
  (error) => Promise.reject(error)
);

// Response Interceptor
api.interceptors.response.use(
  (response) => response.data,
  (error) => {
    if (error.response) {
      const { status, data } = error.response;

      if (
        status === 403 &&
        typeof window !== "undefined" &&
        String(data?.message || "").toLowerCase().includes("shop is turned off")
      ) {
        window.dispatchEvent(new Event(SHOP_DISABLED_EVENT));
      }

      if (status === 401 && typeof window !== "undefined") {
        if (isAdminRequest(error.config || {})) {
          localStorage.removeItem("admin_token");
        } else {
          localStorage.removeItem("user_token");
          localStorage.removeItem("token");
          localStorage.removeItem("auth_token");
        }
      }

      const errorMessage =
        data?.message || data?.error || error.message || "An unexpected error occurred.";
      return Promise.reject(new Error(errorMessage));
    }

    if (error.request) {
      return Promise.reject(
        new Error("No response from server. Please check your network connection.")
      );
    }

    return Promise.reject(error);
  }
);

export default api;

/** Normalize Laravel-style paginated payloads from admin/public APIs */
export function extractPaginated(payload) {
  if (!payload) return { list: [], total: 0, raw: payload };

  if (Array.isArray(payload)) {
    return { list: payload, total: payload.length, raw: payload };
  }

  // Service already returned pagination object: { data: [], total, current_page }
  if (Array.isArray(payload.data) && (payload.total != null || payload.current_page != null)) {
    return { list: payload.data, total: Number(payload.total) || payload.data.length, raw: payload };
  }

  // Full API body still nested: { success, data: { data: [], total } }
  if (payload.data && Array.isArray(payload.data.data)) {
    return {
      list: payload.data.data,
      total: Number(payload.data.total) || payload.data.data.length,
      raw: payload.data,
    };
  }

  // { data: [...] } without pagination meta
  if (Array.isArray(payload.data)) {
    return { list: payload.data, total: payload.data.length, raw: payload };
  }

  return { list: [], total: 0, raw: payload };
}
