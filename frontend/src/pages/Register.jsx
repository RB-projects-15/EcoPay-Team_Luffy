// src/pages/Register.jsx
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import logo from "../assets/logo.png";

export default function Register() {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: "",
  });
  const [error, setError] = useState("");

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    // ✅ updated phone validation
    const phoneRegex = /^[6-9]\d{9}$/;
    if (!phoneRegex.test(form.phone)) {
      setError(
        "Phone number must start with 9, 8, 7, or 6 and be exactly 10 digits"
      );
      return;
    }

    if (form.password !== form.confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    try {
      const res = await fetch("http://localhost:5000/api/user/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "Registration failed");
        return;
      }

      // Save minimal user info
      localStorage.setItem(
        "user",
        JSON.stringify({
          user_id: data.user_id,
          email: form.email,
          name: form.name,
          phone: form.phone,
          points: 0,
        })
      );

      navigate("/home");
    } catch (err) {
      setError("Server error. Please try again.");
    }
  };

  return (
    <div className="min-h-screen flex flex-col justify-center items-center p-6 bg-gradient-to-br from-pink-100 via-yellow-100 to-green-100 animate-fadeIn">
      {/* Logo */}
      <img
        src={logo}
        alt="EcoPay Logo"
        className="w-40 h-40 object-contain mb-6"
      />

      {/* Card */}
      <div className="bg-white rounded-3xl shadow-2xl p-8 w-full max-w-md flex flex-col gap-6 hover:shadow-emerald-400 transition-shadow duration-500">
        <h2 className="text-3xl font-bold text-green-800 mb-4 text-center">
          Create Your Account
        </h2>

        {error && (
          <p className="text-red-500 text-center font-medium">{error}</p>
        )}

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <input
            type="text"
            name="name"
            placeholder="Full Name"
            value={form.name}
            onChange={handleChange}
            required
            className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-400 text-lg"
          />

          <input
            type="email"
            name="email"
            placeholder="Email Address"
            value={form.email}
            onChange={handleChange}
            required
            className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-400 text-lg"
          />

          <input
            type="text"
            name="phone"
            placeholder="Phone (10 digits starting with 9, 8, 7, or 6)"
            value={form.phone}
            onChange={handleChange}
            required
            className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-400 text-lg"
          />

          <input
            type="password"
            name="password"
            placeholder="Password"
            value={form.password}
            onChange={handleChange}
            required
            className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-400 text-lg"
          />

          <input
            type="password"
            name="confirmPassword"
            placeholder="Confirm Password"
            value={form.confirmPassword}
            onChange={handleChange}
            required
            className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-400 text-lg"
          />

          <button
            type="submit"
            className="w-full bg-gradient-to-r from-green-400 via-green-500 to-green-600 text-white py-3 rounded-full text-lg font-semibold shadow-lg hover:scale-105 transition transform duration-300"
          >
            Register
          </button>
        </form>

        {/* Login Button */}
        <p className="text-center mt-2">
          Already have an account?{" "}
          <button
            onClick={() => navigate("/login")}
            className="bg-green-100 text-green-700 px-4 py-1 rounded-full text-sm font-semibold hover:bg-green-200 transition"
          >
            Login
          </button>
        </p>
      </div>
    </div>
  );
}
