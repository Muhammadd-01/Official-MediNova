import express from "express";
import axios from "axios";
import fetch from "node-fetch"; // Add this for image fetching (npm install node-fetch)

const router = express.Router();

const FDA_API_URL = process.env.FDA_API_URL || "https://api.fda.gov/drug/label.json";
const OPENROUTER_API_KEY = process.env.OPENROUTER_API_KEY;
const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
const OPENI_API_BASE = "https://openi.nlm.nih.gov/api/search";

// Critical symptoms (synced with hook)
const criticalSymptoms = [
  "chest pain", "difficulty breathing", "shortness of breath", "severe headache",
  "sudden weakness", "slurred speech", "severe abdominal pain", "high fever",
  "confusion", "fainting", "severe bleeding", "burning sensation", "can't breathe",
  "chest hurts", "feeling dizzy", "throwing up"
];

// Helper: Fetch medicine image
async function fetchMedicineImage(medicineName) {
  try {
    const query = encodeURIComponent(`${medicineName} pill`);
    const apiUrl = `${OPENI_API_BASE}?query=${query}&m=1&n=1`;
    const response = await fetch(apiUrl);
    if (!response.ok) throw new Error("Open-i API request failed");
    const data = await response.json();
    if (data.list && data.list.length > 0) return `https://openi.nlm.nih.gov${data.list[0].imgLarge}`;
    return "https://via.placeholder.com/300?text=Medicine"; // Fallback image
  } catch (error) {
    console.error("Error fetching medicine image:", error);
    return "https://via.placeholder.com/300?text=Medicine";
  }
}

// Helper: Check drug interactions (synced with hook)
function checkDrugInteractions(medications, currentMeds, allergies) {
  const currentMedList = currentMeds.toLowerCase().split(",").map(med => med.trim());
  const knownInteractions = {
    ibuprofen: ["aspirin", "anticoagulants"],
    pseudoephedrine: ["maoi", "antidepressants"],
    acetaminophen: ["warfarin"],
    diphenhydramine: ["alcohol", "sedatives"],
  };

  return medications.filter(med => {
    const medName = med.name.toLowerCase();
    if (allergies.some(a => a.toLowerCase() === medName)) return false;
    const interactions = knownInteractions[medName] || [];
    return !currentMedList.some(currentMed => interactions.some(interactingDrug => currentMed.includes(interactingDrug)));
  });
}

// Helper: Sanitize suggestions (limit to 2 unique, no allergies)
function sanitizeSuggestions(medications, allergies) {
  const seen = new Set();
  return medications.filter(med => {
    const medName = med.name.toLowerCase();
    if (seen.has(medName) || allergies.some(a => a.toLowerCase() === medName)) return false;
    seen.add(medName);
    return true;
  }).slice(0, 2);
}

// Helper: Parse AI response (enhanced for robustness)
function parseAIResponse(text) {
  if (!text) return null;
  const result = {
    reasoning: '',
    otcMedications: [],
    homeRemedies: [],
    warnings: [],
    duration: '',
    disclaimer: ''
  };

  const lines = text.split('\n').filter(line => line.trim());
  let currentSection = '';
  lines.forEach(line => {
    const trimmed = line.trim();
    if (trimmed.startsWith('✅ Reasoning')) currentSection = 'reasoning';
    else if (trimmed.startsWith('✅ OTC Medications')) currentSection = 'otcMedications';
    else if (trimmed.startsWith('🏠 Home Remedies')) currentSection = 'homeRemedies';
    else if (trimmed.startsWith('⚠️ Warnings')) currentSection = 'warnings';
    else if (trimmed.startsWith('⏳ Duration')) currentSection = 'duration';
    else if (trimmed.startsWith('🚨 Doctor Disclaimer')) currentSection = 'disclaimer';
    else if (trimmed && currentSection) {
      if (currentSection === 'otcMedications' && trimmed.startsWith('-')) {
        const parts = trimmed.replace(/^-/, '').split(' - ').map(p => p.trim());
        if (parts.length >= 4) {
          result.otcMedications.push({
            name: parts[0] || 'Unknown',
            dosage: parts[1] || '',
            timing: parts[2] || '',
            precautions: parts[3] || '',
            source: parts[4] || 'Available at pharmacies'
          });
        }
      } else if ((currentSection === 'homeRemedies' || currentSection === 'warnings') && trimmed.startsWith('-')) {
        result[currentSection].push(trimmed.replace(/^-/, '').trim());
      } else {
        result[currentSection] += (result[currentSection] ? ' ' : '') + trimmed;
      }
    }
  });
  return result;
}

// Helper: Has critical symptoms
function hasCriticalSymptoms(symptoms) {
  const symptomLower = symptoms.map(s => s.toLowerCase());
  return criticalSymptoms.some(critical => symptomLower.some(symptom => symptom.includes(critical)));
}

// Main analysis endpoint
router.post("/analyze", async (req, res) => {
  try {
    const {
      name = "User",
      symptoms = [],
      allergies = [],
      currentMedications = "",
      medicalHistory = "",
      isPregnant = false,
      isBreastfeeding = false,
      age = "",
      gender = "",
      weight = "",
      height = "",
      bloodGroup = ""
    } = req.body;

    if (!symptoms.length) {
      return res.status(400).json({ success: false, error: "Please provide at least one symptom." });
    }

    if (hasCriticalSymptoms(symptoms)) {
      const criticalResponse = {
        reasoning: `Dear ${name}, your symptoms (${symptoms.join(', ')}) may indicate a serious condition.`,
        otcMedications: [],
        homeRemedies: ["Rest and stay calm."],
        warnings: ["Seek emergency care immediately."],
        duration: "Immediate attention required.",
        disclaimer: "This is a medical emergency. Consult a doctor now."
      };
      return res.json({ success: true, data: criticalResponse, isCritical: true });
    }

    // Step 1: Fetch from FDA API
    const symptomQuery = encodeURIComponent(symptoms.join(" OR "));
    let fdaInfo = [];
    const maxRetries = 3;
    for (let attempt = 1; attempt <= maxRetries; attempt++) {
      try {
        const fdaResponse = await axios.get(`${FDA_API_URL}?search=indications_and_usage:(${symptomQuery})+openfda.route:ORAL&limit=10`, { timeout: 10000 });
        if (fdaResponse.data.results) {
          fdaInfo = fdaResponse.data.results.map(result => ({
            name: result.openfda?.brand_name?.[0] || result.openfda?.generic_name?.[0] || "Generic",
            indications: result.indications_and_usage?.[0] || "",
            dosage: result.dosage_and_administration?.[0] || "",
            warnings: result.warnings?.[0] || "",
            precautions: result.precautions?.[0] || "",
            contraindications: result.contraindications?.[0] || "",
            adverse_reactions: result.adverse_reactions?.[0] || "",
            how_supplied: result.how_supplied?.[0] || "",
            administration: result.dosage_and_administration?.[0] || ""
          }));
          break;
        }
      } catch (err) {
        console.warn(`FDA attempt ${attempt} failed:`, err.message);
      }
    }

    // Step 2: Prepare patient info for AI
    const patientInfo = `
Patient: ${name}, Age: ${age}, Gender: ${gender}, Weight: ${weight}kg, Height: ${height}cm, Blood Group: ${bloodGroup}
Symptoms: ${symptoms.join(', ')}
Allergies: ${allergies.join(', ')}
Medical History: ${medicalHistory}
Current Meds: ${currentMedications}
Pregnant: ${isPregnant}, Breastfeeding: ${isBreastfeeding}

FDA Data: ${JSON.stringify(fdaInfo)}
    `;

    // System prompt (synced with hook)
    const systemPrompt = `You are Dr. MediNova. Analyze patient info and FDA data for safe OTC suggestions. Format as: ✅ Reasoning, ✅ OTC Medications (bullet points: Name - Dosage - Timing - Precautions - Source), 🏠 Home Remedies, ⚠️ Warnings, ⏳ Duration, 🚨 Doctor Disclaimer. Limit to 2 meds.`;

    // Step 3: Call AIs in parallel
    const [openRouterRes, geminiRes] = await Promise.allSettled([
      axios.post("https://openrouter.ai/api/v1/chat/completions", {
        model: "openai/gpt-3.5-turbo",
        messages: [{ role: "system", content: systemPrompt }, { role: "user", content: patientInfo }],
        max_tokens: 1500,
        temperature: 0.7
      }, { headers: { Authorization: `Bearer ${OPENROUTER_API_KEY}` }, timeout: 10000 }),
      axios.post(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash-latest:generateContent?key=${GEMINI_API_KEY}`, {
        contents: [{ parts: [{ text: systemPrompt + "\n" + patientInfo }] }]
      }, { timeout: 10000 })
    ]);

    let aiText = '';
    if (openRouterRes.status === 'fulfilled' && openRouterRes.value.data.choices) {
      aiText += openRouterRes.value.data.choices[0].message.content;
    }
    if (geminiRes.status === 'fulfilled' && geminiRes.value.data.candidates) {
      aiText += '\n' + geminiRes.value.data.candidates[0].content.parts[0].text;
    }

    let aiResponse = parseAIResponse(aiText) || null;

    // Fallback if AI fails
    if (!aiResponse || !aiResponse.otcMedications.length) {
      aiResponse = {
        reasoning: `Dear ${name}, based on symptoms (${symptoms.join(", ")}), here are common OTC options.`,
        otcMedications: [], // Use FDA or empty
        homeRemedies: ["Rest and hydrate."],
        warnings: ["Consult doctor if persists."],
        duration: "3-5 days.",
        disclaimer: "Not medical advice."
      };
    }

    // Step 4: Add images, sanitize, check interactions
    for (const med of aiResponse.otcMedications) {
      med.image = await fetchMedicineImage(med.name);
    }
    aiResponse.otcMedications = checkDrugInteractions(aiResponse.otcMedications, currentMedications, allergies);
    aiResponse.otcMedications = sanitizeSuggestions(aiResponse.otcMedications, allergies);

    res.json({ success: true, data: aiResponse });
  } catch (error) {
    console.error("Analysis error:", error);
    res.status(500).json({ success: false, error: "Server error." });
  }
});

export default router;