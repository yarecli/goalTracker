import { useContext } from "react";
import { AuthContext } from "../context/AuthContext.jsx";
import * as authService from "../services/authService.js";
import { apiClient } from "../services/apiClient.js";

export const useAuth = () => {
  const { user, setUser } = useContext(AuthContext);

  const login = async (email, password) => {
    const data = await authService.login(email, password);
    // After token is stored, fetch profile to populate user state
    const profile = await apiClient.get("/auth/profile");
    setUser(profile.data);
    return { ...data, user: profile.data };
  };

  const register = async (username, email, password) => {
    const data = await authService.register(username, email, password);
    const profile = await apiClient.get("/auth/profile");
    setUser(profile.data);
    return { ...data, user: profile.data };
  };

  const logout = () => {
    authService.logout();
    setUser(null);
  };

  return { user, login, register, logout, setUser };
};
