import axios from "axios";
import logger from "../lib/logger";
import StorageUtil from "../lib/storage";

const axiosClient = axios.create({
  baseURL: import.meta.env.VITE_API_URL ?? "http://localhost:4000/api/v1",
  timeout: 8000,
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
});

const _MAX_RETRIES = 3;
const _RETRY_DELAY = 1000;

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

const _isRetryableError = (error: unknown): boolean => {
  const axiosError = error as Record<string, unknown>;
  if (!axiosError || !axiosError.response) return true; // Retry network errors

  const status = (axiosError.response as Record<string, unknown>)
    .status as number;
  return status === 408 || status === 429 || (status >= 500 && status < 600);
};

export const createFastFailClient = () => {
  return axios.create({
    baseURL: import.meta.env.VITE_API_URL ?? "http://localhost:4000/api/v1",
    timeout: 3000,
    headers: {
      "Content-Type": "application/json",
    },
  });
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

  const method = config.method?.toUpperCase();
  if (method && ["POST", "PUT", "DELETE", "PATCH"].includes(method)) {
    (config.headers as Record<string, string>)["Cache-Control"] = "no-cache";
  }

  (config as unknown as Record<string, unknown>)._retryCount =
    (config as unknown as Record<string, unknown>)._retryCount || 0;

  return config;
});

const publicRoutes = [
  "/books",
  "/authors",
  "/categories",
  "/tags",
  "/publishers",
  "/banners",
  "/settings",
  "/users/profile",
];

const isPublicRoute = (url: string): boolean => {
  if (!url) return false;
  return publicRoutes.some((route) => url.includes(route));
};

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

    if (
      error.response?.status === 401 &&
      originalRequest &&
      !originalRequest._retry
    ) {
      if (originalRequest.url?.includes("/auth/login")) {
        logger.warn("[axiosClient] Login failed with 401");
        return Promise.reject(error);
      }

      if (originalRequest.url?.includes("/auth/refresh")) {
        logger.warn("[axiosClient] Refresh token failed, logging out");
        StorageUtil.removeItem("token");
        StorageUtil.removeItem("user");
        window.location.href = "/auth/login";
        return Promise.reject(error);
      }

      if (isPublicRoute(originalRequest.url)) {
        logger.warn(
          "[axiosClient] 401 on public route, rejecting without redirect:",
          originalRequest.url
        );
        StorageUtil.removeItem("token");
        StorageUtil.removeItem("user");
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
        .post<{ accessToken: string }>(
          "/auth/refresh",
          {},
          { withCredentials: true }
        )
        .then((response) => {
          const newToken = response.data.accessToken;
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

          window.dispatchEvent(new Event("auth-logout"));

          window.location.href = "/auth/login";
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
