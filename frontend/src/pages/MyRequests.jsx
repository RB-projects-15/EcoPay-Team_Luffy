// src/pages/MyRequests.jsx
import { useState, useEffect } from "react";

export default function MyRequests() {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user"));
    const token = localStorage.getItem("token");

    if (!user || !token) return;

    const fetchRequests = async () => {
      try {
        const res = await fetch("http://localhost:5000/api/user/waste", {
          method: "GET",
          headers: { Authorization: `Bearer ${token}` },
        });

        const data = await res.json();
        if (res.ok) setRequests(data);
      } catch (err) {
        console.error("Error fetching requests:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchRequests();
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-yellow-50 to-pink-50 p-6">
      <h1 className="text-3xl font-bold text-green-800 mb-6">My Requests</h1>

      {loading ? (
        <p className="text-gray-600">Loading...</p>
      ) : requests.length === 0 ? (
        <p className="text-gray-600">No requests found.</p>
      ) : (
        <div className="grid gap-6">
          {requests.map((req) => (
            <div
              key={req._id}
              className="bg-white shadow-lg rounded-xl p-6 border-l-4 border-green-400"
            >
              <h2 className="text-xl font-semibold text-gray-800">
                {req.waste_type} – {req.weight} kg
              </h2>
              <p className="text-gray-600 mt-2">
                Location: <span className="font-medium">{req.location}</span>
              </p>
              <p className="text-gray-600">
                Status:{" "}
                <span
                  className={`font-bold ${
                    req.status === "approved"
                      ? "text-green-600"
                      : req.status === "pending"
                      ? "text-yellow-600"
                      : "text-red-600"
                  }`}
                >
                  {req.status}
                </span>
              </p>
              {req.collector && (
                <p className="text-gray-600">
                  Collector:{" "}
                  <span className="font-medium">{req.collector.name}</span> (
                  {req.collector.phone})
                </p>
              )}
              <p className="text-gray-500 text-sm mt-2">
                Submitted on: {new Date(req.createdAt).toLocaleString()}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
