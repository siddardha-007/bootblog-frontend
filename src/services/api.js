import axios from "axios";

const API_BASE_URL = "https://bootblog-backend.onrender.com/api";

// 1. Create a single centralized Axios instance used across the entire app
const api = axios.create({
  baseURL: API_BASE_URL,
});

// 2. Request Interceptor: Automatically injects your Bearer Token globally
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error),
);

// 3. Response Interceptor: Catches 401/403 errors on ANY page (Home, Profile, Edit Post)
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response) {
      const status = error.response.status;

      if (status === 401 || status === 403) {
        console.warn(
          `Session invalid (${status}). Nuking storage and redirecting...`,
        );

        // Wipe all user data from storage cleanly
        localStorage.removeItem("token");
        localStorage.removeItem("role");
        localStorage.removeItem("userId");

        window.location.href = "/"; // Send them back to landing/login

        return new Promise(() => {}); // Halt subsequent code execution
      }
    }
    return Promise.reject(error);
  },
);

export default api;
