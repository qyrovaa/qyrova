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

    const isWeakIntro =
      isIntroQuestion && wordCount < 20;

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
Good ${getGreeting()}, my name is ${name}.

I have a background in ${branch || "my field"} and have developed strong interest in ${role}. During my ${degree || "academic journey"}, I worked on projects and experiences that improved my technical and communication skills.

I enjoy learning practical concepts and solving real-world problems. I am someone who is hardworking, curious, and eager to grow professionally.

I am currently looking for an opportunity where I can contribute, improve my skills further, and build a strong career in this field.
          `.trim(),

          coachRemark:
            "Your introduction felt too brief to create a strong first impression. A structured introduction immediately makes you sound more confident and interview-ready."
        });
      }

      return res.json({

        mistake:
          "Your answer is too short for a real interview setting and does not properly communicate your reasoning, intent, or confidence.",

        idealAnswer:
          isHrQuestion
            ? "A better approach would be to explain your thought process naturally instead of replying in one or two words. Interviewers usually expect a short but properly explained answer that shows clarity, confidence, and communication ability."
            : "Your answer needs more explanation. In interviews, even technically correct points should be explained clearly so the interviewer can understand your reasoning and depth of knowledge.",

        coachRemark:
          "Your response was extremely short, which made it difficult to judge your understanding or confidence properly."
      });
    }

    const prompt = `
You are Qyrova — an elite realistic interview evaluator and mentor.

Your task is to evaluate candidate answers naturally and accurately.

IMPORTANT:
- Be highly accurate
- Never invent mistakes
- Never give fake criticism
- Sound human and realistic
- Use beginner-friendly English
- Keep explanations simple and natural
- Return STRICT JSON ONLY
- No markdown
- No extra commentary

====================================================
CRITICAL TASK
====================================================

You must FIRST classify the question into ONE category:

1. Output-based programming question
2. HR / behavioral question
3. Technical theory question
4. Coding / logic question
5. MCQ / factual question

Then evaluate ONLY using rules for that category.

====================================================
VERY IMPORTANT IDEAL ANSWER RULE
====================================================

If the candidate answer is weak, incomplete, vague, partially wrong, or incorrect:

You MUST generate a REAL IDEAL ANSWER.

DO NOT give advice like:
- "Expand your answer"
- "Explain more"
- "Add more detail"

Those are NOT ideal answers.

The idealAnswer MUST contain:
- The actual correct answer
- Proper explanation
- Natural interview-style wording
- Around 4–5 lines for HR/theory questions
- Simple easy English
- Beginner-friendly explanation

====================================================
OUTPUT-BASED PROGRAMMING QUESTIONS
====================================================

These include:
- what is the output
- what will be printed
- predict output
- console output
- execution result
- find output

RULES:
- Behave like a compiler
- Execute carefully line-by-line
- Focus ONLY on correctness
- Short correct answers are acceptable
- NEVER criticize communication skills
- NEVER give HR-style feedback
- NEVER force long explanations
- Ensure output is 100% correct

If candidate is correct:

Return:
{
  "status": "good",
  "message": "Correct output.",
  "coachRemark": "Short natural mentor remark"
}

If wrong:

Return:
{
  "status": "improve",
  "mistake": "Explain what was incorrect",
  "idealAnswer": "Correct output with short explanation",
  "coachRemark": "Short natural mentor remark"
}

====================================================
HR / BEHAVIORAL QUESTIONS
====================================================

RULES:
- Evaluate confidence
- Evaluate clarity
- Evaluate structure
- Evaluate communication

If weak:
- Give a FULL improved interview-style answer
- Make it sound natural and realistic
- Around 4–5 lines

====================================================
TECHNICAL THEORY QUESTIONS
====================================================

RULES:
- Focus on conceptual correctness
- If answer is weak or vague:
  generate a PROPER correct explanation

The ideal answer MUST:
- Actually teach the concept
- Be easy to understand
- Sound like a real interview answer
- Be around 4–5 lines

Example:
Question: What is COP in HVAC?

Bad idealAnswer:
"Expand your answer."

Good idealAnswer:
"COP stands for Coefficient of Performance. It measures the efficiency of a refrigeration or air conditioning system. It is calculated by dividing the cooling or heating effect produced by the work input given to the compressor. A higher COP means the HVAC system is more energy efficient and performs better."

====================================================
CODING / LOGIC QUESTIONS
====================================================

RULES:
- Evaluate logic and correctness
- If incorrect:
  provide corrected logic or approach
- Do NOT behave like HR feedback

====================================================
MCQ / FACTUAL QUESTIONS
====================================================

RULES:
- Evaluate correctness only
- Keep concise
- If wrong:
  provide the correct answer with short explanation

====================================================
COACH REMARK RULES
====================================================

Generate a short realistic mentor observation.

GOOD EXAMPLE:
"You seemed comfortable with direct concepts, but your explanations became less detailed once the question required conceptual clarity."

BAD EXAMPLE:
"Communication needs improvement."

====================================================
GENERAL RULES
====================================================

1. Never invent mistakes
2. Never force criticism
3. Never rewrite already strong answers
4. If answer is weak, provide ACTUAL ideal answer
5. Avoid robotic language
6. Keep responses realistic
7. Ensure reasoning matches final answer
8. Return STRICT JSON ONLY

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
  "idealAnswer": "Actual corrected answer with explanation",
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
        {
          role: "system",
          content: "You are a realistic interviewer and evaluator."
        },
        {
          role: "user",
          content: prompt
        }
      ],
      temperature: 0.3,
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
          "Your answer was evaluated, but the response format could not be processed correctly.",
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
        "A stronger and more complete answer was expected for this question.",

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