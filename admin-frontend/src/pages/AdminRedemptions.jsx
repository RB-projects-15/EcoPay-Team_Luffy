// src/pages/admin/AdminRedemptions.jsx
import { useEffect, useState } from "react";
import axios from "axios";
import { FaBoxOpen } from "react-icons/fa";

export default function AdminRedemptions() {
  const [redemptions, setRedemptions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [updatingId, setUpdatingId] = useState(null);

  const token = localStorage.getItem("adminToken");
  const API_BASE = "http://localhost:5000";

  // Fetch all redemption requests
  useEffect(() => {
    const fetchRedemptions = async () => {
      try {
        const res = await axios.get(
          `${API_BASE}/api/admin/rewards/redemptions/all`,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        if (res.data.success) setRedemptions(res.data.redemptions);
        else setError(res.data.message);
      } catch (err) {
        setError(err.response?.data?.message || "Something went wrong");
      } finally {
        setLoading(false);
      }
    };
    fetchRedemptions();
  }, []);

  // Handle status update
  const handleStatusUpdate = async (id, status) => {
    try {
      setUpdatingId(id);
      const res = await axios.put(
        `${API_BASE}/api/admin/rewards/redemptions/${id}`,
        { status },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      if (res.data.success) {
        alert(res.data.message);
        setRedemptions((prev) =>
          prev.map((r) =>
            r._id === id
              ? {
                  ...r,
                  status: res.data.redemption.status,
                  completed_at: res.data.redemption.completed_at,
                }
              : r
          )
        );
      } else {
        alert(res.data.message);
      }
    } catch (err) {
      alert(err.response?.data?.message || "Failed to update status");
    } finally {
      setUpdatingId(null);
    }
  };

  if (loading)
    return <p className="text-center mt-6">Loading redemptions...</p>;
  if (error) return <p className="text-center text-red-600 mt-6">{error}</p>;

  return (
    <div className="p-6">
      {/* Page Header */}
      <div className="flex items-center gap-3 mb-6">
        <FaBoxOpen className="text-3xl text-black-600" />
        <h1 className="text-2xl font-bold text-black-700">
          Reward Redemptions
        </h1>
      </div>

      {redemptions.length === 0 ? (
        <p className="text-gray-600">No redemption requests found.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {redemptions.map((r) => (
            <div
              key={r._id}
              className="bg-white rounded-xl shadow-md p-5 border border-blue-100 hover:shadow-lg transition-all duration-200"
            >
              {/* Reward Title */}
              <h2 className="text-lg font-bold text-black-600">
                {r.reward?.name || r.reward_name}
              </h2>

              {/* User Info */}
              <p className="text-gray-700 mt-1">
                <span className="font-medium">User:</span>{" "}
                {r.user?.name || r.user}
              </p>
              <p className="text-gray-700">
                <span className="font-medium">Email:</span>{" "}
                {r.user?.email || "-"}
              </p>

              {/* Status */}
              <p className="text-yellow-600 font-semibold mt-2">
                Status: {r.status.replaceAll("_", " ")}
              </p>

              {/* Dates */}
              <p className="text-gray-500 text-sm">
                Requested At: {new Date(r.requested_at).toLocaleString()}
              </p>
              {r.completed_at && (
                <p className="text-gray-500 text-sm">
                  Completed At: {new Date(r.completed_at).toLocaleString()}
                </p>
              )}

              {/* Status Buttons */}
              <div className="flex flex-wrap gap-2 mt-3">
                {[
                  "pending",
                  "out_for_delivery",
                  "will_reach_today",
                  "completed",
                ].map((statusOption) => (
                  <button
                    key={statusOption}
                    disabled={updatingId === r._id}
                    onClick={() => handleStatusUpdate(r._id, statusOption)}
                    className={`px-3 py-1.5 rounded-lg text-white text-sm font-medium transition-all duration-200 ${
                      r.status === statusOption
                        ? "bg-blue-600 shadow-md"
                        : "bg-gray-400 hover:bg-gray-500"
                    }`}
                  >
                    {statusOption.replaceAll("_", " ")}
                  </button>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
