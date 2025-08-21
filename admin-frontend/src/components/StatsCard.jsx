// src/components/StatsCard.jsx
export default function StatsCard({ title, value, color }) {
  return (
    <div
      className={`flex flex-col items-center justify-center p-6 rounded-2xl shadow-lg transform transition-transform duration-300 hover:scale-105 ${color} bg-gradient-to-br`}
    >
      <h3 className="text-lg font-semibold">{title}</h3>
      <p className="text-3xl font-bold mt-2">{value}</p>
    </div>
  );
}
