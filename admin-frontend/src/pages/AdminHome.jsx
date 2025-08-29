// src/pages/AdminHome.jsx
import { Outlet } from "react-router-dom";
import Sidebar from "../components/Sidebar";

export default function AdminHome() {
  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar */}
      <Sidebar />

      {/* Main content */}
      <div className="flex-1 p-6 overflow-auto">
        {/* Home header */}
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-gray-800">
            Welcome to EcoPay Admin Panel
          </h1>
          <p className="text-gray-600 mt-1">
            Manage all requests, users, reports, and settings from here.
          </p>
        </div>

        {/* Nested routes will render here */}
        <div className="bg-white rounded-xl shadow-md p-6 min-h-[400px]">
          <Outlet />
          {/* If no nested route is active, you can add default home content */}
          <div className="text-center text-gray-500 mt-20">
            <p className="text-lg font-medium">
              Select a section from the sidebar to get started.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
