// src/pages/Reports.jsx
import { useEffect, useState } from "react";
import { fetchReports } from "../services/adminApi";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  Legend,
} from "recharts";

export default function Reports() {
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);

  const loadReports = async () => {
    try {
      setLoading(true);
      const data = await fetchReports();
      setReports(data?.reports);
    } catch (err) {
      console.error("Error fetching reports:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadReports();
  }, []);

  // ✅ Process data for charts
  const statusCounts = ["pending", "approved", "completed"].map((status) => ({
    status,
    count: reports?.filter((r) => r.status === status).length,
  }));

  const monthlyData = reports?.reduce((acc, req) => {
    if (!req.createdAt) return acc;
    const month = new Date(req.createdAt).toLocaleString("default", {
      month: "short",
      year: "numeric",
    });
    const existing = acc.find((item) => item.month === month);
    if (existing) {
      existing.total += 1;
    } else {
      acc.push({ month, total: 1 });
    }
    return acc;
  }, []);

  return (
    <div className="p-6 min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <h1 className="text-3xl font-bold text-gray-800 mb-6">📊 Reports</h1>

      {loading ? (
        <div className="text-center text-gray-500">Loading reports...</div>
      ) : reports?.length === 0 ? (
        <div className="text-center text-gray-500">No reports available.</div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* ✅ Status Overview Chart */}
          <div className="bg-white shadow rounded-2xl p-6">
            <h2 className="text-xl font-semibold text-gray-700 mb-4">
              Requests by Status
            </h2>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={statusCounts}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="status" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="count" fill="#3B82F6" radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* ✅ Monthly Trends */}
          <div className="bg-white shadow rounded-2xl p-6">
            <h2 className="text-xl font-semibold text-gray-700 mb-4">
              Monthly Request Trends
            </h2>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={monthlyData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Line
                  type="monotone"
                  dataKey="total"
                  stroke="#10B981"
                  strokeWidth={3}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>

          {/* ✅ Detailed Reports Table */}
          <div className="bg-white shadow rounded-2xl p-6 lg:col-span-2">
            <h2 className="text-xl font-semibold text-gray-700 mb-4">
              All Requests
            </h2>
            <div className="overflow-x-auto">
              <table className="min-w-full border-collapse">
                <thead>
                  <tr className="bg-gray-100 text-left">
                    <th className="p-3 text-sm font-semibold text-gray-600">
                      User
                    </th>
                    <th className="p-3 text-sm font-semibold text-gray-600">
                      Waste Type
                    </th>
                    <th className="p-3 text-sm font-semibold text-gray-600">
                      Status
                    </th>
                    <th className="p-3 text-sm font-semibold text-gray-600">
                      Date
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {reports?.map((req) => (
                    <tr key={req._id} className="border-t hover:bg-gray-50">
                      <td className="p-3">{req.user?.name || "N/A"}</td>
                      <td className="p-3">{req.type || "N/A"}</td>
                      <td
                        className={`p-3 font-medium ${
                          req.status === "pending"
                            ? "text-yellow-500"
                            : req.status === "approved"
                            ? "text-blue-500"
                            : "text-green-600"
                        }`}
                      >
                        {req.status}
                      </td>
                      <td className="p-3">
                        {req.createdAt
                          ? new Date(req.createdAt).toLocaleDateString()
                          : "-"}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
