import { createContext, useState, useEffect } from "react";
import { apiClient } from "../services/apiClient.js";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);

  // On app load, check if token exists and fetch user
  useEffect(() => {
    const token = localStorage.getItem("goaltracker_token");
    if (token) {
      apiClient.get("/auth/profile") // backend endpoint to fetch current user
        .then(res => setUser(res.data))
        .catch(() => setUser(null));
    }
  }, []);

  return (
    <AuthContext.Provider value={{ user, setUser }}>
      {children}
    </AuthContext.Provider>
  );
};
