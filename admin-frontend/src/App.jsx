import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import AdminHome from "./pages/AdminHome";
import Dashboard from "./pages/Dashboard";
import AdminRequests from "./pages/AdminRequests";
import ManageUsers from "./pages/ManageUsers";
import Reports from "./pages/Reports";

export default function App() {
  return (
    <Router>
      <Routes>
        {/* Main Admin Layout */}
        <Route path="/" element={<AdminHome />}>
          <Route index element={<Dashboard />} />
          <Route path="requests" element={<AdminRequests />} />
          <Route path="users" element={<ManageUsers />} />
          <Route path="reports" element={<Reports />} />
        </Route>
      </Routes>
    </Router>
  );
}
