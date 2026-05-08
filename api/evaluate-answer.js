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
    return res.status(500).json({ error: error.message });
  }
}