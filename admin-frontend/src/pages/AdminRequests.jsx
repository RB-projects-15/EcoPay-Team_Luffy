// admin-frontend/src/pages/AdminRequests.jsx
import { useEffect, useState } from "react";
import {
  fetchRequests,
  approveRequest,
  completeRequest,
} from "../services/adminApi";

export default function AdminRequests() {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loadRequests();
  }, []);

  const loadRequests = async () => {
    setLoading(true);
    try {
      const data = await fetchRequests();
      setRequests(data || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async (id) => {
    const collector_info = prompt("Enter collector name & phone:")?.trim();
    if (!collector_info) return;
    try {
      await approveRequest(id, { collector_info });
      loadRequests();
    } catch (err) {
      console.error(err);
    }
  };

  const handleComplete = async (id) => {
    try {
      await completeRequest(id);
      loadRequests();
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <h1 className="text-3xl font-bold text-green-700 mb-6">
        Waste Pickup Requests
      </h1>

      <div className="overflow-x-auto bg-white rounded-xl shadow-lg border border-gray-200">
        <table className="min-w-full text-left text-gray-700">
          <thead>
            <tr className="bg-gradient-to-r from-green-600 to-green-500 text-white">
              <th className="px-6 py-3 font-semibold">User</th>
              <th className="px-6 py-3 font-semibold">Phone</th>
              <th className="px-6 py-3 font-semibold">Waste Type</th>
              <th className="px-6 py-3 font-semibold">Weight (kg)</th>
              <th className="px-6 py-3 font-semibold">Location</th>
              <th className="px-6 py-3 font-semibold">Status</th>
              <th className="px-6 py-3 font-semibold">Actions</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td
                  colSpan="7"
                  className="text-center py-6 text-gray-500 font-medium"
                >
                  Loading requests...
                </td>
              </tr>
            ) : requests.length === 0 ? (
              <tr>
                <td
                  colSpan="7"
                  className="text-center py-6 text-gray-500 font-medium"
                >
                  No requests available
                </td>
              </tr>
            ) : (
              requests.map((req) => (
                <tr
                  key={req._id}
                  className="border-t hover:bg-green-50 transition"
                >
                  <td className="px-6 py-3">{req.user_name}</td>
                  <td className="px-6 py-3">{req.phone}</td>
                  <td className="px-6 py-3">{req.waste_type}</td>
                  <td className="px-6 py-3">{req.weight}</td>
                  <td className="px-6 py-3">{req.location}</td>
                  <td className="px-6 py-3">
                    <span
                      className={`px-3 py-1 rounded-full text-sm font-semibold ${
                        req.status === "pending"
                          ? "bg-yellow-100 text-yellow-700"
                          : req.status === "approved"
                          ? "bg-blue-100 text-blue-700"
                          : "bg-green-100 text-green-700"
                      }`}
                    >
                      {req.status}
                    </span>
                  </td>
                  <td className="px-6 py-3 space-x-2">
                    {req.status === "pending" && (
                      <button
                        onClick={() => handleApprove(req._id)}
                        className="bg-blue-500 text-white px-4 py-2 rounded-lg font-medium shadow hover:bg-blue-600 transition"
                      >
                        Approve
                      </button>
                    )}
                    {req.status === "approved" && (
                      <button
                        onClick={() => handleComplete(req._id)}
                        className="bg-green-500 text-white px-4 py-2 rounded-lg font-medium shadow hover:bg-green-600 transition"
                      >
                        Complete
                      </button>
                    )}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
