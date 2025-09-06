// admin-frontend/src/App.jsx
import { Routes, Route, Navigate } from "react-router-dom";
import AdminLogin from "./pages/AdminLogin";
import AdminRegister from "./pages/AdminRegister";
import AdminHome from "./pages/AdminHome";
import Dashboard from "./pages/Dashboard";
import AdminRequests from "./pages/AdminRequests";
import ManageUsers from "./pages/ManageUsers";
import Reports from "./pages/Reports";
import Settings from "./pages/Settings";
// ✅ Import new pages
import AdminRewards from "./pages/AdminRewards";
import AdminRedemptions from "./pages/AdminRedemptions";

export default function App() {
  return (
    <Routes>
      {/* Default redirect */}
      <Route path="/" element={<Navigate to="/admin/login" />} />

      {/* Auth */}
      <Route path="/admin/login" element={<AdminLogin />} />
      <Route path="/admin/register" element={<AdminRegister />} />

      {/* Main Admin Layout */}
      <Route path="/admin" element={<AdminHome />}>
        <Route index element={<Navigate to="home" replace />} />
        <Route path="home" element={<div>Welcome to Admin Portal</div>} />
        <Route path="dashboard" element={<Dashboard />} />
        <Route path="requests" element={<AdminRequests />} />
        <Route path="transactions" element={<Reports />} />
        <Route path="users" element={<ManageUsers />} />
        {/* ✅ New routes */}
        <Route path="rewards" element={<AdminRewards />} />
        <Route path="redemptions" element={<AdminRedemptions />} />
        <Route path="settings" element={<Settings />} />
      </Route>

      {/* Catch all */}
      <Route path="*" element={<Navigate to="/admin/login" replace />} />
    </Routes>
  );
}
