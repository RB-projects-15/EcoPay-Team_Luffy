// src/components/AccountDrawer.jsx
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  FaUserCircle,
  FaEnvelope,
  FaCoins,
  FaSignOutAlt,
  FaUserEdit,
  FaTimes,
  FaPhoneAlt,
  FaRecycle,
  FaListAlt,
} from "react-icons/fa";

export default function AccountDrawer({ isOpen, onClose }) {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/login");
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex">
      {/* Background overlay */}
      <div
        className="flex-1 bg-gradient-to-br from-green-50 via-yellow-50 to-pink-50 opacity-80"
        onClick={onClose}
      ></div>

      {/* Drawer */}
      <div className="w-80 bg-white shadow-2xl h-full flex flex-col p-6 animate-slideInRight">
        {/* Close button */}
        <button
          className="self-end text-gray-500 hover:text-red-500 text-2xl mb-4"
          onClick={onClose}
        >
          <FaTimes />
        </button>

        {/* Profile Info */}
        {user ? (
          <>
            <div className="flex flex-col items-center gap-3 mb-6">
              <FaUserCircle className="text-green-600 text-7xl" />
              <h2 className="text-2xl font-bold text-green-800">
                {user.name || "EcoPay User"}
              </h2>

              {/* Email */}
              <p className="text-gray-600 flex items-center gap-2">
                <FaEnvelope className="text-green-500" /> {user.email}
              </p>

              {/* Phone */}
              {user.phone && (
                <p className="text-gray-600 flex items-center gap-2">
                  <FaPhoneAlt className="text-green-500" /> {user.phone}
                </p>
              )}

              {/* Points */}
              <div className="bg-gradient-to-r from-green-100 via-yellow-100 to-pink-100 rounded-xl px-6 py-3 shadow-inner flex items-center gap-3">
                <FaCoins className="text-yellow-500 text-2xl" />
                <span className="text-lg font-semibold text-gray-800">
                  {user.points} Points
                </span>
              </div>
            </div>

            {/* Buttons */}
            <div className="flex flex-col gap-4 mt-6">
              <button
                onClick={() => navigate("/my-requests")}
                className="flex items-center justify-center gap-2 px-5 py-3 bg-gradient-to-r from-blue-300 via-blue-400 to-blue-500 text-white rounded-full shadow-lg hover:scale-105 transition transform"
              >
                <FaRecycle /> My Requests
              </button>

              <button
                onClick={() => navigate("/my-transactions")}
                className="flex items-center justify-center gap-2 px-5 py-3 bg-gradient-to-r from-yellow-300 via-yellow-400 to-yellow-500 text-white rounded-full shadow-lg hover:scale-105 transition transform"
              >
                <FaListAlt /> My Transactions
              </button>

              <button
                onClick={() => alert("Edit Profile coming soon!")}
                className="flex items-center justify-center gap-2 px-5 py-3 bg-gradient-to-r from-green-300 via-green-400 to-green-500 text-white rounded-full shadow-lg hover:scale-105 transition transform"
              >
                <FaUserEdit /> Edit Profile
              </button>

              <button
                onClick={handleLogout}
                className="flex items-center justify-center gap-2 px-5 py-3 bg-gradient-to-r from-red-400 via-red-500 to-red-600 text-white rounded-full shadow-lg hover:scale-105 transition transform"
              >
                <FaSignOutAlt /> Logout
              </button>
            </div>
          </>
        ) : (
          <p className="text-gray-600">Please login to view your profile.</p>
        )}
      </div>
    </div>
  );
}
