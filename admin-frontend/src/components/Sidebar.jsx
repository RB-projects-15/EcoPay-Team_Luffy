// src/components/Sidebar.jsx
import { NavLink } from "react-router-dom";
import {
  FaTachometerAlt,
  FaTasks,
  FaUsers,
  FaChartBar,
  FaCog,
  FaGift,
  FaBoxOpen,
} from "react-icons/fa";

export default function Sidebar() {
  const menuItems = [
    { name: "Dashboard", path: "/admin/dashboard", icon: <FaTachometerAlt /> },
    { name: "Requests", path: "/admin/requests", icon: <FaTasks /> },
    { name: "Manage Users", path: "/admin/users", icon: <FaUsers /> },
    { name: "Reports", path: "/admin/transactions", icon: <FaChartBar /> },
    { name: "Rewards", path: "/admin/rewards", icon: <FaGift /> },
    { name: "Redemptions", path: "/admin/redemptions", icon: <FaBoxOpen /> },
    { name: "Settings", path: "/admin/settings", icon: <FaCog /> },
  ];

  return (
    <div className="h-screen w-64 bg-gradient-to-b from-blue-600 to-blue-800 text-white flex flex-col shadow-xl">
      {/* Logo Section */}
      <div className="p-6 text-center border-b border-blue-500">
        <h1 className="text-2xl font-bold tracking-wide">EcoPay Admin</h1>
        <p className="text-sm text-blue-200">Control Panel</p>
      </div>

      {/* Menu Section */}
      <nav className="flex-1 p-4">
        <ul className="space-y-2">
          {menuItems.map((item) => (
            <li key={item.name}>
              <NavLink
                to={item.path}
                className={({ isActive }) =>
                  `flex items-center gap-3 px-4 py-3 rounded-lg font-medium transition-all duration-200 ${
                    isActive
                      ? "bg-white text-blue-700 shadow-md"
                      : "hover:bg-blue-700"
                  }`
                }
              >
                <span className="text-lg">{item.icon}</span>
                {item.name}
              </NavLink>
            </li>
          ))}
        </ul>
      </nav>
    </div>
  );
}
