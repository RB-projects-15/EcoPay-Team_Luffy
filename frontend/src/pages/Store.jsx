import { useEffect, useState } from "react";
import axios from "axios";
import { FaCoins } from "react-icons/fa";

export default function Store({ onTransactionAdded }) {
  const [rewards, setRewards] = useState([]);
  const [userPoints, setUserPoints] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [redeemingId, setRedeemingId] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      const token = localStorage.getItem("token");
      if (!token) {
        setError("Please log in to view and redeem rewards.");
        setLoading(false);
        return;
      }

      try {
        // Fetch rewards (DB-driven)
        const [rewardsRes, profileRes] = await Promise.all([
          axios.get("http://localhost:5000/api/user/rewards/all", {
            headers: { Authorization: `Bearer ${token}` },
          }),
          axios.get("http://localhost:5000/api/user/profile", {
            headers: { Authorization: `Bearer ${token}` },
          }),
        ]);

        if (rewardsRes.data?.success) {
          setRewards(rewardsRes.data.rewards || []);
        } else {
          setError(rewardsRes.data?.message || "Failed to fetch rewards.");
        }

        if (profileRes.data?.success) {
          setUserPoints(profileRes.data.user?.points || 0);
        } else {
          setError(profileRes.data?.message || "Failed to fetch profile.");
        }
      } catch (err) {
        setError(
          err.response?.data?.message ||
            err.message ||
            "Something went wrong while loading rewards."
        );
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleRedeem = async (reward) => {
    const token = localStorage.getItem("token");
    if (!token) {
      alert("Please log in to redeem rewards.");
      return;
    }

    try {
      setRedeemingId(reward._id);

      const res = await axios.post(
        "http://localhost:5000/api/user/rewards/redeem/create",
        { reward_id: reward._id },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (res.data?.success) {
        alert(res.data.message || "Redemption submitted.");

        // Optimistically update points (backend already deducted)
        setUserPoints((prev) =>
          Math.max(0, prev - (reward.points_required || 0))
        );

        // Notify parent so it can append a transaction entry if needed
        if (onTransactionAdded) {
          onTransactionAdded({
            _id: `temp-${Date.now()}`,
            type: "debit",
            points: reward.points_required,
            description: `Redeemed reward: ${reward.name}`,
            createdAt: new Date().toISOString(),
          });
        }
      } else {
        alert(res.data?.message || "Could not redeem reward.");
      }
    } catch (err) {
      alert(
        err.response?.data?.message ||
          err.message ||
          "Something went wrong while redeeming."
      );
    } finally {
      setRedeemingId(null);
    }
  };

  if (loading) return <p className="text-center mt-6">Loading rewards...</p>;
  if (error) return <p className="text-center text-red-600 mt-6">{error}</p>;

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold text-center mb-6 text-green-700">
        Reward Store
      </h1>

      <p className="text-center text-gray-700 mb-6 flex justify-center items-center gap-2">
        <FaCoins className="text-yellow-500" /> Your Points: {userPoints}
      </p>

      {rewards.length === 0 ? (
        <p className="text-center text-gray-500">No rewards available.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {rewards.map((reward) => (
            <div
              key={reward._id}
              className="bg-white rounded-xl shadow-md p-4 flex flex-col justify-between hover:shadow-xl transition duration-300"
            >
              <div className="flex flex-col gap-1">
                <h2 className="text-lg font-bold text-green-800">
                  {reward.name}
                </h2>
                <p className="text-gray-600 text-sm">
                  {reward.description || "No description"}
                </p>
                <p className="text-yellow-600 font-semibold mt-1">
                  {reward.points_required} Points
                </p>
              </div>

              <button
                disabled={
                  userPoints < reward.points_required ||
                  redeemingId === reward._id
                }
                onClick={() => handleRedeem(reward)}
                className={`mt-4 px-4 py-2 rounded-lg font-medium text-white transition ${
                  userPoints >= reward.points_required
                    ? "bg-green-600 hover:bg-green-700"
                    : "bg-gray-400 cursor-not-allowed"
                }`}
              >
                {redeemingId === reward._id ? "Redeeming..." : "Redeem"}
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
