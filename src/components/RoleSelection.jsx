import React from "react";
import rolesByBranch from "../data/roles";

export default function RoleSelection({ branch, onSelect }) {

  const name = localStorage.getItem("qyrovaName") || "there";
  const roles = rolesByBranch[branch] || [];

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
          STEP 3 OF 3
        </p>
      </div>

      <h2
        className="mb-2"
        style={{
          fontFamily: "Michroma, sans-serif",
          fontSize: "38px",
          letterSpacing: "0.05em",
          textTransform: "none"
        }}
      >
        {`What are you aiming for, ${name}?`}
      </h2>

      <p className="text-gray-400 mb-6"></p>

      <div className="grid grid-cols-2 gap-8 max-w-3xl w-full mt-6">

        {roles.map((role, index) => {
          const isPurple = index === 0 || index === 3;

          return (
            <button
              key={role}
              onClick={() => {

                // ✅ FINAL UNIVERSAL FIX (ROLE MAPPING)
                const roleMap = {
                  "Software Developer": "software developer",
                  "Data Scientist": "data scientist",
                  "Cloud Engineer": "cloud engineer",
                  "Cybersecurity Engineer": "cybersecurity engineer",
                  "DevOps Engineer": "devops engineer",

                  "Embedded System Engineer": "embedded system engineer",
                  "VLSI/Semiconductor Engineer": "vlsi/semiconductor engineer",
                  "Communication/Telecom Engineer": "communication/telecom engineer",
                  "Electronics Design Engineer": "electronics design engineer",

                  "Power System Engineer": "power system engineer",
                  "Control System Engineer": "control system engineer",
                  "Electrical Design Engineer": "electrical design engineer",
                  "Renewable Energy Engineer": "renewable energy engineer",

                  "Design Engineer": "design engineer (cad/cae)",
                  "Production/Manufacturing Engineer": "production/manufacturing engineer",
                  "Automotive Engineer": "automotive engineer",
                  "HVAC/Thermal Engineer": "hvac/thermal engineer"
                };

                const mappedRole = roleMap[role] || role.toLowerCase().trim();

                const existing = JSON.parse(localStorage.getItem("qyrovaUser")) || {};

                localStorage.setItem(
                  "qyrovaUser",
                  JSON.stringify({
                    ...existing,
                    role: mappedRole
                  })
                );

                localStorage.setItem("isSetupComplete", "true");

                onSelect(mappedRole);
              }}
              className={`group relative overflow-hidden h-[80px] flex items-center justify-center text-center
              border rounded-xl transition-all duration-300 hover:scale-105 capitalize
              ${
                isPurple
                  ? "border-purple-500 hover:shadow-[0_0_12px_rgba(168,85,247,0.7)]"
                  : "border-pink-500 hover:shadow-[0_0_12px_rgba(236,72,153,0.7)]"
              }`}
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

              <span className="leading-snug break-words px-6">
                {role}
              </span>

            </button>
          );
        })}

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