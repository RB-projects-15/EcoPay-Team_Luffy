// src/pages/Settings.jsx
import { useEffect, useState } from "react";
import { logoutAdmin } from "../services/adminApi";
import { FaUserShield, FaEnvelope, FaSignOutAlt, FaCog } from "react-icons/fa";

export default function Settings() {
  const [admin, setAdmin] = useState(null);

  // ✅ Load admin details from localStorage instead of calling /me
  useEffect(() => {
    const storedAdmin = localStorage.getItem("admin");
    if (storedAdmin) {
      try {
        setAdmin(JSON.parse(storedAdmin));
      } catch (err) {
        console.error("Error parsing admin from localStorage:", err);
      }
    }
  }, []);

  return (
    <div className="p-6 min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <h1 className="text-3xl font-bold text-gray-800 mb-6">⚙️ Settings</h1>

      {!admin ? (
        <div className="text-red-500">
          No admin details found. Please login again.
        </div>
      ) : (
        <div className="space-y-6">
          {/* ✅ Profile Card */}
          <div className="bg-white shadow rounded-2xl p-6 flex items-center gap-6">
            <div className="w-20 h-20 rounded-full bg-gradient-to-r from-blue-400 to-blue-600 flex items-center justify-center text-white text-3xl font-bold shadow-md">
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
                <span className="font-medium text-gray-600">
                  {admin.role || "Admin"}
                </span>
              </p>
            </div>
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
