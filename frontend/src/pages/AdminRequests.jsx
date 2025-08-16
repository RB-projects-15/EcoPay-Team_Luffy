import React, { useEffect, useState } from "react";

export default function AdminRequests() {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchRequests = async () => {
    try {
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

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-4">Waste Pickup Requests</h2>
      <table className="w-full border border-gray-300">
        <thead>
          <tr className="bg-gray-200 text-left">
            <th className="p-2">User ID</th>
            <th className="p-2">Waste Type</th>
            <th className="p-2">Weight (kg)</th>
            <th className="p-2">Location</th>
            <th className="p-2">Status</th>
            <th className="p-2">Actions</th>
          </tr>
        </thead>
        <tbody>
          {requests.map((req) => (
            <tr key={req.id} className="border-t border-gray-300">
              <td className="p-2">{req.user_id}</td>
              <td className="p-2">{req.waste_type}</td>
              <td className="p-2">{req.weight}</td>
              <td className="p-2">{req.location}</td>
              <td className="p-2 font-semibold">{req.status}</td>
              <td className="p-2 space-x-2">
                {req.status === "Pending" && (
                  <button
                    className="bg-blue-500 text-white px-3 py-1 rounded"
                    onClick={() => handleApprove(req.id)}
                  >
                    Approve
                  </button>
                )}
                {req.status === "Approved" && (
                  <button
                    className="bg-green-500 text-white px-3 py-1 rounded"
                    onClick={() => handleComplete(req.id)}
                  >
                    Complete
                  </button>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
