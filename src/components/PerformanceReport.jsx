import React, { useRef } from "react";
import { getUser, saveUser } from "../user";

export default function PerformanceReport({
  score = 0,
  sections = [],
  coachRemark = "",
  onRetry,
  onProceed
}) {

  const reportRef = useRef(null);

  // ✅ FIX: normalize data properly (handles all formats)
  let finalSections = [];

  if (Array.isArray(sections) && sections.length) {
    finalSections = sections.map((s) => ({
      name: s.name,
      value: s.value ?? s.score ?? 0
    }));
  } 
  else if (typeof score === "object" && score !== null) {
    finalSections = [
      { name: "TECHNICAL", value: score.technical ?? 0 },
      { name: "CLARITY", value: score.clarity ?? 0 },
      { name: "STRUCTURE", value: score.structure ?? 0 },
      { name: "CONFIDENCE", value: score.confidence ?? 0 },
      { name: "IMPACT", value: score.impact ?? 0 }
    ];
  } 
  else {
    finalSections = [
      { name: "TECHNICAL", value: 0 },
      { name: "CLARITY", value: 0 },
      { name: "STRUCTURE", value: 0 },
      { name: "CONFIDENCE", value: 0 },
      { name: "IMPACT", value: 0 }
    ];
  }

  // ✅ FIX: always compute total from sections
  const safeScore = finalSections.reduce((sum, s) => sum + s.value, 0);

  const passed = safeScore >= 60;

  // ✅ NATIVE SHARE FUNCTION
  const handleShare = async () => {

    try {

      // unique report id
      const reportId = crypto.randomUUID();

      // report data
      const reportData = {
        score: safeScore,
        sections: finalSections,
        coachRemark,
        createdAt: Date.now()
      };

      // save report
      localStorage.setItem(
        `qreport-${reportId}`,
        JSON.stringify(reportData)
      );

      // standalone report link
      const shareLink =
        `${window.location.origin}/qreport/${reportId}`;

      // native share popup
      if (navigator.share) {

        await navigator.share({
          title: "Qyrova Practice Interview",
          text:
            "🎯 I just completed a practice interview on Qyrova.\n\nCheck out my performance report 👇",
          url: shareLink
        });

      } else {

        // fallback copy
        await navigator.clipboard.writeText(shareLink);

      }

    } catch (err) {

      console.error("Share failed:", err);

    }
  };

  return (
    <div
      className="min-h-screen flex items-center justify-center text-white relative"
      style={{
        backgroundImage: "url('/performancereportpages.png')",
        backgroundSize: "cover",
        backgroundPosition: "center",
        fontFamily: "Rajdhani, sans-serif"
      }}
    >
      <div
        ref={reportRef}
        className="w-full max-w-4xl bg-black/80 backdrop-blur-xl border border-purple-500/40 rounded-xl p-12 relative z-[9999] pointer-events-auto"
      >

        {/* ✅ HEADING + SHARE ICON */}

        <div className="flex items-center justify-center relative mb-12">

          <h1
            className="text-3xl tracking-widest text-center text-white"
            style={{ fontFamily: "Michroma, sans-serif" }}
          >
            PERFORMANCE ANALYTICS SUMMARY
          </h1>

          <button
            type="button"
            onClick={handleShare}
            className="absolute right-0 group"
            title="Share Report"
          >

            <div
              className="
              w-12 h-12 rounded-full
              border border-white/[0.14]
              bg-white/[0.08]
              backdrop-blur-xl

              flex items-center justify-center
              shadow-[0_0_14px_rgba(168,85,247,0.12)]

              transition-all duration-300 ease-out

              hover:border-purple-400/30
              hover:bg-purple-500/[0.08]
              hover:-translate-y-[1px]
              active:scale-95
              "
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.8"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="
                w-[19px] h-[19px]
                text-white/80
                group-hover:text-purple-200
                transition-colors duration-300
                "
              >
                <path d="M12 16V4" />
                <path d="M7 9l5-5 5 5" />
                <path d="M5 20h14" />
              </svg>
            </div>

          </button>

        </div>

        <div className="text-center text-6xl mb-6">
          <span className="text-white">{safeScore}</span>{" "}
          <span className="text-gray-300">/ 100</span>
        </div>

        <div className="text-center mb-10">
          {!passed ? (
            <span className="px-6 py-2 rounded-full border text-sm tracking-wider border-red-500/70 bg-red-500/10 text-red-400">
              RETAKE REQUIRED
            </span>
          ) : (
            <span className="px-6 py-2 rounded-full border text-sm tracking-wider border-purple-500/60 bg-purple-500/10 text-purple-300">
              LEVEL CLEARED
            </span>
          )}
        </div>

        <div className="space-y-6 mb-12">
          {finalSections.map((section) => (
            <div key={section.name}>
              <div className="flex justify-between text-sm text-gray-400 mb-1">
                <span>{section.name}</span>
                <span>{section.value} / 20</span>
              </div>

              <div className="w-full h-2 bg-gray-800 rounded-full">
                <div
                  className="h-2 rounded-full transition-all duration-500 bg-purple-500"
                  style={{ width: `${section.value * 5}%` }}
                />
              </div>

            </div>
          ))}
        </div>

        {/* ✅ AI COACH REMARK */}

        {coachRemark && (
          <div className="mb-12 mt-4">

            <h3 className="mb-5 text-center text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-400 tracking-[0.25em] text-lg">
              AI COACH REMARK
            </h3>

            <div className="bg-white/[0.03] border border-purple-500/20 rounded-2xl p-6 text-gray-300 leading-8 text-[15px]">
              {coachRemark}
            </div>

          </div>
        )}

        <div className="flex justify-center items-center gap-6 flex-wrap">

          <button
            type="button"
            onClick={onRetry}
            className="px-6 py-2 rounded-md border border-purple-500 text-white
            hover:shadow-[0_0_15px_rgba(168,85,247,0.7)]
            transition-all duration-300"
          >
            Retry Level
          </button>

          <button
            type="button"
            onClick={() => {
              const user = getUser();

              if (user) {
                const newReport = {
                  type: "practice",
                  level: "current",
                  score: safeScore,
                  date: new Date().toISOString()
                };

                user.reports = user.reports || [];
                user.reports.push(newReport);

                saveUser(user);
              }

              if (typeof onProceed === "function") {
                onProceed("final");
              } else {
                console.error("onProceed is NOT passed ❌");
              }
            }}
            className="px-6 py-2 rounded-md border border-pink-500 text-white
            hover:shadow-[0_0_15px_rgba(236,72,153,0.7)]
            transition-all duration-300"
          >
            Proceed to Final Interview
          </button>

        </div>

      </div>
    </div>
  )
}