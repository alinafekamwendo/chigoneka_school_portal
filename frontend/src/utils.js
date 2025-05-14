// src/utils/api.js
import axios from "axios";

const api = axios.create({
  baseURL: "http://your-api-base-url.com/api", // Replace with your API URL
});

// Add request interceptor to include the token
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("accessToken");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default api;
