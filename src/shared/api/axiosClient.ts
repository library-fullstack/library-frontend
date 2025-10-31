import axios from "axios";

const axiosClient = axios.create({
  baseURL: import.meta.env.VITE_API_URL ?? "http://localhost:4000/api/v1",
  // headers: { "Content-Type": "application/json" },
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

  return config;
});

export default axiosClient;
