// src/pages/Login.jsx
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import logo from "../assets/logo.png";

export default function Login() {
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await fetch("http://localhost:5000/api/user/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || data.message || "Login failed");
        setLoading(false);
        return;
      }

      // ✅ Save token & full user info
      localStorage.setItem("token", data.token);
      localStorage.setItem(
        "user",
        JSON.stringify({
          user_id: data.user_id,
          name: data.name,
          email: data.email,
          phone: data.phone,
          role: data.role,
          points: data.points || 0,
        })
      );

      navigate(data.role === "admin" ? "/admin" : "/home");
    } catch (err) {
      setError("Server error. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col justify-center items-center p-6 bg-gradient-to-br from-pink-100 via-yellow-100 to-green-100 animate-fadeIn">
      <img
        src={logo}
        alt="EcoPay Logo"
        className="w-40 h-40 object-contain mb-6 drop-shadow-lg"
      />

      <div className="bg-white rounded-3xl shadow-2xl p-8 w-full max-w-md flex flex-col gap-6 hover:shadow-emerald-400 transition-shadow duration-500">
        <h2 className="text-3xl font-bold text-green-800 mb-4 text-center">
          Welcome Back
        </h2>

        {error && (
          <p className="text-red-500 text-center font-medium bg-red-50 p-2 rounded-xl">
            {error}
          </p>
        )}

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <input
            type="email"
            name="email"
            placeholder="Email Address"
            value={form.email}
            onChange={handleChange}
            required
            className="w-full px-4 py-3 border border-gray-300 rounded-xl text-lg focus:outline-none focus:ring-2 focus:ring-green-400 transition"
          />

          <input
            type="password"
            name="password"
            placeholder="Password"
            value={form.password}
            onChange={handleChange}
            required
            className="w-full px-4 py-3 border border-gray-300 rounded-xl text-lg focus:outline-none focus:ring-2 focus:ring-green-400 transition"
          />

          <button
            type="submit"
            disabled={loading}
            className={`w-full bg-gradient-to-r from-green-400 via-green-500 to-green-600 text-white py-3 rounded-full text-lg font-semibold shadow-lg transform transition duration-300 ${
              loading ? "opacity-70 cursor-not-allowed" : "hover:scale-105"
            }`}
          >
            {loading ? "Logging in..." : "Login"}
          </button>
        </form>

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
