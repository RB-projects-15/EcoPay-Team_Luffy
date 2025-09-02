// src/pages/MyTransactions.jsx
import { useEffect, useState } from "react";
import axios from "axios";
import { FaArrowUp, FaArrowDown } from "react-icons/fa";

export default function MyTransactions() {
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchTransactions = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await axios.get(
          "http://localhost:5000/api/user/transactions",
          { headers: { Authorization: `Bearer ${token}` } }
        );

        if (res.data.success) {
          setTransactions(res.data.transactions);
        } else {
          setError(res.data.message || "Failed to fetch transactions");
        }
      } catch (err) {
        setError(err.response?.data?.message || "Something went wrong");
      } finally {
        setLoading(false);
      }
    };

    fetchTransactions();
  }, []);

  if (loading)
    return <p className="text-center text-gray-500 mt-10">Loading...</p>;

  if (error) return <p className="text-center text-red-600 mt-10">{error}</p>;

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold text-center mb-6 text-green-700">
        My Transactions
      </h1>

      {transactions.length === 0 ? (
        <p className="text-center text-gray-600">No transactions found.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {transactions.map((tx) => (
            <div
              key={tx._id}
              className="bg-white shadow-lg rounded-xl p-5 flex flex-col justify-between hover:shadow-xl transition-shadow duration-300"
            >
              <div className="flex items-center justify-between mb-2">
                <h2 className="text-lg font-semibold text-gray-800">
                  {tx.description}
                </h2>
                <span
                  className={`flex items-center gap-1 font-bold text-sm ${
                    tx.type === "credit" ? "text-green-600" : "text-red-600"
                  }`}
                >
                  {tx.type === "credit" ? <FaArrowUp /> : <FaArrowDown />}
                  {tx.points} pts
                </span>
              </div>
              <p className="text-gray-500 text-sm">
                {new Date(tx.createdAt).toLocaleString()}
              </p>
              <span
                className={`mt-3 inline-block px-3 py-1 rounded-full text-xs font-medium ${
                  tx.type === "credit"
                    ? "bg-green-100 text-green-700"
                    : "bg-red-100 text-red-700"
                }`}
              >
                {tx.type.toUpperCase()}
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
