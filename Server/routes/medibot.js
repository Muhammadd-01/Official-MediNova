import express from "express";
import dotenv from "dotenv";
import fetch from "node-fetch";

dotenv.config();
const router = express.Router();

/**
 * @route POST /api/medibot
 * @desc Takes full user input, queries FDA API, then uses Gemini AI to generate structured suggestions.
 */
router.post("/", async (req, res) => {
  try {
    const {
      name,
      age,
      gender,
      weight,
      height,
      bloodGroup,
      symptoms, // array
      allergies, // array
      medicalHistory,
      currentMedications,
      isPregnant,
      isBreastfeeding,
    } = req.body;

    // 🔸 Validate required fields
    if (!name || !symptoms || symptoms.length === 0) {
      return res
        .status(400)
        .json({ reply: "⚠️ Please provide your name and at least one symptom." });
    }

    // 🔸 Join arrays for API-friendly strings
    const symptomQuery = symptoms.map(s => encodeURIComponent(s)).join(" OR ");
    const allergyList = allergies?.join(", ") || "None";
    const currentMeds = currentMedications || "None";
    const history = medicalHistory || "None";

    // 🔹 Step 1 — Query FDA API
    const fdaUrl = `https://api.fda.gov/drug/label.json?search=indications_and_usage:(${symptomQuery})+openfda.route:ORAL&limit=10`;

    const fdaResponse = await fetch(fdaUrl);
    const fdaData = await fdaResponse.json();

    const fdaSummary = fdaData?.results
      ? fdaData.results
          .map((r, i) => {
            return `#${i + 1} ${r.openfda?.brand_name?.[0] || r.openfda?.generic_name?.[0] || "Unknown"}  
Indication: ${r.indications_and_usage?.[0] || "N/A"}  
Dosage: ${r.dosage_and_administration?.[0] || "N/A"}  
Precautions: ${r.precautions?.[0] || "N/A"}  
Warnings: ${r.warnings?.[0] || "N/A"}`;
          })
          .join("\n\n")
      : "No FDA data found for these symptoms.";

    // 🔹 Step 2 — Construct AI prompt
    const prompt = `
You are a highly skilled medical AI assistant. Analyze the following patient's data and FDA-provided medicine info.

Patient Details:
- Name: ${name}
- Age: ${age || "Unknown"}
- Gender: ${gender || "Unknown"}
- Weight: ${weight ? `${weight} kg` : "Unknown"}
- Height: ${height ? `${height} cm` : "Unknown"}
- Blood Group: ${bloodGroup || "Unknown"}
- Symptoms: ${symptoms.join(", ")}
- Allergies: ${allergyList}
- Medical History: ${history}
- Current Medications: ${currentMeds}
- Pregnancy: ${gender === "female" ? (isPregnant ? "Pregnant" : "Not pregnant") : "N/A"}
- Breastfeeding: ${isBreastfeeding ? "Yes" : "No"}

FDA Data:
${fdaSummary}

Now provide the following:
✅ Step-by-step reasoning addressing ${name}.
✅ 2 Safe OTC Medications (Name, Dosage, Timing, Precautions, FDA Source).
🏠 Home Remedies & Lifestyle Suggestions (2-3).
⚠️ Warnings / What to Avoid based on profile/allergies.
⏳ How long to continue the treatment safely.
🚨 Disclaimer that this is not medical advice; must consult a doctor.
    `;

    // 🔹 Step 3 — Send to Gemini API
    const geminiResponse = await fetch(
      `https://generativelanguage.googleapis.com/v1/models/gemini-2.5-flash:generateContent`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-goog-api-key": process.env.GEMINI_API_KEY,
        },
        body: JSON.stringify({
          contents: [{ parts: [{ text: prompt }] }],
        }),
      }
    );

    const aiData = await geminiResponse.json();
    if (!geminiResponse.ok) {
      console.error("Gemini Error:", aiData);
      return res.status(500).json({ reply: "❌ AI processing failed." });
    }

    const aiReply = aiData.candidates?.[0]?.content?.parts?.[0]?.text;

    // 🔹 Step 4 — Respond to client
    res.json({
      reply: aiReply || "No AI suggestion available.",
      fdaSummary,
    });
  } catch (err) {
    console.error("Medibot Error:", err);
    res.status(500).json({ reply: "❌ Server error. Try again later." });
  }
});

export default router;
