import React, { useState } from "react";

export default function FinalIntro({ onStart }) {
  const [showPopup, setShowPopup] = useState(false);

  return (
    <div
      className="min-h-screen flex items-center justify-center text-white px-6"
      style={{
        backgroundImage: "url('/finalonboard.png')",
        backgroundSize: "cover",
        backgroundPosition: "center",
        fontFamily: "Rajdhani, sans-serif"
      }}
    >
      {/* 🔥 POPUP */}
      {showPopup && (
        <div className="fixed inset-0 flex items-center justify-center z-[9999]">

          {/* overlay */}
          <div className="absolute inset-0 bg-black/70 backdrop-blur-md" />

          {/* modal */}
          <div
            className="
            relative w-[420px] max-w-[90%] p-10 rounded-2xl
            bg-gradient-to-br from-white/10 to-white/5
            backdrop-blur-2xl
            border border-white/10
            shadow-[0_0_80px_rgba(168,85,247,0.2)]
            text-center
            animate-popup
            transition-all duration-300
            "
          >

            {/* glow layer */}
            <div className="absolute -inset-[1px] rounded-2xl bg-purple-500/10 blur-2xl opacity-40" />

            <div className="relative">

              <h3 className="text-2xl font-bold mb-4 text-white tracking-wide">
                Before you begin
              </h3>

              <p className="text-gray-300 mb-8 leading-relaxed text-sm">
                You will have{" "}
                <span className="text-blue-400 font-semibold text-base">
                  75 seconds
                </span>{" "}
                to answer each question. Think clearly and structure your response.
              </p>

              {/* 💖 PREMIUM PINK BUTTON */}
              <button
                onClick={onStart}
                className="
                px-12 py-3 rounded-xl font-medium
                border border-pink-500 text-white
                transition-all duration-300
                hover:scale-105
                hover:shadow-[0_0_35px_rgba(236,72,153,0.7)]
                active:scale-95
                active:shadow-[0_0_15px_rgba(236,72,153,0.5)]
                "
              >
                Got it
              </button>

            </div>
          </div>
        </div>
      )}

      {/* MAIN CONTENT */}
      <div className="text-center max-w-2xl">

        <h1
          className="text-5xl mb-6 tracking-widest font-semibold"
          style={{ fontFamily: "Michroma, sans-serif" }}
        >
          FINAL ROUND
        </h1>

        <p className="text-lg mb-6 text-gray-300">
          Only <span className="text-pink-400 font-semibold">28%</span> of candidates pass this final stage.
        </p>

        <p className="text-gray-400 mb-10 leading-relaxed">
          This round tests deep problem solving, leadership thinking, and real-world decision making.
        </p>

        {/* 🔥 GLOW BUTTON */}
        <button
          onClick={() => setShowPopup(true)}
          className="
          px-12 py-3 rounded-lg border border-purple-500 text-white
          hover:scale-105
          hover:shadow-[0_0_35px_rgba(168,85,247,0.9)]
          active:scale-95
          transition-all duration-300
          "
        >
          Begin Final Interview
        </button>

      </div>

      {/* 🔥 ANIMATION */}
      <style>{`
        @keyframes popup {
          0% {
            opacity: 0;
            transform: scale(0.92) translateY(12px);
          }
          100% {
            opacity: 1;
            transform: scale(1) translateY(0);
          }
        }
        .animate-popup {
          animation: popup 0.35s cubic-bezier(0.22, 1, 0.36, 1);
        }
      `}</style>

    </div>
  );
}