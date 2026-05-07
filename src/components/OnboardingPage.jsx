import React, { useState } from "react";

export default function OnboardingPage({ user, onNext }) {
  const [loading, setLoading] = useState(false);

  const handleStart = () => {
    setLoading(true);
    setTimeout(() => {
      onNext();
    }, 800);
  };

  return (
    <div
      className="min-h-screen flex items-center justify-center text-white px-6"
      style={{
        backgroundImage: "url('/profilesetuppages.png')",
        backgroundSize: "cover",
        backgroundPosition: "center",
        fontFamily: "Rajdhani, sans-serif"
      }}
    >
      <div className="bg-black/90 backdrop-blur-md p-12 rounded-2xl w-full max-w-2xl border border-white/10">

        {/* Header */}
        <h2
          className="mb-8 leading-tight"
          style={{
            fontFamily: "Michroma, sans-serif",
            fontSize: "36px",
            letterSpacing: "0.18em",
            textTransform: "uppercase",
            color: "white"
          }}
        >
          {user?.name ? `${user.name}, LET'S BEGIN` : "LET'S BEGIN"}
        </h2>

        {/* Intro */}
        <p
          className="mb-8 text-gray-400"
          style={{
            fontFamily: "Rajdhani, sans-serif",
            fontSize: "18px",
            fontWeight: "400"
          }}
        >
          Here’s how your interview practice will work.
        </p>

        {/* Steps */}
        <div className="space-y-8">

          <p className="text-gray-300">
            <span
              style={{
                fontFamily: "Rajdhani, sans-serif",
                fontWeight: "600",
                fontSize: "18px",
                color: "white"
              }}
            >
              01. Choose your starting level
            </span>
            <br />
            <span className="text-gray-400 text-base">
              Start at Basic, Intermediate, or Hardcore depending on where you are today.
            </span>
          </p>

          <p className="text-gray-300">
            <span
              style={{
                fontFamily: "Rajdhani, sans-serif",
                fontWeight: "600",
                fontSize: "18px",
                color: "white"
              }}
            >
              02. Go through three interview rounds
            </span>
            <br />
            <span className="text-gray-400 text-base">
              You’ll answer a mix of technical and HR questions designed to simulate real interviews.
            </span>
          </p>

          <p className="text-gray-300">
            <span
              style={{
                fontFamily: "Rajdhani, sans-serif",
                fontWeight: "600",
                fontSize: "18px",
                color: "white"
              }}
            >
              03. Get instant feedback
            </span>
            <br />
            <span className="text-gray-400 text-base">
              Your answers are evaluated instantly for clarity, confidence, and depth.
            </span>
          </p>

          <p className="text-gray-300">
            <span
              style={{
                fontFamily: "Rajdhani, sans-serif",
                fontWeight: "600",
                fontSize: "18px",
                color: "white"
              }}
            >
              04. See your performance
            </span>
            <br />
            <span className="text-gray-400 text-base">
              At the end, you’ll receive a report showing how you performed.
              Pass the simulation to unlock real interview questions.
            </span>
          </p>

        </div>

        {/* Pro Tip */}
        <div className="mt-10 p-6 border border-pink-500/50 rounded-xl bg-black/60 backdrop-blur-md">
          <p
            className="text-sm mb-2"
            style={{
              fontFamily: "Rajdhani, sans-serif",
              color: "#f472b6",
              fontWeight: "600",
              fontSize: "16px"
            }}
          >
            Pro Tip
          </p>

          <p
            className="text-gray-400 text-sm leading-relaxed"
            style={{
              fontFamily: "Rajdhani, sans-serif"
            }}
          >
            Don’t rush your answers. Take a moment to think before responding.
            Clear, structured answers always stand out in interviews.
          </p>
        </div>

        {/* Button */}
        <button
          onClick={handleStart}
          disabled={loading}
          className={`mt-10 w-full py-3 text-base
          border border-purple-500 rounded-lg
          transition-all duration-300
          hover:scale-[1.03]
          hover:shadow-[0_0_25px_rgba(168,85,247,0.8)]
          active:scale-95
          ${loading ? "shadow-[0_0_35px_rgba(168,85,247,1)]" : ""}`}
          style={{
            fontFamily: "Rajdhani, sans-serif",
            fontWeight: "600",
            letterSpacing: "0.05em"
          }}
        >
          {loading ? "Starting your session..." : "Start Interview Practice"}
        </button>

      </div>
    </div>
  );
}