import { useState } from "react";

export default function WasteSubmit() {
  const [file, setFile] = useState(null);
  const [wasteType, setWasteType] = useState("");
  const [weight, setWeight] = useState("");
  const [location, setLocation] = useState("");
  const [message, setMessage] = useState("");

  const user = JSON.parse(localStorage.getItem("user"));

  const handleUpload = async (e) => {
    e.preventDefault();
    setMessage("");

    if (!file || !wasteType || !weight || !location) {
      setMessage("Please fill all fields");
      return;
    }

    try {
      // Step 1: Upload image
      const formData = new FormData();
      formData.append("file", file);

      const uploadRes = await fetch("http://localhost:3000/api/waste/upload", {
        method: "POST",
        body: formData,
      });

      const uploadData = await uploadRes.json();
      if (!uploadRes.ok) throw new Error(uploadData.error || "Upload failed");

      // Step 2: Submit waste request
      const res = await fetch("http://localhost:3000/api/waste/submit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          user_id: user?.user_id,
          waste_type: wasteType,
          weight: parseFloat(weight),
          image_url: uploadData.image_url,
          location,
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Submission failed");

      setMessage("Waste request submitted successfully ✅");
    } catch (err) {
      setMessage(err.message);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-green-50 p-4">
      <form
        onSubmit={handleUpload}
        className="bg-white shadow-lg rounded-lg p-6 w-full max-w-md"
      >
        <h2 className="text-2xl font-bold text-green-700 mb-4">
          Submit Waste Pickup
        </h2>

        {message && (
          <p
            className={`p-2 rounded mb-3 ${
              message.includes("✅")
                ? "bg-green-100 text-green-700"
                : "bg-red-100 text-red-700"
            }`}
          >
            {message}
          </p>
        )}

        <input
          type="file"
          accept="image/*"
          onChange={(e) => setFile(e.target.files[0])}
          className="w-full mb-3"
        />

        <select
          value={wasteType}
          onChange={(e) => setWasteType(e.target.value)}
          className="w-full p-2 border rounded mb-3"
        >
          <option value="">Select waste type</option>
          <option value="Plastic">Plastic</option>
          <option value="Paper">Paper</option>
          <option value="Glass">Glass</option>
          <option value="Organic">Organic</option>
        </select>

        <input
          type="number"
          placeholder="Weight (kg)"
          value={weight}
          onChange={(e) => setWeight(e.target.value)}
          className="w-full p-2 border rounded mb-3"
        />

        <input
          type="text"
          placeholder="Pickup location"
          value={location}
          onChange={(e) => setLocation(e.target.value)}
          className="w-full p-2 border rounded mb-3"
        />

        <button
          type="submit"
          className="w-full bg-green-600 text-white p-2 rounded hover:bg-green-700"
        >
          Submit Request
        </button>
      </form>
    </div>
  );
}
