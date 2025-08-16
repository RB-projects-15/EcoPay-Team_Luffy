// src/pages/Store.jsx
import { FaTshirt } from "react-icons/fa";

export default function Store() {
  const items = [
    { id: 1, name: "T-Shirt for Boys", points: 200, color: "blue" },
    { id: 2, name: "T-Shirt for Girls", points: 250, color: "pink" },
  ];

  return (
    <div className="min-h-screen bg-green-50 p-6">
      <h1 className="text-3xl font-bold text-green-700 mb-8 text-center">
        Redeem Your Points
      </h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 justify-items-center">
        {items.map((item) => (
          <div
            key={item.id}
            className="bg-white shadow-lg rounded-xl p-6 w-72 flex flex-col items-center animate-scaleUp"
          >
            <FaTshirt className={`text-${item.color}-500 text-6xl mb-4`} />
            <h2 className="text-xl font-semibold text-green-700">
              {item.name}
            </h2>
            <p className="text-gray-500 mb-4">{item.points} Points</p>
            <button className="bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700 transition">
              Redeem
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
