// admin-frontend/src/pages/AdminLogin.jsx
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import logo from "../assets/logo.png";

export default function AdminLogin() {
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const res = await axios.post(
        "http://localhost:5000/api/admin/login",
        formData
      );

      if (res.data?.token) {
        // ✅ Save token
        localStorage.setItem("adminToken", res.data.token);

        // ✅ Save admin details (name, email, role) if provided
        if (res.data.admin) {
          localStorage.setItem("admin", JSON.stringify(res.data.admin));
        }

        navigate("/admin/home"); // go to AdminHome
      } else {
        setError("Invalid login response");
      }
    } catch (err) {
      setError(err.response?.data?.message || "❌ Login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gradient-to-br from-indigo-900 via-blue-900 to-indigo-800">
      <form
        onSubmit={handleLogin}
        className="bg-white/10 backdrop-blur-xl p-10 rounded-2xl shadow-2xl w-full max-w-md border border-white/20"
      >
        <div className="flex justify-center mb-6">
          <img
            src={logo}
            alt="EcoPay Logo"
            className="w-16 h-16 rounded-full shadow-lg border border-white/40 bg-white"
          />
        </div>

        <h2 className="text-3xl font-bold text-center text-white mb-2">
          Admin Login
        </h2>
        <p className="text-white/70 text-center text-sm mb-6">
          Sign in to access your dashboard
        </p>

        {error && (
          <p className="text-red-500 bg-red-100/80 px-3 py-2 rounded-lg mb-4 text-sm text-center">
            {error}
          </p>
        )}

        <input
          type="email"
          name="email"
          placeholder="Email Address"
          value={formData.email}
          onChange={handleChange}
          className="w-full px-4 py-3 mb-4 rounded-lg border border-white/30 bg-white/10 text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-blue-400 transition"
          required
        />

        <input
          type="password"
          name="password"
          placeholder="Password"
          value={formData.password}
          onChange={handleChange}
          className="w-full px-4 py-3 mb-6 rounded-lg border border-white/30 bg-white/10 text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-blue-400 transition"
          required
        />

        <button
          type="submit"
          disabled={loading}
          className={`w-full py-3 rounded-lg font-semibold text-white shadow-lg transition ${
            loading
              ? "bg-gray-400 cursor-not-allowed"
              : "bg-blue-600 hover:bg-blue-700"
          }`}
        >
          {loading ? "Logging in..." : "Login"}
        </button>

        <p className="text-center text-sm text-white/70 mt-5">
          Don’t have an account?{" "}
          <span
            className="text-blue-400 hover:underline cursor-pointer"
            onClick={() => navigate("/admin/register")}
          >
            Register here
          </span>
        </p>
      </form>
    </div>
  );
}
