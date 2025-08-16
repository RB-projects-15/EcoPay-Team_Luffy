// src/pages/Login.jsx
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import logo from "../assets/logo.png";

export default function Login() {
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState("");

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    try {
      const res = await fetch("http://localhost:3000/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "Login failed");
        return;
      }

      // Save token & user info to localStorage
      localStorage.setItem("token", data.token);
      localStorage.setItem(
        "user",
        JSON.stringify({
          user_id: data.user_id,
          email: form.email,
          name: form.email.split("@")[0],
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
        className="w-48 h-48 object-contain mb-6"
      />

      {/* Card */}
      <div className="bg-white rounded-3xl shadow-2xl p-8 w-full max-w-md flex flex-col gap-6 hover:shadow-emerald-400 transition-shadow duration-500">
        <h2 className="text-3xl font-bold text-green-800 mb-4 text-center">
          Login to Your Account
        </h2>

        {error && (
          <p className="text-red-500 text-center font-medium">{error}</p>
        )}

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
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
            type="password"
            name="password"
            placeholder="Password"
            value={form.password}
            onChange={handleChange}
            required
            className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-400 text-lg"
          />

          <button
            type="submit"
            className="w-full bg-gradient-to-r from-green-400 via-green-500 to-green-600 text-white py-3 rounded-full text-lg font-semibold shadow-lg hover:scale-105 transition transform duration-300"
          >
            Login
          </button>
        </form>

        {/* Register Button */}
        <p className="text-center mt-2">
          Don’t have an account?{" "}
          <button
            onClick={() => navigate("/register")}
            className="bg-green-100 text-green-700 px-4 py-1 rounded-full text-sm font-semibold hover:bg-green-200 transition"
          >
            Register
          </button>
        </p>
      </div>
    </div>
  );
}
