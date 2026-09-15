import axios from "axios";

const getBaseUrl = () => {
  return (
    process.env.NEXT_PUBLIC_API_URL ||
    "http://192.168.1.61:8002/api"
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

// Request Interceptor
api.interceptors.request.use(
  (config) => {
    if (typeof window !== "undefined") {
      const token =
        localStorage.getItem("token") ||
        localStorage.getItem("auth_token") ||
        localStorage.getItem("admin_token");
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response Interceptor
api.interceptors.response.use(
  (response) => {
    return response.data;
  },
  (error) => {
    if (error.response) {
      const { status, data } = error.response;

      // Handle 401 Unauthorized
      if (status === 401) {
        if (typeof window !== "undefined") {
          localStorage.removeItem("token");
          localStorage.removeItem("auth_token");
          localStorage.removeItem("admin_token");
        }
      }

      const errorMessage =
        data?.message || data?.error || error.message || "An unexpected error occurred.";
      return Promise.reject(new Error(errorMessage));
    } else if (error.request) {
      return Promise.reject(
        new Error("No response from server. Please check your network connection.")
      );
    }
    return Promise.reject(error);
  }
);

export default api;
