// src/pages/MyOrders.jsx
import { useEffect, useState } from "react";
import axios from "axios";
import { FaClock, FaBox, FaTruck, FaCheckCircle, FaUser } from "react-icons/fa";

const deliveryGuys = [
  { name: "Rahul Sharma", contact: "+91 98765 43210" },
  { name: "Priya Singh", contact: "+91 91234 56789" },
  { name: "Ankit Verma", contact: "+91 99887 66554" },
  { name: "Sneha Patel", contact: "+91 90123 45678" },
];

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

  const getStatusIcon = (status) => {
    switch (status) {
      case "pending":
        return <FaClock className="text-yellow-500" />;
      case "out_for_delivery":
        return <FaTruck className="text-blue-500" />;
      case "will_reach_today":
        return <FaBox className="text-purple-500" />;
      case "completed":
        return <FaCheckCircle className="text-green-600" />;
      default:
        return <FaClock className="text-gray-400" />;
    }
  };

  const getStatusBadge = (status) => {
    const baseClass =
      "px-3 py-1 rounded-full text-xs font-medium flex items-center gap-1 w-fit";
    switch (status) {
      case "pending":
        return (
          <span className={`${baseClass} bg-yellow-100 text-yellow-700`}>
            {getStatusIcon(status)} Pending
          </span>
        );
      case "out_for_delivery":
        return (
          <span className={`${baseClass} bg-blue-100 text-blue-700`}>
            {getStatusIcon(status)} Out for delivery
          </span>
        );
      case "will_reach_today":
        return (
          <span className={`${baseClass} bg-purple-100 text-purple-700`}>
            {getStatusIcon(status)} Will reach today
          </span>
        );
      case "completed":
        return (
          <span className={`${baseClass} bg-green-100 text-green-700`}>
            {getStatusIcon(status)} Completed
          </span>
        );
      default:
        return (
          <span className={`${baseClass} bg-gray-100 text-gray-600`}>
            {getStatusIcon(status)} Unknown
          </span>
        );
    }
  };

  if (loading)
    return (
      <p className="text-center mt-6 text-gray-500">Loading your orders...</p>
    );
  if (error) return <p className="text-center text-red-600 mt-6">{error}</p>;
  if (redemptions.length === 0)
    return (
      <div className="flex flex-col items-center justify-center mt-20">
        <FaBox className="text-gray-400 text-6xl mb-4" />
        <p className="text-gray-500 text-lg">No reward orders found.</p>
      </div>
    );

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold text-center mb-8 text-green-700">
        My Reward Orders
      </h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {redemptions.map((r) => {
          // Random delivery guy
          const deliveryGuy =
            deliveryGuys[Math.floor(Math.random() * deliveryGuys.length)];

          // Estimated delivery date (5 business days)
          const requestedDate = new Date(r.requested_at);
          const deliveryDate = new Date(requestedDate);
          deliveryDate.setDate(deliveryDate.getDate() + 7); // approx. 5 business days

          return (
            <div
              key={r._id}
              className="bg-white rounded-xl shadow-lg p-5 flex flex-col justify-between hover:shadow-xl transition duration-300"
            >
              {/* Header */}
              <h2 className="text-lg font-bold text-gray-800 mb-2">
                {r.reward_name}
              </h2>

              {/* Status Badge */}
              {getStatusBadge(r.status)}

              {/* Dates */}
              <div className="mt-3 text-sm text-gray-600 space-y-1">
                <p>
                  <strong>Requested:</strong> {requestedDate.toLocaleString()}
                </p>
                {r.completed_at && (
                  <p>
                    <strong>Completed:</strong>{" "}
                    {new Date(r.completed_at).toLocaleString()}
                  </p>
                )}
                <p>
                  <strong>Estimated Delivery:</strong>{" "}
                  {deliveryDate.toLocaleDateString()}
                </p>
              </div>

              {/* Delivery Info */}
              <div className="mt-3 text-sm text-gray-700 flex items-center gap-2">
                <FaUser className="text-green-600" />
                <div>
                  <p className="font-medium">{deliveryGuy.name}</p>
                  <p>{deliveryGuy.contact}</p>
                </div>
              </div>

              {/* Progress bar */}
              <div className="mt-4">
                <div className="w-full bg-gray-200 rounded-full h-2.5">
                  <div
                    className={`h-2.5 rounded-full transition-all duration-500 ${
                      r.status === "pending"
                        ? "bg-yellow-500 w-1/4"
                        : r.status === "out_for_delivery"
                        ? "bg-blue-500 w-2/4"
                        : r.status === "will_reach_today"
                        ? "bg-purple-500 w-3/4"
                        : "bg-green-600 w-full"
                    }`}
                  ></div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
