import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import logo from "../assets/logo.png";

export default function AdminRegister() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    setLoading(true);

    try {
      const res = await axios.post("http://localhost:5000/api/admin/register", {
        name,
        email,
        password,
      });

      if (res.status === 201) {
        setSuccess("✅ Registration successful! Redirecting...");
        setTimeout(() => {
          navigate("/admin/login");
        }, 1500);
      }
    } catch (err) {
      setError(
        err.response?.data?.message ||
          err.response?.data?.error ||
          "❌ Registration failed"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-green-400 via-emerald-500 to-green-700">
      <form
        onSubmit={handleRegister}
        className="relative bg-white/20 backdrop-blur-xl p-10 rounded-2xl shadow-2xl w-full max-w-md border border-white/30"
      >
        <div className="flex justify-center mb-6">
          <img
            src={logo}
            alt="EcoPay Logo"
            className="w-16 h-16 rounded-full shadow-lg"
          />
        </div>

        <h2 className="text-3xl font-extrabold text-center text-white drop-shadow-md">
          Admin Register
        </h2>
        <p className="text-white/80 mb-8 text-center text-sm">
          Create your admin account
        </p>

        {error && (
          <p className="text-red-600 bg-red-100 px-3 py-2 rounded-lg mb-4 text-sm text-center">
            {error}
          </p>
        )}
        {success && (
          <p className="text-green-700 bg-green-100 px-3 py-2 rounded-lg mb-4 text-sm text-center">
            {success}
          </p>
        )}

        <div className="mb-4">
          <label className="block mb-1 text-white font-medium">Full Name</label>
          <input
            type="text"
            className="w-full border border-white/40 px-4 py-3 rounded-lg bg-white/10 text-white placeholder-white/70 focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:border-yellow-400 transition"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="John Doe"
            required
          />
        </div>

        <div className="mb-4">
          <label className="block mb-1 text-white font-medium">
            Email Address
          </label>
          <input
            type="email"
            className="w-full border border-white/40 px-4 py-3 rounded-lg bg-white/10 text-white placeholder-white/70 focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:border-yellow-400 transition"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="example@domain.com"
            required
          />
        </div>

        <div className="mb-6">
          <label className="block mb-1 text-white font-medium">Password</label>
          <input
            type="password"
            className="w-full border border-white/40 px-4 py-3 rounded-lg bg-white/10 text-white placeholder-white/70 focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:border-yellow-400 transition"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="••••••••"
            required
          />
        </div>

        <button
          type="submit"
          className={`w-full text-white py-3 rounded-lg font-semibold shadow-lg transition-all ${
            loading
              ? "bg-gray-400 cursor-not-allowed"
              : "bg-yellow-400 hover:bg-yellow-500"
          }`}
          disabled={loading}
        >
          {loading ? "Registering..." : "Register"}
        </button>

        <p className="text-center text-sm text-white/80 mt-5">
          Already have an account?{" "}
          <span
            className="text-yellow-300 hover:underline cursor-pointer"
            onClick={() => navigate("/admin/login")}
          >
            Login here
          </span>
        </p>
      </form>
    </div>
  );
}
