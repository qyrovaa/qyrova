import React, { useState, useMemo, useEffect } from "react";
import questionBank from "../data/questionMapper";
import { hrQuestions } from "../data/hrquestions";

function shuffle(arr) {
  return [...arr].sort(() => Math.random() - 0.5);
}

export default function InterviewPage({ role, level, onComplete }) {

  const storedUser = JSON.parse(localStorage.getItem("qyrovaUser")) || {};
  const finalRole = (role || storedUser.role || "").toLowerCase().trim();

  const rawLevel = (level || localStorage.getItem("level") || "").toLowerCase().trim();

  const levelMap = {
    "basic": "basic",
    "beginner": "basic",
    "easy": "basic",
    "intermediate": "intermediate",
    "medium": "intermediate",
    "hardcore": "hardcore",
    "advanced": "hardcore",
    "hard": "hardcore"
  };

  const finalLevel = levelMap[rawLevel] || rawLevel;

  const [round, setRound] = useState(1);
  const [index, setIndex] = useState(0);
  const [answer, setAnswer] = useState("");
  const [evaluation, setEvaluation] = useState(null);

  // ✅ NEW
  const [conversationHistory, setConversationHistory] = useState([]);

  // ✅ LOADING STATE
  const [submitting, setSubmitting] = useState(false);

  const [questions, setQuestions] = useState([]);
  const [showIntro, setShowIntro] = useState(true);
  const [animationStage, setAnimationStage] = useState("enter");
  const [error, setError] = useState("");

  const [results, setResults] = useState([]);

  const { techRounds, hrRounds } = useMemo(() => {

    const roleKey = Object.keys(questionBank).find(
      key =>
        key.toLowerCase().includes(finalRole) ||
        finalRole.includes(key.toLowerCase())
    );

    let techRoundsData = roleKey
      ? questionBank[roleKey]?.[finalLevel] || []
      : [];

    if (!techRoundsData.length && roleKey) {
      const allLevels = Object.values(questionBank[roleKey]);
      techRoundsData = allLevels.flat();
    }

    const techBank = shuffle(techRoundsData);
    const hrBank = shuffle(hrQuestions);

    return {
      techRounds: [
        techBank.slice(0,3),
        techBank.slice(3,6),
        techBank.slice(6,9)
      ],
      hrRounds: [
        hrBank.slice(0,2),
        hrBank.slice(2,4),
        hrBank.slice(4,6)
      ]
    };

  }, [finalRole, finalLevel]);

  useEffect(() => {

    setShowIntro(true);
    setAnimationStage("enter");

    const popTimer = setTimeout(() => setAnimationStage("pop"),200);
    const stayTimer = setTimeout(() => setAnimationStage("stay"),700);
    const shrinkTimer = setTimeout(() => setAnimationStage("shrink"),1400);

    const removeTimer = setTimeout(() => {

      setShowIntro(false);

      const techSet = techRounds[round - 1] || [];
      const hrSet = hrRounds[round - 1] || [];

      let roundQuestions = [];

      if(round === 1){
        roundQuestions = [
          "Tell me about yourself",
          ...shuffle([...techSet, hrSet[0]])
        ];
      } else {
        roundQuestions = shuffle([
          ...techSet,
          hrSet[0],
          hrSet[1]
        ]);
      }

      setQuestions(roundQuestions.filter(Boolean));
      setIndex(0);

    },1900);

    return () => {
      clearTimeout(popTimer);
      clearTimeout(stayTimer);
      clearTimeout(shrinkTimer);
      clearTimeout(removeTimer);
    };

  }, [round, techRounds, hrRounds]);

  const handleSubmit = async () => {

    if (!answer.trim()) {
      setError("Please enter your answer.");
      return;
    }

    setError("");

    // ✅ START LOADING
    setSubmitting(true);

    try {

      const res = await fetch("/api/evaluate-answer", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          question: currentQuestion,
          answer: answer,
          field: role,
          level: level,
        }),
      });

      const data = await res.json();

      setEvaluation({
        idealAnswer: data.idealAnswer || data.message || "",
        mistake: data.mistake || "",
      });

      // ✅ STORE FULL INTERVIEW HISTORY
      setConversationHistory(prev => [
        ...prev,
        {
          question: currentQuestion,
          answer: answer
        }
      ]);

    } catch (err) {

      console.error("Evaluation failed:", err);
      setError("Something went wrong.");

      // ✅ STOP LOADING
      setSubmitting(false);

      return;
    }

    try {

      const scoreRes = await fetch("/api/score-answer", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          question: currentQuestion,
          answer: answer,
        }),
      });

      const scoreData = await scoreRes.json();

      if (scoreData.score) {
        setResults(prev => [...prev, scoreData.score]);
      }

    } catch (err) {
      console.error("Score API failed:", err);
    } finally {

      // ✅ STOP LOADING
      setSubmitting(false);
    }
  };

  const handleNext = async () => {

    setAnswer("");
    setEvaluation(null);
    setError("");

    if(index < questions.length - 1){

      setIndex(prev => prev + 1);

    } else {

      if(round < 3){

        setRound(prev => prev + 1);

      } else {

        const total = results.reduce((acc, r) => {

          acc.technical += r.technical || 0;
          acc.clarity += r.clarity || 0;
          acc.structure += r.structure || 0;
          acc.confidence += r.confidence || 0;
          acc.impact += r.impact || 0;

          return acc;

        }, {
          technical: 0,
          clarity: 0,
          structure: 0,
          confidence: 0,
          impact: 0
        });

        const count = results.length || 1;

        const finalSections = [
          { name: "TECHNICAL", value: Math.round(total.technical / count) },
          { name: "CLARITY", value: Math.round(total.clarity / count) },
          { name: "STRUCTURE", value: Math.round(total.structure / count) },
          { name: "CONFIDENCE", value: Math.round(total.confidence / count) },
          { name: "IMPACT", value: Math.round(total.impact / count) }
        ];

        const finalScore = Math.round(
          finalSections.reduce((sum, s) => sum + s.value, 0)
        );

        // ✅ FINAL PREMIUM COACH REMARK
        let finalCoachRemark = "";

        try {

          const coachRes = await fetch("/api/generate-final-remark", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              answers: conversationHistory,
              scores: finalSections,
              role: finalRole,
              level: finalLevel
            }),
          });

          const coachData = await coachRes.json();

          finalCoachRemark = coachData.remark || "";

        } catch (err) {

          console.error("Final coach remark failed:", err);
        }

        if(onComplete) {

          onComplete({
            score: finalScore,
            sections: finalSections,
            coachRemark: finalCoachRemark
          });
        }
      }
    }
  };

  if(showIntro){

    let classes = "opacity-0 scale-90";

    if(animationStage === "pop") classes = "opacity-100 scale-125";
    if(animationStage === "stay") classes = "opacity-100 scale-115";
    if(animationStage === "shrink") classes = "opacity-0 scale-75";

    return (
      <div className="min-h-screen flex items-center justify-center bg-black text-white">
        <div className={`transition-all duration-500 ease-in-out text-center ${classes}`}>
          <h1 className="text-5xl font-semibold tracking-wider uppercase">
            {finalLevel?.toUpperCase()} LEVEL
          </h1>

          <h2 className="text-2xl text-purple-400 mt-4 tracking-wide">
            ROUND {round}
          </h2>
        </div>
      </div>
    );
  }

  const currentQuestion = questions[index] || "";

  return (
    <div
      className="min-h-screen flex items-center justify-center px-6 text-white"
      style={{
        backgroundImage:"url('/interviewpages.png')",
        backgroundSize:"cover",
        backgroundPosition:"center"
      }}
    >
      <div className="w-full max-w-4xl bg-black/80 backdrop-blur-xl p-12 rounded-xl">

        <div className="mb-6 text-xs uppercase tracking-widest text-gray-500">
          Role: {finalRole} | Level: {finalLevel?.toUpperCase()} | Round {round}/3
        </div>

        <h2 className="text-3xl font-semibold tracking-tight mb-8">
          {currentQuestion}
        </h2>

        <textarea
          value={answer}
          onChange={(e)=>{
            setAnswer(e.target.value);
            if(error) setError("");
          }}
          placeholder="Type your answer here..."
          className="w-full h-44 p-5 bg-transparent border border-purple-500 rounded-xl focus:outline-none text-white"
        />

        {error && <p className="text-red-400 mt-3 text-sm">{error}</p>}

        {!evaluation && (
          <button
            onClick={handleSubmit}
            disabled={submitting}
            className="mt-6 px-8 py-3 border border-blue-500 rounded-lg disabled:opacity-50"
          >
            {submitting ? "Analyzing..." : "Submit"}
          </button>
        )}

        {evaluation && (
          <div className="mt-8">

            <div className="text-gray-300 leading-relaxed space-y-4">

              {evaluation.mistake && (
                <div>
                  <p className="text-red-400 font-semibold">
                    ⚠️ What Went Wrong:
                  </p>

                  <p className="mt-1 text-gray-300">
                    {evaluation.mistake}
                  </p>
                </div>
              )}

              <div>
                <p className="text-purple-400 font-semibold">
                  🧠 Ideal Answer:
                </p>

                <p className="mt-1">
                  {evaluation.idealAnswer}
                </p>
              </div>

            </div>

            <button
              onClick={handleNext}
              className="mt-6 px-8 py-3 border border-blue-500 rounded-lg"
            >
              Next Question
            </button>

          </div>
        )}

      </div>
    </div>
  );
}