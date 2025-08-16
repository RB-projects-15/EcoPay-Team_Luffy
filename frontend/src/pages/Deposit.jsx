// src/pages/Deposit.jsx
import { useState } from "react";

export default function Deposit() {
  const [amount, setAmount] = useState("");

  const handleDeposit = (e) => {
    e.preventDefault();
    console.log(`Depositing ${amount} points`);
    alert(`Deposited ${amount} points to your wallet`);
    setAmount("");
  };

  return (
    <div className="min-h-screen bg-green-50 flex flex-col items-center justify-center p-6">
      <div className="bg-white shadow-lg rounded-xl p-8 w-full max-w-md">
        <h1 className="text-3xl font-bold text-green-700 mb-6 text-center">
          Deposit Points
        </h1>
        <form onSubmit={handleDeposit} className="space-y-4">
          <input
            type="number"
            placeholder="Enter points to deposit"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            required
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-green-500"
          />
          <button
            type="submit"
            className="w-full bg-green-600 text-white py-2 rounded-lg font-semibold hover:bg-green-700 transition"
          >
            Deposit
          </button>
        </form>
      </div>
    </div>
  );
}
