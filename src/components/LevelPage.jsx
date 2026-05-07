import React from "react";
import { stopMusic } from "../utils/audio"; // ✅ added

export default function LevelPage({ onSelect, user }) {
  return (
    <div
      className="min-h-screen flex flex-col items-center justify-center text-white px-6"
      style={{
        backgroundImage: "url('/profilesetuppages.png')",
        backgroundSize: "cover",
        backgroundPosition: "center",
        fontFamily: "Rajdhani, sans-serif"
      }}
    >
      <h2
        className="mb-10 text-center"
        style={{
          fontFamily: "Michroma, sans-serif",
          fontSize: "38px",
          letterSpacing: "0.15em",
          textTransform: "uppercase"
        }}
      >
        {user?.name
          ? `${user.name}, what's your level today?`
          : "What's your level today?"}
      </h2>

      <div className="flex gap-6">

        <button
          onClick={() => {
            stopMusic(); // ✅ smooth fade-out
            onSelect("basic");
          }}
          className="group relative overflow-hidden w-[180px] h-[70px] flex items-center justify-center
          border border-pink-500 rounded-xl
          transition-all duration-300 hover:scale-105
          hover:shadow-[0_0_12px_rgba(236,72,153,0.7)]"
          style={{
            fontFamily: "Rajdhani, sans-serif",
            fontWeight: "700",
            fontSize: "18px"
          }}
        >
          <div
            className="absolute inset-0 opacity-0 group-hover:opacity-100 transition duration-500"
            style={{
              background:
                "linear-gradient(120deg, transparent 40%, rgba(255,255,255,0.35), transparent 60%)",
              animation: "scan 2s linear infinite"
            }}
          />
          Basic
        </button>

        <button
          onClick={() => {
            stopMusic();
            onSelect("intermediate");
          }}
          className="group relative overflow-hidden w-[180px] h-[70px] flex items-center justify-center
          border border-purple-500 rounded-xl
          transition-all duration-300 hover:scale-105
          hover:shadow-[0_0_12px_rgba(168,85,247,0.7)]"
          style={{
            fontFamily: "Rajdhani, sans-serif",
            fontWeight: "700",
            fontSize: "18px"
          }}
        >
          <div
            className="absolute inset-0 opacity-0 group-hover:opacity-100 transition duration-500"
            style={{
              background:
                "linear-gradient(120deg, transparent 40%, rgba(255,255,255,0.35), transparent 60%)",
              animation: "scan 2s linear infinite"
            }}
          />
          Intermediate
        </button>

        <button
          onClick={() => {
            stopMusic();
            onSelect("hardcore");
          }}
          className="group relative overflow-hidden w-[180px] h-[70px] flex items-center justify-center
          border border-blue-500 rounded-xl
          transition-all duration-300 hover:scale-105
          hover:shadow-[0_0_12px_rgba(59,130,246,0.7)]"
          style={{
            fontFamily: "Rajdhani, sans-serif",
            fontWeight: "700",
            fontSize: "18px"
          }}
        >
          <div
            className="absolute inset-0 opacity-0 group-hover:opacity-100 transition duration-500"
            style={{
              background:
                "linear-gradient(120deg, transparent 40%, rgba(255,255,255,0.35), transparent 60%)",
              animation: "scan 2s linear infinite"
            }}
          />
          Hardcore
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