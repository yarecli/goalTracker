import { useState } from "react";
import { useAuth } from "../hooks/useAuth.js";
import { toast } from "react-toastify";

export default function Settings() {
  const { user, logout } = useAuth();
  const [email, setEmail] = useState(user?.email || "");

  const handleSave = () => {
    // For now just a placeholder
    toast.success("Settings saved!");
  };

  return (
    <div className="settings-page">
      <h2>Settings</h2>
      <label>Email:</label>
      <input value={email} onChange={(e) => setEmail(e.target.value)} />
      <button onClick={handleSave}>Save Changes</button>
      <button onClick={logout}>Logout</button>
    </div>
  );
}
