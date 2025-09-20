import { useEffect, useState } from "react";
import axios from "axios";
import { FaCoins } from "react-icons/fa";

export default function Store({ onTransactionAdded }) {
  const [rewards, setRewards] = useState([]);
  const [userPoints, setUserPoints] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // For redeem modals
  const [selectedReward, setSelectedReward] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [showConfirm, setShowConfirm] = useState(false);
  const [redeeming, setRedeeming] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      const token = localStorage.getItem("token");
      if (!token) {
        setError("Please log in to view and redeem rewards.");
        setLoading(false);
        return;
      }

      try {
        const [rewardsRes, profileRes] = await Promise.all([
          axios.get("http://localhost:5000/api/user/rewards/all", {
            headers: { Authorization: `Bearer ${token}` },
          }),
          axios.get("http://localhost:5000/api/user/profile", {
            headers: { Authorization: `Bearer ${token}` },
          }),
        ]);

        if (rewardsRes.data?.success) setRewards(rewardsRes.data.rewards || []);
        else setError(rewardsRes.data?.message || "Failed to fetch rewards.");

        if (profileRes.data?.success)
          setUserPoints(profileRes.data.user?.points || 0);
        else setError(profileRes.data?.message || "Failed to fetch profile.");
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

  const openQuantityModal = (reward) => {
    setSelectedReward(reward);
    setQuantity(1);
    setShowConfirm(false);
  };

  const proceedToConfirm = () => setShowConfirm(true);

  // Redeem each quantity individually
  const handleRedeem = async () => {
    if (!selectedReward) return;
    const token = localStorage.getItem("token");
    if (!token) {
      alert("Please log in to redeem rewards.");
      return;
    }

    setRedeeming(true);
    try {
      for (let i = 0; i < quantity; i++) {
        const res = await axios.post(
          "http://localhost:5000/api/user/rewards/redeem/create",
          { reward_id: selectedReward._id, quantity: 1 },
          { headers: { Authorization: `Bearer ${token}` } }
        );

        if (!res.data?.success) {
          alert(res.data?.message || "Could not redeem reward.");
          break;
        }

        // Update points after each successful redemption
        setUserPoints((prev) =>
          Math.max(0, prev - selectedReward.points_required)
        );

        if (onTransactionAdded) {
          onTransactionAdded({
            _id: `temp-${Date.now()}-${i}`,
            type: "debit",
            points: selectedReward.points_required,
            description: `Redeemed 1 × ${selectedReward.name}`,
            createdAt: new Date().toISOString(),
          });
        }
      }

      alert("Redemption completed!");
    } catch (err) {
      alert(
        err.response?.data?.message ||
          err.message ||
          "Something went wrong while redeeming."
      );
    } finally {
      setRedeeming(false);
      setSelectedReward(null);
      setShowConfirm(false);
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
                disabled={userPoints < reward.points_required}
                onClick={() => openQuantityModal(reward)}
                className={`mt-4 px-4 py-2 rounded-lg font-medium text-white transition ${
                  userPoints >= reward.points_required
                    ? "bg-green-600 hover:bg-green-700"
                    : "bg-gray-400 cursor-not-allowed"
                }`}
              >
                Redeem
              </button>
            </div>
          ))}
        </div>
      )}

      {/* Quantity Modal */}
      {selectedReward && !showConfirm && (
        <div className="fixed inset-0 bg-gray-200 bg-opacity-70 flex justify-center items-center">
          <div className="bg-white p-8 rounded-2xl shadow-xl w-[28rem]">
            <h2 className="text-2xl font-bold mb-6 text-green-700">
              Redeem {selectedReward.name}
            </h2>

            <label className="block mb-2 text-gray-700 font-medium">
              Quantity
            </label>
            <input
              type="number"
              min="1"
              value={quantity}
              onChange={(e) => setQuantity(Math.max(1, Number(e.target.value)))}
              className="w-full border rounded-lg px-4 py-2 mb-5 text-lg"
            />

            <p className="mb-6 text-gray-700 text-lg">
              Total Points Required:{" "}
              <span className="font-semibold text-yellow-600">
                {selectedReward.points_required * quantity}
              </span>
            </p>

            <div className="flex justify-end gap-4">
              <button
                onClick={() => setSelectedReward(null)}
                className="px-5 py-2 rounded-lg border border-gray-400 text-gray-600 hover:bg-gray-100"
              >
                Cancel
              </button>
              <button
                onClick={proceedToConfirm}
                disabled={
                  userPoints < selectedReward.points_required * quantity
                }
                className="px-5 py-2 rounded-lg bg-green-600 text-white hover:bg-green-700 disabled:opacity-50"
              >
                Proceed
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Confirm Modal */}
      {selectedReward && showConfirm && (
        <div className="fixed inset-0 bg-gray-200 bg-opacity-70 flex justify-center items-center">
          <div className="bg-white p-8 rounded-2xl shadow-xl w-[28rem]">
            <h2 className="text-2xl font-bold mb-6 text-green-700">
              Confirm Your Order
            </h2>

            <p className="mb-4 text-lg">
              Are you sure you want to redeem{" "}
              <span className="font-semibold">{quantity}</span> ×{" "}
              <span className="font-semibold">{selectedReward.name}</span> for{" "}
              <span className="font-semibold text-yellow-600">
                {selectedReward.points_required * quantity} Points
              </span>
              ?
            </p>

            <p className="mb-6 text-gray-700 text-lg">
              Remaining Balance:{" "}
              <span className="font-semibold text-green-600">
                {Math.max(
                  userPoints - selectedReward.points_required * quantity,
                  0
                )}{" "}
                Points
              </span>
            </p>

            <div className="flex justify-end gap-4">
              <button
                onClick={() => setSelectedReward(null)}
                className="px-5 py-2 rounded-lg border border-gray-400 text-gray-600 hover:bg-gray-100"
              >
                Cancel
              </button>
              <button
                onClick={handleRedeem}
                disabled={redeeming}
                className="px-5 py-2 rounded-lg bg-green-600 text-white hover:bg-green-700 disabled:opacity-50"
              >
                {redeeming ? "Processing..." : "Confirm"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
