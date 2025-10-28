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

  console.log("[Axios Request]", {
    method: config.method,
    url: config.url,
    isFormData: config.data instanceof FormData,
    headers: config.headers,
  });

  return config;
});

// log errors
axiosClient.interceptors.response.use(
  (response) => {
    console.log("[Axios Response Success]", {
      status: response.status,
      url: response.config.url,
    });
    return response;
  },
  (error) => {
    console.error("[Axios Response Error]", {
      status: error.response?.status,
      url: error.config?.url,
      message: error.response?.data?.message || error.message,
      data: error.response?.data,
    });
    return Promise.reject(error);
  }
);

export default axiosClient;
