// admin-frontend/src/pages/Dashboard.jsx
import { useEffect, useState } from "react";
import StatsCard from "../components/StatsCard";
import { fetchRequestStats } from "../services/adminApi";

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
        console.error("Failed to load stats:", err);
      }
    };
    loadStats();
  }, []);

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
      <StatsCard
        title="Total Requests"
        value={stats.total}
        color="bg-green-400"
      />
      <StatsCard
        title="Pending Requests"
        value={stats.pending}
        color="bg-yellow-400"
      />
      <StatsCard
        title="Approved Requests"
        value={stats.approved}
        color="bg-blue-400"
      />
      <StatsCard
        title="Completed Requests"
        value={stats.completed}
        color="bg-green-700"
      />
    </div>
  );
}
