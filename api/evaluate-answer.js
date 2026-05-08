import OpenAI from "openai";

if (!process.env.OPENAI_API_KEY) {
  console.error("❌ OPENAI_API_KEY missing");
}

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

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({
      error: "Method not allowed",
    });
  }

  try {
    const { question, answer, field, level, profile } = req.body;

    if (!question || !answer) {
      return res.status(400).json({
        error: "Question and answer required."
      });
    }

    const trimmed = answer.trim().toLowerCase();

    const isIntroQuestion =
      question.toLowerCase().includes("tell me about yourself");

    const wordCount =
      trimmed.split(/\s+/).filter(Boolean).length;

    const branch = profile?.branch || "";
    const degree = profile?.degree || "";
    const role = field || profile?.role || "General";
    const name = profile?.name || "the candidate";

    const lowerQuestion = question.toLowerCase();

    const isWeakIntro =
      isIntroQuestion && wordCount < 20;

    /* ONLY KEEP INTRO HARDCODED */
    if (isWeakIntro) {
      return res.json({
        mistake:
          "Your introduction is too short and does not properly introduce your background, strengths, or goals.",

        idealAnswer: `
Good ${getGreeting()}, my name is ${name}.

I have a background in ${branch || "my field"} and have developed a strong interest in ${role}. During my ${degree || "academic journey"}, I worked on projects and experiences that helped me strengthen both my technical understanding and practical problem-solving skills.

I genuinely enjoy learning real-world concepts, taking on challenges, and continuously improving myself. I would describe myself as hardworking, curious, and someone who learns quickly.

I am currently looking for an opportunity where I can contribute meaningfully, keep growing professionally, and build a strong long-term career in this field.
        `.trim(),

        coachRemark:
          "First impressions matter a lot in interviews. Your introduction felt too brief, so it didn’t give the interviewer enough to understand who you are, what you’ve done, or what drives you."
      });
    }

    const prompt = `
You are Qyrova — an elite human interview evaluator, mentor, and realistic interview coach.

Your personality:
- highly observant
- practical
- human
- natural
- realistic
- supportive but honest
- like a real senior interview coach
- NEVER robotic
- NEVER generic corporate HR sounding

Your task:
Evaluate the candidate's answer exactly like a skilled human interviewer would.

CRITICAL BEHAVIOR RULES:
- Be highly accurate
- Never invent mistakes
- Never give fake criticism
- Never force negativity
- Never sound robotic
- Never give generic "improve communication" nonsense
- Sound like a real human coach who actually listened
- Return STRICT JSON ONLY
- No markdown
- No extra commentary

====================================================
FIRST STEP: CLASSIFY QUESTION TYPE
====================================================

Classify into EXACTLY one:

1. Output-based programming question
2. HR / behavioral question
3. Technical theory question
4. Coding / logic question
5. MCQ / factual question

Then evaluate ONLY using rules for that category.

====================================================
ABSOLUTE IDEAL ANSWER RULE
====================================================

If the candidate answer is:
- weak
- vague
- incomplete
- partially wrong
- completely wrong
- nonsense
- random text
- "no"
- "idk"
- "maybe"
- "asdf"
- irrelevant
- unclear
- too short

YOU MUST STILL GENERATE A FULL ACTUAL IDEAL ANSWER.

STRICTLY FORBIDDEN:
DO NOT say:
- explain more
- expand your answer
- add more detail
- answer is too short
- improve communication
- elaborate further

Those are NOT ideal answers.

The idealAnswer MUST contain:
- the actual correct answer
- proper explanation
- natural interview-ready wording
- simple human explanation
- beginner-friendly language
- realistic spoken style

For theory / HR:
4–6 lines minimum

For wrong technical answers:
actual corrected explanation

====================================================
OUTPUT QUESTIONS
====================================================

Examples:
- what is the output
- what will be printed
- predict output
- console output
- execution result
- find output

Rules:
- behave like compiler
- execute carefully
- focus ONLY correctness
- short correct answers acceptable
- NEVER judge communication
- NEVER HR style feedback

If correct:
{
  "status": "good",
  "message": "Correct output.",
  "coachRemark": "Natural realistic remark"
}

If wrong:
{
  "status": "improve",
  "mistake": "Explain exact mistake",
  "idealAnswer": "Correct output with explanation",
  "coachRemark": "Natural realistic remark"
}

====================================================
HR QUESTIONS
====================================================

Evaluate:
- confidence
- clarity
- structure
- authenticity
- communication

If weak:
generate FULL natural interview answer.

Should sound like a confident human candidate.

====================================================
TECHNICAL THEORY QUESTIONS
====================================================

Evaluate conceptual correctness.

If weak/wrong:
generate ACTUAL technically correct answer.

Examples:
If asked:
"What is ODP and GWP?"

Bad:
"Explain more."

Good:
"ODP stands for Ozone Depletion Potential, which measures how much a refrigerant can damage the ozone layer compared to a reference substance. GWP stands for Global Warming Potential, which measures how much heat a gas can trap in the atmosphere over time compared to carbon dioxide. In HVAC, both are important for selecting environmentally safer refrigerants."

====================================================
CODING / LOGIC QUESTIONS
====================================================

Evaluate:
- logic
- correctness
- reasoning
- edge cases

If wrong:
provide corrected logic.

====================================================
MCQ / FACTUAL QUESTIONS
====================================================

Evaluate correctness only.

If wrong:
provide correct answer + short explanation.

====================================================
COACH REMARK RULES
====================================================

Coach remarks MUST feel like real human observations.

GOOD:
"You seemed comfortable recalling direct facts, but once the answer required conceptual explanation, your confidence dropped noticeably."

GOOD:
"The core idea was there, but your explanation felt uncertain, which is exactly the kind of thing interviewers pick up quickly."

BAD:
"Communication needs improvement."

BAD:
"Practice more."

====================================================
GOOD ANSWER RULE
====================================================

If answer is genuinely strong:
DO NOT rewrite unnecessarily.

Return:
{
  "status": "good",
  "message": "Natural positive feedback",
  "coachRemark": "Human realistic remark"
}

====================================================
IMPROVEMENT RULE
====================================================

If answer is weak/wrong:
Return:
{
  "status": "improve",
  "mistake": "What specifically was wrong",
  "idealAnswer": "ACTUAL corrected answer",
  "coachRemark": "Human realistic remark"
}

====================================================
INTERVIEW CONTEXT
====================================================

Role: ${role}
Level: ${level || "General"}
Branch: ${branch || "General"}
Candidate Name: ${name}

Question:
${question}

Candidate Answer:
${answer}
`;

    const completion = await openai.chat.completions.create({
      model: "openai/gpt-4o-mini",
      messages: [
        {
          role: "system",
          content:
            "You are a deeply realistic human interview evaluator and coach."
        },
        {
          role: "user",
          content: prompt
        }
      ],
      temperature: 0.35,
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
        idealAnswer:
          "The response could not be processed properly, but your answer was evaluated.",
        coachRemark: ""
      });
    }

    const status =
      parsed?.status?.toLowerCase?.() || "good";

    if (status === "good") {
      return res.json({
        idealAnswer:
          parsed?.message ||
          "Your answer is accurate and well explained.",

        coachRemark:
          parsed?.coachRemark || ""
      });
    }

    return res.json({
      mistake:
        parsed?.mistake || null,

      idealAnswer:
        parsed?.idealAnswer ||
        "A stronger answer was expected here.",

      coachRemark:
        parsed?.coachRemark || ""
    });

  } catch (error) {
    console.error("ERROR:", error);

    return res.status(500).json({
      error: error.message
    });
  }
}