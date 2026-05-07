import React from "react";

export default function DegreeSelection({ onSelect }) {

  const rawName = localStorage.getItem("qyrovaName");

  const name = rawName
    ? rawName.trim().charAt(0).toUpperCase() + rawName.trim().slice(1)
    : "";

  return (
    <div
      className="min-h-screen flex items-center justify-center text-white px-6 relative overflow-hidden"
      style={{
        backgroundImage: "url('/profilesetuppages.png')",
        backgroundSize: "cover",
        backgroundPosition: "center",
        fontFamily: "Rajdhani, sans-serif"
      }}
    >

      <div
        className="absolute inset-0 opacity-10 pointer-events-none"
        style={{
          backgroundImage:
            "linear-gradient(rgba(255,255,255,0.05) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.05) 1px, transparent 1px)",
          backgroundSize: "40px 40px"
        }}
      />

      <div className="absolute top-20 left-0 w-full text-center">
        <p className="text-xs text-gray-400 tracking-widest">
          STEP 1 OF 3
        </p>
      </div>

      <div className="relative text-center max-w-3xl w-full">

        <h2
          className="mb-4"
          style={{
            fontFamily: "Michroma, sans-serif",
            fontSize: "38px",
            letterSpacing: "0.18em",
            textTransform: "normal-case",
            textShadow: "0 0 20px rgba(255,255,255,0.25)"
          }}
        >
          {name ? `Hey ${name},` : "Hey,"}
          <span className="block">What’s your background?</span>
        </h2>

        <p className="mb-10 text-gray-400"></p>

        <div className="grid grid-cols-2 gap-6">

          <button
            onClick={() => {
              const existing = JSON.parse(localStorage.getItem("userData")) || {};
              localStorage.setItem("userData", JSON.stringify({ ...existing, degree: "btech" }));
              onSelect("btech");
            }}
            className="group relative border border-blue-500/70 rounded-lg py-5 px-6
            transition-all duration-300 hover:border-blue-400
            hover:shadow-[0_0_25px_rgba(59,130,246,0.7)]
            hover:-translate-y-1 overflow-hidden"
          >
            <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition duration-500"
              style={{
                background: "linear-gradient(120deg, transparent 40%, rgba(255,255,255,0.4), transparent 60%)",
                animation: "scan 2s linear infinite"
              }}
            />
            <p className="text-xl font-bold tracking-wide">B.Tech</p>
          </button>

          <div className="border border-pink-500/70 rounded-lg py-5 px-6 opacity-40">
            <p className="text-xl font-bold">MBA</p>
            <p className="text-xs mt-1 text-gray-500">Coming Soon</p>
          </div>

          <div className="border border-pink-500/70 rounded-lg py-5 px-6 opacity-40">
            <p className="text-xl font-bold">M.Tech</p>
            <p className="text-xs mt-1 text-gray-500">Coming Soon</p>
          </div>

          <div className="border border-blue-500/70 rounded-lg py-5 px-6 opacity-40">
            <p className="text-xl font-bold">BCA</p>
            <p className="text-xs mt-1 text-gray-500">Coming Soon</p>
          </div>

          <div className="border border-blue-500/70 rounded-lg py-5 px-6 opacity-40">
            <p className="text-xl font-bold">MCA</p>
            <p className="text-xs mt-1 text-gray-500">Coming Soon</p>
          </div>

        </div>

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