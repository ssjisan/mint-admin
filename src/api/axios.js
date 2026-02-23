import axios from "axios";

const API = axios.create({
  baseURL: import.meta.env.VITE_SERVER_API,
  withCredentials: false,
  headers: {
    "Content-Type": "application/json",
  },
});

// 🔐 Request interceptor (attach token automatically)
API.interceptors.request.use(
  (config) => {
    const auth = JSON.parse(sessionStorage.getItem("auth"));
    const token = auth?.token;

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => Promise.reject(error),
);

// 🚨 Response interceptor (handle 401 globally)
API.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      sessionStorage.removeItem("auth");
      window.location.href = "/login";
    }

    return Promise.reject(error);
  },
);

export default API;
