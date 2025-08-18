import React, { useEffect, useState } from "react";

export default function AdminRequests() {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("pending");

  const fetchRequests = async () => {
    try {
      setLoading(true);
      const res = await fetch("http://localhost:3000/api/waste/requests");
      const data = await res.json();
      setRequests(data);
    } catch (err) {
      console.error("Error fetching requests:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async (id) => {
    try {
      await fetch(`http://localhost:3000/api/waste/requests/${id}/approve`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ collector_info: "John Doe - 9876543210" }),
      });
      fetchRequests();
    } catch (err) {
      console.error("Error approving request:", err);
    }
  };

  const handleComplete = async (id) => {
    try {
      await fetch(`http://localhost:3000/api/waste/requests/${id}/complete`, {
        method: "POST",
      });
      fetchRequests();
    } catch (err) {
      console.error("Error completing request:", err);
    }
  };

  useEffect(() => {
    fetchRequests();
  }, []);

  if (loading) return <p className="text-center mt-10">Loading requests...</p>;

  // Filter requests by status
  const filteredRequests = requests.filter(
    (req) => req.status?.toLowerCase() === activeTab
  );

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold">Waste Pickup Requests</h2>
        {/* Refresh Button */}
        <button
          onClick={fetchRequests}
          className="bg-indigo-600 text-white px-4 py-2 rounded-full font-semibold hover:bg-indigo-700 transition"
        >
          🔄 Refresh
        </button>
      </div>

      {/* Tabs */}
      <div className="flex gap-4 mb-6">
        {["pending", "approved", "completed"].map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-4 py-2 rounded-full font-semibold ${
              activeTab === tab
                ? "bg-green-600 text-white"
                : "bg-gray-200 text-gray-700 hover:bg-gray-300"
            }`}
          >
            {tab.charAt(0).toUpperCase() + tab.slice(1)}
          </button>
        ))}
      </div>

      {/* Table */}
      {filteredRequests.length === 0 ? (
        <p className="text-gray-600">No {activeTab} requests found.</p>
      ) : (
        <table className="w-full border border-gray-300">
          <thead>
            <tr className="bg-gray-200 text-left">
              <th className="p-2">User ID</th>
              <th className="p-2">Waste Type</th>
              <th className="p-2">Weight (kg)</th>
              <th className="p-2">Location</th>
              <th className="p-2">Coords</th>
              <th className="p-2">Contact</th>
              <th className="p-2">Notes</th>
              <th className="p-2">Status</th>
              <th className="p-2">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredRequests.map((req) => (
              <tr key={req._id} className="border-t border-gray-300">
                <td className="p-2">{req.user_id}</td>
                <td className="p-2">{req.waste_type}</td>
                <td className="p-2">{req.weight}</td>
                <td className="p-2">{req.location}</td>
                <td className="p-2 text-sm text-gray-600">
                  {req.coords
                    ? `${req.coords.lat.toFixed(4)}, ${req.coords.lng.toFixed(
                        4
                      )}`
                    : "-"}
                </td>
                <td className="p-2">{req.contact || "-"}</td>
                <td className="p-2">{req.notes || "-"}</td>
                <td className="p-2 font-semibold capitalize">{req.status}</td>
                <td className="p-2 space-x-2">
                  {req.status === "pending" && (
                    <button
                      className="bg-blue-500 text-white px-3 py-1 rounded"
                      onClick={() => handleApprove(req._id)}
                    >
                      Approve
                    </button>
                  )}
                  {req.status === "approved" && (
                    <button
                      className="bg-green-500 text-white px-3 py-1 rounded"
                      onClick={() => handleComplete(req._id)}
                    >
                      Complete
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
