// src/components/StatsCard.jsx
import { FaRecycle, FaClock, FaCheckCircle, FaUsers } from "react-icons/fa";

const iconMap = {
  FaRecycle: FaRecycle,
  FaClock: FaClock,
  FaCheckCircle: FaCheckCircle,
  FaUsers: FaUsers,
};

export default function StatsCard({
  title,
  value,
  color = "bg-gray-200",
  icon,
}) {
  const IconComponent = iconMap[icon] || FaRecycle;

  return (
    <div
      className={`flex items-center p-6 rounded-2xl shadow-lg transition transform hover:scale-105 ${color} text-white`}
    >
      {/* Icon */}
      <div className="p-4 bg-white/20 rounded-full mr-4">
        <IconComponent size={28} />
      </div>

      {/* Title & Value */}
      <div>
        <p className="text-sm font-medium">{title}</p>
        <p className="text-2xl font-bold">{value}</p>
      </div>
    </div>
  );
}
