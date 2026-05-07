import React, { useState, useEffect } from "react";
import { loginUser, isSetupComplete } from "../user";

export default function AuthModal({ type, onClose }) {
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [error, setError] = useState("");

  const [otp, setOtp] = useState("");
  const [step, setStep] = useState("form");

  const [otpArray, setOtpArray] = useState(["", "", "", "", "", ""]);
  const [loading, setLoading] = useState(false);
  const [verifying, setVerifying] = useState(false);

  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "auto";
    };
  }, []);

  const handleContinue = async () => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!name || !email) {
      setError("Please fill all details to continue.");
      return;
    }

    if (!emailRegex.test(email)) {
      setError("Please enter a valid email address.");
      return;
    }

    setError("");
    setLoading(true);

    try {
      const res = await fetch("/api/send-otp", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email }),
      });

      const data = await res.json();

      if (res.ok) {
        setOtp("");
        setError("");
        setStep("otp");
      } else {
        setError(data.message || "Failed to send OTP");
      }

    } catch (err) {
      console.error(err);
      setError("Something went wrong.");
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOtp = async () => {
    const finalOtp = otpArray.join("");

    if (!finalOtp) {
      setError("Enter OTP");
      return;
    }

    setError("");
    setVerifying(true);

    try {
      const res = await fetch("/api/verify-otp", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, otp: finalOtp }),
      });

      const data = await res.json();

      if (!data.success) {
        setError(data.message || "Invalid OTP");
        return;
      }

      localStorage.setItem("isLoggedIn", "true");

      const userData = { name, email };
      localStorage.setItem("userData", JSON.stringify(userData));
      localStorage.setItem("qyrovaName", name);

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

      onClose();

    } catch (err) {
      console.error(err);
      setError("Verification failed");
    } finally {
      setVerifying(false);
    }
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50">
      
      <div
        className="absolute inset-0 bg-black/80 backdrop-blur-sm"
        onClick={(e) => {
          e.preventDefault();
          e.stopPropagation();
          onClose();
        }}
      />

      <div
        className="relative w-full max-w-4xl h-[420px] rounded-2xl overflow-hidden shadow-2xl border border-white/10 flex"
        onClick={(e) => e.stopPropagation()}
      >

        <div className="w-1/2 bg-gradient-to-br from-purple-900 via-indigo-900 to-black p-10 flex flex-col justify-center">
          <h1 className="text-4xl font-bold text-white mb-4">
            Master the Moment.
          </h1>

          <p className="text-gray-300 mb-6">
            Train with intention. Perform with confidence.
          </p>

          <p className="text-gray-400 text-sm leading-relaxed">
            AI-powered mock interviews. Real-time evaluation.
            <br />
            Performance tracking.
          </p>
        </div>

        <div className="w-1/2 bg-black p-10 flex flex-col justify-center relative">

          {(name && email) && (
            <button
              onClick={onClose}
              className="absolute top-4 right-4 text-gray-500 hover:text-white"
            >
              ✕
            </button>
          )}

          <h2 className="text-white text-2xl font-semibold mb-6">
            Enter Qyrova
          </h2>

          <input
            type="text"
            placeholder="Your Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full p-4 rounded-xl bg-neutral-900 border border-gray-800 text-white mb-4"
          />

          <input
            type="email"
            placeholder="you@domain.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full p-4 rounded-xl bg-neutral-900 border border-gray-800 text-white mb-4"
          />

          {step === "form" ? (
            <>
              {error && (
                <p className="text-red-400 text-sm mb-4">
                  ⚠️ {error}
                </p>
              )}

              <button
                onClick={handleContinue}
                disabled={loading}
                className={`w-full py-4 rounded-xl font-semibold text-white transition-all ${
                  loading
                    ? "bg-purple-800 cursor-not-allowed"
                    : "bg-gradient-to-r from-purple-500 to-purple-700 active:scale-95"
                }`}
              >
                {loading ? "Sending..." : "Send OTP →"}
              </button>
            </>
          ) : (
            <>
              <div className="flex gap-3 mb-3 justify-center">
                {otpArray.map((digit, index) => (
                  <input
                    key={index}
                    id={`otp-${index}`}
                    type="text"
                    maxLength="1"
                    value={digit}
                    onChange={(e) => {
                      const val = e.target.value.replace(/[^0-9]/g, "");
                      if (!val) return;

                      const newOtp = [...otpArray];
                      newOtp[index] = val;
                      setOtpArray(newOtp);

                      if (index < 5) {
                        document.getElementById(`otp-${index + 1}`)?.focus();
                      }
                    }}
                    onKeyDown={(e) => {
                      if (e.key === "Backspace") {
                        const newOtp = [...otpArray];
                        newOtp[index] = "";
                        setOtpArray(newOtp);

                        if (index > 0) {
                          document.getElementById(`otp-${index - 1}`)?.focus();
                        }
                      }
                    }}
                    className="w-12 h-14 text-center text-xl font-semibold rounded-xl bg-neutral-900 border border-gray-700 text-white focus:border-purple-500 focus:ring-2 focus:ring-purple-500"
                  />
                ))}
              </div>

              {error && (
                <p className="text-red-400 text-sm mb-3 text-center">
                  ⚠️ {error}
                </p>
              )}

              <button
                onClick={handleVerifyOtp}
                disabled={verifying}
                className={`w-full py-4 rounded-xl font-semibold text-white transition-all ${
                  verifying
                    ? "bg-purple-800 cursor-not-allowed"
                    : "bg-gradient-to-r from-purple-500 to-purple-700 active:scale-95"
                }`}
              >
                {verifying ? "Verifying..." : "Verify OTP →"}
              </button>
            </>
          )}

        </div>
      </div>
    </div>
  );
}
