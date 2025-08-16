// src/pages/AdminDashboard.jsx
import { useEffect, useState } from "react";

export default function AdminDashboard() {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(false);
  const [collectorInfo, setCollectorInfo] = useState("");

  const fetchRequests = async () => {
    setLoading(true);
    try {
      const res = await fetch("http://localhost:3000/api/waste/requests");
      const data = await res.json();
      setRequests(data);
    } catch (err) {
      console.error("Error fetching requests", err);
    } finally {
      setLoading(false);
    }
  };

  const approveRequest = async (id) => {
    try {
      const res = await fetch(
        `http://localhost:3000/api/waste/request/${id}/approve`,
        {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ collector_info: collectorInfo }),
        }
      );
      if (res.ok) {
        alert("Request approved!");
        fetchRequests();
      }
    } catch (err) {
      console.error("Error approving request", err);
    }
  };

  const completeRequest = async (id) => {
    try {
      const res = await fetch(
        `http://localhost:3000/api/waste/request/${id}/complete`,
        {
          method: "PATCH",
        }
      );
      if (res.ok) {
        alert("Request marked as completed!");
        fetchRequests();
      }
    } catch (err) {
      console.error("Error completing request", err);
    }
  };

  useEffect(() => {
    fetchRequests();
  }, []);

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <h1 className="text-2xl font-bold mb-6">Admin Waste Pickup Requests</h1>

      {loading ? (
        <p>Loading requests...</p>
      ) : requests.length === 0 ? (
        <p>No waste pickup requests found.</p>
      ) : (
        <table className="w-full bg-white rounded shadow">
          <thead>
            <tr className="bg-green-600 text-white">
              <th className="p-3 text-left">User ID</th>
              <th className="p-3 text-left">Waste Type</th>
              <th className="p-3 text-left">Weight</th>
              <th className="p-3 text-left">Location</th>
              <th className="p-3 text-left">Status</th>
              <th className="p-3 text-left">Actions</th>
            </tr>
          </thead>
          <tbody>
            {requests.map((req) => (
              <tr key={req.id} className="border-b">
                <td className="p-3">{req.user_id}</td>
                <td className="p-3">{req.waste_type}</td>
                <td className="p-3">{req.weight} kg</td>
                <td className="p-3">{req.location}</td>
                <td className="p-3">{req.status}</td>
                <td className="p-3 flex gap-2">
                  {req.status === "Pending" && (
                    <>
                      <input
                        type="text"
                        placeholder="Collector info"
                        value={collectorInfo}
                        onChange={(e) => setCollectorInfo(e.target.value)}
                        className="border p-1 rounded"
                      />
                      <button
                        onClick={() => approveRequest(req.id)}
                        className="bg-blue-500 text-white px-3 py-1 rounded"
                      >
                        Approve
                      </button>
                    </>
                  )}
                  {req.status === "Approved" && (
                    <button
                      onClick={() => completeRequest(req.id)}
                      className="bg-green-500 text-white px-3 py-1 rounded"
                    >
                      Mark Completed
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
