import axios from "axios";
import logger from "../lib/logger";
import StorageUtil from "../lib/storage";

const axiosClient = axios.create({
  baseURL: import.meta.env.VITE_API_URL ?? "http://localhost:4000/api/v1",
  timeout: 30000,
  headers: {
    "Content-Type": "application/json",
  },
});

axiosClient.interceptors.request.use((config) => {
  const token = StorageUtil.getItem("token");

  if (token) {
    config.headers = config.headers || {};
    (config.headers as Record<string, string>)[
      "Authorization"
    ] = `Bearer ${token}`;
  }

  if (!(config.data instanceof FormData)) {
    (config.headers as Record<string, string>)["Content-Type"] =
      "application/json";
  }

  if (
    config.method &&
    ["post", "put", "delete", "patch"].includes(config.method.toLowerCase())
  ) {
    (config.headers as Record<string, string>)["Cache-Control"] =
      "no-cache, no-store, must-revalidate";
    (config.headers as Record<string, string>)["Pragma"] = "no-cache";
  }

  return config;
});

axiosClient.interceptors.response.use(
  (response) => {
    if (response.status === 304) {
      logger.warn(
        "[axiosClient] Nhận 304 Not Modified - có thể cần tải lại dữ liệu"
      );
    }
    return response;
  },
  (error) => {
    logger.error("[axiosClient] Lỗi:", error);

    if (error.code === "ECONNABORTED") {
      logger.error("[axiosClient] Request timeout");
    } else if (error.response?.status === 401) {
      logger.warn("[axiosClient] Unauthorized - token expired?");
    } else if (error.response?.status === 403) {
      logger.warn("[axiosClient] Forbidden - insufficient permissions");
    }

    return Promise.reject(error);
  }
);

export default axiosClient;
