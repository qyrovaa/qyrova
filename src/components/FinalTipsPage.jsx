import React, { useEffect, useState, useRef } from "react";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";

export default function FinalTipsPage({ answers }) {
  const [tips, setTips] = useState(null);
  const [loading, setLoading] = useState(true);

  /* ✅ PREMIUM COACHING LOADER */
  const analysisMessages = [
    "Identifying your strongest interview patterns...",
    "Finding areas limiting your performance...",
    "Building personalized answer strategies...",
    "Designing your improvement roadmap...",
    "Preparing high-impact interview guidance...",
  ];

  const [currentMessage, setCurrentMessage] = useState(0);
  const [showMessages, setShowMessages] = useState(false);

  const pageRef = useRef(null);

  /* ✅ LOADER ANIMATION */
  useEffect(() => {

    if (!loading) return;

    const introTimer = setTimeout(() => {
      setShowMessages(true);
    }, 1500);

    const interval = setInterval(() => {
      setCurrentMessage((prev) =>
        prev === analysisMessages.length - 1 ? 0 : prev + 1
      );
    }, 1200);

    return () => {
      clearTimeout(introTimer);
      clearInterval(interval);
    };

  }, [loading]);

  useEffect(() => {

    const generateTips = async () => {

      try {

        const res = await fetch("/api/generate-tips", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            questions: answers,
          }),
        });

        const data = await res.json();

        setTips({

          strengths:
            Array.isArray(data.strengths) &&
            data.strengths.filter(
              (item) => item && item.trim() !== ""
            ).length > 0
              ? data.strengths.filter(
                  (item) => item && item.trim() !== ""
                )
              : [
                  "No meaningful strengths were identified from this interview performance."
                ],

          weaknesses:
            Array.isArray(data.weaknesses) &&
            data.weaknesses.filter(
              (item) => item && item.trim() !== ""
            ).length > 0
              ? data.weaknesses.filter(
                  (item) => item && item.trim() !== ""
                )
              : [
                  "No detailed weaknesses could be analyzed due to insufficient interview engagement."
                ],

          improvements:
            Array.isArray(data.improvements) &&
            data.improvements.filter(
              (item) => item && item.trim() !== ""
            ).length > 0
              ? data.improvements.filter(
                  (item) => item && item.trim() !== ""
                )
              : [
                  "More interview participation is required before personalized improvement guidance can be generated."
                ],

          resources:
            Array.isArray(data.resources) &&
            data.resources.filter(
              (item) => item && item.trim() !== ""
            ).length > 0
              ? data.resources.filter(
                  (item) => item && item.trim() !== ""
                )
              : [
                  "No personalized resources could be recommended from the current interview data."
                ]
        });

      } catch (err) {

        console.error(err);

        setTips({

          strengths: [
            "No meaningful strengths were identified from this interview performance."
          ],

          weaknesses: [
            "No detailed weaknesses could be analyzed due to insufficient interview engagement."
          ],

          improvements: [
            "More interview participation is required before personalized improvement guidance can be generated."
          ],

          resources: [
            "No personalized resources could be recommended from the current interview data."
          ]

        });

      } finally {

        setLoading(false);
      }
    };

    generateTips();

  }, [answers]);

  const downloadPlan = async () => {

    const element = pageRef.current;

    /* ✅ HIDE BUTTON SECTION IN PDF */
    const buttonsContainer = element.querySelector(".download-buttons");

    if (buttonsContainer) {
      buttonsContainer.style.display = "none";
    }

    const canvas = await html2canvas(element, {
      scale: 2,
      useCORS: true,
    });

    if (buttonsContainer) {
      buttonsContainer.style.display = "flex";
    }

    const imgData = canvas.toDataURL("image/png");

    const pdf = new jsPDF({
      orientation: canvas.width > canvas.height ? "landscape" : "portrait",
      unit: "px",
      format: [canvas.width, canvas.height],
    });

    pdf.addImage(imgData, "PNG", 0, 0, canvas.width, canvas.height);

    try {

      const logo = new Image();

      logo.src = "/mylogo.png";

      await new Promise((resolve, reject) => {
        logo.onload = resolve;
        logo.onerror = reject;
      });

      const desiredWidth = 220;

      const aspectRatio = logo.height / logo.width;

      const calculatedHeight = desiredWidth * aspectRatio;

      const x = 40;
      const y = 40;

      pdf.addImage(
        logo,
        "PNG",
        x,
        y,
        desiredWidth,
        calculatedHeight
      );

    } catch (err) {

      console.log("Logo not loaded, skipping...");
    }

    pdf.save("Improvement_Plan.pdf");
  };

  /* ✅ PREMIUM CINEMATIC LOADER */
  if (loading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center overflow-hidden relative text-white">

        {/* Glow */}
        <div className="absolute w-[700px] h-[700px] bg-purple-500/10 rounded-full blur-3xl animate-pulse"></div>

        {/* Grid */}
        <div
          className="absolute inset-0 opacity-10"
          style={{
            backgroundImage:
              "linear-gradient(rgba(255,255,255,0.08) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.08) 1px, transparent 1px)",
            backgroundSize: "40px 40px",
          }}
        />

        <div className="relative z-10 text-center px-6 max-w-2xl">

          {/* Label */}
          <p className="text-purple-400 tracking-[0.5em] text-xs md:text-sm mb-8 animate-pulse">
            QYROVA: BE THE OBVIOUS CHOICE
          </p>

          {/* Title */}
          <h1 className="text-4xl md:text-5xl font-semibold leading-tight mb-8">
            Preparing Your Personalized Interview Roadmap
          </h1>

          {/* Dots */}
          <div className="flex justify-center gap-3 mb-10">
            <div className="w-3 h-3 rounded-full bg-purple-400 animate-bounce"></div>
            <div className="w-3 h-3 rounded-full bg-purple-400 animate-bounce delay-150"></div>
            <div className="w-3 h-3 rounded-full bg-purple-400 animate-bounce delay-300"></div>
          </div>

          {/* Rotating Messages */}
          {showMessages && (
            <div className="transition-all duration-500">
              <p className="text-gray-300 text-lg animate-pulse">
                {analysisMessages[currentMessage]}
              </p>
            </div>
          )}

        </div>
      </div>
    );
  }

  return (
    <div
      ref={pageRef}
      className="relative min-h-screen flex items-center justify-center px-6 text-white"
      style={{
        fontFamily: "Rajdhani, sans-serif",
      }}
    >

      {/* Background */}
      <img
        src="/performancereportpages.png"
        alt="bg"
        className="absolute inset-0 w-full h-full object-cover z-0"
      />

      {/* Content */}
      <div className="relative z-10 w-full flex justify-center">

        <div className="w-full max-w-5xl bg-black/70 backdrop-blur-xl p-10 rounded-3xl border border-purple-500/30 shadow-[0_0_40px_rgba(168,85,247,0.2)]">

          <h1 className="text-3xl font-bold text-center mb-10">
            🧠 Your Personalized Improvement Plan
          </h1>

          <div className="grid md:grid-cols-2 gap-8">

            <div className="p-5 rounded-xl border border-green-500/30 bg-black/40">
              <h2 className="text-green-400 text-xl mb-3">
                💪 Strengths
              </h2>

              <ul className="list-disc pl-5 space-y-3 text-gray-300">
                {tips.strengths.map((item, i) => (
                  <li key={i}>{item}</li>
                ))}
              </ul>
            </div>

            <div className="p-5 rounded-xl border border-red-500/30 bg-black/40">
              <h2 className="text-red-400 text-xl mb-3">
                ⚠️ Weak Areas
              </h2>

              <ul className="list-disc pl-5 space-y-3 text-gray-300">
                {tips.weaknesses.map((item, i) => (
                  <li key={i}>{item}</li>
                ))}
              </ul>
            </div>

            <div className="p-5 rounded-xl border border-blue-500/30 bg-black/40">
              <h2 className="text-blue-400 text-xl mb-3">
                🎯 How to Improve
              </h2>

              <ul className="list-disc pl-5 space-y-3 text-gray-300">
                {tips.improvements.map((item, i) => (
                  <li key={i}>{item}</li>
                ))}
              </ul>
            </div>

            <div className="p-5 rounded-xl border border-purple-500/30 bg-black/40">
              <h2 className="text-purple-400 text-xl mb-3">
                📚 Recommended Resources
              </h2>

              <ul className="list-disc pl-5 space-y-3 text-gray-300">
                {tips.resources.map((item, i) => (
                  <li key={i}>{item}</li>
                ))}
              </ul>
            </div>

          </div>

          <div className="download-buttons flex flex-col items-center gap-5 mt-10">

            <button
              onClick={downloadPlan}
              className="px-6 py-3 border border-purple-500 rounded-lg 
              hover:shadow-[0_0_20px_rgba(168,85,247,0.7)] transition-all"
            >
              📄 Download Improvement Plan
            </button>

           
          </div>

        </div>
      </div>
    </div>
  );
}