// src/services/apiClient.js
import axios from "axios";

export const apiClient = axios.create({
  baseURL: "http://localhost:5001/api", // your backend API base URL
  headers: {
    "Content-Type": "application/json",
  },
});

// Attach JWT token from localStorage to every request
apiClient.interceptors.request.use((config) => {
  const token = localStorage.getItem("goaltracker_token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});
