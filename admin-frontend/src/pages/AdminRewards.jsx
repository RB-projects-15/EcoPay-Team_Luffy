// src/pages/admin/AdminRewards.jsx
import { useEffect, useState } from "react";
import axios from "axios";

const API_BASE = "http://localhost:5000";

export default function AdminRewards() {
  const [rewards, setRewards] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [newReward, setNewReward] = useState({
    name: "",
    description: "",
    points_required: "",
  });

  const token = localStorage.getItem("adminToken");

  useEffect(() => {
    const fetchRewards = async () => {
      // Guard: token
      if (!token) {
        setError("No admin token found. Please login as admin.");
        setLoading(false);
        return;
      }

      // We'll try the most likely endpoints, with helpful logging
      const candidatePaths = [
        "/api/admin/rewards/all",
        "/api/admin/rewards", // fallback
      ];

      let lastErr = null;
      for (const path of candidatePaths) {
        try {
          console.debug("[AdminRewards] trying fetch:", path);
          const res = await axios.get(`${API_BASE}${path}`, {
            headers: { Authorization: `Bearer ${token}` },
          });

          // Successful HTTP response — try to normalize rewards
          if (res?.data) {
            // Some APIs return { success: true, rewards: [...] }
            const payload = res.data;
            const list = payload.rewards || payload.data || payload;

            // normalize reward shape: ensure fields exist in consistent keys
            const normalized = (Array.isArray(list) ? list : []).map((r) => ({
              _id: r._id || r.reward_id || r.id,
              name: r.name,
              description: r.description || r.desc || "",
              // accept either snake_case or camelCase from backend
              points_required:
                r.points_required ?? r.pointsRequired ?? r.points ?? 0,
            }));

            setRewards(normalized);
            setError("");
            setLoading(false);
            return;
          } else {
            // unexpected payload
            lastErr = new Error("Unexpected response format");
            console.warn("[AdminRewards] unexpected response body", res);
          }
        } catch (err) {
          lastErr = err;
          console.warn(
            `[AdminRewards] fetch attempt failed for ${path}:`,
            err?.response?.status,
            err?.response?.data || err.message
          );
          // if 401/403 stop early because token likely invalid
          const status = err?.response?.status;
          if (status === 401 || status === 403) {
            setError(
              "Unauthorized: admin token invalid or expired. Please login again."
            );
            setLoading(false);
            return;
          }
          // otherwise try next candidate path
        }
      }

      // if we get here, no candidate succeeded
      console.error("[AdminRewards] all fetch attempts failed:", lastErr);
      setError(
        lastErr?.response?.data?.message ||
          lastErr?.message ||
          "Failed to fetch rewards. Check server and token."
      );
      setLoading(false);
    };

    fetchRewards();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [token]); // re-run if token changes

  const handleCreateReward = async (e) => {
    e.preventDefault();

    if (!token) {
      alert("No admin token found. Please login.");
      return;
    }

    // basic local validation
    if (!newReward.name || !newReward.points_required) {
      alert("Please provide name and points required");
      return;
    }

    // Prepare payload — send both possible field names to be safe
    const payload = {
      name: newReward.name,
      description: newReward.description || "",
      points_required: Number(newReward.points_required),
      pointsRequired: Number(newReward.points_required),
    };

    try {
      console.debug("[AdminRewards] create payload:", payload);
      const res = await axios.post(
        `${API_BASE}/api/admin/rewards/create`,
        payload,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      // If backend returns the created object, normalize and append
      if (res?.data?.success) {
        const r = res.data.reward || res.data.data;
        const normalized = {
          _id: r?._id || r?.reward_id || r?.id || `temp-${Date.now()}`,
          name: r?.name || payload.name,
          description: r?.description || payload.description,
          points_required:
            r?.points_required ?? r?.pointsRequired ?? payload.points_required,
        };
        setRewards((prev) => [normalized, ...prev]);
        setNewReward({ name: "", description: "", points_required: "" });
        alert(res.data.message || "Reward created");
      } else {
        // if backend returned success=false
        alert(res?.data?.message || "Failed to create reward");
      }
    } catch (err) {
      console.error("[AdminRewards] create error:", err?.response || err);
      const status = err?.response?.status;
      if (status === 401 || status === 403) {
        alert(
          "Unauthorized: admin token invalid or expired. Please login again."
        );
        return;
      }
      alert(
        err?.response?.data?.message || err.message || "Failed to create reward"
      );
    }
  };

  if (loading) return <p className="text-center mt-6">Loading rewards...</p>;
  if (error)
    return (
      <div className="p-6">
        <p className="text-center text-red-600 mt-6">{error}</p>
        <p className="text-sm text-gray-500 mt-2">
          Open developer console/network tab to see more details.
        </p>
      </div>
    );

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold text-black-700 mb-4">Manage Rewards</h1>

      {/* Create Reward Form */}
      <form
        onSubmit={handleCreateReward}
        className="bg-white p-4 shadow rounded mb-6 flex flex-col gap-3"
      >
        <input
          type="text"
          placeholder="Reward Name"
          value={newReward.name}
          onChange={(e) => setNewReward({ ...newReward, name: e.target.value })}
          className="border rounded p-2"
          required
        />
        <input
          type="number"
          placeholder="Points Required"
          value={newReward.points_required}
          onChange={(e) =>
            setNewReward({ ...newReward, points_required: e.target.value })
          }
          className="border rounded p-2"
          required
        />
        <textarea
          placeholder="Description"
          value={newReward.description}
          onChange={(e) =>
            setNewReward({ ...newReward, description: e.target.value })
          }
          className="border rounded p-2"
          required
        />
        <button
          type="submit"
          className="bg-blue-600 text-white py-2 rounded hover:bg-blue-800"
        >
          Create Reward
        </button>
      </form>

      {/* Rewards List */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {rewards.map((reward) => (
          <div
            key={reward._id}
            className="bg-white shadow rounded p-4 hover:shadow-lg"
          >
            <h2 className="text-lg font-bold text-blue-600">{reward.name}</h2>
            <p className="text-gray-600">{reward.description}</p>
            <p className="text-yellow-600 font-semibold mt-1">
              {reward.points_required} Points
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
