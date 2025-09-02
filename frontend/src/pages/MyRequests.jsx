// src/pages/MyRequests.jsx
import { useEffect, useState } from "react";
import axios from "axios";
import {
  FaMapMarkerAlt,
  FaTrash,
  FaWeight,
  FaClock,
  FaUser,
  FaPhone,
  FaStickyNote,
  FaCheckCircle,
  FaHourglassHalf,
  FaTimesCircle,
  FaCoins,
} from "react-icons/fa";

export default function MyRequests() {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [selected, setSelected] = useState(null);
  const [timers, setTimers] = useState({}); // countdown timers

  useEffect(() => {
    const fetchRequests = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await axios.get(
          "http://localhost:5000/api/user/my-requests",
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );

        if (res.data.success) {
          setRequests(res.data.requests);

          // Initialize countdown timers for approved requests
          const approvedTimers = {};
          res.data.requests.forEach((req) => {
            if (req.collection_time && req.status === "approved") {
              approvedTimers[req._id] = calculateCountdown(req.collection_time);
            }
          });
          setTimers(approvedTimers);
        } else {
          setError(res.data.message || "Failed to fetch requests");
        }
      } catch (err) {
        setError(err.response?.data?.message || "Something went wrong");
      } finally {
        setLoading(false);
      }
    };

    fetchRequests();
  }, []);

  // Countdown timer updater
  useEffect(() => {
    const interval = setInterval(() => {
      const updatedTimers = { ...timers };
      requests.forEach((req) => {
        if (req.collection_time && req.status === "approved") {
          updatedTimers[req._id] = calculateCountdown(req.collection_time);
        }
      });
      setTimers(updatedTimers);
    }, 1000);

    return () => clearInterval(interval);
  }, [requests, timers]);

  const calculateCountdown = (time) => {
    const diff = new Date(time) - new Date();
    if (diff <= 0) return "Collection time arrived!";
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((diff % (1000 * 60)) / 1000);
    return `${hours}h ${minutes}m ${seconds}s`;
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "approved":
        return "bg-green-100 text-green-700";
      case "completed":
        return "bg-blue-100 text-blue-700";
      case "rejected":
        return "bg-red-100 text-red-700";
      default:
        return "bg-yellow-100 text-yellow-700"; // pending
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case "approved":
        return <FaCheckCircle className="text-green-600" />;
      case "completed":
        return <FaCheckCircle className="text-blue-600" />;
      case "rejected":
        return <FaTimesCircle className="text-red-600" />;
      default:
        return <FaHourglassHalf className="text-yellow-600" />;
    }
  };

  if (loading) return <p className="text-center">Loading...</p>;
  if (error) return <p className="text-center text-red-600">{error}</p>;

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold text-center mb-8 text-green-700">
        My Waste Requests
      </h1>

      {requests.length === 0 ? (
        <p className="text-center text-gray-600">No requests found.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {requests.map((req) => (
            <div
              key={req._id}
              onClick={() => setSelected(req)}
              className="bg-white shadow-lg rounded-2xl overflow-hidden hover:shadow-xl transition duration-300 cursor-pointer"
            >
              {/* Image */}
              {req.image_url ? (
                <img
                  src={`http://localhost:5000${req.image_url}`}
                  alt="Waste"
                  className="w-full h-40 object-cover"
                />
              ) : (
                <div className="w-full h-40 bg-gray-200 flex items-center justify-center text-gray-500">
                  No Image
                </div>
              )}

              {/* Summary */}
              <div className="p-4 space-y-2">
                <h2 className="text-xl font-semibold flex items-center gap-2">
                  <FaTrash className="text-green-600" /> {req.waste_type}
                </h2>
                <p className="flex items-center text-gray-700">
                  <FaWeight className="mr-2 text-gray-500" /> {req.weight} kg
                </p>
                <p className="flex items-center text-gray-700">
                  <FaCoins className="mr-2 text-yellow-500" /> {req.points || 0}{" "}
                  pts
                </p>
                <p className="flex items-center text-gray-700">
                  <FaMapMarkerAlt className="mr-2 text-red-500" />{" "}
                  {req.location}
                </p>

                {/* Countdown */}
                {req.status === "approved" && req.collection_time && (
                  <p className="text-blue-600 font-semibold">
                    🕒 Collection in: {timers[req._id] || "--"}
                  </p>
                )}

                <p className="flex items-center text-gray-500 text-sm">
                  <FaClock className="mr-2" />{" "}
                  {new Date(req.createdAt).toLocaleDateString()}
                </p>
                <span
                  className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(
                    req.status
                  )}`}
                >
                  {getStatusIcon(req.status)} {req.status}
                </span>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modal */}
      {selected && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/50 z-50">
          <div className="bg-white rounded-2xl shadow-2xl w-11/12 md:w-2/3 lg:w-1/2 p-6 relative">
            <button
              onClick={() => setSelected(null)}
              className="absolute top-3 right-3 text-gray-600 hover:text-red-500 text-xl"
            >
              ✕
            </button>

            {/* Image */}
            {selected.image_url && (
              <img
                src={`http://localhost:5000${selected.image_url}`}
                alt="Waste"
                className="w-full h-60 object-cover rounded-xl mb-4"
              />
            )}

            {/* Details */}
            <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
              <FaTrash className="text-green-600" /> {selected.waste_type}
            </h2>
            <div className="space-y-3 mb-6">
              <p className="flex items-center text-gray-700">
                <FaWeight className="mr-2 text-gray-500" /> {selected.weight} kg
              </p>
              <p className="flex items-center text-gray-700">
                <FaCoins className="mr-2 text-yellow-500" />{" "}
                {selected.points || 0} pts
              </p>
              <p className="flex items-center text-gray-700">
                <FaMapMarkerAlt className="mr-2 text-red-500" />{" "}
                {selected.location}
              </p>
              <p className="flex items-center text-gray-700">
                <FaUser className="mr-2 text-blue-500" />{" "}
                {selected.collector_info || "Not Assigned"}
              </p>
              <p className="flex items-center text-gray-700">
                <FaPhone className="mr-2 text-green-500" />{" "}
                {selected.collector_phone || "Not Available"}
              </p>
              {selected.notes && (
                <p className="flex items-start text-gray-700">
                  <FaStickyNote className="mr-2 text-yellow-500 mt-1" />{" "}
                  {selected.notes}
                </p>
              )}
              <p className="flex items-center text-gray-500 text-sm">
                <FaClock className="mr-2" />{" "}
                {new Date(selected.createdAt).toLocaleString()}
              </p>

              {/* Countdown in modal */}
              {selected.status === "approved" && selected.collection_time && (
                <p className="text-blue-600 font-semibold">
                  🕒 Collection in:{" "}
                  {calculateCountdown(selected.collection_time)}
                </p>
              )}
            </div>

            {/* Status Timeline */}
            <div className="border-t pt-4">
              <h3 className="text-lg font-semibold mb-3">Status Timeline</h3>
              <div className="flex items-center justify-between">
                {["pending", "approved", "completed"].map((stage, idx) => (
                  <div
                    key={stage}
                    className="flex flex-col items-center flex-1 relative"
                  >
                    <div
                      className={`w-10 h-10 rounded-full flex items-center justify-center ${
                        selected.status === stage ||
                        (stage === "approved" &&
                          selected.status === "completed")
                          ? getStatusColor(stage)
                          : "bg-gray-200 text-gray-400"
                      }`}
                    >
                      {getStatusIcon(stage)}
                    </div>
                    <p className="text-sm mt-2 capitalize">{stage}</p>
                    {idx < 2 && (
                      <div
                        className={`absolute top-5 right-0 w-full h-1 ${
                          selected.status === "approved" && stage === "pending"
                            ? "bg-green-500"
                            : selected.status === "completed"
                            ? "bg-blue-500"
                            : "bg-gray-300"
                        }`}
                      ></div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
