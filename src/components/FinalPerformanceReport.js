import React, { useEffect, useState, useRef } from "react";
import { getUser, saveUser } from "../user";

export default function FinalPerformanceReport({ answers, user, onGetTips }) {
  const [report, setReport] = useState(null);
  const [loading, setLoading] = useState(true);
  const [scrollProgress, setScrollProgress] = useState(0);

  /* ✅ CINEMATIC LOADER STATES */
  const analysisMessages = [
    "Analyzing technical confidence...",
    "Tracking hesitation patterns...",
    "Evaluating conceptual depth...",
    "Mapping communication consistency...",
  ];

  const [currentMessage, setCurrentMessage] = useState(0);
  const [showMessages, setShowMessages] = useState(false);

  const scrollRef = useRef(null);

  /* ✅ CINEMATIC LOADER EFFECT */
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

    const generateReport = async () => {

      try {

        const evaluatedQuestions = await Promise.all(

          answers.map(async (item) => {

            try {

              const res = await fetch(
                "/api/evaluate-answer",
                {
                  method: "POST",
                  headers: {
                    "Content-Type": "application/json",
                  },
                  body: JSON.stringify({
                    question: item.question,
                    answer: item.answer,
                    field: user?.role || "General",
                    profile: user || {}
                  }),
                }
              );

              const data = await res.json();

              return {
                ...item,
                evaluation:
                  data.idealAnswer ||
                  data.mistake ||
                  "Good answer."
              };

            } catch (err) {

              console.error(err);

              return {
                ...item,
                evaluation:
                  "Unable to generate AI evaluation."
              };
            }
          })
        );

        const summaryRes = await fetch(
          "/api/generate-final-remark",
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              answers,
              role: user?.role || "General",
              level: "Final Interview",
              scores: []
            }),
          }
        );

        const summaryData = await summaryRes.json();

        const finalData = {
          summary:
            summaryData.remark ||
            "You performed well overall.",
          questions: evaluatedQuestions,
        };

        setReport(finalData);

        // 🔥 SAVE FINAL REPORT
        const userData = getUser();

        if (userData) {
          userData.finalReport = {
            summary: finalData.summary,
            date: new Date().toISOString()
          };

          saveUser(userData);
        }

      } catch (err) {

        console.error(err);

        setReport({
          summary:
            "Your responses show effort and understanding. Focus on adding more structured answers and real-life examples.",
          questions: answers.map((q) => ({
            ...q,
            evaluation:
              "Unable to generate AI evaluation.",
          })),
        });

      } finally {

        setLoading(false);
      }
    };

    generateReport();

  }, [answers, user]);

  const handleScroll = () => {
    const el = scrollRef.current;
    if (!el) return;

    const progress =
      (el.scrollTop / (el.scrollHeight - el.clientHeight)) * 100;

    setScrollProgress(progress);
  };

  /* ✅ CINEMATIC LOADING SCREEN */
  if (loading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center overflow-hidden relative text-white">

        {/* Animated Glow */}
        <div className="absolute w-[600px] h-[600px] bg-purple-500/10 rounded-full blur-3xl animate-pulse"></div>

        {/* Grid Overlay */}
        <div
          className="absolute inset-0 opacity-10"
          style={{
            backgroundImage:
              "linear-gradient(rgba(255,255,255,0.08) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.08) 1px, transparent 1px)",
            backgroundSize: "40px 40px",
          }}
        />

        <div className="relative z-10 text-center px-6 max-w-2xl">

          {/* Engine Label */}
          <p className="text-purple-400 tracking-[0.5em] text-xs md:text-sm mb-8 animate-pulse">
            QYROVA: BE THE OBVIOUS CHOICE
          </p>

          {/* Main Heading */}
          <h1 className="text-4xl md:text-5xl font-semibold leading-tight mb-8">
            Building Your Personalized Performance Report
          </h1>

          {/* Animated Dots */}
          <div className="flex justify-center gap-3 mb-10">
            <div className="w-3 h-3 rounded-full bg-purple-400 animate-bounce"></div>
            <div className="w-3 h-3 rounded-full bg-purple-400 animate-bounce delay-150"></div>
            <div className="w-3 h-3 rounded-full bg-purple-400 animate-bounce delay-300"></div>
          </div>

          {/* Rotating Analysis Messages */}
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
      className="min-h-screen flex items-center justify-center px-4 text-white"
      style={{
        backgroundImage: "url('/performancereportpages.png')",
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      <div className="w-full max-w-5xl h-[90vh] bg-black/70 backdrop-blur-xl border border-purple-500/40 rounded-3xl shadow-lg flex flex-col overflow-hidden relative">

        <div className="absolute top-0 left-0 w-full h-[4px] bg-white/10">
          <div
            className="h-full bg-purple-500"
            style={{ width: `${scrollProgress}%` }}
          />
        </div>

        <div className="p-6 text-center border-b border-purple-500/30">
          <h1 className="text-3xl font-bold">
            Interview Evaluation Report
          </h1>
        </div>

        <div
          ref={scrollRef}
          onScroll={handleScroll}
          className="p-8 overflow-y-auto space-y-10"
        >
          <p className="text-gray-300 text-lg">{report.summary}</p>

          {report.questions.map((item, index) => (
            <div key={index}>
              <h2 className="text-xl font-semibold mb-2">
                Q{index + 1}. {item.question}
              </h2>

              <p className="text-gray-400 mb-2">
                <span className="text-white font-medium">
                  Your Answer:
                </span>{" "}
                {item.answer}
              </p>

              <p className="text-blue-300 mb-4">
                <span className="text-white font-medium">
                  AI Evaluation:
                </span>{" "}
                {item.evaluation}
              </p>

              <div className="h-px bg-purple-500/30"></div>
            </div>
          ))}

          <div className="flex justify-center pt-6">
            <button
              onClick={() => onGetTips(answers)}
              className="px-6 py-2 border border-purple-500 rounded-lg hover:shadow-lg"
            >
              🧠 Get Tips & Tricks
            </button>
          </div>

        </div>
      </div>
    </div>
  );
}