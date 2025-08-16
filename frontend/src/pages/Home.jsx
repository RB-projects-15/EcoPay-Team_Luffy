// src/pages/Home.jsx
import { useState } from "react";
import {
  FaCamera,
  FaTrash,
  FaMapMarkerAlt,
  FaRecycle,
  FaArrowLeft,
  FaCheckCircle,
  FaGift,
  FaArrowRight,
  FaFacebookF,
  FaTwitter,
  FaInstagram,
  FaLinkedinIn,
} from "react-icons/fa";
import { GoogleMap, Marker, useJsApiLoader } from "@react-google-maps/api";

export default function Home() {
  const [showForm, setShowForm] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const [previewURL, setPreviewURL] = useState(null);
  const [wasteType, setWasteType] = useState("");
  const [quantity, setQuantity] = useState("");
  const [location, setLocation] = useState("");
  const [coords, setCoords] = useState({ lat: 20.5937, lng: 78.9629 });
  const [selectedWaste, setSelectedWaste] = useState(null);

  const { isLoaded } = useJsApiLoader({
    googleMapsApiKey: "YOUR_API_KEY",
  });

  const handleFileChange = (e) => {
    if (e.target.files[0]) {
      setSelectedFile(e.target.files[0]);
      setPreviewURL(URL.createObjectURL(e.target.files[0]));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!selectedFile || !wasteType || !quantity || !location) {
      alert("Please fill all fields!");
      return;
    }
    alert("Waste pickup request submitted successfully!");
    setShowForm(false);
    setSelectedFile(null);
    setPreviewURL(null);
    setWasteType("");
    setQuantity("");
    setLocation("");
  };

  const wasteData = [
    {
      type: "Plastic",
      points: 10,
      color: "bg-gradient-to-r from-pink-100 via-pink-200 to-pink-100",
      image: "/plastic waste.jpg",
      description:
        "Plastic waste includes bottles, packaging, and containers. Recycling plastic helps reduce pollution and conserve resources.",
    },
    {
      type: "Glass",
      points: 8,
      color: "bg-gradient-to-r from-blue-100 via-blue-200 to-blue-100",
      image: "/glass waste.jpg",
      description:
        "Glass waste is 100% recyclable and can be reused endlessly without loss in quality. Common items include jars and bottles.",
    },
    {
      type: "Paper",
      points: 6,
      color: "bg-gradient-to-r from-yellow-100 via-yellow-200 to-yellow-100",
      image: "/paper waste.jpg",
      description:
        "Paper waste includes newspapers, books, and cardboard. Recycling paper saves trees and energy.",
    },
    {
      type: "Metal",
      points: 12,
      color: "bg-gradient-to-r from-gray-100 via-gray-200 to-gray-100",
      image: "/metal waste.jpeg",
      description:
        "Metal waste such as aluminum cans and steel scraps can be melted and reused, saving natural resources.",
    },
    {
      type: "E-Waste",
      points: 15,
      color: "bg-gradient-to-r from-purple-100 via-purple-200 to-purple-100",
      image: "/ewaste.jpg",
      description:
        "E-Waste includes old electronics like phones, laptops, and TVs. Proper recycling prevents toxic substances from harming the environment.",
    },
    {
      type: "Organic",
      points: 5,
      color: "bg-gradient-to-r from-green-100 via-green-200 to-green-100",
      image: "/organic waste.jpg",
      description:
        "Organic waste includes food scraps and garden waste. Composting organic waste enriches the soil naturally.",
    },
  ];

  const workflowSteps = [
    {
      title: "Upload Waste Image",
      icon: <FaCamera className="text-4xl text-pink-500" />,
      description:
        "Take a picture of your waste and upload it via the 'Sell Waste & Earn Points' form.",
    },
    {
      title: "Pickup & Collection",
      icon: <FaRecycle className="text-4xl text-green-500" />,
      description:
        "Our team collects the waste from your specified location quickly and safely.",
    },
    {
      title: "Points Awarded",
      icon: <FaCheckCircle className="text-4xl text-yellow-500" />,
      description:
        "Points are automatically added to your account based on waste type and quantity.",
    },
    {
      title: "Redeem Rewards",
      icon: <FaGift className="text-4xl text-purple-500" />,
      description:
        "Use your earned points to redeem discounts, products, or other offers in our store.",
    },
  ];

  const afterCollectionSteps = [
    {
      title: "Sorting & Segregation",
      image: "Sorting & Segregation.png",
      description:
        "Collected waste is sorted into plastics, metals, paper, glass, and organic waste for proper processing.",
    },
    {
      title: "Recycling & Processing",
      image: "/Recycling & Processing.jpg",
      description:
        "Each type of waste is processed: plastics are melted, metals are smelted, paper and glass are recycled, and organic waste is composted.",
    },
    {
      title: "Reuse & Contribution",
      image: "/Reuse & Contribution.jpeg",
      description:
        "Recycled materials are turned into new products, reducing pollution, conserving resources, and supporting sustainability.",
    },
  ];

  return (
    <div className="min-h-screen flex flex-col items-center bg-gradient-to-b from-green-50 via-yellow-50 to-pink-50 px-4 py-12">
      {/* Waste Info Side Panel */}
      {selectedWaste && (
        <div className="fixed inset-y-0 right-0 w-full sm:w-[400px] bg-white shadow-2xl z-50 overflow-y-auto border-l-4 border-green-400">
          <div className="p-6 border-b border-green-200 flex justify-between items-center">
            <h3 className="text-2xl font-bold">{selectedWaste.type}</h3>
            <button
              onClick={() => setSelectedWaste(null)}
              className="text-gray-500 hover:text-red-500 text-xl"
            >
              ✖
            </button>
          </div>
          <img
            src={selectedWaste.image}
            alt={selectedWaste.type}
            className="w-full h-52 object-cover"
          />
          <div className="p-6">
            <p className="text-green-700 font-semibold mb-3">
              {selectedWaste.points} points / kg
            </p>
            <p className="text-gray-600">{selectedWaste.description}</p>
          </div>
        </div>
      )}

      {!showForm ? (
        <div className="flex flex-col items-center gap-10 w-full max-w-6xl">
          {/* Action Card */}
          <div
            className="relative bg-gradient-to-r from-green-300 via-green-400 to-green-300 text-white rounded-3xl shadow-2xl p-10 flex items-center gap-6 cursor-pointer hover:scale-105 transition-transform duration-300 w-full max-w-2xl overflow-hidden group"
            onClick={() => setShowForm(true)}
          >
            <FaRecycle className="text-6xl drop-shadow-lg z-10" />
            <div className="z-10">
              <h2 className="text-3xl font-bold">Sell Waste & Earn Points</h2>
              <p className="mt-2 text-lg">
                Turn your waste into rewards! Click to start.
              </p>
            </div>
            {/* Full Hover Background Animation */}
            <div className="absolute inset-0 bg-gradient-to-r from-yellow-200 via-green-100 to-pink-200 opacity-0 group-hover:opacity-50 transition duration-500 rounded-3xl z-0"></div>
          </div>

          {/* Workflow Section */}
          <div className="w-full mt-12">
            <h3 className="text-2xl font-bold text-green-800 mb-10 text-center animate-fadeIn">
              How EcoPay Works
            </h3>
            <div className="flex flex-col lg:flex-row justify-center items-center gap-6">
              {workflowSteps.map((step, idx) => (
                <div
                  key={idx}
                  className="flex items-center animate-fadeIn"
                  style={{ animationDelay: `${idx * 200}ms` }}
                >
                  <div className="bg-gradient-to-r from-green-100 via-yellow-50 to-pink-50 rounded-xl shadow-lg p-6 flex flex-col items-center text-center hover:scale-105 transition-transform duration-300 w-48">
                    {step.icon}
                    <h4 className="text-xl font-bold text-gray-800 mt-4 mb-2">
                      {step.title}
                    </h4>
                    <p className="text-gray-600 text-sm">{step.description}</p>
                  </div>
                  {idx < workflowSteps.length - 1 && (
                    <FaArrowRight className="text-3xl text-gray-400 mx-4 hidden lg:block" />
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Waste Type Grid */}
          <div className="w-full mt-16">
            <h3 className="text-2xl font-bold text-green-800 mb-6 text-center animate-fadeIn">
              Waste Types & Points Awarded
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {wasteData.map((item, idx) => (
                <div
                  key={idx}
                  className={`rounded-xl shadow-lg overflow-hidden cursor-pointer transform hover:scale-105 transition animate-fadeIn ${item.color}`}
                  style={{ animationDelay: `${idx * 100}ms` }}
                  onClick={() => setSelectedWaste(item)}
                >
                  <img
                    src={item.image}
                    alt={item.type}
                    className="h-40 w-full object-cover"
                  />
                  <div className="p-4">
                    <h4 className="text-xl font-bold text-gray-800">
                      {item.type}
                    </h4>
                    <p className="text-gray-700 font-semibold">
                      {item.points} points / kg
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* After Waste Collection Section */}
          <div className="w-full mt-16">
            <h3 className="text-2xl font-bold text-green-800 mb-6 text-center animate-fadeIn">
              What Happens After Your Waste Is Collected
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
              {afterCollectionSteps.map((step, idx) => (
                <div
                  key={idx}
                  className="bg-gradient-to-r from-green-100 via-yellow-50 to-pink-50 rounded-xl shadow-lg p-6 flex flex-col items-center text-center hover:scale-105 transition-transform duration-300 animate-fadeIn"
                  style={{ animationDelay: `${idx * 150}ms` }}
                >
                  <img
                    src={step.image}
                    alt={step.title}
                    className="h-40 w-full object-cover rounded-lg mb-4"
                  />
                  <h4 className="text-xl font-bold text-gray-800 mb-2">
                    {step.title}
                  </h4>
                  <p className="text-gray-600">{step.description}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      ) : (
        /* Waste Submission Form */
        <div className="bg-gradient-to-r from-green-100 via-yellow-50 to-pink-50 rounded-3xl shadow-2xl w-full max-w-3xl p-8 animate-fadeIn border border-green-200">
          <button
            className="flex items-center font-semibold mb-6 text-green-700 hover:text-green-900 transition"
            onClick={() => setShowForm(false)}
          >
            <FaArrowLeft className="mr-2" /> Go Back
          </button>

          <h2 className="text-3xl font-bold text-green-700 mb-6">
            Waste Pickup Request
          </h2>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Upload Waste Image */}
            <label
              htmlFor="wasteUpload"
              className="bg-gradient-to-r from-pink-50 via-yellow-50 to-green-50 border-2 border-dashed border-green-300 rounded-xl p-6 flex flex-col items-center cursor-pointer hover:border-green-500 hover:bg-green-100 transition"
            >
              <FaCamera className="text-pink-500 text-5xl mb-3" />
              {selectedFile ? (
                <p className="text-green-700 font-medium text-lg">
                  {selectedFile.name}
                </p>
              ) : (
                <p className="text-gray-500 text-base">
                  Click to upload waste image
                </p>
              )}
              <input
                type="file"
                id="wasteUpload"
                accept="image/*"
                className="hidden"
                onChange={handleFileChange}
              />
            </label>

            {previewURL && (
              <div className="mt-3">
                <img
                  src={previewURL}
                  alt="Preview"
                  className="rounded-lg shadow-lg max-h-60 object-cover border border-green-200"
                />
              </div>
            )}

            {/* Waste Type */}
            <div>
              <label className="block text-gray-700 font-medium mb-2 text-lg">
                <FaTrash className="inline mr-2 text-green-600" /> Waste Type
              </label>
              <select
                value={wasteType}
                onChange={(e) => setWasteType(e.target.value)}
                className="w-full border border-gray-300 rounded-lg p-3 text-lg focus:outline-none focus:ring-2 focus:ring-pink-400"
              >
                <option value="">Select waste type</option>
                {wasteData.map((item, i) => (
                  <option key={i} value={item.type}>
                    {item.type}
                  </option>
                ))}
              </select>
            </div>

            {/* Quantity */}
            <div>
              <label className="block text-gray-700 font-medium mb-2 text-lg">
                Quantity (kg)
              </label>
              <input
                type="number"
                value={quantity}
                onChange={(e) => setQuantity(e.target.value)}
                className="w-full border border-gray-300 rounded-lg p-3 text-lg focus:outline-none focus:ring-2 focus:ring-pink-400"
                placeholder="Enter quantity"
                min="0.1"
                step="0.1"
              />
            </div>

            {/* Pickup Location */}
            <div>
              <label className="block text-gray-700 font-medium mb-2 text-lg">
                <FaMapMarkerAlt className="inline mr-2 text-green-600" /> Pickup
                Location (Text)
              </label>
              <input
                type="text"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                className="w-full border border-gray-300 rounded-lg p-3 text-lg focus:outline-none focus:ring-2 focus:ring-pink-400"
                placeholder="Enter pickup address"
              />
            </div>

            {/* Map Picker */}
            {isLoaded && (
              <div>
                <p className="text-gray-700 font-medium mb-2 text-lg">
                  Or select location on map:
                </p>
                <GoogleMap
                  mapContainerStyle={{ width: "100%", height: "250px" }}
                  center={coords}
                  zoom={5}
                  onClick={(e) =>
                    setCoords({ lat: e.latLng.lat(), lng: e.latLng.lng() })
                  }
                >
                  <Marker position={coords} />
                </GoogleMap>
                <p className="text-base text-gray-500 mt-2">
                  Selected: {coords.lat.toFixed(4)}, {coords.lng.toFixed(4)}
                </p>
              </div>
            )}

            {/* Submit */}
            <button
              type="submit"
              className="w-full bg-gradient-to-r from-green-300 via-green-400 to-green-300 text-white py-4 text-lg rounded-lg hover:scale-105 transition transform font-semibold shadow-md"
            >
              Submit Request
            </button>
          </form>
        </div>
      )}

      {/* Footer */}
      <footer className="w-full bg-green-900 text-white mt-16 py-8 px-6">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row justify-between items-center gap-6">
          <p className="text-lg font-semibold">
            © 2025 EcoPay. All rights reserved.
          </p>
          <div className="flex gap-4 text-xl">
            <a href="#" className="hover:text-green-300 transition">
              <FaFacebookF />
            </a>
            <a href="#" className="hover:text-green-300 transition">
              <FaTwitter />
            </a>
            <a href="#" className="hover:text-green-300 transition">
              <FaInstagram />
            </a>
            <a href="#" className="hover:text-green-300 transition">
              <FaLinkedinIn />
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
}
