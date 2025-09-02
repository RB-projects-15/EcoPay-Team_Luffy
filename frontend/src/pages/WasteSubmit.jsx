// src/pages/WasteSubmit.jsx
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import logo from "../assets/logo.png";

export default function WasteSubmit() {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    waste_type: "",
    weight: "",
    location: "",
    phone: "",
    image: null,
  });
  const [preview, setPreview] = useState(null);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);
  const [calculatedPoints, setCalculatedPoints] = useState(0);

  // Points mapping
  const pointsPerKg = {
    Iron: 45,
    Plastic: 30,
    Paper: 25,
    Glass: 30,
    Organic: 0, // optional if Organic gives no points
  };

  // Calculate points whenever weight or waste type changes
  useEffect(() => {
    const weight = parseFloat(form.weight);
    const rate = pointsPerKg[form.waste_type] || 0;
    if (weight > 0 && rate > 0) {
      setCalculatedPoints(weight * rate);
    } else {
      setCalculatedPoints(0);
    }
  }, [form.waste_type, form.weight]);

  const handleChange = (e) => {
    const { name, value, files } = e.target;

    if (name === "phone" && value.length > 10) return;

    if (name === "image") {
      const file = files[0];
      if (file) {
        setForm({ ...form, image: file });
        setPreview(URL.createObjectURL(file));
      } else {
        setForm({ ...form, image: null });
        setPreview(null);
      }
    } else {
      setForm({ ...form, [name]: value });
    }
  };

  const removeImage = () => {
    setForm({ ...form, image: null });
    setPreview(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (!form.waste_type) return setError("Please select waste type");
    if (!form.weight || isNaN(form.weight) || form.weight <= 0)
      return setError("Weight must be a positive number");
    if (!form.location) return setError("Location is required");

    const phoneRegex = /^[6-9]\d{9}$/;
    if (!phoneRegex.test(form.phone))
      return setError(
        "Phone number must start with 9, 8, 7, or 6 and be exactly 10 digits"
      );

    if (!form.image) return setError("Please upload an image (PNG/JPG)");

    const formData = new FormData();
    formData.append("waste_type", form.waste_type);
    formData.append("weight", form.weight);
    formData.append("location", form.location);
    formData.append("phone", form.phone);
    formData.append("image", form.image);

    const user = JSON.parse(localStorage.getItem("user"));
    if (!user) return setError("User not logged in");
    formData.append("user", user.user_id);

    setLoading(true);
    try {
      const res = await fetch("http://localhost:5000/api/user/waste/submit", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: formData,
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.message || "Submission failed");
        return;
      }

      setSuccess("✅ Waste request submitted successfully!");
      setForm({
        waste_type: "",
        weight: "",
        location: "",
        phone: "",
        image: null,
      });
      setPreview(null);
      setCalculatedPoints(0);

      // Update user points if backend returns updated user
      if (data.user) localStorage.setItem("user", JSON.stringify(data.user));
    } catch (err) {
      setError("Server error. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col justify-center items-center p-6 bg-gradient-to-br from-pink-100 via-yellow-100 to-green-100">
      <img
        src={logo}
        alt="EcoPay Logo"
        className="w-32 h-32 object-contain mb-4 drop-shadow-lg"
      />

      <div className="bg-white rounded-3xl shadow-2xl p-8 w-full max-w-md flex flex-col gap-6 border border-gray-100">
        <h2 className="text-3xl font-extrabold text-green-800 text-center">
          Submit Waste Pickup Request
        </h2>

        {error && (
          <p className="text-red-500 text-center font-medium bg-red-50 p-2 rounded-xl">
            {error}
          </p>
        )}

        {success && (
          <p className="text-green-700 text-center font-medium bg-green-50 p-2 rounded-xl">
            {success}
          </p>
        )}

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <select
            name="waste_type"
            value={form.waste_type}
            onChange={handleChange}
            required
            className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-400 text-base"
          >
            <option value="">Select Waste Type</option>
            <option value="Plastic">Plastic</option>
            <option value="Paper">Paper</option>
            <option value="Glass">Glass</option>
            <option value="Iron">Iron</option>
            <option value="Organic">Organic</option>
          </select>

          <input
            type="number"
            name="weight"
            placeholder="Weight (kg)"
            value={form.weight}
            onChange={handleChange}
            required
            min={0.1}
            className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-400 text-base"
          />

          {/* Display calculated points dynamically */}
          {form.waste_type && form.weight && calculatedPoints > 0 && (
            <p className="text-center text-green-700 font-semibold">
              Points to be awarded: {calculatedPoints}
            </p>
          )}

          <input
            type="text"
            name="location"
            placeholder="Pickup Location"
            value={form.location}
            onChange={handleChange}
            required
            className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-400 text-base"
          />

          <input
            type="text"
            name="phone"
            placeholder="Phone Number"
            value={form.phone}
            onChange={handleChange}
            required
            maxLength={10}
            className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-400 text-base"
          />

          <input
            type="file"
            name="image"
            accept=".png,.jpg,.jpeg"
            onChange={handleChange}
            required={!preview}
            className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-400 text-base"
          />

          {preview && (
            <div className="relative mt-2">
              <img
                src={preview}
                alt="Preview"
                className="w-full h-40 object-cover rounded-xl border border-gray-300 cursor-pointer"
                onClick={removeImage}
                title="Click to remove"
              />
              <p className="text-center text-sm text-gray-500 mt-1">
                Click the image to remove
              </p>
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className={`w-full bg-gradient-to-r from-green-400 via-green-500 to-green-600 text-white py-3 rounded-full text-lg font-semibold shadow-lg transform transition duration-300 ${
              loading ? "opacity-70 cursor-not-allowed" : "hover:scale-105"
            }`}
          >
            {loading ? "Submitting..." : "Submit Request"}
          </button>
        </form>

        <p className="text-center mt-2 text-sm text-gray-600">
          <button
            onClick={() => navigate("/home")}
            className="text-green-600 font-semibold hover:underline"
          >
            Back to Home
          </button>
        </p>
      </div>
    </div>
  );
}
