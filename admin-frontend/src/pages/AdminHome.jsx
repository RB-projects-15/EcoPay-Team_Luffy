// src/pages/AdminHome.jsx
import { Outlet } from "react-router-dom";
import Sidebar from "../components/Sidebar";
import Topbar from "../components/Topbar";

export default function AdminHome() {
  return (
    <div className="flex h-screen bg-gradient-to-br from-gray-100 to-gray-200">
      {/* Sidebar */}
      <Sidebar />

      {/* Main Content Area */}
      <div className="flex flex-col flex-1 min-h-screen">
        <Topbar />

        {/* Content Wrapper */}
        <main className="p-6 overflow-y-auto flex-1">
          <div className="bg-white shadow-xl rounded-3xl p-6 min-h-full w-full transition-all duration-300 hover:shadow-2xl">
            {/* This is where child routes render */}
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
}
