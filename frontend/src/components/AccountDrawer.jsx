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
  FaBoxOpen,
} from "react-icons/fa";

export default function AccountDrawer({ isOpen, onClose }) {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

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

  // Progress bar logic
  const maxPoints = 100;
  const points = user?.points || 0;
  const pointsPercentage = Math.min((points / maxPoints) * 100, 100);
  const currentLevel = Math.floor(points / maxPoints) + 1;

  return (
    <div className="fixed inset-0 z-50 flex">
      {/* Overlay */}
      <div
        className="flex-1 bg-black/40 backdrop-blur-sm"
        onClick={onClose}
      ></div>

      {/* Drawer */}
      <div className="w-80 bg-gradient-to-b from-white to-gray-50 shadow-2xl h-full flex flex-col p-6 border-l border-gray-200 transform transition-transform duration-300 ease-in-out animate-slideInRight overflow-y-auto">
        {/* Close Button */}
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
              <h2 className="text-2xl font-bold text-green-700 text-center">
                {user.name || "EcoPay User"}
              </h2>

              {/* Email */}
              {user.email && (
                <p className="text-gray-600 flex items-center gap-2 text-sm">
                  <FaEnvelope className="text-green-500" /> {user.email}
                </p>
              )}

              {/* Phone */}
              {user.phone && (
                <p className="text-gray-600 flex items-center gap-2 text-sm">
                  <FaPhoneAlt className="text-green-500" /> {user.phone}
                </p>
              )}

              {/* Points + Progress */}
              <div className="w-full mt-3">
                <div className="flex items-center justify-between mb-1">
                  <div className="flex items-center gap-2 text-sm font-medium text-gray-700">
                    <FaCoins className="text-yellow-500" />
                    <span>{points} Points</span>
                  </div>
                  <span className="text-xs bg-green-100 text-green-700 px-2 py-0.5 rounded-full font-semibold">
                    Level {currentLevel}
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
            <div className="flex flex-col gap-3 mt-4">
              <button
                onClick={() => navigate("/my-orders")}
                className="flex items-center justify-center gap-2 px-5 py-3 bg-purple-500 hover:bg-purple-600 text-white rounded-xl shadow-md transition font-medium"
              >
                <FaBoxOpen /> My Orders
              </button>

              <button
                onClick={() => alert("Edit Profile coming soon!")}
                className="flex items-center justify-center gap-2 px-5 py-3 bg-green-500 hover:bg-green-600 text-white rounded-xl shadow-md transition font-medium"
              >
                <FaUserEdit /> Edit Profile
              </button>

              <button
                onClick={handleLogout}
                className="flex items-center justify-center gap-2 px-5 py-3 bg-red-500 hover:bg-red-600 text-white rounded-xl shadow-md transition font-medium"
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
