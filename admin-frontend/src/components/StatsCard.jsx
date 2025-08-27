export default function StatsCard({
  title,
  value,
  color = "from-green-400 to-green-600",
}) {
  return (
    <div
      className={`flex flex-col items-center justify-center p-6 rounded-2xl shadow-lg transform transition-transform duration-300 hover:scale-105 bg-gradient-to-br ${color}`}
    >
      <h3 className="text-lg font-semibold text-gray-100">{title}</h3>
      <p className="text-3xl font-bold mt-2 text-white">{value}</p>
    </div>
  );
}
