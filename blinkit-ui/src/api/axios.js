import axios from "axios";

const api = axios.create({
  baseURL: "https://mart-ba0h.onrender.com",
});

api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
     console.log("Interceptor:",token)
    // ✅ FIX: headers object ensure karo
    if (!config.headers) {
      config.headers = {};
    }

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default api;
