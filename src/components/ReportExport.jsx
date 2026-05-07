import React from "react";

export default function ReportExport() {

  // ✅ get report id from url
  const id =
    window.location.pathname.split("/qreport/")[1];

  // ✅ get report data
  const report =
    JSON.parse(localStorage.getItem(`qreport-${id}`));

  if (!report) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        Report not found
      </div>
    );
  }

  const {
    score,
    sections,
    coachRemark
  } = report;

  const passed = Number(score) >= 60;

  return (
    <div
      style={{
        width: "100%",
        minHeight: "100vh",
        background: "#000",
        color: "white",
        padding: "40px",
        boxSizing: "border-box",
        fontFamily: "Rajdhani, sans-serif",
        backgroundImage: "url('/performancereportpages.png')",
        backgroundSize: "cover",
        backgroundPosition: "center",
        display: "flex",
        justifyContent: "center",
        alignItems: "center"
      }}
    >
      <div
        style={{
          width: "100%",
          maxWidth: "880px",
          background: "rgba(0,0,0,0.82)",
          border: "1px solid rgba(168,85,247,0.28)",
          borderRadius: "30px",
          padding: "28px",
          backdropFilter: "blur(20px)",
          boxShadow: "0 0 60px rgba(168,85,247,0.08)"
        }}
      >
        <h1
          style={{
            textAlign: "center",
            fontSize: "38px",
            letterSpacing: "0.22em",
            marginBottom: "55px",
            fontFamily: "Michroma, sans-serif",
            lineHeight: "1.4"
          }}
        >
          PERFORMANCE ANALYTICS SUMMARY
        </h1>

        <div
          style={{
            textAlign: "center",
            fontSize: "52px",
            fontWeight: "700",
            marginBottom: "24px",
            lineHeight: "1"
          }}
        >
          {score}
          <span style={{ color: "#9CA3AF" }}> / 100</span>
        </div>

        <div
          style={{
            textAlign: "center",
            marginBottom: "55px"
          }}
        >
          <span
            style={{
              padding: "12px 30px",
              borderRadius: "999px",
              fontSize: "15px",
              letterSpacing: "0.18em",
              border: passed
                ? "1px solid rgba(168,85,247,0.45)"
                : "1px solid rgba(239,68,68,0.45)",
              color: passed ? "#D8B4FE" : "#F87171",
              background: passed
                ? "rgba(168,85,247,0.10)"
                : "rgba(239,68,68,0.10)",
              backdropFilter: "blur(10px)"
            }}
          >
            {passed ? "LEVEL CLEARED" : "RETAKE REQUIRED"}
          </span>
        </div>

        <div style={{ marginBottom: "60px" }}>
          {sections.map((section) => (
            <div key={section.name} style={{ marginBottom: "32px" }}>

              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  marginBottom: "10px",
                  color: "#9CA3AF",
                  fontSize: "18px",
                  letterSpacing: "0.04em"
                }}
              >
                <span>{section.name}</span>
                <span>{section.value} / 20</span>
              </div>

              <div
                style={{
                  width: "100%",
                  height: "12px",
                  background: "#1F2937",
                  borderRadius: "999px",
                  overflow: "hidden"
                }}
              >
                <div
                  style={{
                    width: `${section.value * 5}%`,
                    height: "100%",
                    borderRadius: "999px",
                    background:
                      "linear-gradient(90deg,#8B5CF6,#D946EF)",
                    boxShadow:
                      "0 0 18px rgba(217,70,239,0.35)"
                  }}
                />
              </div>

            </div>
          ))}
        </div>

        {coachRemark && (
          <div>

            <h2
              style={{
                textAlign: "center",
                marginBottom: "26px",
                fontSize: "24px",
                letterSpacing: "0.22em",
                background:
                  "linear-gradient(to right,#A78BFA,#EC4899)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                fontWeight: "600"
              }}
            >
              AI COACH REMARK
            </h2>

            <div
              style={{
                background: "rgba(255,255,255,0.03)",
                border: "1px solid rgba(168,85,247,0.16)",
                borderRadius: "24px",
                padding: "30px",
                color: "#D1D5DB",
                lineHeight: "2",
                fontSize: "18px",
                backdropFilter: "blur(12px)"
              }}
            >
              {coachRemark}
            </div>

          </div>
        )}

      </div>
    </div>
  );
}