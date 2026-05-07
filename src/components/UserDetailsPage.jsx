import React, { useState } from "react";
import { saveUser } from "../user";
import { useLocation } from "react-router-dom"; // ✅ added

export default function UserDetailsPage({ onNext }) {
  const location = useLocation(); // ✅ added

  const [name, setName] = useState(location.state?.name || ""); // ✅ updated
  const [email, setEmail] = useState(location.state?.email || ""); // ✅ updated
  const [password, setPassword] = useState("");

  const handleContinue = () => {
    if (!name.trim() || !email.trim() || !password.trim()) {
      return;
    }

    // ✅ SAVE USER (important)
    const user = {
      name,
      email,
      password,
      isLoggedIn: true,
    };

    saveUser(user);

    onNext({ name, email });
  };

  return (
    <div
      className="min-h-screen flex items-center justify-center text-white"
      style={{
        backgroundImage: "url('/interview-bg.jpg')",
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      <div className="bg-black/85 p-10 rounded-2xl w-full max-w-md">
        <h2 className="text-3xl mb-8 text-center tracking-wide">
          Create Your Account
        </h2>

        <input
          type="text"
          placeholder="Your Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="w-full p-3 mb-4 bg-black text-white border border-purple-500 rounded-xl"
        />

        <input
          type="email"
          placeholder="Your Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full p-3 mb-4 bg-black text-white border border-pink-500 rounded-xl"
        />

        <input
          type="password"
          placeholder="Create Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full p-3 mb-6 bg-black text-white border border-blue-500 rounded-xl"
        />

        <button
          onClick={handleContinue}
          className="w-full py-3 text-lg font-medium border border-purple-500 rounded-xl hover:scale-105 transition-all duration-300"
        >
          Continue
        </button>
      </div>
    </div>
  );
}