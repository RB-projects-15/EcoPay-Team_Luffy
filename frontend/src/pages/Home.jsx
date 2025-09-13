// src/pages/Home.jsx
import { useState } from "react";
import {
  FaCamera,
  FaRecycle,
  FaArrowRight,
  FaFacebookF,
  FaTwitter,
  FaInstagram,
  FaLinkedinIn,
} from "react-icons/fa";
import { useNavigate } from "react-router-dom";

export default function Home() {
  const [selectedWaste, setSelectedWaste] = useState(null);
  const navigate = useNavigate();

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
      icon: <FaCamera className="text-3xl sm:text-4xl text-pink-500" />,
      description:
        "Take a picture of your waste and upload it via the 'Sell Waste & Earn Points' form.",
    },
    {
      title: "Pickup & Collection",
      icon: <FaRecycle className="text-3xl sm:text-4xl text-green-500" />,
      description:
        "Our team collects the waste from your specified location quickly and safely.",
    },
    {
      title: "Points Awarded",
      icon: <FaRecycle className="text-3xl sm:text-4xl text-yellow-500" />,
      description:
        "Points are automatically added to your account based on waste type and quantity.",
    },
    {
      title: "Redeem Rewards",
      icon: <FaRecycle className="text-3xl sm:text-4xl text-purple-500" />,
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
    <div className="min-h-screen flex flex-col items-center bg-gradient-to-b from-green-50 via-yellow-50 to-pink-50 px-3 sm:px-4 py-8 sm:py-12">
      {/* Waste Info Side Panel */}
      {selectedWaste && (
        <div className="fixed inset-y-0 right-0 w-full sm:w-[400px] bg-white shadow-2xl z-50 overflow-y-auto border-l-4 border-green-400 animate-slideIn">
          <div className="p-4 sm:p-6 border-b border-green-200 flex justify-between items-center">
            <h3 className="text-xl sm:text-2xl font-bold">
              {selectedWaste.type}
            </h3>
            <button
              onClick={() => setSelectedWaste(null)}
              className="text-gray-500 hover:text-red-500 text-lg sm:text-xl"
            >
              ✖
            </button>
          </div>
          <img
            src={selectedWaste.image}
            alt={selectedWaste.type}
            className="w-full h-40 sm:h-52 object-cover"
          />
          <div className="p-4 sm:p-6">
            <p className="text-green-700 font-semibold mb-2 sm:mb-3">
              {selectedWaste.points} points / kg
            </p>
            <p className="text-gray-600 text-sm sm:text-base">
              {selectedWaste.description}
            </p>
          </div>
        </div>
      )}

      <div className="flex flex-col items-center gap-8 sm:gap-10 w-full max-w-6xl">
        {/* Action Card */}
        <div
          onClick={() => navigate("/waste-submit")}
          className="relative bg-gradient-to-r from-green-300 via-green-400 to-green-300 text-white rounded-2xl sm:rounded-3xl shadow-2xl p-6 sm:p-10 flex flex-col sm:flex-row items-center gap-4 sm:gap-6 cursor-pointer hover:scale-105 transition-transform duration-300 w-full max-w-3xl overflow-hidden group"
        >
          <FaRecycle className="text-5xl sm:text-6xl drop-shadow-lg z-10" />
          <div className="z-10 text-center sm:text-left">
            <h2 className="text-2xl sm:text-3xl font-bold">
              Sell Waste & Earn Points
            </h2>
            <p className="mt-1 sm:mt-2 text-base sm:text-lg">
              Turn your waste into rewards! Click to start.
            </p>
          </div>
          <div className="absolute inset-0 bg-gradient-to-r from-yellow-200 via-green-100 to-pink-200 opacity-0 group-hover:opacity-50 transition duration-500 rounded-2xl sm:rounded-3xl z-0"></div>
        </div>

        {/* Workflow Section */}
        <div className="w-full mt-8 sm:mt-12">
          <h3 className="text-xl sm:text-2xl font-bold text-green-800 mb-6 sm:mb-10 text-center">
            How EcoPay Works
          </h3>
          <div className="flex flex-col lg:flex-row justify-center items-center gap-6">
            {workflowSteps.map((step, idx) => (
              <div key={idx} className="flex items-center">
                <div className="bg-gradient-to-r from-green-100 via-yellow-50 to-pink-50 rounded-xl shadow-lg p-4 sm:p-6 flex flex-col items-center text-center hover:scale-105 transition-transform duration-300 w-44 sm:w-56">
                  {step.icon}
                  <h4 className="text-base sm:text-lg font-bold text-gray-800 mt-3 sm:mt-4 mb-1 sm:mb-2">
                    {step.title}
                  </h4>
                  <p className="text-gray-600 text-xs sm:text-sm">
                    {step.description}
                  </p>
                </div>
                {idx < workflowSteps.length - 1 && (
                  <FaArrowRight className="text-2xl sm:text-3xl text-gray-400 mx-2 sm:mx-4 hidden lg:block" />
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Waste Type Grid */}
        <div className="w-full mt-12 sm:mt-16">
          <h3 className="text-xl sm:text-2xl font-bold text-green-800 mb-4 sm:mb-6 text-center">
            Waste Types & Points Awarded
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
            {wasteData.map((item, idx) => (
              <div
                key={idx}
                onClick={() => setSelectedWaste(item)}
                className={`rounded-xl shadow-lg overflow-hidden cursor-pointer transform hover:scale-105 transition ${item.color}`}
              >
                <img
                  src={item.image}
                  alt={item.type}
                  className="h-32 sm:h-40 w-full object-cover"
                />
                <div className="p-3 sm:p-4">
                  <h4 className="text-lg sm:text-xl font-bold text-gray-800">
                    {item.type}
                  </h4>
                  <p className="text-gray-700 font-semibold text-sm sm:text-base">
                    {item.points} points / kg
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* After Waste Collection Section */}
        <div className="w-full mt-12 sm:mt-16">
          <h3 className="text-xl sm:text-2xl font-bold text-green-800 mb-4 sm:mb-6 text-center">
            What Happens After Your Waste Is Collected
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
            {afterCollectionSteps.map((step, idx) => (
              <div
                key={idx}
                className="bg-gradient-to-r from-green-100 via-yellow-50 to-pink-50 rounded-xl shadow-lg p-4 sm:p-6 flex flex-col items-center text-center hover:scale-105 transition-transform duration-300"
              >
                <img
                  src={step.image}
                  alt={step.title}
                  className="h-32 sm:h-40 w-full object-cover rounded-lg mb-3 sm:mb-4"
                />
                <h4 className="text-lg sm:text-xl font-bold text-gray-800 mb-1 sm:mb-2">
                  {step.title}
                </h4>
                <p className="text-gray-600 text-sm sm:text-base">
                  {step.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="w-full bg-green-900 text-white mt-12 sm:mt-16 py-6 sm:py-8 px-4 sm:px-6">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row justify-between items-center gap-4 sm:gap-6 text-center md:text-left">
          <p className="text-sm sm:text-lg font-semibold">
            © 2025 EcoPay. All rights reserved.
          </p>
          <div className="flex gap-3 sm:gap-4 text-lg sm:text-xl">
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
