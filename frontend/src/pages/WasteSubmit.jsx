// src/pages/WasteSubmit.jsx
import { useState, useRef } from "react";
import {
  FaCamera,
  FaTrash,
  FaMapMarkerAlt,
  FaArrowLeft,
  FaStickyNote,
  FaPhone,
} from "react-icons/fa";
import {
  GoogleMap,
  Marker,
  useJsApiLoader,
  Autocomplete,
} from "@react-google-maps/api";
import { useNavigate } from "react-router-dom";

export default function WasteSubmit() {
  const [file, setFile] = useState(null);
  const [previewURL, setPreviewURL] = useState(null);
  const [fileName, setFileName] = useState("");
  const [wasteType, setWasteType] = useState("");
  const [quantity, setQuantity] = useState("");
  const [location, setLocation] = useState("");
  const [coords, setCoords] = useState({ lat: 20.5937, lng: 78.9629 });
  const [placeName, setPlaceName] = useState("");
  const [notes, setNotes] = useState("");
  const [countryCode, setCountryCode] = useState("+91");
  const [phone, setPhone] = useState("");
  const [message, setMessage] = useState("");

  const navigate = useNavigate();
  const autoRef = useRef(null);

  const { isLoaded } = useJsApiLoader({
    googleMapsApiKey: import.meta.env.VITE_GOOGLE_MAPS_API_KEY, // ✅ safer
    libraries: ["places"],
  });

  const resetForm = () => {
    setFile(null);
    setPreviewURL(null);
    setFileName("");
    setWasteType("");
    setQuantity("");
    setLocation("");
    setPlaceName("");
    setNotes("");
    setPhone("");
  };

  const handleFileChange = (e) => {
    const selected = e.target.files[0];
    if (selected && ["image/png", "image/jpeg"].includes(selected.type)) {
      setFile(selected);
      setPreviewURL(URL.createObjectURL(selected));
      setFileName(selected.name);
      setMessage("");
    } else {
      setFile(null);
      setPreviewURL(null);
      setFileName("");
      setMessage("⚠️ Please upload only PNG or JPG images");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (
      !file ||
      !wasteType ||
      !quantity ||
      (!location && !placeName) ||
      !phone
    ) {
      setMessage("⚠️ Please fill in all required fields");
      return;
    }

    if (!/^\d{7,15}$/.test(phone)) {
      setMessage("⚠️ Please enter a valid phone number (7–15 digits)");
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
          user_id: JSON.parse(localStorage.getItem("user"))?.user_id,
          waste_type: wasteType,
          weight: parseFloat(quantity),
          image_url: uploadData.image_url,
          location: location || placeName,
          coords,
          notes,
          contact: `${countryCode} ${phone}`,
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Submission failed");

      setMessage("✅ Waste request submitted successfully");
      resetForm();
    } catch (err) {
      setMessage(`❌ ${err.message}`);
    }
  };

  const handleMapClick = async (e) => {
    const lat = e.latLng.lat();
    const lng = e.latLng.lng();
    setCoords({ lat, lng });

    try {
      const response = await fetch(
        `https://maps.googleapis.com/maps/api/geocode/json?latlng=${lat},${lng}&key=${
          import.meta.env.VITE_GOOGLE_MAPS_API_KEY
        }`
      );
      const data = await response.json();
      if (data.results?.[0]) {
        setPlaceName(data.results[0].formatted_address);
      } else {
        setPlaceName(`Lat: ${lat.toFixed(4)}, Lng: ${lng.toFixed(4)}`);
      }
    } catch {
      setPlaceName(`Lat: ${lat.toFixed(4)}, Lng: ${lng.toFixed(4)}`);
    }
  };

  const handlePlaceSelect = () => {
    const place = autoRef.current.getPlace();
    if (place?.geometry) {
      const lat = place.geometry.location.lat();
      const lng = place.geometry.location.lng();
      setCoords({ lat, lng });
      setPlaceName(place.formatted_address);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-green-50 via-yellow-50 to-pink-50 px-2 py-6">
      <div className="bg-gradient-to-r from-green-100 via-yellow-50 to-pink-50 rounded-2xl shadow-xl w-full max-w-2xl p-6 animate-fadeIn border border-green-200">
        {/* Back button */}
        <button
          className="flex items-center font-semibold mb-4 text-green-700 hover:text-green-900 transition"
          onClick={() => navigate(-1)}
        >
          <FaArrowLeft className="mr-2" /> Go Back
        </button>

        <h2 className="text-2xl font-bold text-green-700 mb-4 text-center">
          Waste Pickup Request
        </h2>

        {message && (
          <p
            className={`p-2 rounded mb-3 text-center font-medium ${
              message.startsWith("✅")
                ? "bg-green-100 text-green-700"
                : "bg-red-100 text-red-700"
            }`}
          >
            {message}
          </p>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Upload Waste Image */}
          <label
            htmlFor="wasteUpload"
            className="bg-gradient-to-r from-green-50 via-yellow-50 to-green-50 border-2 border-dashed border-green-300 rounded-xl p-4 flex flex-col items-center cursor-pointer hover:border-green-500 hover:bg-green-100 transition"
          >
            <FaCamera className="text-green-500 text-4xl mb-2" />
            {previewURL ? (
              <>
                <img
                  src={previewURL}
                  alt="Preview"
                  className="rounded-lg shadow max-h-32 object-cover border border-green-200 mb-1"
                />
                <p className="text-sm text-gray-600">{fileName}</p>
              </>
            ) : (
              <p className="text-gray-500 text-sm">
                Click to upload PNG/JPG waste image
              </p>
            )}
            <input
              type="file"
              id="wasteUpload"
              accept="image/png, image/jpeg"
              className="hidden"
              onChange={handleFileChange}
            />
          </label>

          {/* Waste Type */}
          <div>
            <label className="block text-gray-700 font-medium mb-1 text-base">
              <FaTrash className="inline mr-2 text-green-600" /> Waste Type
            </label>
            <select
              value={wasteType}
              onChange={(e) => setWasteType(e.target.value)}
              className="w-full border border-gray-300 rounded-lg p-2 text-base focus:outline-none focus:ring-2 focus:ring-green-400"
            >
              <option value="">Select waste type</option>
              <option value="Plastic">Plastic</option>
              <option value="Paper">Paper</option>
              <option value="Glass">Glass</option>
              <option value="Organic">Organic</option>
            </select>
          </div>

          {/* Quantity */}
          <div>
            <label className="block text-gray-700 font-medium mb-1 text-base">
              Quantity (kg)
            </label>
            <input
              type="number"
              value={quantity}
              onChange={(e) => setQuantity(e.target.value)}
              className="w-full border border-gray-300 rounded-lg p-2 text-base focus:outline-none focus:ring-2 focus:ring-green-400"
              placeholder="Enter quantity"
              min="0.1"
              step="0.1"
            />
          </div>

          {/* Contact Number */}
          <div>
            <label className="block text-gray-700 font-medium mb-1 text-base">
              <FaPhone className="inline mr-2 text-green-600" /> Contact Number
            </label>
            <div className="flex">
              <select
                value={countryCode}
                onChange={(e) => setCountryCode(e.target.value)}
                className="border border-gray-300 rounded-l-lg p-2 bg-white text-base focus:outline-none"
              >
                <option value="+91">🇮🇳 +91</option>
                <option value="+1">🇺🇸 +1</option>
                <option value="+44">🇬🇧 +44</option>
                <option value="+61">🇦🇺 +61</option>
              </select>
              <input
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value.replace(/\D/g, ""))}
                className="w-full border border-gray-300 rounded-r-lg p-2 text-base focus:outline-none focus:ring-2 focus:ring-green-400"
                placeholder="Enter phone number"
              />
            </div>
          </div>

          {/* Pickup Location with Autocomplete */}
          <div>
            <label className="block text-gray-700 font-medium mb-1 text-base">
              <FaMapMarkerAlt className="inline mr-2 text-green-600" /> Pickup
              Location
            </label>
            {isLoaded && (
              <Autocomplete
                onLoad={(auto) => (autoRef.current = auto)}
                onPlaceChanged={handlePlaceSelect}
              >
                <input
                  type="text"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  placeholder="Enter pickup address"
                  className="w-full border border-gray-300 rounded-lg p-2 text-base focus:outline-none focus:ring-2 focus:ring-green-400"
                />
              </Autocomplete>
            )}
          </div>

          {/* Map Picker */}
          {isLoaded && (
            <div className="w-full h-[250px] border border-green-300 rounded-lg overflow-hidden">
              <GoogleMap
                mapContainerStyle={{ width: "100%", height: "100%" }}
                center={coords}
                zoom={15}
                onClick={handleMapClick}
              >
                <Marker position={coords} />
              </GoogleMap>
              <p className="text-sm text-gray-600 mt-1 text-center">
                📍{" "}
                {placeName ||
                  location ||
                  `Lat: ${coords.lat}, Lng: ${coords.lng}`}
              </p>
            </div>
          )}

          {/* Notes Section */}
          <div>
            <label className="block text-gray-700 font-medium mb-1 text-base">
              <FaStickyNote className="inline mr-2 text-green-600" /> Additional
              Notes
            </label>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="w-full border border-gray-300 rounded-lg p-2 text-base focus:outline-none focus:ring-2 focus:ring-green-400"
              placeholder="e.g., Near Lovely Building, 2nd floor"
              rows={2}
            />
          </div>

          {/* Submit */}
          <button
            type="submit"
            className="w-full bg-gradient-to-r from-green-300 via-green-400 to-green-300 text-white py-3 text-base rounded-lg hover:scale-105 transition transform font-semibold shadow-md"
          >
            Submit Request
          </button>
        </form>
      </div>
    </div>
  );
}
