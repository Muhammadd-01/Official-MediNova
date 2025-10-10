// backend/routes/chatbotRoutes.js
import express from "express";
import dotenv from "dotenv";
import fetch from "node-fetch"; // or axios

dotenv.config();

const router = express.Router();

router.post("/", async (req, res) => {
  try {
    const { message } = req.body;
    if (!message || !message.trim()) {
      return res.status(400).json({ reply: "⚠️ Message cannot be empty." });
    }

    // Formulate request body per Gemini API spec
    const payload = {
      model: "gemini-2.5-flash",  // or whichever model your key supports
      contents: [
        { parts: [ { text: message } ] }
      ]
    };

    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1/models/${payload.model}:generateContent`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-goog-api-key": process.env.GEMINI_API_KEY
        },
        body: JSON.stringify({ contents: payload.contents })
      }
    );

    const data = await response.json();
    if (!response.ok) {
      console.error("Gemini REST error:", data);
      return res.status(500).json({ reply: "❌ AI error via REST." });
    }

    // Extract the generated text
    const generated = data.candidates?.[0]?.content?.parts?.[0]?.text;
    res.json({ reply: generated ?? "Sorry, no reply." });

  } catch (err) {
    console.error("Chatbot REST Error:", err);
    res.status(500).json({ reply: "❌ AI error." });
  }
});

export default router;
