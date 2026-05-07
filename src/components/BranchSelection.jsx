import React, { useState, useEffect } from "react";

export default function BranchSelection({ onSelect }) {

  const [name, setName] = useState("");

  useEffect(() => {
    const rawName = localStorage.getItem("qyrovaName");

    if (rawName) {
      const formatted =
        rawName.trim().charAt(0).toUpperCase() + rawName.trim().slice(1);
      setName(formatted);
    }
  }, []);

  return (
    <div
      className="min-h-screen flex flex-col items-center justify-center text-white px-6 relative"
      style={{
        backgroundImage: "url('/profilesetuppages.png')",
        backgroundSize: "cover",
        backgroundPosition: "center",
        fontFamily: "Rajdhani, sans-serif"
      }}
    >

      <div className="absolute top-20 left-0 w-full text-center">
        <p className="text-xs text-gray-400 tracking-widest">
          STEP 2 OF 3
        </p>
      </div>

      <h2
        className="mb-4"
        style={{
          fontFamily: "Michroma, sans-serif",
          fontSize: "38px",
          letterSpacing: "0.05em",
          textTransform: "none"
        }}
      >
        {name
          ? `${name}, What is your domain of expertise??`
          : "What is your domain of expertise??"}
      </h2>

      <p className="mb-12 text-gray-400"></p>

      <div className="grid grid-cols-2 gap-8 max-w-3xl w-full">

        <button
          onClick={() => {
            const existing = JSON.parse(localStorage.getItem("userData")) || {};
            localStorage.setItem("userData", JSON.stringify({ ...existing, branch: "csit" }));
            onSelect("csit");
          }}
          className="group relative overflow-hidden h-[80px] px-6 flex items-center justify-center text-center
          border border-purple-500 rounded-xl
          transition-all duration-300 hover:scale-105
          hover:shadow-[0_0_12px_rgba(168,85,247,0.7)]"
          style={{
            fontFamily: "Rajdhani, sans-serif",
            fontWeight: "700",
            fontSize: "18px"
          }}
        >
          <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition duration-500"
            style={{
              background:
                "linear-gradient(120deg, transparent 40%, rgba(255,255,255,0.35), transparent 60%)",
              animation: "scan 2s linear infinite"
            }}
          />
          <span className="leading-snug break-words">
            Computer Science & Information Technology
          </span>
        </button>

        <button
          onClick={() => {
            const existing = JSON.parse(localStorage.getItem("userData")) || {};
            localStorage.setItem("userData", JSON.stringify({ ...existing, branch: "ece" }));
            onSelect("ece");
          }}
          className="group relative overflow-hidden h-[80px] px-6 flex items-center justify-center text-center
          border border-pink-500 rounded-xl
          transition-all duration-300 hover:scale-105
          hover:shadow-[0_0_12px_rgba(236,72,153,0.7)]"
          style={{
            fontFamily: "Rajdhani, sans-serif",
            fontWeight: "700",
            fontSize: "18px"
          }}
        >
          <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition duration-500"
            style={{
              background:
                "linear-gradient(120deg, transparent 40%, rgba(255,255,255,0.35), transparent 60%)",
              animation: "scan 2s linear infinite"
            }}
          />
          <span className="leading-snug break-words">
            Electronics & Communication Engineering
          </span>
        </button>

        <button
          onClick={() => {
            const existing = JSON.parse(localStorage.getItem("userData")) || {};
            localStorage.setItem("userData", JSON.stringify({ ...existing, branch: "ee" }));
            onSelect("ee");
          }}
          className="group relative overflow-hidden h-[80px] px-6 flex items-center justify-center text-center
          border border-pink-500 rounded-xl
          transition-all duration-300 hover:scale-105
          hover:shadow-[0_0_12px_rgba(236,72,153,0.7)]"
          style={{
            fontFamily: "Rajdhani, sans-serif",
            fontWeight: "700",
            fontSize: "18px"
          }}
        >
          <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition duration-500"
            style={{
              background:
                "linear-gradient(120deg, transparent 40%, rgba(255,255,255,0.35), transparent 60%)",
              animation: "scan 2s linear infinite"
            }}
          />
          <span className="leading-snug break-words">
            Electrical Engineering
          </span>
        </button>

        <button
          onClick={() => {
            const existing = JSON.parse(localStorage.getItem("userData")) || {};
            localStorage.setItem("userData", JSON.stringify({ ...existing, branch: "me" }));
            onSelect("me");
          }}
          className="group relative overflow-hidden h-[80px] px-6 flex items-center justify-center text-center
          border border-purple-500 rounded-xl
          transition-all duration-300 hover:scale-105
          hover:shadow-[0_0_12px_rgba(168,85,247,0.7)]"
          style={{
            fontFamily: "Rajdhani, sans-serif",
            fontWeight: "700",
            fontSize: "18px"
          }}
        >
          <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition duration-500"
            style={{
              background:
                "linear-gradient(120deg, transparent 40%, rgba(255,255,255,0.35), transparent 60%)",
              animation: "scan 2s linear infinite"
            }}
          />
          <span className="leading-snug break-words">
            Mechanical Engineering
          </span>
        </button>

      </div>

      <style>{`
        @keyframes scan {
          0% { transform: translateX(-120%); }
          100% { transform: translateX(120%); }
        }
      `}</style>

    </div>
  );
}