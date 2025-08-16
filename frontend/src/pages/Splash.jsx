import { useNavigate } from "react-router-dom";
import logo from "../assets/logo.png";

export default function Splash() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex flex-col justify-center items-center text-center p-6 bg-gradient-to-br from-pink-100 via-yellow-100 to-green-100 animate-fadeIn">
      {/* Logo */}
      <img
        src={logo}
        alt="EcoPay Logo"
        className="w-60 h-60 object-contain mb-8 animate-fadeIn"
      />

      {/* Title */}
      <h1 className="text-5xl font-bold text-green-800 mb-4">
        Welcome to EcoPay
      </h1>

      {/* Subtitle */}
      <p className="text-lg text-gray-700 max-w-md mb-10">
        Turn your recyclables into rewards. Start your journey towards a greener
        future.
      </p>

      {/* Button */}
      <button
        onClick={() => navigate("/onboarding")}
        className="bg-gradient-to-r from-green-400 via-green-500 to-green-600 text-white px-10 py-4 rounded-full text-xl font-semibold shadow-lg transform hover:scale-105 transition-all duration-300"
      >
        Get Started
      </button>
    </div>
  );
}
