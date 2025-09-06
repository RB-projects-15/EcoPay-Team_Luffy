import { useEffect, useState } from "react";
import axios from "axios";

export default function MyOrders() {
  const [redemptions, setRedemptions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchRedemptions = async () => {
      const token = localStorage.getItem("token");
      if (!token) {
        setError("Please log in to view your orders.");
        setLoading(false);
        return;
      }

      try {
        const res = await axios.get(
          "http://localhost:5000/api/user/rewards/redemptions/my",
          { headers: { Authorization: `Bearer ${token}` } }
        );

        if (res.data?.success) {
          setRedemptions(res.data.redemptions || []);
        } else {
          setError(res.data?.message || "Failed to fetch your orders.");
        }
      } catch (err) {
        setError(
          err.response?.data?.message ||
            err.message ||
            "Something went wrong while fetching your orders."
        );
      } finally {
        setLoading(false);
      }
    };

    fetchRedemptions();
  }, []);

  if (loading)
    return <p className="text-center mt-6">Loading your orders...</p>;
  if (error) return <p className="text-center text-red-600 mt-6">{error}</p>;
  if (redemptions.length === 0)
    return <p className="text-center text-gray-500 mt-6">No orders found.</p>;

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold text-center mb-6 text-green-700">
        My Reward Orders
      </h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        {redemptions.map((r) => (
          <div
            key={r._id}
            className="bg-white rounded-xl shadow-md p-4 flex flex-col justify-between hover:shadow-xl transition duration-300"
          >
            <h2 className="text-lg font-bold text-green-800">
              {r.reward_name}
            </h2>
            <p className="text-gray-600 mt-1">
              Status:{" "}
              <span
                className={`font-semibold ${
                  r.status === "pending"
                    ? "text-yellow-600"
                    : r.status === "out_for_delivery"
                    ? "text-blue-600"
                    : r.status === "will_reach_today"
                    ? "text-purple-600"
                    : "text-green-600"
                }`}
              >
                {r.status.replace(/_/g, " ")}
              </span>
            </p>
            <p className="text-gray-500 text-sm mt-1">
              Requested at: {new Date(r.requested_at).toLocaleString()}
            </p>
            {r.completed_at && (
              <p className="text-gray-500 text-sm mt-1">
                Completed at: {new Date(r.completed_at).toLocaleString()}
              </p>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
