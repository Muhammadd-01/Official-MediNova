"use client";

import { useState, useContext, useEffect, useRef } from "react";
import { Helmet } from "react-helmet-async";
import { motion, AnimatePresence } from "framer-motion";
import { AlertCircle, ChevronDown, ChevronUp, Pill, Clock, Globe, Volume2, X, Search } from "lucide-react";
import { DarkModeContext } from "../App";

const criticalSymptoms = [
  "Can't breathe well", "Chest hurts", "Feeling dizzy", "Throwing up",
];

const languages = [
  { code: "en", name: "English" },
  { code: "es", name: "Spanish" },
  { code: "fr", name: "French" },
  { code: "ar", name: "Arabic" },
  { code: "de", name: "German" },
  { code: "it", name: "Italian" },
  { code: "pt", name: "Portuguese" },
  { code: "ru", name: "Russian" },
  { code: "zh", name: "Chinese" },
  { code: "ja", name: "Japanese" },
  { code: "ko", name: "Korean" },
  { code: "hi", name: "Hindi" },
  { code: "bn", name: "Bengali" },
  { code: "ur", name: "Urdu" },
  { code: "tr", name: "Turkish" },
];

const NLM_SYMPTOM_API = "https://clinicaltables.nlm.nih.gov/api/hpo/v3/search";
const RXNAV_ALLERGY_API = "https://rxnav.nlm.nih.gov/REST/approx.json";
const OPENI_API_BASE = "https://openi.nlm.nih.gov/api/search";
const fdaUrl = import.meta.env.VITE_FDA_API_URL || "https://api.fda.gov/drug/label.json";
const CONSULTATION_LINK = "https://www.mednova.com/consultation";

// Fallback lists in plain language
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

// Fallback medications for common symptoms
const fallbackMedications = {
  "Headache": [
    { name: "Acetaminophen", dosage: "500mg every 4-6 hours", timing: "Take with water", precautions: "Avoid alcohol", source: "Available at CVS, Walgreens" },
    { name: "Ibuprofen", dosage: "200mg every 4-6 hours", timing: "Take with food", precautions: "Avoid if allergic to NSAIDs", source: "Available at CVS, Walgreens" },
  ],
  "Sore throat": [
    { name: "Chloraseptic Spray", dosage: "Spray 5 times every 2 hours", timing: "Spray directly on throat", precautions: "Do not swallow", source: "Available at pharmacies" },
    { name: "Acetaminophen", dosage: "500mg every 4-6 hours", timing: "Take with water", precautions: "Avoid alcohol", source: "Available at CVS, Walgreens" },
  ],
  "Fever": [
    { name: "Acetaminophen", dosage: "500mg every 4-6 hours", timing: "Take with water", precautions: "Avoid alcohol", source: "Available at CVS, Walgreens" },
    { name: "Ibuprofen", dosage: "200mg every 4-6 hours", timing: "Take with food", precautions: "Avoid if allergic to NSAIDs", source: "Available at CVS, Walgreens" },
  ],
  "Cough": [
    { name: "Dextromethorphan", dosage: "10-20mg every 4 hours", timing: "Take with water", precautions: "Avoid with MAOIs", source: "Available at pharmacies" },
    { name: "Guaifenesin", dosage: "200-400mg every 4 hours", timing: "Take with water", precautions: "Drink plenty of fluids", source: "Available at pharmacies" },
  ],
};

// Cache for suggestions
const suggestionCache = new Map();

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
    if (!response.ok) {
      throw new Error("Open-i API request failed");
    }
    const data = await response.json();
    if (data.list && data.list.length > 0) {
      const imgPath = data.list[0].imgLarge;
      return `https://openi.nlm.nih.gov${imgPath}`;
    }
    return "https://images.unsplash.com/photo-1587855726752-62b3629bd00e?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&q=80";
  } catch (error) {
    console.error("Error fetching medicine image:", error);
    return "https://images.unsplash.com/photo-1587855726752-62b3629bd00e?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&q=80";
  }
}

function MedicineSuggestion() {
  const [formData, setFormData] = useState({
    name: "",
    age: "",
    gender: "",
    weight: "",
    height: "",
    bloodGroup: "",
    symptoms: [],
    allergies: [],
    medicalHistory: "",
    currentMedications: "",
  });
  const [suggestions, setSuggestions] = useState(null);
  const [translatedSuggestions, setTranslatedSuggestions] = useState(null);
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const { darkMode } = useContext(DarkModeContext);
  const [isPregnant, setIsPregnant] = useState(false);
  const [isBreastfeeding, setIsBreastfeeding] = useState(false);
  const [selectedLanguage, setSelectedLanguage] = useState("en");
  const [isTranslating, setIsTranslating] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [symptomSearch, setSymptomSearch] = useState("");
  const [allergySearch, setAllergySearch] = useState("");
  const [symptomSuggestions, setSymptomSuggestions] = useState([]);
  const [allergySuggestions, setAllergySuggestions] = useState([]);
  const [isFetchingSymptoms, setIsFetchingSymptoms] = useState(false);
  const [isFetchingAllergies, setIsFetchingAllergies] = useState(false);

  const openRouterKey = import.meta.env.VITE_OPENROUTER_API_KEY;
  const symptomSearchRef = useRef(null);
  const allergySearchRef = useRef(null);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    let updatedValue = value;

    if (name === "weight" && Number(value) > 500) {
      updatedValue = "500";
    } else if (name === "height" && Number(value) > 300) {
      updatedValue = "300";
    }

    if (name === "gender" && value === "male") {
      setIsPregnant(false);
      setIsBreastfeeding(false);
    }

    setFormData({ ...formData, [name]: updatedValue });
  };

  const debounce = (func, wait) => {
    let timeout;
    return (...args) => {
      clearTimeout(timeout);
      timeout = setTimeout(() => func(...args), wait);
    };
  };

  const fetchSuggestions = async (query, setSuggestionsFunc, isAllergy = false) => {
    if (query.trim() === "") {
      setSuggestionsFunc([]);
      return;
    }

    const cacheKey = `${isAllergy ? "allergy" : "symptom"}:${query.toLowerCase()}`;
    if (suggestionCache.has(cacheKey)) {
      setSuggestionsFunc(suggestionCache.get(cacheKey));
      return;
    }

    try {
      isAllergy ? setIsFetchingAllergies(true) : setIsFetchingSymptoms(true);
      let apiUrl = isAllergy
        ? `${RXNAV_ALLERGY_API}?term=${encodeURIComponent(query)}&maxEntries=50`
        : `${NLM_SYMPTOM_API}?terms=${encodeURIComponent(query)}&maxList=50`;
      const proxyUrl = `https://api.allorigins.win/raw?url=${encodeURIComponent(apiUrl)}`;
      const response = await fetch(proxyUrl, {
        signal: AbortSignal.timeout(5000),
      });
      if (!response.ok) {
        throw new Error(`API request failed with status ${response.status}`);
      }
      const data = await response.json();

      let simplifiedLabels = [];
      if (isAllergy) {
        const candidates = data.approxGroup?.candidate || [];
        simplifiedLabels = candidates
          .map((c) => c.name)
          .filter((label, index, self) => self.indexOf(label) === index && !formData.allergies.includes(label));
      } else {
        const labels = data[3] || [];
        simplifiedLabels = labels
          .map((item) => simplifyMedicalTerms(item[1]))
          .filter((label, index, self) => self.indexOf(label) === index && !formData.symptoms.includes(label));
      }

      suggestionCache.set(cacheKey, simplifiedLabels);
      setSuggestionsFunc(simplifiedLabels);
    } catch (error) {
      console.error(`Error fetching ${isAllergy ? "allergies" : "symptoms"}:`, error);
      const fallback = isAllergy ? fallbackAllergies : fallbackSymptoms;
      const filteredFallback = fallback
        .filter(
          (item) =>
            item.toLowerCase().includes(query.toLowerCase()) &&
            !formData[isAllergy ? "allergies" : "symptoms"].includes(item)
        );
      suggestionCache.set(cacheKey, filteredFallback);
      setSuggestionsFunc(filteredFallback);
    } finally {
      isAllergy ? setIsFetchingAllergies(false) : setIsFetchingSymptoms(false);
    }
  };

  const debouncedFetchSuggestions = debounce(fetchSuggestions, 300);

  useEffect(() => {
    debouncedFetchSuggestions(symptomSearch, setSymptomSuggestions, false);
  }, [symptomSearch]);

  useEffect(() => {
    debouncedFetchSuggestions(allergySearch, setAllergySuggestions, true);
  }, [allergySearch]);

  useEffect(() => {
    // Clear cache periodically to prevent stale data
    const interval = setInterval(() => {
      suggestionCache.clear();
    }, 30 * 60 * 1000); // Clear every 30 minutes
    return () => clearInterval(interval);
  }, []);

  const addItem = (item, category) => {
    if (!formData[category].includes(item)) {
      setFormData((prev) => ({ ...prev, [category]: [...prev[category], item] }));
    }
    if (category === "symptoms") {
      setSymptomSearch("");
      setSymptomSuggestions([]);
    } else {
      setAllergySearch("");
      setAllergySuggestions([]);
    }
  };

  const removeItem = (item, category) => {
    setFormData((prev) => ({ ...prev, [category]: prev[category].filter((i) => i !== item) }));
  };

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
      if (allergies.includes(medName)) return false;
      const interactions = knownInteractions[medName] || [];
      return !currentMedList.some((currentMed) =>
        interactions.some((interactingDrug) => currentMed.includes(interactingDrug))
      );
    });
  };

  const sanitizeSuggestions = (medications, allergies) => {
    const seen = new Set();
    return medications.filter((med) => {
      const medName = med.name.toLowerCase();
      if (seen.has(medName) || allergies.includes(medName)) {
        return false;
      }
      seen.add(medName);
      return true;
    }).slice(0, 2);
  };

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
          if (!parsed[currentSection].includes(line.replace(/^- /, ""))) {
            parsed[currentSection].push(line.replace(/^- /, ""));
          }
        } else {
          parsed[currentSection] += (parsed[currentSection] ? " " : "") + line.trim();
        }
      }
    });
    return parsed;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.symptoms.length) {
      setErrorMessage("Please select at least one symptom to proceed, dear " + formData.name + ".");
      return;
    }
    if (!formData.name.trim()) {
      setErrorMessage("Please provide your name to receive personalized suggestions, dear user.");
      return;
    }
    if (!openRouterKey) {
      setErrorMessage("API key is missing. Please ensure VITE_OPENROUTER_API_KEY is set in your environment.");
      return;
    }
    setErrorMessage("");
    setLoading(true);
    setSuggestions(null);
    setTranslatedSuggestions(null);

    try {
      const symptomQuery = encodeURIComponent(formData.symptoms.map(s => {
        const synonyms = {
          "Headache": "headache pain",
          "Sore throat": "pharyngitis throat pain",
          "Fever": "pyrexia elevated temperature",
          "Cough": "cough respiratory irritation",
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
        setTranslatedSuggestions(criticalResponse);
        setLoading(false);
        return;
      }

      let fdaInfo = [];
      const maxRetries = 3;
      let fdaSuccess = false;
      for (let attempt = 1; attempt <= maxRetries; attempt++) {
        try {
          const fdaFullUrl = `${fdaUrl}?search=indications_and_usage:(${symptomQuery})+openfda.route:ORAL&limit=10`;
          console.log("Fetching FDA data with URL:", fdaFullUrl);
          const response = await fetch(fdaFullUrl, { signal: AbortSignal.timeout(5000) });
          if (!response.ok) {
            throw new Error(`FDA API error: ${response.status}`);
          }
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
        // Use fallback medications for common symptoms
        const applicableMeds = formData.symptoms
          .filter((symptom) => fallbackMedications[symptom])
          .flatMap((symptom) => fallbackMedications[symptom]);
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
          // Rare case: No FDA or fallback data
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

        const openRouterResponse = await fetch(
          "https://openrouter.ai/api/v1/chat/completions",
          {
            method: "POST",
            headers: {
              Authorization: `Bearer ${openRouterKey}`,
              "Content-Type": "application/json",
              "HTTP-Referer": "https://www.mednova.com", // Added for OpenRouter rankings
              "X-Title": "MediNova", // Added for OpenRouter rankings
            },
            body: JSON.stringify({
              model: "x-ai/grok-code-fast-1",
              messages: [
                { role: "system", content: systemPrompt },
                { role: "user", content: patientInfo },
              ],
              max_tokens: 2000,
              temperature: 0.7,
            }),
          }
        );

        if (!openRouterResponse.ok) {
          throw new Error(`OpenRouter API error: ${openRouterResponse.status}`);
        }

        const openRouterData = await openRouterResponse.json();
        const openRouterText = openRouterData.choices?.[0]?.message?.content || "";
        if (!openRouterText) {
          throw new Error("No response received from Grok Code Fast 1.");
        }

        parsedSuggestions = parseAIResponse(openRouterText);
        parsedSuggestions.otcMedications = sanitizeSuggestions(parsedSuggestions.otcMedications, formData.allergies);
        parsedSuggestions.otcMedications = checkDrugInteractions(
          parsedSuggestions.otcMedications,
          formData.currentMedications,
          formData.allergies
        );
      }

      // Fetch images for each medication
      for (let med of parsedSuggestions.otcMedications) {
        med.image = await fetchMedicineImage(med.name);
      }

      setSuggestions(parsedSuggestions);
      setTranslatedSuggestions(parsedSuggestions);
      if (selectedLanguage !== "en") {
        await handleTranslate(parsedSuggestions);
      }
    } catch (error) {
      console.error("Error in handleSubmit:", error);
      setErrorMessage(`Dear ${formData.name}, an error occurred while fetching suggestions. Please try again or consult a doctor at ${CONSULTATION_LINK}.`);
    } finally {
      setLoading(false);
    }
  };

  const handleTranslate = async (sugs = suggestions) => {
    if (!sugs || selectedLanguage === "en") {
      setTranslatedSuggestions(sugs);
      return;
    }

    setIsTranslating(true);
    const maxRetries = 3;
    for (let attempt = 1; attempt <= maxRetries; attempt++) {
      try {
        const aiResponse = await fetch(
          "https://openrouter.ai/api/v1/chat/completions",
          {
            method: "POST",
            headers: {
              Authorization: `Bearer ${openRouterKey}`,
              "Content-Type": "application/json",
              "HTTP-Referer": "https://www.mednova.com",
              "X-Title": "MediNova",
            },
            body: JSON.stringify({
              model: "x-ai/grok-code-fast-1", // Use Grok for translation as well
              messages: [
                {
                  role: "system",
                  content: `
Translate the following medical suggestions into ${
                    languages.find((lang) => lang.code === selectedLanguage)?.name || "English"
                  } with high precision, using simple, non-medical language. Preserve the exact structure, formatting, and all sections (Reasoning, OTC Medications, Home Remedies, Warnings, Duration, Disclaimer). Address the patient by name (${formData.name}). Ensure translations are culturally appropriate and maintain the original meaning, reflecting care and humility.
                  `,
                },
                {
                  role: "user",
                  content: JSON.stringify(sugs, null, 2),
                },
              ],
            }),
          }
        );

        if (!aiResponse.ok) {
          throw new Error(`Translation API error: ${aiResponse.status}`);
        }

        const aiData = await aiResponse.json();
        const translatedText = aiData.choices[0]?.message.content || "Translation unavailable.";

        try {
          const parsedTranslated = JSON.parse(translatedText);
          setTranslatedSuggestions(parsedTranslated);
          break;
        } catch (error) {
          console.error("Error parsing translated JSON:", error);
          const parsedTranslated = parseAIResponse(translatedText);
          setTranslatedSuggestions(parsedTranslated);
          break;
        }
      } catch (error) {
        console.error("Translation error after retries:", error);
        await new Promise((resolve) => setTimeout(resolve, 1000));
      }
    }
    setIsTranslating(false);
  };

  const handleSpeak = (text) => {
    if ("speechSynthesis" in window) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = selectedLanguage;
      utterance.volume = 1.0;
      utterance.rate = 0.9;
      utterance.pitch = 1.0;

      const voices = window.speechSynthesis.getVoices();
      const matchingVoice = voices.find((voice) => voice.lang.startsWith(selectedLanguage));
      utterance.voice = matchingVoice || voices[0];

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

  const handleCancelSpeak = () => {
    if ("speechSynthesis" in window) {
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
    }
  };

  const getFullText = (sugs) => {
    let text = `Dear ${formData.name},\n\n`;
    if (sugs?.reasoning) text += `Reasoning:\n${sugs.reasoning}\n\n`;
    if (sugs?.otcMedications?.length > 0) text += `OTC Medications:\n${sugs.otcMedications.map(med => `${med.name} - ${med.dosage} - ${med.timing} - ${med.precautions} - ${med.source}`).join("\n")}\n\n`;
    if (sugs?.homeRemedies?.length > 0) text += `Home Remedies / Lifestyle:\n${sugs.homeRemedies.join("\n")}\n\n`;
    if (sugs?.warnings?.length > 0) text += `Warnings / Avoid:\n${sugs.warnings.join("\n")}\n\n`;
    if (sugs?.duration) text += `Duration Guidance:\n${sugs.duration}\n\n`;
    if (sugs?.disclaimer) text += `Doctor Disclaimer:\n${sugs.disclaimer}`;
    return text;
  };

  const textColor = darkMode ? "text-[#FDFBFB]" : "text-[#0A3D62]";
  const bgColor = darkMode ? "bg-[#0A2A43]" : "bg-gradient-to-br from-white to-gray-50";
  const inputBg = darkMode ? "bg-[#0A2A43]/80 text-[#FDFBFB] border-[#FDFBFB]/50" : "bg-gray-50 text-[#0A3D62] border-gray-200";

  return (
    <>
      <Helmet>
        <title>Medicine Suggestions - MediNova</title>
        <meta
          name="description"
          content="Receive personalized, safe, and FDA-informed OTC medication suggestions based on your symptoms."
        />
        <link
          rel="canonical"
          href="https://www.MediNova.com/medicine-suggestion"
        />
      </Helmet>

      <div className={`max-w-5xl mx-auto p-6 sm:p-8 ${textColor}`}>
        <motion.h1
          className="text-3xl sm:text-4xl font-bold mb-8 text-center bg-clip-text text-transparent bg-gradient-to-r from-[#0A3D62] to-blue-500"
          initial={{ opacity: 0, y: -30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
        >
          Personalized Medicine Suggestions
        </motion.h1>

        {errorMessage && (
          <motion.div
            className="mb-6 p-4 rounded-[40px] bg-red-100 text-red-700 shadow-md border border-red-200"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.3 }}
          >
            {errorMessage}
          </motion.div>
        )}

        <motion.form
          onSubmit={handleSubmit}
          className={`mb-10 space-y-8 p-6 sm:p-8 rounded-[40px] shadow-md ${bgColor} border border-gray-200 dark:border-gray-700 transition-all duration-300 hover:shadow-xl`}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label htmlFor="name" className={`block text-sm font-medium ${textColor}`}>
                Name:
              </label>
              <motion.input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                className={`w-full p-4 border rounded-xl ${inputBg} focus:outline-none focus:ring-2 focus:ring-[#0A3D62] dark:focus:ring-[#FDFBFB] transition-all duration-300`}
                required
                aria-required="true"
                whileFocus={{ scale: 1.02 }}
              />
            </div>
            <div className="space-y-2">
              <label htmlFor="age" className={`block text-sm font-medium ${textColor}`}>
                Age:
              </label>
              <motion.input
                type="number"
                id="age"
                name="age"
                value={formData.age}
                onChange={handleInputChange}
                className={`w-full p-4 border rounded-xl ${inputBg} focus:outline-none focus:ring-2 focus:ring-[#0A3D62] dark:focus:ring-[#FDFBFB] transition-all duration-300`}
                required
                min="0"
                max="120"
                aria-required="true"
                whileFocus={{ scale: 1.02 }}
              />
            </div>
            <div className="space-y-2">
              <label htmlFor="gender" className={`block text-sm font-medium ${textColor}`}>
                Gender:
              </label>
              <motion.div className="relative" whileFocus={{ scale: 1.02 }}>
                <motion.select
                  id="gender"
                  name="gender"
                  value={formData.gender}
                  onChange={handleInputChange}
                  className={`w-full p-4 border rounded-xl ${inputBg} focus:outline-none focus:ring-2 focus:ring-[#0A3D62] dark:focus:ring-[#FDFBFB] transition-all duration-300 appearance-none`}
                  required
                  aria-required="true"
                >
                  <option value="" disabled>Select gender</option>
                  <option value="male">Male</option>
                  <option value="female">Female</option>
                  <option value="other">Other</option>
                </motion.select>
                <ChevronDown className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 pointer-events-none" size={20} />
              </motion.div>
            </div>
            {formData.gender === "female" && (
              <div className="space-y-2 md:col-span-2">
                <label className={`block text-sm font-medium ${textColor}`}>
                  Pregnancy Status:
                </label>
                <div className="flex gap-6">
                  <div className="flex items-center">
                    <input
                      type="radio"
                      id="not-pregnant"
                      name="pregnancyStatus"
                      value="not-pregnant"
                      checked={!isPregnant}
                      onChange={() => setIsPregnant(false)}
                      className="mr-2 accent-[#0A3D62] w-5 h-5"
                      aria-checked={!isPregnant}
                    />
                    <label htmlFor="not-pregnant" className={textColor}>Not Pregnant</label>
                  </div>
                  <div className="flex items-center">
                    <input
                      type="radio"
                      id="pregnant"
                      name="pregnancyStatus"
                      value="pregnant"
                      checked={isPregnant}
                      onChange={() => setIsPregnant(true)}
                      className="mr-2 accent-[#0A3D62] w-5 h-5"
                      aria-checked={isPregnant}
                    />
                    <label htmlFor="pregnant" className={textColor}>Pregnant</label>
                  </div>
                </div>
              </div>
            )}
            {isPregnant && (
              <div className="space-y-2 md:col-span-2">
                <label className={`block text-sm font-medium ${textColor}`}>
                  Breastfeeding Status:
                </label>
                <div className="flex gap-6">
                  <div className="flex items-center">
                    <input
                      type="radio"
                      id="not-breastfeeding"
                      name="breastfeedingStatus"
                      value="not-breastfeeding"
                      checked={!isBreastfeeding}
                      onChange={() => setIsBreastfeeding(false)}
                      className="mr-2 accent-[#0A3D62] w-5 h-5"
                      aria-checked={!isBreastfeeding}
                    />
                    <label htmlFor="not-breastfeeding" className={textColor}>Not Breastfeeding</label>
                  </div>
                  <div className="flex items-center">
                    <input
                      type="radio"
                      id="breastfeeding"
                      name="breastfeedingStatus"
                      value="breastfeeding"
                      checked={isBreastfeeding}
                      onChange={() => setIsBreastfeeding(true)}
                      className="mr-2 accent-[#0A3D62] w-5 h-5"
                      aria-checked={isBreastfeeding}
                    />
                    <label htmlFor="breastfeeding" className={textColor}>Breastfeeding</label>
                  </div>
                </div>
              </div>
            )}
            <div className="space-y-2">
              <label htmlFor="weight" className={`block text-sm font-medium ${textColor}`}>
                Weight (kg):
              </label>
              <motion.input
                type="number"
                id="weight"
                name="weight"
                value={formData.weight}
                onChange={handleInputChange}
                className={`w-full p-4 border rounded-xl ${inputBg} focus:outline-none focus:ring-2 focus:ring-[#0A3D62] dark:focus:ring-[#FDFBFB] transition-all duration-300`}
                required
                min="1"
                max="500"
                aria-required="true"
                whileFocus={{ scale: 1.02 }}
              />
              {Number(formData.weight) > 500 && (
                <p className="text-red-500 text-sm mt-1">
                  Weight exceeds our database limit. Please consult a doctor.
                </p>
              )}
            </div>
            <div className="space-y-2">
              <label htmlFor="height" className={`block text-sm font-medium ${textColor}`}>
                Height (cm):
              </label>
              <motion.input
                type="number"
                id="height"
                name="height"
                value={formData.height}
                onChange={handleInputChange}
                className={`w-full p-4 border rounded-xl ${inputBg} focus:outline-none focus:ring-2 focus:ring-[#0A3D62] dark:focus:ring-[#FDFBFB] transition-all duration-300`}
                required
                min="1"
                max="300"
                aria-required="true"
                whileFocus={{ scale: 1.02 }}
              />
              {Number(formData.height) > 300 && (
                <p className="text-red-500 text-sm mt-1">
                  Height exceeds our database limit. Please consult a doctor.
                </p>
              )}
            </div>
            <div className="space-y-2">
              <label htmlFor="bloodGroup" className={`block text-sm font-medium ${textColor}`}>
                Blood Group:
              </label>
              <motion.div className="relative" whileFocus={{ scale: 1.02 }}>
                <motion.select
                  id="bloodGroup"
                  name="bloodGroup"
                  value={formData.bloodGroup}
                  onChange={handleInputChange}
                  className={`w-full p-4 border rounded-xl ${inputBg} focus:outline-none focus:ring-2 focus:ring-[#0A3D62] dark:focus:ring-[#FDFBFB] transition-all duration-300 appearance-none`}
                  required
                  aria-required="true"
                >
                  <option value="" disabled>Select Blood Group</option>
                  <option value="A+">A+</option>
                  <option value="A- ">A-</option>
                  <option value="B+">B+</option>
                  <option value="B- ">B-</option>
                  <option value="AB+">AB+</option>
                  <option value="AB- ">AB-</option>
                  <option value="O+">O+</option>
                  <option value="O- ">O-</option>
                </motion.select>
                <ChevronDown className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 pointer-events-none" size={20} />
              </motion.div>
            </div>
          </div>

          <div className="space-y-3 relative">
            <label className={`block text-sm font-medium ${textColor}`}>
              Symptoms:
            </label>
            <div className="relative">
              <motion.input
                type="text"
                ref={symptomSearchRef}
                value={symptomSearch}
                onChange={(e) => setSymptomSearch(e.target.value)}
                placeholder="Type to search symptoms..."
                className={`w-full p-4 pr-12 border rounded-xl ${inputBg} focus:outline-none focus:ring-2 focus:ring-[#0A3D62] dark:focus:ring-[#FDFBFB] transition-all duration-300`}
                whileFocus={{ scale: 1.02 }}
              />
              <Search className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
            </div>
            {isFetchingSymptoms && (
              <p className="text-sm text-gray-500">Fetching symptoms...</p>
            )}
            {symptomSuggestions.length > 0 && (
              <motion.ul
                className={`relative z-20 mt-2 border rounded-xl shadow-lg max-h-60 overflow-y-auto ${darkMode ? "bg-[#0A2A43]/80 border-[#FDFBFB]/50" : "bg-gray-50 border-gray-200"}`}
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.2 }}
              >
                {symptomSuggestions.map((sugg, index) => (
                  <motion.li
                    key={index}
                    className={`p-3 cursor-pointer hover:bg-gray-100 dark:hover:bg-[#0A2A43]/70 ${textColor} transition-all duration-200`}
                    onClick={() => addItem(sugg, "symptoms")}
                    whileHover={{ scale: 1.02 }}
                  >
                    {sugg}
                  </motion.li>
                ))}
              </motion.ul>
            )}
            <div className="flex flex-wrap gap-2 mt-2">
              {formData.symptoms.map((symp, index) => (
                <motion.div
                  key={index}
                  className="bg-gray-100 dark:bg-[#0A2A43]/50 px-3 py-1 rounded-xl flex items-center gap-2 border border-gray-200 dark:border-[#FDFBFB]/50"
                  initial={{ scale: 0.8 }}
                  animate={{ scale: 1 }}
                >
                  {symp}
                  <X size={16} className="cursor-pointer" onClick={() => removeItem(symp, "symptoms")} />
                </motion.div>
              ))}
            </div>
          </div>

          <div className="space-y-3 relative">
            <label className={`block text-sm font-medium ${textColor}`}>
              Allergies:
            </label>
            <div className="relative">
              <motion.input
                type="text"
                ref={allergySearchRef}
                value={allergySearch}
                onChange={(e) => setAllergySearch(e.target.value)}
                placeholder="Type to search allergies..."
                className={`w-full p-4 pr-12 border rounded-xl ${inputBg} focus:outline-none focus:ring-2 focus:ring-[#0A3D62] dark:focus:ring-[#FDFBFB] transition-all duration-300`}
                whileFocus={{ scale: 1.02 }}
              />
              <Search className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
            </div>
            {isFetchingAllergies && (
              <p className="text-sm text-gray-500">Fetching allergies...</p>
            )}
            {allergySuggestions.length > 0 && (
              <motion.ul
                className={`relative z-20 mt-2 border rounded-xl shadow-lg max-h-60 overflow-y-auto ${darkMode ? "bg-[#0A2A43]/80 border-[#FDFBFB]/50" : "bg-gray-50 border-gray-200"}`}
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.2 }}
              >
                {allergySuggestions.map((sugg, index) => (
                  <motion.li
                    key={index}
                    className={`p-3 cursor-pointer hover:bg-gray-100 dark:hover:bg-[#0A2A43]/70 ${textColor} transition-all duration-200`}
                    onClick={() => addItem(sugg, "allergies")}
                    whileHover={{ scale: 1.02 }}
                  >
                    {sugg}
                  </motion.li>
                ))}
              </motion.ul>
            )}
            <div className="flex flex-wrap gap-2 mt-2">
              {formData.allergies.map((allg, index) => (
                <motion.div
                  key={index}
                  className="bg-gray-100 dark:bg-[#0A2A43]/50 px-3 py-1 rounded-xl flex items-center gap-2 border border-gray-200 dark:border-[#FDFBFB]/50"
                  initial={{ scale: 0.8 }}
                  animate={{ scale: 1 }}
                >
                  {allg}
                  <X size={16} className="cursor-pointer" onClick={() => removeItem(allg, "allergies")} />
                </motion.div>
              ))}
            </div>
          </div>

          <div className="space-y-2">
            <label htmlFor="medicalHistory" className={`block text-sm font-medium ${textColor}`}>
              Medical History:
            </label>
            <motion.textarea
              id="medicalHistory"
              name="medicalHistory"
              value={formData.medicalHistory}
              onChange={handleInputChange}
              className={`w-full p-4 border rounded-xl ${inputBg} focus:outline-none focus:ring-2 focus:ring-[#0A3D62] dark:focus:ring-[#FDFBFB] transition-all duration-300`}
              rows="4"
              whileFocus={{ scale: 1.02 }}
              aria-label="Medical History"
            ></motion.textarea>
          </div>
          <div className="space-y-2">
            <label htmlFor="currentMedications" className={`block text-sm font-medium ${textColor}`}>
              Current Medications:
            </label>
            <motion.textarea
              id="currentMedications"
              name="currentMedications"
              value={formData.currentMedications}
              onChange={handleInputChange}
              className={`w-full p-4 border rounded-xl ${inputBg} focus:outline-none focus:ring-2 focus:ring-[#0A3D62] dark:focus:ring-[#FDFBFB] transition-all duration-300`}
              rows="4"
              whileFocus={{ scale: 1.02 }}
              aria-label="Current Medications"
            ></motion.textarea>
          </div>
          <motion.button
            type="submit"
            disabled={loading}
            className={`w-full mt-6 bg-[#0A3D62] text-[#FDFBFB] px-6 py-4 rounded-xl font-medium hover:bg-[#08253A] hover:shadow-md transition-all duration-300 disabled:opacity-50 focus:outline-none focus:ring-2 focus:ring-[#0A3D62] dark:focus:ring-[#FDFBFB]`}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.98 }}
          >
            {loading ? "Fetching Suggestions..." : "Get Personalized Suggestions"}
          </motion.button>
        </motion.form>

        <AnimatePresence>
          {suggestions && (
            <motion.div
              className={`mt-10 p-6 sm:p-8 rounded-[40px] shadow-md ${bgColor} border border-gray-200 dark:border-gray-700 transition-all duration-300 hover:shadow-xl`}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -30 }}
              transition={{ duration: 0.6 }}
            >
              <h2 className="text-2xl sm:text-3xl font-bold mb-8 flex items-center gap-3 bg-clip-text text-transparent bg-gradient-to-r from-[#0A3D62] to-blue-500">
                <Pill size={28} /> Personalized Suggestions for {formData.name}
              </h2>
              <div className="mb-10">
                <h3 className="text-xl font-semibold mb-4">Your Provided Information:</h3>
                <ul className="space-y-3">
                  <motion.li
                    className={`p-4 rounded-xl ${darkMode ? "bg-[#0A2A43]/50" : "bg-gray-50"} shadow-sm border border-gray-200 dark:border-[#FDFBFB]/50`}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.1 }}
                  >
                    <strong>Name:</strong> {formData.name}
                  </motion.li>
                  <motion.li
                    className={`p-4 rounded-xl ${darkMode ? "bg-[#0A2A43]/50" : "bg-gray-50"} shadow-sm border border-gray-200 dark:border-[#FDFBFB]/50`}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.2 }}
                  >
                    <strong>Age:</strong> {formData.age || "Not provided"}
                  </motion.li>
                  <motion.li
                    className={`p-4 rounded-xl ${darkMode ? "bg-[#0A2A43]/50" : "bg-gray-50"} shadow-sm border border-gray-200 dark:border-[#FDFBFB]/50`}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.3 }}
                  >
                    <strong>Gender:</strong> {formData.gender || "Not provided"}
                  </motion.li>
                  {formData.gender === "female" && (
                    <motion.li
                      className={`p-4 rounded-xl ${darkMode ? "bg-[#0A2A43]/50" : "bg-gray-50"} shadow-sm border border-gray-200 dark:border-[#FDFBFB]/50`}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.4 }}
                    >
                      <strong>Pregnancy Status:</strong> {isPregnant ? "Pregnant" : "Not Pregnant"}
                    </motion.li>
                  )}
                  {isPregnant && (
                    <motion.li
                      className={`p-4 rounded-xl ${darkMode ? "bg-[#0A2A43]/50" : "bg-gray-50"} shadow-sm border border-gray-200 dark:border-[#FDFBFB]/50`}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.5 }}
                    >
                      <strong>Breastfeeding Status:</strong> {isBreastfeeding ? "Breastfeeding" : "Not Breastfeeding"}
                    </motion.li>
                  )}
                  <motion.li
                    className={`p-4 rounded-xl ${darkMode ? "bg-[#0A2A43]/50" : "bg-gray-50"} shadow-sm border border-gray-200 dark:border-[#FDFBFB]/50`}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.6 }}
                  >
                    <strong>Weight:</strong> {formData.weight ? `${formData.weight} kg` : "Not provided"}
                  </motion.li>
                  <motion.li
                    className={`p-4 rounded-xl ${darkMode ? "bg-[#0A2A43]/50" : "bg-gray-50"} shadow-sm border border-gray-200 dark:border-[#FDFBFB]/50`}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.7 }}
                  >
                    <strong>Height:</strong> {formData.height ? `${formData.height} cm` : "Not provided"}
                  </motion.li>
                  <motion.li
                    className={`p-4 rounded-xl ${darkMode ? "bg-[#0A2A43]/50" : "bg-gray-50"} shadow-sm border border-gray-200 dark:border-[#FDFBFB]/50`}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.8 }}
                  >
                    <strong>Blood Group:</strong> {formData.bloodGroup || "Not provided"}
                  </motion.li>
                  <motion.li
                    className={`p-4 rounded-xl ${darkMode ? "bg-[#0A2A43]/50" : "bg-gray-50"} shadow-sm border border-gray-200 dark:border-[#FDFBFB]/50`}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.9 }}
                  >
                    <strong>Symptoms:</strong> {formData.symptoms.length > 0 ? formData.symptoms.join(", ") : "None selected"}
                  </motion.li>
                  <motion.li
                    className={`p-4 rounded-xl ${darkMode ? "bg-[#0A2A43]/50" : "bg-gray-50"} shadow-sm border border-gray-200 dark:border-[#FDFBFB]/50`}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 1.0 }}
                  >
                    <strong>Allergies:</strong> {formData.allergies.length > 0 ? formData.allergies.join(", ") : "None selected"}
                  </motion.li>
                  <motion.li
                    className={`p-4 rounded-xl ${darkMode ? "bg-[#0A2A43]/50" : "bg-gray-50"} shadow-sm border border-gray-200 dark:border-[#FDFBFB]/50`}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 1.1 }}
                  >
                    <strong>Medical History:</strong> {formData.medicalHistory || "Not provided"}
                  </motion.li>
                  <motion.li
                    className={`p-4 rounded-xl ${darkMode ? "bg-[#0A2A43]/50" : "bg-gray-50"} shadow-sm border border-gray-200 dark:border-[#FDFBFB]/50`}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 1.2 }}
                  >
                    <strong>Current Medications:</strong> {formData.currentMedications || "Not provided"}
                  </motion.li>
                </ul>
              </div>
              <div className="flex items-center mb-8 gap-4 flex-wrap">
                <Globe className="text-[#0A3D62] dark:text-[#FDFBFB]" size={24} />
                <motion.div
                  className="relative"
                  whileFocus={{ scale: 1.02 }}
                >
                  <motion.select
                    value={selectedLanguage}
                    onChange={(e) => {
                      setSelectedLanguage(e.target.value);
                      handleTranslate();
                    }}
                    className={`w-48 p-4 border rounded-xl ${inputBg} focus:outline-none focus:ring-2 focus:ring-[#0A3D62] dark:focus:ring-[#FDFBFB] transition-all duration-300 appearance-none`}
                    aria-label="Select Language"
                  >
                    <option value="" disabled>Select Language</option>
                    {languages.map((lang) => (
                      <option key={lang.code} value={lang.code}>
                        {lang.name}
                      </option>
                    ))}
                  </motion.select>
                  <ChevronDown className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 pointer-events-none" size={20} />
                </motion.div>
                <motion.button
                  onClick={handleTranslate}
                  disabled={isTranslating}
                  className={`bg-[#0A3D62] text-[#FDFBFB] px-5 py-3 rounded-xl font-medium hover:bg-[#08253A] hover:shadow-md transition-all duration-300 disabled:opacity-50 focus:outline-none focus:ring-2 focus:ring-[#0A3D62] dark:focus:ring-[#FDFBFB]`}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.98 }}
                >
                  {isTranslating ? "Translating..." : "Translate"}
                </motion.button>
                <motion.button
                  onClick={() => handleSpeak(getFullText(translatedSuggestions || suggestions))}
                  disabled={isSpeaking}
                  className={`bg-[#0A3D62] text-[#FDFBFB] px-5 py-3 rounded-xl font-medium hover:bg-[#08253A] hover:shadow-md transition-all duration-300 disabled:opacity-50 focus:outline-none focus:ring-2 focus:ring-[#0A3D62] dark:focus:ring-[#FDFBFB] flex items-center gap-2`}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <Volume2 size={20} />
                  {isSpeaking ? "Speaking..." : "Listen"}
                </motion.button>
                {isSpeaking && (
                  <motion.button
                    onClick={handleCancelSpeak}
                    className={`bg-red-500 text-white px-5 py-3 rounded-xl font-medium hover:bg-red-600 hover:shadow-md transition-all duration-300 flex items-center gap-2 focus:outline-none focus:ring-2 focus:ring-red-500`}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <X size={20} />
                    Cancel Listening
                  </motion.button>
                )}
              </div>
              {(translatedSuggestions || suggestions)?.reasoning && (
                <div className="mb-10">
                  <h3 className="text-xl font-semibold mb-4 flex items-center gap-2">
                    <AlertCircle className="text-green-500" size={24} />
                    Reasoning
                  </h3>
                  <motion.p
                    className={`p-4 rounded-xl ${darkMode ? "bg-[#0A2A43]/50" : "bg-gray-50"} shadow-sm border border-gray-200 dark:border-[#FDFBFB]/50`}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3 }}
                  >
                    {(translatedSuggestions || suggestions).reasoning}
                  </motion.p>
                </div>
              )}
              {(translatedSuggestions || suggestions)?.otcMedications?.length > 0 && (
                <div className="space-y-6 mb-10">
                  <h3 className="text-xl font-semibold mb-4 flex items-center gap-2">
                    <Pill className="text-[#0A3D62] dark:text-[#FDFBFB]" size={24} />
                    OTC Medications
                  </h3>
                  {(translatedSuggestions || suggestions).otcMedications.slice(0, 2).map((med, index) => (
                    <MedicineCard
                      key={index}
                      medicine={{
                        name: med.name || "Generic",
                        dosage: med.dosage || "Standard dose",
                        timing: med.timing || "Follow standard guidelines",
                        precautions: med.precautions || "No precautions available",
                        source: med.source || "Available at pharmacies like CVS, Walgreens",
                        image: med.image,
                        description: index === 0 ? "Primary OTC medication for symptom relief" : "Alternative OTC medication for symptom relief",
                        sideEffects: ["Consult a pharmacist for detailed side effects"],
                        brandNames: [med.name || "Generic"],
                      }}
                      title={index === 0 ? "Primary Medication" : "Alternative Medication"}
                    />
                  ))}
                </div>
              )}
              {(translatedSuggestions || suggestions)?.homeRemedies?.length > 0 && (
                <div className="mb-10">
                  <h3 className="text-xl font-semibold mb-4 flex items-center gap-2">
                    <Pill className="text-[#0A3D62] dark:text-[#FDFBFB]" size={24} />
                    Home Remedies / Lifestyle
                  </h3>
                  <ul className="space-y-3">
                    {(translatedSuggestions || suggestions).homeRemedies.map((remedy, index) => (
                      <motion.li
                        key={index}
                        className={`p-4 rounded-xl ${darkMode ? "bg-[#0A2A43]/50" : "bg-gray-50"} shadow-sm border border-gray-200 dark:border-[#FDFBFB]/50 hover:bg-gray-100 dark:hover:bg-[#0A2A43]/70 transition-all duration-300`}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.1 }}
                      >
                        {remedy}
                      </motion.li>
                    ))}
                  </ul>
                </div>
              )}
              {(translatedSuggestions || suggestions)?.warnings?.length > 0 && (
                <div className="mb-10">
                  <h3 className="text-xl font-semibold mb-4 flex items-center gap-2">
                    <AlertCircle className="text-yellow-500" size={24} />
                    Warnings / Avoid
                  </h3>
                  <ul className="space-y-3">
                    {(translatedSuggestions || suggestions).warnings.map((warning, index) => (
                      <motion.li
                        key={index}
                        className={`p-4 rounded-xl bg-yellow-100 dark:bg-yellow-900 text-yellow-600 dark:text-yellow-400 shadow-sm border border-yellow-200 dark:border-yellow-700 hover:bg-yellow-200 dark:hover:bg-yellow-800 transition-all duration-300`}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.1 }}
                      >
                        {warning}
                      </motion.li>
                    ))}
                  </ul>
                </div>
              )}
              {(translatedSuggestions || suggestions)?.duration && (
                <div className="mb-10">
                  <h3 className="text-xl font-semibold mb-4 flex items-center gap-2">
                    <Clock className="text-[#0A3D62] dark:text-[#FDFBFB]" size={24} />
                    Duration Guidance
                  </h3>
                  <motion.p
                    className={`p-4 rounded-xl ${darkMode ? "bg-[#0A2A43]/50" : "bg-gray-50"} shadow-sm border border-gray-200 dark:border-[#FDFBFB]/50`}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3 }}
                  >
                    {(translatedSuggestions || suggestions).duration}
                  </motion.p>
                </div>
              )}
              <div>
                <h3 className="text-xl font-semibold mb-4 flex items-center gap-2">
                  <AlertCircle className="text-red-500" size={24} />
                  Doctor Disclaimer
                </h3>
                <motion.p
                  className={`p-4 rounded-xl bg-red-100 dark:bg-red-900 text-red-600 dark:text-red-400 shadow-sm border border-red-200 dark:border-red-700`}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3 }}
                >
                  {(translatedSuggestions || suggestions).disclaimer || `Dear ${formData.name}, please consult a healthcare professional before taking any medication. This information is for educational purposes only and is not medical advice.`}
                </motion.p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </>
  );
}

function MedicineCard({ medicine, title }) {
  const [isExpanded, setIsExpanded] = useState(false);
  const { darkMode } = useContext(DarkModeContext);
  const textColor = darkMode ? "text-[#FDFBFB]" : "text-[#0A3D62]";

  return (
    <motion.div
      className={`p-6 rounded-[40px] shadow-md overflow-hidden relative border border-gray-200 dark:border-gray-700 transition-all duration-300 hover:shadow-xl ${darkMode ? "bg-[#0A2A43]/80" : "bg-gray-50"}`}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
    >
      <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-br from-[#0A3D62] to-blue-500 transform rotate-45 translate-x-12 -translate-y-12 opacity-10"></div>
      <h4 className={`text-xl font-semibold mb-4 ${textColor}`}>{title}</h4>
      <div className="flex flex-col sm:flex-row items-start gap-6 mb-4">
        <motion.div className="overflow-hidden rounded-[40px]" whileHover={{ scale: 1.05 }}>
          <img
            src={medicine.image}
            alt={medicine?.name}
            loading="lazy"
            className="w-32 h-32 object-contain border border-gray-200 dark:border-[#FDFBFB]/50 shadow-md transition-transform duration-300"
            onError={(e) => {
              e.target.src = "https://images.unsplash.com/photo-1587855726752-62b3629bd00e?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&q=80";
            }}
          />
        </motion.div>
        <div className="flex-1">
          <h5 className={`text-lg font-semibold ${textColor}`}>{medicine?.name}</h5>
          <p className={`text-sm ${textColor} opacity-80 mb-2`}>{medicine?.description}</p>
          <p className={`text-sm ${textColor} mb-2`}>
            <strong>Dosage:</strong> {medicine?.dosage}
          </p>
          <p className={`text-sm ${textColor} mb-2`}>
            <strong>Timing and Administration:</strong> {medicine?.timing}
          </p>
          <p className={`text-sm ${textColor} mb-2`}>
            <strong>Precautions:</strong> {medicine?.precautions}
          </p>
          <p className={`text-sm ${textColor} mb-2`}>
            <strong>Source:</strong> {medicine?.source}
          </p>
        </div>
      </div>
      <motion.div
        initial="collapsed"
        animate={isExpanded ? "expanded" : "collapsed"}
        variants={{
          expanded: { height: "auto", opacity: 1 },
          collapsed: { height: 0, opacity: 0 },
        }}
        transition={{ duration: 0.3 }}
        className="overflow-hidden"
      >
        <h5 className={`font-semibold mt-2 ${textColor} text-sm`}>Side Effects:</h5>
        <ul className={`list-disc list-inside ${textColor} text-sm`}>
          {medicine?.sideEffects?.map((effect, index) => (
            <li key={index}>{effect}</li>
          ))}
        </ul>
        <h5 className={`font-semibold mt-2 ${textColor} text-sm`}>Brand Names:</h5>
        <p className={`${textColor} text-sm`}>{medicine?.brandNames?.join(", ") || "N/A"}</p>
      </motion.div>
      <motion.button
        className={`${textColor} hover:text-[#0A3D62] dark:hover:text-[#FDFBFB] transition-all duration-300 flex items-center text-sm mt-4`}
        onClick={() => setIsExpanded(!isExpanded)}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        aria-expanded={isExpanded}
      >
        {isExpanded ? "Show Less" : "Show More"}
        {isExpanded ? (
          <ChevronUp className="ml-1" size={16} />
        ) : (
          <ChevronDown className="ml-1" size={16} />
        )}
      </motion.button>
    </motion.div>
  );
}

export default MedicineSuggestion;