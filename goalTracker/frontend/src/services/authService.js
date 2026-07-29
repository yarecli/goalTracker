import { apiClient } from "./apiClient.js";

export const register = async (username, email, password) => {
  const res = await apiClient.post("/auth/register", { username, email, password });
  if (res.data.token) {
    localStorage.setItem("goaltracker_token", res.data.token);
  }
  return res.data;
};

export const login = async (email, password) => {
  const res = await apiClient.post("/auth/login", { email, password });
  if (res.data.token) {
    localStorage.setItem("goaltracker_token", res.data.token);
  }
  return res.data;
};

export const logout = () => {
  localStorage.removeItem("goaltracker_token");
};
