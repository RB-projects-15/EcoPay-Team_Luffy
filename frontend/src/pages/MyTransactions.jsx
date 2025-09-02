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
              {/* Header */}
              <div
                className="flex items-center justify-between cursor-pointer"
                onClick={() => toggleExpand(tx._id)}
              >
                <h2 className="text-lg font-semibold text-gray-800">
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
              <p className="text-gray-500 text-sm mt-1">
                {new Date(tx.createdAt).toLocaleString()}
              </p>

              {/* Collapsible content */}
              {expanded[tx._id] && (
                <div className="mt-3 border-t pt-3 text-gray-700 text-sm space-y-2">
                  {/* Show waste request details if available */}
                  {tx.waste_request ? (
                    <div className="bg-gray-50 p-3 rounded-lg space-y-2">
                      <p>
                        <strong>Waste Type:</strong>{" "}
                        {tx.waste_request.waste_type}
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
                      {tx.waste_request.image_url && (
                        <img
                          src={`http://localhost:5000${tx.waste_request.image_url}`}
                          alt="Waste"
                          className="w-full h-40 object-cover rounded-lg mt-2"
                        />
                      )}
                    </div>
                  ) : (
                    <p>No additional details</p>
                  )}
                </div>
              )}

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
