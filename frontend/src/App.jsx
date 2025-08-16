// src/App.jsx
import {
  BrowserRouter as Router,
  Routes,
  Route,
  useLocation,
} from "react-router-dom";
import Navbar from "./components/Navbar";
import Splash from "./pages/Splash";
import Onboarding from "./pages/Onboarding";
import Home from "./pages/Home";
import Transactions from "./pages/Transactions";
import Dashboard from "./pages/Dashboard";
import Deposit from "./pages/Deposit";
import Register from "./pages/Register";
import Login from "./pages/Login";
import Store from "./pages/Store";
import LocationSelect from "./pages/LocationSelect";
import AdminDashboard from "./pages/AdminDashboard";
import AdminRequests from "./pages/AdminRequests";
import WasteSubmit from "./pages/WasteSubmit";

function Layout({ children }) {
  const location = useLocation();
  const hideNavbar = ["/", "/onboarding", "/register", "/login"].includes(
    location.pathname
  );

  return (
    <>
      {!hideNavbar && <Navbar />}
      {children}
    </>
  );
}

export default function App() {
  return (
    <Router>
      <Layout>
        <Routes>
          {/* Without Navbar */}
          <Route path="/" element={<Splash />} />
          <Route path="/onboarding" element={<Onboarding />} />
          <Route path="/register" element={<Register />} />
          <Route path="/login" element={<Login />} />

          {/* With Navbar */}
          <Route path="/home" element={<Home />} />
          <Route path="/transactions" element={<Transactions />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/deposit" element={<Deposit />} />
          <Route path="/store" element={<Store />} />
          <Route path="/location" element={<LocationSelect />} />
          <Route path="/admin" element={<AdminDashboard />} />
          <Route path="/admin/requests" element={<AdminRequests />} />
          <Route path="/waste-submit" element={<WasteSubmit />} />
        </Routes>
      </Layout>
    </Router>
  );
}
