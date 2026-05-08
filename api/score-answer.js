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

      if (!jsonMatch) {
        throw new Error("No JSON");
      }

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

    return res.json({
      score: parsed
    });

  } catch (err) {
    console.error("❌ SCORE API ERROR:", err);

    return res.status(500).json({
      error: "Scoring failed"
    });
  }
}