// src/pages/Settings.jsx
import { useEffect, useState } from "react";
import { logoutAdmin } from "../services/adminApi";
import axios from "axios";
import { FaUserShield, FaEnvelope, FaSignOutAlt, FaCog } from "react-icons/fa";

export default function Settings() {
  const [admin, setAdmin] = useState(null);
  const [loading, setLoading] = useState(true);

  // ✅ Fetch logged-in admin details
  const fetchAdminDetails = async () => {
    try {
      const token = localStorage.getItem("adminToken");
      const res = await axios.get("http://localhost:5000/api/admin/me", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setAdmin(res.data);
    } catch (err) {
      console.error("Error fetching admin details:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAdminDetails();
  }, []);

  return (
    <div className="p-6 min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <h1 className="text-3xl font-bold text-gray-800 mb-6">⚙️ Settings</h1>

      {loading ? (
        <div className="text-gray-500">Loading settings...</div>
      ) : !admin ? (
        <div className="text-red-500">Failed to load admin details.</div>
      ) : (
        <div className="space-y-6">
          {/* ✅ Profile Card */}
          <div className="bg-white shadow rounded-2xl p-6 flex items-center gap-6">
            <div className="w-20 h-20 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 text-3xl font-bold">
              {admin.name?.charAt(0).toUpperCase() || "A"}
            </div>
            <div>
              <h2 className="text-2xl font-semibold text-gray-700 flex items-center gap-2">
                <FaUserShield className="text-blue-500" /> {admin.name}
              </h2>
              <p className="text-gray-500 flex items-center gap-2">
                <FaEnvelope className="text-gray-400" /> {admin.email}
              </p>
              <p className="text-sm text-gray-400 mt-1">
                Role:{" "}
                <span className="font-medium">{admin.role || "Admin"}</span>
              </p>
            </div>
          </div>

          {/* ✅ Account Settings */}
          <div className="bg-white shadow rounded-2xl p-6">
            <h2 className="text-xl font-semibold text-gray-700 mb-4 flex items-center gap-2">
              <FaCog className="text-gray-500" /> Account Preferences
            </h2>
            <ul className="space-y-3 text-gray-600">
              <li className="hover:bg-gray-50 p-3 rounded-lg cursor-pointer transition">
                🔑 Change Password
              </li>
              <li className="hover:bg-gray-50 p-3 rounded-lg cursor-pointer transition">
                📱 Enable Two-Factor Authentication
              </li>
              <li className="hover:bg-gray-50 p-3 rounded-lg cursor-pointer transition">
                🌙 Dark Mode (Coming Soon)
              </li>
            </ul>
          </div>

          {/* ✅ Danger Zone */}
          <div className="bg-white shadow rounded-2xl p-6 border border-red-200">
            <h2 className="text-xl font-semibold text-red-600 mb-4">
              Danger Zone
            </h2>
            <button
              onClick={logoutAdmin}
              className="flex items-center gap-2 bg-red-500 hover:bg-red-600 text-white px-5 py-2 rounded-lg shadow transition"
            >
              <FaSignOutAlt /> Logout
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
