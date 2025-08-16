// src/pages/Transactions.jsx
export default function Transactions() {
  const transactions = [
    { id: 1, type: "Waste Pickup", points: "+50", date: "2025-08-10" },
    { id: 2, type: "Redeem - T-shirt", points: "-150", date: "2025-08-09" },
    { id: 3, type: "Waste Pickup", points: "+80", date: "2025-08-08" },
  ];

  return (
    <div className="min-h-screen bg-green-50 p-6">
      <h1 className="text-3xl font-bold text-green-700 mb-6">Transactions</h1>
      <div className="bg-white shadow-md rounded-lg overflow-hidden">
        <table className="min-w-full">
          <thead className="bg-green-600 text-white">
            <tr>
              <th className="py-3 px-4 text-left">Date</th>
              <th className="py-3 px-4 text-left">Type</th>
              <th className="py-3 px-4 text-left">Points</th>
            </tr>
          </thead>
          <tbody>
            {transactions.map((t) => (
              <tr key={t.id} className="border-b hover:bg-green-100">
                <td className="py-3 px-4">{t.date}</td>
                <td className="py-3 px-4">{t.type}</td>
                <td
                  className={`py-3 px-4 font-bold ${
                    t.points.startsWith("+") ? "text-green-600" : "text-red-500"
                  }`}
                >
                  {t.points}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
