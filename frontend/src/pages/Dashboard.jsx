// src/pages/Dashboard.jsx
export default function Dashboard() {
  const stats = {
    totalPoints: 450,
    totalWaste: "25 kg",
    pickups: 12,
  };

  return (
    <div className="min-h-screen bg-green-50 p-6">
      <h1 className="text-3xl font-bold text-green-700 mb-6">Dashboard</h1>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        <div className="bg-white shadow-lg rounded-xl p-6 text-center">
          <h2 className="text-xl font-semibold text-green-700">Total Points</h2>
          <p className="text-3xl font-bold mt-2">{stats.totalPoints}</p>
        </div>
        <div className="bg-white shadow-lg rounded-xl p-6 text-center">
          <h2 className="text-xl font-semibold text-green-700">
            Waste Recycled
          </h2>
          <p className="text-3xl font-bold mt-2">{stats.totalWaste}</p>
        </div>
        <div className="bg-white shadow-lg rounded-xl p-6 text-center">
          <h2 className="text-xl font-semibold text-green-700">Pickups</h2>
          <p className="text-3xl font-bold mt-2">{stats.pickups}</p>
        </div>
      </div>
    </div>
  );
}
