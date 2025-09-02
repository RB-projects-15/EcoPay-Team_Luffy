import { useEffect, useState } from "react";
import axios from "axios";
import { FaCoins } from "react-icons/fa";

export default function Store({ onTransactionAdded }) {
  const [rewards, setRewards] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [redeemingId, setRedeemingId] = useState(null);
  const [userPoints, setUserPoints] = useState(0);

  useEffect(() => {
    const fetchRewards = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await axios.get("http://localhost:5000/api/user/rewards", {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (res.data.success) {
          setRewards(res.data.rewards);
        } else {
          setError(res.data.message || "Failed to fetch rewards");
        }

        // Fetch user points
        const profileRes = await axios.get(
          "http://localhost:5000/api/user/profile",
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        if (profileRes.data.success) {
          setUserPoints(profileRes.data.user.points || 0);
        }
      } catch (err) {
        setError(err.response?.data?.message || "Something went wrong");
      } finally {
        setLoading(false);
      }
    };
    fetchRewards();
  }, []);

  const handleRedeem = async (reward) => {
    try {
      setRedeemingId(reward.reward_id);
      const token = localStorage.getItem("token");
      const res = await axios.post(
        "http://localhost:5000/api/user/rewards/redeem",
        { reward_id: reward.reward_id },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (res.data.success) {
        alert(res.data.message);
        // Update user points in real-time
        setUserPoints(res.data.user.points);

        // Add transaction to parent component
        if (onTransactionAdded) {
          onTransactionAdded({
            _id: `temp-${Date.now()}`,
            type: "debit",
            points: reward.points_required,
            description: `Redeemed ${reward.name}`,
            createdAt: new Date().toISOString(),
          });
        }
      } else {
        alert(res.data.message);
      }
    } catch (err) {
      alert(err.response?.data?.message || "Something went wrong");
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
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {rewards.map((reward) => (
          <div
            key={reward.reward_id}
            className="bg-white rounded-xl shadow-md p-4 flex flex-col justify-between hover:shadow-xl transition duration-300"
          >
            <img
              src={`/images/rewards/${reward.reward_id}.png`}
              alt={reward.name}
              className="w-full h-40 object-cover rounded-lg mb-4"
            />
            <div className="flex flex-col gap-1">
              <h2 className="text-lg font-bold text-green-800">
                {reward.name}
              </h2>
              <p className="text-gray-600 text-sm">{reward.description}</p>
              <p className="text-yellow-600 font-semibold mt-1">
                {reward.points_required} Points
              </p>
            </div>
            <button
              disabled={
                userPoints < reward.points_required ||
                redeemingId === reward.reward_id
              }
              onClick={() => handleRedeem(reward)}
              className={`mt-4 px-4 py-2 rounded-lg font-medium text-white transition ${
                userPoints >= reward.points_required
                  ? "bg-green-600 hover:bg-green-700"
                  : "bg-gray-400 cursor-not-allowed"
              }`}
            >
              {redeemingId === reward.reward_id ? "Redeeming..." : "Redeem"}
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
