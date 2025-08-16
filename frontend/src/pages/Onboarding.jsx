import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function Onboarding() {
  const navigate = useNavigate();
  const [step, setStep] = useState(0);

  const slides = [
    {
      title: "Recycle Today, Reward Tomorrow",
      description:
        "EcoPay lets you scan and recycle waste to earn points instantly.",
      image: "/onboard1.png",
    },
    {
      title: "Track Your Progress",
      description:
        "View your environmental impact and see how much waste you've saved.",
      image: "/onboard2.png",
    },
    {
      title: "Redeem Coins for Rewards",
      description:
        "Use your earned coins at eco-friendly partner stores for discounts.",
      image: "/onboard3.png",
    },
  ];

  const handleNext = () => {
    if (step < slides.length - 1) {
      setStep(step + 1);
    } else {
      navigate("/register");
    }
  };

  return (
    <div className="min-h-screen flex flex-col justify-center items-center text-center p-6 bg-gradient-to-br from-pink-100 via-yellow-100 to-green-100 animate-fadeIn">
      {/* Slide Card */}
      <div className="bg-white rounded-3xl shadow-2xl p-8 max-w-md w-full flex flex-col items-center gap-6 hover:shadow-emerald-400 transition-shadow duration-500">
        {/* Image */}
        <img
          src={slides[step].image}
          alt={slides[step].title}
          className="w-64 h-64 object-contain rounded-xl shadow-md"
        />

        {/* Title */}
        <h2 className="text-3xl font-bold text-green-800">
          {slides[step].title}
        </h2>

        {/* Description */}
        <p className="text-gray-700 text-lg">{slides[step].description}</p>

        {/* Buttons */}
        <div className="flex gap-4 mt-4">
          <button
            onClick={() => navigate("/register")}
            className="px-6 py-2 bg-gradient-to-r from-gray-300 to-gray-400 rounded-full shadow hover:from-gray-400 hover:to-gray-500 transition"
          >
            Skip
          </button>
          <button
            onClick={handleNext}
            className="px-6 py-2 bg-gradient-to-r from-green-400 via-green-500 to-green-600 text-white rounded-full shadow-lg hover:scale-105 transition transform"
          >
            {step === slides.length - 1 ? "Finish" : "Next"}
          </button>
        </div>

        {/* Step indicators */}
        <div className="flex gap-2 mt-6">
          {slides.map((_, index) => (
            <span
              key={index}
              className={`w-3 h-3 rounded-full ${
                index === step ? "bg-green-600" : "bg-gray-300"
              }`}
            ></span>
          ))}
        </div>
      </div>
    </div>
  );
}
