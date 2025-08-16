import { useState } from "react";

export default function LocationSelect() {
  const [location, setLocation] = useState("");

  const handleLocation = () => {
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const coords = `${position.coords.latitude}, ${position.coords.longitude}`;
        setLocation(coords);
      },
      (error) => {
        alert("Unable to fetch location. Please enable GPS.");
        console.error(error);
      }
    );
  };

  return (
    <div className="min-h-screen bg-green-50 flex flex-col items-center justify-center p-6">
      <h1 className="text-3xl font-bold text-green-700 mb-4">
        Select Waste Pickup Location
      </h1>
      <button
        onClick={handleLocation}
        className="bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 transition"
      >
        Get My Location
      </button>

      {location && (
        <p className="mt-4 text-green-800 font-medium">
          Your Location: {location}
        </p>
      )}
    </div>
  );
}
