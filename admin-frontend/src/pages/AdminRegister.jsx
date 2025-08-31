// admin-frontend/src/pages/AdminRegister.jsx
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import logo from "../assets/logo.png";

export default function AdminRegister() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccess("");

    try {
      const res = await axios.post(
        "http://localhost:5000/api/admin/register",
        formData
      );

      if (res.status === 201) {
        setSuccess("✅ Registration successful! Redirecting to login...");
        setTimeout(() => {
          navigate("/admin/login");
        }, 1500);
      }
    } catch (err) {
      setError(err.response?.data?.message || "❌ Registration failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gradient-to-br from-indigo-900 via-blue-900 to-indigo-800">
      <form
        onSubmit={handleRegister}
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
          Admin Register
        </h2>
        <p className="text-white/70 text-center text-sm mb-6">
          Create your admin account
        </p>

        {error && (
          <p className="text-red-500 bg-red-100/80 px-3 py-2 rounded-lg mb-4 text-sm text-center">
            {error}
          </p>
        )}
        {success && (
          <p className="text-green-600 bg-green-100/80 px-3 py-2 rounded-lg mb-4 text-sm text-center">
            {success}
          </p>
        )}

        <input
          type="text"
          name="name"
          placeholder="Full Name"
          value={formData.name}
          onChange={handleChange}
          className="w-full px-4 py-3 mb-4 rounded-lg border border-white/30 bg-white/10 text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-blue-400 transition"
          required
        />

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
          {loading ? "Registering..." : "Register"}
        </button>

        <p className="text-center text-sm text-white/70 mt-5">
          Already have an account?{" "}
          <span
            className="text-blue-400 hover:underline cursor-pointer"
            onClick={() => navigate("/admin/login")}
          >
            Login here
          </span>
        </p>
      </form>
    </div>
  );
}
