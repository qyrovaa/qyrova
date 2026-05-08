import dotenv from "dotenv";
dotenv.config();

import express from "express";
import cors from "cors";
import OpenAI from "openai";

/* ✅ PLAYWRIGHT */
import { chromium } from "playwright";

/* EXTRA */
import nodemailer from "nodemailer";
import clientPromise from "./db.js";

if (!process.env.OPENAI_API_KEY) {
  console.error("❌ OPENAI_API_KEY missing");
  process.exit(1);
}

const app = express();
app.use(cors());
app.use(express.json());

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
  baseURL: process.env.OPENAI_BASE_URL,
});

/* ✅ Greeting function */
function getGreeting() {
  const hour = new Date().getHours();
  if (hour < 12) return "morning";
  if (hour < 17) return "afternoon";
  return "evening";
}

app.get("/", (req, res) => {
  res.json({ message: "🚀 Server running with OpenRouter" });
});

/* ================= AI ROUTE ================= */

app.post("/evaluate-answer", async (req, res) => {
  try {
    const { question, answer, field, level, profile } = req.body;

    if (!question || !answer) {
      return res.status(400).json({ error: "Question and answer required." });
    }

    const trimmed = answer.trim().toLowerCase();

    const isIntroQuestion = question.toLowerCase().includes("tell me about yourself");
    const wordCount = trimmed.split(/\s+/).filter(Boolean).length;

    const branch = profile?.branch || "";
    const degree = profile?.degree || "";
    const role = field || profile?.role || "General";
    const name = profile?.name || "the candidate";

    const isWeakIntro = isIntroQuestion && wordCount < 20;

/* ✅ STRICT INTERVIEW DETECTION */

const lowerQuestion = question.toLowerCase();

const isOutputQuestion =
  lowerQuestion.includes("output") ||
  lowerQuestion.includes("printed") ||
  lowerQuestion.includes("console") ||
  lowerQuestion.includes("execution result") ||
  lowerQuestion.includes("predict output") ||
  lowerQuestion.includes("what will be printed") ||
  lowerQuestion.includes("find output");

const isMCQQuestion =
  lowerQuestion.includes("mcq") ||
  lowerQuestion.includes("true or false") ||
  lowerQuestion.includes("choose") ||
  lowerQuestion.includes("which of the following");

const isHrQuestion =
  lowerQuestion.includes("yourself") ||
  lowerQuestion.includes("relocate") ||
  lowerQuestion.includes("strength") ||
  lowerQuestion.includes("weakness") ||
  lowerQuestion.includes("hire you") ||
  lowerQuestion.includes("why do you want") ||
  lowerQuestion.includes("team") ||
  lowerQuestion.includes("challenge") ||
  lowerQuestion.includes("leadership") ||
  lowerQuestion.includes("conflict");

const isOneWordAnswer = wordCount <= 2;

const isWeakNonTechnical =
  !isOutputQuestion &&
  !isMCQQuestion &&
  isOneWordAnswer;

/* ✅ STRICT HR / NON-TECHNICAL FILTER */

if (isWeakIntro || isWeakNonTechnical) {

  if (isIntroQuestion) {

    return res.json({
      mistake:
        "Your introduction is too short and does not properly introduce your background, strengths, or goals.",

      idealAnswer: `
Good (${getGreeting()}), my name is (${name}).

I have a background in (${branch || "your field/area"}) and have built skills in (key skills) through (${degree || "education/experience/projects"}). I have worked on (1–2 key experiences), where I gained experience in (relevant skills/tools).

I am (2–3 strengths), and I enjoy (type of work you like). I am currently looking for an opportunity in (${role}) where I can contribute and continue to grow.

Overall, I would describe myself as (2–3 qualities) and someone who is eager to learn and add value.
      `.trim(),

      coachRemark:
        "Your introduction felt too brief to create a strong first impression. Interview introductions should sound confident, structured, and intentional."
    });
  }

  return res.json({

    mistake:
      "Your answer is too short for a real interview setting and does not properly communicate your reasoning, intent, or confidence.",

    idealAnswer:
      isHrQuestion
        ? "Give a conversational answer that briefly explains your thinking instead of replying with only one or two words."
        : "Expand your answer slightly so the interviewer can properly evaluate your understanding and communication.",

    coachRemark:
      "Your response felt too brief to properly evaluate confidence, communication, or thought process. Even simple interview questions should sound intentional and professionally explained."
  });
}

    const prompt = `
You are Qyrova — a realistic interview evaluator and mentor.

Your task is to evaluate candidate answers accurately and naturally.

IMPORTANT:
- Be accurate
- Never invent mistakes
- Sound human and realistic
- Use simple easy-to-understand English
- Ideal answers should usually be around 4–5 lines
- Avoid one-line ideal answers unless it is an output-based question
- HR and theory answers should feel naturally explained
- Do NOT use overly complex words
- Keep explanations clear and beginner-friendly
- Return STRICT JSON ONLY

====================================================
CRITICAL FIRST STEP
====================================================

First determine whether this is:

1. Output-based programming question
2. HR/behavioral question
3. Technical theory question
4. Coding/logic question
5. MCQ/factual question

You MUST use ONLY the rules for that category.

====================================================
OUTPUT-BASED PROGRAMMING QUESTIONS
====================================================

A question is OUTPUT-BASED if it asks:
- what is the output
- what will be printed
- find output
- execution result
- console output
- result of code
- predict output

FOR OUTPUT QUESTIONS:
- Behave like a compiler/interpreter
- Mentally execute the code carefully line-by-line
- Double-check language-specific behavior
- Focus ONLY on final correctness
- Short answers are fully acceptable
- Do NOT expect explanation unless necessary
- NEVER criticize short correct answers
- NEVER evaluate communication skills
- NEVER behave like HR feedback
- Ensure reasoning and final answer NEVER contradict
- The final output MUST be 100% accurate
- Re-verify the execution before answering
- Never guess output
- Never assume syntax behavior incorrectly
- Carefully evaluate:
  - pre/post increment
  - string pooling
  - integer caching
  - operator precedence
  - pass by value/reference behavior
  - loops and conditions
  - short-circuit evaluation
  - object equality vs reference equality
  - static vs instance behavior
  - null handling
  - type casting
  - recursion
  - mutable vs immutable objects
- If uncertain, internally re-execute the code before responding
- Accuracy is more important than speed
- NEVER mark a wrong output as correct
- NEVER contradict actual execution behavior
- NEVER provide HR-style feedback for output questions

If the candidate output is FULLY correct:

Return:
{
  "status": "good",
  "message": "Correct output.",
  "coachRemark": "Natural human mentor remark"
}

If incorrect:

Return:
{
  "status": "improve",
  "mistake": "Explain exactly what was incorrect in the output",
  "idealAnswer": "Correct output with short explanation",
  "coachRemark": "Natural human mentor remark"
}

====================================================
HR / BEHAVIORAL QUESTIONS
====================================================

For HR questions:
- Evaluate clarity, confidence, communication, structure
- Good answers do NOT need rewriting
- Improve only if weak, vague, or too short

====================================================
TECHNICAL THEORY QUESTIONS
====================================================

For theory/conceptual questions:
- Focus on conceptual correctness
- Accept concise technically correct answers
- Avoid unnecessary rewriting

====================================================
CODING / LOGIC QUESTIONS
====================================================

For coding/problem-solving:
- Evaluate correctness, logic, edge cases, approach
- Do NOT behave like HR evaluation

====================================================
MCQ / FACTUAL QUESTIONS
====================================================

For MCQs/factual:
- Evaluate correctness only
- Keep response concise

====================================================
COACH REMARK RULES
====================================================

Generate a short natural mentor-style observation.

IMPORTANT:
- Sound human
- Avoid generic corporate feedback
- Avoid robotic phrases
- Keep it concise
- Mention subtle realistic observations

Bad:
"Communication needs improvement."

Good:
"You seemed confident with the concepts, but a couple of answers became uncertain midway through. Slowing down slightly would make your confidence come across more naturally."

====================================================
GENERAL RULES
====================================================

1. Never invent mistakes
2. Never rewrite already good answers
3. Never force long answers
4. Be realistic and supportive
5. Keep responses concise
6. Verify correctness before finalizing
7. Ensure final answer matches reasoning
8. Output STRICT JSON ONLY
9. No markdown
10. No extra commentary

GOOD RESPONSE FORMAT:
{
  "status": "good",
  "message": "Natural positive feedback",
  "coachRemark": "Natural mentor remark"
}

IMPROVEMENT RESPONSE FORMAT:
{
  "status": "improve",
  "mistake": "What was wrong",
  "idealAnswer": "Correct/improved answer",
  "coachRemark": "Natural mentor remark"
}

Question:
${question}

Candidate Answer:
${answer}
`;

    const completion = await openai.chat.completions.create({
      model: "openai/gpt-4o-mini",
      messages: [
        { role: "system", content: "You are a realistic interviewer." },
        { role: "user", content: prompt },
      ],
      temperature: 0.2,
    });

    let rawText = completion.choices[0].message.content
      .replace(/```json/g, "")
      .replace(/```/g, "")
      .trim();

    let parsed;

    try {

      console.log("RAW AI RESPONSE:\n", rawText);

      const jsonMatch = rawText.match(/\{[\s\S]*\}/);

      if (!jsonMatch) {
        throw new Error("No valid JSON found");
      }

      parsed = JSON.parse(jsonMatch[0]);

    } catch (err) {

      console.error("❌ EVALUATION PARSE FAILED:", rawText);

      return res.json({
        idealAnswer: "Your answer is accurate and well-explained.",
        coachRemark: ""
      });
    }

    const status = parsed?.status?.toLowerCase?.() || "good";

    if (status === "good") {
      return res.json({
        idealAnswer:
          parsed?.message || "Your answer is accurate and well-explained.",
        coachRemark: parsed?.coachRemark || ""
      });
    }

    return res.json({
      mistake: parsed?.mistake || null,
      idealAnswer: parsed?.idealAnswer || null,
      coachRemark: parsed?.coachRemark || ""
    });

  } catch (error) {
    console.error("ERROR:", error);
    res.status(500).json({ error: error.message });
  }
});

/* ================= FINAL COACH REMARK ================= */

app.post("/generate-final-remark", async (req, res) => {

  try {

    const { answers, scores, role, level } = req.body;

    const prompt = `
You are Qyrova's elite AI interview mentor.

Your task is to generate a FINAL PERFORMANCE REMARK after a complete mock interview.

You are NOT evaluating one answer.
You are evaluating the candidate's OVERALL interview presence.

Interview Role:
${role}

Interview Level:
${level}

Interview Answers:
${JSON.stringify(answers)}

Scores:
${JSON.stringify(scores)}

====================================================

IMPORTANT BEHAVIOR:

- Sound highly human
- Sound emotionally intelligent
- Sound like a real senior interviewer
- Be realistic and observant
- Avoid robotic feedback
- Avoid generic praise
- Mention patterns in performance
- Mention confidence, clarity, thinking style, communication, technical depth, hesitation, composure, etc.
- Make the candidate feel genuinely observed

====================================================

STYLE RULES:

- Write naturally
- 5–8 lines maximum
- Do NOT use bullet points
- Do NOT sound corporate
- Do NOT use repetitive AI phrases
- Do NOT overpraise weak performances
- Encourage realistically
- Make it premium-quality

====================================================

Return STRICT JSON ONLY:

{
  "remark": "final personalized coach remark"
}
`;

    const completion = await openai.chat.completions.create({
      model: "openai/gpt-4o-mini",
      messages: [
        {
          role: "system",
          content: "You are an elite interview mentor."
        },
        {
          role: "user",
          content: prompt
        }
      ],
      temperature: 0.7,
    });

    let raw = completion.choices[0].message.content
      .replace(/```json/g, "")
      .replace(/```/g, "")
      .trim();

    try {

      const jsonMatch = raw.match(/\{[\s\S]*\}/);

      if (!jsonMatch) {
        throw new Error("No JSON");
      }

      const parsed = JSON.parse(jsonMatch[0]);

      return res.json({
        remark: parsed.remark || ""
      });

    } catch (err) {

      console.error("❌ FINAL REMARK PARSE FAILED:", raw);

      return res.json({
        remark:
          "You showed solid potential throughout the interview. A little more consistency and sharper structure in a few answers would make your performance feel much more polished and interview-ready."
      });
    }

  } catch (err) {

    console.error("❌ FINAL REMARK ERROR:", err);

    res.status(500).json({
      error: "Failed to generate final remark"
    });
  }
});

/* ================= ✅ SCORE ROUTE ================= */

app.post("/score-answer", async (req, res) => {
  try {
    const { question, answer } = req.body;

    const prompt = `
Evaluate this answer strictly.

Give score (0–20):
technical, clarity, structure, confidence, impact

Return ONLY JSON:
{
  "technical": number,
  "clarity": number,
  "structure": number,
  "confidence": number,
  "impact": number
}

Question: ${question}
Answer: ${answer}
`;

    const completion = await openai.chat.completions.create({
      model: "openai/gpt-4o-mini",
      messages: [
        { role: "system", content: "You are an evaluator." },
        { role: "user", content: prompt },
      ],
      temperature: 0.2,
    });

    let raw = completion.choices[0].message.content
      .replace(/```json/g, "")
      .replace(/```/g, "")
      .trim();

    let parsed;

    try {
      const jsonMatch = raw.match(/\{[\s\S]*\}/);
      if (!jsonMatch) throw new Error("No JSON");

      parsed = JSON.parse(jsonMatch[0]);
    } catch (err) {
      console.error("❌ SCORE PARSE FAILED:", raw);

      return res.json({
        score: {
          technical: 0,
          clarity: 0,
          structure: 0,
          confidence: 0,
          impact: 0
        }
      });
    }

    res.json({ score: parsed });

  } catch (err) {
    console.error("❌ SCORE API ERROR:", err);
    res.status(500).json({ error: "Scoring failed" });
  }
});

/* ================= AI IMPROVEMENT PLAN ================= */

app.post("/generate-tips", async (req, res) => {

  try {

    const { questions } = req.body;

    const prompt = `
You are Qyrova's elite AI interview psychologist and performance analyst.

Your task is to deeply analyze the FULL interview performance.

IMPORTANT:
- Sound highly intelligent and observant
- Sound deeply personalized
- Mention behavioral patterns
- Mention confidence patterns
- Mention technical thinking style
- Mention hesitation
- Mention communication quality
- Mention answer depth
- Mention consistency patterns
- Mention problem-solving behavior
- Mention where confidence dropped
- Mention where answers became vague
- Mention whether the candidate rushed answers
- Mention if the candidate performs better in factual vs conceptual questions

The user should feel:
"Damn... this AI genuinely understood exactly how I performed."

NEVER give generic advice.

BAD:
- Practice more
- Improve communication
- Add examples

GOOD:
- Your confidence appears strongest during direct technical or output-based questions, but your answers become noticeably shorter when deeper explanation or structured reasoning is required.
- You seem comfortable with syntax-level concepts, though conceptual elaboration becomes hesitant once questions move beyond direct factual recall.

STYLE:
- Premium
- Human
- Psychological
- Observant
- Realistic
- Concise but impactful

Return STRICT JSON ONLY:

{
  "strengths": [
    "...",
    "...",
    "..."
  ],
  "weaknesses": [
    "...",
    "...",
    "..."
  ],
  "improvements": [
    "...",
    "...",
    "..."
  ],
  "resources": [
    "...",
    "...",
    "..."
  ]
}

Interview Data:
${JSON.stringify(questions)}
`;

    const completion = await openai.chat.completions.create({
      model: "openai/gpt-4o-mini",
      messages: [
        {
          role: "system",
          content: "You are an elite interview performance analyst."
        },
        {
          role: "user",
          content: prompt
        }
      ],
      temperature: 0.7,
    });

    let raw = completion.choices[0].message.content
      .replace(/```json/g, "")
      .replace(/```/g, "")
      .trim();

    try {

      console.log("RAW TIPS RESPONSE:\n", raw);

      const jsonMatch = raw.match(/\{[\s\S]*\}/);

      if (!jsonMatch) {
        throw new Error("No JSON found");
      }

      const parsed = JSON.parse(jsonMatch[0]);

      return res.json(parsed);

    } catch (err) {

      console.error("❌ TIPS PARSE FAILED:", raw);

      return res.json({
        strengths: [
          "You stayed engaged throughout the interview."
        ],
        weaknesses: [
          "Some answers lacked deeper explanation."
        ],
        improvements: [
          "Focus on expanding conceptual reasoning under pressure."
        ],
        resources: [
          "Practice realistic mock interviews consistently."
        ]
      });
    }

  } catch (err) {

    console.error("❌ GENERATE TIPS ERROR:", err);

    res.status(500).json({
      error: "Failed to generate improvement plan"
    });
  }
});
/* ================= 7 DAY PLAN ================= */

app.post("/generate-7day-plan", async (req, res) => {

  try {

    const { answers } = req.body;

    const prompt = `
You are Qyrova's elite interview transformation strategist.

Your task is to create a COMPLETE personalized 7-day improvement roadmap.

IMPORTANT:
- Generate EXACTLY 7 DAYS
- Never generate fewer than 7
- Each day must feel realistic and actionable
- Each day must contain:
  - day
  - title
  - 3 tasks
- Tasks should be concise
- Tasks should feel personalized to the candidate's weaknesses
- Avoid generic motivation
- Focus on actual improvement

RETURN STRICT JSON ONLY.

FORMAT:

{
  "plan": [
    {
      "day": "Day 1",
      "title": "Some Title",
      "tasks": [
        "Task 1",
        "Task 2",
        "Task 3"
      ]
    },
    {
      "day": "Day 2",
      "title": "Some Title",
      "tasks": [
        "Task 1",
        "Task 2",
        "Task 3"
      ]
    },
    {
      "day": "Day 3",
      "title": "Some Title",
      "tasks": [
        "Task 1",
        "Task 2",
        "Task 3"
      ]
    },
    {
      "day": "Day 4",
      "title": "Some Title",
      "tasks": [
        "Task 1",
        "Task 2",
        "Task 3"
      ]
    },
    {
      "day": "Day 5",
      "title": "Some Title",
      "tasks": [
        "Task 1",
        "Task 2",
        "Task 3"
      ]
    },
    {
      "day": "Day 6",
      "title": "Some Title",
      "tasks": [
        "Task 1",
        "Task 2",
        "Task 3"
      ]
    },
    {
      "day": "Day 7",
      "title": "Some Title",
      "tasks": [
        "Task 1",
        "Task 2",
        "Task 3"
      ]
    }
  ]
}

Interview Answers:
${JSON.stringify(answers)}
`;

    const completion = await openai.chat.completions.create({
      model: "openai/gpt-4o-mini",
      messages: [
        {
          role: "system",
          content: "You are an elite interview transformation strategist."
        },
        {
          role: "user",
          content: prompt
        }
      ],
      temperature: 0.7,
    });

    let raw = completion.choices[0].message.content
      .replace(/```json/g, "")
      .replace(/```/g, "")
      .trim();

    try {

      console.log("RAW 7 DAY PLAN:\n", raw);

      const jsonMatch = raw.match(/\{[\s\S]*\}/);

      if (!jsonMatch) {
        throw new Error("No JSON found");
      }

      const parsed = JSON.parse(jsonMatch[0]);

      if (
        !parsed.plan ||
        !Array.isArray(parsed.plan) ||
        parsed.plan.length < 7
      ) {
        throw new Error("Incomplete 7 day plan");
      }

      return res.json(parsed);

    } catch (err) {

      console.error("❌ 7 DAY PLAN PARSE FAILED:", raw);

      return res.json({
        plan: [
          {
            day: "Day 1",
            title: "Confidence Recovery",
            tasks: [
              "Practice speaking slowly and clearly.",
              "Work on structured answers.",
              "Focus on reducing hesitation."
            ]
          },
          {
            day: "Day 2",
            title: "Communication Repair",
            tasks: [
              "Answer mock HR questions aloud.",
              "Record and review your responses.",
              "Avoid one-word answers."
            ]
          },
          {
            day: "Day 3",
            title: "Technical Clarity",
            tasks: [
              "Revise core technical concepts.",
              "Explain concepts verbally.",
              "Practice output-based questions."
            ]
          },
          {
            day: "Day 4",
            title: "Confidence Building",
            tasks: [
              "Practice timed mock interviews.",
              "Improve eye contact and tone.",
              "Reduce filler words."
            ]
          },
          {
            day: "Day 5",
            title: "Problem Solving",
            tasks: [
              "Solve medium-level coding problems.",
              "Explain your approach step-by-step.",
              "Focus on logic clarity."
            ]
          },
          {
            day: "Day 6",
            title: "Interview Pressure Handling",
            tasks: [
              "Practice under time pressure.",
              "Handle unexpected questions calmly.",
              "Improve composure."
            ]
          },
          {
            day: "Day 7",
            title: "Final Simulation",
            tasks: [
              "Take a full mock interview.",
              "Review weak areas carefully.",
              "Prepare final improvement notes."
            ]
          }
        ]
      });
    }

  } catch (err) {

    console.error("❌ GENERATE 7 DAY PLAN ERROR:", err);

    res.status(500).json({
      error: "Failed to generate 7 day plan"
    });
  }
});

/* ================= ✅ PLAYWRIGHT EXPORT ================= */

app.post("/generate-report", async (req, res) => {

  const browser = await chromium.launch({
    headless: true
  });

  try {

    const page = await browser.newPage({
      viewport: {
        width: 1600,
        height: 1400
      }
    });

    await page.goto("http://localhost:3000/report-export", {
      waitUntil: "networkidle"
    });

    await page.screenshot({
      path: "qyrova-performance-report.png",
      fullPage: true
    });

    await browser.close();

    res.download("qyrova-performance-report.png");

  } catch (err) {

    console.error("❌ PLAYWRIGHT EXPORT ERROR:", err);

    await browser.close();

    res.status(500).send("Failed to generate report");
  }
});

/* ================= SERVER ================= */

const PORT = 5000;

app.listen(PORT, () => {
  console.log(`🚀 Server running at http://localhost:${PORT}`);
});