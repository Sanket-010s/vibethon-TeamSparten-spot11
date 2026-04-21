import { Router } from "express";
import { verifyToken } from "../middleware/auth.js";

const router = Router();

router.post("/", verifyToken, async (req, res) => {
  const { topic } = req.body;
  if (!topic) return res.status(400).json({ error: "Topic is required" });

  if (!process.env.OPENAI_API_KEY) {
    return res.json({
      answer:
        "Demo tutor mode: In supervised learning, models learn from labeled examples. In unsupervised learning, models discover patterns in unlabeled data.",
    });
  }

  try {
    const response = await fetch("https://api.openai.com/v1/responses", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
      },
      body: JSON.stringify({
        model: "gpt-4.1-mini",
        input: `You are an AIML tutor for beginners. Explain clearly in under 160 words with one analogy. Question: ${topic}`,
      }),
    });

    if (!response.ok) {
      const err = await response.text();
      return res.status(500).json({ error: err });
    }

    const data = await response.json();
    res.json({ answer: data.output_text || "No answer generated" });
  } catch (error) {
    res.status(500).json({ error: "AI Tutor request failed", details: error.message });
  }
});

export default router;
