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
  const [loading, setLoading] = useState(true);

  // Fetch user profile whenever drawer opens
  useEffect(() => {
    if (isOpen) {
      const token = localStorage.getItem("token");
      if (!token) {
        setUser(null);
        setLoading(false);
        return;
      }

      const fetchProfile = async () => {
        try {
          const res = await fetch("http://localhost:5000/api/user/profile", {
            headers: { Authorization: `Bearer ${token}` },
          });

          const data = await res.json();
          if (data.success) {
            setUser(data.user);
            localStorage.setItem("user", JSON.stringify(data.user));
          } else {
            setUser(null);
          }
        } catch (error) {
          console.error("Error fetching profile:", error);
          setUser(null);
        } finally {
          setLoading(false);
        }
      };

      fetchProfile();
    }
  }, [isOpen]);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/login");
    onClose();
  };

  if (!isOpen) return null;

  // Progress bar (assuming level max = 100)
  const maxPoints = 100;
  const pointsPercentage = user
    ? Math.min((user.points / maxPoints) * 100, 100)
    : 0;

  return (
    <div className="fixed inset-0 z-50 flex">
      {/* Background overlay */}
      <div
        className="flex-1 bg-black/40 backdrop-blur-sm"
        onClick={onClose}
      ></div>

      {/* Drawer */}
      <div className="w-80 bg-gradient-to-b from-white to-gray-50 shadow-2xl h-full flex flex-col p-6 animate-slideInRight border-l border-gray-200">
        {/* Close button */}
        <button
          className="self-end text-gray-500 hover:text-red-500 text-2xl mb-4 transition-colors"
          onClick={onClose}
        >
          <FaTimes />
        </button>

        {loading ? (
          <p className="text-center text-gray-500 mt-10">Loading...</p>
        ) : user ? (
          <>
            {/* Profile Info */}
            <div className="flex flex-col items-center gap-3 mb-6">
              <div className="relative">
                {user.avatar ? (
                  <img
                    src={user.avatar}
                    alt="Profile"
                    className="w-24 h-24 rounded-full object-cover shadow-md ring-2 ring-green-500"
                  />
                ) : (
                  <FaUserCircle className="text-green-600 text-7xl drop-shadow-md" />
                )}
              </div>
              <h2 className="text-2xl font-bold text-green-700">
                {user.name || "EcoPay User"}
              </h2>

              {/* Email */}
              <p className="text-gray-600 flex items-center gap-2 text-sm">
                <FaEnvelope className="text-green-500" /> {user.email}
              </p>

              {/* Phone */}
              {user.phone && (
                <p className="text-gray-600 flex items-center gap-2 text-sm">
                  <FaPhoneAlt className="text-green-500" /> {user.phone}
                </p>
              )}

              {/* Points with progress bar */}
              <div className="w-full mt-2">
                <div className="flex items-center justify-between mb-1">
                  <div className="flex items-center gap-2 text-sm font-medium text-gray-700">
                    <FaCoins className="text-yellow-500" />
                    <span>{user.points} Points</span>
                  </div>
                  <span className="text-xs text-gray-500">
                    Level {Math.floor(user.points / maxPoints) + 1}
                  </span>
                </div>
                <div className="w-full h-3 bg-gray-200 rounded-full overflow-hidden">
                  <div
                    className="h-3 bg-gradient-to-r from-green-400 to-green-600 rounded-full transition-all duration-500"
                    style={{ width: `${pointsPercentage}%` }}
                  ></div>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col gap-4 mt-4">
              <button
                onClick={() => navigate("/my-requests")}
                className="flex items-center justify-center gap-2 px-5 py-3 bg-gradient-to-r from-blue-400 via-blue-500 to-blue-600 text-white rounded-xl shadow hover:scale-105 transition transform font-medium"
              >
                <FaRecycle /> My Requests
              </button>

              <button
                onClick={() => navigate("/my-transactions")}
                className="flex items-center justify-center gap-2 px-5 py-3 bg-gradient-to-r from-yellow-400 via-yellow-500 to-yellow-600 text-white rounded-xl shadow hover:scale-105 transition transform font-medium"
              >
                <FaListAlt /> My Transactions
              </button>

              <button
                onClick={() => alert("Edit Profile coming soon!")}
                className="flex items-center justify-center gap-2 px-5 py-3 bg-gradient-to-r from-green-400 via-green-500 to-green-600 text-white rounded-xl shadow hover:scale-105 transition transform font-medium"
              >
                <FaUserEdit /> Edit Profile
              </button>

              <button
                onClick={handleLogout}
                className="flex items-center justify-center gap-2 px-5 py-3 bg-gradient-to-r from-red-500 via-red-600 to-red-700 text-white rounded-xl shadow hover:scale-105 transition transform font-medium"
              >
                <FaSignOutAlt /> Logout
              </button>
            </div>
          </>
        ) : (
          <p className="text-gray-600 text-center mt-6">
            Please login to view your profile.
          </p>
        )}
      </div>
    </div>
  );
}
