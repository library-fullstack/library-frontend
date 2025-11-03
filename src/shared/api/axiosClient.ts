import axios from "axios";

const axiosClient = axios.create({
  baseURL: import.meta.env.VITE_API_URL ?? "http://localhost:4000/api/v1",
});

axiosClient.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");

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
      console.warn(
        "[axiosClient] Nhận 304 Not Modified - có thể cần tải lại dữ liệu"
      );
    }
    return response;
  },
  (error) => {
    console.error("[axiosClient] Lỗi:", error);
    return Promise.reject(error);
  }
);

export default axiosClient;
