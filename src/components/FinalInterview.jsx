import React, { useState, useEffect } from "react";

import { hrQuestions } from "../data/hrquestions";
import { softwareFinal } from "../data/softwarefinal";
import { automotiveInterviewMixed } from "../data/automotivefinal";
import { cloudInterviewMixed } from "../data/cloudfinal";
import { communicationInterviewMixed } from "../data/commfinal";
import { controlInterviewMixed } from "../data/csfinal";
import { designInterviewMixed } from "../data/designfinal";
import { devopsInterviewMixed } from "../data/devopsfinal";
import { dsFinal } from "../data/dsfinal";
import { electricalDesignInterviewMixed } from "../data/electricaldesignfinal";
import { electronicsInterviewMixed } from "../data/electronicsfinal";
import { embeddedInterviewMixed } from "../data/embeddedfinal";
import { hvacInterviewMixed } from "../data/hvacfinal";
import { productionInterviewMixed } from "../data/productionfinal";
import { powerInterviewMixed } from "../data/psfinal";
import { renewableInterviewMixed } from "../data/renewablefinal";
import { vlsiInterviewMixed } from "../data/vlsifinal";

export default function FinalInterview({ role, onComplete }) {
  const [current, setCurrent] = useState(0);
  const [answer, setAnswer] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState("");
  const [timeLeft, setTimeLeft] = useState(75);
  const [started, setStarted] = useState(false);

  const [allQuestions, setAllQuestions] = useState([]);

  const [showFinalTips, setShowFinalTips] = useState(false);
  const [showFinalReport, setShowFinalReport] = useState(false);

  const [responses, setResponses] = useState([]);

  const shuffle = (arr) => [...arr].sort(() => 0.5 - Math.random());

  const roleMap = {
    "software developer": softwareFinal,
    "cloud engineer": cloudInterviewMixed,
    "data scientist": dsFinal,
    "devops engineer": devopsInterviewMixed,

    "embedded system engineer": embeddedInterviewMixed,
    "vlsi/semiconductor engineer": vlsiInterviewMixed,
    "communication/telecom engineer": communicationInterviewMixed,
    "electronics design engineer": electronicsInterviewMixed,

    "power system engineer": powerInterviewMixed,
    "control system engineer": controlInterviewMixed,
    "electrical design engineer": electricalDesignInterviewMixed,
    "renewable energy engineer": renewableInterviewMixed,

    "design engineer (cad/cae)": designInterviewMixed,
    "production/manufacturing engineer": productionInterviewMixed,
    "automotive engineer": automotiveInterviewMixed,
    "hvac/thermal engineer": hvacInterviewMixed
  };

  // ✅ FINAL FIX (ONLY CHANGE)
  const storedUser = JSON.parse(localStorage.getItem("qyrovaUser")) || {};
  const finalRole = (role || storedUser.role || "").toLowerCase().trim();

  console.log("FINAL ROLE USED:", finalRole);

  const techQuestions = roleMap[finalRole] || softwareFinal;

  useEffect(() => {
    const firstQuestion = "Tell me about yourself.";

    const selectedHR = shuffle(hrQuestions).slice(0, 4);
    const selectedTech = shuffle(techQuestions).slice(0, 10);

    const remaining = shuffle([...selectedHR, ...selectedTech]);

    setAllQuestions([firstQuestion, ...remaining]);
  }, [finalRole]);

  useEffect(() => {
    if (!started || timeLeft === 0) return;

    const timer = setTimeout(() => {
      setTimeLeft((prev) => prev - 1);
    }, 1000);

    return () => clearTimeout(timer);
  }, [timeLeft, started]);

  useEffect(() => {
    setTimeLeft(75);
    setStarted(false);
  }, [current]);

  const handleSubmit = () => {
    if (!answer.trim()) {
      setError("Please enter your answer.");
      return;
    }

    setError("");
    setSubmitted(true);
  };

  const handleNext = () => {
    const currentQuestion = allQuestions[current];

    setResponses((prev) => [
      ...prev,
      {
        question: currentQuestion,
        answer: answer
      }
    ]);

    setAnswer("");
    setSubmitted(false);
    setError("");

    if (current < allQuestions.length - 1) {
      setCurrent((prev) => prev + 1);
    } else {
      setShowFinalTips(true);
    }
  };

  const getFinalTips = () => {
    return "You performed well. To improve further, focus on structuring your answers, adding real-life examples, and maintaining clarity.";
  };

  return (
    <div
      className="min-h-screen flex items-center justify-center px-6 text-white"
      style={{
        backgroundImage: "url('/interviewpages.png')",
        backgroundSize: "cover",
        backgroundPosition: "center",
        fontFamily: "Rajdhani, sans-serif"
      }}
    >
      <div className="w-full max-w-3xl">

        {showFinalReport ? (
          <div className="text-center">

            <h2 className="text-3xl mb-6">Final Feedback</h2>

            <p className="text-gray-300 mb-6">
              {getFinalTips()}
            </p>

            <div className="text-gray-400 text-sm space-y-2">
              <p>• Use structured answers (Intro → Body → Example)</p>
              <p>• Add real-life examples</p>
              <p>• Be concise but impactful</p>
              <p>• Maintain confidence while speaking</p>
            </div>

          </div>

        ) : showFinalTips ? (
          <div className="text-center">

            <p className="text-purple-400 text-xs tracking-widest mb-3">
              QYROVA EVALUATION
            </p>

            <h2 className="text-3xl mb-6 tracking-wide">
              Your Final Interview is Complete
            </h2>

            <p className="text-gray-400 mb-8 text-lg leading-relaxed max-w-xl mx-auto">
              Your responses have been recorded successfully.  
              You can now review your performance and see where you stand.
            </p>

            <button
              onClick={() => onComplete(responses)}
              className="px-8 py-3 border border-purple-500 rounded-lg
              hover:shadow-[0_0_20px_rgba(168,85,247,0.7)] transition-all duration-300"
            >
              View Final Report
            </button>

          </div>

        ) : (
          <>
            <div className="flex justify-between items-center mb-8">
              <div className="text-xs uppercase tracking-widest text-gray-400">
                Final Interview | Question {current + 1} / {allQuestions.length}
              </div>

              {started && (
                <div
                  className={`text-sm font-semibold px-4 py-2 rounded-lg border 
                  ${timeLeft <= 10 
                    ? "text-red-400 border-red-500 animate-pulse" 
                    : "text-white border-purple-500"}`}
                >
                  ⏱ {timeLeft}s
                </div>
              )}
            </div>

            <h2 className="text-3xl font-semibold mb-8 leading-snug">
              {allQuestions[current] || "Loading..."}
            </h2>

            {!started && (
              <button
                onClick={() => setStarted(true)}
                className="mb-8 px-8 py-3 border border-purple-500 rounded-lg
                hover:scale-105 hover:shadow-[0_0_20px_rgba(168,85,247,0.7)]
                transition-all duration-300"
              >
                Start Answering
              </button>
            )}

            {started && (
              <>
                <textarea
                  value={answer}
                  onChange={(e) => {
                    setAnswer(e.target.value);
                    if (error) setError("");
                  }}
                  placeholder="Type your answer here..."
                  className="w-full h-40 p-5 bg-black/60 border border-purple-500 rounded-xl 
                  focus:outline-none text-white backdrop-blur-md mb-6"
                />

                {error && <p className="text-red-400 mb-4 text-sm">{error}</p>}

                {!submitted ? (
                  <button
                    onClick={handleSubmit}
                    className="px-6 py-2 border border-blue-500 rounded-lg
                    hover:shadow-[0_0_20px_rgba(59,130,246,0.6)]
                    transition-all duration-300"
                  >
                    Submit
                  </button>
                ) : (
                  <button
                    onClick={handleNext}
                    className="px-6 py-2 border border-blue-500 rounded-lg
                    hover:shadow-[0_0_20px_rgba(59,130,246,0.6)]
                    transition-all duration-300"
                  >
                    Next Question
                  </button>
                )}
              </>
            )}
          </>
        )}

      </div>
    </div>
  );
}