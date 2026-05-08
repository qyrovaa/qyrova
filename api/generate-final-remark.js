import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
  baseURL: process.env.OPENAI_BASE_URL,
});

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({
      error: "Method not allowed",
    });
  }

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

    return res.status(500).json({
      error: "Failed to generate final remark"
    });
  }
}