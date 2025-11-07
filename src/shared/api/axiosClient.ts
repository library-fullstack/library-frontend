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

let isRefreshing = false;
let failedQueue: Array<{
  resolve: (value: string) => void;
  reject: (reason: unknown) => void;
}> = [];

const processQueue = (error: unknown, token: string | null = null) => {
  failedQueue.forEach((prom) => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve(token as string);
    }
  });

  failedQueue = [];
};

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

  (config.headers as Record<string, string>)["Cache-Control"] =
    "no-cache, no-store, must-revalidate";
  (config.headers as Record<string, string>)["Pragma"] = "no-cache";
  (config.headers as Record<string, string>)["Expires"] = "0";

  return config;
});

axiosClient.interceptors.response.use(
  (response) => {
    if (response.status === 304) {
      logger.warn(
        "[axiosClient] Received 304 Not Modified - may need to reload data"
      );
    }
    return response;
  },
  async (error) => {
    const originalRequest = error.config;

    logger.error("[axiosClient] Error:", error);

    if (error.code === "ECONNABORTED") {
      logger.error("[axiosClient] Request timeout");
      return Promise.reject(error);
    }

    if (error.response?.status === 401 && originalRequest && !originalRequest._retry) {
      if (originalRequest.url?.includes("/auth/refresh")) {
        logger.warn("[axiosClient] Refresh token failed, logging out");
        StorageUtil.removeItem("token");
        StorageUtil.removeItem("user");
        window.location.href = "/login";
        return Promise.reject(error);
      }

      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        })
          .then((token) => {
            if (originalRequest.headers) {
              originalRequest.headers["Authorization"] = `Bearer ${token}`;
            }
            return axiosClient(originalRequest);
          })
          .catch((err) => {
            return Promise.reject(err);
          });
      }

      originalRequest._retry = true;
      isRefreshing = true;

      return axiosClient
        .post<{ token: string }>("/auth/refresh")
        .then((response) => {
          const newToken = response.data.token;
          StorageUtil.setItem("token", newToken);

          if (originalRequest.headers) {
            originalRequest.headers["Authorization"] = `Bearer ${newToken}`;
          }

          processQueue(null, newToken);
          isRefreshing = false;
          return axiosClient(originalRequest);
        })
        .catch((err) => {
          processQueue(err, null);
          StorageUtil.removeItem("token");
          StorageUtil.removeItem("user");
          isRefreshing = false;
          window.location.href = "/login";
          return Promise.reject(err);
        });
    }

    if (error.response?.status === 403) {
      logger.warn("[axiosClient] Forbidden - insufficient permissions");
    }

    return Promise.reject(error);
  }
);

export default axiosClient;
