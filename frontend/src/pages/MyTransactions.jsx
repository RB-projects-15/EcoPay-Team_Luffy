// src/pages/MyTransactions.jsx
import { useEffect, useState } from "react";
import axios from "axios";
import {
  FaArrowUp,
  FaArrowDown,
  FaChevronDown,
  FaChevronUp,
  FaPhone,
  FaMapMarkerAlt,
} from "react-icons/fa";

export default function MyTransactions() {
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [expanded, setExpanded] = useState({}); // track expanded cards

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

  const toggleExpand = (id) => {
    setExpanded((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
    alert(`Copied to clipboard: ${text}`);
  };

  // Summary stats
  const totalCredit = transactions
    .filter((tx) => tx.type === "credit")
    .reduce((sum, tx) => sum + tx.points, 0);

  const totalDebit = transactions
    .filter((tx) => tx.type === "debit")
    .reduce((sum, tx) => sum + tx.points, 0);

  // --- Loading ---
  if (loading)
    return (
      <div className="flex justify-center items-center h-[60vh]">
        <div className="w-10 h-10 border-4 border-green-500 border-t-transparent rounded-full animate-spin"></div>
        <span className="ml-3 text-gray-600">Loading transactions...</span>
      </div>
    );

  // --- Error ---
  if (error)
    return (
      <div className="flex flex-col items-center justify-center h-[60vh]">
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg">
          <strong className="font-semibold">Error:</strong> {error}
        </div>
      </div>
    );

  return (
    <div className="p-6 min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <h1 className="text-3xl font-bold text-center mb-8 text-green-700">
        My Transactions
      </h1>

      {/* Summary Section */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-10">
        <div className="bg-white rounded-2xl shadow-lg p-6 flex justify-between items-center hover:shadow-xl transition-all">
          <div>
            <p className="text-gray-500 text-sm">Total Earned</p>
            <h2 className="text-2xl font-bold text-green-600">
              {totalCredit} pts
            </h2>
          </div>
          <FaArrowUp className="text-green-500 text-3xl" />
        </div>
        <div className="bg-white rounded-2xl shadow-lg p-6 flex justify-between items-center hover:shadow-xl transition-all">
          <div>
            <p className="text-gray-500 text-sm">Total Spent</p>
            <h2 className="text-2xl font-bold text-red-600">
              {totalDebit} pts
            </h2>
          </div>
          <FaArrowDown className="text-red-500 text-3xl" />
        </div>
      </div>

      {transactions.length === 0 ? (
        <div className="flex flex-col items-center justify-center mt-20">
          <svg
            className="w-16 h-16 text-gray-400"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M9 17v-2h6v2m-7-5h8m-4 4h.01M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.636-6.364l-.707.707M12 21v-1"
            />
          </svg>
          <p className="text-gray-500 text-lg mt-3">No transactions yet</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {transactions.map((tx) => (
            <div
              key={tx._id}
              className="bg-white shadow-md rounded-2xl p-5 hover:shadow-xl transition-all duration-300"
            >
              {/* Header */}
              <div
                className="flex items-center justify-between cursor-pointer"
                onClick={() => toggleExpand(tx._id)}
              >
                <h2 className="text-lg font-semibold text-gray-800 truncate pr-3">
                  {tx.description}
                </h2>
                <div className="flex items-center gap-2">
                  <span
                    className={`flex items-center gap-1 font-bold text-sm ${
                      tx.type === "credit" ? "text-green-600" : "text-red-600"
                    }`}
                  >
                    {tx.type === "credit" ? <FaArrowUp /> : <FaArrowDown />}
                    {tx.points} pts
                  </span>
                  {expanded[tx._id] ? <FaChevronUp /> : <FaChevronDown />}
                </div>
              </div>

              {/* Date */}
              <p className="text-gray-500 text-xs mt-1">
                {new Date(tx.createdAt).toLocaleString()}
              </p>

              {/* Collapsible content */}
              <div
                className={`transition-all duration-300 overflow-hidden ${
                  expanded[tx._id] ? "max-h-96 mt-3 border-t pt-3" : "max-h-0"
                }`}
              >
                {tx.waste_request ? (
                  <div className="bg-gray-50 p-3 rounded-lg space-y-2">
                    <p>
                      <strong>Waste Type:</strong> {tx.waste_request.waste_type}
                    </p>
                    <p>
                      <strong>Weight:</strong> {tx.waste_request.weight} kg
                    </p>
                    <p className="flex items-center gap-1">
                      <FaMapMarkerAlt className="text-red-500" />
                      <a
                        href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
                          tx.waste_request.location
                        )}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="underline text-blue-600 hover:text-blue-800"
                      >
                        {tx.waste_request.location}
                      </a>
                    </p>
                    <p className="flex items-center gap-1">
                      <FaPhone className="text-green-500" />
                      {tx.waste_request.collector_info || "Not assigned"}
                      {tx.waste_request.collector_info && (
                        <button
                          className="ml-2 px-2 py-0.5 bg-gray-200 rounded text-xs hover:bg-gray-300"
                          onClick={() =>
                            copyToClipboard(tx.waste_request.collector_info)
                          }
                        >
                          Copy
                        </button>
                      )}
                    </p>
                    <p>
                      <strong>Collection Time:</strong>{" "}
                      {tx.waste_request.collection_time
                        ? new Date(
                            tx.waste_request.collection_time
                          ).toLocaleString()
                        : "Not scheduled"}
                    </p>
                  </div>
                ) : (
                  <p className="text-gray-500 mt-2">No additional details</p>
                )}
              </div>

              {/* Transaction type badge */}
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
