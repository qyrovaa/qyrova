import OpenAI from "openai";

if (!process.env.OPENAI_API_KEY) {
  console.error("❌ OPENAI_API_KEY missing");
}

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
      model: "gpt-4o-mini",
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

    return res.status(500).json({
      error: "Failed to generate improvement plan"
    });
  }
}