"use client";

import { useState, useRef, useEffect } from "react";
import axios from "axios";

// Constants (moved from original component)
const criticalSymptoms = [
  "Can't breathe well", "Chest hurts", "Feeling dizzy", "Throwing up",
];

const NLM_SYMPTOM_API = "https://clinicaltables.nlm.nih.gov/api/hpo/v3/search";
const RXNAV_ALLERGY_API = "https://rxnav.nlm.nih.gov/REST/approx.json";
const OPENI_API_BASE = "https://openi.nlm.nih.gov/api/search";
const fdaUrl = import.meta.env.VITE_FDA_API_URL || "https://api.fda.gov/drug/label.json";
const CONSULTATION_LINK = "https://www.mednova.com/consultation";

const fallbackSymptoms = [
  "Fever", "Cough", "Headache", "Sore throat", "Fatigue", "Nausea", "Dizziness",
  "Shortness of breath", "Muscle pain", "Loss of taste or smell", "Runny nose",
  "Body aches", "Chills", "Diarrhea", "Vomiting", "Chest pain", "Sneezing", "Congestion",
];

const fallbackAllergies = [
  "Penicillin", "Aspirin", "Ibuprofen", "Sulfa drugs", "Latex", "Peanuts",
  "Tree nuts", "Shellfish", "Eggs", "Milk", "Soy", "Wheat", "Fish",
  "Pollen", "Dust mites", "Mold", "Pet dander",
];

const fallbackMedications = {
  "headache": [
    { name: "Acetaminophen", dosage: "500mg every 4-6 hours", timing: "Take with water", precautions: "Avoid alcohol", source: "Available at CVS, Walgreens" },
    { name: "Ibuprofen", dosage: "200mg every 4-6 hours", timing: "Take with food", precautions: "Avoid if allergic to NSAIDs", source: "Available at CVS, Walgreens" },
  ],
  "sore throat": [
    { name: "Chloraseptic Spray", dosage: "Spray 5 times every 2 hours", timing: "Spray directly on throat", precautions: "Do not swallow", source: "Available at pharmacies" },
    { name: "Acetaminophen", dosage: "500mg every 4-6 hours", timing: "Take with water", precautions: "Avoid alcohol", source: "Available at CVS, Walgreens" },
  ],
  "fever": [
    { name: "Acetaminophen", dosage: "500mg every 4-6 hours", timing: "Take with water", precautions: "Avoid alcohol", source: "Available at CVS, Walgreens" },
    { name: "Ibuprofen", dosage: "200mg every 4-6 hours", timing: "Take with food", precautions: "Avoid if allergic to NSAIDs", source: "Available at CVS, Walgreens" },
  ],
  "cough": [
    { name: "Dextromethorphan", dosage: "10-20mg every 4 hours", timing: "Take with water", precautions: "Avoid with MAOIs", source: "Available at pharmacies" },
    { name: "Guaifenesin", dosage: "200-400mg every 4 hours", timing: "Take with water", precautions: "Drink plenty of fluids", source: "Available at pharmacies" },
  ],
  "migraine": [
    { name: "Ibuprofen", dosage: "400mg at onset", timing: "Take with food", precautions: "Avoid if allergic to NSAIDs", source: "Available at CVS, Walgreens" },
    { name: "Acetaminophen", dosage: "1000mg at onset", timing: "Take with water", precautions: "Avoid alcohol", source: "Available at CVS, Walgreens" },
  ],
};

const suggestionCache = new Map();

// Helper functions
const simplifyMedicalTerms = (term) => {
  const termMap = {
    "Dyspnea": "Shortness of breath",
    "Thoracic pain": "Chest pain",
    "Vertigo": "Dizziness",
    "Vomiting": "Vomiting",
    "Pyrexia": "Fever",
    "Cough": "Cough",
    "Headache": "Headache",
    "Nasal congestion": "Congestion",
    "Fatigue": "Fatigue",
    "Myalgia": "Muscle pain",
    "Arthralgia": "Joint pain",
    "Pharyngitis": "Sore throat",
    "Nausea": "Nausea",
    "Anosmia": "Loss of smell",
    "Ageusia": "Loss of taste",
    "Rhinorrhea": "Runny nose",
    "Chills": "Chills",
    "Diarrhea": "Diarrhea",
    "Sneezing": "Sneezing",
  };
  return termMap[term] || term.replace(/ [ (].*?[ )]/g, "").replace(/medical|syndrome|disorder|abnormality/gi, "").trim();
};

async function fetchMedicineImage(medicineName) {
  try {
    const query = encodeURIComponent(`${medicineName} pill`);
    const apiUrl = `${OPENI_API_BASE}?query=${query}&m=1&n=1`;
    const response = await fetch(`https://api.allorigins.win/raw?url=${encodeURIComponent(apiUrl)}`);
    if (!response.ok) throw new Error("Open-i API request failed");
    const data = await response.json();
    if (data.list && data.list.length > 0) return `https://openi.nlm.nih.gov${data.list[0].imgLarge}`;
    return "https://images.unsplash.com/photo-1587855726752-62b3629bd00e?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&q=80";
  } catch (error) {
    console.error("Error fetching medicine image:", error);
    return "https://images.unsplash.com/photo-1587855726752-62b3629bd00e?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&q=80";
  }
}

function calculateAge(dob) {
  if (!dob) return '';
  const birthDate = new Date(dob);
  const today = new Date();
  let age = today.getFullYear() - birthDate.getFullYear();
  const monthDiff = today.getMonth() - birthDate.getMonth();
  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) age--;
  return age;
}

// Custom hook for AI logic
export const useMediBotAI = () => {
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [suggestions, setSuggestions] = useState(null);
  const [isExtreme, setIsExtreme] = useState(false);

  const openRouterKey = import.meta.env.VITE_OPENROUTER_API_KEY;
  const geminiKey = import.meta.env.VITE_GEMINI_API_KEY;

  // Debounce function
  const debounce = (func, wait) => {
    let timeout;
    return (...args) => {
      clearTimeout(timeout);
      timeout = setTimeout(() => func(...args), wait);
    };
  };

  // Fetch suggestions for symptoms/allergies
  const fetchSuggestions = async (query, setSuggestionsFunc, isAllergy = false) => {
    if (!query.trim()) {
      setSuggestionsFunc([]);
      return;
    }

    const cacheKey = `${isAllergy ? "allergy" : "symptom"}:${query.toLowerCase()}`;
    if (suggestionCache.has(cacheKey)) {
      setSuggestionsFunc(suggestionCache.get(cacheKey));
      return;
    }

    try {
      let apiUrl = isAllergy
        ? `${RXNAV_ALLERGY_API}?term=${encodeURIComponent(query)}&maxEntries=50`
        : `${NLM_SYMPTOM_API}?terms=${encodeURIComponent(query)}&maxList=50`;
      const proxyUrl = `https://api.allorigins.win/raw?url=${encodeURIComponent(apiUrl)}`;
      const response = await fetch(proxyUrl, { signal: AbortSignal.timeout(5000) });
      if (!response.ok) throw new Error(`API request failed with status ${response.status}`);
      const data = await response.json();

      let simplifiedLabels = [];
      if (isAllergy) {
        const candidates = data.approxGroup?.candidate || [];
        simplifiedLabels = candidates
          .map((c) => c.name)
          .filter((label, index, self) => self.indexOf(label) === index);
      } else {
        const labels = data[3] || [];
        simplifiedLabels = labels
          .map((item) => simplifyMedicalTerms(item[1]))
          .filter((label, index, self) => self.indexOf(label) === index);
      }

      suggestionCache.set(cacheKey, simplifiedLabels);
      setSuggestionsFunc(simplifiedLabels);
    } catch (error) {
      console.error(`Error fetching ${isAllergy ? "allergies" : "symptoms"}:`, error);
      const fallback = isAllergy ? fallbackAllergies : fallbackSymptoms;
      const filteredFallback = fallback
        .filter((item) => item.toLowerCase().includes(query.toLowerCase()));
      suggestionCache.set(cacheKey, filteredFallback);
      setSuggestionsFunc(filteredFallback);
    }
  };

  const debouncedFetchSuggestions = debounce(fetchSuggestions, 300);

  // Check drug interactions
  const checkDrugInteractions = (medications, currentMeds, allergies) => {
    const currentMedList = currentMeds.toLowerCase().split(",").map((med) => med.trim());
    const knownInteractions = {
      ibuprofen: ["aspirin", "anticoagulants"],
      pseudoephedrine: ["maoi", "antidepressants"],
      acetaminophen: ["warfarin"],
      diphenhydramine: ["alcohol", "sedatives"],
    };

    return medications.filter((med) => {
      const medName = med.name.toLowerCase();
      if (allergies.some(a => a.toLowerCase() === medName)) return false;
      const interactions = knownInteractions[medName] || [];
      return !currentMedList.some((currentMed) =>
        interactions.some((interactingDrug) => currentMed.includes(interactingDrug))
      );
    });
  };

  // Sanitize suggestions
  const sanitizeSuggestions = (medications, allergies) => {
    const seen = new Set();
    return medications.filter((med) => {
      const medName = med.name.toLowerCase();
      if (seen.has(medName) || allergies.some(a => a.toLowerCase() === medName)) return false;
      seen.add(medName);
      return true;
    }).slice(0, 2);
  };

  // Parse AI response
  const parseAIResponse = (text) => {
    const lines = text.split("\n").filter((line) => line.trim());
    const parsed = {
      reasoning: "",
      otcMedications: [],
      homeRemedies: [],
      warnings: [],
      duration: "",
      disclaimer: "",
    };
    let currentSection = "";
    lines.forEach((line) => {
      if (line.startsWith("✅ Reasoning")) currentSection = "reasoning";
      else if (line.startsWith("✅ OTC Medications")) currentSection = "otcMedications";
      else if (line.startsWith("🏠 Home Remedies / Lifestyle")) currentSection = "homeRemedies";
      else if (line.startsWith("⚠️ Warnings / Avoid")) currentSection = "warnings";
      else if (line.startsWith("⏳ Duration Guidance")) currentSection = "duration";
      else if (line.startsWith("🚨 Doctor Disclaimer")) currentSection = "disclaimer";
      else if (line.trim() && currentSection) {
        if (currentSection === "otcMedications") {
          const parts = line.replace(/^- /, "").split(" - ");
          if (parts.length >= 4) {
            parsed.otcMedications.push({
              name: parts[0].trim(),
              dosage: parts[1].trim(),
              timing: parts[2].trim(),
              precautions: parts[3].trim(),
              source: parts[4] ? parts[4].trim() : "Available at pharmacies like CVS, Walgreens",
            });
          }
        } else if (currentSection === "homeRemedies" || currentSection === "warnings") {
          if (!parsed[currentSection].includes(line.replace(/^- /, ""))) parsed[currentSection].push(line.replace(/^- /, ""));
        } else {
          parsed[currentSection] += (parsed[currentSection] ? " " : "") + line.trim();
        }
      }
    });
    return parsed;
  };

  // Main function to process symptoms and get AI suggestions
  const processSymptoms = async (formData, isPregnant, isBreastfeeding) => {
    if (!formData.symptoms.length) {
      setErrorMessage("Please select at least one symptom to proceed, dear " + formData.name + ".");
      return;
    }
    if (!formData.name.trim()) {
      setErrorMessage("Please provide your name to receive personalized suggestions, dear user.");
      return;
    }
    if (!openRouterKey || !geminiKey) {
      setErrorMessage("API key is missing. Please ensure VITE_OPENROUTER_API_KEY and VITE_GEMINI_API_KEY are set in your environment.");
      return;
    }
    
    setErrorMessage("");
    setLoading(true);
    setSuggestions(null);
    setIsExtreme(false);

    try {
      const symptomQuery = encodeURIComponent(formData.symptoms.map(s => {
        const synonyms = {
          "Headache": "headache pain",
          "Sore throat": "pharyngitis throat pain",
          "Fever": "pyrexia elevated temperature",
          "Cough": "cough respiratory irritation",
          "Migraine": "migraine headache",
        };
        return synonyms[s] || s;
      }).join(" OR "));
      if (!symptomQuery) throw new Error("No symptoms provided.");

      const hasCriticalSymptom = formData.symptoms.some((symptom) =>
        criticalSymptoms.includes(symptom)
      );
      if (hasCriticalSymptom) {
        const criticalResponse = {
          reasoning: `Dear ${formData.name}, your symptoms, such as difficulty breathing or chest pain, are serious and require immediate medical attention.`,
          otcMedications: [],
          homeRemedies: ["Rest and stay hydrated while awaiting medical care."],
          warnings: ["These symptoms may indicate a serious condition. Seek medical help immediately."],
          duration: "Contact a healthcare professional as soon as possible.",
          disclaimer: `Dear ${formData.name}, this information is not medical advice. Please consult a doctor immediately for proper diagnosis and treatment. Book a consultation here: ${CONSULTATION_LINK}`,
        };
        setSuggestions(criticalResponse);
        setIsExtreme(true);
        setLoading(false);
        return;
      }

      let fdaInfo = [];
      const maxRetries = 3;
      let fdaSuccess = false;
      for (let attempt = 1; attempt <= maxRetries; attempt++) {
        try {
          const fdaFullUrl = `${fdaUrl}?search=indications_and_usage:(${symptomQuery})+openfda.route:ORAL&limit=10`;
          const response = await fetch(fdaFullUrl, { signal: AbortSignal.timeout(5000) });
          if (!response.ok) throw new Error(`FDA API error: ${response.status}`);
          const fdaData = await response.json();
          if (fdaData?.results?.length > 0) {
            fdaInfo = fdaData.results.map((result) => ({
              name: result.openfda?.brand_name?.[0] || result.openfda?.generic_name?.[0] || "Generic",
              indications: result.indications_and_usage?.[0] || "No indications available",
              dosage: result.dosage_and_administration?.[0] || "Follow standard guidelines",
              warnings: result.warnings?.[0] || "No specific warnings available",
              precautions: result.precautions?.[0] || "No precautions available",
              contraindications: result.contraindications?.[0] || "No contraindications available",
              adverse_reactions: result.adverse_reactions?.[0] || "No adverse reactions available",
              how_supplied: result.how_supplied?.[0] || "No supply information available",
              administration: result.dosage_and_administration?.[0] || "No administration details available",
              image: "https://images.unsplash.com/photo-1587855726752-62b3629bd00e?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&q=80",
            }));
            fdaSuccess = true;
          }
          break;
        } catch (error) {
          console.error(`FDA API attempt ${attempt} failed:`, error);
          await new Promise((resolve) => setTimeout(resolve, 1000));
        }
      }

      let parsedSuggestions;
      if (!fdaSuccess) {
        const applicableMeds = formData.symptoms
          .filter((symptom) => fallbackMedications[symptom.toLowerCase()])
          .flatMap((symptom) => fallbackMedications[symptom.toLowerCase()]);
        if (applicableMeds.length > 0) {
          parsedSuggestions = {
            reasoning: `Dear ${formData.name}, we couldn't find FDA data for your symptoms, but based on common medical practice, here are safe OTC options for your condition.`,
            otcMedications: checkDrugInteractions(applicableMeds, formData.currentMedications, formData.allergies),
            homeRemedies: ["Stay hydrated", "Rest adequately", "Maintain a balanced diet"],
            warnings: ["Avoid if allergic to listed medications", "Check with a pharmacist if unsure"],
            duration: "Use for up to 3 days; consult a doctor if symptoms persist.",
            disclaimer: `Dear ${formData.name}, this is not medical advice. Please consult a doctor for proper diagnosis. Book a consultation here: ${CONSULTATION_LINK}`,
          };
        } else {
          parsedSuggestions = {
            reasoning: `Dear ${formData.name}, your symptoms seem uncommon, and we couldn't find matching FDA-approved OTC options. This may indicate a need for professional medical evaluation.`,
            otcMedications: [],
            homeRemedies: ["Stay hydrated and rest until you can see a doctor."],
            warnings: ["Do not self-medicate without advice; symptoms could be serious."],
            duration: "Seek immediate consultation.",
            disclaimer: `Dear ${formData.name}, this is not medical advice. Please consult a doctor for proper diagnosis. Book a consultation here: ${CONSULTATION_LINK}`,
          };
        }
      } else {
        const patientInfo = `
Patient Info:
- Name: ${formData.name}
- Age: ${formData.age}
- Gender: ${formData.gender}
- Weight: ${formData.weight} kg
- Height: ${formData.height} cm
- Blood Group: ${formData.bloodGroup}
- Symptoms: ${formData.symptoms.join(", ") || "None"}
- Allergies: ${formData.allergies.join(", ") || "None"}
- Medical History: ${formData.medicalHistory || "None"}
- Current Medications: ${formData.currentMedications || "None"}
- Pregnancy Status: ${isPregnant ? "Pregnant" : "Not pregnant"}
- Breastfeeding Status: ${isBreastfeeding ? "Breastfeeding" : "Not breastfeeding"}

FDA Data:
${JSON.stringify(fdaInfo, null, 2)}
        `;

        const systemPrompt = `
You are an experienced, compassionate human doctor specializing in general medicine. Act like a real doctor: think step by step, analyze the patient's full profile (age, gender, weight, height, blood group, symptoms, allergies, history, current meds, pregnancy, breastfeeding), cross-reference with FDA data for accurate, safe OTC recommendations. Provide empathetic, personalized advice as if in a consultation. Suggest exactly one primary and one alternative OTC medication if possible, using FDA details for doses, timing, etc. NEVER suggest prescription drugs. Always emphasize consulting a professional.

Use ALL FDA data to inform suggestions: extract and adapt indications, dosage, administration, warnings, precautions, contraindications, adverse reactions. Reason step-by-step based on patient profile and FDA/fallback data. Use simple, accessible language.

If symptoms/allergies are rare or no matching data, respond with reasoning like 'Your symptoms seem uncommon; please see a doctor' and include link ${CONSULTATION_LINK} in disclaimer, with no meds.

Strict format:
✅ Reasoning (Step-by-step analysis of patient info, symptoms, FDA data, why suggestions fit. Empathetic tone.)
✅ OTC Medications (Exactly 2: primary and alternative, with:
- Name - Dosage - Timing and Administration - Precautions - Source)
🏠 Home Remedies / Lifestyle (2-3 tailored tips)
⚠️ Warnings / Avoid (Based on allergies, history, FDA)
⏳ Duration Guidance (Based on FDA/standard)
🚨 Doctor Disclaimer (Consult doctor; not advice)

Rules:
- Primary: First-line safe option; Alternative: Backup if primary unsuitable.
- Ensure safety: e.g., no acetaminophen for liver issues, no ibuprofen in pregnancy, age <18 no aspirin.
- Check interactions with current meds/allergies.
- Empathetic, humble tone; address by name.
- Base strictly on provided data; no inventions.
        `;

        // Run both models in parallel using Promise.all
        const [openRouterResponse, geminiResponse] = await Promise.all([
          fetch("https://openrouter.ai/api/v1/chat/completions", {
            method: "POST",
            headers: {
              Authorization: `Bearer ${openRouterKey}`,
              "Content-Type": "application/json",
              "HTTP-Referer": "https://www.mednova.com",
              "X-Title": "MediNova",
            },
            body: JSON.stringify({
              model: "openai/gpt-4o-mini",
              messages: [
                { role: "system", content: systemPrompt },
                { role: "user", content: patientInfo },
              ],
              max_tokens: 2000,
              temperature: 0.7,
            }),
          }).then(res => {
            if (!res.ok) throw new Error(`OpenRouter API error: ${res.status}`);
            return res.json();
          }),
          fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash-latest:generateContent?key=${geminiKey}`, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              contents: [
                {
                  parts: [
                    { text: systemPrompt + "\n\n" + patientInfo }
                  ]
                }
              ]
            }),
          }).then(res => {
            if (!res.ok) throw new Error(`Gemini API error: ${res.status}`);
            return res.json();
          })
        ]);

        let openRouterText = openRouterResponse.choices?.[0]?.message?.content || "";
        let geminiText = geminiResponse.candidates?.[0]?.content?.parts?.[0]?.text || "";

        if (!openRouterText && !geminiText) throw new Error("No response received from either AI.");

        // Parse both and combine
        const parsedOpenRouter = openRouterText ? parseAIResponse(openRouterText) : { otcMedications: [], homeRemedies: [], warnings: [] };
        const parsedGemini = geminiText ? parseAIResponse(geminiText) : { otcMedications: [], homeRemedies: [], warnings: [] };

        parsedSuggestions = {
          reasoning: [parsedOpenRouter.reasoning, parsedGemini.reasoning].filter(Boolean).join("\n\n") || "Combined analysis from AI models.",
          otcMedications: [...parsedOpenRouter.otcMedications, ...parsedGemini.otcMedications],
          homeRemedies: [...new Set([...parsedOpenRouter.homeRemedies, ...parsedGemini.homeRemedies])],
          warnings: [...new Set([...parsedOpenRouter.warnings, ...parsedGemini.warnings])],
          duration: parsedOpenRouter.duration || parsedGemini.duration || "Follow guidelines provided.",
          disclaimer: parsedOpenRouter.disclaimer || parsedGemini.disclaimer || `Dear ${formData.name}, this is not medical advice. Please consult a doctor for proper diagnosis. Book a consultation here: ${CONSULTATION_LINK}`,
        };

        parsedSuggestions.otcMedications = sanitizeSuggestions(parsedSuggestions.otcMedications, formData.allergies);
        parsedSuggestions.otcMedications = checkDrugInteractions(
          parsedSuggestions.otcMedications,
          formData.currentMedications,
          formData.allergies
        );
      }

      for (let med of parsedSuggestions.otcMedications) {
        med.image = await fetchMedicineImage(med.name);
      }

      setSuggestions(parsedSuggestions);
      if (parsedSuggestions.otcMedications.length === 0 || parsedSuggestions.reasoning.toLowerCase().includes("uncommon") || parsedSuggestions.reasoning.toLowerCase().includes("extreme") || parsedSuggestions.reasoning.toLowerCase().includes("rare")) {
        setIsExtreme(true);
      } else {
        setIsExtreme(false);
      }
    } catch (error) {
      console.error("Error in processSymptoms:", error);
      setErrorMessage(`Dear ${formData.name}, an error occurred while fetching suggestions. Please try again or consult a doctor at ${CONSULTATION_LINK}.`);
    } finally {
      setLoading(false);
    }
  };

  // Text-to-speech functions
  const handleSpeak = (text, formData, setIsSpeaking) => {
    if ("speechSynthesis" in window) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = "en";
      utterance.volume = 1.0;
      utterance.rate = 0.9;
      utterance.pitch = 1.0;

      const voices = window.speechSynthesis.getVoices();
      utterance.voice = voices[0];

      utterance.onstart = () => setIsSpeaking(true);
      utterance.onend = () => setIsSpeaking(false);
      utterance.onerror = (e) => {
        setErrorMessage(`Speech error: ${e.error}. Try a different language or browser, dear ${formData.name}.`);
        setIsSpeaking(false);
      };
      window.speechSynthesis.speak(utterance);
    } else {
      setErrorMessage("Text-to-speech is not supported in this browser, dear " + formData.name + ".");
    }
  };

  const handleCancelSpeak = (setIsSpeaking) => {
    if ("speechSynthesis" in window) window.speechSynthesis.cancel();
    setIsSpeaking(false);
  };

  // Get full text for speech/download
  const getFullText = (sugs, formData, isPregnant, isBreastfeeding) => {
    let text = `Medicine Suggestion Report\n\n`;
    text += `Patient Information:\n`;
    text += `Name: ${formData.name}\n`;
    text += `Age: ${formData.age || "Not provided"}\n`;
    text += `Gender: ${formData.gender || "Not provided"}\n`;
    if (formData.gender === "female") {
      text += `Pregnancy Status: ${isPregnant ? "Pregnant" : "Not Pregnant"}\n`;
      if (isPregnant) {
        text += `Breastfeeding Status: ${isBreastfeeding ? "Breastfeeding" : "Not Breastfeeding"}\n`;
      }
    }
    text += `Weight: ${formData.weight ? `${formData.weight} kg` : "Not provided"}\n`;
    text += `Height: ${formData.height ? `${formData.height} cm` : "Not provided"}\n`;
    text += `Blood Group: ${formData.bloodGroup || "Not provided"}\n`;
    text += `Symptoms: ${formData.symptoms.length > 0 ? formData.symptoms.join(", ") : "None selected"}\n`;
    text += `Allergies: ${formData.allergies.length > 0 ? formData.allergies.join(", ") : "None selected"}\n`;
    text += `Medical History: ${formData.medicalHistory || "Not provided"}\n`;
    text += `Current Medications: ${formData.currentMedications || "Not provided"}\n\n`;

    text += `Suggestions:\n\n`;
    if (sugs?.reasoning) text += `Reasoning:\n${sugs.reasoning}\n\n`;
    if (sugs?.otcMedications?.length > 0) text += `OTC Medications:\n${sugs.otcMedications.map(med => `${med.name} - ${med.dosage} - ${med.timing} - ${med.precautions} - ${med.source}`).join("\n")}\n\n`;
    if (sugs?.homeRemedies?.length > 0) text += `Home Remedies / Lifestyle:\n${sugs.homeRemedies.join("\n")}\n\n`;
    if (sugs?.warnings?.length > 0) text += `Warnings / Avoid:\n${sugs.warnings.join("\n")}\n\n`;
    if (sugs?.duration) text += `Duration Guidance:\n${sugs.duration}\n\n`;
    if (sugs?.disclaimer) text += `Doctor Disclaimer:\n${sugs.disclaimer}`;
    return text;
  };

  return {
    loading,
    errorMessage,
    suggestions,
    isExtreme,
    processSymptoms,
    debouncedFetchSuggestions,
    fetchSuggestions,
    handleSpeak,
    handleCancelSpeak,
    getFullText,
    calculateAge
  };
};

export default useMediBotAI;