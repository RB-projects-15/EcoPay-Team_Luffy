// src/components/Sidebar.jsx
import { NavLink } from "react-router-dom";
import {
  LayoutDashboard,
  Users,
  FileBarChart2,
  ClipboardList,
  LogOut,
} from "lucide-react";

export default function Sidebar() {
  const navItem =
    "flex items-center gap-3 px-4 py-3 rounded-xl font-medium transition-all duration-300";

  const navActive = "bg-green-600 text-white shadow-md scale-[1.03]";
  const navInactive =
    "text-gray-200 hover:bg-green-500 hover:text-white hover:scale-[1.02]";

  return (
    <div className="w-64 bg-gradient-to-b from-green-700 to-green-900 text-white flex flex-col shadow-xl">
      {/* Logo / Title */}
      <div className="p-6 text-2xl font-bold border-b border-green-600 tracking-wide flex items-center gap-2">
        <span>EcoPay Admin</span>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4 space-y-2">
        <NavLink
          to="/"
          end
          className={({ isActive }) =>
            `${navItem} ${isActive ? navActive : navInactive}`
          }
        >
          <LayoutDashboard size={20} />
          Dashboard
        </NavLink>

        <NavLink
          to="/requests"
          className={({ isActive }) =>
            `${navItem} ${isActive ? navActive : navInactive}`
          }
        >
          <ClipboardList size={20} />
          Requests
        </NavLink>

        <NavLink
          to="/users"
          className={({ isActive }) =>
            `${navItem} ${isActive ? navActive : navInactive}`
          }
        >
          <Users size={20} />
          Manage Users
        </NavLink>

        <NavLink
          to="/reports"
          className={({ isActive }) =>
            `${navItem} ${isActive ? navActive : navInactive}`
          }
        >
          <FileBarChart2 size={20} />
          Reports
        </NavLink>
      </nav>

      {/* Footer / Logout */}
      <div className="p-4 border-t border-green-600">
        <button className="w-full flex items-center gap-3 px-4 py-3 rounded-xl bg-green-800 hover:bg-red-600 transition-all duration-300">
          <LogOut size={20} />
          Logout
        </button>
      </div>
    </div>
  );
}
