import axios from "axios";

const AxiosService = axios.create({
  baseURL: import.meta.env.VITE_BASE_URL,
  headers: {
    "Content-Type": "application/json",
    // "ngrok-skip-browser-warning": "true",
  },
});

AxiosService.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers["Authorization"] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

AxiosService.interceptors.response.use(
  (response) => response,
  (error) => {
    let customError = {
      status: error.response?.status || 500,
      message:
        error.response?.data?.message ||
        error.message ||
        "Something went wrong",
      data: error.response?.data || null,
    };

    if (customError.status === 401) {
      localStorage.removeItem("token");
      setTimeout(() => {
        window.location.href = "/login";
      }, 500);
    }

    return Promise.reject(customError);
  }
);

export default AxiosService;
