import React from "react";
import ReactDOM from "react-dom/client";
import App from "./app.jsx";
import { AuthProvider } from "./context/AuthContext.jsx";
import { TaskProvider } from "./context/taskContext.jsx";
import "./styles/index.css";
import "react-toastify/dist/ReactToastify.css"; // Toast notifications

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <AuthProvider>
      <TaskProvider>
        <App />
      </TaskProvider>
    </AuthProvider>
  </React.StrictMode>
);
