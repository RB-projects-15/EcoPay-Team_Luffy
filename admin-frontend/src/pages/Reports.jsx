// admin-frontend/src/pages/Reports.jsx
import { useEffect, useState } from "react";
import { fetchReports } from "../services/adminApi";
import {
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
  XAxis,
  YAxis,
  ResponsiveContainer,
} from "recharts";

const COLORS = ["#4CAF50", "#00C49F", "#FFBB28", "#FF8042"];

export default function Reports() {
  const [data, setData] = useState([]);

  useEffect(() => {
    const loadReports = async () => {
      try {
        const requests = await fetchReports();
        const grouped = requests.reduce((acc, r) => {
          acc[r.waste_type] = (acc[r.waste_type] || 0) + 1;
          return acc;
        }, {});
        setData(
          Object.keys(grouped).map((key) => ({
            type: key,
            count: grouped[key],
          }))
        );
      } catch (err) {
        console.error("Error fetching reports:", err);
      }
    };
    loadReports();
  }, []);

  return (
    <div className="flex flex-col gap-6 p-6 bg-gray-50 min-h-screen">
      <h2 className="text-3xl font-bold mb-4 text-green-700">Reports</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Bar Chart */}
        <div className="bg-white rounded-2xl shadow-lg p-6 hover:shadow-2xl transition-shadow duration-300">
          <h3 className="text-xl font-semibold mb-4 text-green-700">
            Waste Type Distribution
          </h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={data}>
              <XAxis dataKey="type" tick={{ fill: "#4A5568" }} />
              <YAxis tick={{ fill: "#4A5568" }} />
              <Tooltip />
              <Legend />
              <Bar dataKey="count" fill="#4CAF50" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Pie Chart */}
        <div className="bg-white rounded-2xl shadow-lg p-6 hover:shadow-2xl transition-shadow duration-300">
          <h3 className="text-xl font-semibold mb-4 text-green-700">
            Waste Type Share
          </h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={data}
                dataKey="count"
                nameKey="type"
                cx="50%"
                cy="50%"
                outerRadius={100}
                label={{ fill: "#4A5568", fontSize: 14 }}
              >
                {data.map((_, i) => (
                  <Cell key={i} fill={COLORS[i % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}
