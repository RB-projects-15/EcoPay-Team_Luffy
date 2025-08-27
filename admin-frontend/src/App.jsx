// admin-frontend/src/App.jsx
import { Routes, Route, Navigate } from "react-router-dom";
import AdminLogin from "./pages/AdminLogin";
import AdminRegister from "./pages/AdminRegister";
import AdminHome from "./pages/AdminHome";
import Dashboard from "./pages/Dashboard";
import AdminRequests from "./pages/AdminRequests";
import ManageUsers from "./pages/ManageUsers";
import Reports from "./pages/Reports";

export default function App() {
  return (
    <Routes>
      {/* Admin Auth */}
      <Route path="/admin/login" element={<AdminLogin />} />
      <Route path="/admin/register" element={<AdminRegister />} />

      {/* Main Admin Layout */}
      <Route path="/admin/home" element={<AdminHome />}>
        {/* Redirect /admin/home to /admin/home/dashboard */}
        <Route index element={<Navigate to="dashboard" />} />

        {/* Child routes */}
        <Route path="dashboard" element={<Dashboard />} />
        <Route path="requests" element={<AdminRequests />} />
        <Route path="users" element={<ManageUsers />} />
        <Route path="reports" element={<Reports />} />
      </Route>

      {/* Catch all */}
      <Route path="*" element={<Navigate to="/admin/login" />} />
    </Routes>
  );
}
