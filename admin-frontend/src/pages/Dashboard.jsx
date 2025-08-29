// src/pages/Dashboard.jsx
import { useEffect, useState } from "react";
import { fetchRequestStats } from "../services/adminApi";
import {
  FaRecycle,
  FaClock,
  FaCheckCircle,
  FaClipboardCheck,
} from "react-icons/fa";

export default function Dashboard() {
  const [stats, setStats] = useState({
    total: 0,
    pending: 0,
    approved: 0,
    completed: 0,
  });

  useEffect(() => {
    const loadStats = async () => {
      try {
        const data = await fetchRequestStats();
        setStats(data);
      } catch (error) {
        console.error("Error fetching stats:", error);
      }
    };
    loadStats();
  }, []);

  return (
    <div className="p-6 min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      {/* Page Header */}
      <h1 className="text-3xl font-bold text-gray-800 mb-6">
        📊 Admin Dashboard
      </h1>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {/* Total Requests */}
        <div className="bg-white rounded-2xl shadow p-6 flex items-center gap-4 hover:shadow-lg transition">
          <FaRecycle className="text-green-500 text-3xl" />
          <div>
            <p className="text-gray-500">Total Requests</p>
            <h2 className="text-2xl font-bold">{stats.total}</h2>
          </div>
        </div>

        {/* Pending Requests */}
        <div className="bg-white rounded-2xl shadow p-6 flex items-center gap-4 hover:shadow-lg transition">
          <FaClock className="text-yellow-500 text-3xl" />
          <div>
            <p className="text-gray-500">Pending</p>
            <h2 className="text-2xl font-bold">{stats.pending}</h2>
          </div>
        </div>

        {/* Approved Requests */}
        <div className="bg-white rounded-2xl shadow p-6 flex items-center gap-4 hover:shadow-lg transition">
          <FaCheckCircle className="text-blue-500 text-3xl" />
          <div>
            <p className="text-gray-500">Approved</p>
            <h2 className="text-2xl font-bold">{stats.approved}</h2>
          </div>
        </div>

        {/* Completed Requests */}
        <div className="bg-white rounded-2xl shadow p-6 flex items-center gap-4 hover:shadow-lg transition">
          <FaClipboardCheck className="text-purple-500 text-3xl" />
          <div>
            <p className="text-gray-500">Completed</p>
            <h2 className="text-2xl font-bold">{stats.completed}</h2>
          </div>
        </div>
      </div>

      {/* Placeholder for charts / future insights */}
      <div className="bg-white rounded-2xl shadow p-6 text-gray-500 text-center">
        📈 Analytics and recent requests will appear here soon.
      </div>
    </div>
  );
}
