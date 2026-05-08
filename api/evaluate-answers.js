import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
  baseURL: process.env.OPENAI_BASE_URL,
});

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
        error: "Question and answer required.",
      });
    }

    const trimmed = answer.trim().toLowerCase();

    const isIntroQuestion =
      question.toLowerCase().includes("tell me about yourself");

    const wordCount = trimmed.split(/\s+/).filter(Boolean).length;

    const branch = profile?.branch || "";
    const degree = profile?.degree || "";
    const role = field || profile?.role || "General";
    const name = profile?.name || "the candidate";

    const isWeakIntro = isIntroQuestion && wordCount < 20;

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
            "Your introduction felt too brief to create a strong first impression.",
        });
      }

      return res.json({
        mistake:
          "Your answer is too short for a real interview setting.",

        idealAnswer:
          isHrQuestion
            ? "Give a conversational answer that explains your thinking."
            : "Expand your answer so the interviewer can evaluate your understanding.",

        coachRemark:
          "Your response felt too brief to evaluate properly.",
      });
    }

    const prompt = `
You are Qyrova — a realistic interview evaluator.

Evaluate accurately.

Return STRICT JSON ONLY.

GOOD:
{
  "status":"good",
  "message":"positive evaluation",
  "coachRemark":"mentor remark"
}

IMPROVE:
{
  "status":"improve",
  "mistake":"what was wrong",
  "idealAnswer":"better answer",
  "coachRemark":"mentor remark"
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
          content: "You are a realistic interviewer.",
        },
        {
          role: "user",
          content: prompt,
        },
      ],
      temperature: 0.2,
    });

    let rawText = completion.choices[0].message.content
      .replace(/```json/g, "")
      .replace(/```/g, "")
      .trim();

    let parsed;

    try {
      const jsonMatch = rawText.match(/\{[\s\S]*\}/);

      if (!jsonMatch) {
        throw new Error("No valid JSON found");
      }

      parsed = JSON.parse(jsonMatch[0]);
    } catch {
      return res.json({
        idealAnswer: "Your answer is accurate and well-explained.",
        coachRemark: "",
      });
    }

    const status = parsed?.status?.toLowerCase?.() || "good";

    if (status === "good") {
      return res.json({
        idealAnswer:
          parsed?.message || "Your answer is accurate and well-explained.",
        coachRemark: parsed?.coachRemark || "",
      });
    }

    return res.json({
      mistake: parsed?.mistake || null,
      idealAnswer: parsed?.idealAnswer || null,
      coachRemark: parsed?.coachRemark || "",
    });
  } catch (error) {
    console.error("EVALUATE ERROR:", error);

    return res.status(500).json({
      error: error.message,
    });
  }
}