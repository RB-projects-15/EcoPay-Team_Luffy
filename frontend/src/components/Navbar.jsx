// src/components/Navbar.jsx
import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import AccountDrawer from "./AccountDrawer";
import logo from "../assets/logo.png";
import defaultProfile from "../assets/profile.png";

export default function Navbar() {
  const location = useLocation();
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [user, setUser] = useState(null);

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) setUser(JSON.parse(storedUser));
  }, []);

  const hideNavbar =
    location.pathname === "/" ||
    location.pathname === "/register" ||
    location.pathname === "/login";

  if (hideNavbar) return null;

  const links = [
    { name: "Home", path: "/home" },
    { name: "My Requests", path: "/my-requests" },
    { name: "My Transactions", path: "/transactions" },
    { name: "Store", path: "/store" },
  ];

  return (
    <>
      <nav className="bg-gradient-to-r from-green-500 via-green-600 to-green-500 p-5 flex justify-between items-center shadow-lg rounded-b-xl">
        {/* Logo and Text */}
        <div className="flex items-center space-x-3">
          <Link to="/home" className="flex items-center">
            <img src={logo} alt="EcoPay Logo" className="h-14 w-auto" />
            <span className="ml-3 text-white text-2xl font-bold tracking-wide">
              EcoPay
            </span>
          </Link>
        </div>

        {/* Links */}
        <div className="flex items-center space-x-8 text-white font-medium text-lg">
          {links.map((link, idx) => (
            <Link
              key={idx}
              to={link.path}
              className="relative group px-2 py-1 rounded transition-all duration-300"
            >
              <span className="relative z-10">{link.name}</span>
              <span className="absolute inset-0 bg-gradient-to-r from-yellow-300 via-yellow-200 to-yellow-300 opacity-0 group-hover:opacity-30 rounded transition-opacity duration-300"></span>
            </Link>
          ))}

          {/* Profile Button */}
          <button
            onClick={() => setDrawerOpen(true)}
            className="rounded-full overflow-hidden w-14 h-14 border-2 border-white hover:scale-110 transition-transform duration-300 shadow-md"
          >
            <img
              src={user?.profilePic || defaultProfile}
              alt="Profile"
              className="w-full h-full object-cover"
            />
          </button>
        </div>
      </nav>

      {/* Account Drawer */}
      <AccountDrawer isOpen={drawerOpen} onClose={() => setDrawerOpen(false)} />
    </>
  );
}
