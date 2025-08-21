// src/pages/MyTransactions.jsx
import { useState, useEffect } from "react";

export default function MyTransactions() {
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user"));
    const token = localStorage.getItem("token");

    if (!user || !token) return;

    const fetchTransactions = async () => {
      try {
        const res = await fetch(
          `http://localhost:5000/api/user/transactions/${user.user_id}`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );

        const data = await res.json();
        if (res.ok) setTransactions(data);
      } catch (err) {
        console.error("Error fetching transactions:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchTransactions();
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-yellow-50 via-green-50 to-pink-50 p-6">
      <h1 className="text-3xl font-bold text-green-800 mb-6">
        My Transactions
      </h1>

      {loading ? (
        <p className="text-gray-600">Loading...</p>
      ) : transactions.length === 0 ? (
        <p className="text-gray-600">No transactions found.</p>
      ) : (
        <div className="overflow-x-auto bg-white shadow-lg rounded-xl">
          <table className="w-full border-collapse">
            <thead className="bg-green-100 text-green-800">
              <tr>
                <th className="p-3 text-left">Date</th>
                <th className="p-3 text-left">Type</th>
                <th className="p-3 text-left">Points</th>
                <th className="p-3 text-left">Description</th>
              </tr>
            </thead>
            <tbody>
              {transactions.map((tx) => (
                <tr key={tx._id} className="border-b hover:bg-green-50">
                  <td className="p-3">
                    {new Date(tx.createdAt).toLocaleString()}
                  </td>
                  <td
                    className={`p-3 font-semibold ${
                      tx.type === "credit" ? "text-green-600" : "text-red-600"
                    }`}
                  >
                    {tx.type}
                  </td>
                  <td className="p-3">{tx.points}</td>
                  <td className="p-3">{tx.description}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
