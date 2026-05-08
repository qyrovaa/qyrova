import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

import { isSignInWithEmailLink, signInWithEmailLink } from "firebase/auth";
import { auth } from "./firebase";

import { loginUser, isSetupComplete } from "./user";

import StartPage from "./components/StartPage";
import OnboardingPage from "./components/OnboardingPage";
import DegreeSelection from "./components/DegreeSelection";
import BranchSelection from "./components/BranchSelection";
import RoleSelection from "./components/RoleSelection";
import LevelPage from "./components/LevelPage";
import InterviewPage from "./components/InterviewPage";
import PerformanceReport from "./components/PerformanceReport";
import FinalInterview from "./components/FinalInterview";
import FinalIntro from "./components/FinalIntro";
import FinalPerformanceReport from "./components/FinalPerformanceReport";
import FinalTipsPage from "./components/FinalTipsPage";
import BackButton from "./components/BackButton";

import ProfileMenu from "./components/ProfileMenu";
import AuthModal from "./components/AuthModal";

import ReportExport from "./components/ReportExport";

export default function App() {
  const [stage, setStage] = useState("start");
  const [direction, setDirection] = useState(1);

  const [degree, setDegree] = useState("");
  const [branch, setBranch] = useState("");
  const [role, setRole] = useState("");
  const [level, setLevel] = useState("");

  const [score, setScore] = useState(0);
  const [answers, setAnswers] = useState([]);
  const [coachRemark, setCoachRemark] = useState("");

  const [showAuth, setShowAuth] = useState(false);

  useEffect(() => {
    const handler = (e) => {
      setDirection(1);
      setStage(e.detail);
    };

    window.addEventListener("qyrova:navigate", handler);

    return () => {
      window.removeEventListener("qyrova:navigate", handler);
    };
  }, []);

  useEffect(() => {
    const path = window.location.pathname;

    if (path.startsWith("/qreport/")) {
      setStage("reportExport");
    }

    if (isSignInWithEmailLink(auth, window.location.href)) {
      let email = localStorage.getItem("emailForSignIn");

      if (!email) {
        email = window.prompt("Enter your email");
      }

      signInWithEmailLink(auth, email, window.location.href)
        .then(async () => {
          localStorage.removeItem("emailForSignIn");
          localStorage.setItem("isLoggedIn", "true");

          const user = await loginUser(email);
          localStorage.setItem("qyrovaUser", JSON.stringify(user));

          if (isSetupComplete(user)) {
            window.dispatchEvent(
              new CustomEvent("qyrova:navigate", { detail: "level" })
            );
          } else {
            window.dispatchEvent(
              new CustomEvent("qyrova:navigate", { detail: "degree" })
            );
          }
        })
        .catch((error) => {
          console.error(error);
        });
    }
  }, []);

  const goBack = () => {
    setDirection(-1);

    switch (stage) {
      case "onboarding":
        setStage("role");
        break;
      case "degree":
        setStage("start");
        break;
      case "branch":
        setStage("degree");
        break;
      case "role":
        setStage("branch");
        break;
      case "level":
        setStage("onboarding");
        break;
      case "interview":
        setStage("level");
        break;
      case "report":
        setStage("interview");
        break;
      case "finalIntro":
        setStage("report");
        break;
      case "final":
        setStage("finalIntro");
        break;
      case "finalReport":
        setStage("final");
        break;
      case "finalTips":
        setStage("finalReport");
        break;
      default:
        break;
    }
  };

  let content = null;

  switch (stage) {
    case "start":
      content = (
        <StartPage
          onNext={(nextStage) => {
            setDirection(1);
            setStage(nextStage);
          }}
        />
      );
      break;

    case "onboarding":
      content = (
        <>
          <BackButton onClick={goBack} />
          <OnboardingPage
            onNext={() => {
              setDirection(1);
              setStage("level");
            }}
          />
        </>
      );
      break;

    case "degree":
      content = (
        <>
          <BackButton onClick={goBack} />
          <DegreeSelection
            onSelect={(d) => {
              setDegree(d);
              const user = JSON.parse(localStorage.getItem("qyrovaUser")) || {};
              user.degree = d;
              localStorage.setItem("qyrovaUser", JSON.stringify(user));
              setDirection(1);
              setStage("branch");
            }}
          />
        </>
      );
      break;

    case "branch":
      content = (
        <>
          <BackButton onClick={goBack} />
          <BranchSelection
            degree={degree}
            onSelect={(b) => {
              setBranch(b);
              const user = JSON.parse(localStorage.getItem("qyrovaUser")) || {};
              user.branch = b;
              localStorage.setItem("qyrovaUser", JSON.stringify(user));
              setDirection(1);
              setStage("role");
            }}
          />
        </>
      );
      break;

    case "role":
      content = (
        <>
          <BackButton onClick={goBack} />
          <RoleSelection
            degree={degree}
            branch={branch}
            onSelect={(r) => {
              const roleLower = r.toLowerCase().trim();

              setRole(roleLower);

              const user = JSON.parse(localStorage.getItem("qyrovaUser")) || {};
              user.role = roleLower;
              localStorage.setItem("qyrovaUser", JSON.stringify(user));

              setDirection(1);
              setStage("onboarding");
            }}
          />
        </>
      );
      break;

    case "level":
      content = (
        <>
          <BackButton onClick={goBack} />
          <LevelPage
            onSelect={(l) => {
              const levelLower = l.toLowerCase().trim();

              setLevel(levelLower);
              localStorage.setItem("level", levelLower);

              setDirection(1);
              setStage("interview");
            }}
          />
        </>
      );
      break;

    case "interview":
      content = (
        <>
          <BackButton onClick={goBack} />
          <InterviewPage
            role={role}
            level={level}
            branch={branch}
            onComplete={(data) => {
              setScore(data?.score || 0);
              setAnswers(data?.sections || []);
              setCoachRemark(data?.coachRemark || "");
              setDirection(1);
              setStage("report");
            }}
          />
        </>
      );
      break;

    case "report":
      content = (
        <>
          <BackButton onClick={goBack} />
          <PerformanceReport
            score={score}
            sections={answers}
            coachRemark={coachRemark}
            onRetry={() => {
              setDirection(1);
              setStage("interview");
            }}
            onProceed={() => {
              setDirection(1);
              setStage("finalIntro");
            }}
          />
        </>
      );
      break;

    case "finalIntro":
      content = (
        <>
          <BackButton onClick={goBack} />
          <FinalIntro
            onStart={() => {
              setDirection(1);
              setStage("final");
            }}
          />
        </>
      );
      break;

    case "final":
      content = (
        <>
          <BackButton onClick={goBack} />
          <FinalInterview
            role={role}
            onComplete={(ans) => {
              setAnswers(ans);
              setDirection(1);
              setStage("finalReport");
            }}
          />
        </>
      );
      break;

    case "finalReport":
      content = (
        <>
          <BackButton onClick={goBack} />
          <FinalPerformanceReport
            answers={answers}
            onGetTips={() => {
              setDirection(1);
              setStage("finalTips");
            }}
          />
        </>
      );
      break;

    case "finalTips":
      content = (
        <FinalTipsPage
          answers={answers}
          onDone={() => {
            setDirection(1);
            setStage("start");
          }}
        />
      );
      break;

    case "reportExport":
      content = <ReportExport />;
      break;

    default:
      content = null;
  }

  return (
    <div style={{ minHeight: "100vh", position: "relative" }}>
      {stage !== "reportExport" && (
        <ProfileMenu
          onLogout={() => {
            const isLoggedIn = localStorage.getItem("isLoggedIn") === "true";

            if (isLoggedIn) {
              localStorage.clear();
              setStage("start");
            } else {
              setShowAuth(true);
            }
          }}
          onEdit={() => {
            setLevel("");
            localStorage.removeItem("level");
            setStage("degree");
          }}
        />
      )}

      {["degree", "branch", "role"].includes(stage) ? (
        <AnimatePresence mode="wait">
          <motion.div
            key={stage}
            initial={{ opacity: 0, x: direction === 1 ? 80 : -80 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: direction === 1 ? -80 : 80 }}
            transition={{ duration: 0.35 }}
          >
            {content}
          </motion.div>
        </AnimatePresence>
      ) : (
        content
      )}

      {showAuth && (
        <AuthModal
          type="login"
          onClose={() => setShowAuth(false)}
        />
      )}
    </div>
  );
}