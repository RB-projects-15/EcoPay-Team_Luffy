// src/pages/Dashboard.jsx
import { useEffect, useState } from "react";
import { fetchRequestStats } from "../services/adminApi";
import StatsCard from "../components/StatsCard";

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
      } catch (err) {
        console.error("Error fetching stats:", err);
      }
    };
    loadStats();
  }, []);

  return (
    <div className="p-6">
      <h2 className="text-3xl font-bold text-green-800 mb-8">
        Admin Dashboard
      </h2>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
        <StatsCard
          title="Total Requests"
          value={stats.total}
          color="bg-gray-700 text-white"
          icon="📋"
        />
        <StatsCard
          title="Pending"
          value={stats.pending}
          color="bg-yellow-400 text-gray-800"
          icon="⏳"
        />
        <StatsCard
          title="Approved"
          value={stats.approved}
          color="bg-blue-600 text-white"
          icon="✅"
        />
        <StatsCard
          title="Completed"
          value={stats.completed}
          color="bg-green-600 text-white"
          icon="🏁"
        />
      </div>
    </div>
  );
}
