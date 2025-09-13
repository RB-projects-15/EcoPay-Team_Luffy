// src/components/Navbar.jsx
import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { FaBars, FaTimes } from "react-icons/fa";
import AccountDrawer from "./AccountDrawer";
import logo from "../assets/logo.png";
import defaultProfile from "../assets/profile.png";

export default function Navbar() {
  const location = useLocation();
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [mobileMenu, setMobileMenu] = useState(false);
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
      <nav className="bg-gradient-to-r from-green-500 via-green-600 to-green-500 p-4 flex justify-between items-center shadow-lg rounded-b-xl relative">
        {/* Logo and Text */}
        <div className="flex items-center space-x-3">
          <Link to="/home" className="flex items-center">
            <img src={logo} alt="EcoPay Logo" className="h-12 w-auto" />
            <span className="ml-2 text-white text-2xl font-bold tracking-wide">
              EcoPay
            </span>
          </Link>
        </div>

        {/* Desktop Links */}
        <div className="hidden md:flex items-center space-x-8 text-white font-medium text-lg">
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
            className="rounded-full overflow-hidden w-12 h-12 border-2 border-white hover:scale-110 transition-transform duration-300 shadow-md"
          >
            <img
              src={user?.profilePic || defaultProfile}
              alt="Profile"
              className="w-full h-full object-cover"
            />
          </button>
        </div>

        {/* Mobile Menu Button */}
        <button
          className="md:hidden text-white text-2xl focus:outline-none"
          onClick={() => setMobileMenu(!mobileMenu)}
        >
          {mobileMenu ? <FaTimes /> : <FaBars />}
        </button>

        {/* Mobile Dropdown */}
        {mobileMenu && (
          <div className="absolute top-full left-0 w-full bg-green-600 shadow-lg rounded-b-xl flex flex-col items-center py-4 md:hidden z-50 animate-slideDown">
            {links.map((link, idx) => (
              <Link
                key={idx}
                to={link.path}
                onClick={() => setMobileMenu(false)}
                className="text-white py-2 text-lg w-full text-center hover:bg-green-700 transition"
              >
                {link.name}
              </Link>
            ))}
            <button
              onClick={() => {
                setDrawerOpen(true);
                setMobileMenu(false);
              }}
              className="mt-3 rounded-full overflow-hidden w-12 h-12 border-2 border-white shadow-md"
            >
              <img
                src={user?.profilePic || defaultProfile}
                alt="Profile"
                className="w-full h-full object-cover"
              />
            </button>
          </div>
        )}
      </nav>

      {/* Account Drawer */}
      <AccountDrawer isOpen={drawerOpen} onClose={() => setDrawerOpen(false)} />
    </>
  );
}
