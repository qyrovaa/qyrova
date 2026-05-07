import React, { useState, useEffect } from "react";
import AuthModal from "./AuthModal";
import { playMusic, unmuteMusic } from "../utils/audio";

export default function StartPage({ onNext }) {
  const [showAuth, setShowAuth] = useState(false);

  // ✅ AUTOPLAY (muted) + unmute on first interaction
  useEffect(() => {
    playMusic(); // start muted audio immediately

    const unmute = () => {
      unmuteMusic();
      window.removeEventListener("pointerdown", unmute);
    };

    window.addEventListener("pointerdown", unmute, { once: true });

    return () => {
      window.removeEventListener("pointerdown", unmute);
    };
  }, []);

  const handleStart = () => {
    playMusic(); // ✅ fallback so it ALWAYS works

    const isLoggedIn = localStorage.getItem("isLoggedIn");
    const isSetupComplete = localStorage.getItem("isSetupComplete");

    if (isLoggedIn !== "true") {
      setShowAuth(true);
      return;
    }

    if (isSetupComplete === "true") {
      onNext("level");
      return;
    }

    onNext("degree");
  };

  return (
    <div
      className="relative h-screen w-screen flex items-center justify-center text-white overflow-hidden"
      style={{
        backgroundImage: "url('/startpage.png')",
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      <style>
        {`
        @import url('https://fonts.googleapis.com/css2?family=Orbitron:wght@500;700;900&display=swap');
        `}
      </style>

      <div className="absolute inset-0 bg-black/60" />

      <div className="relative z-10 text-center">
        <h1
          className="text-8xl font-bold tracking-[0.18em] mb-4"
          style={{ fontFamily: "Orbitron, sans-serif" }}
        >
          QYROVA
        </h1>

        <p className="text-sm tracking-[0.45em] text-neutral-400 mb-10">
          BE THE OBVIOUS CHOICE
        </p>

        <button
          onClick={handleStart}
          className="px-12 py-3 bg-white/10 backdrop-blur-md
          border border-white/20 rounded-md text-lg tracking-widest
          transition-all duration-300
          hover:-translate-y-1 hover:scale-105
          hover:border-white/60
          hover:shadow-[0_0_30px_rgba(255,255,255,0.35)]
          active:scale-95"
        >
          GET STARTED
        </button>
      </div>

      {showAuth && (
        <AuthModal
          type="login"
          onClose={() => {
            setShowAuth(false);
          }}
        />
      )}
    </div>
  );
}